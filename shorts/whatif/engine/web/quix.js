(() => {
// QUIX — recurring host of the "WHAT IF?" series.
// Signature: a glowing "?" antenna. Quix himself is the dot of the question
// mark, so his silhouette reads as "?" — and it morphs into "!" on a realisation.
// Local space: origin = ground between the feet, body height ~400 units, y up = negative.

const Q = {
  ink: '#1A1033',
  bodyHi: '#9A84FF', body: '#6E52F5', bodyLo: '#4A2FD0',
  scarf: '#FF6B2C', scarfLo: '#D94E16', scarfHi: '#FFA066',
  volt: '#FFD43B', voltHi: '#FFF6C2',
  glove: '#FFFFFF', gloveLo: '#D9D2F2',
  shoe: '#F7F5FF', sole: '#2B1E52',
};

const EXPR = {
  //        lid   lidTilt browY  browTilt lower  pupil
  cool:    [0.30,  0.10,  0,     -0.10,   0.00,  1.00],
  happy:   [0.12,  0.00, -8,     -0.05,   0.25,  1.00],
  curious: [0.05,  0.00, -10,     0.00,   0.00,  1.00, 'raise'],
  shock:   [0.00,  0.00, -22,     0.12,   0.00,  0.55],
  worried: [0.12, -0.18, -12,     0.32,   0.00,  0.85],
  disgust: [0.40,  0.10,  6,     -0.25,   0.38,  0.90],
  smug:    [0.42,  0.18,  2,     -0.18,   0.12,  1.00, 'raise'],
};

function bodyPath() {
  const p = new Path2D(), y0 = -398, y1 = -68, h = y1 - y0, w = 292, ym = y0 + 0.6 * h;
  p.moveTo(0, y0);
  p.bezierCurveTo(w * 0.37, y0, w * 0.5, ym - h * 0.42, w * 0.5, ym);
  p.bezierCurveTo(w * 0.5, ym + h * 0.27, w * 0.3, y1, 0, y1);
  p.bezierCurveTo(-w * 0.3, y1, -w * 0.5, ym + h * 0.27, -w * 0.5, ym);
  p.bezierCurveTo(-w * 0.5, ym - h * 0.42, -w * 0.37, y0, 0, y0);
  p.closePath();
  return p;
}
const BODY = bodyPath();

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));

// "?" control points (base at 0,0) and "!" variant; morph = 0..1
const QM = [[0, 0], [0, -42], [0, -64], [50, -70], [50, -110], [50, -150], [-48, -152], [-48, -112]];
const EX = [[0, 0], [0, -40], [0, -70], [0, -95], [0, -120], [0, -140], [0, -160], [0, -178]];

function antennaPts(m) { return QM.map((p, i) => [lerp(p[0], EX[i][0], m), lerp(p[1], EX[i][1], m)]); }

function strokeAntenna(ctx, P) {
  ctx.beginPath();
  ctx.moveTo(...P[0]); ctx.lineTo(...P[1]);
  ctx.bezierCurveTo(...P[2], ...P[3], ...P[4]);
  ctx.bezierCurveTo(...P[5], ...P[6], ...P[7]);
  ctx.stroke();
}

function drawAntenna(ctx, o) {
  const P = antennaPts(o.morph || 0), g = o.glow || 0, t = o.t || 0;
  ctx.save();
  ctx.translate(0, -392);
  ctx.rotate(o.antAngle || 0);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = Q.ink; ctx.lineWidth = 34; strokeAntenna(ctx, P);
  ctx.save();
  ctx.shadowColor = Q.volt; ctx.shadowBlur = 18 + 50 * g;
  ctx.strokeStyle = Q.volt; ctx.lineWidth = 20; strokeAntenna(ctx, P);
  if (g > 0.01) { ctx.globalAlpha = g; ctx.strokeStyle = '#FFFBE6'; ctx.lineWidth = 20; strokeAntenna(ctx, P); }
  ctx.restore();
  ctx.strokeStyle = Q.voltHi; ctx.lineWidth = 6; ctx.globalAlpha = 0.85;
  ctx.save(); ctx.translate(-4, -2); strokeAntenna(ctx, P); ctx.restore();
  ctx.globalAlpha = 1;
  // tip spark
  const tip = P[7], r = 9 + 7 * g + 2 * Math.sin(t * 9);
  ctx.save();
  ctx.shadowColor = Q.volt; ctx.shadowBlur = 30 + 60 * g;
  ctx.fillStyle = '#FFFDF0';
  ctx.beginPath(); ctx.arc(tip[0], tip[1], r * 0.55, 0, 7); ctx.fill();
  ctx.restore();
  ctx.restore();
  // world-space tip position for beams
  const a = o.antAngle || 0, c = Math.cos(a), s = Math.sin(a);
  return [tip[0] * c - tip[1] * s, -392 + tip[0] * s + tip[1] * c];
}

