import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PATHWAYS } from '../data/pathways';
import { REGIONS } from '../data/regions';
import { useStore } from '../hooks/useStore';

const PARTICLE_COUNT = 12;

/** Animated neural pathway — tube with traveling particles */
function Pathway({ id, data }) {
  const tubeRef = useRef();
  const particlesRef = useRef();
  const getEffectiveState = useStore(s => s.getEffectiveState);

  const { points, curve } = useMemo(() => {
    const pts = data.regions
      .map(r => REGIONS[r]?.pos)
      .filter(Boolean)
      .map(p => new THREE.Vector3(...p));
    if (pts.length < 2) return { points: [], curve: null };
    const c = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
    return { points: pts, curve: c };
  }, [data.regions]);

  // Particle positions buffer
  const particlePositions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  useFrame(() => {
    if (!curve || !particlesRef.current) return;
    const state = getEffectiveState();
    const active = state.activePathways?.includes(id);
    const opacity = active ? 0.7 : 0.08;

    if (tubeRef.current) {
      tubeRef.current.material.opacity = THREE.MathUtils.lerp(tubeRef.current.material.opacity, opacity, 0.05);
    }

    if (active) {
      const t = (Date.now() * 0.0003) % 1;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const pt = curve.getPoint((t + i / PARTICLE_COUNT) % 1);
        particlePositions[i * 3] = pt.x;
        particlePositions[i * 3 + 1] = pt.y;
        particlePositions[i * 3 + 2] = pt.z;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    particlesRef.current.material.opacity = THREE.MathUtils.lerp(
      particlesRef.current.material.opacity,
      active ? 0.9 : 0,
      0.05
    );
  });

  if (!curve) return null;

  return (
    <group>
      <mesh ref={tubeRef}>
        <tubeGeometry args={[curve, 32, 0.015, 6, false]} />
        <meshBasicMaterial color={data.color} transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color={data.color} size={0.06} transparent opacity={0} depthWrite={false} sizeAttenuation />
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
