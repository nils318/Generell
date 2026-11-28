// EP09 — 3D world: desk, keyboard (with F/J/5 bumps), monitor, typing gloves, 3D Quix.
const U = 0.5, KEY_TOP = 0.42;
const ROWS = [
  { keys: '1234567890', x0: -5.0, z: -2 },
  { keys: 'QWERTYUIOP', x0: -4.5, z: -1 },
  { keys: "ASDFGHJKL;", x0: -4.25, z: 0 },
  { keys: 'ZXCVBNM,./', x0: -3.75, z: 1 },
];
const PAD = [['7', 6.6, -1], ['8', 7.6, -1], ['9', 8.6, -1], ['4', 6.6, 0], ['5', 7.6, 0], ['6', 8.6, 0], ['1', 6.6, 1], ['2', 7.6, 1], ['3', 8.6, 1], ['0', 7.1, 2, 2]];
const W3 = { keys: {}, pad: {}, bumps: {} };

function keyLabel(g, w, h, ch, hl) {
  g.fillStyle = hl ? '#FFE27A' : '#F4F5FB'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(26,16,51,0.18)'; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8);
  g.fillStyle = '#1A1033'; g.font = `${ch.length > 1 ? 54 : 78}px Bungee`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(ch, w / 2, h / 2 + 4);
}

function makeKey(ch, x, z, wide = 1) {
  const side = Q3.toon(0xDADDEB), lab = Q3.textTex(128, 128, (g, w, h) => keyLabel(g, w, h, ch, false));
  const top = Q3.toon(0xffffff, { map: lab.tex, emissive: 0xFFD43B, emissiveIntensity: 0 });
  const geo = new THREE.BoxGeometry(0.44 * wide + (wide - 1) * 0.06, 0.2, 0.44);
  const k = Q3.ink(geo, [side, side, top, side, side, side], 0.018);
  k.position.set(x, 0.32, z); Q3.scene.add(k);
  return { g: k, top, x, z, ch };
}

function makeBump(key) {
  const b = Q3.ink(new THREE.CapsuleGeometry(0.03, 0.13, 4, 8), Q3.toon(0xC8CCDD), 0.012);
  b.rotation.z = Math.PI / 2; b.position.set(0, 0.11, 0.12); key.g.add(b); return b;
}

function makeHand(sx) {
  const h = new THREE.Group(), WHITE = Q3.toon(0xffffff);
  const palm = Q3.ink(new THREE.SphereGeometry(0.42, 20, 14), WHITE, 0.03); palm.scale.set(1.25, 0.45, 0.9); palm.position.set(0, 0.42, 0.62); h.add(palm);
  const cuff = Q3.ink(new THREE.CylinderGeometry(0.34, 0.38, 0.32, 18), Q3.toon(0x6E4BFF), 0.03); cuff.rotation.x = Math.PI / 2; cuff.position.set(0, 0.45, 1.15); h.add(cuff);
  const fingers = [];
  for (let i = 0; i < 4; i++) {
    const f = new THREE.Group(); f.position.set((i - 1.5) * U, 0, 0); h.add(f);
    const c = Q3.ink(new THREE.CapsuleGeometry(0.085, 0.42, 4, 10), WHITE, 0.025); c.rotation.x = Math.PI / 2 - 0.55; c.position.set(0, 0.3, 0.27); f.add(c);
    fingers.push(f);
  }
  const thumb = Q3.ink(new THREE.CapsuleGeometry(0.09, 0.3, 4, 10), WHITE, 0.025); thumb.rotation.z = 0.9 * -sx; thumb.rotation.x = 0.6; thumb.position.set(-sx * 0.55, 0.3, 0.85); h.add(thumb);
  Q3.scene.add(h); return { g: h, fingers };
}

