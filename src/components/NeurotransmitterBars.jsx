import { NEUROTRANSMITTERS } from '../data/neurotransmitters';
import { useStore } from '../hooks/useStore';

export default function NeurotransmitterBars() {
  const getEffectiveState = useStore(s => s.getEffectiveState);
  const state = getEffectiveState();
  if (!state) return null;

  return (
    <div className="nt-bar-container">
      {NEUROTRANSMITTERS.map(nt => {
        const val = Math.round(state.nt[nt.id] ?? 50);
        return (
          <div key={nt.id} className="nt-bar-item">
            <div className="nt-bar-track">
              <div
                className="nt-bar-fill"
                style={{ height: `${val}%`, background: nt.color }}
              />
            </div>
            <span className="nt-bar-label">{nt.name}</span>
            <span className="nt-bar-val">{val}</span>
          </div>
        );
      })}
    </div>
  );
}
