import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { calcCurseStones } from '../systems/numberUtils';
import { soundManager } from '../systems/soundManager';
import TooltipWrapper from './TooltipWrapper';
import { Skull, Gem } from 'lucide-react';

export default function PrestigePanel() {
  const totalSE        = useGameStore(s => s.totalSE);
  const curseStones    = useGameStore(s => s.curseStones);
  const prestigePowers = useGameStore(s => s.prestigePowers);
  const prestigeCount  = useGameStore(s => s.prestigeCount);
  const prestige       = useGameStore(s => s.prestige);
  const buyPrestigePower = useGameStore(s => s.buyPrestigePower);
  const [showStore, setShowStore] = useState(false);

  const earned     = calcCurseStones(totalSE);
  const canPrestige = earned > 0;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center gap-2 font-cinzel text-[0.75rem] tracking-[0.2em] uppercase text-blood-light
                      px-4 py-3 border-b border-border bg-black/30">
        <Skull size={18} /> ÖLÜM DÖNGÜSÜ
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        <div className="flex justify-between text-xs text-ink-dim">
          <span>Döngü #{prestigeCount}</span>
          <span className="flex items-center gap-1">Kazanılacak: +{earned} <Gem size={12} className="text-blue-400" /></span>
        </div>

        <TooltipWrapper content={`Döngü Sıfırla\n\nTüm SE, Helper ve Yükseltmeler sıfırlanır.\nKazanılacak Lanet Taşı (💎): ${earned}`}>
          <button
            disabled={!canPrestige}
            onClick={() => {
              if (canPrestige) {
                soundManager.init();
                soundManager.playPrestige();
                prestige();
              }
            }}
            className={`w-full py-3 rounded-md font-cinzel text-sm tracking-widest transition-all duration-200
                        ${canPrestige
                          ? 'bg-gradient-to-br from-blood/30 to-blood-light/20 border border-blood-light text-red-300 anim-prestige hover:shadow-blood-lg'
                          : 'bg-black/40 border border-border text-ink-dim cursor-not-allowed'}`}
          >
            {canPrestige ? '☠ ÖLÜP YENİDEN DOĞ ☠' : 'Güçlen...'}
          </button>
        </TooltipWrapper>

        <button
          onClick={() => setShowStore(!showStore)}
          className="w-full py-2 font-cinzel text-[0.65rem] tracking-widest uppercase
                     border border-border text-ink-dim rounded hover:text-ink
                     hover:border-border-hover transition-colors"
        >
          {showStore ? '▲ Kapat' : '▼ Lanet Taşı Mağazası'}
        </button>

        {showStore && (
          <div className="flex flex-col gap-1.5">
            {prestigePowers.map(p => {
              const state = p.purchased ? 'purchased' : curseStones >= p.cost ? 'available' : 'locked';
              const tooltipText = `${p.name}\n\n${p.description}\nBedel: ${p.cost} 💎`;
              
              return (
                <TooltipWrapper key={p.id} content={tooltipText}>
                  <div
                    onClick={() => {
                      if (!p.purchased && curseStones >= p.cost) {
                        soundManager.init();
                        soundManager.playBuy();
                        buyPrestigePower(p.id);
                      }
                    }}
                    className={`grid grid-cols-[1fr_auto] gap-x-3 gap-y-0.5 px-3 py-2.5 w-full
                                rounded border transition-all duration-150
                                ${state === 'purchased' ? 'border-green/40 bg-green/5 cursor-default' : ''}
                                ${state === 'available' ? 'border-void/40 bg-surface hover:bg-surface-hover hover:border-void/70 cursor-pointer' : ''}
                                ${state === 'locked'    ? 'border-border bg-surface opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <span className="font-cinzel text-[0.75rem] text-void-light">
                      {p.purchased ? '✓ ' : ''}{p.name}
                    </span>
                    <span className={`flex items-center gap-1 font-cinzel text-[0.7rem] row-span-2 self-center text-right
                                      ${state === 'purchased' ? 'text-emerald-400' : 'text-void'}`}>
                      {p.purchased ? 'ALINDI' : <>{p.cost} <Gem size={10} className="text-blue-400" /></>}
                    </span>
                    <span className="text-[0.62rem] text-ink-dim col-start-1">{p.description}</span>
                  </div>
                </TooltipWrapper>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}