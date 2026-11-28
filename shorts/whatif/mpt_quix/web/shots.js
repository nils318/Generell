// Material clips for MoneyPrinterTurbo: 3D keyboard world (from EP09) with the 2D Quix drawn on top.
// No subtitles, no title, no badge: MoneyPrinterTurbo adds German voice + subtitles itself.
window.EPISODE = {
  badge: '', title: ['', ''], noSubsCues: [], followText: '',
  build() {
    buildWorld(); W3.quix.group.visible = false;
    T.intro = -10;                                  // hides the hook title
    const CAM = {
      wide:  [[0.6, 5.6, 12.5], [0.6, 1.6, -1.2], 34],
      fj:    [[0.125, 4.4, 4.4], [0.125, 0.3, 0.0], 40],
      hands: [[0.15, 6.2, 4.4], [0.15, 0.3, -0.4], 40],
      screen:[[0.9, 3.9, 3.4], [0.9, 3.0, -4.2], 42],
      pad:   [[3.8, 2.5, 2.6], [3.8, 0.3, 0.0], 36],
      med:   [[-0.6, 2.9, 8.8], [-0.4, 1.2, 1.0], 34],
    };
    const l3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
    const cam = (a, b, k) => { const A = CAM[a], B = CAM[b || a], e = ease.io(clamp(k || 0)); Q3.look(l3(A[0], B[0], e), l3(A[1], B[1], e), lerp(A[2], B[2], e)); };
    const base = (t, o = {}) => {
      resetKeys(); for (const k of ['F', 'J']) W3.bumps[k].scale.setScalar(Math.max(0.001, o.bumps ?? 1));
      for (const b of Object.values(W3.bumps)) { const m = b.userData.mesh.material; m.emissive.setHex(0xFFD43B); m.emissiveIntensity = o.glow || 0; }
      placeHands(o.shift || 0, o.hands || 0); setScreen(o.screen ?? '', o.bad);
    };
    const Q = (t, o) => quix(t, Object.assign({ x: 230, y: 1720, s: 0.95, expr: 'cool', pose: 'idle', look: [0.6, -0.4] }, o));
    const clip = (i, draw) => ({ a: i * 5, b: i * 5 + 5, name: 'c' + i, noSubs: true, noBadge: true, flash: false, draw: t => draw(t, (t - i * 5) / 5) });
    const fox = 'the quick brown fox\njumps over the lazy dog';
    const shots = [
      clip(0, (t, k) => { const s = rhythm(fox, 0.2, 0.09); base(t, { hands: 1, screen: typeSeq(t, s, 0) }); typeSeq(t, s, 0); cam('wide', 'med', k * 0.6); Q3.render(ctx); Q(t, { pose: 'point', expr: 'cool' }); }),
      clip(1, (t, k) => { base(t, { glow: 0.6 + 0.4 * Math.sin(t * 9) }); glowKey(W3.keys.F, 0.5); glowKey(W3.keys.J, 0.5); cam('fj'); Q3.render(ctx); Q(t, { x: 850, pose: 'point', expr: 'curious', look: [-0.7, -0.5] }); }),
      clip(2, (t, k) => { base(t, { hands: 1, glow: 0.7 }); [...'ASDFJKL;'].forEach((c, i) => glowKey(keyOf(c), seg(t, 10.3 + i * 0.25, 10.6 + i * 0.25))); cam('hands'); Q3.render(ctx); Q(t, { pose: 'think', expr: 'happy' }); }),
      clip(3, (t, k) => { const s = rhythm('hello', 15.4, 0.2); base(t, { hands: 1, shift: 1, screen: typeSeq(t, s, 1), bad: t > 16.5 }); placeHands(1, 1); typeSeq(t, s, 1); cam('screen', 'wide', k * 0.3); Q3.render(ctx); Q(t, { pose: t > 16.6 ? 'shrug' : 'idle', expr: t > 16.6 ? 'shock' : 'curious', sweat: t > 16.6 ? 1 : 0 }); }),
      clip(4, (t, k) => { base(t); glowKey(W3.pad[5], 1); const m = W3.bumps[5].userData.mesh.material; m.emissive.setHex(0xFFD43B); m.emissiveIntensity = 0.6 + 0.4 * Math.sin(t * 9); cam('wide', 'pad', k * 1.5); Q3.render(ctx); Q(t, { x: 850, pose: 'point', expr: 'cool', look: [-0.7, -0.5] }); }),
      clip(5, (t, k) => { const p = ease.in(seg(t, 26, 27)); base(t, { bumps: 1 - p, glow: 1 - p }); cam('fj'); Q3.render(ctx);
        const r = Q(t, { pose: 'cheer', expr: 'smug', glow: 1 - seg(t, 26.6, 27.2) });
        for (const b of ['F', 'J']) { const [x, y] = Q3.project(W3.bumps[b]); beam(r.tip[0], r.tip[1], x, y, t, 1 - seg(t, 26.6, 26.9)); if (p > 0 && p < 1) sparkle(ctx, x, y, 50 * Math.sin(p * Math.PI), 1); }
        stamp('GELÖSCHT', 540, 560, t, 26.3, 31); }),
      clip(6, (t, k) => { const s = rhythm('schnell tippen\nohne hinsehen', 30.2, 0.1); base(t, { hands: 1, screen: typeSeq(t, s, 0) }); typeSeq(t, s, 0); cam('med', 'wide', k); Q3.render(ctx); Q(t, { pose: 'thumb', expr: 'happy' }); }),
    ];
    return { shots, sfx: [], music: { drops: [], radio: [] } };
  },
};
