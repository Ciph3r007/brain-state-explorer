import { REGIONS, getStateKey } from '../data/regions';
import { PATHWAYS } from '../data/pathways';
import { STATES } from '../data/states';
import { useStore } from '../hooks/useStore';

/** Expanded detail card when a region is clicked/focused */
export default function RegionDetail() {
  const focusedRegion = useStore(s => s.focusedRegion);
  const currentState = useStore(s => s.currentState);
  const setFocusedRegion = useStore(s => s.setFocusedRegion);

  if (!focusedRegion) return null;

  const region = REGIONS[focusedRegion];
  if (!region) return null;

  const state = STATES[currentState];
  const stateKey = getStateKey(focusedRegion);
  const activity = state?.regionActivity[stateKey] ?? 0;

  // Find pathways this region belongs to
  const connectedPathways = Object.entries(PATHWAYS)
    .filter(([, pw]) => pw.regions.includes(focusedRegion) || pw.regions.includes(stateKey))
    .map(([id, pw]) => ({ id, ...pw, active: state?.activePathways?.includes(id) }));

  return (
    <div className="region-detail" style={{ borderColor: region.color }}>
      <div className="region-detail-header">
        <h3 style={{ color: region.color }}>{region.name}</h3>
        <button className="region-detail-close" onClick={() => setFocusedRegion(null)}>✕</button>
      </div>
      <p className="region-detail-role">{region.role}</p>

      {/* Activity meter */}
      <div className="region-detail-meter">
        <span className="region-detail-label">Activity in {state?.title?.split('—')[0]?.trim()}</span>
        <div className="region-detail-bar-track">
          <div
            className="region-detail-bar-fill"
            style={{ width: `${activity}%`, background: region.color }}
          />
        </div>
        <span className="region-detail-val">{Math.round(activity)}%</span>
      </div>

      {/* Activity interpretation */}
      <div className="region-detail-interp">
        {activity >= 80 ? 'Hyperactive — this region is driving the current state' :
         activity >= 60 ? 'Elevated — above normal baseline' :
         activity >= 40 ? 'Moderate — near baseline levels' :
         activity >= 20 ? 'Suppressed — below normal function' :
         'Nearly offline — severely reduced activity'}
      </div>

      {/* Connected pathways */}
      {connectedPathways.length > 0 && (
        <div className="region-detail-pathways">
          <span className="region-detail-label">Connected Circuits</span>
          {connectedPathways.map(pw => (
            <div key={pw.id} className={`region-detail-pw ${pw.active ? 'active' : ''}`}>
              <span className="pw-dot" style={{ background: pw.color }} />
              <span>{pw.name}</span>
              {pw.active && <span className="pw-active">active</span>}
            </div>
          ))}
        </div>
      )}

      <p className="region-detail-tip">Click another region or click again to unfocus</p>
    </div>
  );
}
