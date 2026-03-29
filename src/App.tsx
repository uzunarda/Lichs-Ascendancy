import { useEffect, useRef, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { useBuildingStore } from './store/buildingStore';
import { useEventStore } from './store/eventStore';
import { REGIONS } from './data/gameData';
import ResourceBar    from './components/ResourceBar';
import LichSkull     from './components/LichSkull';
import RitualPanel   from './components/RitualPanel';
import HelperPanel   from './components/HelperPanel';
import UpgradePanel  from './components/UpgradePanel';
import RegionMap     from './components/RegionMap';
import PrestigePanel from './components/PrestigePanel';
import BuildingPanel from './components/BuildingPanel';
import SkillTreeView from './components/SkillTreeView';
import NotificationManager from './components/NotificationManager';
import WorldsModal   from './components/WorldsModal';
import ArtifactModal from './components/ArtifactModal';
import LeaderboardModal from './components/LeaderboardModal';
import SettingsModal from './components/SettingsModal';
import BossBanner     from './components/BossBanner';
import BossPanel      from './components/BossPanel';
import EventBanner     from './components/EventBanner';
import BottomNavbar  from './components/BottomNavbar';
import RuneCorner    from './components/shared/RuneCorner';
import './index.css';
import './styles/animation.css';
type TabId  = 'main' | 'army' | 'upgrades' | 'buildings' | 'prestige' | 'bosses';
type LeftTab = 'upgrades' | 'ritual';

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'main',      icon: '☠',  label: 'Taht' },
  { id: 'army',      icon: '⚔',  label: 'Ordu' },
  { id: 'bosses',    icon: '👿', label: 'Boss' },
  { id: 'upgrades',  icon: '✦',  label: 'Güç' },
  { id: 'buildings', icon: '🏙', label: 'Hane' },
  { id: 'prestige',  icon: '💎', label: 'Döngü' },
];

