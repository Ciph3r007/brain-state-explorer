# CLAUDE.md

## Project Goal

Build the most intuitive and visually stunning interactive brain explorer on the web. A learner should look at this and instantly understand brain anatomy — no manual needed. Designed with Steve Jobs-level obsession over clarity, beauty, and delight.

## Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — production build
- `npm run lint` — ESLint

## Architecture

React 19 + Three.js (React Three Fiber/Drei). Users select brain states and see region activity, neurotransmitters, and pathways change in real time.

- **Store**: Zustand in `src/hooks/useStore.js`. `getEffectiveState()` is the single source of truth — handles transitions and compare-mode interpolation.
- **Data**: `src/data/` — 24 brain states, 13 regions, 5 pathways, 8 neurotransmitters. Activity values 0–100.
- **3D Scene**: `BrainScene.jsx` (canvas + post-processing), `BrainModel.jsx` (shell + regions), `BrainRegion.jsx` (per-region mesh), `Pathways.jsx` (neural circuits).
- **UI**: StateSelector, InfoPanel, CompareSlider, NeurotransmitterBars, GuidedTour.

## Key Patterns

- Region activity 0–100 drives glow, scale, opacity.
- `temporal_l`/`temporal_r` share the `temporal` state key.
- New brain state: add to `STATES` + `CATEGORIES` + `ICONS` in `states.js`.
- New region: add to `REGIONS` in `regions.js` + every state's `regionActivity`.
