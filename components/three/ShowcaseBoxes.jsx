'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PROJECTS } from '../../lib/projects';

// Glass slabs — one per project — drifting around the showcase depth.
const LAYOUT = [
  [-2.6, 0.9, -1.2],
  [2.4, -0.5, 0.6],
  [-1.2, -1.3, 1.4],
  [1.6, 1.4, -0.8],
  [0.2, 0.1, -2.2],
];

export default function ShowcaseBoxes({ position = [0, 0, 0] }) {
  const group = useRef();

  const colors = useMemo(
    () => PROJECTS.map((p) => new THREE.Color(p.palette[0])),
    []
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    group.current.rotation.y += dt * 0.05;
    for (let i = 0; i < group.current.children.length; i++) {
      const m = group.current.children[i];
      m.position.y = LAYOUT[i][1] + Math.sin(t * 0.6 + i * 1.7) * 0.25;
      m.rotation.x += dt * 0.1 * ((i % 2) ? 1 : -1);
      m.rotation.y += dt * 0.14;
    }
  });

  return (
    <group ref={group} position={position}>
      {LAYOUT.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[1.5, 1.0, 0.12]} />
          <meshPhysicalMaterial
            transmission={0.85}
            thickness={0.4}
            roughness={0.15}
            ior={1.4}
            color={colors[i % colors.length]}
            emissive={colors[i % colors.length]}
            emissiveIntensity={0.12}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}
