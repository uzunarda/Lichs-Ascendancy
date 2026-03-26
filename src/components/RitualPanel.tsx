import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { RITUALS } from '../data/gameData';
import { formatSE } from '../systems/numberUtils';

export default function RitualPanel() {
  const ritual       = useGameStore(s => s.ritual);
  const se           = useGameStore(s => s.se);
  const performRitual = useGameStore(s => s.performRitual);
  const [lastResult, setLastResult] = useState<{ success: boolean; reward: string } | null>(null);

  const doRitual = (id: string) => {
    const result = performRitual(id);
    setLastResult(result);
    setTimeout(() => setLastResult(null), 3000);
  };

  return (
    <div className="w-full max-w-lg bg-black/40 border border-border rounded-lg p-4">
      <div className="font-cinzel text-[0.85rem] tracking-[0.2em] uppercase text-gold-dim mb-3">
        ⬡ RİTÜEL SİSTEMİ
      </div>

      {!ritual.isActive ? (
        <div className="flex flex-col items-center gap-2 py-3">
          <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center
                          font-cinzel text-lg text-ink-dim anim-glow-pulse">
            {Math.ceil(ritual.countdown)}s
          </div>
          <span className="text-xs text-ink-dim italic">Bir sonraki ritüele kadar</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 xs:grid-cols-2 gap-2">
          {RITUALS.map(r => {
            const canAfford = se >= r.seCost;
            return (
              <button
                key={r.id}
                disabled={!canAfford}
                onClick={() => canAfford && doRitual(r.id)}
                className={`flex flex-col gap-1 p-3 rounded-md border text-left transition-all duration-150
                            ${canAfford
                              ? 'bg-surface border-border hover:bg-surface-hover hover:border-border-hover cursor-pointer'
                              : 'bg-surface border-border opacity-40 cursor-not-allowed'}`}
              >
                <span className="font-cinzel text-[0.82rem] text-gold">{r.name}</span>
                <span className="text-[0.75rem] text-ink-dim">{formatSE(r.seCost)} SE</span>
                <span className="text-[0.72rem] text-ink-dim">%{Math.round(r.successChance * 100)} şans</span>
                <span className="text-[0.72rem] text-void italic">{r.reward}</span>
              </button>
            );
          })}
        </div>
      )}

      {lastResult && (
        <div className={`mt-3 px-4 py-2 rounded text-center font-cinzel text-xs anim-fade-in
                         ${lastResult.success
                           ? 'bg-green/20 border border-green text-emerald-400'
                           : 'bg-blood/20 border border-blood text-red-400'}`}>
          {lastResult.success ? '✦ ' : '✗ '}{lastResult.reward}
        </div>
      )}
    </div>
  );
}