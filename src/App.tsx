import { useEffect, useRef, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { useBuildingStore } from './store/buildingStore';
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
import SettingsModal from './components/SettingsModal';
import BottomNavbar  from './components/BottomNavbar';
import './index.css';
import './styles/animation.css';
type TabId  = 'main' | 'army' | 'upgrades' | 'buildings' | 'skilltree' | 'prestige';
type LeftTab = 'upgrades' | 'skilltree' | 'ritual';

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'main',      icon: '☠',  label: 'Taht' },
  { id: 'army',      icon: '⚔',  label: 'Ordu' },
  { id: 'upgrades',  icon: '✦',  label: 'Güç' },
  { id: 'buildings', icon: '🏙', label: 'Hane' },
  { id: 'skilltree', icon: '🕸', label: 'Ağaç' },
  { id: 'prestige',  icon: '💀', label: 'Döngü' },
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
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const tickBuildings = useBuildingStore(s => s.tickBuildings);

  // ─── Desktop left panel (Upgrades / Skill Tree / Rituals) ───────────────
  const DesktopLeftPanel = () => (
    <>
      <div className="flex border-b border-border bg-black/40">
        {(['upgrades', 'skilltree', 'ritual'] as LeftTab[]).map(t => (
          <button
            key={t}
            onClick={() => setLeftTab(t)}
            className={`flex-1 py-2 font-cinzel text-[0.6rem] tracking-widest uppercase transition-colors
              ${leftTab === t
                ? 'text-gold border-b-2 border-gold bg-gold/5'
                : 'text-ink-dim hover:text-ink hover:bg-white/[0.03]'}`}
          >
            {t === 'upgrades' ? 'Güç' : t === 'skilltree' ? 'Ağaç' : 'Ritüel'}
          </button>
        ))}
      </div>
      {leftTab === 'upgrades'  && <UpgradePanel />}
      {leftTab === 'skilltree' && <SkillTreeView />}
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
      tickRef.current((now - last) / 1000);
      tickBuildings(now);
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
        onOpenSettings={() => setSettingsModalOpen(true)}
      />

      {/* DESKTOP (≥ 768px) */}
      <div className="relative z-10 flex-1 hidden md:grid md:grid-cols-[320px_1fr_320px] overflow-hidden pb-12">
        <aside className="flex flex-col border-r border-border bg-black/75 backdrop-blur-sm overflow-hidden">
          <DesktopLeftPanel />
        </aside>
        
        <main className="flex flex-col items-center justify-center p-8 min-h-[70vh] relative overflow-hidden">
          {/* Runic Background Ring Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_60s_linear_infinite]">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gold" strokeDasharray="2 1" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-gold" />
              <path d="M50 2 L50 98 M2 50 L98 50 M16 16 L84 84 M16 84 L84 16" stroke="currentColor" strokeWidth="0.2" className="text-gold opacity-50" />
            </svg>
          </div>
          
          <LichSkull />
          
          <div className="mt-8 font-cinzel text-center opacity-70">
            <div className="text-sm tracking-[0.3em] text-gold-dim uppercase mb-1">Ruh Çekirdeği</div>
            <div className="text-xs text-ink-dim">Karanlık giderek büyüyor...</div>
          </div>
        </main>
        
        <aside className="flex flex-col border-l border-border bg-black/75 backdrop-blur-sm overflow-hidden">
          <div className="flex border-b border-border bg-black/40">
            {(['helpers', 'buildings', 'prestige'] as const).map(t => (
              <button
                key={t}
                onClick={() => setPanelTab(t)}
                className={`flex-1 py-2 font-cinzel text-xs tracking-widest uppercase transition-colors
                  ${panelTab === t
                    ? 'text-gold border-b-2 border-gold bg-gold/5'
                    : 'text-ink-dim hover:text-ink hover:bg-white/[0.03]'}`}
              >
                {t === 'helpers' ? 'Ordu' : t === 'buildings' ? 'Hane' : 'Prestige'}
              </button>
            ))}
          </div>
          {panelTab === 'helpers'   && <HelperPanel />}
          {panelTab === 'buildings' && <BuildingPanel />}
          {panelTab === 'prestige'  && <PrestigePanel />}
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
          {activeTab === 'skilltree' && <SkillTreeView />}
          {activeTab === 'prestige'  && <PrestigePanel />}
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
      <WorldsModal isOpen={isWorldsModalOpen} onClose={() => setWorldsModalOpen(false)} />
      <SettingsModal isOpen={isSettingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
      <BottomNavbar 
        onOpenWorlds={() => setWorldsModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />
    </div>
  );
}