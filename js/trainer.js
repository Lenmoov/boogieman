/* Practice engine: listening, tempo practice with scoring + tempo ladder, wait mode. */
window.BW = window.BW || {};
(function (BW) {
  'use strict';
  var UPB = 24;

  function Trainer(cfg) {
    var self = this;
    this.cfg = cfg;                 // { id, model, score, roll, emit(type, data) }
    this.model = cfg.model;
    this.id = cfg.id;
    this.score = cfg.score; this.roll = cfg.roll;
    this.emit = cfg.emit || function () {};
    this.mode = 'tempo';            // tempo | wait
    this.hands = cfg.hands || 'both';
    this.loop = { from: 0, to: this.model.bars * UPB };
    this.auto = true;
    this.pct = BW.settings.startPct;
    this.running = null;            // null | listen | tempo | wait
    this.clean = 0; this.fails = 0;
    this.passes = [];
    this.disp = 0;
    this._alive = true;
    this._unsub = BW.input.on(function (ev) { self._onInput(ev); });
    this._evById = {};
    this._index();
    this._raf = requestAnimationFrame(function f() { if (!self._alive) return; self._frame(); self._raf = requestAnimationFrame(f); });
  }
  BW.Trainer = Trainer;
  var P = Trainer.prototype;

  P._index = function () {
    var map = this._evById = {};
    ['rh', 'lh'].forEach(function (h) { this.model.hands[h].forEach(function (e) { map[e.id] = e; }); }, this);
  };
  P.setModel = function (model, score, roll) {
    this.stop();
    this.model = model; this.score = score; this.roll = roll;
    this.loop = { from: BW.clamp(this.loop.from, 0, (model.bars - 1) * UPB), to: Math.min(this.loop.to, model.bars * UPB) };
    if (this.loop.to <= this.loop.from) this.loop = { from: 0, to: model.bars * UPB };
    this._index();
    this.refreshViews();
  };
  P.setViews = function (score, roll) {
    this.score = score; this.roll = roll; this.refreshViews();
    if (this.running === 'wait' && this.groups && this.groups.length) this._armGroup();
  };
  P.practiced = function () {
    var m = this.model;
    if (this.hands === 'both') return ['rh', 'lh'].filter(function (h) { return m.has[h]; });
    return m.has[this.hands] ? [this.hands] : ['rh', 'lh'].filter(function (h) { return m.has[h]; });
  };
  P.isFull = function () {
    var m = this.model, pr = this.practiced();
    return ['rh', 'lh'].every(function (h) { return !m.has[h] || pr.indexOf(h) >= 0; });
  };
  P.appHands = function () {
    var pr = this.practiced(), m = this.model;
    return ['rh', 'lh'].filter(function (h) { return m.has[h] && pr.indexOf(h) < 0; });
  };
  P.refreshViews = function () {
    var isFull = this.loop.from === 0 && this.loop.to === this.model.bars * UPB;
    if (this.score) { this.score.setLoop(isFull ? null : this.loop.from / UPB, isFull ? null : this.loop.to / UPB); this.score.clearMarks(); this.score.setCursor(null); }
    if (this.roll) {
      this.roll.setModel(this.model, this.practiced(), { from: this.loop.from, to: this.loop.to, repeat: this.running === 'tempo' || (this.running === 'listen' && this._listenLoop) }, BW.settings.fingers);
      this.roll.next = {};
    }
    this.disp = this.loop.from;
  };
  P.setHands = function (h) { this.stop(); this.hands = h; this.refreshViews(); };
  P.setMode = function (m) { this.stop(); this.mode = m; };
  P.setLoopBars = function (a, b) {          // [a, b) in bars
    this.stop();
    this.loop = { from: a * UPB, to: b * UPB };
    this.refreshViews();
    this.emit('loop', this.loop);
  };
  P.setPct = function (p) {
    this.pct = BW.clamp(Math.round(p), 30, 120);
    this.clean = 0; this.fails = 0; this._celebrated = false;
    this.emit('tempo', { pct: this.pct, dir: 0 });
  };
  P.bpm = function (pct) { return this.model.tempo * (pct == null ? this.pct : pct) / 100; };
  P.spu = function (pct) { return 60 / this.bpm(pct) / 6; };
  P.applyMix = function () {
    var s = BW.settings, a = BW.audio;
    a.setVolume('piano', s.volPiano); a.setVolume('drums', s.volDrums);
    a.setVolume('bass', s.volBass); a.setVolume('click', s.volClick);
    this._dirty = true;
  };

  /* ---- time mapping: performance.now() (ms) -> audio time as heard ---- */
  P._heardAt = function (perfMs) {
    var ctx = BW.audio.ctx; if (!ctx) return 0;
    var extra = (BW.settings.latencyMs || 0) / 1000;
    if (ctx.getOutputTimestamp) {
      try {
        var ts = ctx.getOutputTimestamp();
        if (ts && ts.performanceTime > 0 && Math.abs(ts.contextTime - ctx.currentTime) < 0.6) {
          return ts.contextTime + (perfMs - ts.performanceTime) / 1000 - extra;
        }
      } catch (e) { /* fall through */ }
    }
    return ctx.currentTime - BW.audio.latency() + (perfMs - performance.now()) / 1000 - extra;
  };
  P._heardNow = function () { return this._heardAt(performance.now()); };

  /* ---- schedule building ---- */
  P._buildItems = function (kind) {
    var m = this.model, s = BW.settings, from = this.loop.from, to = this.loop.to, items = [];
    var hands = kind === 'listen' ? (this.cfg.jam && s.otherHand === false ? [] : ['rh', 'lh'].filter(function (h) { return m.has[h]; }))
      : (s.otherHand === false ? [] : this.appHands());
    var soft = kind !== 'listen';
    var tops = {}, lows = {};
    ['rh', 'lh'].forEach(function (h) { m.hands[h].forEach(function (e) { if (!e.rest) { tops[e.id] = e.notes[e.notes.length - 1].midi; lows[e.id] = e.notes[0].midi; } }); });
    BW.flatten(m, hands).forEach(function (n) {
      if (n.t < from || n.t >= to) return;
      // phrasing: strong beats and the backbeat lean in, the short shuffle note is lighter,
      // the top note of a right-hand chord sings, inner notes sit back
      var pos = n.t % 6, onBeat = pos === 0, backbeat = n.t % 12 === 6;
      var vel = n.hand === 'rh' ? 0.66 : 0.56;
      if (onBeat) vel += 0.09; else if (pos === 4) vel -= 0.07; else if (pos % 2) vel -= 0.05;
      if (backbeat) vel += 0.05;
      if (n.t % 24 === 0) vel += 0.03;
      if (n.hand === 'rh' && tops[n.evId] !== n.midi) vel -= 0.08;
      if (n.hand === 'lh' && lows[n.evId] !== n.midi) vel -= 0.05;
      if (soft) vel *= 0.85;
      items.push({ u: n.t - from, type: 'note', midi: n.midi, d: Math.min(n.d, to - n.t), vel: vel, grace: n.grace });
    });
    var plain = !!this.cfg.plain;
    var nBars = (to - from) / UPB, firstBar = from / UPB;
    function chordsOf(bar) { var c = m.chords[bar]; return c && c.length ? c : ['C7']; }
    function bassRoot(sym) { var r = 36 + BW.rootPc(sym); return r > 43 ? r - 12 : r; }
    for (var bi = 0; bi < nBars && !plain; bi++) {
      var bar = firstBar + bi, b = bi * UPB, last = bi === nBars - 1;
      if (s.drums) {
        // swing hi-hat: "ding, ding-a ding, ding-a" with the 2 and 4 leaning in
        [[0, 0.55], [6, 0.7], [10, 0.38], [12, 0.55], [18, 0.7], [22, 0.4]].forEach(function (h) {
          items.push({ u: b + h[0], type: 'drum', drum: h[0] % 6 ? 'hat' : 'ride', vel: h[1] });
        });
        items.push({ u: b, type: 'drum', drum: 'kick', vel: 0.7 });
        items.push({ u: b + 12, type: 'drum', drum: 'kick', vel: 0.6 });
        if (bi % 2 === 1) items.push({ u: b + 22, type: 'drum', drum: 'kick', vel: 0.42 });      // push into the next bar
        items.push({ u: b + 6, type: 'drum', drum: 'snare', vel: 0.62 });
        if (last && nBars >= 4) {            // a little snare fill to turn the loop around
          [[18, 0.5], [20, 0.6], [22, 0.75]].forEach(function (f) { items.push({ u: b + f[0], type: 'drum', drum: 'snare', vel: f[1] }); });
        } else {
          items.push({ u: b + 18, type: 'drum', drum: 'snare', vel: 0.68 });
          if (bi % 4 === 2) items.push({ u: b + 16, type: 'drum', drum: 'snare', vel: 0.22 });   // ghost note
        }
      }
      if (s.click) [0, 6, 12, 18].forEach(function (u) { items.push({ u: b + u, type: 'drum', drum: u ? 'click' : 'clickHi', vel: 0.7 }); });
      if (s.bass) {
        var cs = chordsOf(bar), nextSym = chordsOf(last ? firstBar : bar + 1)[0];
        var line;
        if (cs.length === 1) {
          var root = bassRoot(cs[0]), prevSame = bi > 0 && chordsOf(bar - 1).length === 1 && bassRoot(chordsOf(bar - 1)[0]) === root;
          line = prevSame && bi % 2 ? [root + 10, root + 9, root + 7, root + 4] : [root, root + 4, root + 7, root + 9];
          var nr = bassRoot(nextSym);
          if (nr !== root) line[3] = nr + (line[2] > nr ? 1 : -1);                 // chromatic approach to the next chord
        } else {
          var r1 = bassRoot(cs[0]), r2 = bassRoot(cs[1]), n2 = bassRoot(nextSym);
          line = [r1, r1 + 7, r2, n2 !== r2 ? n2 - 1 : r2 + 7];
        }
        line.forEach(function (mid, beat) {
          items.push({ u: b + beat * 6, type: 'bass', midi: mid, d: 5.2, vel: beat === 0 ? 0.8 : beat === 2 ? 0.72 : 0.64 });
        });
        if (bi % 2 === 0 && cs.length === 1) items.push({ u: b + 22, type: 'bass', midi: line[3], d: 1.6, vel: 0.4 });  // shuffle skip
      }
    }
    items.sort(function (a, b) { return a.u - b.u; });
    return items;
  };

  P._newPass = function (k, start, pct) {
    var spu = this.spu(pct), from = this.loop.from, to = this.loop.to;
    var p = { k: k, start: start, spu: spu, pct: pct, end: start + (to - from) * spu, expected: [], evNeed: {}, extras: 0, finalized: false };
    if (this.running === 'tempo') {
      BW.flatten(this.model, this.practiced()).forEach(function (n) {
        if (n.t < from || n.t >= to) return;
        p.expected.push({ time: start + (n.t - from) * spu, midi: n.midi, evId: n.evId, grace: !!n.grace, hit: null });
        if (!n.grace) p.evNeed[n.evId] = (p.evNeed[n.evId] || 0) + 1;
      });
    }
    return p;
  };
  P._window = function (spu) { return BW.clamp(spu * 1.7, 0.065, 0.15); };

  P._scorePass = function (p, optimistic) {
    var total = 0, hits = 0, sum = 0, abs = 0, now = this._heardNow();
    p.expected.forEach(function (e) {
      if (e.grace) return;
      total++;
      if (e.hit != null) { hits++; sum += e.hit; abs += Math.abs(e.hit); }
      else if (optimistic && e.time > now - 0.05) hits++;
    });
    var score = total ? Math.max(0, (hits - 0.5 * p.extras) / total) : 0;
    var real = p.expected.filter(function (e) { return e.hit != null && !e.grace; }).length;
    return {
      total: total, hits: hits, misses: total - hits, extras: p.extras, score: score,
      clean: total > 0 && score >= 0.95, played: real + p.extras > 0,
      offsetMs: real ? Math.round(sum / real * 1000) : 0, spreadMs: real ? Math.round(abs / real * 1000) : 0,
      pct: p.pct, bpm: Math.round(this.bpm(p.pct))
    };
  };

  /* ---- transport ---- */
  P.listen = function (full, loop) {
    this.stop();
    BW.audio.init(); this.applyMix();
    this.running = 'listen'; this._listenLoop = !!loop;
    if (loop) { BW.touchStreak(); this._t0 = Date.now(); }
    this.refreshViews();
    this.items = this._buildItems('listen');
    var t0 = BW.audio.now() + 0.25;
    this._listenPct = full ? 100 : this.pct;
    var p = this._newPass(0, t0, this._listenPct);
    this.passes = [p];
    this.sched = { idx: 0, pass: p, done: false };
    this._startTimer();
    this.emit('state', this.running);
  };
  P.start = function () {
    this.stop();
    BW.audio.init(); this.applyMix();
    BW.touchStreak();
    this._t0 = Date.now();
    this.clean = 0; this.fails = 0; this._celebrated = false;
    if (this.mode === 'wait') return this._startWait();
    if (this.mode === 'ear') return this._startEar();
    this.running = 'tempo';
    this.refreshViews();
    this.items = this._buildItems('tempo');
    var spu = this.spu(), t0 = BW.audio.now() + 0.15;
    for (var i = 0; i < 4; i++) BW.audio.drum(i ? 'click' : 'clickHi', t0 + i * 6 * spu, 0.8);
    BW.audio.setVolume('click', Math.max(BW.settings.volClick, 0.5));
    var p = this._newPass(0, t0 + UPB * spu, this.pct);
    this.passes = [p];
    this.sched = { idx: 0, pass: p, done: false };
    this._curK = -1;
    this._startTimer();
    this.emit('state', this.running);
  };
  P.stop = function () {
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    clearTimeout(this._earTimer);
    if (this.roll) this.roll.hideNotes = !!this.blind;
    var was = this.running;
    if (this._t0) { BW.addTime((Date.now() - this._t0) / 1000); this._t0 = 0; }
    this.running = null;
    if (BW.audio.ready) BW.audio.stopAll();
    if (this.roll) this.roll.next = {};
    if (this.score) this.score.setCursor(null);
    this.disp = this.loop.from;
    if (was) { if (this.roll) this.refreshViews(); this.emit('state', null); }
  };
  P.toggle = function () { if (this.running) this.stop(); else this.start(); };
  P.destroy = function () { this.stop(); this._alive = false; cancelAnimationFrame(this._raf); this._unsub(); };

  P._startTimer = function () {
    var self = this;
    this._tick();
    this._timer = setInterval(function () { self._tick(); }, 25);
  };
  P._fire = function (it, tm, spu) {
    var a = BW.audio, now = a.now();
    if (it.type === 'note') {
      // human touch: a few milliseconds and a little dynamic variation per note
      var t = (it.grace ? tm - it.grace * Math.min(0.055, spu * 1.1) : tm) + (Math.random() - 0.4) * 0.009;
      var vel = BW.clamp((it.grace ? it.vel * 0.8 : it.vel) + (Math.random() - 0.5) * 0.09, 0.15, 1);
      var len = it.d <= 2 ? it.d * spu * 0.8 : it.d * spu * 0.96;
      a.playNote(it.midi, Math.max(t, now), it.grace ? 0.09 : Math.max(0.07, len), vel);
    } else if (it.type === 'drum') {
      var click = it.drum === 'click' || it.drum === 'clickHi';
      a.drum(it.drum, Math.max(tm + (click ? 0 : (Math.random() - 0.5) * 0.007), now), click ? it.vel : BW.clamp(it.vel + (Math.random() - 0.5) * 0.1, 0.1, 1));
    } else a.bass(it.midi, Math.max(tm + (Math.random() - 0.3) * 0.008, now), it.d * spu, BW.clamp(it.vel + (Math.random() - 0.5) * 0.08, 0.2, 1));
  };
  P._tick = function () {
    var s = this.sched; if (!s || !this.running) return;
    var horizon = BW.audio.now() + 0.2, guard = 0;
    while (guard++ < 2000) {
      var p = s.pass;
      if (s.idx < this.items.length) {
        var it = this.items[s.idx], tm = p.start + it.u * p.spu;
        if (tm > horizon) break;
        this._fire(it, tm, p.spu); s.idx++;
      } else {
        if (p.end > horizon) break;
        if (this.running === 'listen') {
          if (!this._listenLoop) { s.done = true; this._endAt = p.end; break; }
          if (this._dirty) { this.items = this._buildItems('listen'); this._dirty = false; }
          var lp = this._newPass(p.k + 1, p.end, this.pct);
          this.passes.push(lp); if (this.passes.length > 4) this.passes.shift();
          s.pass = lp; s.idx = 0;
          continue;
        }
        if (this._dirty) { this.items = this._buildItems('tempo'); this._dirty = false; }
        var np = this._newPass(p.k + 1, p.end, this.pct);
        this.passes.push(np); if (this.passes.length > 4) this.passes.shift();
        s.pass = np; s.idx = 0;
      }
    }
    if (s.done && this._heardNow() > this._endAt + 0.35) { this.stop(); this.emit('listenEnd'); }
  };
  P._decide = function (r) {
    var st = BW.settings;
    if (!r.played || r.pct !== this.pct) return;       // only passes played at the current tempo count
    if (r.clean) { this.clean++; this.fails = 0; } else { this.clean = 0; if (r.score < 0.6) this.fails++; }
    if (this.clean >= st.cleanNeeded && this.pct >= 100 && !this._celebrated) {
      this._celebrated = true;
      BW.markMastered(this.id, this.isFull());
      this.emit('mastered', { full: this.isFull() });
    }
    if (!this.auto) return;
    if (this.clean >= st.cleanNeeded && this.pct < 100) {
      this.pct = Math.min(100, this.pct + st.stepPct); this.clean = 0;
      this.emit('tempo', { pct: this.pct, dir: 1 });
    } else if (this.fails >= 3 && this.pct > 40) {
      this.pct = Math.max(40, this.pct - st.stepPct); this.fails = 0;
      this.emit('tempo', { pct: this.pct, dir: -1 });
    }
  };

  /* ---- wait mode ---- */
  P._startWait = function () {
    this.running = 'wait';
    this.refreshViews();
    this.groups = BW.groups(this.model, this.practiced(), this.loop.from, this.loop.to);
    this.gi = 0; this.waitErrors = 0;
    if (!this.groups.length) { this.running = null; return; }
    this._armGroup();
    this.emit('state', this.running);
  };
  P._armGroup = function () {
    var g = this.groups[this.gi], self = this;
    if (this.gi === 0 && this.score) this.score.clearMarks();
    this.remaining = {}; this.graceOk = {};
    var next = {};
    g.notes.forEach(function (n) { self.remaining[n.midi] = true; next[n.midi] = n.finger || 0; });
    g.evIds.forEach(function (id) {
      var e = self._evById[id];
      if (e) e.grace.forEach(function (gn) { self.graceOk[gn.midi] = true; });
      if (self.score) self.score.mark(id, 'next');
    });
    this._nextKeys = next;
    if (this.roll) this.roll.next = (this.blind || this.running === 'ear') ? {} : next;
    this.target = g.t;
    if (this.score) this.score.setCursor(g.t);
  };
  P._waitInput = function (midi) {
    var g = this.groups[this.gi], self = this;
    if (this.remaining[midi]) {
      delete this.remaining[midi];
      if (this.roll) this.roll.flash(midi, 'hit');
      if (Object.keys(this.remaining).length) return;
      g.evIds.forEach(function (id) { if (self.score) self.score.mark(id, 'hit'); });
      // let the app play the other hand up to the next group
      var nextT = this.gi + 1 < this.groups.length ? this.groups[this.gi + 1].t : this.loop.to;
      if (BW.settings.otherHand !== false) {
        var spu = this.spu(), now = BW.audio.now();
        BW.flatten(this.model, this.appHands()).forEach(function (n) {
          if (n.t >= g.t && n.t < nextT && !n.grace) BW.audio.playNote(n.midi, now + (n.t - g.t) * spu, Math.max(0.08, n.d * spu * 0.9), 0.5);
        });
      }
      this.gi++;
      if (this.gi >= this.groups.length) {
        var res = { wait: true, errors: this.waitErrors, clean: this.waitErrors === 0, total: this.groups.length };
        var pr = BW.getProgress(this.id);
        BW.saveProgress(this.id, { plays: pr.plays + 1, last: Date.now(), due: pr.due || Date.now() + 86400000 });
        this.emit('result', res);
        this.gi = 0; this.waitErrors = 0;
      }
      this._armGroup();
    } else if (!this.graceOk[midi] && !g.notes.some(function (n) { return n.midi === midi; })) {
      this.waitErrors++;
      if (this.roll) this.roll.flash(midi, 'miss');
      this.emit('wrong', { midi: midi });
    }
  };

  /* ---- ear training: the app plays one bar (notes hidden), the user plays it back ---- */
  P._startEar = function () {
    var m = this.model, self = this, bars = [];
    this.running = 'ear';
    this.refreshViews();
    if (this.roll) this.roll.hideNotes = true;
    this._earAll = BW.groups(m, this.practiced(), this.loop.from, this.loop.to);
    this._earAll.forEach(function (g) { var b = Math.floor(g.t / UPB); if (bars.indexOf(b) < 0) bars.push(b); });
    if (!bars.length) { this.running = null; return; }
    this.earBars = bars; this.ebi = 0; this.waitErrors = 0; this.earHints = 0;
    this.emit('state', this.running);
    this._earCall();
  };
  P._earCall = function () {
    var self = this, bar = this.earBars[this.ebi], b0 = bar * UPB, b1 = b0 + UPB, spu = this.spu();
    clearTimeout(this._earTimer);
    if (BW.audio.ready) BW.audio.stopAll();
    this.earPhase = 'listen';
    this.groups = this._earAll.filter(function (g) { return g.t >= b0 && g.t < b1; });
    this.gi = 0; this.groupErr = 0; this.target = b0;
    if (this.roll) this.roll.next = {};
    var t0 = BW.audio.now() + 0.35;
    BW.audio.setVolume('click', Math.max(BW.settings.volClick, 0.35));
    for (var i = 0; i < 4; i++) BW.audio.drum(i ? 'click' : 'clickHi', t0 + i * 6 * spu, 0.45);
    BW.flatten(this.model, this.practiced()).forEach(function (n) {
      if (n.t < b0 || n.t >= b1) return;
      var t = t0 + (n.t - b0) * spu - (n.grace ? n.grace * Math.min(0.055, spu * 1.1) : 0);
      BW.audio.playNote(n.midi, t, n.grace ? 0.09 : Math.max(0.08, Math.min(n.d, b1 - n.t) * spu * 0.95), n.hand === 'rh' ? 0.72 : 0.6);
    });
    this.emit('ear', { phase: 'listen', bar: this.ebi + 1, of: this.earBars.length });
    this._earTimer = setTimeout(function () {
      if (self.running !== 'ear') return;
      self.earPhase = 'play';
      self._armGroup();
      self.emit('ear', { phase: 'play', bar: self.ebi + 1, of: self.earBars.length });
    }, (0.35 + UPB * spu) * 1000 + 120);
  };
  P.earReplay = function () { if (this.running === 'ear') this._earCall(); };
  P._earInput = function (midi) {
    if (this.earPhase !== 'play') return;
    var g = this.groups[this.gi], self = this;
    if (this.remaining[midi]) {
      delete this.remaining[midi];
      if (this.roll) this.roll.flash(midi, 'hit');
      if (Object.keys(this.remaining).length) return;
      this.gi++; this.groupErr = 0;
      if (this.gi < this.groups.length) return this._armGroup();
      this.ebi++;
      if (this.ebi < this.earBars.length) {
        this.earPhase = 'listen';
        if (this.roll) this.roll.next = {};
        this._earTimer = setTimeout(function () { if (self.running === 'ear') self._earCall(); }, 600);
        return;
      }
      var res = { ear: true, errors: this.waitErrors, hints: this.earHints, clean: this.waitErrors === 0 };
      var pr = BW.getProgress(this.id);
      BW.saveProgress(this.id, { plays: pr.plays + 1, last: Date.now(), due: pr.due || Date.now() + 86400000, earBest: res.clean ? 1 : (pr.earBest || 0) });
      this.stop();
      this.emit('result', res);
    } else if (!this.graceOk[midi] && !g.notes.some(function (n) { return n.midi === midi; })) {
      this.waitErrors++; this.groupErr++;
      if (this.roll) this.roll.flash(midi, 'miss');
      if (this.groupErr === 3) {                 // three misses on the same note: show where it is
        this.earHints++;
        if (this.roll) this.roll.next = this._nextKeys;
        this.emit('ear', { phase: 'hint', bar: this.ebi + 1, of: this.earBars.length });
      }
    }
  };

  /* ---- input ---- */
  P._onInput = function (ev) {
    if (ev.type !== 'on') return;
    if (this.running === 'wait') return this._waitInput(ev.midi);
    if (this.running === 'ear') return this._earInput(ev.midi);
    if (this.running !== 'tempo') return;
    var a = this._heardAt(ev.time), best = null, bestD = 1e9, self = this;
    var first = this.passes[0];
    if (first && first.k === 0 && a < first.start - 0.2) return;       // still counting in
    for (var i = this.passes.length - 1; i >= 0 && i >= this.passes.length - 2; i--) {
      var p = this.passes[i], W = this._window(p.spu);
      for (var j = 0; j < p.expected.length; j++) {
        var e = p.expected[j];
        if (e.midi !== ev.midi || e.hit != null) continue;
        var d = Math.abs(a - e.time);
        if (d < W && (d < bestD || (best && e.time < best.e.time && a >= e.time))) { best = { p: p, e: e }; bestD = d; }
      }
    }
    if (best) {
      best.e.hit = a - best.e.time;
      if (this.roll) this.roll.flash(ev.midi, 'hit');
      if (!best.e.grace) {
        var left = best.p.expected.filter(function (x) { return x.evId === best.e.evId && !x.grace && x.hit == null; }).length;
        if (!left && this.score && best.p.k === this._curK) this.score.mark(best.e.evId, 'hit');
      }
    } else {
      var cur = this._passAt(a);
      if (cur) cur.extras++;
      if (this.roll) this.roll.flash(ev.midi, 'miss');
    }
  };
  P._passAt = function (t) {
    for (var i = this.passes.length - 1; i >= 0; i--) if (this.passes[i].start <= t) return this.passes[i];
    return null;
  };

  /* ---- animation frame ---- */
  P._frame = function () {
    var roll = this.roll, score = this.score;
    if (this.running === 'tempo' || this.running === 'listen') {
      var hn = this._heardNow(), p = this._passAt(hn), from = this.loop.from, unit;
      if (!p) {
        var p0 = this.passes[0];
        unit = from + (hn - p0.start) / p0.spu;
        if (score) score.setCursor(null);
        var beatsLeft = Math.ceil((p0.start - hn) / (p0.spu * 6));
        if (this.running === 'tempo' && beatsLeft !== this._ci) { this._ci = beatsLeft; this.emit('countin', beatsLeft); }
      } else {
        unit = from + Math.min((hn - p.start) / p.spu, this.loop.to - from);
        if (this._ci) { this._ci = 0; this.emit('countin', 0); }
        if (p.k !== this._curK && this.running === 'tempo') {
          this._curK = p.k;
          if (score) score.clearMarks();
          this.emit('pass', { k: p.k, pct: p.pct, bpm: Math.round(this.bpm(p.pct)) });
        }
        if (score) score.setCursor(unit);
      }
      if (this.running === 'tempo') {
        for (var i = 0; i < this.passes.length; i++) {
          var q = this.passes[i], W = this._window(q.spu);
          if (q.finalized) continue;
          for (var j = 0; j < q.expected.length; j++) {
            var e = q.expected[j];
            if (e.hit == null && !e.grace && !e.missed && e.time + W < hn) {
              e.missed = true;
              if (score && q.k === this._curK) score.mark(e.evId, 'miss');
            }
          }
          if (q.end + W < hn) {
            q.finalized = true;
            var res = this._scorePass(q, false);
            if (res.played) {
              this._decide(res);
              BW.recordPass(this.id, q.pct, res.score, res.clean, this.isFull());
              res.cleanStreak = this.clean; res.needed = BW.settings.cleanNeeded;
              this.emit('result', res);
            }
          }
        }
      }
      if (roll) roll.draw(unit);
    } else if (this.running === 'wait' || this.running === 'ear') {
      this.disp += ((this.target || 0) - this.disp) * 0.22;
      if (roll) roll.draw(this.disp);
    } else if (roll) {
      roll.draw(this.loop.from);
    }
  };
})(window.BW);