function drawEye(ctx, x, y, side, o, E) {
  const rx = 41, ry = 51;
  const blink = clamp(o.blink || 0);
  let lid = lerp(E[0], 1, blink), lower = E[4] * (1 - blink);
  const raise = E[6] === 'raise' && side > 0;
  if (raise) lid *= 0.2;
  ctx.save();
  ctx.translate(x, y);
  // white
  ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, 7);
  ctx.fillStyle = '#fff'; ctx.fill();
  ctx.save(); ctx.clip();
  // pupil
  const lk = o.look || [0, 0], ps = E[5] * (o.pupil || 1);
  const px = lk[0] * 16, py = lk[1] * 18 + 4;
  ctx.fillStyle = '#120A26';
  ctx.beginPath(); ctx.ellipse(px, py, 23 * ps, 27 * ps, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#3B2A7A';
  ctx.beginPath(); ctx.ellipse(px, py + 8 * ps, 15 * ps, 12 * ps, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#120A26';
  ctx.beginPath(); ctx.ellipse(px, py - 2, 15 * ps, 18 * ps, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(px + 9 * ps, py - 11 * ps, 7.5 * ps, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.arc(px - 8 * ps, py + 10 * ps, 3.2 * ps, 0, 7); ctx.fill();
  // eye shading
  ctx.fillStyle = 'rgba(90,70,180,0.16)';
  ctx.beginPath(); ctx.ellipse(0, -ry * 0.75, rx * 1.2, ry * 0.5, 0, 0, 7); ctx.fill();
  // upper lid (tilt: + = inner corner lower -> confident)
  const tilt = (E[1] + (raise ? -0.1 : 0)) * side;
  const ly = -ry + lid * 2 * ry;
  ctx.fillStyle = Q.bodyLo;
  ctx.beginPath();
  ctx.moveTo(-rx - 5, ly + tilt * rx * -1.0 * 0.9);
  ctx.lineTo(rx + 5, ly + tilt * rx * 0.9);
  ctx.lineTo(rx + 5, -ry - 10); ctx.lineTo(-rx - 5, -ry - 10); ctx.closePath();
  ctx.fill();
  if (lid > 0.03) {
    ctx.strokeStyle = Q.ink; ctx.lineWidth = 7; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-rx - 5, ly - tilt * rx * 0.9); ctx.lineTo(rx + 5, ly + tilt * rx * 0.9); ctx.stroke();
  }
  if (lower > 0.01) {
    const by = ry - lower * 2 * ry;
    ctx.fillStyle = Q.body;
    ctx.beginPath(); ctx.moveTo(-rx - 5, by); ctx.quadraticCurveTo(0, by - 10, rx + 5, by);
    ctx.lineTo(rx + 5, ry + 10); ctx.lineTo(-rx - 5, ry + 10); ctx.fill();
    ctx.strokeStyle = Q.ink; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-rx - 5, by); ctx.quadraticCurveTo(0, by - 10, rx + 5, by); ctx.stroke();
  }
  ctx.restore();
  ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, 7);
  ctx.strokeStyle = Q.ink; ctx.lineWidth = 7; ctx.stroke();
  // brow
  const bt = E[3] + (raise ? -0.35 : 0);
  const byy = -ry - 22 + E[2] + (raise ? -14 : 0) + (o.browY || 0);
  ctx.strokeStyle = Q.ink; ctx.lineWidth = 15; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-30 * side - 0, byy + bt * 30 * side * -1 * side);
  ctx.quadraticCurveTo(0, byy - 8, 30 * side, byy - bt * 30 * side * -1 * side);
  ctx.stroke();
  ctx.restore();
}

