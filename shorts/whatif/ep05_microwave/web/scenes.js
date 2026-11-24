// EP05 painters — What if microwaves had no metal mesh in the door?
const COUNTER = 1250;
const MW = { x: 300, y: 800, w: 680, h: 450 };              // microwave body (top-left + size)
const WIN5 = { x: MW.x + 40, y: MW.y + 50, w: 440, h: 330 }; // door window
const WIN5_C = [WIN5.x + WIN5.w / 2, WIN5.y + WIN5.h / 2];

let kitchenBG = null;
function paintKitchen() {
  const c = off(), g = c.getContext('2d');
  let gr = g.createLinearGradient(0, 0, 0, COUNTER); gr.addColorStop(0, '#FFE1C2'); gr.addColorStop(1, '#F6C79A');
  g.fillStyle = gr; g.fillRect(0, 0, W, COUNTER);
  // tile backsplash
  for (let y = 520; y < COUNTER; y += 70) for (let x = ((y / 70) % 2) * 35 - 35; x < W; x += 70) {
    g.fillStyle = '#FFF4E6'; g.beginPath(); g.roundRect(x + 3, y + 3, 64, 64, 8); g.fill();
  }
  g.fillStyle = '#E8A66A'; g.fillRect(0, 500, W, 20);
  // upper cabinets
  g.fillStyle = '#7B5CFF'; g.strokeStyle = INK; g.lineWidth = 8;
  for (const x of [-20, 360, 740]) { g.beginPath(); g.roundRect(x, 60, 360, 380, 22); g.fill(); g.stroke(); g.fillStyle = '#FFD43B'; g.beginPath(); g.roundRect(x + 160, 370, 40, 14, 7); g.fill(); g.fillStyle = '#7B5CFF'; }
  // counter
  gr = g.createLinearGradient(0, COUNTER, 0, COUNTER + 70); gr.addColorStop(0, '#C98A55'); gr.addColorStop(1, '#9A6236');
  g.fillStyle = gr; g.fillRect(0, COUNTER, W, 70); g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.moveTo(0, COUNTER); g.lineTo(W, COUNTER); g.stroke();
  gr = g.createLinearGradient(0, COUNTER + 70, 0, H); gr.addColorStop(0, '#6E4A2E'); gr.addColorStop(1, '#2A1A10');
  g.fillStyle = gr; g.fillRect(0, COUNTER + 70, W, H);
  g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 5;
  for (const x of [270, 540, 810]) { g.beginPath(); g.moveTo(x, COUNTER + 90); g.lineTo(x, H); g.stroke(); }
  kitchenBG = c;
}

function meshPath() { // perforated sheet over the window: rect minus holes (evenodd)
  const p = new Path2D(); p.rect(WIN5.x, WIN5.y, WIN5.w, WIN5.h);
  for (let y = WIN5.y + 9; y < WIN5.y + WIN5.h; y += 18) for (let x = WIN5.x + 9 + ((y / 18) % 2) * 9; x < WIN5.x + WIN5.w; x += 18) { p.moveTo(x + 5.5, y); p.arc(x, y, 5.5, 0, 7); }
  return p;
}
const MESH = meshPath();

