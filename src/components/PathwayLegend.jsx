import { PATHWAYS } from '../data/pathways';
import { STATES } from '../data/states';
import { useStore } from '../hooks/useStore';

/** Shows which neural pathways are active in the current state with descriptions */
export default function PathwayLegend() {
  const currentState = useStore(s => s.currentState);
  const state = STATES[currentState];
  if (!state) return null;

  const activeIds = state.activePathways || [];

  return (
    <div className="pathway-legend">
      <h3 className="pathway-legend-title">Neural Pathways</h3>
      {Object.entries(PATHWAYS).map(([id, pw]) => {
        const active = activeIds.includes(id);
        return (
          <div key={id} className={`pathway-item ${active ? 'active' : 'inactive'}`}>
            <div className="pathway-dot" style={{ background: active ? pw.color : 'rgba(100,116,139,0.3)' }} />
            <div className="pathway-info">
              <span className="pathway-name">{pw.name}</span>
              <span className="pathway-desc">{pw.desc}</span>
            </div>
            {active && <span className="pathway-active-badge">ACTIVE</span>}
          </div>
        );
      })}
      <p className="pathway-hint">
        Glowing lines in the 3D view show signal flow between connected regions.
        Particles travel along active pathways.
      </p>
    </div>
  );
}