function drawMouth(ctx, o, E) {
  const m = clamp(o.mouth || 0), ex = o.expr || 'cool';
  ctx.save();
  ctx.translate(4, -232);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (ex === 'shock' && m < 0.2) {
    ctx.fillStyle = '#2A0B2E';
    ctx.beginPath(); ctx.ellipse(0, 4, 17, 22, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = Q.ink; ctx.lineWidth = 6; ctx.stroke();
  } else if (m < 0.08) {
    ctx.strokeStyle = Q.ink; ctx.lineWidth = 9;
    ctx.beginPath();
    if (ex === 'worried' || ex === 'disgust') {
      ctx.moveTo(-34, 6); ctx.bezierCurveTo(-18, -6, -6, 10, 6, 0); ctx.bezierCurveTo(16, -8, 26, 6, 34, 2);
    } else if (ex === 'happy') {
      ctx.moveTo(-40, -6); ctx.quadraticCurveTo(0, 30, 40, -6);
    } else { // cool smirk, asymmetric
      ctx.moveTo(-36, 0); ctx.quadraticCurveTo(-2, 16, 30, -2); ctx.quadraticCurveTo(36, -6, 40, -12);
    }
    ctx.stroke();
  } else {
    const w = ex === 'shock' ? 30 + 10 * m : 40 + 8 * m, h = 10 + 44 * m;
    const p = new Path2D();
    p.moveTo(-w, -4);
    p.quadraticCurveTo(0, -10 + (ex === 'happy' ? 6 : 0), w, -6);
    p.bezierCurveTo(w * 0.9, h * 0.9, -w * 0.9, h * 1.1, -w, -4);
    p.closePath();
    ctx.fillStyle = '#2A0B2E'; ctx.fill(p);
    ctx.save(); ctx.clip(p);
    ctx.fillStyle = '#FF6F8E';
    ctx.beginPath(); ctx.ellipse(4, h * 0.95, w * 0.7, h * 0.45, 0, 0, 7); ctx.fill();
    if (m > 0.25) { ctx.fillStyle = '#fff'; ctx.fillRect(-w, -14, w * 2, 12); }
    ctx.restore();
    ctx.strokeStyle = Q.ink; ctx.lineWidth = 7; ctx.stroke(p);
  }
  ctx.restore();
}

function drawHand(ctx, x, y, ang, shape) {
  ctx.save();
  ctx.translate(x, y); ctx.rotate(ang);
  ctx.lineJoin = 'round';
  const glove = (fn) => { ctx.beginPath(); fn(); ctx.fillStyle = Q.glove; ctx.fill(); ctx.strokeStyle = Q.ink; ctx.lineWidth = 7; ctx.stroke(); };
  // cuff
  glove(() => ctx.roundRect(-30, -22, 18, 44, 7));
  if (shape === 'point') {
    glove(() => ctx.roundRect(8, -11, 54, 22, 11));
    glove(() => ctx.arc(4, 4, 26, 0, 7));
  } else if (shape === 'thumb') {
    glove(() => ctx.arc(4, 0, 27, 0, 7));
    glove(() => ctx.roundRect(-8, -56, 22, 44, 11));
  } else if (shape === 'open') {
    for (const a of [-0.55, -0.18, 0.18, 0.55]) glove(() => { ctx.save(); ctx.rotate(a); ctx.roundRect(12, -9, 40, 18, 9); ctx.restore(); });
    glove(() => ctx.arc(6, 0, 28, 0, 7));
  } else { // fist / pinch
    glove(() => ctx.arc(4, 0, 28, 0, 7));
    ctx.strokeStyle = Q.gloveLo; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(8, 0, 14, -1.1, 1.1); ctx.stroke();
  }
  ctx.restore();
}

function drawArm(ctx, sx, sy, hx, hy, bend, shape, handAng) {
  const mx = (sx + hx) / 2, my = (sy + hy) / 2;
  const dx = hx - sx, dy = hy - sy, L = Math.hypot(dx, dy) || 1;
  const cx = mx - dy / L * bend, cy = my + dx / L * bend;
  ctx.lineCap = 'round';
  ctx.strokeStyle = Q.ink; ctx.lineWidth = 44;
  ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(cx, cy, hx, hy); ctx.stroke();
  ctx.strokeStyle = Q.body; ctx.lineWidth = 28;
  ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(cx, cy, hx, hy); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(sx, sy - 6); ctx.quadraticCurveTo(cx, cy - 6, hx, hy - 6); ctx.stroke();
  const ang = handAng != null ? handAng : Math.atan2(hy - cy, hx - cx);
  drawHand(ctx, hx, hy, ang, shape);
}

function drawShoe(ctx, x, side) {
  ctx.save(); ctx.translate(x, -4);
  ctx.lineJoin = 'round';
  const p = new Path2D();
  p.moveTo(-40 * side, 0);
  p.bezierCurveTo(-46 * side, -36, -14 * side, -52, 10 * side, -44);
  p.bezierCurveTo(34 * side, -38, 58 * side, -26, 58 * side, -4);
  p.lineTo(58 * side, 0); p.closePath();
  ctx.fillStyle = Q.shoe; ctx.fill(p);
  ctx.save(); ctx.clip(p);
  ctx.fillStyle = Q.scarf; ctx.fillRect(-60, -16, 120, 7);
  ctx.beginPath(); ctx.ellipse(40 * side, -14, 22, 20, 0, 0, 7); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = Q.ink; ctx.lineWidth = 7; ctx.stroke(p);
  ctx.fillStyle = Q.sole; ctx.beginPath(); ctx.roundRect(side > 0 ? -44 : -62, -6, 106, 14, 7); ctx.fill();
  ctx.restore();
}

function scarfTails(ctx, t, wind) {
  const w = wind == null ? 1 : wind;
  for (const [ox, len, ph] of [[0, 1, 0], [18, 0.82, 1.3]]) {
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const u = i / 10;
      const x = 108 + ox * 0.6 + u * (34 + 46 * w) * len + Math.sin(t * 5 + u * 3 + ph) * 9 * u * w;
      const y = -150 + u * (96 - 18 * w) * len + Math.sin(t * 6.3 + u * 4 + ph) * 5 * u * w;
      pts.push([x, y]);
    }
    const wid = (u) => 32 - 6 * u;
    ctx.beginPath();
    pts.forEach((p, i) => { const u = i / 10; i ? ctx.lineTo(p[0] - 4, p[1] - wid(u) / 2) : ctx.moveTo(p[0], p[1] - wid(u) / 2); });
    for (let i = 10; i >= 0; i--) { const u = i / 10; ctx.lineTo(pts[i][0] + 4, pts[i][1] + wid(u) / 2); }
    ctx.closePath();
    ctx.fillStyle = ph ? Q.scarfLo : Q.scarf; ctx.fill();
    ctx.strokeStyle = Q.ink; ctx.lineWidth = 7; ctx.lineJoin = 'round'; ctx.stroke();
    // knit stripes
    ctx.strokeStyle = ph ? Q.scarf : Q.scarfLo; ctx.lineWidth = 6;
    for (const u of [0.45, 0.75]) { const p = pts[Math.round(u * 10)]; ctx.beginPath(); ctx.moveTo(p[0] - 14, p[1] - 4); ctx.lineTo(p[0] + 14, p[1] + 4); ctx.stroke(); }
  }
}

