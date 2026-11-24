// EP03 painters — What if airplane windows had no breather hole?
const WIN = { x: 660, y: 800, w: 460, h: 660, r: 200, ow: 380, oh: 570, or: 165 };
const HOLE = { x: WIN.x, y: WIN.y + WIN.oh / 2 - 46 };
const SEAT_Y = 1385;

function winPath(w, h, r) { const p = new Path2D(); p.roundRect(WIN.x - w / 2, WIN.y - h / 2, w, h, r); return p; }
const WIN_OUT = winPath(WIN.w, WIN.h, WIN.r), WIN_IN = winPath(WIN.ow, WIN.oh, WIN.or);

let cabinBG = null;
function paintCabin() {
  const c = off(), g = c.getContext('2d');
  let gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, '#E9E6F2'); gr.addColorStop(1, '#D6D2E4');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(120,110,160,0.25)'; g.lineWidth = 4;
  for (const x of [120, 1000]) { g.beginPath(); g.moveTo(x, 280); g.lineTo(x, 1460); g.stroke(); }
  // overhead bin
  gr = g.createLinearGradient(0, 0, 0, 300); gr.addColorStop(0, '#C9C4DA'); gr.addColorStop(1, '#B4AECB');
  g.fillStyle = gr; g.beginPath(); g.moveTo(0, 0); g.lineTo(W, 0); g.lineTo(W, 220); g.quadraticCurveTo(540, 320, 0, 220); g.closePath(); g.fill();
  g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.moveTo(0, 220); g.quadraticCurveTo(540, 320, W, 220); g.stroke();
  g.fillStyle = '#8E88A8'; g.beginPath(); g.roundRect(470, 180, 140, 22, 11); g.fill();
  // seatbelt sign
  g.save(); g.translate(880, 120); g.fillStyle = '#2A2550'; g.beginPath(); g.roundRect(-70, -34, 140, 68, 18); g.fill();
  g.strokeStyle = '#FFD43B'; g.lineWidth = 7; g.lineCap = 'round';
  g.beginPath(); g.arc(-18, -4, 16, Math.PI * 0.2, Math.PI * 1.8); g.stroke(); g.beginPath(); g.arc(18, -4, 16, Math.PI * 1.2, Math.PI * 0.8); g.stroke();
  g.beginPath(); g.moveTo(-30, 14); g.lineTo(30, 14); g.stroke(); g.restore();
  // carpet
  gr = g.createLinearGradient(0, 1460, 0, H); gr.addColorStop(0, '#3E4266'); gr.addColorStop(1, '#22243A');
  g.fillStyle = gr; g.fillRect(0, 1460, W, H);
  g.fillStyle = 'rgba(255,255,255,0.05)'; for (let y = 1480; y < H; y += 40) for (let x = (y / 40 % 2) * 20; x < W; x += 40) g.fillRect(x, y, 8, 8);
  // window bezel
  g.save(); g.shadowColor = 'rgba(40,30,80,0.35)'; g.shadowBlur = 40; g.shadowOffsetY = 12;
  gr = g.createLinearGradient(WIN.x - WIN.w / 2, 0, WIN.x + WIN.w / 2, 0); gr.addColorStop(0, '#FBFAFF'); gr.addColorStop(1, '#DCD8EA');
  g.fillStyle = gr; g.fill(WIN_OUT); g.restore();
  g.strokeStyle = INK; g.lineWidth = 9; g.stroke(WIN_OUT);
  cabinBG = c;
}

function seat(ctx) {
  ctx.save(); ctx.lineJoin = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = 9;
  const g = ctx.createLinearGradient(40, 0, 360, 0); g.addColorStop(0, '#3A4C86'); g.addColorStop(1, '#25305A');
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.roundRect(50, 900, 250, 560, 60); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#E9E6F2'; ctx.beginPath(); ctx.roundRect(70, 920, 210, 90, 30); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#2E3C6E'; ctx.beginPath(); ctx.roundRect(30, SEAT_Y - 10, 400, 90, 36); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#5C6690'; ctx.beginPath(); ctx.roundRect(330, SEAT_Y - 90, 110, 40, 18); ctx.fill(); ctx.stroke();
  ctx.restore();
}

