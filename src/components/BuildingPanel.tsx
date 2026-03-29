import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { useBuildingStore } from '../store/buildingStore';
import { BUILDINGS, BUILDING_SYNERGIES } from '../data/buildingData';
import { formatSE } from '../systems/numberUtils';
import { soundManager } from '../systems/soundManager';
import TooltipWrapper from './TooltipWrapper';
import { Building2, Clock, Zap, CheckCircle2, Lock, Sparkles, ChevronRight } from 'lucide-react';

const CATEGORY_COLORS: Record<string, { border: string; text: string; bg: string }> = {
  soul:     { border: 'border-l-amber-600',   text: 'text-amber-400',   bg: 'bg-amber-900/5' },
  ritual:   { border: 'border-l-purple-600',  text: 'text-purple-400',  bg: 'bg-purple-900/5' },
  military: { border: 'border-l-red-600',     text: 'text-red-500',     bg: 'bg-red-900/5' },
  prestige: { border: 'border-l-indigo-600',  text: 'text-indigo-400',  bg: 'bg-indigo-900/5' },
};

const CATEGORY_LABELS: Record<string, string> = {
  soul: 'Ruh', ritual: 'Ritüel', military: 'Askeri', prestige: 'Prestij',
};

function formatBuildTime(sec: number): string {
  if (sec < 60)   return `${sec}sn`;
  if (sec < 3600) return `${Math.floor(sec / 60)}dk ${sec % 60}sn`;
  return `${Math.floor(sec / 3600)}sa ${Math.floor((sec % 3600) / 60)}dk`;
}

