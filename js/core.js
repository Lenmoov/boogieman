/* Boogie Woogie course — core: registries, notation parser, music model, storage.
   See data/FORMAT.md for the content syntax. */
window.BW = window.BW || {};
(function (BW) {
  'use strict';

  BW.UNITS_PER_BEAT = 6;
  BW.UNITS_PER_BAR = 24;

  BW.patterns = [];
  BW.licks = [];
  BW.articles = [];
  BW.errors = [];
  BW.addPatterns = function (a) { a.forEach(function (p) { BW.patterns.push(p); }); };
  BW.addLicks = function (a) { a.forEach(function (l) { BW.licks.push(l); }); };
  BW.addArticles = function (a) { a.forEach(function (x) { BW.articles.push(x); }); };
  BW.patternById = function (id) { return BW.patterns.filter(function (p) { return p.id === id; })[0] || null; };
  BW.lickById = function (id) { return BW.licks.filter(function (p) { return p.id === id; })[0] || null; };

  /* ---------- pitch ---------- */
  var LETTERS = 'CDEFGAB';
  var SEMIS = [0, 2, 4, 5, 7, 9, 11];
  var ACC_TXT = { '-2': 'bb', '-1': 'b', '0': '', '1': '#', '2': '##' };

  function mkNote(li, acc, oct) {
    return {
      li: li, acc: acc, oct: oct,
      midi: 12 * (oct + 1) + SEMIS[li] + acc,
      step: oct * 7 + li,                       // diatonic position, C4 = 28
      name: LETTERS[li] + ACC_TXT[acc] + oct
    };
  }
  BW.parseNote = function (name) {
    var m = /^([A-G])(bb|##|b|#)?(-?\d)$/.exec(name);
    if (!m) return null;
    var acc = m[2] === 'b' ? -1 : m[2] === '#' ? 1 : m[2] === 'bb' ? -2 : m[2] === '##' ? 2 : 0;
    return mkNote(LETTERS.indexOf(m[1]), acc, parseInt(m[3], 10));
  };
  function transposeNote(n, dSteps, dSemis) {
    var step = n.step + dSteps;
    var li = ((step % 7) + 7) % 7, oct = Math.floor(step / 7);
    var natural = 12 * (oct + 1) + SEMIS[li];
    var out = mkNote(li, (n.midi + dSemis) - natural, oct);
    out.finger = n.finger;
    return out;
  }

  /* Keys offered for transposition: [diatonic steps, semitones, key signature (+sharps / -flats)] */
  BW.KEYS = {
    'C': [0, 0, 0], 'F': [3, 5, -1], 'G': [-3, -5, 1], 'Bb': [-1, -2, -2],
    'D': [1, 2, 2], 'Eb': [2, 3, -3], 'A': [-2, -3, 3]
  };
  BW.KEY_ORDER = ['C', 'F', 'G', 'Bb', 'D', 'Eb', 'A'];

  /* ---------- bar parser ---------- */
  var TOKEN = /^(?:\(([^)]*)\))?([^\/()]+)\/(\d+)(?::([1-5]+))?(~)?$/;

  function parseBar(str, where, errs) {
    var out = [];
    var toks = String(str).trim().split(/\s+/);
    var sum = 0;
    toks.forEach(function (tok) {
      var m = TOKEN.exec(tok);
      if (!m) { errs.push(where + ': bad token "' + tok + '"'); return; }
      var d = parseInt(m[3], 10);
      var ev = { d: d, rest: m[2] === 'r', notes: [], grace: [], tie: !!m[5] };
      if (!ev.rest) {
        var names = m[2].split('+'), fingers = m[4] || '';
        names.forEach(function (nm, i) {
          var n = BW.parseNote(nm);
          if (!n) { errs.push(where + ': bad note "' + nm + '" in "' + tok + '"'); return; }
          n.finger = fingers[i] ? parseInt(fingers[i], 10) : 0;
          ev.notes.push(n);
        });
        if (fingers && fingers.length !== names.length) errs.push(where + ': finger count mismatch in "' + tok + '"');
        for (var i = 1; i < ev.notes.length; i++) {
          if (ev.notes[i].midi <= ev.notes[i - 1].midi) errs.push(where + ': chord not low→high in "' + tok + '"');
        }
        if (m[1]) {
          m[1].split(',').forEach(function (g) {
            var gm = /^([^:]+)(?::([1-5]))?$/.exec(g.trim());
            var n = gm && BW.parseNote(gm[1]);
            if (!n) { errs.push(where + ': bad grace "' + g + '"'); return; }
            n.finger = gm[2] ? parseInt(gm[2], 10) : 0;
            ev.grace.push(n);
          });
        }
      }
      sum += d;
      out.push(ev);
    });
    if (sum !== BW.UNITS_PER_BAR) errs.push(where + ': bar adds up to ' + sum + ' instead of 24');
    return out;
  }
  BW.parseBar = parseBar;

  function sameNotes(a, b) {
    if (a.notes.length !== b.notes.length) return false;
    for (var i = 0; i < a.notes.length; i++) if (a.notes[i].midi !== b.notes[i].midi) return false;
    return true;
  }

  /* bar strings -> absolute events (ties across barlines merged into one long event) */
  function buildHand(bars, hand, where, errs) {
    var evs = [], pendingTie = null;
    bars.forEach(function (str, bi) {
      var t = bi * BW.UNITS_PER_BAR;
      parseBar(str, where + ' ' + hand + ' bar ' + (bi + 1), errs).forEach(function (ev, i) {
        if (i === 0 && pendingTie && !ev.rest && sameNotes(pendingTie, ev)) {
          pendingTie.d += ev.d;
          pendingTie.tie = ev.tie;
          if (!ev.tie) pendingTie = null;
        } else {
          ev.t = t; ev.hand = hand;
          evs.push(ev);
          pendingTie = ev.tie ? ev : null;
        }
        t += ev.d;
      });
    });
    return evs;
  }

  function chordRoot(sym) {
    var m = /^([A-G])([b#]?)/.exec(sym || 'C');
    return m ? m[1] + m[2] : 'C';
  }
  BW.chordRoot = chordRoot;
  var ROOT_PC = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
  BW.rootPc = function (sym) { var r = ROOT_PC[chordRoot(sym)]; return r == null ? 0 : r; };

  /* Expand a left-hand pattern over a chord grid (chords = [[sym], [sym, sym], ...]) */
  function expandPattern(pat, chords, where, errs) {
    var evs = [], run = 0, prevRoot = null, cache = {};
    function barsFor(root) {
      if (cache[root]) return cache[root];
      var src = pat.bars[root];
      var list;
      if (src) {
        list = (Array.isArray(src) ? src : [src]).map(function (s, i) {
          return parseBar(s, 'pattern ' + pat.id + ' ' + root + (i + 1), errs);
        });
      } else {
        // unknown root: transpose the C pattern
        var semis = (ROOT_PC[root] || 0); if (semis > 7) semis -= 12;
        var steps = Math.round(semis * 7 / 12);
        var csrc = pat.bars.C; csrc = Array.isArray(csrc) ? csrc : [csrc];
        list = csrc.map(function (s) {
          return parseBar(s, 'pattern ' + pat.id, []).map(function (ev) {
            var c = { d: ev.d, rest: ev.rest, grace: [], tie: false };
            c.notes = ev.notes.map(function (n) { return transposeNote(n, steps, semis); });
            return c;
          });
        });
      }
      cache[root] = list;
      return list;
    }
    chords.forEach(function (cs, bi) {
      var base = bi * BW.UNITS_PER_BAR;
      if (cs.length === 1) {
        var root = chordRoot(cs[0]);
        run = (root === prevRoot) ? run + 1 : 0; prevRoot = root;
        var list = barsFor(root), t = base;
        list[run % list.length].forEach(function (ev) {
          evs.push({ t: t, d: ev.d, rest: ev.rest, notes: ev.notes, grace: ev.grace, hand: 'lh', tie: false });
          t += ev.d;
        });
      } else {
        prevRoot = null; run = 0;
        var span = BW.UNITS_PER_BAR / cs.length;
        cs.forEach(function (sym, ci) {
          var t = 0, start = base + ci * span;
          barsFor(chordRoot(sym))[0].forEach(function (ev) {
            if (t < span) {
              evs.push({ t: start + t, d: Math.min(ev.d, span - t), rest: ev.rest, notes: ev.notes, grace: ev.grace, hand: 'lh', tie: false });
            }
            t += ev.d;
          });
        });
      }
    });
    return evs;
  }

  /* ---------- model ---------- */
  /* opts: { key: 'C'|'F'|..., lhPattern: id (override) } */
  BW.buildModel = function (lick, opts) {
    opts = opts || {};
    var errs = [], where = lick.id || 'example';
    var nBars = (lick.chords && lick.chords.length) || (lick.rh && lick.rh.length) || (Array.isArray(lick.lh) && lick.lh.length) || 1;
    var chords = [];
    for (var i = 0; i < nBars; i++) {
      var c = lick.chords && lick.chords[i];
      chords.push(c ? String(c).trim().split(/\s+/) : []);
    }
    var rh = lick.rh && lick.rh.length ? buildHand(lick.rh, 'rh', where, errs) : [];
    var lh = [];
    var lhSpec = opts.lhPattern || lick.lh;
    if (Array.isArray(lhSpec)) lh = buildHand(lhSpec, 'lh', where, errs);
    else if (lhSpec) {
      var pat = BW.patternById(lhSpec) || BW.patterns[0];
      if (!BW.patternById(lhSpec)) errs.push(where + ': unknown pattern "' + lhSpec + '"');
      if (pat) lh = expandPattern(pat, chords.map(function (c) { return c.length ? c : ['C7']; }), where, errs);
    }
    if (lick.rh && lick.rh.length !== nBars) errs.push(where + ': rh has ' + lick.rh.length + ' bars, expected ' + nBars);
    if (Array.isArray(lick.lh) && lick.lh.length !== nBars) errs.push(where + ': lh has ' + lick.lh.length + ' bars, expected ' + nBars);

    var key = opts.key && BW.KEYS[opts.key] ? opts.key : 'C';
    var kd = BW.KEYS[key];
    function tr(n) { return kd[1] === 0 ? n : transposeNote(n, kd[0], kd[1]); }
    var counter = 0, lo = 127, hi = 0;
    function finish(list, hand) {
      return list.map(function (ev) {
        var e = { id: hand + counter++, hand: hand, t: ev.t, d: ev.d, rest: ev.rest, notes: ev.notes.map(tr), grace: ev.grace.map(tr) };
        e.notes.concat(e.grace).forEach(function (n) { lo = Math.min(lo, n.midi); hi = Math.max(hi, n.midi); });
        return e;
      });
    }
    var model = {
      id: lick.id, bars: nBars, key: key, keySig: kd[2], tempo: lick.tempo || 120,
      chords: chords.map(function (cs) { return cs.map(function (s) { return transposeChord(s, kd); }); }),
      hands: { rh: finish(rh, 'rh'), lh: finish(lh, 'lh') },
      errors: errs
    };
    model.range = { lo: lo > hi ? 48 : lo, hi: lo > hi ? 72 : hi };
    model.has = {
      rh: model.hands.rh.some(function (e) { return !e.rest; }),
      lh: model.hands.lh.some(function (e) { return !e.rest; })
    };
    if (errs.length) Array.prototype.push.apply(BW.errors, errs);
    return model;
  };

  function transposeChord(sym, kd) {
    if (!kd[1]) return sym;
    var m = /^([A-G])([b#]?)(.*)$/.exec(sym);
    if (!m) return sym;
    var n = BW.parseNote(m[1] + m[2] + '4');
    var t = transposeNote(n, kd[0], kd[1]);
    return LETTERS[t.li] + ACC_TXT[t.acc] + m[3];
  }

  /* Flat list of sounding notes: [{t, d, midi, hand, finger, evId, grace: index-from-end or 0}] sorted by t */
  BW.flatten = function (model, hands) {
    var out = [];
    hands.forEach(function (h) {
      model.hands[h].forEach(function (ev) {
        if (ev.rest) return;
        ev.grace.forEach(function (g, i) {
          out.push({ t: ev.t, d: 1, midi: g.midi, hand: h, finger: g.finger, evId: ev.id, grace: ev.grace.length - i });
        });
        ev.notes.forEach(function (n) {
          out.push({ t: ev.t, d: ev.d, midi: n.midi, hand: h, finger: n.finger, evId: ev.id, grace: 0 });
        });
      });
    });
    out.sort(function (a, b) { return a.t - b.t || b.grace - a.grace || a.midi - b.midi; });
    return out;
  };

  /* Groups of notes that must be struck together (for wait mode / scoring). Grace notes are optional. */
  BW.groups = function (model, hands, fromUnit, toUnit) {
    var map = {};
    hands.forEach(function (h) {
      model.hands[h].forEach(function (ev) {
        if (ev.rest || ev.t < fromUnit || ev.t >= toUnit) return;
        var g = map[ev.t] || (map[ev.t] = { t: ev.t, notes: [], evIds: [] });
        g.evIds.push(ev.id);
        ev.notes.forEach(function (n) { g.notes.push({ midi: n.midi, hand: h, finger: n.finger, evId: ev.id }); });
      });
    });
    return Object.keys(map).map(function (k) { return map[k]; }).sort(function (a, b) { return a.t - b.t; });
  };

  /* ---------- left-hand exercises generated from a pattern ---------- */
  var COMP = {
    C7: 'E4+G4+Bb4', F7: 'A4+C5+Eb5', G7: 'B4+D5+F5'
  };
  function compBar(sym, kind) {
    var v = COMP[sym] || COMP.C7, f = ':124';
    if (kind === 'backbeat') return 'r/6 ' + v + '/4' + f + ' r/2 r/6 ' + v + '/4' + f + ' r/2';
    if (kind === 'charleston') return v + '/4' + f + ' r/6 ' + v + '/2' + f + ' r/12';
    return v + '/2' + f + ' r/4 ' + v + '/2' + f + ' r/4 ' + v + '/2' + f + ' r/4 ' + v + '/2' + f + ' r/4';
  }
  var TWELVE = ['C7', 'C7', 'C7', 'C7', 'F7', 'F7', 'C7', 'C7', 'G7', 'F7', 'C7', 'G7'];
  BW.TWELVE = TWELVE;
  BW.patternExercises = function (pat) {
    var defs = [
      { k: 'exC', chords: ['C7', 'C7'] },
      { k: 'exF', chords: ['F7', 'F7'] },
      { k: 'exG', chords: ['G7', 'G7'] },
      { k: 'exChanges', chords: ['C7', 'F7', 'C7', 'G7'] },
      { k: 'ex12', chords: TWELVE },
      { k: 'exBackbeat', chords: TWELVE, comp: 'backbeat' },
      { k: 'exCharleston', chords: TWELVE, comp: 'charleston' },
      { k: 'exOffbeat', chords: ['C7', 'C7', 'F7', 'F7', 'C7', 'C7', 'G7', 'F7'], comp: 'offbeat' }
    ];
    return defs.map(function (d, i) {
      return {
        id: 'lhx:' + pat.id + ':' + d.k, kind: 'exercise', patternId: pat.id, step: i + 1, nameKey: d.k,
        level: pat.level, style: pat.style, tempo: pat.tempo, key: 'C',
        chords: d.chords, lh: pat.id,
        rh: d.comp ? d.chords.map(function (c) { return compBar(c, d.comp); }) : null,
        defaultHands: d.comp ? 'both' : 'lh'
      };
    });
  };

  /* ---------- backing tracks (free play over the band) ---------- */
  var QUICK = ['C7', 'F7', 'C7', 'C7', 'F7', 'F7', 'C7', 'C7', 'G7', 'F7', 'C7', 'G7'];
  BW.jams = [
    { k: 'shuffle', tempo: 126, lh: 'chop-shuffle', chords: TWELVE, title: { nl: 'Medium shuffle, 12 maten', en: 'Medium shuffle, 12 bars' }, desc: { nl: 'Het standaard bluesschema in een rustig shuffle-tempo. Ideaal om licks in te passen.', en: 'The standard blues form at an easy shuffle tempo. Ideal for fitting licks in.' } },
    { k: 'quick', tempo: 132, lh: 'walking-eighths', chords: QUICK, title: { nl: 'Quick change', en: 'Quick change' }, desc: { nl: 'Als het standaardschema, maar maat 2 gaat al naar F7.', en: 'Like the standard form, but bar 2 already goes to F7.' } },
    { k: 'slow', tempo: 84, lh: 'yancey', chords: TWELVE, title: { nl: 'Slow blues (Yancey)', en: 'Slow blues (Yancey)' }, desc: { nl: 'Langzaam en ruim: tijd om elke noot te laten zingen.', en: 'Slow and spacious: time to let every note sing.' } },
    { k: 'nola', tempo: 108, lh: 'nola-bass', chords: TWELVE, title: { nl: 'New Orleans triolen', en: 'New Orleans triplets' }, desc: { nl: 'Triolengevoel in de stijl van Fats Domino.', en: 'Triplet feel in the style of Fats Domino.' } },
    { k: 'jump', tempo: 148, lh: 'octave-stomp', chords: QUICK, title: { nl: "Jump en rock-'n-roll", en: "Jump and rock 'n' roll" }, desc: { nl: 'Stevig doorstampend, voor riffs en herhaalde noten.', en: 'Driving and stomping, for riffs and repeated notes.' } },
    { k: 'boogie', tempo: 160, lh: 'broken-octaves', chords: TWELVE, title: { nl: 'Up-tempo boogie', en: 'Up-tempo boogie' }, desc: { nl: 'De rollende gebroken-octaafbas op snelheid.', en: 'The rolling broken-octave bass at speed.' } },
    { k: 'eight', tempo: 120, lh: 'walking-eighths', chords: ['C7', 'C7', 'F7', 'F7', 'C7', 'G7', 'C7 F7', 'C7 G7'], title: { nl: '8-maten blues', en: '8-bar blues' }, desc: { nl: 'Het korte schema met een turnaround in de laatste twee maten.', en: 'The short form with a turnaround in the last two bars.' } },
    { k: 'vamp', tempo: 126, lh: 'chop-shuffle', chords: ['C7', 'C7', 'C7', 'C7'], title: { nl: 'Vamp op C7', en: 'C7 vamp' }, desc: { nl: 'Vier maten op een akkoord: om een lick eindeloos te variëren.', en: 'Four bars on one chord: for varying a lick endlessly.' } }
  ];

  /* ---------- storage / settings / progress ---------- */
  var mem = {};
  BW.store = {
    get: function (k, def) {
      try { var v = localStorage.getItem('bw.' + k); return v == null ? def : JSON.parse(v); }
      catch (e) { return k in mem ? mem[k] : def; }
    },
    set: function (k, v) {
      mem[k] = v;
      try { localStorage.setItem('bw.' + k, JSON.stringify(v)); } catch (e) { /* private mode */ }
    }
  };
  var DEFAULT_SETTINGS = {
    lang: 'nl', view: 'both', fingers: true, userSound: true, latencyMs: 0, jitterMs: 0, midiOutId: '', midiOutPlay: false, midiOutShiftMs: 0, midiOutChannel: 0, midiOutMode: 'spread',
    volPiano: 0.8, volDrums: 0.5, volBass: 0.5, volClick: 0.6,
    drums: true, bass: true, click: false, cleanNeeded: 2, startPct: 60, stepPct: 10
  };
  BW.settings = Object.assign({}, DEFAULT_SETTINGS, BW.store.get('settings', {}));
  BW.saveSettings = function () { BW.store.set('settings', BW.settings); };

  BW.progress = BW.store.get('progress', {});
  BW.getProgress = function (id) {
    return BW.progress[id] || { best: 0, pct: 0, clean: 0, plays: 0, last: 0, stage: 0, due: 0 };
  };
  var INTERVALS = [1, 2, 4, 7, 14, 30, 60];   // days, spaced repetition
  BW.saveProgress = function (id, patch) {
    var p = Object.assign(BW.getProgress(id), patch);
    BW.progress[id] = p;
    BW.store.set('progress', BW.progress);
    return p;
  };
  function dayKey() { return new Date().toDateString(); }
  function store(id, p) { BW.progress[id] = p; BW.store.set('progress', BW.progress); return p; }
  /* One finished pass in tempo mode. full = the user played every hand the piece has. */
  BW.recordPass = function (id, pct, accuracy, clean, full) {
    var p = BW.getProgress(id);
    p.plays += 1; p.last = Date.now(); p.pct = pct;
    if (clean && pct > (p.best || 0)) p.best = pct;
    if (clean && full && pct > (p.bestFull || 0)) p.bestFull = pct;
    if (!p.due) p.due = Date.now() + 86400000;
    return store(id, p);
  };
  /* Mastery = the required number of clean passes in a row at full tempo, with all hands.
     Each day it is achieved again, the next review moves further away (spaced repetition). */
  BW.markMastered = function (id, full) {
    var p = BW.getProgress(id), now = Date.now();
    if (!full) p.partDone = true;
    else {
      if (p.masteredDay !== dayKey()) { p.stage = Math.min((p.stage || 0) + 1, INTERVALS.length); p.masteredDay = dayKey(); }
      p.mastered = true;
      p.due = now + INTERVALS[Math.max(0, (p.stage || 1) - 1)] * 86400000;
    }
    return store(id, p);
  };
  BW.status = function (id) {
    var p = BW.getProgress(id);
    if (!p.plays) return 'new';
    return p.mastered ? 'mastered' : 'learning';
  };
  /* practice minutes per day */
  BW.addTime = function (sec) {
    if (!(sec > 1)) return;
    var t = BW.store.get('time', {}), k = dayKey();
    var keep = {}; keep[k] = (t[k] || 0) + sec;
    BW.store.set('time', keep);
  };
  BW.timeToday = function () { return Math.round((BW.store.get('time', {})[dayKey()] || 0) / 60); };
  BW.dueLicks = function () {
    var now = Date.now();
    return BW.licks.filter(function (l) {
      var p = BW.progress[l.id];
      return p && p.plays && p.due && p.due <= now;
    }).sort(function (a, b) { return BW.progress[a.id].due - BW.progress[b.id].due; });
  };

  /* practice-day streak */
  BW.touchStreak = function () {
    var s = BW.store.get('streak', { day: '', count: 0, minutes: {} });
    var today = new Date().toDateString();
    if (s.day !== today) {
      var y = new Date(Date.now() - 86400000).toDateString();
      s.count = (s.day === y) ? s.count + 1 : 1;
      s.day = today;
    }
    BW.store.set('streak', s);
    return s;
  };
  BW.getStreak = function () {
    var s = BW.store.get('streak', { day: '', count: 0 });
    var today = new Date().toDateString(), y = new Date(Date.now() - 86400000).toDateString();
    return (s.day === today || s.day === y) ? s.count : 0;
  };

  BW.tr = function (o) { if (o == null) return ''; if (typeof o === 'string') return o; return o[BW.settings.lang] || o.en || o.nl || ''; };
  BW.clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  BW.el = function (tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'text') e.textContent = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null && attrs[k] !== false) e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return e;
  };
})(window.BW);
