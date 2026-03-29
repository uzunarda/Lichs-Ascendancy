import { Save, Settings, Map, Scroll, Swords, Sparkles, Trophy } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useState, useEffect } from 'react';
import RuneCorner from './shared/RuneCorner';

interface Props {
  onOpenWorlds: () => void;
  onOpenSkillTree: () => void;
  onOpenSettings: () => void;
  onOpenBosses: () => void;
  onOpenArtifacts: () => void;
  onOpenLeaderboard: () => void;
}

export default function BottomNavbar({ 
  onOpenWorlds, 
  onOpenSkillTree, 
  onOpenSettings, 
  onOpenBosses, 
  onOpenArtifacts,
  onOpenLeaderboard
}: Props) {
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

  const btnClass = "relative font-cinzel text-[10px] uppercase tracking-widest font-black px-4 py-2 border rounded-sm transition-all duration-200 hover:brightness-125 active:scale-95 flex items-center gap-2 overflow-hidden group";

  return (
    <nav className="hidden md:flex fixed bottom-0 left-0 right-0 z-40 h-14 items-center justify-between px-6"
         style={{ background: '#0d0809', borderTop: '1px solid #1e1210' }}>

      {/* Köşe süslemeleri */}
      <RuneCorner position="top-left" opacity={0.2} size={20} />
      <RuneCorner position="top-right" opacity={0.2} size={20} />
      <RuneCorner position="bottom-left" opacity={0.2} size={20} />
      <RuneCorner position="bottom-right" opacity={0.2} size={20} />

      {/* Süsleme çizgileri */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #c9a85c22, #c9a85c44, #c9a85c22, transparent)' }} />

      {/* Sol — Aksiyonlar */}
      <div className="flex items-center gap-2 relative z-10">
        <button
          onClick={onOpenWorlds}
          className={btnClass}
          style={{ color: '#c9a85c', borderColor: '#3a2215', background: '#0a0608' }}
        >
          <Map size={14} /> Bölgeler
        </button>

        <button
          onClick={onOpenSkillTree}
          className={btnClass}
          style={{ color: '#9333ea', borderColor: '#2d1458', background: '#0a0608' }}
        >
          <span className="text-lg leading-none mt-[-2px]">🕸</span> Ağaç
        </button>

        <button
          onClick={onOpenBosses}
          className={btnClass}
          style={{ color: '#ef4444', borderColor: '#450a0a', background: '#0a0608' }}
        >
          <Swords size={14} /> Bosslar
        </button>

        <button
          onClick={onOpenArtifacts}
          className={btnClass}
          style={{ color: '#60a5fa', borderColor: '#1e3a8a', background: '#0a0608' }}
        >
          <Scroll size={14} /> Artifaktlar
        </button>

        <button
          onClick={onOpenLeaderboard}
          className={btnClass}
          style={{ color: '#fbbf24', borderColor: '#78350f', background: '#0a0608' }}
        >
          <Trophy size={14} /> Liderlik
        </button>
      </div>

      <div className="font-cinzel text-[11px] tracking-[0.6em] uppercase text-stone-700 select-none font-black flex items-center gap-4">
        <span className="opacity-20">✦</span>
        LICH'S ASCENDANCY
        <span className="opacity-20">✦</span>
      </div>

      {/* Sağ — Sistem */}
      <div className="flex items-center gap-2 relative z-10">
        <div className="flex flex-col items-end mr-3">
           <span className="text-[8px] font-cinzel tracking-widest text-stone-600 uppercase">Son Mukavemet</span>
           <span className="text-[10px] text-stone-400 font-bold italic">
             {saveAnim ? '✓ Mühürlendi' : timeSince()}
           </span>
        </div>

        <button
          onClick={handleSave}
          className={btnClass}
          style={saveAnim 
            ? { color: '#4ade80', borderColor: '#166534', background: '#052e16' }
            : { color: '#c9a85c', borderColor: '#3a2215', background: '#0a0608' }
          }
        >
          <Save size={14} /> {saveAnim ? 'Mühürlendi' : 'Mühürle'}
        </button>

        <button
          onClick={onOpenSettings}
          className={btnClass}
          style={{ color: '#7a5a30', borderColor: '#2a1a10', background: '#0a0608' }}
        >
          <Settings size={14} />
        </button>
      </div>
    </nav>
  );
}
