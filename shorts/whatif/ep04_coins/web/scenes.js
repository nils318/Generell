// EP04 painters — What if coins had no ridges?
const GROUND4 = 1385;
const METAL = {
  silver: ['#FFFFFF', '#D9DEE8', '#9AA3B8', '#6E768C'],
  gold: ['#FFF6C2', '#FFD43B', '#D9A21F', '#9C6B10'],
  copper: ['#FFD9C2', '#E0855A', '#B0582F', '#7A3618'],
  old: ['#F3F1EA', '#C9C6BA', '#9A968A', '#6B675C'],
};

function studioBG(ctx, t) {
  const g = ctx.createRadialGradient(540, 760, 60, 540, 900, 1300);
  g.addColorStop(0, '#2BB8A8'); g.addColorStop(0.45, '#126A72'); g.addColorStop(1, '#06202C');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  burstLines(ctx, 540, 760, t, 'rgba(255,255,255,0.05)', 18);
  ctx.save(); ctx.globalAlpha = 0.6;
  for (let i = 0; i < 24; i++) sparkle(ctx, hash(i) * W, (hash(i + 30) * 1200 + t * 15) % 1300, 4 + hash(i + 2) * 9, 0.5, '#FFE9A8');
  ctx.restore();
  const fg = ctx.createLinearGradient(0, GROUND4, 0, H); fg.addColorStop(0, '#0E3A44'); fg.addColorStop(1, '#041219');
  ctx.fillStyle = fg; ctx.fillRect(0, GROUND4, W, H);
  ctx.strokeStyle = 'rgba(143,233,255,0.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, GROUND4); ctx.lineTo(W, GROUND4); ctx.stroke();
}

// ---------------------------------------------------------------- coins
function qEmblem(ctx, s, col) { // the Quix "?" stamped on the series coin
  ctx.save(); ctx.scale(s, s); ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.lineWidth = 22;
  ctx.beginPath(); ctx.moveTo(-46, -40); ctx.bezierCurveTo(-46, -100, 50, -100, 50, -40); ctx.bezierCurveTo(50, 0, 0, 0, 0, 30); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.arc(0, 78, 15, 0, 7); ctx.fill();
  ctx.restore();
}

// upright coin seen at an angle. opt: { yaw (0..1.2), thick, ridges 0..1, metal, spin, glow, emblem, smoothSheen }
function coin3D(ctx, x, y, r, opt, t) {
  const m = METAL[opt.metal || 'silver'], yaw = opt.yaw ?? 0.6, rx = r * Math.cos(yaw), w = (opt.thick || 46) * Math.sin(yaw) / Math.sin(0.6);
  ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round';
  // edge band (right side)
  const N = 90, front = [], back = [];
  for (let i = 0; i <= N; i++) { const th = -Math.PI / 2 + i / N * Math.PI; front.push([rx * Math.cos(th), r * Math.sin(th)]); back.push([rx * Math.cos(th) + w, r * Math.sin(th)]); }
  const band = new Path2D();
  front.forEach((p, i) => i ? band.lineTo(...p) : band.moveTo(...p));
  for (let i = N; i >= 0; i--) band.lineTo(...back[i]);
  band.closePath();
  const bg = ctx.createLinearGradient(0, -r, 0, r); bg.addColorStop(0, m[1]); bg.addColorStop(0.5, m[2]); bg.addColorStop(1, m[3]);
  ctx.fillStyle = bg; ctx.fill(band);
  const rid = opt.ridges ?? 1;
  if (rid > 0) {
    ctx.save(); ctx.clip(band); ctx.globalAlpha = rid;
    for (let k = 0; k < 70; k++) {
      const th = -Math.PI / 2 + ((k + (opt.spin || 0) * 4) % 70) / 70 * Math.PI;
      const fx = rx * Math.cos(th), fy = r * Math.sin(th);
      ctx.strokeStyle = k % 2 ? m[3] : m[0]; ctx.lineWidth = 3.2 * Math.max(0.35, Math.cos(th));
      ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx + w, fy); ctx.stroke();
    }
    ctx.restore();
  } else {
    ctx.save(); ctx.clip(band); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(rx * 0.2, -r * 0.6, w + rx, r * 0.25); ctx.restore();
  }
  if (opt.glow) { ctx.save(); ctx.globalAlpha = opt.glow; ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 50; ctx.strokeStyle = '#FFD43B'; ctx.lineWidth = 10; ctx.stroke(band); ctx.restore(); }
  ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.stroke(band);
  if (opt.bandOnly) { ctx.restore(); return; }
  // face
  const fg = ctx.createRadialGradient(-rx * 0.4, -r * 0.45, r * 0.1, 0, 0, r * 1.05);
  fg.addColorStop(0, m[0]); fg.addColorStop(0.45, m[1]); fg.addColorStop(1, m[2]);
  ctx.fillStyle = fg; ctx.beginPath(); ctx.ellipse(0, 0, rx, r, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = m[3]; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(0, 0, rx * 0.86, r * 0.86, 0, 0, 7); ctx.stroke();
  ctx.save(); ctx.scale(rx / r, 1); qEmblem(ctx, r / 150, m[3]); ctx.restore();
  // sheen
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, rx, r, 0, 0, 7); ctx.clip();
  const sp = ((t * 0.5) % 2) - 0.5;
  ctx.fillStyle = `rgba(255,255,255,${opt.smoothSheen ? 0.55 : 0.25})`;
  ctx.beginPath(); ctx.moveTo(-r + sp * 2 * r, -r); ctx.lineTo(-r * 0.6 + sp * 2 * r, -r); ctx.lineTo(-r * 1.2 + sp * 2 * r, r); ctx.lineTo(-r * 1.6 + sp * 2 * r, r); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.beginPath(); ctx.ellipse(0, 0, rx, r, 0, 0, 7); ctx.stroke();
  ctx.restore();
  return { bandX: x + rx + w / 2, bandY: y };
}

