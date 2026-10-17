"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Color, LinearFilter, ShaderMaterial, SRGBColorSpace, Texture, type Mesh } from "three";
import { scroll } from "@/lib/motion/scroll";
import type { GlEntry } from "@/lib/gl/registry";
import { imageFragment, planeVertex } from "./shaders";
import { syncToElement } from "./sync";

/**
 * DOM-synced image plane: ripple + zoom on hover, wave bend with scroll
 * velocity, wavy reveal. Uses the already-loaded <img> as its texture source.
 */
export function ImagePlane({ entry }: { entry: GlEntry }) {
  const mesh = useRef<Mesh>(null);
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);

  const { material, texture } = useMemo(() => {
    const texture = new Texture();
    texture.colorSpace = SRGBColorSpace;
    texture.minFilter = LinearFilter;
    texture.generateMipmaps = false;
    const material = new ShaderMaterial({
      vertexShader: planeVertex,
      fragmentShader: imageFragment,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTexture: { value: texture },
        uSize: { value: [1, 1] },
        uImage: { value: [1, 1] },
        uMouse: { value: [0.5, 0.5] },
        uHover: { value: 0 },
        uReveal: { value: entry.state.reveal },
        uRadius: { value: entry.radius },
        uTime: { value: 0 },
        uVelocity: { value: 0 },
        uTint: { value: new Color(entry.tint ?? "#ffffff") },
        uUseTint: { value: entry.tint ? 1 : 0 },
      },
    });
    return { material, texture };
  }, [entry]);

  useEffect(() => {
    const img = entry.img;
    if (!img) return;
    let cancelled = false;
    const upload = () => {
      if (cancelled || !img.naturalWidth) return;
      texture.image = img;
      texture.needsUpdate = true;
      material.uniforms.uImage.value = [img.naturalWidth, img.naturalHeight];
      // Upload now so the swap from the DOM image never flashes.
      gl.initTexture(texture);
      entry.onReady?.();
    };
    if (img.complete) upload();
    img.addEventListener("load", upload);
    return () => {
      cancelled = true;
      img.removeEventListener("load", upload);
      texture.dispose();
      material.dispose();
    };
  }, [entry, gl, material, texture]);

  const hover = useRef(0);
  const mouse = useRef<[number, number]>([0.5, 0.5]);
  const reveal = useRef(entry.state.reveal);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const { rect, visible } = syncToElement(mesh.current, entry.el, size);
    if (!visible || !texture.image) {
      mesh.current.visible = false;
      return;
    }
    const k = 1 - Math.pow(0.0005, delta);
    const u = material.uniforms;
    hover.current += (entry.state.hover - hover.current) * k * 0.5;
    mouse.current[0] += (entry.state.mouse[0] - mouse.current[0]) * k;
    mouse.current[1] += (entry.state.mouse[1] - mouse.current[1]) * k;
    reveal.current += (entry.state.reveal - reveal.current) * k * 0.35;
    u.uSize.value = [rect.width, rect.height];
    u.uHover.value = hover.current;
    u.uMouse.value = mouse.current;
    u.uReveal.value = reveal.current;
    u.uTime.value = state.clock.elapsedTime;
    u.uVelocity.value = Math.max(-0.05, Math.min(0.05, scroll.velocity * -0.0016));
  });

  return (
    <mesh ref={mesh} material={material} renderOrder={2}>
      <planeGeometry args={[1, 1, 24, 1]} />
    </mesh>
  );
}
