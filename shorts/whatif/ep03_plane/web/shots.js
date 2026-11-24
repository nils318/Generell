// EP03 — What if airplane windows had no breather hole?
window.EPISODE = {
  badge: '#3',
  title: ['WHAT IF PLANE WINDOWS', 'HAD NO TINY HOLE?'],
  noSubsCues: [],
  followText: 'FOLLOW FOR EP. 04',
  build() {
    const L = C;
    Object.assign(T, {
      reveal: L('reveal').s - 0.15, fog: L('fog').s - 0.12, cold: L('cold').s - 0.1, frost: L('frost').s - 0.1,
      layers: L('layers').s - 0.12, load: L('load').s - 0.1, backup: L('backup').s - 0.1, without: L('without').s - 0.12,
      notbackup: L('notbackup').s - 0.1, relax: L('relax').s - 0.12,
    });
    const sitQuix = (t, o) => quix(t, Object.assign({ x: 235, y: SEAT_Y, s: 0.85, look: [0.8, -0.1] }, o));

    const shots = [
      { a: 0, b: T.reveal, name: 'hook',
        cam: t => { const k = ease.io(seg(t, 0.5, T.reveal)); return { z: lerp(1.0, 1.35, k), x: lerp(540, 600, k), y: lerp(960, 1000, k) }; },
        draw: t => {
          const k = ease.io(seg(t, 0.6, 1.1)), hw = WF('hook', 'hole');
          drawCabin(ctx, { belt: 0.6 + 0.4 * Math.sin(t * 6), holeGlow: fadeIO(t, hw - 0.1, T.reveal + 2, 0.15) }, t, () =>
            sitQuix(t, { expr: t < 0.8 ? 'cool' : 'curious', pose: QUIX.mixPose('idle', 'point', k), look: [0.9 * k, 0.4 * k], boing: boing(t, 0.8, 0.25) }));
        } },
      { a: T.reveal, b: T.intro, name: 'reveal',
        cam: t => { const k = ease.io(seg(t, T.reveal, T.reveal + 0.8)); return { z: lerp(1.35, 2.6, k), x: lerp(600, HOLE.x, k), y: lerp(1000, HOLE.y - 60, k) }; },
        draw: t => {
          const br = WF('reveal', 'breather');
          drawCabin(ctx, { holeGlow: 1 }, t, () => sitQuix(t, { expr: 'curious', pose: 'point', look: [0.9, 0.4] }));
          screenSpace(ctx, () => {
            bigLabel(ctx, 'BREATHER HOLE', 540, 690, null, null, pop(t, br - 0.1, 0.4));
            chip(ctx, 'NOT A CRACK ✓', 540, 830, pop(t, WF('reveal', 'crack') - 0.1, 0.35) * (1 - seg(t, br - 0.2, br)), '#2BD47D');
          });
        } },
      'INTRO',
      { a: T.del, b: T.fog, name: 'delete',
        cam: t => ({ z: 1.45, x: 470, y: 1020, shake: 12 * (1 - seg(t, T.del, T.del + 0.6)) }),
        draw: t => {
          const p = ease.in(seg(t, T.del + 0.15, T.del + 0.8));
          drawCabin(ctx, { hole: t < T.del + 0.15 ? 1 : 0 }, t, () => {
            const r = sitQuix(t, { expr: 'smug', pose: 'cheer', glow: 1 - seg(t, T.del + 0.5, T.del + 1.0), look: [0.8, 0.3] });
            beam(r.tip[0], r.tip[1], HOLE.x, HOLE.y, t, 1 - seg(t, T.del + 0.5, T.del + 0.7));
          });
          holeDissolve(ctx, p);
          screenSpace(ctx, () => stamp('DELETED', 540, 520, t, T.del + 0.35, T.fog + 0.2));
        },
        post: t => glitch(1 - seg(t, T.del + 0.05, T.del + 0.6), Math.floor(t * 30)) },
      { a: T.fog, b: T.layers, name: 'fogfrost',
        cam: t => { const z = t < T.frost ? lerp(1.15, 1.3, ease.io(seg(t, T.fog, T.frost))) : lerp(1.3, 1.1, ease.out(seg(t, T.frost, T.frost + 0.8))); return { z, x: 560, y: 980 }; },
        draw: t => {
          const fg = WF('fog', 'fog'), fr = WF('frost', 'freezes'), gb = WF('frost', 'goodbye');
          const fog = ease.io(seg(t, fg - 0.2, fg + 1.2)), frost = ease.io(seg(t, fr - 0.1, fr + 1.0));
          drawCabin(ctx, { hole: 0, fog: fog * (1 - frost * 0.3), frost }, t, () =>
            sitQuix(t, { expr: t > gb ? 'worried' : t > fg ? 'curious' : 'shock', pose: t > gb ? 'shrug' : t > fg + 0.5 ? 'think' : 'idle',
              look: [0.9, 0.2], sweat: t > fr ? 1 : 0, boing: boing(t, fg - 0.1, 0.3) + boing(t, fr - 0.1, 0.3) }));
          screenSpace(ctx, () => {
            const c = C('cold').words;
            chip(ctx, '35,000 FT', 330, 420, pop(t, c[2].s - 0.1, 0.4) * (1 - seg(t, T.frost + 1.2, T.frost + 1.5)), '#5CE1FF');
            chip(ctx, '-50°C OUTSIDE', 700, 540, pop(t, c[6].s - 0.1, 0.4) * (1 - seg(t, T.frost + 1.2, T.frost + 1.5)), '#2E8BFF');
            if (t > fr - 0.1) { const a = pop(t, fr - 0.1, 0.4); txt(ctx, 'FROZEN', 660, 840, { size: 120 * a, font: 'Bungee', color: '#BFF6FF', stroke: 18, glow: '#5CE1FF', alpha: 1 - seg(t, T.layers - 0.3, T.layers) }); }
          });
        } },
      { a: T.layers, b: T.relax, name: 'section',
        cam: t => ({ z: lerp(1.06, 1.0, ease.out(seg(t, T.layers, T.layers + 0.6))), x: 540, y: 960 }),
        draw: t => {
          const without = t >= T.without - 0.05;
          const kW = ease.io(seg(t, T.without, T.without + 0.8));
          const lo = ease.out(seg(t, WF('load', 'outer') - 0.1, WF('load', 'outer') + 0.5));
          drawSection(ctx, {
            hole: !without, paneLabels: seg(t, WF('layers', 'three') - 0.1, WF('layers', 'three') + 0.9),
            bowOuter: 22 * lo, loadOuter: lo, bowMiddle: 16 * kW, loadMiddle: kW, strain: without,
          }, t);
          const mid = WF('load', 'middle'), ch = WF('backup', 'chills');
          if (!without) {
            chip(ctx, 'SAME PRESSURE', PANES.middle - 10, 470, pop(t, mid - 0.15, 0.4) * (1 - seg(t, T.backup - 0.2, T.backup)), '#8FE9FF', 42);
            bigLabel(ctx, 'TAKES THE LOAD', 790, 1390, PANES.outer + 20, PANES.y1, pop(t, WF('load', 'load') - 0.15, 0.4), 42);
            if (t > T.backup - 0.1) {
              bigLabel(ctx, 'BACKUP 😎', 330, 470, PANES.middle, 640, pop(t, ch - 0.15, 0.4), 50, '#2BD47D');
            }
          } else {
            bigLabel(ctx, 'STRAIN!', 330, 470, PANES.middle + 10, 700, pop(t, WF('without', 'strain') - 0.15, 0.4), 56, '#FF3B5C');
            const nb = C('notbackup').words[1].s;
            if (t > nb - 0.2) { const a = pop(t, nb - 0.1, 0.4); txt(ctx, 'BACKUP?', 540, 1395, { size: 100 * a, font: 'Bungee', color: '#FF3B5C', stroke: 18, glow: '#FF3B5C' }); }
          }
          // hole indicator
          if (!without) { ctx.save(); ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 5; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.arc(PANES.middle, PANES.holeY, 34, 0, 7); ctx.stroke(); ctx.restore(); }
          else stamp('NO HOLE', PANES.middle, PANES.holeY, t, T.without, T.relax + 1, '#FF3B5C', 46, -0.1);
        } },
      { a: T.relax, b: T.outro, name: 'relax',
        cam: t => ({ z: lerp(1.15, 1.02, ease.out(seg(t, T.relax, T.outro))), x: 560, y: 980 }),
        draw: t => {
          const rx = WF('relax', 'relax'), job = WF('relax', 'job');
          const back = ease.out(seg(t, T.relax + 0.1, T.relax + 0.6));
          drawCabin(ctx, { hole: back, holeGlow: fadeIO(t, T.relax + 0.2, rx + 0.8, 0.2), gold: ease.io(seg(t, rx - 0.3, rx + 1.2)) }, t, () =>
            sitQuix(t, { expr: t > rx ? 'happy' : 'cool', pose: t > job - 0.3 ? 'thumb' : 'hips', look: [0.3, 0], glow: 0.4, boing: boing(t, rx, 0.25) }));
          if (back > 0 && back < 1) sparkle(ctx, HOLE.x, HOLE.y, 60 * Math.sin(back * Math.PI), 1);
          screenSpace(ctx, () => { const ca = pop(t, job - 0.15, 0.4); if (ca > 0) checkBadge(ctx, 860, 520, ca * 1.2); });
        } },
      'OUTRO',
    ];

    const sfx = [
      ['chime', 0.05, 0.8], ['cabin', 0.2], ['pop', WF('hook', 'hole') - 0.1], ['whoosh', T.reveal], ['ding', WF('reveal', 'breather') - 0.1],
      ['crumble', T.del + 0.2], ['stamp', T.del + 0.35], ['cabin', T.fog, 0.8],
      ['whoosh', WF('fog', 'fog') - 0.2], ['pop', C('cold').words[2].s - 0.1], ['pop', C('cold').words[6].s - 0.1], ['freeze', WF('frost', 'freezes') - 0.15],
      ['boing', WF('frost', 'goodbye') - 0.1],
      ['whoosh_scan', T.layers], ['hit', WF('layers', 'three') - 0.05], ['ding', WF('load', 'load') - 0.1], ['pop', WF('backup', 'chills') - 0.1],
      ['hit', T.without + 0.05], ['stamp', T.without + 0.1], ['hit_big', C('notbackup').words[1].s - 0.05],
      ['sparkle', T.relax + 0.1], ['ding', WF('relax', 'job') - 0.1],
    ];
    return { shots, sfx, music: { drops: [], radio: [] } };
  },
};
