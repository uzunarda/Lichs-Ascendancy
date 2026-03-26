import { useGameStore } from '../store/gameStore';
import { HELPERS } from '../data/gameData';
import { formatSE, calcHelperCost } from '../systems/numberUtils';

const ICONS = ['☠', '⚔', '🧟', '🦇', '🔮', '👹', '🌑'];

export default function HelperPanel() {
  const helpers   = useGameStore(s => s.helpers);
  const se        = useGameStore(s => s.se);
  const buyHelper = useGameStore(s => s.buyHelper);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="font-cinzel text-[0.85rem] tracking-[0.2em] uppercase text-gold-dim
                      px-4 py-3 border-b border-border bg-black/30">
        ⚔ ORDU
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 flex flex-col gap-1">
        {HELPERS.map(h => {
          const count      = helpers[h.id] ?? 0;
          const cost       = calcHelperCost(h.baseCost, count);
          const canAfford  = se >= cost;
          const pct        = ((count % 10) / 10) * 100;

          return (
            <div
              key={h.id}
              onClick={() => canAfford && buyHelper(h.id)}
              className={`grid grid-cols-[2rem_1fr_auto] gap-2 items-center
                          px-3 py-2.5 rounded-md border transition-all duration-150 cursor-pointer
                          ${canAfford
                            ? 'bg-surface border-border hover:bg-surface-hover hover:border-border-hover'
                            : 'bg-surface border-border opacity-40 cursor-not-allowed'}`}
            >
              <span className="text-xl text-center">{ICONS[h.tier] ?? '☠'}</span>

              <div className="min-w-0">
                <div className="font-cinzel text-[0.82rem] text-gold leading-tight truncate">{h.name}</div>
                <div className="text-[0.72rem] text-ink-dim italic truncate">{h.special}</div>
              </div>

              <div className="text-right min-w-[60px]">
                <div className="font-cinzel text-sm text-ink">{count}</div>
                <div className="text-[0.75rem] text-ink-dim">{formatSE(cost)}</div>
                <div className="relative h-0.5 bg-white/10 rounded mt-1 overflow-visible">
                  <div className="h-full bg-gold rounded transition-all duration-300" style={{ width: `${pct}%` }} />
                  <span className="absolute -top-3.5 right-0 text-[0.6rem] text-ink-dim whitespace-nowrap">
                    {count % 10}/10
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}