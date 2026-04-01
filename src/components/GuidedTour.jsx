import { useEffect, useRef } from 'react';
import { TOURS } from '../data/tours';
import { useStore } from '../hooks/useStore';

export default function GuidedTour() {
  const tourActive = useStore(s => s.tourActive);
  const tourStep = useStore(s => s.tourStep);
  const nextTourStep = useStore(s => s.nextTourStep);
  const prevTourStep = useStore(s => s.prevTourStep);
  const endTour = useStore(s => s.endTour);
  const startTour = useStore(s => s.startTour);
  const setCurrentState = useStore(s => s.setCurrentState);
  const setFocusedRegion = useStore(s => s.setFocusedRegion);
  const autoRef = useRef(null);

  const tour = tourActive ? TOURS[tourActive] : null;

  // Apply step: navigate to the state and focus region
  useEffect(() => {
    if (!tour) return;
    const step = tour.steps[tourStep];
    if (!step) { endTour(); return; }
    setCurrentState(step.state);
    setFocusedRegion(step.region);
  }, [tour, tourStep]);

  // Tour picker (when no tour is active)
  if (!tourActive) {
    return (
      <div className="tour-picker">
        <button className="tour-picker-toggle" onClick={() => startTour(Object.keys(TOURS)[0])}>
          🎓 Guided Tours
        </button>
        <div className="tour-picker-menu">
          {Object.entries(TOURS).map(([id, t]) => (
            <button key={id} className="tour-menu-item" onClick={() => startTour(id)}>
              <span className="tour-menu-icon">{t.icon}</span>
              <span>{t.title}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Active tour step
  const step = tour?.steps[tourStep];
  if (!step) return null;

  const isFirst = tourStep === 0;
  const isLast = tourStep >= (tour.steps.length - 1);
  const progress = ((tourStep + 1) / tour.steps.length) * 100;

  return (
    <div className="tour-overlay">
      <div className="tour-card">
        <div className="tour-header">
          <span className="tour-tour-title">{tour.title}</span>
          <button className="tour-close" onClick={endTour}>✕</button>
        </div>
        <div className="tour-progress-bar">
          <div className="tour-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="tour-step-counter">Step {tourStep + 1} of {tour.steps.length}</div>
        <h3 className="tour-step-title">{step.title}</h3>
        <p className="tour-step-text">{step.text}</p>
        <div className="tour-nav">
          <button className="tour-btn" onClick={prevTourStep} disabled={isFirst}>← Back</button>
          {isLast ? (
            <button className="tour-btn tour-btn-primary" onClick={endTour}>Finish</button>
          ) : (
            <button className="tour-btn tour-btn-primary" onClick={nextTourStep}>Next →</button>
          )}
        </div>
      </div>
    </div>
  );
}