// 1600s hammered silver coin, face-on; clip 0..1 bites chunks off the edge
function oldCoin(ctx, x, y, r, clip = 0, seed = 3) {
  ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round';
  const bites = [[0.4, 0.5], [2.2, 0.45], [4.1, 0.55]];
  const rad = a => {
    let rr = r * (1 + 0.035 * noise1(a * 3 + seed));
    for (const [c, wdt] of bites) { const d = Math.abs(((a - c + Math.PI * 3) % (Math.PI * 2)) - Math.PI); if (d < wdt) rr -= clip * r * 0.14 * Math.cos(d / wdt * Math.PI / 2); }
    return rr;
  };
  const p = new Path2D();
  for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2, rr = rad(a); i ? p.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : p.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
  p.closePath();
  const g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r * 1.1);
  g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.5, '#CFCBC0'); g.addColorStop(1, '#8E8A7E');
  ctx.fillStyle = g; ctx.fill(p); ctx.strokeStyle = '#3A3428'; ctx.lineWidth = 8; ctx.stroke(p);
  // crude design: dotted ring, crown, cross
  ctx.fillStyle = '#7A766A';
  for (let i = 0; i < 36; i++) { const a = i / 36 * 6.283; ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.78, Math.sin(a) * r * 0.78, r * 0.025, 0, 7); ctx.fill(); }
  ctx.strokeStyle = '#6B675C'; ctx.lineWidth = r * 0.05; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-r * 0.32, r * 0.1); ctx.lineTo(-r * 0.32, -r * 0.2); ctx.lineTo(-r * 0.16, -r * 0.05); ctx.lineTo(0, -r * 0.3); ctx.lineTo(r * 0.16, -r * 0.05); ctx.lineTo(r * 0.32, -r * 0.2); ctx.lineTo(r * 0.32, r * 0.1); ctx.closePath(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, r * 0.2); ctx.lineTo(0, r * 0.5); ctx.moveTo(-r * 0.14, r * 0.33); ctx.lineTo(r * 0.14, r * 0.33); ctx.stroke();
  ctx.restore();
}

function sliver(ctx, x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = '#E6E3DA'; ctx.strokeStyle = '#3A3428'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(0, 0, 30, -0.5, 0.5); ctx.arc(-10, 0, 26, 0.45, -0.45, true); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function shears(ctx, x, y, open, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.lineJoin = 'round';
  for (const sd of [-1, 1]) {
    ctx.save(); ctx.rotate(sd * open * 0.35);
    ctx.fillStyle = '#C9D2E6'; ctx.strokeStyle = INK; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-190, sd * 10); ctx.lineTo(-200, 0); ctx.lineTo(0, -sd * 10); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#FF6B2C'; ctx.beginPath(); ctx.ellipse(70, sd * 26, 44, 26, sd * 0.3, 0, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#E8D9C0'; ctx.beginPath(); ctx.ellipse(70, sd * 26, 22, 11, sd * 0.3, 0, 7); ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, 0, 9, 0, 7); ctx.fill();
  ctx.restore();
}

function crucible(ctx, x, y, molten, t) {
  ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round';
  // fire
  for (let i = 0; i < 7; i++) {
    const fx = -120 + i * 40, h = 90 + 40 * Math.sin(t * 9 + i * 1.7);
    ctx.fillStyle = i % 2 ? '#FF8A1F' : '#FFB020';
    ctx.beginPath(); ctx.moveTo(fx - 26, 170); ctx.quadraticCurveTo(fx - 18, 170 - h * 0.6, fx, 170 - h); ctx.quadraticCurveTo(fx + 18, 170 - h * 0.6, fx + 26, 170); ctx.fill();
  }
  ctx.fillStyle = '#3B3552'; ctx.strokeStyle = INK; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.moveTo(-170, -40); ctx.lineTo(170, -40); ctx.lineTo(130, 110); ctx.quadraticCurveTo(0, 150, -130, 110); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, -40, 170, 40, 0, 0, 7); ctx.fillStyle = '#2A2540'; ctx.fill(); ctx.stroke();
  if (molten > 0) {
    ctx.save(); ctx.shadowColor = '#FFF6C2'; ctx.shadowBlur = 50 * molten;
    const g = ctx.createRadialGradient(0, -40, 10, 0, -40, 150); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#BFD3FF');
    ctx.fillStyle = g; ctx.globalAlpha = molten; ctx.beginPath(); ctx.ellipse(0, -36, 150 * molten, 30 * molten, 0, 0, 7); ctx.fill(); ctx.restore();
  }
  ctx.restore();
}

