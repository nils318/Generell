// EP02 painters — What if car exhaust wasn't filtered?
const SKY_CLEAN = ['#4FB8FF', '#BDEBFF'], SKY_SMOG = ['#7A5A3A', '#C9A25E'];
const mixHex = (a, b, k) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const c = s => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, k));
  return `rgb(${c(16)},${c(8)},${c(0)})`;
};
const GROUND = 1385;

// ------------------------------------------------------------------ car
const CAR_BODY = (() => {
  const p = new Path2D();
  p.moveTo(-330, -48);
  p.bezierCurveTo(-338, -100, -334, -140, -318, -158);
  p.bezierCurveTo(-290, -178, -250, -182, -205, -190);
  p.bezierCurveTo(-170, -232, -130, -262, -60, -266);
  p.lineTo(40, -266);
  p.bezierCurveTo(100, -262, 140, -220, 175, -188);
  p.bezierCurveTo(250, -180, 300, -170, 322, -140);
  p.bezierCurveTo(336, -118, 336, -80, 330, -48);
  p.closePath(); return p;
})();
const CAR_WIN = (() => {
  const p = new Path2D();
  p.moveTo(-190, -192); p.bezierCurveTo(-160, -228, -126, -248, -64, -250); p.lineTo(-10, -250); p.lineTo(-10, -192); p.closePath();
  p.moveTo(8, -250); p.lineTo(38, -250); p.bezierCurveTo(90, -246, 124, -218, 152, -192); p.lineTo(8, -192); p.closePath();
  return p;
})();
const EXHAUST_PTS = [[250, -120], [230, -60], [180, -34], [120, -30], [10, -30], [-60, -30], [-120, -32], [-220, -32], [-300, -34], [-345, -40]];
const CONVERTER = { x0: 20, x1: 130 }, MUFFLER = { x0: -230, x1: -110 };

function wheel(ctx, x, y, r, rot) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#16131F'; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.stroke();
  const g = ctx.createRadialGradient(-10, -10, 4, 0, 0, r * 0.62); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#9AA3B8');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 0.6, 0, 7); ctx.fill(); ctx.stroke();
  ctx.rotate(rot); ctx.strokeStyle = '#5E6680'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  for (let i = 0; i < 5; i++) { const a = i / 5 * 6.283; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 8, Math.sin(a) * 8); ctx.lineTo(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5); ctx.stroke(); }
  ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, 0, 9, 0, 7); ctx.fill();
  ctx.restore();
}

