import { useState, useRef, useEffect } from 'react';
import { CATEGORIES, STATES, ICONS } from '../data/states';
import { useStore } from '../hooks/useStore';

/**
 * Timeline slider — scrub through states within a category
 * to watch the brain smoothly morph between developmental stages,
 * emotional states, etc.
 */
export default function TimelineSlider() {
  const currentState = useStore(s => s.currentState);
  const setCurrentState = useStore(s => s.setCurrentState);
  const [activeCategory, setActiveCategory] = useState(null);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef(null);

  // Find which category the current state is in
  const currentCat = CATEGORIES.find(c => c.states.includes(currentState));

  // Auto-play through category
  useEffect(() => {
    if (!playing || !activeCategory) return;
    const cat = CATEGORIES.find(c => c.label === activeCategory);
    if (!cat) return;

    const currentIdx = cat.states.indexOf(currentState);
    intervalRef.current = setInterval(() => {
      const idx = cat.states.indexOf(useStore.getState().currentState);
      const nextIdx = idx + 1;
      if (nextIdx >= cat.states.length) {
        setPlaying(false);
        return;
      }
      setCurrentState(cat.states[nextIdx]);
    }, 2500); // 2.5s per state

    return () => clearInterval(intervalRef.current);
  }, [playing, activeCategory]);

  // Stop playing when category changes
  useEffect(() => { setPlaying(false); }, [activeCategory]);

  const cat = activeCategory
    ? CATEGORIES.find(c => c.label === activeCategory)
    : currentCat;

  if (!cat) return null;

  const stateIdx = cat.states.indexOf(currentState);

  return (
    <div className="timeline-container">
      {/* Category tabs */}
      <div className="timeline-cats">
        {CATEGORIES.map(c => (
          <button
            key={c.label}
            className={`timeline-cat-btn ${(activeCategory || currentCat?.label) === c.label ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(c.label);
              setCurrentState(c.states[0]);
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Timeline track */}
      <div className="timeline-track">
        <button
          className="timeline-play-btn"
          onClick={() => {
            if (!activeCategory && currentCat) setActiveCategory(currentCat.label);
            if (!playing && stateIdx >= cat.states.length - 1) {
              setCurrentState(cat.states[0]);
            }
            setPlaying(!playing);
          }}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <div className="timeline-dots">
          {cat.states.map((id, i) => (
            <button
              key={id}
              className={`timeline-dot ${id === currentState ? 'active' : ''} ${i < stateIdx ? 'past' : ''}`}
              style={id === currentState ? { borderColor: STATES[id]?.accent } : {}}
              onClick={() => setCurrentState(id)}
              title={STATES[id]?.title}
            >
              <span className="timeline-dot-icon">{ICONS[id]}</span>
              <span className="timeline-dot-label">
                {STATES[id]?.title?.split('—')[0]?.split('(')[0]?.trim()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
