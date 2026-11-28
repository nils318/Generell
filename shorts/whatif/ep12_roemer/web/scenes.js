// EP12 — 3D comic Rome: cobbled street, insulae, Colosseum, Pantheon, aqueduct, fullery vats, urine pots, ludus, thermopolium.
const R = {};
const TERRA = 0xC8643A, OCHRE = 0xE2A857, CREAM = 0xF1E2C4, STONE_R = 0xE9DCC0, SKIN_R = 0xC98E62;

function canvasTex(w, h, draw, rep) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); } return t;
}
function skyR() {
  return canvasTex(16, 512, (g) => { const gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#4FA8F0'); gr.addColorStop(0.55, '#9FD4FA'); gr.addColorStop(0.85, '#FFE2B0'); gr.addColorStop(1, '#FFD08A'); g.fillStyle = gr; g.fillRect(0, 0, 16, 512); });
}
const cobbles = () => canvasTex(256, 256, (g) => {
  g.fillStyle = '#B9A88A'; g.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 32) for (let x = (y / 32 % 2) * 20 - 20; x < 256; x += 40) {
    g.fillStyle = ['#CFC0A0', '#C4B391', '#D6C8AA'][(x + y) % 3]; g.beginPath(); g.roundRect(x + 3, y + 3, 34, 26, 8); g.fill();
  }
}, [14, 30]);
const archesTex = () => canvasTex(512, 256, (g, w, h) => {
  g.fillStyle = '#E8D6B0'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#CDB88E'; for (const y of [0, 84, 168]) g.fillRect(0, y, w, 10);
  for (const [y0, hh] of [[18, 62], [102, 62], [186, 62]]) for (let x = 16; x < w; x += 64) {
    g.fillStyle = '#5A4630'; g.beginPath(); g.moveTo(x, y0 + hh); g.lineTo(x, y0 + 22); g.arc(x + 20, y0 + 22, 20, Math.PI, 0); g.lineTo(x + 40, y0 + hh); g.closePath(); g.fill();
  }
}, [8, 1]);

function insula(x, z, w, d, h, col, rot = 0) {
  const g = new THREE.Group();
  const b = Q3.ink(new THREE.BoxGeometry(w, h, d), Q3.toon(col), 0.05); b.position.y = h / 2; g.add(b);
  const roof = Q3.ink(new THREE.CylinderGeometry(0.01, Math.max(w, d) * 0.78, 1.4, 4), Q3.toon(TERRA), 0.05); roof.rotation.y = Math.PI / 4; roof.scale.set(w / Math.max(w, d), 1, d / Math.max(w, d)); roof.position.y = h + 0.7; g.add(roof);
  const dark = new THREE.MeshBasicMaterial({ color: 0x3A2414 });
  for (let i = 0; i < Math.floor(w / 1.6); i++) for (let j = 1; j < Math.floor(h / 1.8) + 1; j++) {
    const wi = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.7), dark); wi.position.set(-w / 2 + 0.9 + i * 1.6, j * 1.7, d / 2 + 0.01); g.add(wi);
  }
  g.position.set(x, 0, z); g.rotation.y = rot; Q3.scene.add(g); return g;
}
function cypress(x, z, s = 1) { const c = Q3.ink(new THREE.ConeGeometry(0.7, 5, 10), Q3.toon(0x2E6B3A), 0.04); c.position.set(x, 2.5 * s, z); c.scale.setScalar(s); Q3.scene.add(c); }
function pine(x, z, s = 1) {
  const g = new THREE.Group(); const tr = Q3.ink(new THREE.CylinderGeometry(0.15, 0.22, 5, 8), Q3.toon(0x7A4A2B), 0.03); tr.position.y = 2.5; g.add(tr);
  const top = Q3.ink(new THREE.SphereGeometry(2.4, 16, 10), Q3.toon(0x3F8F4A), 0.05); top.scale.y = 0.4; top.position.y = 5.2; g.add(top);
  g.position.set(x, 0, z); g.scale.setScalar(s); Q3.scene.add(g);
}
function column(x, z, h, r = 0.35) {
  const c = Q3.ink(new THREE.CylinderGeometry(r, r * 1.1, h, 14), Q3.toon(CREAM), 0.03); c.position.set(x, h / 2, z); Q3.scene.add(c);
  const cap = Q3.ink(new THREE.BoxGeometry(r * 3, 0.25, r * 3), Q3.toon(CREAM), 0.02); cap.position.set(x, h + 0.12, z); Q3.scene.add(cap);
}
function personR(opts = {}) {
  const g = new THREE.Group(); g.rotation.order = 'YXZ';
  const skin = Q3.toon(opts.skin || SKIN_R), tunic = Q3.toon(opts.tunic || 0xE9DFC9), hair = Q3.toon(0x2A1A10);
  const torso = Q3.ink(new THREE.CapsuleGeometry(0.24, 0.45, 4, 10), tunic, 0.03); torso.position.y = 1.15; g.add(torso);
  const skirt = Q3.ink(new THREE.CylinderGeometry(0.27, 0.36, 0.38, 12), tunic, 0.03); skirt.position.y = 0.82; g.add(skirt);
  const head = Q3.ink(new THREE.SphereGeometry(0.2, 14, 10), skin, 0.03); head.position.y = 1.68; g.add(head);
  if (opts.helmet) {
    const hm = Q3.ink(new THREE.SphereGeometry(0.24, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.62), Q3.toon(0xB8BCC8), 0.03); hm.position.y = 1.7; g.add(hm);
    const crest = Q3.ink(new THREE.BoxGeometry(0.06, 0.22, 0.42), Q3.toon(0xC0392B), 0.02); crest.position.y = 1.98; g.add(crest);
  } else { const cap = new THREE.Mesh(new THREE.SphereGeometry(0.205, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), hair); cap.position.y = 1.7; g.add(cap); }
  const legs = [], arms = [];
  for (const sx of [-1, 1]) {
    const lp = new THREE.Group(); lp.position.set(0.11 * sx, 0.72, 0); g.add(lp);
    const l = Q3.ink(new THREE.CapsuleGeometry(0.08, 0.52, 4, 8), skin, 0.02); l.position.y = -0.36; lp.add(l); legs.push(lp);
    const ap = new THREE.Group(); ap.position.set(0.28 * sx, 1.42, 0); g.add(ap);
    const a = Q3.ink(new THREE.CapsuleGeometry(0.065, 0.45, 4, 8), skin, 0.02); a.position.y = -0.3; ap.add(a); arms.push(ap);
  }
  if (opts.shield) { const sh = Q3.ink(new THREE.BoxGeometry(0.08, 0.9, 0.6), Q3.toon(0xC0392B), 0.03); sh.position.set(-0.05, -0.5, 0.2); arms[0].add(sh); }
  if (opts.sword) { const sw = Q3.ink(new THREE.BoxGeometry(0.05, 0.6, 0.08), Q3.toon(0xDDE2EA), 0.02); sw.position.set(0, -0.85, 0.1); arms[1].add(sw); }
  if (opts.cup) { const cp = Q3.ink(new THREE.CylinderGeometry(0.1, 0.07, 0.18, 10), Q3.toon(0x8A5A2B), 0.02); cp.position.set(0, -0.65, 0.06); arms[1].add(cp); }
  Q3.scene.add(g);
  const o = { g, legs, arms, head };
  o.update = (t, mode = 'idle', ph = 0) => {
    const w = t * 6 + ph; g.rotation.x = 0; g.position.y = o.baseY || 0;
    legs.forEach(l => l.rotation.x = 0); arms.forEach(a => { a.rotation.x = 0; a.rotation.z = 0; });
    if (mode === 'stomp') { legs[0].rotation.x = -0.9 * Math.max(0, Math.sin(w * 1.3)); legs[1].rotation.x = -0.9 * Math.max(0, -Math.sin(w * 1.3)); g.position.y = (o.baseY || 0) + 0.08 * Math.abs(Math.sin(w * 1.3)); arms.forEach((a, i) => a.rotation.z = (i ? -1 : 1) * 0.5); }
    else if (mode === 'walk') { legs[0].rotation.x = 0.5 * Math.sin(w); legs[1].rotation.x = -0.5 * Math.sin(w); arms[0].rotation.x = -0.4 * Math.sin(w); arms[1].rotation.x = 0.4 * Math.sin(w); }
    else if (mode === 'fight') { arms[1].rotation.x = -1.2 - 0.8 * Math.max(0, Math.sin(w * 1.2)); arms[0].rotation.x = -1.0; legs[0].rotation.x = 0.3; legs[1].rotation.x = -0.3; g.rotation.x = 0.1; }
    else if (mode === 'drink') { arms[1].rotation.x = -2.4 + 0.15 * Math.sin(t * 2); }
    else if (mode === 'cheer') { arms.forEach((a, i) => { a.rotation.x = Math.PI - 0.2; a.rotation.z = (i ? -0.4 : 0.4) + 0.15 * Math.sin(t * 9 + ph); }); g.position.y = (o.baseY || 0) + 0.12 * Math.max(0, Math.sin(t * 9 + ph)); }
    else { arms.forEach(a => a.rotation.x = 0.1 * Math.sin(t * 2 + ph)); }
  };
  return o;
}
function jar(x, z, s = 1, col = 0xB5652E) {
  const pts = [[0, 0], [0.2, 0.05], [0.3, 0.3], [0.3, 0.55], [0.2, 0.75], [0.22, 0.85], [0, 0.85]].map(([a, b]) => new THREE.Vector2(a, b));
  const j = Q3.ink(new THREE.LatheGeometry(pts, 14), Q3.toon(col), 0.02); j.position.set(x, 0, z); j.scale.setScalar(s); Q3.scene.add(j); return j;
}

