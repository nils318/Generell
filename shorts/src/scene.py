"""Test-Short: Roblox-artige Blockfigur, 10 s, 9:16. Alles per Code animiert."""
import bpy, math, sys, os

OUT = sys.argv[sys.argv.index("--out") + 1] if "--out" in sys.argv else "/tmp/frames/"
ENGINE = sys.argv[sys.argv.index("--engine") + 1] if "--engine" in sys.argv else "CYCLES"
SCALE = int(sys.argv[sys.argv.index("--scale") + 1]) if "--scale" in sys.argv else 100
FRAMES = sys.argv[sys.argv.index("--frames") + 1] if "--frames" in sys.argv else "1-300"

FPS, END = 30, 300
bpy.ops.wm.read_factory_settings(use_empty=True)
sc = bpy.context.scene
sc.render.fps = FPS
sc.frame_start, sc.frame_end = 1, END

# ---------- Helpers ----------
def mat(name, rgb, rough=0.5):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*rgb, 1)
    b.inputs["Roughness"].default_value = rough
    return m

def block(name, size, loc, material, parent=None, bevel=0.08):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    if bevel:
        mod = o.modifiers.new("bevel", "BEVEL")
        mod.width, mod.segments = bevel, 3
    o.data.materials.append(material)
    for p in o.data.polygons:
        p.use_smooth = True
    if parent:
        o.parent = parent
    return o

def empty(name, loc, parent=None):
    o = bpy.data.objects.new(name, None)
    sc.collection.objects.link(o)
    o.location = loc
    if parent:
        o.parent = parent
    return o

def sphere(name, r, loc, material, parent, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=16, ring_count=8)
    o = bpy.context.object
    o.name, o.scale = name, scale
    o.data.materials.append(material)
    bpy.ops.object.shade_smooth()
    o.parent = parent
    return o

# ---------- Materials ----------
SKIN = mat("skin", (0.85, 0.55, 0.38))
SHIRT = mat("shirt", (0.9, 0.08, 0.12), 0.7)
WHITE = mat("white", (0.95, 0.95, 0.95), 0.6)
CAP = mat("cap", (0.02, 0.02, 0.03), 0.6)
LEAF = mat("leaf", (0.1, 0.55, 0.15), 0.8)
PANTS = mat("pants", (0.06, 0.08, 0.2), 0.8)
BLACK = mat("black", (0.01, 0.01, 0.01), 0.3)
GRASS = mat("grass", (0.3, 0.85, 0.15), 0.8)
DIRT = mat("dirt", (0.45, 0.28, 0.12), 0.9)
COLS = [mat(f"c{i}", c, 0.4) for i, c in enumerate(
    [(1, 0.25, 0.3), (1, 0.6, 0.1), (0.6, 0.3, 1), (0.1, 0.85, 0.9), (1, 0.4, 0.8)])]

# ---------- Character rig (R6-like) ----------
rig = empty("Rig", (0, 4, 0))          # position on ground
body = empty("Body", (0, 0, 0), rig)   # jump height + squash
torso = block("Torso", (2, 1, 2), (0, 0, 3), SHIRT, body)
neck = empty("Neck", (0, 0, 4), body)
head = block("Head", (1.35, 1.3, 1.25), (0, 0, 0.66), SKIN, neck, bevel=0.25)
block("Cap", (1.45, 1.4, 0.45), (0, 0.02, 1.32), CAP, neck, bevel=0.15)
block("Brim", (1.3, 0.75, 0.1), (0, -0.95, 1.14), CAP, neck, bevel=0.04)
block("Pocket", (1.2, 0.08, 0.55), (0, -0.52, 2.55), mat("pk", (0.7, 0.05, 0.1), 0.7), torso.parent, bevel=0.05)
# face (front = -Y)
for s in (-1, 1):
    sphere(f"Eye{s}", 0.11, (0.25 * s, -0.67, 0.8), BLACK, neck, (1, 0.4, 1.6))
for i in range(7):
    a = math.radians(-60 + i * 20)
    sphere(f"Smile{i}", 0.055, (0.3 * math.sin(a), -0.68, 0.52 - 0.12 * math.cos(a) + 0.05), BLACK, neck)
shoulders, hips = {}, {}
for s, n in ((-1, "L"), (1, "R")):
    shoulders[n] = empty(f"Shoulder{n}", (1.5 * s, 0, 3.85), body)
    block(f"Arm{n}", (1, 1, 1.55), (0, 0, -0.68), SHIRT, shoulders[n])
    block(f"Hand{n}", (0.92, 0.92, 0.45), (0, 0, -1.68), SKIN, shoulders[n], bevel=0.1)
    hips[n] = empty(f"Hip{n}", (0.5 * s, 0, 2), body)
    block(f"Leg{n}", (0.98, 1, 1.6), (0, 0, -0.8), PANTS, hips[n])
    block(f"Shoe{n}", (1.0, 1.1, 0.42), (0, -0.04, -1.79), WHITE, hips[n], bevel=0.12)

