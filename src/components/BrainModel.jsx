import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { REGIONS } from '../data/regions';
import BrainRegion from './BrainRegion';
import PathwaysGroup from './Pathways';

/**
 * Creates a brain-shaped geometry by deforming a sphere:
 * - Longitudinal fissure (midline gap between hemispheres)
 * - Front-to-back elongation
 * - Flattened bottom
 * - Subtle sulci-like surface perturbation
 */
function createBrainGeometry() {
  const geo = new THREE.SphereGeometry(1.0, 64, 48);
  const pos = geo.attributes.position;
  const normal = geo.attributes.normal;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i));

    // Front-to-back elongation
    v.z *= 1.15;

    // Longitudinal fissure — compress X near midline (x ≈ 0)
    const midlineDist = Math.abs(v.x);
    const fissureDepth = 0.18 * Math.exp(-midlineDist * midlineDist / 0.012);
    // Only apply fissure on top half
    const topFactor = THREE.MathUtils.smoothstep(v.y, -0.1, 0.3);
    v.x *= 1 - fissureDepth * topFactor;

    // Flatten bottom
    if (v.y < -0.3) {
      v.y = -0.3 + (v.y + 0.3) * 0.4;
    }

    // Subtle sulci noise — low-frequency perturbation along surface normal
    const n = new THREE.Vector3(normal.getX(i), normal.getY(i), normal.getZ(i));
    const noise = Math.sin(v.x * 12.0 + v.y * 8.0) * Math.sin(v.z * 10.0 + v.y * 6.0) * 0.015;
    v.addScaledVector(n, noise);

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();
  return geo;
}

/** Cerebellum — separate ellipsoid at back-bottom */
function Cerebellum() {
  return (
    <mesh position={[0, -0.45, -0.7]} scale={[0.45, 0.25, 0.3]}>
      <sphereGeometry args={[1, 32, 24]} />
      <meshPhysicalMaterial
        color="#1a1a2e"
        transparent
        transmission={0.88}
        thickness={0.3}
        roughness={0.15}
        ior={1.1}
        envMapIntensity={0.3}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Wireframe overlay for the classic neuroimaging "glass brain" look */
function WireframeOverlay({ geometry }) {
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial
        color="#6366f1"
        wireframe
        transparent
        opacity={0.04}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function BrainModel() {
  const groupRef = useRef();
  const brainGeo = useMemo(() => createBrainGeometry(), []);

  return (
    <group ref={groupRef} rotation={[0.1, 0, 0]}>
      {/* Glass brain shell */}
      <mesh geometry={brainGeo}>
        <meshPhysicalMaterial
          color="#1a1a2e"
          transparent
          transmission={0.92}
          thickness={0.5}
          roughness={0.1}
          ior={1.1}
          envMapIntensity={0.3}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wireframe overlay for structure readability */}
      <WireframeOverlay geometry={brainGeo} />

      {/* Cerebellum */}
      <Cerebellum />

      {/* Brain regions */}
      {Object.entries(REGIONS).map(([id, data]) => (
        <BrainRegion key={id} id={id} data={data} />
      ))}

      {/* Neural pathways */}
      <PathwaysGroup />
    </group>
  );
}
