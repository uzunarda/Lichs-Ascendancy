import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useBuildingStore } from '../store/buildingStore';
import { BUILDINGS, BUILDING_SYNERGIES } from '../data/buildingData';
import { formatSE } from '../systems/numberUtils';
import { soundManager } from '../systems/soundManager';
import TooltipWrapper from './TooltipWrapper';
import { Building2, Clock, Zap, CheckCircle2, Lock, Sparkles } from 'lucide-react';

const CATEGORY_COLORS: Record<string, { border: string; text: string; bg: string }> = {
  soul:     { border: 'border-l-gold',         text: 'text-gold',         bg: 'bg-gold/5' },
  ritual:   { border: 'border-l-void',          text: 'text-void',         bg: 'bg-purple/5' },
  military: { border: 'border-l-blood-light',   text: 'text-blood-light',  bg: 'bg-blood/5' },
  prestige: { border: 'border-l-purple-light',  text: 'text-purple-light', bg: 'bg-purple/5' },
};

const CATEGORY_LABELS: Record<string, string> = {
  soul: 'Ruh', ritual: 'Ritüel', military: 'Askeri', prestige: 'Prestij',
};

function formatBuildTime(sec: number): string {
  if (sec < 60)   return `${sec}sn`;
  if (sec < 3600) return `${Math.floor(sec / 60)}dk ${sec % 60}sn`;
  if (sec < 86400) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${h}sa ${m}dk`;
  }
  return `${Math.floor(sec / 86400)} gün`;
}

function BuildingProgress({ completesAt }: { completesAt: number }) {
  const now = Date.now();
  const remaining = Math.max(0, completesAt - now);
  const pct = remaining === 0 ? 100 : 0; // initial; real-time via animation

  if (remaining <= 0) {
    return (
      <div className="flex items-center gap-1.5 text-emerald-400">
        <CheckCircle2 size={14} />
        <span className="text-sm font-bold font-cinzel">Tamamlandı!</span>
      </div>
    );
  }

  const totalMs = completesAt - now; // approximate for display
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-amber-400">
          <Clock size={12} />
          <span className="text-xs font-bold">İnşaat devam ediyor</span>
        </div>
        <span className="text-xs text-ink-dim">{formatBuildTime(Math.ceil(remaining / 1000))}</span>
      </div>
      <div className="h-1.5 bg-black/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
          style={{
            animation: `none`,
            width: `${Math.max(2, Math.min(98, ((totalMs - remaining) / totalMs) * 100))}%`,
          }}
        />
      </div>
    </div>
  );
}

export default function BuildingPanel() {
  const se             = useGameStore(s => s.se);
  const spendSE        = useGameStore(s => s.click); // we'll use a different mechanism — see below
  const currentRegion  = useGameStore(s => s.currentRegionIndex);
  const prestigeCount  = useGameStore(s => s.prestigeCount);

  const startBuilding  = useBuildingStore(s => s.startBuilding);
  const buildings      = useBuildingStore(s => s.buildings);
  const activeSynergies = useBuildingStore(s => s.activeSynergies);
  const getSlots       = useBuildingStore(s => s.getSlots);

  const [activeTab, setActiveTab] = useState<'build' | 'active' | 'synergy'>('build');
  const [buildResult, setBuildResult] = useState<string | null>(null);

  const slots = getSlots(currentRegion, prestigeCount);
  const regionBuildings = buildings[currentRegion] ?? [];

  const handleBuild = (buildingId: string, cost: number) => {
    if (se < cost) return;

    // Deduct SE via gameStore
    useGameStore.setState(s => ({ se: s.se - cost }));
    soundManager.init();
    soundManager.playBuy();

    const result = startBuilding(buildingId, currentRegion, cost + 1); // +1 so cost check passes
    if (result.success) {
      const data = BUILDINGS.find(b => b.id === buildingId);
      setBuildResult(`${data?.name} inşaatı başladı! ⏳`);
      setTimeout(() => setBuildResult(null), 3000);
    }
  };

  const availableBuildings = BUILDINGS.filter(b => {
    const alreadyBuilt = regionBuildings.some(i => i.id === b.id);
    const regionOk = (b.requiresRegion ?? 0) <= currentRegion;
    return !alreadyBuilt && regionOk;
  });

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-black/40">
        <div className="flex items-center gap-2 font-cinzel text-xs tracking-[0.25em] uppercase text-gold-dim">
          <Building2 size={14} /> Hane
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-dim">
          <span className="font-bold text-gold">{slots.used}</span>
          <span>/</span>
          <span>{slots.total} slot</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border text-xs font-cinzel">
        {(['build', 'active', 'synergy'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              'flex-1 py-2 tracking-widest uppercase transition-colors',
              activeTab === tab
                ? 'text-gold border-b-2 border-gold bg-gold/5'
                : 'text-ink-dim hover:text-ink hover:bg-white/[0.03]',
            ].join(' ')}
          >
            {tab === 'build' ? 'İnşa Et' : tab === 'active' ? 'Aktif' : 'Sinerji'}
          </button>
        ))}
      </div>

      {/* Build result flash */}
      {buildResult && (
        <div className="mx-3 mt-2 px-3 py-2 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-cinzel text-center">
          {buildResult}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">

        {/* ── BUILD TAB ── */}
        {activeTab === 'build' && (
          <div className="p-2 flex flex-col gap-1.5">
            {slots.used >= slots.total && (
              <div className="flex items-center gap-2 px-3 py-3 rounded-lg bg-red-900/20 border border-red-500/30 text-red-400 text-sm m-1">
                <Lock size={16} />
                <span>Tüm yapı slotları dolu. Prestige ile slot açabilirsin.</span>
              </div>
            )}
            {availableBuildings.length === 0 && slots.used < slots.total && (
              <p className="text-center text-ink-dim text-sm italic p-6 opacity-60">
                Bu bölgedeki tüm yapılar inşa edildi.
              </p>
            )}
            {availableBuildings.map(b => {
              const canAfford  = se >= b.cost;
              const noSlots    = slots.used >= slots.total;
              const blocked    = !canAfford || noSlots;
              const colors     = CATEGORY_COLORS[b.category] ?? CATEGORY_COLORS.soul;
              const tooltipTxt = [
                b.name,
                '',
                b.description,
                '',
                `Maliyet: ${formatSE(b.cost)} SE`,
                `İnşaat: ${formatBuildTime(b.buildTimeSec)}`,
                `Etki: ${b.effect}`,
                b.synergyWith?.length ? `Sinerji: ${b.synergyWith.join(', ')}` : '',
              ].filter(Boolean).join('\n');

              return (
                <TooltipWrapper key={b.id} content={tooltipTxt}>
                  <div
                    onClick={() => !blocked && handleBuild(b.id, b.cost)}
                    className={[
                      'flex flex-col gap-2 px-3 py-3 rounded-md border border-border border-l-2 transition-all duration-150',
                      colors.border, colors.bg,
                      blocked
                        ? 'opacity-40 cursor-not-allowed'
                        : 'cursor-pointer hover:brightness-110 active:scale-[0.99]',
                    ].join(' ')}
                  >
                    {/* Row 1: Name + cost */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Building2 size={15} className={colors.text} />
                        <span className={`font-cinzel font-bold text-sm leading-tight ${colors.text}`}>
                          {b.name}
                        </span>
                        <span className="text-[0.6rem] text-ink-dim/60 bg-black/30 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {CATEGORY_LABELS[b.category]}
                        </span>
                      </div>
                      <span className={`text-sm font-bold flex-shrink-0 ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatSE(b.cost)} SE
                      </span>
                    </div>

                    {/* Row 2: Description */}
                    <p className="text-xs text-ink-dim leading-snug">{b.description}</p>

                    {/* Row 3: Effect + build time */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-emerald-400/80">
                        <Zap size={12} />
                        <span className="text-xs font-medium">{b.effect}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400/70">
                        <Clock size={11} />
                        <span className="text-xs">{formatBuildTime(b.buildTimeSec)}</span>
                      </div>
                    </div>
                  </div>
                </TooltipWrapper>
              );
            })}
          </div>
        )}

        {/* ── ACTIVE TAB ── */}
        {activeTab === 'active' && (
          <div className="p-2 flex flex-col gap-1.5">
            {regionBuildings.length === 0 ? (
              <p className="text-center text-ink-dim text-sm italic p-6 opacity-60">
                Bu bölgede henüz yapı yok.
              </p>
            ) : (
              regionBuildings.map(inst => {
                const data = BUILDINGS.find(b => b.id === inst.id);
                if (!data) return null;
                const colors = CATEGORY_COLORS[data.category] ?? CATEGORY_COLORS.soul;
                return (
                  <div
                    key={inst.instanceId}
                    className={`flex flex-col gap-2 px-3 py-3 rounded-md border border-border border-l-2 ${colors.border} ${colors.bg}`}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 size={15} className={colors.text} />
                      <span className={`font-cinzel font-bold text-sm ${colors.text}`}>{data.name}</span>
                      {inst.completed && (
                        <CheckCircle2 size={14} className="text-emerald-400 ml-auto" />
                      )}
                    </div>
                    <p className="text-xs text-ink-dim">{data.effect}</p>
                    {!inst.completed && (
                      <BuildingProgress completesAt={inst.completesAt} />
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── SYNERGY TAB ── */}
        {activeTab === 'synergy' && (
          <div className="p-2 flex flex-col gap-1.5">
            {BUILDING_SYNERGIES.map(syn => {
              const isActive = activeSynergies.includes(syn.id);
              return (
                <div
                  key={syn.id}
                  className={[
                    'flex flex-col gap-1.5 px-3 py-3 rounded-md border transition-all',
                    isActive
                      ? 'border-gold/40 bg-gold/5 shadow-[0_0_12px_rgba(212,175,55,0.1)]'
                      : 'border-border/40 bg-black/20 opacity-50',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className={isActive ? 'text-gold' : 'text-ink-dim'} />
                      <span className={`font-cinzel font-bold text-sm ${isActive ? 'text-gold' : 'text-ink-dim'}`}>
                        {syn.name}
                      </span>
                    </div>
                    {isActive && (
                      <span className="text-[0.6rem] font-cinzel uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                        AKTİF
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-dim">{syn.description}</p>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {syn.buildings.map(bId => {
                      const bData = BUILDINGS.find(b => b.id === bId);
                      return (
                        <span key={bId} className="text-[0.62rem] bg-black/40 border border-border/30 px-2 py-0.5 rounded text-ink-dim">
                          {bData?.name ?? bId}
                        </span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
