// EP08 painters — What if jeans had no rivets?
const STAND = 1300;                          // Quix's floor line in the denim shots
const P1 = [250, 640], P2 = [880, 1090];     // pocket opening: waistband end, side-seam end (rivets)
const DENIM = '#2F5C9E', DENIM_D = '#1F3F73', STITCH = '#FFB13B', COPPER = '#C8742E';

let denimBG = null;
function paintDenim() {
  const c = off(), g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#3D6DB3'); gr.addColorStop(1, '#244A86');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(255,255,255,0.07)'; g.lineWidth = 3;               // twill weave
  for (let x = -H; x < W; x += 14) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + H * 0.6, H); g.stroke(); }
  g.strokeStyle = 'rgba(0,0,0,0.08)';
  for (let x = -H; x < W; x += 23) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x + H * 0.6, H); g.stroke(); }
  // waistband + belt loop + button
  g.fillStyle = 'rgba(0,0,0,0.12)'; g.fillRect(0, 430, W, 170);
  g.strokeStyle = STITCH; g.lineWidth = 5; g.setLineDash([16, 10]);
  for (const y of [450, 580]) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  g.setLineDash([]);
  g.fillStyle = '#28508F'; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.roundRect(560, 400, 70, 230, 14); g.fill(); g.stroke();
  const bt = g.createRadialGradient(140, 500, 6, 150, 515, 60); bt.addColorStop(0, '#FFE2A8'); bt.addColorStop(1, '#A9782E');
  g.fillStyle = bt; g.beginPath(); g.arc(150, 515, 56, 0, 7); g.fill(); g.stroke();
  // pocket opening: curved edge with double stitching
  const curve = (gg, dx, dy) => { gg.beginPath(); gg.moveTo(P1[0] + dx, P1[1] + dy); gg.bezierCurveTo(P1[0] + 80 + dx, P1[1] + 330 + dy, P2[0] - 330 + dx, P2[1] - 60 + dy, P2[0] + dx, P2[1] + dy); };
  g.lineWidth = 10; g.strokeStyle = DENIM_D; curve(g, 0, 0); g.stroke();
  g.strokeStyle = STITCH; g.lineWidth = 5; g.setLineDash([16, 10]);
  curve(g, 18, -16); g.stroke(); curve(g, 32, -30); g.stroke(); g.setLineDash([]);
  // side seam
  g.strokeStyle = DENIM_D; g.lineWidth = 10; g.beginPath(); g.moveTo(P2[0], 430); g.lineTo(P2[0] + 40, H); g.stroke();
  g.strokeStyle = STITCH; g.lineWidth = 5; g.setLineDash([16, 10]); g.beginPath(); g.moveTo(P2[0] - 18, 600); g.lineTo(P2[0] + 22, H); g.stroke(); g.setLineDash([]);
  denimBG = c;
}
function denim(ctx) { if (!denimBG) paintDenim(); ctx.drawImage(denimBG, 0, 0); }

// copper rivet, a = alpha/scale, glow 0..1
function rivet(ctx, x, y, a, glow = 0, r = 30) {
  if (a <= 0) return;
  ctx.save(); ctx.translate(x, y); ctx.scale(a, a);
  if (glow > 0) { ctx.shadowColor = '#FFD43B'; ctx.shadowBlur = 40 * glow; }
  const g = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 2, 0, 0, r); g.addColorStop(0, '#FFD9A8'); g.addColorStop(0.5, COPPER); g.addColorStop(1, '#7A3E12');
  ctx.fillStyle = g; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.arc(0, 0, r * 0.35, 0, 7); ctx.fill();
  ctx.restore();
}
function rivets(ctx, a, glow = 0) { rivet(ctx, P1[0], P1[1], a, glow); rivet(ctx, P2[0], P2[1], a, glow); }

