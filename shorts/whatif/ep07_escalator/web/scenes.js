// EP07 painters — What if escalators had no side brushes?
const ESC_A = -0.42;                       // slope of the escalator (radians)
const ESC_O = [540, 1000];                 // escalator origin in world space
const GAP = [0, -12];                      // where the step meets the side wall (escalator frame)
const cA = Math.cos(ESC_A), sA = Math.sin(ESC_A);
const toWorld = (x, y) => [ESC_O[0] + x * cA - y * sA, ESC_O[1] + x * sA + y * cA];
const GAP_W = toWorld(GAP[0], GAP[1]);

let storeBG = null;
function paintStore() {
  const c = off(), g = c.getContext('2d');
  const wall = g.createLinearGradient(0, 0, 0, H); wall.addColorStop(0, '#FFE9D6'); wall.addColorStop(1, '#F3C9A0');
  g.fillStyle = wall; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(255,255,255,0.35)';
  for (let x = 0; x < W; x += 180) g.fillRect(x, 150, 90, 520);            // shop windows
  g.fillStyle = '#B9866A'; g.fillRect(0, 1600, W, H);                      // floor
  g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 4;
  for (let x = -200; x < W + 200; x += 160) { g.beginPath(); g.moveTo(x, 1600); g.lineTo(W / 2 + (x - W / 2) * 1.6, H); g.stroke(); }
  storeBG = c;
}

// Moving escalator in its own frame. o.brushes 0..1, o.speed (px/s), o.shift for step offset.
function escalator(ctx, t, o = {}) {
  if (!storeBG) paintStore();
  ctx.drawImage(storeBG, 0, 0);
  const S = 130, speed = o.speed ?? 60, off = (t * speed) % S;
  ctx.save(); ctx.translate(ESC_O[0], ESC_O[1]); ctx.rotate(ESC_A);
  ctx.fillStyle = '#2A2F45'; ctx.fillRect(-1000, 70, 2000, 90);                      // truss
  ctx.fillStyle = '#8FA0C2'; ctx.strokeStyle = INK; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.roundRect(-1000, -170, 2000, 110, 20); ctx.fill(); ctx.stroke(); // side wall
  for (let x = -1000 - S; x < 1000; x += S) {
    const sx = x + off;
    ctx.fillStyle = '#DDE3EE'; ctx.fillRect(sx, 0, S - 8, 70);
    ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.strokeRect(sx, 0, S - 8, 70);
    ctx.lineWidth = 4; for (let r = 0; r < 4; r++) { ctx.beginPath(); ctx.moveTo(sx + 12 + r * 28, 18); ctx.lineTo(sx + 12 + r * 28, 70); ctx.stroke(); }
  }
  if (o.brushes > 0) {                                                                // side brushes at the gap
    ctx.save(); ctx.globalAlpha = clamp(o.brushes); ctx.strokeStyle = '#4A3B2E'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    for (let x = -1000; x < 1000; x += 11) {
      const tilt = (hash(Math.floor(x)) - 0.5) * 10;
      ctx.beginPath(); ctx.moveTo(x, -60); ctx.lineTo(x + tilt, -4); ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
}

// Red emergency stop button, drawn in world space.
function stopButton(ctx, x, y, a, pressed) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y);
  ctx.fillStyle = '#FFD43B'; ctx.strokeStyle = INK; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.roundRect(-80, -80, 160, 160, 18); ctx.fill(); ctx.stroke();
  ctx.fillStyle = pressed ? '#8E1B2C' : '#FF3B5C';
  ctx.beginPath(); ctx.arc(0, 0, pressed ? 52 : 60, 0, 7); ctx.fill(); ctx.stroke();
  ctx.restore();
}

// Sneaker, drawn in world space, rot in radians.
function sneaker(ctx, x, y, s, rot, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineJoin = 'round';
  ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.roundRect(-70, -60, 120, 80, 30); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FF6B2C'; ctx.beginPath(); ctx.roundRect(-70, 0, 150, 32, 14); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#FFD43B'; ctx.fillRect(-20, -40, 40, 6);                            // lace
  ctx.restore();
}