// outside view through the window (clipped by caller)
function skyView(ctx, t, st) {
  const x0 = WIN.x - WIN.ow / 2, y0 = WIN.y - WIN.oh / 2;
  const gold = st.gold || 0;
  const g = ctx.createLinearGradient(0, y0, 0, y0 + WIN.oh);
  g.addColorStop(0, gold ? `rgb(${lerp(28, 60, gold)},${lerp(80, 60, gold)},${lerp(200, 150, gold)})` : '#1C50C8');
  g.addColorStop(0.62, gold ? `rgb(255,${lerp(212, 160, gold)},${lerp(255, 120, gold)})` : '#8FD0FF');
  g.addColorStop(1, '#FFFFFF');
  ctx.fillStyle = g; ctx.fillRect(x0, y0, WIN.ow, WIN.oh);
  // cloud sea
  for (let i = 0; i < 14; i++) {
    const cx = x0 + (((i * 97 - t * 70) % 600) + 600) % 600 - 60, cy = y0 + WIN.oh * 0.72 + (i % 3) * 30;
    ctx.fillStyle = gold ? '#FFE3C4' : '#FFFFFF';
    ctx.beginPath(); ctx.arc(cx, cy, 50 + (i % 4) * 14, 0, 7); ctx.fill();
  }
  // wing
  const bob = Math.sin(t * 1.3) * 6;
  ctx.save(); ctx.translate(x0 - 40, y0 + WIN.oh * 0.66 + bob);
  ctx.fillStyle = '#C9CFDC'; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(0, 40); ctx.lineTo(330, -30); ctx.lineTo(360, -40); ctx.lineTo(370, -26); ctx.lineTo(60, 110); ctx.lineTo(0, 120); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FF6B2C'; ctx.beginPath(); ctx.moveTo(355, -42); ctx.lineTo(372, -110); ctx.lineTo(388, -104); ctx.lineTo(372, -28); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function frostPattern(ctx, k, seed) {
  if (k <= 0) return;
  const R = rng(seed);
  ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineCap = 'round';
  const x0 = WIN.x - WIN.ow / 2, y0 = WIN.y - WIN.oh / 2;
  const branch = (x, y, a, len, depth) => {
    if (depth > 4 || len < 8) return;
    const x2 = x + Math.cos(a) * len * k, y2 = y + Math.sin(a) * len * k;
    ctx.lineWidth = Math.max(1.5, 6 - depth); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x2, y2); ctx.stroke();
    branch(x2, y2, a + 0.5 + R() * 0.3, len * 0.62, depth + 1);
    branch(x2, y2, a - 0.5 - R() * 0.3, len * 0.62, depth + 1);
    branch((x + x2) / 2, (y + y2) / 2, a + (R() > 0.5 ? 1 : -1) * 0.9, len * 0.4, depth + 2);
  };
  for (let i = 0; i < 22; i++) {
    const side = i % 4, u = R();
    let x, y, a;
    if (side === 0) { x = x0 + u * WIN.ow; y = y0; a = Math.PI / 2; }
    else if (side === 1) { x = x0 + u * WIN.ow; y = y0 + WIN.oh; a = -Math.PI / 2; }
    else if (side === 2) { x = x0; y = y0 + u * WIN.oh; a = 0; }
    else { x = x0 + WIN.ow; y = y0 + u * WIN.oh; a = Math.PI; }
    branch(x, y, a + (R() - 0.5) * 0.6, 120 + R() * 90, 0);
  }
  ctx.restore();
}

