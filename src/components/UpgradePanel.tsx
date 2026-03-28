import { useGameStore } from '../store/gameStore';
import { formatSE } from '../systems/numberUtils';
import { soundManager } from '../systems/soundManager';
import TooltipWrapper from './TooltipWrapper';
import { Sparkles } from 'lucide-react';

const CATEGORY_COLOR: Record<string, string> = {
  click:   'border-l-gold bg-gold/5',
  helper:  'border-l-purple-light bg-purple/5',
  synergy: 'border-l-blood-light bg-blood/5',
  ritual:  'border-l-void bg-purple/5',
  passive: 'border-l-green bg-green/5',
};

const CATEGORY_TEXT: Record<string, string> = {
  click:   'text-gold',
  helper:  'text-purple-light',
  synergy: 'text-blood-light',
  ritual:  'text-void',
  passive: 'text-green',
};

export default function UpgradePanel() {
  const upgrades    = useGameStore(s => s.upgrades);
  const helpers     = useGameStore(s => s.helpers);
  const se          = useGameStore(s => s.se);
  const totalClicks = useGameStore(s => s.totalClicks);
  const buyUpgrade  = useGameStore(s => s.buyUpgrade);

  const isUnlocked = (condition: string) => {
    try {
      const expr = condition
        .replace(/\bse\b/g, String(se))
        .replace(/totalClicks/g, String(totalClicks))
        .replace(/([a-z_]+)>=/g, (_, id) => `${helpers[id] ?? 0}>=`);
      return new Function(`return ${expr}`)();
    } catch { return false; }
  };

  const available = upgrades.filter(u => !u.purchased && isUnlocked(u.unlockCondition));
  const locked    = upgrades.filter(u => !u.purchased && !isUnlocked(u.unlockCondition)).slice(0, 5);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-black/40">
        <div className="flex items-center gap-2 font-cinzel text-xs tracking-[0.25em] uppercase text-gold-dim">
          <Sparkles size={14} /> Yükseltimler
        </div>
        <span className="text-[0.6rem] text-ink-dim italic">{available.length} mevcut</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {available.length === 0 && (
          <p className="text-center text-ink-dim text-xs italic p-6 opacity-60">
            ☠ Daha fazla güç için ilerle...
          </p>
        )}

        {available.map(u => {
          const canAfford = se >= u.cost;
          const tooltipText = `${u.name}\n\n${u.description}\n\nBedel: ${formatSE(u.cost)} SE`;

          return (
            <TooltipWrapper key={u.id} content={tooltipText}>
              <div
                onClick={() => {
                  if (canAfford) { soundManager.playBuy(); buyUpgrade(u.id); }
                }}
                className={[
                  'flex items-center gap-2 px-3 py-2 rounded border border-border border-l-2 transition-all duration-150 cursor-pointer',
                  CATEGORY_COLOR[u.category] ?? '',
                  canAfford
                    ? 'hover:brightness-110 hover:shadow-sm active:scale-[0.99]'
                    : 'opacity-40 cursor-not-allowed',
                ].join(' ')}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 justify-between">
                    <span className={`font-cinzel text-sm font-bold leading-tight ${CATEGORY_TEXT[u.category] ?? 'text-gold'}`}>
                      {u.name}
                    </span>
                    <span className={`text-[0.7rem] font-bold flex-shrink-0 ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>
                      {formatSE(u.cost)} SE
                    </span>
                  </div>
                  <p className="text-[0.65rem] text-ink-dim leading-snug mt-0.5 truncate">
                    {u.description}
                  </p>
                </div>
              </div>
            </TooltipWrapper>
          );
        })}

        {/* Locked previews */}
        {locked.length > 0 && (
          <>
            <div className="text-[0.6rem] text-ink-dim/40 uppercase tracking-widest text-center py-2 font-cinzel">
              — kilitli —
            </div>
            {locked.map(u => (
              <div key={u.id} className="flex items-center gap-2 px-3 py-2 rounded border border-border/30 opacity-20 cursor-default">
                <div className="font-cinzel text-xs text-ink">??? {u.category}</div>
                <div className="text-[0.6rem] text-ink-dim ml-auto">Kilit açmak için ilerle</div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}