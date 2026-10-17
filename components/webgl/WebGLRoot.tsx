"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { advance, Canvas } from "@react-three/fiber";
import { gsap } from "@/lib/motion/gsap";
import { glRegistry, pointer } from "@/lib/gl/registry";
import { useExperience } from "@/lib/store/experience";
import { SilkPlane } from "./SilkPlane";
import { ImagePlane } from "./ImagePlane";
import { LashParticles } from "./LashParticles";
import { ProductStage } from "./ProductStage";

type Capability = { ok: boolean; lowPower: boolean };

function detectCapability(): Capability {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (reduced || nav.connection?.saveData) return { ok: false, lowPower: true };
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return { ok: false, lowPower: true };
  } catch {
    return { ok: false, lowPower: true };
  }
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  if (cores <= 2 || memory <= 2) return { ok: false, lowPower: true };
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return { ok: true, lowPower: coarse || cores <= 4 || memory <= 4 };
}

function Scene({ lowPower }: { lowPower: boolean }) {
  const entries = useSyncExternalStore(glRegistry.subscribe, glRegistry.snapshot, glRegistry.snapshot);
  return (
    <>
      {entries.map((entry) => {
        switch (entry.kind) {
          case "silk":
            return <SilkPlane key={entry.id} entry={entry} lowPower={lowPower} />;
          case "particles":
            return <LashParticles key={entry.id} entry={entry} lowPower={lowPower} />;
          case "image":
            return <ImagePlane key={entry.id} entry={entry} />;
          case "stage":
            return <ProductStage key={entry.id} entry={entry} />;
        }
      })}
    </>
  );
}

/**
 * The single persistent canvas behind the DOM. It renders from GSAP's ticker
 * right after Lenis updates the scroll position, so planes never lag behind
 * their DOM elements, and it stops rendering when nothing GL is on screen.
 */
export default function WebGLRoot() {
  // This module only ever runs in the browser (loaded with ssr: false).
  const [capability] = useState<Capability>(detectCapability);
  const loaded = useExperience((s) => s.loaded);
  const setWebgl = useExperience((s) => s.setWebgl);

  useEffect(() => {
    const mode = !capability.ok ? "off" : capability.lowPower ? "lite" : "on";
    setWebgl(mode);
    document.documentElement.dataset.webgl = mode;
  }, [capability, setWebgl]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const leave = () => {
      pointer.active = false;
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  useEffect(() => {
    if (!capability.ok) return;
    let idleFrames = 0;
    const render = () => {
      if (useExperience.getState().menuOpen) return;
      if (glRegistry.anyVisible()) {
        idleFrames = 2;
      } else if (idleFrames > 0) {
        // Two last frames clear whatever was on screen.
        idleFrames -= 1;
      } else {
        return;
      }
      advance(performance.now());
    };
    gsap.ticker.add(render);
    return () => gsap.ticker.remove(render);
  }, [capability]);

  if (!capability.ok || !loaded) return null;

  return (
    <Canvas
      orthographic
      frameloop="never"
      dpr={[1, capability.lowPower ? 1.5 : 2]}
      camera={{ zoom: 1, position: [0, 0, 500], near: 0.1, far: 2000 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance", stencil: false }}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
      aria-hidden="true"
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <Scene lowPower={capability.lowPower} />
    </Canvas>
  );
}
