/* Timing calibration: the app plays a click, the user plays along on the MIDI keyboard.
   The median difference between "heard click" and "key arrived" is the total latency of
   speaker + MIDI path on this device; it is stored as settings.latencyMs (which the trainer
   subtracts when judging timing). The spread is stored as settings.jitterMs and widens the
   scoring window a little on devices whose MIDI timing wobbles. */
window.BW = window.BW || {};
(function (BW) {
  'use strict';
  var el = BW.el;
  function L(nl, en) { return BW.settings.lang === 'en' ? en : nl; }
  var BEAT = 0.6, COUNT = 4, TAPS = 12;

  /* performance.now() ms -> AudioContext time as heard, WITHOUT the user correction */
  function heardBase(perfMs) {
    var ctx = BW.audio.ctx; if (!ctx) return 0;
    if (ctx.getOutputTimestamp) {
      try {
        var ts = ctx.getOutputTimestamp();
        if (ts && ts.performanceTime > 0 && Math.abs(ts.contextTime - ctx.currentTime) < 0.6) return ts.contextTime + (perfMs - ts.performanceTime) / 1000;
      } catch (e) { /* fall through */ }
    }
    return ctx.currentTime - BW.audio.latency() + (perfMs - performance.now()) / 1000;
  }
  function median(a) { var s = a.slice().sort(function (x, y) { return x - y; }), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }

  /* opens the calibration sheet; onDone() is called after a new value was saved */
  BW.calibrate = function (onDone) {
    var bg = el('div', { class: 'sheet-bg calib-bg' });
    var box = el('div', { class: 'sheet calib' });
    bg.appendChild(box); document.body.appendChild(bg);
    var off = null, timer = null, clicks = [], taps = [];
    function close() { if (off) off(); clearInterval(timer); if (bg.parentNode) bg.parentNode.removeChild(bg); }
    bg.addEventListener('click', function (e) { if (e.target === bg) close(); });

    function intro() {
      box.innerHTML = '';
      box.appendChild(el('h3', { text: L('Timing meten', 'Measure timing') }));
      box.appendChild(el('p', { class: 'note', text: L(
        'Je hoort vier tikken aftellen en daarna twaalf tikken. Speel op elke tik één toets op je MIDI-keyboard, precies mee met wat je hoort. Gebruik de luidspreker of koptelefoon waarmee je straks oefent. De app meet hoeveel vertraging dit apparaat heeft en houdt daar voortaan rekening mee.',
        'You hear four count-in clicks and then twelve clicks. Play one key on your MIDI keyboard on every click, exactly with what you hear. Use the speaker or headphones you will practise with. The app measures how much delay this device has and takes it into account from now on.') }));
      var cur = BW.settings.latencyMs || 0;
      box.appendChild(el('p', { class: 'note', style: 'margin-top:8px', text: L('Huidige correctie: ', 'Current offset: ') + cur + ' ms' }));
      box.appendChild(el('div', { style: 'display:flex;gap:10px;margin-top:16px' }, [
        el('button', { class: 'btn primary', text: '▶ ' + L('Start', 'Start'), onclick: run }),
        el('button', { class: 'btn', text: L('Annuleren', 'Cancel'), onclick: close })
      ]));
    }

    function run() {
      BW.audio.init();
      BW.audio.setVolume('click', Math.max(BW.settings.volClick || 0.6, 0.7));
      clicks = []; taps = [];
      var t0 = BW.audio.now() + 0.6;
      for (var i = 0; i < COUNT + TAPS; i++) {
        var t = t0 + i * BEAT;
        BW.audio.drum(i < COUNT ? 'clickHi' : 'click', t, i < COUNT ? 0.75 : 0.9);
        if (i >= COUNT) clicks.push(t);
      }
      var counter = el('div', { class: 'calib-count', text: '…' });
      var dots = el('div', { class: 'calib-dots' });
      for (var d = 0; d < TAPS; d++) dots.appendChild(el('i'));
      box.innerHTML = '';
      box.appendChild(el('h3', { text: L('Speel mee op elke tik', 'Play along on every click') }));
      box.appendChild(counter); box.appendChild(dots);
      box.appendChild(el('button', { class: 'btn', style: 'margin-top:14px', text: L('Stop', 'Stop'), onclick: function () { close(); } }));
      off = BW.input.on(function (ev) {
        if (ev.type !== 'on') return;
        var a = heardBase(ev.time), best = -1, bd = 1e9;
        clicks.forEach(function (c, k) { var dd = Math.abs(a - c); if (dd < bd) { bd = dd; best = k; } });
        if (best < 0 || bd > BEAT * 0.45 || taps.some(function (x) { return x.k === best; })) return;
        taps.push({ k: best, d: a - clicks[best] });
        if (dots.children[best]) dots.children[best].className = 'on';
      });
      timer = setInterval(function () {
        var now = BW.audio.now();
        if (now < clicks[0]) counter.textContent = String(Math.max(1, Math.ceil((clicks[0] - now) / BEAT)));
        else counter.textContent = taps.length + ' / ' + TAPS;
        if (now > clicks[clicks.length - 1] + BEAT * 0.6) { clearInterval(timer); if (off) { off(); off = null; } finish(); }
      }, 80);
    }

    function finish() {
      box.innerHTML = '';
      box.appendChild(el('h3', { text: L('Resultaat', 'Result') }));
      if (taps.length < 6) {
        box.appendChild(el('p', { class: 'note', text: L(
          'Te weinig aanslagen ontvangen (' + taps.length + ' van ' + TAPS + '). Is het keyboard verbonden (groen bolletje bij MIDI)? Probeer het opnieuw.',
          'Too few key presses received (' + taps.length + ' of ' + TAPS + '). Is the keyboard connected (green dot next to MIDI)? Try again.') }));
      } else {
        var ds = taps.map(function (x) { return x.d; }), med = median(ds);
        var spread = median(ds.map(function (x) { return Math.abs(x - med); }));
        var ms = Math.round(BW.clamp(med * 1000, -100, 400) / 5) * 5, jit = Math.round(BW.clamp(spread * 1000, 0, 80));
        BW.settings.latencyMs = ms; BW.settings.jitterMs = jit; BW.saveSettings();
        box.appendChild(el('div', { class: 'calib-count', text: ms + ' ms' }));
        box.appendChild(el('p', { class: 'note', text: L(
          'Gemeten vertraging: ' + ms + ' ms (onregelmatigheid ' + jit + ' ms, ' + taps.length + ' aanslagen). Opgeslagen: de app houdt hier voortaan rekening mee bij het beoordelen.',
          'Measured delay: ' + ms + ' ms (irregularity ' + jit + ' ms, ' + taps.length + ' key presses). Saved: the app now takes this into account when judging.') }));
        if (jit > 35) box.appendChild(el('p', { class: 'note warn-text', text: L(
          'Je aanslagen kwamen onregelmatig binnen. Dat kan aan je eigen spel liggen, maar ook aan een haperende MIDI-verbinding. Meet nog eens; blijft het hoog, dan geeft de app wat meer speling.',
          'Your key presses arrived irregularly. That can be your own playing, but also a stuttering MIDI connection. Measure once more; if it stays high, the app allows a little more leeway.') }));
        if (onDone) onDone(ms);
      }
      box.appendChild(el('div', { style: 'display:flex;gap:10px;margin-top:16px' }, [
        el('button', { class: 'btn', text: '↻ ' + L('Opnieuw', 'Again'), onclick: run }),
        el('button', { class: 'btn primary', text: L('Klaar', 'Done'), onclick: close })
      ]));
    }
    intro();
  };
})(window.BW);
