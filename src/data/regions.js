/**
 * Brain regions with anatomical positions, colors, and roles.
 * Positions are in normalized brain space (-1 to 1).
 * 'deep' regions render as glowing meshes inside the transparent cortex.
 */
export const REGIONS = {
  pfc:          { name: 'Prefrontal Cortex',  color: '#3b82f6', role: 'Executive function, planning, impulse control', pos: [0, 0.35, 0.85],  scale: [0.52, 0.45, 0.4] },
  parietal:     { name: 'Parietal Lobe',      color: '#8b5cf6', role: 'Sensory integration, spatial awareness',       pos: [0, 0.6, 0],     scale: [0.6, 0.35, 0.5] },
  temporal_l:   { name: 'Temporal Lobe (L)',   color: '#ec4899', role: 'Auditory processing, language, memory',       pos: [-0.65, -0.15, 0.15], scale: [0.3, 0.35, 0.55] },
  temporal_r:   { name: 'Temporal Lobe (R)',   color: '#f472b6', role: 'Auditory processing, prosody, music',         pos: [0.65, -0.15, 0.15],  scale: [0.3, 0.35, 0.55] },
  occipital:    { name: 'Occipital Lobe',      color: '#f59e0b', role: 'Visual processing — color, motion, depth',    pos: [0, 0.2, -0.85], scale: [0.5, 0.42, 0.35] },
  thalamus:     { name: 'Thalamus',            color: '#10b981', role: 'Sensory relay, consciousness gating',         pos: [0, 0.05, 0],    scale: [0.22, 0.15, 0.18], deep: true },
  hypothalamus: { name: 'Hypothalamus',        color: '#f97316', role: 'Homeostasis, hormones, temperature, sleep',   pos: [0, -0.18, 0.2], scale: [0.14, 0.1, 0.12],  deep: true },
  hippocampus:  { name: 'Hippocampus',         color: '#06b6d4', role: 'Memory formation, spatial navigation',        pos: [0, -0.1, -0.1], curve: true, deep: true },
  amygdala:     { name: 'Amygdala',            color: '#ef4444', role: 'Fear, threat detection, emotional tagging',   pos: [-0.25, -0.22, 0.25], scale: [0.1, 0.09, 0.09], deep: true },
  cerebellum:   { name: 'Cerebellum',          color: '#a855f7', role: 'Motor coordination, timing, cognitive smoothing', pos: [0, -0.45, -0.7], scale: [0.5, 0.3, 0.35] },
  brainstem:    { name: 'Brainstem',           color: '#6366f1', role: 'Vital functions — breathing, heart rate',     pos: [0, -0.55, -0.2], scale: [0.12, 0.3, 0.12],  deep: true },
  insula:       { name: 'Insula',              color: '#14b8a6', role: 'Interoception, emotional awareness, empathy', pos: [-0.4, 0.1, 0.2], scale: [0.08, 0.18, 0.18], deep: true },
  cingulate:    { name: 'Cingulate Cortex',    color: '#f472b6', role: 'Error detection, conflict, emotional regulation', pos: [0, 0.45, 0.15], curve: true, deep: true },
  basalganglia: { name: 'Basal Ganglia',       color: '#eab308', role: 'Habits, reward processing, procedural learning', pos: [-0.15, 0.05, 0.15], scale: [0.15, 0.13, 0.14], deep: true },
};

// temporal_l and temporal_r share the "temporal" key in state data
export const REGION_STATE_MAP = { temporal_l: 'temporal', temporal_r: 'temporal' };
export const getStateKey = (id) => REGION_STATE_MAP[id] || id;
