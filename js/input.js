/* Input layer: every note source (Web MIDI, native bridge, on-screen keys, computer keyboard)
   ends up in BW.input.noteOn / noteOff. The rest of the app only listens here. */
window.BW = window.BW || {};
(function (BW) {
  'use strict';
  var listeners = [], statusListeners = [], curAccess = null, inChannel = 0, offStyle = 0x90;
  var input = BW.input = {
    held: {},                     // midi -> true
    status: { state: 'init', names: [] },   // state: init | unsupported | denied | none | connected
    on: function (fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (f) { return f !== fn; }); }; },
    onStatus: function (fn) { statusListeners.push(fn); },

    noteOn: function (midi, vel, src, timeMs) {
      if (midi < 0 || midi > 127) return;
      input.held[midi] = true;
      if (BW.audio && (src !== 'midi' || BW.settings.userSound)) {
        BW.audio.init();
        BW.audio.noteOn(midi, vel == null ? 0.7 : vel);
      }
      var ev = { type: 'on', midi: midi, vel: vel == null ? 0.7 : vel, src: src || 'touch', time: timeMs || performance.now() };
      listeners.slice().forEach(function (f) { f(ev); });
    },
    noteOff: function (midi, src) {
      delete input.held[midi];
      if (BW.audio) BW.audio.noteOff(midi);
      var ev = { type: 'off', midi: midi, src: src || 'touch', time: performance.now() };
      listeners.slice().forEach(function (f) { f(ev); });
    },
    /* raw MIDI bytes; also the entry point for a future native (CoreMIDI) bridge */
    midiMessage: function (status, d1, d2, timeMs) {
      var cmd = status & 0xf0;
      if (cmd === 0x90 && d2 > 0) inChannel = status & 0x0f;
      if (cmd === 0x80) offStyle = 0x80; else if (cmd === 0x90 && d2 === 0) offStyle = 0x90;
      // keyboards with MIDI thru/echo send our own output straight back: ignore those
      if ((cmd === 0x90 || cmd === 0x80) && BW.midiOut && BW.midiOut.isEcho(d1, cmd === 0x90 && d2 > 0)) return;
      if (cmd === 0x90 && d2 > 0) input.noteOn(d1, Math.pow(d2 / 127, 0.8), 'midi', timeMs);
      else if (cmd === 0x80 || (cmd === 0x90 && d2 === 0)) input.noteOff(d1, 'midi');
    },
    init: function () {
      if (!navigator.requestMIDIAccess) { setStatus('unsupported', []); return; }
      if (curAccess) { try { curAccess.onstatechange = null; curAccess.inputs.forEach(function (i) { i.onmidimessage = null; }); } catch (e) { /* ignore */ } }
      navigator.requestMIDIAccess({ sysex: false }).then(function (access) {
        curAccess = access;
        function hook() {
          var names = [];
          access.inputs.forEach(function (inp) {
            names.push(inp.name || 'MIDI');
            inp.onmidimessage = function (e) {
              var d = e.data; if (!d || d.length < 2) return;
              // Some iOS MIDI browsers deliver timeStamp on another clock (or 0): only trust it
              // when it is close to performance.now(), otherwise timing would be judged wrongly.
              var now = performance.now(), ts = e.timeStamp;
              if (!(ts > 0) || Math.abs(now - ts) > 250) ts = now;
              input.midiMessage(d[0], d[1], d.length > 2 ? d[2] : 0, ts);
            };
          });
          var outs = [];
          access.outputs.forEach(function (o) { outs.push({ id: o.id, name: o.name || 'MIDI', port: o }); });
          out.ports = outs;
          setStatus(names.length ? 'connected' : 'none', names);
        }
        access.onstatechange = hook;
        hook();
      }, function () { setStatus('denied', []); });
    },
    retry: function () { input.init(); }
  };
  /* ---------- MIDI out: let the app play on the user's own keyboard ----------
     Timing is NOT done with JavaScript timers. Every message is handed to the MIDI system ahead of
     time with a timestamp (send(data, timestamp)); the system (CoreMIDI on iOS, the browser on a
     computer) releases it at exactly that moment. A busy screen can therefore neither delay nor
     bunch up notes. Rules:
     - one MIDI message per send(), and no two messages share a moment: each gets its own time
       slot, gapMs() apart, so cheap USB-MIDI cables never get two messages in one transfer
     - only the next HORIZON ms are handed over, so stopping takes effect quickly
     - a note-off only ends the note-on it belongs to (tokens); a re-struck key first gets a note-off
     - note-off is a real Note Off (8n, velocity 64)
     - a note-on whose slot would be more than LATE_MS late is skipped together with its note-off
     - on stop: scheduled messages are flushed (clear()), every used key gets a note-off, then
       sustain off and All Notes Off */
  var events = [], evTimer = null, nextSlot = 0, sounding = {}, sent = {}, tok = 0, used = {};
  var MIN_NOTE_MS = 60, LATE_MS = 60, HORIZON = 120, TICK = 20;
  function gapMs() { var g = +BW.settings.midiOutGap; return g >= 1 && g <= 20 ? g : 5; }
  function slotFor(at) { return Math.max(at, nextSlot, performance.now() + 1); }
  function sendAt(bytes, ts, port) {
    var p = port || out.port(); if (!p) return;
    nextSlot = Math.max(nextSlot, ts + gapMs());
    try { p.send(bytes, ts); }
    catch (e) { out.lastError = String(e && e.message || e); }
    var c = bytes[0] & 0xf0;
    if (c === 0x90 || c === 0x80) sent[bytes[1] + ((c === 0x90 && bytes[2] > 0) ? 'on' : 'off')] = ts;
  }
  function msgOn(m, v) { return [0x90 | out.channel(), m, v]; }
  function msgOff(m) { return [0x80 | out.channel(), m, 64]; }
  function flush() {
    var limit = performance.now() + HORIZON;
    events.sort(function (x, y) { return x.at - y.at || (x.on ? 1 : 0) - (y.on ? 1 : 0); });
    while (events.length && events[0].at <= limit) {
      var e = events.shift(), ts = slotFor(e.at);
      if (e.on) {
        if (ts - e.at > LATE_MS) continue;                       // too late: skip (its note-off finds no token)
        if (sounding[e.m] != null) { sendAt(msgOff(e.m), ts); ts = slotFor(e.at); }   // re-strike
        sounding[e.m] = e.tok; used[e.m] = 1;
        sendAt(msgOn(e.m, e.v), ts);
      } else if (sounding[e.m] === e.tok) {                      // only end our own note
        delete sounding[e.m];
        sendAt(msgOff(e.m), ts);
      }
    }
    if (!events.length && evTimer) { clearInterval(evTimer); evTimer = null; }
  }
  function reset() {
    events = []; if (evTimer) { clearInterval(evTimer); evTimer = null; }
    var p = out.port();
    if (p && typeof p.clear === 'function') { try { p.clear(); } catch (e) { /* not supported */ } }
  }
  var out = BW.midiOut = {
    ports: [],
    port: function () {
      var id = BW.settings.midiOutId, ps = out.ports;
      if (!ps.length) return null;
      for (var i = 0; i < ps.length; i++) if (ps[i].id === id) return ps[i].port;
      return out.guess().port;
    },
    /* default output: the one named like the connected input, never a network/bluetooth session */
    guess: function () {
      var ps = out.ports, ins = (input.status.names || []).map(function (n) { return String(n).toLowerCase(); });
      var real = ps.filter(function (o) { return !/network|session|netwerk|bluetooth|iac/i.test(o.name); });
      var same = real.filter(function (o) { return ins.indexOf(String(o.name).toLowerCase()) >= 0; });
      return same[0] || real[0] || ps[0];
    },
    channel: function () { var c = BW.settings.midiOutChannel; return c >= 1 && c <= 16 ? c - 1 : inChannel; },
    active: function () { return !!(BW.settings.midiOutPlay && out.port()); },
    lastError: '',
    raw: function (bytes) { if (!out.port()) return false; sendAt(bytes, slotFor(0)); return true; },
    /* a note at performance.now()-time onMs, lasting durMs */
    note: function (midi, vel, onMs, durMs) {
      var k = ++tok;
      events.push({ at: onMs, on: true, m: midi, v: BW.clamp(Math.round(vel * 127), 1, 127), tok: k });
      events.push({ at: onMs + Math.max(MIN_NOTE_MS, durMs), on: false, m: midi, tok: k });
      if (!evTimer) evTimer = setInterval(flush, TICK);
      flush();
    },
    allOff: function () {
      reset();
      if (!out.port()) { sounding = {}; used = {}; return; }
      // every key played since the last stop gets a note-off, after everything already handed over
      Object.keys(used).forEach(function (m) { sendAt(msgOff(+m), slotFor(0)); });
      sounding = {}; used = {};
      sendAt([0xB0 | out.channel(), 64, 0], slotFor(0));     // sustain off
      sendAt([0xB0 | out.channel(), 123, 0], slotFor(0));    // All Notes Off
    },
    /* emergency: note-off for all 88 keys plus All Notes Off */
    panic: function () {
      reset(); sounding = {}; used = {};
      if (!out.port()) return false;
      sendAt([0xB0 | out.channel(), 123, 0], slotFor(0));
      sendAt([0xB0 | out.channel(), 64, 0], slotFor(0));
      for (var m = 21; m <= 108; m++) sendAt(msgOff(m), slotFor(0));
      return true;
    },
    isEcho: function (midi, isOn) {
      var t = sent[midi + (isOn ? 'on' : 'off')];
      return t != null && Math.abs(performance.now() - t) < 80;
    },
    pending: function () { return { events: events.length, outbox: 0, sounding: Object.keys(sounding).length }; },
    test: function () {                         // C-E-G-C up, crushed third, C7 chord
      var t = performance.now() + 60, seq = [[60, 0], [64, 180], [67, 360], [72, 540], [63, 760], [64, 790], [55, 1000], [60, 1000], [64, 1000], [70, 1000]];
      out.lastError = '';
      seq.forEach(function (x) { out.note(x[0], 0.75, t + x[1], x[1] >= 1000 ? 900 : (x[0] === 63 ? 30 : 170)); });
      return !!out.port();
    },
    /* stress test with the current spacing: a held five-note chord, then eight short repeated
       chords (re-strikes) and a fast repeated note, all of which must start and stop cleanly */
    chordTest: function (cb) {
      if (!out.port()) return false;
      out.lastError = '';
      var t = performance.now() + 60, c7 = [48, 52, 55, 58, 60], stab = [64, 67, 70, 72];
      c7.forEach(function (m) { out.note(m, 0.75, t, 900); });
      for (var i = 0; i < 8; i++) stab.forEach(function (m) { out.note(m, 0.7, t + 1100 + i * 160, 90); });
      for (var j = 0; j < 8; j++) out.note(60, 0.7, t + 2500 + j * 110, 80);
      if (cb) { cb('chord'); setTimeout(function () { cb('stabs'); }, 1160); setTimeout(function () { cb('repeat'); }, 2560); setTimeout(function () { cb(''); }, 3600); }
      return true;
    },
    /* play C-E-G on every output in turn, on channel 1 and on the keyboard's channel; cb(name, i) per port */
    testAll: function (cb) {
      out.lastError = '';
      var t0 = performance.now() + 60;
      out.ports.forEach(function (o, i) {
        setTimeout(function () { if (cb) cb(o.name, i); }, i * 1400);
        var chans = [0]; if (inChannel && chans.indexOf(inChannel) < 0) chans.push(inChannel);
        [60, 64, 67].forEach(function (m, k) {
          chans.forEach(function (c, ci) {
            var t = t0 + i * 1400 + k * 220 + ci * 10;
            try { o.port.send([0x90 | c, m, 100], t); o.port.send([0x80 | c, m, 64], t + 200); }
            catch (e) { out.lastError = String(e && e.message || e); }
          });
        });
      });
      return out.ports.length;
    },
    info: function () { return { outputs: out.ports.map(function (o) { return o.name; }), inputs: input.status.names, inChannel: inChannel + 1, sendChannel: out.channel() + 1, keyboardOff: offStyle === 0x80 ? '8n' : '9n v0' }; }
  };

  function setStatus(state, names) {
    input.status = { state: state, names: names };
    statusListeners.forEach(function (f) { f(input.status); });
  }
  /* hooks for a native wrapper (route B): window.BWMidiIn(status, data1, data2) */
  window.BWMidiIn = function (s, a, b) { if (input.status.state !== 'connected') setStatus('connected', ['Native MIDI']); input.midiMessage(s, a, b); };

  /* computer keyboard for desktop testing: A W S E D F T G Y H U J K = C4..C5, Z/X octave down/up */
  var KEYMAP = { a: 0, w: 1, s: 2, e: 3, d: 4, f: 5, t: 6, g: 7, y: 8, h: 9, u: 10, j: 11, k: 12, o: 13, l: 14, p: 15 };
  var kbOct = 60, down = {};
  window.addEventListener('keydown', function (e) {
    if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    var k = e.key.toLowerCase();
    if (k === 'z') { kbOct = Math.max(24, kbOct - 12); return; }
    if (k === 'x') { kbOct = Math.min(96, kbOct + 12); return; }
    if (k in KEYMAP && !(k in down)) { down[k] = kbOct + KEYMAP[k]; input.noteOn(down[k], 0.7, 'keys'); }
  });
  window.addEventListener('blur', function () {
    Object.keys(down).forEach(function (k) { input.noteOff(down[k], 'keys'); delete down[k]; });
  });
  window.addEventListener('keyup', function (e) {
    var k = e.key.toLowerCase();
    if (k in down) { input.noteOff(down[k], 'keys'); delete down[k]; }
  });
})(window.BW);