function ingot(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  ctx.fillStyle = '#C9D2E6'; ctx.strokeStyle = INK; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(-170, 60); ctx.lineTo(170, 60); ctx.lineTo(120, -40); ctx.lineTo(-120, -40); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#F4F7FF'; ctx.beginPath(); ctx.moveTo(-120, -40); ctx.lineTo(120, -40); ctx.lineTo(100, -80); ctx.lineTo(-100, -80); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(-60 + ((t * 120) % 200) - 100, -36, 30, 90);
  ctx.restore();
}

function balance(ctx, x, y, tilt, t) {
  ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.strokeStyle = INK; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 420); ctx.stroke();
  ctx.strokeStyle = '#B8892E'; ctx.lineWidth = 8; ctx.stroke();
  ctx.fillStyle = '#B8892E'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-120, 410, 240, 40, 14); ctx.fill(); ctx.stroke();
  ctx.rotate(tilt);
  ctx.strokeStyle = INK; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(-300, 0); ctx.lineTo(300, 0); ctx.stroke();
  ctx.strokeStyle = '#D4A23C'; ctx.lineWidth = 9; ctx.stroke();
  const pans = [];
  for (const sd of [-1, 1]) {
    ctx.save(); ctx.translate(sd * 290, 0); ctx.rotate(-tilt);
    ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-90, 200); ctx.moveTo(0, 0); ctx.lineTo(90, 200); ctx.stroke();
    ctx.fillStyle = '#D4A23C'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-120, 200); ctx.lineTo(120, 200); ctx.quadraticCurveTo(0, 270, -120, 200); ctx.fill(); ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(0, 0, 16, 0, 7); ctx.fill();
  ctx.restore();
  // pan positions (world) for placing coins
  const c = Math.cos(tilt), s = Math.sin(tilt);
  return [-1, 1].map(sd => [x + sd * 290 * c, y + sd * 290 * s + 185]);
}

function decree(ctx, x, y, s, unroll) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const h = 820 * unroll;
  ctx.fillStyle = 'rgba(40,25,10,0.35)'; ctx.fillRect(-330, -400 + 14, 680, h);
  ctx.fillStyle = '#F6EBD0'; ctx.strokeStyle = '#3A2A10'; ctx.lineWidth = 6;
  ctx.fillRect(-340, -410, 680, h); ctx.strokeRect(-340, -410, 680, h);
  ctx.save(); ctx.beginPath(); ctx.rect(-340, -410, 680, h); ctx.clip();
  txt(ctx, 'BY ORDER OF THE CROWN', 0, -340, { size: 46, font: 'Bungee', color: '#5A4220', shadow: false });
  ctx.fillStyle = 'rgba(90,66,32,0.45)';
  for (let i = 0; i < 9; i++) ctx.fillRect(-280, -260 + i * 46, 560 - (i % 3) * 90, 12);
  ctx.restore();
  for (const yy of [-410, -410 + h]) { ctx.fillStyle = '#E2D3AE'; ctx.beginPath(); ctx.roundRect(-370, yy - 26, 740, 52, 26); ctx.fill(); ctx.stroke(); }
  ctx.restore();
}

function fileTool(ctx, x, y, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.lineJoin = 'round';
  ctx.fillStyle = '#8E96AA'; ctx.strokeStyle = INK; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.roundRect(-260, -22, 300, 44, 8); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#5E6680'; ctx.lineWidth = 3;
  for (let i = -250; i < 30; i += 14) { ctx.beginPath(); ctx.moveTo(i, -18); ctx.lineTo(i + 10, 18); ctx.stroke(); }
  ctx.fillStyle = '#7A4A2A'; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(40, -30, 170, 60, 26); ctx.fill(); ctx.stroke();
  ctx.restore();
}