// st: { x, y(ground), s, color, rot (wheel), bounce, conv (0..1 visible box under car) }
function drawCar(ctx, st, t) {
  const s = st.s || 1, col = st.color || '#19C3B0';
  ctx.save(); ctx.translate(st.x, st.y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(10,5,30,0.3)'; ctx.beginPath(); ctx.ellipse(0, 4, 350, 26, 0, 0, 7); ctx.fill();
  ctx.save(); ctx.translate(0, -(st.bounce || 0));
  // exhaust pipe + converter under the car
  ctx.lineCap = 'round';
  ctx.strokeStyle = INK; ctx.lineWidth = 20; ctx.beginPath(); ctx.moveTo(-150, -40); ctx.lineTo(-352, -42); ctx.stroke();
  ctx.strokeStyle = '#B7C0D4'; ctx.lineWidth = 10; ctx.stroke();
  if (st.conv) {
    ctx.save(); ctx.globalAlpha = clamp(st.conv);
    ctx.fillStyle = '#C9D2E6'; ctx.strokeStyle = INK; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.roundRect(10, -58 + 10 * (1 - st.conv), 120, 30, 12); ctx.fill(); ctx.stroke(); ctx.restore();
  }
  // body
  const g = ctx.createLinearGradient(0, -270, 0, -40);
  g.addColorStop(0, shade(col, 0.35)); g.addColorStop(0.5, col); g.addColorStop(1, shade(col, -0.35));
  ctx.fillStyle = g; ctx.fill(CAR_BODY);
  ctx.save(); ctx.clip(CAR_BODY);
  ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fillRect(-340, -175, 680, 14);
  ctx.fillStyle = shade(col, -0.45); ctx.fillRect(-340, -78, 680, 40);
  ctx.restore();
  ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.lineJoin = 'round'; ctx.stroke(CAR_BODY);
  // windows
  const wg = ctx.createLinearGradient(-190, -250, 150, -190); wg.addColorStop(0, '#2A3B66'); wg.addColorStop(1, '#5D79B8');
  ctx.fillStyle = wg; ctx.fill(CAR_WIN); ctx.lineWidth = 7; ctx.stroke(CAR_WIN);
  ctx.save(); ctx.clip(CAR_WIN); ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.moveTo(-120, -190); ctx.lineTo(-70, -260); ctx.moveTo(60, -190); ctx.lineTo(100, -250); ctx.stroke(); ctx.restore();
  // door line, handle, mirror
  ctx.strokeStyle = shade(col, -0.5); ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(0, -190); ctx.lineTo(0, -64); ctx.moveTo(165, -186); ctx.lineTo(160, -70); ctx.stroke();
  ctx.fillStyle = INK; ctx.beginPath(); ctx.roundRect(-70, -160, 36, 10, 5); ctx.roundRect(90, -160, 36, 10, 5); ctx.fill();
  ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(150, -206, 36, 22, 8); ctx.fill(); ctx.stroke();
  // lights
  ctx.fillStyle = '#FFE27A'; ctx.beginPath(); ctx.ellipse(310, -142, 18, 12, -0.3, 0, 7); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FF3B5C'; ctx.beginPath(); ctx.roundRect(-336, -150, 22, 34, 8); ctx.fill(); ctx.stroke();
  // stripe (series accent)
  ctx.fillStyle = '#FFD43B'; ctx.beginPath(); ctx.moveTo(-300, -120); ctx.lineTo(300, -112); ctx.lineTo(300, -100); ctx.lineTo(-300, -108); ctx.closePath(); ctx.fill();
  // arches + wheels
  ctx.fillStyle = '#0D0B14';
  for (const wx of [-200, 205]) { ctx.beginPath(); ctx.arc(wx, -48, 76, Math.PI, 0); ctx.fill(); }
  wheel(ctx, -200, -48, 64, st.rot || 0); wheel(ctx, 205, -48, 64, st.rot || 0);
  ctx.restore();
  ctx.restore();
  return { pipe: [st.x - 352 * s, st.y - 42 * s - (st.bounce || 0) * s] };
}

function miniCar(ctx, x, y, s, col, dir, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
  ctx.fillStyle = col; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.fill(CAR_BODY); ctx.stroke(CAR_BODY);
  ctx.fillStyle = '#2A3B66'; ctx.fill(CAR_WIN);
  ctx.fillStyle = '#16131F'; for (const wx of [-200, 205]) { ctx.beginPath(); ctx.arc(wx, -48, 62, 0, 7); ctx.fill(); }
  ctx.restore();
}

// ------------------------------------------------------------------ street
let skylineC = null;
function paintSkyline() {
  const c = off(W, 800), g = c.getContext('2d'), R = rng(21);
  const layer = (n, hMin, hMax, col, win) => {
    let x = -40;
    while (x < W + 40) {
      const w = 90 + R() * 130, h = hMin + R() * (hMax - hMin);
      g.fillStyle = col; g.fillRect(x, 800 - h, w, h);
      if (R() > 0.6) { g.fillRect(x + w * 0.4, 800 - h - 40, 8, 40); }
      if (win) for (let yy = 800 - h + 24; yy < 780; yy += 46) for (let xx = x + 14; xx < x + w - 24; xx += 34)
        if (R() > 0.35) { g.fillStyle = R() > 0.85 ? '#FFE9A8' : win; g.fillRect(xx, yy, 16, 22); g.fillStyle = col; }
      x += w + 6;
    }
  };
  layer(0, 380, 640, '#7FA6D9', null);
  layer(0, 240, 470, '#4D6FB0', '#6F8FCC');
  layer(0, 120, 300, '#2E3F7A', '#4C64A8');
  skylineC = c;
}

// st: { smog 0..1, sun 0..1, quix: fn, car: {..}, exhaust: 0 clean .. 1 dirty, puffK }
function drawStreet(ctx, st, t) {
  if (!skylineC) paintSkyline();
  const k = clamp(st.smog || 0);
  const g = ctx.createLinearGradient(0, 0, 0, GROUND);
  g.addColorStop(0, mixHex(SKY_CLEAN[0], SKY_SMOG[0], k)); g.addColorStop(1, mixHex(SKY_CLEAN[1], SKY_SMOG[1], k));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, GROUND + 40);
  // sun
  const sx = 790, sy = 360, sr = 110;
  ctx.save();
  if (st.sunRays) { ctx.globalAlpha = st.sunRays; burstLines(ctx, sx, sy, t, 'rgba(255,230,140,0.35)', 14, 140, 700); ctx.globalAlpha = 1; }
  ctx.shadowColor = k > 0.5 ? '#FF8A3D' : '#FFE27A'; ctx.shadowBlur = 80;
  ctx.fillStyle = mixHex('#FFE27A', '#FF8A3D', k); ctx.globalAlpha = 1 - 0.35 * k;
  ctx.beginPath(); ctx.arc(sx, sy, sr, 0, 7); ctx.fill(); ctx.restore();
  // clouds
  ctx.fillStyle = `rgba(255,255,255,${0.85 * (1 - k)})`;
  for (const [cx, cy, s] of [[200, 300, 1], [560, 200, 0.8], [980, 520, 0.9]]) {
    const x = cx + (t * 12) % 200 - 100;
    for (const [dx, dy, r] of [[-60, 10, 50], [0, -10, 70], [70, 10, 50]]) { ctx.beginPath(); ctx.arc(x + dx * s, cy + dy * s, r * s, 0, 7); ctx.fill(); }
  }
  ctx.drawImage(skylineC, 0, GROUND - 860);
  // haze over skyline
  if (k > 0) { ctx.fillStyle = `rgba(150,105,55,${0.55 * k})`; ctx.fillRect(0, 0, W, GROUND); }
  // road
  ctx.fillStyle = '#9FA6B8'; ctx.fillRect(0, GROUND - 90, W, 30);
  ctx.fillStyle = '#3A3E52'; ctx.fillRect(0, GROUND - 60, W, H);
  ctx.fillStyle = '#2B2E3E'; ctx.fillRect(0, GROUND + 40, W, H);
  ctx.fillStyle = '#FFD43B';
  for (let x = -((t * (st.roadSpeed || 0)) % 160); x < W; x += 160) ctx.fillRect(x, GROUND + 70, 90, 14);
  ctx.fillStyle = '#C8CDDA'; ctx.fillRect(0, GROUND + 130, W, 22);
  const fg = ctx.createLinearGradient(0, GROUND + 150, 0, H); fg.addColorStop(0, '#5A5F75'); fg.addColorStop(1, '#22243A');
  ctx.fillStyle = fg; ctx.fillRect(0, GROUND + 152, W, H);
  // car + exhaust
  let pipe = null;
  if (st.car) pipe = drawCar(ctx, st.car, t).pipe;
  if (st.quix) st.quix();
  if (pipe) exhaustPuffs(ctx, pipe[0], pipe[1], st.exhaust || 0, t, st.co2);
  // foreground smog layer
  if (k > 0) {
    ctx.fillStyle = `rgba(140,95,45,${0.28 * k})`; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 12; i++) {
      const x = (hash(i) * 1.4 - 0.2) * W + Math.sin(t * 0.3 + i) * 80, y = 250 + hash(i + 9) * 1200;
      puff(ctx, x, y, 280 + hash(i + 3) * 200, 'rgba(160,110,60,0.6)', 0.45 * k, i, t);
    }
  }
}

