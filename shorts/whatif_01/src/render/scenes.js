// Scene painters. Each takes (ctx, state, t) and draws in 1080x1920 space.
const INK = '#1A1033';
const off = (w = W, h = H) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

// =====================================================================
// BATHROOM (front view)
// =====================================================================
const BATH = { floorY: 1120, vp: [540, 640], toiletX: 720, base: 1330, quixX: 280, quixY: 1372 };
let bathBG = null;

function paintBathBG() {
  const c = off(), g = c.getContext('2d');
  // upper wall
  let gr = g.createLinearGradient(0, 0, 0, 560);
  gr.addColorStop(0, '#155E68'); gr.addColorStop(1, '#1F7F87');
  g.fillStyle = gr; g.fillRect(0, 0, W, 560);
  // subtle wallpaper dots
  g.fillStyle = 'rgba(255,255,255,0.05)';
  for (let y = 30; y < 540; y += 60) for (let x = (y / 60 % 2) * 30; x < W; x += 60) { g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); }
  // subway tiles
  g.fillStyle = '#E4F1EF'; g.fillRect(0, 560, W, BATH.floorY - 560);
  for (let r = 0, y = 572; y < BATH.floorY; r++, y += 56) {
    for (let x = (r % 2) * -60; x < W; x += 120) {
      const tg = g.createLinearGradient(0, y, 0, y + 52);
      tg.addColorStop(0, '#F6FCFB'); tg.addColorStop(1, '#D3E8E5');
      g.fillStyle = tg; g.beginPath(); g.roundRect(x + 3, y + 2, 114, 50, 8); g.fill();
    }
  }
  // chair rail
  g.fillStyle = '#0F4A52'; g.fillRect(0, 548, W, 26);
  g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(0, 550, W, 4);
  // window
  g.save(); g.translate(860, 300);
  g.fillStyle = INK; g.beginPath(); g.roundRect(-140, -170, 280, 300, 24); g.fill();
  gr = g.createLinearGradient(0, -160, 0, 120); gr.addColorStop(0, '#7FD8FF'); gr.addColorStop(1, '#D8F4FF');
  g.fillStyle = gr; g.beginPath(); g.roundRect(-126, -156, 252, 272, 16); g.fill();
  g.fillStyle = '#FFE58A'; g.beginPath(); g.arc(50, -60, 44, 0, 7); g.fill();
  g.fillStyle = '#fff'; for (const [x, y, r] of [[-60, 20, 34], [-20, 10, 40], [20, 26, 30]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  g.fillStyle = INK; g.fillRect(-6, -156, 12, 272); g.fillRect(-126, -24, 252, 12);
  g.fillStyle = '#0F4A52'; g.beginPath(); g.roundRect(-160, 118, 320, 26, 10); g.fill();
  g.restore();
  // poster (series easter egg)
  g.save(); g.translate(250, 300); g.rotate(-0.04);
  g.fillStyle = INK; g.fillRect(-120, -150, 240, 300);
  gr = g.createLinearGradient(0, -140, 0, 140); gr.addColorStop(0, '#7B5CFF'); gr.addColorStop(1, '#3A1E9E');
  g.fillStyle = gr; g.fillRect(-106, -136, 212, 272);
  g.font = '190px Bungee'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = '#FFD43B'; g.shadowBlur = 30; g.fillStyle = '#FFD43B'; g.fillText('?', 0, -10);
  g.shadowBlur = 0; g.font = '34px Lilita'; g.fillStyle = '#fff'; g.fillText('WHAT IF?', 0, 108);
  g.restore();
  // floor (perspective checker)
  const [vx, vy] = BATH.vp, fy = BATH.floorY;
  const rows = []; for (let k = 0; k < 14; k++) rows.push(fy + 1300 * (1 - 1 / (1 + 0.16 * k)));
  const colX = (x0, y) => vx + (x0 - vx) * (y - vy) / (fy - vy);
  for (let k = 0; k < rows.length - 1; k++) for (let i = -14; i < 14; i++) {
    const x0 = 540 + i * 100, x1 = x0 + 100, y0 = rows[k], y1 = rows[k + 1];
    g.fillStyle = (i + k) % 2 ? '#2E2A55' : '#E7E3F5';
    g.beginPath(); g.moveTo(colX(x0, y0), y0); g.lineTo(colX(x1, y0), y0); g.lineTo(colX(x1, y1), y1); g.lineTo(colX(x0, y1), y1); g.fill();
  }
  gr = g.createLinearGradient(0, fy, 0, H); gr.addColorStop(0, 'rgba(10,5,30,0.45)'); gr.addColorStop(0.3, 'rgba(10,5,30,0.05)'); gr.addColorStop(1, 'rgba(10,5,30,0.6)');
  g.fillStyle = gr; g.fillRect(0, fy, W, H - fy);
  g.fillStyle = '#0F4A52'; g.fillRect(0, fy - 24, W, 30);
  // plant
  g.save(); g.translate(80, fy + 40);
  for (let i = 0; i < 7; i++) {
    const a = -1.9 + i * 0.25;
    g.save(); g.rotate(a + Math.PI / 2);
    g.fillStyle = i % 2 ? '#2FA35A' : '#3CC06B'; g.strokeStyle = INK; g.lineWidth = 6;
    g.beginPath(); g.ellipse(0, -170, 34, 150, 0, 0, 7); g.fill(); g.stroke();
    g.restore();
  }
  g.fillStyle = '#FF6B2C'; g.strokeStyle = INK; g.lineWidth = 8;
  g.beginPath(); g.moveTo(-80, -60); g.lineTo(80, -60); g.lineTo(62, 90); g.lineTo(-62, 90); g.closePath(); g.fill(); g.stroke();
  g.restore();
  // TP holder
  g.save(); g.translate(985, 945); g.strokeStyle = INK; g.lineWidth = 6; g.lineJoin = 'round';
  g.fillStyle = '#fff'; g.beginPath(); g.rect(-38, 40, 76, 120); g.fill(); g.stroke();
  g.setLineDash([7, 7]); g.beginPath(); g.moveTo(-38, 118); g.lineTo(38, 118); g.stroke(); g.setLineDash([]);
  g.fillStyle = '#B8C0D0'; g.beginPath(); g.roundRect(-74, -22, 148, 18, 9); g.fill(); g.stroke();
  const rg = g.createLinearGradient(0, -8, 0, 92); rg.addColorStop(0, '#FFFFFF'); rg.addColorStop(1, '#C8D1E4');
  g.fillStyle = rg; g.beginPath(); g.roundRect(-64, -10, 128, 100, 34); g.fill(); g.stroke();
  g.strokeStyle = 'rgba(140,155,190,0.6)'; g.lineWidth = 4;
  for (const x of [-30, 0, 30]) { g.beginPath(); g.moveTo(x, -4); g.lineTo(x, 84); g.stroke(); }
  g.restore();
  bathBG = c;
}

function toiletFront(ctx, st, t) {
  const cx = BATH.toiletX, b = BATH.base;
  ctx.save(); ctx.lineJoin = 'round';
  // floor shadow
  ctx.fillStyle = 'rgba(10,5,30,0.35)'; ctx.beginPath(); ctx.ellipse(cx, b + 4, 210, 30, 0, 0, 7); ctx.fill();
  const porcelain = (x0, y0, x1, y1) => {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.55, '#F1F5FB'); g.addColorStop(1, '#BCC8DC'); return g;
  };
  ctx.strokeStyle = INK; ctx.lineWidth = 10;
  // tank
  ctx.fillStyle = porcelain(cx - 130, 640, cx + 160, 860);
  ctx.beginPath(); ctx.roundRect(cx - 130, b - 690, 260, 230, 24); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(cx - 146, b - 712, 292, 44, 16); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#C9D2E3'; ctx.beginPath(); ctx.roundRect(cx - 120, b - 690, 18, 8, 3); ctx.fill();
  // lever
  ctx.fillStyle = '#D8DEEA'; ctx.beginPath(); ctx.roundRect(cx - 118, b - 640, 56, 18, 9); ctx.fill(); ctx.stroke();
  // lid up
  ctx.fillStyle = porcelain(cx - 118, 700, cx + 118, 950);
  ctx.beginPath(); ctx.ellipse(cx, b - 505, 118, 132, 0, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(160,175,205,0.35)'; ctx.beginPath(); ctx.ellipse(cx + 6, b - 500, 88, 100, 0, 0, 7); ctx.fill();
  // bowl body
  ctx.fillStyle = porcelain(cx - 180, 990, cx + 180, 1330);
  ctx.beginPath();
  ctx.moveTo(cx - 176, b - 342);
  ctx.bezierCurveTo(cx - 174, b - 220, cx - 110, b - 150, cx - 80, b - 130);
  ctx.bezierCurveTo(cx - 70, b - 80, cx - 80, b - 30, cx - 96, b);
  ctx.lineTo(cx + 96, b);
  ctx.bezierCurveTo(cx + 80, b - 30, cx + 70, b - 80, cx + 80, b - 130);
  ctx.bezierCurveTo(cx + 110, b - 150, cx + 174, b - 220, cx + 176, b - 342);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.ellipse(cx - 110, b - 250, 16, 50, 0.4, 0, 7); ctx.fill();
  // rim / seat
  ctx.fillStyle = porcelain(cx - 180, b - 400, cx + 180, b - 290);
  ctx.beginPath(); ctx.ellipse(cx, b - 345, 182, 60, 0, 0, 7); ctx.fill(); ctx.stroke();
  // opening + water
  const op = new Path2D(); op.ellipse(cx, b - 340, 130, 38, 0, 0, 7);
  ctx.save(); ctx.clip(op);
  let g = ctx.createLinearGradient(0, b - 380, 0, b - 300);
  g.addColorStop(0, '#5D6A88'); g.addColorStop(1, '#C9D3E6');
  ctx.fillStyle = g; ctx.fillRect(cx - 140, b - 380, 280, 90);
  const w = clamp(st.water == null ? 1 : st.water);
  if (w > 0.02) {
    const rx = 118 * (0.35 + 0.65 * w), ry = 28 * (0.35 + 0.65 * w), wy = b - 332 + (1 - w) * 6;
    g = ctx.createRadialGradient(cx, wy, 4, cx, wy, rx);
    g.addColorStop(0, '#1E78C8'); g.addColorStop(0.6, '#47B4F0'); g.addColorStop(1, '#9AE6FF');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, wy, rx, ry, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 4;
    const sw = st.drain || 0;
    if (sw > 0) {
      for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.ellipse(cx, wy, rx * (0.3 + k * 0.22), ry * (0.3 + k * 0.22), 0, t * 9 + k, t * 9 + k + 2.2); ctx.stroke(); }
    } else {
      for (let k = 0; k < 2; k++) { const ph = (t * 0.6 + k * 0.5) % 1; ctx.globalAlpha = 1 - ph; ctx.beginPath(); ctx.ellipse(cx, wy, rx * ph, ry * ph, 0, 0, 7); ctx.stroke(); }
      ctx.globalAlpha = 1;
    }
  }
  // drain hole
  ctx.fillStyle = '#0B0A18'; ctx.beginPath(); ctx.ellipse(cx, b - 330, 30 + 20 * (1 - w), 9 + 5 * (1 - w), 0, 0, 7);
  ctx.globalAlpha = 1 - w * 0.85; ctx.fill(); ctx.globalAlpha = 1;
  ctx.restore();
  ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.stroke(op);
  if (st.highlight) {
    ctx.save(); ctx.globalAlpha = st.highlight;
    ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 10; ctx.setLineDash([24, 16]); ctx.lineDashOffset = -t * 60;
    ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 20;
    ctx.beginPath(); ctx.ellipse(cx, b - 336, 158 + 8 * Math.sin(t * 6), 56, 0, 0, 7); ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

function drawBathroom(ctx, st, t, drawActors) {
  if (!bathBG) paintBathBG();
  ctx.drawImage(bathBG, 0, 0);
  // lamp glow
  ctx.save();
  const lg = ctx.createRadialGradient(470, 120, 10, 470, 120, 700);
  lg.addColorStop(0, `rgba(255,220,150,${0.35 * (st.light ?? 1)})`); lg.addColorStop(1, 'rgba(255,220,150,0)');
  ctx.fillStyle = lg; ctx.fillRect(0, 0, W, 1000);
  ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(470, 0); ctx.lineTo(470, 110); ctx.stroke();
  ctx.fillStyle = '#FF6B2C'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(400, 170); ctx.quadraticCurveTo(470, 60, 540, 170); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FFF4C8'; ctx.shadowColor = '#FFE08A'; ctx.shadowBlur = 40; ctx.beginPath(); ctx.ellipse(470, 172, 30, 12, 0, 0, 7); ctx.fill();
  ctx.restore();
  toiletFront(ctx, st, t);
  // gas pouring out of the bowl
  const fog = st.fog || 0;
  if (fog > 0) {
    const cx = BATH.toiletX, by = BATH.base - 345;
    for (let i = 0; i < 9; i++) {
      const life = (t * 0.55 + i / 9) % 1, a = Math.sin(life * Math.PI) * clamp(fog * 1.6);
      gasCloud(ctx, cx + Math.sin(i * 2.3 + t) * 60 + life * (i % 2 ? 160 : -200), by - life * 640, 0.55 + life * 0.9, a * 0.9, t, i + 3);
    }
  }
  if (drawActors) drawActors();
  if (fog > 0) {
    ctx.save();
    ctx.fillStyle = `rgba(110,200,60,${0.28 * fog})`; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 14; i++) {
      const x = (hash(i) * 1.4 - 0.2) * W + Math.sin(t * 0.4 + i) * 60, y = 300 + hash(i + 9) * 1300 + Math.cos(t * 0.3 + i) * 40;
      puff(ctx, x, y, 260 + hash(i + 3) * 200, 'rgba(140,230,80,0.55)', 0.5 * fog, i, t);
    }
    ctx.restore();
  }
  if (st.clean) {
    for (let i = 0; i < 16; i++) {
      const ph = (t * 0.7 + hash(i)) % 1;
      sparkle(ctx, hash(i + 5) * W, 300 + hash(i + 7) * 1100 - ph * 80, 26 * Math.sin(ph * Math.PI) + 4, st.clean);
    }
  }
}

// =====================================================================
// X-RAY cross-section (side view, front of toilet faces right)
// =====================================================================
const XR = { floor: 1350, cyan: '#5CE1FF', navy: '#071733' };
const BASIN = (() => {
  const p = new Path2D();
  p.moveTo(470, 965); p.lineTo(820, 965);
  p.bezierCurveTo(805, 1060, 760, 1120, 700, 1158);
  p.lineTo(640, 1142);
  p.bezierCurveTo(580, 1110, 510, 1060, 470, 965);
  p.closePath(); return p;
})();
const TRAP = (() => { // centreline of the S-shaped trapway
  const p = new Path2D();
  p.moveTo(672, 1140);
  p.bezierCurveTo(680, 1220, 640, 1262, 590, 1258);
  p.bezierCurveTo(540, 1254, 530, 1180, 520, 1120);
  p.bezierCurveTo(512, 1070, 462, 1060, 452, 1120);
  p.lineTo(452, 1500);
  return p;
})();
const STRAIGHT = (() => { const p = new Path2D(); p.moveTo(672, 1140); p.lineTo(672, 1500); return p; })();
const CREST_Y = 1086, TUBE = 70;

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

const xrWaterC = off();
function xrayToilet(ctx, st, t) {
  const cy = XR.cyan, trapOn = st.trap == null ? 1 : st.trap;
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // floor + ground
  ctx.fillStyle = 'rgba(92,225,255,0.07)'; ctx.fillRect(0, XR.floor, W, H - XR.floor);
  ctx.save(); ctx.beginPath(); ctx.rect(0, XR.floor, W, 140); ctx.clip();
  ctx.strokeStyle = 'rgba(92,225,255,0.18)'; ctx.lineWidth = 4;
  for (let x = -200; x < W; x += 36) { ctx.beginPath(); ctx.moveTo(x, XR.floor + 140); ctx.lineTo(x + 140, XR.floor); ctx.stroke(); }
  ctx.restore();
  glowStroke(ctx, (() => { const p = new Path2D(); p.moveTo(0, XR.floor); p.lineTo(W, XR.floor); return p; })(), 6, cy, 16);
  // outer shell
  const shell = new Path2D();
  shell.moveTo(300, 500); shell.lineTo(470, 500); shell.lineTo(470, 930);
  shell.lineTo(860, 930); shell.bezierCurveTo(900, 940, 900, 1000, 860, 1030);
  shell.bezierCurveTo(820, 1120, 760, 1180, 740, 1220);
  shell.bezierCurveTo(720, 1260, 730, 1320, 740, XR.floor); shell.lineTo(400, XR.floor);
  shell.bezierCurveTo(410, 1250, 400, 1100, 420, 930); shell.lineTo(300, 930); shell.closePath();
  ctx.fillStyle = 'rgba(92,225,255,0.10)'; ctx.fill(shell);
  glowStroke(ctx, shell, 7, cy, 22);
  // tank internals
  ctx.strokeStyle = 'rgba(92,225,255,0.55)'; ctx.lineWidth = 5;
  ctx.setLineDash([14, 10]); ctx.beginPath(); ctx.moveTo(310, 600); ctx.lineTo(462, 600); ctx.stroke(); ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(385, 920); ctx.lineTo(385, 700); ctx.stroke();
  ctx.beginPath(); ctx.arc(385, 690, 20, 0, 7); ctx.stroke();
  ctx.fillStyle = 'rgba(92,225,255,0.12)'; ctx.fillRect(306, 600, 158, 324);
  // seat line
  ctx.strokeStyle = cy; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(475, 945); ctx.lineTo(880, 945); ctx.stroke();

  // cavity: tube (trap or straight) + basin
  const tubePath = trapOn > 0.5 ? TRAP : STRAIGHT;
  const tubeVisible = st.hideTube ? 0 : 1;
  const clipT = (c, fn) => { c.save(); if (st.tubeClip != null) { c.beginPath(); c.rect(0, 0, W, st.tubeClip); c.clip(); } fn(); c.restore(); };
  if (tubeVisible) clipT(ctx, () => { ctx.strokeStyle = cy; ctx.shadowColor = cy; ctx.shadowBlur = 20; ctx.lineWidth = TUBE + 18; ctx.stroke(tubePath); });
  ctx.strokeStyle = cy; ctx.lineWidth = 18; ctx.stroke(BASIN);
  if (tubeVisible) clipT(ctx, () => { ctx.strokeStyle = XR.navy; ctx.lineWidth = TUBE; ctx.stroke(tubePath); });
  ctx.fillStyle = XR.navy; ctx.fill(BASIN);

  // water (mask = cavity interior)
  const w = st.water == null ? 1 : st.water;
  if (w > 0.01) {
    const wc = xrWaterC.getContext('2d');
    wc.clearRect(0, 0, W, H);
    wc.lineCap = 'round'; wc.lineJoin = 'round';
    wc.fillStyle = '#fff'; wc.fill(BASIN);
    if (tubeVisible) clipT(wc, () => { wc.strokeStyle = '#fff'; wc.lineWidth = TUBE; wc.stroke(tubePath); });
    wc.globalCompositeOperation = 'source-in';
    const level = trapOn > 0.5 ? CREST_Y - 6 + (1 - w) * 260 : lerp(1420, CREST_Y - 6, w);
    const gg = wc.createLinearGradient(0, level, 0, level + 260);
    gg.addColorStop(0, '#8FE9FF'); gg.addColorStop(1, '#1E78C8');
    wc.fillStyle = gg;
    wc.beginPath(); wc.moveTo(trapOn > 0.5 ? 488 : 0, level);
    for (let x = 488; x <= 900; x += 20) wc.lineTo(x, level + Math.sin(x * 0.05 + t * 5) * 4);
    wc.lineTo(900, H); wc.lineTo(trapOn > 0.5 ? 488 : 0, H); wc.closePath(); wc.fill();
    wc.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.92; ctx.drawImage(xrWaterC, 0, 0); ctx.globalAlpha = 1;
  }
  ctx.restore();
}

// particle snapshot of the trap (for delete / restore)
let trapParticles = null;
function buildTrapParticles() {
  const c = off(), g = c.getContext('2d');
  g.lineCap = 'round'; g.lineJoin = 'round';
  const seg = new Path2D(); // only the bend part (below the basin)
  seg.moveTo(672, 1150); seg.bezierCurveTo(680, 1220, 640, 1262, 590, 1258);
  seg.bezierCurveTo(540, 1254, 530, 1180, 520, 1120); seg.bezierCurveTo(512, 1070, 462, 1060, 452, 1120); seg.lineTo(452, 1340);
  g.strokeStyle = XR.cyan; g.lineWidth = TUBE + 18; g.stroke(seg);
  g.strokeStyle = '#FFD43B'; g.lineWidth = TUBE - 10; g.stroke(seg);
  g.strokeStyle = '#47B4F0'; g.lineWidth = TUBE - 26; g.stroke(seg);
  const d = g.getImageData(0, 0, W, H).data, R = rng(7), out = [], S = 11;
  for (let y = 1000; y < 1360; y += S) for (let x = 380; x < 760; x += S) {
    const i = ((y + 5) * W + x + 5) * 4;
    if (d[i + 3] > 100) out.push({ x, y, c: `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`, vx: (R() - 0.3) * 2, vy: -R() * 2.2 - 0.3, r: R() * 6.28, d: Math.hypot(x - 560, y - 1200) / 260 });
  }
  trapParticles = out;
}
// p: 0 = intact, 1 = fully dissolved
function trapDissolve(ctx, p, t) {
  if (!trapParticles) buildTrapParticles();
  ctx.save();
  for (const q of trapParticles) {
    const k = clamp((p * 1.6 - q.d * 0.6) / 0.9);
    if (k >= 1) continue;
    const e = k * k, x = q.x + q.vx * e * 420, y = q.y + q.vy * e * 420;
    ctx.globalAlpha = 1 - k;
    ctx.fillStyle = k > 0.05 ? (hash(q.x + q.y) > 0.5 ? '#FFF6C2' : q.c) : q.c;
    ctx.save(); ctx.translate(x + 5, y + 5); ctx.rotate(q.r * e * 3);
    const s = 11 * (1 - 0.5 * k); ctx.fillRect(-s / 2, -s / 2, s, s); ctx.restore();
  }
  ctx.restore();
}

function gasBubbles(ctx, t, mode, a = 1) {
  // mode 'blocked': rise in the outlet leg, bounce under the crest. 'free': rise through straight pipe into bowl.
  ctx.save(); ctx.globalAlpha *= a;
  for (let i = 0; i < 14; i++) {
    const ph = (t * 0.45 + i / 14) % 1;
    let x, y, r = 12 + hash(i) * 14;
    if (mode === 'blocked') {
      x = 452 + Math.sin(t * 3 + i) * 14; y = 1520 - ph * 420;
      if (y < CREST_Y + 70) { y = CREST_Y + 70 + Math.abs(Math.sin(t * 6 + i)) * 26; x = 452 + (hash(i + 4) - 0.5) * 30; }
    } else { x = 672 + Math.sin(t * 3 + i) * 16; y = 1560 - ph * 760; }
    ctx.fillStyle = 'rgba(126,219,62,0.85)'; ctx.strokeStyle = '#1B4D1A'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.25, 0, 7); ctx.fill();
  }
  ctx.restore();
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

// =====================================================================
// UNDERGROUND (world y continues below the x-ray floor)
// =====================================================================
const SEWER_Y = 3500;
let groundBG = null;
function paintGround() {
  const h = SEWER_Y + 700 - XR.floor, c = off(W, h), g = c.getContext('2d');
  let gr = g.createLinearGradient(0, 0, 0, h);
  gr.addColorStop(0, '#4B3427'); gr.addColorStop(0.6, '#2C1D17'); gr.addColorStop(1, '#140D0B');
  g.fillStyle = gr; g.fillRect(0, 0, W, h);
  g.fillStyle = '#5B6275'; g.fillRect(0, 0, W, 90);
  g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 4;
  for (let x = -100; x < W; x += 30) { g.beginPath(); g.moveTo(x, 90); g.lineTo(x + 90, 0); g.stroke(); }
  const R = rng(3);
  for (let i = 0; i < 260; i++) {
    const x = R() * W, y = 120 + R() * (h - 900), r = 6 + R() * 26;
    g.fillStyle = R() > 0.5 ? '#5E4535' : '#3A2920'; g.beginPath(); g.ellipse(x, y, r * 1.3, r, R() * 3, 0, 7); g.fill();
  }
  g.strokeStyle = '#6B4A33'; g.lineWidth = 7; g.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    let x = R() * W, y = 100; g.beginPath(); g.moveTo(x, y);
    for (let k = 0; k < 8; k++) { x += (R() - 0.5) * 80; y += 40 + R() * 50; g.lineTo(x, y); } g.stroke();
  }
  // bone easter egg
  g.save(); g.translate(230, 1250); g.rotate(0.5); g.fillStyle = '#E9E0C9'; g.strokeStyle = INK; g.lineWidth = 6;
  g.beginPath(); g.roundRect(-70, -12, 140, 24, 12); g.fill(); g.stroke();
  for (const sx of [-70, 70]) for (const sy of [-14, 14]) { g.beginPath(); g.arc(sx, sy, 18, 0, 7); g.fill(); g.stroke(); }
  g.restore();
  groundBG = c;
}

