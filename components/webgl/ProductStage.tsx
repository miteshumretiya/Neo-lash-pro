"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, RenderTexture } from "@react-three/drei";
import { ExtrudeGeometry, MathUtils, PMREMGenerator, Shape, Vector3, type Group, type Mesh } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { pointer, type GlEntry } from "@/lib/gl/registry";
import { syncToElement } from "./sync";

const LENGTH = 3.4;

const smooth = (a: number, b: number, x: number) => {
  const t = MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * One tapered tweezer arm; the last fifth curves into a fine tip. `side`
 * bows the arm away from its twin: joined at the back, widest at three
 * quarters, closing again toward the tips.
 */
function createArm(bend: number, side: 1 | -1) {
  const shape = new Shape();
  shape.moveTo(0, -0.14);
  shape.bezierCurveTo(LENGTH * 0.4, -0.15, LENGTH * 0.72, -0.08, LENGTH, -0.016);
  shape.lineTo(LENGTH, 0.016);
  shape.bezierCurveTo(LENGTH * 0.72, 0.08, LENGTH * 0.4, 0.15, 0, 0.14);
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, {
    depth: 0.03,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.01,
    bevelSegments: 3,
    curveSegments: 40,
    steps: 1,
  });
  geometry.translate(0, 0, -0.015);
  const pos = geometry.attributes.position;
  const v = new Vector3();
  const pivot = LENGTH * 0.76;
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const t = v.x / LENGTH;
    v.z += side * (0.028 + 0.2 * smooth(0, 0.75, t) * (1 - 0.4 * smooth(0.75, 1, t)));
    pos.setZ(i, v.z);
    if (v.x > pivot) {
      const t = (v.x - pivot) / (LENGTH - pivot);
      const angle = -bend * t * t;
      const dx = v.x - pivot;
      v.x = pivot + dx * Math.cos(angle) - v.y * Math.sin(angle);
      v.y = dx * Math.sin(angle) + v.y * Math.cos(angle);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
  }
  geometry.computeVertexNormals();
  geometry.translate(-LENGTH / 2, 0, 0);
  return geometry;
}

/** Procedural studio reflections (no HDR download needed). */
function StudioEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.035).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Tweezers({ entry }: { entry: GlEntry }) {
  const group = useRef<Group>(null);
  const arms = useMemo(() => [createArm(0.9, 1), createArm(0.9, -1)], []);
  const tilt = useRef({ x: 0, y: 0 });

  useEffect(() => () => arms.forEach((a) => a.dispose()), [arms]);

  const roll = useRef<Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || !roll.current) return;
    const t = state.clock.elapsedTime;
    const rect = entry.el.getBoundingClientRect();
    const nx = pointer.active ? (pointer.x - (rect.left + rect.width / 2)) / rect.width : 0;
    const ny = pointer.active ? (pointer.y - (rect.top + rect.height / 2)) / rect.height : 0;
    const k = 1 - Math.pow(0.01, delta);
    tilt.current.x += (MathUtils.clamp(ny, -0.6, 0.6) * 0.35 - tilt.current.x) * k;
    tilt.current.y += (MathUtils.clamp(nx, -0.6, 0.6) * 0.5 - tilt.current.y) * k;
    // Scroll rolls the tweezers around their length; the pointer tilts them.
    roll.current.rotation.x = 1.1 + entry.state.progress * Math.PI * 2 + Math.sin(t * 0.5) * 0.12;
    g.rotation.y = -0.35 + tilt.current.y;
    g.rotation.x = tilt.current.x;
    g.position.y = Math.sin(t * 0.8) * 0.05;
  });

  const metal = {
    color: "#c99683",
    metalness: 0.92,
    roughness: 0.26,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2,
    anisotropy: 0.7,
  } as const;

  return (
    <group ref={group}>
      <group rotation={[0, 0, 0.62]}>
        <group ref={roll}>
          {arms.map((geometry, i) => (
            <mesh key={i} geometry={geometry}>
              <meshPhysicalMaterial {...metal} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

/** 3D product stage rendered into a texture on a DOM-synced plane. */
export function ProductStage({ entry }: { entry: GlEntry }) {
  const mesh = useRef<Mesh>(null);
  const size = useThree((s) => s.size);
  // Size in CSS pixels; RenderTexture applies the device pixel ratio itself.
  const [box, setBox] = useState<{ w: number; h: number; on: boolean }>({ w: 512, h: 512, on: false });

  useFrame(() => {
    if (!mesh.current) return;
    const { rect, visible } = syncToElement(mesh.current, entry.el, size, 150);
    const w = Math.min(900, Math.round(rect.width));
    const h = Math.min(900, Math.round(rect.height));
    if (visible !== box.on || (visible && (Math.abs(w - box.w) > 32 || Math.abs(h - box.h) > 32))) {
      setBox({ w: Math.max(64, w), h: Math.max(64, h), on: visible });
      if (visible) requestAnimationFrame(() => entry.onReady?.());
    }
  });

  // The texture stays attached (so the material compiles with a map); it only
  // re-renders while the stage is on screen.
  return (
    <mesh ref={mesh} renderOrder={3}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial transparent toneMapped={false} depthWrite={false}>
        <RenderTexture attach="map" width={box.w} height={box.h} samples={4} frames={box.on ? Infinity : 0}>
          <PerspectiveCamera makeDefault manual position={[0, 0, 6.6]} fov={32} aspect={box.w / box.h} />
          <StudioEnvironment />
          <ambientLight intensity={0.25} />
          <directionalLight position={[3, 5, 4]} intensity={1.1} />
          <directionalLight position={[-4, -2, 3]} intensity={0.4} color="#d9b8ae" />
          <Tweezers entry={entry} />
        </RenderTexture>
      </meshBasicMaterial>
    </mesh>
  );
}
