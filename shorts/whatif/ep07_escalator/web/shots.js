// EP07 — What if escalators had no side brushes? (Quix deletes the brushes)
window.EPISODE = {
  badge: '#7',
  title: ['WHAT IF ESCALATORS', 'HAD NO BRUSHES?'],
  noSubsCues: [],
  followText: 'FOLLOW FOR EP. 08',
  build() {
    const L = C;
    Object.assign(T, {
      hook: L('hook').s - 0.12, reveal: L('reveal').s - 0.15, catch: L('catch').s - 0.12, purpose: L('purpose').s - 0.12,
      stop: L('stop').s - 0.12, roast: L('roast').s - 0.12,
    });
    const q = (t, o) => quix(t, Object.assign({ x: 200, y: 1440, s: 0.82, look: [0.8, -0.2] }, o));
    // shoe slides down the escalator into the gap, p 0..1
    const shoeAt = p => { const [x, y] = toWorld(-40 + 50 * p, -30 + 90 * p); return [x, y]; };
    const shoeIn = (t, t0, dur) => ease.in(seg(t, t0, t0 + dur));

    const shots = [
      { a: 0, b: T.hook, name: 'preview',
        cam: t => ({ z: 1.12, x: 560, y: 960, shake: 8 * (1 - seg(t, 0.6, 1.0)) }),
        draw: t => {
          const p = shoeIn(t, 0.7, 1.4);
          escalator(ctx, t, { brushes: 1, speed: 90 });
          const [sx, sy] = shoeAt(p);
          sneaker(ctx, sx, sy, 0.9, 0.5 * p, 1 - seg(t, 1.9, 2.3));
          q(t, { expr: t < 0.7 ? 'cool' : 'shock', pose: t < 0.7 ? 'idle' : 'shrug', sweat: seg(t, 0.8, 1.2), look: [0.9, 0.2], boing: boing(t, 0.8, 0.4) });
          screenSpace(ctx, () => {
            chip(ctx, 'PREVIEW', 540, 760, pop(t, 0.2, 0.3), '#FFD43B', 48);
          });
        },
        post: t => glitch(seg(t, T.hook - 0.35, T.hook), Math.floor(t * 30)) },
      { a: T.hook, b: T.reveal, name: 'hook',
        draw: t => {
          const k = ease.io(seg(t, 0.4, 1.0)), bx = toWorld(-160, -30);
          escalator(ctx, t, { brushes: 1, speed: 60 });
          q(t, { expr: 'curious', pose: QUIX.mixPose('idle', 'point', k), look: [0.8, 0.2] });
          bigLabel(ctx, 'SIDE BRUSHES', 620, 380, bx[0], bx[1], pop(t, WF('hook', 'brushes') - 0.1, 0.4), 56);
        } },
      { a: T.reveal, b: T.intro, name: 'reveal',
        cam: t => { const k = ease.io(seg(t, T.reveal, T.reveal + 0.6)); return { z: lerp(1.0, 1.2, k), x: lerp(540, GAP_W[0], k), y: lerp(960, GAP_W[1], k) }; },
        draw: t => {
          escalator(ctx, t, { brushes: 1, speed: 50 });
          q(t, { expr: 'curious', pose: 'think', look: [0.6, 0.2] });
          screenSpace(ctx, () => {
            chip(ctx, 'THOUSANDS PER DAY', 540, 300, pop(t, WF('crowd', 'thousands') - 0.1, 0.35), '#5CE1FF', 50);
          });
        } },
      'INTRO',
      { a: T.del, b: T.catch, name: 'delete',
        cam: t => ({ z: 1.08, x: 560, y: 1000, shake: 12 * (1 - seg(t, T.del, T.del + 0.6)) }),
        draw: t => {
          const p = ease.in(seg(t, T.del + 0.15, T.del + 0.9));
          escalator(ctx, t, { brushes: t < T.del + 0.15 ? 1 : 1 - p, speed: 60 });
          const r = q(t, { expr: 'smug', pose: 'cheer', glow: 1 - seg(t, T.del + 0.5, T.del + 1), look: [0.8, 0] });
          const [bx, by] = toWorld(0, -30);
          beam(r.tip[0], r.tip[1], bx, by, t, 1 - seg(t, T.del + 0.5, T.del + 0.7));
          stamp('DELETED', 540, 520, t, T.del + 0.35, T.catch + 0.2);
        },
        post: t => glitch(1 - seg(t, T.del + 0.05, T.del + 0.6), Math.floor(t * 30)) },
      { a: T.catch, b: T.purpose, name: 'catch',
        cam: t => { const k = ease.io(seg(t, T.catch, T.catch + 0.8)); return { z: lerp(1.0, 1.35, k), x: lerp(540, GAP_W[0], k), y: lerp(960, GAP_W[1], k), shake: 6 * seg(t, WF('catch', 'crunch') - 0.1, WF('catch', 'crunch') + 0.2) }; },
        draw: t => {
          const p = shoeIn(t, WF('catch', 'slides') - 0.1, 1.3);
          escalator(ctx, t, { brushes: 0, speed: 60 * (1 - 0.3 * p) });
          const [sx, sy] = shoeAt(p);
          sneaker(ctx, sx, sy, 0.9, 0.5 * p, 1 - seg(t, WF('catch', 'crunch') + 0.5, WF('catch', 'crunch') + 1.0));
          q(t, { expr: 'shock', pose: 'shrug', sweat: 1, look: [0.9, 0.1], boing: boing(t, WF('catch', 'crunch') - 0.1, 0.4) });
          screenSpace(ctx, () => {
            chip(ctx, 'CRUNCH!', 540, 300, pop(t, WF('catch', 'crunch') - 0.1, 0.3), '#FF3B5C', 60);
            chip(ctx, 'STEPS KEEP MOVING', 540, 1580, pop(t, WF('sucked', 'shoe') - 0.1, 0.35), '#FFD43B', 46);
          });
        },
        post: t => glitch(seg(t, WF('catch', 'crunch') - 0.1, WF('catch', 'crunch') + 0.2) * (1 - seg(t, WF('catch', 'crunch') + 0.2, WF('catch', 'crunch') + 0.7)), Math.floor(t * 30)) },
      { a: T.purpose, b: T.stop, name: 'purpose',
        draw: t => {
          const k = ease.io(seg(t, T.purpose, T.purpose + 0.6));
          escalator(ctx, t, { brushes: k, speed: 50 });
          q(t, { expr: 'happy', pose: 'think', look: [0.8, 0.2] });
          const [gx, gy] = GAP_W;
          bigLabel(ctx, 'KEEPS FEET OUT', 600, 430, gx, gy, pop(t, WF('purpose', 'keep') - 0.1, 0.4), 52);
          screenSpace(ctx, () => {
            chip(ctx, 'FEET · LACES · CLOTHES', 540, 300, pop(t, WF('purpose', 'shoelaces') - 0.1, 0.35), '#FFFFFF', 46);
          });
        } },
      { a: T.stop, b: T.roast, name: 'stop',
        draw: t => {
          const slow = 1 - ease.io(seg(t, WF('stop', 'stop') - 0.2, WF('stop', 'stop') + 0.9));
          escalator(ctx, t, { brushes: 1, speed: 50 * slow });
          const [bx, by] = toWorld(180, -20);
          stopButton(ctx, 800, 1140, pop(t, WF('stop', 'emergency') - 0.1, 0.4), t > WF('grab', 'red'));
          q(t, { expr: 'cool', pose: 'point', look: [0.5, 0.4], x: 260 });
          screenSpace(ctx, () => {
            chip(ctx, 'EMERGENCY STOP', 540, 300, pop(t, WF('stop', 'emergency') - 0.1, 0.35), '#FF3B5C', 52);
          });
        } },
      { a: T.roast, b: T.outro, name: 'roast',
        draw: t => {
          escalator(ctx, t, { brushes: 1, speed: 40 });
          q(t, { expr: 'smug', pose: 'point', look: [0.8, 0], boing: boing(t, WF('roast', 'shine') - 0.1, 0.3) });
          screenSpace(ctx, () => {
            chip(ctx, 'NOT A SHOE SHINE', 540, 300, pop(t, WF('roast', 'shine') - 0.1, 0.35), '#FF6B2C', 50);
            chip(ctx, 'NOT FOR DUSTING SOCKS', 540, 400, pop(t, WF('dust', 'socks') - 0.1, 0.35), '#FF6B2C', 46);
          });
        } },
      'OUTRO',
    ];

    const sfx = [
      ['whoosh_scan', 0.1], ['pop', WF('preview', 'escalator') - 0.1], ['sizzle', WF('preview', 'oh') - 0.1],
      ['pop', WF('hook', 'brushes') - 0.1], ['ding', WF('reveal', 'brushes') - 0.1],
      ['crumble', T.del + 0.2], ['stamp', T.del + 0.35],
      ['crumble', WF('catch', 'crunch') - 0.05], ['hit', WF('catch', 'crunch')], ['siren', WF('catch', 'crunch') + 0.2, 0.6],
      ['boing', WF('purpose', 'keep') - 0.1], ['pop', WF('purpose', 'shoelaces') - 0.1],
      ['zap', WF('stop', 'emergency') - 0.1], ['stamp', WF('stop', 'emergency')],
      ['pop', WF('roast', 'shine') - 0.1], ['pop', WF('dust', 'socks') - 0.1],
    ];
    return { shots, sfx, music: { drops: [], radio: [] } };
  },
};