function popcornBag(ctx, x, y, s, puff, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineJoin = 'round';
  const w = 120 + 40 * puff, h = 60 + 40 * puff;
  ctx.fillStyle = '#F4EBD6'; ctx.strokeStyle = INK; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.ellipse(0, -h / 2, w / 2, h / 2, 0, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FF3B5C'; ctx.fillRect(-w / 4, -h + 8, w / 2, h - 16);
  txt(ctx, 'POP', 0, -h / 2, { size: 22, font: 'Bungee', color: '#fff', shadow: false });
  ctx.restore();
}

// st: { run 0..1 (light/turntable), mesh 0..1, leak 0..1, glowMesh, puff }
function drawMicrowave(ctx, st, t) {
  ctx.save(); ctx.lineJoin = 'round';
  ctx.fillStyle = 'rgba(40,20,10,0.3)'; ctx.beginPath(); ctx.ellipse(MW.x + MW.w / 2, COUNTER + 4, MW.w / 2 + 20, 18, 0, 0, 7); ctx.fill();
  let g = ctx.createLinearGradient(MW.x, MW.y, MW.x + MW.w, MW.y + MW.h); g.addColorStop(0, '#FAFAFF'); g.addColorStop(1, '#C9CEDC');
  ctx.fillStyle = g; ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(MW.x, MW.y, MW.w, MW.h, 30); ctx.fill(); ctx.stroke();
  // feet
  ctx.fillStyle = INK; ctx.fillRect(MW.x + 40, MW.y + MW.h - 2, 50, 14); ctx.fillRect(MW.x + MW.w - 90, MW.y + MW.h - 2, 50, 14);
  // door
  ctx.fillStyle = '#E6E9F2'; ctx.beginPath(); ctx.roundRect(MW.x + 18, MW.y + 20, 490, MW.h - 40, 20); ctx.fill(); ctx.stroke();
  // interior through window
  ctx.save(); ctx.beginPath(); ctx.roundRect(WIN5.x, WIN5.y, WIN5.w, WIN5.h, 16); ctx.clip();
  const run = st.run || 0;
  g = ctx.createLinearGradient(0, WIN5.y, 0, WIN5.y + WIN5.h);
  g.addColorStop(0, run ? `rgb(${lerp(40, 255, run)},${lerp(40, 214, run)},${lerp(60, 120, run)})` : '#2A2E44'); g.addColorStop(1, run ? '#C98A2F' : '#1A1D2E');
  ctx.fillStyle = g; ctx.fillRect(WIN5.x, WIN5.y, WIN5.w, WIN5.h);
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(WIN5_C[0], WIN5.y + WIN5.h - 50, 180, 32, 0, 0, 7); ctx.fill();
  popcornBag(ctx, WIN5_C[0] + Math.sin(t * 2) * 60 * run, WIN5.y + WIN5.h - 50, 1, st.puff || 0, Math.sin(t * 2) * 0.1);
  if (run && st.pops) for (let i = 0; i < 5; i++) {
    const ph = (t * 1.6 + hash(i)) % 1;
    ctx.fillStyle = '#FFF7DA'; ctx.beginPath(); ctx.arc(WIN5_C[0] - 80 + hash(i + 3) * 160, WIN5.y + WIN5.h - 80 - ph * 150, 12, 0, 7); ctx.fill();
  }
  // mesh
  const mesh = st.mesh == null ? 1 : st.mesh;
  if (mesh > 0) { ctx.globalAlpha = mesh; ctx.fillStyle = '#1C1F2E'; ctx.fill(MESH, 'evenodd'); ctx.globalAlpha = 1; }
  ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.moveTo(WIN5.x + 60, WIN5.y); ctx.lineTo(WIN5.x + 150, WIN5.y); ctx.lineTo(WIN5.x + 40, WIN5.y + WIN5.h); ctx.lineTo(WIN5.x - 50, WIN5.y + WIN5.h); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(WIN5.x, WIN5.y, WIN5.w, WIN5.h, 16); ctx.stroke();
  if (st.glowMesh) {
    ctx.save(); ctx.globalAlpha = st.glowMesh; ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 9; ctx.setLineDash([20, 12]); ctx.lineDashOffset = -t * 50;
    ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 20; ctx.beginPath(); ctx.roundRect(WIN5.x - 16, WIN5.y - 16, WIN5.w + 32, WIN5.h + 32, 24); ctx.stroke(); ctx.restore();
  }
  // handle
  ctx.fillStyle = '#B8C0D0'; ctx.beginPath(); ctx.roundRect(MW.x + 470, MW.y + 70, 22, 310, 11); ctx.fill(); ctx.stroke();
  // control panel
  ctx.fillStyle = '#2A2E44'; ctx.beginPath(); ctx.roundRect(MW.x + 530, MW.y + 40, 120, 70, 12); ctx.fill(); ctx.stroke();
  txt(ctx, run ? '0:' + String(30 - Math.floor(t % 30)).padStart(2, '0') : '12:00', MW.x + 590, MW.y + 78, { size: 34, font: 'Bungee', color: '#5CFF9A', shadow: false });
  for (let i = 0; i < 9; i++) { ctx.fillStyle = '#C9CEDC'; ctx.beginPath(); ctx.roundRect(MW.x + 540 + (i % 3) * 36, MW.y + 140 + Math.floor(i / 3) * 44, 28, 32, 8); ctx.fill(); ctx.lineWidth = 4; ctx.stroke(); }
  ctx.fillStyle = '#FF6B2C'; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(MW.x + 540, MW.y + 290, 100, 60, 16); ctx.fill(); ctx.stroke();
  txt(ctx, 'START', MW.x + 590, MW.y + 322, { size: 24, font: 'Bungee', color: '#fff', shadow: false });
  ctx.restore();
  // leaking waves
  const leak = st.leak || 0;
  if (leak > 0) {
    ctx.save(); ctx.lineCap = 'round';
    for (let k = 0; k < 6; k++) {
      const ph = ((t * 0.9 + k / 6) % 1), r = 60 + ph * 900;
      ctx.globalAlpha = leak * (1 - ph) * 0.9;
      for (const [lw, c] of [[22, '#FF8A1F'], [10, '#FFE27A']]) {
        ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const a = -Math.PI * 0.95 + i / 60 * Math.PI * 1.9, rr = r + 14 * Math.sin(i * 1.3 - t * 12);
          const x = WIN5_C[0] + Math.cos(a) * rr * 1.1, y = WIN5_C[1] + Math.sin(a) * rr * 0.8;
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
    }
    ctx.restore();
  }
}
const meshDissolve = makeDissolver(g => { g.fillStyle = '#5C6690'; g.fill(MESH, 'evenodd'); }, [WIN5.x, WIN5.y, WIN5.x + WIN5.w, WIN5.y + WIN5.h], 10);

function drawKitchen(ctx, st, t, actors) {
  if (!kitchenBG) paintKitchen();
  ctx.drawImage(kitchenBG, 0, 0);
  drawMicrowave(ctx, st, t);
  if (actors) actors();
  if (st.heat) { ctx.fillStyle = `rgba(255,90,40,${0.18 * st.heat})`; ctx.fillRect(0, 0, W, H); }
}

function wifiIcon(ctx, x, y, s, bars, dead, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const on = bars > i;
    for (const [lw, c] of [[34, INK], [20, on ? (dead ? '#FF3B5C' : '#2BD47D') : 'rgba(255,255,255,0.35)']]) {
      ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); ctx.arc(0, 60, 60 + i * 55, -Math.PI * 0.78, -Math.PI * 0.22); ctx.stroke();
    }
  }
  ctx.fillStyle = dead ? '#FF3B5C' : '#2BD47D'; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, 60, 20, 0, 7); ctx.fill(); ctx.stroke();
  ctx.restore();
  if (dead) crossBadge(ctx, x + 120 * s, y - 40 * s, 0.9 * s);
}