function exhaustPuffs(ctx, x, y, dirty, t, co2) {
  for (let i = 0; i < 10; i++) {
    const life = (t * 0.7 + i / 10) % 1;
    const px = x - life * 380 - 20, py = y - life * (200 + 140 * dirty) + Math.sin(life * 6 + i) * 18;
    const r = 18 + life * (60 + 120 * dirty);
    const a = Math.sin(life * Math.PI) * (0.35 + 0.6 * dirty);
    if (dirty > 0.3) smokeCloud(ctx, px, py, (0.25 + life * 1.1) * (0.5 + 0.5 * dirty), a * clamp((dirty - 0.3) * 2), t, i + 3);
    if (dirty < 0.7) puff(ctx, px, py, r * 0.6, 'rgba(235,240,250,0.8)', a * (1 - dirty), i + 3, t);
    if (co2 && i % 3 === 0 && life > 0.15) {
      ctx.save(); ctx.globalAlpha = co2 * Math.sin(life * Math.PI);
      const cx = px, cy = py - 30;
      atom(ctx, cx - 34, cy, 16, '#FF5A5A', ''); atom(ctx, cx + 34, cy, 16, '#FF5A5A', '');
      atom(ctx, cx, cy, 20, '#3B3552', ''); ctx.restore();
    }
  }
}

