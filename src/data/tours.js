/**
 * Guided tour definitions.
 * Each tour is a sequence of steps that auto-navigate to states/regions
 * with explanatory narration.
 */
export const TOURS = {
  'fear-response': {
    title: 'Understanding Fear in 60 Seconds',
    icon: '😨',
    steps: [
      { state: 'adult', region: null, title: 'Start: Normal Brain', text: 'This is your brain at rest. The Prefrontal Cortex (PFC) is in charge — calm, rational thinking. The Default Mode Network gently hums as you daydream.' },
      { state: 'adult', region: 'amygdala', title: 'Meet the Amygdala', text: 'This almond-shaped region is your threat detector. It\'s always watching — even when you\'re not aware of it. Right now, it\'s quiet at ~40% activity.' },
      { state: 'adult', region: 'thalamus', title: 'The Thalamus Gateway', text: 'All sensory information (except smell) routes through the thalamus. It\'s the brain\'s relay station — deciding what reaches consciousness.' },
      { state: 'fear', region: null, title: 'THREAT DETECTED!', text: 'Watch the transformation! The amygdala shoots to 95%, cortisol floods the system, and the PFC goes quiet. Your brain switched from thinking to surviving in ~12 milliseconds.' },
      { state: 'fear', region: 'amygdala', title: 'Amygdala Hijack', text: 'LeDoux\'s "low road": the thalamus sends raw data to the amygdala BEFORE the cortex processes it. You feel fear before you even know what scared you.' },
      { state: 'fear', region: 'pfc', title: 'PFC Goes Offline', text: 'Notice the PFC dropped to 25%. Evolution decided: in danger, thinking wastes time. This is why you can\'t "think" your way out of a panic attack.' },
      { state: 'adult', region: null, title: 'Recovery', text: 'As the threat passes, the PFC gradually reasserts control, cortisol drops, and the amygdala quiets. Watch the smooth transition back to baseline.' },
    ],
  },
  'brain-development': {
    title: 'How Your Brain Grew Up',
    icon: '👶→🧠',
    steps: [
      { state: 'infant', region: null, title: 'Newborn: Construction Zone', text: 'The infant brain is dominated by the brainstem (90%) — breathing, feeding, crying. The PFC is barely functional at 15%. No planning, no impulse control, no self.' },
      { state: 'infant', region: 'hippocampus', title: 'Why You Can\'t Remember', text: 'The hippocampus is immature — this is why infantile amnesia exists. You can\'t form lasting autobiographical memories until around age 3-4.' },
      { state: 'child', region: null, title: 'Childhood: Everything is New', text: 'Now the PFC is developing. Dopamine is high — intense curiosity. Time feels SLOW because everything is novel and each moment creates dense memories.' },
      { state: 'adolescent', region: null, title: 'The Teenage Mismatch', text: 'THE critical insight: the amygdala and reward system are fully active, but the PFC won\'t mature until ~25. The gas pedal works, but the brakes aren\'t installed.' },
      { state: 'adolescent', region: 'basalganglia', title: 'Peak Dopamine', text: 'Dopamine hits its lifetime peak. Everything feels more intense — social validation, risk-taking, first loves. This isn\'t rebellion — it\'s biology.' },
      { state: 'adult', region: null, title: 'Full Maturity', text: 'Finally, the PFC is fully online. Emotional regulation works. The balance between impulse and control is established. But neuroplasticity decreases.' },
      { state: 'aging', region: 'hippocampus', title: 'Graceful Decline', text: 'The hippocampus shrinks ~1-2% per year. Processing slows. But wisdom increases, and the brain compensates by recruiting both hemispheres (HAROLD model).' },
    ],
  },
  'consciousness-states': {
    title: 'The Spectrum of Consciousness',
    icon: '🌀',
    steps: [
      { state: 'adult', region: null, title: 'Waking Consciousness', text: 'Normal awareness: PFC active, DMN providing background self-reflection, all neurotransmitters balanced. You know who you are, where you are, when you are.' },
      { state: 'flow', region: null, title: 'Flow: Losing Yourself', text: 'In flow, the DMN goes silent — you literally lose your sense of self. Time collapses because the insula (which tracks time) is suppressed. Pure task immersion.' },
      { state: 'meditation', region: 'insula', title: 'Meditation: Heightened Awareness', text: 'Paradoxically, meditation increases insula activity — you become MORE aware of your body. But the amygdala is suppressed. Awareness without anxiety.' },
      { state: 'dreaming', region: null, title: 'Dreaming: Hallucinating Yourself', text: 'PFC offline, visual cortex hyperactive. You\'re essentially hallucinating — but you believe it\'s real because norepinephrine (the "reality check" chemical) is absent.' },
      { state: 'deep-sleep', region: null, title: 'Deep Sleep: Brain Maintenance', text: 'Delta waves sweep across the cortex. The glymphatic system activates — cells shrink, spinal fluid flushes out waste including amyloid-beta. This is brain cleaning.' },
      { state: 'psychedelic', region: null, title: 'Psychedelic: Entropy Unleashed', text: 'The DMN dissolves. Brain regions that normally never communicate start talking. The thalamic filter opens. The "entropic brain hypothesis" — more disorder = more consciousness?' },
    ],
  },
};