function h2o(ctx, x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  const a = 0.91, L = 92;
  const h1 = [-Math.sin(a) * L, Math.cos(a) * L], h2 = [Math.sin(a) * L, Math.cos(a) * L];
  bond(ctx, 0, 0, ...h1); bond(ctx, 0, 0, ...h2);
  atom(ctx, ...h1, 36, '#F2F2FA', 'H'); atom(ctx, ...h2, 36, '#F2F2FA', 'H'); atom(ctx, 0, 0, 62, '#FF5A5A', 'O', '#fff');
  ctx.restore();
}

// wavelength board: wave hits a perforated plate. st: { ruler, holes, bounce, light }
function drawWaveBoard(ctx, st, t) {
  xrayBG(ctx, t);
  const plateX = 720;
  // plate with holes (side view)
  ctx.fillStyle = '#5C6690'; ctx.strokeStyle = INK; ctx.lineWidth = 6;
  for (let y = 480; y < 1300; y += 36) { ctx.beginPath(); ctx.roundRect(plateX - 14, y, 28, 26, 4); ctx.fill(); ctx.stroke(); }
  txt(ctx, 'MESH', plateX, 430, { size: 44, font: 'Bungee', color: '#fff', stroke: 10 });
  // big microwave (wavelength ~12 cm)
  const amp = 150, lam = 520, y0 = 900;
  const ph = t * 3, bounce = st.bounce || 0;
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [lw, c] of [[26, INK], [14, '#FF8A1F']]) {
    ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath();
    for (let x = 60; x <= plateX - 30; x += 6) { const y = y0 + amp * Math.sin((x / lam) * 6.283 - ph); x === 60 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
    ctx.stroke();
  }
  ctx.restore();
  if (bounce > 0) { // reflection arrow
    ctx.save(); ctx.globalAlpha = bounce; ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 14; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(plateX - 60, 1150); ctx.quadraticCurveTo(plateX - 200, 1230, plateX - 380, 1180); ctx.stroke();
    ctx.fillStyle = '#FFD43B'; ctx.beginPath(); ctx.moveTo(plateX - 400, 1175); ctx.lineTo(plateX - 350, 1140); ctx.lineTo(plateX - 355, 1210); ctx.closePath(); ctx.fill();
    txt(ctx, 'BOUNCES BACK', plateX - 230, 1290, { size: 40, font: 'Bungee', color: '#FFD43B', stroke: 10 });
    ctx.restore();
  }
  // ruler for one wavelength
  if (st.ruler > 0) {
    ctx.save(); ctx.globalAlpha = st.ruler; ctx.strokeStyle = '#fff'; ctx.lineWidth = 6;
    const xa = 60 + ((ph / 6.283 * lam) % lam) + 130, xb = xa + lam;
    const xA = Math.min(xa, plateX - 40 - lam), xB = xA + lam;
    ctx.beginPath(); ctx.moveTo(xA, 640); ctx.lineTo(xB, 640); ctx.moveTo(xA, 615); ctx.lineTo(xA, 665); ctx.moveTo(xB, 615); ctx.lineTo(xB, 665); ctx.stroke();
    ctx.restore();
    pill(ctx, (xA + xB) / 2, 580, 300, 84, '#FFD43B', INK, 7);
    txt(ctx, '≈ 12 CM', (xA + xB) / 2, 584, { size: 46, font: 'Bungee', color: INK, shadow: false });
  }
  if (st.holes > 0) chip(ctx, 'HOLES: 1–2 MM', plateX + 10, 1390, ease.back(clamp(st.holes)), '#5C6690', 42);
  // light passes
  if (st.light > 0) {
    ctx.save(); ctx.globalAlpha = st.light;
    for (let i = 0; i < 14; i++) {
      const u = (t * 0.7 + i / 14) % 1, x = lerp(120, 1060, u), y = 500 + (i % 7) * 108 + 18;
      ctx.strokeStyle = '#FFF6A8'; ctx.lineWidth = 5; ctx.beginPath();
      for (let k = 0; k < 10; k++) { const xx = x - k * 6, yy = y + 6 * Math.sin(k * 1.8 + t * 20); k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.stroke();
      ctx.fillStyle = '#FFF6A8'; ctx.shadowColor = '#FFF6A8'; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    }
    ctx.restore();
    bigLabel(ctx, 'LIGHT FITS ✓', 900, 1180, null, null, st.light, 40, '#FFF6A8');
  }
}

// 1945 lab
function magnetron(ctx, x, y, s, glow, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  ctx.fillStyle = '#6B675C'; ctx.strokeStyle = '#2B2116'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.roundRect(-150, -120, 300, 240, 20); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 6; i++) { ctx.fillStyle = '#8A8678'; ctx.fillRect(-130 + i * 46, -140, 30, 20); ctx.strokeRect(-130 + i * 46, -140, 30, 20); }
  ctx.fillStyle = '#3A352A'; ctx.beginPath(); ctx.arc(0, 0, 70, 0, 7); ctx.fill(); ctx.stroke();
  if (glow) { ctx.save(); ctx.shadowColor = '#FF8A1F'; ctx.shadowBlur = 60 * glow; ctx.fillStyle = `rgba(255,160,60,${glow})`; ctx.beginPath(); ctx.arc(0, 0, 44 + 6 * Math.sin(t * 12), 0, 7); ctx.fill(); ctx.restore(); }
  ctx.restore();
  txt(ctx, 'MAGNETRON', x, y + 170 * s, { size: 40, font: 'Bungee', color: '#5A4220', shadow: false });
}
function candyBar(ctx, x, y, melt, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.25); ctx.lineJoin = 'round';
  ctx.fillStyle = '#C8262E'; ctx.strokeStyle = INK; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.roundRect(-70, -26, 90, 52, 8); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#5A3420'; ctx.beginPath(); ctx.moveTo(20, -24); ctx.lineTo(90 - 30 * melt, -24 + 20 * melt); ctx.lineTo(90 - 30 * melt, 24 + 30 * melt); ctx.lineTo(20, 24); ctx.closePath(); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 3; i++) if (melt > 0.2) {
    const len = 30 + 120 * melt * (0.6 + 0.4 * Math.sin(i * 2 + t));
    ctx.fillStyle = '#5A3420'; ctx.beginPath(); ctx.roundRect(30 + i * 18, 20, 12, len, 6); ctx.fill();
    ctx.beginPath(); ctx.arc(36 + i * 18, 20 + len, 9, 0, 7); ctx.fill();
  }
  ctx.restore();
}
function radarange(ctx, x, y, s) { // first microwave oven, ~6 ft tall cabinet
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  ctx.fillStyle = '#9A968A'; ctx.strokeStyle = '#2B2116'; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.roundRect(-170, -900, 340, 900, 18); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#6B675C'; ctx.beginPath(); ctx.roundRect(-130, -560, 260, 200, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#C9C6BA';
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-90 + i * 45, -820, 16, 0, 7); ctx.fill(); ctx.stroke(); }
  for (let i = 0; i < 8; i++) { ctx.fillStyle = '#7A766A'; ctx.fillRect(-140, -300 + i * 30, 280, 12); }
  ctx.restore();
}
function popcornBucket(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  for (let i = 0; i < 9; i++) { ctx.fillStyle = '#FFF7DA'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(-60 + (i % 5) * 30, -110 - Math.floor(i / 5) * 26 - (i % 2) * 10, 26, 0, 7); ctx.fill(); ctx.stroke(); }
  ctx.fillStyle = '#fff'; ctx.strokeStyle = INK; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(-90, -110); ctx.lineTo(90, -110); ctx.lineTo(64, 60); ctx.lineTo(-64, 60); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); ctx.fillStyle = '#FF3B5C'; for (let i = -3; i < 4; i++) ctx.fillRect(i * 40 - 10, -120, 20, 200); ctx.restore();
  ctx.stroke();
  ctx.restore();
}

Object.assign(window, { COUNTER, MW, WIN5, WIN5_C, drawKitchen, meshDissolve, wifiIcon, h2o, drawWaveBoard, magnetron, candyBar, radarange, popcornBucket });
