// EP06 — What if tires had no tread? (Quix deletes the tread pattern)
window.EPISODE = {
  badge: '#6',
  title: ['WHAT IF TIRES', 'HAD NO TREAD?'],
  noSubsCues: [],
  followText: 'FOLLOW FOR EP. 07',
  build() {
    const L = C;
    Object.assign(T, {
      reveal: L('reveal').s - 0.15, roast: L('roast').s - 0.12, rain: L('rain').s - 0.12, wedge: L('wedge').s - 0.12,
      float: L('float').s - 0.12, numbers: L('numbers').s - 0.12, min: L('min').s - 0.12, twist: L('twist').s - 0.12,
    });
    const q = (t, o) => quix(t, Object.assign({ x: 190, y: ROAD, s: 0.8, look: [0.8, 0] }, o));
    const bigStat = (s, x, y, a, col = '#FFD43B', size = 110) => {
      if (a <= 0) return;
      ctx.save(); ctx.translate(x, y); ctx.scale(a, a);
      ctx.font = `${size}px Bungee`; const w = ctx.measureText(s).width + 80;
      pill(ctx, 0, 0, w, 150, col, INK, 8);
      txt(ctx, s, 0, 12, { size, font: 'Bungee', color: INK, shadow: false });
      ctx.restore();
    };

    const shots = [
      { a: 0, b: T.reveal, name: 'hook',
        cam: t => { const k = ease.io(seg(t, 0, T.reveal)); return { z: lerp(1.0, 1.1, k), x: lerp(560, 600, k), y: lerp(960, 1000, k) }; },
        draw: t => {
          const k = ease.io(seg(t, 0.6, 1.2)), gr = WF('hook', 'grooves');
          road(ctx, 0.2);
          tire(ctx, TIRE.x, TIRE.y, TIRE.r, 1, 0);
          treadRing(ctx, TIRE.x, TIRE.y, TIRE.r, fadeIO(t, gr - 0.1, T.reveal + 1, 0.15), t);
          q(t, { s: 0.8, expr: t < 0.8 ? 'cool' : 'curious', pose: QUIX.mixPose('idle', 'point', k), look: [0.9 * k, 0.2], boing: boing(t, 0.9, 0.25) });
        } },
      { a: T.reveal, b: T.intro, name: 'reveal',
        cam: t => { const k = ease.io(seg(t, T.reveal, T.reveal + 0.6)); return { z: lerp(1.1, 1.25, k), x: lerp(600, 640, k), y: lerp(1000, 1010, k) }; },
        draw: t => {
          road(ctx, 0.2);
          tire(ctx, TIRE.x, TIRE.y, TIRE.r, 1, 0);
          q(t, { expr: 'curious', pose: 'point', look: [0.8, 0.2] });
          bigLabel(ctx, 'TREAD', 760, 420, 640, 720, pop(t, WF('reveal', 'tread') - 0.1, 0.4), 64);
        } },
      'INTRO',
      { a: T.del, b: T.roast, name: 'delete',
        cam: t => ({ z: 1.08, x: 600, y: 1000, shake: 12 * (1 - seg(t, T.del, T.del + 0.6)) }),
        draw: t => {
          const p = ease.in(seg(t, T.del + 0.15, T.del + 0.9));
          road(ctx, 0.2);
          tire(ctx, TIRE.x, TIRE.y, TIRE.r, t < T.del + 0.15 ? 1 : 1 - p, 0);
          const r = q(t, { expr: 'smug', pose: 'cheer', glow: 1 - seg(t, T.del + 0.5, T.del + 1), look: [0.8, 0] });
          beam(r.tip[0], r.tip[1], TIRE.x - 120, TIRE.y - 120, t, 1 - seg(t, T.del + 0.5, T.del + 0.7));
          stamp('DELETED', 560, 520, t, T.del + 0.35, T.roast + 0.2);
        },
        post: t => glitch(1 - seg(t, T.del + 0.05, T.del + 0.6), Math.floor(t * 30)) },
      { a: T.roast, b: T.rain, name: 'roast',
        cam: t => ({ z: lerp(1.05, 1.1, seg(t, T.roast, T.rain)), x: 600, y: 1000 }),
        draw: t => {
          road(ctx, 0.2);
          tire(ctx, TIRE.x, TIRE.y, TIRE.r, 0, 0);
          q(t, { expr: t < WF('roast', 'donut') ? 'disgust' : 'smug', pose: 'point', look: [0.8, 0], boing: boing(t, WF('roast', 'donut') - 0.1, 0.3) });
          screenSpace(ctx, () => {
            chip(ctx, 'BALD = NO GRIP', 600, 520, pop(t, WF('roast', 'bald') - 0.1, 0.35), '#FF3B5C', 54);
          });
        } },
      { a: T.rain, b: T.wedge, name: 'rain',
        draw: t => {
          const wet = ease.out(seg(t, T.rain, T.rain + 0.6));
          road(ctx, wet);
          ctx.save(); ctx.globalAlpha = 0.35 * wet; ctx.fillStyle = '#1B2A4A'; ctx.fillRect(0, 0, W, H); ctx.restore();
          rain(ctx, t, wet);
          tire(ctx, TIRE.x, TIRE.y, TIRE.r, 0, t * 6);
          q(t, { expr: 'worried', pose: 'shrug', look: [0.6, 0], sweat: 1 });
        } },
      { a: T.wedge, b: T.float, name: 'wedge',
        draw: t => {
          road(ctx, 1);
          const wx = 690, a = pop(t, WF('wedge', 'water') - 0.1, 0.4);
          waterWedge(ctx, wx, a);
          tire(ctx, 430, 990, 280, 0, t * 2);
          screenSpace(ctx, () => {
            chip(ctx, 'WHERE DOES THE WATER GO?', 600, 480, pop(t, WF('wedge', 'nowhere') - 0.1, 0.35), '#3A9BFF', 50);
          });
          q(t, { x: 1000, s: 0.62, expr: 'shock', pose: 'shrug', look: [-0.8, 0], sweat: 1 });
        } },
      { a: T.float, b: T.numbers, name: 'float',
        draw: t => {
          road(ctx, 1);
          const lift = ease.out(seg(t, T.float, T.float + 0.4)) * 110;
          ctx.save(); ctx.globalAlpha = 0.6; ctx.fillStyle = '#3A9BFF'; ctx.beginPath(); ctx.ellipse(TIRE.x, ROAD - 10, 420, 60, 0, 0, 7); ctx.fill(); ctx.restore();
          tire(ctx, TIRE.x, TIRE.y - lift, TIRE.r, 0, 0);
          bigLabel(ctx, 'AQUAPLANING', 800, 420, 660, 640 - lift, pop(t, WF('float', 'aquaplaning') - 0.1, 0.4), 60);
          q(t, { x: 190, expr: 'shock', pose: 'shrug', sweat: 1, look: [0.8, 0] });
        } },
      { a: T.numbers, b: T.min, name: 'numbers',
        draw: t => {
          ctx.fillStyle = XR.navy; ctx.fillRect(0, 0, W, H);
          for (let i = 0; i < 14; i++) sparkle(ctx, hash(i) * W, hash(i + 3) * H, 10 + 14 * hash(i + 5), 0.6);
          bigStat('30 L', 540, 640, pop(t, WF('numbers', 'thirty') - 0.1, 0.4));
          txt(ctx, 'OF WATER PER SECOND', 540, 800, { size: 48, font: 'Lilita', color: '#fff', stroke: 10, alpha: pop(t, WF('numbers', 'second') - 0.1, 0.4) });
          bigStat('80 KM/H', 540, 1120, pop(t, WF('numbers', 'eighty') - 0.1, 0.4), '#5CE1FF');
        } },
      { a: T.min, b: T.twist, name: 'min',
        draw: t => {
          road(ctx, 0);
          gauge(ctx, 420, 420, 780, pop(t, WF('min', 'minimum') - 0.1, 0.4));
          screenSpace(ctx, () => {
            chip(ctx, 'LEGAL MINIMUM: 1.6 MM', 800, 470, pop(t, WF('min', 'minimum') - 0.1, 0.35), '#FFD43B', 46);
          });
          q(t, { x: 820, s: 0.75, expr: 'cool', pose: 'point', look: [-0.8, 0] });
        } },
      { a: T.twist, b: T.outro, name: 'twist',
        draw: t => {
          road(ctx, 0);
          tire(ctx, 250, ROAD - 200 + 10, 200, 0, 0);
          tire(ctx, 860, ROAD - 200 + 10, 200, 1, 0);
          screenSpace(ctx, () => {
            chip(ctx, 'SLICK · DRY', 250, 560, pop(t, WF('twist', 'slicks') - 0.1, 0.35), '#FFFFFF', 46);
            chip(ctx, 'GROOVED · WET', 860, 560, pop(t, WF('twist', 'grooved') - 0.1, 0.35), '#5CE1FF', 46);
          });
          q(t, { x: 540, y: ROAD, s: 0.62, expr: 'smug', pose: 'idle', look: [0, 0] });
        } },
      'OUTRO',
    ];

    const sfx = [
      ['pop', WF('hook', 'grooves') - 0.1], ['whoosh', T.reveal], ['ding', WF('reveal', 'tread') - 0.1],
      ['crumble', T.del + 0.2], ['stamp', T.del + 0.35],
      ['boing', WF('roast', 'donut') - 0.1], ['pop', WF('roast', 'bald') - 0.1],
      ['rain', T.rain], ['thunder', T.rain + 0.2],
      ['sizzle', WF('wedge', 'nowhere') - 0.1], ['whoosh', T.float],
      ['hit', WF('float', 'aquaplaning') - 0.1], ['siren', WF('float', 'aquaplaning') + 0.2, 0.6],
      ['counter', WF('numbers', 'thirty') - 0.1], ['counter', WF('numbers', 'eighty') - 0.1],
      ['ding', WF('min', 'millimeters') - 0.1],
      ['whoosh', T.twist], ['pop', WF('twist', 'slicks') - 0.1], ['pop', WF('twist', 'grooved') - 0.1],
    ];
    return { shots, sfx, music: { drops: [], radio: [] } };
  },
};