export default function App() {
  const loadSave       = useGameStore(s => s.loadSave);
  const saveGame       = useGameStore(s => s.saveGame);
  const tick           = useGameStore(s => s.tick);
  const processOffline = useGameStore(s => s.processOffline);
  const currentRegionIndex = useGameStore(s => s.currentRegionIndex);
  const lastSaved      = useGameStore(s => s.lastSaveTime);

  const [activeTab, setActiveTab]   = useState<TabId>('main');
  const [panelTab, setPanelTab]     = useState<'helpers' | 'buildings' | 'prestige'>('helpers');
  const [leftTab, setLeftTab]       = useState<LeftTab>('upgrades');
  const [offlineMsg, setOfflineMsg] = useState<string | null>(null);
  const [isWorldsModalOpen, setWorldsModalOpen] = useState(false);
  const [isSkillTreeModalOpen, setSkillTreeModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isBossPanelOpen, setBossPanelOpen] = useState(false);
  const [isArtifactsModalOpen, setArtifactsModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setLeaderboardModalOpen] = useState(false);
  const tickBuildings = useBuildingStore(s => s.tickBuildings);

  // ─── Desktop left panel (Upgrades / Rituals) ───────────────
  const DesktopLeftPanel = () => (
    <>
      <div className="flex border-b border-border bg-black/40">
        {(['upgrades', 'ritual'] as LeftTab[]).map(t => (
          <button
            key={t}
            onClick={() => setLeftTab(t)}
            className={`flex-1 py-2 font-cinzel text-[0.6rem] tracking-widest uppercase transition-colors
              ${leftTab === t
                ? 'text-gold border-b-2 border-gold bg-gold/5'
                : 'text-ink-dim hover:text-ink hover:bg-white/[0.03]'}`}
          >
            {t === 'upgrades' ? 'Güç' : 'Ritüel'}
          </button>
        ))}
      </div>
      {leftTab === 'upgrades'  && <UpgradePanel />}
      {leftTab === 'ritual'    && <RitualPanel />}
    </>
  );

  const tickRef = useRef(tick);
  tickRef.current = tick;

  useEffect(() => {
    loadSave();
    try {
      const raw = localStorage.getItem('lichs_ascendancy_save');
      if (raw) {
        const data = JSON.parse(raw);
        const sec = Math.min((Date.now() - (data.savedAt ?? Date.now())) / 1000, 28800);
        if (sec > 10) {
          setOfflineMsg(`${Math.floor(sec / 60)} dakika offline — SE birikimi eklendi!`);
          setTimeout(() => setOfflineMsg(null), 5000);
        }
      }
    } catch (_) {}
    processOffline();
  }, []);

  useEffect(() => {
    let last = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const delta = (now - last) / 1000;
      tickRef.current(delta);
      tickBuildings(now);
      
      // Event system tick
      const state = useGameStore.getState();
      useEventStore.getState().tick(delta, state.currentRegionIndex);

      last = now;
    }, 100);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => saveGame(), 30_000);
    const onUnload = () => saveGame();
    window.addEventListener('beforeunload', onUnload);
    return () => { clearInterval(id); window.removeEventListener('beforeunload', onUnload); };
  }, [saveGame]);

  const region = REGIONS[currentRegionIndex];

  return (
    <div
      className="relative flex flex-col h-screen overflow-hidden transition-all duration-[2000ms]"
      style={{ '--region-color': region.color } as React.CSSProperties}
    >
      {/* Arka plan */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-noise transition-all duration-[3000ms]"
        style={{ background: region.bgGradient }}
      />

      {/* Offline toast */}
      {offlineMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 anim-fade-in
                        bg-mid border border-gold text-gold font-cinzel text-sm
                        px-6 py-3 rounded-md shadow-gold">
          {offlineMsg}
        </div>
      )}

      <ResourceBar 
        onOpenWorlds={() => setWorldsModalOpen(true)}
        onOpenSkillTree={() => setSkillTreeModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenLeaderboard={() => setLeaderboardModalOpen(true)}
      />

      {/* DESKTOP (≥ 768px) */}
      <div className="relative z-10 flex-1 hidden md:grid md:grid-cols-[320px_1fr_320px] overflow-hidden pb-14">
        <aside 
          className="relative flex flex-col border-r overflow-hidden"
          style={{ background: '#0d0809', borderColor: '#1e1210' }}
        >
          <RuneCorner position="top-left" opacity={0.2} />
          <RuneCorner position="top-right" opacity={0.2} />
          <RuneCorner position="bottom-left" opacity={0.2} />
          <RuneCorner position="bottom-right" opacity={0.2} />

          <div className="flex border-b" style={{ background: '#0a0608', borderColor: '#1e1210' }}>
            {(['upgrades', 'ritual'] as LeftTab[]).map(t => (
              <button
                key={t}
                onClick={() => setLeftTab(t)}
                className={`flex-1 py-3 font-cinzel text-[0.7rem] tracking-[0.2em] uppercase transition-all duration-300
                  ${leftTab === t
                    ? 'text-[#f0c060] bg-[#c9a85c0a] shadow-[inset_0_-2px_0_#c9a85c]'
                    : 'text-stone-600 hover:text-stone-400 hover:bg-white/[0.02]'}`}
              >
                {t === 'upgrades' ? 'Güç' : 'Ritüel'}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden flex flex-col relative z-10">
            {leftTab === 'upgrades'  && <UpgradePanel />}
            {leftTab === 'ritual'    && <RitualPanel />}
          </div>
        </aside>
        
        <main className="flex flex-col items-center justify-center p-8 min-h-[70vh] relative overflow-hidden">
          {/* Runic Background Ring Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_120s_linear_infinite]">
              <circle cx="50" cy="50" r="48" fill="none" stroke="#c9a85c" strokeWidth="0.2" strokeDasharray="2 1" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#c9a85c" strokeWidth="0.1" />
              <path d="M50 2 L50 98 M2 50 L98 50 M16 16 L84 84 M16 84 L84 16" stroke="#c9a85c" strokeWidth="0.1" />
            </svg>
          </div>
          
          <LichSkull />
          
          <div className="mt-8 font-cinzel text-center opacity-70">
            <div className="text-sm tracking-[0.3em] font-black uppercase mb-1" style={{ color: '#c9a85c' }}>Ruh Çekirdeği</div>
            <div className="text-[10px] text-stone-500 tracking-widest font-bold">Karanlık giderek büyüyor...</div>
          </div>
        </main>
        
        <aside 
          className="relative flex flex-col border-l overflow-hidden"
          style={{ background: '#0d0809', borderColor: '#1e1210' }}
        >
          <RuneCorner position="top-left" opacity={0.2} />
          <RuneCorner position="top-right" opacity={0.2} />
          <RuneCorner position="bottom-left" opacity={0.2} />
          <RuneCorner position="bottom-right" opacity={0.2} />

          <div className="flex border-b" style={{ background: '#0a0608', borderColor: '#1e1210' }}>
            {(['helpers', 'buildings', 'prestige'] as const).map(t => (
              <button
                key={t}
                onClick={() => setPanelTab(t)}
                className={`flex-1 py-3 font-cinzel text-[0.7rem] tracking-[0.2em] uppercase transition-all duration-300
                  ${panelTab === t
                    ? 'text-[#f0c060] bg-[#c9a85c0a] shadow-[inset_0_-2px_0_#c9a85c]'
                    : 'text-stone-600 hover:text-stone-400 hover:bg-white/[0.02]'}`}
              >
                {t === 'helpers' ? 'Ordu' : t === 'buildings' ? 'Hane' : 'Prestige'}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden flex flex-col relative z-10">
            {panelTab === 'helpers'   && <HelperPanel />}
            {panelTab === 'buildings' && <BuildingPanel />}
            {panelTab === 'prestige'  && <PrestigePanel />}
          </div>
        </aside>
      </div>

      {/* MOBİL (< 768px) */}
      <div className="relative z-10 flex flex-col flex-1 md:hidden pb-16">
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {activeTab === 'main' && (
            <div className="flex flex-col items-center justify-center gap-5 px-4 py-12 min-h-[60vh]">
              <LichSkull />
            </div>
          )}
          {activeTab === 'army' && (
            <div className="flex flex-col h-full gap-4 p-2">
              <RitualPanel />
              <HelperPanel />
            </div>
          )}
          {activeTab === 'upgrades'  && <UpgradePanel />}
          {activeTab === 'buildings' && <BuildingPanel />}
          {activeTab === 'prestige'  && <PrestigePanel />}
          {activeTab === 'bosses'    && (
            <div className="p-4 h-full">
              <button 
                onClick={() => setBossPanelOpen(true)}
                className="w-full py-8 bg-void/10 border border-void/40 text-void font-cinzel font-black text-xl uppercase tracking-[0.2em] rounded-xl hover:bg-void/20 hover:border-void transition-all shadow-lg active:scale-[0.98] mb-4"
              >
                💀 SAVAŞ PANELİ
              </button>
              <div className="bg-surface/30 border border-border rounded-xl p-6 text-center text-ink-dim font-cinzel italic text-sm">
                Buradan boss panelini açarak kadim varlıklara meydan okuyabilirsin.
              </div>
            </div>
          )}
        </div>

        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16
                        bg-dark/95 border-t border-border backdrop-blur-md"
             style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors
                ${activeTab === tab.id ? 'text-gold bg-gold/[0.06]' : 'text-ink-dim'}`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="font-cinzel text-[0.7rem] tracking-wider uppercase">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <NotificationManager />
      <BossBanner />
      <EventBanner />
      <WorldsModal isOpen={isWorldsModalOpen} onClose={() => setWorldsModalOpen(false)} />
      <ArtifactModal isOpen={isArtifactsModalOpen} onClose={() => setArtifactsModalOpen(false)} />
      <LeaderboardModal isOpen={isLeaderboardModalOpen} onClose={() => setLeaderboardModalOpen(false)} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
      <SkillTreeView isOpen={isSkillTreeModalOpen} onClose={() => setSkillTreeModalOpen(false)} />
      <BossPanel isOpen={isBossPanelOpen} onClose={() => setBossPanelOpen(false)} />
      <BottomNavbar 
        onOpenWorlds={() => setWorldsModalOpen(true)}
        onOpenSkillTree={() => setSkillTreeModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenBosses={() => setBossPanelOpen(true)}
        onOpenArtifacts={() => setArtifactsModalOpen(true)}
        onOpenLeaderboard={() => setLeaderboardModalOpen(true)}
      />
    </div>
  );
}