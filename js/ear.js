/* Ear training quizzes: intervals, chord qualities, blues degrees (I / IV / V).
   Adaptive: a level starts with a few clearly different sounds and adds more once
   8 of the last 10 answers were right at the first attempt. */
window.BW = window.BW || {};
(function (BW) {
  'use strict';
  var el = BW.el;
  function L(nl, en) { return BW.settings.lang === 'en' ? en : nl; }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(a) { return a[rnd(a.length)]; }

  var INT = [null, ['kleine secunde', 'minor 2nd'], ['grote secunde', 'major 2nd'], ['kleine terts', 'minor 3rd'], ['grote terts', 'major 3rd'],
    ['kwart', 'perfect 4th'], ['tritonus', 'tritone'], ['kwint', 'perfect 5th'], ['kleine sext', 'minor 6th'], ['grote sext', 'major 6th'],
    ['kleine septiem', 'minor 7th'], ['grote septiem', 'major 7th'], ['octaaf', 'octave']];
  var INT_HINT = { 3: ['blue note b3', 'blue note b3'], 6: ['blue note b5', 'blue note b5'], 10: ['de b7 van C7', 'the b7 of C7'], 9: ['de 6 van de shuffle', 'the 6 of the shuffle'] };
  var CH = {
    maj: { n: ['majeur', 'major'], iv: [0, 4, 7] }, min: { n: ['mineur', 'minor'], iv: [0, 3, 7] },
    '7': { n: ['septiem (C7)', 'dominant 7th (C7)'], iv: [0, 4, 7, 10] }, '6': { n: ['sext (C6)', 'sixth (C6)'], iv: [0, 4, 7, 9] },
    '9': { n: ['negen (C9)', 'ninth (C9)'], iv: [0, 4, 7, 10, 14] }, dim: { n: ['verminderd', 'diminished'], iv: [0, 3, 6, 9] },
    m7: { n: ['mineur 7', 'minor 7th'], iv: [0, 3, 7, 10] }
  };
  var FN = { I: 0, IV: 5, V: 7 };

  function playSeq(notes, gap, dur, vel) {            // notes: array of midi or arrays (chords)
    var a = BW.audio; a.init();
    var t = a.now() + 0.08;
    notes.forEach(function (n, i) {
      (Array.isArray(n) ? n : [n]).forEach(function (m, j) { a.playNote(m, t + i * gap + j * 0.012, dur, (vel || 0.7) - j * 0.03); });
    });
  }

  var QUIZ = {
    int: {
      title: ['Intervallen', 'Intervals'],
      intro: ['Je hoort twee noten. Welk interval is het?', 'You hear two notes. Which interval is it?'],
      levels: [[3, 4, 7, 12], [2, 3, 4, 5, 7, 10, 12], [1, 2, 3, 4, 5, 6, 7, 9, 10, 12], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]],
      levelNote: [['omhoog', 'ascending'], ['omhoog', 'ascending'], ['omhoog', 'ascending'], ['omhoog, omlaag en samen', 'up, down and together']],
      label: function (o) { return L(INT[o][0], INT[o][1]); },
      hint: function (o) { return INT_HINT[o] ? L(INT_HINT[o][0], INT_HINT[o][1]) : ''; },
      make: function (level, opts) {
        var o = pick(opts), root = 48 + rnd(17), mode = level < 3 ? 'asc' : pick(['asc', 'asc', 'desc', 'harm']);
        return {
          answer: o,
          play: function () {
            if (mode === 'harm') playSeq([[root, root + o]], 0, 1.4, 0.68);
            else playSeq(mode === 'asc' ? [root, root + o] : [root + o, root], 0.62, 0.9, 0.72);
          }
        };
      }
    },
    chord: {
      title: ['Akkoorden', 'Chords'],
      intro: ['Je hoort een akkoord. Welke soort is het?', 'You hear a chord. Which quality is it?'],
      levels: [['maj', 'min', '7'], ['maj', 'min', '7', '6', '9'], ['maj', 'min', '7', '6', '9', 'dim', 'm7']],
      levelNote: [['', ''], ['', ''], ['', '']],
      label: function (o) { return L(CH[o].n[0], CH[o].n[1]); },
      hint: function () { return ''; },
      make: function (level, opts) {
        var o = pick(opts), root = 48 + rnd(12), ns = CH[o].iv.map(function (i) { return root + i; }), n = 0;
        return {
          answer: o,
          play: function () {                      // first as a block, on replay broken first
            if (n++ === 0) playSeq([ns], 0, 1.6, 0.66);
            else { playSeq(ns, 0.26, 0.5, 0.66); setTimeout(function () { playSeq([ns], 0, 1.4, 0.66); }, ns.length * 260 + 150); }
          }
        };
      }
    },
    fn: {
      title: ['Blues-trappen', 'Blues degrees'],
      intro: ['Eerst hoor je het grondakkoord (I), daarna een tweede akkoord. Is dat I, IV of V?', 'First you hear the home chord (I), then a second chord. Is it I, IV or V?'],
      levels: [['I', 'IV', 'V'], ['I', 'IV', 'V']],
      levelNote: [['in C', 'in C'], ['in wisselende toonsoorten', 'in changing keys']],
      label: function (o, level) { return level === 0 ? o + ' — ' + { I: 'C7', IV: 'F7', V: 'G7' }[o] : o; },
      hint: function () { return ''; },
      make: function (level, opts) {
        var o = pick(opts), key = level === 0 ? 0 : rnd(12);
        function ch(deg) { var r = 48 + key + deg; if (r > 55) r -= 12; return [r - 12, r + 4, r + 7, r + 10]; }
        return { answer: o, play: function () { playSeq([ch(0), ch(FN[o])], 1.15, 1.0, 0.66); } };
      }
    }
  };

  BW.earQuiz = function (mount) {
    var state = BW.store.get('earquiz', {});
    var kind = state.kind && QUIZ[state.kind] ? state.kind : 'int';
    var q = null, firstTry = true, done = false, msg = '';
    function st() { var s = state[kind] || (state[kind] = { level: 0, hist: [], streak: 0, total: 0, right: 0 }); return s; }
    function save() { state.kind = kind; BW.store.set('earquiz', state); }
    function next(auto) {
      var Q = QUIZ[kind], s = st();
      q = Q.make(s.level, Q.levels[s.level]); firstTry = true; done = false;
      draw();
      if (auto !== false) q.play();
    }
    function record(ok) {
      var s = st(), Q = QUIZ[kind];
      s.total++; if (ok) { s.right++; s.streak++; } else s.streak = 0;
      s.hist.push(ok ? 1 : 0); if (s.hist.length > 10) s.hist.shift();
      msg = '';
      if (s.hist.length >= 10 && s.hist.reduce(function (a, b) { return a + b; }, 0) >= 8 && s.level < Q.levels.length - 1) {
        s.level++; s.hist = [];
        msg = L('Niveau omhoog: er komen nieuwe klanken bij.', 'Level up: new sounds are added.');
      }
      BW.touchStreak();
      save();
    }
    function answer(o, btn) {
      if (!q || done) return;
      if (o === q.answer) {
        done = true;
        if (firstTry) record(true);
        btn.classList.add('ok');
        setTimeout(function () { if (mount.isConnected !== false) next(); }, 1100);
      } else {
        if (firstTry) { firstTry = false; record(false); drawStats(); }
        btn.classList.add('bad'); btn.disabled = true;
        q.play();
      }
    }
    var statsBox = null;
    function drawStats() {
      if (!statsBox) return;
      var s = st(), Q = QUIZ[kind], dots = '';
      for (var i = 0; i < 10; i++) dots += '<i class="' + (s.hist[i] === 1 ? 'on' : s.hist[i] === 0 ? 'off' : '') + '"></i>';
      var note = Q.levelNote[s.level] ? L(Q.levelNote[s.level][0], Q.levelNote[s.level][1]) : '';
      statsBox.innerHTML = '<b>' + L('Niveau', 'Level') + ' ' + (s.level + 1) + '/' + Q.levels.length + '</b>' + (note ? ' · ' + note : '') +
        ' · ' + L('laatste 10', 'last 10') + ' <span class="ear-dots">' + dots + '</span> · ' + L('reeks', 'streak') + ' ' + s.streak +
        (s.total ? ' · ' + Math.round(s.right / s.total * 100) + '% ' + L('goed', 'correct') : '');
    }
    function draw() {
      var Q = QUIZ[kind], s = st();
      mount.innerHTML = '';
      var tabs = el('div', { class: 'seg' });
      Object.keys(QUIZ).forEach(function (k) {
        tabs.appendChild(el('button', { class: k === kind ? 'on' : '', text: L(QUIZ[k].title[0], QUIZ[k].title[1]), onclick: function () { kind = k; q = null; msg = ''; save(); draw(); } }));
      });
      var levels = el('div', { class: 'seg' });
      Q.levels.forEach(function (_, i) {
        levels.appendChild(el('button', { class: i === s.level ? 'on' : '', text: String(i + 1), onclick: function () { s.level = i; s.hist = []; q = null; msg = ''; save(); draw(); } }));
      });
      statsBox = el('div', { class: 'ear-stats' });
      var grid = el('div', { class: 'ear-grid' });
      Q.levels[s.level].forEach(function (o) {
        var h = Q.hint(o);
        var b = el('button', { class: 'ear-opt', html: '<b></b>' + (h ? '<small></small>' : '') });
        b.firstChild.textContent = Q.label(o, s.level);
        if (h) b.lastChild.textContent = h;
        b.disabled = !q;
        b.addEventListener('click', function () { answer(o, b); });
        grid.appendChild(b);
      });
      mount.appendChild(el('div', { style: 'display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:16px' }, [tabs, el('span', { class: 'note', text: L('Niveau', 'Level') }), levels]));
      mount.appendChild(el('div', { class: 'card' }, [
        el('p', { class: 'ear-intro', text: L(Q.intro[0], Q.intro[1]) }),
        el('div', { style: 'display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:14px 0 6px' }, [
          q ? el('button', { class: 'btn primary', text: '↻ ' + L('Nog eens horen', 'Hear again'), onclick: function () { q.play(); } })
            : el('button', { class: 'btn primary', text: '▶ ' + L('Start', 'Start'), onclick: function () { next(); } }),
          q ? el('button', { class: 'btn', text: L('Overslaan', 'Skip') + ' ›', onclick: function () { if (firstTry) record(false); next(); } }) : null,
          msg ? el('span', { class: 'tag ok', text: msg }) : null
        ]),
        statsBox, grid
      ]));
      drawStats();
    }
    draw();
  };
})(window.BW);
