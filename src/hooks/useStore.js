import { create } from 'zustand';
import { STATES } from '../data/states';

/**
 * Central state store for the Brain Explorer.
 * Supports animated transitions, compare mode, region focus, and guided tours.
 */
export const useStore = create((set, get) => ({
  // ─── Current State & Animated Transition ───
  currentState: 'adult',
  prevState: null,
  transitionT: 1,       // 0→1, 1 = fully arrived
  transitionSpeed: 2.5,

  setCurrentState: (id) => {
    const { currentState } = get();
    if (id === currentState) return;
    set({ prevState: currentState, currentState: id, transitionT: 0 });
  },

  tickTransition: (delta) => {
    const { transitionT, transitionSpeed } = get();
    if (transitionT >= 1) return;
    set({ transitionT: Math.min(1, transitionT + delta * transitionSpeed) });
  },

  // ─── Compare Mode ───
  compareMode: false,
  compareA: 'adult',
  compareB: 'fear',
  morphT: 0,
  toggleCompare: () => set(s => ({ compareMode: !s.compareMode, morphT: 0 })),
  setCompareA: (id) => set({ compareA: id, morphT: 0 }),
  setCompareB: (id) => set({ compareB: id, morphT: 0 }),
  setMorphT: (t) => set({ morphT: t }),

  // ─── Hovered & Focused Region ───
  hoveredRegion: null,
  focusedRegion: null,
  setHoveredRegion: (id) => set({ hoveredRegion: id }),
  setFocusedRegion: (id) => set(s => ({ focusedRegion: s.focusedRegion === id ? null : id })),

  // ─── Guided Tour ───
  tourActive: false,
  tourStep: 0,
  startTour: (tourId) => set({ tourActive: tourId || true, tourStep: 0 }),
  nextTourStep: () => set(s => ({ tourStep: s.tourStep + 1 })),
  prevTourStep: () => set(s => ({ tourStep: Math.max(0, s.tourStep - 1) })),
  endTour: () => set({ tourActive: false, tourStep: 0 }),

  // ─── Derived: effective state with transition + compare ───
  getEffectiveState: () => {
    const { currentState, prevState, transitionT, compareMode, compareA, compareB, morphT } = get();

    if (compareMode) {
      return interpolate(STATES[compareA], STATES[compareB], morphT / 100);
    }

    if (prevState && transitionT < 1) {
      return interpolate(STATES[prevState], STATES[currentState], easeInOutCubic(transitionT));
    }

    return STATES[currentState];
  },
}));

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function interpolate(a, b, t) {
  if (!a || !b) return a || b;
  const result = {
    title: t < 0.5 ? a.title : b.title,
    tagline: t < 0.5 ? a.tagline : b.tagline,
    accent: t < 0.5 ? a.accent : b.accent,
    regionActivity: {},
    nt: {},
    insights: t < 0.5 ? a.insights : b.insights,
    keyChanges: t < 0.5 ? a.keyChanges : b.keyChanges,
    activePathways: t < 0.5 ? a.activePathways : b.activePathways,
  };
  for (const k of Object.keys(a.regionActivity)) {
    result.regionActivity[k] = a.regionActivity[k] * (1 - t) + (b.regionActivity[k] ?? 50) * t;
  }
  for (const k of Object.keys(a.nt)) {
    result.nt[k] = a.nt[k] * (1 - t) + (b.nt[k] ?? 50) * t;
  }
  return result;
}
