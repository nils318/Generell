// q3d.js — optional 3D layer for WHAT IF? (three.js r150, toon look with ink outlines).
// Nothing is created until Q3.init() runs, so 2D episodes are unaffected.
// Usage in an episode: Q3.init(); build meshes into Q3.scene; per frame set Q3.look(...), Q3.quix.update(t, {...}),
// then Q3.render(ctx) draws the 3D image into the 2D canvas; overlays (subtitles, chips) follow in 2D.
const Q3 = (() => {
  const INKC = 0x1A1033;
  let R = null, gl = null, GRAD = null;
  const api = { scene: null, cam: null };

  function gradTex() {
    const d = new Uint8Array([110, 190, 255]);
    const tx = new THREE.DataTexture(d, 3, 1, THREE.RedFormat);
    tx.minFilter = tx.magFilter = THREE.NearestFilter; tx.needsUpdate = true; return tx;
  }
  const toon = (color, extra = {}) => new THREE.MeshToonMaterial(Object.assign({ color, gradientMap: GRAD }, extra));
  const inkMat = new Map();
  function outlineMat() { if (!inkMat.has('i')) inkMat.set('i', new THREE.MeshBasicMaterial({ color: INKC, side: THREE.BackSide })); return inkMat.get('i'); }

  // mesh + inverted-hull outline (geometry must be centred on its origin)
  function ink(geo, mat, w = 0.04, shadow = true) {
    const g = new THREE.Group(), m = new THREE.Mesh(geo, mat), o = new THREE.Mesh(geo, outlineMat());
    m.castShadow = shadow; m.receiveShadow = true;
    geo.computeBoundingSphere(); const r = geo.boundingSphere.radius || 1;
    o.scale.setScalar(1 + w / r);
    g.add(o, m); g.userData.mesh = m; return g;
  }

  function init(bg = 0xBFE9FF) {
    if (R) return api;
    GRAD = gradTex();
    gl = document.createElement('canvas'); gl.width = 1080; gl.height = 1920;
    R = new THREE.WebGLRenderer({ canvas: gl, antialias: true, preserveDrawingBuffer: true });
    R.setPixelRatio(1); R.setSize(1080, 1920, false);
    R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
    const scene = new THREE.Scene(); scene.background = new THREE.Color(bg);
    const cam = new THREE.PerspectiveCamera(30, 1080 / 1920, 0.1, 300);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8a7fb0, 0.75));
    const sun = new THREE.DirectionalLight(0xffffff, 0.95); sun.position.set(5, 12, 8); sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -10, right: 10, top: 10, bottom: -10, near: 1, far: 40 });
    sun.shadow.bias = -0.0004; sun.shadow.radius = 4; scene.add(sun);
    Object.assign(api, { scene, cam, sun });
    return api;
  }
  function look(pos, target, fov) {
    api.cam.position.set(pos[0], pos[1], pos[2]); api.cam.lookAt(target[0], target[1], target[2]);
    if (fov && fov !== api.cam.fov) { api.cam.fov = fov; api.cam.updateProjectionMatrix(); }
  }
  function render(ctx) { R.render(api.scene, api.cam); ctx.drawImage(gl, 0, 0); }
  function project(obj) {
    const v = obj.isVector3 ? obj.clone() : obj.getWorldPosition(new THREE.Vector3());
    v.project(api.cam); return [(v.x + 1) / 2 * 1080, (1 - v.y) / 2 * 1920];
  }

  // text on a plane-sized canvas texture (keys, screens)
  function textTex(w, h, draw) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const tx = new THREE.CanvasTexture(c); tx.anisotropy = 4;
    const redraw = (...a) => { const g = c.getContext('2d'); g.clearRect(0, 0, w, h); draw(g, w, h, ...a); tx.needsUpdate = true; };
    redraw(); return { tex: tx, redraw, canvas: c };
  }

  // soft additive glow sprite
  let glowTex = null;
  function glowSprite(color = '#FFD43B') {
    if (!glowTex) {
      const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
      const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128); glowTex = new THREE.CanvasTexture(c);
    }
    return new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  }

  // ------------------------------------------------------------------ 3D Quix
  const EX = {      // lid 0 open .. 1 closed, brows: tilt (rad, + = inner end up), raise; mouth: smile|frown|o|flat
    cool:    { lid: 0.42, tilt: 0.0, raise: 0.0, mouth: 'smile', ms: 0.7 },
    curious: { lid: 0.08, tilt: 0.2, raise: 0.05, mouth: 'flat', ms: 0.6 },
    shock:   { lid: 0.0, tilt: 0.35, raise: 0.09, mouth: 'o', ms: 1, pupil: 0.7 },
    smug:    { lid: 0.5, tilt: -0.25, raise: 0.0, mouth: 'smile', ms: 0.9, tiltL: 0.15 },
    happy:   { lid: 0.12, tilt: 0.1, raise: 0.05, mouth: 'smile', ms: 1.2 },
    worried: { lid: 0.2, tilt: 0.45, raise: 0.03, mouth: 'frown', ms: 0.8 },
    disgust: { lid: 0.45, tilt: -0.35, raise: -0.02, mouth: 'frown', ms: 1.0 },
    angry:   { lid: 0.3, tilt: -0.5, raise: -0.03, mouth: 'frown', ms: 1.0 },
    tired:   { lid: 0.65, tilt: 0.25, raise: 0.0, mouth: 'flat', ms: 0.8 },
  };
  // arm rotations [rz, rx] for viewer-right arm (R) and viewer-left arm (L)
  const POSE = {
    idle:  { R: [0.28, 0], L: [-0.28, 0] },
    point: { R: [1.5, -0.2], L: [-0.25, 0] },
    cheer: { R: [2.6, 0], L: [-2.6, 0] },
    shrug: { R: [1.15, -0.5], L: [-1.15, -0.5] },
    thumb: { R: [2.1, -0.6], L: [-0.25, 0] },
    hips:  { R: [0.75, 0.5], L: [-0.75, 0.5] },
    type:  { R: [0.25, -1.35], L: [-0.25, -1.35] },
    think: { R: [0.5, -2.3], L: [-0.25, 0] },
    facepalm: { R: [0.35, -2.55], L: [-0.25, 0] },
    wave:  { R: [2.5, 0], L: [-0.28, 0] },
  };

  function makeQuix() {
    const Q = new THREE.Group(), body = new THREE.Group(); Q.add(body); body.position.y = 1.15;
    const PURPLE = toon(0x6E4BFF), WHITE = toon(0xffffff), DARK = new THREE.MeshBasicMaterial({ color: 0x22102E });
    const ORANGE = toon(0xFF6B2C), YEL = toon(0xFFD43B, { emissive: 0xFFB000, emissiveIntensity: 0.35 });
    const torso = ink(new THREE.CapsuleGeometry(0.62, 0.55, 10, 28), PURPLE, 0.045); body.add(torso);
    // belly sheen
    const sheen = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 12), new THREE.MeshBasicMaterial({ color: 0x9A80FF, transparent: true, opacity: 0.35 }));
    sheen.scale.set(1, 0.9, 0.35); sheen.position.set(0, -0.2, 0.42); body.add(sheen);

    const eyes = [];
    for (const sx of [-1, 1]) {
      const e = new THREE.Group(); e.position.set(0.25 * sx, 0.3, 0.5); body.add(e);
      const white = ink(new THREE.SphereGeometry(0.2, 24, 16), WHITE, 0.03, false); white.scale.set(1, 1.08, 0.65); e.add(white);
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), DARK); pupil.scale.set(1, 1.1, 0.5); pupil.position.z = 0.115; e.add(pupil);
      const shine = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff })); shine.position.set(0.03, 0.04, 0.05); pupil.add(shine);
      const lidPivot = new THREE.Group(); e.add(lidPivot);
      const lid = new THREE.Mesh(new THREE.SphereGeometry(0.215, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), PURPLE); lid.scale.set(1, 1.08, 0.7); lidPivot.add(lid);
      const lidLine = new THREE.Mesh(new THREE.TorusGeometry(0.205, 0.018, 6, 28, Math.PI), DARK); lidLine.scale.set(1, 1, 0.7); lidLine.rotation.x = Math.PI / 2; lidLine.rotation.z = Math.PI; lidPivot.add(lidLine);
      const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.2, 4, 8), DARK); brow.rotation.z = Math.PI / 2;
      const browPivot = new THREE.Group(); browPivot.position.set(0, 0.29, 0.06); browPivot.add(brow); e.add(browPivot);
      eyes.push({ e, pupil, lidPivot, browPivot, sx });
    }
    const mouth = new THREE.Group(); mouth.position.set(0, -0.06, 0.6); body.add(mouth);
    const open = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 12), DARK); open.scale.set(1.5, 0.3, 0.35); mouth.add(open);
    const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), toon(0xFF5A7A)); tongue.position.set(0, -0.04, 0.02); tongue.scale.set(1.3, 0.6, 0.5); open.add(tongue);
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.024, 8, 20, Math.PI), DARK); mouth.add(arc);

    const scarf = ink(new THREE.TorusGeometry(0.6, 0.13, 12, 32), ORANGE, 0.03); scarf.rotation.x = Math.PI / 2; scarf.position.y = -0.4; body.add(scarf);
    const tail = ink(new THREE.BoxGeometry(0.2, 0.46, 0.09), ORANGE, 0.03); tail.position.set(0.32, -0.66, 0.5); tail.rotation.z = 0.25; body.add(tail);

    // antenna "?" — Quix is the dot
    const ant = new THREE.Group(); ant.position.y = 0.82; body.add(ant);
    const pts = [[0, 0], [0, 0.22], [0.03, 0.4], [0.24, 0.53], [0.35, 0.74], [0.24, 0.95], [0.0, 1.01], [-0.22, 0.92]].map(([x, y]) => new THREE.Vector3(x, y, 0));
    const curve = new THREE.CatmullRomCurve3(pts);
    const antMesh = ink(new THREE.TubeGeometry(curve, 64, 0.065, 12), YEL, 0.03); ant.add(antMesh);
    const capEnd = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 8), YEL); capEnd.position.copy(pts[pts.length - 1]); ant.add(capEnd);
    const tip = new THREE.Object3D(); tip.position.set(0.05, 0.86, 0); ant.add(tip);
    const glow = glowSprite('#FFD43B'); glow.position.set(0.06, 0.6, 0); ant.add(glow);

    const arms = {};
    for (const [k, sx] of [['R', 1], ['L', -1]]) {
      const sh = new THREE.Group(); sh.position.set(0.6 * sx, 0.05, 0); body.add(sh);
      const up = ink(new THREE.CapsuleGeometry(0.085, 0.36, 4, 10), PURPLE, 0.03); up.position.y = -0.27; sh.add(up);
      const glove = ink(new THREE.SphereGeometry(0.16, 16, 12), WHITE, 0.03); glove.position.y = -0.56; sh.add(glove);
      const thumb = ink(new THREE.CapsuleGeometry(0.05, 0.08, 4, 8), WHITE, 0.02); thumb.position.set(0.13 * sx, -0.5, 0.06); thumb.rotation.z = -0.6 * sx; sh.add(thumb);
      arms[k] = { sh, glove };
    }
    for (const sx of [-1, 1]) {
      const leg = ink(new THREE.CapsuleGeometry(0.1, 0.12, 4, 10), PURPLE, 0.03); leg.position.set(0.26 * sx, -0.92, 0); body.add(leg);
      const shoe = ink(new THREE.SphereGeometry(0.2, 18, 12), WHITE, 0.03); shoe.scale.set(1, 0.6, 1.45); shoe.position.set(0.28 * sx, 0.11, 0.08); Q.add(shoe);
      const sole = ink(new THREE.BoxGeometry(0.36, 0.06, 0.56), ORANGE, 0.02); sole.position.set(0.28 * sx, 0.03, 0.08); Q.add(sole);
    }

    function update(t, o = {}) {
      const ex = EX[o.expr || 'cool'] || EX.cool, ps = POSE[o.pose || 'idle'] || POSE.idle;
      const ps2 = o.pose2 ? (POSE[o.pose2] || ps) : ps, pk = o.poseK ?? 0;
      const m = o.talk === false ? 0 : mouthAt(t), bl = blinkAt(t);
      const s = o.s || 1;
      Q.position.set(...(o.pos || [0, 0, 0])); Q.rotation.y = o.rotY || 0; Q.scale.setScalar(s);
      const bob = (o.bob ?? 1) * 0.03 * Math.sin(t * 3.1);
      const sq = 1 + m * 0.04 + (o.squash || 0);
      body.position.y = 1.15 + bob - m * 0.03 + (o.hop || 0); body.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
      body.rotation.z = (o.lean || 0); body.rotation.x = o.tiltX || 0;
      const lk = o.look || [0, 0];
      for (const ey of eyes) {
        const lid = Math.max(bl, o.lid ?? ex.lid);
        ey.lidPivot.rotation.x = lid < 0.5 ? -1.35 + 2.7 * lid : (lid - 0.5) * 3.1;
        ey.pupil.position.x = lk[0] * 0.07; ey.pupil.position.y = -lk[1] * 0.06;
        ey.pupil.scale.setScalar(ex.pupil || 1); ey.pupil.scale.z = 0.5;
        const tilt = (ey.sx < 0 && ex.tiltL != null ? ex.tiltL : ex.tilt);
        ey.browPivot.rotation.z = -tilt * ey.sx; ey.browPivot.position.y = 0.29 + ex.raise + 0.04 * (o.browUp || 0);
      }
      const shape = ex.mouth, ms = ex.ms;
      const talking = m > 0.04 || shape === 'o';
      open.visible = talking; arc.visible = !talking && shape !== 'flat';
      open.scale.set(1.5 * ms * (shape === 'o' ? 0.8 : 1), shape === 'o' ? 1.1 : 0.25 + 1.35 * m, 0.35);
      arc.rotation.z = shape === 'frown' ? 0 : Math.PI; arc.scale.setScalar(ms); arc.position.y = shape === 'frown' ? -0.06 : 0.04;
      if (!talking && shape === 'flat') { arc.visible = true; arc.rotation.z = Math.PI; arc.scale.set(ms, 0.25, 1); }
      ant.rotation.z = 0.06 * Math.sin(t * 2.1) + (o.boing || 0);
      const gw = o.glow || 0; YEL.emissiveIntensity = 0.35 + 0.9 * gw; glow.scale.setScalar(0.6 + 1.6 * gw); glow.material.opacity = 0.25 + 0.75 * gw;
      for (const k of ['R', 'L']) {
        const a = ps[k], b = ps2[k];
        let rz = lerp(a[0], b[0], pk), rx = lerp(a[1], b[1], pk);
        if (o.pose === 'wave' && k === 'R') rz += 0.3 * Math.sin(t * 12);
        if (o.peck && k === 'R') rx += 0.35 * Math.max(0, Math.sin(t * 14));
        if (o.typing) rx += 0.18 * Math.max(0, Math.sin(t * 16 + (k === 'R' ? 0 : 1.6)));
        if (o.arm && o.arm[k]) { rz = o.arm[k][0]; rx = o.arm[k][1]; }
        arms[k].sh.rotation.z = rz; arms[k].sh.rotation.x = rx;
      }
    }
    return { group: Q, update, tip, arms, body };
  }

  api.init = init; api.look = look; api.render = render; api.project = project;
  api.toon = (c, e) => toon(c, e); api.ink = ink; api.textTex = textTex; api.glowSprite = glowSprite;
  api.makeQuix = makeQuix; api.EX = EX; api.POSE = POSE;
  return api;
})();
window.Q3 = Q3;
