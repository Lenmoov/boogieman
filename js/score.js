/* Boogie Woogie course — score: SVG sheet-music renderer (piano grand staff, 12/8).
   var h = BW.score.render(container, model, opts);
   h.setCursor(unit|null), h.setLoop(startBar, endBar), h.mark(evId, state), h.clearMarks(),
   h.unitToX(unit), h.destroy()
   Structure: 1) rhythm splitting  2) layout pass (segments, accidentals, beams groups, chord geometry,
   horizontal mapping)  3) drawing pass per system/staff with a skyline for collision-free fingerings
   and chord symbols  4) vertical stacking + handle. */
window.BW = window.BW || {};
(function (BW) {
  'use strict';

  var UB = 24;                                     // units per bar
  var MUSIC_FONT = "'Bravura','Noto Music','Apple Symbols','Segoe UI Symbol','Symbola',serif";
  var SANS = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif";
  var SERIF = "'Times New Roman',Times,'Liberation Serif','Noto Serif',serif";
  var HW = 0.585;                                  // filled/half notehead half width (staff spaces)
  var HW_WHOLE = 0.78;

  function f(n) { return String(Math.round(n * 100) / 100); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function minOf(a) { return Math.min.apply(null, a); }
  function maxOf(a) { return Math.max.apply(null, a); }
  /* transform an absolute path spec written in staff spaces ("M x y C x y x y x y Z") */
  function tp(spec, x, y, kx, ky) {
    if (ky == null) ky = kx;
    return spec.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, function (m, a, b) {
      return f(x + parseFloat(a) * kx) + ' ' + f(y + parseFloat(b) * ky);
    });
  }

  /* ================= 1. rhythm splitting ================= */
  /* inside one beat: offset o (0..5), length l (o + l <= 6) -> list of note values */
  function splitBeat(o, l) {
    var out = [];
    while (l > 0) {
      if (l <= 3 || (l === 4 && (o === 0 || o === 2)) || (l === 6 && o === 0)) { out.push(l); break; }
      var v = (l >= 4 && (o === 0 || o === 2)) ? 4 : (l >= 3 && (o === 0 || o === 3)) ? 3 : (o % 2 === 0 ? 2 : 1);
      out.push(v); o += v; l -= v;
    }
    return out;
  }
  /* inside one bar: [[pos, len], ...] */
  function splitBar(pos, len) {
    var out = [];
    while (len > 0) {
      var v;
      if (pos === 0 && len >= UB) v = UB;
      else if ((pos === 0 || pos === 12) && len >= 12) v = 12;
      else {
        var o = pos % 6, l = Math.min(len, 6 - o);
        splitBeat(o, l).forEach(function (p) { out.push([pos, p]); pos += p; });
        len -= l;
        continue;
      }
      out.push([pos, v]); pos += v; len -= v;
    }
    return out;
  }
  /* absolute: never crosses a barline -> [[t, d], ...] */
  function splitAbs(t, d) {
    var out = [];
    while (d > 0) {
      var b = Math.floor(t / UB), pos = t - b * UB, len = Math.min(d, UB - pos);
      splitBar(pos, len).forEach(function (p) { out.push([b * UB + p[0], p[1]]); });
      t += len; d -= len;
    }
    return out;
  }

  /* ================= glyph geometry (staff-space units) ================= */
  var ACC_W = { '-2': 1.55, '-1': 0.85, '0': 0.72, '1': 1.0, '2': 0.9 };
  var ACC_Y = { '-2': [-1.75, 0.62], '-1': [-1.75, 0.62], '0': [-1.32, 1.32], '1': [-1.45, 1.45], '2': [-0.45, 0.45] };
  var FLAT = 'M 0 -1.75 L 0.13 -1.75 L 0.13 0.62 L 0 0.62 Z ' +
    'M 0.1 -0.12 C 0.5 -0.58 1.02 -0.36 0.86 0.06 C 0.74 0.36 0.36 0.54 0.1 0.62 Z ' +
    'M 0.13 0.4 C 0.36 0.3 0.62 0.12 0.62 -0.06 C 0.62 -0.26 0.36 -0.22 0.13 0.04 Z';
  var ACC_SPEC = {
    '1': 'M 0.24 -1.2 L 0.36 -1.2 L 0.36 1.45 L 0.24 1.45 Z M 0.64 -1.45 L 0.76 -1.45 L 0.76 1.2 L 0.64 1.2 Z ' +
      'M 0 -0.42 L 1 -0.7 L 1 -0.43 L 0 -0.15 Z M 0 0.42 L 1 0.14 L 1 0.41 L 0 0.69 Z',
    '-1': FLAT,
    '0': 'M 0.06 -1.32 L 0.18 -1.32 L 0.18 0.65 L 0.06 0.65 Z M 0.54 -0.65 L 0.66 -0.65 L 0.66 1.32 L 0.54 1.32 Z ' +
      'M 0.06 -0.35 L 0.66 -0.57 L 0.66 -0.33 L 0.06 -0.11 Z M 0.06 0.33 L 0.66 0.11 L 0.66 0.35 L 0.06 0.57 Z',
    '2': 'M 0 -0.45 L 0.3 -0.45 L 0.45 -0.18 L 0.6 -0.45 L 0.9 -0.45 L 0.9 -0.15 L 0.63 0 L 0.9 0.15 L 0.9 0.45 ' +
      'L 0.6 0.45 L 0.45 0.18 L 0.3 0.45 L 0 0.45 L 0 0.15 L 0.27 0 L 0 -0.15 Z',
    '-2': FLAT + ' ' + FLAT.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, function (m, a, b) { return f(parseFloat(a) + 0.7) + ' ' + b; })
  };
  function accD(a, x, y, k) { return tp(ACC_SPEC[String(a)] || ACC_SPEC['0'], x, y, k); }

  /* up-stem flag hanging from the stem tip (mirrored in y for down stems) */
  var FLAG = 'M 0 0 C 0 0.65 0.5 1.05 0.8 1.6 C 1.1 2.2 1.0 2.75 0.75 3.1 C 0.92 2.5 0.8 1.85 0 1.4 Z';
  /* rests: origin = horizontal centre, middle staff line */
  var QREST = 'M -0.28 -1.5 L 0.45 -0.62 C 0.2 -0.4 0 -0.2 -0.02 0.02 L 0.42 0.6 C 0.1 0.42 -0.3 0.5 -0.2 0.95 ' +
    'C -0.15 1.2 0 1.35 0.12 1.5 C -0.3 1.35 -0.55 1.0 -0.45 0.7 C -0.38 0.42 -0.1 0.3 0.12 0.36 ' +
    'L -0.4 -0.22 C -0.1 -0.5 0 -0.75 0 -0.9 C -0.05 -1.1 -0.2 -1.3 -0.28 -1.5 Z';
  var R8_STEM = 'M 0.42 -0.66 L 0.54 -0.62 L 0.02 0.98 L -0.1 0.98 Z';
  var R16_STEM = 'M 0.42 -0.66 L 0.54 -0.62 L -0.22 1.98 L -0.34 1.98 Z';
  var R_HOOK = 'M 0.36 -0.4 C 0.22 -0.25 0 -0.16 -0.3 -0.18 L -0.3 -0.3 C 0 -0.3 0.25 -0.4 0.42 -0.66 Z';
  /* fallback clefs (stroked): G clef origin = G line, F clef origin = F line */
  var GCLEF = 'M 1.75 0.42 C 1.15 0.5 0.95 -0.45 1.55 -0.72 C 2.25 -0.95 2.75 -0.1 2.45 0.55 ' +
    'C 2.15 1.2 1.0 1.4 0.5 0.85 C -0.05 0.25 0.25 -0.85 1.05 -1.65 C 1.65 -2.25 2.15 -2.95 2.05 -3.75 ' +
    'C 2.0 -4.45 1.55 -4.5 1.35 -4.0 C 1.05 -3.2 1.2 -1.5 1.5 0.5 C 1.62 1.4 1.72 2.0 1.58 2.5 ' +
    'C 1.45 2.95 0.8 3.0 0.72 2.5';
  var FCLEF = 'M 0.32 0.1 C 0.2 -0.75 1.05 -1.1 1.65 -0.95 C 2.45 -0.75 2.6 0.3 2.1 1.05 C 1.65 1.75 0.95 2.2 0.15 2.55';
  var BRACE = 'M 1 0 C 0.2 0.04 0.6 0.45 0 0.5 C 0.6 0.55 0.2 0.96 1 1 C 0.45 0.95 0.95 0.55 0 0.5 C 0.95 0.45 0.45 0.05 1 0 Z';

  /* ellipse as 4 béziers, rotated by deg (negative = tilted up to the right); ry < 0 reverses direction */
  function ellD(cx, cy, rx, ry, deg) {
    var a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), k = 0.5523;
    function p(x, y) { return f(cx + x * c - y * s) + ' ' + f(cy + x * s + y * c); }
    return 'M' + p(rx, 0) + 'C' + p(rx, k * ry) + ' ' + p(k * rx, ry) + ' ' + p(0, ry) +
      'C' + p(-k * rx, ry) + ' ' + p(-rx, k * ry) + ' ' + p(-rx, 0) +
      'C' + p(-rx, -k * ry) + ' ' + p(-k * rx, -ry) + ' ' + p(0, -ry) +
      'C' + p(k * rx, -ry) + ' ' + p(rx, -k * ry) + ' ' + p(rx, 0) + 'Z';
  }
  function headD(kind, cx, cy, k) {
    if (kind === 'whole') return ellD(cx, cy, 0.78 * k, 0.48 * k, 0) + ellD(cx, cy, 0.4 * k, -0.23 * k, -55);
    if (kind === 'half') return ellD(cx, cy, 0.6 * k, 0.46 * k, -20) + ellD(cx, cy, 0.5 * k, -0.19 * k, -32);
    return ellD(cx, cy, 0.6 * k, 0.46 * k, -20);
  }

  /* ================= clef glyph support detection ================= */
  var clefInfo;
  function detectClefs() {
    if (clefInfo !== undefined) return clefInfo;
    clefInfo = null;
    try {
      if (typeof document === 'undefined') return clefInfo;
      var ctx = document.createElement('canvas').getContext('2d');
      if (!ctx) return clefInfo;
      var fs = 100;
      ctx.font = fs + 'px ' + MUSIC_FONT;
      var tofu = ctx.measureText('􏿾').width;
      var res = {};
      var ok = [['G', '𝄞', 1.7, 4.2], ['F', '𝄢', 0.8, 2.4]].every(function (c) {
        var m = ctx.measureText(c[1]);
        if (!m.width || Math.abs(m.width - tofu) < 0.5) return false;
        var asc = m.actualBoundingBoxAscent, desc = m.actualBoundingBoxDescent;
        var l = m.actualBoundingBoxLeft, r = m.actualBoundingBoxRight;
        if (!isFinite(asc) || !isFinite(desc) || !isFinite(l) || !isFinite(r)) return false;
        var h = asc + desc, w = l + r;
        if (h < 20 || w < 10 || h / w < c[2] || h / w > c[3]) return false;
        res[c[0]] = { asc: asc / fs, h: h / fs, w: w / fs, left: l / fs, ch: c[1] };
        return true;
      });
      if (ok) clefInfo = res;
    } catch (e) { clefInfo = null; }
    return clefInfo;
  }
  /* G clef ink: 1.39 sp above top line, 7.02 sp tall (Bravura metrics); F clef: top at top line, 3.6 sp */
  var CLEF_FIT = { G: { top: -1.39, h: 7.02, fw: 2.8 }, F: { top: -0.04, h: 3.6, fw: 3.15 } };
  function clefWidth(kind, S) {
    var gi = clefInfo && clefInfo[kind];
    return gi ? gi.w * (CLEF_FIT[kind].h * S / gi.h) : CLEF_FIT[kind].fw * S;
  }

  /* ================= 2. layout pass ================= */
  var SHARP_ORDER = [3, 0, 4, 1, 5, 2, 6], FLAT_ORDER = [6, 2, 5, 1, 4, 0, 3];
  var STAFF_DEF = {
    G: { top: 38, ks: { s: [38, 35, 39, 36, 33, 37, 34], f: [34, 37, 33, 36, 32, 35, 31] } },
    F: { top: 26, ks: { s: [24, 21, 25, 22, 19, 23, 20], f: [20, 23, 19, 22, 18, 21, 17] } }
  };
  function mkStaff(hand, clef, S) {
    var d = STAFF_DEF[clef];
    return {
      hand: hand, clef: clef, top: d.top, mid: d.top - 4, midY: 2 * S, ks: d.ks,
      y: function (step) { return (d.top - step) * S / 2; }
    };
  }
  function keyMap(ks) {
    var m = [0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < Math.abs(ks); i++) m[ks > 0 ? SHARP_ORDER[i] : FLAT_ORDER[i]] = ks > 0 ? 1 : -1;
    return m;
  }

  /* events -> contiguous items (gaps filled, rests merged) -> segments */
  function buildSegs(evs, nBars) {
    var end = nBars * UB, items = [], cur = 0;
    evs.slice().sort(function (a, b) { return a.t - b.t; }).forEach(function (ev) {
      var t = ev.t | 0, d = ev.d | 0;
      if (t >= end) return;
      if (t < cur) { d -= cur - t; t = cur; }
      if (t + d > end) d = end - t;
      if (d <= 0) return;
      if (t > cur) items.push({ t: cur, d: t - cur, rest: true, ev: null });
      items.push({ t: t, d: d, rest: !!ev.rest || !ev.notes || !ev.notes.length, ev: ev });
      cur = t + d;
    });
    if (cur < end) items.push({ t: cur, d: end - cur, rest: true, ev: null });
    var merged = [];
    items.forEach(function (it) {
      var p = merged[merged.length - 1];
      if (p && p.rest && it.rest && p.t + p.d === it.t) p.d += it.d;
      else merged.push({ t: it.t, d: it.d, rest: it.rest, ev: it.ev });
    });
    var segs = [];
    merged.forEach(function (it) {
      var notes = it.rest ? [] : it.ev.notes.slice().sort(function (a, b) { return a.step - b.step || a.midi - b.midi; });
      var prev = null;
      splitAbs(it.t, it.d).forEach(function (p, i) {
        var s = {
          t: p[0], d: p[1], bar: Math.floor(p[0] / UB), pos: p[0] % UB, rest: it.rest,
          id: it.ev ? it.ev.id : null, notes: notes, first: i === 0, prev: null, next: null,
          grace: (!it.rest && i === 0 && it.ev.grace) ? it.ev.grace : []
        };
        if (!it.rest && prev) { prev.next = s; s.prev = prev; }
        prev = s;
        segs.push(s);
      });
    });
    return segs;
  }

  /* accidentals: state per staff per bar per (letter, octave), initialised from the key signature */
  function accPass(list, kmap) {
    var state = {};
    function need(n) {
      var cur = state[n.step];
      if (cur === undefined) cur = kmap[n.li];
      state[n.step] = n.acc;
      return n.acc !== cur ? n.acc : null;
    }
    list.forEach(function (s) {
      s.acc = s.notes.map(function () { return null; });
      s.gacc = s.grace.map(function () { return null; });
      if (s.rest || !s.first) return;           // tied continuations: no accidental, state untouched
      s.gacc = s.grace.map(need);
      s.acc = s.notes.map(need);
    });
  }

  function chordScore(s, st) { return (s.notes[0].step - st.mid) + (s.notes[s.notes.length - 1].step - st.mid); }
  /* beam groups (short values adjacent inside one beat) and stem directions */
  function groupPass(list, st) {
    var groups = [], g = null;
    list.forEach(function (s) {
      if (s.rest || s.d > 3) { g = null; return; }
      var last = g && g[g.length - 1];
      if (g && last.t + last.d === s.t && Math.floor(last.pos / 6) === Math.floor(s.pos / 6)) g.push(s);
      else { g = [s]; groups.push(g); }
    });
    list.forEach(function (s) { if (!s.rest) s.up = chordScore(s, st) < 0; });
    var beams = [];
    groups.forEach(function (g) {
      if (g.length < 2) return;
      var sum = 0;
      g.forEach(function (s) { sum += chordScore(s, st); });
      g.forEach(function (s) { s.up = sum < 0; s.beam = g; });
      beams.push(g);
    });
    return beams;
  }

  /* chord geometry relative to the time x (cx = 0) */
  function chordLayout(s, st, S) {
    if (s.rest) return;
    var whole = s.d === 24, kind = whole ? 'whole' : s.d === 12 ? 'half' : 'fill', up = s.up;
    var hw = (whole ? HW_WHOLE : HW) * S, disp = whole ? 1.5 * S : 2 * hw - 0.12 * S;
    var n = s.notes.length, i;
    var heads = s.notes.map(function (nt, i) { return { step: nt.step, y: st.y(nt.step), dx: 0, i: i }; });
    if (up || whole) {
      for (i = 1; i < n; i++) if (heads[i].step - heads[i - 1].step <= 1 && heads[i - 1].dx === 0) heads[i].dx = disp;
    } else {
      for (i = n - 2; i >= 0; i--) if (heads[i + 1].step - heads[i].step <= 1 && heads[i + 1].dx === 0) heads[i].dx = -disp;
    }
    var hl = Infinity, hr = -Infinity;
    heads.forEach(function (h) { hl = Math.min(hl, h.dx - hw); hr = Math.max(hr, h.dx + hw); });
    var L = { heads: heads, hw: hw, kind: kind, whole: whole, hl: hl, hr: hr, yTop: heads[n - 1].y, yBot: heads[0].y };
    L.stemX = up ? hw - 0.06 * S : -hw + 0.06 * S;
    if (!whole) {
      var yNear = up ? L.yTop : L.yBot, len = 3.5 * S + (s.d === 1 && !s.beam ? 0.6 * S : 0);
      L.yFar = up ? L.yBot : L.yTop;
      s.tip = up ? Math.min(yNear - len, st.midY) : Math.max(yNear + len, st.midY);
    }
    /* accidentals: columns, top note first, shift left when closer than a sixth */
    var accs = [];
    s.acc.forEach(function (a, i) { if (a !== null) accs.push({ a: a, step: heads[i].step, y: heads[i].y }); });
    accs.sort(function (p, q) { return q.step - p.step; });
    var cols = [];
    accs.forEach(function (p) {
      var k = 0;
      while (cols[k] && cols[k].some(function (q) { return Math.abs(q.step - p.step) < 6; })) k++;
      (cols[k] = cols[k] || []).push(p);
    });
    var right = hl - 0.2 * S, left = hl;
    cols.forEach(function (col) {
      var w = maxOf(col.map(function (p) { return ACC_W[p.a]; })) * S;
      col.forEach(function (p) { p.x = right - ACC_W[p.a] * S; left = Math.min(left, p.x); });
      right -= w + 0.16 * S;
    });
    L.accs = accs;
    /* augmentation dots (in spaces; a line note's dot moves up) */
    L.dots = [];
    if (s.d === 3 || s.d === 6 || s.d === 12 || s.d === 24) {
      var taken = {};
      heads.slice().reverse().forEach(function (h) {
        var p = h.step % 2 === 0 ? h.step + 1 : h.step;
        if (taken[p]) p -= 2;
        if (taken[p]) return;
        taken[p] = 1;
        L.dots.push(st.y(p));
      });
      L.dotX = hr + 0.42 * S;
    }
    /* grace notes, right to left, left of the accidentals */
    L.grace = null;
    if (s.grace.length) {
      var gk = 0.6 * S, ghw = HW * gk, gn = s.grace.length, items = [], prevLeft = left - 0.25 * S, cx;
      for (var k = gn - 1; k >= 0; k--) {
        var g = s.grace[k], ga = s.gacc[k];
        cx = (k === gn - 1) ? prevLeft - (gn === 1 ? 0.8 * S : 0.2 * S) - ghw : prevLeft - 0.42 * S - ghw;
        var it = { step: g.step, y: st.y(g.step), cx: cx, a: ga, finger: g.finger || 0 };
        var l = cx - ghw;
        if (ga !== null) { it.ax = l - 0.1 * S - ACC_W[ga] * S * 0.7; l = it.ax; }
        prevLeft = l;
        items.unshift(it);
      }
      L.grace = { items: items, k: gk, hw: ghw, left: prevLeft };
      left = prevLeft;
    }
    L.left = left;
    L.leftExt = -left;
    s.L = L;
  }

  /* ledger lines for noteheads [{step, cx, hw}] */
  function ledgers(items, st, ext) {
    var out = [], top = st.top, bot = st.top - 8, L;
    var hi = maxOf(items.map(function (h) { return h.step; })), lo = minOf(items.map(function (h) { return h.step; }));
    function span(fn, Ls) {
      var x0 = Infinity, x1 = -Infinity;
      items.forEach(function (h) { if (fn(h.step)) { x0 = Math.min(x0, h.cx - h.hw - ext); x1 = Math.max(x1, h.cx + h.hw + ext); } });
      out.push({ y: st.y(Ls), x0: x0, x1: x1 });
    }
    for (L = top + 2; L <= hi; L += 2) span(function (s) { return s >= L; }, L);
    for (L = bot - 2; L >= lo; L -= 2) span(function (s) { return s <= L; }, L);
    return out;
  }

  function layout(model, opts, S, W) {
    var nBars = Math.max(1, model.bars | 0);
    var bpr = Math.max(1, (opts.barsPerRow | 0) || 2);
    var has = model.has || {};
    var staves = (has.rh && has.lh) ? [mkStaff('rh', 'G', S), mkStaff('lh', 'F', S)]
      : has.lh ? [mkStaff('lh', 'F', S)] : [mkStaff('rh', 'G', S)];
    var ks = clamp(model.keySig | 0, -7, 7), kmap = keyMap(ks);
    staves.forEach(function (st) {
      st.segs = buildSegs((model.hands && model.hands[st.hand]) || [], nBars);
      st.bars = []; st.beams = [];
      for (var b = 0; b < nBars; b++) st.bars.push([]);
      st.segs.forEach(function (s) { st.bars[s.bar].push(s); });
      st.bars.forEach(function (list, b) {
        accPass(list, kmap);
        st.beams[b] = groupPass(list, st);
        list.forEach(function (s) { chordLayout(s, st, S); });
      });
    });
    /* horizontal */
    var grand = staves.length === 2;
    detectClefs();
    var staffX0 = 0.7 * S + (grand ? 1.9 * S : 0), staffX1 = W - 0.8 * S;
    var clefX = staffX0 + 0.45 * S;
    var clefW = maxOf(staves.map(function (st) { return clefWidth(st.clef, S); }));
    var ksX = clefX + clefW + 0.65 * S, ksPitch = (ks > 0 ? 1.05 : 0.92) * S;
    var afterKs = ksX + Math.abs(ks) * ksPitch + (ks ? 0.4 * S : 0);
    var tsX = afterKs, tsW = 3.0 * S;
    var pfxFirst = tsX + tsW + 0.6 * S, pfxOther = afterKs + 0.6 * S;
    var padLeft = 2.2 * S, padRight = 1.5 * S;
    staves.forEach(function (st) {
      st.segs.forEach(function (s) { if (s.pos === 0 && s.L) padLeft = Math.max(padLeft, s.L.leftExt + 0.6 * S); });
    });
    padLeft = Math.min(padLeft, 7 * S);
    var systems = [], sysOf = [];
    for (var i = 0; i * bpr < nBars; i++) {
      var start = i * bpr, end = Math.min(nBars, start + bpr), px = i === 0 ? pfxFirst : pfxOther;
      var barW = (staffX1 - px) / bpr, sys = { i: i, start: start, end: end, barW: barW, barX: [], innerW: barW - padLeft - padRight };
      for (var b = start; b < end; b++) { sys.barX.push(px + (b - start) * barW); sysOf[b] = i; }
      sys.x0 = px; sys.xEnd = px + (end - start) * barW;
      systems.push(sys);
    }
    function unitToX(u) {
      if (u == null || !isFinite(u)) return null;
      var b = clamp(Math.floor(u / UB), 0, nBars - 1), pos = clamp(u - b * UB, 0, UB), sy = systems[sysOf[b]];
      return sy.barX[b - sy.start] + padLeft + pos / UB * sy.innerW;
    }
    staves.forEach(function (st) { st.segs.forEach(function (s) { s.x = unitToX(s.t); s.sys = sysOf[s.bar]; }); });
    return {
      S: S, W: W, nBars: nBars, ks: ks, staves: staves, grand: grand, systems: systems, sysOf: sysOf,
      staffX0: staffX0, clefX: clefX, ksX: ksX, ksPitch: ksPitch, tsX: tsX, tsW: tsW,
      padLeft: padLeft, unitToX: unitToX, chords: model.chords || []
    };
  }

  /* ================= 3. drawing pass ================= */
  var BIN = 2;
  function Sky(W) {
    this.n = Math.ceil(W / BIN) + 2;
    this.top = new Float64Array(this.n); this.bot = new Float64Array(this.n);
    this.top.fill(1e9); this.bot.fill(-1e9);
    this.minY = 1e9; this.maxY = -1e9;
  }
  Sky.prototype.add = function (x0, y0, x1, y1) {
    var t;
    if (x1 < x0) { t = x0; x0 = x1; x1 = t; }
    if (y1 < y0) { t = y0; y0 = y1; y1 = t; }
    var i0 = clamp(Math.floor(x0 / BIN), 0, this.n - 1), i1 = clamp(Math.floor(x1 / BIN), 0, this.n - 1);
    for (var i = i0; i <= i1; i++) {
      if (y0 < this.top[i]) this.top[i] = y0;
      if (y1 > this.bot[i]) this.bot[i] = y1;
    }
    if (y0 < this.minY) this.minY = y0;
    if (y1 > this.maxY) this.maxY = y1;
  };
  Sky.prototype.topIn = function (x0, x1) {
    var m = 1e9, i1 = clamp(Math.floor(x1 / BIN), 0, this.n - 1);
    for (var i = clamp(Math.floor(x0 / BIN), 0, this.n - 1); i <= i1; i++) if (this.top[i] < m) m = this.top[i];
    return m;
  };
  Sky.prototype.botIn = function (x0, x1) {
    var m = -1e9, i1 = clamp(Math.floor(x1 / BIN), 0, this.n - 1);
    for (var i = clamp(Math.floor(x0 / BIN), 0, this.n - 1); i <= i1; i++) if (this.bot[i] > m) m = this.bot[i];
    return m;
  };

  function Out(W) { this.b = []; this.sky = new Sky(W); }
  Out.prototype.p = function (s) { this.b.push(s); };
  Out.prototype.box = function (x0, y0, x1, y1) { this.sky.add(x0, y0, x1, y1); };
  Out.prototype.path = function (d, x0, y0, x1, y1, attrs) {
    this.b.push('<path d="' + d + '"' + (attrs || '') + '/>');
    if (x0 != null) this.sky.add(x0, y0, x1, y1);
  };
  Out.prototype.line = function (x0, y0, x1, y1, w, cls) {
    this.b.push('<line x1="' + f(x0) + '" y1="' + f(y0) + '" x2="' + f(x1) + '" y2="' + f(y1) + '" stroke-width="' + f(w) + '"' +
      (cls ? ' class="' + cls + '"' : ' stroke="currentColor"') + '/>');
    this.sky.add(Math.min(x0, x1) - w / 2, Math.min(y0, y1), Math.max(x0, x1) + w / 2, Math.max(y0, y1));
  };
  Out.prototype.circle = function (cx, cy, r) {
    this.b.push('<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="' + f(r) + '"/>');
    this.sky.add(cx - r, cy - r, cx + r, cy + r);
  };
  Out.prototype.rect = function (x, y, w, h) {
    this.b.push('<rect x="' + f(x) + '" y="' + f(y) + '" width="' + f(w) + '" height="' + f(h) + '"/>');
    this.sky.add(x, y, x + w, y + h);
  };
  Out.prototype.text = function (x, y, str, cls, size, extra, bw, bh) {
    this.b.push('<text x="' + f(x) + '" y="' + f(y) + '" class="' + cls + '" font-size="' + f(size) + '"' + (extra || '') + '>' + str + '</text>');
    if (bw != null) this.sky.add(x - bw / 2, y - bh, x + bw / 2, y + 0.05 * size);
  };
  Out.prototype.acc = function (a, x, y, k) {
    var r = ACC_Y[String(a)] || ACC_Y['0'];
    this.path(accD(a, x, y, k), x, y + r[0] * k, x + ACC_W[a] * k, y + r[1] * k);
  };

  function drawClef(o, kind, x, S) {
    var gi = clefInfo && clefInfo[kind], fit = CLEF_FIT[kind];
    if (gi) {
      var fsz = fit.h * S / gi.h, top = fit.top * S;
      o.p('<text x="' + f(x + gi.left * fsz) + '" y="' + f(top + gi.asc * fsz) + '" font-size="' + f(fsz) +
        '" font-family="' + MUSIC_FONT.replace(/"/g, '') + '">' + (kind === 'G' ? '&#x1D11E;' : '&#x1D122;') + '</text>');
      o.box(x, top, x + gi.w * fsz, top + fit.h * S);
      return;
    }
    if (kind === 'G') {
      var gy = 3 * S;
      o.path(tp(GCLEF, x + 0.15 * S, gy, S), x, gy - 4.5 * S, x + 2.8 * S, gy + 3 * S,
        ' fill="none" stroke="currentColor" stroke-width="' + f(0.22 * S) + '" stroke-linecap="round" stroke-linejoin="round"');
      o.circle(x + 1.13 * S, gy + 2.42 * S, 0.32 * S);
    } else {
      var fy = 1 * S;
      o.path(tp(FCLEF, x, fy, S), x, fy - 1.1 * S, x + 2.7 * S, fy + 2.6 * S,
        ' fill="none" stroke="currentColor" stroke-width="' + f(0.27 * S) + '" stroke-linecap="round"');
      o.circle(x + 0.45 * S, fy + 0.12 * S, 0.36 * S);
      o.circle(x + 2.95 * S, fy - 0.5 * S, 0.15 * S);
      o.circle(x + 2.95 * S, fy + 0.5 * S, 0.15 * S);
    }
  }

  function tiePath(o, x1, x2, y, dir, S) {
    if (x2 - x1 < 0.7 * S) { var c = (x1 + x2) / 2; x1 = c - 0.35 * S; x2 = c + 0.35 * S; }
    var w = x2 - x1, h = dir * Math.min(1.25 * S, 0.35 * S + w * 0.1), t = dir * 0.22 * S;
    var d = 'M' + f(x1) + ' ' + f(y) + 'C' + f(x1 + w * 0.2) + ' ' + f(y + h) + ' ' + f(x2 - w * 0.2) + ' ' + f(y + h) + ' ' + f(x2) + ' ' + f(y) +
      'C' + f(x2 - w * 0.2) + ' ' + f(y + h - t) + ' ' + f(x1 + w * 0.2) + ' ' + f(y + h - t) + ' ' + f(x1) + ' ' + f(y) + 'Z';
    o.path(d, x1, y, x2, y + 0.75 * h);
  }
  /* +1 = tie below, -1 = above */
  function tieDirs(s) {
    var n = s.notes.length;
    return s.notes.map(function (nt, i) {
      if (n > 1 && i === n - 1) return -1;
      if (n > 1 && i === 0) return 1;
      return s.up ? 1 : -1;
    });
  }

  function layoutBeam(g, st, S) {
    var up = g[0].up, n = g.length;
    var xs = g.map(function (s) { return s.x + s.L.stemX; });
    var near = g.map(function (s) { return up ? s.L.yTop : s.L.yBot; });
    var x0 = xs[0], dx = (xs[n - 1] - x0) || 1;
    var delta = clamp((near[n - 1] - near[0]) * 0.5, -S, S);
    var inner = near.slice(1, -1);
    if (inner.length) {
      if (up && minOf(inner) < Math.min(near[0], near[n - 1])) delta = 0;
      if (!up && maxOf(inner) > Math.max(near[0], near[n - 1])) delta = 0;
    }
    var sl = delta / dx, b = up ? Infinity : -Infinity, len = 3.5 * S;
    xs.forEach(function (x, i) {
      var off = sl * (x - x0);
      b = up ? Math.min(b, near[i] - len - off, st.midY - off) : Math.max(b, near[i] + len - off, st.midY - off);
    });
    g.forEach(function (s, i) { s.tip = b + sl * (xs[i] - x0); });
    return { up: up, xs: xs, b: b, sl: sl, x0: x0 };
  }
  function drawBeam(o, g, bm, S) {
    var dir = bm.up ? 1 : -1, th = 0.48 * S, n = g.length, xs = bm.xs, sw = 0.06 * S;
    function poly(xa, xb, level) {
      var ya = bm.b + bm.sl * (xa - bm.x0) + dir * level * 0.75 * S, yb = bm.b + bm.sl * (xb - bm.x0) + dir * level * 0.75 * S;
      o.path('M' + f(xa) + ' ' + f(ya) + 'L' + f(xb) + ' ' + f(yb) + 'L' + f(xb) + ' ' + f(yb + dir * th) + 'L' + f(xa) + ' ' + f(ya + dir * th) + 'Z',
        xa, Math.min(ya, yb, ya + dir * th, yb + dir * th), xb, Math.max(ya, yb, ya + dir * th, yb + dir * th));
    }
    poly(xs[0] - sw, xs[n - 1] + sw, 0);
    var i = 0;
    while (i < n) {
      if (g[i].d !== 1) { i++; continue; }
      var j = i;
      while (j + 1 < n && g[j + 1].d === 1) j++;
      if (j > i) poly(xs[i] - sw, xs[j] + sw, 1);
      else if (i === 0) poly(xs[0] - sw, xs[0] + Math.min(1.1 * S, (xs[1] - xs[0]) * 0.5), 1);
      else poly(xs[i] - Math.min(1.1 * S, (xs[i] - xs[i - 1]) * 0.5), xs[i] + sw, 1);
      i = j + 1;
    }
  }

  function drawRest(o, s, sys, S) {
    var X = s.x, mid = 2 * S;
    if (s.d === 24 && s.pos === 0) {
      var cx = sys.barX[s.bar - sys.start] + sys.barW / 2;
      o.rect(cx - 0.65 * S, S, 1.3 * S, 0.52 * S);
    } else if (s.d === 12) {
      o.rect(X - 0.6 * S, 1.48 * S, 1.2 * S, 0.52 * S);
      o.circle(X + 0.95 * S, 1.5 * S, 0.19 * S);
    } else if (s.d >= 4) {
      o.path(tp(QREST, X, mid, S), X - 0.6 * S, mid - 1.5 * S, X + 0.55 * S, mid + 1.45 * S);
      if (s.d === 6) o.circle(X + 0.95 * S, 1.5 * S, 0.19 * S);
    } else if (s.d >= 2) {
      o.path(tp(R8_STEM, X, mid, S), X - 0.1 * S, mid - 0.66 * S, X + 0.54 * S, mid + 0.98 * S);
      o.path(tp(R_HOOK, X, mid, S));
      o.circle(X - 0.3 * S, mid - 0.42 * S, 0.24 * S);
      if (s.d === 3) o.circle(X + 0.95 * S, 1.5 * S, 0.19 * S);
    } else {
      o.path(tp(R16_STEM, X, mid, S), X - 0.8 * S, mid - 0.66 * S, X + 0.54 * S, mid + 1.98 * S);
      o.path(tp(R_HOOK, X, mid, S));
      o.path(tp(R_HOOK, X - 0.244 * S, mid + S, S));
      o.circle(X - 0.3 * S, mid - 0.42 * S, 0.24 * S);
      o.circle(X - 0.544 * S, mid + 0.58 * S, 0.24 * S);
    }
  }

  function drawSeg(o, s, st, S) {
    var L = s.L, X = s.x, up = s.up;
    /* ledger lines (plain ink, not recoloured) */
    var lh = L.heads.map(function (h) { return { step: h.step, cx: X + h.dx, hw: L.hw }; });
    ledgers(lh, st, 0.32 * S).forEach(function (l) { o.line(l.x0, l.y, l.x1, l.y, 0.16 * S); });
    var G = s.first ? L.grace : null;
    if (G) {
      ledgers(G.items.map(function (it) { return { step: it.step, cx: X + it.cx, hw: G.hw }; }), st, 0.22 * S)
        .forEach(function (l) { o.line(l.x0, l.y, l.x1, l.y, 0.13 * S); });
    }
    o.p('<g class="sc-ev" data-ev="' + esc(s.id) + '">');
    if (!L.whole) {
      var sx = X + L.stemX;
      o.line(sx, L.yFar, sx, s.tip, 0.12 * S);
      if (s.d <= 3 && !s.beam) {
        var nf = s.d === 1 ? 2 : 1, dir = up ? 1 : -1, ky = dir * S * (nf === 2 ? 0.82 : 1);
        for (var k = 0; k < nf; k++) {
          var fy = s.tip + dir * k * 0.85 * S;
          o.path(tp(FLAG, sx - 0.06 * S, fy, S, ky), sx, Math.min(fy, fy + 3.1 * ky), sx + 1.1 * S, Math.max(fy, fy + 3.1 * ky));
        }
      }
    }
    L.heads.forEach(function (h) {
      var cx = X + h.dx;
      o.path(headD(L.kind, cx, h.y, S), cx - L.hw, h.y - 0.5 * S, cx + L.hw, h.y + 0.5 * S);
    });
    L.dots.forEach(function (y) { o.circle(X + L.dotX, y, 0.19 * S); });
    if (s.first) L.accs.forEach(function (p) { o.acc(p.a, X + p.x, p.y, S); });
    if (G) drawGrace(o, s, G, S);
    o.p('</g>');
  }

  function drawGrace(o, s, G, S) {
    var X = s.x, n = G.items.length, k = G.k;
    var tip = n === 1 ? G.items[0].y - 2.3 * S : minOf(G.items.map(function (it) { return it.y; })) - 2.1 * S;
    var sxs = [];
    G.items.forEach(function (it) {
      var cx = X + it.cx, sx = cx + G.hw - 0.045 * S;
      sxs.push(sx);
      o.line(sx, it.y, sx, tip, 0.09 * S);
      o.path(headD('fill', cx, it.y, k), cx - G.hw, it.y - 0.3 * S, cx + G.hw, it.y + 0.3 * S);
      if (it.a !== null) o.acc(it.a, X + it.ax, it.y, 0.7 * S);
    });
    var sw = 0.09 * S, s0 = sxs[0];
    if (n === 1) {
      o.path(tp(FLAG, s0 - sw / 2, tip, k), s0, tip, s0 + 0.7 * S, tip + 1.9 * S);
    } else {
      var xe = sxs[n - 1] + sw / 2;
      o.path('M' + f(s0 - sw / 2) + ' ' + f(tip) + 'L' + f(xe) + ' ' + f(tip) + 'L' + f(xe) + ' ' + f(tip + 0.3 * S) + 'L' + f(s0 - sw / 2) + ' ' + f(tip + 0.3 * S) + 'Z',
        s0, tip, xe, tip + 0.3 * S);
    }
    o.line(s0 - 0.5 * S, tip + 1.45 * S, s0 + 0.6 * S, tip + 0.55 * S, 0.09 * S);
  }

  function drawStaff(Lo, sys, st, si, dim, showFingers) {
    var S = Lo.S, o = new Out(Lo.W), x0 = Lo.staffX0, x1 = sys.xEnd, i;
    for (i = 0; i < 5; i++) o.line(x0, i * S, x1, i * S, 0.1 * S, 'sl');
    o.box(x0, 0, x1, 4 * S);
    drawClef(o, st.clef, Lo.clefX, S);
    var ks = Lo.ks, steps = ks > 0 ? st.ks.s : st.ks.f;
    for (i = 0; i < Math.abs(ks); i++) o.acc(ks > 0 ? 1 : -1, Lo.ksX + i * Lo.ksPitch, st.y(steps[i]), S);
    if (sys.i === 0) {
      var tx = Lo.tsX + Lo.tsW / 2, tf = 2.95 * S, tAttr = ' text-anchor="middle" font-family="' + SERIF.replace(/"/g, '') + '" font-weight="700" fill="currentColor"';
      o.p('<text x="' + f(tx) + '" y="' + f(2 * S) + '" font-size="' + f(tf) + '"' + tAttr + '>12</text>');
      o.p('<text x="' + f(tx) + '" y="' + f(4 * S) + '" font-size="' + f(tf) + '"' + tAttr + '>8</text>');
      o.box(Lo.tsX, 0, Lo.tsX + Lo.tsW, 4 * S);
    }
    o.p('<g' + (dim ? ' class="sc-dim"' : '') + '>');
    var segs = [], b;
    for (b = sys.start; b < sys.end; b++) {
      st.beams[b].forEach(function (g) { g.bm = layoutBeam(g, st, S); });
      st.bars[b].forEach(function (s) { segs.push(s); });
    }
    segs.forEach(function (s) {
      if (s.rest) { o.p('<g class="sc-rest">'); drawRest(o, s, sys, S); o.p('</g>'); }
      else drawSeg(o, s, st, S);
    });
    for (b = sys.start; b < sys.end; b++) st.beams[b].forEach(function (g) { drawBeam(o, g, g.bm, S); });
    /* ties (full, or split across the system break) */
    segs.forEach(function (s) {
      if (s.rest) return;
      var L = s.L, X = s.x;
      if (s.next) {
        var dirs = tieDirs(s), n2 = s.next;
        var xa = X + (L.dots.length ? L.dotX + 0.35 * S : L.hr + 0.15 * S);
        var xb = n2.sys === s.sys ? n2.x + n2.L.hl - 0.15 * S : Math.max(sys.xEnd - 0.1 * S, xa + 1.2 * S);
        o.p('<g class="sc-ev" data-ev="' + esc(s.id) + '">');
        L.heads.forEach(function (h, i) { tiePath(o, xa, xb, h.y + dirs[i] * 0.32 * S, dirs[i], S); });
        o.p('</g>');
      }
      if (s.prev && s.prev.sys !== s.sys) {
        var pd = tieDirs(s.prev), xe = X + L.hl - 0.15 * S, xs = Math.min(sys.x0 + 0.2 * S, xe - 1.2 * S);
        o.p('<g class="sc-ev" data-ev="' + esc(s.id) + '">');
        L.heads.forEach(function (h, i) { tiePath(o, xs, xe, h.y + pd[i] * 0.32 * S, pd[i], S); });
        o.p('</g>');
      }
    });
    /* fingerings: above the treble (rh), below the bass (lh) — never on notation (skyline) */
    if (showFingers) {
      var above = st.hand !== 'lh', fs = 1.15 * S, lineH = 1.08 * fs, cap = 0.74 * fs, dw = 0.7 * fs;
      var gfs = 0.88 * fs, gdw = 0.62 * gfs, gcap = 0.74 * gfs;
      /* notation skyline (o.sky) is queried over a wide range (own stem/beam); other fingerings only
         over the digit's own width (fsky), so neighbouring fingerings do not staircase */
      var fsky = new Sky(Lo.W), fboxes = [];
      var digit = function (x, y, txt, cls, size, w, h) {
        o.p('<text x="' + f(x) + '" y="' + f(y) + '" class="' + cls + '" font-size="' + f(size) + '" text-anchor="middle">' + txt + '</text>');
        var bx = [x - w / 2, y - h, x + w / 2, y + 0.05 * size];
        fsky.add(bx[0], bx[1], bx[2], bx[3]); fboxes.push(bx);
      };
      segs.forEach(function (s) {
        if (s.rest || !s.first) return;
        var main = s.notes.map(function (n) { return n.finger || 0; }).filter(function (v) { return v > 0; });
        var G = s.L.grace, gf = G ? G.items.filter(function (it) { return it.finger > 0; }) : [];
        if (!main.length && !gf.length) return;
        var cx = s.x, gx = [], gl = cx - dw / 2 - 0.08 * S;
        for (var k = gf.length - 1; k >= 0; k--) { gx[k] = gl - gdw / 2; gl -= gdw + 0.05 * S; }
        var qx0 = Math.min(cx - 0.62 * S, gl), qx1 = cx + 0.72 * S, dx0 = gl - 0.1 * S, dx1 = cx + dw / 2 + 0.1 * S, j, y;
        var stackH = Math.max(0, main.length - 1) * lineH + cap;
        if (above) {
          var bottom = Math.min(o.sky.topIn(qx0, qx1), 0) - 0.35 * S;
          var fTop = fsky.botIn(dx0, dx1);                 // lowest edge of fingerings already there
          if (fTop > -1e8 && bottom - stackH < fTop + 0.15 * S && fsky.topIn(dx0, dx1) < bottom + 0.15 * S) bottom = fsky.topIn(dx0, dx1) - 0.2 * S;
          for (j = 0; j < main.length; j++) { y = bottom - j * lineH; digit(cx, y, main[j], 'sc-fg', fs, dw, cap); }
          gf.forEach(function (it, k) { digit(gx[k], bottom, it.finger, 'sc-fg sc-fgg', gfs, gdw, gcap); });
        } else {
          var top = Math.max(o.sky.botIn(qx0, qx1), 4 * S) + 0.35 * S;
          var fBot = fsky.topIn(dx0, dx1);
          if (fBot < 1e8 && top + stackH > fBot - 0.15 * S && fsky.botIn(dx0, dx1) > top - 0.15 * S) top = fsky.botIn(dx0, dx1) + 0.2 * S;
          for (j = 0; j < main.length; j++) { y = top + cap + j * lineH; digit(cx, y, main[main.length - 1 - j], 'sc-fg', fs, dw, cap); }
          gf.forEach(function (it, k) { digit(gx[k], top + cap, it.finger, 'sc-fg sc-fgg', gfs, gdw, gcap); });
        }
      });
      fboxes.forEach(function (bx) { o.box(bx[0], bx[1], bx[2], bx[3]); });
    }
    o.p('</g>');
    /* chord symbols: one row above everything in this system (top staff only) */
    if (si === 0) {
      var cfs = 1.45 * S, base = Math.min(o.sky.topIn(sys.x0, sys.xEnd) - 0.45 * S, -1.6 * S);
      for (b = sys.start; b < sys.end; b++) {
        var cs = Lo.chords[b] || [];
        cs.forEach(function (sym, ci) {
          var x = Lo.unitToX(b * UB + ci * UB / cs.length) - HW * S;
          var txt = esc(String(sym)).replace(/^([A-G])b/, '$1♭').replace(/^([A-G])#/, '$1♯');
          o.p('<text x="' + f(x) + '" y="' + f(base) + '" class="sc-ch" font-size="' + f(cfs) + '">' + txt + '</text>');
          o.box(x, base - 0.75 * cfs, x + String(sym).length * 0.62 * cfs, base + 0.1 * cfs);
        });
      }
      if (sys.i > 0) {
        var bnf = 0.95 * S;
        o.text(x0 + 0.1 * S, -1.8 * S, String(sys.start + 1), 'sc-bn', bnf, '', bnf * 1.4, bnf * 0.75);
      }
    }
    return o;
  }

  /* full SVG string + geometry for the handle */
  function build(model, opts, W) {
    var S = opts.compact ? 7.5 : 10;
    var Lo = layout(model, opts, S, W);
    var active = opts.activeHands || ['rh', 'lh'];
    var showF = opts.showFingers !== false;
    var parts = [], Y = 1.0 * S, last = Lo.staves.length - 1, x0 = Lo.staffX0;
    Lo.systems.forEach(function (sys) {
      var outs = Lo.staves.map(function (st, si) { return drawStaff(Lo, sys, st, si, active.indexOf(st.hand) < 0, showF); });
      var y0 = Y - outs[0].sky.minY, ys = [y0];
      if (Lo.grand) ys.push(y0 + Math.max(10 * S, outs[0].sky.maxY - outs[1].sky.minY + 1.4 * S));
      var yl = ys[last], bottom = yl + outs[last].sky.maxY;
      sys.top = Y; sys.bottom = bottom; sys.ys = ys;
      sys.cTop = y0 - 1.4 * S; sys.cBot = yl + 5.4 * S;
      outs.forEach(function (o, i) { parts.push('<g transform="translate(0,' + f(ys[i]) + ')">' + o.b.join('') + '</g>'); });
      /* barlines, system line, brace, final barline */
      var yt = y0, yb = yl + 4 * S, bw = 0.12 * S, bl = [];
      function vline(x, w) { bl.push('<line x1="' + f(x) + '" y1="' + f(yt) + '" x2="' + f(x) + '" y2="' + f(yb) + '" stroke-width="' + f(w) + '" class="bl"/>'); }
      if (Lo.grand) {
        vline(x0, bw);
        var bx = x0 - 1.75 * S, bwid = 1.35 * S, bh = yb - yt;
        bl.push('<path d="' + tp(BRACE, bx, yt, bwid, bh) + '"/>');
      }
      for (var b = sys.start; b < sys.end; b++) {
        var xr = sys.barX[b - sys.start] + sys.barW;
        if (b === Lo.nBars - 1) {
          vline(xr - 0.95 * S, bw);
          bl.push('<rect x="' + f(xr - 0.5 * S) + '" y="' + f(yt) + '" width="' + f(0.5 * S) + '" height="' + f(yb - yt) + '"/>');
        } else vline(xr, bw);
      }
      parts.push(bl.join(''));
      Y = bottom + 2.6 * S;
    });
    var H = Math.ceil(Y - 2.6 * S + 1.0 * S);
    var loops = [], hits = [];
    Lo.systems.forEach(function (sys) {
      for (var b = sys.start; b < sys.end; b++) {
        var bx = sys.barX[b - sys.start];
        loops.push('<rect class="sc-loop" data-loop="' + b + '" x="' + f(bx) + '" y="' + f(sys.cTop) + '" width="' + f(sys.barW) + '" height="' + f(sys.cBot - sys.cTop) + '" rx="' + f(0.4 * S) + '"/>');
        hits.push('<rect class="sc-hitr" data-bar="' + b + '" x="' + f(b === sys.start ? 0 : bx) + '" y="' + f(sys.top - 0.5 * S) + '" width="' + f(b === sys.start ? bx + sys.barW : sys.barW) + '" height="' + f(sys.bottom - sys.top + 1.0 * S) + '"/>');
      }
    });
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" class="bw-sc" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H +
      '" fill="currentColor" preserveAspectRatio="xMinYMin meet" style="width:100%;height:auto;display:block" role="img">' +
      '<rect class="sc-paper" x="0" y="0" width="' + W + '" height="' + H + '" rx="' + f(0.8 * S) + '"/>' +
      '<g>' + loops.join('') + '</g>' + parts.join('') +
      '<rect class="sc-cur" x="0" y="0" width="' + f(0.22 * S) + '" height="0" rx="' + f(0.11 * S) + '" style="display:none"/>' +
      '<g>' + hits.join('') + '</g></svg>';
    return { svg: svg, Lo: Lo, W: W, H: H, S: S };
  }

  /* ================= 4. style + handle ================= */
  function injectStyle() {
    if (typeof document === 'undefined' || document.getElementById('bw-score-style')) return;
    var css = [
      '.bw-sc{color:var(--sc-ink,#0b1f3a);-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;overflow:visible}',
      '.bw-sc .sc-paper{fill:var(--sc-paper,#fffdf8)}',
      '.bw-sc .sl{stroke:var(--sc-staff,#7d8ea8)}',
      '.bw-sc .bl{stroke:var(--sc-bar,var(--sc-staff,#7d8ea8))}',
      '.bw-sc .sc-ev{color:var(--sc-ink,#0b1f3a);transition:color .12s}',
      '.bw-sc .sc-ev.next{color:var(--sc-next,#1668e3)}',
      '.bw-sc .sc-ev.hit{color:var(--sc-hit,#12a150)}',
      '.bw-sc .sc-ev.miss{color:var(--sc-miss,#e5484d)}',
      '.bw-sc .sc-dim{opacity:.45}',
      '.bw-sc text{pointer-events:none}',
      '.bw-sc .sc-fg{fill:var(--sc-finger,#1668e3);font-family:' + SANS + ';font-weight:700}',
      '.bw-sc .sc-fgg{font-weight:600;font-style:italic}',
      '.bw-sc .sc-ch{fill:var(--sc-chord,#1668e3);font-family:' + SANS + ';font-weight:700}',
      '.bw-sc .sc-bn{fill:var(--sc-staff,#7d8ea8);font-family:' + SANS + '}',
      '.bw-sc .sc-loop{fill:var(--sc-loop,rgba(22,104,227,.08));visibility:hidden}',
      '.bw-sc .sc-loop.on{visibility:visible}',
      '.bw-sc .sc-cur{fill:var(--sc-cursor,#1668e3);opacity:.85;pointer-events:none}',
      '.bw-sc .sc-hitr{fill:#000;fill-opacity:0;cursor:pointer}'
    ].join('\n');
    var el = document.createElement('style');
    el.id = 'bw-score-style';
    el.textContent = css;
    (document.head || document.documentElement).appendChild(el);
  }

  function render(container, model, opts) {
    opts = opts || {};
    injectStyle();
    var W = Math.round(container.clientWidth) || 900;
    var R = build(model, opts, W), Lo = R.Lo, S = R.S;
    container.innerHTML = R.svg;
    var svg = container.querySelector('svg.bw-sc');
    var cur = svg.querySelector('.sc-cur');
    var loopEls = Array.prototype.slice.call(svg.querySelectorAll('.sc-loop'));
    var evMap = {}, marked = {};
    Array.prototype.forEach.call(svg.querySelectorAll('.sc-ev'), function (el) {
      var id = el.getAttribute('data-ev');
      (evMap[id] = evMap[id] || []).push(el);
    });
    function onClick(e) {
      var t = e.target, b = t && t.getAttribute ? t.getAttribute('data-bar') : null;
      if (b != null && typeof opts.onBarTap === 'function') opts.onBarTap(parseInt(b, 10));
    }
    svg.addEventListener('click', onClick);
    var lastSys = -1, curShown = false;
    function scrollToSystem(sy) {
      try {
        var c = container;
        if (c.scrollHeight <= c.clientHeight + 1) return;
        var r = svg.getBoundingClientRect(), cr = c.getBoundingClientRect();
        var scale = r.width / R.W || 1, base = r.top - cr.top + c.scrollTop;
        var top = base + sy.top * scale, bot = base + sy.bottom * scale;
        if (top >= c.scrollTop && bot <= c.scrollTop + c.clientHeight) return;
        var target = Math.max(0, top - 6);
        if (typeof c.scrollTo === 'function') c.scrollTo({ top: target, behavior: 'smooth' });
        else c.scrollTop = target;
      } catch (e) { /* ignore */ }
    }
    var h = {
      setCursor: function (u) {
        if (u == null || !isFinite(u)) {
          if (curShown) { cur.style.display = 'none'; curShown = false; }
          return;
        }
        var b = clamp(Math.floor(u / UB), 0, Lo.nBars - 1), si = Lo.sysOf[b], sy = Lo.systems[si];
        cur.setAttribute('x', f(Lo.unitToX(u) - 0.11 * S));
        if (si !== lastSys) {
          cur.setAttribute('y', f(sy.cTop));
          cur.setAttribute('height', f(sy.cBot - sy.cTop));
          lastSys = si;
          scrollToSystem(sy);
        }
        if (!curShown) { cur.style.display = ''; curShown = true; }
      },
      setLoop: function (a, z) {
        var on = a != null && z != null && !(a <= 0 && z >= Lo.nBars) && z > a;
        loopEls.forEach(function (el) {
          var b = parseInt(el.getAttribute('data-loop'), 10);
          if (on && b >= a && b < z) el.classList.add('on'); else el.classList.remove('on');
        });
      },
      mark: function (id, state) {
        (evMap[id] || []).forEach(function (el) {
          el.classList.remove('next', 'hit', 'miss');
          if (state) el.classList.add(state);
        });
        if (state) marked[id] = 1; else delete marked[id];
      },
      clearMarks: function () {
        Object.keys(marked).forEach(function (id) { h.mark(id, null); });
      },
      unitToX: function (u) { return Lo.unitToX(u); },
      destroy: function () {
        svg.removeEventListener('click', onClick);
        if (svg.parentNode === container) container.removeChild(svg);
        evMap = {}; marked = {};
      }
    };
    return h;
  }

  BW.score = { render: render, _split: splitAbs, _splitBar: splitBar, _build: build };
})(window.BW);