// ------------------------------------------------------------------ x-ray car
function exhaustPath() { const p = new Path2D(); EXHAUST_PTS.forEach((q, i) => i ? p.lineTo(...q) : p.moveTo(...q)); return p; }
const EXP = exhaustPath();
function alongExhaust(u) { // u 0..1 -> point
  const segs = []; let L = 0;
  for (let i = 1; i < EXHAUST_PTS.length; i++) { const d = Math.hypot(EXHAUST_PTS[i][0] - EXHAUST_PTS[i - 1][0], EXHAUST_PTS[i][1] - EXHAUST_PTS[i - 1][1]); segs.push(d); L += d; }
  let d = u * L;
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i]) { const k = d / segs[i]; return [lerp(EXHAUST_PTS[i][0], EXHAUST_PTS[i + 1][0], k), lerp(EXHAUST_PTS[i][1], EXHAUST_PTS[i + 1][1], k)]; }
    d -= segs[i];
  }
  return EXHAUST_PTS[EXHAUST_PTS.length - 1];
}
const XC = { x: 600, y: 1080, s: 1.2 };
const XGROUND = XC.y + 18 * XC.s;

function convBox(ctx, glow) {
  ctx.save();
  ctx.lineJoin = 'round';
  if (glow) { ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 40 * glow; }
  ctx.fillStyle = '#0A1E40'; ctx.strokeStyle = glow ? '#FFD43B' : XR.cyan; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.roundRect(CONVERTER.x0, -58, CONVERTER.x1 - CONVERTER.x0, 56, 18); ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = glow ? 'rgba(255,212,59,0.7)' : 'rgba(92,225,255,0.6)'; ctx.lineWidth = 3;
  for (let x = CONVERTER.x0 + 16; x < CONVERTER.x1 - 8; x += 12) { ctx.beginPath(); ctx.moveTo(x, -52); ctx.lineTo(x, -8); ctx.stroke(); }
  ctx.restore();
}

