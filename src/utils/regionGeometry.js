import * as THREE from 'three';

/**
 * Per-region geometry factory. Returns anatomically suggestive BufferGeometry
 * for each brain region. Cortical regions use smooth lobe-shaped ellipsoids
 * with sulci folds. Deep regions get distinct anatomical shapes.
 */

/** Apply sulci-like wrinkle displacement along normals */
function addSulci(geo, amplitude = 0.025, freq = { x: 14, y: 10, z: 8 }) {
  const pos = geo.attributes.position;
  geo.computeVertexNormals();
  const norm = geo.attributes.normal;
  const v = new THREE.Vector3();
  const n = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    n.set(norm.getX(i), norm.getY(i), norm.getZ(i));
    // Multi-frequency sulci pattern for realism
    const primary = Math.sin(v.x * freq.x + v.z * freq.z) * Math.cos(v.y * freq.y);
    const secondary = Math.sin(v.y * freq.x * 0.7 + v.x * freq.y * 0.5) * 0.4;
    const disp = (primary + secondary) * amplitude;
    v.addScaledVector(n, disp);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/**
 * Cortical lobe — smooth ellipsoid with flattened inner face and sulci wrinkles.
 * Looks like an organic brain lobe, not a geometric cap.
 * @param {object} opts - flatten direction & sulci params
 */
function createCorticalLobe(opts = {}) {
  const { flattenAxis = 'z', flattenDir = -1, flattenAmount = 0.3, sulciAmp = 0.025 } = opts;
  const geo = new THREE.SphereGeometry(1, 24, 18);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i));

    // Flatten the inner face — the side that faces the brain interior
    const axisVal = v[flattenAxis];
    if (Math.sign(axisVal) === flattenDir) {
      // Compress vertices on the inner side to create a flat-backed lobe
      const t = Math.abs(axisVal); // 0 at equator, 1 at pole
      v[flattenAxis] *= (1 - flattenAmount * t);
    }

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();
  addSulci(geo, sulciAmp);
  return geo;
}

/** PFC — wide frontal lobe, flattened on the back face */
function createPFC() {
  return createCorticalLobe({ flattenAxis: 'z', flattenDir: -1, flattenAmount: 0.35, sulciAmp: 0.025 });
}

/** Parietal — broad dome, flattened on bottom */
function createParietal() {
  return createCorticalLobe({ flattenAxis: 'y', flattenDir: -1, flattenAmount: 0.4, sulciAmp: 0.02 });
}

/** Temporal — elongated side lobe, flattened on medial face */
function createTemporalL() {
  return createCorticalLobe({ flattenAxis: 'x', flattenDir: 1, flattenAmount: 0.35, sulciAmp: 0.025 });
}

function createTemporalR() {
  return createCorticalLobe({ flattenAxis: 'x', flattenDir: -1, flattenAmount: 0.35, sulciAmp: 0.025 });
}

/** Occipital — rear lobe, flattened on front face */
function createOccipital() {
  return createCorticalLobe({ flattenAxis: 'z', flattenDir: 1, flattenAmount: 0.35, sulciAmp: 0.02 });
}

// ─── Deep structures ───────────────────────────────────────────────

/** Thalamus — twin egg-shaped lobes */
function createThalamus() {
  const geo = new THREE.SphereGeometry(1, 16, 12);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    // Squash into ovoid
    v.y *= 0.65;
    v.z *= 0.8;
    // Pinch at midline to suggest paired nuclei
    const midPinch = Math.exp(-v.x * v.x * 12) * 0.25;
    v.y *= (1 - midPinch);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Hypothalamus — small oblate blob, slightly bilobed */
function createHypothalamus() {
  const geo = new THREE.SphereGeometry(1, 14, 10);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    v.y *= 0.55;
    v.z *= 0.8;
    // Subtle bilobed pinch
    const pinch = Math.exp(-v.x * v.x * 10) * 0.15;
    v.y *= (1 - pinch);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Hippocampus — C-shaped tube (seahorse horn) */
function createHippocampus() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, 0.05, 0.2),
    new THREE.Vector3(-0.15, -0.1, 0.05),
    new THREE.Vector3(0.05, -0.15, -0.1),
    new THREE.Vector3(0.2, -0.05, -0.25),
    new THREE.Vector3(0.3, 0.08, -0.3),
  ]);

  const geo = new THREE.TubeGeometry(curve, 24, 0.1, 8, false);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  // Taper: thicker at head (anterior), thinner at tail (posterior)
  for (let i = 0; i < pos.count; i++) {
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    // Estimate parameter along curve
    let minDist = Infinity, tParam = 0;
    for (let t = 0; t <= 1; t += 0.04) {
      const d = v.distanceTo(curve.getPoint(t));
      if (d < minDist) { minDist = d; tParam = t; }
    }
    const taper = 1.0 - tParam * 0.45;
    const center = curve.getPoint(tParam);
    const offset = v.clone().sub(center).multiplyScalar(taper);
    v.copy(center).add(offset);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Amygdala — smooth almond shape */
function createAmygdala() {
  const geo = new THREE.SphereGeometry(1, 14, 10);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    // Elongate along Y to form almond
    v.y *= 1.3;
    // Gentle pole tapering (not too sharp — almond, not diamond)
    const yNorm = Math.abs(v.y) / 1.3;
    const taper = 1 - yNorm * yNorm * 0.35;
    v.x *= taper;
    v.z *= taper;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Brainstem — tapered stalk with subtle S-curve */
function createBrainstem() {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.45, 0),
    new THREE.Vector3(0.015, 0.15, 0.02),
    new THREE.Vector3(-0.01, -0.15, 0.015),
    new THREE.Vector3(0, -0.45, 0),
  ]);
  const geo = new THREE.TubeGeometry(curve, 16, 0.18, 8, false);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    // Taper: wider at top (pons), narrower at bottom (medulla)
    const t = THREE.MathUtils.clamp((0.45 - v.y) / 0.9, 0, 1);
    const taper = 1.0 - t * 0.4;
    const center = curve.getPoint(t);
    const offset = v.clone().sub(center).multiplyScalar(taper);
    v.copy(center).add(offset);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Insula — curved concave leaf (folded cortex hidden inside) */
