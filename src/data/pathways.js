/**
 * Key neural circuits with the regions they connect.
 */
export const PATHWAYS = {
  fear:    { name: 'Fear Circuit',     color: '#ef4444', regions: ['thalamus', 'amygdala', 'hypothalamus', 'brainstem'], desc: 'Thalamus → Amygdala → Hypothalamus → Brainstem' },
  reward:  { name: 'Reward Pathway',   color: '#f59e0b', regions: ['brainstem', 'basalganglia', 'pfc'],                 desc: 'VTA → Nucleus Accumbens → PFC' },
  dmn:     { name: 'Default Mode Net', color: '#a78bfa', regions: ['pfc', 'cingulate', 'hippocampus'],                  desc: 'mPFC → PCC → Hippocampus' },
  sensory: { name: 'Sensory Relay',    color: '#10b981', regions: ['brainstem', 'thalamus', 'parietal'],                 desc: 'Brainstem → Thalamus → Cortex' },
  memory:  { name: 'Memory Circuit',   color: '#06b6d4', regions: ['hippocampus', 'thalamus', 'pfc'],                   desc: 'Hippocampus → Thalamus → PFC' },
};
