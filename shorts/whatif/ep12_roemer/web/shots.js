// EP12 (DE) — Die Römer: Wäsche mit Urin, Urinsteuer, Gerstenfresser, selbstheilender Beton, Imbissbuden. 3D comic Rome, 2D Quix.
window.EPISODE = {
  series: 'QUIX', badge: 'GESCHICHTE',
  title: ['WÄSCHE MIT URIN?!', 'DIE RÖMER WAREN VERRÜCKT'],
  noSubsCues: [],
  followText: 'FOLG MIR FÜR MEHR GESCHICHTE',
  build() {
    const L = C;
    buildRome();
    Object.assign(T, {
      hook2: L('hook2').s - 0.12, wash: L('wash').s - 0.12, collect: L('collect').s - 0.12, roast1: L('roast1').s - 0.3,
      tax: L('tax').s - 0.12, coin: L('coin').s - 0.12, geld: L('geld').s - 0.2, glad: L('glad').s - 0.12, ash: L('ash').s - 0.12,
      roast2: L('roast2').s - 0.3, concrete: L('concrete').s - 0.12, pantheon: L('pantheon').s - 0.12, roast3: L('roast3').s - 0.3,
      food: L('food').s - 0.12, roast4: L('roast4').s - 0.3,
    });
    const CAM = {
      laundry: [[-1.5, 3.6, 30], [-4, 1.0, 20], 42],
      street:  [[0, 4.2, 26], [0, 5, -30], 46],
      pots:    [[-0.5, 2.8, 28], [3.6, 0.9, 20.5], 40],
      ludus:   [[25, 4.6, 5], [19, 1.2, -5.5], 42],
      pantheon:[[-4, 5, 40], [-26, 7, -12], 36],
      food:    [[10.5, 3.0, 33], [6.5, 1.0, 25], 42],
      colos:   [[0, 3, -25], [0, 8, -62], 50],
    };
    const l3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
    const cam = (a, b = a, k = 0, shake = 0) => {
      const A = CAM[a], B = CAM[b], e = ease.io(clamp(k)), p = l3(A[0], B[0], e);
      if (shake) { p[0] += shake * (hash(Math.floor(T._t * 60)) - 0.5); p[1] += shake * (hash(Math.floor(T._t * 60) + 9) - 0.5); }
      Q3.look(p, l3(A[1], B[1], e), lerp(A[2], B[2], e));
    };
    const frame = (t, o = {}) => { T._t = t; romeUpdate(t, o); };
    const Q2 = (t, o) => quix(t, Object.assign({ x: 200, y: 1430, s: 0.85, expr: 'cool', pose: 'idle', outfit: 'historian', look: [0.6, -0.4] }, o));
    const BIG = { x: 540, y: 1440, s: 1.4 };
    const dim = a => { ctx.fillStyle = `rgba(40,20,10,${a})`; ctx.fillRect(0, 0, W, H); };
    const chipAt = (s, x, y, a, dot, size = 46) => chip(ctx, s, x, y, a, dot, size);
    const punchline = (s, t, t0, col = '#FF3B5C', y = 360, size = 60) => {
      const a = pop(t, t0, 0.35); if (a <= 0) return;
      ctx.save(); ctx.translate(540, y); ctx.rotate(-0.05 + 0.02 * Math.sin(t * 9)); ctx.scale(a, a);
      ctx.font = `${size}px Bungee`; const lines = s.split('\n'); const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 90, h = size * 1.5 * lines.length + 40;
      ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 36); ctx.fill(); ctx.stroke();
      lines.forEach((l, i) => txt(ctx, l, 0, -h / 2 + size * 1.1 + i * size * 1.5, { size, font: 'Bungee', color: '#fff', stroke: 10 }));
      ctx.restore();
    };
    const counter = (label, value, x, y, a, col = '#FFD43B') => {
      if (a <= 0) return;
      ctx.save(); ctx.translate(x, y); ctx.scale(Math.min(1, a), Math.min(1, a));
      ctx.font = '96px Bungee'; const cw = Math.max(620, Math.min(1000, ctx.measureText(value).width + 110));
      pill(ctx, 0, 0, cw, 190, '#2A1608', col, 10);
      txt(ctx, value, 0, -16, { size: 96, font: 'Bungee', color: col, shadow: false });
      txt(ctx, label, 0, 58, { size: 40, font: 'Lilita', color: '#fff', shadow: false });
      ctx.restore();
    };
    const stinkLines = (x, y, a, t) => {     // cartoon smell wiggles
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = clamp(a); ctx.strokeStyle = '#9BCB3B'; ctx.lineWidth = 9; ctx.lineCap = 'round';
      for (let i = 0; i < 3; i++) { const ox = x - 50 + i * 50; ctx.beginPath(); ctx.moveTo(ox, y);
        for (let k = 1; k <= 6; k++) ctx.lineTo(ox + 14 * Math.sin(t * 6 + k + i), y - k * 26); ctx.stroke(); }
      ctx.restore();
    };
    const concreteDemo = (t, t0, tWater) => {  // cross-section: crack runs through a lime clast, water seeps in, crack closes
      const a = ease.out(seg(t, t0, t0 + 0.5)); if (a <= 0) return;
      const x = 540, y = 820, w = 760, h = 420, heal = ease.io(seg(t, tWater + 0.3, tWater + 2.2));
      ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
      ctx.fillStyle = '#9C958A'; ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 24); ctx.fill(); ctx.stroke();
      for (let i = 0; i < 40; i++) { ctx.fillStyle = ['#7F786E', '#B5AEA3', '#6E675E'][i % 3]; ctx.beginPath(); ctx.arc(-w / 2 + 30 + hash(i) * (w - 60), -h / 2 + 30 + hash(i + 7) * (h - 60), 8 + hash(i + 3) * 14, 0, 7); ctx.fill(); }
      const clasts = [[-120, -40], [60, 30], [210, -70], [-250, 80]];
      clasts.forEach(([cx, cy], i) => { ctx.fillStyle = '#FFFFFF'; ctx.shadowColor = '#FFF6C2'; ctx.shadowBlur = 30 * heal; ctx.beginPath(); ctx.arc(cx, cy, 24 + 4 * Math.sin(i), 0, 7); ctx.fill(); ctx.shadowBlur = 0; });
      const crack = [[-w / 2, -150], [-230, -100], [-120, -40], [-30, -10], [60, 30], [140, 10], [w / 2, 60]];
      ctx.strokeStyle = '#1A1033'; ctx.lineWidth = lerp(22, 2, heal); ctx.lineJoin = 'round'; ctx.beginPath(); crack.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.stroke();
      if (heal > 0) { ctx.strokeStyle = `rgba(255,255,255,${heal})`; ctx.lineWidth = lerp(4, 20, heal); ctx.beginPath(); crack.forEach(([px, py], i) => i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.stroke(); }
      const wa = seg(t, tWater - 0.2, tWater + 1.6);
      if (wa > 0 && wa < 1) for (let i = 0; i < 6; i++) { const f = (wa + i / 6) % 1, [px, py] = crack[Math.floor(f * (crack.length - 1))]; ctx.fillStyle = '#5CE1FF'; ctx.beginPath(); ctx.arc(px, py - 10, 14, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); }
      txt(ctx, heal > 0.6 ? 'RISS GESCHLOSSEN' : 'RISS', 0, -h / 2 - 50, { size: 50, font: 'Bungee', color: heal > 0.6 ? '#2BD47D' : '#FF6B2C', stroke: 10 });
      ctx.restore();
    };

    const shots = [
      { a: 0, b: T.hook2, name: 'hook',
        draw: t => {
          const ur = WF('hook', 'urin');
          frame(t); cam('laundry', 'laundry', 0, t < 0.5 ? 0.25 * (1 - t / 0.5) : 0); Q3.render(ctx);
          Q2(t, { x: 860, outfit: 'roman', item: 'pot', expr: t < ur ? 'smug' : 'disgust', pose: 'point', look: [-0.6, -0.3], boing: boing(t, 0.1, 0.5) });
          stinkLines(870, 1080, seg(t, ur - 0.2, ur + 0.2), t);
          punchline('MIT URIN!', t, ur - 0.1, '#C9A20E', 1040, 72);
        },
        post: t => glitch(1 - seg(t, 0, 0.3), Math.floor(t * 30)) },
      { a: T.hook2, b: T.intro, name: 'hook2',
        draw: t => {
          frame(t); cam('street', 'street'); Q3.render(ctx);
          Q2(t, { outfit: 'emperor', item: 'coin', pose: 'cheer', expr: 'smug', look: [0.4, -0.6] });
          stamp('WAHR!', 560, 780, t, WF('hook2', 'steuern') - 0.05, T.intro + 0.4, '#2BD47D', 150, -0.12);
          chipAt('STEUER AUF URIN', 600, 360, pop(t, WF('hook2', 'kaiser') - 0.1, 0.35), '#FFD43B', 54);
        } },
      { a: T.intro, b: T.wash, name: 'intro',
        draw: t => {
          const ro = WF('intro', 'römer');
          frame(t); cam('colos', 'colos'); Q3.render(ctx); dim(0.35);
          const outfit = t < ro - 0.15 ? 'historian' : 'roman';
          Q2(t, { ...BIG, outfit, item: outfit === 'historian' ? 'pointer' : null, expr: t < WF('intro', 'historiker') ? 'cool' : 'smug', pose: t < ro - 0.15 ? 'hips' : 'cheer', look: [0, -0.2], boing: boing(t, T.intro + 0.05, 0.3) });
          if (Math.abs(t - (ro - 0.15)) < 0.35) sparkle(ctx, 540, 1100, 260 * (1 - Math.abs(t - (ro - 0.15)) / 0.35), 1);
          const tagA = pop(t, WF('intro', 'quix') - 0.1, 0.45);
          if (tagA > 0) {
            ctx.save(); ctx.translate(540, 380); ctx.scale(tagA, tagA); ctx.rotate(-0.04);
            txt(ctx, 'QUIX', 0, 0, { size: 210, font: 'Bungee', color: '#FFD43B', stroke: 26, glow: '#FFD43B', glowBlur: 40 });
            pill(ctx, 0, 150, 560, 74, '#fff', INK, 7); txt(ctx, 'ERKLÄRT GESCHICHTE', 0, 154, { size: 40, font: 'Lilita', color: INK, shadow: false });
            ctx.restore();
          }
        } },
      { a: T.wash, b: T.collect, name: 'wash',
        draw: t => {
          frame(t); cam('street', 'laundry', seg(t, T.wash, T.wash + 1.2)); Q3.render(ctx);
          chipAt('WÄSCHEREI', 540, 330, pop(t, T.wash + 0.2, 0.35), '#5CE1FF', 52);
          chipAt('BOTTICH VOLLER URIN', 540, 440, pop(t, WF('wash', 'urin') - 0.1, 0.35), '#E9D24A', 48);
          chipAt('AMMONIAK LÖST FETT', 540, 550, pop(t, WF('wash', 'ammoniak') - 0.1, 0.35), '#2BD47D', 48);
          Q2(t, { x: 880, item: 'pointer', pose: 'point', expr: 'disgust', look: [-0.6, -0.4] });
        } },
      { a: T.collect, b: T.roast1, name: 'collect',
        draw: t => {
          const sp = WF('collect', 'spenden');
          frame(t, { passerWalk: true }); cam('pots', 'pots'); Q3.render(ctx);
          const [px, py] = Q3.project(R.pots[0]);
          bigLabel(ctx, 'SAMMELTOPF', 600, 420, px, py - 80, pop(t, WF('collect', 'töpfen') - 0.1, 0.4), 56);
          chipAt('BITTE SPENDEN', 600, 580, pop(t, sp - 0.1, 0.35), '#E9D24A', 50);
          stinkLines(px, py - 90, seg(t, sp - 0.2, sp + 0.3), t);
          Q2(t, { outfit: 'roman', item: 'pot', pose: 'shrug', expr: 'happy' });
        } },
      { a: T.roast1, b: T.tax, name: 'roast1',
        draw: t => {
          const fl = WF('roast1', 'flasche');
          frame(t); cam('pots', 'pots'); Q3.render(ctx); dim(0.4);
          Q2(t, { ...BIG, outfit: 'roman', expr: 'smug', pose: 'point', look: [0.4, 0.3], boing: boing(t, fl - 0.1, 0.4) });
          punchline('ABER IHHH,\nMEINE FLASCHE!', t, fl - 0.15, '#7B5CFF', 380);
        } },
      { a: T.tax, b: T.geld, name: 'tax',
        draw: t => {
          const ti = WF('tax', 'titus'), na = WF('coin', 'nase');
          frame(t); cam('street', 'colos', seg(t, T.tax, T.geld) * 0.5); Q3.render(ctx); dim(0.3);
          Q2(t, { ...BIG, x: 380, outfit: 'emperor', item: t > T.coin ? 'coin' : null, expr: t < na ? 'cool' : 'smug', pose: t > T.coin ? 'point' : 'hips', look: [0.6, -0.2] });
          chipAt('KAISER VESPASIAN', 540, 330, pop(t, WF('tax', 'vespasian') - 0.1, 0.35), '#7A1FA2', 52);
          chipAt('SOHN TITUS: „IHHH!“', 700, 450, pop(t, ti - 0.1, 0.35), '#9BCB3B', 46);
          if (t > na - 0.2) stinkLines(640, 860, 1 - seg(t, na + 0.6, na + 1.2), t);
        } },
      { a: T.geld, b: T.glad, name: 'geld',
        draw: t => {
          frame(t); cam('colos', 'colos'); Q3.render(ctx); dim(0.45);
          Q2(t, { ...BIG, outfit: 'emperor', item: 'coin', expr: 'smug', pose: 'point', look: [0.5, -0.4] });
          punchline('GELD STINKT\nNICHT', t, WF('geld', 'geld') - 0.15, '#D9A21B', 380, 70);
          txt(ctx, 'PECUNIA NON OLET', 540, 610, { size: 44, font: 'Lilita', color: '#FFE7A0', stroke: 10, alpha: pop(t, WF('geld', 'stinkt') + 0.2, 0.4) });
        } },
      { a: T.glad, b: T.ash, name: 'glad',
        draw: t => {
          const ge = WF('glad', 'gerstenfresser');
          frame(t); cam('ludus', 'ludus'); Q3.render(ctx);
          chipAt('KEINE FLEISCHBERGE', 540, 330, pop(t, WF('glad', 'fleischberge') - 0.1, 0.35), '#FF6B2C', 50);
          punchline('GERSTENFRESSER', t, ge - 0.1, '#C9A20E', 470, 62);
          chipAt('BOHNEN + GETREIDE', 540, 600, pop(t, WF('glad', 'bohnen') - 0.1, 0.35), '#2BD47D', 48);
          Q2(t, { item: 'pointer', pose: 'point', expr: 'happy' });
        } },
      { a: T.ash, b: T.roast2, name: 'ash',
        draw: t => {
          frame(t); cam('ludus', 'ludus'); Q3.render(ctx);
          const [dx, dy] = Q3.project(R.drinker.head);
          chipAt('KNOCHENFUNDE · EPHESOS', 540, 330, pop(t, WF('ash', 'ephesos') - 0.1, 0.35), '#FFFFFF', 44);
          bigLabel(ctx, 'PFLANZENASCHE', 560, 470, dx + 40, dy + 60, pop(t, WF('ash', 'pflanzenasche') - 0.1, 0.4), 52, '#B5B5B5');
          chipAt('FÜR STÄRKERE KNOCHEN', 540, 640, pop(t, WF('ash', 'knochen') - 0.1, 0.35), '#5CE1FF', 44);
          Q2(t, { item: 'pointer', pose: 'think', expr: 'curious' });
        } },
      { a: T.roast2, b: T.concrete, name: 'roast2',
        draw: t => {
          const pr = WF('roast2', 'prost');
          frame(t); cam('ludus', 'ludus'); Q3.render(ctx); dim(0.4);
          Q2(t, { ...BIG, outfit: 'roman', item: 'pot', expr: t < pr - 0.1 ? 'smug' : 'disgust', pose: 'cheer', boing: boing(t, pr - 0.1, 0.4) });
          punchline('SPORTLERDRINK:\nASCHE + WASSER', t, WF('roast2', 'asche') - 0.15, '#6E675E', 380, 56);
        } },
      { a: T.concrete, b: T.pantheon, name: 'concrete',
        draw: t => {
          frame(t); cam('pantheon', 'pantheon'); Q3.render(ctx); dim(0.5);
          chipAt('RÖMISCHER BETON', 540, 330, pop(t, WF('concrete', 'beton') - 0.1, 0.35), '#FFD43B', 52);
          concreteDemo(t, WF('concrete', 'kalkbrocken') - 0.5, WF('concrete', 'wasser') - 0.2);
          Q2(t, { item: 'pointer', pose: 'point', expr: 'happy', look: [0.6, -0.6] });
        } },
      { a: T.pantheon, b: T.roast3, name: 'pantheon',
        draw: t => {
          const ku = WF('pantheon', 'kuppel');
          frame(t, { domeGlow: 0.18 * seg(t, ku - 0.1, ku + 0.5) }); cam('pantheon', 'pantheon'); Q3.render(ctx);
          const [x, y] = Q3.project(R.dome);
          for (let i = 0; i < 6; i++) sparkle(ctx, x + (hash(i) - 0.5) * 380, y - 120 + (hash(i + 4) - 0.5) * 200, 24 + 20 * Math.sin(t * 6 + i), seg(t, ku - 0.1, ku + 0.5));
          counter('KUPPEL DES PANTHEONS', '≈ 1.900 JAHRE', 540, 360, pop(t, WF('pantheon', 'neunzehnhundert') - 0.2, 0.35), '#FFD43B');
          Q2(t, { item: 'pointer', pose: 'thumb', expr: 'happy' });
        } },
      { a: T.roast3, b: T.food, name: 'roast3',
        draw: t => {
          const sl = WF('roast3', 'schlaglöcher');
          frame(t); cam('street', 'street'); Q3.render(ctx); dim(0.4);
          Q2(t, { ...BIG, outfit: 'historian', item: 'pointer', expr: 'smug', pose: 'hips', boing: boing(t, sl - 0.1, 0.4) });
          punchline('DEINE SCHULSTRASSE:\n1 WINTER', t, sl - 0.15, '#E0284A', 380, 54);
        } },
      { a: T.food, b: T.roast4, name: 'food',
        draw: t => {
          frame(t, { cheer: t > WF('food', 'schnecken') }); cam('street', 'food', seg(t, T.food, T.food + 1.4)); Q3.render(ctx);
          chipAt('IMBISSBUDE IN POMPEJI', 540, 330, pop(t, WF('food', 'pompeji') - 0.1, 0.35), '#C9442E', 46);
          chipAt('ENTE', 380, 450, pop(t, WF('food', 'ente') - 0.1, 0.35), '#E8B84A', 50);
          chipAt('SCHNECKEN', 700, 450, pop(t, WF('food', 'schnecken') - 0.1, 0.35), '#9BCB3B', 50);
          Q2(t, { outfit: 'roman', pose: 'cheer', expr: 'happy' });
        } },
      { a: T.roast4, b: T.outro, name: 'roast4',
        draw: t => {
          const po = WF('roast4', 'pommes');
          frame(t, { cheer: true }); cam('food', 'food'); Q3.render(ctx); dim(0.4);
          Q2(t, { ...BIG, outfit: 'roman', expr: 'smug', pose: 'point', look: [0.4, 0.3], boing: boing(t, po - 0.1, 0.4) });
          punchline('SCHNECKEN ZUM MITNEHMEN.\nUND DU: POMMES.', t, WF('roast4', 'mitnehmen') - 0.15, '#2BD47D', 380, 54);
        } },
      { a: T.outro, b: T.end + 1, name: 'outro',
        draw: t => {
          frame(t); cam('colos', 'colos'); Q3.render(ctx); dim(0.35);
          Q2(t, { ...BIG, outfit: 'roman', expr: t < WF('outro', 'volk') ? 'cool' : 'curious', pose: t < WF('outro', 'volk') ? 'hips' : 'shrug', glow: 0.5 + 0.5 * Math.sin(t * 4), boing: boing(t, T.outro + 0.05, 0.3) });
          const ea = pop(t, C('outro').e + 0.05, 0.45);
          if (ea > 0) {
            ctx.save(); ctx.translate(540, 250); ctx.scale(ea, ea); pill(ctx, 0, 0, 700, 150, '#FFD43B', INK, 10);
            txt(ctx, 'KOMMENTAR ↓', 0, 8, { size: 84, font: 'Bungee', color: INK, shadow: false }); ctx.restore();
            txt(ctx, EP.followText, 540, 385, { size: 50, font: 'Lilita', color: '#fff', stroke: 12, alpha: ea });
          }
        } },
    ];

    const sfx = [
      ['scratch', 0.05], ['hit', 0.15], ['gurgle', WF('hook', 'urin') - 0.2], ['hit', WF('hook', 'urin') - 0.05],
      ['coin', WF('hook2', 'kaiser') - 0.1], ['stamp', WF('hook2', 'steuern') - 0.05],
      ['sparkle', WF('intro', 'römer') - 0.25],
      ['water', T.wash + 0.2, 0.6], ['pop', WF('wash', 'urin') - 0.1], ['ding', WF('wash', 'ammoniak') - 0.1],
      ['pop', WF('collect', 'töpfen') - 0.1], ['drip', WF('collect', 'spenden') - 0.1],
      ['scratch', L('roast1').s - 0.35], ['rimshot', C('roast1').e + 0.05],
      ['pop', WF('tax', 'vespasian') - 0.1], ['boing', WF('tax', 'titus') - 0.1], ['coin', T.coin + 0.1], ['sizzle', WF('coin', 'nase') - 0.1],
      ['stamp', WF('geld', 'geld') - 0.1], ['coin', WF('geld', 'stinkt') + 0.1],
      ['clink', T.glad + 0.3], ['clink', T.glad + 0.9], ['hit', WF('glad', 'gerstenfresser') - 0.1],
      ['pop', WF('ash', 'ephesos') - 0.1], ['ding', WF('ash', 'pflanzenasche') - 0.1],
      ['scratch', L('roast2').s - 0.35], ['rimshot', C('roast2').e + 0.05],
      ['crack', WF('concrete', 'kalkbrocken') - 0.4], ['water', WF('concrete', 'wasser') - 0.2, 0.6], ['rebuild', WF('concrete', 'wasser') + 0.3],
      ['chime', WF('pantheon', 'kuppel') - 0.1], ['counter', WF('pantheon', 'neunzehnhundert') - 0.2],
      ['scratch', L('roast3').s - 0.35], ['rimshot', C('roast3').e + 0.05],
      ['pop', WF('food', 'pompeji') - 0.1], ['pop', WF('food', 'ente') - 0.1], ['pop', WF('food', 'schnecken') - 0.1],
      ['scratch', L('roast4').s - 0.35], ['rimshot', C('roast4').e + 0.05],
    ];
    return { shots, sfx, music: { drops: [], radio: [] } };
  },
};
