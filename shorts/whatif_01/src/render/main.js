// Timeline -> shots -> frame. Everything is a pure function of t, so any frame
// can be rendered independently (parallel workers, quick previews).
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
let TL, T, SHOTS, SUBS, SFX;

const C = n => TL.lines.find(l => l.cue === n);
const WF = (cue, w, nth = 0) => {
  const m = C(cue).words.filter(x => x.w.toLowerCase().replace(/[^a-z0-9']/g, '') === w.toLowerCase());
  if (!m[nth]) throw new Error(`word ${w} not in ${cue}`); return m[nth].s;
};
function mouthAt(t) { const f = t * TL.fps, i = Math.floor(f); return lerp(TL.mouth[i] || 0, TL.mouth[i + 1] || 0, f - i); }
const BLINKS = (() => { const r = rng(42), out = []; for (let t = 1.1; t < 80; t += 2.0 + r() * 2.2) out.push(t); return out; })();
function blinkAt(t) { for (const b of BLINKS) { const d = t - b; if (d > -0.07 && d < 0.07) return 1 - Math.abs(d) / 0.07; } return 0; }

function quix(t, o) {
  const m = o.talk === false ? 0 : mouthAt(t);
  const out = QUIX.drawQuix(ctx, Object.assign({
    t, mouth: m, blink: blinkAt(t), antAngle: 0.06 * Math.sin(t * 2.1) + (o.boing || 0),
    squash: 1 + m * 0.025,
  }, o, { y: o.y - m * 6 }));
  return out;
}

function beam(x0, y0, x1, y1, t, a, col = '#FFD43B') {
  if (a <= 0) return;
  const R = rng(Math.floor(t * 30) + 1), n = 14, pts = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n, j = (i === 0 || i === n) ? 0 : (R() - 0.5) * 46;
    pts.push([lerp(x0, x1, u) + j, lerp(y0, y1, u) + (R() - 0.5) * 30 * (i && i < n)]);
  }
  ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [lw, c, b] of [[46, col, 60], [22, '#FFF6C2', 30], [8, '#fff', 0]]) {
    ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.shadowColor = col; ctx.shadowBlur = b;
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.stroke();
  }
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x1, y1, 40 + 10 * Math.sin(t * 40), 0, 7); ctx.fill();
  ctx.restore();
}

function glitch(amt, seed) {
  if (amt <= 0) return;
  const R = rng(seed);
  for (let i = 0; i < 10; i++) {
    const y = R() * H, h = 20 + R() * 120, dx = (R() - 0.5) * 140 * amt;
    ctx.drawImage(cv, 0, y, W, h, dx, y, W, h);
  }
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.35 * amt;
  ctx.fillStyle = '#FF2E88'; ctx.fillRect(0, R() * H, W, 8);
  ctx.fillStyle = '#2EE6FF'; ctx.fillRect(0, R() * H, W, 14);
  ctx.restore();
}

function speedLines(a, t, vertical = true) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineCap = 'round';
  for (let i = 0; i < 26; i++) {
    const x = hash(i) * W, y = ((hash(i + 3) * H + t * 3000 * (0.6 + hash(i + 7))) % (H + 400)) - 200;
    ctx.lineWidth = 3 + hash(i + 1) * 6;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 200 + hash(i + 2) * 300); ctx.stroke();
  }
  ctx.restore();
}

