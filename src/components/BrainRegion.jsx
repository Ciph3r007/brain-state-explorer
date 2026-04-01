import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { getStateKey } from '../data/regions';
import { useStore } from '../hooks/useStore';
import { createRegionGeometry } from '../utils/regionGeometry';

const _color = new THREE.Color();
const _emissive = new THREE.Color();
const _sheenColor = new THREE.Color();

const ABBREV = {
  thalamus: 'THL', hypothalamus: 'HYP', hippocampus: 'HPC',
  amygdala: 'AMY', cerebellum: 'CBL', brainstem: 'BST',
  insula: 'INS', cingulate: 'CNG', basalganglia: 'BG',
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

/** Deep brain region — anatomically shaped mesh with tissue material */
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

  const geometry = useMemo(() => createRegionGeometry(id), [id]);

  // Normalized scale: aspect ratio from region data, capped to reasonable size
  const baseScale = useMemo(() => {
    const raw = data.scale
      || (id === 'hippocampus' ? [0.3, 0.25, 0.3]
        : id === 'cingulate' ? [0.2, 0.2, 0.25]
        : [0.15, 0.15, 0.15]);
    const maxExtent = Math.max(...raw);
    const targetSize = 0.18;
    const factor = targetSize / maxExtent;
    return [raw[0] * factor, raw[1] * factor, raw[2] * factor];
  }, [id, data.scale]);

  useFrame((clock) => {
    if (!meshRef.current) return;
    const state = getEffectiveState();
    const activity = (state.regionActivity[stateKey] ?? 50) / 100;
    const time = clock.clock.elapsedTime;

    // Deep regions: size responds to activity (0.7–1.3x)
    const scaleMultiplier = 0.7 + activity * 0.6;

    // Pulse: breathing + activity-driven
    const breathing = Math.sin(time * 0.8) * 0.015;
    const actPulse = Math.sin(time * (1.5 + activity * 3)) * 0.04 * activity;
    const noise = Math.sin(time * 7.3 + id.charCodeAt(0)) * 0.004;
    const pulse = 1 + breathing + actPulse + noise;

    const focusScale = isFocused ? 1.2 : 1;
    const s = scaleMultiplier * pulse * focusScale;

    meshRef.current.scale.set(
      baseScale[0] * s,
      baseScale[1] * s,
      baseScale[2] * s
    );

    // Dim non-focused regions
    const dimFactor = (focusedRegion && !isFocused) ? 0.35 : 1;

    // Strong emissive glow to read through glass shell
    const emissiveStrength = (0.3 + activity * 2.5) * dimFactor;

    _color.set(color);
    _emissive.set(color).multiplyScalar(emissiveStrength);

    // Sheen color: desaturated at low activity
    _sheenColor.set(color);
    const hsl = {};
    _sheenColor.getHSL(hsl);
    _sheenColor.setHSL(hsl.h, hsl.s * (0.3 + activity * 0.7), hsl.l);

    const mat = meshRef.current.material;
    mat.color.lerp(_color, 0.1);
    mat.emissive.lerp(_emissive, 0.1);
    mat.sheenColor.lerp(_sheenColor, 0.1);

    // Opacity: 0.5 (dormant) to 0.95 (max activity)
    const targetOpacity = (0.5 + activity * 0.45) * dimFactor;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.1);

    // Glow sprite
    if (spriteRef.current) {
      const glowSize = (0.15 + activity * 0.35) * focusScale * dimFactor;
      spriteRef.current.scale.setScalar(glowSize);
      spriteRef.current.material.opacity = THREE.MathUtils.lerp(
        spriteRef.current.material.opacity,
        (0.15 + activity * 0.5) * dimFactor,
        0.1
      );
    }

    // Dashed depth anchor line
    if (lineRef.current && !lineRef.current._dashInit) {
      lineRef.current.computeLineDistances();
      lineRef.current._dashInit = true;
    }
  });

  return (
    <group position={pos}>
      {/* Invisible hitbox for reliable clicking */}
      <mesh
        visible={false}
        onClick={(e) => { e.stopPropagation(); setFocusedRegion(id); }}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredRegion(id); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHoveredRegion(null); document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[Math.max(...baseScale) * 1.5, 8, 6]} />
        <meshBasicMaterial />
      </mesh>

      {/* Anatomical region mesh */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={(e) => { e.stopPropagation(); setFocusedRegion(id); }}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredRegion(id); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHoveredRegion(null); document.body.style.cursor = 'default'; }}
      >
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
          roughness={0.55}
          metalness={0.0}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
          sheen={0.8}
          sheenRoughness={0.5}
          sheenColor={color}
          toneMapped={false}
          depthWrite={false}
          side={THREE.DoubleSide}
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

      {/* Always-visible abbreviated label */}
      <Html
        center
        distanceFactor={5}
        style={{
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          color: color,
          fontSize: '10px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          textShadow: '0 0 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.5)',
          opacity: 0.85,
          transform: 'translateY(-16px)',
        }}
      >
        {ABBREV[id] || id.toUpperCase()}
      </Html>

      {/* Expanded label on hover/focus */}
      {showLabel && (
        <Html
          center
          distanceFactor={4}
          style={{
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            background: 'rgba(0,0,0,0.8)',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            border: `1px solid ${color}`,
            transform: 'translateY(-32px)',
          }}
        >
          {data.name} — <ActivityLabel stateKey={stateKey} />
        </Html>
      )}

      {/* Depth anchor line — colored by region */}
      {deep && <DepthAnchorLine pos={pos} color={color} lineRef={lineRef} />}
    </group>
  );
}

function ActivityLabel({ stateKey }) {
  const getEffectiveState = useStore(s => s.getEffectiveState);
  const state = getEffectiveState();
  const val = state.regionActivity[stateKey] ?? 50;
  return <span style={{ color: '#a5b4fc' }}>{val}%</span>;
}

function DepthAnchorLine({ pos, color, lineRef }) {
  const points = useMemo(() => {
    const origin = new THREE.Vector3(0, 0, 0);
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
        color={color}
        transparent
        opacity={0.15}
        dashSize={0.03}
        gapSize={0.03}
        depthWrite={false}
      />
    </line>
  );
}
