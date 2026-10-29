"""
Builds the hero sculpture: a three-axis gimbal of machined rings around a spindle.

Run headless:
    /Applications/Blender.app/Contents/MacOS/Blender -b -P scripts/blender/build_sculpture.py -- \
        --glb public/models/instrument.glb --png assets/blender/poster.png --blend assets/blender/instrument.blend

Hierarchy (every object origin sits at the world origin so the nodes pivot cleanly in three.js):
    RingOuter            fixed, faces the camera
      RingMid            pivots on the vertical pins fixed to RingOuter
        RingInner        pivots on the depth pins fixed to RingMid
          Core           spins on the horizontal pins fixed to RingInner

Flags: --no-render skips the poster render, --samples N sets Cycles samples.
"""

import math
import os
import sys

import bmesh
import bpy
from mathutils import Matrix, Vector

# ---------------------------------------------------------------- arguments


def arg(name, default=None):
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    if name in argv:
        i = argv.index(name)
        return argv[i + 1] if i + 1 < len(argv) else True
    return default


GLB_PATH = arg("--glb")
PNG_PATH = arg("--png")
BLEND_PATH = arg("--blend")
SAMPLES = int(arg("--samples", 96))
RES = int(arg("--res", 1600))
RENDER = "--no-render" not in sys.argv
SEG = 96  # radial segments for the big rings

# Rest pose used for the poster. The web viewer applies the same angles.
POSE_MID_Z = math.radians(32)
POSE_INNER_Y = math.radians(-38)
POSE_CORE_X = math.radians(24)

# ---------------------------------------------------------------- helpers

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
collection = scene.collection


def link(obj, parent=None):
    collection.objects.link(obj)
    if parent is not None:
        obj.parent = parent
    return obj


def object_from_bm(name, bm):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    return bpy.data.objects.new(name, me)


def cylinder_bm(radius, depth, segments=SEG, matrix=None):
    bm = bmesh.new()
    bmesh.ops.create_cone(
        bm, cap_ends=True, cap_tris=False, segments=segments,
        radius1=radius, radius2=radius, depth=depth,
    )
    if matrix is not None:
        bmesh.ops.transform(bm, matrix=matrix, verts=bm.verts)
    return bm


def apply_modifier(obj, mod):
    deps = bpy.context.evaluated_depsgraph_get()
    mesh = bpy.data.meshes.new_from_object(obj.evaluated_get(deps))
    obj.modifiers.remove(mod)
    old = obj.data
    obj.data = mesh
    bpy.data.meshes.remove(old)


def boolean(obj, cutter_bm, operation="DIFFERENCE"):
    """Cut (or union) a bmesh into obj using the exact solver."""
    cutter = object_from_bm(obj.name + "_cutter", cutter_bm)
    link(cutter)
    mod = obj.modifiers.new("bool", "BOOLEAN")
    mod.object = cutter
    mod.operation = operation
    mod.solver = "EXACT"
    apply_modifier(obj, mod)
    bpy.data.objects.remove(cutter)


def bevel(obj, width, segments=2, angle=35):
    mod = obj.modifiers.new("bevel", "BEVEL")
    mod.width = width
    mod.segments = segments
    mod.limit_method = "ANGLE"
    mod.angle_limit = math.radians(angle)
    apply_modifier(obj, mod)


def boxes_bm(specs):
    """specs: (center_xyz, size_xyz, rotation_z) -> one bmesh holding all boxes."""
    bm = bmesh.new()
    for center, size, rot in specs:
        verts = bmesh.ops.create_cube(bm, size=1.0)["verts"]
        bmesh.ops.scale(bm, vec=size, verts=verts)
        bmesh.ops.translate(bm, vec=center, verts=verts)
        if rot:
            bmesh.ops.rotate(bm, cent=(0, 0, 0), matrix=Matrix.Rotation(rot, 3, "Z"), verts=verts)
    return bm


def assign(obj, mat):
    """Single material slot; boolean cuts leave empty slots behind that render as default grey."""
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    for poly in obj.data.polygons:
        poly.material_index = 0


def smooth(obj, angle=32):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.shade_smooth_by_angle(angle=math.radians(angle))


def bake_transform(obj, matrix):
    obj.data.transform(matrix)
    obj.data.update()


def material(name, color, metallic, roughness, emission=None, emission_strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*emission, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emission_strength
    return mat


def srgb(hex_color):
    h = hex_color.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((v + 0.055) / 1.055) ** 2.4 if v > 0.04045 else v / 12.92 for v in c)


