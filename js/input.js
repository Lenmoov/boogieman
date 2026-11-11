/* Input layer: every note source (Web MIDI, native bridge, on-screen keys, computer keyboard)
   ends up in BW.input.noteOn / noteOff. The rest of the app only listens here. */
window.BW = window.BW || {};
(function (BW) {
  'use strict';
  var listeners = [], statusListeners = [], curAccess = null, inChannel = 0;
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
  /* ---------- MIDI out: let the app play on the user's own keyboard ---------- */
  var queue = [], qTimer = null, sounding = {}, sent = {};
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
    raw: function (bytes, port) {
      var p = port || out.port(); if (!p) return false;
      if ((bytes[0] & 0xf0) !== 0xf0) bytes = [(bytes[0] & 0xf0) | out.channel()].concat(bytes.slice(1));
      try { if (p.open && p.connection !== 'open') p.open(); p.send(bytes); return true; }
      catch (e) { out.lastError = String(e && e.message || e); return false; }
    },
    /* schedule a note at performance.now()-time onMs for durMs; dispatched by our own timer so it
       works even where send(data, timestamp) is not honoured */
    note: function (midi, vel, onMs, durMs) {
      queue.push({ at: onMs, b: [0x90, midi, BW.clamp(Math.round(vel * 127), 1, 127)], m: midi, on: true });
      queue.push({ at: onMs + Math.max(30, durMs), b: [0x80, midi, 0], m: midi, on: false });
      if (!qTimer) qTimer = setInterval(function () { pump(); }, 4);
      pump();
    },
    allOff: function () {
      queue = []; if (qTimer) { clearInterval(qTimer); qTimer = null; }
      Object.keys(sounding).forEach(function (m) { out.raw([0x80, +m, 0]); });
      sounding = {};
      out.raw([0xB0, 123, 0]);                   // all notes off
    },
    isEcho: function (midi, isOn) {
      var t = sent[midi + (isOn ? 'on' : 'off')];
      return t != null && performance.now() - t < 60;
    },
    test: function () {                         // C-E-G-C up, crushed third, C7 chord
      var t = performance.now() + 60, seq = [[60, 0], [64, 180], [67, 360], [72, 540], [63, 760], [64, 790], [55, 1000], [60, 1000], [64, 1000], [70, 1000]];
      out.lastError = '';
      seq.forEach(function (x) { out.note(x[0], 0.75, t + x[1], x[1] >= 1000 ? 900 : (x[0] === 63 ? 30 : 170)); });
      return !!out.port();
    },
    /* chord C-E-G-Bb-C sent twice: A in one packet, B spread out; cb('A'|'B') */
    chordTest: function (cb) {
      var p = out.port(); if (!p) return false;
      var notes = [48, 52, 55, 58, 60];
      function play(mode) {
        var on = [], off = [];
        notes.forEach(function (m) { on.push(chan([0x90, m, 96])); off.push(chan([0x80, m, 0])); });
        if (mode === 'batch') { p.send([].concat.apply([], on)); setTimeout(function () { p.send([].concat.apply([], off)); }, 900); }
        else on.forEach(function (b, i) { setTimeout(function () { p.send(b); }, i * 6); setTimeout(function () { p.send(off[i]); }, 900 + i * 6); });
      }
      try { if (p.open && p.connection !== 'open') p.open(); } catch (e) { /* ignore */ }
      if (cb) cb('A'); play('batch');
      setTimeout(function () { if (cb) cb('B'); play('spread'); }, 1600);
      setTimeout(function () { if (cb) cb(''); }, 2700);
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
            setTimeout(function () { chans.forEach(function (c) { try { if (o.port.open && o.port.connection !== 'open') o.port.open(); o.port.send([0x90 | c, m, 100]); } catch (e) { out.lastError = String(e && e.message || e); } }); }, k * 220);
            setTimeout(function () { chans.forEach(function (c) { try { o.port.send([0x80 | c, m, 0]); } catch (e) { /* ignore */ } }); }, k * 220 + 200);
          });
        }, i * 1400);
      });
      return out.ports.length;
    },
    info: function () { return { outputs: out.ports.map(function (o) { return o.name; }), inputs: input.status.names, inChannel: inChannel + 1, sendChannel: out.channel() + 1 }; }
  };
  /* Some iOS MIDI browsers lose messages when several are sent in the same instant (a chord then
     sounds as one note). Two delivery modes:
       batch  - everything that is due goes out in ONE send() (several MIDI messages in one packet)
       spread - one message per timer tick (about 4 ms apart), each in its own send() */
  function chan(b) { return (b[0] & 0xf0) === 0xf0 ? b : [(b[0] & 0xf0) | out.channel()].concat(b.slice(1)); }
  function pump(forceMode) {
    var now = performance.now(), mode = forceMode || BW.settings.midiOutMode || 'batch', bytes = [], n = 0;
    queue.sort(function (a, b) { return a.at - b.at || (a.on ? 1 : 0) - (b.on ? 1 : 0); });   // note-offs first
    while (queue.length && queue[0].at <= now) {
      var q = queue.shift(), msgs = [];
      if (q.on) { if (sounding[q.m]) msgs.push([0x80, q.m, 0]); sounding[q.m] = 1; }
      else if (!sounding[q.m]) continue;
      else delete sounding[q.m];
      msgs.push(q.b);
      sent[q.m + (q.on ? 'on' : 'off')] = now;
      msgs.forEach(function (m) { bytes = bytes.concat(chan(m)); });
      n++;
      if (mode === 'spread') break;
    }
    if (bytes.length) {
      var p = q && q.port || out.port();
      try { if (p.open && p.connection !== 'open') p.open(); p.send(bytes); } catch (e) { out.lastError = String(e && e.message || e); }
    }
    if (!queue.length && qTimer) { clearInterval(qTimer); qTimer = null; }
  }

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