// ----------------------------------------------------------------------------
function build() {
  const L = C;
  T = {
    reveal: L('reveal').s - 0.15, intro: L('intro').s - 0.12, del: WF('delete', 'deleting') - 0.05,
    mistake: L('mistake').s - 0.12, seal: L('seal').s - 0.12, sewer: L('sewer').s - 0.05,
    chain: L('chain').s - 0.12, gas: L('gas').s - 0.05, into: WF('gas', 'into') - 0.08,
    methane: L('methane').s - 0.1, flam: L('flammable').s - 0.1, hist: L('history').s - 0.12,
    y1775: WF('history', '1775') - 0.06, restore: L('restore').s - 0.12, clean: WF('restore', 'and') - 0.06,
    tip: L('tip').s - 0.12, outro: L('outro').s - 0.15, end: TL.duration,
  };
  const xq = { x: 175, y: XR.floor, s: 0.62 };

  SHOTS = [
    { a: 0, b: T.reveal, name: 'hook',
      cam: t => ({ z: lerp(1.0, 1.1, ease.io(seg(t, 0, T.reveal))), x: lerp(540, 600, ease.io(seg(t, 0, T.reveal))), y: lerp(960, 1000, ease.io(seg(t, 0, T.reveal))) }),
      draw: t => {
        const hw = WF('hook', 'water');
        drawBathroom(ctx, { water: 1, highlight: fadeIO(t, hw, T.reveal + 1, 0.15) }, t, () => {
          const k = ease.io(seg(t, 1.0, 1.6));
          quix(t, { x: BATH.quixX + 40 * k, y: BATH.quixY, s: 1, expr: t < 1.2 ? 'cool' : 'curious', pose: QUIX.mixPose('idle', 'point', k),
            look: [lerp(0, 0.9, k), lerp(0, 0.35, k)], lean: 0.08 * k, boing: boing(t, 1.3, 0.25) });
        });
      } },
    { a: T.reveal, b: T.intro, name: 'reveal', flash: false,
      cam: t => ({ z: 1.0 + 0.04 * ease.io(seg(t, T.reveal, T.intro)), x: 540, y: 960 }),
      draw: t => {
        const sx = lerp(-60, 1140, ease.io(seg(t, T.reveal, T.reveal + 0.6)));
        if (sx < 1140) drawBathroom(ctx, { water: 1 }, t, () => quix(t, { x: BATH.quixX + 40, y: BATH.quixY, s: 1, expr: 'curious', pose: 'point', look: [0.9, 0.35], lean: 0.08 }));
        ctx.save(); ctx.beginPath(); ctx.rect(0, 0, sx, H); ctx.clip();
        xrayBG(ctx, t); xrayToilet(ctx, { trap: 1, water: 1 }, t);
        const bw = WF('reveal', 'bend'), g = fadeIO(t, bw - 0.25, T.intro + 2, 0.2);
        if (g > 0) {
          ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = g * (0.55 + 0.25 * Math.sin(t * 12));
          ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = TUBE + 40; ctx.lineCap = 'round'; ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 50;
          const p = new Path2D(); p.moveTo(672, 1160); p.bezierCurveTo(680, 1220, 640, 1262, 590, 1258); p.bezierCurveTo(540, 1254, 530, 1180, 520, 1120); p.bezierCurveTo(512, 1070, 462, 1060, 452, 1120);
          ctx.stroke(p); ctx.restore();
        }
        label(ctx, 'THE TRAP', 830, 1240, 600, 1250, pop(t, bw - 0.1, 0.4));
        quix(t, { ...xq, expr: 'cool', pose: 'point', glow: 0.4, look: [0.8, 0.2] });
        ctx.restore();
        if (sx < 1140) {
          ctx.save(); ctx.fillStyle = '#BFF6FF'; ctx.shadowColor = XR.cyan; ctx.shadowBlur = 50;
          ctx.fillRect(sx - 6, 0, 12, H); ctx.globalAlpha = 0.25; ctx.fillRect(sx - 60, 0, 60, H); ctx.restore();
        }
      } },
    { a: T.intro, b: T.del, name: 'intro',
      cam: t => { const k = ease.in(seg(t, WF('delete', 'today'), T.del)); return { z: 1 + 0.22 * k, x: 540, y: lerp(980, 820, k), shake: 6 * k }; },
      draw: t => {
        heroBG(ctx, t);
        const ch = seg(t, WF('delete', 'today') - 0.1, T.del);
        // charging arcs
        const qx = 540, qy = 1500, s = 1.55;
        const tagA = pop(t, WF('intro', 'quix') - 0.1, 0.45);
        if (tagA > 0) {
          ctx.save(); ctx.translate(540, 420); ctx.scale(tagA, tagA); ctx.rotate(-0.04);
          txt(ctx, 'QUIX', 0, 0, { size: 210, font: 'Bungee', color: '#FFD43B', stroke: 26, glow: '#FFD43B', glowBlur: 40 });
          pill(ctx, 0, 150, 520, 74, '#fff', INK, 7);
          txt(ctx, 'DELETES ONE TINY THING', 0, 154, { size: 40, font: 'Lilita', color: INK, shadow: false });
          ctx.restore();
        }
        const pose = t < WF('delete', "i'm") ? 'hips' : QUIX.mixPose('hips', 'cheer', ease.out(seg(t, WF('delete', "i'm"), T.del)));
        const r = quix(t, { x: qx, y: qy, s, expr: ch > 0.05 ? 'smug' : 'cool', pose, glow: ch, look: ch > 0.3 ? [0, -0.6] : [0, 0], boing: boing(t, T.intro + 0.05, 0.3) });
        if (ch > 0) {
          const [tx, ty] = r.tip, R = rng(Math.floor(t * 30));
          ctx.save(); ctx.strokeStyle = '#FFF6C2'; ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 30; ctx.lineWidth = 6; ctx.globalAlpha = ch;
          for (let i = 0; i < 5; i++) {
            const a0 = R() * 6.28, rr = 60 + R() * 120 * ch;
            ctx.beginPath(); ctx.moveTo(tx, ty);
            for (let k = 1; k <= 4; k++) ctx.lineTo(tx + Math.cos(a0) * rr * k / 4 + (R() - 0.5) * 30, ty + Math.sin(a0) * rr * k / 4 + (R() - 0.5) * 30);
            ctx.stroke();
          }
          ctx.restore();
          sparkle(ctx, tx, ty, 60 + 80 * ch, ch);
        }
      } },
    { a: T.del, b: T.mistake, name: 'delete',
      cam: t => ({ z: 1.0 + 0.05 * ease.out(seg(t, T.del, T.mistake)), x: 540, y: 1000, shake: 14 * (1 - seg(t, T.del, T.del + 0.6)) }),
      draw: t => {
        const p = ease.in(seg(t, T.del + 0.15, T.del + 1.15));
        const straight = ease.io(seg(t, T.del + 0.9, T.del + 1.35));
        const water = 1 - ease.io(seg(t, T.del + 0.3, T.del + 1.5));
        xrayBG(ctx, t);
        if (t < T.del + 0.15) xrayToilet(ctx, { trap: 1, water: 1 }, t);
        else {
          xrayToilet(ctx, { trap: 0, hideTube: straight < 0.02, tubeClip: lerp(1150, 1520, straight), water }, t);
          trapDissolve(ctx, p, t);
        }
        const r = quix(t, { ...xq, expr: t < T.del + 1.0 ? 'smug' : 'cool', pose: 'cheer', glow: 1 - seg(t, T.del + 0.6, T.del + 1.2), look: [0.8, 0.1] });
        beam(r.tip[0], r.tip[1], 575, 1210, t, 1 - seg(t, T.del + 0.55, T.del + 0.75));
        const st = pop(t, T.del + 0.35, 0.3), sf = 1 - seg(t, T.mistake - 0.25, T.mistake);
        if (st > 0 && sf > 0) {
          ctx.save(); ctx.globalAlpha = sf; ctx.translate(560, 560); ctx.rotate(-0.12); ctx.scale(lerp(2.2, 1, st), lerp(2.2, 1, st));
          ctx.strokeStyle = '#FF3B5C'; ctx.lineWidth = 14; ctx.beginPath(); ctx.roundRect(-330, -95, 660, 190, 26); ctx.stroke();
          txt(ctx, 'DELETED', 0, 6, { size: 130, font: 'Bungee', color: '#FF3B5C', glow: '#FF3B5C', glowBlur: 30, shadow: false });
          ctx.restore();
        }
      },
      post: t => { glitch(1 - seg(t, T.del + 0.05, T.del + 0.7), Math.floor(t * 30)); } },
    { a: T.mistake, b: T.seal, name: 'mistake',
      cam: t => ({ z: lerp(1.15, 1.05, ease.out(seg(t, T.mistake, T.seal))), x: 560, y: 1050, shake: 9 * (1 - seg(t, T.mistake, T.mistake + 0.8)) }),
      draw: t => {
        const dr = seg(t, T.mistake, T.mistake + 1.0);
        drawBathroom(ctx, { water: 1 - ease.io(dr), drain: dr < 1 ? 1 : 0 }, t, () => {
          const mw = WF('mistake', 'mistake');
          quix(t, { x: BATH.quixX + 20, y: BATH.quixY, s: 1, expr: t < mw - 0.1 ? 'shock' : 'worried', pose: t < mw - 0.1 ? 'idle' : 'shrug',
            morph: ease.out(seg(t, mw - 0.15, mw + 0.05)), glow: 0.6 * seg(t, mw - 0.15, mw), sweat: seg(t, mw, mw + 0.2),
            look: t < WF('mistake', 'that') ? [0.9, 0.4] : [0, 0], boing: boing(t, mw - 0.1, 0.4) });
        });
      } },
    { a: T.seal, b: T.sewer, name: 'seal',
      cam: t => ({ z: lerp(1.05, 1.18, ease.io(seg(t, T.seal, T.sewer))), x: 560, y: 1120 }),
      draw: t => {
        xrayBG(ctx, t); xrayToilet(ctx, { trap: 1, water: 1 }, t);
        gasBubbles(ctx, t, 'blocked', 1);
        label(ctx, 'WATER SEAL', 790, 860, 560, 1100, pop(t, WF('seal', 'seal') - 0.15, 0.4), '#8FE9FF');
        ctx.save(); pill(ctx, 230, 560, 260, 70, '#fff', INK, 6);
        txt(ctx, '◀ BEFORE', 230, 564, { size: 38, font: 'Lilita', color: INK, shadow: false }); ctx.restore();
        quix(t, { ...xq, expr: 'curious', pose: 'think', look: [0.8, 0.4], morph: 0 });
      } },
    { a: T.sewer, b: T.chain, name: 'sewer', flash: false,
      draw: t => {
        const k = ease.io(seg(t, T.sewer + 0.05, WF('sewer', 'sewer') + 0.15));
        const camY = lerp(0, SEWER_Y - 900, k);
        drawUnderworld(ctx, camY, {}, t);
        speedLines(Math.sin(k * Math.PI) * 0.8, t);
      } },
    { a: T.chain, b: T.gas, name: 'chain', noSubs: true,
      draw: t => {
        drawUnderworld(ctx, SEWER_Y - 900, {}, t);
        ctx.fillStyle = 'rgba(8,4,24,0.72)'; ctx.fillRect(0, 0, W, H);
        const w = C('chain').words;
        const rows = [['NO BEND', w[0].s, 'bend'], ['NO WATER', w[2].s, 'drop'], ['NO SEAL', w[6].s, 'shield']];
        rows.forEach(([s, t0, ic], i) => {
          const a = pop(t, t0 - 0.05, 0.35), y = 560 + i * 330;
          if (a <= 0) return;
          const pulse = i === 1 ? 1 + 0.08 * Math.max(0, Math.sin(seg(t, w[4].s, w[5].e) * Math.PI)) : 1;
          ctx.save(); ctx.translate(540, y); ctx.scale(a * pulse, a * pulse);
          // icon
          ctx.save(); ctx.translate(-330, 0); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
          ctx.fillStyle = '#16123A'; ctx.beginPath(); ctx.arc(0, 0, 105, 0, 7); ctx.fill(); ctx.strokeStyle = XR.cyan; ctx.lineWidth = 8; ctx.stroke();
          if (ic === 'bend') { ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(40, -55); ctx.bezierCurveTo(50, 40, -10, 50, -20, 10); ctx.bezierCurveTo(-30, -30, -50, -20, -50, 0); ctx.lineTo(-50, 60); ctx.stroke(); }
          if (ic === 'drop') { ctx.fillStyle = '#47B4F0'; ctx.beginPath(); ctx.moveTo(0, -62); ctx.bezierCurveTo(40, -10, 52, 20, 0, 56); ctx.bezierCurveTo(-52, 20, -40, -10, 0, -62); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke(); }
          if (ic === 'shield') { ctx.fillStyle = '#2BD47D'; ctx.beginPath(); ctx.moveTo(0, -62); ctx.lineTo(52, -40); ctx.bezierCurveTo(50, 20, 30, 45, 0, 62); ctx.bezierCurveTo(-30, 45, -50, 20, -52, -40); ctx.closePath(); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke(); }
          ctx.restore();
          crossBadge(ctx, -255, 70, ease.back(seg(t, t0 + 0.2, t0 + 0.45)) * 0.75);
          txt(ctx, s, 90, 6, { size: 118, font: 'Bungee', color: i === 2 ? '#FF3B5C' : '#fff', stroke: 18 });
          ctx.restore();
          if (i < 2) { const aa = pop(t, rows[i + 1][1] - 0.15, 0.3); if (aa > 0) txt(ctx, '↓', 540, y + 165, { size: 90, color: '#FFD43B', alpha: aa, stroke: 12 }); }
        });
      } },
    { a: T.gas, b: T.into, name: 'gasrise', flash: false,
      draw: t => {
        const k = ease.io(seg(t, T.gas, T.into - 0.05));
        const camY = lerp(SEWER_Y - 900, 0, k);
        drawUnderworld(ctx, camY, { gas: 1, gasY: camY + 650 - 200 * k }, t);
        if (k > 0.85) gasBubbles(ctx, t, 'free', seg(k, 0.85, 1));
        speedLines(Math.sin(k * Math.PI) * 0.8, -t);
      } },
    { a: T.into, b: T.methane, name: 'stink',
      cam: t => ({ z: 1.04, x: 540, y: 980, shake: 16 * (1 - seg(t, T.into, T.into + 0.6)) + 3 * seg(t, WF('toxic', 'toxic'), WF('toxic', 'toxic') + 0.2) * (1 - seg(t, T.methane - 0.4, T.methane)) }),
      draw: t => {
        const fog = ease.out(seg(t, T.into, T.into + 1.1)), tx = WF('toxic', 'toxic');
        drawBathroom(ctx, { water: 0, fog, light: 1 - 0.4 * fog }, t, () => {
          const cough = t > tx ? Math.sin(t * 22) * 0.05 * (1 - seg(t, tx + 0.8, tx + 1.2)) : 0;
          quix(t, { x: BATH.quixX, y: BATH.quixY, s: 1, expr: t < T.into + 0.3 ? 'shock' : 'disgust', pose: t < T.into + 0.3 ? 'shrug' : 'nose', lean: cough, look: [0.4, -0.2], boing: boing(t, T.into, 0.3) });
        });
        // burst
        const b = seg(t, T.into, T.into + 0.7);
        if (b < 1) gasCloud(ctx, BATH.toiletX, BATH.base - 420 - b * 200, 0.6 + b * 2.4, 1 - b, t, 99);
        const eg = WF('h2s', 'rotten'), hy = WF('h2s', 'hydrogen');
        const ea = pop(t, eg - 0.1, 0.4) * (1 - seg(t, hy - 0.1, hy + 0.15));
        if (ea > 0) { ctx.save(); ctx.globalAlpha = clamp(ea); rottenEgg(ctx, 760, 640, ea * 1.25, t); ctx.restore(); }
        const ma = pop(t, hy - 0.1, 0.45), mo = seg(t, tx - 0.2, tx + 0.2);
        if (ma > 0) {
          const mx = lerp(740, 900, mo), my = lerp(600, 420, mo), ms = lerp(1.0, 0.5, mo) * ma;
          moleculeH2S(ctx, mx, my, ms, Math.sin(t * 1.5) * 0.3);
          if (mo < 1) {
            ctx.save(); ctx.globalAlpha = 1 - mo; pill(ctx, 740, 860, 560, 96, '#FFD43B', INK, 8);
            txt(ctx, 'HYDROGEN SULFIDE', 740, 866, { size: 52, font: 'Lilita', color: INK, shadow: false }); ctx.restore();
          }
        }
        const ha = pop(t, tx - 0.12, 0.4);
        if (ha > 0) {
          hazardSign(ctx, 620, 640, ha * 1.1, t);
          txt(ctx, 'TOXIC', 620, 900, { size: 120 * ha, font: 'Bungee', color: '#FF3B5C', stroke: 18, glow: '#FF3B5C' });
          ctx.save(); ctx.globalAlpha = 0.35 * (0.5 + 0.5 * Math.sin(t * 9)) * ha;
          const vg = ctx.createRadialGradient(540, 960, 500, 540, 960, 1300); vg.addColorStop(0, 'rgba(255,0,40,0)'); vg.addColorStop(1, 'rgba(255,0,40,0.9)');
          ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); ctx.restore();
        }
      } },
    { a: T.methane, b: T.hist, name: 'match',
      cam: t => {
        const f = seg(t, T.flam - 0.05, T.flam + 0.25), back = seg(t, T.hist - 0.6, T.hist);
        return { z: lerp(1.0, 1.35, ease.out(f) * (1 - ease.io(back))), x: lerp(540, 380, ease.out(f)), y: lerp(980, 1060, ease.out(f)), shake: 10 * (1 - seg(t, T.flam, T.flam + 0.4)) * (t > T.flam ? 1 : 0) };
      },
      draw: t => {
        const me = WF('methane', 'methane'), too = WF('methane', 'too'), wh = WF('methane', 'which');
        const blow = T.flam + 0.45;
        const strike = seg(t, too - 0.05, too + 0.2);
        const flame = t < too - 0.05 ? 0 : t < blow ? ease.out(strike) : 1 - seg(t, blow, blow + 0.12);
        drawBathroom(ctx, { water: 0, fog: 0.85, light: 0.6 }, t, () => {
          const scared = t > wh + 0.25;
          quix(t, { x: BATH.quixX + 30, y: BATH.quixY, s: 1, pose: 'match', match: t > me - 0.2 ? flame : null,
            expr: t < wh ? 'smug' : scared ? (t > blow + 0.1 ? 'worried' : 'shock') : 'curious',
            look: t < wh ? [0.5, -0.3] : t < wh + 0.4 ? [0.7, -0.7] : [0, 0], sweat: t > blow ? 1 : 0,
            morph: scared ? ease.out(seg(t, wh + 0.25, wh + 0.4)) : 0, glow: scared ? 0.7 : 0, boing: boing(t, wh + 0.25, 0.4),
            talk: !(t > T.flam + 0.35 && t < blow + 0.3) });
          if (t > blow && t < blow + 1.2) { // smoke puff from blowing it out
            const k = seg(t, blow, blow + 1.2);
            puff(ctx, BATH.quixX + 230 + k * 60, BATH.quixY - 330 - k * 160, 40 + k * 90, 'rgba(220,220,230,0.8)', 1 - k, 5, t);
          }
        });
        const ma = pop(t, me - 0.12, 0.45) * (1 - seg(t, wh - 0.1, wh + 0.2));
        if (ma > 0) {
          moleculeCH4(ctx, 760, 600, 0.9 * ma, t * 0.8);
          ctx.save(); ctx.globalAlpha = clamp(ma); pill(ctx, 760, 850, 380, 96, '#FFD43B', INK, 8);
          txt(ctx, 'METHANE', 760, 856, { size: 56, font: 'Lilita', color: INK, shadow: false }); ctx.restore();
        }
        const fa = pop(t, T.flam, 0.35);
        if (fa > 0) {
          ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); // screen-space text despite camera zoom
          ctx.translate(540, 560); ctx.rotate(-0.06 + Math.sin(t * 30) * 0.01 * (1 - seg(t, T.flam, T.flam + 0.5))); ctx.scale(fa, fa);
          txt(ctx, 'FLAMMABLE', 0, 0, { size: 140, font: 'Bungee', color: '#FF8A1F', stroke: 22, glow: '#FF5A1F', glowBlur: 50 });
          ctx.restore();
        }
      } },
    { a: T.hist, b: T.restore, name: 'history',
      draw: t => {
        if (t < T.y1775) { // rewind
          const k = seg(t, T.hist, T.y1775);
          drawBathroom(ctx, { water: 0, fog: 0.85, light: 0.6 }, t, () => quix(t, { x: BATH.quixX + 30, y: BATH.quixY, s: 1, expr: 'cool', pose: 'idle', talk: true }));
          ctx.save(); ctx.globalCompositeOperation = 'color'; ctx.fillStyle = '#3050A0'; ctx.globalAlpha = 0.6; ctx.fillRect(0, 0, W, H); ctx.restore();
          ctx.fillStyle = 'rgba(5,10,30,0.45)'; ctx.fillRect(0, 0, W, H);
          for (let i = 0; i < 8; i++) { const y = (hash(i + Math.floor(t * 30)) * H); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(0, y, W, 6 + hash(i) * 20); }
          glitch(0.5, Math.floor(t * 30));
          const year = Math.round(lerp(2026, 1775, ease.in(k)));
          txt(ctx, '◀◀ REWIND', 60, 250, { size: 60, font: 'Bungee', align: 'left', color: '#fff', stroke: 12 });
          txt(ctx, String(year), 540, 860, { size: 240, font: 'Bungee', color: '#fff', stroke: 26, glow: '#5CE1FF', glowBlur: 40 });
          return;
        }
        ctx.drawImage(getParch(), 0, 0);
        const wm = WF('history', 'watchmaker'), nm = WF('history', 'named'), pt = WF('history', 'patented'), toi = WF('history', 'toilet'), bend = WF('history', 'bend');
        const phaseB = ease.io(seg(t, pt - 0.25, pt + 0.25));
        // year stamp
        const ys = seg(t, T.y1775, T.y1775 + 0.25);
        ctx.save(); ctx.translate(540, 300); ctx.rotate(-0.05); ctx.scale(lerp(2.4, 1, ease.out(ys)), lerp(2.4, 1, ease.out(ys)));
        ctx.globalAlpha = clamp(ys * 2);
        txt(ctx, '1775', 0, 0, { size: 230, font: 'Bungee', color: '#7A2E1C', shadow: false });
        ctx.restore();
        // watch
        const wa = ease.back(seg(t, wm - 0.15, wm + 0.35));
        if (wa > 0) pocketWatch(ctx, lerp(810, 1120, phaseB), lerp(-400, 760, wa), 1.0, t);
        // cameo + nameplate
        const ca = ease.out(seg(t, nm - 0.1, nm + 0.35));
        if (ca > 0) {
          const cx = lerp(-300, 290, ca) - 400 * phaseB;
          cameo(ctx, cx, 780, 1.0, t);
          pill(ctx, cx, 1080, 440, 120, '#3A2A10', null);
          txt(ctx, 'ALEXANDER CUMMING', cx, 1062, { size: 40, font: 'Lilita', color: '#F3E3BD', shadow: false });
          txt(ctx, 'WATCHMAKER', cx, 1106, { size: 30, font: 'Lilita', color: '#D4A23C', shadow: false });
        }
        // Quix in a powdered wig
        const qa = ease.out(seg(t, T.y1775 + 0.5, T.y1775 + 0.9)) * (1 - ease.in(phaseB));
        if (qa > 0) quix(t, { x: 610, y: lerp(1700, 1400, qa), s: 0.62, expr: 'smug', pose: 'thumb', wig: true, shadow: true });
        // patent
        if (phaseB > 0) {
          patentDoc(ctx, 540, lerp(2300, 930, phaseB), 0.98, seg(t, toi - 0.3, bend + 0.2), seg(t, bend - 0.1, bend + 0.2) * (0.7 + 0.3 * Math.sin(t * 10)), t);
          const sa = seg(t, pt + 0.25, pt + 0.45);
          if (sa > 0) waxSeal(ctx, 790, 1230, lerp(2.0, 1.0, ease.out(sa)));
        }
        ctx.save(); const vg = ctx.createRadialGradient(540, 960, 600, 540, 960, 1250); vg.addColorStop(0, 'rgba(60,35,10,0)'); vg.addColorStop(1, 'rgba(60,35,10,0.55)');
        ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); ctx.restore();
      } },
    { a: T.restore, b: T.tip, name: 'restore',
      cam: t => t < T.clean ? { z: 1.08, x: 560, y: 1100 } : { z: lerp(1.12, 1.0, ease.out(seg(t, T.clean, T.clean + 0.6))), x: 540, y: 980 },
      draw: t => {
        if (t < T.clean) {
          const p = 1 - ease.out(seg(t, T.restore + 0.05, T.restore + 0.85));
          const water = ease.io(seg(t, T.restore + 0.7, T.restore + 1.2));
          xrayBG(ctx, t);
          if (p > 0.001) { xrayToilet(ctx, { trap: 0, hideTube: true, water: 0 }, t); trapDissolve(ctx, p, t); }
          else xrayToilet(ctx, { trap: 1, water }, t);
          if (water > 0.5) gasBubbles(ctx, t, 'blocked', seg(water, 0.5, 1));
          const r = quix(t, { ...xq, expr: 'happy', pose: 'cheer', glow: p > 0 ? 1 : 0.3, look: [0.8, 0.2] });
          beam(r.tip[0], r.tip[1], 575, 1210, t, p > 0.02 ? 1 : 0, '#FFD43B');
          checkBadge(ctx, 820, 1110, pop(t, WF('restore', 'curve') - 0.05, 0.4) * 1.2);
          return;
        }
        const k = seg(t, T.clean, T.clean + 0.9);
        drawBathroom(ctx, { water: 1, fog: 0.85 * (1 - ease.io(k)), clean: ease.out(k), light: lerp(0.6, 1.2, k) }, t, () => {
          quix(t, { x: BATH.quixX + 20, y: BATH.quixY, s: 1, expr: 'happy', pose: t < WF('restore', 'smelling') ? 'cheer' : 'thumb', glow: 0.5, look: [0, 0], boing: boing(t, T.clean, 0.3) });
        });
      } },
    { a: T.tip, b: T.outro, name: 'tip',
      cam: t => ({ z: 1.1 + 0.03 * ease.io(seg(t, T.tip, T.outro)), x: 585, y: 900 }),
      draw: t => {
        const run = WF('tip', 'run'), stink = WF('tip', 'stink'), dr = WF('dried', 'seal');
        const tapK = ease.out(seg(t, run - 0.25, run + 0.1));
        const flow = seg(t, run, run + 0.2) * (1 - seg(t, dr + 0.6, dr + 0.9));
        const level = lerp(0.1, 1, ease.io(seg(t, run + 0.15, run + 1.0)));
        const sa = seg(t, stink - 0.4, stink) * (1 - seg(t, run + 0.5, run + 0.9));
        const r = drawSinkScene(ctx, { tap: -0.8 * tapK, flow, level, stink: sa }, t);
        const reach = ease.io(seg(t, run - 0.55, run - 0.2)) * (1 - ease.io(seg(t, run + 0.6, run + 1.0)));
        const pose = QUIX.mixPose(t > dr ? 'thumb' : 'idle', { L: [-190, -95, -30, 'fist', null], R: [555, -1060, 140, 'open', -0.6] }, reach);
        quix(t, { x: 245, y: 1330, s: 0.75, expr: sa > 0.3 ? 'disgust' : t > run + 0.6 ? 'happy' : 'cool', pose,
          morph: ease.out(seg(t, T.tip, T.tip + 0.3)) * (1 - seg(t, run, run + 0.3)), glow: 0.5, look: [0.6, -0.3] });
        // dust motes
        for (let i = 0; i < 20; i++) { const x = hash(i) * W + Math.sin(t + i) * 30, y = (hash(i + 4) * 1200 + t * 20) % 1200; ctx.fillStyle = 'rgba(255,255,230,0.35)'; ctx.beginPath(); ctx.arc(x, y + 100, 3 + hash(i) * 3, 0, 7); ctx.fill(); }
        const ba = pop(t, T.tip + 0.05, 0.4);
        if (ba > 0) {
          ctx.save(); ctx.translate(540, 330); ctx.scale(ba, ba); ctx.rotate(-0.04);
          pill(ctx, 0, 0, 520, 140, '#FFD43B', INK, 10);
          txt(ctx, 'PRO TIP', 30, 6, { size: 92, font: 'Bungee', color: INK, shadow: false });
          ctx.beginPath(); ctx.arc(-200, 0, 46, 0, 7); ctx.fillStyle = INK; ctx.fill();
          txt(ctx, '!', -200, 4, { size: 70, font: 'Bungee', color: '#FFD43B', shadow: false });
          ctx.restore();
        }
        const ca = pop(t, dr - 0.1, 0.4);
        if (ca > 0) { checkBadge(ctx, 870, 1120, ca * 1.1); }
      } },
    { a: T.outro, b: T.end + 1, name: 'outro',
      cam: t => ({ z: lerp(1.08, 1.0, ease.out(seg(t, T.outro, T.outro + 0.8))), x: 540, y: 960 }),
      draw: t => {
        heroBG(ctx, t, 1);
        const kinds = ['zip', 'lace', 'key', 'pen', 'handle'];
        kinds.forEach((k, i) => {
          const a = pop(t, WF('outro', 'delete') - 0.2 + i * 0.08, 0.4);
          if (a <= 0) return;
          const ang = Math.PI + (i + 0.5) / kinds.length * Math.PI + Math.sin(t * 0.8) * 0.05;
          const x = 540 + Math.cos(ang) * 410, y = 920 + Math.sin(ang) * 330 + Math.sin(t * 2 + i) * 14;
          ctx.save(); ctx.globalAlpha = 0.95;
          ctx.beginPath(); ctx.arc(x, y, 105 * a, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
          icon(ctx, k, x, y, 0.8 * a, Math.sin(t * 1.5 + i) * 0.2);
          txt(ctx, '?', x + 70 * a, y - 70 * a, { size: 60 * a, font: 'Bungee', color: '#FFD43B', stroke: 10 });
        });
        quix(t, { x: 540, y: 1430, s: 1.25, expr: t < WF('outro', 'what') ? 'cool' : 'curious', pose: t < WF('outro', 'what') ? 'hips' : 'shrug', glow: 0.5 + 0.5 * Math.sin(t * 4), look: [0, -0.2], boing: boing(t, T.outro + 0.05, 0.3) });
        const ea = pop(t, C('outro').e + 0.05, 0.45);
        if (ea > 0) {
          ctx.save(); ctx.translate(540, 250); ctx.scale(ea, ea);
          pill(ctx, 0, 0, 640, 150, '#FFD43B', INK, 10);
          txt(ctx, 'COMMENT ↓', 0, 8, { size: 92, font: 'Bungee', color: INK, shadow: false });
          ctx.restore();
          txt(ctx, 'FOLLOW FOR EP. 02', 540, 385, { size: 58, font: 'Lilita', color: '#fff', stroke: 12, alpha: ea });
        }
      } },
  ];

  // subtitle pages: <=3 words / 18 chars, break after punctuation
  SUBS = [];
  for (const l of TL.lines) {
    let page = [];
    const flush = () => { if (page.length) SUBS.push({ cue: l.cue, words: page }); page = []; };
    l.words.forEach((w, i) => {
      const len = page.reduce((a, x) => a + x.w.length + 1, 0) + w.w.length;
      if (page.length && (page.length >= 3 || len > 18)) flush();
      page.push(w);
      if (/[.,!?:…]$/.test(w.w) && i < l.words.length - 1) flush();
    });
    flush();
  }

  // SFX cue sheet for the audio mixer
  SFX = [
    ['pop', WF('hook', 'water')], ['whoosh_scan', T.reveal], ['ding', WF('reveal', 'bend') - 0.05],
    ['whoosh', T.intro], ['pop', WF('intro', 'quix') - 0.1], ['charge', WF('delete', 'today') - 0.1],
    ['zap', T.del], ['crumble', T.del + 0.2], ['stamp', T.del + 0.35],
    ['gurgle', T.mistake], ['boing', WF('mistake', 'mistake') - 0.15],
    ['ding', WF('seal', 'seal') - 0.1], ['whoosh_down', T.sewer + 0.05], ['drip', WF('sewer', 'sewer') + 0.2],
    ['hit', C('chain').words[0].s], ['hit', C('chain').words[2].s], ['hit', C('chain').words[6].s],
    ['whoosh_up', T.gas], ['burst', T.into], ['fly', WF('h2s', 'rotten')], ['pop', WF('h2s', 'hydrogen')],
    ['alarm', WF('toxic', 'toxic') - 0.1], ['pop', WF('methane', 'methane') - 0.1], ['strike', WF('methane', 'too') - 0.05],
    ['boing', WF('methane', 'which') + 0.25], ['hit_big', T.flam], ['blow', T.flam + 0.45],
    ['rewind', T.hist], ['stamp', T.y1775], ['tick', WF('history', 'watchmaker') - 0.1], ['whoosh', WF('history', 'named') - 0.1],
    ['whoosh', WF('history', 'patented') - 0.25], ['stamp', WF('history', 'patented') + 0.25], ['ding', WF('history', 'bend') - 0.1],
    ['rebuild', T.restore + 0.05], ['ding', WF('restore', 'curve') - 0.05], ['sparkle', T.clean],
    ['pop', T.tip + 0.05], ['squeak', WF('tip', 'run') - 0.25], ['water', WF('tip', 'run')], ['ding', WF('dried', 'seal') - 0.1],
    ['whoosh', T.outro], ['pop', C('outro').e + 0.05],
  ].map(([n, t]) => ({ n, t: +t.toFixed(3) }));
  window.SFX = SFX; window.T = T;
}

