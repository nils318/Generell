// EP08 — What if jeans had no rivets? (Quix deletes the pocket rivets)
window.EPISODE = {
  badge: '#8',
  title: ['WHAT IF JEANS', 'HAD NO RIVETS?'],
  noSubsCues: [],
  followText: 'FOLLOW FOR EP. 09',
  build() {
    const L = C;
    Object.assign(T, {
      hook: L('hook').s - 0.12, reveal: L('reveal').s - 0.15, rip: L('rip').s - 0.12, roast1: L('roast1').s - 0.12,
      why: L('why').s - 0.12, rivet: L('rivet').s - 0.12, history: L('history').s - 0.12, davis: L('davis').s - 0.12,
      broke: L('broke').s - 0.12, patent: L('patent').s - 0.12, roast2: L('roast2').s - 0.12, last: L('last').s - 0.12,
    });
    const q = (t, o) => quix(t, Object.assign({ x: 190, y: STAND, s: 0.8, look: [0.8, -0.4] }, o));
    const parch = () => { ctx.drawImage(getParch(), 0, 0); };
    const PH = [560, 930];                                           // where the phone goes into the pocket
    const phoneIn = k => [PH[0] + 40 * k, lerp(520, PH[1], k)];
    const shakeAt = (t, t0) => 14 * seg(t, t0 - 0.05, t0 + 0.05) * (1 - seg(t, t0 + 0.05, t0 + 0.6));

    const shots = [
      { a: 0, b: T.hook, name: 'preview',
        cam: t => ({ z: 1.1, x: 620, y: 980, shake: shakeAt(t, WF('preview', 'ripped')) }),
        draw: t => {
          const rp = WF('preview', 'ripped'), k = ease.out(seg(t, rp - 0.15, rp + 0.3));
          denim(ctx); rivet(ctx, P1[0], P1[1], 0);
          tear(ctx, k, t);
          const fall = ease.in(seg(t, rp + 0.1, rp + 1.2));
          phone(ctx, P2[0] - 120, lerp(PH[1], 1900, fall), -0.5 + 1.4 * fall, 1);
          q(t, { expr: t < rp - 0.2 ? 'cool' : 'shock', pose: t < rp - 0.2 ? 'idle' : 'shrug', sweat: seg(t, rp, rp + 0.3), boing: boing(t, rp - 0.1, 0.4) });
          screenSpace(ctx, () => chip(ctx, 'PREVIEW', 540, 760, pop(t, 0.2, 0.3), '#FFD43B', 48));
        },
        post: t => glitch(seg(t, T.hook - 0.35, T.hook), Math.floor(t * 30)) },
      { a: T.hook, b: T.reveal, name: 'hook',
        draw: t => {
          const k = ease.io(seg(t, T.hook + 0.4, T.hook + 1.0)), d = WF('hook', 'dots');
          denim(ctx); rivets(ctx, 1, fadeIO(t, d - 0.1, T.reveal + 1, 0.15) * (0.6 + 0.4 * Math.sin(t * 10)));
          q(t, { expr: 'curious', pose: QUIX.mixPose('idle', 'point', k), look: [0.8, -0.5] });
        } },
      { a: T.reveal, b: T.intro, name: 'reveal',
        cam: t => { const k = ease.io(seg(t, T.reveal, T.reveal + 0.6)); return { z: lerp(1.0, 1.3, k), x: lerp(540, P2[0] - 160, k), y: lerp(960, P2[1] - 80, k) }; },
        draw: t => {
          denim(ctx); rivets(ctx, 1, 0.5);
          q(t, { expr: t < WF('reveal', 'goblin') - 0.1 ? 'cool' : 'smug', pose: 'point', look: [0.8, -0.4] });
          bigLabel(ctx, 'RIVET', P2[0] - 180, P2[1] - 300, P2[0], P2[1] - 20, pop(t, WF('reveal', 'rivets') - 0.1, 0.4), 60);
          screenSpace(ctx, () => {
            chip(ctx, 'NOT DECORATION', 540, 1000, pop(t, WF('reveal', 'decoration') - 0.1, 0.35), '#FF3B5C', 50);
            chip(ctx, 'FASHION GOBLIN', 540, 1110, pop(t, WF('reveal', 'goblin') - 0.1, 0.35), '#2BD47D', 44);
            chip(ctx, 'ALMOST EVERY PAIR', 540, 1220, pop(t, WF('crowd', 'almost') - 0.1, 0.35), '#FFD43B', 46);
          });
        } },
      'INTRO',
      { a: T.del, b: T.rip, name: 'delete',
        cam: t => ({ z: 1.05, x: 560, y: 980, shake: 12 * (1 - seg(t, T.del, T.del + 0.6)) }),
        draw: t => {
          const p = ease.in(seg(t, T.del + 0.15, T.del + 0.9));
          denim(ctx); rivets(ctx, t < T.del + 0.15 ? 1 : 1 - p);
          if (p > 0 && p < 1) for (let i = 0; i < 6; i++) { sparkle(ctx, P1[0] + (hash(i) - 0.5) * 120, P1[1] + (hash(i + 2) - 0.5) * 120, 30 * Math.sin(p * Math.PI), 1); sparkle(ctx, P2[0] + (hash(i + 5) - 0.5) * 120, P2[1] + (hash(i + 7) - 0.5) * 120, 30 * Math.sin(p * Math.PI), 1); }
          const r = q(t, { expr: 'smug', pose: 'cheer', glow: 1 - seg(t, T.del + 0.5, T.del + 1), look: [0.8, -0.4] });
          beam(r.tip[0], r.tip[1], P2[0], P2[1], t, 1 - seg(t, T.del + 0.5, T.del + 0.7));
          stamp('DELETED', 540, 380, t, T.del + 0.35, T.rip + 0.2);
        },
        post: t => glitch(1 - seg(t, T.del + 0.05, T.del + 0.6), Math.floor(t * 30)) },
      { a: T.rip, b: T.roast1, name: 'rip',
        cam: t => ({ z: 1.05, x: 600, y: 980, shake: shakeAt(t, WF('rip', 'rrrip')) }),
        draw: t => {
          const ph = ease.out(seg(t, WF('rip', 'phone') - 0.2, WF('rip', 'pocket', 0) + 0.3)), rr = WF('rip', 'rrrip');
          denim(ctx);
          tear(ctx, ease.out(seg(t, rr - 0.1, rr + 0.5)), t);
          const [x, y] = phoneIn(ph); phone(ctx, x, y, -0.35, 1);
          q(t, { expr: t < rr ? 'happy' : 'shock', pose: t < rr ? 'tap' : 'shrug', sweat: t > rr ? 1 : 0, boing: boing(t, rr - 0.1, 0.4) });
          screenSpace(ctx, () => chip(ctx, 'RRRIP!', 760, 360, pop(t, rr - 0.1, 0.3), '#FF3B5C', 64));
        } },
      { a: T.roast1, b: T.why, name: 'roast1',
        cam: t => ({ z: lerp(1.0, 1.08, seg(t, T.roast1, T.why)), x: 560, y: 980 }),
        draw: t => {
          denim(ctx); tear(ctx, 1, t);
          phone(ctx, PH[0] + 40, PH[1], -0.35 + 0.05 * Math.sin(t * 3), 1);
          q(t, { expr: 'smug', pose: 'hips', look: [0.6, -0.3], boing: boing(t, WF('roast1', 'skirt') - 0.1, 0.3) });
          screenSpace(ctx, () => chip(ctx, 'SKIRT WITH COMMITMENT ISSUES', 540, 320, pop(t, WF('roast1', 'skirt') - 0.1, 0.35), '#FF6B2C', 40));
        } },
      { a: T.why, b: T.rivet, name: 'why',
        cam: t => { const k = ease.io(seg(t, T.why, T.why + 0.7)); return { z: lerp(1.0, 1.4, k), x: lerp(540, P2[0] - 120, k), y: lerp(960, P2[1] - 60, k) }; },
        draw: t => {
          denim(ctx);
          const yk = seg(t, WF('why', 'yanked') - 0.2, WF('why', 'yanked') + 0.4), pull = 30 * Math.sin(t * 16) * yk;
          const sa = pop(t, WF('why', 'stress') - 0.1, 0.4);
          if (sa > 0) {
            ctx.save(); ctx.strokeStyle = '#FF3B5C'; ctx.fillStyle = '#FF3B5C'; ctx.lineWidth = 16; ctx.lineCap = 'round';
            for (const [dx, dy] of [[-1, -0.6], [0.3, 1]]) {
              const x0 = P2[0] + dx * 40, y0 = P2[1] + dy * 40, x1 = P2[0] + dx * (40 + 150 * sa) + dx * pull, y1 = P2[1] + dy * (40 + 150 * sa) + dy * pull;
              ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
              const an = Math.atan2(y1 - y0, x1 - x0); ctx.beginPath(); ctx.moveTo(x1 + Math.cos(an) * 30, y1 + Math.sin(an) * 30);
              ctx.lineTo(x1 + Math.cos(an + 2.4) * 34, y1 + Math.sin(an + 2.4) * 34); ctx.lineTo(x1 + Math.cos(an - 2.4) * 34, y1 + Math.sin(an - 2.4) * 34); ctx.closePath(); ctx.fill();
            }
            ctx.restore();
          }
          bigLabel(ctx, 'MOST STRESS', P2[0] - 230, P2[1] - 260, P2[0], P2[1], sa, 54, '#FF6B6B');
        } },
      { a: T.rivet, b: T.history, name: 'rivet',
        draw: t => {
          denim(ctx); ctx.fillStyle = 'rgba(10,20,50,0.6)'; ctx.fillRect(0, 0, W, H);
          const k = seg(t, WF('rivet', 'rivet') - 0.1, WF('rivet', 'rivet') + 0.6);
          rivetSection(ctx, 540, 780, k, 1);
          txt(ctx, 'CROSS-SECTION', 540, 470, { size: 56, font: 'Bungee', color: '#FFD43B', stroke: 12, alpha: pop(t, T.rivet, 0.4) });
          screenSpace(ctx, () => chip(ctx, 'METAL PIN = NO TEAR', 540, 1060, pop(t, WF('rivet', 'tear') - 0.1, 0.35), '#2BD47D', 50));
          q(t, { x: 860, s: 0.7, expr: 'cool', pose: 'thumb', look: [-0.6, -0.4] });
        } },
      { a: T.history, b: T.davis, name: 'history', noBadge: true,
        draw: t => {
          denim(ctx); rivets(ctx, 1);
          rewindFX(ctx, t, seg(t, T.history, WF('history', '1873') + 0.2), 2026, 1873);
        } },
      { a: T.davis, b: T.broke, name: 'davis',
        draw: t => {
          parch();
          const hm = WF('davis', 'hammered'), hits = [hm, hm + 0.35, hm + 0.7];
          let swing = -0.9;
          for (const h of hits) if (t > h - 0.25) swing = t < h ? lerp(-0.9, 0.1, ease.in(seg(t, h - 0.25, h))) : lerp(0.1, -0.9, ease.out(seg(t, h, h + 0.3)));
          ctx.save(); ctx.translate(540, 980); ctx.scale(0.75, 0.75);
          ctx.fillStyle = '#3D6DB3'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-300, -200, 600, 400, 30); ctx.fill(); ctx.stroke();
          ctx.restore();
          rivet(ctx, 540 + 180, 980 + 100, ease.back(seg(t, hm, hm + 0.3)));
          hammer(ctx, 540 + 260, 980 - 120, swing);
          q(t, { x: 230, s: 0.75, hat: 'fedora', expr: 'happy', pose: 'cheer', look: [0.8, 0] });
          screenSpace(ctx, () => chip(ctx, 'JACOB DAVIS · TAILOR', 540, 420, pop(t, WF('davis', 'jacob') - 0.1, 0.35), '#C8742E', 48));
          sepiaVignette(ctx);
        } },
      { a: T.broke, b: T.patent, name: 'broke',
        draw: t => {
          parch();
          const lv = WF('broke', 'levi');
          q(t, { x: 300, s: 0.8, hat: 'fedora', expr: t < lv - 0.3 ? 'worried' : 'happy', pose: t < lv - 0.3 ? 'shrug' : 'wave', sweat: t < lv - 0.3 ? 1 : 0, look: [0.7, 0] });
          screenSpace(ctx, () => {
            chip(ctx, 'TOO BROKE FOR THE PATENT', 540, 420, pop(t, WF('broke', 'broke') - 0.1, 0.35), '#FF3B5C', 44);
            chip(ctx, 'LEVI STRAUSS · FABRIC SELLER', 640, 1180, pop(t, lv - 0.1, 0.35), '#2BD47D', 40);
          });
          const la = ease.out(seg(t, lv - 0.3, lv + 0.3));
          if (la > 0) { ctx.save(); ctx.globalAlpha = la; ctx.fillStyle = '#3D6DB3'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(640, 1300 - 120 * la, 300, 200, 16); ctx.fill(); ctx.stroke(); txt(ctx, 'DENIM', 790, 1400 - 120 * la, { size: 50, font: 'Bungee', color: '#fff', stroke: 8 }); ctx.restore(); }
          sepiaVignette(ctx);
        } },
      { a: T.patent, b: T.roast2, name: 'patent',
        draw: t => {
          parch();
          const k = ease.out(seg(t, T.patent, T.patent + 0.6));
          patentDoc(ctx, 540, 960, lerp(0.2, 1, k), lerp(-0.6, -0.04, k));
          stamp('PATENTED', 560, 1250, t, WF('patent', 'patent') - 0.05, T.roast2 + 0.3, '#2BD47D', 110, -0.12);
          const bn = WF('patent', 'born');
          if (t > bn - 0.2) for (let i = 0; i < 10; i++) { const ph = (t * 0.7 + hash(i)) % 1; sparkle(ctx, hash(i + 5) * W, 300 + hash(i + 7) * 1300 - ph * 80, 22 * Math.sin(ph * Math.PI) + 4, seg(t, bn - 0.2, bn + 0.3)); }
          sepiaVignette(ctx);
        } },
      { a: T.roast2, b: T.last, name: 'roast',
        draw: t => {
          denim(ctx); rivets(ctx, 1, 0.4 * pop(t, WF('roast3', 'bling') - 0.1, 0.4));
          const rl = WF('roast2', 'relatable');
          q(t, { expr: t < rl - 0.2 ? 'cool' : 'smug', pose: t < rl - 0.2 ? 'idle' : 'shrug', look: [0.6, -0.3], boing: boing(t, rl - 0.1, 0.3) });
          screenSpace(ctx, () => {
            chip(ctx, "COULDN'T AFFORD PAPERWORK", 540, 300, pop(t, WF('roast2', 'paperwork') - 0.1, 0.35), '#FFFFFF', 42);
            chip(ctx, 'RELATABLE', 540, 400, pop(t, rl - 0.1, 0.35), '#2BD47D', 48);
            chip(ctx, 'NOT BLING', 760, 1000, pop(t, WF('roast3', 'bling') - 0.1, 0.35), '#FF3B5C', 46);
            chip(ctx, '150+ YEARS OLD', 760, 1110, pop(t, WF('roast3', 'older') - 0.1, 0.35), '#FFD43B', 46);
          });
        } },
      { a: T.last, b: T.outro, name: 'last',
        draw: t => {
          denim(ctx); rivets(ctx, 1, 0.5 + 0.3 * Math.sin(t * 6));
          q(t, { expr: 'happy', pose: 'thumb', look: [0.6, -0.3] });
          screenSpace(ctx, () => chip(ctx, 'THANK A BROKE TAILOR', 540, 320, pop(t, WF('last', 'thank') - 0.1, 0.35), '#C8742E', 48));
        } },
      'OUTRO',
    ];

    const sfx = [
      ['crumble', WF('preview', 'ripped') - 0.1], ['hit', WF('preview', 'ripped')], ['boing', WF('preview', 'again') - 0.1],
      ['pop', WF('hook', 'dots') - 0.1], ['ding', WF('reveal', 'rivets') - 0.1], ['pop', WF('reveal', 'decoration') - 0.1], ['boing', WF('reveal', 'goblin') - 0.1],
      ['crumble', T.del + 0.2], ['stamp', T.del + 0.35],
      ['whoosh', WF('rip', 'phone') - 0.1], ['crumble', WF('rip', 'rrrip') - 0.1], ['hit', WF('rip', 'rrrip')],
      ['boing', WF('roast1', 'skirt') - 0.1],
      ['pop', WF('why', 'stress') - 0.1], ['sizzle', WF('why', 'yanked') - 0.2],
      ['clink', WF('rivet', 'rivet') + 0.3], ['ding', WF('rivet', 'tear') - 0.1],
      ['rewind', T.history], ['stamp', WF('history', '1873')],
      ['clink', WF('davis', 'hammered')], ['clink', WF('davis', 'hammered') + 0.35], ['clink', WF('davis', 'hammered') + 0.7],
      ['boing', WF('broke', 'broke') - 0.1], ['pop', WF('broke', 'levi') - 0.1],
      ['paper', T.patent], ['stamp', WF('patent', 'patent') - 0.05], ['sparkle', WF('patent', 'born') - 0.2],
      ['ding', WF('roast2', 'relatable') - 0.1], ['pop', WF('roast3', 'bling') - 0.1], ['pop', WF('roast3', 'older') - 0.1],
      ['sparkle', WF('last', 'thank') - 0.1],
    ];
    return { shots, sfx, music: { drops: [], radio: [[T.history, T.roast2]] } };
  },
};