function newtonCameo(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#C9962F'; ctx.strokeStyle = '#3A2A10'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.ellipse(0, 0, 175, 215, 0, 0, 7); ctx.fill(); ctx.stroke();
  for (let i = 0; i < 28; i++) { const a = i / 28 * 6.283; ctx.fillStyle = '#E2B54A'; ctx.beginPath(); ctx.arc(Math.cos(a) * 160, Math.sin(a) * 200, 9, 0, 7); ctx.fill(); }
  ctx.fillStyle = '#F2E6CC'; ctx.beginPath(); ctx.ellipse(0, 0, 140, 180, 0, 0, 7); ctx.fill(); ctx.stroke();
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 140, 180, 0, 0, 7); ctx.clip();
  ctx.fillStyle = '#2B2116';
  // long flowing hair (behind)
  ctx.beginPath(); ctx.moveTo(-40, -120); ctx.bezierCurveTo(-120, -110, -130, 0, -110, 120); ctx.bezierCurveTo(-90, 160, -40, 150, -20, 110); ctx.lineTo(10, -60); ctx.closePath(); ctx.fill();
  // face profile (facing right)
  ctx.beginPath();
  ctx.moveTo(-80, 190); ctx.bezierCurveTo(-70, 120, -40, 100, -10, 90);
  ctx.lineTo(0, 60); ctx.bezierCurveTo(-30, 40, -45, -20, -30, -70);
  ctx.bezierCurveTo(-10, -125, 40, -125, 60, -80); ctx.lineTo(66, -50); ctx.lineTo(84, -20); ctx.lineTo(66, -12);
  ctx.lineTo(70, 8); ctx.lineTo(62, 14); ctx.lineTo(66, 28); ctx.bezierCurveTo(60, 50, 40, 56, 26, 56); ctx.lineTo(28, 86);
  ctx.bezierCurveTo(70, 100, 110, 130, 120, 190); ctx.closePath(); ctx.fill();
  for (const [cx, cy, r] of [[-70, -60, 34], [-90, 0, 32], [-86, 60, 30], [-60, 110, 28], [-20, -110, 30]]) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); }
  ctx.restore(); ctx.restore();
}

function apple(ctx, x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.lineJoin = 'round';
  ctx.fillStyle = '#FF3B5C'; ctx.strokeStyle = INK; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(0, -30); ctx.bezierCurveTo(40, -60, 80, -10, 60, 30); ctx.bezierCurveTo(46, 66, 14, 60, 0, 50); ctx.bezierCurveTo(-14, 60, -46, 66, -60, 30); ctx.bezierCurveTo(-80, -10, -40, -60, 0, -30); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.beginPath(); ctx.ellipse(-28, -10, 10, 18, 0.3, 0, 7); ctx.fill();
  ctx.strokeStyle = '#5A3A22'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(0, -30); ctx.lineTo(6, -60); ctx.stroke();
  ctx.fillStyle = '#3CC06B'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(26, -60, 22, 11, -0.4, 0, 7); ctx.fill(); ctx.stroke();
  ctx.restore();
}

// modern coins with different edges, face-on. kind: smooth | reeded | scallop | interrupted
function edgeCoin(ctx, x, y, r, kind, metal, hl) {
  const m = METAL[metal];
  ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round';
  const p = new Path2D(), N = 240;
  for (let i = 0; i <= N; i++) {
    const a = i / N * Math.PI * 2;
    let rr = r;
    if (kind === 'reeded') rr += (i % 2 ? -5 : 0);
    if (kind === 'scallop') rr += 7 * Math.cos(a * 9);
    if (kind === 'interrupted') { const seg = Math.floor(a / (Math.PI / 4)); if (seg % 2 === 0) rr += (i % 2 ? -5 : 0); }
    i ? p.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : p.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  p.closePath();
  if (hl) { ctx.save(); ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 40 * hl; ctx.fillStyle = '#FFD43B'; ctx.fill(p); ctx.restore(); }
  const g = ctx.createRadialGradient(-r * 0.4, -r * 0.4, r * 0.1, 0, 0, r * 1.05);
  g.addColorStop(0, m[0]); g.addColorStop(0.5, m[1]); g.addColorStop(1, m[2]);
  ctx.fillStyle = g; ctx.fill(p); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.stroke(p);
  ctx.strokeStyle = m[3]; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, r * 0.8, 0, 7); ctx.stroke();
  qEmblem(ctx, r / 170, m[3]);
  ctx.restore();
}

Object.assign(window, { GROUND4, studioBG, coin3D, oldCoin, sliver, shears, crucible, ingot, balance, decree, fileTool, newtonCameo, apple, edgeCoin });