function drawScarf(ctx, t) {
  const p = new Path2D();
  p.moveTo(-150, -206); p.quadraticCurveTo(0, -176, 150, -206);
  p.lineTo(152, -160); p.quadraticCurveTo(0, -128, -152, -160); p.closePath();
  ctx.save();
  ctx.fillStyle = Q.scarf; ctx.fill(p);
  ctx.clip(p);
  ctx.strokeStyle = Q.scarfLo; ctx.lineWidth = 9;
  for (let x = -170; x < 180; x += 30) { ctx.beginPath(); ctx.moveTo(x, -215); ctx.lineTo(x + 22, -120); ctx.stroke(); }
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.beginPath(); ctx.moveTo(-150, -206); ctx.quadraticCurveTo(0, -176, 150, -206); ctx.lineTo(150, -196); ctx.quadraticCurveTo(0, -166, -150, -196); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = Q.ink; ctx.lineWidth = 8; ctx.lineJoin = 'round'; ctx.stroke(p);
  // knot
  ctx.beginPath(); ctx.ellipse(104, -160, 30, 26, 0.3, 0, 7);
  ctx.fillStyle = Q.scarf; ctx.fill(); ctx.stroke();
  ctx.strokeStyle = Q.scarfLo; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(104, -160, 14, -0.5, 2); ctx.stroke();
}

