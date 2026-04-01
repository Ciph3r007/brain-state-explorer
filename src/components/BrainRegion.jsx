import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getStateKey } from '../data/regions';
import { useStore } from '../hooks/useStore';

const _color = new THREE.Color();
const _emissive = new THREE.Color();

/** Single brain region mesh — glows, pulses, responds to state + focus */
export default function BrainRegion({ id, data }) {
  const ref = useRef();
  const getEffectiveState = useStore(s => s.getEffectiveState);
  const setHoveredRegion = useStore(s => s.setHoveredRegion);
  const setFocusedRegion = useStore(s => s.setFocusedRegion);
  const focusedRegion = useStore(s => s.focusedRegion);

  const stateKey = getStateKey(id);
  const { pos, scale, color, deep } = data;
  const scl = scale || [0.12, 0.12, 0.12];
  const isFocused = focusedRegion === id;

  useFrame((clock, delta) => {
    if (!ref.current) return;
    const state = getEffectiveState();
    const activity = (state.regionActivity[stateKey] ?? 50) / 100;
    const time = clock.clock.elapsedTime;

    // ── Real-time oscillation: breathing + activity-driven pulse ──
    const breathing = Math.sin(time * 0.8) * 0.015;  // slow baseline "breathing"
    const actPulse = Math.sin(time * (1.5 + activity * 3)) * 0.04 * activity; // faster when active
    const noise = Math.sin(time * 7.3 + id.charCodeAt(0)) * 0.008; // per-region jitter
    const pulse = 1 + breathing + actPulse + noise;

    // Focus zoom: grow 30% when focused
    const focusScale = isFocused ? 1.3 : 1;
    ref.current.scale.set(scl[0] * pulse * focusScale, scl[1] * pulse * focusScale, scl[2] * pulse * focusScale);

    // Dim non-focused regions when something is focused
    const dimFactor = (focusedRegion && !isFocused) ? 0.4 : 1;

    // Emissive glow based on activity
    _color.set(color);
    _emissive.set(color).multiplyScalar(activity * 0.8 * dimFactor);
    ref.current.material.color.lerp(_color, delta * 4);
    ref.current.material.emissive.lerp(_emissive, delta * 4);

    const targetOpacity = (deep ? 0.6 + activity * 0.35 : 0.35 + activity * 0.45) * dimFactor;
    ref.current.material.opacity = THREE.MathUtils.lerp(ref.current.material.opacity, targetOpacity, delta * 3);
  });

  return (
    <mesh
      ref={ref}
      position={pos}
      onClick={(e) => { e.stopPropagation(); setFocusedRegion(id); }}
      onPointerOver={(e) => { e.stopPropagation(); setHoveredRegion(id); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHoveredRegion(null); document.body.style.cursor = 'default'; }}
    >
      <sphereGeometry args={[1, 24, 16]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.5}
        roughness={0.4}
        metalness={0.1}
        depthWrite={false}
      />
    </mesh>
  );
}
