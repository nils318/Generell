// EP11 — 3D comic Egypt: sunset desert, Giza pyramids, worker crew with sledge + water pourer, workers' town, tombs, Nile.
const EG = {};
const SAND = 0xE9B266, SAND_D = 0xD4924A, STONE = 0xE6C48C, SKIN = 0x8A5A36, LINEN = 0xF4EEDC, MUD = 0xC98A52;

function skyTex() {
  const c = document.createElement('canvas'); c.width = 16; c.height = 512; const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, 512);
  gr.addColorStop(0, '#E8892E'); gr.addColorStop(0.45, '#F6B040'); gr.addColorStop(0.75, '#FBD27A'); gr.addColorStop(1, '#FFE7B0');
  g.fillStyle = gr; g.fillRect(0, 0, 16, 512); const tx = new THREE.CanvasTexture(c); return tx;
}

function pyramid(x, z, half, h, mat) {
  const geo = new THREE.ConeGeometry(half * Math.SQRT2, h, 4, 1);
  const p = Q3.ink(geo, mat, 0.25); p.rotation.y = Math.PI / 4; p.position.set(x, h / 2, z); Q3.scene.add(p); return p;
}

function cloud(x, y, z, s) {
  const g = new THREE.Group(), m = Q3.toon(0xFFF3DC);
  for (const [dx, dy, r] of [[0, 0, 3], [3, 0.4, 2.4], [-3, 0.2, 2.2], [1.5, 1.6, 2.2], [-1.4, 1.3, 2]]) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), m); b.position.set(dx, dy, 0); b.scale.z = 0.5; g.add(b);
  }
  g.position.set(x, y, z); g.scale.setScalar(s); Q3.scene.add(g); return g;
}

// low-poly Egyptian figure; returns {g, legs, arms, update(t, mode)}
function person(opts = {}) {
  const g = new THREE.Group(); g.rotation.order = 'YXZ';
  const skin = Q3.toon(opts.skin || SKIN), linen = Q3.toon(LINEN), hair = Q3.toon(0x1E1410);
  const torso = Q3.ink(new THREE.CapsuleGeometry(0.22, 0.45, 4, 10), skin, 0.03); torso.position.y = 1.15; g.add(torso);
  const kilt = Q3.ink(new THREE.CylinderGeometry(0.26, 0.34, 0.35, 12), linen, 0.03); kilt.position.y = 0.82; g.add(kilt);
  const head = Q3.ink(new THREE.SphereGeometry(0.2, 14, 10), skin, 0.03); head.position.y = 1.68; g.add(head);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.205, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), hair); cap.position.y = 1.7; g.add(cap);
  const legs = [], arms = [];
  for (const sx of [-1, 1]) {
    const lp = new THREE.Group(); lp.position.set(0.11 * sx, 0.72, 0); g.add(lp);
    const l = Q3.ink(new THREE.CapsuleGeometry(0.08, 0.52, 4, 8), skin, 0.02); l.position.y = -0.36; lp.add(l); legs.push(lp);
    const ap = new THREE.Group(); ap.position.set(0.27 * sx, 1.42, 0); g.add(ap);
    const a = Q3.ink(new THREE.CapsuleGeometry(0.065, 0.45, 4, 8), skin, 0.02); a.position.y = -0.3; ap.add(a); arms.push(ap);
  }
  Q3.scene.add(g);
  const o = { g, legs, arms, torso, head };
  o.update = (t, mode = 'idle', ph = 0) => {
    const w = t * 6 + ph;
    if (mode === 'pull') {                       // leaning walk, arms forward on the rope
      legs[0].rotation.x = 0.55 * Math.sin(w); legs[1].rotation.x = -0.55 * Math.sin(w);
      arms.forEach(a => { a.rotation.x = -1.35 + 0.08 * Math.sin(w * 2); });
      g.rotation.x = 0.28;
    } else if (mode === 'pour') {
      legs.forEach(l => l.rotation.x = 0); arms.forEach(a => { a.rotation.x = -1.2; }); g.rotation.x = 0.1;
    } else if (mode === 'whip') {
      legs.forEach(l => l.rotation.x = 0); arms[1].rotation.x = Math.PI + 0.4 * Math.sin(t * 8); arms[1].rotation.z = 0.3; arms[0].rotation.x = 0; g.rotation.x = 0;
    } else if (mode === 'cheer') {
      legs.forEach(l => l.rotation.x = 0); arms.forEach((a, i) => { a.rotation.x = Math.PI - 0.2; a.rotation.z = (i ? -0.4 : 0.4) + 0.15 * Math.sin(t * 9 + ph); }); g.position.y = 0.12 * Math.max(0, Math.sin(t * 9 + ph)); g.rotation.x = 0;
    } else { legs.forEach(l => l.rotation.x = 0); arms.forEach(a => { a.rotation.x = 0.1 * Math.sin(t * 2 + ph); }); g.rotation.x = 0; }
  };
  return o;
}

