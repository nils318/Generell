// Shared helpers: easing, seeded randomness, text, particles, icons.
const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = {
  io: t => (t = clamp(t), t * t * (3 - 2 * t)),
  out: t => (t = clamp(t), 1 - Math.pow(1 - t, 3)),
  in: t => (t = clamp(t), t * t * t),
  back: t => { t = clamp(t); const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
  elastic: t => { t = clamp(t); return t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI / 3)) + 1; },
};
const seg = (t, a, b) => clamp((t - a) / (b - a));
const pop = (t, t0, d = 0.35) => ease.back(seg(t, t0, t0 + d));
const fadeIO = (t, a, b, f = 0.2) => clamp(Math.min((t - a) / f, (b - t) / f));

function rng(seed) { let s = seed >>> 0 || 1; return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; }
function hash(n) { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function noise1(x) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; }

function boing(t, t0, amp = 0.35) { if (t < t0) return 0; const d = t - t0; return Math.exp(-d * 4.5) * Math.sin(d * 17) * amp; }

// ---------- text ----------
function txt(ctx, s, x, y, o = {}) {
  ctx.save();
  ctx.font = `${o.size || 80}px ${o.font || 'Lilita'}`;
  ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
  if (o.rot) { ctx.translate(x, y); ctx.rotate(o.rot); x = 0; y = 0; }
  if (o.scale && o.scale !== 1) { ctx.translate(x, y); ctx.scale(o.scale, o.scale); x = 0; y = 0; }
  ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;
  if (o.letter) ctx.letterSpacing = o.letter + 'px';
  if (o.shadow !== false) {
    ctx.fillStyle = 'rgba(10,4,30,0.45)';
    ctx.lineJoin = 'round';
    if (o.stroke) { ctx.strokeStyle = 'rgba(10,4,30,0.45)'; ctx.lineWidth = o.stroke; ctx.strokeText(s, x, y + (o.size || 80) * 0.09); }
    ctx.fillText(s, x, y + (o.size || 80) * 0.09);
  }
  if (o.stroke) { ctx.strokeStyle = o.strokeColor || '#1A1033'; ctx.lineWidth = o.stroke; ctx.lineJoin = 'round'; ctx.strokeText(s, x, y); }
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = o.glowBlur || 30; }
  ctx.fillStyle = o.color || '#fff'; ctx.fillText(s, x, y);
  ctx.restore();
}

function pill(ctx, x, y, w, h, fill, stroke = '#1A1033', lw = 8) {
  ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2);
  ctx.fillStyle = fill; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}

// ---------- particles ----------
function sparkle(ctx, x, y, r, a = 1, col = '#FFF6C2') {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = r;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) { const rr = i % 2 ? r * 0.22 : r; const an = i * Math.PI / 4; ctx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); }
  ctx.closePath(); ctx.fill(); ctx.restore();
}

function burstLines(ctx, x, y, t, col = 'rgba(255,255,255,0.10)', n = 18, r0 = 200, r1 = 1600) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.15);
  ctx.fillStyle = col;
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2, da = Math.PI / n * 0.55;
    ctx.beginPath(); ctx.moveTo(Math.cos(a - da * 0.2) * r0, Math.sin(a - da * 0.2) * r0);
    ctx.lineTo(Math.cos(a - da) * r1, Math.sin(a - da) * r1); ctx.lineTo(Math.cos(a + da) * r1, Math.sin(a + da) * r1);
    ctx.lineTo(Math.cos(a + da * 0.2) * r0, Math.sin(a + da * 0.2) * r0); ctx.fill();
  }
  ctx.restore();
}

// soft cloud blob (gas / smoke)
function puff(ctx, x, y, r, col, a, seed, t) {
  ctx.save(); ctx.globalAlpha *= a;
  const g = ctx.createRadialGradient(x, y, r * 0.1, x, y, r);
  g.addColorStop(0, col); g.addColorStop(1, col.replace(/[\d.]+\)$/, '0)'));
  ctx.fillStyle = g;
  ctx.beginPath();
  for (let i = 0; i <= 24; i++) {
    const an = i / 24 * Math.PI * 2;
    const rr = r * (0.82 + 0.18 * noise1(seed * 7 + i * 0.7 + t * 0.8));
    ctx.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr);
  }
  ctx.fill(); ctx.restore();
}

