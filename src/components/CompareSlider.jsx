import { STATES, ICONS, CATEGORIES } from '../data/states';
import { useStore } from '../hooks/useStore';

const allStateIds = CATEGORIES.flatMap(c => c.states);

export default function CompareSlider() {
  const compareMode = useStore(s => s.compareMode);
  const toggleCompare = useStore(s => s.toggleCompare);
  const compareA = useStore(s => s.compareA);
  const compareB = useStore(s => s.compareB);
  const morphT = useStore(s => s.morphT);
  const setCompareA = useStore(s => s.setCompareA);
  const setCompareB = useStore(s => s.setCompareB);
  const setMorphT = useStore(s => s.setMorphT);

  return (
    <div className="compare-container">
      <button className={`compare-toggle ${compareMode ? 'active' : ''}`} onClick={toggleCompare}>
        {compareMode ? '✕ Exit Compare' : '⚖️ Compare Mode'}
      </button>
      {compareMode && (
        <div className="compare-controls">
          <select value={compareA} onChange={e => setCompareA(e.target.value)} className="compare-select">
            {allStateIds.map(id => (
              <option key={id} value={id}>{ICONS[id]} {STATES[id].title.split('—')[0].split('(')[0].trim()}</option>
            ))}
          </select>
          <input
            type="range"
            min={0}
            max={100}
            value={morphT}
            onChange={e => setMorphT(+e.target.value)}
            className="morph-slider"
          />
          <select value={compareB} onChange={e => setCompareB(e.target.value)} className="compare-select">
            {allStateIds.map(id => (
              <option key={id} value={id}>{ICONS[id]} {STATES[id].title.split('—')[0].split('(')[0].trim()}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