function amphora(x, z, s = 1) {
  const pts = [[0, 0], [0.16, 0.05], [0.26, 0.3], [0.28, 0.55], [0.2, 0.8], [0.1, 0.9], [0.12, 1.0], [0, 1.0]].map(([a, b]) => new THREE.Vector2(a, b));
  const j = Q3.ink(new THREE.LatheGeometry(pts, 14), Q3.toon(0xC8743A), 0.02); j.position.set(x, 0, z); j.scale.setScalar(s); Q3.scene.add(j); return j;
}
function palm(x, z, s = 1) {
  const g = new THREE.Group();
  const trunk = Q3.ink(new THREE.CylinderGeometry(0.15, 0.25, 4, 8), Q3.toon(0x8A5A2B), 0.04); trunk.position.y = 2; trunk.rotation.z = 0.08; g.add(trunk);
  for (let i = 0; i < 7; i++) {
    const leaf = Q3.ink(new THREE.ConeGeometry(0.35, 2.4, 4), Q3.toon(0x3FA34D), 0.03);
    leaf.position.set(Math.cos(i / 7 * 6.28) * 1.0, 3.9, Math.sin(i / 7 * 6.28) * 1.0); leaf.rotation.z = Math.PI / 2 + 0.5; leaf.rotation.y = -i / 7 * 6.28; g.add(leaf);
  }
  g.position.set(x, 0, z); g.scale.setScalar(s); Q3.scene.add(g); return g;
}
function house(x, z, w, d, h) {
  const b = Q3.ink(new THREE.BoxGeometry(w, h, d), Q3.toon(MUD), 0.05); b.position.set(x, h / 2, z); Q3.scene.add(b);
  const door = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.2), new THREE.MeshBasicMaterial({ color: 0x3A2210 })); door.position.set(x, 0.6, z + d / 2 + 0.01); Q3.scene.add(door);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.3), new THREE.MeshBasicMaterial({ color: 0x3A2210 })); win.position.set(x + w * 0.28, h * 0.72, z + d / 2 + 0.01); Q3.scene.add(win);
  return b;
}

