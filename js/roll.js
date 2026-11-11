/* Falling-notes view + touch keyboard (canvas). */
window.BW = window.BW || {};
(function (BW) {
  'use strict';
  var BLACK = { 1: 1, 3: 1, 6: 1, 8: 1, 10: 1 };
  var COL = {
    rh: '#3b9dff', rhDim: 'rgba(59,157,255,.32)',
    lh: '#19c6c2', lhDim: 'rgba(25,198,194,.30)',
    hit: '#27c267', miss: '#ef5a5f', next: '#ffd166'
  };

  function rr(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  BW.roll = {
    create: function (container, opts) {
      opts = opts || {};
      var canvas = document.createElement('canvas');
      canvas.className = 'roll-canvas';
      canvas.style.touchAction = 'none';
      container.innerHTML = '';
      container.appendChild(canvas);
      var ctx = canvas.getContext('2d');
      var W = 0, H = 0, kbH = 0, dpr = 1;
      var lo = 48, hi = 84, keys = [], whiteW = 20;
      var notes = [], active = { rh: true, lh: true }, loop = null, showFingers = true;
      var h = {
        next: {},        // midi -> finger (keys expected now, wait mode)
        flashes: {},     // midi -> {color, until}
        windowUnits: 30, // how many units are visible above the keyboard
        showRoll: true
      };

      function layoutKeys() {
        keys = [];
        var nWhite = 0, m;
        for (m = lo; m <= hi; m++) if (!BLACK[m % 12]) nWhite++;
        whiteW = W / nWhite;
        var wi = 0;
        for (m = lo; m <= hi; m++) {
          if (BLACK[m % 12]) keys[m] = { black: true, x: wi * whiteW - whiteW * 0.3, w: whiteW * 0.6 };
          else { keys[m] = { black: false, x: wi * whiteW, w: whiteW }; wi++; }
        }
      }
      function setRange(a, b) {
        a = Math.min(a, 48); b = Math.max(b, 72);
        lo = Math.floor((a - 1) / 12) * 12;            // C at or below
        hi = Math.ceil((b + 2) / 12) * 12;             // C at or above
        if (hi - lo < 36) hi = lo + 36;
        lo = Math.max(21, lo); hi = Math.min(108, hi);
        layoutKeys();
      }
      h.resize = function () {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = container.clientWidth || 800; H = container.clientHeight || 300;
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
        kbH = h.showRoll ? Math.max(84, Math.min(150, H * 0.34)) : H;
        layoutKeys();
        h.draw(h._last || 0);
      };
      h.setModel = function (model, activeHands, loopRange, fingers) {
        notes = BW.flatten(model, ['lh', 'rh']);
        active = { rh: activeHands.indexOf('rh') >= 0, lh: activeHands.indexOf('lh') >= 0 };
        loop = loopRange || null;
        showFingers = fingers !== false;
        setRange(model.range.lo, model.range.hi);
        h.draw(h._last || 0);
      };
      h.flash = function (midi, kind, ms) { h.flashes[midi] = { color: COL[kind] || kind, until: performance.now() + (ms || 260) }; };

      function drawNotes(now, offset, alpha) {
        var rollH = H - kbH, ppu = rollH / h.windowUnits;
        for (var i = 0; i < notes.length; i++) {
          var n = notes[i];
          if (loop && (n.t < loop.from || n.t >= loop.to)) continue;
          var t = n.t + offset - (n.grace ? 0.7 * n.grace : 0);
          var d = n.grace ? 0.6 : Math.max(0.8, n.d - 0.25);
          var y1 = rollH - (t - now) * ppu, y0 = y1 - d * ppu;
          if (y0 > rollH || y1 < 0) continue;
          var k = keys[n.midi]; if (!k) continue;
          var act = active[n.hand];
          var x = k.x + (k.black ? 0 : k.w * 0.14), w = k.black ? k.w : k.w * 0.72;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = act ? COL[n.hand] : COL[n.hand + 'Dim'];
          rr(ctx, x, Math.max(-20, y0), w, Math.min(y1, rollH + 20) - Math.max(-20, y0), Math.min(6, w / 3));
          ctx.fill();
          if (showFingers && n.finger && act && !n.grace && y1 - y0 > 13 && y1 < rollH + 6) {
            ctx.fillStyle = '#04162e';
            ctx.font = '700 ' + Math.round(Math.min(13, w * 0.85)) + 'px system-ui, sans-serif';
            ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
            ctx.fillText(String(n.finger), x + w / 2, Math.min(y1, rollH) - 3);
          }
        }
        ctx.globalAlpha = 1;
      }

      h.draw = function (now) {
        h._last = now;
        if ((h._n = (h._n || 0) + 1) % 20 === 0) {
          var cw = container.clientWidth, ch = container.clientHeight;
          if (cw && ch && (Math.abs(cw - W) > 1 || Math.abs(ch - H) > 1)) { h.resize(); return; }
        }
        if (!W) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, W, H);
        var rollH = H - kbH, m, k;
        if (h.showRoll && rollH > 10) {
          ctx.save();
          ctx.beginPath(); ctx.rect(0, 0, W, rollH); ctx.clip();
          // lanes for C and F keys
          ctx.strokeStyle = 'rgba(255,255,255,.05)'; ctx.lineWidth = 1;
          for (m = lo; m <= hi; m++) {
            if (m % 12 === 0 || m % 12 === 5) { k = keys[m]; ctx.beginPath(); ctx.moveTo(k.x + .5, 0); ctx.lineTo(k.x + .5, rollH); ctx.stroke(); }
          }
          // beat lines
          var ppu = rollH / h.windowUnits;
          var first = Math.ceil(now / 6) * 6;
          for (var u = first; u < now + h.windowUnits; u += 6) {
            var y = rollH - (u - now) * ppu;
            ctx.strokeStyle = (u % 24 === 0) ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.07)';
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
          }
          if (h.hideNotes) { /* playing from memory */ } else if (loop && loop.repeat) {
            var len = loop.to - loop.from;
            var base = Math.floor((now - loop.from) / len);
            for (var r = base - 1; r <= base + Math.ceil(h.windowUnits / len) + 1; r++) drawNotes(now, r * len, 1);
          } else drawNotes(now, 0, 1);
          ctx.restore();
          // hit line glow
          var g = ctx.createLinearGradient(0, rollH - 26, 0, rollH);
          g.addColorStop(0, 'rgba(59,157,255,0)'); g.addColorStop(1, 'rgba(59,157,255,.28)');
          ctx.fillStyle = g; ctx.fillRect(0, rollH - 26, W, 26);
          ctx.fillStyle = '#3b9dff'; ctx.fillRect(0, rollH - 2, W, 2);
        }
        // keyboard
        var y0 = H - kbH, tnow = performance.now();
        function keyColor(m, base) {
          var f = h.flashes[m];
          if (f) { if (f.until > tnow) return f.color; delete h.flashes[m]; }
          if (BW.input && BW.input.held[m]) return '#7fbfff';
          if (m in h.next) return COL.next;
          return base;
        }
        for (m = lo; m <= hi; m++) {
          k = keys[m]; if (k.black) continue;
          ctx.fillStyle = keyColor(m, '#f4f7fb');
          rr(ctx, k.x + 0.75, y0 + 1, k.w - 1.5, kbH - 3, 4); ctx.fill();
          if (m % 12 === 0) {
            ctx.fillStyle = 'rgba(10,30,60,.45)'; ctx.font = '600 10px system-ui, sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('C' + (m / 12 - 1), k.x + k.w / 2, H - 8);
          }
        }
        for (m = lo; m <= hi; m++) {
          k = keys[m]; if (!k.black) continue;
          ctx.fillStyle = keyColor(m, '#0b1a30');
          rr(ctx, k.x, y0 + 1, k.w, kbH * 0.62, 3); ctx.fill();
        }
        // finger hints on expected keys
        ctx.textAlign = 'center';
        for (var mm in h.next) {
          k = keys[mm]; if (!k || !h.next[mm]) continue;
          var cy = k.black ? y0 + kbH * 0.62 - 12 : H - 24;
          ctx.fillStyle = '#04162e'; ctx.beginPath(); ctx.arc(k.x + k.w / 2, cy, 9, 0, 6.3); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.font = '700 11px system-ui, sans-serif'; ctx.textBaseline = 'middle';
          ctx.fillText(String(h.next[mm]), k.x + k.w / 2, cy + 0.5); ctx.textBaseline = 'alphabetic';
        }
      };

      /* touch keyboard */
      var pointers = {};
      function keyAt(e) {
        var r = canvas.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        if (y < H - kbH) return null;
        var m;
        if (y < H - kbH + kbH * 0.62) for (m = lo; m <= hi; m++) if (keys[m].black && x >= keys[m].x && x < keys[m].x + keys[m].w) return m;
        for (m = lo; m <= hi; m++) if (!keys[m].black && x >= keys[m].x && x < keys[m].x + keys[m].w) return m;
        return null;
      }
      canvas.addEventListener('pointerdown', function (e) {
        var m = keyAt(e); if (m == null) return;
        e.preventDefault();
        try { canvas.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ }
        pointers[e.pointerId] = m; BW.input.noteOn(m, 0.75, 'touch');
      });
      canvas.addEventListener('pointermove', function (e) {
        if (!(e.pointerId in pointers)) return;
        var m = keyAt(e), cur = pointers[e.pointerId];
        if (m != null && m !== cur) { BW.input.noteOff(cur, 'touch'); pointers[e.pointerId] = m; BW.input.noteOn(m, 0.7, 'touch'); }
      });
      function up(e) {
        if (!(e.pointerId in pointers)) return;
        var m = pointers[e.pointerId]; delete pointers[e.pointerId];
        for (var id in pointers) if (pointers[id] === m) return;      // another finger still holds this key
        BW.input.noteOff(m, 'touch');
      }
      canvas.addEventListener('pointerup', up);
      canvas.addEventListener('pointercancel', up);

      h.destroy = function () {
        Object.keys(pointers).forEach(function (id) { BW.input.noteOff(pointers[id], 'touch'); });
        container.innerHTML = '';
      };
      setRange(48, 84);
      h.resize();
      return h;
    }
  };
})(window.BW);
