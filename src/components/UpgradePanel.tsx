import { useGameStore } from '../store/gameStore';
import { formatSE } from '../systems/numberUtils';

const CATEGORY_COLOR: Record<string, string> = {
  click:   'border-l-gold',
  helper:  'border-l-purple-light',
  synergy: 'border-l-blood-light',
  ritual:  'border-l-void',
  passive: 'border-l-green',
};

export default function UpgradePanel() {
  const upgrades    = useGameStore(s => s.upgrades);
  const helpers     = useGameStore(s => s.helpers);
  const se          = useGameStore(s => s.se);
  const totalClicks = useGameStore(s => s.totalClicks);
  const buyUpgrade  = useGameStore(s => s.buyUpgrade);

  const isUnlocked = (condition: string) => {
    try {
      const expr = condition
        .replace(/\bse\b/g, String(se))
        .replace(/totalClicks/g, String(totalClicks))
        .replace(/([a-z_]+)>=/g, (_, id) => `${helpers[id] ?? 0}>=`);
      return new Function(`return ${expr}`)();
    } catch { return false; }
  };

  const available = upgrades.filter(u => !u.purchased && isUnlocked(u.unlockCondition));
  const locked    = upgrades.filter(u => !u.purchased && !isUnlocked(u.unlockCondition)).slice(0, 3);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="font-cinzel text-[0.85rem] tracking-[0.2em] uppercase text-gold-dim
                      px-4 py-3 border-b border-border bg-black/30">
        ✦ YÜKSELTİMLER
      </div>
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {available.length === 0 && (
          <p className="text-center text-ink-dim text-xs italic p-4">Daha fazla güç için ilerle...</p>
        )}
        {available.map(u => {
          const canAfford = se >= u.cost;
          return (
            <div
              key={u.id}
              onClick={() => canAfford && buyUpgrade(u.id)}
              className={`px-3 py-2 rounded-sm border border-border border-l-2 transition-all duration-150 cursor-pointer
                          ${CATEGORY_COLOR[u.category] ?? 'border-l-border'}
                          ${canAfford
                            ? 'bg-surface hover:bg-surface-hover hover:border-border-hover'
                            : 'bg-surface opacity-50 cursor-not-allowed'}`}
            >
              <div className="font-cinzel text-[0.82rem] text-gold">{u.name}</div>
              <div className="text-[0.72rem] text-ink my-0.5">{u.description}</div>
              <div className="text-[0.72rem] text-ink-dim">{formatSE(u.cost)} SE</div>
            </div>
          );
        })}
        {locked.map(u => (
          <div key={u.id} className="px-3 py-2 rounded-sm border border-border opacity-25 cursor-default">
            <div className="font-cinzel text-[0.82rem] text-gold">??? {u.category}</div>
            <div className="text-[0.72rem] text-ink-dim">Kilit açmak için ilerle</div>
          </div>
        ))}
      </div>
    </div>
  );
}