import { useEffect, useState } from 'react';
import { useGameStore, calcCurrentSEperSec } from '../store/gameStore';
import { formatSE } from '../systems/numberUtils';

// Mobile-only props kept for the mobile action row
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
    setTimeout(() => setSaveAnim(false), 1500);
  };

  return (
    <div className="relative z-10 flex items-center bg-gradient-to-b from-black/95 to-black/85 border-b border-border backdrop-blur-md">

      {/* ── Mobile only: action row (top strip above resources) ────────────── */}
      <div className="flex md:hidden w-full items-center justify-between px-3 py-1.5 border-b border-border/20">
        <button
          onClick={onOpenWorlds}
          className="font-cinzel text-[0.6rem] uppercase tracking-widest text-ink-dim px-2 py-1 border border-border/40 rounded"
        >
          🗺 Bölgeler
        </button>

        <button
          onClick={handleSave}
          className={`font-cinzel text-[0.6rem] uppercase tracking-widest px-2 py-1 border rounded transition-colors ${
            saveAnim ? 'text-emerald-400 border-emerald-500/40' : 'text-ink-dim border-border/40'
          }`}
        >
          {saveAnim ? '✓ Kaydedildi' : '💾 Kaydet'}
        </button>

        <button
          onClick={onOpenSettings}
          className="font-cinzel text-[0.6rem] uppercase tracking-widest text-ink-dim px-2 py-1 border border-border/40 rounded"
        >
          ⚙ Ayarlar
        </button>
      </div>

      {/* ── Resources (desktop: full width centered; mobile: below actions) ─── */}
      <div className="flex flex-1 items-center justify-center gap-8 md:gap-16 py-2.5 px-4">

        {/* Soul Essence */}
        <div className="flex flex-col items-center">
          <span className="font-cinzel text-[0.58rem] md:text-[0.68rem] tracking-[0.25em] uppercase text-gold-dim font-bold">
            Ruh Özü
          </span>
          <span className="font-cinzel text-xl md:text-3xl font-black text-gold leading-tight">
            {formatSE(se)}<span className="text-sm md:text-lg opacity-40 ml-1 font-bold">SE</span>
          </span>
          <span className="text-[0.62rem] md:text-xs text-emerald-400 font-semibold">
            +{formatSE(sePerSec)}/sn
          </span>
        </div>

        <span className="text-white/10 text-xl hidden sm:inline select-none">☠</span>

        {/* Curse Stones */}
        <div className="flex flex-col items-center">
          <span className="font-cinzel text-[0.58rem] md:text-[0.68rem] tracking-[0.25em] uppercase text-void font-bold opacity-70">
            Lanet Taşı
          </span>
          <span className="font-cinzel text-xl md:text-3xl font-black text-void leading-tight">
            {curseStones}<span className="text-sm md:text-lg opacity-40 ml-1">💎</span>
          </span>
        </div>
      </div>
    </div>
  );
}