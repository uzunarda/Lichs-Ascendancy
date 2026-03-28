import { useGameStore } from '../store/gameStore';
import { REGIONS } from '../data/gameData';
import { formatSE } from '../systems/numberUtils';
import { Lock, Unlock, MapPin } from 'lucide-react';

export default function RegionMap() {
  const currentRegionIndex = useGameStore(s => s.currentRegionIndex);
  const totalSE            = useGameStore(s => s.totalSE);

  return (
    <div className="flex flex-col gap-3 p-2 pb-6">
      {REGIONS.map((region, index) => {
        const isUnlocked = index <= currentRegionIndex;
        const isCurrent = index === currentRegionIndex;
        const isNext = index === currentRegionIndex + 1;
        
        let progress = 0;
        if (isNext) {
           const prevRegion = REGIONS[currentRegionIndex];
           progress = Math.min(1, Math.max(0, (totalSE - prevRegion.seThreshold) / (region.seThreshold - prevRegion.seThreshold)));
        } else if (isUnlocked) {
           progress = 1;
        }

        return (
          <div 
            key={region.id} 
            className={`relative p-4 rounded-lg border transition-all duration-500 flex flex-col gap-2
              ${isCurrent ? 'bg-black/60 border-gold shadow-[0_0_15px_rgba(212,175,55,0.15)] scale-[1.02] z-10' 
               : isUnlocked ? 'bg-black/40 border-gold/30 opacity-80' 
               : 'bg-black/20 border-border opacity-50 grayscale'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isCurrent ? <MapPin size={18} className="text-gold animate-bounce" /> 
                 : isUnlocked ? <Unlock size={16} className="text-gold/70" /> 
                 : <Lock size={16} className="text-ink-dim" />}
                
                <span className="font-cinzel tracking-wider text-[0.85rem]" style={{ color: isUnlocked ? region.color : '' }}>
                  {region.name}
                </span>
              </div>
              
              {!isUnlocked && (
                <span className="text-[0.65rem] text-ink-dim italic">
                  {formatSE(region.seThreshold)} SE
                </span>
              )}
            </div>

            <div className="h-1 bg-black/60 rounded overflow-hidden relative">
               <div
                className="absolute left-0 top-0 h-full rounded transition-all duration-1000"
                style={{ 
                  width: `${progress * 100}%`, 
                  background: isUnlocked || isNext ? region.color : 'transparent',
                  opacity: isNext ? 1 : 0.6
                }}
              />
            </div>
            
            <div className="text-[0.65rem] text-ink-dim opacity-70">
              {region.atmosphere}
            </div>
          </div>
        );
      })}
    </div>
  );
}