let SCREEN = null;
function buildWorld() {
  Q3.init(0xFFD9B8);
  const S = Q3.scene;
  // room
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), Q3.toon(0xFFC79A)); wall.position.set(0, 8, -9); wall.receiveShadow = true; S.add(wall);
  for (let i = 0; i < 7; i++) { const p = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 30), Q3.toon(0xFFB98A)); p.position.set(-9 + i * 3, 8, -8.98); S.add(p); }
  const desk = new THREE.Mesh(new THREE.BoxGeometry(40, 1, 18), Q3.toon(0xB8774A)); desk.position.set(0, -0.5, 0); desk.receiveShadow = true; S.add(desk);
  const edge = new THREE.Mesh(new THREE.BoxGeometry(40, 0.12, 0.2), Q3.toon(0x8A5530)); edge.position.set(0, -0.06, 9); S.add(edge);
  // keyboard base
  const base = Q3.ink(new THREE.BoxGeometry(15.4 * U, 0.22, 5.4 * U), Q3.toon(0x2E3150), 0.03); base.position.set(1.85 * U, 0.11, 0); S.add(base);
  for (const r of ROWS) for (let i = 0; i < r.keys.length; i++) { const ch = r.keys[i]; W3.keys[ch] = makeKey(ch, (r.x0 + i) * U, r.z * U); }
  W3.keys[' '] = makeKey('', -0.25 * U, 2 * U, 6);
  for (const [ch, x, z, w] of PAD) W3.pad[ch] = makeKey(ch, x * U, z * U, w || 1);
  W3.bumps.F = makeBump(W3.keys.F); W3.bumps.J = makeBump(W3.keys.J); W3.bumps[5] = makeBump(W3.pad[5]);
  // monitor
  const stand = Q3.ink(new THREE.BoxGeometry(0.5, 2.2, 0.3), Q3.toon(0x3A3D5C), 0.03); stand.position.set(0.9, 1.1, -4.62); S.add(stand);
  const foot = Q3.ink(new THREE.BoxGeometry(2.2, 0.12, 1.2), Q3.toon(0x3A3D5C), 0.03); foot.position.set(0.9, 0.06, -4.5); S.add(foot);
  const mon = Q3.ink(new THREE.BoxGeometry(6.4, 3.8, 0.3), Q3.toon(0x2A2D45), 0.04); mon.position.set(0.9, 3.6, -4.3); S.add(mon);
  SCREEN = Q3.textTex(1024, 600, drawScreen);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 3.45), new THREE.MeshBasicMaterial({ map: SCREEN.tex })); scr.position.set(0.9, 3.6, -4.14); S.add(scr);
  // mug + plant for scale and life
  const mug = Q3.ink(new THREE.CylinderGeometry(0.42, 0.38, 0.9, 20), Q3.toon(0xFF6B2C), 0.03); mug.position.set(6.2, 0.45, -1.6); S.add(mug);
  const pot = Q3.ink(new THREE.CylinderGeometry(0.5, 0.4, 0.8, 16), Q3.toon(0x2BD47D), 0.03); pot.position.set(-5.6, 0.4, -2.6); S.add(pot);
  for (let i = 0; i < 5; i++) { const l = Q3.ink(new THREE.SphereGeometry(0.42, 12, 10), Q3.toon(0x3FBF5A), 0.03); l.scale.set(0.6, 1.4, 0.4); l.position.set(-5.6 + Math.cos(i * 1.3) * 0.35, 1.3 + (i % 2) * 0.3, -2.6 + Math.sin(i * 1.3) * 0.3); l.rotation.z = Math.cos(i * 1.3) * 0.5; S.add(l); }
  // gloves + Quix
  W3.hands = { L: makeHand(-1), R: makeHand(1) };
  W3.quix = Q3.makeQuix(); S.add(W3.quix.group);
}

