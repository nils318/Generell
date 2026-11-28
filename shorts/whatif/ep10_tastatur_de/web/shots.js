// EP10 (DE) — Was wäre, wenn die Tastatur keine Huckel hätte? 3D world, 2D Quix, German voice + subtitles.
window.EPISODE = {
  badge: '#10',
  title: ['WAS WÄRE OHNE', 'DIE HUCKEL?'],
  keywords: { quix: 'quix', today: 'heute', deleting: 'lösche' },
  noSubsCues: [],
  followText: 'FOLG MIR FÜR TEIL 11',
  build() {
    const L = C;
    buildWorld(); W3.quix.group.visible = false;
    Object.assign(T, {
      hook: L('hook').s - 0.12, reveal: L('reveal').s - 0.12, roasta: L('roasta').s - 0.25, blind: L('blind').s - 0.12,
      gib: L('gibberish').s - 0.12, roastb: L('roastb').s - 0.3, why: L('why').s - 0.12, home: L('home').s - 0.12,
      fast: L('fast').s - 0.12, roastc: L('roastc').s - 0.25, numpad: L('numpad').s - 0.12, roastd: L('roastd').s - 0.2,
      last: L('last').s - 0.12,
    });
    const CAM = {
      wide:  [[0.6, 5.6, 12.5], [0.6, 1.6, -1.2], 34],
      med:   [[-0.6, 2.9, 8.8], [-0.4, 1.2, 1.0], 34],
      fj:    [[0.125, 4.4, 4.4], [0.125, 0.3, 0.0], 40],
      hands: [[0.15, 6.2, 4.4], [0.15, 0.3, -0.4], 40],
      screen:[[0.9, 3.9, 3.4], [0.9, 3.0, -4.2], 42],
      pad:   [[3.8, 2.5, 2.6], [3.8, 0.3, 0.0], 36],
      desk:  [[-0.4, 3.2, 7.0], [-0.4, 1.0, -0.6], 38],
    };
    const l3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
    const cam = (a, b = a, k = 0, shake = 0) => {
      const A = CAM[a], B = CAM[b], e = ease.io(clamp(k)), p = l3(A[0], B[0], e);
      if (shake) { p[0] += shake * (hash(Math.floor(T._t * 60)) - 0.5); p[1] += shake * (hash(Math.floor(T._t * 60) + 9) - 0.5); }
      Q3.look(p, l3(A[1], B[1], e), lerp(A[2], B[2], e));
    };
    const bumpsTo = s => { for (const k of ['F', 'J']) W3.bumps[k].scale.setScalar(Math.max(0.001, s)); };
    const bumpGlow = a => { for (const b of Object.values(W3.bumps)) { const m = b.userData.mesh.material; m.emissive.setHex(0xFFD43B); m.emissiveIntensity = a; } };
    const frame = (t, o = {}) => { T._t = t; resetKeys(); bumpGlow(0); bumpsTo(o.bumps ?? 1); placeHands(0, o.hands || 0); setScreen(o.screen ?? '', o.bad, o.cursor ?? true, o.title || 'notizen.txt'); };
    // 2D Quix over the 3D world; feet just above the subtitles
    const Q2 = (t, o) => quix(t, Object.assign({ x: 200, y: 1430, s: 0.85, expr: 'cool', pose: 'idle', look: [0.6, -0.4] }, o));
    const BIG = { x: 540, y: 1440, s: 1.45 };
    const dim = a => { ctx.fillStyle = `rgba(30,12,70,${a})`; ctx.fillRect(0, 0, W, H); };
    const chipAt = (s, x, y, a, dot, size = 46) => chip(ctx, s, x, y, a, dot, size);
    const punchline = (s, t, t0, col = '#FF3B5C', y = 360) => {
      const a = pop(t, t0, 0.35); if (a <= 0) return;
      ctx.save(); ctx.translate(540, y); ctx.rotate(-0.05 + 0.02 * Math.sin(t * 9)); ctx.scale(a, a);
      ctx.font = '64px Bungee'; const lines = s.split('\n'); const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 90, h = 96 * lines.length + 40;
      ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 36); ctx.fill(); ctx.stroke();
      lines.forEach((l, i) => txt(ctx, l, 0, -h / 2 + 70 + i * 96, { size: 64, font: 'Bungee', color: '#fff', stroke: 10 }));
      ctx.restore();
    };
    const helloSeq = t0 => rhythm('hallo', t0, 0.17);

    const shots = [
      { a: 0, b: T.hook, name: 'preview',
        draw: t => {
          const wtf = L('previewb').s, seq = helloSeq(0.4);
          frame(t, { hands: 1, screen: typeSeq(t, seq, 1), bad: t > 1.4 });
          placeHands(1, 1); typeSeq(t, seq, 1);
          cam('screen', 'wide', seg(t, 0.2, 2.0), t > wtf ? 0.12 * (1 - seg(t, wtf, wtf + 0.6)) : 0);
          Q3.render(ctx);
          if (t > wtf - 0.25) dim(0.25);
          Q2(t, t > wtf - 0.25 ? { ...BIG, expr: 'shock', pose: 'shrug', sweat: 1, boing: boing(t, wtf - 0.1, 0.5) } : { expr: t < 1.6 ? 'curious' : 'worried', look: [0.6, -0.7] });
          chipAt('PREVIEW', 540, 760, pop(t, 0.2, 0.3), '#FFD43B', 48);
        },
        post: t => glitch(seg(t, T.hook - 0.35, T.hook), Math.floor(t * 30)) },
      { a: T.hook, b: T.reveal, name: 'hook',
        draw: t => {
          const sp = WF('hook', 'spürst');
          frame(t); bumpGlow(fadeIO(t, WF('hook', 'huckel') - 0.1, T.reveal + 2, 0.15) * (0.6 + 0.4 * Math.sin(t * 10)));
          cam('desk', 'fj', seg(t, sp - 0.3, sp + 0.6));
          Q3.render(ctx);
          Q2(t, { expr: 'curious', pose: 'point', look: [0.8, -0.5] });
        } },
      { a: T.reveal, b: T.roasta, name: 'reveal',
        draw: t => {
          frame(t); bumpGlow(0.6 + 0.4 * Math.sin(t * 10)); glowKey(W3.keys.F, 0.5); glowKey(W3.keys.J, 0.5);
          cam('fj'); Q3.render(ctx);
          const [fx, fy] = Q3.project(W3.bumps.F), [jx, jy] = Q3.project(W3.bumps.J), a = pop(t, T.reveal + 0.1, 0.4);
          bigLabel(ctx, 'F', fx - 60, fy - 330, fx, fy - 10, a, 70); bigLabel(ctx, 'J', jx + 60, jy - 330, jx, jy - 10, a, 70);
          Q2(t, { expr: 'cool', pose: 'thumb' });
        } },
      { a: T.roasta, b: T.intro, name: 'roasta',
        draw: t => {
          const g = WF('roasta', 'genie');
          frame(t); cam('desk', 'desk'); Q3.render(ctx); dim(0.3);
          Q2(t, { ...BIG, expr: t < g - 0.3 ? 'cool' : 'smug', pose: t < g - 0.3 ? 'idle' : 'hips', look: [0, 0], boing: boing(t, g - 0.1, 0.4) });
          punchline('KEIN FABRIKFEHLER,\nDU GENIE', t, g - 0.15, '#FF3B5C', 640);
        } },
      { a: T.intro, b: T.del, name: 'intro',
        draw: t => {
          const ch = seg(t, WF('delete', 'heute') - 0.1, T.del), lo = WF('delete', 'lösche');
          frame(t); cam('wide', 'wide', 0, 0.06 * ch); Q3.render(ctx); dim(0.35);
          const r = Q2(t, { ...BIG, expr: ch > 0.05 ? 'smug' : 'cool', pose: t < lo ? 'hips' : 'cheer', glow: ch, look: [0, ch > 0.3 ? -0.6 : 0], boing: boing(t, T.intro + 0.05, 0.3) });
          const tagA = pop(t, WF('intro', 'quix') - 0.1, 0.45);
          if (tagA > 0) {
            ctx.save(); ctx.translate(540, 380); ctx.scale(tagA, tagA); ctx.rotate(-0.04);
            txt(ctx, 'QUIX', 0, 0, { size: 210, font: 'Bungee', color: '#FFD43B', stroke: 26, glow: '#FFD43B', glowBlur: 40 });
            pill(ctx, 0, 150, 560, 74, '#fff', INK, 7); txt(ctx, 'LÖSCHT EIN WINZIGES DING', 0, 154, { size: 40, font: 'Lilita', color: INK, shadow: false });
            ctx.restore();
          }
          if (ch > 0) sparkle(ctx, r.tip[0], r.tip[1], 60 + 80 * ch, ch);
        } },
      { a: T.del, b: T.blind, name: 'delete',
        draw: t => {
          const p = ease.in(seg(t, T.del + 0.15, T.del + 0.9));
          frame(t, { bumps: t < T.del + 0.15 ? 1 : 1 - p }); bumpGlow(1 - p);
          cam('fj', 'fj', 0, 0.15 * (1 - seg(t, T.del, T.del + 0.6))); Q3.render(ctx);
          const r = Q2(t, { expr: 'smug', pose: 'cheer', glow: 1 - seg(t, T.del + 0.5, T.del + 1), look: [0.6, -0.6] });
          const F = Q3.project(W3.bumps.F), J = Q3.project(W3.bumps.J), ba = 1 - seg(t, T.del + 0.5, T.del + 0.7);
          beam(r.tip[0], r.tip[1], F[0], F[1], t, ba); beam(r.tip[0], r.tip[1], J[0], J[1], t, ba);
          if (p > 0 && p < 1) for (const [x, y] of [F, J]) sparkle(ctx, x, y, 50 * Math.sin(p * Math.PI), 1);
          stamp('GELÖSCHT', 540, 520, t, T.del + 0.35, T.blind + 0.2);
        },
        post: t => glitch(1 - seg(t, T.del + 0.05, T.del + 0.6), Math.floor(t * 30)) },
      { a: T.blind, b: T.gib, name: 'blind',
        draw: t => {
          const r = WF('blind', 'rechts'), sh = ease.io(seg(t, r - 0.5, r + 0.2));
          frame(t, { bumps: 0, hands: 1 });
          placeHands(sh, ease.out(seg(t, T.blind, T.blind + 0.5)), 0.4 * (1 - ease.out(seg(t, T.blind + 0.3, T.blind + 0.9))));
          cam('hands'); Q3.render(ctx);
          chipAt('OHNE HUCKEL = BLIND', 540, 330, pop(t, WF('blind', 'blind') - 0.1, 0.35), '#FF3B5C', 48);
          if (sh > 0.6) chipAt('EINE TASTE ZU WEIT →', 540, 1180, pop(t, r - 0.1, 0.35), '#FFD43B', 48);
          Q2(t, { expr: 'worried', pose: 'shrug', sweat: sh });
        } },
      { a: T.gib, b: T.roastb, name: 'gibberish',
        draw: t => {
          const rk = WF('gibberish', 'rausgekommen'), seq = helloSeq(rk + 0.1), typed = typeSeq(t, seq, 1);
          frame(t, { bumps: 0, hands: 1, screen: t < rk ? 'hallo' : typed, bad: t >= rk + 0.4, title: t < rk ? 'was du wolltest' : 'notizen.txt' });
          placeHands(1, 1); typeSeq(t, seq, 1);
          cam('screen', 'wide', seg(t, rk - 0.2, rk + 0.6) * 0.35); Q3.render(ctx);
          Q2(t, { expr: t < rk + 0.6 ? 'curious' : 'shock', pose: t < rk + 0.6 ? 'idle' : 'shrug', look: [0.5, -0.8] });
        } },
      { a: T.roastb, b: T.why, name: 'roastb',
        draw: t => {
          const tb = WF('roastb', 'taube');
          frame(t, { bumps: 0, screen: 'js;;p', bad: true }); cam('screen', 'screen'); Q3.render(ctx); dim(0.35);
          Q2(t, { ...BIG, expr: t < tb - 0.2 ? 'smug' : 'happy', pose: 'point', look: [0.5, 0.5], lean: t > tb - 0.3 ? 0.08 * Math.sin(t * 14) : 0 });
          punchline('VERWIRRTE\nTAUBE', t, tb - 0.15, '#FF6B2C');
        } },
      { a: T.why, b: T.home, name: 'why',
        draw: t => {
          frame(t, { hands: 1 });
          const lf = WF('why', 'linker'), rt = WF('why', 'rechter');
          glowKey(W3.keys.F, seg(t, lf - 0.1, lf + 0.3)); glowKey(W3.keys.J, seg(t, rt - 0.1, rt + 0.3)); bumpGlow(0.8);
          placeHands(0, ease.out(seg(t, T.why + 0.3, T.why + 0.9)));
          cam('hands'); Q3.render(ctx);
          chipAt('GRUNDREIHE', 540, 330, pop(t, WF('why', 'grundreihe') - 0.1, 0.35), '#2BD47D', 54);
          const F = Q3.project(W3.keys.F.g), J = Q3.project(W3.keys.J.g);
          chipAt('LINKER ZEIGEFINGER', F[0] - 40, F[1] + 330, pop(t, lf - 0.1, 0.35), '#5CE1FF', 36);
          chipAt('RECHTER ZEIGEFINGER', J[0] + 40, J[1] + 420, pop(t, rt - 0.1, 0.35), '#FF6B2C', 36);
        } },
      { a: T.home, b: T.fast, name: 'home',
        draw: t => {
          frame(t, { hands: 1 }); bumpGlow(0.6);
          const t0 = WF('home', 'jeder'), z = WF('home', 'zehnfingersystem');
          [...'ASDFJKL;'].forEach((c, i) => glowKey(keyOf(c), seg(t, t0 + i * 0.08, t0 + i * 0.08 + 0.3)));
          cam('hands', 'wide', seg(t, z - 0.6, z + 0.4) * 0.4); Q3.render(ctx);
          punchline('ZEHNFINGER-\nSYSTEM', t, z - 0.1, '#2BD47D', 360);
          Q2(t, { x: 880, expr: 'happy', pose: 'thumb', look: [-0.6, -0.4] });
        } },
      { a: T.fast, b: T.roastc, name: 'fast',
        draw: t => {
          const seq = rhythm('schnell tippen\nohne hinzuschauen', T.fast + 0.2, 0.07), typed = typeSeq(t, seq, 0);
          frame(t, { hands: 1, screen: typed }); placeHands(0, 1); typeSeq(t, seq, 0);
          cam('wide', 'screen', seg(t, T.fast, T.roastc) * 0.5); Q3.render(ctx);
          chipAt('AUGEN HOCH, NICHT RUNTER', 540, 1180, pop(t, WF('fast', 'runterzuschauen') - 0.1, 0.35), '#5CE1FF', 44);
        } },
      { a: T.roastc, b: T.numpad, name: 'roastc',
        draw: t => {
          const q = WF('roastc', 'q'), sc = WF('roastc', 'schulden');
          frame(t); glowKey(W3.keys.Q, fadeIO(t, q - 0.1, T.numpad, 0.2));
          cam('desk', 'wide', seg(t, q, sc) * 0.5); Q3.render(ctx); dim(0.25);
          Q2(t, { ...BIG, expr: t < sc - 0.2 ? 'curious' : 'disgust', pose: t < sc - 0.2 ? 'think' : 'point', look: [Math.sin(t * 3) * 0.9, 0.3] });
          punchline('WO IST DAS Q?!', t, q - 0.1, '#7B5CFF', 330);
          chipAt('ES SCHULDET DIR GELD', 540, 470, pop(t, sc - 0.15, 0.35), '#FFD43B', 46);
        } },
      { a: T.numpad, b: T.roastd, name: 'numpad',
        draw: t => {
          frame(t); const fv = WF('numpad', 'fünf'), hk = WF('numpad', 'huckel');
          glowKey(W3.pad[5], seg(t, fv - 0.1, fv + 0.3)); W3.bumps[5].userData.mesh.material.emissiveIntensity = 0.9 * seg(t, hk - 0.1, hk + 0.3);
          cam('wide', 'pad', seg(t, T.numpad, fv + 0.2)); Q3.render(ctx);
          const [x, y] = Q3.project(W3.bumps[5]);
          bigLabel(ctx, 'ZIFFERNBLOCK 5', 540, y - 380, x, y - 10, pop(t, fv - 0.1, 0.4), 54);
        } },
      { a: T.roastd, b: T.last, name: 'roastd',
        draw: t => {
          const d2 = L('roastd2').s, two = WF('roastd', 'zwei'), sa = WF('roastd', 'sauer'), disp = t > d2 - 0.2;
          frame(t); cam('desk', 'desk'); Q3.render(ctx); dim(0.3);
          Q2(t, { ...BIG, expr: disp ? 'worried' : t < sa - 0.2 ? 'curious' : 'cool', pose: disp ? 'shrug' : 'idle', look: [0, 0.2], lean: disp ? -0.06 : 0 });
          chipAt('ZWEI-FINGER-TIPPER', 540, 330, pop(t, two - 0.1, 0.35), '#FFFFFF', 46);
          if (!disp) chipAt('NICHT SAUER…', 540, 440, pop(t, sa - 0.15, 0.35), '#5CE1FF', 46);
          punchline('NUR\nENTTÄUSCHT', t, d2 + 0.1, '#3A3F55', 520);
        } },
      { a: T.last, b: T.outro, name: 'last',
        draw: t => {
          const k = ease.back(seg(t, T.last, T.last + 0.6));
          frame(t, { bumps: k, hands: 1 }); bumpGlow(0.5 + 0.5 * Math.sin(t * 8)); placeHands(0, 1);
          cam('fj', 'wide', ease.io(seg(t, T.last + 0.8, T.outro))); Q3.render(ctx);
          if (k > 0 && k < 1) for (const b of ['F', 'J']) { const [x, y] = Q3.project(W3.bumps[b]); sparkle(ctx, x, y, 60 * Math.sin(k * Math.PI), 1); }
          chipAt('FÜHL SIE. JETZT.', 540, 330, pop(t, WF('last', 'fühl') - 0.1, 0.35), '#FFD43B', 54);
          Q2(t, { expr: 'happy', pose: 'thumb' });
        } },
      { a: T.outro, b: T.end + 1, name: 'outro',
        draw: t => {
          const wa = WF('outro', 'was');
          frame(t); cam('wide', 'wide'); Q3.render(ctx); dim(0.35);
          Q2(t, { ...BIG, expr: t < wa ? 'cool' : 'curious', pose: t < wa ? 'hips' : 'shrug', glow: 0.5 + 0.5 * Math.sin(t * 4), look: [0, -0.2], boing: boing(t, T.outro + 0.05, 0.3) });
          const ea = pop(t, C('outro').e + 0.05, 0.45);
          if (ea > 0) {
            ctx.save(); ctx.translate(540, 250); ctx.scale(ea, ea); pill(ctx, 0, 0, 700, 150, '#FFD43B', INK, 10);
            txt(ctx, 'KOMMENTAR ↓', 0, 8, { size: 84, font: 'Bungee', color: INK, shadow: false }); ctx.restore();
            txt(ctx, EP.followText, 540, 385, { size: 58, font: 'Lilita', color: '#fff', stroke: 12, alpha: ea });
          }
        } },
    ];

    const typ = (t0, n, gap) => Array.from({ length: n }, (_, i) => ['key', t0 + i * gap]);
    const sfx = [
      ...typ(0.4, 5, 0.17), ['error', 1.4], ['scratch', L('previewb').s - 0.1], ['hit', L('previewb').s + 0.05],
      ['pop', WF('hook', 'huckel') - 0.1], ['ding', T.reveal + 0.1],
      ['rimshot', C('roasta').e + 0.05],
      ['crumble', T.del + 0.2], ['stamp', T.del + 0.35],
      ['whoosh', WF('blind', 'rechts') - 0.4], ['error', WF('blind', 'rechts') + 0.15],
      ...typ(WF('gibberish', 'rausgekommen') + 0.1, 5, 0.17), ['error', WF('gibberish', 'rausgekommen') + 0.95],
      ['scratch', L('roastb').s - 0.35], ['rimshot', C('roastb').e + 0.05],
      ['ding', WF('why', 'linker') - 0.1], ['ding', WF('why', 'rechter') - 0.1, 0.8],
      ['sparkle', WF('home', 'jeder') - 0.1], ['pop', WF('home', 'zehnfingersystem') - 0.1],
      ['typing', T.fast + 0.2], ['whoosh', T.fast],
      ['boing', WF('roastc', 'q') - 0.1], ['rimshot', C('roastc').e + 0.05],
      ['ding', WF('numpad', 'fünf') - 0.1], ['pop', WF('numpad', 'huckel') - 0.1],
      ['scratch', L('roastd2').s - 0.3], ['rimshot', C('roastd2').e + 0.05],
      ['sparkle', T.last + 0.1], ['pop', WF('last', 'fühl') - 0.1],
    ];
    return { shots, sfx, music: { drops: [], radio: [] } };
  },
};
