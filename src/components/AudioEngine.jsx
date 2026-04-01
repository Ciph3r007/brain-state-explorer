import { useEffect, useRef, useState } from 'react';
import { STATES } from '../data/states';
import { useStore } from '../hooks/useStore';

/**
 * EEG-inspired audio sonification.
 * Maps brain state to:
 * - Base frequency (delta 1-4Hz → alpha 8-12Hz → beta 13-30Hz → gamma 30-40Hz)
 * - Carrier tone that represents "neural activity level"
 * - Volume from overall activity
 *
 * Uses Web Audio API — no external libraries.
 */

// EEG band mappings for each state
const STATE_EEG = {
  infant:             { band: 'delta', hz: 2,   carrier: 120, label: 'Delta (2 Hz) — primitive rhythms' },
  child:              { band: 'theta', hz: 6,   carrier: 200, label: 'Theta (6 Hz) — learning, curiosity' },
  adolescent:         { band: 'beta',  hz: 20,  carrier: 280, label: 'Beta (20 Hz) — high arousal' },
  adult:              { band: 'alpha', hz: 10,  carrier: 220, label: 'Alpha (10 Hz) — relaxed awareness' },
  aging:              { band: 'alpha', hz: 8,   carrier: 180, label: 'Alpha (8 Hz) — slower baseline' },
  fear:               { band: 'beta',  hz: 28,  carrier: 350, label: 'Beta (28 Hz) — fight-or-flight' },
  flow:               { band: 'gamma', hz: 38,  carrier: 300, label: 'Gamma (38 Hz) — peak focus' },
  love:               { band: 'alpha', hz: 11,  carrier: 260, label: 'Alpha (11 Hz) — warm bonding' },
  dreaming:           { band: 'theta', hz: 5,   carrier: 150, label: 'Theta (5 Hz) — REM dreaming' },
  'deep-sleep':       { band: 'delta', hz: 1.5, carrier: 80,  label: 'Delta (1.5 Hz) — slow waves' },
  psychedelic:        { band: 'gamma', hz: 35,  carrier: 400, label: 'Gamma (35 Hz) — entropic' },
  meditation:         { band: 'gamma', hz: 40,  carrier: 240, label: 'Gamma (40 Hz) — heightened awareness' },
  anesthesia:         { band: 'delta', hz: 1,   carrier: 60,  label: 'Delta (1 Hz) — near silence' },
  depression:         { band: 'alpha', hz: 7,   carrier: 140, label: 'Alpha (7 Hz) — sluggish, ruminating' },
  'bipolar-mania':    { band: 'beta',  hz: 30,  carrier: 380, label: 'Beta (30 Hz) — electric overdrive' },
  'bipolar-depression':{ band: 'delta', hz: 3,  carrier: 100, label: 'Delta (3 Hz) — energy depleted' },
  anxiety:            { band: 'beta',  hz: 25,  carrier: 320, label: 'Beta (25 Hz) — hypervigilance' },
  ptsd:               { band: 'beta',  hz: 30,  carrier: 360, label: 'Beta (30 Hz) — reliving trauma' },
  did:                { band: 'theta', hz: 6,   carrier: 190, label: 'Theta (6 Hz) — shifting states' },
  schizophrenia:      { band: 'gamma', hz: 32,  carrier: 340, label: 'Gamma (32 Hz) — disordered' },
  adhd:               { band: 'theta', hz: 7,   carrier: 200, label: 'Theta (7 Hz) — under-aroused' },
  addiction:          { band: 'beta',  hz: 22,  carrier: 300, label: 'Beta (22 Hz) — craving' },
  ocd:                { band: 'beta',  hz: 24,  carrier: 310, label: 'Beta (24 Hz) — stuck loop' },
  synesthesia:        { band: 'gamma', hz: 36,  carrier: 280, label: 'Gamma (36 Hz) — cross-modal' },
};

export default function AudioEngine() {
  const currentState = useStore(s => s.currentState);
  const [audioOn, setAudioOn] = useState(false);
  const ctxRef = useRef(null);
  const oscRef = useRef(null);
  const lfoRef = useRef(null);
  const gainRef = useRef(null);
  const lfoGainRef = useRef(null);

  const eeg = STATE_EEG[currentState] || STATE_EEG.adult;

  // Initialize or clean up audio
  useEffect(() => {
    if (!audioOn) {
      if (ctxRef.current) {
        ctxRef.current.close();
        ctxRef.current = null;
      }
      return;
    }

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    // Carrier oscillator (the tone you hear)
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = eeg.carrier;
    oscRef.current = osc;

    // LFO (simulates brainwave rhythm)
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = eeg.hz;
    lfoRef.current = lfo;

    // LFO modulates carrier volume
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.3;
    lfoGainRef.current = lfoGain;

    // Master volume
    const gain = ctx.createGain();
    gain.gain.value = 0.08; // quiet
    gainRef.current = gain;

    // Routing: LFO → lfoGain → carrier gain
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    lfo.start();

    return () => {
      osc.stop();
      lfo.stop();
      ctx.close();
      ctxRef.current = null;
    };
  }, [audioOn]);

  // Update frequencies when state changes
  useEffect(() => {
    if (!audioOn || !oscRef.current) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;

    oscRef.current.frequency.linearRampToValueAtTime(eeg.carrier, now + 0.8);
    lfoRef.current.frequency.linearRampToValueAtTime(eeg.hz, now + 0.8);
  }, [currentState, audioOn]);

  return (
    <div className="audio-container">
      <button
        className={`audio-toggle ${audioOn ? 'active' : ''}`}
        onClick={() => setAudioOn(!audioOn)}
        title="Toggle EEG audio sonification"
      >
        {audioOn ? '🔊' : '🔇'} EEG Audio
      </button>
      {audioOn && (
        <div className="audio-info">
          <span className="audio-band">{eeg.label}</span>
        </div>
      )}
    </div>
  );
}
