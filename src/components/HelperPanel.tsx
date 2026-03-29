import { useGameStore, calcHelperContribution } from '../store/gameStore';
import { HELPERS, REGIONS } from '../data/gameData';
import { formatSE, calcHelperCost } from '../systems/numberUtils';
import { soundManager } from '../systems/soundManager';
import TooltipWrapper from './TooltipWrapper';
import { Swords, MousePointer2, Sparkles, Gem, Zap, Flame, Snowflake, Ghost } from 'lucide-react';

const TIER_COLORS = [
  { icon: 'text-amber-400', bg: 'bg-amber-900/10', border: 'border-amber-700/20', bar: 'from-amber-600/40 to-amber-400/60' },
  { icon: 'text-red-400', bg: 'bg-red-900/10', border: 'border-red-700/20', bar: 'from-red-600/40 to-red-400/60' },
  { icon: 'text-purple-400', bg: 'bg-purple-900/10', border: 'border-purple-700/20', bar: 'from-purple-600/40 to-purple-400/60' },
  { icon: 'text-blue-400', bg: 'bg-blue-900/10', border: 'border-blue-700/20', bar: 'from-blue-600/40 to-blue-400/60' },
  { icon: 'text-orange-400', bg: 'bg-orange-900/10', border: 'border-orange-700/20', bar: 'from-orange-600/40 to-orange-400/60' },
  { icon: 'text-cyan-400', bg: 'bg-cyan-900/10', border: 'border-cyan-700/20', bar: 'from-cyan-600/40 to-cyan-400/60' },
  { icon: 'text-pink-400', bg: 'bg-pink-900/10', border: 'border-pink-700/20', bar: 'from-pink-600/40 to-pink-400/60' },
];

const getIconForTier = (tier: number) => {
  const cls = 'w-5 h-5';
  switch (tier) {
    case 1: return <Gem className={cls} />;
    case 2: return <Swords className={cls} />;
    case 3: return <Ghost className={cls} />;
    case 4: return <Snowflake className={cls} />;
    case 5: return <Flame className={cls} />;
    case 6: return <Zap className={cls} />;
    default: return <Sparkles className={cls} />;
  }
};

export default function HelperPanel() {
  const helpers = useGameStore(s => s.helpers);
  const se = useGameStore(s => s.se);
  const buyHelper = useGameStore(s => s.buyHelper);
  const currentRegionIndex = useGameStore(s => s.currentRegionIndex);
  const prestigePowersDC = useGameStore(s => s.prestigePowersDC);

  const currentRegion = REGIONS[currentRegionIndex];
  let regionCostMult = 1;
  if (currentRegion?.bonus?.type === 'cost') {
    regionCostMult = currentRegion.bonus.value;
  }

  const hasMonarch = prestigePowersDC.find(p => p.id === 'monarch_authority' && p.purchased);
  const totalDiscount = (hasMonarch ? 0.8 : 1) * regionCostMult;

  return (
    <div className="flex flex-col flex-1 overflow-hidden relative">
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 border-b sticky top-0 z-20 backdrop-blur-sm shadow-lg"
        style={{ background: '#0a0608ee', borderColor: '#1e1210' }}
      >
        <div className="flex items-center gap-2 font-cinzel text-xs tracking-[0.3em] uppercase text-[#c9a85c] font-black">
          <Swords size={14} className="opacity-70" />
          Ordu Meclisi
        </div>
        
        {regionCostMult < 1 ? (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-sm border border-emerald-900/40 bg-emerald-500/5">
             <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
             <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">
                -%{Math.round((1 - regionCostMult) * 100)} İndirim
             </span>
          </div>
        ) : (
          <span className="text-[9px] text-stone-600 font-bold uppercase tracking-widest">Karanlık Orduyu Kur</span>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-none pb-10">
        {HELPERS.map((h, idx) => {
          const count = helpers[h.id] || 0;
          const baseCost = calcHelperCost(h.baseCost, count);
          const cost = Math.floor(baseCost * totalDiscount);
          const canAfford = se >= cost;
          const pct = ((count % 10) / 10) * 100;
          const tier = TIER_COLORS[(h.tier - 1) % TIER_COLORS.length];
          const contribution = count > 0 ? calcHelperContribution(h.id) : 0;

          const tooltipText = [
            `**${h.name}**`,
            h.description,
            `---`,
            `Maliyet: ${formatSE(cost)} SE`,
            count > 0 ? `Katkı: +${formatSE(contribution)} SE/sn` : '*Henüz uyandırılmadı*',
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
                  'group relative flex items-center gap-4 px-4 py-3.5 border-b border-[#1e1210]',
                  'transition-all duration-300 select-none overflow-hidden hover:z-10',
                  canAfford
                    ? 'cursor-pointer hover:bg-white/[0.03] active:scale-[0.99]'
                    : 'cursor-not-allowed opacity-40 grayscale-[0.5]',
                  idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]',
                ].join(' ')}
              >
                {/* Visual Accent */}
                <div className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-300 ${tier.icon} opacity-20 group-hover:opacity-100 group-hover:shadow-[0_0_8px_currentColor]`} />

                {/* Left Side: Avatar/Icon */}
                <div className="relative">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-sm border transition-all duration-300 ${tier.bg} ${tier.border} ${canAfford ? 'group-hover:border-white/20' : ''}`}>
                    <div className={`${tier.icon} opacity-80 group-hover:opacity-100 transition-opacity`}>
                      {getIconForTier(h.tier)}
                    </div>
                  </div>
                  {/* Upgrade progress indicator (tiny circle) */}
                  <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-[#0d0809] border border-[#1e1210]">
                     <span className="text-[8px] font-bold text-stone-500">{count % 10}</span>
                  </div>
                </div>

                {/* Center: Info */}
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-cinzel text-[13px] font-black tracking-wide text-stone-200 group-hover:text-white transition-colors truncate">
                      {h.name}
                    </span>
                    {(h.baseClickPower || h.cpsMultiplier) && (
                      <MousePointer2 size={10} className="text-amber-500/60" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold ${canAfford ? 'text-emerald-400' : 'text-red-400/80'} transition-colors`}>
                      {formatSE(cost)} SE
                    </span>
                    {count > 10 && (
                       <span className="text-[9px] text-stone-600 font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                         lvl {Math.floor(count / 10)}
                       </span>
                    )}
                  </div>
                  
                  {count > 0 && (
                     <div className="w-full h-[1px] bg-white/5 mt-1 relative overflow-hidden">
                        <div 
                          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${tier.bar} transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                     </div>
                  )}
                </div>

                {/* Right Side: Stats */}
                <div className="flex flex-col items-end flex-shrink-0 min-w-[4rem]">
                   <div className="text-2xl font-cinzel font-black text-stone-800/80 group-hover:text-[#c9a85c20] transition-colors leading-none">
                      {count}
                   </div>
                   {count > 0 && (
                      <span className={`text-[9px] font-black mt-1 ${tier.icon} opacity-80`}>
                        +{formatSE(contribution)}/sn
                      </span>
                   )}
                </div>

                {/* Subtle affordance hint */}
                <div className="absolute right-1 top-1 text-[8px] text-stone-800 opacity-0 group-hover:opacity-100 font-bold uppercase tracking-tighter select-none pointer-events-none">
                  Ritüel Yap
                </div>
              </div>
            </TooltipWrapper>
          );
        })}
      </div>
    </div>
  );
}