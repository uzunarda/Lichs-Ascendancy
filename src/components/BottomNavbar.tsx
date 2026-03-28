import { Save, Globe, Settings, Map } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useState, useEffect } from 'react';

interface Props {
  onOpenWorlds: () => void;
  onOpenSettings: () => void;
}

export default function BottomNavbar({ onOpenWorlds, onOpenSettings }: Props) {
  const saveGame  = useGameStore(s => s.saveGame);
  const lastSaved = useGameStore(s => s.lastSaveTime);
  const [saveAnim, setSaveAnim] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const handleSave = () => {
    saveGame();
    setSaveAnim(true);
    setTimeout(() => setSaveAnim(false), 1500);
  };

  const timeSince = () => {
    const sec = Math.floor((Date.now() - lastSaved) / 1000);
    if (sec < 60) return `${sec}sn önce`;
    if (sec < 3600) return `${Math.floor(sec / 60)}dk önce`;
    return `${Math.floor(sec / 3600)}sa önce`;
  };

  return (
    <nav className="hidden md:flex fixed bottom-0 left-0 right-0 z-40 h-12
                    bg-black/90 border-t border-border backdrop-blur-md items-center justify-between px-6">

      {/* Left — Worlds button */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenWorlds}
          className="flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase text-ink-dim
                     border border-border bg-surface px-3 py-1.5 rounded
                     hover:text-gold hover:border-gold/50 hover:shadow-[0_0_10px_rgba(212,175,55,0.15)]
                     transition-all duration-200 active:scale-95"
        >
          <Map size={14} /> Bölgeler
        </button>
      </div>

      {/* Center — game title / brand */}
      <div className="font-cinzel text-xs tracking-[0.4em] uppercase text-ink-dim/30 select-none">
        Lich's Ascendancy
      </div>

      {/* Right — Save + Settings */}
      <div className="flex items-center gap-3">
        <span className="text-[0.6rem] text-ink-dim/40 italic hidden lg:inline">
          {saveAnim ? '✓ Kaydedildi' : `Son kayıt: ${timeSince()}`}
        </span>

        <button
          onClick={handleSave}
          className={[
            'flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase',
            'border px-3 py-1.5 rounded transition-all duration-200 active:scale-95',
            saveAnim
              ? 'text-emerald-400 border-emerald-500/50 bg-emerald-400/10 shadow-[0_0_8px_rgba(52,211,153,0.2)]'
              : 'text-ink-dim border-border hover:text-ink hover:border-border-hover hover:bg-surface',
          ].join(' ')}
        >
          <Save size={14} className={saveAnim ? 'animate-bounce' : ''} />
          {saveAnim ? 'Kaydedildi' : 'Kaydet'}
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2 font-cinzel text-xs tracking-widest uppercase text-ink-dim
                     border border-border px-3 py-1.5 rounded
                     hover:text-white hover:border-border-hover hover:bg-surface
                     transition-all duration-200 active:scale-95"
          aria-label="Ayarlar"
        >
          <Settings size={14} /> Ayarlar
        </button>
      </div>
    </nav>
  );
}