# ---------- World ----------
block("Grass", (14, 14, 0.6), (0, 2, -0.3), GRASS, bevel=0.15)
block("Dirt", (13.6, 13.6, 3), (0, 2, -2.1), DIRT, bevel=0.15)
floaters = []
for i, (x, y, z, s) in enumerate([(-5, 12, 9, 1.4), (5.5, 14, 12, 2.0), (-7, 20, 15, 2.6),
                                  (4, 10, 7.5, 1.0), (-1, 26, 19, 3), (8, 24, 6, 2.4)]):
    floaters.append(block(f"F{i}", (s, s, s), (x, y, z), COLS[i % len(COLS)], bevel=0.12 * s))

for tx, ty, h in [(-5, 7, 3), (5, 6, 2.4), (-5.5, -1.5, 2), (6, -2, 2.8)]:
    block("Trunk", (0.7, 0.7, h), (tx, ty, h / 2), DIRT, bevel=0.05)
    block("Leaves", (2.4, 2.4, 2.2), (tx, ty, h + 0.9), LEAF, bevel=0.25)
    block("Leaves2", (1.5, 1.5, 1.2), (tx, ty, h + 2.4), LEAF, bevel=0.2)
world = bpy.data.worlds.new("Sky")
sc.world = world
world.use_nodes = True
nt = world.node_tree
bg = nt.nodes["Background"]
tc = nt.nodes.new("ShaderNodeTexCoord")
sep = nt.nodes.new("ShaderNodeSeparateXYZ")
ramp = nt.nodes.new("ShaderNodeValToRGB")
ramp.color_ramp.elements[0].color = (0.55, 0.8, 1.0, 1)
ramp.color_ramp.elements[1].color = (0.05, 0.25, 0.9, 1)
nt.links.new(tc.outputs["Generated"], sep.inputs[0])
nt.links.new(sep.outputs["Z"], ramp.inputs[0])
ramp.color_ramp.elements[0].position = 0.45
ramp.color_ramp.elements[1].position = 0.85
nt.links.remove(sep.inputs[0].links[0]); nt.links.new(tc.outputs["Window"], sep.inputs[0])
nt.links.remove(sep.outputs["Z"].links[0]); nt.links.new(sep.outputs["Y"], ramp.inputs[0])
nt.links.new(ramp.outputs["Color"], bg.inputs["Color"])
bg.inputs["Strength"].default_value = 1.0

sun = bpy.data.lights.new("Sun", "SUN")
sun.energy, sun.angle = 3.2, math.radians(8)
so = bpy.data.objects.new("Sun", sun)
sc.collection.objects.link(so)
so.rotation_euler = (math.radians(50), math.radians(-15), math.radians(-35))

# ---------- Camera ----------
cam_data = bpy.data.cameras.new("Cam")
cam_data.lens = 32
cam = bpy.data.objects.new("Cam", cam_data)
sc.collection.objects.link(cam)
sc.camera = cam
target = empty("Target", (0, 0, 3))
tt = cam.constraints.new("TRACK_TO")
tt.target, tt.track_axis, tt.up_axis = target, "TRACK_NEGATIVE_Z", "UP_Y"

# ---------- Animation (procedural, keyed every frame) ----------
def clamp(x, a=0.0, b=1.0): return max(a, min(b, x))
def ease(t): t = clamp(t); return t * t * (3 - 2 * t)
def seg(f, a, b): return ease((f - a) / (b - a))
def lerp(a, b, t): return a + (b - a) * t
def lerp3(a, b, t): return tuple(lerp(x, y, t) for x, y in zip(a, b))
R = math.radians

def key(o, f, loc=None, rot=None, scl=None):
    if loc is not None: o.location = loc; o.keyframe_insert("location", frame=f)
    if rot is not None: o.rotation_euler = rot; o.keyframe_insert("rotation_euler", frame=f)
    if scl is not None: o.scale = scl; o.keyframe_insert("scale", frame=f)

