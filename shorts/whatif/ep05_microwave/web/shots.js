// EP05 — What if microwaves had no metal mesh in the door?
window.EPISODE = {
  badge: '#5',
  title: ['WHAT IF MICROWAVES', 'HAD NO METAL MESH?'],
  noSubsCues: [],
  followText: 'FOLLOW FOR EP. 06',
  build() {
    const L = C;
    Object.assign(T, {
      reveal: L('reveal').s - 0.15, wifi: L('wifi').s - 0.12, freq: L('freq').s - 0.12, leak: L('leak').s - 0.12,
      water: L('water').s - 0.1, how: L('how').s - 0.12, hist: L('history').s - 0.12, y1945: WF('history', '1945') - 0.06,
      giant: L('giant').s - 0.1, restore: L('restore').s - 0.12,
    });
    const q = (t, o) => quix(t, Object.assign({ x: 165, y: COUNTER, s: 0.72, look: [0.8, -0.1] }, o));

    const shots = [
      { a: 0, b: T.reveal, name: 'hook',
        cam: t => { const k = ease.io(seg(t, 0.5, T.reveal)); return { z: lerp(1.0, 1.2, k), x: lerp(540, 560, k), y: lerp(960, 1000, k) }; },
        draw: t => {
          const k = ease.io(seg(t, 0.6, 1.1)), hl = WF('hook', 'holes');
          drawKitchen(ctx, { run: 1, glowMesh: fadeIO(t, WF('hook', 'see') - 0.1, T.reveal + 2, 0.15) }, t, () =>
            q(t, { expr: t < 0.8 ? 'cool' : 'curious', pose: QUIX.mixPose('idle', 'point', k), look: [0.9 * k, -0.1], boing: boing(t, 0.9, 0.25) }));
        } },
      { a: T.reveal, b: T.intro, name: 'reveal',
        cam: t => { const k = ease.io(seg(t, T.reveal, T.reveal + 0.7)); return { z: lerp(1.2, 2.3, k), x: lerp(560, WIN5_C[0], k), y: lerp(1000, WIN5_C[1], k) }; },
        draw: t => {
          drawKitchen(ctx, { run: 1, glowMesh: 1 }, t, () => q(t, { expr: 'curious', pose: 'point' }));
          screenSpace(ctx, () => {
            bigLabel(ctx, 'METAL MESH', 540, 690, null, null, pop(t, WF('reveal', 'mesh') - 0.1, 0.4), 64);
            chip(ctx, '= A SHIELD 🛡', 540, 830, pop(t, WF('reveal', 'shield') - 0.1, 0.35), '#2BD47D');
          });
        } },
      'INTRO',
      { a: T.del, b: T.wifi, name: 'delete',
        cam: t => ({ z: 1.1, x: 560, y: 1000, shake: 12 * (1 - seg(t, T.del, T.del + 0.6)) }),
        draw: t => {
          const p = ease.in(seg(t, T.del + 0.15, T.del + 0.95));
          drawKitchen(ctx, { run: 1, mesh: t < T.del + 0.15 ? 1 : 0, leak: ease.io(seg(t, T.del + 0.8, T.wifi)) }, t, () => {
            const r = q(t, { expr: 'smug', pose: 'cheer', glow: 1 - seg(t, T.del + 0.5, T.del + 1), look: [0.8, -0.2] });
            beam(r.tip[0], r.tip[1], WIN5_C[0], WIN5_C[1], t, 1 - seg(t, T.del + 0.55, T.del + 0.75));
          });
          meshDissolve(ctx, p);
          stamp('DELETED', 540, 520, t, T.del + 0.35, T.wifi + 0.2);
        },
        post: t => glitch(1 - seg(t, T.del + 0.05, T.del + 0.6), Math.floor(t * 30)) },
      { a: T.wifi, b: T.freq, name: 'wifi',
        cam: t => ({ z: 1.05, x: 540, y: 980, shake: 4 * seg(t, WF('wifi', 'lose'), WF('wifi', 'lose') + 0.3) }),
        draw: t => {
          const lo = WF('wifi', 'lose');
          drawKitchen(ctx, { run: 1, mesh: 0, leak: 1, pops: true }, t, () =>
            q(t, { expr: t < lo ? 'curious' : 'shock', pose: t < lo ? 'think' : 'shrug', morph: ease.out(seg(t, lo - 0.1, lo + 0.1)), glow: 0.5, sweat: t > lo ? 1 : 0, boing: boing(t, lo - 0.1, 0.4) }));
          const bars = t < lo - 0.2 ? 3 : Math.max(0, 3 - Math.floor((t - lo + 0.2) * 6));
          wifiIcon(ctx, 820, 610, 1.1, bars, bars === 0, t);
          chip(ctx, 'NO INTERNET', 820, 820, pop(t, WF('wifi', 'wifi') + 0.1, 0.35), '#FF3B5C', 44);
        } },
      { a: T.freq, b: T.leak, name: 'freq',
        draw: t => {
          drawKitchen(ctx, { run: 1, mesh: 0, leak: 0.6 }, t);
          ctx.fillStyle = 'rgba(20,10,40,0.72)'; ctx.fillRect(0, 0, W, H);
          const cards = [['MICROWAVE', '2.45 GHz', '#FF8A1F', WF('freq', 'microwaves')], ['WI-FI', '2.4 GHz', '#2BD47D', WF('freq', 'wifi')]];
          cards.forEach(([n, f, col, t0], i) => {
            const a = pop(t, t0 - 0.1, 0.4); if (a <= 0) return;
            const x = 280 + i * 520, y = 820;
            ctx.save(); ctx.translate(x, y); ctx.scale(a, a); ctx.rotate((i ? 0.05 : -0.05));
            ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(-200, -230, 400, 460, 30); ctx.fill(); ctx.stroke();
            ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-200, -230, 400, 110, [30, 30, 0, 0]); ctx.fill(); ctx.stroke();
            txt(ctx, n, 0, -172, { size: 52, font: 'Bungee', color: '#fff', stroke: 10 });
            txt(ctx, f, 0, 40, { size: 74, font: 'Bungee', color: INK, shadow: false });
            if (i) wifiIcon(ctx, 0, 110, 0.45, 3, false, t); else { ctx.strokeStyle = col; ctx.lineWidth = 10; ctx.beginPath(); for (let x2 = -140; x2 <= 140; x2 += 6) { const y2 = 150 + 30 * Math.sin(x2 * 0.06 - t * 8); x2 === -140 ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2); } ctx.stroke(); }
            ctx.restore();
          });
          if (t > WF('freq', 'wifi')) txt(ctx, '≈', 540, 820, { size: 150, font: 'Bungee', color: '#FFD43B', stroke: 18, alpha: pop(t, WF('freq', 'wifi') + 0.2, 0.3) });
          stamp('SAME!', 540, 1250, t, WF('freq', 'frequency') - 0.05, T.leak + 0.2, '#FFD43B', 110, -0.08);
        } },
      { a: T.leak, b: T.water, name: 'leak',
        cam: t => ({ z: lerp(1.0, 1.08, ease.io(seg(t, T.leak, T.water))), x: 540, y: 980 }),
        draw: t => {
          drawKitchen(ctx, { run: 1, mesh: 0, leak: 1, pops: true, heat: 0.4 * seg(t, WF('leak', 'heat') - 0.2, WF('leak', 'heat') + 0.4) }, t, () =>
            q(t, { expr: 'worried', pose: 'shrug', lean: -0.08, look: [0.8, 0], sweat: 1 }));
          chip(ctx, 'POURING OUT', 540, 520, pop(t, WF('leak', 'pour') - 0.1, 0.35) * (1 - seg(t, WF('leak', 'heat') - 0.4, WF('leak', 'heat') - 0.2)), '#FF8A1F');
          bigLabel(ctx, 'SAME WAVES AS COOKING', 540, 520, null, null, pop(t, WF('leak', 'heat') - 0.1, 0.4), 44, '#FF8A1F');
        } },
      { a: T.water, b: T.how, name: 'water',
        cam: t => ({ z: lerp(1.0, 1.06, ease.io(seg(t, T.water, T.how))), x: 540, y: 960 }),
        draw: t => {
          const yu = WF('water', 'you');
          const g = ctx.createRadialGradient(540, 860, 60, 540, 900, 1100); g.addColorStop(0, '#FF8A3D'); g.addColorStop(0.5, '#8A2A3A'); g.addColorStop(1, '#25081A');
          ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
          const wig = seg(t, WF('water', 'wiggle') - 0.2, WF('water', 'wiggle') + 0.3);
          for (let i = 0; i < 9; i++) {
            const x = 200 + (i % 3) * 340 + Math.sin(t * 20 + i) * 22 * wig, y = 480 + Math.floor(i / 3) * 300 + Math.cos(t * 23 + i) * 22 * wig;
            const a = pop(t, T.water + i * 0.05, 0.3);
            if (a > 0) h2o(ctx, x, y, 0.8 * a, Math.sin(t * (4 + 14 * wig) + i) * (0.3 + 0.9 * wig));
            if (wig > 0.3) stinkLines(ctx, x, y - 90, 70, t, 0.6 * wig, '#FFB020');
          }
          chip(ctx, 'H2O = WATER', 540, 1300, pop(t, WF('water', 'water') - 0.1, 0.35), '#FF5A5A');
          const ya = pop(t, yu - 0.25, 0.4);
          if (ya > 0) {
            ctx.fillStyle = `rgba(20,5,15,${0.55 * clamp(ya)})`; ctx.fillRect(0, 0, W, H);
            quix(t, { x: 540, y: 1360, s: 1.1 * ya, expr: 'shock', pose: 'shrug', sweat: 1, look: [0, -0.2], boing: boing(t, yu - 0.2, 0.4) });
            txt(ctx, 'INCLUDING YOU', 540, 500, { size: 90 * ya, font: 'Bungee', color: '#FF8A3D', stroke: 16, glow: '#FF5A1F' });
          }
        } },
      { a: T.how, b: T.hist, name: 'board',
        draw: t => {
          drawWaveBoard(ctx, {
            ruler: seg(t, WF('how', '12') - 0.15, WF('how', '12') + 0.2), holes: seg(t, WF('holes', 'millimeter') - 0.2, WF('holes', 'millimeter') + 0.2),
            bounce: seg(t, WF('holes', 'squeeze') - 0.2, WF('holes', 'squeeze') + 0.3), light: seg(t, WF('holes', 'light', 1) - 0.3, WF('holes', 'light', 1) + 0.2),
          }, t);
          chip(ctx, 'HOW?', 540, 360, pop(t, T.how + 0.1, 0.35) * (1 - seg(t, WF('how', 'microwaves') - 0.3, WF('how', 'microwaves'))), '#FFD43B');
          chip(ctx, 'MICROWAVE', 300, 360, pop(t, WF('how', 'microwaves') - 0.1, 0.35), '#FF8A1F', 40);
        } },
      { a: T.hist, b: T.giant, name: 'history', noBadge: true,
        draw: t => {
          if (t < T.y1945) {
            drawWaveBoard(ctx, { light: 1 }, t);
            rewindFX(ctx, t, seg(t, T.hist, T.y1945), 2026, 1945); return;
          }
          ctx.drawImage(getParch(), 0, 0);
          const ys = seg(t, T.y1945, T.y1945 + 0.25), pc = WF('history', 'percy'), rd = WF('history', 'radar'), cb = WF('history', 'candy'), ml = WF('history', 'melted');
          ctx.save(); ctx.translate(540, 300); ctx.rotate(-0.05); ctx.scale(lerp(2.4, 1, ease.out(ys)), lerp(2.4, 1, ease.out(ys))); ctx.globalAlpha = clamp(ys * 2);
          txt(ctx, '1945', 0, 0, { size: 210, font: 'Bungee', color: '#7A2E1C', shadow: false }); ctx.restore();
          chip(ctx, 'PERCY SPENCER · ENGINEER', 540, 470, pop(t, pc - 0.1, 0.35), '#B8892E', 42);
          const ma = ease.out(seg(t, rd - 0.3, rd + 0.2));
          if (ma > 0) magnetron(ctx, lerp(1300, 760, ma), 860, 1.0, seg(t, rd, rd + 0.4) * (0.7 + 0.3 * Math.sin(t * 9)), t);
          const r = quix(t, { x: 330, y: 1400, s: 0.85, hat: 'fedora', expr: t > ml ? 'shock' : 'curious', pose: t > cb - 0.2 ? 'tap' : 'idle', look: [0.7, -0.2], boing: boing(t, ml, 0.35) });
          if (t > cb - 0.3) candyBar(ctx, 330 + 250 * 0.85, 1400 - 170 * 0.85, ease.io(seg(t, ml - 0.3, ml + 0.6)), t);
          if (t > ml) stamp('MELTED!', 760, 1180, t, ml, T.giant + 0.3, '#8C1C13', 90, -0.1);
          sepiaVignette(ctx);
        } },
      { a: T.giant, b: T.restore, name: 'giant', noBadge: true,
        draw: t => {
          ctx.drawImage(getParch(), 0, 0);
          const rise = ease.back(seg(t, T.giant, T.giant + 0.6)), sx = WF('giant', 'six');
          radarange(ctx, 680, 1420, rise);
          chip(ctx, 'RADARANGE · 1947', 680, 380, pop(t, T.giant + 0.3, 0.35), '#B8892E', 44);
          if (t > sx - 0.2) {
            const a = seg(t, sx - 0.2, sx + 0.3);
            ctx.strokeStyle = '#7A2E1C'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(920, 1420); ctx.lineTo(920, 1420 - 900 * a); ctx.moveTo(890, 1420); ctx.lineTo(950, 1420); ctx.moveTo(890, 1420 - 900 * a); ctx.lineTo(950, 1420 - 900 * a); ctx.stroke();
            txt(ctx, '≈ 1.8 M', 920, 1420 - 960 * a, { size: 54, font: 'Bungee', color: '#7A2E1C', shadow: false });
          }
          quix(t, { x: 300, y: 1420, s: 0.7, hat: 'fedora', expr: 'shock', pose: 'shrug', look: [0.6, -0.9], boing: boing(t, sx, 0.3) });
          sepiaVignette(ctx);
        } },
      { a: T.restore, b: T.outro, name: 'restore',
        cam: t => ({ z: lerp(1.12, 1.0, ease.out(seg(t, T.restore, T.restore + 0.8))), x: 540, y: 980 }),
        draw: t => {
          const back = ease.out(seg(t, T.restore + 0.05, T.restore + 0.7)), pc = WF('restore', 'popcorn'), ck = WF('restore', 'cooking');
          drawKitchen(ctx, { run: 1, mesh: back, leak: 1 - back, puff: seg(t, pc - 0.5, pc + 0.3), pops: true }, t, () => {
            quix(t, { x: 165, y: COUNTER, s: 0.72, expr: 'happy', pose: 'tap', look: [0.8, 0], glow: 0.4 });
            popcornBucket(ctx, 165 + 250 * 0.72, COUNTER - 170 * 0.72, 0.75);
          });
          if (back < 1) for (let i = 0; i < 6; i++) sparkle(ctx, WIN5.x + hash(i) * WIN5.w, WIN5.y + hash(i + 3) * WIN5.h, 40 * Math.sin(back * Math.PI), 1);
          const ca = pop(t, ck - 0.15, 0.4); if (ca > 0) checkBadge(ctx, 860, 600, ca * 1.2);
        } },
      'OUTRO',
    ];

    const sfx = [
      ['mw_hum', 0.0], ['pop', WF('hook', 'holes') - 0.1], ['whoosh', T.reveal], ['ding', WF('reveal', 'shield') - 0.1],
      ['crumble', T.del + 0.2], ['stamp', T.del + 0.35], ['mw_hum', T.del + 0.6, 0.8],
      ['wifi_down', WF('wifi', 'lose') - 0.2], ['boing', WF('wifi', 'lose') - 0.1], ['popcorn', T.wifi + 0.3, 0.6],
      ['pop', WF('freq', 'microwaves') - 0.1], ['pop', WF('freq', 'wifi') - 0.1], ['stamp', WF('freq', 'frequency') - 0.05],
      ['whoosh', T.leak], ['mw_hum', T.leak + 0.2, 0.7], ['sizzle', WF('leak', 'heat') - 0.1, 0.6],
      ['whoosh', T.water], ['sizzle', WF('water', 'wiggle') - 0.1], ['hit', WF('water', 'you') - 0.2],
      ['whoosh_scan', T.how], ['ding', WF('how', '12') - 0.1], ['pop', WF('holes', 'millimeter') - 0.15], ['boing', WF('holes', 'squeeze') - 0.1], ['sparkle', WF('holes', 'light', 1) - 0.2],
      ['rewind', T.hist], ['stamp', T.y1945], ['pop', WF('history', 'percy') - 0.1], ['mw_hum', WF('history', 'radar') - 0.2, 0.6], ['sizzle', WF('history', 'melted') - 0.2], ['stamp', WF('history', 'melted')],
      ['whoosh_up', T.giant, 0.7], ['boing', WF('giant', 'six')],
      ['sparkle', T.restore + 0.05], ['beep3', WF('restore', 'popcorn') - 0.3], ['popcorn', WF('restore', 'popcorn')], ['ding', WF('restore', 'cooking') - 0.15],
    ];
    return { shots, sfx, music: { drops: [], radio: [] } };
  },
};
