"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Part } from "@/config/site";
import type { InstrumentAngles, InstrumentScene } from "@/lib/instrument-scene";
import { HIGHLIGHT_EVENT } from "./PillarRail";

const MODEL_URL = "/models/instrument.glb";

const format = (radians: number) => {
  const degrees = (((radians * 180) / Math.PI) % 360 + 360) % 360;
  return degrees.toFixed(1).padStart(5, "0");
};

// Where each pillar sits on the sculpture, as a percentage of the figure.
const MARKERS: { part: Part; label: string; x: number; y: number }[] = [
  { part: "engineering", label: "01", x: 50, y: 25.5 },
  { part: "experience", label: "02", x: 36, y: 60 },
  { part: "intelligence", label: "03", x: 60, y: 44 },
  { part: "security", label: "04", x: 27, y: 74 },
];

const REST_READOUT = "mid 032.0°  inner 038.0°  core 024.0°";

/**
 * The hero sculpture. The Blender poster is server-rendered so the first paint is
 * never empty; the live three.js scene loads after the page is interactive and
 * cross-fades in. Reduced-motion users and browsers without WebGL keep the poster.
 */
export function HeroFigure() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<Part | null>(null);
  const sceneRef = useRef<InstrumentScene | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const figure = figureRef.current;
    if (!canvas || !figure) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Respect data-saver: the static render is already a complete hero.
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;

    const probe = document.createElement("canvas");
    if (!probe.getContext("webgl2") && !probe.getContext("webgl")) return;

    let cancelled = false;
    let disposeScene: (() => void) | undefined;
    let observer: IntersectionObserver | undefined;
    let onVisibility: (() => void) | undefined;

    const boot = async () => {
      try {
        const { createInstrumentScene } = await import("@/lib/instrument-scene");
        const coarse = window.matchMedia("(pointer: coarse)").matches;
        const small = window.matchMedia("(max-width: 767px)").matches;

        const scene = await createInstrumentScene({
          canvas,
          modelUrl: MODEL_URL,
          pointerTilt: !coarse,
          maxPixelRatio: small ? 1.5 : 2,
          onAngles: (a: InstrumentAngles) => {
            if (readoutRef.current) {
              readoutRef.current.textContent = `mid ${format(a.mid)}°  inner ${format(a.inner)}°  core ${format(a.core)}°`;
            }
          },
          onContextLost: () => setReady(false),
        });

        if (cancelled) {
          scene.dispose();
          return;
        }
        sceneRef.current = scene;
        disposeScene = scene.dispose;
        setReady(true);

        // Only animate while the figure is on screen and the tab is visible.
        let visible = true;
        const sync = () => (visible && !document.hidden ? scene.start() : scene.stop());
        observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          sync();
        });
        observer.observe(figure);
        onVisibility = sync;
        document.addEventListener("visibilitychange", onVisibility);
        sync();
      } catch (error) {
        // The poster stays in place; nothing else depends on WebGL.
        console.warn("3D viewer unavailable, using static render.", error);
      }
    };

    // Start the 3D bundle only after the page has loaded and the browser is idle, so it never
    // competes with first paint or hydration. The poster is visually identical in the meantime.
    const hasIdle = "requestIdleCallback" in window;
    let idle = 0;
    const schedule = () => {
      idle = hasIdle
        ? window.requestIdleCallback(() => void boot(), { timeout: 2500 })
        : window.setTimeout(() => void boot(), 300);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      if (idle) {
        if (hasIdle) window.cancelIdleCallback(idle);
        else window.clearTimeout(idle);
      }
      observer?.disconnect();
      if (onVisibility) document.removeEventListener("visibilitychange", onVisibility);
      disposeScene?.();
    };
  }, []);

  useEffect(() => {
    const onHighlight = (event: Event) => {
      const part = (event as CustomEvent<Part | null>).detail;
      setActive(part);
      sceneRef.current?.highlight(part);
    };
    window.addEventListener(HIGHLIGHT_EVENT, onHighlight);
    return () => window.removeEventListener(HIGHLIGHT_EVENT, onHighlight);
  }, []);

  return (
    <figure ref={figureRef} className="anim-figure relative m-0 aspect-square w-full select-none">
      <Image
        src="/images/instrument-poster.webp"
        alt="A machined three-axis gimbal sculpture: a bone-coloured outer ring holding two nested graphite and steel rings around a spindle with a lime band."
        width={1200}
        height={1200}
        priority
        fetchPriority="high"
        sizes="(min-width: 1024px) 54vw, 100vw"
        data-ready={ready}
        className="absolute inset-0 h-full w-full object-contain transition-opacity duration-700 data-[ready=true]:opacity-0"
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        data-ready={ready}
        className="absolute inset-0 h-full w-full touch-pan-y opacity-0 transition-opacity duration-700 data-[ready=true]:opacity-100"
      />

      {/* part markers: numbers match the pillar rail below the hero */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 inset-x-[9%] text-mute lg:inset-x-0">
        {MARKERS.map((m) => (
          <span
            key={m.part}
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
            data-active={active === m.part}
            className="t-mono absolute hidden size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-fg/50 bg-obsidian/70 text-[0.62rem] text-fg transition-colors data-[active=true]:border-lime data-[active=true]:bg-lime data-[active=true]:text-obsidian sm:flex"
          >
            {m.label}
          </span>
        ))}
        <p className="t-mono absolute bottom-[4%] left-0 lg:left-[3%]">Fig. 01 — Three-axis gimbal</p>
        <p className="t-mono absolute right-0 bottom-[4%] hidden text-right sm:block lg:right-[3%]">
          <span ref={readoutRef}>{REST_READOUT}</span>
        </p>
      </div>
    </figure>
  );
}