// ------------------------------------------------------------------ screen
const SCR = { text: '', bad: false, cursor: true, title: 'notes.txt', key: '' };
function drawScreen(g, w, h) {
  g.fillStyle = '#F7F8FF'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#7B5CFF'; g.fillRect(0, 0, w, 70);
  g.fillStyle = '#fff'; g.font = '40px Lilita'; g.textBaseline = 'middle'; g.fillText(SCR.title, 30, 36);
  for (let i = 0; i < 3; i++) { g.fillStyle = ['#FF5A5A', '#FFD43B', '#2BD47D'][i]; g.beginPath(); g.arc(w - 40 - i * 44, 36, 14, 0, 7); g.fill(); }
  const lines = SCR.text.split('\n'), big = lines.length === 1;
  g.font = big ? '150px Bungee' : '70px Bungee'; g.textBaseline = 'alphabetic'; g.textAlign = 'center';
  const lh = big ? 0 : 100; let y = big ? 370 : 290 - (lines.length - 1) * lh / 2;
  for (const ln of lines) {
    const tw = g.measureText(ln).width, x0 = w / 2 - tw / 2;
    g.fillStyle = SCR.bad ? '#E0284A' : '#1A1033'; g.fillText(ln, w / 2, y);
    if (SCR.bad && ln) { g.strokeStyle = '#E0284A'; g.lineWidth = 8; g.beginPath(); for (let x = x0; x < x0 + tw; x += 30) { g.moveTo(x, y + 24); g.lineTo(x + 15, y + 40); g.lineTo(x + 30, y + 24); } g.stroke(); }
    y += lh;
  }
  if (SCR.cursor) { const last = lines[lines.length - 1], cw = g.measureText(last).width; g.fillStyle = '#1A1033'; g.fillRect(w / 2 + cw / 2 + 10, y - lh - (big ? 120 : 62), big ? 14 : 9, big ? 130 : 72); }
  g.textAlign = 'left';
}
function setScreen(text, bad = false, cursor = true, title = 'notes.txt') {
  const k = text + '|' + bad + cursor + title; if (k === SCR.key) return;
  Object.assign(SCR, { text, bad, cursor, title, key: k }); SCREEN.redraw();
}

// ------------------------------------------------------------------ per-frame state
function resetKeys() {
  for (const k of [...Object.values(W3.keys), ...Object.values(W3.pad)]) { k.g.position.y = 0.32; k.top.emissiveIntensity = 0; }
  for (const b of Object.values(W3.bumps)) { b.scale.setScalar(1); b.userData.glow = 0; }
}
function glowKey(k, a) { if (k) k.top.emissiveIntensity = Math.max(k.top.emissiveIntensity, 0.85 * clamp(a)); }
function pressKey(k, a) { if (k) k.g.position.y = 0.32 - 0.09 * clamp(a); }
const keyOf = ch => W3.keys[ch.toUpperCase()] || W3.keys[ch] || W3.pad[ch];

// hands over the home row; shift in key units (0 = correct, 1 = one key to the right)
function placeHands(shift, vis = 1, lift = 0) {
  for (const [s, home] of [['L', 'ASDF'], ['R', "JKL;"]]) {
    const h = W3.hands[s]; h.g.visible = vis > 0.01;
    const cx = (keyOf(home[1]).x + keyOf(home[2]).x) / 2 + shift * U;
    h.g.position.set(cx, KEY_TOP + 0.05 + lift + (1 - vis) * 3, 0.02);
    h.fingers.forEach(f => { f.position.y = 0; });
  }
}
// typing: seq = [[char, time], ...]; returns the string typed so far and animates the matching key + finger
function typeSeq(t, seq, shift) {
  let out = '';
  for (const [ch, t0] of seq) {
    if (t < t0) break;
    const shown = ch === '\n' ? '\n' : shiftChar(ch, shift);
    out += shown;
    const dt = t - t0;
    if (dt < 0.14 && ch !== '\n') {
      const k = keyOf(shown === ' ' ? ' ' : shown); const a = Math.sin(clamp(dt / 0.14) * Math.PI);
      pressKey(k, a);
      if (k) { // dip the finger closest to the key
        let best = null, bd = 1e9;
        for (const h of Object.values(W3.hands)) h.fingers.forEach(f => { const wx = h.g.position.x + f.position.x, d = Math.abs(wx - k.x); if (d < bd) { bd = d; best = f; } });
        if (best && bd < 0.6) best.position.y = -0.12 * a;
      }
    }
  }
  return out;
}
const ROW_STR = ROWS.map(r => r.keys);
function shiftChar(ch, shift) {
  if (!shift || ch === ' ') return ch;
  const up = ch.toUpperCase();
  for (const r of ROW_STR) { const i = r.indexOf(up); if (i >= 0) { const n = r[Math.min(r.length - 1, i + shift)]; return ch === up ? n : n.toLowerCase(); } }
  return ch;
}
// even typing rhythm: text starting at t0 with gap seconds per char
const rhythm = (text, t0, gap) => [...text].map((c, i) => [c, t0 + i * gap + (c === ' ' ? 0.03 : 0)]);
