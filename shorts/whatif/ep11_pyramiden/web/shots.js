// EP11 (DE) — Wie die Ägypter die Pyramiden wirklich gebaut haben. 3D comic Egypt, 2D Quix as pharaoh/historian narrator.
window.EPISODE = {
  series: 'QUIX', badge: 'GESCHICHTE',
  title: ['KEINE SKLAVEN?!', 'DIE WAHRHEIT ÜBER DIE PYRAMIDEN'],
  noSubsCues: [],
  followText: 'FOLG MIR FÜR MEHR GESCHICHTE',
  build() {
    const L = C;
    buildEgypt();
    Object.assign(T, {
      hook2: L('hook2').s - 0.12, scale: L('scale').s - 0.12, record: L('record').s - 0.12, roast1: L('roast1').s - 0.3,
      workers: L('workers').s - 0.12, tombs: L('tombs').s - 0.12, gangs: L('gangs').s - 0.12, roast2: L('roast2').s - 0.25,
      move: L('move').s - 0.12, sled: L('sled').s - 0.12, roast3: L('roast3').s - 0.3, white: L('white').s - 0.12, cleo: L('cleo').s - 0.12,
    });
    T.intro = L('intro').s - 0.12;
    const CAM = {
      hook:  [[3.0, 3.2, 20], [0.5, 3.4, 0], 42],
      town:  [[-21, 6.5, 27], [-25, 2.2, 2], 40],
      wide:  [[0, 10, 58], [0, 15, -70], 40],
      low:   [[9, 1.6, -22], [0, 21, -70], 52],
      tombs: [[-2, 5.5, -16], [-4, 2, -40], 44],
      sled:  [[7.0, 4.2, 19], [1.6, 1.4, 5.5], 40],
      water: [[5.5, 3.0, 14.5], [1.6, 0.8, 6.8], 40],
      sky:   [[0, 6, 40], [0, 28, -100], 46],
    };
    const l3 = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
    const cam = (a, b = a, k = 0, shake = 0) => {
      const A = CAM[a], B = CAM[b], e = ease.io(clamp(k)), p = l3(A[0], B[0], e);
      if (shake) { p[0] += shake * (hash(Math.floor(T._t * 60)) - 0.5); p[1] += shake * (hash(Math.floor(T._t * 60) + 9) - 0.5); }
      Q3.look(p, l3(A[1], B[1], e), lerp(A[2], B[2], e));
    };
    const frame = (t, o = {}) => {
      T._t = t; setCasing(o.white || 0); crewUpdate(t, o);
      EG.townFolk.forEach((p, i) => p.update(t, o.townCheer ? 'cheer' : 'idle', i * 1.7));
      EG.clouds.forEach((c, i) => { c.position.x += 0; c.position.x = [-60, 30, 85, -10][i] + 3 * Math.sin(t * 0.1 + i); });
    };
    const Q2 = (t, o) => quix(t, Object.assign({ x: 200, y: 1430, s: 0.85, expr: 'cool', pose: 'idle', outfit: 'historian', look: [0.6, -0.4] }, o));
    const BIG = { x: 540, y: 1440, s: 1.4 };
    const dim = a => { ctx.fillStyle = `rgba(60,25,5,${a})`; ctx.fillRect(0, 0, W, H); };
    const chipAt = (s, x, y, a, dot, size = 46) => chip(ctx, s, x, y, a, dot, size);
    const punchline = (s, t, t0, col = '#FF3B5C', y = 360, size = 64) => {
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
    const papyrus = (s, x, y, a, rot) => {      // gang-name banner
      if (a <= 0) return;
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(a, a);
      ctx.fillStyle = '#F3DFAE'; ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.beginPath(); ctx.roundRect(-420, -95, 840, 190, 18); ctx.fill(); ctx.stroke();
      for (const sx of [-1, 1]) { ctx.fillStyle = '#D9B877'; ctx.beginPath(); ctx.roundRect(sx * 420 - 26, -110, 52, 220, 26); ctx.fill(); ctx.stroke(); }
      ctx.fillStyle = '#C0392B'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-340 + i * 170, -70, 6, 0, 7); ctx.fill(); }
      const lines = s.split('\n'); lines.forEach((l, i) => txt(ctx, l, 0, -20 + i * 62 - (lines.length - 1) * 20, { size: 54, font: 'Bungee', color: '#7A2E12', shadow: false }));
      ctx.restore();
    };
    const phone = (x, y, a, t) => {           // dying phone for the roast
      if (a <= 0) return;
      ctx.save(); ctx.translate(x, y); ctx.scale(a, a); ctx.rotate(0.1 * Math.sin(t * 6));
      ctx.fillStyle = '#1A1033'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-90, -170, 180, 340, 28); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#2B2F4A'; ctx.beginPath(); ctx.roundRect(-76, -150, 152, 300, 18); ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.strokeRect(-40, -30, 70, 40); ctx.fillStyle = '#fff'; ctx.fillRect(30, -18, 8, 16);
      if (Math.floor(t * 4) % 2) { ctx.fillStyle = '#FF3B5C'; ctx.fillRect(-36, -26, 12, 32); }
      txt(ctx, '1%', 0, 60, { size: 46, font: 'Bungee', color: '#FF3B5C', shadow: false });
      ctx.restore();
    };
    const gradeStamp = (x, y, a) => {
      if (a <= 0) return;
      ctx.save(); ctx.translate(x, y); ctx.rotate(-0.18); ctx.scale(a, a);
      ctx.strokeStyle = '#E0284A'; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, 0, 110, 0, 7); ctx.stroke();
      txt(ctx, '6', 0, 40, { size: 150, font: 'Bungee', color: '#E0284A', shadow: false });
      txt(ctx, 'PHYSIK', 0, -72, { size: 30, font: 'Bungee', color: '#E0284A', shadow: false });
      ctx.restore();
    };
    const forceBar = (x, y, k, a) => {        // pulling force 100% -> 50%
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y);
      pill(ctx, 0, 0, 820, 210, '#2A1608', '#FFD43B', 8);
      txt(ctx, 'ZUGKRAFT', -250, -50, { size: 40, font: 'Bungee', color: '#fff', shadow: false });
      ctx.fillStyle = '#3A2A1A'; ctx.beginPath(); ctx.roundRect(-360, 0, 720, 60, 30); ctx.fill();
      const v = lerp(1, 0.5, ease.out(k)); ctx.fillStyle = v > 0.6 ? '#FF6B2C' : '#2BD47D'; ctx.beginPath(); ctx.roundRect(-360, 0, 720 * v, 60, 30); ctx.fill();
      txt(ctx, `${Math.round(v * 100)} %`, 250, -50, { size: 52, font: 'Bungee', color: v > 0.6 ? '#FF6B2C' : '#2BD47D', shadow: false });
      ctx.restore();
    };
    const timeline = (t, t0) => {              // Cleopatra closer to the Moon landing than to the pyramid
      const a = ease.out(seg(t, t0, t0 + 0.6)); if (a <= 0) return;
      const y = 820, x0 = 110, x1 = 970, yr = v => lerp(x0, x1, (v + 2600) / (2000 + 2600));
      ctx.save(); ctx.globalAlpha = a;
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(lerp(x0, x1, a), y); ctx.stroke();
      const marks = [[-2560, 'PYRAMIDE', '2560 v. Chr.', '#FFD43B', t0 + 0.2], [-30, 'KLEOPATRA', '30 v. Chr.', '#FF5A9A', WF('cleo', 'kleopatra') - 0.1], [1969, 'MONDLANDUNG', '1969', '#5CE1FF', WF('cleo', 'mondlandung') - 0.1]];
      for (const [v, lab, sub, col, tt] of marks) {
        const p = pop(t, tt, 0.35); if (p <= 0) continue; const x = yr(v);
        ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(x, y, 26 * p, 0, 7); ctx.fill(); ctx.stroke();
        txt(ctx, lab, x, y - 70, { size: 38 * p, font: 'Bungee', color: col, stroke: 9 }); txt(ctx, sub, x, y + 70, { size: 32 * p, font: 'Lilita', color: '#fff', stroke: 8 });
      }
      const ar = (xa, xb, lab, col, tt, up) => {
        const p = ease.out(seg(t, tt, tt + 0.5)); if (p <= 0) return;
        const yy = up ? y - 150 : y + 150; ctx.strokeStyle = col; ctx.lineWidth = 8; ctx.setLineDash([18, 12]);
        ctx.beginPath(); ctx.moveTo(xa, y + (up ? -40 : 40)); ctx.quadraticCurveTo((xa + xb) / 2, yy + (up ? -60 : 60), lerp(xa, xb, p), y + (up ? -40 : 40)); ctx.stroke(); ctx.setLineDash([]);
        txt(ctx, lab, (xa + xb) / 2, yy + (up ? -70 : 90), { size: 44, font: 'Bungee', color: col, stroke: 10, alpha: p });
      };
      ar(yr(-2560), yr(-30), '≈ 2.500 JAHRE', '#FFD43B', WF('cleo', 'pyramide') - 0.3, true);
      ar(yr(-30), yr(1969), '≈ 2.000 JAHRE', '#5CE1FF', WF('cleo', 'mondlandung') + 0.2, false);
      ctx.restore();
    };

    const shots = [
      { a: 0, b: T.hook2, name: 'hook',
        draw: t => {
          const nt = WF('hook', 'nicht'), sk = WF('hook', 'sklaven'), myth = t < nt + 0.45;
          frame(t, { myth });
          cam('hook', 'hook', 0, t < 0.5 ? 0.25 * (1 - t / 0.5) : 0);
          Q3.render(ctx);
          if (myth) { ctx.save(); ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
          if (t > nt && t < nt + 0.9) { const [x, y] = Q3.project(EG.overseer.head); sparkle(ctx, x, y + 120, 140 * Math.sin(seg(t, nt, nt + 0.9) * Math.PI), 1); }
          stamp('MYTHOS', 540, 700, t, nt - 0.05, nt + 1.2, '#E0284A', 140, -0.14);
          Q2(t, { x: 860, outfit: 'pharaoh', expr: t < 0.9 ? 'shock' : 'smug', pose: t < 0.9 ? 'shrug' : 'point', look: [-0.7, -0.3], boing: boing(t, 0.1, 0.5) });
          punchline('KEINE SKLAVEN!', t, sk - 0.1, '#E0284A', 1060, 70);
        },
        post: t => glitch(1 - seg(t, 0, 0.35), Math.floor(t * 30)) },
      { a: T.hook2, b: T.intro, name: 'hook2',
        draw: t => {
          frame(t, { townCheer: t > WF('hook2', 'bier') - 0.2 });
          cam('town', 'town'); Q3.render(ctx);
          Q2(t, { outfit: 'pharaoh', item: 'jug', pose: 'cheer', expr: 'happy', look: [0.4, -0.6] });
          chipAt('BEZAHLT MIT BROT', 600, 330, pop(t, WF('hook2', 'brot') - 0.1, 0.35), '#D9944A', 50);
          chipAt('+ BIER 🍺'.replace(' 🍺', ''), 600, 440, pop(t, WF('hook2', 'bier') - 0.1, 0.35), '#FFD43B', 56);
        } },
      { a: T.intro, b: T.scale, name: 'intro',
        draw: t => {
          const ph = WF('intro', 'pharao'), hi = WF('intro', 'historiker');
          frame(t); cam('wide', 'wide'); Q3.render(ctx); dim(0.35);
          const outfit = t < ph - 0.15 ? 'historian' : 'pharaoh';
          const r = Q2(t, { ...BIG, outfit, item: outfit === 'historian' ? 'pointer' : 'jug', expr: t < hi ? 'cool' : 'smug', pose: t < ph - 0.15 ? 'hips' : 'cheer', look: [0, -0.2], boing: boing(t, T.intro + 0.05, 0.3) });
          if (Math.abs(t - (ph - 0.15)) < 0.35) sparkle(ctx, 540, 1100, 260 * (1 - Math.abs(t - (ph - 0.15)) / 0.35), 1);
          const tagA = pop(t, WF('intro', 'quix') - 0.1, 0.45);
          if (tagA > 0) {
            ctx.save(); ctx.translate(540, 380); ctx.scale(tagA, tagA); ctx.rotate(-0.04);
            txt(ctx, 'QUIX', 0, 0, { size: 210, font: 'Bungee', color: '#FFD43B', stroke: 26, glow: '#FFD43B', glowBlur: 40 });
            pill(ctx, 0, 150, 560, 74, '#fff', INK, 7); txt(ctx, 'ERKLÄRT GESCHICHTE', 0, 154, { size: 40, font: 'Lilita', color: INK, shadow: false });
            ctx.restore();
          }
        } },
      { a: T.scale, b: T.record, name: 'scale',
        draw: t => {
          const m = WF('scale', 'millionen'), to = WF('scale', 'tonnen');
          frame(t); cam('low', 'low'); Q3.render(ctx);
          const k = ease.out(seg(t, m - 0.6, m + 0.6));
          counter('STEINBLÖCKE', Math.round(2300000 * k).toLocaleString('de-DE'), 540, 360, pop(t, m - 0.7, 0.35));
          counter('GEWICHT', '≈ 6 MIO. T', 540, 590, pop(t, to - 0.1, 0.35), '#FF8A3D');
          Q2(t, { item: 'pointer', pose: 'point', expr: 'cool', look: [0.6, -0.8] });
        } },
      { a: T.record, b: T.roast1, name: 'record',
        draw: t => {
          const hs = WF('record', 'höchste');
          frame(t); cam('wide', 'low', seg(t, T.record, T.roast1) * 0.4); Q3.render(ctx);
          counter('BAUZEIT', 'ÜBER 20 JAHRE', 540, 360, pop(t, WF('record', 'jahren') - 0.1, 0.35), '#FFD43B');
          counter('HÖCHSTES BAUWERK DER WELT', '3.800 JAHRE', 540, 590, pop(t, hs - 0.3, 0.35), '#5CE1FF');
          Q2(t, { item: 'pointer', pose: 'thumb', expr: 'happy' });
        } },
      { a: T.roast1, b: T.workers, name: 'roast1',
        draw: t => {
          const hy = WF('roast1', 'handy');
          frame(t); cam('wide', 'wide'); Q3.render(ctx); dim(0.4);
          Q2(t, { ...BIG, outfit: 'historian', expr: t < hy ? 'cool' : 'smug', pose: t < hy ? 'idle' : 'hips', boing: boing(t, hy - 0.1, 0.4) });
          phone(820, 820, pop(t, hy - 0.1, 0.4), t);
          punchline('DEIN HANDY:\n2 JAHRE', t, WF('roast1', 'zwei') - 0.1, '#E0284A', 360);
        } },
      { a: T.workers, b: T.tombs, name: 'workers',
        draw: t => {
          const st = WF('workers', 'stadt');
          frame(t, { townCheer: false }); cam('sled', 'town', seg(t, st - 0.8, st + 0.6)); Q3.render(ctx);
          chipAt('TEAMS IM WECHSEL', 540, 330, pop(t, WF('workers', 'teams') - 0.1, 0.35), '#5CE1FF', 50);
          chipAt('EIGENE ARBEITERSTADT', 540, 440, pop(t, st - 0.1, 0.35), '#FFD43B', 50);
          Q2(t, { item: 'pointer', pose: 'point', expr: 'curious' });
        } },
      { a: T.tombs, b: T.gangs, name: 'tombs',
        draw: t => {
          frame(t); cam('tombs', 'tombs'); Q3.render(ctx);
          chipAt('EHRENGRÄBER', 540, 330, pop(t, WF('tombs', 'ehre') - 0.1, 0.35), '#2BD47D', 54);
          chipAt('BROT + BIER FÜRS JENSEITS', 540, 440, pop(t, WF('tombs', 'jenseits') - 0.3, 0.35), '#D9944A', 44);
          Q2(t, { item: 'pointer', pose: 'think', expr: 'happy' });
        } },
      { a: T.gangs, b: T.roast2, name: 'gangs',
        draw: t => {
          const fr = WF('gangs', 'freunde'), tr = WF('gangs2', 'trunkenbolde'), drunk = t > tr - 0.2;
          frame(t, { townCheer: drunk }); cam('town', 'hook', seg(t, T.gangs, T.roast2) * 0.3); Q3.render(ctx); dim(0.2);
          papyrus('DIE FREUNDE\nDES CHEOPS', 540, 400, pop(t, fr - 0.1, 0.4), -0.04);
          papyrus('DIE TRUNKENBOLDE\nDES MYKERINOS', 540, 700, pop(t, tr - 0.1, 0.4), 0.05 + 0.03 * Math.sin(t * 4));
          Q2(t, { outfit: 'pharaoh', item: drunk ? 'jug' : null, pose: drunk ? 'cheer' : 'point', expr: drunk ? 'happy' : 'cool', lean: drunk ? 0.08 * Math.sin(t * 3) : 0 });
        } },
      { a: T.roast2, b: T.move, name: 'roast2',
        draw: t => {
          const wg = WF('roast2', 'whatsappgruppe');
          frame(t, { townCheer: true }); cam('town', 'town'); Q3.render(ctx); dim(0.4);
          Q2(t, { ...BIG, outfit: 'pharaoh', item: 'jug', expr: 'smug', pose: 'cheer', lean: 0.06 * Math.sin(t * 3), boing: boing(t, wg - 0.1, 0.4) });
          punchline('KLINGT WIE DEINE\nWHATSAPP-GRUPPE', t, wg - 0.15, '#2BD47D', 380, 58);
        } },
      { a: T.move, b: T.sled, name: 'move',
        draw: t => {
          frame(t); cam('sled', 'sled'); Q3.render(ctx);
          const [bx, by] = Q3.project(EG.block);
          bigLabel(ctx, '≈ 2,5 TONNEN', 540, 360, bx, by - 60, pop(t, WF('move', 'block') - 0.1, 0.4), 58);
          chipAt('= 2 AUTOS', 540, 520, pop(t, WF('move', 'autos') - 0.1, 0.35), '#FF8A3D', 54);
          Q2(t, { item: 'pointer', pose: 'shrug', expr: 'curious' });
        } },
      { a: T.sled, b: T.roast3, name: 'sled',
        draw: t => {
          const wa = WF('sled', 'wasser'), ha = WF('water', 'halbiert'), wet = seg(t, wa - 0.3, wa + 0.4);
          frame(t, { wet, move: 0.6 * seg(t, ha, T.roast3) , fast: t > ha }); cam('sled', 'water', seg(t, wa - 0.5, wa + 0.5)); Q3.render(ctx);
          chipAt('HOLZSCHLITTEN', 540, 330, pop(t, WF('sled', 'holzschlitten') - 0.1, 0.35), '#C8743A', 50);
          if (t > wa - 0.2) chipAt('+ WASSER', 540, 440, pop(t, wa - 0.1, 0.35), '#5CE1FF', 54);
          forceBar(540, 1120, seg(t, ha - 0.2, ha + 0.6), seg(t, WF('water', 'nasser') - 0.3, WF('water', 'nasser')));
          chipAt('PHYSIK-STUDIE 2014', 540, 560, pop(t, WF('water', '2014') - 0.2, 0.35), '#FFFFFF', 42);
        } },
      { a: T.roast3, b: T.white, name: 'roast3',
        draw: t => {
          const kl = WF('roast3', 'klausur');
          frame(t, { wet: 1 }); cam('water', 'water'); Q3.render(ctx); dim(0.4);
          Q2(t, { ...BIG, outfit: 'historian', item: 'pointer', expr: 'smug', pose: 'point', boing: boing(t, kl - 0.1, 0.4) });
          gradeStamp(830, 760, pop(t, kl - 0.1, 0.35));
          punchline('BESSER ALS DEINE\nPHYSIK-KLAUSUR', t, WF('roast3', 'physik') - 0.1, '#7B5CFF', 380, 56);
        } },
      { a: T.white, b: T.cleo, name: 'white',
        draw: t => {
          const ws = WF('white', 'weißem'), k = ease.io(seg(t, ws - 0.3, ws + 1.0));
          frame(t, { white: k }); cam('wide', 'low', seg(t, T.white, T.cleo) * 0.5); Q3.render(ctx);
          if (k > 0.3) { const [x, y] = Q3.project(EG.great); for (let i = 0; i < 8; i++) sparkle(ctx, x + (hash(i) - 0.5) * 500, y + (hash(i + 4) - 0.5) * 500, 30 + 30 * Math.sin(t * 6 + i), k); }
          chipAt('NICHT SANDFARBEN', 540, 330, pop(t, WF('white', 'sandfarben') - 0.1, 0.35), '#E0284A', 48);
          chipAt('WEISSER KALKSTEIN ✦', 540, 440, pop(t, ws - 0.1, 0.35), '#FFFFFF', 50);
          Q2(t, { item: 'pointer', pose: 'point', expr: 'happy' });
        } },
      { a: T.cleo, b: T.outro, name: 'cleo',
        draw: t => {
          const ha = WF('cleo', 'hammer');
          frame(t, { white: 1 }); cam('sky', 'sky'); Q3.render(ctx); dim(0.45);
          punchline('DER HAMMER:', t, ha - 0.15, '#E0284A', 330);
          timeline(t, ha + 0.2);
          Q2(t, { outfit: 'pharaoh', expr: t < WF('cleo', 'mondlandung') ? 'curious' : 'shock', pose: t < WF('cleo', 'mondlandung') ? 'think' : 'shrug', sweat: t > WF('cleo', 'mondlandung') ? 1 : 0 });
        } },
      { a: T.outro, b: T.end + 1, name: 'outro',
        draw: t => {
          frame(t, { white: 1 }); cam('wide', 'wide'); Q3.render(ctx); dim(0.35);
          Q2(t, { ...BIG, outfit: 'historian', item: 'pointer', expr: t < WF('outro', 'geheimnis') ? 'cool' : 'curious', pose: t < WF('outro', 'geheimnis') ? 'hips' : 'shrug', glow: 0.5 + 0.5 * Math.sin(t * 4), boing: boing(t, T.outro + 0.05, 0.3) });
          const ea = pop(t, C('outro').e + 0.05, 0.45);
          if (ea > 0) {
            ctx.save(); ctx.translate(540, 250); ctx.scale(ea, ea); pill(ctx, 0, 0, 700, 150, '#FFD43B', INK, 10);
            txt(ctx, 'KOMMENTAR ↓', 0, 8, { size: 84, font: 'Bungee', color: INK, shadow: false }); ctx.restore();
            txt(ctx, EP.followText, 540, 385, { size: 50, font: 'Lilita', color: '#fff', stroke: 12, alpha: ea });
          }
        } },
    ];

    const sfx = [
      ['scratch', 0.05], ['hit', 0.15], ['stamp', WF('hook', 'nicht') - 0.05], ['sparkle', WF('hook', 'nicht') + 0.1], ['hit', WF('hook', 'sklaven') - 0.1],
      ['pop', WF('hook2', 'brot') - 0.1], ['ding', WF('hook2', 'bier') - 0.1],
      ['sparkle', WF('intro', 'pharao') - 0.2],
      ['counter', WF('scale', 'millionen') - 0.6], ['stamp', WF('scale', 'tonnen') - 0.05],
      ['pop', WF('record', 'jahren') - 0.1], ['ding', WF('record', 'höchste') - 0.3],
      ['error', WF('roast1', 'handy') - 0.05], ['rimshot', C('roast1').e + 0.05],
      ['pop', WF('workers', 'teams') - 0.1], ['pop', WF('workers', 'stadt') - 0.1],
      ['ding', WF('tombs', 'ehre') - 0.1], ['pop', WF('tombs', 'jenseits') - 0.3],
      ['paper', WF('gangs', 'freunde') - 0.2], ['paper', WF('gangs2', 'trunkenbolde') - 0.2], ['boing', WF('gangs2', 'mykerinos') - 0.1],
      ['scratch', L('roast2').s - 0.3], ['rimshot', C('roast2').e + 0.05],
      ['pop', WF('move', 'block') - 0.1], ['hit', WF('move', 'autos') - 0.1],
      ['scrape', T.sled + 0.2], ['water', WF('sled', 'wasser') - 0.2], ['sparkle', WF('water', 'halbiert') - 0.1],
      ['scratch', L('roast3').s - 0.35], ['stamp', WF('roast3', 'klausur') - 0.05], ['rimshot', C('roast3').e + 0.05],
      ['sparkle', WF('white', 'weißem') - 0.1], ['chime', WF('white', 'geglänzt') - 0.2],
      ['hit_big', WF('cleo', 'hammer') - 0.1], ['pop', WF('cleo', 'kleopatra') - 0.1], ['whoosh_up', WF('cleo', 'mondlandung') - 0.2],
    ];
    return { shots, sfx, music: { drops: [], radio: [] } };
  },
};
