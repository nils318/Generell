// EP06 painters — What if tires had no tread?
const ROAD = 1290;                       // y of the asphalt edge (Quix stands here)
const TIRE = { x: 600, y: 990, r: 300 };  // hero tire (centre + radius), rests on the road

// Dry/wet road with a dashed centre line. wet 0..1 darkens and adds reflections.
let roadBG = null;
function paintRoad() {
  const c = off(), g = c.getContext('2d');
  const sky = g.createLinearGradient(0, 0, 0, ROAD); sky.addColorStop(0, '#9ED8FF'); sky.addColorStop(1, '#E9F7FF');
  g.fillStyle = sky; g.fillRect(0, 0, W, ROAD);
  g.fillStyle = '#6FA86B'; g.fillRect(0, ROAD - 60, W, 60);            // verge
  const as = g.createLinearGradient(0, ROAD, 0, H); as.addColorStop(0, '#4A4F63'); as.addColorStop(1, '#262A3A');
  g.fillStyle = as; g.fillRect(0, ROAD, W, H);
  g.fillStyle = '#FFFFFF';
  for (let x = 0; x < W; x += 240) g.fillRect(x, ROAD + 170, 140, 14);  // dashes
  roadBG = c;
}
function road(ctx, wet = 0) {
  if (!roadBG) paintRoad();
  ctx.drawImage(roadBG, 0, 0);
  if (wet > 0) {
    ctx.save(); ctx.globalAlpha = 0.55 * wet; ctx.fillStyle = '#1B2A4A'; ctx.fillRect(0, ROAD, W, H); ctx.restore();
    ctx.save(); ctx.globalAlpha = 0.35 * wet; ctx.strokeStyle = '#BFE6FF'; ctx.lineWidth = 5;
    for (let i = 0; i < 14; i++) { const x = hash(i) * W, y = ROAD + 30 + hash(i + 9) * (H - ROAD - 60); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 80, y); ctx.stroke(); }
    ctx.restore();
  }
}

// Tire seen from the side. tread 1 = full grooves, 0 = bald. rot = spin angle.
function tire(ctx, x, y, r, tread = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#1A1B24'; ctx.strokeStyle = INK; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.stroke();
  if (tread > 0.02) {
    ctx.save(); ctx.globalAlpha = clamp(tread); ctx.strokeStyle = '#4A4F66'; ctx.lineWidth = r * 0.07; ctx.lineCap = 'round';
    ctx.rotate(rot);
    for (let i = 0; i < 40; i++) {
      const a = i / 40 * 6.283; ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r * 0.76, Math.sin(a) * r * 0.76);
      ctx.lineTo(Math.cos(a + 0.12) * r * 0.93, Math.sin(a + 0.12) * r * 0.93); ctx.stroke();
    }
    ctx.restore();
  }
  const g = ctx.createRadialGradient(-20, -20, 10, 0, 0, r * 0.6); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#9AA3B8');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r * 0.6, 0, 7); ctx.fill(); ctx.lineWidth = 8; ctx.stroke();
  ctx.rotate(rot); ctx.strokeStyle = '#5E6680'; ctx.lineWidth = 12; ctx.lineCap = 'round';
  for (let i = 0; i < 5; i++) { const a = i / 5 * 6.283; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 20, Math.sin(a) * 20); ctx.lineTo(Math.cos(a) * r * 0.5, Math.sin(a) * r * 0.5); ctx.stroke(); }
  ctx.fillStyle = '#FF6B2C'; ctx.beginPath(); ctx.arc(0, 0, 26, 0, 7); ctx.fill(); ctx.stroke();
  ctx.restore();
}

// Yellow dashed ring around the tread, used to point at the grooves.
function treadRing(ctx, x, y, r, a, t) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 9;
  ctx.setLineDash([22, 14]); ctx.lineDashOffset = -t * 60; ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 20;
  ctx.beginPath(); ctx.arc(x, y, r * 0.87, 0, 7); ctx.stroke(); ctx.restore();
}

// Water drops falling, for the rain scene.
function rain(ctx, t, amount) {
  if (amount <= 0) return;
  ctx.save(); ctx.strokeStyle = 'rgba(200,230,255,0.75)'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  for (let i = 0; i < 60; i++) {
    const x = hash(i) * W, y = ((t * 900 * (0.8 + hash(i + 4) * 0.4) + hash(i + 2) * H) % H);
    ctx.globalAlpha = amount * 0.8; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 18, y + 46); ctx.stroke();
  }
  ctx.restore();
}

// Side view for the wedge scene: water ahead of the contact patch that gets pushed up.
function waterWedge(ctx, x, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.fillStyle = '#3A9BFF'; ctx.strokeStyle = INK; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(x, ROAD + 30); ctx.lineTo(x + 330, ROAD - 170); ctx.lineTo(x + 330, ROAD + 30); ctx.closePath();
  ctx.fill(); ctx.stroke(); ctx.restore();
}

// Upright tread-depth gauge with the 1.6 mm legal limit marked.
function gauge(ctx, x, y, h, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y);
  ctx.fillStyle = '#FFFFFF'; ctx.strokeStyle = INK; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.roundRect(0, 0, 120, h, 18); ctx.fill(); ctx.stroke();
  const lim = h * (1 - 1.6 / 8);                       // 8 mm full scale, limit at 1.6 mm
  ctx.fillStyle = '#FF3B5C'; ctx.fillRect(0, lim, 120, h - lim);
  ctx.fillStyle = '#2BD47D'; ctx.fillRect(0, 0, 120, lim);
  ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-30, lim); ctx.lineTo(150, lim); ctx.stroke();
  ctx.restore();
}
