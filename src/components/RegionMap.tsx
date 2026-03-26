import { useGameStore } from '../store/gameStore';
import { REGIONS } from '../data/gameData';
import { formatSE } from '../systems/numberUtils';

export default function RegionMap() {
  const currentRegionIndex = useGameStore(s => s.currentRegionIndex);
  const totalSE            = useGameStore(s => s.totalSE);

  const region     = REGIONS[currentRegionIndex];
  const nextRegion = REGIONS[currentRegionIndex + 1];
  const progress   = nextRegion
    ? Math.min(1, (totalSE - region.seThreshold) / (nextRegion.seThreshold - region.seThreshold))
    : 1;

  return (
    <div className="px-4 py-3 border-t border-border bg-black/30">
      <div className="font-cinzel text-sm mb-2" style={{ color: 'var(--region-color)' }}>
        {region.name}
      </div>
      {nextRegion ? (
        <>
          <div className="h-1 bg-white/10 rounded overflow-hidden mb-1.5">
            <div
              className="h-full rounded transition-all duration-1000"
              style={{ width: `${progress * 100}%`, background: 'var(--region-color)' }}
            />
          </div>
          <div className="text-[0.62rem] text-ink-dim italic">
            → {nextRegion.name}: {formatSE(nextRegion.seThreshold)} SE
          </div>
        </>
      ) : (
        <div className="text-[0.62rem] text-ink-dim italic">✦ Son bölgeye ulaştın</div>
      )}
    </div>
  );
}