MAT_BONE = material("Bone satin", srgb("#e2ded2"), 1.0, 0.30)
MAT_GRAPHITE = material("Graphite anodised", srgb("#4b5058"), 1.0, 0.36)
MAT_STEEL = material("Machined steel", srgb("#b4b7ba"), 1.0, 0.22)
MAT_OBSIDIAN = material("Obsidian", srgb("#26282c"), 1.0, 0.34)
MAT_LIME = material("Signal lime", srgb("#b8f36b"), 0.0, 0.5, emission=srgb("#b8f36b"), emission_strength=0.45)

# ---------------------------------------------------------------- ring builder


def make_ring(name, outer, inner, thick, mat, *, ticks=0, long_every=6, tick_len=0.34,
              windows=0, window_len=0.2, groove=None, rim_pockets=0):
    """A machined ring in the XY plane, face toward +Z."""
    obj = object_from_bm(name, cylinder_bm(outer, thick))
    link(obj)
    boolean(obj, cylinder_bm(inner, thick * 3))

    width = outer - inner
    if windows:
        rc = inner + width / 2
        bm = bmesh.new()
        for k in range(windows):
            a = math.radians(45 + k * (360 / windows))
            verts = bmesh.ops.create_cube(bm, size=1.0)["verts"]
            bmesh.ops.scale(bm, vec=(width * 0.38, window_len, thick * 3), verts=verts)
            bmesh.ops.translate(bm, vec=(rc, 0, 0), verts=verts)
            bmesh.ops.rotate(bm, cent=(0, 0, 0), matrix=Matrix.Rotation(a, 3, "Z"), verts=verts)
        boolean(obj, bm)

    if rim_pockets:
        bm = bmesh.new()
        for k in range(rim_pockets):
            a = math.radians(22.5 + k * (360 / rim_pockets))
            verts = bmesh.ops.create_cube(bm, size=1.0)["verts"]
            bmesh.ops.scale(bm, vec=(0.06, 0.16, thick * 0.55), verts=verts)
            bmesh.ops.translate(bm, vec=(outer, 0, 0), verts=verts)
            bmesh.ops.rotate(bm, cent=(0, 0, 0), matrix=Matrix.Rotation(a, 3, "Z"), verts=verts)
        boolean(obj, bm)

    bevel(obj, min(thick, width) * 0.075)

    cut_depth = 0.008
    if groove:
        gb = cylinder_bm(groove + 0.0045, cut_depth * 2, matrix=Matrix.Translation((0, 0, thick / 2)))
        g = object_from_bm(name + "_g", gb)
        link(g)
        boolean(g, cylinder_bm(groove - 0.0045, thick * 3))
        groove_bm = bmesh.new()
        groove_bm.from_mesh(g.data)
        bpy.data.objects.remove(g)
        boolean(obj, groove_bm)

    if ticks:
        specs = []
        for i in range(ticks):
            a = 2 * math.pi * i / ticks
            long = i % long_every == 0
            length = width * (tick_len + (0.22 if long else 0))
            rc = outer - 0.014 - length / 2
            specs.append(((rc, 0, thick / 2), (length, 0.0042 if not long else 0.0058, cut_depth * 2), a))
        boolean(obj, boxes_bm(specs))

    smooth(obj)
    assign(obj, mat)
    return obj


def make_pin(name, axis, start, end, mat, radius=0.04, head_radius=0.072, head_len=0.034, parent=None):
    """Pin with a hex head at `end`, along a world axis ('X', 'Y' or 'Z'); start/end are signed positions."""
    length = abs(end - start)
    unit = {"X": Vector((1, 0, 0)), "Y": Vector((0, 1, 0)), "Z": Vector((0, 0, 1))}[axis]
    direction = unit * (1 if end > start else -1)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=24,
                          radius1=radius, radius2=radius, depth=length)
    bmesh.ops.translate(bm, vec=(0, 0, length / 2), verts=bm.verts)  # spans 0..length along +Z
    head = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=6,
                                 radius1=head_radius, radius2=head_radius, depth=head_len)["verts"]
    bmesh.ops.translate(bm, vec=(0, 0, length + head_len / 2), verts=head)
    obj = object_from_bm(name, bm)
    link(obj, parent)
    turn = Vector((0, 0, 1)).rotation_difference(direction).to_matrix().to_4x4()
    bake_transform(obj, Matrix.Translation(unit * start) @ turn)
    bevel(obj, 0.006, segments=1, angle=40)
    smooth(obj)
    assign(obj, mat)
    return obj


