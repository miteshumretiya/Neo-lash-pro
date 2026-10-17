"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, ShaderMaterial, type Mesh } from "three";
import { pointer, type GlEntry } from "@/lib/gl/registry";
import { planeVertex, silkFragment } from "./shaders";
import { cssColor, syncToElement } from "./sync";

const palette = () => ({
  base: cssColor("--canvas", "#f5f1eb"),
  sage: cssColor("--sage", "#97a9a8"),
  blush: cssColor("--blush", "#d9b8ae"),
  sand: cssColor("--sand", "#e6ddd1"),
});

/** Flowing satin gradient filling the hero frame; reacts to pointer and scroll. */
export function SilkPlane({ entry, lowPower }: { entry: GlEntry; lowPower: boolean }) {
  const mesh = useRef<Mesh>(null);
  const size = useThree((s) => s.size);
  const hover = useRef(0);
  const mouse = useRef<[number, number]>([0.5, 0.5]);
  const announced = useRef(false);

  const material = useMemo(() => {
    const c = palette();
    return new ShaderMaterial({
      vertexShader: planeVertex,
      fragmentShader: silkFragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uVelocity: { value: 0 },
        uSize: { value: [1, 1] },
        uMouse: { value: [0.5, 0.5] },
        uHover: { value: 0 },
        uProgress: { value: 0 },
        uRadius: { value: entry.radius },
        uDetail: { value: lowPower ? 2 : 3 },
        uBase: { value: new Color(c.base) },
        uSage: { value: new Color(c.sage) },
        uBlush: { value: new Color(c.blush) },
        uSand: { value: new Color(c.sand) },
        uEnd: { value: new Color(c.base) },
      },
    });
  }, [entry.radius, lowPower]);

  // Follow theme changes.
  useEffect(() => {
    const apply = () => {
      const c = palette();
      material.uniforms.uBase.value.set(c.base);
      material.uniforms.uSage.value.set(c.sage);
      material.uniforms.uBlush.value.set(c.blush);
      material.uniforms.uSand.value.set(c.sand);
      material.uniforms.uEnd.value.set(c.base);
    };
    const mo = new MutationObserver(() => requestAnimationFrame(apply));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => {
      mo.disconnect();
      material.dispose();
    };
  }, [material]);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const { rect, visible } = syncToElement(mesh.current, entry.el, size, 50);
    if (!visible) return;
    const u = material.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uSize.value = [rect.width, rect.height];
    const inside =
      pointer.active &&
      pointer.x >= rect.left &&
      pointer.x <= rect.right &&
      pointer.y >= rect.top &&
      pointer.y <= rect.bottom;
    const k = 1 - Math.pow(0.001, delta);
    hover.current += ((inside ? 1 : 0) - hover.current) * k * 0.6;
    if (inside) {
      mouse.current[0] += ((pointer.x - rect.left) / rect.width - mouse.current[0]) * k;
      mouse.current[1] += (1 - (pointer.y - rect.top) / rect.height - mouse.current[1]) * k;
    }
    u.uHover.value = hover.current;
    u.uMouse.value = mouse.current;
    u.uProgress.value = entry.state.progress;
    if (!announced.current) {
      announced.current = true;
      // Let the DOM fallback fade out once the first frame is on screen.
      requestAnimationFrame(() => entry.onReady?.());
    }
  });

  return (
    <mesh ref={mesh} material={material} renderOrder={0}>
      <planeGeometry args={[1, 1, 1, 1]} />
    </mesh>
  );
}