// cartoon gas cloud with outline (for readable "stink")
function gasCloud(ctx, x, y, s, a, t, seed = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  const r = rng(seed), lobes = [];
  for (let i = 0; i < 7; i++) lobes.push([(r() - 0.5) * 150, (r() - 0.5) * 70, 50 + r() * 35, r() * 6]);
  const path = () => { ctx.beginPath(); for (const [lx, ly, lr, ph] of lobes) { const rr = lr * (1 + 0.06 * Math.sin(t * 3 + ph)); ctx.moveTo(lx + rr, ly); ctx.arc(lx, ly, rr, 0, 7); } };
  ctx.strokeStyle = '#1B4D1A'; ctx.lineWidth = 16; path(); ctx.stroke();
  ctx.fillStyle = '#7EDB3E'; path(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  for (const [lx, ly, lr] of lobes) { ctx.beginPath(); ctx.arc(lx - lr * 0.3, ly - lr * 0.35, lr * 0.32, 0, 7); ctx.fill(); }
  ctx.restore();
}

function stinkLines(ctx, x, y, h, t, a = 1, col = '#8BE04E') {
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round';
  for (let k = -1; k <= 1; k++) {
    for (const [lw, c] of [[16, '#1B4D1A'], [8, col]]) {
      ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath();
      for (let i = 0; i <= 20; i++) {
        const u = i / 20, yy = y - u * h, xx = x + k * 46 + Math.sin(u * 9 - t * 6 + k) * 16;
        i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy);
      }
      ctx.stroke();
    }
  }
  ctx.restore();
}

// ---------- icons ----------
function atom(ctx, x, y, r, base, label, lc = '#1A1033') {
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  g.addColorStop(0, '#fff'); g.addColorStop(0.25, base); g.addColorStop(1, shade(base, -0.35));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  ctx.strokeStyle = '#1A1033'; ctx.lineWidth = 8; ctx.stroke();
  if (label) txt(ctx, label, x, y + 4, { size: r * 0.95, color: lc, shadow: false });
}
function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const f = c => Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k);
  return '#' + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
}
function bond(ctx, x1, y1, x2, y2) {
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#1A1033'; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.strokeStyle = '#C9C2E6'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}

function moleculeH2S(ctx, x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot);
  const a = 0.8, L = 150;
  const h1 = [-Math.sin(a) * L, Math.cos(a) * L], h2 = [Math.sin(a) * L, Math.cos(a) * L];
  bond(ctx, 0, 0, ...h1); bond(ctx, 0, 0, ...h2);
  ctx.save(); ctx.rotate(-rot);
  ctx.restore();
  atom(ctx, ...h1, 52, '#F2F2FA', 'H'); atom(ctx, ...h2, 52, '#F2F2FA', 'H');
  atom(ctx, 0, 0, 92, '#FFD43B', 'S');
  ctx.restore();
}

function moleculeCH4(ctx, x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const pts = [];
  for (let i = 0; i < 4; i++) {
    const a = rot + i * Math.PI / 2, tilt = i % 2 ? 0.55 : -0.25;
    pts.push([Math.cos(a) * 150, Math.sin(a) * 150 * 0.55 + tilt * 120, Math.sin(a)]);
  }
  pts.sort((p, q) => p[2] - q[2]);
  for (const p of pts) if (p[2] < 0) { bond(ctx, 0, 0, p[0], p[1]); atom(ctx, p[0], p[1], 50, '#F2F2FA', 'H'); }
  atom(ctx, 0, 0, 84, '#3B3552', 'C', '#fff');
  for (const p of pts) if (p[2] >= 0) { bond(ctx, 0, 0, p[0], p[1]); atom(ctx, p[0], p[1], 50, '#F2F2FA', 'H'); }
  ctx.restore();
}

