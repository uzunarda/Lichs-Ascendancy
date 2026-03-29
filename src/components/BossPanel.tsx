import React from 'react';
import { useGameStore } from '../store/gameStore';
import { BOSSES } from '../data/bossData';
import { Swords, Gift, ShieldAlert, X, Skull, Hexagon } from 'lucide-react';
import RuneCorner from './shared/RuneCorner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BossPanel({ isOpen, onClose }: Props) {
  const se = useGameStore(s => s.se);
  const startBossFight = useGameStore(s => s.startBossFight);
  const activeBossId = useGameStore(s => s.bossFight.activeBossId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[160] flex flex-col backdrop-blur-3xl animate-in fade-in duration-500 overflow-hidden"
         style={{ background: '#0d0809' }}>
      
      <RuneCorner position="top-left" opacity={0.3} size={48} className="m-2" />
      <RuneCorner position="top-right" opacity={0.3} size={48} className="m-2" />
      <RuneCorner position="bottom-left" opacity={0.3} size={48} className="m-2" />
      <RuneCorner position="bottom-right" opacity={0.3} size={48} className="m-2" />

      {/* Header */}
      <div 
        className="flex items-center justify-between px-8 py-6 border-b relative z-10"
        style={{ background: '#0a0608aa', borderColor: '#1e1210' }}
      >
        <div className="flex items-center gap-4 font-cinzel text-xl tracking-[0.4em] uppercase text-red-600 font-black">
          <Skull size={24} className="opacity-70" />
          Boss Meclisi
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-stone-600 hover:text-red-500 border border-stone-900 hover:border-red-900/40 rounded-sm transition-all duration-300"
        >
          <X size={20} />
        </button>
      </div>

      {/* Boss List */}
      <div className="flex-1 overflow-y-auto p-8 scrollbar-none space-y-4 relative z-10">
        {BOSSES.map((boss) => {
          const isUnlocked = !boss.unlockCondition?.minSe || se >= boss.unlockCondition.minSe;
          const isActive = activeBossId === boss.id;

          return (
            <div 
              key={boss.id}
              className={`relative group p-6 rounded-sm border transition-all duration-500 ${
                isUnlocked 
                  ? 'border-[#1e1210] hover:border-red-900/40 hover:bg-white/[0.01]' 
                  : 'border-stone-900 opacity-30 grayscale pointer-events-none'
              }`}
              style={{ background: '#0a0608' }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className={`font-cinzel text-lg font-black tracking-[0.2em] uppercase ${isUnlocked ? 'text-stone-200 group-hover:text-red-500' : 'text-stone-700'}`}>
                      {boss.name}
                    </h3>
                    {!isUnlocked && (
                      <span className="flex items-center gap-1.5 text-[8px] border border-stone-800 text-stone-700 px-2 py-0.5 rounded-sm font-black uppercase tracking-[0.2em]">
                        <ShieldAlert size={10} /> Mühürlü
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-stone-500 mb-4 max-w-2xl leading-relaxed italic">
                    "{boss.description}"
                  </p>

                  <div className="flex flex-wrap gap-6 text-[10px] font-black font-cinzel tracking-widest uppercase">
                    <div className="flex items-center gap-2 text-stone-400">
                      <Swords size={14} className="text-red-600 opacity-60" />
                      Hayat: <span className="text-red-500">{boss.maxHp.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-400">
                      <Gift size={14} className="text-[#c9a85c] opacity-60" />
                      Ganimet: <span className="text-[#c9a85c]">{boss.rewards.vt} VT, {boss.rewards.dp} DP</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-3 min-w-[140px]">
                  <button
                    disabled={!isUnlocked || !!activeBossId}
                    onClick={() => startBossFight(boss.id)}
                    className={`w-full px-6 py-3 rounded-sm font-cinzel font-black uppercase tracking-[0.3em] text-[10px] transition-all duration-500 ${
                      isUnlocked && !activeBossId
                        ? 'bg-[#0d0809] text-red-600 border border-red-900/40 hover:bg-black hover:text-red-400 hover:border-red-600 shadow-xl'
                        : 'bg-black/20 text-stone-800 border border-stone-950 cursor-not-allowed'
                    }`}
                  >
                    {isActive ? 'Düello Sürüyor' : 'Meydan Oku'}
                  </button>
                  {!isUnlocked && boss.unlockCondition?.minSe && (
                    <span className="text-[10px] text-stone-800 font-bold uppercase tracking-tighter tabular-nums">
                      Gereken: {boss.unlockCondition.minSe.toLocaleString()} SE
                    </span>
                  )}
                </div>
              </div>

              {/* Red glow subtle effect */}
              {isUnlocked && (
                <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div 
        className="p-8 border-t relative z-10 text-center"
        style={{ background: '#0a0608', borderColor: '#1e1210' }}
      >
        <p className="text-[10px] text-stone-600 font-black uppercase tracking-[0.2em] italic max-w-2xl mx-auto leading-relaxed">
          Kadim varlıkları uyandırmak büyük risk taşır. <br/>
          Savaş sırasında tüm üretimin ve tıklamaların boss'a hasar verir. <br/>
          <span className="text-red-900/60 transition-colors hover:text-red-600">Başarısızlık bir seçenek değildir.</span>
        </p>
      </div>
    </div>
  );
}