function buildRome() {
  Q3.init(0x9FD4FA);
  const S = Q3.scene; S.background = skyR(); S.fog = new THREE.Fog(0xFFE2B0, 60, 220);
  Q3.sun.position.set(25, 30, 20); Q3.sun.intensity = 1.0; Q3.sun.color.setHex(0xFFF0D0);
  Object.assign(Q3.sun.shadow.camera, { left: -35, right: 35, top: 35, bottom: -35, near: 1, far: 120 }); Q3.sun.shadow.camera.updateProjectionMatrix();
  // ground + street
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, 500), Q3.toon(0xD9C49A)); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; S.add(ground);
  const street = new THREE.Mesh(new THREE.PlaneGeometry(7, 70), new THREE.MeshToonMaterial({ map: cobbles() })); street.rotation.x = -Math.PI / 2; street.position.set(0, 0.02, -8); street.receiveShadow = true; S.add(street);
  // insulae lining the street
  const cols = [OCHRE, 0xE8C38A, 0xD98E5A, 0xEAD2A6, 0xC97B4A];
  for (let i = 0; i < 6; i++) { insula(-7.5, 12 - i * 8, 6, 6, 5 + (i % 3) * 1.6, cols[i % 5]); insula(7.5, 12 - i * 8, 6, 6, 4.5 + ((i + 1) % 3) * 1.6, cols[(i + 2) % 5]); }
  for (const [x, z] of [[-4.2, 18], [4.2, 15], [-4.4, -30], [4.4, -26]]) cypress(x, z, 1);
  pine(-20, -40, 1.3); pine(22, -36, 1.4); pine(-30, -10, 1.2);
  // Colosseum at the end of the street
  const arT = archesTex();
  const outer = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 12, 48, 1, true), new THREE.MeshToonMaterial({ map: arT, side: THREE.DoubleSide, gradientMap: null }));
  outer.position.set(0, 6, -62); S.add(outer);
  const rim = Q3.ink(new THREE.TorusGeometry(15, 0.35, 8, 48), Q3.toon(0xCDB88E), 0.05); rim.rotation.x = Math.PI / 2; rim.position.set(0, 12, -62); S.add(rim);
  const inner = new THREE.Mesh(new THREE.CylinderGeometry(11, 11, 9, 40, 1, true), Q3.toon(0xB89A6A, { side: THREE.BackSide })); inner.position.set(0, 4.5, -62); S.add(inner);
  // Pantheon (left, back)
  const pan = new THREE.Group(); pan.position.set(-26, 0, -12); S.add(pan);
  const drum = Q3.ink(new THREE.CylinderGeometry(7, 7, 7, 40), Q3.toon(0xD8C49C), 0.08); drum.position.y = 3.5; pan.add(drum);
  R.dome = Q3.ink(new THREE.SphereGeometry(7, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), Q3.toon(0xBFA77A, { emissive: 0xFFE7A0, emissiveIntensity: 0 }), 0.08); R.dome.position.y = 7; pan.add(R.dome);
  const porch = Q3.ink(new THREE.BoxGeometry(9, 0.6, 4), Q3.toon(CREAM), 0.05); porch.position.set(0, 6.2, 8.2); pan.add(porch);
  const ped = Q3.ink(new THREE.CylinderGeometry(0.01, 5.2, 2, 3), Q3.toon(CREAM), 0.05); ped.rotation.x = Math.PI / 2; ped.rotation.y = 0; ped.scale.set(1, 1, 0.5); ped.position.set(0, 7.3, 9.6); pan.add(ped);
  for (let i = 0; i < 6; i++) { const c = Q3.ink(new THREE.CylinderGeometry(0.32, 0.36, 5.8, 14), Q3.toon(CREAM), 0.03); c.position.set(-3.6 + i * 1.44, 2.9, 9.6); pan.add(c); }
  // aqueduct across the horizon
  const shape = new THREE.Shape(); shape.moveTo(-60, 0); shape.lineTo(60, 0); shape.lineTo(60, 10); shape.lineTo(-60, 10); shape.closePath();
  for (let x = -57; x < 57; x += 6) { const hp = new THREE.Path(); hp.moveTo(x, 0); hp.lineTo(x, 5); hp.absarc(x + 2.2, 5, 2.2, Math.PI, 0, true); hp.lineTo(x + 4.4, 0); hp.closePath(); shape.holes.push(hp); }
  const aq = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: 2, bevelEnabled: false }), Q3.toon(0xD8C29A)); aq.position.set(10, 0, -100); S.add(aq);
  // fullery (left foreground): vats with stomping workers + drying cloth
  R.fullers = [];
  for (let i = 0; i < 3; i++) {
    const vx = -6 + i * 2.2, vz = 20 + (i % 2) * 1.2;
    const vat = Q3.ink(new THREE.CylinderGeometry(0.85, 0.75, 0.9, 20, 1, true), Q3.toon(0x9A6A3A, { side: THREE.DoubleSide }), 0.04); vat.position.set(vx, 0.45, vz); S.add(vat);
    const liq = new THREE.Mesh(new THREE.CircleGeometry(0.8, 20), Q3.toon(0xE9D24A)); liq.rotation.x = -Math.PI / 2; liq.position.set(vx, 0.7, vz); S.add(liq);
    const p = personR({ tunic: 0xD9CBB0 }); p.g.position.set(vx, 0, vz); p.baseY = 0.0; p.g.rotation.y = 0.4 - i * 0.3; R.fullers.push(p);
  }
  R.cloth = [];
  for (let i = 0; i < 4; i++) { const c = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.4), Q3.toon([0xF4EFE2, 0xC0392B, 0xF4EFE2, 0x7A1FA2][i], { side: THREE.DoubleSide })); c.position.set(-7.2 + i * 1.4, 2.1, 17.6); S.add(c); R.cloth.push(c); }
  const lineM = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 7, 4), Q3.toon(0x6A4A2A)); lineM.rotation.z = Math.PI / 2; lineM.position.set(-5.1, 2.8, 17.6); S.add(lineM);
  for (const x of [-8.6, -1.6]) { const post = Q3.ink(new THREE.CylinderGeometry(0.08, 0.08, 2.9, 6), Q3.toon(0x6A4A2A), 0.02); post.position.set(x, 1.45, 17.6); S.add(post); }
  // urine pots at the street edge (right) + a passer-by
  R.pots = []; for (let i = 0; i < 3; i++) R.pots.push(jar(3.6, 21 - i * 1.0, 1.3));
  R.passer = personR({ tunic: 0x5C8BD6 }); R.passer.g.position.set(6.0, 0, 17.5); R.passer.g.rotation.y = Math.PI / 2 + 0.3;
  // ludus (training yard, right middle) with two gladiators + wooden post
  const yard = new THREE.Mesh(new THREE.CircleGeometry(4, 32), Q3.toon(0xE8D2A0)); yard.rotation.x = -Math.PI / 2; yard.position.set(19, 0.03, -6); S.add(yard);
  R.glads = [personR({ helmet: true, shield: true, sword: true, tunic: 0xA0522D }), personR({ helmet: true, shield: true, sword: true, tunic: 0x6A7A3A })];
  R.glads[0].g.position.set(17.8, 0, -6); R.glads[0].g.rotation.y = Math.PI / 2; R.glads[1].g.position.set(20.2, 0, -6); R.glads[1].g.rotation.y = -Math.PI / 2;
  R.drinker = personR({ helmet: true, cup: true, tunic: 0xA0522D }); R.drinker.g.position.set(19, 0, -3.4); R.drinker.g.rotation.y = 0.2;
  const palus = Q3.ink(new THREE.CylinderGeometry(0.18, 0.2, 1.8, 8), Q3.toon(0x7A4A2B), 0.03); palus.position.set(21.8, 0.9, -7.5); S.add(palus);
  // thermopolium (food counter, right foreground)
  const front = canvasTex(256, 128, (g, w, h) => { g.fillStyle = '#C9442E'; g.fillRect(0, 0, w, h); g.fillStyle = '#F1E2C4'; g.fillRect(0, 0, w, 14);
    g.fillStyle = '#2F7A4A'; g.beginPath(); g.ellipse(70, 70, 34, 20, 0, 0, 7); g.fill(); g.fillStyle = '#E8B84A'; g.beginPath(); g.ellipse(180, 72, 30, 22, 0, 0, 7); g.fill(); });
  R.counter = new THREE.Mesh(new THREE.BoxGeometry(4, 1.1, 1.2), [Q3.toon(0xC9442E), Q3.toon(0xC9442E), Q3.toon(0xE6D5B2), Q3.toon(0xC9442E), new THREE.MeshToonMaterial({ map: front }), Q3.toon(0xC9442E)]);
  R.counter.position.set(6.5, 0.55, 25); R.counter.castShadow = true; S.add(R.counter);
  for (let i = 0; i < 3; i++) { const h = new THREE.Mesh(new THREE.CircleGeometry(0.3, 16), new THREE.MeshBasicMaterial({ color: 0x3A2414 })); h.rotation.x = -Math.PI / 2; h.position.set(5.3 + i * 1.2, 1.11, 25); S.add(h); }
  R.cook = personR({ tunic: 0xE9DFC9 }); R.cook.g.position.set(6.5, 0, 23.8); R.cook.g.rotation.y = 0;
  R.customer = personR({ tunic: 0x7A1FA2 }); R.customer.g.position.set(7.1, 0, 26.4); R.customer.g.rotation.y = Math.PI;
  // street crowd
  R.walkers = [0, 1, 2].map(i => { const p = personR({ tunic: [0xE9DFC9, 0x5C8BD6, 0xC0392B][i] }); p.g.position.set(-1.5 + i * 1.5, 0, -4 - i * 5); p.g.rotation.y = i % 2 ? 0 : Math.PI; return p; });
}

function romeUpdate(t, o = {}) {
  R.fullers.forEach((p, i) => p.update(t, 'stomp', i * 1.9));
  R.cloth.forEach((c, i) => { c.rotation.y = 0.15 * Math.sin(t * 2 + i); });
  R.passer.update(t, o.passerWalk ? 'walk' : 'idle');
  R.glads[0].update(t, 'fight', 0); R.glads[1].update(t, 'fight', 2.3);
  R.drinker.update(t, 'drink');
  R.cook.update(t, 'idle', 1); R.customer.update(t, o.cheer ? 'cheer' : 'idle', 2);
  R.walkers.forEach((p, i) => { p.update(t, 'walk', i * 2); const dir = i % 2 ? -1 : 1; p.g.position.z = -4 - i * 5 + dir * (((t * 0.8 + i * 3) % 10) - 5); p.g.rotation.y = dir > 0 ? 0 : Math.PI; });
  R.dome.userData.mesh.material.emissiveIntensity = o.domeGlow || 0;
}
