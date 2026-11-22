// EP01 — What if toilets had no U-bend?
window.EPISODE = {
  badge: '#1',
  title: ['WHAT IF TOILETS', 'HAD NO U-BEND?'],
  noSubsCues: ['flammable'],
  followText: 'FOLLOW FOR EP. 02',
  build() {
  const L = C;
  Object.assign(T, {
    reveal: L('reveal').s - 0.15,
    mistake: L('mistake').s - 0.12, seal: L('seal').s - 0.12, sewer: L('sewer').s - 0.05,
    chain: L('chain').s - 0.12, gas: L('gas').s - 0.05, into: WF('gas', 'into') - 0.08,
    methane: L('methane').s - 0.1, flam: L('flammable').s - 0.1, hist: L('history').s - 0.12,
    y1775: WF('history', '1775') - 0.06, restore: L('restore').s - 0.12, clean: WF('restore', 'and') - 0.06,
    tip: L('tip').s - 0.12,
  });
  const xq = { x: 175, y: XR.floor, s: 0.62 };

  const shots = [
    { a: 0, b: T.reveal, name: 'hook',
      cam: t => ({ z: lerp(1.0, 1.1, ease.io(seg(t, 0, T.reveal))), x: lerp(540, 600, ease.io(seg(t, 0, T.reveal))), y: lerp(960, 1000, ease.io(seg(t, 0, T.reveal))) }),
      draw: t => {
        const hw = WF('hook', 'water');
        drawBathroom(ctx, { water: 1, highlight: fadeIO(t, hw, T.reveal + 1, 0.15) }, t, () => {
          const k = ease.io(seg(t, 1.0, 1.6));
          quix(t, { x: BATH.quixX + 40 * k, y: BATH.quixY, s: 1, expr: t < 1.2 ? 'cool' : 'curious', pose: QUIX.mixPose('idle', 'point', k),
            look: [lerp(0, 0.9, k), lerp(0, 0.35, k)], lean: 0.08 * k, boing: boing(t, 1.3, 0.25) });
        });
      } },
    { a: T.reveal, b: T.intro, name: 'reveal', flash: false,
      cam: t => ({ z: 1.0 + 0.04 * ease.io(seg(t, T.reveal, T.intro)), x: 540, y: 960 }),
      draw: t => {
        const sx = lerp(-60, 1140, ease.io(seg(t, T.reveal, T.reveal + 0.6)));
        if (sx < 1140) drawBathroom(ctx, { water: 1 }, t, () => quix(t, { x: BATH.quixX + 40, y: BATH.quixY, s: 1, expr: 'curious', pose: 'point', look: [0.9, 0.35], lean: 0.08 }));
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, sx, H); ctx.clip();
        xrayBG(ctx, t); xrayToilet(ctx, { trap: 1, water: 1 }, t);
        const bw = WF('reveal', 'bend'), g = fadeIO(t, bw - 0.25, T.intro + 2, 0.2);
        if (g > 0) {
          ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = g * (0.55 + 0.25 * Math.sin(t * 12));
          ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = TUBE + 40; ctx.lineCap = 'round'; ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 50;
          const p = new Path2D(); p.moveTo(672, 1160); p.bezierCurveTo(680, 1220, 640, 1262, 590, 1258); p.bezierCurveTo(540, 1254, 530, 1180, 520, 1120); p.bezierCurveTo(512, 1070, 462, 1060, 452, 1120);
          ctx.stroke(p); ctx.restore();
        }
        label(ctx, 'THE TRAP', 830, 1240, 600, 1250, pop(t, bw - 0.1, 0.4));
        quix(t, { ...xq, expr: 'cool', pose: 'point', glow: 0.4, look: [0.8, 0.2] });
        ctx.restore();
        if (sx < 1140) {
          ctx.save(); ctx.fillStyle = '#BFF6FF'; ctx.shadowColor = XR.cyan; ctx.shadowBlur = 50;
          ctx.fillRect(sx - 6, 0, 12, H); ctx.globalAlpha = 0.25; ctx.fillRect(sx - 60, 0, 60, H); ctx.restore();
        }
      } },
    'INTRO',
    { a: T.del, b: T.mistake, name: 'delete',
      cam: t => ({ z: 1.0 + 0.05 * ease.out(seg(t, T.del, T.mistake)), x: 540, y: 1000, shake: 14 * (1 - seg(t, T.del, T.del + 0.6)) }),
      draw: t => {
        const p = ease.in(seg(t, T.del + 0.15, T.del + 1.15));
        const straight = ease.io(seg(t, T.del + 0.9, T.del + 1.35));
        const water = 1 - ease.io(seg(t, T.del + 0.3, T.del + 1.5));
        xrayBG(ctx, t);
        if (t < T.del + 0.15) xrayToilet(ctx, { trap: 1, water: 1 }, t);
        else {
          xrayToilet(ctx, { trap: 0, hideTube: straight < 0.02, tubeClip: lerp(1150, 1520, straight), water }, t);
          trapDissolve(ctx, p, t);
        }
        const r = quix(t, { ...xq, expr: t < T.del + 1.0 ? 'smug' : 'cool', pose: 'cheer', glow: 1 - seg(t, T.del + 0.6, T.del + 1.2), look: [0.8, 0.1] });
        beam(r.tip[0], r.tip[1], 575, 1210, t, 1 - seg(t, T.del + 0.55, T.del + 0.75));
        const st = pop(t, T.del + 0.35, 0.3), sf = 1 - seg(t, T.mistake - 0.25, T.mistake);
        if (st > 0 && sf > 0) {
          ctx.save(); ctx.globalAlpha = sf; ctx.translate(560, 560); ctx.rotate(-0.12); ctx.scale(lerp(2.2, 1, st), lerp(2.2, 1, st));
          ctx.strokeStyle = '#FF3B5C'; ctx.lineWidth = 14; ctx.beginPath(); ctx.roundRect(-330, -95, 660, 190, 26); ctx.stroke();
          txt(ctx, 'DELETED', 0, 6, { size: 130, font: 'Bungee', color: '#FF3B5C', glow: '#FF3B5C', glowBlur: 30, shadow: false });
          ctx.restore();
        }
      },
      post: t => { glitch(1 - seg(t, T.del + 0.05, T.del + 0.7), Math.floor(t * 30)); } },
    { a: T.mistake, b: T.seal, name: 'mistake',
      cam: t => ({ z: lerp(1.15, 1.05, ease.out(seg(t, T.mistake, T.seal))), x: 560, y: 1050, shake: 9 * (1 - seg(t, T.mistake, T.mistake + 0.8)) }),
      draw: t => {
        const dr = seg(t, T.mistake, T.mistake + 1.0);
        drawBathroom(ctx, { water: 1 - ease.io(dr), drain: dr < 1 ? 1 : 0 }, t, () => {
          const mw = WF('mistake', 'mistake');
          quix(t, { x: BATH.quixX + 20, y: BATH.quixY, s: 1, expr: t < mw - 0.1 ? 'shock' : 'worried', pose: t < mw - 0.1 ? 'idle' : 'shrug',
            morph: ease.out(seg(t, mw - 0.15, mw + 0.05)), glow: 0.6 * seg(t, mw - 0.15, mw), sweat: seg(t, mw, mw + 0.2),
            look: t < WF('mistake', 'that') ? [0.9, 0.4] : [0, 0], boing: boing(t, mw - 0.1, 0.4) });
        });
      } },
    { a: T.seal, b: T.sewer, name: 'seal',
      cam: t => ({ z: lerp(1.05, 1.18, ease.io(seg(t, T.seal, T.sewer))), x: 560, y: 1120 }),
      draw: t => {
        xrayBG(ctx, t); xrayToilet(ctx, { trap: 1, water: 1 }, t);
        gasBubbles(ctx, t, 'blocked', 1);
        label(ctx, 'WATER SEAL', 790, 860, 560, 1100, pop(t, WF('seal', 'seal') - 0.15, 0.4), '#8FE9FF');
        ctx.save(); pill(ctx, 230, 560, 260, 70, '#fff', INK, 6);
        txt(ctx, '◀ BEFORE', 230, 564, { size: 38, font: 'Lilita', color: INK, shadow: false }); ctx.restore();
        quix(t, { ...xq, expr: 'curious', pose: 'think', look: [0.8, 0.4], morph: 0 });
      } },
    { a: T.sewer, b: T.chain, name: 'sewer', flash: false,
      draw: t => {
        const k = ease.io(seg(t, T.sewer + 0.05, WF('sewer', 'sewer') + 0.15));
        const camY = lerp(0, SEWER_Y - 900, k);
        drawUnderworld(ctx, camY, {}, t);
        speedLines(Math.sin(k * Math.PI) * 0.8, t);
      } },
    { a: T.chain, b: T.gas, name: 'chain', noSubs: true,
      draw: t => {
        drawUnderworld(ctx, SEWER_Y - 900, {}, t);
        ctx.fillStyle = 'rgba(8,4,24,0.72)'; ctx.fillRect(0, 0, W, H);
        const w = C('chain').words;
        const rows = [['NO BEND', w[0].s, 'bend'], ['NO WATER', w[2].s, 'drop'], ['NO SEAL', w[6].s, 'shield']];
        rows.forEach(([s, t0, ic], i) => {
          const a = pop(t, t0 - 0.05, 0.35), y = 560 + i * 330;
          if (a <= 0) return;
          const pulse = i === 1 ? 1 + 0.08 * Math.max(0, Math.sin(seg(t, w[4].s, w[5].e) * Math.PI)) : 1;
          ctx.save(); ctx.translate(540, y); ctx.scale(a * pulse, a * pulse);
          // icon
          ctx.save(); ctx.translate(-330, 0); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.fillStyle = '#16123A'; ctx.beginPath(); ctx.arc(0, 0, 105, 0, 7); ctx.fill(); ctx.strokeStyle = XR.cyan; ctx.lineWidth = 8; ctx.stroke();
          if (ic === 'bend') { ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(40, -55); ctx.bezierCurveTo(50, 40, -10, 50, -20, 10); ctx.bezierCurveTo(-30, -30, -50, -20, -50, 0); ctx.lineTo(-50, 60); ctx.stroke(); }
          if (ic === 'drop') { ctx.fillStyle = '#47B4F0'; ctx.beginPath(); ctx.moveTo(0, -62); ctx.bezierCurveTo(40, -10, 52, 20, 0, 56); ctx.bezierCurveTo(-52, 20, -40, -10, 0, -62); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke(); }
          if (ic === 'shield') { ctx.fillStyle = '#2BD47D'; ctx.beginPath(); ctx.moveTo(0, -62); ctx.lineTo(52, -40); ctx.bezierCurveTo(50, 20, 30, 45, 0, 62); ctx.bezierCurveTo(-30, 45, -50, 20, -52, -40); ctx.closePath(); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke(); }
          ctx.restore();
          crossBadge(ctx, -255, 70, ease.back(seg(t, t0 + 0.2, t0 + 0.45)) * 0.75);
          txt(ctx, s, 90, 6, { size: 118, font: 'Bungee', color: i === 2 ? '#FF3B5C' : '#fff', stroke: 18 });
          ctx.restore();
          if (i < 2) { const aa = pop(t, rows[i + 1][1] - 0.15, 0.3); if (aa > 0) txt(ctx, '↓', 540, y + 165, { size: 90, color: '#FFD43B', alpha: aa, stroke: 12 }); }
        });
      } },
    { a: T.gas, b: T.into, name: 'gasrise', flash: false,
      draw: t => {
        const k = ease.io(seg(t, T.gas, T.into - 0.05));
        const camY = lerp(SEWER_Y - 900, 0, k);
        drawUnderworld(ctx, camY, { gas: 1, gasY: camY + 650 - 200 * k }, t);
        if (k > 0.85) gasBubbles(ctx, t, 'free', seg(k, 0.85, 1));
        speedLines(Math.sin(k * Math.PI) * 0.8, -t);
      } },
    { a: T.into, b: T.methane, name: 'stink',
      cam: t => ({ z: 1.04, x: 540, y: 980, shake: 16 * (1 - seg(t, T.into, T.into + 0.6)) + 3 * seg(t, WF('toxic', 'toxic'), WF('toxic', 'toxic') + 0.2) * (1 - seg(t, T.methane - 0.4, T.methane)) }),
      draw: t => {
        const fog = ease.out(seg(t, T.into, T.into + 1.1)), tx = WF('toxic', 'toxic');
        drawBathroom(ctx, { water: 0, fog, light: 1 - 0.4 * fog }, t, () => {
          const cough = t > tx ? Math.sin(t * 22) * 0.05 * (1 - seg(t, tx + 0.8, tx + 1.2)) : 0;
          quix(t, { x: BATH.quixX, y: BATH.quixY, s: 1, expr: t < T.into + 0.3 ? 'shock' : 'disgust', pose: t < T.into + 0.3 ? 'shrug' : 'nose', lean: cough, look: [0.4, -0.2], boing: boing(t, T.into, 0.3) });
        });
        // burst
        const b = seg(t, T.into, T.into + 0.7);
        if (b < 1) gasCloud(ctx, BATH.toiletX, BATH.base - 420 - b * 200, 0.6 + b * 2.4, 1 - b, t, 99);
        const eg = WF('h2s', 'rotten'), hy = WF('h2s', 'hydrogen');
        const ea = pop(t, eg - 0.1, 0.4) * (1 - seg(t, hy - 0.1, hy + 0.15));
        if (ea > 0) { ctx.save(); ctx.globalAlpha = clamp(ea); rottenEgg(ctx, 760, 640, ea * 1.25, t); ctx.restore(); }
        const ma = pop(t, hy - 0.1, 0.45), mo = seg(t, tx - 0.2, tx + 0.2);
        if (ma > 0) {
          const mx = lerp(740, 900, mo), my = lerp(600, 420, mo), ms = lerp(1.0, 0.5, mo) * ma;
          moleculeH2S(ctx, mx, my, ms, Math.sin(t * 1.5) * 0.3);
          if (mo < 1) {
            ctx.save(); ctx.globalAlpha = 1 - mo; pill(ctx, 740, 860, 560, 96, '#FFD43B', INK, 8);
            txt(ctx, 'HYDROGEN SULFIDE', 740, 866, { size: 52, font: 'Lilita', color: INK, shadow: false }); ctx.restore();
          }
        }
        const ha = pop(t, tx - 0.12, 0.4);
        if (ha > 0) {
          hazardSign(ctx, 620, 640, ha * 1.1, t);
          txt(ctx, 'TOXIC', 620, 900, { size: 120 * ha, font: 'Bungee', color: '#FF3B5C', stroke: 18, glow: '#FF3B5C' });
          ctx.save(); ctx.globalAlpha = 0.35 * (0.5 + 0.5 * Math.sin(t * 9)) * ha;
          const vg = ctx.createRadialGradient(540, 960, 500, 540, 960, 1300); vg.addColorStop(0, 'rgba(255,0,40,0)'); vg.addColorStop(1, 'rgba(255,0,40,0.9)');
          ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); ctx.restore();
        }
      } },
    { a: T.methane, b: T.hist, name: 'match',
      cam: t => {
        const f = seg(t, T.flam - 0.05, T.flam + 0.25), back = seg(t, T.hist - 0.6, T.hist);
        return { z: lerp(1.0, 1.35, ease.out(f) * (1 - ease.io(back))), x: lerp(540, 380, ease.out(f)), y: lerp(980, 1060, ease.out(f)), shake: 10 * (1 - seg(t, T.flam, T.flam + 0.4)) * (t > T.flam ? 1 : 0) };
      },
      draw: t => {
        const me = WF('methane', 'methane'), too = WF('methane', 'too'), wh = WF('methane', 'which');
        const blow = T.flam + 0.45;
        const strike = seg(t, too - 0.05, too + 0.2);
        const flame = t < too - 0.05 ? 0 : t < blow ? ease.out(strike) : 1 - seg(t, blow, blow + 0.12);
        drawBathroom(ctx, { water: 0, fog: 0.85, light: 0.6 }, t, () => {
          const scared = t > wh + 0.25;
          quix(t, { x: BATH.quixX + 30, y: BATH.quixY, s: 1, pose: 'match', match: t > me - 0.2 ? flame : null,
            expr: t < wh ? 'smug' : scared ? (t > blow + 0.1 ? 'worried' : 'shock') : 'curious',
            look: t < wh ? [0.5, -0.3] : t < wh + 0.4 ? [0.7, -0.7] : [0, 0], sweat: t > blow ? 1 : 0,
            morph: scared ? ease.out(seg(t, wh + 0.25, wh + 0.4)) : 0, glow: scared ? 0.7 : 0, boing: boing(t, wh + 0.25, 0.4),
            talk: !(t > T.flam + 0.35 && t < blow + 0.3) });
          if (t > blow && t < blow + 1.2) { // smoke puff from blowing it out
            const k = seg(t, blow, blow + 1.2);
            puff(ctx, BATH.quixX + 230 + k * 60, BATH.quixY - 330 - k * 160, 40 + k * 90, 'rgba(220,220,230,0.8)', 1 - k, 5, t);
          }
        });
        const ma = pop(t, me - 0.12, 0.45) * (1 - seg(t, wh - 0.1, wh + 0.2));
        if (ma > 0) {
          moleculeCH4(ctx, 760, 600, 0.9 * ma, t * 0.8);
          ctx.save(); ctx.globalAlpha = clamp(ma); pill(ctx, 760, 850, 380, 96, '#FFD43B', INK, 8);
          txt(ctx, 'METHANE', 760, 856, { size: 56, font: 'Lilita', color: INK, shadow: false }); ctx.restore();
        }
        const fa = pop(t, T.flam, 0.35);
        if (fa > 0) {
          ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); // screen-space text despite camera zoom
          ctx.translate(540, 560); ctx.rotate(-0.06 + Math.sin(t * 30) * 0.01 * (1 - seg(t, T.flam, T.flam + 0.5))); ctx.scale(fa, fa);
          txt(ctx, 'FLAMMABLE', 0, 0, { size: 140, font: 'Bungee', color: '#FF8A1F', stroke: 22, glow: '#FF5A1F', glowBlur: 50 });
          ctx.restore();
        }
      } },
    { a: T.hist, b: T.restore, name: 'history', noBadge: true,
      draw: t => {
        if (t < T.y1775) { // rewind
          const k = seg(t, T.hist, T.y1775);
          drawBathroom(ctx, { water: 0, fog: 0.85, light: 0.6 }, t, () => quix(t, { x: BATH.quixX + 30, y: BATH.quixY, s: 1, expr: 'cool', pose: 'idle', talk: true }));
          ctx.save(); ctx.globalCompositeOperation = 'color'; ctx.fillStyle = '#3050A0'; ctx.globalAlpha = 0.6; ctx.fillRect(0, 0, W, H); ctx.restore();
          ctx.fillStyle = 'rgba(5,10,30,0.45)'; ctx.fillRect(0, 0, W, H);
          for (let i = 0; i < 8; i++) { const y = (hash(i + Math.floor(t * 30)) * H); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(0, y, W, 6 + hash(i) * 20); }
          glitch(0.5, Math.floor(t * 30));
          const year = Math.round(lerp(2026, 1775, ease.in(k)));
          txt(ctx, '◀◀ REWIND', 60, 250, { size: 60, font: 'Bungee', align: 'left', color: '#fff', stroke: 12 });
          txt(ctx, String(year), 540, 860, { size: 240, font: 'Bungee', color: '#fff', stroke: 26, glow: '#5CE1FF', glowBlur: 40 });
          return;
        }
        ctx.drawImage(getParch(), 0, 0);
        const wm = WF('history', 'watchmaker'), nm = WF('history', 'named'), pt = WF('history', 'patented'), toi = WF('history', 'toilet'), bend = WF('history', 'bend');
        const phaseB = ease.io(seg(t, pt - 0.25, pt + 0.25));
        // year stamp
        const ys = seg(t, T.y1775, T.y1775 + 0.25);
        ctx.save(); ctx.translate(540, 300); ctx.rotate(-0.05); ctx.scale(lerp(2.4, 1, ease.out(ys)), lerp(2.4, 1, ease.out(ys)));
        ctx.globalAlpha = clamp(ys * 2);
        txt(ctx, '1775', 0, 0, { size: 230, font: 'Bungee', color: '#7A2E1C', shadow: false });
        ctx.restore();
        // watch
        const wa = ease.back(seg(t, wm - 0.15, wm + 0.35));
        if (wa > 0) pocketWatch(ctx, lerp(810, 1120, phaseB), lerp(-400, 760, wa), 1.0, t);
        // cameo + nameplate
        const ca = ease.out(seg(t, nm - 0.1, nm + 0.35));
        if (ca > 0) {
          const cx = lerp(-300, 290, ca) - 400 * phaseB;
          cameo(ctx, cx, 780, 1.0, t);
          pill(ctx, cx, 1080, 440, 120, '#3A2A10', null);
          txt(ctx, 'ALEXANDER CUMMING', cx, 1062, { size: 40, font: 'Lilita', color: '#F3E3BD', shadow: false });
          txt(ctx, 'WATCHMAKER', cx, 1106, { size: 30, font: 'Lilita', color: '#D4A23C', shadow: false });
        }
        // Quix in a powdered wig
        const qa = ease.out(seg(t, T.y1775 + 0.5, T.y1775 + 0.9)) * (1 - ease.in(phaseB));
        if (qa > 0) quix(t, { x: 610, y: lerp(1700, 1400, qa), s: 0.62, expr: 'smug', pose: 'thumb', wig: true, shadow: true });
        // patent
        if (phaseB > 0) {
          patentDoc(ctx, 540, lerp(2300, 930, phaseB), 0.98, seg(t, toi - 0.3, bend + 0.2), seg(t, bend - 0.1, bend + 0.2) * (0.7 + 0.3 * Math.sin(t * 10)), t);
          const sa = seg(t, pt + 0.25, pt + 0.45);
          if (sa > 0) waxSeal(ctx, 790, 1230, lerp(2.0, 1.0, ease.out(sa)));
        }
        ctx.save(); const vg = ctx.createRadialGradient(540, 960, 600, 540, 960, 1250); vg.addColorStop(0, 'rgba(60,35,10,0)'); vg.addColorStop(1, 'rgba(60,35,10,0.55)');
        ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); ctx.restore();
      } },
    { a: T.restore, b: T.tip, name: 'restore',
      cam: t => t < T.clean ? { z: 1.08, x: 560, y: 1100 } : { z: lerp(1.12, 1.0, ease.out(seg(t, T.clean, T.clean + 0.6))), x: 540, y: 980 },
      draw: t => {
        if (t < T.clean) {
          const p = 1 - ease.out(seg(t, T.restore + 0.05, T.restore + 0.85));
          const water = ease.io(seg(t, T.restore + 0.7, T.restore + 1.2));
          xrayBG(ctx, t);
          if (p > 0.001) { xrayToilet(ctx, { trap: 0, hideTube: true, water: 0 }, t); trapDissolve(ctx, p, t); }
          else xrayToilet(ctx, { trap: 1, water }, t);
          if (water > 0.5) gasBubbles(ctx, t, 'blocked', seg(water, 0.5, 1));
          const r = quix(t, { ...xq, expr: 'happy', pose: 'cheer', glow: p > 0 ? 1 : 0.3, look: [0.8, 0.2] });
          beam(r.tip[0], r.tip[1], 575, 1210, t, p > 0.02 ? 1 : 0, '#FFD43B');
          checkBadge(ctx, 820, 1110, pop(t, WF('restore', 'curve') - 0.05, 0.4) * 1.2);
          return;
        }
        const k = seg(t, T.clean, T.clean + 0.9);
        drawBathroom(ctx, { water: 1, fog: 0.85 * (1 - ease.io(k)), clean: ease.out(k), light: lerp(0.6, 1.2, k) }, t, () => {
          quix(t, { x: BATH.quixX + 20, y: BATH.quixY, s: 1, expr: 'happy', pose: t < WF('restore', 'smelling') ? 'cheer' : 'thumb', glow: 0.5, look: [0, 0], boing: boing(t, T.clean, 0.3) });
        });
      } },
    { a: T.tip, b: T.outro, name: 'tip',
      cam: t => ({ z: 1.1 + 0.03 * ease.io(seg(t, T.tip, T.outro)), x: 585, y: 900 }),
      draw: t => {
        const run = WF('tip', 'run'), stink = WF('tip', 'stink'), dr = WF('dried', 'seal');
        const tapK = ease.out(seg(t, run - 0.25, run + 0.1));
        const flow = seg(t, run, run + 0.2) * (1 - seg(t, dr + 0.6, dr + 0.9));
        const level = lerp(0.1, 1, ease.io(seg(t, run + 0.15, run + 1.0)));
        const sa = seg(t, stink - 0.4, stink) * (1 - seg(t, run + 0.5, run + 0.9));
        const r = drawSinkScene(ctx, { tap: -0.8 * tapK, flow, level, stink: sa }, t);
        const reach = ease.io(seg(t, run - 0.55, run - 0.2)) * (1 - ease.io(seg(t, run + 0.6, run + 1.0)));
        const pose = QUIX.mixPose(t > dr ? 'thumb' : 'idle', { L: [-190, -95, -30, 'fist', null], R: [555, -1060, 140, 'open', -0.6] }, reach);
        quix(t, { x: 245, y: 1330, s: 0.75, expr: sa > 0.3 ? 'disgust' : t > run + 0.6 ? 'happy' : 'cool', pose,
          morph: ease.out(seg(t, T.tip, T.tip + 0.3)) * (1 - seg(t, run, run + 0.3)), glow: 0.5, look: [0.6, -0.3] });
        // dust motes
        for (let i = 0; i < 20; i++) { const x = hash(i) * W + Math.sin(t + i) * 30, y = (hash(i + 4) * 1200 + t * 20) % 1200; ctx.fillStyle = 'rgba(255,255,230,0.35)'; ctx.beginPath(); ctx.arc(x, y + 100, 3 + hash(i) * 3, 0, 7); ctx.fill(); }
        const ba = pop(t, T.tip + 0.05, 0.4);
        if (ba > 0) {
          ctx.save(); ctx.translate(540, 330); ctx.scale(ba, ba); ctx.rotate(-0.04);
          pill(ctx, 0, 0, 520, 140, '#FFD43B', INK, 10);
          txt(ctx, 'PRO TIP', 30, 6, { size: 92, font: 'Bungee', color: INK, shadow: false });
          ctx.beginPath(); ctx.arc(-200, 0, 46, 0, 7); ctx.fillStyle = INK; ctx.fill();
          txt(ctx, '!', -200, 4, { size: 70, font: 'Bungee', color: '#FFD43B', shadow: false });
          ctx.restore();
        }
        const ca = pop(t, dr - 0.1, 0.4);
        if (ca > 0) { checkBadge(ctx, 870, 1120, ca * 1.1); }
      } },
    'OUTRO',
  ];

  // SFX cue sheet for the audio mixer
  const sfx = [
    ['pop', WF('hook', 'water')], ['whoosh_scan', T.reveal], ['ding', WF('reveal', 'bend') - 0.05],
    ['crumble', T.del + 0.2], ['stamp', T.del + 0.35],
    ['gurgle', T.mistake], ['boing', WF('mistake', 'mistake') - 0.15],
    ['ding', WF('seal', 'seal') - 0.1], ['whoosh_down', T.sewer + 0.05], ['drip', WF('sewer', 'sewer') + 0.2],
    ['hit', C('chain').words[0].s], ['hit', C('chain').words[2].s], ['hit', C('chain').words[6].s],
    ['whoosh_up', T.gas], ['burst', T.into], ['fly', WF('h2s', 'rotten')], ['pop', WF('h2s', 'hydrogen')],
    ['alarm', WF('toxic', 'toxic') - 0.1], ['pop', WF('methane', 'methane') - 0.1], ['strike', WF('methane', 'too') - 0.05],
    ['boing', WF('methane', 'which') + 0.25], ['hit_big', T.flam], ['blow', T.flam + 0.45],
    ['rewind', T.hist], ['stamp', T.y1775], ['tick', WF('history', 'watchmaker') - 0.1], ['whoosh', WF('history', 'named') - 0.1],
    ['whoosh', WF('history', 'patented') - 0.25], ['stamp', WF('history', 'patented') + 0.25], ['ding', WF('history', 'bend') - 0.1],
    ['rebuild', T.restore + 0.05], ['ding', WF('restore', 'curve') - 0.05], ['sparkle', T.clean],
    ['pop', T.tip + 0.05], ['squeak', WF('tip', 'run') - 0.25], ['water', WF('tip', 'run')], ['ding', WF('dried', 'seal') - 0.1],
  ];
  return { shots, sfx, music: { drops: [[T.flam - 0.75, T.flam + 0.75, 1]], radio: [[T.y1775, T.restore]] } };
  },
};

