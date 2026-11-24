// WHAT IF? engine core: timeline -> shots -> frame. Everything is a pure function of t,
// so any frame can be rendered independently (parallel workers, quick previews).
// An episode supplies web/scenes.js (painters) and web/shots.js (window.EPISODE).
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
let TL, T, SHOTS, SUBS, SFX, MUSIC, EP;

const C = n => { const l = TL.lines.find(l => l.cue === n); if (!l) throw new Error('no cue ' + n); return l; };
const WF = (cue, w, nth = 0) => {
  const m = C(cue).words.filter(x => x.w.toLowerCase().replace(/[^a-z0-9']/g, '') === w.toLowerCase());
  if (!m[nth]) throw new Error(`word ${w} not in ${cue}`); return m[nth].s;
};
function mouthAt(t) { const f = t * TL.fps, i = Math.floor(f); return lerp(TL.mouth[i] || 0, TL.mouth[i + 1] || 0, f - i); }
const BLINKS = (() => { const r = rng(42), out = []; for (let t = 1.1; t < 120; t += 2.0 + r() * 2.2) out.push(t); return out; })();
function blinkAt(t) { for (const b of BLINKS) { const d = t - b; if (d > -0.07 && d < 0.07) return 1 - Math.abs(d) / 0.07; } return 0; }

function quix(t, o) {
  const m = o.talk === false ? 0 : mouthAt(t);
  return QUIX.drawQuix(ctx, Object.assign({
    t, mouth: m, blink: blinkAt(t), antAngle: 0.06 * Math.sin(t * 2.1) + (o.boing || 0),
    squash: 1 + m * 0.025,
  }, o, { y: o.y - m * 6 }));
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

function speedLines(a, t, horizontal = false) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(255,255,255,0.55)'; ctx.lineCap = 'round';
  for (let i = 0; i < 26; i++) {
    ctx.lineWidth = 3 + hash(i + 1) * 6;
    const p = hash(i), q = ((((hash(i + 3) + t * 1.6 * (0.6 + hash(i + 7))) % 1.2) + 1.2) % 1.2) - 0.1, len = 200 + hash(i + 2) * 300;
    ctx.beginPath();
    if (horizontal) { ctx.moveTo(W - q * (W + 400), p * H); ctx.lineTo(W - q * (W + 400) + len, p * H); }
    else { ctx.moveTo(p * W, q * (H + 400) - 200); ctx.lineTo(p * W, q * (H + 400) - 200 + len); }
    ctx.stroke();
  }
  ctx.restore();
}

function stamp(text, x, y, t, t0, t1, col = '#FF3B5C', size = 130, rot = -0.12) {
  const st = pop(t, t0, 0.3), sf = 1 - seg(t, t1 - 0.25, t1);
  if (st <= 0 || sf <= 0) return;
  ctx.save(); ctx.globalAlpha = sf; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(lerp(2.2, 1, st), lerp(2.2, 1, st));
  ctx.font = `${size}px Bungee`; const w = ctx.measureText(text).width;
  ctx.strokeStyle = col; ctx.lineWidth = 14; ctx.beginPath(); ctx.roundRect(-w / 2 - 50, -size * 0.73, w + 100, size * 1.46, 26); ctx.stroke();
  txt(ctx, text, 0, 6, { size, font: 'Bungee', color: col, glow: col, glowBlur: 30, shadow: false });
  ctx.restore();
}

// ------------------------------------------------------------- series shots
// Standard intro: "I'm Quix. And today... I'm deleting it."  (cues: intro, delete)
function introShot() {
  return { a: T.intro, b: T.del, name: 'intro',
    cam: t => { const k = ease.in(seg(t, WF('delete', 'today'), T.del)); return { z: 1 + 0.22 * k, x: 540, y: lerp(980, 820, k), shake: 6 * k }; },
    draw: t => {
      heroBG(ctx, t);
      const ch = seg(t, WF('delete', 'today') - 0.1, T.del);
      const tagA = pop(t, WF('intro', 'quix') - 0.1, 0.45);
      if (tagA > 0) {
        ctx.save(); ctx.translate(540, 420); ctx.scale(tagA, tagA); ctx.rotate(-0.04);
        txt(ctx, 'QUIX', 0, 0, { size: 210, font: 'Bungee', color: '#FFD43B', stroke: 26, glow: '#FFD43B', glowBlur: 40 });
        pill(ctx, 0, 150, 520, 74, '#fff', INK, 7);
        txt(ctx, 'DELETES ONE TINY THING', 0, 154, { size: 40, font: 'Lilita', color: INK, shadow: false });
        ctx.restore();
      }
      const im = WF('delete', "i'm");
      const pose = t < im ? 'hips' : QUIX.mixPose('hips', 'cheer', ease.out(seg(t, im, T.del)));
      const r = quix(t, { x: 540, y: 1500, s: 1.55, expr: ch > 0.05 ? 'smug' : 'cool', pose, glow: ch, look: ch > 0.3 ? [0, -0.6] : [0, 0], boing: boing(t, T.intro + 0.05, 0.3) });
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
    } };
}

// Standard outro: "So... what should I delete next?"  (cue: outro)
function outroShot() {
  return { a: T.outro, b: T.end + 1, name: 'outro',
    cam: t => ({ z: lerp(1.08, 1.0, ease.out(seg(t, T.outro, T.outro + 0.8))), x: 540, y: 960 }),
    draw: t => {
      heroBG(ctx, t, 1);
      const kinds = EP.outroIcons || ['zip', 'lace', 'key', 'pen', 'handle'];
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
      const wh = WF('outro', 'what');
      quix(t, { x: 540, y: 1430, s: 1.25, expr: t < wh ? 'cool' : 'curious', pose: t < wh ? 'hips' : 'shrug', glow: 0.5 + 0.5 * Math.sin(t * 4), look: [0, -0.2], boing: boing(t, T.outro + 0.05, 0.3) });
      const ea = pop(t, C('outro').e + 0.05, 0.45);
      if (ea > 0) {
        ctx.save(); ctx.translate(540, 250); ctx.scale(ea, ea);
        pill(ctx, 0, 0, 640, 150, '#FFD43B', INK, 10);
        txt(ctx, 'COMMENT ↓', 0, 8, { size: 92, font: 'Bungee', color: INK, shadow: false });
        ctx.restore();
        txt(ctx, EP.followText || 'FOLLOW FOR MORE', 540, 385, { size: 58, font: 'Lilita', color: '#fff', stroke: 12, alpha: ea });
      }
    } };
}

// ---------------------------------------------------------------- build
function build() {
  EP = window.EPISODE;
  // series-standard markers; the episode adds its own
  T = { intro: C('intro').s - 0.12, del: WF('delete', 'deleting') - 0.05, outro: C('outro').s - 0.15, end: TL.duration };
  const out = EP.build({ T });
  SHOTS = out.shots.map(s => s === 'INTRO' ? introShot() : s === 'OUTRO' ? outroShot() : s);
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
  const std = [['whoosh', T.intro], ['pop', WF('intro', 'quix') - 0.1], ['charge', WF('delete', 'today') - 0.1],
    ['zap', T.del], ['whoosh', T.outro], ['pop', C('outro').e + 0.05]];
  SFX = [...std, ...out.sfx].map(([n, t, g]) => ({ n, t: +t.toFixed(3), g: g ?? 1 })).sort((a, b) => a.t - b.t);
  MUSIC = Object.assign({ drops: [], radio: [] }, out.music || {});
  MUSIC.drops = [[T.del - 0.02, T.del + 1.1, 0.85], ...MUSIC.drops];
}

// ---------------------------------------------------------------- overlays
function drawSubs(t) {
  const pg = SUBS.find(p => t >= p.words[0].s - 0.08 && t < (SUBS[SUBS.indexOf(p) + 1]?.words[0].s - 0.08 || p.words[p.words.length - 1].e + 0.5));
  if (!pg) return;
  const line = TL.lines.find(l => l.cue === pg.cue);
  if (t > line.e + 0.35) return;
  const shot = SHOTS.find(s => t >= s.a && t < s.b);
  if (shot && shot.noSubs) return;
  if ((EP.noSubsCues || []).includes(pg.cue)) return;
  ctx.save();
  const size = 96, y = 1530;
  ctx.font = `${size}px Lilita`;
  const words = pg.words.map(w => w.w.toUpperCase());
  const ws = words.map(w => ctx.measureText(w).width), gap = 44;
  const total = ws.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
  const sc = Math.min(1, 900 / total);
  const appear = pop(t, pg.words[0].s - 0.08, 0.22);
  ctx.translate(540, y); ctx.scale(sc * (0.85 + 0.15 * appear), sc * (0.85 + 0.15 * appear));
  let x = -total / 2;
  pg.words.forEach((w, i) => {
    const active = t >= w.s - 0.04 && t < (pg.words[i + 1]?.s ?? w.e + 0.3) - 0.04;
    const k = active ? ease.back(seg(t, w.s - 0.04, w.s + 0.1)) : 0;
    txt(ctx, words[i], x + ws[i] / 2, -14 * k, { size, color: active ? '#FFD43B' : '#fff', stroke: 20, scale: 1 + 0.12 * k, rot: active ? -0.03 : 0 });
    x += ws[i] + gap;
  });
  ctx.restore();
}

function drawBadge(t) {
  const shot = SHOTS.find(s => t >= s.a && t < s.b);
  if (!shot || shot.noBadge || ['intro', 'outro'].includes(shot.name)) return;
  ctx.save();
  pill(ctx, 205, 190, 290, 76, 'rgba(26,16,51,0.85)', '#FFD43B', 5);
  txt(ctx, 'WHAT IF?', 180, 194, { size: 44, font: 'Bungee', color: '#FFD43B', shadow: false });
  txt(ctx, EP.badge, 318, 194, { size: 40, font: 'Lilita', color: '#fff', shadow: false });
  ctx.restore();
}

function drawHookTitle(t) {
  const a = Math.min(1, 1 - seg(t, T.intro - 0.25, T.intro)) * (1 + 0.03 * Math.sin(t * 5));
  if (a <= 0) return;
  ctx.save();
  const g = ctx.createLinearGradient(0, 0, 0, 640); g.addColorStop(0, `rgba(10,5,30,${0.75 * a})`); g.addColorStop(1, 'rgba(10,5,30,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 640);
  ctx.globalAlpha = clamp(a); ctx.translate(540, 380);
  const [l1, l2] = EP.title;
  const fit = s => Math.min(96, 96 * 15 / Math.max(15, s.length));
  txt(ctx, l1, 0, 0, { size: fit(l1), font: 'Bungee', color: '#fff', stroke: 18 });
  txt(ctx, l2, 0, 118, { size: fit(l2), font: 'Bungee', color: '#FFD43B', stroke: 18, glow: '#FFD43B', glowBlur: 20 });
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
  if (cam.z >= 1 && !shot.noClamp) { // never reveal the void outside the 1080x1920 world
    const hw = 540 / cam.z, hh = 960 / cam.z;
    cam.x = clamp(cam.x, hw, W - hw); cam.y = clamp(cam.y, hh, H - hh);
  }
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
  const fo = seg(t, TL.duration - 0.35, TL.duration);
  if (fo > 0) { ctx.fillStyle = `rgba(0,0,0,${fo})`; ctx.fillRect(0, 0, W, H); }
}

window.init = async (tl) => {
  TL = tl;
  await document.fonts.load('100px Bungee'); await document.fonts.load('100px Lilita');
  build();
  return { frames: Math.ceil(TL.duration * TL.fps), sfx: SFX, T, music: MUSIC };
};
window.renderFrame = renderFrame;
window.grab = (type = 'image/png') => cv.toDataURL(type);
