import { CATEGORIES, STATES, ICONS } from '../data/states';
import { useStore } from '../hooks/useStore';

export default function StateSelector() {
  const currentState = useStore(s => s.currentState);
  const setCurrentState = useStore(s => s.setCurrentState);
  const compareMode = useStore(s => s.compareMode);

  return (
    <div className="panel left-panel">
      <h2 className="panel-title">Brain States</h2>
      {CATEGORIES.map(cat => (
        <div key={cat.label} className="category">
          <div className="category-label">{cat.label}</div>
          <div className="state-buttons">
            {cat.states.map(id => {
              const active = !compareMode && currentState === id;
              return (
                <button
                  key={id}
                  className={`state-btn ${active ? 'active' : ''}`}
                  style={active ? { borderColor: STATES[id].accent, background: STATES[id].accent + '22' } : {}}
                  onClick={() => setCurrentState(id)}
                >
                  <span className="state-icon">{ICONS[id]}</span>
                  <span className="state-name">{STATES[id].title.split('—')[0].split('(')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
