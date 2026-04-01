import { STATES } from '../data/states';
import { REGIONS, getStateKey } from '../data/regions';
import { useStore } from '../hooks/useStore';
import PathwayLegend from './PathwayLegend';

export default function InfoPanel() {
  const currentState = useStore(s => s.currentState);
  const hoveredRegion = useStore(s => s.hoveredRegion);
  const state = STATES[currentState];
  if (!state) return null;

  return (
    <div className="panel right-panel">
      {/* State header */}
      <h2 className="info-title" style={{ color: state.accent }}>{state.title}</h2>
      <p className="info-tagline">{state.tagline}</p>

      {/* Hovered region info */}
      {hoveredRegion && REGIONS[hoveredRegion] && (
        <div className="region-tooltip-box" style={{ borderColor: REGIONS[hoveredRegion].color }}>
          <strong>{REGIONS[hoveredRegion].name}</strong>
          <div className="region-role">{REGIONS[hoveredRegion].role}</div>
          <div className="region-activity">
            Activity: {Math.round(state.regionActivity[getStateKey(hoveredRegion)] ?? 0)}%
          </div>
        </div>
      )}

      {/* Key changes */}
      <div className="info-section">
        <h3>Key Changes</h3>
        <div className="key-changes">
          {state.keyChanges.map((c, i) => (
            <span key={i} className="change-tag" style={{ borderColor: state.accent + '66' }}>{c}</span>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="info-section">
        <h3>Insights</h3>
        <ul className="insights-list">
          {state.insights.map((ins, i) => (
            <li key={i}>{ins}</li>
          ))}
        </ul>
      </div>

      {/* Neural pathways legend */}
      <div className="info-section">
        <PathwayLegend />
      </div>

      {/* Region activity bars */}
      <div className="info-section">
        <h3>Region Activity</h3>
        <div className="region-bars">
          {Object.entries(REGIONS).filter(([id]) => !['temporal_r'].includes(id)).map(([id, r]) => {
            const key = getStateKey(id);
            const val = Math.round(state.regionActivity[key] ?? 0);
            return (
              <div key={id} className="region-bar-row">
                <span className="region-bar-label">{r.name.replace(' (L)', '')}</span>
                <div className="region-bar-track">
                  <div
                    className="region-bar-fill"
                    style={{ width: `${val}%`, background: r.color }}
                  />
                </div>
                <span className="region-bar-val">{val}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