for f in range(1, END + 1):
    t = f / FPS
    # defaults
    rig_y, body_z, spin, sq = 4.0, 0.0, 0.0, 1.0
    armL = armR = legL = legR = 0.0   # swing around X
    armR_side = armL_side = 0.0        # raise around Y
    head_tilt = 0.0
    bob = 0.05 * math.sin(t * 4)

    if f < 30:                                    # idle
        body_z = bob
        armL, armR = R(4) * math.sin(t * 4), -R(4) * math.sin(t * 4)
    elif f < 90:                                  # walk towards camera
        w = (f - 30) / 60
        rig_y = lerp(4, 0, ease(w) * 0.4 + w * 0.6)
        ph = (f - 30) / FPS * 2 * math.pi * 1.6
        amp = R(38) * min(1, (f - 30) / 8) * min(1, (90 - f) / 8)
        legL, legR = amp * math.sin(ph), -amp * math.sin(ph)
        armL, armR = -amp * math.sin(ph), amp * math.sin(ph)
        body_z = abs(math.sin(ph)) * 0.12
    elif f < 105:                                 # anticipation crouch
        rig_y = 0
        c = seg(f, 90, 102)
        sq = lerp(1, 0.8, c)
        armL = armR = lerp(0, R(45), c)
    elif f < 135:                                 # jump + 360 spin
        rig_y = 0
        j = (f - 105) / 30
        body_z = 4 * 3.2 * j * (1 - j)
        spin = R(360) * ease(j)
        sq = lerp(1.15, 1.0, clamp(j * 3)) if j < 0.5 else 1.0
        armL_side = -R(150) * math.sin(math.pi * j)
        armR_side = R(150) * math.sin(math.pi * j)
        legL, legR = R(-20) * math.sin(math.pi * j), R(20) * math.sin(math.pi * j)
    elif f < 150:                                 # land squash
        rig_y = 0
        l = (f - 135) / 15
        sq = 1 - 0.22 * math.sin(math.pi * l) * (1 - l * 0.3)
        armL = armR = R(25) * math.sin(math.pi * l)
    elif f < 220:                                 # wave
        rig_y = 0
        body_z = bob
        up = seg(f, 150, 162) * (1 - seg(f, 208, 220))
        armR_side = R(155) * up + R(18) * math.sin((f - 150) / FPS * 2 * math.pi * 2.2) * up
        head_tilt = R(10) * up
        armL = R(4) * math.sin(t * 4)
    else:                                         # celebration hops
        rig_y = 0
        h = (f - 220) / 20
        k = h % 1
        if h < 3:
            body_z = 1.2 * 4 * k * (1 - k)
            armL_side = -R(140) * math.sin(math.pi * k)
            armR_side = R(140) * math.sin(math.pi * k)
        else:
            body_z = bob
            armL, armR = R(4) * math.sin(t * 4), -R(4) * math.sin(t * 4)

    key(rig, f, loc=(0, rig_y, 0), rot=(0, 0, spin))
    key(body, f, loc=(0, 0, body_z), scl=(1 + (1 - sq) * 0.6, 1 + (1 - sq) * 0.6, sq))
    key(shoulders["L"], f, rot=(armL, armL_side, 0))
    key(shoulders["R"], f, rot=(armR, armR_side, 0))
    key(hips["L"], f, rot=(legL, 0, 0))
    key(hips["R"], f, rot=(legR, 0, 0))
    key(neck, f, rot=(0, -head_tilt, 0))

    # camera: wide -> follow jump -> close on wave -> orbit out
    tgt_z = 3 + body_z * 0.6
    if f < 150:
        cl = (0, -16, 5)
        tz = lerp(3.2, tgt_z, 0.7)
    elif f < 220:
        z = seg(f, 150, 175)
        cl = lerp3((0, -16, 5), (1.5, -8.5, 4.6), z)
        tz = lerp(3.2, 3.9, z)
    else:
        o = seg(f, 220, 300)
        ang = R(-90 + 35 * o)
        r = lerp(8.7, 15, o)
        cl = (r * math.cos(ang) + 1.5 * (1 - o), r * math.sin(ang), lerp(4.6, 6.5, o))
        tz = lerp(3.9, 3.4, o)
    key(cam, f, loc=cl)
    key(target, f, loc=(0, 0, tz))

    for i, fl in enumerate(floaters):
        if f % 5 == 1:
            key(fl, f, rot=(t * 0.4 + i, t * 0.3 * (i % 2 * 2 - 1), t * 0.25))

# ---------- Render settings ----------
r = sc.render
r.resolution_x, r.resolution_y, r.resolution_percentage = 1080, 1920, SCALE
r.image_settings.file_format = "PNG"
r.filepath = OUT
sc.view_settings.view_transform = "Standard"
sc.view_settings.look = "Medium High Contrast"
if ENGINE == "CYCLES":
    r.engine = "CYCLES"
    sc.cycles.device = "CPU"
    sc.cycles.samples = 16
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 4
    sc.cycles.use_fast_gi = True
else:
    r.engine = ENGINE

a, b = (int(x) for x in FRAMES.split("-"))
for fr in range(a, b + 1):
    sc.frame_set(fr)
    r.filepath = os.path.join(OUT, f"{fr:04d}.png")
    bpy.ops.render.render(write_still=True)