// st: { conv 1/0, glow, flow 0..1, clean (converted gases) bool, dissolve p }
function drawXrayCar(ctx, st, t) {
  xrayBG(ctx, t);
  ctx.save(); ctx.translate(XC.x, XC.y); ctx.scale(XC.s, XC.s);
  // ground line
  ctx.strokeStyle = XR.cyan; ctx.lineWidth = 3; ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.moveTo(-500, 18); ctx.lineTo(500, 18); ctx.stroke(); ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(92,225,255,0.07)'; ctx.fill(CAR_BODY);
  ctx.save(); ctx.shadowColor = XR.cyan; ctx.shadowBlur = 18; ctx.strokeStyle = XR.cyan; ctx.lineWidth = 5; ctx.stroke(CAR_BODY); ctx.stroke(CAR_WIN); ctx.restore();
  for (const wx of [-200, 205]) { ctx.strokeStyle = XR.cyan; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(wx, -48, 64, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(wx, -48, 36, 0, 7); ctx.stroke(); }
  // engine
  ctx.strokeStyle = XR.cyan; ctx.lineWidth = 5; ctx.fillStyle = 'rgba(92,225,255,0.12)';
  ctx.beginPath(); ctx.roundRect(200, -175, 110, 85, 10); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.roundRect(212 + i * 32, -205, 22, 30, 5); ctx.stroke(); }
  txt(ctx, 'ENGINE', 255, -132, { size: 22, font: 'Bungee', color: XR.cyan, shadow: false });
  // exhaust pipe
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.save(); ctx.shadowColor = XR.cyan; ctx.shadowBlur = 14; ctx.strokeStyle = XR.cyan; ctx.lineWidth = 22; ctx.stroke(EXP); ctx.restore();
  ctx.strokeStyle = '#0A1E40'; ctx.lineWidth = 12; ctx.stroke(EXP);
  // muffler
  ctx.fillStyle = '#0A1E40'; ctx.strokeStyle = XR.cyan; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.ellipse((MUFFLER.x0 + MUFFLER.x1) / 2, -31, (MUFFLER.x1 - MUFFLER.x0) / 2, 24, 0, 0, 7); ctx.fill(); ctx.stroke();
  if (st.conv) convBox(ctx, st.glow || 0);
  // gas molecules flowing
  if (st.flow) {
    const cx = (CONVERTER.x0 + CONVERTER.x1) / 2;
    for (let i = 0; i < 16; i++) {
      const u = (t * 0.22 + i / 16) % 1, [x, y] = alongExhaust(u);
      const after = x < CONVERTER.x0 && st.conv;
      const kind = i % 3;
      const dirty = ['#FF5A5A', '#FF9A3D', '#8C8C99'][kind], clean = ['#7FD8FF', '#B4F5C8', '#E8F4FF'][kind];
      ctx.save(); ctx.globalAlpha = st.flow * Math.min(1, u * 8, (1 - u) * 8);
      ctx.fillStyle = after ? clean : dirty; ctx.strokeStyle = INK; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x, y - 1, 9, 0, 7); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.arc(x + 9, y - 6, 6, 0, 7); ctx.fill(); ctx.stroke();
      ctx.restore();
      if (after && Math.abs(x - CONVERTER.x0) < 14) sparkle(ctx, x, y - 10, 14, st.flow);
    }
  }
  ctx.restore();
}

// screen coords of the converter centre in the x-ray view
const CONV_SCREEN = [XC.x + XC.s * 75, XC.y + XC.s * -30];

// particles for the converter dissolve
let convParts = null;
function convDissolve(ctx, p, t) {
  if (!convParts) {
    const c = off(), g = c.getContext('2d');
    g.translate(XC.x, XC.y); g.scale(XC.s, XC.s); convBox(g, 1);
    const d = g.getImageData(0, 0, W, H).data, R = rng(9), out = [], S = 9;
    const bx0 = Math.floor(XC.x + XC.s * (CONVERTER.x0 - 12)), bx1 = Math.ceil(XC.x + XC.s * (CONVERTER.x1 + 12));
    const by0 = Math.floor(XC.y + XC.s * -75), by1 = Math.ceil(XC.y + XC.s * 10);
    for (let y = by0; y < by1; y += S) for (let x = bx0; x < bx1; x += S) {
      const i = ((y + 4) * W + x + 4) * 4;
      if (d[i + 3] > 80) out.push({ x, y, c: `rgb(${d[i]},${d[i + 1]},${d[i + 2]})`, vx: (R() - 0.5) * 2, vy: -R() * 2 - 0.4, r: R() * 6, d: Math.hypot(x - CONV_SCREEN[0], y - CONV_SCREEN[1]) / 160 });
    }
    convParts = out;
  }
  ctx.save();
  for (const q of convParts) {
    const k = clamp((p * 1.6 - q.d * 0.5) / 0.9);
    if (k >= 1) continue;
    const e = k * k;
    ctx.globalAlpha = 1 - k; ctx.fillStyle = k > 0.05 && hash(q.x * 3 + q.y) > 0.5 ? '#FFF6C2' : q.c;
    ctx.save(); ctx.translate(q.x + q.vx * e * 380, q.y + q.vy * e * 380); ctx.rotate(q.r * e * 3);
    const s = 9 * (1 - 0.5 * k); ctx.fillRect(-s / 2, -s / 2, s, s); ctx.restore();
  }
  ctx.restore();
}