# ---------------------------------------------------------------- the rings

R_OUT = dict(outer=1.0, inner=0.86, thick=0.17)
R_MID = dict(outer=0.80, inner=0.68, thick=0.14)
R_IN = dict(outer=0.58, inner=0.48, thick=0.12)

ring_outer = make_ring("RingOuter", **R_OUT, mat=MAT_BONE, ticks=120, long_every=6,
                       groove=0.93, rim_pockets=4)
bake_transform(ring_outer, Matrix.Rotation(math.pi / 2, 4, "X"))  # axis Z -> -Y, face toward camera

ring_mid = make_ring("RingMid", **R_MID, mat=MAT_GRAPHITE, ticks=72, long_every=6,
                     windows=4, window_len=0.2, groove=0.74)
bake_transform(ring_mid, Matrix.Rotation(math.pi / 2, 4, "Y"))  # axis Z -> X
ring_mid.parent = ring_outer

ring_inner = make_ring("RingInner", **R_IN, mat=MAT_STEEL, ticks=48, long_every=6, tick_len=0.3)
ring_inner.parent = ring_mid

# ---------------------------------------------------------------- core (lathe profile)


def lathe_bm(profile, segments=64):
    bm = bmesh.new()
    verts = [bm.verts.new((r, 0, z)) for r, z in profile]
    edges = [bm.edges.new((verts[i], verts[i + 1])) for i in range(len(verts) - 1)]
    bmesh.ops.spin(bm, geom=verts + edges, cent=(0, 0, 0), axis=(0, 0, 1),
                   angle=math.tau, steps=segments, use_merge=True)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return bm


core_profile = [
    (0.0, -0.235), (0.11, -0.235), (0.14, -0.205), (0.14, -0.150), (0.115, -0.150),
    (0.115, -0.095), (0.19, -0.095), (0.19, -0.040), (0.19, 0.040), (0.19, 0.095),
    (0.115, 0.095), (0.115, 0.150), (0.14, 0.150), (0.14, 0.205), (0.11, 0.235), (0.0, 0.235),
]
core = object_from_bm("Core", lathe_bm(core_profile))
link(core, ring_inner)
bake_transform(core, Matrix.Rotation(math.pi / 2, 4, "Y"))  # axis Z -> X
smooth(core, 40)
assign(core, MAT_OBSIDIAN)

band = object_from_bm("CoreBand", lathe_bm([(0.185, -0.036), (0.1975, -0.036), (0.1975, 0.036), (0.185, 0.036)]))
link(band, core)
bake_transform(band, Matrix.Rotation(math.pi / 2, 4, "Y"))
smooth(band, 40)
assign(band, MAT_LIME)

# ---------------------------------------------------------------- pins (each fixed to the ring that carries it)

pin_index = 0
for sign in (1, -1):
    # outer ring -> mid ring, vertical
    make_pin(f"PinOuter{pin_index}", "Z", sign * 0.70, sign * 1.0, MAT_STEEL, parent=ring_outer)
    # mid ring -> inner ring, toward / away from the camera
    make_pin(f"PinMid{pin_index}", "Y", sign * 0.50, sign * 0.80, MAT_STEEL, parent=ring_mid)
    # inner ring -> core, horizontal
    make_pin(f"PinInner{pin_index}", "X", sign * 0.22, sign * 0.58, MAT_STEEL, parent=ring_inner)
    pin_index += 1

# lime inlay set into the outer ring face (the single hard accent on the object)
inlay = object_from_bm("Inlay", boxes_bm([((0, 0, 0), (0.055, 0.011, 0.014), 0)]))
link(inlay, ring_outer)
bake_transform(inlay, Matrix.Translation((0.0, -(R_OUT["thick"] / 2 - 0.003), 0.93)))
assign(inlay, MAT_LIME)

# pocket for the inlay (cut into the outer ring face along -Y)
pocket = bmesh.new()
verts = bmesh.ops.create_cube(pocket, size=1.0)["verts"]
bmesh.ops.scale(pocket, vec=(0.075, 0.03, 0.034), verts=verts)
bmesh.ops.translate(pocket, vec=(0.0, -(R_OUT["thick"] / 2), 0.93), verts=verts)
boolean(ring_outer, pocket)
smooth(ring_outer)
assign(ring_outer, MAT_BONE)

# ---------------------------------------------------------------- export

