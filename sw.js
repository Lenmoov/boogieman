/* Offline support: network first (so updates arrive), cache as fallback. */
const CACHE = 'bw-studio-v10';
const FILES = ['./', 'index.html', 'css/app.css', 'manifest.webmanifest', 'icon.svg', 'icon-180.png',
  'js/core.js', 'js/audio.js', 'js/input.js', 'js/score.js', 'js/roll.js', 'js/trainer.js', 'js/i18n.js', 'js/ear.js', 'js/ui.js',
  'data/patterns.js', 'data/licks-1.js', 'data/licks-2.js', 'data/licks-3.js', 'data/licks-4.js', 'data/licks-5.js', 'data/licks-6.js', 'data/licks-7.js', 'data/course.js', 'data/articles.js',
  'samples/drums/kick.mp3', 'samples/drums/snare.mp3', 'samples/drums/hihat.mp3', 'samples/bass/eb-Cs1.mp3', 'samples/bass/eb-E1.mp3', 'samples/bass/eb-G1.mp3', 'samples/bass/eb-As1.mp3', 'samples/bass/eb-Cs2.mp3', 'samples/bass/eb-E2.mp3', 'samples/bass/eb-G2.mp3', 'samples/bass/eb-As2.mp3', 'samples/bass/eb-Cs3.mp3',
  'samples/piano/A0.mp3', 'samples/piano/C1.mp3', 'samples/piano/Ds1.mp3', 'samples/piano/Fs1.mp3', 'samples/piano/A1.mp3', 'samples/piano/C2.mp3', 'samples/piano/Ds2.mp3', 'samples/piano/Fs2.mp3', 'samples/piano/A2.mp3', 'samples/piano/C3.mp3', 'samples/piano/Ds3.mp3', 'samples/piano/Fs3.mp3', 'samples/piano/A3.mp3', 'samples/piano/C4.mp3', 'samples/piano/Ds4.mp3', 'samples/piano/Fs4.mp3', 'samples/piano/A4.mp3', 'samples/piano/C5.mp3', 'samples/piano/Ds5.mp3', 'samples/piano/Fs5.mp3', 'samples/piano/A5.mp3', 'samples/piano/C6.mp3', 'samples/piano/Ds6.mp3', 'samples/piano/Fs6.mp3', 'samples/piano/A6.mp3', 'samples/piano/C7.mp3', 'samples/piano/Ds7.mp3'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => c.add(f).catch(() => null)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok && new URL(e.request.url).origin === location.origin) {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
    }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
});
