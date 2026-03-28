import { Save, Globe, Settings } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useState, useEffect } from 'react';

interface Props {
  onOpenWorlds: () => void;
  onOpenSettings: () => void;
}

export default function BottomNavbar({ onOpenWorlds, onOpenSettings }: Props) {
  const saveGame = useGameStore(s => s.saveGame);
  const lastSaved = useGameStore(s => s.lastSaveTime);
  const [saveAnim, setSaveAnim] = useState(false);

  // Auto update timestamp
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const handleSave = () => {
    saveGame();
    setSaveAnim(true);
    setTimeout(() => setSaveAnim(false), 1000);
  };

  return (
    <nav className="hidden md:block fixed bottom-0 left-0 right-0 z-40 bg-black/80 border-t border-border backdrop-blur-md px-6 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left side actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenWorlds}
            className="flex items-center gap-2 font-cinzel text-[0.75rem] tracking-widest uppercase text-ink-dim
                       border border-border bg-surface px-3 py-1.5 rounded hover:text-gold hover:border-gold hover:shadow-[0_0_8px_rgba(212,175,55,0.2)] transition-all"
          >
            <Globe size={16} /> Bölgeleri Gör
          </button>
        </div>

        {/* Right side settings */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-[0.65rem] text-ink-dim italic">Son kayıt: {new Date(lastSaved).toLocaleTimeString('tr')}</span>
          </div>
          
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 font-cinzel text-[0.75rem] tracking-widest uppercase text-ink-dim
                       border border-border px-3 py-1.5 rounded hover:text-ink hover:border-border-hover transition-all
                       ${saveAnim ? 'text-emerald-400 border-emerald-400/50 bg-emerald-400/10' : ''}`}
          >
            <Save size={16} className={saveAnim ? 'animate-bounce' : ''} /> {saveAnim ? 'Kaydedildi' : 'Kaydet'}
          </button>

          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded text-ink-dim border border-border hover:bg-surface hover:text-white transition-colors"
            aria-label="Ayarlar"
          >
            <Settings size={16} />
          </button>
        </div>
        
      </div>
    </nav>
  );
}