os.makedirs(os.path.dirname(GLB_PATH), exist_ok=True) if GLB_PATH else None
if GLB_PATH:
    bpy.ops.export_scene.gltf(
        filepath=GLB_PATH, export_format="GLB", export_apply=True,
        export_yup=True, export_cameras=False, export_lights=False,
        export_materials="EXPORT", export_meshopt_compression_enable=True, export_normals=True, export_tangents=False,
        export_texcoords=False, export_extras=False,
    )
    print("GLB written:", GLB_PATH, os.path.getsize(GLB_PATH), "bytes")

tri_count = sum(len(o.data.polygons) for o in bpy.data.objects if o.type == "MESH")
print("polygon count:", tri_count)

# ---------------------------------------------------------------- poster render

ring_mid.rotation_euler.z = POSE_MID_Z
ring_inner.rotation_euler.y = POSE_INNER_Y
core.rotation_euler.x = POSE_CORE_X

if RENDER and PNG_PATH:
    world = bpy.data.worlds.new("studio")
    scene.world = world
    world.use_nodes = True
    nt = world.node_tree
    bg = nt.nodes["Background"]
    coord = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    # vertical gradient: near-black floor to a soft overhead glow, so flat faces pick up a graded reflection
    ramp.color_ramp.elements[0].position = 0.42
    ramp.color_ramp.elements[0].color = (0.002, 0.002, 0.003, 1)
    ramp.color_ramp.elements[1].position = 1.0
    ramp.color_ramp.elements[1].color = (1.6, 1.65, 1.75, 1)
    nt.links.new(coord.outputs["Generated"], sep.inputs[0])
    nt.links.new(sep.outputs["Z"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], bg.inputs["Color"])
    bg.inputs["Strength"].default_value = 1.0

    def panel(name, location, size, color, strength):
        bm = bmesh.new()
        bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5)
        bmesh.ops.scale(bm, vec=(size[0], size[1], 1), verts=bm.verts)
        o = object_from_bm(name, bm)
        link(o)
        o.location = location
        direction = Vector((0, 0, 0)) - Vector(location)
        o.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        nt = m.node_tree
        for n in list(nt.nodes):
            nt.nodes.remove(n)
        em = nt.nodes.new("ShaderNodeEmission")
        em.inputs["Color"].default_value = (*color, 1)
        em.inputs["Strength"].default_value = strength
        out = nt.nodes.new("ShaderNodeOutputMaterial")
        nt.links.new(em.outputs[0], out.inputs[0])
        o.data.materials.append(m)
        o.visible_camera = False
        return o

    panel("KeySoftbox", (-4.6, -3.6, 4.2), (4.0, 4.6), (1.0, 0.98, 0.94), 9.0)
    panel("FrontFill", (0.0, -9.0, 1.2), (9.0, 4.0), (0.9, 0.92, 0.96), 1.1)
    panel("RightStrip", (5.2, -1.6, 0.6), (0.5, 6.5), (0.95, 0.97, 1.0), 26.0)
    panel("LeftStrip", (-5.4, 1.2, 0.2), (0.35, 5.0), (0.9, 0.94, 1.0), 12.0)
    panel("TopStrip", (0.4, -1.6, 6.4), (4.0, 0.5), (1.0, 1.0, 1.0), 14.0)
    panel("LimeKick", (3.4, 4.2, -1.0), (0.3, 3.0), srgb("#b8f36b"), 5.0)

    cam_data = bpy.data.cameras.new("Cam")
    cam_data.sensor_width = 36
    cam_data.lens = 72.2  # ~28 degree vertical field of view, same as the web viewer
    cam = bpy.data.objects.new("Cam", cam_data)
    link(cam)
    cam.location = (0, -6.4, 1.8)
    cam.rotation_euler = (Vector((0, 0, 0)) - cam.location).to_track_quat("-Z", "Y").to_euler()
    scene.camera = cam

    scene.render.engine = "CYCLES"
    scene.cycles.samples = SAMPLES
    scene.cycles.use_denoising = True
    scene.cycles.device = "CPU"
    scene.render.film_transparent = True
    scene.render.resolution_x = RES
    scene.render.resolution_y = RES
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.render.filepath = PNG_PATH
    os.makedirs(os.path.dirname(PNG_PATH), exist_ok=True)
    bpy.ops.render.render(write_still=True)
    print("Poster written:", PNG_PATH)

if BLEND_PATH:
    os.makedirs(os.path.dirname(BLEND_PATH), exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=BLEND_PATH)