// ------------------------------------------------------------------ globe
function drawGlobe(ctx, t, zapK, counter) {
  heroBG(ctx, t, 1);
  const cx = 540, cy = 900, R = 380;
  ctx.save();
  ctx.shadowColor = '#7FD8FF'; ctx.shadowBlur = 80;
  const g = ctx.createRadialGradient(cx - 120, cy - 140, 40, cx, cy, R);
  g.addColorStop(0, '#5EC8FF'); g.addColorStop(1, '#1546A8');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip();
  const conts = [[-0.9, -0.3, 0.42, 0.55], [-0.2, -0.5, 0.35, 0.3], [0.1, 0.1, 0.3, 0.5], [0.7, -0.2, 0.5, 0.4], [0.5, 0.55, 0.28, 0.2], [1.5, 0.0, 0.4, 0.5], [2.4, -0.3, 0.45, 0.35]];
  for (const [lon, lat, w, h] of conts) {
    let x = ((lon + t * 0.25) % 3.4 + 3.4) % 3.4 - 1.7;
    if (Math.abs(x) > 1.2) continue;
    const px = cx + Math.sin(x) * R, py = cy + lat * R, sx = Math.cos(x);
    ctx.fillStyle = '#3CC06B'; ctx.strokeStyle = INK; ctx.lineWidth = 6;
    ctx.beginPath();
    for (let i = 0; i <= 20; i++) { const a = i / 20 * 6.283, rr = 1 + 0.22 * noise1(lon * 9 + i * 0.8); ctx.lineTo(px + Math.cos(a) * w * R * 0.5 * sx * rr, py + Math.sin(a) * h * R * 0.5 * rr); }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(0,0,40,0.25)'; ctx.beginPath(); ctx.arc(cx + 90, cy + 60, R, 0, 7); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
  // orbiting cars getting zapped
  for (let i = 0; i < 14; i++) {
    const a = i / 14 * 6.283 + t * 0.4, ox = cx + Math.cos(a) * (R + 70), oy = cy + Math.sin(a) * (R + 70) * 0.9;
    const hit = zapK * 14 > i;
    miniCar(ctx, ox, oy + 20, 0.13, ['#FF3B5C', '#19C3B0', '#FFD43B', '#7B5CFF', '#FF8A1F'][i % 5], Math.cos(a) > 0 ? -1 : 1, t);
    if (hit) { const k = clamp(zapK * 14 - i); if (k < 1) sparkle(ctx, ox, oy, 50 * Math.sin(k * Math.PI), 1); else crossBadge(ctx, ox + 26, oy - 10, 0.28); }
  }
  if (counter != null) {
    txt(ctx, 'CATALYTIC CONVERTERS LEFT', 540, 330, { size: 46, font: 'Lilita', color: '#fff', stroke: 10 });
    txt(ctx, Math.round(counter).toLocaleString('en-US'), 540, 420, { size: 104, font: 'Bungee', color: counter < 1 ? '#FF3B5C' : '#FFD43B', stroke: 18, glow: counter < 1 ? '#FF3B5C' : '#FFD43B' });
  }
}

// ------------------------------------------------------------------ honeycomb macro
function drawHoneycomb(ctx, t, tiles) {
  heroBG(ctx, t, 1);
  const cx = 540, cy = 820, R = 330;
  ctx.save();
  ctx.fillStyle = '#9AA3B8'; ctx.strokeStyle = INK; ctx.lineWidth = 12;
  ctx.beginPath(); ctx.arc(cx, cy, R + 34, 0, 7); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.save(); ctx.clip();
  ctx.fillStyle = '#5C5446'; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
  const S = 40;
  for (let y = cy - R; y < cy + R; y += S) for (let x = cx - R; x < cx + R; x += S) {
    const sh = 0.5 + 0.5 * Math.sin((x + y) * 0.01 - t * 3);
    const gg = ctx.createLinearGradient(x, y, x + S, y + S);
    gg.addColorStop(0, `rgb(${200 + 40 * sh},${200 + 40 * sh},${210 + 40 * sh})`); gg.addColorStop(1, '#6E6A80');
    ctx.fillStyle = gg; ctx.fillRect(x + 5, y + 5, S - 10, S - 10);
    ctx.fillStyle = 'rgba(20,10,30,0.55)'; ctx.fillRect(x + 11, y + 11, S - 22, S - 22);
  }
  ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.ellipse(cx - 120, cy - 140, 160, 60, -0.6, 0, 7); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
  ctx.restore();
  // element tiles
  const EL = [['78', 'Pt', 'PLATINUM', '#EEF1F8'], ['46', 'Pd', 'PALLADIUM', '#D5DDEE'], ['45', 'Rh', 'RHODIUM', '#F1DCEA']];
  EL.forEach(([n, sym, name, col], i) => {
    const a = tiles[i]; if (!a) return;
    const x = 200 + i * 340, y = 1290;
    ctx.save(); ctx.translate(x, y); ctx.scale(a, a); ctx.rotate((i - 1) * 0.06);
    ctx.fillStyle = 'rgba(10,5,30,0.4)'; ctx.beginPath(); ctx.roundRect(-128, -132, 256, 276, 22); ctx.fill();
    const g = ctx.createLinearGradient(-120, -140, 120, 140); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, col);
    ctx.fillStyle = g; ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.beginPath(); ctx.roundRect(-120, -140, 240, 270, 22); ctx.fill(); ctx.stroke();
    txt(ctx, n, -78, -100, { size: 40, font: 'Lilita', color: INK, shadow: false, align: 'left' });
    txt(ctx, sym, 0, -6, { size: 120, font: 'Bungee', color: INK, shadow: false });
    txt(ctx, name, 0, 90, { size: 36, font: 'Lilita', color: INK, shadow: false });
    ctx.restore();
  });
}