function BuildingProgress({ completesAt }: { completesAt: number }) {
  const now = Date.now();
  const remaining = Math.max(0, completesAt - now);

  if (remaining <= 0) {
    return (
      <div className="flex items-center gap-1.5 text-emerald-400 font-cinzel text-[10px] font-black uppercase tracking-widest">
        <CheckCircle2 size={12} /> Tamamlandı
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 mt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-amber-500/80">
          <Clock size={10} />
          <span className="text-[9px] font-bold uppercase tracking-wider">İnşa Ediliyor</span>
        </div>
        <span className="text-[10px] text-stone-500 font-bold tabular-nums">{formatBuildTime(Math.ceil(remaining / 1000))}</span>
      </div>
      <div className="h-1 bg-black/40 rounded-full overflow-hidden border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-amber-700 to-amber-500 rounded-full"
          style={{ width: '33%' /* approximate simplified for now */ }}
        />
      </div>
    </div>
  );
}

export default function BuildingPanel() {
  const se             = useGameStore(s => s.se);
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
    useGameStore.setState(s => ({ se: s.se - cost }));
    soundManager.init();
    soundManager.playBuy();

    const result = startBuilding(buildingId, currentRegion, cost + 0.1);
    if (result.success) {
      const data = BUILDINGS.find(b => b.id === buildingId);
      setBuildResult(`${data?.name} inşaatı başladı!`);
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
      <div 
        className="flex items-center justify-between px-4 py-3 border-b sticky top-0 z-20 backdrop-blur-sm shadow-lg"
        style={{ background: '#0a0608ee', borderColor: '#1e1210' }}
      >
        <div className="flex items-center gap-2 font-cinzel text-xs tracking-[0.3em] uppercase text-[#c9a85c] font-black">
          <Building2 size={14} className="opacity-70" />
          Hane Yapıları
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-stone-600 font-bold uppercase">{slots.used}/{slots.total} Slot</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ background: '#0d0809', borderColor: '#1e1210' }}>
        {(['build', 'active', 'synergy'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 font-cinzel text-[10px] tracking-[0.2em] uppercase transition-all duration-300
              ${activeTab === tab
                ? 'text-[#f0c060] bg-[#c9a85c0a] shadow-[inset_0_-2px_0_#c9a85c]'
                : 'text-stone-600 hover:text-stone-400 hover:bg-white/[0.02]'}`}
          >
            {tab === 'build' ? 'İnşa' : tab === 'active' ? 'Yapılar' : 'Sinerji'}
          </button>
        ))}
      </div>

      {buildResult && (
        <div className="mx-4 mt-3 px-3 py-2 rounded-sm bg-emerald-900/10 border border-emerald-900/30 text-emerald-400 text-[10px] font-cinzel font-black uppercase tracking-widest text-center anim-fade-in">
          {buildResult}
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-none p-3 space-y-2.5">
        {activeTab === 'build' && (
          <>
            {slots.used >= slots.total && (
              <div className="flex items-center gap-3 px-3 py-3 rounded-sm bg-red-900/10 border border-red-900/30 text-red-500 mb-2">
                <Lock size={14} strokeWidth={3} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Tüm inşaat yuvaları dolu</span>
              </div>
            )}
            
            {availableBuildings.map(b => {
              const canAfford  = se >= b.cost;
              const noSlots    = slots.used >= slots.total;
              const blocked    = !canAfford || noSlots;
              const colors     = CATEGORY_COLORS[b.category] ?? CATEGORY_COLORS.soul;
              
              return (
                <TooltipWrapper key={b.id} content={`${b.name}\n\n${b.description}\n\nEtki: ${b.effect}`}>
                  <div
                    onClick={() => !blocked && handleBuild(b.id, b.cost)}
                    className={`group relative flex flex-col p-3 border rounded-sm transition-all duration-300
                                ${blocked ? 'opacity-40 grayscale pointer-events-none' : 'cursor-pointer hover:bg-white/[0.03]'}
                                ${colors.border}`}
                    style={{ background: '#0a0608', borderColor: '#1e1210' }}
                  >
                    <div className="flex items-center justify-between gap-2 overflow-hidden mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm bg-black/40 border border-white/5 ${colors.text}`}>
                          {CATEGORY_LABELS[b.category]}
                        </span>
                        <span className="font-cinzel text-xs font-black text-stone-200 group-hover:text-white transition-colors">
                          {b.name}
                        </span>
                      </div>
                      <span className={`text-[10px] font-black ${canAfford ? 'text-emerald-400' : 'text-red-400'}`}>
                        {formatSE(b.cost)} SE
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-500 font-medium mb-3 leading-relaxed">
                      {b.description}
                    </p>

                    <div className="flex items-center justify-between border-t border-white/5 pt-2">
                      <div className="flex items-center gap-1 text-emerald-500/80 font-bold pr-2 overflow-hidden">
                        <Zap size={10} />
                        <span className="text-[10px] truncate">{b.effect}</span>
                      </div>
                      <div className="flex items-center gap-1 text-stone-600 font-bold whitespace-nowrap">
                        <Clock size={10} />
                        <span className="text-[9px] uppercase">{formatBuildTime(b.buildTimeSec)}</span>
                      </div>
                    </div>
                  </div>
                </TooltipWrapper>
              );
            })}
          </>
        )}

        {/* ── ACTIVE TAB ── */}
        {activeTab === 'active' && (
          <div className="space-y-2.5">
            {regionBuildings.length === 0 ? (
              <div className="py-12 flex flex-col items-center opacity-20">
                 <Building2 size={32} className="text-stone-700 mb-3" />
                 <span className="text-[10px] font-cinzel uppercase tracking-[0.3em]">Hane Henüz Boş</span>
              </div>
            ) : (
              regionBuildings.map(inst => {
                const data = BUILDINGS.find(b => b.id === inst.id);
                if (!data) return null;
                const colors = CATEGORY_COLORS[data.category] ?? CATEGORY_COLORS.soul;
                return (
                  <div
                    key={inst.instanceId}
                    className="flex flex-col p-3 rounded-sm border"
                    style={{ background: '#0a0608', borderColor: '#1e1210', borderLeftColor: '#c9a85c44' }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <Building2 size={12} className={colors.text} />
                        <span className={`font-cinzel text-xs font-black ${colors.text}`}>{data.name}</span>
                      </div>
                      {inst.completed && <CheckCircle2 size={12} className="text-emerald-400 opacity-60" />}
                    </div>
                    <p className="text-[10px] text-stone-500 font-medium">{data.effect}</p>
                    {!inst.completed && <BuildingProgress completesAt={inst.completesAt} />}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── SYNERGY TAB ── */}
        {activeTab === 'synergy' && (
          <div className="space-y-3">
            {BUILDING_SYNERGIES.map(syn => {
              const isActive = activeSynergies.includes(syn.id);
              return (
                <div
                  key={syn.id}
                  className={`flex flex-col p-4 rounded-sm border transition-all duration-500 relative overflow-hidden
                    ${isActive ? 'border-amber-900/30 bg-amber-900/5' : 'border-stone-900 bg-stone-950/20 opacity-30'}`}
                >
                  {isActive && (
                    <div className="absolute top-0 right-0 w-8 h-8 bg-amber-500/10 rounded-bl-3xl flex items-center justify-center">
                       <Sparkles size={12} className="text-amber-500 animate-pulse" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-cinzel text-xs font-black uppercase tracking-widest ${isActive ? 'text-[#f0c060]' : 'text-stone-600'}`}>
                      {syn.name}
                    </span>
                  </div>
                  
                  <p className={`text-[11px] font-medium leading-relaxed mb-3 ${isActive ? 'text-stone-300' : 'text-stone-600'}`}>
                    {syn.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {syn.buildings.map(bId => {
                      const bData = BUILDINGS.find(b => b.id === bId);
                      return (
                        <span key={bId} className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-sm border ${isActive ? 'bg-amber-950/20 border-amber-900/40 text-amber-600' : 'bg-black/20 border-stone-900 text-stone-800'}`}>
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
