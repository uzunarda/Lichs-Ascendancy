import { useEffect, useRef, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { REGIONS } from './data/gameData';
import ResourceBar   from './components/ResourceBar';
import LichSkull     from './components/LichSkull';
import RitualPanel   from './components/RitualPanel';
import HelperPanel   from './components/HelperPanel';
import UpgradePanel  from './components/UpgradePanel';
import RegionMap     from './components/RegionMap';
import PrestigePanel from './components/PrestigePanel';
import './index.css';
import './styles/animation.css';
type TabId = 'main' | 'army' | 'upgrades' | 'prestige';

const TABS: { id: TabId; icon: string; label: string }[] = [
  { id: 'main',     icon: '☠',  label: 'Taht' },
  { id: 'army',     icon: '⚔',  label: 'Ordu' },
  { id: 'upgrades', icon: '✦',  label: 'Güç' },
  { id: 'prestige', icon: '💀', label: 'Döngü' },
];

export default function App() {
  const loadSave       = useGameStore(s => s.loadSave);
  const saveGame       = useGameStore(s => s.saveGame);
  const tick           = useGameStore(s => s.tick);
  const processOffline = useGameStore(s => s.processOffline);
  const currentRegionIndex = useGameStore(s => s.currentRegionIndex);
  const lastSaved      = useGameStore(s => s.lastSaveTime);

  const [activeTab, setActiveTab]   = useState<TabId>('main');
  const [panelTab, setPanelTab]     = useState<'helpers' | 'prestige'>('helpers');
  const [offlineMsg, setOfflineMsg] = useState<string | null>(null);

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
      className="relative flex flex-col min-h-screen transition-all duration-[2000ms]"
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

      <ResourceBar />

      {/* DESKTOP (≥ 768px) */}
      <div className="relative z-10 flex-1 hidden md:grid md:grid-cols-[260px_1fr_300px] lg:grid-cols-[280px_1fr_320px]">
        <aside className="flex flex-col border-r border-border bg-black/70 backdrop-blur-sm overflow-hidden">
          <UpgradePanel />
          <RegionMap />
        </aside>
        <main className="flex flex-col items-center justify-center gap-8 p-8 min-h-[70vh]">
          <LichSkull />
          <RitualPanel />
        </main>
        <aside className="flex flex-col border-l border-border bg-black/70 backdrop-blur-sm overflow-hidden">
          <div className="flex border-b border-border bg-black/40">
            {(['helpers', 'prestige'] as const).map(t => (
              <button
                key={t}
                onClick={() => setPanelTab(t)}
                className={`flex-1 py-2.5 font-cinzel text-[0.8rem] tracking-widest uppercase transition-colors
                  ${panelTab === t
                    ? 'text-gold border-b-2 border-gold bg-gold/5'
                    : 'text-ink-dim hover:text-ink hover:bg-white/[0.03]'}`}
              >
                {t === 'helpers' ? 'Ordu' : 'Prestige'}
              </button>
            ))}
          </div>
          {panelTab === 'helpers'  && <HelperPanel />}
          {panelTab === 'prestige' && <PrestigePanel />}
        </aside>
      </div>

      {/* MOBİL (< 768px) */}
      <div className="relative z-10 flex flex-col flex-1 md:hidden pb-16">
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {activeTab === 'main' && (
            <div className="flex flex-col items-center gap-5 px-4 py-6">
              <LichSkull />
              <RitualPanel />
              <RegionMap />
            </div>
          )}
          {activeTab === 'army'     && <HelperPanel />}
          {activeTab === 'upgrades' && <UpgradePanel />}
          {activeTab === 'prestige' && <PrestigePanel />}
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

      {/* Footer — sadece desktop */}
      <footer className="hidden md:flex relative z-10 items-center gap-4 px-6 py-2
                         bg-black/80 border-t border-border backdrop-blur-md">
        <button
          onClick={saveGame}
          className="font-cinzel text-[0.75rem] tracking-widest uppercase text-ink-dim
                     border border-border px-3 py-1.5 rounded hover:text-ink
                     hover:border-border-hover transition-colors"
        >
          💾 Kaydet
        </button>
        <span className="text-[0.75rem] text-ink-dim italic">
          Son kayıt: {new Date(lastSaved).toLocaleTimeString('tr')}
        </span>
      </footer>
    </div>
  );
}