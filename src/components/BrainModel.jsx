import { useRef } from 'react';
import { REGIONS } from '../data/regions';
import BrainRegion from './BrainRegion';
import PathwaysGroup from './Pathways';

/**
 * Procedural brain model — composites ellipsoid regions.
 * Architecture: swap this entire component with a GLTF loader
 * when a real anatomical model is available.
 */
export default function BrainModel() {
  const groupRef = useRef();

  return (
    <group ref={groupRef} rotation={[0.1, 0, 0]}>
      {/* Transparent outer cortex shell */}
      <mesh>
        <sphereGeometry args={[1.1, 48, 32]} />
        <meshStandardMaterial
          color="#1e293b"
          transparent
          opacity={0.08}
          roughness={0.9}
          side={2} // DoubleSide
          depthWrite={false}
        />
      </mesh>

      {/* Brain regions */}
      {Object.entries(REGIONS).map(([id, data]) => (
        <BrainRegion key={id} id={id} data={data} />
      ))}

      {/* Neural pathways */}
      <PathwaysGroup />
    </group>
  );
}
