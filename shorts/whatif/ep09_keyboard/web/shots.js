// EP09 — What if keyboards had no bumps on F and J? (first 3D episode)
window.EPISODE = {
  badge: '#9',
  title: ['WHAT IF KEYBOARDS', 'HAD NO BUMPS?'],
  noSubsCues: [],
  followText: 'FOLLOW FOR EP. 10',
  build() {
    const L = C;
    buildWorld();
    const q3 = W3.quix;
    Object.assign(T, {
      hook: L('hook').s - 0.12, reveal: L('reveal').s - 0.12, roasta: L('roasta').s - 0.25, blind: L('blind').s - 0.12,
      gib: L('gibberish').s - 0.12, roastb: L('roastb').s - 0.3, why: L('why').s - 0.12, home: L('home').s - 0.12,
      fast: L('fast').s - 0.12, roastc: L('roastc').s - 0.25, numpad: L('numpad').s - 0.12, roastd: L('roastd').s - 0.2,
      last: L('last').s - 0.12,
    });
    // camera presets [pos, target, fov]
    const CAM = {
      wide:  [[0.6, 5.6, 12.5], [0.6, 1.6, -1.2], 34],
      med:   [[-0.6, 2.9, 8.8], [-0.4, 1.2, 1.0], 34],
      fj:    [[0.125, 4.4, 4.4], [0.125, 0.3, 0.0], 40],
      hands: [[0.15, 6.2, 4.4], [0.15, 0.3, -0.4], 40],
      screen:[[0.9, 3.9, 3.4], [0.9, 3.0, -4.2], 42],
      pad:   [[3.8, 2.5, 2.6], [3.8, 0.3, 0.0], 36],
      close: [[-1.0, 2.3, 9.0], [-1.2, 1.6, 2.3], 32],
      hero:  [[-1.2, 2.0, 10.2], [-1.2, 1.75, 2.3], 30],
      del:   [[-0.7, 3.8, 9.8], [-0.5, 0.9, 0.8], 36],
    };
    const lerp3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
    const cam = (a, b = a, k = 0, shake = 0) => {
      const A = CAM[a], B = CAM[b], e = ease.io(clamp(k));
      const p = lerp3(A[0], B[0], e); if (shake) { p[0] += shake * (hash(Math.floor(T._t * 60)) - 0.5); p[1] += shake * (hash(Math.floor(T._t * 60) + 9) - 0.5); }
      Q3.look(p, lerp3(A[1], B[1], e), lerp(A[2], B[2], e));
    };
    const QPOS = [-1.2, 0, 2.4];
    const qx = (t, o) => (q3.group.visible = true, q3.update(t, Object.assign({ pos: QPOS, rotY: 0.25, s: 0.95, expr: 'cool', pose: 'idle', look: [0.3, 0] }, o)));
    const bumpsTo = s => { for (const k of ['F', 'J']) W3.bumps[k].scale.setScalar(Math.max(0.001, s)); };
    const bumpGlow = a => { for (const b of Object.values(W3.bumps)) { const m = b.userData.mesh.material; m.emissive = m.emissive || new THREE.Color(); m.emissive.setHex(0xFFD43B); m.emissiveIntensity = a; } };
    const frame = (t, o = {}) => {        // shared per-frame reset
      T._t = t; q3.group.visible = false; resetKeys(); bumpGlow(0); bumpsTo(o.bumps ?? 1);
      placeHands(0, o.hands || 0); setScreen(o.screen ?? '', o.bad, o.cursor ?? true);
    };
    const tipXY = () => Q3.project(q3.tip);
    const chipAt = (s, x, y, a, dot, size = 46) => chip(ctx, s, x, y, a, dot, size);
    const punchline = (s, t, t0, col = '#FF3B5C', y = 360) => {
      const a = pop(t, t0, 0.35); if (a <= 0) return;
      ctx.save(); ctx.translate(540, y); ctx.rotate(-0.05 + 0.02 * Math.sin(t * 9)); ctx.scale(a, a);
      ctx.font = '64px Bungee'; const lines = s.split('\n'); const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 90, h = 96 * lines.length + 40;
      ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 36); ctx.fill(); ctx.stroke();
      lines.forEach((l, i) => txt(ctx, l, 0, -h / 2 + 70 + i * 96, { size: 64, font: 'Bungee', color: '#fff', stroke: 10 }));
      ctx.restore();
    };
    const helloSeq = t0 => rhythm('hello', t0, 0.17);

    const shots = [
      { a: 0, b: T.hook, name: 'preview',
        draw: t => {
          const wtf = L('previewb').s;
          const seq = helloSeq(0.5), typed = typeSeq(t, seq, 1);
          frame(t, { hands: 1, screen: typed, bad: t > 1.4 });
          placeHands(1, 1); typeSeq(t, seq, 1);
          if (t < wtf - 0.2) cam('screen', 'wide', seg(t, 0.2, 1.6));
          else cam('close', 'close', 0, 0.12 * (1 - seg(t, wtf, wtf + 0.6)));
          qx(t, { expr: t < 1.6 ? 'curious' : t < wtf - 0.2 ? 'worried' : 'shock', pose: t < wtf - 0.2 ? 'idle' : 'shrug', look: [0.4, -0.5], hop: t > wtf ? 0.15 * Math.max(0, Math.sin((t - wtf) * 9)) : 0 });
          Q3.render(ctx);
          chipAt('PREVIEW', 540, 760, pop(t, 0.2, 0.3), '#FFD43B', 48);
        },
        post: t => glitch(seg(t, T.hook - 0.35, T.hook), Math.floor(t * 30)) },
      { a: T.hook, b: T.reveal, name: 'hook',
        draw: t => {
          const fe = WF('hook', 'feel');
          frame(t); bumpGlow(fadeIO(t, WF('hook', 'bumps') - 0.1, T.reveal + 2, 0.15) * (0.6 + 0.4 * Math.sin(t * 10)));
          cam('med', 'fj', seg(t, fe - 0.3, fe + 0.6));
          if (seg(t, fe - 0.3, fe + 0.6) < 0.4) qx(t, { expr: 'curious', pose: 'point', poseK: 0, look: [0.8, 0.3], rotY: 0.6 });
          Q3.render(ctx);
        } },
      { a: T.reveal, b: T.roasta, name: 'reveal',
        draw: t => {
          frame(t); bumpGlow(0.6 + 0.4 * Math.sin(t * 10)); glowKey(W3.keys.F, 0.5); glowKey(W3.keys.J, 0.5);
          cam('fj', 'fj');
          qx(t, {});
          Q3.render(ctx);
          const [fx, fy] = Q3.project(W3.bumps.F), [jx, jy] = Q3.project(W3.bumps.J);
          const a = pop(t, WF('reveal', 'ridges') - 0.1, 0.4);
          bigLabel(ctx, 'F', fx - 60, fy - 330, fx, fy - 10, a, 70); bigLabel(ctx, 'J', jx + 60, jy - 330, jx, jy - 10, a, 70);
        } },
      { a: T.roasta, b: T.intro, name: 'roasta',
        draw: t => {
          const g = WF('roasta', 'genius');
          frame(t); cam('close', 'close');
          qx(t, { expr: t < g - 0.3 ? 'cool' : 'smug', pose: t < g - 0.3 ? 'idle' : 'hips', look: [0, 0], rotY: 0.15, boing: boing(t, g - 0.1, 0.4) });
          Q3.render(ctx);
          punchline('NOT A FACTORY\nMISTAKE, GENIUS', t, g - 0.15, '#FF3B5C', 640);
        } },
      { a: T.intro, b: T.del, name: 'intro',
        draw: t => {
          const ch = seg(t, WF('delete', 'today') - 0.1, T.del), im = WF('delete', "i'm");
          frame(t); cam('hero', 'hero', 0, 0.06 * ch);
          qx(t, { expr: ch > 0.05 ? 'smug' : 'cool', pose: t < im ? 'hips' : 'cheer', glow: ch, look: [0, ch > 0.3 ? -0.6 : 0], rotY: 0, boing: boing(t, T.intro + 0.05, 0.3) });
          Q3.render(ctx);
          ctx.fillStyle = `rgba(60,20,140,${0.25})`; ctx.fillRect(0, 0, W, H);
          const tagA = pop(t, WF('intro', 'quix') - 0.1, 0.45);
          if (tagA > 0) {
            ctx.save(); ctx.translate(540, 380); ctx.scale(tagA, tagA); ctx.rotate(-0.04);
            txt(ctx, 'QUIX', 0, 0, { size: 210, font: 'Bungee', color: '#FFD43B', stroke: 26, glow: '#FFD43B', glowBlur: 40 });
            pill(ctx, 0, 150, 520, 74, '#fff', INK, 7); txt(ctx, 'DELETES ONE TINY THING', 0, 154, { size: 40, font: 'Lilita', color: INK, shadow: false });
            ctx.restore();
          }
          if (ch > 0) { const [tx, ty] = tipXY(); sparkle(ctx, tx, ty, 60 + 80 * ch, ch); }
        } },
      { a: T.del, b: T.blind, name: 'delete',
        draw: t => {
          const p = ease.in(seg(t, T.del + 0.15, T.del + 0.9));
          frame(t, { bumps: t < T.del + 0.15 ? 1 : 1 - p }); bumpGlow(1 - p);
          cam('del', 'del', 0, 0.15 * (1 - seg(t, T.del, T.del + 0.6)));
          qx(t, { expr: 'smug', pose: 'cheer', glow: 1 - seg(t, T.del + 0.5, T.del + 1), look: [0.6, 0.3], rotY: 0.55 });
          Q3.render(ctx);
          const [tx, ty] = tipXY(), F = Q3.project(W3.bumps.F), J = Q3.project(W3.bumps.J), ba = 1 - seg(t, T.del + 0.5, T.del + 0.7);
          beam(tx, ty, F[0], F[1], t, ba); beam(tx, ty, J[0], J[1], t, ba);
          if (p > 0 && p < 1) for (const [x, y] of [F, J]) sparkle(ctx, x, y, 50 * Math.sin(p * Math.PI), 1);
          stamp('DELETED', 540, 520, t, T.del + 0.35, T.blind + 0.2);
        },
        post: t => glitch(1 - seg(t, T.del + 0.05, T.del + 0.6), Math.floor(t * 30)) },
      { a: T.blind, b: T.gib, name: 'blind',
        draw: t => {
          const r = WF('blind', 'right'), sh = ease.io(seg(t, r - 0.5, r + 0.2));
          frame(t, { bumps: 0, hands: 1 });
          placeHands(sh, ease.out(seg(t, T.blind, T.blind + 0.5)), 0.4 * (1 - ease.out(seg(t, T.blind + 0.3, T.blind + 0.9))));
          if (sh > 0.5) for (const c of 'SDFGKL;') glowKey(keyOf(c), 0.0);
          cam('hands', 'hands');
          Q3.render(ctx);
          chipAt('NO BUMPS = NO HOME', 540, 330, pop(t, WF('blind', 'looking') - 0.1, 0.35), '#FF3B5C', 48);
          if (sh > 0.6) chipAt('ONE KEY TOO FAR →', 540, 1250, pop(t, r - 0.1, 0.35), '#FFD43B', 48);
        } },
      { a: T.gib, b: T.roastb, name: 'gibberish',
        draw: t => {
          const wr = WF('gibberish', 'wrote'), seq = helloSeq(wr + 0.1), typed = typeSeq(t, seq, 1);
          frame(t, { bumps: 0, hands: 1, screen: t < wr ? 'hello' : typed, bad: t >= wr + 0.4, cursor: true });
          if (t < wr) SCR.key = '', setScreen('hello', false, true, 'what you meant');
          placeHands(1, 1); typeSeq(t, seq, 1);
          cam('screen', 'wide', seg(t, wr - 0.2, wr + 0.6) * 0.35);
          Q3.render(ctx);
        } },
      { a: T.roastb, b: T.why, name: 'roastb',
        draw: t => {
          const pg = WF('roastb', 'pigeon');
          frame(t, { bumps: 0, screen: 'jr;;p', bad: true });
          cam('close', 'close');
          qx(t, { expr: t < pg - 0.2 ? 'smug' : 'happy', pose: 'point', peck: t > pg - 0.3, look: [0.5, 0.5], rotY: 0.5, lean: t > pg - 0.3 ? 0.08 * Math.sin(t * 14) : 0 });
          Q3.render(ctx);
          punchline('CONFUSED\nPIGEON MODE', t, pg - 0.15, '#FF6B2C');
        } },
      { a: T.why, b: T.home, name: 'why',
        draw: t => {
          frame(t, { hands: 1 });
          const lf = WF('why', 'left'), rt = WF('why', 'right');
          glowKey(W3.keys.F, seg(t, lf - 0.1, lf + 0.3)); glowKey(W3.keys.J, seg(t, rt - 0.1, rt + 0.3)); bumpGlow(0.8);
          placeHands(0, ease.out(seg(t, T.why + 0.3, T.why + 0.9)));
          cam('hands', 'hands');
          Q3.render(ctx);
          chipAt('HOME ROW', 540, 330, pop(t, WF('why', 'home') - 0.1, 0.35), '#2BD47D', 54);
          const F = Q3.project(W3.keys.F.g), J = Q3.project(W3.keys.J.g);
          chipAt('LEFT INDEX', F[0] - 60, F[1] + 330, pop(t, lf - 0.1, 0.35), '#5CE1FF', 40);
          chipAt('RIGHT INDEX', J[0] + 60, J[1] + 330, pop(t, rt - 0.1, 0.35), '#FF6B2C', 40);
        } },
      { a: T.home, b: T.fast, name: 'home',
        draw: t => {
          frame(t, { hands: 1 }); bumpGlow(0.6);
          const tt0 = WF('home', 'every');
          [...'ASDFJKL;'].forEach((c, i) => glowKey(keyOf(c), seg(t, tt0 + i * 0.08, tt0 + i * 0.08 + 0.3)));
          cam('hands', 'wide', seg(t, WF('home', 'touch') - 0.6, WF('home', 'touch') + 0.4) * 0.4);
          Q3.render(ctx);
          punchline('TOUCH TYPING', t, WF('home', 'touch') - 0.1, '#2BD47D', 330);
        } },
      { a: T.fast, b: T.roastc, name: 'fast',
        draw: t => {
          const msg = 'the quick brown fox\njumps over the lazy dog';
          const seq = rhythm(msg, T.fast + 0.2, 0.06), typed = typeSeq(t, seq, 0);
          frame(t, { hands: 1, screen: typed });
          placeHands(0, 1); typeSeq(t, seq, 0);
          cam('wide', 'screen', seg(t, T.fast, T.roastc) * 0.5);
          Q3.render(ctx);
          chipAt('EYES UP, NOT DOWN', 540, 1250, pop(t, WF('fast', 'looking') - 0.1, 0.35), '#5CE1FF', 46);
        } },
      { a: T.roastc, b: T.numpad, name: 'roastc',
        draw: t => {
          const hu = WF('roastc', 'hunting'), mo = WF('roastc', 'money');
          frame(t); glowKey(W3.keys.Q, fadeIO(t, WF('roastc', 'q') - 0.1, T.numpad, 0.2));
          cam('close', 'med', seg(t, hu, mo) * 0.6);
          qx(t, { expr: t < mo - 0.2 ? 'curious' : 'angry', pose: t < mo - 0.2 ? 'think' : 'point', look: [Math.sin(t * 3) * 0.9, 0.5], rotY: 0.2 + 0.5 * Math.sin(t * 2.2) });
          Q3.render(ctx);
          punchline('WHERE IS Q?!', t, WF('roastc', 'q') - 0.1, '#7B5CFF', 330);
          chipAt('IT OWES YOU MONEY', 540, 1250, pop(t, mo - 0.15, 0.35), '#FFD43B', 46);
        } },
      { a: T.numpad, b: T.roastd, name: 'numpad',
        draw: t => {
          frame(t); const fv = WF('numpad', 'five');
          glowKey(W3.pad[5], seg(t, fv - 0.1, fv + 0.3)); bumpGlow(0); const m = W3.bumps[5].userData.mesh.material; m.emissiveIntensity = 0.9 * seg(t, WF('numpad', 'bump') - 0.1, WF('numpad', 'bump') + 0.3);
          cam('wide', 'pad', seg(t, T.numpad, fv + 0.2));
          Q3.render(ctx);
          const [x, y] = Q3.project(W3.bumps[5]);
          bigLabel(ctx, 'NUMPAD 5', 540, y - 380, x, y - 10, pop(t, fv - 0.1, 0.4), 60);
        } },
      { a: T.roastd, b: T.last, name: 'roastd',
        draw: t => {
          const d2 = L('roastd2').s, two = WF('roastd', 'two');
          frame(t); cam('close', 'close', 0);
          const disp = t > d2 - 0.2;
          qx(t, { expr: disp ? 'tired' : t < WF('roastd', 'mad') - 0.2 ? 'curious' : 'cool', pose: disp ? 'facepalm' : 'idle', look: [0, 0.2], rotY: 0.1, lean: disp ? -0.06 : 0 });
          Q3.render(ctx);
          chipAt('TWO-FINGER TYPING', 540, 330, pop(t, two - 0.1, 0.35), '#FFFFFF', 46);
          if (t < d2 - 0.2) chipAt("I'M NOT MAD…", 540, 440, pop(t, WF('roastd', 'mad') - 0.15, 0.35), '#5CE1FF', 46);
          punchline('JUST\nDISAPPOINTED', t, WF('roastd2', 'disappointed') - 0.15, '#3A3F55', 520);
        } },
      { a: T.last, b: T.outro, name: 'last',
        draw: t => {
          const k = ease.back(seg(t, T.last, T.last + 0.6));
          frame(t, { bumps: k, hands: 1 }); bumpGlow(0.5 + 0.5 * Math.sin(t * 8));
          placeHands(0, 1);
          cam('fj', 'wide', ease.io(seg(t, T.last + 0.8, T.outro)));
          Q3.render(ctx);
          if (k > 0 && k < 1) for (const b of ['F', 'J']) { const [x, y] = Q3.project(W3.bumps[b]); sparkle(ctx, x, y, 60 * Math.sin(k * Math.PI), 1); }
          chipAt('FEEL THEM. RIGHT NOW.', 540, 330, pop(t, WF('last', 'feel') - 0.1, 0.35), '#FFD43B', 50);
        } },
      { a: T.outro, b: T.end + 1, name: 'outro',
        draw: t => {
          const wh = WF('outro', 'what');
          frame(t); cam('hero', 'hero');
          qx(t, { expr: t < wh ? 'cool' : 'curious', pose: t < wh ? 'hips' : 'shrug', glow: 0.5 + 0.5 * Math.sin(t * 4), look: [0, -0.2], rotY: 0, boing: boing(t, T.outro + 0.05, 0.3) });
          Q3.render(ctx);
          ctx.fillStyle = 'rgba(60,20,140,0.2)'; ctx.fillRect(0, 0, W, H);
          const ea = pop(t, C('outro').e + 0.05, 0.45);
          if (ea > 0) {
            ctx.save(); ctx.translate(540, 250); ctx.scale(ea, ea); pill(ctx, 0, 0, 640, 150, '#FFD43B', INK, 10);
            txt(ctx, 'COMMENT ↓', 0, 8, { size: 92, font: 'Bungee', color: INK, shadow: false }); ctx.restore();
            txt(ctx, EP.followText, 540, 385, { size: 58, font: 'Lilita', color: '#fff', stroke: 12, alpha: ea });
          }
        } },
    ];

    const typ = (t0, n, gap) => Array.from({ length: n }, (_, i) => ['key', t0 + i * gap]);
    const sfx = [
      ...typ(0.5, 5, 0.17), ['error', 1.45], ['scratch', L('previewb').s - 0.1], ['hit', L('previewb').s + 0.05],
      ['pop', WF('hook', 'bumps') - 0.1], ['ding', WF('reveal', 'ridges') - 0.1],
      ['rimshot', C('roasta').e + 0.05],
      ['crumble', T.del + 0.2], ['stamp', T.del + 0.35],
      ['whoosh', WF('blind', 'right') - 0.4], ['error', WF('blind', 'right') + 0.15],
      ...typ(WF('gibberish', 'wrote') + 0.1, 5, 0.17), ['error', WF('gibberish', 'wrote') + 0.95],
      ['scratch', L('roastb').s - 0.35], ['rimshot', C('roastb').e + 0.05],
      ['ding', WF('why', 'left') - 0.1], ['ding', WF('why', 'right') - 0.1, 0.8],
      ['sparkle', WF('home', 'every') - 0.1], ['pop', WF('home', 'touch') - 0.1],
      ['typing', T.fast + 0.2], ['whoosh', T.fast],
      ['boing', WF('roastc', 'q') - 0.1], ['rimshot', C('roastc').e + 0.05],
      ['ding', WF('numpad', 'five') - 0.1], ['pop', WF('numpad', 'bump') - 0.1],
      ['scratch', L('roastd2').s - 0.3], ['rimshot', C('roastd2').e + 0.05],
      ['sparkle', T.last + 0.1], ['pop', WF('last', 'feel') - 0.1],
    ];
    return { shots, sfx, music: { drops: [], radio: [] } };
  },
};