function drawWig(ctx, back) {
  const curls = back
    ? [[-150, -250, 40], [150, -250, 40], [-158, -205, 36], [158, -205, 36], [-150, -160, 32], [150, -160, 32]]
    : [[-120, -350, 38], [-70, -392, 38], [-20, -408, 38], [30, -405, 38], [80, -388, 38], [122, -345, 38], [-140, -300, 34], [142, -300, 34]];
  for (const [x, y, r] of curls) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, 7);
    ctx.fillStyle = '#F4F1E8'; ctx.fill();
    ctx.strokeStyle = Q.ink; ctx.lineWidth = 7; ctx.stroke();
    ctx.strokeStyle = '#CFC8B5'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(x, y, r * 0.5, 0.5, 4); ctx.stroke();
  }
}

function drawMatch(ctx, x, y, flame, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.35);
  ctx.fillStyle = '#E8C48A'; ctx.strokeStyle = Q.ink; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.roundRect(-5, -90, 10, 90, 4); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#C8262E'; ctx.beginPath(); ctx.ellipse(0, -94, 9, 12, 0, 0, 7); ctx.fill(); ctx.stroke();
  if (flame > 0.01) {
    const f = flame * (1 + 0.12 * Math.sin(t * 31) + 0.08 * Math.sin(t * 17));
    ctx.save();
    ctx.shadowColor = '#FFB020'; ctx.shadowBlur = 50 * flame;
    ctx.fillStyle = '#FF8A1F';
    ctx.beginPath(); ctx.moveTo(0, -150 * f - 90 + 50 * (1 - f));
    ctx.bezierCurveTo(26 * f, -120, 22 * f, -96, 0, -92); ctx.bezierCurveTo(-22 * f, -96, -26 * f, -120, 0, -150 * f - 90 + 50 * (1 - f)); ctx.fill();
    ctx.fillStyle = '#FFE27A';
    ctx.beginPath(); ctx.moveTo(0, -128 * f - 70 + 40 * (1 - f) - 20);
    ctx.bezierCurveTo(12 * f, -112, 10 * f, -98, 0, -96); ctx.bezierCurveTo(-10 * f, -98, -12 * f, -112, 0, -128 * f - 90 + 40 * (1 - f)); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function sweatDrop(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, -30); ctx.bezierCurveTo(14, -8, 18, 6, 0, 14); ctx.bezierCurveTo(-18, 6, -14, -8, 0, -30);
  ctx.fillStyle = '#8FE3FF'; ctx.fill(); ctx.strokeStyle = Q.ink; ctx.lineWidth = 5; ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(-4, 0, 3, 6, 0, 0, 7); ctx.fill();
  ctx.restore();
}


function drawFedora(ctx) {
  ctx.save(); ctx.lineJoin = 'round';
  ctx.fillStyle = '#3B3552'; ctx.strokeStyle = Q.ink; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.ellipse(0, -372, 196, 30, 0, 0, 7); ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-118, -380); ctx.bezierCurveTo(-120, -440, -104, -476, -60, -478);
  ctx.quadraticCurveTo(0, -458, 60, -478); ctx.bezierCurveTo(104, -476, 120, -440, 118, -380);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = Q.scarf; ctx.beginPath(); ctx.moveTo(-119, -410); ctx.lineTo(119, -410); ctx.lineTo(118, -382); ctx.lineTo(-118, -382); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.ellipse(-60, -440, 22, 30, 0.2, 0, 7); ctx.fill();
  ctx.restore();
}

