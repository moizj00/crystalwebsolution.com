'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { scrollState } from '../../lib/scrollState';
import { MARK_WINDOW } from '../../lib/journey';

// Shards scattered in space that assemble into a diamond brand mark
// across the MARK_WINDOW progress span.
const COUNT = 26;

export default function MarkAssembly({ position = [0, 0, 0] }) {
  const group = useRef();

  const shards = useMemo(() => {
    const rng = (seed) => {
      let s = seed;
      return () => {
        s = (s * 16807) % 2147483647;
        return (s - 1) / 2147483646;
      };
    };
    const rand = rng(1337);
    const arr = [];
    for (let i = 0; i < COUNT; i++) {
      // Target: ring of shards forming a diamond silhouette.
      const a = (i / COUNT) * Math.PI * 2;
      const r = 1.6 + Math.sin(a * 2) * 0.5;
      const target = new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r * 1.25, 0);
      const scatter = new THREE.Vector3(
        (rand() - 0.5) * 14,
        (rand() - 0.5) * 10,
        (rand() - 0.5) * 12
      );
      arr.push({
        target,
        scatter,
        rotSpeed: 0.3 + rand() * 0.8,
        scale: 0.12 + rand() * 0.2,
      });
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    if (!group.current) return;
    const [a, b] = MARK_WINDOW;
    const raw = (scrollState.progress - a) / (b - a);
    const k = THREE.MathUtils.clamp(raw, 0, 1);
    const ease = k * k * (3 - 2 * k);

    for (let i = 0; i < group.current.children.length; i++) {
      const m = group.current.children[i];
      const s = shards[i];
      m.position.lerpVectors(s.scatter, s.target, ease);
      m.rotation.x += dt * s.rotSpeed * (1 - ease * 0.85);
      m.rotation.y += dt * s.rotSpeed;
      m.material.emissiveIntensity = 0.15 + ease * 1.6;
    }
    group.current.rotation.z = (1 - ease) * 0.6;
  });

  return (
    <group ref={group} position={position}>
      {shards.map((s, i) => (
        <mesh key={i} scale={s.scale}>
          <tetrahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#c084fc"
            emissive="#c084fc"
            emissiveIntensity={0.15}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}
