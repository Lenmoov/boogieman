// Content check: node tools/validate.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.resolve(__dirname, '..');
const ctx = { localStorage: { getItem: () => null, setItem() {} }, console, performance: { now: () => 0 }, document: { createElement: () => ({}) } };
ctx.window = ctx; vm.createContext(ctx);
const lickFiles = fs.readdirSync(path.join(root, 'data')).filter(f => /^licks-\d+\.js$/.test(f)).sort().map(f => 'data/' + f);
['js/core.js', 'data/patterns.js'].concat(lickFiles, ['data/course.js', 'data/articles.js']).forEach(f => {
  const p = path.join(root, f);
  if (!fs.existsSync(p)) { console.log('MISSING', f); return; }
  vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: f });
});
const BW = ctx.BW; let warn = [];
const ids = {};
function span(ev, where) {
  if (ev.rest || ev.notes.length < 2) return;
  const s = ev.notes[ev.notes.length - 1].midi - ev.notes[0].midi;
  if (s > 14) warn.push(where + ': chord span ' + s + ' semitones');
  const f = ev.notes.map(n => n.finger);
  for (let i = 1; i < f.length; i++) {
    if (!f[i] || !f[i - 1]) continue;
    if (ev.hand === 'rh' && f[i] <= f[i - 1]) warn.push(where + ': RH chord fingers not ascending ' + f.join(''));
    if (ev.hand === 'lh' && f[i] >= f[i - 1]) warn.push(where + ': LH chord fingers not descending ' + f.join(''));
  }
}
function check(l) {
  const m = BW.buildModel(l);
  ['rh', 'lh'].forEach(h => m.hands[h].forEach(ev => {
    const where = l.id + ' ' + h + ' bar ' + (Math.floor(ev.t / 24) + 1);
    span(ev, where);
    if (!ev.rest && ev.notes.concat(ev.grace).some(n => !n.finger)) warn.push(where + ': missing finger');
  }));
  m.hands.rh.forEach(r => {
    if (r.rest) return;
    m.hands.lh.forEach(lh => {
      if (lh.rest) return;
      if (lh.t < r.t + r.d && r.t < lh.t + lh.d && lh.notes[lh.notes.length - 1].midi >= r.notes[0].midi) {
        warn.push(l.id + ' bar ' + (Math.floor(r.t / 24) + 1) + ': hands collide (' + lh.notes[lh.notes.length - 1].name + ' vs ' + r.notes[0].name + ')');
      }
    });
  });
  return m;
}
BW.licks.forEach(l => { if (ids[l.id]) warn.push('duplicate id ' + l.id); ids[l.id] = 1; check(l); });
BW.patterns.forEach(p => BW.patternExercises(p).forEach(e => check(e)));
BW.articles.forEach(a => ['nl', 'en'].forEach(lang => String(a.body[lang]).split(/\r?\n/).forEach(line => {
  line = line.trim(); if (line.indexOf('@example') !== 0) return;
  try { check(Object.assign({ id: a.id + '/' + lang }, JSON.parse(line.slice(8)))); } catch (e) { warn.push(a.id + ' bad example JSON'); }
})));
// course: every reference must exist, every lick must be placed exactly once
if (BW.course) {
  const used = {}, steps = ['exC', 'exF', 'exG', 'exChanges', 'ex12', 'exBackbeat', 'exCharleston', 'exOffbeat'];
  BW.course.forEach(m => m.items.forEach(it => {
    if (it.lick) { if (!BW.lickById(it.lick)) warn.push('course ' + m.id + ': unknown lick ' + it.lick); if (used[it.lick]) warn.push('course: lick twice ' + it.lick); used[it.lick] = 1; }
    else if (it.lh) { const [p, st] = it.lh.split(':'); if (!BW.patternById(p) || steps.indexOf(st) < 0) warn.push('course ' + m.id + ': bad lh ' + it.lh); }
    else if (it.read) { if (!BW.articles.some(a => a.id === it.read)) warn.push('course ' + m.id + ': unknown article ' + it.read); }
    else if (it.jam) { if (!BW.jams.some(j => j.k === it.jam)) warn.push('course ' + m.id + ': unknown jam ' + it.jam); }
    else if (it.ear) { if (['int', 'chord', 'fn'].indexOf(it.ear) < 0) warn.push('course ' + m.id + ': bad ear ' + it.ear); }
    else if (!it.task || !it.nl || !it.en) warn.push('course ' + m.id + ': bad item ' + JSON.stringify(it));
  }));
  BW.licks.forEach(l => { if (!used[l.id]) warn.push('course: lick not placed ' + l.id); });
  console.log(BW.course.length + ' course modules, ' + BW.course.reduce((n, m) => n + m.items.length, 0) + ' items');
}
const errs = [...new Set(BW.errors)]; warn = [...new Set(warn)];
console.log(BW.licks.length + ' licks, ' + BW.patterns.length + ' patterns, ' + BW.articles.length + ' articles');
console.log('ERRORS: ' + errs.length); errs.forEach(e => console.log('  ' + e));
console.log('WARNINGS: ' + warn.length); warn.forEach(e => console.log('  ' + e));