function rottenEgg(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(0.1 * Math.sin(t * 3));
  // bottom shell
  ctx.beginPath(); ctx.moveTo(-90, -10);
  for (let i = 0; i <= 8; i++) ctx.lineTo(-90 + i * 22.5, -10 + (i % 2 ? -26 : 0));
  ctx.bezierCurveTo(95, 60, 60, 120, 0, 120); ctx.bezierCurveTo(-60, 120, -95, 60, -90, -10);
  ctx.fillStyle = '#F4EBD6'; ctx.fill(); ctx.strokeStyle = '#1A1033'; ctx.lineWidth = 9; ctx.stroke();
  // yolk (greenish)
  ctx.beginPath(); ctx.ellipse(0, -8, 62, 24, 0, 0, 7); ctx.fillStyle = '#B8C43A'; ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#6F7A1D'; for (const [a, b] of [[-20, -10], [18, -4], [0, -16]]) { ctx.beginPath(); ctx.arc(a, b, 6, 0, 7); ctx.fill(); }
  // flies
  for (let i = 0; i < 3; i++) {
    const fx = Math.cos(t * 4 + i * 2.1) * 120, fy = -90 + Math.sin(t * 5.3 + i) * 40;
    ctx.fillStyle = '#1A1033'; ctx.beginPath(); ctx.arc(fx, fy, 8, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.ellipse(fx - 6, fy - 9, 7, 4, -0.6 + Math.sin(t * 60) * 0.4, 0, 7); ctx.fill();
  }
  ctx.restore();
  stinkLines(ctx, x, y - 40 * s, 140 * s, t, 1);
}

function hazardSign(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.lineJoin = 'round';
  const tri = (r) => { ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(r * 0.95, r * 0.62); ctx.lineTo(-r * 0.95, r * 0.62); ctx.closePath(); };
  ctx.shadowColor = 'rgba(255,40,60,0.8)'; ctx.shadowBlur = 40 + 20 * Math.sin(t * 10);
  tri(170); ctx.fillStyle = '#1A1033'; ctx.fill(); ctx.shadowBlur = 0;
  tri(150); ctx.fillStyle = '#FFD43B'; ctx.fill();
  // skull
  ctx.fillStyle = '#1A1033';
  ctx.beginPath(); ctx.arc(0, 10, 52, Math.PI, 0); ctx.lineTo(40, 50); ctx.lineTo(-40, 50); ctx.fill();
  ctx.fillRect(-28, 46, 56, 24);
  ctx.fillStyle = '#FFD43B';
  ctx.beginPath(); ctx.arc(-20, 16, 13, 0, 7); ctx.arc(20, 16, 13, 0, 7); ctx.fill();
  ctx.fillRect(-14, 56, 6, 14); ctx.fillRect(-2, 56, 6, 14); ctx.fillRect(10, 56, 6, 14);
  ctx.restore();
}

function checkBadge(ctx, x, y, s, col = '#2BD47D') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(0, 0, 60, 0, 7); ctx.fillStyle = col; ctx.fill();
  ctx.strokeStyle = '#1A1033'; ctx.lineWidth = 10; ctx.stroke();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-26, 2); ctx.lineTo(-6, 22); ctx.lineTo(28, -20); ctx.stroke();
  ctx.restore();
}
function crossBadge(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(0, 0, 60, 0, 7); ctx.fillStyle = '#FF3B5C'; ctx.fill();
  ctx.strokeStyle = '#1A1033'; ctx.lineWidth = 10; ctx.stroke();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 16; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-22, -22); ctx.lineTo(22, 22); ctx.moveTo(22, -22); ctx.lineTo(-22, 22); ctx.stroke();
  ctx.restore();
}

Object.assign(window, { W, H, clamp, lerp, ease, seg, pop, fadeIO, rng, hash, noise1, boing, txt, pill, sparkle, burstLines,
  puff, gasCloud, stinkLines, atom, shade, bond, moleculeH2S, moleculeCH4, rottenEgg, hazardSign, checkBadge, crossBadge });
