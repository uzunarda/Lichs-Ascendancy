import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { RITUALS } from '../data/gameData';
import { formatSE } from '../systems/numberUtils';
import { soundManager } from '../systems/soundManager';
import TooltipWrapper from './TooltipWrapper';
import { Hexagon, Sparkles, XCircle, CheckCircle2 } from 'lucide-react';

export default function RitualPanel() {
  const ritual       = useGameStore(s => s.ritual);
  const se           = useGameStore(s => s.se);
  const performRitual = useGameStore(s => s.performRitual);
  const [lastResult, setLastResult] = useState<{ success: boolean; reward: string } | null>(null);

  const doRitual = (id: string) => {
    soundManager.init();
    const result = performRitual(id);
    soundManager.playRitual(result.success);
    setLastResult(result);
    setTimeout(() => setLastResult(null), 3000);
  };

  return (
    <div className="flex flex-col flex-1 p-4 relative">
      <div className="flex items-center gap-2 font-cinzel text-xs tracking-[0.3em] uppercase text-purple-400 font-black mb-4 px-1">
        <Hexagon size={16} className="text-purple-600 opacity-70" /> 
        Ritüel Meclisi
      </div>

      {!ritual.isActive ? (
        <div className="flex flex-col items-center justify-center gap-4 py-8 bg-purple-900/5 border border-dashed border-purple-900/20 rounded-sm">
          <div className="relative animate-pulse">
             <Hexagon size={48} className="text-purple-900/10" />
             <div className="absolute inset-0 flex items-center justify-center font-cinzel text-xl text-purple-400 font-black">
                {Math.ceil(ritual.countdown)}s
             </div>
          </div>
          <span className="text-[10px] text-stone-600 font-bold uppercase tracking-[0.2em] italic">Karanlık güçler toplanıyor...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5">
          {RITUALS.map(r => {
            const canAfford = se >= r.seCost;
            const tooltipText = [
              `**${r.name}**`,
              r.reward,
              `---`,
              `Maliyet: ${formatSE(r.seCost)} SE`,
              `Başarı Şansı: %${Math.round(r.successChance * 100)}`,
            ].join('\n');

            return (
              <TooltipWrapper key={r.id} content={tooltipText}>
                <button
                  disabled={!canAfford}
                  onClick={() => canAfford && doRitual(r.id)}
                  className={`group relative flex flex-col p-3 rounded-sm border transition-all duration-300 w-full text-left
                              ${canAfford
                                ? 'bg-[#0a0608] border-[#1e1210] hover:border-purple-900/40 hover:bg-purple-900/5 cursor-pointer'
                                : 'bg-[#0a0608] border-stone-900 opacity-40 cursor-not-allowed grayscale'}`}
                >
                  <div className="flex items-center justify-between gap-2 overflow-hidden mb-1">
                    <span className="font-cinzel text-xs md:text-sm text-purple-400 font-black leading-tight group-hover:text-purple-300 transition-colors">
                      {r.name}
                    </span>
                    <span className="text-[9px] text-[#c9a85c] font-black tabular-nums">{formatSE(r.seCost)} SE</span>
                  </div>
                  
                  <div className="flex items-center justify-between gap-1 mt-0.5 border-t border-white/5 pt-1.5">
                    <span className="text-[10px] text-stone-400 font-medium truncate max-w-[70%]">{r.reward}</span>
                    <span className="text-[9px] text-purple-600/60 font-black italic">%{Math.round(r.successChance * 100)}</span>
                  </div>

                  {/* Ritual interaction highlight */}
                  <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </button>
              </TooltipWrapper>
            );
          })}
        </div>
      )}

      {lastResult && (
        <div className={`mt-4 px-4 py-3 rounded-sm border flex items-center gap-3 anim-fade-in shadow-xl
                         ${lastResult.success
                           ? 'bg-emerald-900/10 border-emerald-900/30 text-emerald-400'
                           : 'bg-red-900/10 border-red-900/30 text-red-500'}`}>
          {lastResult.success ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
          <span className="font-cinzel text-[10px] font-black uppercase tracking-widest leading-none">
            {lastResult.success ? 'Karanlık Lütfetti' : 'Varlıklar Reddedildi'}
          </span>
          <span className="text-[10px] ml-auto font-medium">{lastResult.reward}</span>
        </div>
      )}
    </div>
  );
}