function drawSewer(ctx, oy, t) { // tunnel centred at world SEWER_Y, oy = world->screen offset
  const cx = 540, cy = SEWER_Y + oy, R = 430;
  ctx.save();
  // bricks
  ctx.fillStyle = '#6E3324'; ctx.beginPath(); ctx.arc(cx, cy, R + 70, 0, 7); ctx.fill();
  for (let ring = 0; ring < 2; ring++) {
    const r0 = R + ring * 35;
    for (let i = 0; i < 40; i++) {
      const a0 = (i + ring * 0.5) / 40 * 6.283, a1 = a0 + 6.283 / 40 - 0.02;
      ctx.fillStyle = (i + ring) % 3 ? '#9C4A33' : '#B85B3E';
      ctx.beginPath(); ctx.arc(cx, cy, r0 + 33, a0, a1); ctx.arc(cx, cy, r0 + 2, a1, a0, true); ctx.fill();
    }
  }
  ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(cx, cy, R + 72, 0, 7); ctx.stroke();
  // interior
  const g = ctx.createRadialGradient(cx, cy, 40, cx, cy, R);
  g.addColorStop(0, '#2E3A26'); g.addColorStop(1, '#0E140C');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip();
  // far tunnel rings
  for (let k = 1; k < 5; k++) { ctx.strokeStyle = `rgba(150,90,60,${0.25 - k * 0.04})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, R * (1 - k * 0.18), 0, 7); ctx.stroke(); }
  // sludge
  const wy = cy + R * 0.45;
  ctx.fillStyle = '#56622B';
  ctx.beginPath(); ctx.moveTo(cx - R, wy);
  for (let x = -R; x <= R; x += 20) ctx.lineTo(cx + x, wy + Math.sin(x * 0.03 + t * 3) * 8);
  ctx.lineTo(cx + R, cy + R); ctx.lineTo(cx - R, cy + R); ctx.fill();
  ctx.strokeStyle = '#8A9A45'; ctx.lineWidth = 5;
  for (let i = 0; i < 6; i++) { const x = cx - R + ((t * 120 + i * 160) % (2 * R)); ctx.beginPath(); ctx.moveTo(x, wy + 30 + i * 12); ctx.lineTo(x + 60, wy + 30 + i * 12); ctx.stroke(); }
  // green haze
  for (let i = 0; i < 6; i++) puff(ctx, cx - 300 + i * 120, wy - 80 - (i % 2) * 70, 160, 'rgba(126,219,62,0.5)', 0.45, i, t);
  // rat
  const rx = cx + 260 - ((t * 140) % 900), ry = wy - 8;
  ctx.fillStyle = '#0A0A10';
  ctx.beginPath(); ctx.ellipse(rx, ry - 30, 60, 32, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(rx - 62, ry - 40, 30, 22, -0.3, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(rx - 50, ry - 66, 14, 0, 7); ctx.fill();
  ctx.strokeStyle = '#0A0A10'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(rx + 55, ry - 26); ctx.quadraticCurveTo(rx + 130, ry - 70 + Math.sin(t * 8) * 20, rx + 170, ry - 30); ctx.stroke();
  ctx.fillStyle = '#FF4444'; ctx.shadowColor = '#FF4444'; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(rx - 74, ry - 46, 5, 0, 7); ctx.fill();
  ctx.restore();
  ctx.lineWidth = 10; ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
  // sign
  ctx.save(); ctx.translate(cx, cy - R - 150); ctx.rotate(-0.05 + Math.sin(t * 2) * 0.03);
  pill(ctx, 0, 0, 430, 120, '#FFD43B', INK, 10);
  txt(ctx, 'SEWER', 0, 6, { size: 76, font: 'Bungee', color: INK, shadow: false });
  ctx.restore();
  ctx.restore();
}

// world painter for dive / rise. camY = world y at screen top.
function drawUnderworld(ctx, camY, st, t) {
  if (!groundBG) paintGround();
  ctx.save(); ctx.translate(0, -camY);
  xrayBG(ctx, t);
  xrayToilet(ctx, { trap: 0, water: 0 }, t);
  ctx.drawImage(groundBG, 0, XR.floor);
  // the straight drain pipe through the ground into the sewer
  const p = new Path2D(); p.moveTo(672, XR.floor - 10); p.lineTo(672, SEWER_Y - 420);
  ctx.lineCap = 'butt';
  ctx.strokeStyle = INK; ctx.lineWidth = 104; ctx.stroke(p);
  ctx.strokeStyle = '#8D97AE'; ctx.lineWidth = 88; ctx.stroke(p);
  ctx.strokeStyle = '#B7C0D4'; ctx.lineWidth = 30; ctx.save(); ctx.translate(-18, 0); ctx.stroke(p); ctx.restore();
  for (let y = XR.floor + 200; y < SEWER_Y - 450; y += 420) { ctx.fillStyle = '#6E788F'; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.roundRect(610, y, 124, 36, 8); ctx.fill(); ctx.stroke(); }
  drawSewer(ctx, 0, t);
  // gas inside/around pipe
  if (st.gas) {
    for (let i = 0; i < 10; i++) {
      const y = st.gasY + i * 150 + Math.sin(t * 4 + i) * 20;
      gasCloud(ctx, 672 + Math.sin(t * 3 + i * 1.7) * 30, y, 0.55 + 0.1 * Math.sin(i), st.gas, t, i + 11);
    }
  }
  ctx.restore();
}

// =====================================================================
// HISTORY (1775) — parchment
// =====================================================================
let parchBG = null;
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

function pocketWatch(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const sw = Math.sin(t * 2.4) * 0.35; ctx.rotate(sw);
  ctx.strokeStyle = '#B8892E'; ctx.lineWidth = 8; ctx.setLineDash([10, 6]);
  ctx.beginPath(); ctx.moveTo(0, -330); ctx.lineTo(0, -130); ctx.stroke(); ctx.setLineDash([]);
  ctx.translate(0, 0);
  ctx.fillStyle = '#D4A23C'; ctx.strokeStyle = '#3A2A10'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.arc(0, -120, 22, 0, 7); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 120, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FFF8E6'; ctx.beginPath(); ctx.arc(0, 0, 96, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#3A2A10';
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; ctx.beginPath(); ctx.arc(Math.sin(a) * 78, -Math.cos(a) * 78, i % 3 ? 4 : 8, 0, 7); ctx.fill(); }
  ctx.lineCap = 'round';
  ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(t * 0.5) * 44, -Math.cos(t * 0.5) * 44); ctx.stroke();
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.sin(t * 6) * 70, -Math.cos(t * 6) * 70); ctx.stroke();
  ctx.restore();
}

function cameo(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#C9962F'; ctx.strokeStyle = '#3A2A10'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.ellipse(0, 0, 175, 215, 0, 0, 7); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 28; i++) { const a = i / 28 * 6.283; ctx.fillStyle = '#E2B54A'; ctx.beginPath(); ctx.arc(Math.cos(a) * 160, Math.sin(a) * 200, 9, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#F2E6CC'; ctx.beginPath(); ctx.ellipse(0, 0, 140, 180, 0, 0, 7); ctx.fill(); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 140, 180, 0, 0, 7); ctx.clip();
  // generic 18th-century gentleman silhouette (profile facing right)
  ctx.fillStyle = '#2B2116';
  ctx.beginPath();
  ctx.moveTo(-90, 190); ctx.bezierCurveTo(-90, 120, -60, 90, -30, 80);
  ctx.lineTo(-25, 50); ctx.bezierCurveTo(-60, 40, -78, 0, -74, -40);
  ctx.bezierCurveTo(-70, -110, -20, -130, 20, -122);
  ctx.bezierCurveTo(52, -116, 62, -90, 60, -64);
  ctx.lineTo(78, -30); ctx.lineTo(60, -22); ctx.lineTo(64, 0); ctx.lineTo(56, 6); ctx.lineTo(60, 18);
  ctx.bezierCurveTo(56, 40, 30, 44, 14, 44); ctx.lineTo(16, 76);
  ctx.bezierCurveTo(60, 90, 100, 120, 110, 190); ctx.closePath(); ctx.fill();
  // wig curls + queue bow
  for (const [cx, cy] of [[-60, -40], [-66, -6], [-58, 24]]) { ctx.beginPath(); ctx.arc(cx, cy, 20, 0, 7); ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(-74, 10); ctx.quadraticCurveTo(-110, 40, -96, 90); ctx.lineTo(-82, 88); ctx.quadraticCurveTo(-90, 40, -66, 20); ctx.fill();
  ctx.restore();
  ctx.restore();
}

function patentDoc(ctx, x, y, s, draw, glow, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.03);
  ctx.fillStyle = 'rgba(60,40,10,0.35)'; ctx.fillRect(-330 + 16, -380 + 20, 660, 760);
  ctx.fillStyle = '#FBF1D9'; ctx.strokeStyle = '#5A4220'; ctx.lineWidth = 6;
  ctx.fillRect(-330, -380, 660, 760); ctx.strokeRect(-330, -380, 660, 760);
  ctx.strokeRect(-310, -360, 620, 720);
  txt(ctx, 'PATENT', 0, -300, { size: 70, font: 'Bungee', color: '#5A4220', shadow: false });
  txt(ctx, 'A. CUMMING  ·  LONDON  ·  1775', 0, -240, { size: 30, font: 'Lilita', color: '#7A5A2A', shadow: false });
  ctx.strokeStyle = 'rgba(90,66,32,0.4)'; ctx.lineWidth = 5;
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(-270, -190 + i * 34); ctx.lineTo(270 - (i % 2) * 120, -190 + i * 34); ctx.stroke(); }
  // engraving: toilet + S-bend, drawn progressively
  const L = 2600;
  ctx.save(); ctx.translate(0, 110);
  ctx.strokeStyle = '#3A2A10'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.setLineDash([L, L]); ctx.lineDashOffset = L * (1 - clamp(draw * 1.4));
  ctx.beginPath();
  ctx.moveTo(-230, -200); ctx.lineTo(-120, -200); ctx.lineTo(-120, -40); ctx.lineTo(160, -40);
  ctx.bezierCurveTo(200, -30, 200, 20, 160, 40); ctx.bezierCurveTo(120, 110, 80, 130, 60, 150);
  ctx.lineTo(60, 220); ctx.lineTo(-140, 220); ctx.lineTo(-140, -40); ctx.moveTo(-230, -200); ctx.lineTo(-230, -40); ctx.lineTo(-120, -40);
  ctx.stroke();
  // S-bend
  ctx.lineDashOffset = L * (1 - clamp((draw - 0.3) * 1.6));
  const sb = new Path2D();
  sb.moveTo(40, 20); sb.bezierCurveTo(50, 120, 0, 150, -30, 140); sb.bezierCurveTo(-70, 130, -60, 60, -90, 50); sb.bezierCurveTo(-120, 40, -125, 80, -125, 120); sb.lineTo(-125, 260);
  if (glow > 0) { ctx.save(); ctx.setLineDash([]); ctx.shadowColor = '#FF9A1F'; ctx.shadowBlur = 40 * glow; ctx.strokeStyle = `rgba(255,170,40,${glow})`; ctx.lineWidth = 46; ctx.stroke(sb); ctx.restore(); }
  ctx.lineWidth = 30; ctx.stroke(sb);
  ctx.strokeStyle = '#FBF1D9'; ctx.lineWidth = 16; ctx.stroke(sb);
  ctx.restore();
  ctx.restore();
}

function waxSeal(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#B3202A'; ctx.strokeStyle = '#5A0E12'; ctx.lineWidth = 6;
  ctx.beginPath();
  for (let i = 0; i <= 18; i++) { const a = i / 18 * 6.283, r = 80 + (i % 2) * 10; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 56, 0, 7); ctx.stroke();
  txt(ctx, '?', 0, 6, { size: 80, font: 'Bungee', color: '#E45A60', shadow: false });
  ctx.restore();
}

// =====================================================================
// SINK with P-trap cutaway (pro tip)
// =====================================================================
function drawSinkScene(ctx, st, t) {
  // dim guest bathroom
  let g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#2A2F55'); g.addColorStop(1, '#151832');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  for (let y = 0; y < 1200; y += 64) for (let x = (y / 64 % 2) * 64; x < W; x += 128) ctx.fillRect(x, y, 62, 62);
  ctx.fillStyle = '#1B1E3A'; ctx.fillRect(0, 1240, W, H - 1240);
  // cobweb
  ctx.save(); ctx.strokeStyle = 'rgba(230,230,255,0.35)'; ctx.lineWidth = 3;
  for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(W, 0); ctx.lineTo(W - 260 * Math.cos(i * 0.3), 260 * Math.sin(i * 0.3)); ctx.stroke(); }
  for (let r = 60; r < 260; r += 50) { ctx.beginPath(); ctx.arc(W, 0, r, Math.PI / 2, Math.PI); ctx.stroke(); }
  ctx.restore();
  // mirror
  ctx.fillStyle = INK; ctx.beginPath(); ctx.roundRect(470, 230, 380, 330, 30); ctx.fill();
  g = ctx.createLinearGradient(480, 240, 840, 550); g.addColorStop(0, '#9FB4D8'); g.addColorStop(1, '#58688F');
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(486, 246, 348, 298, 20); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(540, 470); ctx.lineTo(640, 300); ctx.moveTo(590, 500); ctx.lineTo(670, 360); ctx.stroke();
  // vanity cabinet
  const cx = 660;
  ctx.fillStyle = '#E8E4F4'; ctx.strokeStyle = INK; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.roundRect(cx - 250, 660, 500, 70, 20); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#6E52F5'; ctx.beginPath(); ctx.roundRect(cx - 230, 730, 460, 520, 10); ctx.fill(); ctx.stroke();
  // basin + faucet
  ctx.fillStyle = '#F7F9FF'; ctx.beginPath(); ctx.ellipse(cx, 672, 190, 34, 0, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#C9D2E6'; ctx.beginPath(); ctx.ellipse(cx, 676, 150, 22, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#0B0A18'; ctx.beginPath(); ctx.ellipse(cx, 680, 16, 6, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#D9DFEA'; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.roundRect(cx - 18, 540, 36, 110, 10); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(cx - 18, 530, 120, 36, 18); ctx.fill(); ctx.stroke();
  ctx.save(); ctx.translate(cx, 520); ctx.rotate(st.tap || 0);
  ctx.beginPath(); ctx.roundRect(-60, -14, 120, 28, 14); ctx.fill(); ctx.stroke(); ctx.restore();
  if (st.flow > 0) {
    const fw = 14 * st.flow;
    g = ctx.createLinearGradient(cx + 80, 0, cx + 100, 0); g.addColorStop(0, '#7FD8FF'); g.addColorStop(1, '#D8F6FF');
    ctx.fillStyle = g; ctx.fillRect(cx + 86 - fw / 2, 566, fw, 106);
    for (let i = 0; i < 5; i++) { const ph = (t * 3 + i / 5) % 1; ctx.fillStyle = 'rgba(200,240,255,0.8)'; ctx.beginPath(); ctx.arc(cx + 86 + Math.sin(i * 9) * 30 * ph, 672 - ph * 20, 7 * (1 - ph), 0, 7); ctx.fill(); }
  }
  // cutaway window into cabinet
  const win = new Path2D(); win.roundRect(cx - 200, 760, 400, 460, 18);
  ctx.save(); ctx.clip(win);
  xrayBG(ctx, t);
  const pt = new Path2D();
  pt.moveTo(cx, 690); pt.lineTo(cx, 900);
  pt.bezierCurveTo(cx, 1010, cx + 150, 1010, cx + 150, 900);
  pt.lineTo(cx + 150, 880); pt.bezierCurveTo(cx + 150, 850, cx + 170, 840, cx + 210, 840);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = XR.cyan; ctx.shadowColor = XR.cyan; ctx.shadowBlur = 20; ctx.lineWidth = 78; ctx.stroke(pt); ctx.shadowBlur = 0;
  ctx.strokeStyle = XR.navy; ctx.lineWidth = 60; ctx.stroke(pt);
  // trap water
  const lv = st.level;
  const wc = xrWaterC.getContext('2d'); wc.clearRect(0, 0, W, H);
  wc.lineCap = 'round'; wc.lineJoin = 'round'; wc.strokeStyle = '#fff'; wc.lineWidth = 60; wc.stroke(pt);
  wc.globalCompositeOperation = 'source-in';
  const y0 = lerp(1000, 880, lv);
  g = wc.createLinearGradient(0, y0, 0, 1010); g.addColorStop(0, '#8FE9FF'); g.addColorStop(1, '#1E78C8');
  wc.fillStyle = g; wc.fillRect(cx - 60, y0 + Math.sin(t * 6) * 3, 260, 200);
  if (st.flow > 0) { wc.fillStyle = '#9AE6FF'; wc.fillRect(cx - 8, 690, 16 * st.flow, 300); }
  wc.globalCompositeOperation = 'source-over';
  ctx.drawImage(xrWaterC, 0, 0);
  if (st.stink > 0) gasBubblesSink(ctx, cx, t, st.stink);
  ctx.restore();
  ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.stroke(win);
  if (st.stink > 0) stinkLines(ctx, cx, 640, 260, t, st.stink);
  return { cx };
}
function gasBubblesSink(ctx, cx, t, a) {
  ctx.save(); ctx.globalAlpha *= a;
  for (let i = 0; i < 8; i++) {
    const ph = (t * 0.6 + i / 8) % 1, x = cx + 150 + Math.sin(t * 4 + i) * 10 - (ph > 0.5 ? (ph - 0.5) * 300 : 0), y = 900 - ph * 220;
    ctx.fillStyle = 'rgba(126,219,62,0.85)'; ctx.strokeStyle = '#1B4D1A'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(x, y, 11 + hash(i) * 8, 0, 7); ctx.fill(); ctx.stroke();
  }
  ctx.restore();
}

// =====================================================================
// HERO background (intro / outro)
// =====================================================================
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

// small everyday-object icons for the outro
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

Object.assign(window, { BATH, XR, drawBathroom, toiletFront, xrayBG, xrayToilet, trapDissolve, gasBubbles, label, drawUnderworld,
  SEWER_Y, paintParchment, pocketWatch, cameo, patentDoc, waxSeal, drawSinkScene, heroBG, icon, getParch: () => (parchBG || paintParchment(), parchBG) });