// ----------------------------------------------------------------------------
function drawSubs(t) {
  const pg = SUBS.find(p => t >= p.words[0].s - 0.08 && t < (SUBS[SUBS.indexOf(p) + 1]?.words[0].s - 0.08 || p.words[p.words.length - 1].e + 0.5));
  if (!pg) return;
  const line = TL.lines.find(l => l.cue === pg.cue);
  if (t > line.e + 0.35) return;
  const shot = SHOTS.find(s => t >= s.a && t < s.b);
  if (shot && shot.noSubs) return;
  if (pg.cue === 'flammable') return;
  ctx.save();
  const size = 96, y = 1530;
  ctx.font = `${size}px Lilita`;
  const words = pg.words.map(w => w.w.toUpperCase());
  const ws = words.map(w => ctx.measureText(w).width), gap = 44;
  let total = ws.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
  const sc = Math.min(1, 900 / total);
  const appear = pop(t, pg.words[0].s - 0.08, 0.22);
  ctx.translate(540, y); ctx.scale(sc * (0.85 + 0.15 * appear), sc * (0.85 + 0.15 * appear));
  let x = -total / 2;
  pg.words.forEach((w, i) => {
    const active = t >= w.s - 0.04 && t < (pg.words[i + 1]?.s ?? w.e + 0.3) - 0.04;
    const k = active ? ease.back(seg(t, w.s - 0.04, w.s + 0.1)) : 0;
    const cx = x + ws[i] / 2;
    txt(ctx, words[i], cx, -14 * k, { size, color: active ? '#FFD43B' : '#fff', stroke: 20, scale: 1 + 0.12 * k, rot: active ? -0.03 : 0 });
    x += ws[i] + gap;
  });
  ctx.restore();
}

