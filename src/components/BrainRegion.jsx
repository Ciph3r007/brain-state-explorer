import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { getStateKey } from '../data/regions';
import { useStore } from '../hooks/useStore';

const _color = new THREE.Color();
const _emissive = new THREE.Color();

// Abbreviated labels for always-on display
const ABBREV = {
  pfc: 'PFC', parietal: 'PAR', temporal_l: 'TL', temporal_r: 'TR',
  occipital: 'OCC', thalamus: 'THL', hypothalamus: 'HYP', hippocampus: 'HPC',
  amygdala: 'AMY', cerebellum: 'CBL', brainstem: 'BST', insula: 'INS',
  cingulate: 'CNG', basalganglia: 'BG',
};

/** Radial gradient texture for glow sprites */
const glowTexture = (() => {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.4)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
})();

/** Thin dashed line from a deep node toward the shell surface */
function DepthAnchor({ pos }) {
  const points = useMemo(() => {
    const origin = new THREE.Vector3(...pos);
    // Project outward to shell surface (normalize and scale to shell radius ~1.0)
    const dir = origin.clone().normalize().multiplyScalar(1.05);
    return [origin, dir];
  }, [pos]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([...points[0].toArray(), ...points[1].toArray()])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineDashedMaterial
        color="#ffffff"
        transparent
        opacity={0.12}
        dashSize={0.03}
        gapSize={0.03}
        depthWrite={false}
      />
    </line>
  );
}

/** Single brain region — compact glowing node with glow halo and label */
export default function BrainRegion({ id, data }) {
  const meshRef = useRef();
  const spriteRef = useRef();
  const lineRef = useRef();
  const getEffectiveState = useStore(s => s.getEffectiveState);
  const setHoveredRegion = useStore(s => s.setHoveredRegion);
  const setFocusedRegion = useStore(s => s.setFocusedRegion);
  const focusedRegion = useStore(s => s.focusedRegion);
  const hoveredRegion = useStore(s => s.hoveredRegion);

  const stateKey = getStateKey(id);
  const { pos, color, deep } = data;
  const isFocused = focusedRegion === id;
  const isHovered = hoveredRegion === id;
  const showLabel = isFocused || isHovered;

  useFrame((clock) => {
    if (!meshRef.current) return;
    const state = getEffectiveState();
    const activity = (state.regionActivity[stateKey] ?? 50) / 100;
    const time = clock.clock.elapsedTime;

    // Activity-driven size: small when inactive, doubles at max
    const baseRadius = 0.06 + activity * 0.08;

    // Pulse: breathing + activity-driven frequency
    const breathing = Math.sin(time * 0.8) * 0.008;
    const actPulse = Math.sin(time * (1.5 + activity * 3)) * 0.02 * activity;
    const noise = Math.sin(time * 7.3 + id.charCodeAt(0)) * 0.004;
    const pulse = 1 + breathing + actPulse + noise;

    const focusScale = isFocused ? 1.3 : 1;
    const r = baseRadius * pulse * focusScale;
    meshRef.current.scale.setScalar(r);

    // Dim non-focused regions
    const dimFactor = (focusedRegion && !isFocused) ? 0.35 : 1;

    // Emissive glow driven by activity — toneMapped=false enables bloom
    _color.set(color);
    _emissive.set(color).multiplyScalar((0.2 + activity * 2.0) * dimFactor);
    const mat = meshRef.current.material;
    mat.color.lerp(_color, 0.1);
    mat.emissive.lerp(_emissive, 0.1);
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, (0.7 + activity * 0.3) * dimFactor, 0.1);

    // Glow sprite size tracks activity
    if (spriteRef.current) {
      const glowSize = (0.15 + activity * 0.35) * focusScale * dimFactor;
      spriteRef.current.scale.setScalar(glowSize);
      spriteRef.current.material.opacity = THREE.MathUtils.lerp(
        spriteRef.current.material.opacity,
        (0.15 + activity * 0.5) * dimFactor,
        0.1
      );
    }

    // Dashed line needs computeLineDistances for dashes to render
    if (lineRef.current && !lineRef.current._dashInit) {
      lineRef.current.computeLineDistances();
      lineRef.current._dashInit = true;
    }
  });

  return (
    <group position={pos}>
      {/* Core node mesh */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); setFocusedRegion(id); }}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredRegion(id); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHoveredRegion(null); document.body.style.cursor = 'default'; }}
      >
        {deep
          ? <icosahedronGeometry args={[1, 1]} />
          : <sphereGeometry args={[1, 16, 12]} />
        }
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
          roughness={0.3}
          metalness={0.1}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* Glow halo sprite */}
      <sprite ref={spriteRef} scale={[0.3, 0.3, 0.3]}>
        <spriteMaterial
          map={glowTexture}
          color={color}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* Label on hover/focus */}
      {showLabel && (
        <Html
          center
          distanceFactor={4}
          style={{
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontFamily: 'monospace',
            border: `1px solid ${color}`,
            transform: 'translateY(-24px)',
          }}
        >
          {data.name} — <ActivityLabel stateKey={stateKey} />
        </Html>
      )}

      {/* Depth anchor line for deep regions */}
      {deep && <DepthAnchorLine pos={pos} lineRef={lineRef} />}
    </group>
  );
}

/** Live activity % readout */
function ActivityLabel({ stateKey }) {
  const getEffectiveState = useStore(s => s.getEffectiveState);
  const state = getEffectiveState();
  const val = state.regionActivity[stateKey] ?? 50;
  return <span style={{ color: '#a5b4fc' }}>{val}%</span>;
}

/** Depth anchor line component (rendered inside the group at pos) */
function DepthAnchorLine({ pos, lineRef }) {
  const points = useMemo(() => {
    const origin = new THREE.Vector3(0, 0, 0); // relative to group
    const dir = new THREE.Vector3(...pos).normalize().multiplyScalar(1.05).sub(new THREE.Vector3(...pos));
    return new Float32Array([0, 0, 0, dir.x, dir.y, dir.z]);
  }, [pos]);

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <lineDashedMaterial
        color="#ffffff"
        transparent
        opacity={0.1}
        dashSize={0.03}
        gapSize={0.03}
        depthWrite={false}
      />
    </line>
  );
}
