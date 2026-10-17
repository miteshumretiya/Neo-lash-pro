"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, NormalBlending, ShaderMaterial, type Points } from "three";
import { pointer, type GlEntry } from "@/lib/gl/registry";
import { particlesFragment, particlesVertex } from "./shaders";
import { cssColor } from "./sync";

type LashCurve = { positions: Float32Array; seeds: Float32Array; order: Float32Array };

const bezier = (t: number, a: number, b: number, c: number, d: number) =>
  (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * d;

/**
 * Builds a stylised eyelid with a fan of curling lashes, in a unit box
 * (x: -0.5..0.5, y: -0.25..0.25). Points are ordered root → tip so the
 * reveal draws each lash outward.
 */
function buildLashCurve(count: number): LashCurve {
  const positions: number[] = [];
  const seeds: number[] = [];
  const order: number[] = [];
  const lid = (t: number): [number, number] => [
    bezier(t, -0.5, -0.22, 0.2, 0.5),
    bezier(t, -0.02, 0.17, 0.2, 0.0),
  ];
  const lidCount = Math.floor(count * 0.22);
  for (let i = 0; i < lidCount; i++) {
    const t = Math.random();
    const [x, y] = lid(t);
    positions.push(x + (Math.random() - 0.5) * 0.006, y + (Math.random() - 0.5) * 0.006, 0);
    seeds.push(Math.random());
    order.push(t * 0.35);
  }
  const lashes = 46;
  const perLash = Math.floor((count - lidCount) / lashes);
  for (let l = 0; l < lashes; l++) {
    const t = 0.04 + (l / (lashes - 1)) * 0.92;
    const [x0, y0] = lid(t);
    const centre = Math.sin(t * Math.PI);
    const length = 0.06 + centre * 0.13 + t * 0.03 + Math.random() * 0.02;
    // Lashes lean outward toward the outer corner, curling upward at the tip.
    const lean = (t - 0.38) * 1.4;
    for (let i = 0; i < perLash; i++) {
      const s = Math.random();
      const curl = s * s * 0.55;
      const angle = Math.PI / 2 + lean * 0.9 - curl * Math.sign(lean || 1) * 0.6;
      positions.push(
        x0 + Math.cos(angle) * length * s - lean * 0.03 * s * s + (Math.random() - 0.5) * 0.003,
        y0 + Math.sin(angle) * length * s + (Math.random() - 0.5) * 0.003,
        0,
      );
      seeds.push(Math.random());
      order.push(0.3 + t * 0.45 + s * 0.25);
    }
  }
  return {
    positions: new Float32Array(positions),
    seeds: new Float32Array(seeds),
    order: new Float32Array(order),
  };
}

/** Particles tracing a lash line; they scatter from the cursor and re-form. */
export function LashParticles({ entry, lowPower }: { entry: GlEntry; lowPower: boolean }) {
  const points = useRef<Points>(null);
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const influence = useRef(0);
  const mouse = useRef<[number, number]>([0, 0]);

  const { geometry, material } = useMemo(() => {
    const curve = buildLashCurve(lowPower ? 1400 : 3200);
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(curve.positions, 3));
    geometry.setAttribute("aSeed", new BufferAttribute(curve.seeds, 1));
    geometry.setAttribute("aOrder", new BufferAttribute(curve.order, 1));
    const dark = document.documentElement.dataset.theme === "dark";
    const material = new ShaderMaterial({
      vertexShader: particlesVertex,
      fragmentShader: particlesFragment,
      transparent: true,
      depthWrite: false,
      blending: dark ? AdditiveBlending : NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: [99999, 99999] },
        uInfluence: { value: 0 },
        uSize: { value: lowPower ? 2.2 : 2.6 },
        uPixelRatio: { value: 1 },
        uReveal: { value: 0 },
        uScale: { value: 1 },
        uColor: { value: new Color(cssColor("--ink", "#141414")) },
      },
    });
    return { geometry, material };
  }, [lowPower]);

  useEffect(() => {
    const mo = new MutationObserver(() => {
      const dark = document.documentElement.dataset.theme === "dark";
      material.uniforms.uColor.value.set(cssColor("--ink", "#141414"));
      material.blending = dark ? AdditiveBlending : NormalBlending;
      material.needsUpdate = true;
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      mo.disconnect();
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state, delta) => {
    const p = points.current;
    if (!p) return;
    const rect = entry.el.getBoundingClientRect();
    const visible = rect.width > 0 && rect.bottom > -100 && rect.top < size.height + 100;
    p.visible = visible;
    if (!visible) return;
    // Centre on the element; the shader scales the unit curve to its width.
    const cx = rect.left + rect.width / 2 - size.width / 2;
    const cy = size.height / 2 - (rect.top + rect.height / 2);
    p.position.set(cx, cy, 0);

    const u = material.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uPixelRatio.value = dpr;
    u.uScale.value = rect.width;
    // Pointer relative to the element centre, in pixels.
    const k = 1 - Math.pow(0.002, delta);
    const near =
      pointer.active &&
      pointer.x > rect.left - 150 &&
      pointer.x < rect.right + 150 &&
      pointer.y > rect.top - 150 &&
      pointer.y < rect.bottom + 150;
    influence.current += ((near ? 1 : 0) - influence.current) * k * 0.5;
    if (near) {
      mouse.current[0] += (pointer.x - (rect.left + rect.width / 2) - mouse.current[0]) * k;
      mouse.current[1] += (rect.top + rect.height / 2 - pointer.y - mouse.current[1]) * k;
    }
    u.uMouse.value = mouse.current;
    u.uInfluence.value = influence.current;
    u.uReveal.value += (entry.state.reveal * 1.1 - u.uReveal.value) * k * 0.12;
  });

  return <points ref={points} geometry={geometry} material={material} renderOrder={1} frustumCulled={false} />;
}
