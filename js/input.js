/* Input layer: every note source (Web MIDI, native bridge, on-screen keys, computer keyboard)
   ends up in BW.input.noteOn / noteOff. The rest of the app only listens here. */
window.BW = window.BW || {};
(function (BW) {
  'use strict';
  var listeners = [], statusListeners = [], curAccess = null;
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
          setStatus(names.length ? 'connected' : 'none', names);
        }
        access.onstatechange = hook;
        hook();
      }, function () { setStatus('denied', []); });
    },
    retry: function () { input.init(); }
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
