import { useGameStore } from '../store/gameStore';
import { REGIONS } from '../data/gameData';
import { formatSE } from '../systems/numberUtils';
import { Lock, Unlock, MapPin } from 'lucide-react';

const REGION_META: Record<string, { icon: string; phase?: string }> = {
  graveyard:        { icon: '🦴' },
  cursed_forest:    { icon: '🌑' },
  abandoned_castle: { icon: '🏰' },
  cursed_city:      { icon: '🔥' },
  dark_temple:      { icon: '⛩️' },
  death_throne:     { icon: '💀' },
  frozen_steppe:    { icon: '❄️',  phase: 'II. Safha' },
  abyss_city:       { icon: '🌀',  phase: 'II. Safha' },
  dream_shards:     { icon: '🔮',  phase: 'II. Safha' },
  void_heart:       { icon: '🕳️', phase: 'II. Safha' },
  beginning_end:    { icon: '♾️',  phase: 'Final' },
};

export default function RegionMap() {
  const currentRegionIndex = useGameStore(s => s.currentRegionIndex);
  const totalSE            = useGameStore(s => s.totalSE);

  return (
    <div className="flex flex-col gap-4">
      {REGIONS.map((region, index) => {
        const isUnlocked = index <= currentRegionIndex;
        const isCurrent  = index === currentRegionIndex;
        const isNext     = index === currentRegionIndex + 1;
        const isPhase7   = index >= 6;

        let progress = 0;
        if (isNext) {
          const prevRegion = REGIONS[currentRegionIndex];
          const range = region.seThreshold - (prevRegion?.seThreshold || 0);
          progress = range > 0 ? Math.min(1, Math.max(0, (totalSE - (prevRegion?.seThreshold || 0)) / range)) : 0;
        } else if (isUnlocked) {
          progress = 1;
        }

        const meta = REGION_META[region.id];

        return (
          <div
            key={region.id}
            className={[
              'relative border transition-all duration-700 select-none overflow-hidden rounded-sm',
              isCurrent
                ? 'p-5 shadow-2xl z-10'
                : isUnlocked
                  ? 'p-4 opacity-80'
                  : 'p-4 grayscale opacity-20',
            ].join(' ')}
            style={{
              background: isCurrent ? '#0d0809' : '#0a0608',
              borderColor: isCurrent ? region.color : '#1e1210',
              borderLeftWidth: isCurrent ? '4px' : '1px',
              boxShadow: isCurrent ? `0 0 30px ${region.color}15` : 'none',
            }}
          >
            {/* Ambient Glow for Current */}
            {isCurrent && (
               <div 
                 className="absolute inset-0 pointer-events-none opacity-10"
                 style={{ background: `radial-gradient(circle at center, ${region.color} 0%, transparent 70%)` }}
               />
            )}

            {/* V2 Badge */}
            {meta?.phase && isPhase7 && (
              <span
                className="absolute top-4 right-4 text-[8px] font-cinzel font-black tracking-[0.2em] uppercase px-2 py-0.5 rounded-sm"
                style={{ background: `${region.color}15`, color: region.color, border: `1px solid ${region.color}40` }}
              >
                {meta.phase}
              </span>
            )}

            <div className="flex items-start gap-4 relative z-10">
              {/* Status Icon */}
              <div className="flex-shrink-0 mt-1">
                {isCurrent
                  ? <MapPin size={20} style={{ color: region.color }} className="animate-bounce" />
                  : isUnlocked
                    ? <Unlock size={16} className="text-stone-600" />
                    : <Lock size={16} className="text-stone-800" />
                }
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className="font-cinzel font-black text-sm md:text-base leading-tight tracking-[0.1em] uppercase"
                    style={{ color: isUnlocked ? region.color : '#2d1a12' }}
                  >
                    {meta?.icon} {region.name}
                  </span>
                  {isCurrent && (
                    <span
                      className="text-[8px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 rounded-sm"
                      style={{ background: region.color, color: '#000' }}
                    >
                      Buradasın
                    </span>
                  )}
                </div>
                
                {isCurrent && (
                   <p className="text-[11px] text-stone-400 mt-2 italic font-medium leading-relaxed border-t border-white/5 pt-2">
                     {region.atmosphere}
                   </p>
                )}
                
                {region.bonus && isUnlocked && (
                  <div className="mt-3 flex items-center gap-2">
                    <span 
                      className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm border"
                      style={{ color: region.color, borderColor: `${region.color}40`, background: `${region.color}05` }}
                    >
                      Bölge Lütfu
                    </span>
                    <span className="text-[10px] font-bold text-stone-500">
                      {region.bonus.description}
                    </span>
                  </div>
                )}
              </div>

              {/* Threshold */}
              {!isUnlocked && (
                <div className="flex-shrink-0 text-right mt-1">
                  <span className="text-[10px] text-stone-700 font-bold tabular-nums">
                    {region.seThreshold === Infinity ? '??? SE' : `${formatSE(region.seThreshold)} SE`}
                  </span>
                </div>
              )}
            </div>

            {/* Progress Bar for Next Region */}
            {isNext && region.seThreshold !== Infinity && (
              <div className="mt-5 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-stone-600 font-black uppercase tracking-[0.2em]">Geçit Hazırlığı</span>
                  <span className="text-[10px] font-black tabular-nums" style={{ color: region.color }}>
                    %{Math.round(progress * 100)}
                  </span>
                </div>
                <div className="h-1 bg-black/60 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full transition-all duration-1000 shadow-lg"
                    style={{
                      width: `${progress * 100}%`,
                      background: `linear-gradient(to right, ${region.color}44, ${region.color})`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}