// ------------------------------------------------------------------ city highway (world)
function drawHighway(ctx, t, smog, cars) {
  drawStreet(ctx, { smog }, t);
  // two lanes of traffic, every car puffing
  for (let lane = 0; lane < 2; lane++) {
    const y = GROUND + (lane ? 95 : -10), dir = lane ? -1 : 1, s = lane ? 0.36 : 0.3;
    for (let i = 0; i < 6; i++) {
      if (i >= cars * 6) continue;
      const x = ((i * 230 + t * 260 * dir) % 1380 + 1380) % 1380 - 150;
      const col = ['#FF3B5C', '#19C3B0', '#FFD43B', '#7B5CFF', '#FF8A1F', '#E8E4F4'][(i + lane * 2) % 6];
      const px = x - dir * 340 * s, py = y - 40 * s;
      for (let k = 0; k < 4; k++) {
        const life = (t * 0.9 + k / 4 + i * 0.13) % 1;
        smokeCloud(ctx, px - dir * life * 200, py - life * 220, 0.18 + life * 0.6, Math.sin(life * Math.PI) * 0.95, t, i * 5 + k);
      }
      miniCar(ctx, x, y, s, col, dir, t);
    }
  }
}

// ------------------------------------------------------------------ 1943 newspaper
function newspaper(ctx, x, y, s, rot, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(40,25,10,0.4)'; ctx.fillRect(-370, -470, 760, 960);
  ctx.fillStyle = '#F2E8D2'; ctx.strokeStyle = '#3A2A10'; ctx.lineWidth = 6;
  ctx.fillRect(-380, -480, 760, 960); ctx.strokeRect(-380, -480, 760, 960);
  txt(ctx, 'THE DAILY HAZE', 0, -410, { size: 74, font: 'Bungee', color: '#2B2116', shadow: false });
  ctx.fillStyle = '#2B2116'; ctx.fillRect(-350, -360, 700, 6); ctx.fillRect(-350, -318, 700, 3);
  txt(ctx, 'LOS ANGELES  ·  1943  ·  5¢', 0, -339, { size: 26, font: 'Lilita', color: '#2B2116', shadow: false });
  txt(ctx, '"GAS ATTACK"?!', 0, -250, { size: 96, font: 'Bungee', color: '#8C1C13', shadow: false });
  txt(ctx, 'Mystery fumes blanket downtown', 0, -168, { size: 40, font: 'Lilita', color: '#2B2116', shadow: false });
  // illustration
  ctx.save(); ctx.beginPath(); ctx.rect(-350, -130, 420, 330); ctx.clip();
  const g = ctx.createLinearGradient(0, -130, 0, 200); g.addColorStop(0, '#B89A6A'); g.addColorStop(1, '#8A6E45');
  ctx.fillStyle = g; ctx.fillRect(-350, -130, 420, 330);
  ctx.fillStyle = '#5A4528';
  for (const [bx, bw, bh] of [[-340, 60, 150], [-275, 80, 230], [-190, 50, 120], [-135, 90, 260], [-40, 70, 180], [30, 50, 140]]) ctx.fillRect(bx, 200 - bh, bw, bh);
  for (let i = 0; i < 6; i++) puff(ctx, -300 + i * 80, 40 + Math.sin(i) * 40, 110, 'rgba(210,180,120,0.8)', 0.7, i, t);
  ctx.restore();
  ctx.strokeRect(-350, -130, 420, 330);
  ctx.fillStyle = 'rgba(43,33,22,0.55)';
  for (let i = 0; i < 9; i++) ctx.fillRect(100, -125 + i * 36, 250 - (i % 3) * 30, 12);
  for (let i = 0; i < 6; i++) ctx.fillRect(-350, 230 + i * 36, 700 - (i % 2) * 140, 12);
  ctx.restore();
}

