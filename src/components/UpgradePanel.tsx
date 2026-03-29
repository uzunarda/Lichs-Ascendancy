import { useGameStore } from '../store/gameStore';
import { formatSE } from '../systems/numberUtils';
import { soundManager } from '../systems/soundManager';
import TooltipWrapper from './TooltipWrapper';
import { Sparkles, Lock, Zap, Ghost, FlaskConical, MousePointer2, Shield } from 'lucide-react';

const CATEGORY_COLOR: Record<string, { border: string, bg: string, text: string, icon: React.ReactNode }> = {
  click:   { border: 'border-amber-900/40', bg: 'bg-amber-900/5', text: 'text-amber-400', icon: <MousePointer2 size={12} /> },
  helper:  { border: 'border-purple-900/40', bg: 'bg-purple-900/5', text: 'text-purple-400', icon: <Ghost size={12} /> },
  synergy: { border: 'border-red-900/40', bg: 'bg-red-900/5', text: 'text-red-500', icon: <Zap size={12} /> },
  ritual:  { border: 'border-indigo-900/40', bg: 'bg-indigo-900/5', text: 'text-indigo-400', icon: <FlaskConical size={12} /> },
  passive: { border: 'border-emerald-900/40', bg: 'bg-emerald-900/5', text: 'text-emerald-400', icon: <Shield size={12} /> },
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
  const locked    = upgrades.filter(u => !u.purchased && !isUnlocked(u.unlockCondition)).slice(0, 3);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 border-b sticky top-0 z-20 backdrop-blur-sm shadow-lg"
        style={{ background: '#0a0608ee', borderColor: '#1e1210' }}
      >
        <div className="flex items-center gap-2 font-cinzel text-xs tracking-[0.3em] uppercase text-[#c9a85c] font-black">
          <Sparkles size={14} className="opacity-70" />
          Kadim Güçler
        </div>
        <span className="text-[9px] text-stone-600 font-bold uppercase tracking-widest">{available.length} Sır Çözüldü</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none p-3 space-y-2">
        {available.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 opacity-30">
            <Lock size={32} className="text-stone-700 mb-3" />
            <p className="text-center text-stone-500 text-[10px] font-cinzel uppercase tracking-widest">
              Daha fazla güç için<br/>ruh toplamaya devam et...
            </p>
          </div>
        )}

        {available.map(u => {
          const canAfford = se >= u.cost;
          const cat = CATEGORY_COLOR[u.category] || CATEGORY_COLOR.click;
          const tooltipText = [
            `**${u.name}**`,
            u.description,
            `---`,
            `Bedel: ${formatSE(u.cost)} SE`,
          ].join('\n');

          return (
            <TooltipWrapper key={u.id} content={tooltipText}>
              <div
                onClick={() => {
                  if (canAfford) { soundManager.playBuy(); buyUpgrade(u.id); }
                }}
                className={[
                  'group relative flex flex-col p-3 border-l-2 rounded-r-sm transition-all duration-300',
                  cat.border, cat.bg,
                  canAfford
                    ? 'cursor-pointer hover:bg-white/[0.04] hover:shadow-lg active:scale-[0.98]'
                    : 'opacity-40 grayscale-[0.6] cursor-not-allowed',
                ].join(' ')}
                style={{ borderRight: '1px solid #1e1210', borderTop: '1px solid #1e1210', borderBottom: '1px solid #1e1210' }}
              >
                <div className="flex items-baseline justify-between gap-2 overflow-hidden">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`${cat.text} opacity-60 group-hover:opacity-100 transition-opacity`}>
                      {cat.icon}
                    </span>
                    <span className={`font-cinzel text-xs md:text-sm font-black leading-tight truncate ${cat.text}`}>
                      {u.name}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black flex-shrink-0 ${canAfford ? 'text-emerald-400' : 'text-red-400/80'}`}>
                    {formatSE(u.cost)} SE
                  </span>
                </div>
                
                <p className="text-[11px] text-stone-400/60 font-medium leading-relaxed mt-1.5 border-t border-white/5 pt-1.5 group-hover:text-stone-300 transition-colors">
                  {u.description}
                </p>

                {/* Subtle highlight bar */}
                <div className={`absolute top-0 right-0 w-[4px] h-0 group-hover:h-full transition-all duration-500 ${cat.text.replace('text', 'bg')} opacity-10`} />
              </div>
            </TooltipWrapper>
          );
        })}

        {/* Locked previews */}
        {locked.length > 0 && (
          <div className="pt-4 pb-10 space-y-2 opacity-30 grayscale pointer-events-none">
            <div className="text-[8px] text-stone-700 uppercase tracking-[0.4em] text-center font-cinzel mb-3">
              — henüz keşfedilmemiş sırlar —
            </div>
            {locked.map(u => (
              <div 
                key={u.id} 
                className="flex items-center gap-3 px-3 py-3 rounded-sm border border-dashed border-stone-800 bg-stone-900/5 overflow-hidden"
              >
                <div className="p-1.5 border border-stone-800 rounded-sm">
                   <Lock size={12} className="text-stone-800" />
                </div>
                <div className="flex-1">
                   <div className="h-1.5 w-24 bg-stone-800 rounded-full mb-1.5" />
                   <div className="h-1 w-full bg-stone-900 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}