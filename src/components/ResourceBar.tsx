import { useEffect, useState } from 'react';
import { Save, Globe, Settings } from 'lucide-react';
import { useGameStore, calcCurrentSEperSec } from '../store/gameStore';
import { formatSE } from '../systems/numberUtils';

interface Props {
  onOpenWorlds?: () => void;
  onOpenSettings?: () => void;
}

export default function ResourceBar({ onOpenWorlds, onOpenSettings }: Props) {
  const se          = useGameStore(s => s.se);
  const curseStones = useGameStore(s => s.curseStones);
  const saveGame    = useGameStore(s => s.saveGame);
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
    <div className="relative z-10 flex items-center bg-gradient-to-b from-black/95 to-black/85 border-b border-border backdrop-blur-md">

      {/* Desktop actions (left) */}
      <div className="hidden md:flex items-center gap-2 px-4 py-2 border-r border-border/30">
        <button
          onClick={onOpenWorlds}
          className="flex items-center gap-1.5 font-cinzel text-[0.65rem] tracking-widest uppercase text-ink-dim border border-border/50 px-2.5 py-1.5 rounded hover:text-gold hover:border-gold/40 transition-all"
        >
          <Globe size={13} /> Bölgeler
        </button>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 font-cinzel text-[0.65rem] tracking-widest uppercase border px-2.5 py-1.5 rounded transition-all ${
            saveAnim ? 'text-emerald-400 border-emerald-500/50 bg-emerald-500/5' : 'text-ink-dim border-border/50 hover:text-ink hover:border-border'
          }`}
        >
          <Save size={13} className={saveAnim ? 'animate-bounce' : ''} />
          {saveAnim ? 'Kaydedildi' : 'Kaydet'}
        </button>
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded text-ink-dim border border-border/50 hover:text-white hover:border-border transition-all"
          aria-label="Ayarlar"
        >
          <Settings size={14} />
        </button>
      </div>

      {/* Mobile actions (left) */}
      <div className="flex md:hidden items-center gap-2 px-2 py-2">
        <button onClick={onOpenWorlds} className="p-1.5 text-ink-dim border border-border/40 rounded" aria-label="Bölgeler">
          <Globe size={16} />
        </button>
        <button onClick={onOpenSettings} className="p-1.5 text-ink-dim border border-border/40 rounded" aria-label="Ayarlar">
          <Settings size={16} />
        </button>
      </div>

      {/* Center — Resources */}
      <div className="flex-1 flex items-center justify-center gap-8 md:gap-16 py-2 px-4">
        {/* SE */}
        <div className="flex flex-col items-center">
          <span className="font-cinzel text-[0.55rem] md:text-[0.65rem] tracking-[0.25em] uppercase text-gold-dim font-bold">
            Ruh Özü
          </span>
          <span className="font-cinzel text-xl md:text-3xl font-black text-gold leading-none">
            {formatSE(se)}
            <span className="text-sm md:text-base opacity-40 ml-1 font-bold">SE</span>
          </span>
          <span className="text-[0.6rem] md:text-[0.7rem] text-emerald-400 font-semibold leading-none">
            +{formatSE(sePerSec)}/sn
          </span>
        </div>

        <span className="text-white/10 text-2xl hidden sm:inline">☠</span>

        {/* Curse Stones */}
        <div className="flex flex-col items-center">
          <span className="font-cinzel text-[0.55rem] md:text-[0.65rem] tracking-[0.25em] uppercase text-void font-bold opacity-70">
            Lanet Taşı
          </span>
          <span className="font-cinzel text-xl md:text-3xl font-black text-void leading-none">
            {curseStones}
            <span className="text-sm md:text-base opacity-40 ml-1">💎</span>
          </span>
        </div>
      </div>

      {/* Desktop Save (right) - hidden, already top left */}
      <div className="hidden md:flex items-center px-4 py-2 border-l border-border/30">
        <span className="text-[0.55rem] text-ink-dim/40 italic font-cinzel">auto-save: 30s</span>
      </div>

      {/* Mobile Save */}
      <div className="flex md:hidden items-center px-2">
        <button
          onClick={handleSave}
          className={`p-1.5 rounded border transition-all ${saveAnim ? 'text-emerald-400 border-emerald-500/50' : 'text-ink-dim border-border/40'}`}
          aria-label="Kaydet"
        >
          <Save size={16} className={saveAnim ? 'animate-bounce' : ''} />
        </button>
      </div>
    </div>
  );
}