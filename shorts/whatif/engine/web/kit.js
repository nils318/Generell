// Shared scene kit for all WHAT IF? episodes (backgrounds, labels, icons, effects).
const INK = '#1A1033';
const off = (w = W, h = H) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
let parchBG = null;
const XR = { floor: 1350, cyan: '#5CE1FF', navy: '#071733' }; // x-ray palette (floor used by EP01)
const getParch = () => (parchBG || paintParchment(), parchBG);

function xrayBG(ctx, t) {
  const g = ctx.createRadialGradient(560, 900, 100, 560, 900, 1300);
  g.addColorStop(0, '#0E2C5E'); g.addColorStop(1, '#030B1E');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(92,225,255,0.08)'; ctx.lineWidth = 2;
  for (let x = 0; x <= W; x += 54) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 54) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  ctx.fillStyle = 'rgba(92,225,255,0.035)';
  const sy = (t * 300) % H; ctx.fillRect(0, sy, W, 90);
}

function glowStroke(ctx, path, w, col, blur = 24) {
  ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = blur; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke(path); ctx.restore();
}

function label(ctx, s, x, y, ax, ay, a, col = '#FFD43B') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(a);
  ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.setLineDash([2, 14]);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(ax, ay); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(ax, ay, 12, 0, 7); ctx.fill();
  ctx.font = '64px Bungee'; const tw = ctx.measureText(s).width;
  const sc = ease.back(clamp(a * 1.2));
  ctx.translate(x, y); ctx.scale(sc, sc);
  pill(ctx, 0, 0, tw + 70, 100, col, INK, 8);
  txt(ctx, s, 0, 4, { size: 64, font: 'Bungee', color: INK, shadow: false });
  ctx.restore();
}

function paintParchment() {
  const c = off(), g = c.getContext('2d');
  let gr = g.createRadialGradient(540, 900, 200, 540, 960, 1300);
  gr.addColorStop(0, '#F3E3BD'); gr.addColorStop(0.7, '#DFC48F'); gr.addColorStop(1, '#9C7646');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  const R = rng(11);
  for (let i = 0; i < 9000; i++) { g.fillStyle = `rgba(90,60,20,${R() * 0.07})`; g.fillRect(R() * W, R() * H, 2 + R() * 3, 2 + R() * 3); }
  for (let i = 0; i < 18; i++) { g.fillStyle = `rgba(120,80,30,${0.04 + R() * 0.05})`; g.beginPath(); g.arc(R() * W, R() * H, 40 + R() * 140, 0, 7); g.fill(); }
  parchBG = c;
}

function heroBG(ctx, t, hue = 0) {
  const g = ctx.createRadialGradient(540, 900, 50, 540, 960, 1300);
  g.addColorStop(0, hue ? '#4E2BD8' : '#5B3BFF'); g.addColorStop(0.55, '#2A1280'); g.addColorStop(1, '#0D0530');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  burstLines(ctx, 540, 860, t, 'rgba(255,255,255,0.06)', 20);
  ctx.save(); ctx.globalAlpha = 0.5;
  for (let i = 0; i < 40; i++) {
    const x = hash(i) * W, y = (hash(i + 50) * H - t * (30 + hash(i + 9) * 60)) % H;
    sparkle(ctx, x, (y + H) % H, 4 + hash(i + 3) * 8, 0.6);
  }
  ctx.restore();
}

function icon(ctx, kind, x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = 8;
  if (kind === 'key') {
    ctx.fillStyle = '#FFD43B'; ctx.beginPath(); ctx.arc(-50, 0, 38, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2A1280'; ctx.beginPath(); ctx.arc(-50, 0, 13, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#FFD43B'; ctx.beginPath(); ctx.moveTo(-14, -12); ctx.lineTo(80, -12); ctx.lineTo(80, 4); ctx.lineTo(66, 4); ctx.lineTo(66, 22); ctx.lineTo(52, 22); ctx.lineTo(52, 12); ctx.lineTo(38, 12); ctx.lineTo(38, 24); ctx.lineTo(24, 24); ctx.lineTo(24, 12); ctx.lineTo(-14, 12); ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (kind === 'zip') {
    ctx.fillStyle = '#C9D2E6'; ctx.beginPath(); ctx.roundRect(-20, -80, 40, 160, 6); ctx.fill(); ctx.stroke();
    for (let i = -70; i < 70; i += 18) { ctx.fillStyle = '#7B8AA8'; ctx.fillRect(-26, i, 14, 10); ctx.fillRect(12, i + 9, 14, 10); }
    ctx.fillStyle = '#FF6B2C'; ctx.beginPath(); ctx.roundRect(-30, -20, 60, 50, 12); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(-14, 26, 28, 60, 10); ctx.fill(); ctx.stroke();
  } else if (kind === 'lace') {
    ctx.strokeStyle = INK; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(-90, 30); ctx.bezierCurveTo(-40, -60, 20, 80, 70, -10); ctx.stroke();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 12; ctx.stroke();
    ctx.fillStyle = '#4FD1FF'; ctx.strokeStyle = INK; ctx.lineWidth = 6;
    ctx.save(); ctx.translate(70, -10); ctx.rotate(-0.9); ctx.beginPath(); ctx.roundRect(-8, -14, 50, 28, 8); ctx.fill(); ctx.stroke(); ctx.restore();
  } else if (kind === 'pen') {
    ctx.fillStyle = '#4FD1FF'; ctx.beginPath(); ctx.roundRect(-100, -18, 160, 36, 10); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#F7F5FF'; ctx.beginPath(); ctx.moveTo(60, -18); ctx.lineTo(100, 0); ctx.lineTo(60, 18); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#2A1280'; ctx.beginPath(); ctx.roundRect(-110, -22, 60, 44, 10); ctx.fill(); ctx.stroke();
  } else if (kind === 'handle') {
    ctx.fillStyle = '#C9D2E6'; ctx.beginPath(); ctx.arc(-50, 0, 40, 0, 7); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.roundRect(-50, -18, 150, 36, 18); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

// cartoon smoke cloud with outline (exhaust / soot) — like gasCloud, but grey-brown
function smokeCloud(ctx, x, y, s, a, t, seed = 1, fill = '#6E625A') {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  const r = rng(seed), lobes = [];
  for (let i = 0; i < 6; i++) lobes.push([(r() - 0.5) * 130, (r() - 0.5) * 60, 44 + r() * 30, r() * 6]);
  const path = () => { ctx.beginPath(); for (const [lx, ly, lr, ph] of lobes) { const rr = lr * (1 + 0.06 * Math.sin(t * 3 + ph)); ctx.moveTo(lx + rr, ly); ctx.arc(lx, ly, rr, 0, 7); } };
  ctx.strokeStyle = '#231C1A'; ctx.lineWidth = 14; path(); ctx.stroke();
  ctx.fillStyle = fill; path(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  for (const [lx, ly, lr] of lobes) { ctx.beginPath(); ctx.arc(lx - lr * 0.3, ly - lr * 0.35, lr * 0.3, 0, 7); ctx.fill(); }
  ctx.restore();
}
