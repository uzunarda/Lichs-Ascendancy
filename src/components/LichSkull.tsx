import { useRef, useState, useCallback, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../systems/soundManager';
import { Skull, Sparkles, Zap, Flame } from 'lucide-react';

interface Particle { id: number; x: number; y: number; }

export default function LichSkull() {
  const click  = useGameStore(s => s.click);
  const frenzy = useGameStore(s => s.frenzy);
  const ritual = useGameStore(s => s.ritual);
  const [particles, setParticles] = useState<Particle[]>([]);
  const pid = useRef(0);

  const isFrenzyActive = frenzy.active && Date.now() < frenzy.endsAt;
  const isRitualActive = ritual.activeMultiplier > 1 && Date.now() < ritual.activeUntil;

  const handleClick = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    soundManager.init();
    click();
    soundManager.playClick(isFrenzyActive);
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const id = pid.current++;
    setParticles(p => [...p, { id, x, y }]);
    setTimeout(() => setParticles(p => p.filter(pt => pt.id !== id)), 800);
  }, [click, isFrenzyActive]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.repeat) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      soundManager.init();
      click();
      soundManager.playClick(isFrenzyActive);
      
      const x = 90;
      const y = 90;
      const id = pid.current++;
      setParticles(p => [...p, { id, x, y }]);
      setTimeout(() => setParticles(p => p.filter(pt => pt.id !== id)), 800);
    }
  }, [click, isFrenzyActive]);

  return (
    <div className="flex flex-col items-center gap-6 relative">
      <div className="flex flex-col gap-2 absolute -top-16 left-1/2 -translate-x-1/2 w-max z-20">
        {isFrenzyActive && (
          <div className="font-cinzel text-[10px] tracking-[0.3em] font-black px-4 py-2 rounded-sm
                          bg-red-950/20 border border-red-900/40 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)] animate-in slide-in-from-top-4 duration-500 flex items-center gap-2">
            <Zap size={12} className="animate-pulse" /> ÖFKE AKTİF: SE x3
          </div>
        )}
        {isRitualActive && (
          <div className="font-cinzel text-[10px] tracking-[0.3em] font-black px-4 py-2 rounded-sm
                          bg-purple-950/20 border border-purple-900/40 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.1)] animate-in slide-in-from-top-4 duration-500 flex items-center gap-2">
            <Sparkles size={12} className="animate-pulse" /> RİTÜEL AKTİF: SE x{ritual.activeMultiplier}
          </div>
        )}
      </div>

      <div
        className={`relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center
                    cursor-pointer select-none transition-all duration-150
                    hover:scale-105 active:scale-95 outline-none group z-10`}
        onPointerDown={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Lich'e tıkla"
      >
        {/* Decorative Circles */}
        <div className="absolute inset-0 rounded-full border border-[#1e1210] opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="absolute inset-4 rounded-full border border-[#1e1210] opacity-10 group-hover:opacity-30 transition-opacity scale-90 group-active:scale-110 duration-500" />
        
        {/* The Skull */}
        <div className="relative z-10">
          <Skull
            size={120}
            strokeWidth={1}
            className={`transition-all duration-300 drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]
                        ${isFrenzyActive ? 'text-red-700 animate-pulse' : 'text-stone-700 group-hover:text-stone-400'}`}
          />
          
          {/* Eyes Glow */}
          <div className={`absolute top-[35%] left-[28%] w-2 h-2 rounded-full blur-[2px] transition-all duration-500
                          ${isFrenzyActive ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-stone-900 shadow-none opacity-0 group-hover:opacity-100 group-hover:bg-[#c9a85c44]'}`} />
          <div className={`absolute top-[35%] right-[28%] w-2 h-2 rounded-full blur-[2px] transition-all duration-500
                          ${isFrenzyActive ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-stone-900 shadow-none opacity-0 group-hover:opacity-100 group-hover:bg-[#c9a85c44]'}`} />
        </div>

        {/* Ambient Pulse Glow */}
        <div className={`absolute inset-0 rounded-full blur-3xl transition-colors duration-1000 -z-10
                        ${isFrenzyActive ? 'bg-red-950/20' : 'bg-amber-950/5 group-hover:bg-amber-950/10'}`} />

        {/* Soul Particles */}
        {particles.map(p => (
          <div key={p.id} className="soul-particle" style={{ left: p.x, top: p.y }}>
            <div className="relative">
               <div className="absolute inset-0 bg-stone-300 blur-[4px] rounded-full animate-ping opacity-20" />
               <Sparkles size={16} className="text-stone-400 opacity-60" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-1 opacity-40 group-hover:opacity-80 transition-opacity">
         <span className="font-cinzel text-[9px] tracking-[0.5em] uppercase text-[#c9a85c] font-black">LİCH KATEDRALİ</span>
         <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#1e1210]" />
            <span className="text-[8px] text-stone-700 font-bold uppercase tracking-widest">Karanlıkta mırıldanmalar...</span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#1e1210]" />
         </div>
      </div>

      <style>{`
        .soul-particle {
          position: absolute;
          pointer-events: none;
          animation: soul-fly 0.8s ease-out forwards;
          z-index: 50;
        }
        @keyframes soul-fly {
          0% { transform: translate(0, 0) scale(1); opacity: 1; filter: blur(0); }
          100% { transform: translate(var(--tw-translate-x, -20px), -100px) scale(0.5); opacity: 0; filter: blur(4px); }
        }
      `}</style>
    </div>
  );
}