// st: { fog, frost, hole (0..1 visible), holeGlow, gold }
function drawWindowGlass(ctx, st, t) {
  ctx.save(); ctx.clip(WIN_IN);
  skyView(ctx, t, st);
  const fog = st.fog || 0, frost = st.frost || 0;
  if (fog > 0) {
    ctx.fillStyle = `rgba(232,238,248,${0.78 * fog})`; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 40; i++) {
      const x = WIN.x - WIN.ow / 2 + hash(i) * WIN.ow, y = WIN.y - WIN.oh / 2 + hash(i + 50) * WIN.oh, r = 6 + hash(i + 9) * 14;
      ctx.fillStyle = `rgba(255,255,255,${0.7 * fog})`; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      ctx.strokeStyle = `rgba(140,160,200,${0.5 * fog})`; ctx.lineWidth = 2; ctx.stroke();
    }
  }
  if (frost > 0) {
    ctx.fillStyle = `rgba(225,240,255,${0.55 * frost})`; ctx.fillRect(0, 0, W, H);
    frostPattern(ctx, ease.out(frost), 11);
  }
  // glass sheen
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath(); ctx.moveTo(WIN.x - 150, WIN.y - 300); ctx.lineTo(WIN.x - 60, WIN.y - 300); ctx.lineTo(WIN.x - 220, WIN.y + 300); ctx.lineTo(WIN.x - 310, WIN.y + 300); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.stroke(WIN_IN);
  // shade pulled up
  ctx.save(); ctx.clip(WIN_IN);
  ctx.fillStyle = '#E2DEEE'; ctx.fillRect(WIN.x - WIN.ow / 2, WIN.y - WIN.oh / 2, WIN.ow, 48);
  ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(WIN.x - WIN.ow / 2, WIN.y - WIN.oh / 2 + 48); ctx.lineTo(WIN.x + WIN.ow / 2, WIN.y - WIN.oh / 2 + 48); ctx.stroke();
  ctx.fillStyle = '#8E88A8'; ctx.beginPath(); ctx.roundRect(WIN.x - 40, WIN.y - WIN.oh / 2 + 36, 80, 18, 9); ctx.fill();
  ctx.restore();
  // the breather hole
  const hv = st.hole == null ? 1 : st.hole;
  if (hv > 0) drawHole(ctx, hv);
  if (st.holeGlow) {
    ctx.save(); ctx.globalAlpha = st.holeGlow; ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 6; ctx.setLineDash([12, 9]); ctx.lineDashOffset = -t * 40;
    ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(HOLE.x, HOLE.y, 30 + 3 * Math.sin(t * 8), 0, 7); ctx.stroke(); ctx.restore();
  }
}
function drawHole(ctx, a = 1) {
  ctx.save(); ctx.globalAlpha *= a;
  ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(HOLE.x + 2, HOLE.y + 2, 9, 0, 7); ctx.fill();
  ctx.fillStyle = '#101426'; ctx.beginPath(); ctx.arc(HOLE.x, HOLE.y, 7, 0, 7); ctx.fill();
  ctx.restore();
}
const holeDissolve = makeDissolver(g => {
  g.fillStyle = '#FFD43B'; g.beginPath(); g.arc(HOLE.x, HOLE.y, 22, 0, 7); g.fill();
  g.fillStyle = '#101426'; g.beginPath(); g.arc(HOLE.x, HOLE.y, 12, 0, 7); g.fill();
}, [HOLE.x - 30, HOLE.y - 30, HOLE.x + 30, HOLE.y + 30], 5);

function drawCabin(ctx, st, t, actors) {
  if (!cabinBG) paintCabin();
  ctx.drawImage(cabinBG, 0, 0);
  // seatbelt sign glow
  if (st.belt) { ctx.save(); ctx.globalAlpha = st.belt; ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 30; ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(810, 86, 140, 68, 18); ctx.stroke(); ctx.restore(); }
  drawWindowGlass(ctx, st, t);
  seat(ctx);
  if (actors) actors();
}

// ------------------------------------------------------------------ cross-section
const PANES = { y0: 500, y1: 1170, inner: 400, middle: 570, outer: 740, holeY: 1112 };
const tri = u => { u = ((u % 2) + 2) % 2; return u < 1 ? u : 2 - u; };

function paneRect(ctx, x, w, bow, col, glow, holeGap) {
  const { y0, y1, holeY } = PANES, mid = (y0 + y1) / 2;
  const shape = (x0, x1) => {
    const p = new Path2D();
    p.moveTo(x0, y0); p.quadraticCurveTo(x0 + bow * 2, mid, x0, y1); p.lineTo(x1, y1); p.quadraticCurveTo(x1 + bow * 2, mid, x1, y0); p.closePath();
    return p;
  };
  const p = shape(x - w / 2, x + w / 2);
  ctx.save();
  if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = 40; }
  ctx.fillStyle = col; ctx.fill(p); ctx.restore();
  ctx.strokeStyle = glow || XR.cyan; ctx.lineWidth = 5; ctx.stroke(p);
  if (holeGap) { // punch the breather hole
    ctx.fillStyle = '#061630'; ctx.fillRect(x - w / 2 - 4, holeY - holeGap / 2, w + 8, holeGap);
  }
}

