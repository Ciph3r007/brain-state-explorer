import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { REGIONS, getStateKey } from '../data/regions';
import { useStore } from '../hooks/useStore';
import { createBrainSurfaceGeometry, computeRegionWeights } from '../utils/regionGeometry';

// Cortical regions with vivid, high-contrast colors for the brain surface
// These are more saturated than the data colors for surface painting clarity
const CORTICAL_REGIONS = [
  { id: 'pfc', pos: REGIONS.pfc.pos, color: new THREE.Color('#4a9eff'), stateKey: 'pfc' },          // bright blue
  { id: 'parietal', pos: REGIONS.parietal.pos, color: new THREE.Color('#a855f7'), stateKey: 'parietal' },  // vivid purple
  { id: 'temporal_l', pos: REGIONS.temporal_l.pos, color: new THREE.Color('#f43f8e'), stateKey: 'temporal' }, // hot pink
  { id: 'temporal_r', pos: REGIONS.temporal_r.pos, color: new THREE.Color('#f43f8e'), stateKey: 'temporal' }, // hot pink
  { id: 'occipital', pos: REGIONS.occipital.pos, color: new THREE.Color('#f5a623'), stateKey: 'occipital' }, // warm amber
];

// Neutral tissue base color for areas far from any region center
const TISSUE_BASE = new THREE.Color('#3a2a2a');

export default function BrainSurface() {
  const meshRef = useRef();
  const getEffectiveState = useStore(s => s.getEffectiveState);
  const focusedRegion = useStore(s => s.focusedRegion);
  const hoveredRegion = useStore(s => s.hoveredRegion);
  const setHoveredRegion = useStore(s => s.setHoveredRegion);
  const setFocusedRegion = useStore(s => s.setFocusedRegion);

  // Create geometry and weight map once
  const { geometry, weights, vertexCount } = useMemo(() => {
    const geo = createBrainSurfaceGeometry();
    const w = computeRegionWeights(geo, CORTICAL_REGIONS, 5.0);
    return { geometry: geo, weights: w, vertexCount: geo.attributes.position.count };
  }, []);

  // Per-frame vertex color update
  useFrame(() => {
    if (!meshRef.current) return;
    const state = getEffectiveState();
    const colorAttr = geometry.attributes.color;
    const colors = colorAttr.array;
    const regionCount = CORTICAL_REGIONS.length;

    // Get activity per cortical region
    const activities = CORTICAL_REGIONS.map(r =>
      (state.regionActivity[r.stateKey] ?? 50) / 100
    );

    // Check if any cortical region is focused or hovered
    const corticalIds = CORTICAL_REGIONS.map(r => r.id);
    const hasCorticalFocus = focusedRegion && corticalIds.includes(focusedRegion);
    const hasAnyFocus = !!focusedRegion;

    for (let i = 0; i < vertexCount; i++) {
      let r = 0, g = 0, b = 0;
      let dominantWeight = 0;
      let dominantIdx = 0;

      for (let j = 0; j < regionCount; j++) {
        const w = weights[i * regionCount + j];
        if (w > dominantWeight) { dominantWeight = w; dominantIdx = j; }

        const activity = activities[j];
        const rc = CORTICAL_REGIONS[j].color;

        // Dim factor: if a region is focused, dim non-focused areas
        let dimFactor = 1;
        if (hasAnyFocus) {
          if (hasCorticalFocus && CORTICAL_REGIONS[j].id !== focusedRegion) {
            dimFactor = 0.3;
          } else if (!hasCorticalFocus) {
            // A deep region is focused — dim entire cortical surface moderately
            dimFactor = 0.5;
          }
        }

        // Hover boost
        const hoverBoost = (hoveredRegion === CORTICAL_REGIONS[j].id) ? 1.3 : 1.0;

        // HDR emissive boost: always-visible base + activity-driven bloom
        const emissiveBoost = (0.8 + activity * 3.5) * dimFactor * hoverBoost;

        r += w * rc.r * emissiveBoost;
        g += w * rc.g * emissiveBoost;
        b += w * rc.b * emissiveBoost;
      }

      // Blend with neutral tissue base for areas where no region dominates
      const maxWeight = dominantWeight;
      if (maxWeight < 0.4) {
        const tissueMix = (0.4 - maxWeight) / 0.4; // 0 at weight=0.4, 1 at weight=0
        const baseActivity = activities[dominantIdx];
        const baseEmissive = 0.15 + baseActivity * 0.5;
        r = r * (1 - tissueMix) + TISSUE_BASE.r * baseEmissive * tissueMix;
        g = g * (1 - tissueMix) + TISSUE_BASE.g * baseEmissive * tissueMix;
        b = b * (1 - tissueMix) + TISSUE_BASE.b * baseEmissive * tissueMix;
      }

      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    colorAttr.needsUpdate = true;
  });

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry}>
        <meshPhysicalMaterial
          vertexColors
          transparent
          opacity={0.92}
          roughness={0.6}
          metalness={0.0}
          clearcoat={0.15}
          clearcoatRoughness={0.6}
          sheen={0.4}
          sheenRoughness={0.5}
          sheenColor="#e8b4b8"
          toneMapped={false}
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Invisible hitboxes for cortical region interaction */}
      {CORTICAL_REGIONS.map(region => (
        <CorticalHitbox
          key={region.id}
          id={region.id}
          data={REGIONS[region.id]}
        />
      ))}
    </group>
  );
}

// Abbreviated labels for persistent display
const ABBREV = {
  pfc: 'PFC', parietal: 'PAR', temporal_l: 'TL', temporal_r: 'TR', occipital: 'OCC',
};

/** Invisible hitbox sphere at each cortical region position for click/hover */
function CorticalHitbox({ id, data }) {
  const setHoveredRegion = useStore(s => s.setHoveredRegion);
  const setFocusedRegion = useStore(s => s.setFocusedRegion);
  const focusedRegion = useStore(s => s.focusedRegion);
  const hoveredRegion = useStore(s => s.hoveredRegion);
  const getEffectiveState = useStore(s => s.getEffectiveState);

  const stateKey = getStateKey(id);
  const isFocused = focusedRegion === id;
  const isHovered = hoveredRegion === id;
  const showLabel = isFocused || isHovered;

  const hitRadius = Math.max(...(data.scale || [0.2, 0.2, 0.2])) * 0.6;

  return (
    <group position={data.pos}>
      <mesh
        visible={false}
        onClick={(e) => { e.stopPropagation(); setFocusedRegion(id); }}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredRegion(id); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHoveredRegion(null); document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[hitRadius, 8, 6]} />
        <meshBasicMaterial />
      </mesh>

      {/* Always-visible abbreviated label */}
      <Html
        center
        distanceFactor={5}
        style={{
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          color: data.color,
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
            border: `1px solid ${data.color}`,
            transform: 'translateY(-32px)',
          }}
        >
          {data.name} — <ActivityLabel stateKey={stateKey} />
        </Html>
      )}
    </group>
  );
}

function ActivityLabel({ stateKey }) {
  const getEffectiveState = useStore(s => s.getEffectiveState);
  const state = getEffectiveState();
  const val = state.regionActivity[stateKey] ?? 50;
  return <span style={{ color: '#a5b4fc' }}>{val}%</span>;
}