// tear at the side-seam corner, k 0..1, t for flapping threads
function tear(ctx, k, t) {
  if (k <= 0) return;
  const [x, y] = P2, L = 320 * k;
  ctx.save(); ctx.lineJoin = 'round';
  ctx.fillStyle = '#0B1530'; ctx.strokeStyle = INK; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(x, y);
  for (let i = 0; i <= 8; i++) { const f = i / 8; ctx.lineTo(x - L * f + (i % 2 ? 14 : -10), y - L * 0.55 * f + (i % 2 ? -18 : 10)); }
  for (let i = 8; i >= 0; i--) { const f = i / 8; ctx.lineTo(x - L * f * 0.9 + (i % 2 ? 10 : -14), y + 60 * k * Math.sin(f * Math.PI) - L * 0.35 * f); }
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = '#C9DAF2'; ctx.lineWidth = 3;                     // frayed threads
  for (let i = 0; i < 14; i++) { const f = hash(i), px = x - L * f, py = y - L * 0.5 * f; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + 10 * Math.sin(t * 9 + i), py + 26 + 8 * hash(i + 3)); ctx.stroke(); }
  ctx.restore();
}

function phone(ctx, x, y, rot, a = 1) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = '#1A1033'; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(-70, -140, 140, 280, 24); ctx.fill(); ctx.stroke();
  const g = ctx.createLinearGradient(0, -120, 0, 120); g.addColorStop(0, '#7B5CFF'); g.addColorStop(1, '#5CE1FF');
  ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-58, -124, 116, 248, 16); ctx.fill();
  ctx.restore();
}

function hammer(ctx, x, y, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineJoin = 'round';
  ctx.fillStyle = '#B5793F'; ctx.beginPath(); ctx.roundRect(-14, -20, 28, 230, 10); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#9AA3B8'; ctx.beginPath(); ctx.roundRect(-75, -60, 150, 56, 10); ctx.fill(); ctx.stroke();
  ctx.restore();
}

// cross-section: two denim layers pinned by a rivet; k 0..1 = rivet pressed in
function rivetSection(ctx, x, y, k, pull) {
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.lineJoin = 'round';
  const gap = 22 + 60 * pull * (1 - k);
  ctx.fillStyle = '#3D6DB3'; ctx.beginPath(); ctx.roundRect(-380 - 40 * pull * (1 - k), -60 - gap / 2, 760, 60, 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#28508F'; ctx.beginPath(); ctx.roundRect(-380 + 40 * pull * (1 - k), gap / 2, 760, 60, 12); ctx.fill(); ctx.stroke();
  if (k > 0) {
    const dy = (1 - ease.out(k)) * -260;
    ctx.fillStyle = COPPER;
    ctx.beginPath(); ctx.roundRect(-22, -110 + dy, 44, 230, 10); ctx.fill(); ctx.stroke();          // post
    ctx.beginPath(); ctx.ellipse(0, -110 + dy, 90, 34, 0, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke(); // cap
    if (k > 0.9) { ctx.beginPath(); ctx.ellipse(0, 120, 70, 24, 0, 0, Math.PI); ctx.closePath(); ctx.fill(); ctx.stroke(); } // peened end
  }
  ctx.restore();
}

// patent document on parchment
function patentDoc(ctx, x, y, s, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  ctx.fillStyle = '#F3E3BE'; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-330, -430, 660, 860, 16); ctx.fill(); ctx.stroke();
  txt(ctx, 'UNITED STATES', 0, -350, { size: 44, font: 'Bungee', color: '#5A3A1A', shadow: false });
  txt(ctx, 'PATENT OFFICE', 0, -295, { size: 44, font: 'Bungee', color: '#5A3A1A', shadow: false });
  txt(ctx, 'No. 139,121', 0, -190, { size: 70, font: 'Bungee', color: INK, shadow: false });
  txt(ctx, 'JACOB W. DAVIS', 0, -110, { size: 42, font: 'Lilita', color: INK, shadow: false });
  txt(ctx, '+ LEVI STRAUSS & CO.', 0, -60, { size: 34, font: 'Lilita', color: INK, shadow: false });
  txt(ctx, 'FASTENING POCKET-OPENINGS', 0, 10, { size: 36, font: 'Lilita', color: '#5A3A1A', shadow: false });
  ctx.strokeStyle = 'rgba(90,58,26,0.45)'; ctx.lineWidth = 5;
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-250, 80 + i * 50); ctx.lineTo(250 - (i % 3) * 60, 80 + i * 50); ctx.stroke(); }
  txt(ctx, 'MAY 20, 1873', 0, 370, { size: 52, font: 'Bungee', color: '#8E1B2C', shadow: false });
  ctx.restore();
}
