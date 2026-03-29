import { useArtifactStore } from '../store/artifactStore';
import { ARTIFACTS, ARTIFACT_SETS } from '../data/artifactData';
import { X, Zap, Sparkles, Award, Lock, Hexagon } from 'lucide-react';
import RuneCorner from './shared/RuneCorner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArtifactModal({ isOpen, onClose }: Props) {
  const owned = useArtifactStore(s => s.owned);
  const getSetCount = useArtifactStore(s => s.getSetCount);
  const isSetComplete = useArtifactStore(s => s.isSetComplete);

  if (!isOpen) return null;

  const tiers = {
    common:    { color: 'text-stone-500',  bg: 'bg-stone-900/10', border: 'border-stone-900' },
    rare:      { color: 'text-blue-400',   bg: 'bg-blue-900/10',  border: 'border-blue-900/40' },
    epic:      { color: 'text-purple-400', bg: 'bg-purple-900/10', border: 'border-purple-900/40' },
    legendary: { color: 'text-amber-500',  bg: 'bg-amber-900/10', border: 'border-amber-900/40' },
    unique:    { color: 'text-red-600',    bg: 'bg-red-900/10',   border: 'border-red-900/40' },
  };

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
        <div className="flex items-center gap-4 font-cinzel text-xl tracking-[0.4em] uppercase text-stone-200 font-black">
          <Award size={24} className="text-purple-500 opacity-70" />
          Kadim Koleksiyon
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-stone-600 font-black font-cinzel uppercase tracking-[0.3em]">Bulunan Sırlar</span>
            <span className="text-2xl font-black text-stone-300 font-cinzel tracking-widest">
               <span className="text-purple-500">{owned.length}</span> <span className="text-stone-700">/</span> {ARTIFACTS.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-stone-600 hover:text-red-500 border border-stone-900 hover:border-red-900/40 rounded-sm transition-all duration-300"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Artifact Grid */}
        <div className="flex-1 overflow-y-auto p-8 scrollbar-none">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {ARTIFACTS.map((artifact) => {
              const isOwned = owned.includes(artifact.id);
              const t = tiers[artifact.tier as keyof typeof tiers];
              
              return (
                <div
                  key={artifact.id}
                  className={`relative group flex flex-col h-full rounded-sm border transition-all duration-500 overflow-hidden
                             ${isOwned 
                               ? `${t.bg} ${t.border} shadow-2xl` 
                               : 'bg-[#0a0608] border-stone-900 opacity-20 grayscale scale-95 flex items-center justify-center'}`}
                  style={isOwned ? { background: '#0a0608' } : {}}
                >
                  {isOwned ? (
                    <>
                      <div className="p-5 flex-1 flex flex-col">
                        <div className={`text-[8px] font-cinzel font-black uppercase tracking-[0.3em] mb-2 ${t.color}`}>
                          {artifact.tier}
                        </div>
                        <h3 className="font-cinzel text-xs font-black text-stone-200 mb-2 truncate group-hover:text-white transition-colors">
                          {artifact.name}
                        </h3>
                        <p className="text-[10px] text-stone-500 italic mb-4 leading-relaxed line-clamp-2">
                          "{artifact.description}"
                        </p>
                        <div className="mt-auto pt-3 border-t border-white/5">
                          <span className="text-[10px] text-stone-300 font-bold flex items-center gap-2">
                            <Zap size={10} className="text-[#c9a85c]" /> {artifact.effectDescription}
                          </span>
                        </div>
                      </div>
                      
                      {artifact.setId && (
                        <div className="px-5 py-2 bg-stone-950/40 border-t border-white/5">
                          <span className="text-[7px] font-cinzel text-stone-600 font-black uppercase tracking-widest">
                            SEKANS: {ARTIFACT_SETS.find(s => s.id === artifact.setId)?.name}
                          </span>
                        </div>
                      )}

                      {/* Accent glow on hover */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none ${t.color.replace('text', 'bg')}`} />
                    </>
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center gap-4">
                      <Lock size={32} className="text-stone-800" />
                      <span className="text-[8px] font-cinzel text-stone-800 font-black tracking-[0.4em] uppercase">BİLİNMİYOR</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Set Bonuses */}
        <div className="w-80 border-l border-[#1e1210] p-8 overflow-y-auto scrollbar-none"
             style={{ background: '#0a0608' }}>
          <div className="text-[10px] font-cinzel font-black text-[#c9a85c] tracking-[0.4em] uppercase mb-8 flex items-center gap-3">
            <Sparkles size={12} className="opacity-50" /> Set Sırları
          </div>

          <div className="space-y-6">
            {ARTIFACT_SETS.map(set => {
              const count = getSetCount(set.id);
              const complete = isSetComplete(set.id);
              
              return (
                <div 
                  key={set.id}
                  className={`p-5 rounded-sm border transition-all duration-500 relative overflow-hidden
                             ${complete ? 'bg-amber-900/5 border-amber-900/40 shadow-xl' : 'bg-stone-950/20 border-stone-900'}`}
                >
                  {complete && (
                    <div className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center bg-amber-500/10 rounded-bl-2xl">
                       <Award size={12} className="text-amber-500" />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-cinzel text-xs font-black tracking-widest ${complete ? 'text-amber-400' : 'text-stone-500'}`}>
                      {set.name}
                    </span>
                    <span className={`text-[10px] font-black tabular-nums ${complete ? 'text-amber-400' : 'text-stone-700'}`}>
                      {count}<span className="opacity-30">/</span>{set.count}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-[2px] w-full bg-black/40 rounded-full overflow-hidden mb-4">
                    <div 
                      className={`h-full transition-all duration-1000 ${complete ? 'bg-amber-500 animate-pulse' : 'bg-stone-800'}`}
                      style={{ width: `${(count / set.count) * 100}%` }}
                    />
                  </div>

                  <div className={`text-[10px] leading-relaxed font-medium ${complete ? 'text-stone-200' : 'text-stone-600'}`}>
                    <span className="font-black text-[8px] uppercase tracking-[0.2em] block mb-1 opacity-50">Lütuf:</span>
                    {set.bonusDescription}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