// ------------------------------------------------------------------ acid rain forest
function drawForest(ctx, t, sick, rain) {
  const g = ctx.createLinearGradient(0, 0, 0, GROUND);
  g.addColorStop(0, '#3A3F55'); g.addColorStop(1, '#8B8A7A');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // clouds
  ctx.fillStyle = '#2A2E40';
  for (let i = 0; i < 7; i++) { const x = i * 180 - 40 + Math.sin(t * 0.5 + i) * 20; ctx.beginPath(); ctx.arc(x, 180 + (i % 2) * 40, 150, 0, 7); ctx.fill(); }
  // hills
  ctx.fillStyle = mixHex('#2FA35A', '#7A6A3A', sick);
  ctx.beginPath(); ctx.moveTo(0, 1150); ctx.quadraticCurveTo(300, 1000, 600, 1120); ctx.quadraticCurveTo(850, 1220, W, 1080); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
  ctx.fillStyle = mixHex('#3CC06B', '#8A7240', sick); ctx.fillRect(0, GROUND - 40, W, H);
  // trees
  const R = rng(4);
  for (let i = 0; i < 7; i++) {
    const x = 60 + i * 160 + R() * 40, y = GROUND - 30 + R() * 60, s = 0.8 + R() * 0.5;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#5A3A22'; ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.beginPath(); ctx.roundRect(-14, -150, 28, 150, 8); ctx.fill(); ctx.stroke();
    const leaf = mixHex(i % 2 ? '#2FA35A' : '#3CC06B', i % 2 ? '#8A5A2A' : '#A8782F', clamp(sick * (1.2 - (i % 3) * 0.15)));
    const thin = 1 - 0.45 * sick;
    ctx.fillStyle = leaf;
    for (const [lx, ly, lr] of [[0, -220, 90], [-60, -170, 64], [60, -170, 64]]) { ctx.beginPath(); ctx.arc(lx, ly, lr * thin, 0, 7); ctx.fill(); ctx.stroke(); }
    ctx.restore();
    // falling leaves
    if (sick > 0.2) for (let k = 0; k < 2; k++) {
      const ph = (t * 0.4 + hash(i * 7 + k)) % 1;
      ctx.fillStyle = '#B07A2F'; ctx.beginPath(); ctx.ellipse(x + Math.sin(ph * 9 + k) * 40, y - 220 * s + ph * 260, 12, 6, ph * 6, 0, 7); ctx.fill();
    }
  }
  // rain
  if (rain > 0) {
    ctx.save(); ctx.globalAlpha = rain; ctx.strokeStyle = '#C8F26A'; ctx.lineWidth = 4; ctx.lineCap = 'round';
    for (let i = 0; i < 90; i++) {
      const x = hash(i) * (W + 200) - 100, y = ((hash(i + 40) * H + t * 1900) % (H + 200)) - 100;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 18, y + 46); ctx.stroke();
      if (y > GROUND - 20 && y < GROUND + 40) puff(ctx, x, GROUND, 18, 'rgba(220,255,140,0.7)', 0.6, i, t);
    }
    ctx.restore();
  }
}

Object.assign(window, { GROUND, XGROUND, alongExhaust, drawCar, miniCar, drawStreet, drawXrayCar, CONV_SCREEN, convDissolve, XC, drawGlobe, drawHoneycomb, drawHighway, newspaper, drawForest });
