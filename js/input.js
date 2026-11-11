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
     Rules learned the hard way with iOS MIDI browsers (Web MIDI Browser):
     - exactly ONE MIDI message per send(); several messages in one send() lose all but the first
     - messages sent in the same instant can get lost: every send() is paced a few ms apart
     - a note-off may only end the note-on it belongs to (tokens), otherwise a repeated note that
       overlaps its predecessor gets cut off by the predecessor's late note-off
     - note-off is written the way the keyboard itself writes it (9n vel 0 or 8n), default 9n vel 0
     - note-ons go out before plain note-offs that are due at the same moment, so chords stay tight */
  var events = [], evTimer = null, outbox = [], lowbox = [], pacing = false, lastSend = 0, sounding = {}, sent = {}, tok = 0;
  var mc = window.MessageChannel ? new MessageChannel() : null;
  function gapMs() { var g = +BW.settings.midiOutGap; return g >= 0 && g <= 20 ? g : 5; }
  function kick() {
    if (pacing) return;
    pacing = true;
    pace();
  }
  function pace() {
    var now = performance.now(), wait = gapMs() - (now - lastSend);
    if ((outbox.length || lowbox.length) && wait <= 0) {
      var m = outbox.length ? outbox.shift() : lowbox.shift();   // note-ons first, plain note-offs when there is room
      sendNow(m.b, m.port);
      lastSend = performance.now();
      wait = gapMs();
    }
    if (!outbox.length && !lowbox.length) { pacing = false; return; }
    if (wait >= 4 || !mc) setTimeout(pace, Math.max(1, wait - 1));
    else mc.port2.postMessage(0);               // short waits: spin without the 4 ms timer clamp
  }
  if (mc) mc.port1.onmessage = pace;
  function sendNow(bytes, port) {
    var p = port || out.port(); if (!p) return;
    try { if (p.open && p.connection !== 'open') p.open(); p.send(bytes); }
    catch (e) { out.lastError = String(e && e.message || e); }
    var c = bytes[0] & 0xf0;
    if (c === 0x90 || c === 0x80) sent[bytes[1] + ((c === 0x90 && bytes[2] > 0) ? 'on' : 'off')] = performance.now();
  }
  function msgOn(m, v) { return [0x90 | out.channel(), m, v]; }
  function msgOff(m) { return offStyle === 0x80 ? [0x80 | out.channel(), m, 64] : [0x90 | out.channel(), m, 0]; }
  function enqueue(bytes, port, low) { (low ? lowbox : outbox).push({ b: bytes, port: port }); kick(); }
  function isOffFor(x, m) { var c = x.b[0] & 0xf0; return x.b[1] === m && (c === 0x80 || (c === 0x90 && x.b[2] === 0)); }
  function schedule() {
    var now = performance.now(), ons = [], offs = [];
    events.sort(function (x, y) { return x.at - y.at; });
    while (events.length && events[0].at <= now) {
      var e = events.shift();
      if (e.on) {
        if (sounding[e.m] != null) ons.push(msgOff(e.m));       // re-strike: end the old note first
        sounding[e.m] = e.tok;
        ons.push(msgOn(e.m, e.v));
      } else if (sounding[e.m] === e.tok) {                      // only end our own note
        delete sounding[e.m];
        offs.push(msgOff(e.m));
      }
    }
    ons.forEach(function (b) {
      // a plain note-off for this key still waiting in the slow lane must go out before the new note-on
      var c = b[0] & 0xf0;
      if (c === 0x90 && b[2] > 0 && lowbox.some(function (x) { return isOffFor(x, b[1]); })) {
        lowbox = lowbox.filter(function (x) { return !isOffFor(x, b[1]); });
        enqueue(msgOff(b[1]));
      }
      enqueue(b);
    });
    offs.forEach(function (b) { enqueue(b, null, true); });
    if (!events.length && evTimer) { clearInterval(evTimer); evTimer = null; }
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
    raw: function (bytes) { if (!out.port()) return false; enqueue(bytes); return true; },
    /* a note at performance.now()-time onMs, lasting durMs */
    note: function (midi, vel, onMs, durMs) {
      var k = ++tok;
      events.push({ at: onMs, on: true, m: midi, v: BW.clamp(Math.round(vel * 127), 1, 127), tok: k });
      events.push({ at: onMs + Math.max(30, durMs), on: false, m: midi, tok: k });
      if (!evTimer) evTimer = setInterval(schedule, 4);
      schedule();
    },
    allOff: function () {
      events = []; if (evTimer) { clearInterval(evTimer); evTimer = null; }
      outbox = outbox.filter(function (x) { var c = x.b[0] & 0xf0; return !(c === 0x90 && x.b[2] > 0); });   // drop pending note-ons
      outbox = outbox.concat(lowbox); lowbox = [];          // waiting note-offs must still go out
      Object.keys(sounding).forEach(function (m) { enqueue(msgOff(+m)); });
      sounding = {};
      if (out.port()) enqueue([0xB0 | out.channel(), 64, 0]);    // sustain off (we never press it, but be safe)
    },
    isEcho: function (midi, isOn) {
      var t = sent[midi + (isOn ? 'on' : 'off')];
      return t != null && performance.now() - t < 60;
    },
    pending: function () { return { events: events.length, outbox: outbox.length + lowbox.length, sounding: Object.keys(sounding).length }; },
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
      out.ports.forEach(function (o, i) {
        setTimeout(function () {
          if (cb) cb(o.name, i);
          var chans = [0]; if (inChannel && chans.indexOf(inChannel) < 0) chans.push(inChannel);
          [60, 64, 67].forEach(function (m, k) {
            chans.forEach(function (c, ci) {
              setTimeout(function () { enqueue([0x90 | c, m, 100], o.port); }, k * 220 + ci * 10);
              setTimeout(function () { enqueue([0x90 | c, m, 0], o.port); }, k * 220 + 200 + ci * 10);
            });
          });
        }, i * 1400);
      });
      return out.ports.length;
    },
    info: function () { return { outputs: out.ports.map(function (o) { return o.name; }), inputs: input.status.names, inChannel: inChannel + 1, sendChannel: out.channel() + 1, offStyle: offStyle === 0x80 ? '8n' : '9n v0' }; }
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
