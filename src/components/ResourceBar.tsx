import { useEffect, useState } from 'react';
import { Save, Globe, Settings } from 'lucide-react';
import { useGameStore, calcCurrentSEperSec } from '../store/gameStore';
import { formatSE } from '../systems/numberUtils';

interface Props {
  onOpenWorlds?: () => void;
  onOpenSettings?: () => void;
}

export default function ResourceBar({ onOpenWorlds, onOpenSettings }: Props) {
  const se         = useGameStore(s => s.se);
  const curseStones = useGameStore(s => s.curseStones);
  const saveGame   = useGameStore(s => s.saveGame);
  const [sePerSec, setSePerSec] = useState(0);
  const [saveAnim, setSaveAnim] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setSePerSec(calcCurrentSEperSec()), 1000);
    return () => clearInterval(id);
  }, []);

  const handleSave = () => {
    saveGame();
    setSaveAnim(true);
    setTimeout(() => setSaveAnim(false), 1000);
  };

  return (
    <div className="relative z-10 flex flex-col md:flex-row items-center justify-center md:gap-8 px-2 md:px-6 py-2 md:py-3
                    bg-gradient-to-b from-black/95 to-black/80 border-b border-border backdrop-blur-md">
      
      {/* Mobile Top Actions Row (Settings, Worlds, Save) */}
      <div className="flex w-full md:hidden justify-between items-center mb-2 px-1">
        <button onClick={onOpenWorlds} className="p-1.5 text-ink-dim hover:text-gold border border-border/50 rounded bg-black/40" aria-label="Bölgeler">
          <Globe size={18} />
        </button>
        <button onClick={handleSave} className={`flex items-center gap-1.5 text-[0.65rem] font-cinzel px-3 py-1.5 border border-border/50 rounded bg-black/40 ${saveAnim ? 'text-emerald-400 border-emerald-500' : 'text-ink-dim'} transition-colors`}>
          <Save size={14} className={saveAnim ? 'animate-bounce' : ''} />
          {saveAnim ? 'KAYDEDİLDİ' : 'KAYDET'}
        </button>
        <button onClick={onOpenSettings} className="p-1.5 text-ink-dim hover:text-white border border-border/50 rounded bg-black/40" aria-label="Ayarlar">
          <Settings size={18} />
        </button>
      </div>

      {/* Resources */}
      <div className="flex items-center justify-center gap-3 w-full md:w-auto">
        <div className="flex flex-col md:flex-row items-center gap-0.5 md:gap-3">
          <span className="font-cinzel text-[0.6rem] md:text-[0.75rem] tracking-[0.1em] md:tracking-[0.15em] uppercase text-ink-dim">Ruh Özü</span>
          <span className="font-cinzel text-base md:text-lg font-bold text-gold text-shadow-gold leading-none">{formatSE(se)} SE</span>
          <span className="text-[0.65rem] md:text-xs text-ink-dim italic leading-none">+{formatSE(sePerSec)}/sn</span>
        </div>

        <span className="text-sm md:text-xl text-ink-dim opacity-40 mx-2">☠</span>

        <div className="flex flex-col md:flex-row items-center gap-0.5 md:gap-3">
          <span className="font-cinzel text-[0.6rem] md:text-[0.75rem] tracking-[0.1em] md:tracking-[0.15em] uppercase text-ink-dim">Lanet Taşı</span>
          <span className="font-cinzel text-base md:text-lg font-bold text-void leading-none">{curseStones} 💎</span>
        </div>
      </div>
    </div>
  );
}