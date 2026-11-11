/* audio.js - Web Audio sound engine for the boogie-woogie course.
   Everything is synthesized (piano, drums, bass, metronome); no samples, no network.
   Plain script: exposes BW.audio. Every public call is a safe no-op before init(). */
window.BW = window.BW || {};
(function () {
  'use strict';

  var ctx = null, buses = null, noiseBuf = null, bassWv = null;
  var pianoWaves = [], pans = {};
  var voices = new Set();   // every scheduled/active voice (registry for stopAll + cleanup)
  var live = {};            // midi -> voice held via noteOn
  var MAX_PIANO = 40;       // sounding piano voices before the oldest is stolen (older iPads)
  // User-facing levels (0..1) and internal trims that set the default balance:
  // piano up front, drums/bass/click clearly in the background.
  var levels = { master: 0.85, piano: 0.8, user: 0.85, drums: 0.7, bass: 0.75, click: 0.7 };
  var trims = { master: 1, piano: 1, user: 1, drums: 0.95, bass: 0.62, click: 0.6 };
  var api = { ctx: null, ready: false };

  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function num(x, d) { x = Number(x); return isFinite(x) ? x : d; }
  function mtof(m) { return 440 * Math.pow(2, (m - 69) / 12); }
  function midiOf(x) { return clamp(Math.round(num(x, NaN)), 12, 120); } // NaN stays NaN
  // Scheduling time: past/undefined/invalid -> now.
  function T(time) { var n = ctx.currentTime; time = Number(time); return isFinite(time) && time > n ? time : n; }
  function safe(fn) {
    return function () {
      try { return fn.apply(null, arguments); } catch (e) { if (window.console) console.warn('BW.audio:', e); }
    };
  }
  function guard(fn) { return safe(function () { if (api.ready) return fn.apply(null, arguments); }); }
  function resume() {
    try { var p = ctx.resume(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
  }

  /* ---------- graph ---------- */

  // Small room: stereo decaying noise, with damping that grows over time (highs die first).
  function impulse(sec) {
    var sr = ctx.sampleRate, len = Math.floor(sr * sec), pre = Math.floor(sr * 0.012);
    var buf = ctx.createBuffer(2, len, sr);
    for (var c = 0; c < 2; c++) {
      var d = buf.getChannelData(c), lp = 0;
      for (var i = pre; i < len; i++) {
        var x = (i - pre) / sr;
        lp += (Math.random() * 2 - 1 - lp) * (0.6 - 0.45 * x / sec); // one-pole lowpass
        d[i] = lp * Math.exp(-6.9 * x / (sec - 0.012));             // -60 dB at the end
      }
    }
    return buf;
  }

  function applyLevel(bus, immediate) {
    var p = buses[bus].gain, target = levels[bus] * trims[bus], n = ctx.currentTime;
    if (immediate) { p.value = target; return; }
    p.cancelScheduledValues(n); p.setValueAtTime(p.value, n); p.setTargetAtTime(target, n, 0.03);
  }

  function build() {
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -12; comp.knee.value = 10; comp.ratio.value = 4;
    comp.attack.value = 0.003; comp.release.value = 0.25;
    var master = ctx.createGain();
    comp.connect(master); master.connect(ctx.destination);
    buses = { master: master };
    ['piano', 'user', 'drums', 'bass', 'click'].forEach(function (n) {
      var g = ctx.createGain(); g.connect(comp); buses[n] = g;
    });
    // One shared white-noise buffer (2 s) for hammers, brushes and cymbals.
    var sr = ctx.sampleRate;
    noiseBuf = ctx.createBuffer(1, sr * 2, sr);
    var d = noiseBuf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    // Shared room reverb (post-fader sends): piano/user, plus a little on drums.
    var rev = ctx.createConvolver(), send = ctx.createGain(), dsend = ctx.createGain();
    rev.buffer = impulse(1.2); send.gain.value = 0.14; dsend.gain.value = 0.35;
    buses.piano.connect(send); buses.user.connect(send);
    buses.drums.connect(dsend); dsend.connect(send);
    send.connect(rev); rev.connect(comp);
    Object.keys(levels).forEach(function (b) { applyLevel(b, true); });
  }

  /* ---------- waveforms (cached) ---------- */

  // Piano partials: 1/h^p rolloff shaped by a hammer strike point at ~1/7.3 of the string
  // (dips around the 7th partial). Bass bands: more, brighter partials; treble: fewer, mellower.
  function pianoWave(b) {
    if (pianoWaves[b]) return pianoWaves[b];
    var k = b / 7, n = Math.round(24 - 16 * k), p = 0.8 + 0.9 * k, x = 1 / 7.3;
    var re = new Float32Array(n + 1), im = new Float32Array(n + 1);
    for (var h = 1; h <= n; h++) im[h] = Math.pow(h, -p) * (0.35 + 0.65 * Math.abs(Math.sin(Math.PI * h * x)));
    im[1] *= 1 + 0.8 * k; // fundamental dominates in the treble
    return (pianoWaves[b] = ctx.createPeriodicWave(re, im));
  }
  // Upright bass: strong 2nd harmonic, fast rolloff.
  function bassWave() {
    if (bassWv) return bassWv;
    var a = [0, 1, 0.6, 0.32, 0.22, 0.12, 0.08, 0.05, 0.035, 0.02, 0.012];
    return (bassWv = ctx.createPeriodicWave(new Float32Array(a.length), new Float32Array(a)));
  }
  // Shared stereo panner per bus and pitch band (saves a node per voice).
  function panOut(bus, b) {
    var key = bus + b;
    if (!pans[key]) {
      if (ctx.createStereoPanner) {
        var p = ctx.createStereoPanner(); p.pan.value = (b - 3.5) / 3.5 * 0.3;
        p.connect(buses[bus]); pans[key] = p;
      } else pans[key] = buses[bus];
    }
    return pans[key];
  }

  /* ---------- voice plumbing ---------- */

  // A voice owns its nodes; `out` is the gain stopAll fades. valAt(t) (optional) returns the
  // out-gain value at time t so fades start exactly where the envelope is (no clicks).
  function mkVoice(bus, t, end, level) {
    var out = ctx.createGain(); out.gain.value = level; out.connect(buses[bus]);
    return { bus: bus, t0: t, end: end, out: out, level: level, srcs: [], nodes: [out] };
  }
  function node(v, n) { v.nodes.push(n); return n; }
  function gainN(v, val) { var g = node(v, ctx.createGain()); g.gain.value = val || 0; return g; }
  function filt(v, type, f, q) {
    var b = node(v, ctx.createBiquadFilter()); b.type = type; b.frequency.value = f; b.Q.value = q; return b;
  }
  function oscN(v, w, f, det) {
    var o = node(v, ctx.createOscillator());
    if (typeof w === 'string') o.type = w; else o.setPeriodicWave(w);
    o.frequency.value = f; if (det) o.detune.value = det;
    return o;
  }
  function noiseN(v) {
    var s = node(v, ctx.createBufferSource()); s.buffer = noiseBuf; s._off = Math.random() * 1.5; return s;
  }
  function run(v, s, t, stop) {
    if (s._off != null) s.start(t, s._off); else s.start(t);
    s.stop(stop); s._end = stop; v.srcs.push(s);
  }
  function perc(p, t, peak, att, tau) {
    p.setValueAtTime(0, t); p.linearRampToValueAtTime(peak, t + att); p.setTargetAtTime(0, t + att, tau);
  }
  function commit(v, main) {
    main.onended = function () { cleanup(v); };
    voices.add(v); housekeep(v);
    return v;
  }
  function cleanup(v) {
    if (v.gone) return; v.gone = true;
    voices.delete(v);
    v.nodes.forEach(function (n) { try { n.disconnect(); } catch (e) {} });
    if (v.m != null && live[v.m] === v) delete live[v.m];
  }
  // Prune voices whose onended never fired, and steal the oldest piano voice when overloaded.
  function housekeep(v) {
    var n = ctx.currentTime, count = 0, oldest = null;
    voices.forEach(function (x) {
      if (x.end < n - 1) return cleanup(x);
      if (x.piano && !x.dead && x.t0 <= n && x.end > n) { count++; if (!oldest && x !== v) oldest = x; }
    });
    if (count > MAX_PIANO && oldest) kill(oldest, n, 0.02);
  }
  function stopSrcs(v, t) {
    v.srcs.forEach(function (s) { if (t < s._end) { try { s.stop(t); s._end = t; } catch (e) {} } });
    v.end = Math.min(v.end, t);
  }
  // Fast click-free fade + stop (works for voices that have not started yet: their gain stays 0).
  function kill(v, t, fade) {
    if (v.dead) return; v.dead = true;
    var p = v.out.gain, cur = v.valAt ? v.valAt(t) : v.level;
    p.cancelScheduledValues(t); p.setValueAtTime(cur, t); p.linearRampToValueAtTime(0, t + fade);
    stopSrcs(v, t + fade + 0.01);
  }
  // Piano key release (damper): exponential fade from the current envelope value.
  function release(v, t, tau) {
    if (v.dead || v.rel) return;
    var p = v.out.gain, v0 = v.valAt(t);
    p.cancelScheduledValues(t); p.setValueAtTime(v0, t); p.setTargetAtTime(0, t, tau);
    v.rel = { t: t, tau: tau, v0: v0 };
    stopSrcs(v, t + tau * 6);
  }

  /* ---------- piano ---------- */

  // dur == null -> held (live) voice, ends on release() or after its natural decay.
  // Per voice: 2 detuned oscillators + hammer noise (src, bandpass, gain) -> lowpass -> amp
  // -> shared panner. 7 nodes.
  function synthVoice(m, t, dur, vel, bus) {
    var f = mtof(m), k = clamp((m - 24) / 84, 0, 1), b = clamp(Math.floor((m - 24) / 12), 0, 7);
    var w = pianoWave(b), st = (m - 60) * 0.05;   // gentle stretch tuning (cents)
    var d = 2.5 + Math.random() * 3;              // honky-tonk detune between the 2 "strings"
    var P = 0.1 * Math.pow(Math.max(vel, 0.03), 1.4) * (m < 36 ? 0.85 : 1);
    var att = 0.002 + 0.002 * (1 - vel), t1 = t + att;
    var tau1 = 0.07 + 0.08 * (1 - k), S = P * (0.5 - 0.2 * k);  // fast initial decay to S
    var t2 = t1 + 0.3, tau2 = 6 * Math.pow(1 / 6, k);           // slow decay: 6 s bass .. 1 s treble
    var v2 = S + (P - S) * Math.exp(-0.3 / tau1);
    var relTau = m >= 89 ? 0.3 : 0.04;            // ~120 ms release; top keys have no dampers
    var endNat = t2 + tau2 * 6.5;                 // ~-56 dB: inaudible, free the voice
    var tr = dur == null ? Infinity : t + dur;
    var env = function (x) {                      // analytic copy of the amp automation below
      if (x <= t) return 0;
      if (x < t1) return P * (x - t) / att;
      if (x < t2) return S + (P - S) * Math.exp(-(x - t1) / tau1);
      return v2 * Math.exp(-(x - t2) / tau2);
    };
    var v = { bus: bus, t0: t, end: Math.min(endNat, tr + relTau * 6), srcs: [], nodes: [], piano: true, m: m, relTau: relTau };
    v.valAt = function (x) { var r = v.rel; return r && x >= r.t ? r.v0 * Math.exp(-(x - r.t) / r.tau) : env(x); };

    var amp = v.out = gainN(v, 0), lp = filt(v, 'lowpass', 1000, 0);
    var o1 = oscN(v, w, f, st - d / 2), o2 = oscN(v, w, f, st + d / 2);
    var ns = noiseN(v), bp = filt(v, 'bandpass', clamp(250 + f * 1.5, 250, 3000), 0.7), hg = gainN(v, 0);
    o1.connect(lp); o2.connect(lp); ns.connect(bp); bp.connect(hg); hg.connect(lp);
    lp.connect(amp); amp.connect(panOut(bus, b));

    // Brightness: cutoff scaled by velocity and pitch, closing exponentially (faster in the treble).
    var fs = clamp(f * (3 + 18 * Math.pow(vel, 1.5)) + 300 + 3000 * vel, 300, 16000);
    lp.frequency.setValueAtTime(fs, t);
    lp.frequency.setTargetAtTime(clamp(f * 3 + 250, 300, fs), t + 0.005, 0.25 + 0.9 * (1 - k));
    perc(hg.gain, t, vel * (0.8 + 1.4 * k), 0.0015, 0.007);   // hammer thump

    var g = amp.gain;
    g.setValueAtTime(0, t); g.linearRampToValueAtTime(P, t1); g.setTargetAtTime(S, t1, tau1);
    if (tr > t2) g.setTargetAtTime(0, t2, tau2);
    if (tr < endNat) {                             // scheduled note-off
      v.rel = { t: tr, tau: relTau, v0: env(tr) };
      g.setValueAtTime(v.rel.v0, tr); g.setTargetAtTime(0, tr, relTau);
    }
    run(v, o1, t, v.end); run(v, o2, t, v.end); run(v, ns, t, t + 0.08);
    return commit(v, o1);
  }

  /* ---------- sampled grand piano (Salamander Grand Piano, CC BY 3.0) ----------
     One recording every minor third, pitched to the neighbouring keys. Loaded in the
     background; until a sample is there the synthesized voice above is used. */
  var SAMPLE_DIR = 'samples/piano/', SNAMES = ['C', 'Ds', 'Fs', 'A'], SOFFS = [0, 3, 6, 9];
  var samples = {}, sampleState = 'idle', sampleCount = 0, sampleTotal = 0;
  function sampleList() {
    var out = [];
    for (var m = 21; m <= 99; m += 3) {
      var pc = m % 12, oct = Math.floor(m / 12) - 1;
      out.push({ m: m, file: SNAMES[SOFFS.indexOf(pc)] + oct + '.mp3' });
    }
    return out;
  }
  function decode(buf) {
    return new Promise(function (res, rej) {
      var p = ctx.decodeAudioData(buf, res, rej);
      if (p && p.then) p.then(res, rej);
    });
  }
  function loadSamples() {
    if (sampleState !== 'idle' || !window.fetch) return;
    sampleState = 'loading';
    var list = sampleList(); sampleTotal = list.length;
    // middle of the keyboard first, so the first notes someone plays are already sampled
    list.sort(function (a, b) { return Math.abs(a.m - 57) - Math.abs(b.m - 57); });
    var i = 0;
    function next() {
      if (i >= list.length) { sampleState = 'ready'; return; }
      var it = list[i++];
      fetch(SAMPLE_DIR + it.file).then(function (r) { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
        .then(decode).then(function (b) { samples[it.m] = b; sampleCount++; })
        .catch(function () {}).then(next);
    }
    next(); next(); next();
    // rhythm section: acoustic drum kit + plucked bass
    ['kick', 'snare', 'hihat'].forEach(function (n) {
      fetch('samples/drums/' + n + '.mp3').then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); })
        .then(decode).then(function (b) { kit[n] = b; }).catch(function () {});
    });
    Object.keys(BASS_FILES).forEach(function (m) {
      fetch('samples/bass/eb-' + BASS_FILES[m] + '.mp3').then(function (r) { if (!r.ok) throw 0; return r.arrayBuffer(); })
        .then(decode).then(function (b) { bassSmp[m] = b; }).catch(function () {});
    });
  }
  var kit = {}, bassSmp = {};
  var BASS_FILES = { 25: 'Cs1', 28: 'E1', 31: 'G1', 34: 'As1', 37: 'Cs2', 40: 'E2', 43: 'G2', 46: 'As2', 49: 'Cs3' };
  var KIT_MAP = { kick: ['kick', 0.6], snare: ['snare', 0.75], hat: ['hihat', 0.5], ride: ['hihat', 0.7] };
  function drumSample(type, t, vel) {
    var k = KIT_MAP[type], buf = k && kit[k[0]];
    if (!buf) return false;
    var v = mkVoice('drums', t, t + buf.duration, k[1] * Math.pow(vel, 1.3));
    var src = node(v, ctx.createBufferSource()); src.buffer = buf;
    src.playbackRate.value = 1 + (Math.random() - 0.5) * 0.03;      // no two hits exactly alike
    if (type === 'hat') {             // tighter hat for the off-beats
      var e = gainN(v, 1); e.gain.setValueAtTime(1, t); e.gain.setTargetAtTime(0, t + 0.03, 0.05);
      src.connect(e); e.connect(v.out);
    } else src.connect(v.out);
    src.start(t); src.stop(v.end); src._end = v.end; v.srcs.push(src);
    commit(v, src);
    return true;
  }
  function bassSample(m, t, dur, vel) {
    var base = null;
    for (var d = 0; d <= 2 && base == null; d++) { if (bassSmp[m - d]) base = m - d; else if (bassSmp[m + d]) base = m + d; }
    if (base == null) return false;
    var buf = bassSmp[base], tr = t + Math.max(0.05, dur), end = tr + 0.35;
    var lvl = 1.0 * Math.pow(vel, 1.2), v = mkVoice('bass', t, end, lvl);
    var src = node(v, ctx.createBufferSource()); src.buffer = buf; src.playbackRate.value = Math.pow(2, (m - base) / 12);
    // round it off towards an upright: roll off the string zing, let the note bloom and die quicker
    var lp = filt(v, 'lowpass', 1500, 0.5), e = gainN(v, 1);
    lp.frequency.setValueAtTime(1700 + 900 * vel, t); lp.frequency.setTargetAtTime(650, t + 0.02, 0.18);
    e.gain.setValueAtTime(1, t); e.gain.setTargetAtTime(0.45, t + 0.06, 0.3);
    src.connect(lp); lp.connect(e); e.connect(v.out);
    v.out.gain.setValueAtTime(lvl, tr); v.out.gain.setTargetAtTime(0, tr, 0.055);
    v.valAt = function (x) { return x < tr ? lvl : lvl * Math.exp(-(x - tr) / 0.055); };
    src.start(t); src.stop(end); src._end = end; v.srcs.push(src);
    commit(v, src);
    return true;
  }
  function nearestSample(m) {
    for (var d = 0; d <= 2; d++) {
      if (samples[m - d]) return m - d;
      if (samples[m + d]) return m + d;
    }
    return null;
  }
  // 4 nodes per voice: buffer source -> lowpass (velocity brightness) -> amp -> shared panner
  function sampleVoice(m, t, dur, vel, bus) {
    var base = nearestSample(m);
    if (base == null) return null;
    var buf = samples[base], rate = Math.pow(2, (m - base) / 12);
    var f = mtof(m), b = clamp(Math.floor((m - 24) / 12), 0, 7);
    var P = 1.7 * Math.pow(Math.max(vel, 0.03), 1.6) + 0.03;
    var relTau = m >= 89 ? 0.3 : 0.07 + 0.05 * clamp((60 - m) / 36, 0, 1);   // dampers: bass rings a little longer
    var natEnd = t + buf.duration / rate - 0.02;
    var tr = dur == null ? Infinity : t + dur;
    var v = { bus: bus, t0: t, end: Math.min(natEnd, tr + relTau * 7), srcs: [], nodes: [], piano: true, m: m, relTau: relTau };
    v.valAt = function (x) { var r = v.rel; return r && x >= r.t ? r.v0 * Math.exp(-(x - r.t) / r.tau) : P; };
    var src = node(v, ctx.createBufferSource()); src.buffer = buf; src.playbackRate.value = rate;
    // soft notes are darker, like a real hammer; loud notes pass almost unfiltered
    var lp = filt(v, 'lowpass', clamp(f * (1.5 + 22 * Math.pow(vel, 1.6)) + 500 + 9000 * vel * vel, 500, 19000), 0);
    var amp = v.out = gainN(v, P);
    src.connect(lp); lp.connect(amp); amp.connect(panOut(bus, b));
    if (tr < natEnd) {
      v.rel = { t: tr, tau: relTau, v0: P };
      amp.gain.setValueAtTime(P, tr); amp.gain.setTargetAtTime(0, tr, relTau);
    }
    src.start(t); src.stop(v.end); src._end = v.end; v.srcs.push(src);
    return commit(v, src);
  }
  function pianoVoice(m, t, dur, vel, bus) {
    return sampleVoice(m, t, dur, vel, bus) || synthVoice(m, t, dur, vel, bus);
  }

  function playNote(midi, time, dur, vel, bus) {
    var m = midiOf(midi); if (!isFinite(m)) return;
    vel = clamp(num(vel, 0.8), 0, 1); if (!vel) return;
    pianoVoice(m, T(time), Math.max(0.03, num(dur, 0.5)), vel, bus === 'user' ? 'user' : 'piano');
  }
  function noteOff(midi) {
    var m = midiOf(midi), v = live[m];
    if (!v) return;
    delete live[m];
    release(v, ctx.currentTime, v.relTau);
  }
  function noteOn(midi, vel) {
    var m = midiOf(midi); if (!isFinite(m)) return;
    vel = clamp(num(vel, 0.8), 0, 1);
    if (!vel) return noteOff(m);                   // MIDI convention: velocity 0 = note off
    var n = ctx.currentTime;
    if (live[m]) release(live[m], n, 0.012);       // retrigger: quick damp of the previous voice
    live[m] = pianoVoice(m, n, null, vel, 'user');
  }

  /* ---------- rhythm section ---------- */

  function drum(type, time, vel) {
    vel = clamp(num(vel, 0.8), 0, 1); if (!vel) return;
    var t = T(time), v, o, e, e2, n, h, hi;
    if (drumSample(type, t, vel)) return;
    switch (type) {
      case 'kick':   // soft "feathered" kick: sine pitch sweep
        v = mkVoice('drums', t, t + 0.5, 0.9 * vel);
        o = oscN(v, 'sine', 160, 0); e = gainN(v);
        o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.1);
        perc(e.gain, t, 1, 0.003, 0.08);
        o.connect(e); e.connect(v.out); run(v, o, t, v.end);
        return void commit(v, o);
      case 'snare':  // brush: soft-attack bandpassed noise + short low tone
        v = mkVoice('drums', t, t + 0.4, 0.55 * vel);
        n = noiseN(v); h = filt(v, 'bandpass', 2600, 0.6); e = gainN(v);
        n.connect(h); h.connect(e); e.connect(v.out); perc(e.gain, t, 1, 0.006, 0.07);
        o = oscN(v, 'triangle', 185, 0); e2 = gainN(v);
        o.connect(e2); e2.connect(v.out); perc(e2.gain, t, 0.3, 0.002, 0.035);
        run(v, n, t, v.end); run(v, o, t, t + 0.25);
        return void commit(v, n);
      case 'hat':    // closed hi-hat
        v = mkVoice('drums', t, t + 0.15, 0.4 * vel);
        n = noiseN(v); h = filt(v, 'highpass', 7000, 0); e = gainN(v);
        n.connect(h); h.connect(e); e.connect(v.out); perc(e.gain, t, 1, 0.001, 0.02);
        run(v, n, t, v.end);
        return void commit(v, n);
      case 'ride':   // highpassed noise wash + inharmonic square partials for the metallic ping
        v = mkVoice('drums', t, t + 1.6, 0.3 * vel);
        n = noiseN(v); h = filt(v, 'highpass', 5000, 0); e = gainN(v);
        n.connect(h); h.connect(e); e.connect(v.out); perc(e.gain, t, 0.6, 0.001, 0.22);
        var hp2 = filt(v, 'highpass', 3500, 0); e2 = gainN(v);
        hp2.connect(e2); e2.connect(v.out); perc(e2.gain, t, 0.12, 0.001, 0.28);
        [523, 775, 1085].forEach(function (fq) { var s = oscN(v, 'square', fq, 0); s.connect(hp2); run(v, s, t, v.end); });
        run(v, n, t, v.end);
        return void commit(v, n);
      case 'click':
      case 'clickHi': // woodblock-ish tick (two modes, tiny pitch drop); clickHi = beat 1
        hi = type === 'clickHi';
        var f = hi ? 1800 : 1250;
        v = mkVoice('click', t, t + 0.1, (hi ? 0.8 : 0.6) * vel);
        o = oscN(v, 'sine', f, 0); var o2 = oscN(v, 'sine', f * 2.7, 0), g2 = gainN(v, 0.25);
        e = gainN(v);
        o.frequency.setValueAtTime(f * 1.2, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.008);
        o.connect(e); o2.connect(g2); g2.connect(e); e.connect(v.out);
        perc(e.gain, t, 1, 0.0008, 0.012);
        run(v, o, t, v.end); run(v, o2, t, v.end);
        return void commit(v, o);
    }
  }

  // Upright-bass pluck: harmonic-rich wave -> closing lowpass -> pluck envelope.
  function bass(midi, time, dur, vel) {
    var m = midiOf(midi); if (!isFinite(m)) return;
    vel = clamp(num(vel, 0.8), 0, 1); if (!vel) return;
    if (bassSample(m, T(time), num(dur, 0.5), vel)) return;
    var t = T(time), f = mtof(m), tauD = 0.42 - 0.17 * clamp((m - 28) / 27, 0, 1);
    var tr = t + Math.max(0.05, num(dur, 0.5)), end = Math.min(t + 0.1 + tauD * 7, tr + 0.3);
    var lvl = 0.6 * Math.pow(vel, 1.2), v = mkVoice('bass', t, end, lvl);
    var o = oscN(v, bassWave(), f, 0), lp = filt(v, 'lowpass', 1000, 1), e = gainN(v);
    o.connect(lp); lp.connect(e); e.connect(v.out);
    o.frequency.setValueAtTime(f * 1.006, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.05); // finger "snap"
    // Keep enough harmonics after the pluck so the line stays audible on small speakers.
    lp.frequency.setValueAtTime(f * 8 + 400 + 800 * vel, t); lp.frequency.setTargetAtTime(f * 3 + 250, t + 0.01, 0.12);
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(1, t + 0.006);
    e.gain.setTargetAtTime(0.6, t + 0.006, 0.05); e.gain.setTargetAtTime(0, t + 0.1, tauD);
    if (tr < end) {   // note-off: finger mute on the output gain
      v.out.gain.setValueAtTime(lvl, tr); v.out.gain.setTargetAtTime(0, tr, 0.05);
      v.valAt = function (x) { return x < tr ? lvl : lvl * Math.exp(-(x - tr) / 0.05); };
    }
    run(v, o, t, end);
    commit(v, o);
  }

  /* ---------- control ---------- */

  function init() {
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {} // ignore iPad mute switch
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ctx = new AC({ latencyHint: 'interactive' }); } catch (e) { ctx = new AC(); }
      try { build(); } catch (e) {
        try { ctx.close(); } catch (e2) {}
        ctx = null; throw e;
      }
      api.ctx = ctx; api.ready = true;
      loadSamples();
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden && ctx.state !== 'running') resume();
      });
    }
    if (ctx.state !== 'running') {
      resume();
      try { // iOS unlock: play one silent sample inside the gesture
        var s = ctx.createBufferSource(); s.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
        s.connect(ctx.destination); s.start(0);
      } catch (e) {}
    }
    return ctx;
  }

  function setVolume(bus, value) {
    if (!Object.prototype.hasOwnProperty.call(levels, bus)) return;
    levels[bus] = clamp(num(value, levels[bus]), 0, 1);
    if (api.ready) applyLevel(bus, false);   // otherwise applied at init
  }

  // Fade out and cancel everything scheduled or sounding, except the 'user' bus (live playing).
  function stopAll() {
    var n = ctx.currentTime;
    voices.forEach(function (v) { if (v.bus !== 'user') kill(v, n, 0.025); });
  }

  api.init = safe(init);
  api.sampleStatus = function () { return { state: sampleState, loaded: sampleCount, total: sampleTotal }; };
  api._tap = function (bus) { var an = ctx.createAnalyser(); an.fftSize = 2048; buses[bus || 'master'].connect(an); return an; };
  api.now = function () { return api.ready ? ctx.currentTime : 0; };
  api.latency = function () { try { return ctx ? (ctx.outputLatency || ctx.baseLatency || 0) : 0; } catch (e) { return 0; } };
  api.playNote = guard(playNote);
  api.noteOn = guard(noteOn);
  api.noteOff = guard(noteOff);
  api.drum = guard(drum);
  api.bass = guard(bass);
  api.setVolume = safe(setVolume);
  api.stopAll = guard(stopAll);
  window.BW.audio = api;
})();
