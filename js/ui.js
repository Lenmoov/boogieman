/* Views and navigation. */
(function (BW) {
  'use strict';
  var t = BW.t, el = BW.el, tr = BW.tr;
  var app = document.getElementById('app');
  var cleanup = null;

  var ICON = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
    course: '<svg viewBox="0 0 24 24"><path d="M5 20V8M12 20V4M19 20v-9"/><path d="M3 20h18"/></svg>',
    licks: '<svg viewBox="0 0 24 24"><path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',
    lh: '<svg viewBox="0 0 24 24"><path d="M4 8c0-3 2-5 5-5s5 2 5 5c0 6-5 10-10 12"/><circle cx="18" cy="6" r="1"/><circle cx="18" cy="11" r="1"/></svg>',
    theory: '<svg viewBox="0 0 24 24"><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M4 21V5"/><path d="M9 8h6M9 12h6"/></svg>',
    ear: '<svg viewBox="0 0 24 24"><path d="M7 10a5 5 0 0110 0c0 3-3 4-3 7a3 3 0 01-6 0"/><path d="M10 10a2 2 0 014 0"/></svg>',
    jam: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/></svg>',
    styles: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2"/></svg>',
    settings: '<svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/></svg>',
    mixer: '<svg viewBox="0 0 24 24"><path d="M6 4v16M12 4v16M18 4v16"/><circle cx="6" cy="9" r="2"/><circle cx="12" cy="15" r="2"/><circle cx="18" cy="8" r="2"/></svg>',
    logo: '<svg viewBox="0 0 32 32" fill="#fff"><rect x="4" y="6" width="5" height="20" rx="1.5"/><rect x="11" y="6" width="5" height="20" rx="1.5"/><rect x="18" y="6" width="5" height="20" rx="1.5"/><rect x="25" y="6" width="3.5" height="20" rx="1.5"/><rect x="7.5" y="6" width="4" height="12" rx="1" fill="#0b2a66"/><rect x="14.5" y="6" width="4" height="12" rx="1" fill="#0b2a66"/><rect x="22" y="6" width="4" height="12" rx="1" fill="#0b2a66"/></svg>'
  };

  function toast(text, cls, ms) {
    var box = document.getElementById('toasts');
    var n = el('div', { class: 'toast ' + (cls || ''), text: text });
    box.appendChild(n);
    setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, ms || 2200);
  }
  function lvlDots(n) {
    var d = el('span', { class: 'lvl' });
    for (var i = 1; i <= 5; i++) d.appendChild(el('i', { class: i <= n ? 'on' : '' }));
    return d;
  }
  function ring(pct, done) {
    var c = 2 * Math.PI * 18, p = BW.clamp(pct, 0, 100);
    var col = done ? '#27c267' : '#5aa9ff';
    return el('div', {
      class: 'ring', html: '<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,.1)" stroke-width="4"/>' +
        (p ? '<circle cx="22" cy="22" r="18" fill="none" stroke="' + col + '" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + (c * p / 100) + ' ' + c + '"/>' : '') + '</svg>' +
        '<span>' + (done ? '✓' : p ? p + '%' : '') + '</span>'
    });
  }

  /* ---------- content helpers ---------- */
  function parseBody(body) {
    var blocks = [], para = [], list = null;
    function flush() { if (para.length) { blocks.push({ type: 'p', text: para.join(' ') }); para = []; } if (list) { blocks.push({ type: 'ul', items: list }); list = null; } }
    String(body || '').split(/\r?\n/).forEach(function (raw) {
      var line = raw.trim();
      if (!line) { flush(); return; }
      if (line.indexOf('@example') === 0) {
        flush();
        try { blocks.push({ type: 'ex', data: JSON.parse(line.slice(8).trim()) }); } catch (e) { BW.errors.push('article example JSON: ' + line.slice(0, 60)); }
      } else if (line.indexOf('## ') === 0) { flush(); blocks.push({ type: 'h', text: line.slice(3) }); }
      else if (line.indexOf('- ') === 0) { if (para.length) flush(); (list = list || []).push(line.slice(2)); }
      else { if (list) flush(); para.push(line); }
    });
    flush();
    return blocks;
  }
  function inline(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  }
  function articleExamples(a) {
    return parseBody(tr(a.body)).filter(function (b) { return b.type === 'ex'; }).map(function (b) { return b.data; });
  }
  function resolveItem(id) {
    var parts;
    if (id.indexOf('lhx:') === 0) {
      parts = id.split(':');
      var pat = BW.patternById(parts[1]); if (!pat) return null;
      var ex = BW.patternExercises(pat).filter(function (e) { return e.nameKey === parts[2]; })[0]; if (!ex) return null;
      ex.titleText = tr(pat.title) + ' — ' + t(ex.nameKey);
      ex.desc = pat.desc; ex.tip = pat.tip; ex.backHash = '#lh/' + pat.id;
      return ex;
    }
    if (id.indexOf('ex:') === 0) {
      parts = id.split(':');
      var art = BW.articles.filter(function (a) { return a.id === parts[1]; })[0]; if (!art) return null;
      var d = articleExamples(art)[parseInt(parts[2], 10)]; if (!d) return null;
      return { id: id, kind: 'example', titleText: d.title || t('example'), chords: d.chords, rh: d.rh, lh: d.lh, tempo: d.tempo || 100, level: 0, backHash: '#article/' + art.id, defaultHands: 'both' };
    }
    if (id.indexOf('jam:') === 0) {
      var j = BW.jams.filter(function (x) { return x.k === id.slice(4); })[0]; if (!j) return null;
      return { id: id, kind: 'jam', titleText: tr(j.title), desc: j.desc, tip: { nl: BW.t('jamHint'), en: BW.t('jamHint') }, chords: j.chords, lh: j.lh, rh: null, tempo: j.tempo, level: 0, backHash: '#jam', defaultHands: 'lh' };
    }
    var l = BW.lickById(id);
    if (!l) return null;
    var o = Object.assign({ kind: 'lick', backHash: '#licks', defaultHands: 'rh' }, l);
    o.titleText = tr(l.title);
    return o;
  }
  function validateAll() {
    BW.errors.length = 0;
    BW.licks.forEach(function (l) { BW.buildModel(l); });
    BW.patterns.forEach(function (p) { BW.patternExercises(p).forEach(function (e) { BW.buildModel(e); }); });
    BW.articles.forEach(function (a) {
      ['nl', 'en'].forEach(function (lang) {
        parseBody(a.body && a.body[lang]).forEach(function (b) { if (b.type === 'ex') BW.buildModel(Object.assign({ id: a.id + ' example (' + lang + ')' }, b.data)); });
      });
    });
    var seen = {}; BW.errors = BW.errors.filter(function (e) { if (seen[e]) return false; seen[e] = 1; return true; });
    if (BW.errors.length && window.console) console.warn('Content errors:\n' + BW.errors.join('\n'));
  }
  BW.validateAll = validateAll;

  /* ---------- course (fixed learning path) ---------- */
  function seen(k) { return !!BW.store.get('seen', {})[k]; }
  function markSeen(k, v) { var s = BW.store.get('seen', {}); if (v === false) delete s[k]; else s[k] = 1; BW.store.set('seen', s); }
  var EAR_NAMES = { int: ['Intervallen', 'Intervals'], chord: ['Akkoorden', 'Chords'], fn: ['Blues-trappen', 'Blues degrees'] };
  function courseItem(it) {
    var o = null, id;
    if (it.lick) {
      var l = BW.lickById(it.lick); if (!l) return null;
      o = { kind: l.cat === 'chorus' ? 'chorus' : 'lick', pid: l.id, title: tr(l.title), sub: t('cat_' + l.cat) + ' · ' + t('st_' + l.style) + ' · ' + t('level') + ' ' + l.level, href: '#practice/' + l.id, done: !!BW.getProgress(l.id).mastered, pct: BW.getProgress(l.id).best || 0 };
    } else if (it.lh) {
      id = 'lhx:' + it.lh; var ex = resolveItem(id); if (!ex) return null;
      o = { kind: 'lh', pid: id, title: ex.titleText, sub: t('exercise') + ' ' + ex.step + ' · ' + ex.chords.length + ' ' + t('bars'), href: '#practice/' + id, done: !!BW.getProgress(id).mastered, pct: BW.getProgress(id).best || 0 };
    } else if (it.read) {
      var a = BW.articles.filter(function (x) { return x.id === it.read; })[0]; if (!a) return null;
      o = { kind: 'read', title: tr(a.title), sub: t(a.section === 'styles' ? 'navStyles' : 'navTheory'), href: '#article/' + a.id, done: seen('read:' + a.id) };
    } else if (it.jam) {
      var j = BW.jams.filter(function (x) { return x.k === it.jam; })[0]; if (!j) return null;
      o = { kind: 'jam', title: tr(j.title), sub: t('cImprov'), href: '#practice/jam:' + j.k, done: seen('jam:' + j.k) };
    } else if (it.ear) {
      var es = BW.store.get('earquiz', {})[it.ear] || { level: 0 };
      o = { kind: 'ear', earKind: it.ear, title: t('earTitle') + ': ' + EAR_NAMES[it.ear][BW.settings.lang === 'en' ? 1 : 0], sub: t('cReachLevel') + ' ' + it.level, href: '#ear', done: es.level >= it.level - 1 && (it.level > 1 || es.total > 0) };
    } else if (it.task) {
      o = { kind: 'task', task: it.task, title: tr(it), sub: t('cTaskSub'), href: null, done: seen('task:' + it.task) };
    }
    return o;
  }
  function moduleItems(m) { return m.items.map(courseItem).filter(Boolean); }
  function moduleStat(m) {
    var its = moduleItems(m), done = its.filter(function (i) { return i.done; }).length;
    return { items: its, done: done, total: its.length, pct: its.length ? Math.round(done / its.length * 100) : 0 };
  }
  /* current module = the first one that is less than 80% complete */
  function currentModule() {
    var c = BW.course || [];
    for (var i = 0; i < c.length; i++) if (moduleStat(c[i]).pct < 80) return { m: c[i], n: i + 1 };
    return c.length ? { m: c[c.length - 1], n: c.length } : null;
  }
  BW.courseModuleOf = function (pid) {
    var c = BW.course || [];
    for (var i = 0; i < c.length; i++) for (var j = 0; j < c[i].items.length; j++) {
      var it = c[i].items[j];
      if (it.lick === pid || (it.lh && 'lhx:' + it.lh === pid) || (it.jam && 'jam:' + it.jam === pid)) return { m: c[i], n: i + 1 };
    }
    return null;
  };
  function courseRow(o, i, redraw) {
    var tag = { lick: 'Lick', chorus: t('cat_chorus'), lh: t('leftHand'), read: t('cRead'), jam: t('navJam'), ear: t('navEar'), task: t('cTask') }[o.kind];
    var kids = [
      el('div', { class: 'num ' + (o.done ? 'ok' : ''), text: o.done ? '✓' : String(i + 1) }),
      el('div', { class: 't' }, [el('b', { text: o.title }), el('span', { text: tag + ' · ' + o.sub + (o.pct && !o.done ? ' · ' + o.pct + '%' : '') })]),
      el('div', { class: 'go', text: o.kind === 'task' ? (o.done ? '↺' : '☐') : '›' })
    ];
    if (o.kind === 'task') {
      return el('button', { class: 'row task' + (o.done ? ' done' : ''), onclick: function () { markSeen('task:' + o.task, !o.done); redraw(); } }, kids);
    }
    return el('a', { class: 'row', href: o.href, onclick: function () {
      if (o.kind === 'ear') { var s = BW.store.get('earquiz', {}); s.kind = o.earKind; BW.store.set('earquiz', s); }
    } }, kids);
  }
  function courseView() {
    var cur = currentModule(), list = el('div', { class: 'rowlist' }), totalDone = 0, total = 0, weeks = 0;
    (BW.course || []).forEach(function (m, i) {
      var s = moduleStat(m); totalDone += s.done; total += s.total; weeks += m.weeks || 0;
      var isCur = cur && cur.m === m;
      list.appendChild(el('a', { class: 'row module' + (isCur ? ' cur' : ''), href: '#course/' + m.id }, [
        ring(s.pct, s.pct === 100),
        el('div', { class: 't' }, [
          el('b', { text: t('cModule') + ' ' + (i + 1) + ' · ' + tr(m.title) }),
          el('span', { text: s.done + '/' + s.total + ' ' + t('cParts') + ' · ± ' + m.weeks + ' ' + t(m.weeks === 1 ? 'cWeek' : 'cWeeks') + (isCur ? ' · ' + t('cHere') : '') })
        ]),
        el('div', { class: 'go', text: '›' })
      ]));
    });
    shell('course', [
      pageHead(t('courseTitle'), t('courseSub')),
      el('div', { class: 'card', style: 'margin-bottom:18px' }, [
        el('div', { style: 'display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:6px' }, [el('span', { text: t('cTotal') }), el('span', { text: totalDone + ' / ' + total + ' · ± ' + weeks + ' ' + t('cWeeks'), style: 'color:var(--muted)' })]),
        el('div', { class: 'bar' }, [el('i', { style: 'width:' + (total ? totalDone / total * 100 : 0) + '%' })]),
        el('div', { class: 'note', style: 'margin-top:10px', text: t('cRule') })
      ]),
      list
    ]);
  }
  function courseDetail(id) {
    var c = BW.course || [], idx = -1;
    c.forEach(function (m, i) { if (m.id === id) idx = i; });
    if (idx < 0) return courseView();
    var m = c[idx], s = moduleStat(m), list = el('div', { class: 'rowlist' });
    s.items.forEach(function (o, i) { list.appendChild(courseRow(o, i, function () { courseDetail(id); })); });
    var firstOpen = s.items.filter(function (o) { return !o.done && o.pid; })[0];
    var sessIds = s.items.filter(function (o) { return !o.done && o.pid; }).slice(0, 4).map(function (o) { return o.pid; });
    shell('course', [
      el('a', { class: 'back', href: '#course', html: '‹ ' + t('courseTitle') }),
      pageHead(t('cModule') + ' ' + (idx + 1) + ' · ' + tr(m.title), tr(m.goal)),
      el('div', { class: 'card', style: 'margin-bottom:18px' }, [
        el('div', { style: 'display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap' }, [
          el('div', { style: 'flex:1;min-width:200px' }, [
            el('div', { style: 'font-size:13.5px;margin-bottom:6px', text: s.done + ' / ' + s.total + ' ' + t('cParts') + ' · ± ' + m.weeks + ' ' + t(m.weeks === 1 ? 'cWeek' : 'cWeeks') }),
            el('div', { class: 'bar' }, [el('i', { style: 'width:' + s.pct + '%' })])
          ]),
          firstOpen ? el('a', { class: 'btn primary', href: '#practice/' + firstOpen.pid, text: '▶ ' + t('cPractise'), onclick: function () { BW.store.set('session', { ids: sessIds }); } }) : null
        ]),
        s.pct >= 80 && idx < c.length - 1 ? el('div', { style: 'margin-top:12px' }, [el('a', { class: 'btn small', href: '#course/' + c[idx + 1].id, text: t('cNextModule') + ' ›' })]) : null
      ]),
      list
    ]);
  }

  /* ---------- shell ---------- */
  function rail(active) {
    var items = [['home', 'navHome'], ['course', 'navCourse'], ['licks', 'navLicks'], ['lh', 'navLh'], ['jam', 'navJam'], ['ear', 'navEar'], ['theory', 'navTheory'], ['styles', 'navStyles']];
    var r = el('nav', { class: 'rail' }, [el('div', { class: 'logo', html: ICON.logo })]);
    items.forEach(function (it) {
      r.appendChild(el('a', { href: '#' + it[0], class: active === it[0] ? 'on' : '', html: ICON[it[0]] + '<span>' + t(it[1]) + '</span>' }));
    });
    r.appendChild(el('div', { class: 'spacer' }));
    var st = BW.input.status.state;
    r.appendChild(el('a', { href: '#settings', class: active === 'settings' ? 'on' : '', html: ICON.settings + '<span><i class="midi-dot ' + (st === 'connected' ? 'on' : '') + '"></i> MIDI</span>' }));
    return r;
  }
  function shell(active, children) {
    app.innerHTML = '';
    app.appendChild(rail(active));
    var main = el('main', { class: 'view' }, [el('div', { class: 'wrap' }, children)]);
    app.appendChild(main);
    return main;
  }
  function pageHead(title, sub) {
    return el('div', { class: 'page-head' }, [el('div', null, [el('h1', { text: title }), sub ? el('p', { text: sub }) : null])]);
  }
  function lickCard(l) {
    var p = BW.getProgress(l.id);
    var c = el('a', { class: 'card', href: '#practice/' + l.id }, [
      ring(p.best || 0, !!p.mastered),
      el('h3', { text: tr(l.title) }),
      el('p', { text: tr(l.desc) }),
      el('div', { class: 'tags' }, [
        lvlDots(l.level),
        el('span', { class: 'tag blue', text: t('cat_' + l.cat) }),
        el('span', { class: 'tag', text: t('st_' + l.style) }),
        el('span', { class: 'tag', text: l.tempo + ' ' + t('bpm') })
      ])
    ]);
    return c;
  }

  /* ---------- home ---------- */
  function nextLhStep() {
    for (var i = 0; i < BW.patterns.length; i++) {
      var exs = BW.patternExercises(BW.patterns[i]);
      for (var j = 0; j < exs.length; j++) if (!BW.getProgress(exs[j].id).mastered) return { ex: exs[j], pat: BW.patterns[i] };
    }
    return null;
  }
  function homeView() {
    var licks = BW.licks, mastered = 0, learning = 0;
    licks.forEach(function (l) { var s = BW.status(l.id); if (s === 'mastered') mastered++; else if (s === 'learning') learning++; });
    var lhDone = 0, lhTotal = 0;
    BW.patterns.forEach(function (p) { BW.patternExercises(p).forEach(function (e) { lhTotal++; if (!!BW.getProgress(e.id).mastered) lhDone++; }); });
    var last = BW.store.get('last', null), lastItem = last && resolveItem(last);
    var sorted = licks.slice().sort(function (a, b) { return a.level - b.level; });
    var firstNew = sorted.filter(function (l) { return BW.status(l.id) === 'new'; })[0];
    /* the course decides what comes next; the library order is only the fallback */
    var cur = currentModule(), cStat = cur && moduleStat(cur.m), cOpen = cStat ? cStat.items.filter(function (o) { return !o.done; }) : [];
    var cLick = cOpen.filter(function (o) { return o.kind === 'lick' || o.kind === 'chorus'; })[0];
    var cLh = cOpen.filter(function (o) { return o.kind === 'lh'; })[0];
    var cRead = cOpen.filter(function (o) { return o.kind === 'read'; })[0];
    if (cLick) firstNew = BW.lickById(cLick.pid);

    var hero = el('div', { class: 'hero' }, [
      el('div', { class: 'eyebrow', text: 'Boogie Woogie Studio', style: 'color:rgba(255,255,255,.8)' }),
      el('h1', { text: t('heroTitle') }),
      el('p', { text: t('heroText') }),
      lastItem ? el('a', { class: 'btn white', href: '#practice/' + last, text: '▶  ' + t('continue') + ': ' + lastItem.titleText })
        : (firstNew ? el('a', { class: 'btn white', href: '#practice/' + firstNew.id, text: '▶  ' + t('startFirst') }) : null),
      el('div', { class: 'keys', html: '<svg viewBox="0 0 420 160">' + (function () { var s = ''; for (var i = 0; i < 14; i++) s += '<rect x="' + (i * 30) + '" y="0" width="28" height="160" rx="5" fill="#fff"/>'; [0, 1, 3, 4, 5, 7, 8, 10, 11, 12].forEach(function (i) { s += '<rect x="' + (i * 30 + 20) + '" y="0" width="18" height="98" rx="4" fill="#0b2a66"/>'; }); return s; })() + '</svg>' })
    ]);
    var stats = el('div', { class: 'stats' }, [
      el('div', { class: 'card stat' }, [el('b', { text: String(mastered) }), el('span', { text: t('statMastered') })]),
      el('div', { class: 'card stat' }, [el('b', { text: String(learning) }), el('span', { text: t('statLearning') })]),
      el('div', { class: 'card stat' }, [el('b', { text: lhDone + '/' + lhTotal }), el('span', { text: t('statLh') })]),
      el('div', { class: 'card stat' }, [el('b', { text: String(BW.getStreak()) }), el('span', { text: t('statStreak') })])
    ]);

    var rows = [];
    if (cRead) rows.push({ href: cRead.href, tag: t('cRead'), title: cRead.title, sub: t('cModule') + ' ' + cur.n });
    var lhn = nextLhStep();
    if (cLh) rows.push({ id: cLh.pid, tag: t('leftHand'), title: cLh.title, sub: cLh.sub });
    else if (lhn) rows.push({ id: lhn.ex.id, tag: t('leftHand'), title: tr(lhn.pat.title), sub: t('exercise') + ' ' + lhn.ex.step + ' — ' + t(lhn.ex.nameKey) });
    var due = BW.dueLicks().slice(0, 3);
    due.sort(function () { return Math.random() - 0.5; });           // interleave: never the same order twice
    due.forEach(function (l) { rows.push({ id: l.id, tag: t('review'), cls: 'ok', title: tr(l.title), sub: t('cat_' + l.cat) + ' · ' + t('st_' + l.style) }); });
    var inProg = sorted.filter(function (l) { return BW.status(l.id) === 'learning' && due.indexOf(l) < 0 && l !== firstNew; }).slice(0, 2);
    inProg.forEach(function (l) { rows.push({ id: l.id, tag: t('stLearning'), title: tr(l.title), sub: (BW.getProgress(l.id).best || 0) + '% · ' + t('cat_' + l.cat) }); });
    if (firstNew && due.indexOf(firstNew) < 0) rows.push({ id: firstNew.id, tag: cLick ? t('cModule') + ' ' + cur.n : t('newLick'), title: tr(firstNew.title), sub: t('level') + ' ' + firstNew.level + ' · ' + t('cat_' + firstNew.cat) });
    rows.forEach(function (r) { if (!r.href) r.href = '#practice/' + r.id; });
    var sessRows = rows.filter(function (r) { return r.id; });
    var today = el('div', null, [el('div', { class: 'sect', style: 'display:flex;justify-content:space-between;align-items:center' }, [
      el('span', { text: t('today') + ' · ' + t('practicedToday').toLowerCase() + ' ' + BW.timeToday() + ' ' + t('min') }),
      sessRows.length ? el('a', { class: 'btn primary small', href: sessRows[0].href, text: '▶ ' + t('startSession'), style: 'letter-spacing:0;text-transform:none', onclick: function () {
        BW.store.set('session', { ids: sessRows.map(function (r) { return r.id; }) });
      } }) : null
    ])]);
    var list = el('div', { class: 'rowlist' });
    rows.forEach(function (r, i) {
      list.appendChild(el('a', { class: 'row', href: r.href }, [
        el('div', { class: 'num ' + (r.cls || ''), text: String(i + 1) }),
        el('div', { class: 't' }, [el('b', { text: r.title }), el('span', { text: r.tag + ' · ' + r.sub })]),
        el('div', { class: 'go', text: '›' })
      ]));
    });
    if (!rows.length) list.appendChild(el('div', { class: 'empty', text: t('todayEmpty') }));
    today.appendChild(list);

    var right = el('div', null, []);
    if (cur) {
      right.appendChild(el('div', { class: 'sect', text: t('navCourse') }));
      right.appendChild(el('a', { class: 'card', href: '#course/' + cur.m.id, style: 'margin-bottom:20px' }, [
        ring(cStat.pct, cStat.pct === 100),
        el('div', { class: 'eyebrow', text: t('cModule') + ' ' + cur.n + ' / ' + BW.course.length }),
        el('h3', { text: tr(cur.m.title), style: 'margin-top:4px' }),
        el('p', { text: tr(cur.m.goal) }),
        el('div', { class: 'tags' }, [el('span', { class: 'tag blue', text: cStat.done + '/' + cStat.total + ' ' + t('cParts') })])
      ]));
    }
    right.appendChild(el('div', { class: 'sect', text: t('progressByLevel') }));
    var pc = el('div', { class: 'card' });
    for (var lv = 1; lv <= 5; lv++) {
      var set = licks.filter(function (l) { return l.level === lv; });
      if (!set.length) continue;
      var done = set.filter(function (l) { return BW.status(l.id) === 'mastered'; }).length;
      pc.appendChild(el('div', { style: 'margin-bottom:12px' }, [
        el('div', { style: 'display:flex;justify-content:space-between;font-size:13.5px;margin-bottom:5px' }, [el('span', { text: t('level') + ' ' + lv }), el('span', { text: done + ' / ' + set.length, style: 'color:var(--muted)' })]),
        el('div', { class: 'bar' }, [el('i', { style: 'width:' + (done / set.length * 100) + '%' })])
      ]));
    }
    right.appendChild(pc);
    right.appendChild(el('div', { class: 'sect', text: t('method'), style: 'margin-top:20px' }));
    right.appendChild(el('div', { class: 'card' }, [el('div', { class: 'method' }, ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'].map(function (k) { return el('div', { text: t(k) }); }))]));

    shell('home', [hero, stats, el('div', { class: 'two' }, [today, right])]);
  }

  /* ---------- licks ---------- */
  var filt = BW.store.get('filters', { level: 0, cat: '', style: '', status: '' });
  function licksView() {
    var gridBox = el('div', { class: 'grid' });
    function chipRow(label, key, opts) {
      var row = el('div', { class: 'chips' }, [el('span', { class: 'lbl', text: label })]);
      opts.forEach(function (o) {
        row.appendChild(el('button', {
          class: 'chip' + (filt[key] === o[0] ? ' on' : ''), text: o[1], onclick: function () {
            filt[key] = o[0]; BW.store.set('filters', filt); licksView();
          }
        }));
      });
      return row;
    }
    var cats = [], styles = [];
    BW.licks.forEach(function (l) { if (cats.indexOf(l.cat) < 0) cats.push(l.cat); if (styles.indexOf(l.style) < 0) styles.push(l.style); });
    var list = BW.licks.filter(function (l) {
      return (!filt.level || l.level === filt.level) && (!filt.cat || l.cat === filt.cat) && (!filt.style || l.style === filt.style) && (!filt.status || BW.status(l.id) === filt.status);
    }).sort(function (a, b) { return a.level - b.level; });
    list.forEach(function (l) { gridBox.appendChild(lickCard(l)); });
    if (!list.length) gridBox.appendChild(el('div', { class: 'empty', text: t('noResults') }));
    shell('licks', [
      pageHead(t('licksTitle'), t('licksSub')),
      chipRow(t('fLevel'), 'level', [[0, t('all')], [1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5']]),
      chipRow(t('fCat'), 'cat', [['', t('all')]].concat(cats.map(function (c) { return [c, t('cat_' + c)]; }))),
      chipRow(t('fStyle'), 'style', [['', t('all')]].concat(styles.map(function (c) { return [c, t('st_' + c)]; }))),
      chipRow(t('fStatus'), 'status', [['', t('all')], ['new', t('stNew')], ['learning', t('stLearning')], ['mastered', t('stMastered')]]),
      el('div', { style: 'height:8px' }), gridBox
    ]);
  }

  /* ---------- ear training ---------- */
  function earView() {
    var mount = el('div');
    shell('ear', [pageHead(t('earTitle'), t('earSub')), mount]);
    BW.earQuiz(mount);
    cleanup = function () { if (BW.audio.ready) BW.audio.stopAll(); };
  }

  /* ---------- backing tracks ---------- */
  function jamView() {
    var g = el('div', { class: 'grid' });
    BW.jams.forEach(function (j) {
      var pat = BW.patternById(j.lh);
      g.appendChild(el('a', { class: 'card', href: '#practice/jam:' + j.k }, [
        el('h3', { text: tr(j.title), style: 'padding-right:0' }), el('p', { text: tr(j.desc) }),
        el('div', { class: 'tags' }, [el('span', { class: 'tag blue', text: j.chords.length + ' ' + t('bars') }), el('span', { class: 'tag', text: j.tempo + ' ' + t('bpm') }), pat ? el('span', { class: 'tag', text: 'LH: ' + tr(pat.title) }) : null])
      ]));
    });
    shell('jam', [pageHead(t('jamTitle'), t('jamSub')), g]);
  }

  /* ---------- left hand ---------- */
  function lhView() {
    var g = el('div', { class: 'grid' });
    BW.patterns.forEach(function (p) {
      var exs = BW.patternExercises(p), done = exs.filter(function (e) { return !!BW.getProgress(e.id).mastered; }).length;
      g.appendChild(el('a', { class: 'card', href: '#lh/' + p.id }, [
        ring(Math.round(done / exs.length * 100), done === exs.length),
        el('h3', { text: tr(p.title) }), el('p', { text: tr(p.desc) }),
        el('div', { class: 'tags' }, [lvlDots(p.level), el('span', { class: 'tag', text: t('st_' + p.style) }), el('span', { class: 'tag', text: p.tempo + ' ' + t('bpm') }), el('span', { class: 'tag blue', text: done + '/' + exs.length + ' ' + t('steps').toLowerCase() })])
      ]));
    });
    shell('lh', [pageHead(t('lhTitle'), t('lhSub')), g]);
  }
  function lhDetail(id) {
    var p = BW.patternById(id); if (!p) return lhView();
    var exs = BW.patternExercises(p);
    var preview = el('div', { class: 'example' });
    var list = el('div', { class: 'rowlist' });
    exs.forEach(function (e) {
      var pr = BW.getProgress(e.id), ok = !!pr.mastered;
      list.appendChild(el('a', { class: 'row', href: '#practice/' + e.id }, [
        el('div', { class: 'num ' + (ok ? 'ok' : ''), text: ok ? '✓' : String(e.step) }),
        el('div', { class: 't' }, [el('b', { text: t(e.nameKey) }), el('span', { text: (pr.best ? pr.best + '% · ' : '') + e.chords.length + ' ' + t('bars') })]),
        el('div', { class: 'go', text: '›' })
      ]));
    });
    shell('lh', [
      el('a', { class: 'back', href: '#lh', html: '‹ ' + t('lhTitle') }),
      pageHead(tr(p.title), tr(p.desc)),
      el('div', { class: 'two' }, [
        el('div', null, [el('div', { class: 'sect', text: t('steps') }), list]),
        el('div', null, [el('div', { class: 'sect', text: t('example') }), preview,
          el('div', { class: 'card' }, [el('div', { class: 'eyebrow', text: t('tip') }), el('div', { class: 'note', style: 'color:#dbe8fa;font-size:15px;margin-top:6px', text: tr(p.tip) })])])
      ])
    ]);
    exampleBlock(preview, { title: tr(p.title) + ' — C · F · G', tempo: Math.round(p.tempo * 0.8), chords: ['C7', 'F7', 'G7'], lh: p.id }, 'lhx:' + p.id + ':exChanges');
    cleanup = stopExample;
  }

  /* ---------- articles ---------- */
  var exTrainer = null;
  function stopExample() { if (exTrainer) { exTrainer.destroy(); exTrainer = null; } }
  function exampleBlock(box, data, practiceId) {
    var model = BW.buildModel(Object.assign({ id: 'example' }, data));
    var sc = el('div');
    var playBtn = el('button', { class: 'btn small primary', text: '▶ ' + t('listen') });
    var head = el('div', { class: 'ex-head' }, [el('b', { text: data.title || t('example') }),
      el('div', { style: 'display:flex;gap:8px' }, [playBtn, practiceId ? el('a', { class: 'btn small', href: '#practice/' + practiceId, text: t('practiceThis') }) : null])]);
    box.appendChild(head); box.appendChild(sc);
    var handle = null;
    function draw() { if (BW.score) handle = BW.score.render(sc, model, { barsPerRow: Math.min(model.bars, sc.clientWidth > 620 ? 2 : 1), showFingers: true, activeHands: ['rh', 'lh'], compact: true }); }
    draw();
    playBtn.addEventListener('click', function () {
      var mine = exTrainer && exTrainer._box === box;
      stopExample();
      document.querySelectorAll('.ex-play-on').forEach(function (b) { b.classList.remove('ex-play-on'); b.textContent = '▶ ' + t('listen'); });
      if (mine) return;
      BW.audio.init();
      exTrainer = new BW.Trainer({ id: 'example', model: model, score: handle, roll: null, plain: true, hands: 'both', emit: function (type, st) {
        if (type === 'listenEnd' || (type === 'state' && !st)) { playBtn.textContent = '▶ ' + t('listen'); playBtn.classList.remove('ex-play-on'); }
        if (type === 'listenEnd') setTimeout(function () { if (exTrainer && exTrainer._box === box) stopExample(); }, 0);
      } });
      exTrainer._box = box;
      model.tempo = data.tempo || 100;
      exTrainer.listen(true);
      playBtn.textContent = '■ ' + t('stop'); playBtn.classList.add('ex-play-on');
    });
  }
  function articleList(section) {
    var g = el('div', { class: 'grid' });
    BW.articles.filter(function (a) { return a.section === section; }).sort(function (a, b) { return (a.order || 0) - (b.order || 0); }).forEach(function (a, i) {
      var first = parseBody(tr(a.body)).filter(function (b) { return b.type === 'p'; })[0];
      g.appendChild(el('a', { class: 'card', href: '#article/' + a.id }, [
        el('div', { class: 'eyebrow', text: (section === 'theory' ? t('navTheory') : t('navStyles')) + ' ' + (i + 1) }),
        el('h3', { text: tr(a.title), style: 'margin-top:4px;padding-right:0' }),
        el('p', { text: first ? first.text.replace(/\*\*/g, '') : '' })
      ]));
    });
    shell(section, [pageHead(t(section + 'Title'), t(section + 'Sub')), g]);
  }
  function articleView(id) {
    var a = BW.articles.filter(function (x) { return x.id === id; })[0];
    if (!a) return articleList('theory');
    markSeen('read:' + a.id);
    var body = el('div', { class: 'article' }), exIdx = 0, pending = [];
    parseBody(tr(a.body)).forEach(function (b) {
      if (b.type === 'h') body.appendChild(el('h2', { text: b.text }));
      else if (b.type === 'p') body.appendChild(el('p', { html: inline(b.text) }));
      else if (b.type === 'ul') body.appendChild(el('ul', null, b.items.map(function (i) { return el('li', { html: inline(i) }); })));
      else if (b.type === 'ex') { var box = el('div', { class: 'example' }); body.appendChild(box); pending.push([box, b.data, 'ex:' + a.id + ':' + exIdx++]); }
    });
    var extra = [];
    if (a.section === 'styles' && a.style) {
      var ls = BW.licks.filter(function (l) { return l.style === a.style; }).sort(function (x, y) { return x.level - y.level; });
      if (ls.length) { extra.push(el('div', { class: 'sect', text: t('licksInStyle'), style: 'margin-top:28px' })); extra.push(el('div', { class: 'grid' }, ls.map(lickCard))); }
    }
    shell(a.section, [
      el('a', { class: 'back', href: '#' + a.section, html: '‹ ' + t(a.section + 'Title') }),
      el('div', { class: 'page-head' }, [el('h1', { text: tr(a.title) })]), body
    ].concat(extra));
    pending.forEach(function (p) { exampleBlock(p[0], p[1], p[2]); });
    cleanup = stopExample;
  }

  /* ---------- settings ---------- */
  function switchEl(on, fn) {
    var s = el('button', { class: 'switch' + (on ? ' on' : '') });
    s.addEventListener('click', function () { var v = !s.classList.contains('on'); s.classList.toggle('on', v); fn(v); });
    return s;
  }
  function opt(label, sub, control) {
    return el('div', { class: 'opt' }, [el('div', null, [label, sub ? el('small', { text: sub }) : null]), control]);
  }
  function segEl(options, value, fn) {
    var s = el('div', { class: 'seg' });
    options.forEach(function (o) {
      var b = el('button', { class: o[0] === value ? 'on' : '', text: o[1] });
      if (o[2]) b.disabled = true;
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(s.children, function (c) { c.classList.remove('on'); });
        b.classList.add('on'); fn(o[0]);
      });
      s.appendChild(b);
    });
    return s;
  }
  function setS(k, v) { BW.settings[k] = v; BW.saveSettings(); }
  function range(key, min, max, step, fn, fmt) {
    var out = el('span', { style: 'font-size:12.5px;color:var(--muted);min-width:44px;text-align:right', text: fmt ? fmt(BW.settings[key]) : '' });
    var r = el('input', { type: 'range', min: min, max: max, step: step, value: BW.settings[key] });
    r.addEventListener('input', function () { var v = parseFloat(r.value); setS(key, v); if (fmt) out.textContent = fmt(v); if (fn) fn(v); });
    return el('div', { style: 'display:flex;align-items:center;gap:8px' }, [r, out]);
  }
  function ladderOptions() {
    return [
      opt(t('startPct'), null, segEl([[50, '50%'], [60, '60%'], [70, '70%'], [80, '80%']], BW.settings.startPct, function (v) { setS('startPct', v); })),
      opt(t('stepPct'), null, segEl([[5, '5%'], [10, '10%'], [15, '15%']], BW.settings.stepPct, function (v) { setS('stepPct', v); })),
      opt(t('cleanNeeded'), null, segEl([[1, '1×'], [2, '2×'], [3, '3×'], [4, '4×']], BW.settings.cleanNeeded, function (v) { setS('cleanNeeded', v); }))
    ];
  }
  function midiText() {
    var s = BW.input.status;
    if (s.state === 'connected') return t('midiConnected') + ': ' + s.names.join(', ');
    if (s.state === 'none') return t('midiNone');
    if (s.state === 'denied') return t('midiDenied');
    if (s.state === 'unsupported') return t('midiUnsupported');
    return '…';
  }
  function settingsView() {
    var midiNote = el('div', { class: 'note', text: midiText() });
    shell('settings', [
      pageHead(t('settingsTitle')),
      el('div', { class: 'settings' }, [
        el('div', { class: 'card' }, [el('h3', { text: t('language') }),
          segEl([['nl', 'Nederlands'], ['en', 'English']], BW.settings.lang, function (v) { setS('lang', v); document.documentElement.lang = v; settingsView(); })]),
        el('div', { class: 'card' }, [el('h3', { html: '<i class="midi-dot ' + (BW.input.status.state === 'connected' ? 'on' : '') + '"></i> ' + t('midi') }), midiNote,
          el('div', { style: 'margin-top:12px' }, [el('button', { class: 'btn small', text: t('retry'), onclick: function () { BW.input.retry(); setTimeout(settingsView, 600); } })]),
          opt(t('userSound'), t('userSoundSub'), switchEl(BW.settings.userSound, function (v) { setS('userSound', v); })),
          opt(t('latency'), t('latencySub'), range('latencyMs', -60, 200, 5, null, function (v) { return v + ' ms'; }))]),
        el('div', { class: 'card' }, [el('h3', { text: t('ladder') })].concat(ladderOptions())),
        el('div', { class: 'card' }, [el('h3', { text: t('data') }),
          el('button', { class: 'btn small', text: t('reset'), onclick: function () { if (confirm(t('resetConfirm'))) { BW.progress = {}; BW.store.set('progress', {}); BW.store.set('streak', { day: '', count: 0 }); BW.store.set('last', null); toast('OK'); } } })]),
        el('div', { class: 'card' }, [el('h3', { text: t('credits') }), el('div', { class: 'note', text: t('creditsText') })]),
        el('div', { class: 'card' }, [el('h3', { text: t('contentErrors') }),
          el('div', { class: 'note', text: BW.licks.length + ' licks · ' + BW.patterns.length + ' ' + t('navLh').toLowerCase() + ' · ' + BW.articles.length + ' ' + t('navTheory').toLowerCase() + '/' + t('navStyles').toLowerCase() + ' · ' + (BW.errors.length ? BW.errors.length + ' ⚠' : '✓') }),
          BW.errors.length ? el('div', { class: 'note', style: 'white-space:pre-wrap;margin-top:8px;font-size:12px', text: BW.errors.join('\n') }) : null])
      ])
    ]);
  }

  /* ---------- practice ---------- */
  function practiceView(id) {
    var startKey = 'C', at = id.lastIndexOf('@');
    if (at > 0 && BW.KEYS[id.slice(at + 1)]) { startKey = id.slice(at + 1); id = id.slice(0, at); }
    var item = resolveItem(id);
    if (!item) { location.hash = '#licks'; return; }
    if (item.kind !== 'example') BW.store.set('last', id);
    var S = BW.settings;
    var key = startKey, lhOverride = null, view = S.view || 'both', infoOpen = BW.store.get('infoOpen', true);
    var model = BW.buildModel(item, { key: startKey });
    var scoreH = null, rollH = null, trainer = null, lastResult = null;
    var isJam = item.kind === 'jam';
    var canPattern = (item.kind === 'lick' || isJam) && typeof item.lh === 'string';

    app.innerHTML = '';
    var root = el('div', { class: 'practice view-' + view });
    app.appendChild(root);

    /* top bar */
    var sub = item.kind === 'lick' ? t('cat_' + item.cat) + ' · ' + t('st_' + item.style) + ' · ' + t('level') + ' ' + item.level
      : item.kind === 'exercise' ? t('exercise') + ' ' + item.step + ' · ' + t('level') + ' ' + item.level : isJam ? t('jamKind') : t('example');
    var chordLine = el('span');
    var keySel = el('select', { class: 'sel', title: t('key') });
    BW.KEY_ORDER.forEach(function (k) { keySel.appendChild(el('option', { value: k, text: t('key') + ': ' + k })); });
    keySel.value = key;
    keySel.addEventListener('change', function () { key = keySel.value; rebuild(); });
    var patSel = null;
    if (canPattern) {
      patSel = el('select', { class: 'sel', title: t('lhPattern') });
      BW.patterns.forEach(function (p) { patSel.appendChild(el('option', { value: p.id, text: 'LH: ' + tr(p.title) })); });
      patSel.value = item.lh;
      patSel.addEventListener('change', function () { lhOverride = patSel.value === item.lh ? null : patSel.value; rebuild(); });
    }
    var sess = BW.store.get('session', null), si = sess && sess.ids ? sess.ids.indexOf(id) : -1, nextBtn = null;
    if (si >= 0) {
      var lastStep = si === sess.ids.length - 1;
      sub = t('session') + ' ' + (si + 1) + '/' + sess.ids.length + ' · ' + sub;
      nextBtn = el('a', { class: 'btn small primary', href: lastStep ? '#home' : '#practice/' + sess.ids[si + 1], text: lastStep ? '✓ ' + t('sessionDone') : t('next') + ' ›',
        onclick: function () { if (lastStep) BW.store.set('session', null); } });
    }
    var infoBtn = el('button', { class: 'icon-btn' + (infoOpen ? ' on' : ''), html: ICON.info });
    var mixBtn = el('button', { class: 'icon-btn', html: ICON.mixer });
    var viewSeg = segEl([['score', t('viewScore')], ['roll', t('viewRoll')], ['both', t('viewBoth')], ['blind', t('viewBlind')]], view, function (v) {
      view = v; if (v !== 'blind') setS('view', v); root.className = 'practice view-' + v + (isJam ? ' is-jam' : ''); trainer.stop(); layout();
    });
    root.appendChild(el('div', { class: 'p-top' }, [
      el('a', { class: 'icon-btn', href: /^#(course|home)/.test(cameFrom) ? cameFrom : item.backHash, html: ICON.back }),
      el('div', { class: 'ttl' }, [el('b', { text: item.titleText }), el('span', null, [sub + ' · ' + model.bars + ' ' + t('bars') + ' · ', chordLine])]),
      nextBtn, patSel, keySel, viewSeg, infoBtn, mixBtn
    ]));
    var info = el('div', { class: 'p-info' });
    root.appendChild(info);
    function drawInfo() {
      info.style.display = infoOpen ? '' : 'none';
      info.innerHTML = '';
      if (item.desc) info.appendChild(el('div', { text: tr(item.desc) }));
      if (item.tip) info.appendChild(el('div', { class: 'tip', html: '<b>' + t('tip') + ':</b> ' + inline(tr(item.tip)) }));
      if (!item.desc && !item.tip) info.appendChild(el('div', { text: t('readyHint') }));
      if (key !== 'C') info.appendChild(el('div', { class: 'warn', text: '⚠ ' + t('transposedWarn') }));
      else if (lhOverride) { /* nothing */ }
    }
    infoBtn.addEventListener('click', function () { infoOpen = !infoOpen; BW.store.set('infoOpen', infoOpen); infoBtn.classList.toggle('on', infoOpen); drawInfo(); layout(); });
    mixBtn.addEventListener('click', openMixer);

    /* stage */
    var scoreWrap = el('div', { class: 'score-wrap' });
    var rollWrap = el('div', { class: 'roll-wrap' });
    var rollInner = el('div', { style: 'position:absolute;inset:0' });
    var countin = el('div', { class: 'countin' });
    rollWrap.appendChild(rollInner); rollWrap.appendChild(countin);
    var result = el('div', { class: 'result' });
    rollWrap.appendChild(result);
    root.appendChild(el('div', { class: 'p-stage' }, [scoreWrap, rollWrap]));

    /* transport */
    var listenBtn = el('button', { class: 'btn primary', text: '▶ ' + t('listen') });
    var listenSlowBtn = el('button', { class: 'btn', text: '▶ ' + t('listenSlow') });
    var handsBox = el('div'), modeBox = el('div');
    var tempoVal = el('div', { class: 'val' });
    var minus = el('button', { class: 'icon-btn', text: '−' }), plus = el('button', { class: 'icon-btn', text: '+' });
    var autoSw = switchEl(true, function (v) { trainer.auto = v; });
    var playBtn = el('button', { class: 'play-btn' });
    var againBtn = el('button', { class: 'btn', text: '↻ ' + t('earAgain'), style: 'display:none', onclick: function () { trainer.earReplay(); } });
    root.appendChild(el('div', { class: 'p-bar' }, [
      el('div', { class: 'grp' }, [el('span', { class: 'cap', text: '1 · ' + t('listen') }), el('div', { style: 'display:flex;gap:8px;align-items:center' }, [listenBtn, listenSlowBtn])]),
      el('div', { class: 'grp' }, [el('span', { class: 'cap', text: '2 · ' + t('hands') }), handsBox]),
      el('div', { class: 'grp' }, [el('span', { class: 'cap', text: t('mode') }), modeBox]),
      el('div', { class: 'grp' }, [el('span', { class: 'cap', text: '3 · ' + t('tempo') + ' · ' + t('auto') }), el('div', { class: 'tempo' }, [minus, tempoVal, plus, autoSw])]),
      el('div', { style: 'flex:1' }), againBtn, playBtn
    ]));

    var pr = BW.getProgress(id);
    trainer = new BW.Trainer({ id: id, model: model, score: null, roll: null, hands: item.defaultHands || 'both', emit: onEvent, jam: isJam });
    if (trainer.practiced().length === 0) trainer.hands = 'both';
    BW._trainer = trainer;
    trainer.pct = pr.pct ? BW.clamp(pr.pct, S.startPct, 100) : S.startPct;
    if (pr.best >= 100) trainer.pct = 100;

    function drawHands() {
      handsBox.innerHTML = '';
      handsBox.appendChild(segEl([['rh', t('rh'), !model.has.rh], ['lh', t('lh'), !model.has.lh], ['both', t('both'), !(model.has.rh && model.has.lh)]],
        (model.has.rh && model.has.lh) ? trainer.hands : (model.has.rh ? 'rh' : 'lh'), function (v) { trainer.setHands(v); renderScore(); sync(); }));
    }
    modeBox.appendChild(segEl([['tempo', t('modeTempo')], ['wait', t('modeWait')], ['ear', t('modeEar')]], 'tempo', function (v) { lastResult = null; trainer.setMode(v); sync(); }));

    function sync() {
      var run = trainer.running;
      var going = run === 'tempo' || run === 'wait' || run === 'ear' || (isJam && run === 'listen');
      root.classList.toggle('ear-on', run === 'ear');
      againBtn.style.display = run === 'ear' ? '' : 'none';
      playBtn.className = 'play-btn' + (going ? ' stop' : '');
      playBtn.textContent = going ? '■  ' + t('stop') : '▶  ' + (isJam ? t('jamStart') : t('start'));
      listenBtn.textContent = run === 'listen' ? '■ ' + t('stop') : '▶ 100%';
      listenSlowBtn.textContent = '▶ ' + trainer.pct + '%';
      listenSlowBtn.style.display = trainer.pct === 100 ? 'none' : '';
      var steps = [], st = S.startPct;
      for (var p = Math.min(st, trainer.pct); p <= 100; p += S.stepPct) steps.push(p);
      if (steps[steps.length - 1] !== 100) steps.push(100);
      tempoVal.innerHTML = '<b>' + trainer.pct + '%</b><span>' + Math.round(trainer.bpm()) + ' ' + t('ofTarget') + ' ' + model.tempo + ' ' + t('bpm') + '</span>' +
        '<div class="ladder">' + steps.map(function (p) { return '<i class="' + (p < trainer.pct ? 'on' : p === trainer.pct ? 'cur' : '') + '"></i>'; }).join('') + '</div>';
      if (isJam) result.textContent = '';
      else if (!lastResult && run !== 'ear') result.textContent = trainer.mode === 'wait' ? t('waitHint') : trainer.mode === 'ear' ? t('earHint') : t('readyHint');
    }
    function showResult(r) {
      lastResult = r;
      if (r.ear) {
        result.innerHTML = r.clean ? '<b class="good">✓ ' + t('earClean') + '</b>' : '<b class="mid">' + r.errors + ' ' + t('earErr') + (r.hints ? ' · ' + r.hints + ' ' + t('earHints') : '') + '</b>';
        return;
      }
      if (r.wait) {
        result.innerHTML = r.clean ? '<b class="good">✓ ' + t('resWaitClean') + '</b>' : '<b class="mid">' + r.errors + ' ' + t('resWaitErr') + '</b>';
        return;
      }
      var pct = Math.round(r.score * 100), cls = pct >= 95 ? 'good' : pct >= 70 ? 'mid' : 'low';
      var off = Math.abs(r.offsetMs) < 18 ? t('resOnTime') : Math.abs(r.offsetMs) + ' ms ' + (r.offsetMs > 0 ? t('resLate') : t('resEarly'));
      var dots = '';
      for (var i = 0; i < r.needed; i++) dots += '<i class="' + (i < r.cleanStreak ? 'on' : '') + '"></i>';
      result.innerHTML = '<b class="' + cls + '">' + pct + '% ' + t('resAccuracy') + '</b>' + off + ' · ' + r.misses + ' ' + t('resMissed') + ' · ' + r.extras + ' ' + t('resExtra') +
        '<br>' + t('resClean') + ' <span class="streak-dots">' + dots + '</span>';
    }
    function onEvent(type, d) {
      if (type === 'state') { if (!d) countin.textContent = ''; sync(); }
      else if (type === 'tempo') { if (d.dir > 0) toast('▲ ' + t('tempoUp') + ' → ' + d.pct + '%', 'up'); else if (d.dir < 0) toast('▼ ' + t('tempoDown') + ' → ' + d.pct + '%', 'down'); sync(); }
      else if (type === 'result') showResult(d);
      else if (type === 'mastered') toast('★ ' + t(d && d.full ? 'masteredFull' : 'masteredPart'), 'star', 5000);
      else if (type === 'countin') countin.textContent = d > 0 && d <= 4 ? String(5 - d) : '';
      else if (type === 'ear') {
        lastResult = null;
        result.innerHTML = '<b>' + t('bar') + ' ' + d.bar + '/' + d.of + '</b>' + (d.phase === 'listen' ? '♪ ' + t('earListen') + '…' : d.phase === 'hint' ? t('earHintShown') : '▶ ' + t('earPlay'));
      }
      else if (type === 'pass') sync();
      else if (type === 'listenEnd') sync();
    }
    listenBtn.addEventListener('click', function () { if (trainer.running === 'listen') trainer.stop(); else trainer.listen(true); sync(); });
    listenSlowBtn.addEventListener('click', function () { trainer.listen(false); sync(); });
    playBtn.addEventListener('click', function () {
      lastResult = null;
      if (isJam) { if (trainer.running) trainer.stop(); else { markSeen(id); trainer.listen(false, true); } } else trainer.toggle();
      sync();
    });
    minus.addEventListener('click', function () { trainer.setPct(trainer.pct - 5); sync(); });
    plus.addEventListener('click', function () { trainer.setPct(trainer.pct + 5); sync(); });

    function onBarTap(b) {
      var from = trainer.loop.from / 24, to = trainer.loop.to / 24, full = from === 0 && to === model.bars;
      if (model.bars < 2) return;
      if (full) trainer.setLoopBars(b, b + 1);
      else if (b < from) trainer.setLoopBars(b, to);
      else if (b >= to) trainer.setLoopBars(from, b + 1);
      else trainer.setLoopBars(0, model.bars);
      loopChip(); sync();
    }
    var chip = null;
    function loopChip() {
      if (chip && chip.parentNode) chip.parentNode.removeChild(chip);
      var from = trainer.loop.from / 24, to = trainer.loop.to / 24;
      if (from === 0 && to === model.bars) return;
      chip = el('button', { class: 'loop-chip', text: t('loopBars') + ' ' + (from + 1) + (to - from > 1 ? '–' + to : '') + '  ✕', onclick: function () { trainer.setLoopBars(0, model.bars); loopChip(); } });
      scoreWrap.insertBefore(chip, scoreWrap.firstChild);
    }
    function renderScore() {
      if (scoreH && scoreH.destroy) scoreH.destroy();
      scoreH = null;
      if (BW.score && view !== 'roll') {
        var w = scoreWrap.clientWidth;
        scoreH = BW.score.render(scoreWrap, model, { barsPerRow: w >= 720 ? Math.min(2, model.bars) : 1, showFingers: S.fingers, activeHands: trainer.practiced(), onBarTap: onBarTap });
      }
      trainer.setViews(scoreH, rollH);
      loopChip();
    }
    function layout() {
      if (!rollH) rollH = BW.roll.create(rollInner, {});
      rollH.showRoll = view !== 'score';
      rollH.hideNotes = view === 'blind'; trainer.blind = view === 'blind';
      scoreWrap.setAttribute('data-blind', t('blindMsg')); scoreWrap.setAttribute('data-ear', t('earMsg'));
      rollH.resize();
      renderScore();
    }
    function rebuild() {
      trainer.stop();
      model = BW.buildModel(item, { key: key, lhPattern: lhOverride });
      trainer.setModel(model, scoreH, rollH);
      chordLine.textContent = model.chords.map(function (c) { return c.join(' '); }).filter(function (c, i, a) { return a.length <= 4 || i < 4; }).join(' | ') + (model.chords.length > 4 ? ' …' : '');
      drawInfo(); drawHands(); sync(); layout();
    }

    function openMixer() {
      var bg = el('div', { class: 'sheet-bg' });
      function mix() { trainer.applyMix(); }
      var sheet = el('div', { class: 'sheet' }, [
        el('h3', { text: t('mixer') }),
        opt(t('drums'), null, switchEl(S.drums, function (v) { setS('drums', v); mix(); })),
        opt(t('bass'), null, switchEl(S.bass, function (v) { setS('bass', v); mix(); })),
        opt(t('click'), null, switchEl(S.click, function (v) { setS('click', v); mix(); })),
        opt(t('otherHand'), null, switchEl(S.otherHand !== false, function (v) { setS('otherHand', v); mix(); })),
        opt(t('userSound'), t('userSoundSub'), switchEl(S.userSound, function (v) { setS('userSound', v); })),
        opt(t('fingers'), null, switchEl(S.fingers, function (v) { setS('fingers', v); renderScore(); })),
        opt(t('volPiano'), null, range('volPiano', 0, 1, 0.05, mix)),
        opt(t('volDrums'), null, range('volDrums', 0, 1, 0.05, mix)),
        opt(t('volBass'), null, range('volBass', 0, 1, 0.05, mix)),
        el('h3', { text: t('ladder'), style: 'margin-top:16px' })
      ].concat(ladderOptions()).concat([
        opt(t('latency'), t('latencySub'), range('latencyMs', -60, 200, 5, null, function (v) { return v + ' ms'; }))
      ]));
      bg.appendChild(sheet);
      bg.addEventListener('click', function (e) { if (e.target === bg) { document.body.removeChild(bg); sync(); } });
      document.body.appendChild(bg);
    }

    var rz = null;
    function onResize() { clearTimeout(rz); rz = setTimeout(layout, 150); }
    function onKey(e) { if (e.code === 'Space' && !/INPUT|SELECT/.test(e.target.tagName)) { e.preventDefault(); playBtn.click(); } }
    window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKey);
    rebuild();
    if (isJam) { trainer.pct = 100; trainer.auto = false; root.classList.add('is-jam'); sync(); }
    var t80 = setTimeout(layout, 80);
    var ro = null, lastW = 0, lastH = 0;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(function () {
        var w = scoreWrap.clientWidth, h = rollWrap.clientHeight;
        if (Math.abs(w - lastW) > 4) { lastW = w; lastH = h; onResize(); }
        else if (Math.abs(h - lastH) > 2) { lastH = h; if (rollH) rollH.resize(); }
      });
      ro.observe(scoreWrap); ro.observe(rollWrap);
    }
    cleanup = function () {
      window.removeEventListener('resize', onResize); window.removeEventListener('keydown', onKey);
      clearTimeout(rz); clearTimeout(t80);
      trainer.destroy(); if (rollH) rollH.destroy(); if (ro) ro.disconnect();
      var bg = document.querySelector('.sheet-bg'); if (bg) bg.parentNode.removeChild(bg);
    };
  }

  /* ---------- router ---------- */
  var cameFrom = '';
  function route() {
    if (cleanup) { try { cleanup(); } catch (e) { /* ignore */ } cleanup = null; }
    var h = location.hash.replace(/^#/, '') || 'home';
    var i = h.indexOf('/'), name = i < 0 ? h : h.slice(0, i), arg = i < 0 ? '' : decodeURIComponent(h.slice(i + 1));
    if (name !== 'practice') cameFrom = '#' + h;
    window.scrollTo(0, 0);
    if (name === 'licks') licksView();
    else if (name === 'course') { if (arg) courseDetail(arg); else courseView(); }
    else if (name === 'lh') { if (arg) lhDetail(arg); else lhView(); }
    else if (name === 'jam') jamView();
    else if (name === 'ear') earView();
    else if (name === 'theory' || name === 'styles') articleList(name);
    else if (name === 'article') articleView(arg);
    else if (name === 'settings') settingsView();
    else if (name === 'practice') practiceView(arg);
    else homeView();
  }
  window.addEventListener('hashchange', route);
  BW.input.onStatus(function () {
    var dot = document.querySelector('.rail .midi-dot');
    if (dot) dot.classList.toggle('on', BW.input.status.state === 'connected');
    if (location.hash === '#settings') settingsView();
  });
  // unlock audio on the first touch anywhere
  function unlock() { if (BW.audio) BW.audio.init(); }
  ['pointerdown', 'touchend', 'click', 'keydown'].forEach(function (evName) {
    window.addEventListener(evName, unlock, { passive: true, capture: true });
  });
  document.documentElement.lang = BW.settings.lang;
  BW.input.init();
  validateAll();
  route();
})(window.BW);
