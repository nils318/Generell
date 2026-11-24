// EP04 — What if coins had no ridges? (reeding, clipping, Newton)
window.EPISODE = {
  badge: '#4',
  title: ['WHAT IF COINS', 'HAD NO RIDGES?'],
  noSubsCues: [],
  followText: 'FOLLOW FOR EP. 05',
  build() {
    const L = C;
    Object.assign(T, {
      reveal: L('reveal').s - 0.15, react: L('react').s - 0.1, past: L('past').s - 0.1, y1600: WF('past', '1600s') - 0.06,
      silver: L('silver').s - 0.12, melt: L('melt').s - 0.1, spend: L('spend').s - 0.1, trust: L('trust').s - 0.1,
      treason: L('treason').s - 0.1, fix: L('fix').s - 0.1, newton: L('newton').s - 0.1, today: L('today').s - 0.12,
    });
    const CX = 690, CR = 320, CY = GROUND4 - CR, COIN = { yaw: 0.62, thick: 72, metal: 'silver' };
    const q = (t, o) => quix(t, Object.assign({ x: 200, y: GROUND4, s: 0.8, look: [0.8, -0.1] }, o));
    const wigQ = (t, o) => quix(t, Object.assign({ x: 165, y: 1440, s: 0.55, wig: true, look: [0.7, -0.4] }, o));
    const ridgeDissolve = makeDissolver(g => coin3D(g, CX, CY, CR, { ...COIN, ridges: 1, bandOnly: true }, 0), [CX - 30, CY - CR - 10, CX + CR + 90, CY + CR + 10], 9);
    const parch = () => { ctx.drawImage(getParch(), 0, 0); };

    const shots = [
      { a: 0, b: T.reveal, name: 'hook',
        cam: t => { const k = ease.io(seg(t, 0, T.reveal)); return { z: lerp(1.0, 1.1, k), x: lerp(540, 600, k), y: 980 }; },
        draw: t => {
          const k = ease.io(seg(t, 0.7, 1.2)), rd = WF('hook', 'ridges');
          studioBG(ctx, t);
          coin3D(ctx, CX, CY, CR, { ...COIN, spin: t * 2, glow: fadeIO(t, rd - 0.1, T.reveal + 2, 0.2) * (0.6 + 0.4 * Math.sin(t * 10)) }, t);
          q(t, { expr: t < 0.8 ? 'cool' : 'curious', pose: QUIX.mixPose('idle', 'point', k), look: [0.9 * k, -0.2 * k], boing: boing(t, 0.9, 0.25) });
        } },
      { a: T.reveal, b: T.intro, name: 'reveal',
        cam: t => { const k = ease.io(seg(t, T.reveal, T.reveal + 0.7)); return { z: lerp(1.1, 1.9, k), x: lerp(600, CX + 250, k), y: lerp(980, CY + 40, k) }; },
        draw: t => {
          studioBG(ctx, t);
          coin3D(ctx, CX, CY, CR, { ...COIN, spin: t * 2, glow: 0.7 + 0.3 * Math.sin(t * 10) }, t);
          q(t, { expr: 'curious', pose: 'point', look: [0.9, -0.2] });
          screenSpace(ctx, () => {
            bigLabel(ctx, 'REEDING', 540, 700, null, null, pop(t, WF('reveal', 'reeding') - 0.1, 0.4), 70);
            chip(ctx, 'STOPPED A CRIME WAVE', 540, 850, pop(t, WF('reveal', 'crime') - 0.15, 0.4), '#FF3B5C');
          });
        } },
      'INTRO',
      { a: T.del, b: T.react, name: 'delete',
        cam: t => ({ z: 1.05, x: 560, y: 980, shake: 12 * (1 - seg(t, T.del, T.del + 0.6)) }),
        draw: t => {
          const p = ease.in(seg(t, T.del + 0.15, T.del + 0.95));
          studioBG(ctx, t);
          coin3D(ctx, CX, CY, CR, { ...COIN, ridges: t < T.del + 0.15 ? 1 : 0, spin: t * 2 }, t);
          if (t >= T.del + 0.15) ridgeDissolve(ctx, p);
          const r = q(t, { expr: 'smug', pose: 'cheer', glow: 1 - seg(t, T.del + 0.5, T.del + 1), look: [0.8, -0.3] });
          beam(r.tip[0], r.tip[1], CX + CR * 0.85, CY - 40, t, 1 - seg(t, T.del + 0.55, T.del + 0.75));
          stamp('DELETED', 540, 520, t, T.del + 0.35, T.react + 0.2);
        },
        post: t => glitch(1 - seg(t, T.del + 0.05, T.del + 0.6), Math.floor(t * 30)) },
      { a: T.react, b: T.past, name: 'react',
        draw: t => {
          const wr = WF('react', 'wrong');
          studioBG(ctx, t);
          coin3D(ctx, CX, CY, CR, { ...COIN, ridges: 0, smoothSheen: true, spin: t * 2 }, t);
          for (let i = 0; i < 5; i++) sparkle(ctx, CX - 200 + hash(i) * 400, CY - 250 + hash(i + 4) * 500, 26 * Math.abs(Math.sin(t * 3 + i)), 1);
          q(t, { expr: t < wr ? 'smug' : 'worried', pose: t < wr ? 'thumb' : 'shrug', look: [0.6, -0.2], boing: boing(t, wr - 0.1, 0.3) });
          chip(ctx, 'SMOOTH ✓', 300, 500, pop(t, WF('react', 'smooth') - 0.1, 0.35), '#2BD47D');
          chip(ctx, 'SHINY ✓', 760, 420, pop(t, WF('react', 'shiny') - 0.1, 0.35), '#2BD47D');
        } },
      { a: T.past, b: T.silver, name: 'past', noBadge: true,
        draw: t => {
          if (t < T.y1600) {
            studioBG(ctx, t); coin3D(ctx, CX, CY, CR, { ...COIN, ridges: 0, spin: -t * 8 }, t); q(t, { expr: 'cool', pose: 'idle' });
            rewindFX(ctx, t, seg(t, T.past, T.y1600), 2026, 1600); return;
          }
          parch();
          const ys = seg(t, T.y1600, T.y1600 + 0.25);
          ctx.save(); ctx.translate(540, 560); ctx.rotate(-0.05); ctx.scale(lerp(2.4, 1, ease.out(ys)), lerp(2.4, 1, ease.out(ys))); ctx.globalAlpha = clamp(ys * 2);
          txt(ctx, '1600s', 0, 0, { size: 230, font: 'Bungee', color: '#7A2E1C', shadow: false }); ctx.restore();
          txt(ctx, 'ENGLAND', 540, 740, { size: 64, font: 'Bungee', color: '#5A4220', shadow: false, alpha: seg(t, T.y1600 + 0.2, T.y1600 + 0.5) });
          wigQ(t, { x: 540, y: lerp(1700, 1430, ease.out(seg(t, T.y1600 + 0.3, T.y1600 + 0.7))), s: 0.7, expr: 'curious', pose: 'hips' });
          sepiaVignette(ctx);
        } },
      { a: T.silver, b: T.melt, name: 'silver',
        draw: t => {
          parch();
          const sh = WF('silver', 'shaved'), ed = WF('silver', 'edges');
          const clip = ease.io(seg(t, sh, ed + 0.4));
          oldCoin(ctx, 520, 760, 280, clip);
          chip(ctx, 'REAL SILVER', 540, 380, pop(t, WF('silver', 'silver') - 0.15, 0.35), '#C9C6BA');
          if (t > sh - 0.4) {
            const cut = Math.abs(Math.sin((t - sh) * 9));
            const ang = lerp(0.4, 4.1, seg(t, sh, ed + 0.4));
            shears(ctx, 520 + Math.cos(ang) * 330, 760 + Math.sin(ang) * 330, cut, ang + Math.PI);
          }
          for (let i = 0; i < 12; i++) {
            const t0 = sh + i * 0.18; if (t < t0) continue;
            const k = clamp((t - t0) / 0.7), a = 0.4 + i * 0.31;
            sliver(ctx, lerp(520 + Math.cos(a) * 290, 380 + i * 26, k), lerp(760 + Math.sin(a) * 290, 1260 + (i % 3) * 14, k * k), 1, i + k * 4);
          }
          wigQ(t, { x: 880, y: 1440, expr: clip > 0.3 ? 'shock' : 'curious', pose: clip > 0.3 ? 'shrug' : 'idle', look: [-0.7, -0.4] });
          sepiaVignette(ctx);
        } },
      { a: T.melt, b: T.spend, name: 'melt',
        draw: t => {
          parch();
          const ml = WF('melt', 'melt'), fr = WF('melt', 'free');
          crucible(ctx, 540, 1020, ease.out(seg(t, ml, ml + 0.6)), t);
          for (let i = 0; i < 10; i++) {
            const t0 = T.melt + i * 0.1, k = clamp((t - t0) / 0.6); if (k <= 0 || k >= 1) continue;
            sliver(ctx, 400 + i * 30, lerp(300, 980, k * k), 1, i + k * 6);
          }
          const ia = pop(t, fr - 0.15, 0.45);
          if (ia > 0) {
            ingot(ctx, 540, lerp(900, 600, ease.out(seg(t, fr - 0.15, fr + 0.3))), ia * 1.1, t);
            for (let i = 0; i < 6; i++) sparkle(ctx, 540 + Math.cos(i + t * 2) * 230, 600 + Math.sin(i * 1.7 + t * 2) * 110, 26, ia);
            txt(ctx, 'FREE SILVER!', 540, 420, { size: 100 * ia, font: 'Bungee', color: '#FFF', stroke: 18, glow: '#C9D2E6' });
          }
          wigQ(t, { x: 170, y: 1440, expr: ia > 0 ? 'smug' : 'curious', pose: ia > 0 ? 'thumb' : 'idle' });
          sepiaVignette(ctx);
        } },
      { a: T.spend, b: T.trust, name: 'spend',
        draw: t => {
          parch();
          const tilt = -0.14 * ease.back(seg(t, T.spend + 0.3, T.spend + 1.0));
          const [pl, pr] = balance(ctx, 540, 560, tilt, t);
          oldCoin(ctx, pl[0], pl[1] - 50, 95, 0, 5);
          oldCoin(ctx, pr[0], pr[1] - 50, 95, 1, 7);
          chip(ctx, 'LESS SILVER', pr[0] + 10, pr[1] + 120, pop(t, WF('spend', 'clipped') - 0.1, 0.35), '#FF3B5C', 40);
          stamp('FULL VALUE?!', 540, 1250, t, WF('spend', 'full') - 0.1, T.trust + 0.3, '#D9A21F', 96, -0.08);
          sepiaVignette(ctx);
        } },
      { a: T.trust, b: T.treason, name: 'trust',
        draw: t => {
          parch();
          const k = ease.io(seg(t, T.trust, T.treason - 0.3));
          for (let i = 0; i < 9; i++) {
            const x = 250 + (i % 3) * 290, y = 520 + Math.floor(i / 3) * 280, d = hash(i) * 0.4;
            oldCoin(ctx, x, y, 110 * (1 - 0.25 * clamp(k * 1.4 - d)), clamp(k * 1.6 - d), i + 2);
          }
          const tr = clamp(1 - ease.in(seg(t, WF('trust', 'nobody') - 0.2, WF('trust', 'money') + 0.4)));
          txt(ctx, 'TRUST IN MONEY', 540, 1260, { size: 52, font: 'Bungee', color: '#5A4220', shadow: false });
          ctx.fillStyle = '#E2D3AE'; ctx.strokeStyle = '#3A2A10'; ctx.lineWidth = 7; ctx.beginPath(); ctx.roundRect(190, 1310, 700, 60, 30); ctx.fill(); ctx.stroke();
          ctx.fillStyle = tr > 0.5 ? '#2BD47D' : tr > 0.2 ? '#FFB020' : '#FF3B5C'; ctx.beginPath(); ctx.roundRect(198, 1318, Math.max(0, 684 * tr), 44, 22); ctx.fill();
          txt(ctx, Math.round(tr * 100) + '%', 540, 1342, { size: 40, font: 'Bungee', color: INK, shadow: false });
          sepiaVignette(ctx);
        } },
      { a: T.treason, b: T.fix, name: 'treason',
        draw: t => {
          parch();
          decree(ctx, 540, 900, 1.0, ease.out(seg(t, T.treason, T.treason + 0.7)));
          stamp('HIGH TREASON', 540, 860, t, WF('treason', 'treason') - 0.1, T.fix + 0.3, '#B3202A', 104, -0.12);
          chip(ctx, 'PUNISHABLE BY DEATH', 540, 1180, pop(t, WF('treason', 'executed') - 0.1, 0.35), '#B3202A');
          wigQ(t, { x: 170, y: 1440, expr: 'worried', pose: 'idle', sweat: seg(t, WF('treason', 'executed'), WF('treason', 'executed') + 0.2), look: [0.5, -0.5] });
          sepiaVignette(ctx);
        } },
      { a: T.fix, b: T.newton, name: 'fix',
        draw: t => {
          parch();
          const rd = WF('fix', 'ridges'), sv = WF('fix', 'shave'), se = WF('fix', 'see');
          coin3D(ctx, 520, 820, 300, { yaw: 0.7, thick: 70, metal: 'old', spin: t * 2, glow: fadeIO(t, rd - 0.1, sv, 0.15) }, t);
          const band = [520 + 300 * Math.cos(0.7) + 30, 820];
          if (t > sv - 0.2) {
            const k = seg(t, sv - 0.2, se);
            fileTool(ctx, band[0] + 150 + Math.sin(t * 22) * 40 * (1 - seg(t, se - 0.1, se)), band[1] - 40, -0.25);
            ctx.save(); ctx.globalAlpha = k; ctx.fillStyle = '#FFF6C2'; ctx.shadowColor = '#FF3B5C'; ctx.shadowBlur = 30;
            ctx.beginPath(); ctx.ellipse(band[0] - 6, band[1] - 40, 20, 46, 0, 0, 7); ctx.fill(); ctx.restore();
          }
          stamp('BUSTED!', 540, 1240, t, se - 0.1, T.newton + 0.3, '#1E9E5A', 110, -0.08);
          wigQ(t, { x: 170, y: 1440, expr: t > se ? 'happy' : 'curious', pose: t > se ? 'thumb' : 'idle' });
          sepiaVignette(ctx);
        } },
      { a: T.newton, b: T.today, name: 'newton',
        draw: t => {
          parch();
          const yr = WF('newton', '1696'), rm = WF('newton', 'royal'), ia = WF('newton', 'isaac'), gr = WF('newton', 'gravity'), gy = WF('newton', 'guy');
          const ys = seg(t, yr - 0.05, yr + 0.2);
          ctx.save(); ctx.translate(540, 330); ctx.rotate(-0.05); ctx.scale(lerp(2.2, 1, ease.out(ys)), lerp(2.2, 1, ease.out(ys))); ctx.globalAlpha = clamp(ys * 2);
          txt(ctx, '1696', 0, 0, { size: 170, font: 'Bungee', color: '#7A2E1C', shadow: false }); ctx.restore();
          chip(ctx, 'THE ROYAL MINT', 540, 490, pop(t, rm - 0.1, 0.35), '#D4A23C');
          const ca = ease.out(seg(t, ia - 0.15, ia + 0.3));
          if (ca > 0) {
            newtonCameo(ctx, lerp(-300, 470, ca), 830, 1.0);
            pill(ctx, lerp(-300, 470, ca), 1120, 460, 120, '#3A2A10', null);
            txt(ctx, 'ISAAC NEWTON', lerp(-300, 470, ca), 1100, { size: 44, font: 'Lilita', color: '#F3E3BD', shadow: false });
            txt(ctx, 'WARDEN OF THE MINT', lerp(-300, 470, ca), 1146, { size: 28, font: 'Lilita', color: '#D4A23C', shadow: false });
          }
          // the apple
          const qx = 860, qy = 1440;
          const fall = seg(t, gr - 0.35, gy);
          const hit = t >= gy;
          const ay = hit ? qy - 0.55 * 560 - 120 * Math.sin(seg(t, gy, gy + 0.5) * Math.PI) : lerp(-120, qy - 0.55 * 560, fall * fall);
          const ax = hit ? qx + 160 * seg(t, gy, gy + 0.6) : qx;
          wigQ(t, { x: qx, y: qy, expr: hit ? 'shock' : 'curious', pose: hit ? 'shrug' : 'idle', look: [-0.6, -0.5], squash: hit ? 1 - 0.12 * Math.exp(-(t - gy) * 8) : 1, boing: boing(t, gy, 0.5) });
          if (fall > 0) apple(ctx, ax, ay, 1.1, t * (hit ? 8 : 2));
          if (hit) for (let i = 0; i < 4; i++) { const a = t * 5 + i * 1.57; sparkle(ctx, qx + Math.cos(a) * 110, qy - 0.55 * 470 + Math.sin(a) * 30, 20, 1 - seg(t, gy + 1.2, gy + 1.6), '#FFD43B'); }
          sepiaVignette(ctx);
        } },
      { a: T.today, b: T.outro, name: 'today',
        draw: t => {
          studioBG(ctx, t);
          const bl = WF('today', 'blind'), tc = WF('today', 'touch'), ch = WF('today', 'cheap');
          const kinds = [['smooth', 'copper'], ['reeded', 'silver'], ['scallop', 'gold'], ['interrupted', 'silver']];
          const hand = seg(t, bl - 0.4, T.outro - 0.2);
          kinds.forEach(([k, m], i) => {
            const x = 180 + i * 240, y = 760 + Math.sin(t * 2 + i) * 10, near = Math.abs(hand * 3.4 - i) < 0.5 && t > bl - 0.4;
            const a = pop(t, T.today + i * 0.12, 0.4);
            if (a > 0) { ctx.save(); ctx.translate(x, y); ctx.scale(a, a); edgeCoin(ctx, 0, 0, 105, k, m, near ? 1 : 0); ctx.restore(); }
          });
          chip(ctx, 'CHEAP METAL', 540, 470, pop(t, ch - 0.1, 0.35) * (1 - seg(t, bl - 0.5, bl - 0.2)), '#B0582F');
          if (t > bl - 0.4) {
            const hx = 180 + hand * 3.4 * 240, hy = 900 + Math.abs(Math.sin(t * 6)) * 10;
            ctx.save(); ctx.translate(hx, hy); ctx.scale(2.2, 2.2); QUIX.drawHand(ctx, 0, 0, -Math.PI / 2, 'point'); ctx.restore();
          }
          bigLabel(ctx, 'HELPS BLIND PEOPLE', 540, 470, null, null, pop(t, bl - 0.1, 0.4), 50, '#2BD47D');
          chip(ctx, 'TELL COINS APART BY TOUCH', 540, 610, pop(t, tc - 0.15, 0.35), '#FFD43B');
          q(t, { x: 540, y: GROUND4, s: 0.72, expr: t > bl ? 'happy' : 'cool', pose: t > tc ? 'thumb' : 'idle', look: [0, -0.4] });
        } },
      'OUTRO',
    ];

    const sfx = [
      ['coin', 0.1], ['pop', WF('hook', 'ridges') - 0.1], ['whoosh', T.reveal], ['ding', WF('reveal', 'reeding') - 0.1], ['alarm', WF('reveal', 'crime') - 0.1, 0.5],
      ['crumble', T.del + 0.2], ['stamp', T.del + 0.35],
      ['sparkle', T.react], ['pop', WF('react', 'smooth') - 0.1], ['pop', WF('react', 'shiny') - 0.1], ['boing', WF('react', 'wrong') - 0.1],
      ['rewind', T.past], ['stamp', T.y1600],
      ['pop', WF('silver', 'silver') - 0.15], ['scrape', WF('silver', 'shaved') - 0.1], ['coin', WF('silver', 'slivers'), 0.6], ['coin', WF('silver', 'edges'), 0.5],
      ['coin', T.melt + 0.2, 0.5], ['sizzle', WF('melt', 'melt')], ['sparkle', WF('melt', 'free') - 0.1],
      ['hit', T.spend + 0.3], ['stamp', WF('spend', 'full') - 0.1],
      ['wifi_down', WF('trust', 'nobody') - 0.1, 0.7],
      ['paper', T.treason], ['stamp', WF('treason', 'treason') - 0.1], ['hit_big', WF('treason', 'executed') - 0.1, 0.7],
      ['ding', WF('fix', 'ridges') - 0.1], ['scrape', WF('fix', 'shave') - 0.2], ['stamp', WF('fix', 'see') - 0.1],
      ['stamp', WF('newton', '1696') - 0.05], ['pop', WF('newton', 'royal') - 0.1], ['whoosh', WF('newton', 'isaac') - 0.15], ['bonk', WF('newton', 'guy')],
      ['coin', T.today, 0.6], ['coin', T.today + 0.25, 0.5], ['ding', WF('today', 'blind') - 0.1], ['pop', WF('today', 'touch') - 0.15],
    ];
    return { shots, sfx, music: { drops: [], radio: [] } };
  },
};
