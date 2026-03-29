import React from 'react';
import { useGameStore } from '../store/gameStore';
import { BOSSES } from '../data/bossData';
import { Swords, Timer, Skull, XCircle, CheckCircle2 } from 'lucide-react';
import RuneCorner from './shared/RuneCorner';

export default function BossBanner() {
  const bossFight = useGameStore(s => s.bossFight);
  const { activeBossId, currentHp, timeLeft, isVictory, isDefeat } = bossFight;

  if (!activeBossId) return null;

  const boss = BOSSES.find(b => b.id === activeBossId);
  if (!boss) return null;

  const hpPercent = Math.max(0, (currentHp / boss.maxHp) * 100);
  const timePercent = Math.max(0, (timeLeft / boss.timeLimit) * 100);

  return (
    <div className="fixed top-0 left-0 w-full z-[200] px-4 py-6 pointer-events-none">
      <div 
        className="max-w-xl mx-auto border shadow-2xl p-5 pointer-events-auto animate-in slide-in-from-top-12 duration-500 relative overflow-hidden rounded-sm"
        style={{ background: '#0a0608', borderColor: '#1e1210' }}
      >
        <RuneCorner position="top-left" opacity={0.4} size={32} />
        <RuneCorner position="top-right" opacity={0.4} size={32} />
        <RuneCorner position="bottom-left" opacity={0.4} size={32} />
        <RuneCorner position="bottom-right" opacity={0.4} size={32} />

        {/* Time Progress Bar (Top) */}
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
          <div 
            className="h-full bg-red-900 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(239,68,68,0.3)]" 
            style={{ width: `${timePercent}%` }}
          ></div>
        </div>

        {/* Boss Info */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-2 border border-red-900/40 bg-red-950/10 rounded-sm">
              <Skull className="text-red-600 w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-cinzel text-sm md:text-base font-black text-stone-200 tracking-[0.3em] uppercase leading-none">
                {boss.name}
              </h2>
              <p className="text-[10px] text-stone-500 mt-1 font-black tracking-widest uppercase italic line-clamp-1 max-w-[200px]">
                {boss.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 text-red-500 font-cinzel font-black text-xl tracking-tighter tabular-nums drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]">
              <Timer className="w-4 h-4 opacity-50" />
              <span>{Math.ceil(timeLeft)}s</span>
            </div>
            <div className="text-[8px] text-stone-700 font-black uppercase tracking-[0.3em]">Mühür Suresi</div>
          </div>
        </div>

        {/* HP Bar */}
        <div className="relative z-10">
          <div className="h-6 bg-black border border-white/5 p-0.5 rounded-sm overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-900 via-red-600 to-red-900 transition-all duration-300 ease-out relative"
              style={{ width: `${hpPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] font-black text-white/90 font-cinzel tracking-[0.2em] tabular-nums drop-shadow-md">
               {Math.floor(currentHp).toLocaleString()} <span className="text-red-900/60 mx-1">/</span> {boss.maxHp.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Victory/Defeat Overlays */}
        {isVictory && (
          <div className="absolute inset-0 z-20 bg-[#0d0809] border-2 border-emerald-900/60 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 shadow-[inset_0_0_60px_rgba(16,185,129,0.1)]">
            <CheckCircle2 size={40} className="text-emerald-500 mb-2" />
            <h3 className="text-3xl font-black text-emerald-400 font-cinzel tracking-[0.4em] uppercase drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              ZAFER
            </h3>
            <p className="text-[10px] font-cinzel text-emerald-600 tracking-[0.3em] font-black mt-1 uppercase">Karanlık Lütfetti</p>
          </div>
        )}
        {isDefeat && (
          <div className="absolute inset-0 z-20 bg-[#0d0809] border-2 border-red-900/60 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 shadow-[inset_0_0_60px_rgba(239,68,68,0.1)]">
            <XCircle size={40} className="text-red-700 mb-2" />
            <h3 className="text-3xl font-black text-red-600 font-cinzel tracking-[0.3em] uppercase drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]">
              BOZGUN
            </h3>
            <p className="text-[10px] font-cinzel text-red-900 tracking-[0.3em] font-black mt-1 uppercase">Yetersiz Kurban</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shimmer {
          from { transform: translateX(-100%) skewX(-20deg); }
          to { transform: translateX(200%) skewX(-20deg); }
        }
      `}</style>
    </div>
  );
}