function drawTears(ctx, t, a) {
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round';
  for (const sd of [-1, 1]) {
    const x0 = 58 * sd + 22 * sd, y0 = -262;
    ctx.strokeStyle = Q.ink; ctx.lineWidth = 18;
    const path = () => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x0 + 14 * sd, y0 + 40, x0 + 6 * sd, y0 + 80); };
    path(); ctx.stroke(); ctx.strokeStyle = '#8FE3FF'; ctx.lineWidth = 10; path(); ctx.stroke();
    const ph = (t * 1.6 + (sd > 0 ? 0.5 : 0)) % 1;
    sweatDrop(ctx, x0 + 8 * sd, y0 + 90 + ph * 90, 0.7 * (1 - ph * 0.3));
  }
  ctx.restore();
}

// Arm poses: [handX, handY, bend, shape, handAngle|null] relative to local space
const POSE = {
  idle:   { L: [-190, -95, -30, 'fist', null], R: [190, -95, 30, 'fist', null] },
  hips:   { L: [-150, -120, -70, 'fist', null], R: [150, -120, 70, 'fist', null] },
  wave:   { L: [-190, -95, -30, 'fist', null], R: [230, -330, -40, 'open', -1.2] },
  point:  { L: [-190, -95, -30, 'fist', null], R: [300, -260, -20, 'point', -0.35] },
  pointL: { L: [-300, -260, 20, 'point', Math.PI + 0.35], R: [190, -95, 30, 'fist', null] },
  thumb:  { L: [-190, -95, -30, 'fist', null], R: [230, -230, 40, 'thumb', 0] },
  nose:   { L: [-190, -110, -30, 'fist', null], R: [10, -268, 60, 'fist', Math.PI * 0.95] },
  match:  { L: [-190, -100, -30, 'fist', null], R: [175, -215, 40, 'fist', -0.2] },
  shrug:  { L: [-240, -240, 50, 'open', Math.PI + 0.8], R: [240, -240, -50, 'open', -0.8] },
  think:  { L: [-190, -95, -30, 'fist', null], R: [60, -200, 70, 'fist', -2.2] },
  cheer:  { L: [-230, -360, 40, 'fist', -1.9], R: [230, -360, -40, 'fist', -1.2] },
  tap:    { L: [-190, -95, -30, 'fist', null], R: [250, -170, 30, 'open', 0.3] },
  umbrella: { L: [-190, -95, -30, 'fist', null], R: [120, -330, 40, 'fist', -1.6] },
  cough:  { L: [-190, -100, -30, 'fist', null], R: [40, -230, 70, 'fist', Math.PI * 0.9] },
};

function mixPose(a, b, t) {
  const A = POSE[a] || a, B = POSE[b] || b, out = {};
  for (const s of ['L', 'R']) {
    const pa = A[s], pb = B[s];
    out[s] = [lerp(pa[0], pb[0], t), lerp(pa[1], pb[1], t), lerp(pa[2], pb[2], t), t < 0.5 ? pa[3] : pb[3],
      pa[4] == null && pb[4] == null ? null : lerp(pa[4] ?? (s === 'L' ? Math.PI : 0), pb[4] ?? (s === 'L' ? Math.PI : 0), t)];
  }
  return out;
}

/*  drawQuix(ctx, o)
    o: x,y (ground), s scale, t time, mouth 0..1, expr, look [x,y], blink,
       pose (name or mixed object), lean (rad), squash (1 = none), glow, morph,
       antAngle, tint {color, a}, wig, match (flame 0..1 or null), sweat 0..1, shadow */