function createInsula() {
  const geo = new THREE.PlaneGeometry(1, 1.3, 14, 16);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    // Concave leaf curvature
    v.z = -0.18 * Math.cos(v.x * Math.PI) * Math.cos(v.y * Math.PI * 0.7);
    // Subtle longitudinal folds
    v.z += Math.sin(v.y * 5) * 0.025;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Cingulate — curved band arching over midline */
function createCingulate() {
  const points = [];
  for (let t = 0; t <= 1; t += 0.05) {
    const angle = Math.PI * 0.15 + t * Math.PI * 0.75;
    points.push(new THREE.Vector3(
      0,
      Math.sin(angle) * 0.45,
      Math.cos(angle) * 0.55
    ));
  }
  const curve = new THREE.CatmullRomCurve3(points);
  const geo = new THREE.TubeGeometry(curve, 24, 0.06, 6, false);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  // Flatten into a band rather than a round tube
  for (let i = 0; i < pos.count; i++) {
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    v.x *= 0.4;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Basal Ganglia — cluster of 3 smooth nuclei */
function createBasalGanglia() {
  const parts = [
    { offset: [-0.12, 0.08, 0], radius: 0.18, squash: [1, 0.75, 0.85] },   // caudate
    { offset: [0.08, -0.04, 0.04], radius: 0.16, squash: [0.85, 0.9, 1] },  // putamen
    { offset: [0.04, 0.06, -0.08], radius: 0.12, squash: [0.8, 0.8, 0.8] }, // globus pallidus
  ];

  const geometries = parts.map(({ offset, radius, squash }) => {
    const g = new THREE.SphereGeometry(radius, 10, 8);
    g.scale(squash[0], squash[1], squash[2]);
    g.translate(offset[0], offset[1], offset[2]);
    return g;
  });

  // Merge geometries
  const totalVerts = geometries.reduce((s, g) => s + g.attributes.position.count, 0);
  const totalIdx = geometries.reduce((s, g) => s + g.index.count, 0);
  const positions = new Float32Array(totalVerts * 3);
  const normals = new Float32Array(totalVerts * 3);
  const indices = new Uint16Array(totalIdx);

  let vo = 0, io = 0;
  for (const g of geometries) {
    const gp = g.attributes.position, gn = g.attributes.normal, gi = g.index;
    for (let i = 0; i < gp.count; i++) {
      positions[(vo + i) * 3] = gp.getX(i);
      positions[(vo + i) * 3 + 1] = gp.getY(i);
      positions[(vo + i) * 3 + 2] = gp.getZ(i);
      normals[(vo + i) * 3] = gn.getX(i);
      normals[(vo + i) * 3 + 1] = gn.getY(i);
      normals[(vo + i) * 3 + 2] = gn.getZ(i);
    }
    for (let i = 0; i < gi.count; i++) indices[io + i] = gi.getX(i) + vo;
    vo += gp.count;
    io += gi.count;
  }

  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  merged.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
  merged.setIndex(new THREE.BufferAttribute(indices, 1));
  merged.computeVertexNormals();
  return merged;
}

/** Cerebellum — sphere with horizontal folia striations */
function createCerebellum() {
  const geo = new THREE.SphereGeometry(1, 22, 18);
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  const v = new THREE.Vector3();
  const n = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    n.set(norm.getX(i), norm.getY(i), norm.getZ(i));
    // Pronounced horizontal folia
    const striation = Math.sin(v.y * 28) * 0.035;
    v.addScaledVector(n, striation);
    // Slightly oblate
    v.y *= 0.8;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

// ─── Factory with cache ────────────────────────────────────────────

const geometryCache = new Map();

export function createRegionGeometry(id) {
  if (geometryCache.has(id)) return geometryCache.get(id);

  let geo;
  switch (id) {
    case 'pfc':        geo = createPFC(); break;
    case 'parietal':   geo = createParietal(); break;
    case 'temporal_l': geo = createTemporalL(); break;
    case 'temporal_r': geo = createTemporalR(); break;
    case 'occipital':  geo = createOccipital(); break;
    case 'thalamus':     geo = createThalamus(); break;
    case 'hypothalamus': geo = createHypothalamus(); break;
    case 'hippocampus':  geo = createHippocampus(); break;
    case 'amygdala':     geo = createAmygdala(); break;
    case 'brainstem':    geo = createBrainstem(); break;
    case 'insula':       geo = createInsula(); break;
    case 'cingulate':    geo = createCingulate(); break;
    case 'basalganglia': geo = createBasalGanglia(); break;
    case 'cerebellum':   geo = createCerebellum(); break;
    default:
      geo = new THREE.SphereGeometry(1, 16, 12);
  }

  geometryCache.set(id, geo);
  return geo;
}