function drawBadge(t) {
  const shot = SHOTS.find(s => t >= s.a && t < s.b);
  if (!shot || ['intro', 'outro', 'history'].includes(shot.name)) return;
  ctx.save();
  pill(ctx, 205, 190, 290, 76, 'rgba(26,16,51,0.85)', '#FFD43B', 5);
  txt(ctx, 'WHAT IF?', 180, 194, { size: 44, font: 'Bungee', color: '#FFD43B', shadow: false });
  txt(ctx, '#1', 318, 194, { size: 40, font: 'Lilita', color: '#fff', shadow: false });
  ctx.restore();
}

function drawHookTitle(t) {
  const a = Math.min(1, 1 - seg(t, T.intro - 0.25, T.intro)) * (1 + 0.03 * Math.sin(t * 5));
  if (a <= 0) return;
  ctx.save();
  const g = ctx.createLinearGradient(0, 0, 0, 640); g.addColorStop(0, `rgba(10,5,30,${0.75 * a})`); g.addColorStop(1, 'rgba(10,5,30,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 640);
  ctx.globalAlpha = clamp(a); ctx.translate(540, 380);
  txt(ctx, 'WHAT IF TOILETS', 0, 0, { size: 96, font: 'Bungee', color: '#fff', stroke: 18 });
  txt(ctx, 'HAD NO U-BEND?', 0, 118, { size: 96, font: 'Bungee', color: '#FFD43B', stroke: 18, glow: '#FFD43B', glowBlur: 20 });
  ctx.restore();
}

let grain = null;
function postFX(t) {
  if (!grain) {
    grain = document.createElement('canvas'); grain.width = 512; grain.height = 512;
    const g = grain.getContext('2d'), d = g.createImageData(512, 512), R = rng(5);
    for (let i = 0; i < d.data.length; i += 4) { const v = R() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    g.putImageData(d, 0, 0);
  }
  ctx.save();
  const vg = ctx.createRadialGradient(540, 960, 650, 540, 960, 1250);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(5,2,20,0.42)');
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 0.03; ctx.globalCompositeOperation = 'overlay';
  const ox = Math.floor(hash(Math.floor(t * 30)) * 512), oy = Math.floor(hash(Math.floor(t * 30) + 7) * 512);
  ctx.fillStyle = ctx.createPattern(grain, 'repeat'); ctx.translate(-ox, -oy); ctx.fillRect(0, 0, W + 512, H + 512);
  ctx.restore();
}

function renderFrame(f) {
  const t = f / TL.fps;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const shot = SHOTS.find(s => t >= s.a && t < s.b) || SHOTS[SHOTS.length - 1];
  const cam = shot.cam ? shot.cam(t) : { z: 1, x: 540, y: 960 };
  const punch = shot.flash === false ? 1 : 1 + 0.07 * (1 - ease.out(seg(t, shot.a, shot.a + 0.3)));
  const sh = cam.shake || 0;
  ctx.save();
  ctx.translate(540, 960); ctx.scale(cam.z * punch, cam.z * punch);
  ctx.translate(-cam.x + noise1(t * 13) * sh, -cam.y + noise1(t * 13 + 50) * sh);
  shot.draw(t);
  ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (shot.post) shot.post(t);
  if (shot.flash !== false) {
    const fa = 0.35 * (1 - seg(t, shot.a, shot.a + 0.12));
    if (fa > 0 && shot.a > 0) { ctx.fillStyle = `rgba(255,255,255,${fa})`; ctx.fillRect(0, 0, W, H); }
  }
  if (shot.name === 'delete') { const fa = 0.8 * (1 - seg(t, T.del, T.del + 0.2)); ctx.fillStyle = `rgba(255,250,220,${fa})`; ctx.fillRect(0, 0, W, H); }
  postFX(t);
  drawHookTitle(t);
  drawBadge(t);
  drawSubs(t);
  // fade out at the very end
  const fo = seg(t, TL.duration - 0.35, TL.duration);
  if (fo > 0) { ctx.fillStyle = `rgba(0,0,0,${fo})`; ctx.fillRect(0, 0, W, H); }
}

window.init = async (tl) => {
  TL = tl;
  await document.fonts.load('100px Bungee'); await document.fonts.load('100px Lilita');
  build();
  return { frames: Math.ceil(TL.duration * TL.fps), sfx: SFX, T };
};
window.renderFrame = renderFrame;
window.grab = (type = 'image/png') => cv.toDataURL(type);