function buildEgypt() {
  Q3.init(0xF6B040);
  const S = Q3.scene;
  S.background = skyTex();
  S.fog = new THREE.Fog(0xF8C873, 70, 260);
  Q3.sun.position.set(-30, 25, -40); Q3.sun.intensity = 1.0; Q3.sun.color.setHex(0xFFE2B0);
  Object.assign(Q3.sun.shadow.camera, { left: -40, right: 40, top: 40, bottom: -40, near: 1, far: 160 }); Q3.sun.shadow.camera.updateProjectionMatrix();
  // sun disk + clouds
  const sunD = new THREE.Mesh(new THREE.CircleGeometry(9, 32), new THREE.MeshBasicMaterial({ color: 0xFFF1C4, fog: false })); sunD.position.set(-40, 38, -200); S.add(sunD);
  const glow = Q3.glowSprite('#FFE6A0'); glow.position.copy(sunD.position); glow.scale.setScalar(70); S.add(glow);
  EG.clouds = [cloud(-60, 45, -170, 3), cloud(30, 52, -190, 3.5), cloud(85, 38, -160, 2.6), cloud(-10, 30, -150, 2.2)];
  // ground + dunes
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), Q3.toon(SAND)); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; S.add(ground);
  for (const [x, z, r, sy] of [[-70, -60, 30, 0.18], [80, -70, 34, 0.15], [-120, -130, 45, 0.2], [130, -140, 50, 0.16], [0, -170, 60, 0.12], [-40, 40, 26, 0.1], [60, 30, 30, 0.12]]) {
    const d = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 12), Q3.toon(SAND_D)); d.scale.y = sy; d.position.set(x, 0, z); d.receiveShadow = true; S.add(d);
  }
  // pyramids
  EG.pyrMat = Q3.toon(STONE, { emissive: 0xFFFFFF, emissiveIntensity: 0 });
  EG.great = pyramid(0, -70, 24, 32, EG.pyrMat);
  pyramid(-48, -95, 17, 23, Q3.toon(0xDDB57A)); pyramid(44, -110, 12, 16, Q3.toon(0xD8AE73));
  // unfinished pyramid + ramp
  const unf = Q3.ink(new THREE.CylinderGeometry(6 * Math.SQRT2, 14 * Math.SQRT2, 9, 4, 1), Q3.toon(0xE1BC82), 0.2); unf.rotation.y = Math.PI / 4; unf.position.set(30, 4.5, -40); S.add(unf);
  const ramp = Q3.ink(new THREE.BoxGeometry(5, 0.8, 24), Q3.toon(0xCFA066), 0.12); ramp.position.set(30, 4.2, -20); ramp.rotation.x = 0.36; S.add(ramp);
  // Nile with boats
  const nile = new THREE.Mesh(new THREE.PlaneGeometry(26, 600), Q3.toon(0x2F8FD8)); nile.rotation.x = -Math.PI / 2; nile.position.set(-95, 0.05, 0); S.add(nile);
  for (const [x, z] of [[-92, -20], [-98, 10]]) {
    const hull = Q3.ink(new THREE.BoxGeometry(2, 0.6, 6), Q3.toon(0x8A5A2B), 0.05); hull.position.set(x, 0.4, z); S.add(hull);
    const sail = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3.5, 3), Q3.toon(LINEN)); sail.position.set(x, 2.6, z); S.add(sail);
  }
  // workers' town (left foreground)
  EG.town = new THREE.Vector3(-26, 0, 2);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) house(-34 + c * 5.4 + (r % 2) * 1.2, -8 + r * 6, 4, 3.6, 2.4 + ((r + c) % 2) * 0.8);
  for (const [x, z] of [[-40, 6], [-14, -10], [-37, -14], [-12, 8]]) palm(x, z, 1.1);
  EG.jars = [];
  for (let i = 0; i < 6; i++) EG.jars.push(amphora(-24 + (i % 3) * 0.8, 9 + Math.floor(i / 3) * 0.8, 1.2));
  EG.bread = [];
  for (let i = 0; i < 4; i++) { const b = Q3.ink(new THREE.SphereGeometry(0.35, 12, 8), Q3.toon(0xD9944A), 0.02); b.scale.y = 0.5; b.position.set(-21 + i * 0.8, 0.2, 9.5); S.add(b); EG.bread.push(b); }
  EG.townFolk = [0, 1, 2, 3].map(i => { const p = person(); p.g.position.set(-28 + i * 2.2, 0, 10 + (i % 2)); p.g.rotation.y = 0.3 * (i - 1.5); return p; });
  // tombs (mastabas) near the great pyramid
  EG.tombs = [];
  for (let i = 0; i < 5; i++) { const m = Q3.ink(new THREE.CylinderGeometry(1.6, 2.2, 1.6, 4), Q3.toon(0xD9B27A), 0.08); m.rotation.y = Math.PI / 4; m.position.set(-14 + i * 4.2, 0.8, -38 - (i % 2) * 3); S.add(m); EG.tombs.push(m); }
  // hero crew: sledge + block + 6 pullers + water pourer + (myth) overseer
  EG.crew = new THREE.Group(); S.add(EG.crew);
  const sled = new THREE.Group(); EG.crew.add(sled); EG.sled = sled;
  for (const sx of [-1, 1]) { const run = Q3.ink(new THREE.BoxGeometry(3.4, 0.18, 0.22), Q3.toon(0x8A5A2B), 0.03); run.position.set(0, 0.1, 0.55 * sx); sled.add(run); }
  const deck = Q3.ink(new THREE.BoxGeometry(3.0, 0.15, 1.4), Q3.toon(0xA06A35), 0.03); deck.position.y = 0.27; sled.add(deck);
  EG.block = Q3.ink(new THREE.BoxGeometry(2.4, 1.6, 1.5), Q3.toon(0xE6C48C), 0.05); EG.block.position.y = 1.15; sled.add(EG.block);
  EG.rope = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 6), Q3.toon(0xC9A25E)); EG.rope.rotation.z = Math.PI / 2; EG.crew.add(EG.rope);
  EG.pullers = [];
  for (let i = 0; i < 6; i++) { const p = person(); p.g.rotation.y = -Math.PI / 2; p.g.position.set(-2.6 - i * 1.05, 0, (i % 2 ? 0.45 : -0.45)); EG.crew.add(p.g); EG.pullers.push(p); }
  EG.pourer = person(); EG.pourer.g.rotation.y = -Math.PI / 2 + 0.6; EG.pourer.g.position.set(-1.9, 0, 1.3); EG.crew.add(EG.pourer.g);
  EG.jarHand = amphora(0, 0, 0.6); EG.jarHand.removeFromParent(); EG.pourer.g.add(EG.jarHand); EG.jarHand.position.set(0, 1.45, 0.5); EG.jarHand.rotation.x = -1.9;
  EG.stream = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.09, 1.3, 8), new THREE.MeshBasicMaterial({ color: 0x8FD3FF, transparent: true, opacity: 0.8 })); EG.stream.position.set(-1.9, 0.75, 1.0); EG.crew.add(EG.stream);
  EG.wet = new THREE.Mesh(new THREE.CircleGeometry(1.1, 24), new THREE.MeshBasicMaterial({ color: 0x9A6A35, transparent: true, opacity: 0.75 })); EG.wet.rotation.x = -Math.PI / 2; EG.wet.position.set(-2.2, 0.02, 0.4); EG.wet.scale.set(1.6, 0.7, 1); EG.crew.add(EG.wet);
  EG.overseer = person({ skin: 0x5A3A22 }); EG.overseer.g.position.set(-4.5, 0, 2.4); EG.overseer.g.rotation.y = -0.8; EG.crew.add(EG.overseer.g);
  EG.whip = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.03, 6, 20, Math.PI * 1.2), Q3.toon(0x3A2210)); EG.overseer.arms[1].add(EG.whip); EG.whip.position.set(0, -0.9, 0.3);
  EG.crew.position.set(4, 0, 6);
}

// per-frame state for the crew. move = how far the sled travels (world units), wet 0..1, myth shows overseer
function crewUpdate(t, o = {}) {
  EG.crew.position.x = 4 - (o.move || 0);
  EG.pullers.forEach((p, i) => p.update(t * (o.fast ? 1.6 : 1), o.cheer ? 'cheer' : 'pull', i * 1.3));
  const front = EG.pullers[EG.pullers.length - 1].g.position.x, back = -1.6;
  EG.rope.position.set((front + back) / 2, 1.15, 0); EG.rope.scale.y = Math.abs(back - front);
  const wet = o.wet || 0;
  EG.pourer.g.visible = wet > 0.01; EG.pourer.update(t, 'pour');
  EG.stream.visible = wet > 0.05; EG.stream.scale.y = 0.6 + 0.4 * Math.sin(t * 20) * 0.1 + 0.4;
  EG.wet.material.opacity = 0.75 * wet;
  EG.overseer.g.visible = !!o.myth; EG.overseer.update(t, 'whip');
}
function setCasing(k) { EG.pyrMat.color.setHex(STONE).lerp(new THREE.Color(0xFFF9EE), k); EG.pyrMat.emissiveIntensity = 0.35 * k; }
