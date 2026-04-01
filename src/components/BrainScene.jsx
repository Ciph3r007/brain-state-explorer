import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import BrainModel from './BrainModel';
import { REGIONS } from '../data/regions';
import { useStore } from '../hooks/useStore';

const DEFAULT_CAM = new THREE.Vector3(0, 0.3, 3);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

/** Ticks the animated state transition + camera focus each frame */
function SceneUpdater() {
  const tickTransition = useStore(s => s.tickTransition);
  const focusedRegion = useStore(s => s.focusedRegion);
  const controlsRef = useStore.getState()._controlsRef;

  useFrame((state, delta) => {
    tickTransition(delta);

    // Animate camera toward focused region
    if (controlsRef?.current) {
      const controls = controlsRef.current;
      let targetPos = DEFAULT_TARGET;
      if (focusedRegion && REGIONS[focusedRegion]) {
        targetPos = new THREE.Vector3(...REGIONS[focusedRegion].pos);
      }
      controls.target.lerp(targetPos, delta * 3);
      controls.update();
    }
  });

  return null;
}

export default function BrainScene() {
  const controlsRef = useRef();

  // Store the controls ref so SceneUpdater can access it
  // (we set it once on mount)
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      style={{ position: 'absolute', inset: 0 }}
      onCreated={() => {
        // Store ref for camera targeting
        useStore.setState({ _controlsRef: controlsRef });
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 0.3, 3]} fov={50} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minDistance={1.5}
        maxDistance={5}
        autoRotate
        autoRotateSpeed={0.3}
        dampingFactor={0.08}
        enableDamping
      />

      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, -2, -4]} intensity={0.3} color="#6366f1" />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#8b5cf6" distance={3} />

      <BrainModel />
      <SceneUpdater />

      <EffectComposer>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.3}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
