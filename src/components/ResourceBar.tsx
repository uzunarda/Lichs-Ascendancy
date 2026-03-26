import { useEffect, useState } from 'react';
import { useGameStore, calcCurrentSEperSec } from '../store/gameStore';
import { formatSE } from '../systems/numberUtils';

export default function ResourceBar() {
  const se         = useGameStore(s => s.se);
  const curseStones = useGameStore(s => s.curseStones);
  const [sePerSec, setSePerSec] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSePerSec(calcCurrentSEperSec()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative z-10 flex items-center justify-center gap-8 px-6 py-3
                    bg-gradient-to-b from-black/90 to-black/80 border-b border-border
                    backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="font-cinzel text-[0.75rem] tracking-[0.15em] uppercase text-ink-dim">Ruh Özü</span>
        <span className="font-cinzel text-lg font-bold text-gold text-shadow-gold">{formatSE(se)} SE</span>
        <span className="text-xs text-ink-dim italic">+{formatSE(sePerSec)}/sn</span>
      </div>

      <span className="text-xl text-ink-dim opacity-40">☠</span>

      <div className="flex items-center gap-3">
        <span className="font-cinzel text-[0.75rem] tracking-[0.15em] uppercase text-ink-dim">Lanet Taşı</span>
        <span className="font-cinzel text-lg font-bold text-void">{curseStones} 💎</span>
      </div>
    </div>
  );
}