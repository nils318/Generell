// EP02 — What if car exhaust wasn't filtered? (Quix deletes the catalytic converter)
window.EPISODE = {
  badge: '#2',
  title: ['WHAT IF CAR EXHAUST', "WASN'T FILTERED?"],
  noSubsCues: [],
  followText: 'FOLLOW FOR EP. 03',
  build() {
    const L = C;
    Object.assign(T, {
      reveal: L('reveal').s - 0.15, globe: WF('delete', 'from') - 0.1, mistake: L('mistake').s - 0.12,
      job: L('job').s - 0.12, metals: L('metals').s - 0.12, hc: WF('metals', 'honeycomb') - 0.12,
      world: L('world').s - 0.12, smog: L('smog').s - 0.1, smogB: WF('smog', 'a') - 0.1,
      la: L('la').s - 0.12, paper: WF('la', '1943') - 0.1, acid: L('acid').s - 0.12,
      fix: L('fix').s - 0.12, y1975: WF('fix', '1975') - 0.05, co2: L('co2').s - 0.12,
    });
    const CAR = { x: 700, y: GROUND, s: 0.9 };
    const idle = t => ({ ...CAR, bounce: 2 * Math.sin(t * 40) });
    const xq = { x: 112, y: XGROUND, s: 0.55 };
    const convUnder = [CAR.x + 75 * CAR.s, GROUND - 43 * CAR.s];

    const chip = (s, x, y, a, col, dot) => {
      if (a <= 0) return;
      ctx.save(); ctx.translate(x, y); ctx.scale(a, a);
      ctx.font = '50px Lilita'; const w = ctx.measureText(s).width + (dot ? 110 : 60);
      pill(ctx, 0, 0, w, 92, '#fff', INK, 8);
      if (dot) { ctx.fillStyle = dot; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(-w / 2 + 50, 0, 22, 0, 7); ctx.fill(); ctx.stroke(); }
      txt(ctx, s, dot ? 25 : 0, 4, { size: 50, color: INK, shadow: false });
      ctx.restore();
    };
    const screen = fn => { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); fn(); ctx.restore(); };
    const bigLabel = (s, x, y, ax, ay, a) => {
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha *= clamp(a);
      ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.setLineDash([2, 14]);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ax, ay); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#FFD43B'; ctx.beginPath(); ctx.arc(ax, ay, 12, 0, 7); ctx.fill();
      const sc = ease.back(clamp(a * 1.2)); ctx.translate(x, y); ctx.scale(sc, sc);
      ctx.font = '54px Bungee'; const tw = ctx.measureText(s).width;
      pill(ctx, 0, 0, tw + 70, 96, '#FFD43B', INK, 8);
      txt(ctx, s, 0, 4, { size: 54, font: 'Bungee', color: INK, shadow: false });
      ctx.restore();
    };
    const umbrella = (x, y, t, sizzle) => {
      ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round';
      ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -250); ctx.stroke();
      ctx.fillStyle = '#FF6B2C'; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(-200, -230);
      for (let i = 0; i < 4; i++) ctx.quadraticCurveTo(-200 + i * 100 + 50, -270, -100 + i * 100, -230);
      ctx.bezierCurveTo(160, -380, -160, -380, -200, -230); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#3A3F55';
      for (const [hx, hy, r] of [[-90, -290, 14 * sizzle], [40, -310, 18 * sizzle], [110, -260, 10 * sizzle]]) if (r > 1) { ctx.beginPath(); ctx.arc(hx, hy, r, 0, 7); ctx.fill(); }
      if (sizzle > 0.1) for (let i = 0; i < 3; i++) puff(ctx, -90 + i * 100, -330 - ((t * 60 + i * 30) % 60), 22, 'rgba(220,255,140,0.8)', 0.6 * sizzle, i, t);
      ctx.restore();
    };

    const shots = [
      { a: 0, b: T.reveal, name: 'hook',
        cam: t => { const k = ease.io(seg(t, 0, T.reveal)); return { z: lerp(1.0, 1.12, k), x: lerp(540, 600, k), y: lerp(960, 1080, k) }; },
        draw: t => {
          const k = ease.io(seg(t, 0.9, 1.5)), bx = WF('hook', 'box');
          drawStreet(ctx, { smog: 0, car: idle(t), exhaust: 0.05, quix: () =>
            quix(t, { x: 215, y: GROUND, s: 0.85, expr: t < 1 ? 'cool' : 'curious', pose: QUIX.mixPose('idle', 'point', k), look: [0.9 * k, 0.5 * k], lean: 0.06 * k, boing: boing(t, 1.1, 0.25) }) }, t);
          const h = fadeIO(t, bx - 0.1, T.reveal + 1, 0.15);
          if (h > 0) {
            ctx.save(); ctx.globalAlpha = h; ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 9; ctx.setLineDash([22, 14]); ctx.lineDashOffset = -t * 60;
            ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.ellipse(convUnder[0], convUnder[1], 110 + 6 * Math.sin(t * 6), 46, 0, 0, 7); ctx.stroke(); ctx.restore();
          }
        } },
      { a: T.reveal, b: T.intro, name: 'reveal', flash: false,
        draw: t => {
          const sx = lerp(-60, 1140, ease.io(seg(t, T.reveal, T.reveal + 0.6)));
          if (sx < 1140) drawStreet(ctx, { smog: 0, car: idle(t), exhaust: 0.05, quix: () => quix(t, { x: 215, y: GROUND, s: 0.85, expr: 'curious', pose: 'point', look: [0.9, 0.5], lean: 0.06 }) }, t);
          ctx.save(); ctx.beginPath(); ctx.rect(0, 0, sx, H); ctx.clip();
          const cw = WF('reveal', 'converter');
          drawXrayCar(ctx, { conv: 1, glow: fadeIO(t, cw - 0.3, T.intro + 2, 0.2) * (0.7 + 0.3 * Math.sin(t * 12)), flow: 0.6 }, t);
          bigLabel('CATALYTIC CONVERTER', 540, 640, CONV_SCREEN[0], CONV_SCREEN[1] - 30, pop(t, cw - 0.1, 0.4));
          quix(t, { ...xq, expr: 'cool', pose: 'point', glow: 0.4, look: [0.8, 0.2] });
          ctx.restore();
          if (sx < 1140) { ctx.save(); ctx.fillStyle = '#BFF6FF'; ctx.shadowColor = XR.cyan; ctx.shadowBlur = 50; ctx.fillRect(sx - 6, 0, 12, H); ctx.restore(); }
        } },
      'INTRO',
      { a: T.del, b: T.globe, name: 'delete',
        cam: t => ({ z: 1.05, x: 560, y: 1000, shake: 14 * (1 - seg(t, T.del, T.del + 0.6)) }),
        draw: t => {
          const p = ease.in(seg(t, T.del + 0.15, T.del + 0.9));
          drawXrayCar(ctx, { conv: t < T.del + 0.15 ? 1 : 0, flow: 0.6 }, t);
          if (t >= T.del + 0.15) convDissolve(ctx, p, t);
          const r = quix(t, { ...xq, expr: 'smug', pose: 'cheer', glow: 1 - seg(t, T.del + 0.5, T.del + 1.0), look: [0.8, 0.1] });
          beam(r.tip[0], r.tip[1], CONV_SCREEN[0], CONV_SCREEN[1], t, 1 - seg(t, T.del + 0.5, T.del + 0.7));
          stamp('DELETED', 560, 520, t, T.del + 0.35, T.globe + 0.3);
        },
        post: t => glitch(1 - seg(t, T.del + 0.05, T.del + 0.7), Math.floor(t * 30)) },
      { a: T.globe, b: T.mistake, name: 'globe',
        cam: t => ({ z: lerp(0.9, 1.0, ease.out(seg(t, T.globe, T.globe + 0.6))), x: 540, y: 960 }),
        draw: t => {
          const z = seg(t, WF('delete', 'every') - 0.1, WF('delete', 'earth') + 0.4);
          drawGlobe(ctx, t, ease.io(z), lerp(1.4e9, 0, ease.in(z)));
          stamp('DELETED', 540, 900, t, WF('delete', 'earth') + 0.2, T.mistake + 0.3, '#FF3B5C', 110, -0.12);
        } },
      { a: T.mistake, b: T.job, name: 'mistake',
        cam: t => ({ z: lerp(1.18, 1.08, ease.out(seg(t, T.mistake, T.job))), x: 480, y: 1100, shake: 6 * (1 - seg(t, T.mistake, T.mistake + 0.6)) }),
        draw: t => {
          const ng = WF('mistake', 'not'), dirty = ease.out(seg(t, T.mistake, T.mistake + 0.5));
          drawStreet(ctx, { smog: 0.12 * dirty, car: { ...idle(t), bounce: 4 * Math.sin(t * 30) }, exhaust: dirty, quix: () =>
            quix(t, { x: 215, y: GROUND, s: 0.85, expr: t < ng - 0.1 ? 'shock' : 'worried', pose: t < ng ? 'shrug' : 'cough', sweat: seg(t, ng, ng + 0.2),
              morph: ease.out(seg(t, ng - 0.15, ng + 0.05)), glow: 0.6 * seg(t, ng - 0.15, ng), look: [0.8, 0.2], lean: t > ng ? Math.sin(t * 22) * 0.04 : 0, boing: boing(t, ng - 0.1, 0.4) }) }, t);
        } },
      { a: T.job, b: T.metals, name: 'job',
        cam: t => ({ z: lerp(1.1, 1.3, ease.io(seg(t, T.job, T.metals))), x: 600, y: 1000 }),
        draw: t => {
          const cl = WF('job', 'cleans');
          drawXrayCar(ctx, { conv: 1, glow: fadeIO(t, cl - 0.1, T.metals + 1, 0.2) * (0.6 + 0.4 * Math.sin(t * 10)), flow: 1 }, t);
          quix(t, { ...xq, expr: 'curious', pose: 'think', look: [0.8, 0.3] });
          screen(() => {
            pill(ctx, 230, 330, 260, 70, '#fff', INK, 6);
            txt(ctx, '◀ BEFORE', 230, 334, { size: 38, color: INK, shadow: false });
            const g = C('gases').words;
            chip('CO · CARBON MONOXIDE', 540, 470, pop(t, g[0].s - 0.1, 0.35), '#FF5A5A', '#FF5A5A');
            chip('NOx · NITROGEN OXIDES', 540, 590, pop(t, g[2].s - 0.1, 0.35), '#FF9A3D', '#FF9A3D');
            chip('HC · UNBURNED FUEL', 540, 710, pop(t, g[4].s - 0.1, 0.35), '#8C8C99', '#8C8C99');
          });
        } },
      { a: T.metals, b: T.world, name: 'metals', flash: false,
        cam: t => t < T.hc ? { z: lerp(1.3, 5, ease.in(seg(t, T.metals, T.hc))), x: lerp(600, CONV_SCREEN[0], ease.io(seg(t, T.metals, T.hc))), y: lerp(1000, CONV_SCREEN[1], ease.io(seg(t, T.metals, T.hc))) }
                                 : { z: lerp(1.15, 1.0, ease.out(seg(t, T.hc, T.hc + 0.6))), x: 540, y: 960 },
        draw: t => {
          if (t < T.hc) { drawXrayCar(ctx, { conv: 1, glow: 0.8, flow: 1 }, t); return; }
          const m = C('metals').words.filter(w => /platinum|palladium|rhodium/i.test(w.w));
          drawHoneycomb(ctx, t, m.map(w => pop(t, w.s - 0.1, 0.4)));
          txt(ctx, 'INSIDE THE CONVERTER', 540, 360, { size: 54, font: 'Bungee', color: '#FFD43B', stroke: 12, alpha: pop(t, T.hc, 0.4) });
        } },
      { a: T.world, b: T.smog, name: 'world',
        cam: t => ({ z: lerp(1.12, 1.0, ease.out(seg(t, T.world, T.smog))), x: 540, y: 1000 }),
        draw: t => {
          const k = ease.io(seg(t, T.world, T.smog + 0.5));
          drawHighway(ctx, t, 0.1 + 0.5 * k, 1);
          const ba = pop(t, WF('world', 'billion') - 0.1, 0.4);
          if (ba > 0) {
            ctx.save(); ctx.translate(540, 560); ctx.scale(ba, ba); ctx.rotate(-0.04);
            pill(ctx, 0, 0, 820, 160, '#1A1033', '#FFD43B', 8);
            txt(ctx, '1,000,000,000+', 0, -18, { size: 84, font: 'Bungee', color: '#FFD43B', shadow: false });
            txt(ctx, 'CARS', 0, 50, { size: 42, color: '#fff', shadow: false });
            ctx.restore();
          }
        } },
      { a: T.smog, b: T.smogB, name: 'smogA',
        draw: t => {
          const sl = WF('smog', 'sunlight'), sm = WF('smog', 'smog');
          drawStreet(ctx, { smog: lerp(0.5, 0.95, ease.io(seg(t, sm - 0.2, T.smogB))), sunRays: fadeIO(t, sl - 0.1, T.smogB + 1, 0.2), car: idle(t), exhaust: 1, roadSpeed: 0 }, t);
          const parts = [['NOx', '#FF9A3D', T.smog + 0.05], ['+', null, T.smog + 0.15], ['HC', '#8C8C99', T.smog + 0.2], ['+', null, sl - 0.15], ['☀', '#FFD43B', sl - 0.1], ['=', null, sm - 0.2], ['SMOG', '#7A5A3A', sm - 0.1]];
          let x = 90;
          parts.forEach(([s, col, t0]) => {
            const a = pop(t, t0, 0.35), w = s.length > 3 ? 210 : s.length === 3 ? 165 : s === '+' || s === '=' ? 60 : 130;
            if (a > 0) {
              if (col) { ctx.save(); ctx.translate(x + w / 2, 620); ctx.scale(a, a); pill(ctx, 0, 0, w, 110, col, INK, 8); txt(ctx, s, 0, 6, { size: s === '☀' ? 70 : 58, font: s === '☀' ? 'Lilita' : 'Bungee', color: s === 'SMOG' ? '#FFE9C8' : INK, shadow: false }); ctx.restore(); }
              else txt(ctx, s, x + w / 2, 620, { size: 80, font: 'Bungee', color: '#fff', stroke: 12, alpha: a });
            }
            x += w + 14;
          });
        } },
      { a: T.smogB, b: T.la, name: 'smogB',
        cam: t => ({ z: lerp(1.25, 1.4, ease.io(seg(t, T.smogB, T.la))), x: 400, y: 1100 }),
        draw: t => {
          const st = WF('smog', 'stings'), lu = WF('smog', 'lungs');
          drawStreet(ctx, { smog: 0.95, car: idle(t), exhaust: 0.45, quix: () =>
            quix(t, { x: 215, y: GROUND, s: 0.85, expr: t < st ? 'worried' : 'disgust', pose: t > lu - 0.2 ? 'cough' : 'idle', tears: seg(t, st - 0.1, st + 0.3),
              lean: t > lu - 0.2 ? Math.sin(t * 24) * 0.05 : 0, look: [0, 0] }) }, t);
        } },
      { a: T.la, b: T.acid, name: 'la', noBadge: true,
        draw: t => {
          if (t < T.paper) {
            const k = seg(t, T.la, T.paper);
            drawStreet(ctx, { smog: 0.95, car: idle(t), exhaust: 1, quix: () => quix(t, { x: 215, y: GROUND, s: 0.85, expr: 'cool', pose: 'idle' }) }, t);
            ctx.save(); ctx.globalCompositeOperation = 'color'; ctx.fillStyle = '#3050A0'; ctx.globalAlpha = 0.6; ctx.fillRect(0, 0, W, H); ctx.restore();
            ctx.fillStyle = 'rgba(5,10,30,0.45)'; ctx.fillRect(0, 0, W, H);
            glitch(0.5, Math.floor(t * 30));
            txt(ctx, '◀◀ REWIND', 60, 250, { size: 60, font: 'Bungee', align: 'left', color: '#fff', stroke: 12 });
            txt(ctx, String(Math.round(lerp(2026, 1943, ease.in(k)))), 540, 860, { size: 240, font: 'Bungee', color: '#fff', stroke: 26, glow: '#5CE1FF', glowBlur: 40 });
            return;
          }
          ctx.drawImage(getParch(), 0, 0);
          const k = ease.out(seg(t, T.paper, T.paper + 0.6));
          newspaper(ctx, 540, 900, lerp(0.1, 0.95, k), lerp(Math.PI * 5, -0.05, k), t);
          const qa = ease.out(seg(t, WF('la', 'los') - 0.1, WF('la', 'los') + 0.3));
          if (qa > 0) quix(t, { x: 880, y: lerp(1750, 1440, qa), s: 0.58, hat: 'fedora', expr: t > WF('la', 'gas') - 0.1 ? 'shock' : 'curious', pose: 'idle', look: [-0.6, -0.3] });
          ctx.save(); const vg = ctx.createRadialGradient(540, 960, 600, 540, 960, 1250); vg.addColorStop(0, 'rgba(60,35,10,0)'); vg.addColorStop(1, 'rgba(60,35,10,0.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); ctx.restore();
        } },
      { a: T.acid, b: T.fix, name: 'acid',
        draw: t => {
          const ac = WF('acid', 'acid'), sick = ease.io(seg(t, T.acid, T.fix));
          drawForest(ctx, t, sick, 1);
          const r = quix(t, { x: 230, y: GROUND + 30, s: 0.8, expr: sick > 0.4 ? 'worried' : 'curious', pose: 'umbrella', look: [0.3, -0.6], sweat: sick > 0.6 ? 1 : 0 });
          umbrella(230 + 120 * 0.8, GROUND + 30 - 330 * 0.8, t, seg(t, ac - 0.4, ac + 0.6));
          const la = pop(t, ac - 0.1, 0.4);
          if (la > 0) { ctx.save(); ctx.translate(640, 520); ctx.scale(la, la); ctx.rotate(-0.04); pill(ctx, 0, 0, 560, 140, '#C8F26A', INK, 10); txt(ctx, 'ACID RAIN', 0, 6, { size: 82, font: 'Bungee', color: INK, shadow: false }); ctx.restore(); }
          txt(ctx, 'NOx + WATER = NITRIC ACID', 640, 680, { size: 50, font: 'Lilita', color: '#fff', stroke: 10, alpha: pop(t, WF('acid', 'nitrogen') - 0.1, 0.4) });
        } },
      { a: T.fix, b: T.co2, name: 'fix',
        draw: t => {
          const inst = ease.back(seg(t, T.y1975 + 0.15, T.y1975 + 0.55)), clear = ease.io(seg(t, T.y1975 + 0.5, T.y1975 + 1.8));
          drawStreet(ctx, { smog: 0.95 * (1 - clear), sunRays: clear, car: { ...idle(t), conv: inst }, exhaust: 1 - clear, quix: () =>
            quix(t, { x: 215, y: GROUND, s: 0.85, expr: clear > 0.3 ? 'happy' : 'cool', pose: clear > 0.3 ? 'cheer' : 'point', look: [0.6, 0.3], glow: clear * 0.6, boing: boing(t, T.y1975 + 0.5, 0.3) }) }, t);
          if (inst > 0 && inst < 1.2) sparkle(ctx, convUnder[0], convUnder[1], 70 * Math.sin(clamp(inst) * Math.PI), 1);
          stamp('1975', 540, 560, t, T.y1975, T.co2 + 0.3, '#2BD47D', 150, -0.1);
          chip('USA · MOST NEW CARS', 540, 760, pop(t, WF('fix', 'most') - 0.1, 0.4), null, '#2BD47D');
          if (clear > 0) for (let i = 0; i < 12; i++) { const ph = (t * 0.7 + hash(i)) % 1; sparkle(ctx, hash(i + 5) * W, 300 + hash(i + 7) * 900 - ph * 80, 22 * Math.sin(ph * Math.PI) + 4, clear); }
        } },
      { a: T.co2, b: T.outro, name: 'co2',
        cam: t => ({ z: 1.12, x: 495, y: 1060 }),
        draw: t => {
          const th = WF('co2', 'though'), df = WF('co2', 'different');
          drawStreet(ctx, { smog: 0, car: idle(t), exhaust: 0.1, co2: 1, quix: () =>
            quix(t, { x: 215, y: GROUND, s: 0.85, expr: t < th ? 'curious' : 'worried', pose: t < th ? 'idle' : 'shrug', look: [0.7, 0.2], boing: boing(t, th - 0.1, 0.25) }) }, t);
          screen(() => {
            chip('CO2 STILL COMES OUT', 540, 560, pop(t, WF('co2', 'co2') - 0.1, 0.4), null, '#3B3552');
            const sa = pop(t, df - 0.1, 0.4);
            if (sa > 0) { ctx.save(); ctx.translate(760, 720); ctx.rotate(0.08); ctx.scale(sa, sa); pill(ctx, 0, 0, 470, 96, '#FF3B5C', INK, 8); txt(ctx, 'ANOTHER EPISODE…', 0, 5, { size: 46, font: 'Bungee', color: '#fff', shadow: false }); ctx.restore(); }
          });
        } },
      'OUTRO',
    ];

    const g = C('gases').words, m = C('metals').words.filter(w => /platinum|palladium|rhodium/i.test(w.w));
    const sfx = [
      ['engine', 0.0], ['pop', WF('hook', 'box') - 0.1], ['whoosh_scan', T.reveal], ['ding', WF('reveal', 'converter') - 0.1],
      ['crumble', T.del + 0.2], ['stamp', T.del + 0.35], ['whoosh', T.globe], ['counter', WF('delete', 'every') - 0.1], ['stamp', WF('delete', 'earth') + 0.2],
      ['engine_dirty', T.mistake], ['boing', WF('mistake', 'not') - 0.15], ['cough', WF('mistake', 'not') + 0.4],
      ['whoosh', T.job], ['ding', WF('job', 'cleans') - 0.1], ['pop', g[0].s - 0.1], ['pop', g[2].s - 0.1], ['pop', g[4].s - 0.1],
      ['whoosh_down', T.metals], ['ding', T.hc], ['clink', m[0].s - 0.1], ['clink', m[1].s - 0.1], ['clink', m[2].s - 0.1],
      ['traffic', T.world], ['pop', WF('world', 'billion') - 0.1],
      ['sparkle', WF('smog', 'sunlight') - 0.1], ['hit', WF('smog', 'smog') - 0.1], ['cough', WF('smog', 'lungs') - 0.1, 1.1],
      ['rewind', T.la], ['paper', T.paper], ['siren', WF('la', 'gas') - 0.3, 0.7],
      ['rain', T.acid], ['thunder', T.acid + 0.1], ['sizzle', WF('acid', 'acid') - 0.3],
      ['stamp', T.y1975], ['rebuild', T.y1975 + 0.15], ['sparkle', T.y1975 + 0.6],
      ['boing', WF('co2', 'though') - 0.1], ['pop', WF('co2', 'co2') - 0.1], ['pop', WF('co2', 'different') - 0.1],
    ];
    return { shots, sfx, music: { drops: [[T.mistake + 0.35, C('mistake').e + 0.15, 0.9]], radio: [[T.paper, T.acid]] } };
  },
};