// st: { hole 0/1, bowOuter, bowMiddle, strain, particles, labels {...} }
function drawSection(ctx, st, t) {
  xrayBG(ctx, t);
  const { y0, y1, inner, middle, outer, holeY } = PANES;
  // regions
  ctx.fillStyle = 'rgba(92,225,255,0.10)'; ctx.fillRect(0, y0, middle - 13, y1 - y0);
  ctx.fillStyle = `rgba(92,225,255,${st.hole ? 0.10 : 0.04})`; ctx.fillRect(middle + 13, y0, outer - middle - 33, y1 - y0);
  // frame
  ctx.fillStyle = '#16244A'; ctx.fillRect(0, y0 - 60, W, 60); ctx.fillRect(0, y1, W, 60);
  ctx.strokeStyle = XR.cyan; ctx.lineWidth = 4; ctx.strokeRect(-10, y0 - 60, W + 20, 60); ctx.strokeRect(-10, y1, W + 20, 60);
  // air particles
  const dens = [[0, middle - 16, 70], [middle + 16, outer - 22, st.hole ? 26 : 12], [outer + 22, W, 9]];
  dens.forEach(([x0, x1, n], r) => {
    for (let i = 0; i < n; i++) {
      const sp = 0.25 + hash(i + r * 100) * 0.5;
      const x = x0 + 10 + tri(hash(i * 3 + r) * 2 + t * sp) * (x1 - x0 - 20), y = y0 + 10 + tri(hash(i * 7 + r + 1) * 2 + t * sp * 0.8) * (y1 - y0 - 20);
      ctx.fillStyle = r === 2 ? 'rgba(180,230,255,0.6)' : '#8FE9FF';
      ctx.beginPath(); ctx.arc(x, y, r === 2 ? 6 : 8, 0, 7); ctx.fill();
    }
  });
  // particles squeezing through the hole
  if (st.hole) for (let i = 0; i < 3; i++) {
    const u = (t * 0.6 + i / 3) % 1, x = lerp(middle - 50, middle + 50, i % 2 ? u : 1 - u);
    ctx.fillStyle = '#FFD43B'; ctx.beginPath(); ctx.arc(x, holeY, 8, 0, 7); ctx.fill();
  }
  // panes
  paneRect(ctx, inner, 16, 0, 'rgba(92,225,255,0.25)');
  paneRect(ctx, middle, 26, st.bowMiddle || 0, 'rgba(92,225,255,0.3)', st.strain ? `rgba(255,59,92,${0.6 + 0.4 * Math.sin(t * 9)})` : null, st.hole ? 18 : 0);
  paneRect(ctx, outer, 40, st.bowOuter || 0, 'rgba(92,225,255,0.35)', '#FFD43B');
  // load arrows on panes that carry the pressure
  const arrows = (x, a, col) => {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 5;
    for (let i = 0; i < 4; i++) {
      const y = y0 + 100 + i * 160, push = 10 * Math.sin(t * 4 + i);
      ctx.beginPath(); ctx.moveTo(x + push, y - 22); ctx.lineTo(x + 50 + push, y - 22); ctx.lineTo(x + 50 + push, y - 44); ctx.lineTo(x + 95 + push, y); ctx.lineTo(x + 50 + push, y + 44); ctx.lineTo(x + 50 + push, y + 22); ctx.lineTo(x + push, y + 22); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  };
  arrows(outer + 30 + (st.bowOuter || 0), st.loadOuter || 0, '#FFD43B');
  arrows(middle + 20 + (st.bowMiddle || 0), st.loadMiddle || 0, '#FF3B5C');
  // region labels
  txt(ctx, 'CABIN', 190, y0 - 120, { size: 58, font: 'Bungee', color: '#8FE9FF', stroke: 12 });
  txt(ctx, 'OUTSIDE', 920, y0 - 120, { size: 50, font: 'Bungee', color: '#fff', stroke: 12 });
  txt(ctx, '-50°C · THIN AIR', 920, y0 - 60 + 30, { size: 30, color: '#BFE8FF', shadow: false });
  const la = st.paneLabels || 0;
  if (la > 0) {
    chip(ctx, 'INNER', inner - 40, y1 + 110, pop(la, 0, 0.6), null, 36);
    chip(ctx, 'MIDDLE', middle + 10, y1 + 110, pop(la, 0.15, 0.6), null, 36);
    chip(ctx, 'OUTER', outer + 70, y1 + 110, pop(la, 0.3, 0.6), null, 36);
  }
}

Object.assign(window, { WIN, HOLE, SEAT_Y, drawCabin, holeDissolve, drawHole, drawSection, PANES });
