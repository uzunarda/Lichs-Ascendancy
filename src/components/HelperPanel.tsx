import { useGameStore, calcHelperContribution } from '../store/gameStore';
import { HELPERS } from '../data/gameData';
import { formatSE, calcHelperCost } from '../systems/numberUtils';
import { soundManager } from '../systems/soundManager';
import TooltipWrapper from './TooltipWrapper';
import { Pickaxe, Swords, Ghost, Droplets, Flame, Orbit, Sparkles } from 'lucide-react';

const getIconForTier = (tier: number) => {
  switch (tier) {
    case 1: return <Pickaxe size={24} />;
    case 2: return <Swords size={24} />;
    case 3: return <Ghost size={24} />;
    case 4: return <Droplets size={24} />;
    case 5: return <Flame size={24} />;
    case 6: return <Orbit size={24} />;
    default: return <Sparkles size={24} />;
  }
};
export default function HelperPanel() {
  const helpers   = useGameStore(s => s.helpers);
  const se        = useGameStore(s => s.se);
  const buyHelper = useGameStore(s => s.buyHelper);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center gap-2 font-cinzel text-[0.85rem] tracking-[0.2em] uppercase text-gold-dim
                      px-4 py-3 border-b border-border bg-black/30">
        <Swords size={18} /> ORDU
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 flex flex-col gap-1">
        {HELPERS.map(h => {
          const count = helpers[h.id] || 0;
          const cost = calcHelperCost(h.baseCost, count);
          const canAfford = se >= cost;
          const pct = ((count % 10) / 10) * 100;
          
          const tooltipText = `${h.name}\n\nSE/sn: +${formatSE(h.baseSEperSec)}\nSahip Olunan: ${count}`;

          return (
            <TooltipWrapper key={h.id} content={tooltipText}>
              <div
                onClick={() => {
                  if (canAfford) {
                    soundManager.playBuy();
                    buyHelper(h.id);
                  }
                }}
                className={`grid grid-cols-[2rem_1fr_auto] gap-2 items-center
                            px-3 py-2.5 rounded-md border transition-all duration-150 cursor-pointer w-full
                            ${canAfford
                              ? 'bg-surface border-border hover:bg-surface-hover hover:border-gold hover:shadow-gold'
                              : 'bg-surface border-border opacity-40 cursor-not-allowed'}`}
              >
                <div className="flex items-center justify-center w-8 h-8 text-gold">
                  {getIconForTier(h.tier)}
                </div>

                <div className="min-w-0">
                  <div className="font-cinzel text-[0.82rem] text-gold leading-tight truncate">{h.name}</div>
                  <div className="flex flex-col gap-0.5 mt-0.5">
                    <span className="text-[0.65rem] text-ink-dim truncate">{h.description}</span>
                    {count > 0 && (
                      <span className="text-[0.60rem] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-sm w-max">
                        +{formatSE(calcHelperContribution(h.id))} SE/sn
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end justify-center min-w-[3.5rem] text-right">
                  <span className="font-cinzel font-bold text-[0.8rem] text-gold">{count}</span>
                  <span className={`text-[0.65rem] ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatSE(cost)} SE
                  </span>
                  <div className="relative h-0.5 w-full bg-white/10 rounded mt-1 overflow-visible">
                    <div className="h-full bg-gold rounded transition-all duration-300" style={{ width: `${pct}%` }} />
                    <span className="absolute -top-3.5 right-0 text-[0.55rem] text-ink-dim whitespace-nowrap">
                      {count % 10}/10
                    </span>
                  </div>
                </div>
              </div>
            </TooltipWrapper>
          );
        })}
      </div>
    </div>
  );
}