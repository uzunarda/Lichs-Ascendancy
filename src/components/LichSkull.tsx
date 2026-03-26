import { useRef, useState, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../systems/soundManager';
import { Skull, Sparkles } from 'lucide-react';

interface Particle { id: number; x: number; y: number; }

export default function LichSkull() {
  const click  = useGameStore(s => s.click);
  const frenzy = useGameStore(s => s.frenzy);
  const ritual = useGameStore(s => s.ritual);
  const [particles, setParticles] = useState<Particle[]>([]);
  const pid = useRef(0);

  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    soundManager.init(); // Initialize audio context on first click
    click();
    
    const isFrenzyActive = frenzy.active && Date.now() < frenzy.endsAt;
    soundManager.playClick(isFrenzyActive);
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const isTouch = 'touches' in e;
    const clientX = isTouch ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = isTouch ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;
    
    // Relative to the container
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const id = pid.current++;
    setParticles(p => [...p, { id, x, y }]);
    setTimeout(() => setParticles(p => p.filter(pt => pt.id !== id)), 800);
  }, [click, frenzy]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      
      soundManager.init();
      click();
      
      const isFrenzyActive = frenzy.active && Date.now() < frenzy.endsAt;
      soundManager.playClick(isFrenzyActive);
      
      // Spawn particle in center for keyboard clicks
      const x = 80; // approx center
      const y = 80;
      const id = pid.current++;
      setParticles(p => [...p, { id, x, y }]);
      setTimeout(() => setParticles(p => p.filter(pt => pt.id !== id)), 800);
    }
  }, [click, frenzy]);

  const isFrenzy     = frenzy.active && Date.now() < frenzy.endsAt;
  const hasRitualMult = ritual.activeMultiplier > 1 && Date.now() < ritual.activeUntil;

  return (
    <div className="flex flex-col items-center gap-4 relative">
      {isFrenzy && (
        <div className="font-cinzel text-xs tracking-widest px-4 py-1.5 rounded
                        bg-orange-500/10 border border-orange-500 text-orange-400 anim-banner-glow">
          ⚡ FRENZY AKTİF ⚡ SE x3
        </div>
      )}
      {hasRitualMult && (
        <div className="font-cinzel text-xs tracking-widest px-4 py-1.5 rounded
                        bg-purple/10 border border-purple-light text-purple-300 anim-banner-glow">
          🔮 RİTÜEL AKTİF 🔮 SE x{ritual.activeMultiplier}
        </div>
      )}

      <div
        className={`relative w-40 h-40 md:w-44 md:h-44 flex items-center justify-center
                    cursor-pointer select-none transition-transform duration-75
                    hover:scale-105 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-full`}
        onClick={handleClick}
        onTouchStart={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="Lich'e tıkla"
      >
        <div className={`relative z-10 
                          text-gold drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]
                          transition-colors duration-300
                          ${isFrenzy ? 'anim-frenzy-pulse !text-orange-400 drop-shadow-[0_0_30px_#ff6b35]' : ''}`}>
          <Skull size={112} strokeWidth={1.5} />
        </div>
        <div className="skull-glow anim-glow-pulse" />
        {particles.map(p => (
          <div key={p.id} className="soul-particle" style={{ left: p.x, top: p.y }}>
            <Sparkles size={20} />
          </div>
        ))}
      </div>

      <span className="font-cinzel text-[0.65rem] tracking-[0.2em] uppercase text-ink-dim">
        Lich'in Taht Odası
      </span>
    </div>
  );
}