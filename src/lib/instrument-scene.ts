import {
  AgXToneMapping,
  BackSide,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

/**
 * Real-time viewer for the Blender-built sculpture (public/models/instrument.glb).
 * The GLB keeps the gimbal hierarchy: RingOuter > RingMid > RingInner > Core, each
 * node pivoting at the origin, so rotating a node rotates everything nested in it.
 * The rest pose and camera match the Blender poster render so the fade-in is seamless.
 */

export type InstrumentAngles = { mid: number; inner: number; core: number };

export type InstrumentSceneOptions = {
  canvas: HTMLCanvasElement;
  modelUrl: string;
  /** Tilt the whole object toward the pointer (fine pointers only). */
  pointerTilt: boolean;
  maxPixelRatio: number;
  onAngles?: (angles: InstrumentAngles) => void;
  onContextLost?: () => void;
};

/** Sculpture parts, mapped to the service pillars. */
export type InstrumentPart = "security" | "engineering" | "experience" | "intelligence";

export type InstrumentScene = {
  start: () => void;
  stop: () => void;
  dispose: () => void;
  /** Light one part in signal lime and dim the rest; null clears it. */
  highlight: (part: InstrumentPart | null) => void;
};

// Node names in the GLB (see scripts/blender/build_sculpture.py) that belong to each part.
const PART_NODES: Record<InstrumentPart, RegExp> = {
  security: /^(RingOuter|PinOuter\d*|Inlay)/,
  engineering: /^(RingMid|PinMid\d*)/,
  experience: /^(RingInner|PinInner\d*)/,
  intelligence: /^(Core|CoreBand)/,
};

type Tinted = { material: MeshStandardMaterial; part: InstrumentPart; baseIntensity: number };

const REST = {
  mid: MathUtils.degToRad(32),
  inner: MathUtils.degToRad(38),
  core: MathUtils.degToRad(24),
};

// radians per second
const SPIN = { mid: 0.16, inner: -0.23, core: 0.7 };

// Blender (x, y, z-up) -> three (x, z, -y)
const fromBlender = (x: number, y: number, z: number) => new Vector3(x, z, -y);

function buildEnvironment(): Scene {
  const env = new Scene();

  // vertical gradient dome: near-black below the horizon, soft overhead glow above
  const dome = new SphereGeometry(40, 48, 24);
  const colors: number[] = [];
  const position = dome.getAttribute("position");
  const c = new Color();
  for (let i = 0; i < position.count; i++) {
    const t = MathUtils.clamp((position.getY(i) / 40 + 1) / 2, 0, 1);
    const k = MathUtils.smoothstep(t, 0.42, 1.0);
    c.setRGB(0.002 + 1.6 * k, 0.002 + 1.65 * k, 0.003 + 1.75 * k);
    colors.push(c.r, c.g, c.b);
  }
  dome.setAttribute("color", new Float32BufferAttribute(colors, 3));
  env.add(new Mesh(dome, new MeshBasicMaterial({ vertexColors: true, side: BackSide, toneMapped: false })));

  const panel = (
    at: [number, number, number],
    size: [number, number],
    rgb: [number, number, number],
    strength: number,
  ) => {
    const mesh = new Mesh(
      new PlaneGeometry(size[0], size[1]),
      new MeshBasicMaterial({
        color: new Color(rgb[0] * strength, rgb[1] * strength, rgb[2] * strength),
        side: DoubleSide,
        toneMapped: false,
      }),
    );
    mesh.position.copy(fromBlender(...at));
    mesh.lookAt(0, 0, 0);
    env.add(mesh);
  };

  // same studio as scripts/blender/build_sculpture.py
  panel([-4.6, -3.6, 4.2], [4.0, 4.6], [1, 0.98, 0.94], 9);
  panel([0, -9, 1.2], [9, 4], [0.9, 0.92, 0.96], 1.1);
  panel([5.2, -1.6, 0.6], [0.5, 6.5], [0.95, 0.97, 1], 26);
  panel([-5.4, 1.2, 0.2], [0.35, 5], [0.9, 0.94, 1], 12);
  panel([0.4, -1.6, 6.4], [4, 0.5], [1, 1, 1], 14);
  panel([3.4, 4.2, -1.0], [0.3, 3], [0.722, 0.953, 0.42], 5);

  return env;
}

/** Give the main thread back to the browser between heavy startup stages. */
const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

export async function createInstrumentScene(options: InstrumentSceneOptions): Promise<InstrumentScene> {
  const { canvas, modelUrl, pointerTilt, maxPixelRatio, onAngles, onContextLost } = options;

  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = AgXToneMapping;
  renderer.toneMappingExposure = 1;

  const scene = new Scene();
  await yieldToMain();
  const pmrem = new PMREMGenerator(renderer);
  const envScene = buildEnvironment();
  // 128px cube faces are plenty for blurred studio reflections and keep startup cheap
  const envTarget = pmrem.fromScene(envScene, 0.02, 0.1, 100, { size: 128 });
  scene.environment = envTarget.texture;
  envScene.traverse((o) => {
    if (o instanceof Mesh) {
      o.geometry.dispose();
      (o.material as MeshBasicMaterial).dispose();
    }
  });
  pmrem.dispose();

  await yieldToMain();
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  const gltf = await loader.loadAsync(modelUrl);

  const root = new Group();
  root.add(gltf.scene);
  scene.add(root);

  // Own each material so a highlight on one part never bleeds into another, then index them by part.
  const tinted: Tinted[] = [];
  gltf.scene.traverse((o) => {
    if (!(o instanceof Mesh)) return;
    const part = (Object.keys(PART_NODES) as InstrumentPart[]).find((k) => PART_NODES[k].test(o.name));
    if (!part) return;
    const material = (o.material as MeshStandardMaterial).clone();
    o.material = material;
    tinted.push({ material, part, baseIntensity: material.envMapIntensity });
  });
  const lime = new Color(0xb8f36b);
  let active: InstrumentPart | null = null;
  const level = new Map<MeshStandardMaterial, { glow: number; env: number }>();

  const find = (name: string): Object3D => {
    const node = gltf.scene.getObjectByName(name);
    if (!node) throw new Error(`Missing node ${name} in ${modelUrl}`);
    return node;
  };
  const mid = find("RingMid");
  const inner = find("RingInner");
  const core = find("Core");

  const angles = { ...REST };
  const apply = () => {
    mid.rotation.y = angles.mid; // Blender Z -> three Y
    inner.rotation.z = angles.inner; // Blender -Y -> three +Z
    core.rotation.x = angles.core;
  };
  apply();

  const camera = new PerspectiveCamera(28, 1, 0.1, 50);
  const BASE_DISTANCE = Math.hypot(6.4, 1.8);

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxPixelRatio));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // keep the full width in frame when the container is narrower than it is tall
    const fit = Math.max(1, 1 / camera.aspect);
    camera.position.set(0, 1.8, 6.4).setLength(BASE_DISTANCE * fit);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  };
  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  const pointer = { x: 0, y: 0 };
  const onPointerMove = (event: PointerEvent) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
  };
  if (pointerTilt) window.addEventListener("pointermove", onPointerMove, { passive: true });

  const handleContextLost = (event: Event) => {
    event.preventDefault();
    stop();
    onContextLost?.();
  };
  canvas.addEventListener("webglcontextlost", handleContextLost);

  let frame = 0;
  let last = 0;
  let lastReport = 0;

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    angles.mid += SPIN.mid * dt;
    angles.inner += SPIN.inner * dt;
    angles.core += SPIN.core * dt;
    apply();

    for (const { material, part, baseIntensity } of tinted) {
      const on = active === part;
      const targetGlow = on ? 0.18 : 0;
      const targetEnv = active && !on ? baseIntensity * 0.45 : baseIntensity;
      const cur = level.get(material) ?? { glow: 0, env: baseIntensity };
      cur.glow = MathUtils.damp(cur.glow, targetGlow, 8, dt);
      cur.env = MathUtils.damp(cur.env, targetEnv, 8, dt);
      level.set(material, cur);
      material.emissive.copy(lime);
      material.emissiveIntensity = cur.glow;
      material.envMapIntensity = cur.env;
    }

    root.rotation.y = MathUtils.damp(root.rotation.y, pointer.x * 0.2, 4, dt);
    root.rotation.x = MathUtils.damp(root.rotation.x, pointer.y * 0.1, 4, dt);

    renderer.render(scene, camera);

    if (onAngles && now - lastReport > 120) {
      lastReport = now;
      onAngles({ mid: angles.mid, inner: angles.inner, core: angles.core });
    }
  };

  const start = () => {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };

  const dispose = () => {
    stop();
    observer.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("webglcontextlost", handleContextLost);
    gltf.scene.traverse((o) => {
      if (o instanceof Mesh) {
        o.geometry.dispose();
        const materials = Array.isArray(o.material) ? o.material : [o.material];
        materials.forEach((m) => m.dispose());
      }
    });
    envTarget.dispose();
    renderer.dispose();
  };

  // compile shaders off the main thread, then draw a first frame so the poster can cross-fade into it
  await renderer.compileAsync(scene, camera);
  renderer.render(scene, camera);

  const highlight = (part: InstrumentPart | null) => {
    active = part;
  };

  return { start, stop, dispose, highlight };
}
