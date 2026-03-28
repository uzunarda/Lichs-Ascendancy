import { useGameStore, calcHelperContribution } from '../store/gameStore';
import { HELPERS } from '../data/gameData';
import { formatSE, calcHelperCost } from '../systems/numberUtils';
import { soundManager } from '../systems/soundManager';
import TooltipWrapper from './TooltipWrapper';
import { Pickaxe, Swords, Ghost, Droplets, Flame, Orbit, Sparkles } from 'lucide-react';

const TIER_COLORS = [
  'text-amber-400 bg-amber-900/30 border-amber-700/30',
  'text-red-400 bg-red-900/30 border-red-700/30',
  'text-purple-400 bg-purple-900/30 border-purple-700/30',
  'text-blue-400 bg-blue-900/30 border-blue-700/30',
  'text-orange-400 bg-orange-900/30 border-orange-700/30',
  'text-cyan-400 bg-cyan-900/30 border-cyan-700/30',
  'text-pink-400 bg-pink-900/30 border-pink-700/30',
];

const getIconForTier = (tier: number) => {
  const cls = 'w-5 h-5';
  switch (tier) {
    case 1: return <Pickaxe className={cls} />;
    case 2: return <Swords className={cls} />;
    case 3: return <Ghost className={cls} />;
    case 4: return <Droplets className={cls} />;
    case 5: return <Flame className={cls} />;
    case 6: return <Orbit className={cls} />;
    default: return <Sparkles className={cls} />;
  }
};

export default function HelperPanel() {
  const helpers   = useGameStore(s => s.helpers);
  const se        = useGameStore(s => s.se);
  const buyHelper = useGameStore(s => s.buyHelper);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-black/40">
        <div className="flex items-center gap-2 font-cinzel text-xs tracking-[0.25em] uppercase text-gold-dim">
          <Swords size={14} /> Ordu
        </div>
        <span className="text-[0.6rem] text-ink-dim italic">tıkla → satın al</span>
      </div>

      {/* Units List */}
      <div className="flex-1 overflow-y-auto">
        {HELPERS.map((h, idx) => {
          const count     = helpers[h.id] || 0;
          const cost      = calcHelperCost(h.baseCost, count);
          const canAfford = se >= cost;
          const pct       = ((count % 10) / 10) * 100;
          const tierColor = TIER_COLORS[(h.tier - 1) % TIER_COLORS.length];
          const contribution = count > 0 ? calcHelperContribution(h.id) : 0;

          const tooltipText = [
            h.name,
            '',
            h.description,
            '',
            `Maliyet: ${formatSE(cost)} SE`,
            count > 0 ? `Katkı: +${formatSE(contribution)} SE/sn` : 'Henüz alınmadı',
            `Sonraki bonus: ${10 - (count % 10)} adet sonra`,
          ].join('\n');

          return (
            <TooltipWrapper key={h.id} content={tooltipText}>
              <div
                onClick={() => {
                  if (canAfford) {
                    soundManager.playBuy();
                    buyHelper(h.id);
                  }
                }}
                className={[
                  'flex items-center gap-3 px-3 py-2.5 border-b border-border/40',
                  'transition-colors duration-100 select-none relative',
                  canAfford
                    ? 'cursor-pointer hover:bg-white/[0.04] active:bg-gold/[0.06]'
                    : 'cursor-not-allowed opacity-40',
                  idx % 2 === 0 ? 'bg-black/10' : 'bg-black/20',
                ].join(' ')}
              >
                {/* Tier Icon */}
                <div className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded border ${tierColor}`}>
                  {getIconForTier(h.tier)}
                </div>

                {/* Name + Description + Progress */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-baseline gap-2">
                    <span className="font-cinzel text-sm font-bold text-ink leading-none truncate">
                      {h.name}
                    </span>
                    {count > 0 && (
                      <span className="text-[0.6rem] text-emerald-400 font-medium whitespace-nowrap">
                        +{formatSE(contribution)}/sn
                      </span>
                    )}
                  </div>
                  <span className="text-[0.65rem] text-ink-dim leading-tight mt-0.5 truncate">
                    {h.description}
                  </span>

                  {/* Progress bar towards next milestone */}
                  {count > 0 && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gold/50 to-gold rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[0.55rem] text-ink-dim whitespace-nowrap">{count % 10}/10</span>
                    </div>
                  )}
                </div>

                {/* Cost + Count */}
                <div className="flex-shrink-0 flex flex-col items-end justify-center gap-0.5 min-w-[4rem]">
                  <span className="font-cinzel font-black text-2xl text-white/30 leading-none">
                    {count}
                  </span>
                  <span className={`text-[0.7rem] font-bold leading-none ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>
                    {formatSE(cost)} SE
                  </span>
                </div>
              </div>
            </TooltipWrapper>
          );
        })}
      </div>
    </div>
  );
}