function drawQuix(ctx, o) {
  const t = o.t || 0, E = EXPR[o.expr || 'cool'];
  const breathe = 1 + 0.014 * Math.sin(t * 2.6);
  const sq = (o.squash || 1) * breathe;
  const pose = typeof o.pose === 'object' && o.pose ? o.pose : POSE[o.pose || 'idle'];
  ctx.save();
  ctx.translate(o.x, o.y);
  ctx.scale(o.s || 1, o.s || 1);
  if (o.shadow !== false) {
    ctx.fillStyle = 'rgba(10,5,30,0.28)';
    ctx.beginPath(); ctx.ellipse(0, 4, 170, 26, 0, 0, 7); ctx.fill();
  }
  ctx.rotate(o.lean || 0);
  // legs + shoes (not squashed)
  ctx.lineCap = 'round';
  for (const sd of [-1, 1]) {
    ctx.strokeStyle = Q.ink; ctx.lineWidth = 40;
    ctx.beginPath(); ctx.moveTo(52 * sd, -90); ctx.lineTo(56 * sd, -30); ctx.stroke();
    ctx.strokeStyle = Q.bodyLo; ctx.lineWidth = 26;
    ctx.beginPath(); ctx.moveTo(52 * sd, -90); ctx.lineTo(56 * sd, -30); ctx.stroke();
  }
  drawShoe(ctx, -58, -1); drawShoe(ctx, 58, 1);
  // body group (squash around feet)
  ctx.save();
  ctx.translate(0, -60);
  ctx.scale(1 / Math.sqrt(sq), sq);
  ctx.translate(0, 60);
  if (o.wig) drawWig(ctx, true);
  scarfTails(ctx, t, o.wind);
  const tip = drawAntenna(ctx, o);
  // body fill
  const g = ctx.createLinearGradient(-120, -390, 110, -80);
  g.addColorStop(0, Q.bodyHi); g.addColorStop(0.45, Q.body); g.addColorStop(1, Q.bodyLo);
  ctx.fillStyle = g; ctx.fill(BODY);
  ctx.save(); ctx.clip(BODY);
  ctx.fillStyle = 'rgba(40,18,140,0.35)';
  ctx.beginPath(); ctx.ellipse(120, -170, 120, 210, -0.2, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.32)';
  ctx.beginPath(); ctx.ellipse(-72, -330, 34, 54, -0.5, 0, 7); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  ctx.beginPath(); ctx.ellipse(-112, -220, 14, 60, -0.15, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(120,240,255,0.55)'; ctx.lineWidth = 9;
  ctx.save(); ctx.translate(9, 4); ctx.beginPath();
  ctx.rect(-200, -420, 120, 380); ctx.clip(); ctx.stroke(BODY); ctx.restore();
  // cheeks
  ctx.fillStyle = 'rgba(255,120,170,0.35)';
  ctx.beginPath(); ctx.ellipse(-92, -250, 22, 13, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(96, -250, 22, 13, 0, 0, 7); ctx.fill();
  ctx.restore();
  ctx.strokeStyle = Q.ink; ctx.lineWidth = 10; ctx.lineJoin = 'round'; ctx.stroke(BODY);
  if (o.wig) drawWig(ctx, false);
  if (o.hat === 'fedora') drawFedora(ctx);
  drawScarf(ctx, t);
  drawEye(ctx, -58, -305, -1, o, E);
  drawEye(ctx, 58, -305, 1, o, E);
  drawMouth(ctx, o, E);
  if (o.tears) drawTears(ctx, t, o.tears);
  if (o.sweat) sweatDrop(ctx, 150, -330, o.sweat);
  // arms
  for (const sd of ['L', 'R']) {
    const p = pose[sd], sx = sd === 'L' ? -132 : 132;
    drawArm(ctx, sx, -150, p[0], p[1], p[2], p[3], p[4]);
  }
  if (o.match != null) {
    const p = pose.R;
    drawMatch(ctx, p[0] + 10, p[1] - 6, o.match, t);
  }
  ctx.restore();
  ctx.restore();
  // tint overlay handled by caller via offscreen if needed
  const s = o.s || 1, c = Math.cos(o.lean || 0), sn = Math.sin(o.lean || 0);
  return { tip: [o.x + s * (tip[0] * c - tip[1] * sn), o.y + s * (tip[0] * sn + tip[1] * c)] };
}

window.QUIX = { drawQuix, POSE, mixPose, EXPR, Q, sweatDrop, drawHand };

})();
