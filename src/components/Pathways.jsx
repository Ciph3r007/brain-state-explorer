import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PATHWAYS } from '../data/pathways';
import { REGIONS } from '../data/regions';
import { useStore } from '../hooks/useStore';

const PARTICLE_COUNT = 20;
const TRAIL_POINTS = 3; // trailing echoes per particle
const TOTAL_POINTS = PARTICLE_COUNT * (1 + TRAIL_POINTS);

/** Circular soft-edged sprite texture for particles */
const particleTexture = (() => {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.4, 'rgba(255,255,255,0.6)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
})();

/** Animated neural pathway — emissive tube with traveling particles + trails */
function Pathway({ id, data }) {
  const tubeRef = useRef();
  const particlesRef = useRef();
  const getEffectiveState = useStore(s => s.getEffectiveState);

  const { curve } = useMemo(() => {
    const pts = data.regions
      .map(r => REGIONS[r]?.pos)
      .filter(Boolean)
      .map(p => new THREE.Vector3(...p));
    if (pts.length < 2) return { curve: null };
    const c = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
    return { curve: c };
  }, [data.regions]);

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(TOTAL_POINTS * 3);
    const sz = new Float32Array(TOTAL_POINTS);
    // Initialize sizes — trails get progressively smaller
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      sz[i * (1 + TRAIL_POINTS)] = 1.0; // main particle
      for (let t = 1; t <= TRAIL_POINTS; t++) {
        sz[i * (1 + TRAIL_POINTS) + t] = 1.0 - t * 0.25; // decreasing trail
      }
    }
    return { positions: pos, sizes: sz };
  }, []);

  useFrame(() => {
    if (!curve || !particlesRef.current) return;
    const state = getEffectiveState();
    const active = state.activePathways?.includes(id);
    const targetOpacity = active ? 0.7 : 0.06;

    // Tube opacity
    if (tubeRef.current) {
      const mat = tubeRef.current.material;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.05);
      mat.emissiveIntensity = THREE.MathUtils.lerp(
        mat.emissiveIntensity, active ? 1.2 : 0, 0.05
      );
    }

    // Particle positions + trails
    if (active) {
      const t = (Date.now() * 0.0003) % 1;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const baseT = (t + i / PARTICLE_COUNT) % 1;
        const stride = 1 + TRAIL_POINTS;

        // Main particle
        const pt = curve.getPoint(baseT);
        positions[i * stride * 3] = pt.x;
        positions[i * stride * 3 + 1] = pt.y;
        positions[i * stride * 3 + 2] = pt.z;

        // Trailing points (slightly behind)
        for (let trail = 1; trail <= TRAIL_POINTS; trail++) {
          const trailT = (baseT - trail * 0.012 + 1) % 1;
          const tp = curve.getPoint(trailT);
          const idx = (i * stride + trail) * 3;
          positions[idx] = tp.x;
          positions[idx + 1] = tp.y;
          positions[idx + 2] = tp.z;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Particle visibility
    particlesRef.current.material.opacity = THREE.MathUtils.lerp(
      particlesRef.current.material.opacity,
      active ? 0.85 : 0,
      0.05
    );
  });

  if (!curve) return null;

  return (
    <group>
      {/* Emissive tube */}
      <mesh ref={tubeRef}>
        <tubeGeometry args={[curve, 32, 0.012, 6, false]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={0}
          transparent
          opacity={0.06}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>

      {/* Particles with trails */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={TOTAL_POINTS}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={TOTAL_POINTS}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          map={particleTexture}
          color={data.color}
          size={0.05}
          transparent
          opacity={0}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function PathwaysGroup() {
  return (
    <group>
      {Object.entries(PATHWAYS).map(([id, data]) => (
        <Pathway key={id} id={id} data={data} />
      ))}
    </group>
  );
}
