import { useGameStore } from '../store/gameStore';
import { REGIONS } from '../data/gameData';
import { formatSE } from '../systems/numberUtils';
import { Lock, Unlock } from 'lucide-react';

const REGION_META: Record<string, { icon: string; phase?: string }> = {
  graveyard:        { icon: '🦴' },
  cursed_forest:    { icon: '🌑' },
  abandoned_castle: { icon: '🏰' },
  cursed_city:      { icon: '🔥' },
  dark_temple:      { icon: '⛩️' },
  death_throne:     { icon: '💀' },
  frozen_steppe:    { icon: '❄️',  phase: 'V2' },
  abyss_city:       { icon: '🌀',  phase: 'V2' },
  dream_shards:     { icon: '🔮',  phase: 'V2' },
  void_heart:       { icon: '🕳️', phase: 'V2' },
  beginning_end:    { icon: '♾️',  phase: 'V2 · Endgame' },
};

export default function RegionMap() {
  const currentRegionIndex = useGameStore(s => s.currentRegionIndex);
  const totalSE            = useGameStore(s => s.totalSE);

  return (
    <div className="flex flex-col gap-2 p-3">
      {REGIONS.map((region, index) => {
        const isUnlocked = index <= currentRegionIndex;
        const isCurrent  = index === currentRegionIndex;
        const isNext     = index === currentRegionIndex + 1;
        const isPhase7   = index >= 6;

        let progress = 0;
        if (isNext) {
          const prevRegion = REGIONS[currentRegionIndex];
          const range = region.seThreshold - prevRegion.seThreshold;
          progress = range > 0 ? Math.min(1, Math.max(0, (totalSE - prevRegion.seThreshold) / range)) : 0;
        } else if (isUnlocked) {
          progress = 1;
        }

        const meta = REGION_META[region.id];

        return (
          <div
            key={region.id}
            className={[
              'relative rounded-lg border transition-all duration-500 select-none',
              isCurrent
                ? 'p-3 bg-black/70 border-2 z-10'
                : isUnlocked
                  ? 'p-2.5 bg-black/40 border opacity-85'
                  : 'p-2.5 bg-black/20 border border-border/30 opacity-45 grayscale',
            ].join(' ')}
            style={{
              borderColor: isCurrent
                ? region.color
                : isUnlocked ? `${region.color}50` : undefined,
              boxShadow: isCurrent
                ? `0 0 18px ${region.color}20, inset 0 0 24px ${region.color}06`
                : undefined,
            }}
          >
            {/* V2 Badge */}
            {meta?.phase && isPhase7 && (
              <span
                className="absolute top-2 right-2 text-[0.52rem] font-cinzel font-bold tracking-wider uppercase px-1.5 py-0.5 rounded"
                style={{ background: `${region.color}18`, color: region.color, border: `1px solid ${region.color}35` }}
              >
                {meta.phase}
              </span>
            )}

            <div className="flex items-center gap-2.5">
              {/* Lock/unlock */}
              <div className="flex-shrink-0">
                {isCurrent
                  ? <span className="text-sm animate-pulse">📍</span>
                  : isUnlocked
                    ? <Unlock size={14} style={{ color: `${region.color}99` }} />
                    : <Lock size={14} className="text-ink-dim" />
                }
              </div>

              {/* Emoji */}
              <span className="text-base leading-none">{meta?.icon ?? '🗺️'}</span>

              {/* Name + description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="font-cinzel font-bold text-sm leading-tight"
                    style={{ color: isUnlocked ? region.color : '#6b7280' }}
                  >
                    {region.name}
                  </span>
                  {isCurrent && (
                    <span
                      className="text-[0.58rem] font-cinzel font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                      style={{ background: `${region.color}18`, color: region.color }}
                    >
                      Aktif
                    </span>
                  )}
                </div>
                {isCurrent && (
                  <p className="text-xs text-ink-dim mt-0.5 italic opacity-75 leading-tight truncate">
                    {region.atmosphere}
                  </p>
                )}
              </div>

              {/* Cost */}
              {!isUnlocked && (
                <div className="flex-shrink-0 text-right">
                  <span className="text-xs text-ink-dim whitespace-nowrap">
                    {region.seThreshold === Infinity ? '∞' : formatSE(region.seThreshold)} SE
                  </span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            {isNext && region.seThreshold !== Infinity && (
              <div className="mt-2.5">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-ink-dim">İlerleme</span>
                  <span className="text-xs font-bold" style={{ color: region.color }}>
                    {Math.round(progress * 100)}%
                  </span>
                </div>
                <div className="h-1.5 bg-black/60 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${progress * 100}%`,
                      background: `linear-gradient(to right, ${region.color}70, ${region.color})`,
                      boxShadow: `0 0 6px ${region.color}50`,
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