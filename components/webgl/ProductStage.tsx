"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, PerspectiveCamera, RenderTexture } from "@react-three/drei";
import { ExtrudeGeometry, MathUtils, Shape, Vector3, type Group, type Mesh } from "three";
import { pointer, type GlEntry } from "@/lib/gl/registry";
import { syncToElement } from "./sync";

const LENGTH = 3.4;

/** One tapered tweezer arm; the last fifth curves into a fine tip. */
function createArm(bend: number) {
  const shape = new Shape();
  shape.moveTo(0, -0.17);
  shape.bezierCurveTo(LENGTH * 0.45, -0.15, LENGTH * 0.78, -0.09, LENGTH, -0.022);
  shape.lineTo(LENGTH, 0.022);
  shape.bezierCurveTo(LENGTH * 0.78, 0.09, LENGTH * 0.45, 0.15, 0, 0.17);
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.014,
    bevelSegments: 3,
    curveSegments: 40,
    steps: 1,
  });
  geometry.translate(0, 0, -0.03);
  const pos = geometry.attributes.position;
  const v = new Vector3();
  const pivot = LENGTH * 0.76;
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
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

function Tweezers({ entry }: { entry: GlEntry }) {
  const group = useRef<Group>(null);
  const arm = useMemo(() => createArm(0.85), []);
  const tilt = useRef({ x: 0, y: 0 });

  useEffect(() => () => arm.dispose(), [arm]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const rect = entry.el.getBoundingClientRect();
    const nx = pointer.active ? (pointer.x - (rect.left + rect.width / 2)) / rect.width : 0;
    const ny = pointer.active ? (pointer.y - (rect.top + rect.height / 2)) / rect.height : 0;
    const k = 1 - Math.pow(0.01, delta);
    tilt.current.x += (MathUtils.clamp(ny, -0.6, 0.6) * 0.35 - tilt.current.x) * k;
    tilt.current.y += (MathUtils.clamp(nx, -0.6, 0.6) * 0.5 - tilt.current.y) * k;
    // Scroll drives the main rotation; idle float keeps it alive at rest.
    g.rotation.y = entry.state.progress * Math.PI * 1.6 - 0.6 + tilt.current.y + Math.sin(t * 0.4) * 0.08;
    g.rotation.x = 0.35 + tilt.current.x + Math.sin(t * 0.6) * 0.04;
    g.rotation.z = -0.55;
    g.position.y = Math.sin(t * 0.8) * 0.06;
  });

  return (
    <group ref={group}>
      <mesh geometry={arm} position={[0, 0, 0.13]} rotation={[0, 0.03, 0]}>
        <meshPhysicalMaterial color="#c4917a" metalness={1} roughness={0.26} clearcoat={0.4} clearcoatRoughness={0.3} />
      </mesh>
      <mesh geometry={arm} position={[0, 0, -0.13]} rotation={[0, -0.03, 0]}>
        <meshPhysicalMaterial color="#c4917a" metalness={1} roughness={0.26} clearcoat={0.4} clearcoatRoughness={0.3} />
      </mesh>
      <mesh position={[-LENGTH / 2 - 0.05, 0, 0]}>
        <boxGeometry args={[0.32, 0.36, 0.34]} />
        <meshPhysicalMaterial color="#b9826a" metalness={1} roughness={0.32} />
      </mesh>
    </group>
  );
}

/** 3D product stage rendered into a texture on a DOM-synced plane. */
export function ProductStage({ entry }: { entry: GlEntry }) {
  const mesh = useRef<Mesh>(null);
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  const [box, setBox] = useState<{ w: number; h: number; on: boolean }>({ w: 640, h: 640, on: false });

  useFrame(() => {
    if (!mesh.current) return;
    const { rect, visible } = syncToElement(mesh.current, entry.el, size, 150);
    const w = Math.min(1400, Math.round(rect.width * dpr));
    const h = Math.min(1400, Math.round(rect.height * dpr));
    if (visible !== box.on || (visible && (Math.abs(w - box.w) > 48 || Math.abs(h - box.h) > 48))) {
      setBox({ w: Math.max(64, w), h: Math.max(64, h), on: visible });
      if (visible) requestAnimationFrame(() => entry.onReady?.());
    }
  });

  return (
    <mesh ref={mesh} renderOrder={3}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial transparent toneMapped={false} depthWrite={false}>
        {box.on && (
          <RenderTexture attach="map" width={box.w} height={box.h} samples={4}>
            <PerspectiveCamera makeDefault position={[0, 0, 6.2]} fov={32} aspect={box.w / box.h} />
            <ambientLight intensity={0.35} />
            <directionalLight position={[3, 4, 5]} intensity={1.4} />
            <Environment resolution={128} frames={1}>
              <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[9, 2.4, 1]} />
              <Lightformer form="rect" intensity={1.6} position={[-5, 0.5, 2]} rotation-y={Math.PI / 2} scale={[3, 7, 1]} />
              <Lightformer form="circle" intensity={1.4} color="#d9b8ae" position={[4, -1.5, 3]} scale={3} />
              <Lightformer form="rect" intensity={0.8} color="#97a9a8" position={[0, -4, -2]} scale={[9, 2, 1]} />
            </Environment>
            <Tweezers entry={entry} />
          </RenderTexture>
        )}
      </meshBasicMaterial>
    </mesh>
  );
}
