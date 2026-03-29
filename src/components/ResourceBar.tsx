import { useEffect, useRef, useState } from 'react';
import { useGameStore, calcCurrentSEperSec, calcCurrentClickValue } from '../store/gameStore';
import { useSkillTreeStore } from '../store/skillTreeStore';
import { formatSE } from '../systems/numberUtils';
import { REGIONS } from '../data/gameData';
import RuneCorner from './shared/RuneCorner';

interface Props {
  onOpenWorlds?: () => void;
  onOpenSkillTree?: () => void;
  onOpenSettings?: () => void;
  onOpenLeaderboard?: () => void;
}

// ── Küçük SVG ikonlar ──────────────────────────────────────────────────────

function GemIcon({ color }: { color: string }) {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" className="inline-block mb-0.5 ml-0.5">
      <polygon points="5,1 9,4 7,9 3,9 1,4" fill={color} />
    </svg>
  );
}

function DiamondIcon({ color }: { color: string }) {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" className="inline-block mb-0.5 ml-0.5">
      <path d="M5 1L9 5L5 9L1 5Z" fill={color} />
    </svg>
  );
}

function SparkIcon({ color }: { color: string }) {
  return (
    <svg width="9" height="9" viewBox="0 0 10 10" className="inline-block mb-0.5 ml-0.5">
      <path d="M5 1L7 4H10L7.5 6.5L8.5 10L5 8L1.5 10L2.5 6.5L0 4H3Z" fill={color} />
    </svg>
  );
}

function LocationDotIcon({ color }: { color: string }) {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8">
      <circle cx="4" cy="4" r="3.5" stroke={color} strokeWidth="0.8" fill="none" />
      <circle cx="4" cy="4" r="1.2" fill={color} />
    </svg>
  );
}

// ── Yardımcı bileşenler ────────────────────────────────────────────────────

interface ResourcePillProps {
  label: string;
  value: string | number;
  valueColor: string;
  labelColor: string;
  icon: React.ReactNode;
  hidden?: boolean;
}

function ResourcePill({ label, value, valueColor, labelColor, icon, hidden }: ResourcePillProps) {
  if (hidden) {
    return (
      <div className="flex flex-col items-center px-3 border-r border-white/5 last:border-r-0 gap-1 opacity-20">
        <span className="text-[7px] tracking-[0.2em] uppercase font-bold text-stone-800">{label}</span>
        <span className="text-sm font-bold text-stone-800 blur-sm select-none">???</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-3 border-r border-white/5 last:border-r-0 gap-0.5">
      <span className={`text-[7px] tracking-[0.2em] uppercase font-bold ${labelColor} opacity-70`}>{label}</span>
      <div className="flex items-center">
        <span className={`text-base font-bold tracking-wide ${valueColor}`}>{value}</span>
        {icon}
      </div>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  valueColor: string;
}

function StatItem({ label, value, valueColor }: StatItemProps) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[7px] tracking-[0.25em] uppercase font-bold text-stone-700">{label}</span>
      <span className={`text-[13px] font-bold tracking-wide ${valueColor}`}>{value}</span>
    </div>
  );
}

// ── Ana bileşen ────────────────────────────────────────────────────────────

export default function ResourceBar({ onOpenWorlds, onOpenSkillTree, onOpenSettings, onOpenLeaderboard }: Props) {
  const se = useGameStore(s => s.se);
  const curseStones = useGameStore(s => s.curseStones);
  const dc = useGameStore(s => s.dc);
  const sd = useGameStore(s => s.sd);
  const vt = useGameStore(s => s.vt);
  const currentRegionIndex = useGameStore(s => s.currentRegionIndex);
  const dp = useSkillTreeStore(s => s.dp);

  const [sePerSec, setSePerSec] = useState(0);
  const [clickValue, setClickValue] = useState(0);

  const currentRegion = REGIONS[currentRegionIndex];

  useEffect(() => {
    const id = setInterval(() => {
      setSePerSec(calcCurrentSEperSec());
      setClickValue(calcCurrentClickValue());
    }, 500);
    return () => clearInterval(id);
  }, []);

  const showDC = dc > 0 || curseStones >= 1000;
  const showSD = sd > 0 || dc >= 100;

  return (
    <div className="relative z-10 flex flex-col" style={{ background: '#0d0809', borderBottom: '1px solid #1e1210' }}>
      {/* Üst altın çizgi */}
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, #c9a85c44, #c9a85c88, #c9a85c44, transparent)' }}
      />

      {/* Alt koyu çizgi */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, #3a221540, #3a221580, #3a221540, transparent)' }}
      />

      {/* Köşe runeleri */}
      <RuneCorner position="top-left" opacity={0.3} />
      <RuneCorner position="top-right" opacity={0.3} />
      <RuneCorner position="bottom-left" opacity={0.3} />
      <RuneCorner position="bottom-right" opacity={0.3} />

      {/* ── Kaynak Satırı ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-0 py-2 px-4 overflow-x-auto scrollbar-none relative">

        {/* ── PRİMER: Ruh Özü ───────────────────────────────────────────── */}
        <div
          className="flex flex-col items-start pr-5 flex-shrink-0 relative"
          style={{ borderRight: '1px solid #2a1810' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80px 60px at 40% 50%, #c9a85c0a 0%, transparent 70%)',
            }}
          />
          <span
            className="font-cinzel text-[8px] tracking-[0.3em] uppercase font-bold mb-0.5"
            style={{ color: '#7a5a30' }}
          >
            Ruh Özü
          </span>
          <div className="flex items-baseline gap-1">
            <span
              className="font-cinzel text-xl md:text-3xl font-black"
              style={{
                color: '#f0c060',
                textShadow: '0 0 24px #c9a85c25',
                animation: 'goldPulse 3s ease-in-out infinite',
              }}
            >
              {formatSE(se)}
            </span>
            <span className="text-[8px] font-bold uppercase" style={{ color: '#5a3a20' }}>
              SE
            </span>
          </div>
        </div>

        <span className="text-xs mx-3 flex-shrink-0 hidden md:block" style={{ color: '#2a1810' }}>✦</span>

        {/* ── İKİNCİL KAYNAKLAR ─────────────────────────────────────────── */}
        <div className="flex items-center flex-shrink-0" style={{ borderRight: '1px solid #2a1810' }}>
          <ResourcePill
            label="Lanet Taşı"
            value={curseStones}
            valueColor="text-purple-400"
            labelColor="text-purple-800"
            icon={<GemIcon color="#a855f7" />}
          />
          <ResourcePill
            label="Kristal"
            value={dc}
            valueColor="text-blue-400"
            labelColor="text-blue-800"
            icon={<DiamondIcon color="#60a5fa" />}
            hidden={!showDC}
          />
          <ResourcePill
            label="Kıvılcım"
            value={sd}
            valueColor="text-yellow-400"
            labelColor="text-yellow-800"
            icon={<SparkIcon color="#facc15" />}
            hidden={!showSD}
          />
        </div>

        <span className="text-xs mx-3 flex-shrink-0 hidden md:block" style={{ color: '#2a1810' }}>✦</span>

        {/* ── STATS PANEL ───────────────────────────────────────────────── */}
        <div
          className="flex flex-col items-center gap-1.5 px-5 flex-shrink-0 relative"
          style={{ borderRight: '1px solid #2a1810' }}
        >
          <span className="absolute -top-0 left-1/2 -translate-x-1/2 text-[8px]" style={{ color: '#2a1810' }}>✦</span>

          <div className="flex gap-4">
            <StatItem label="Üretim" value={`+${formatSE(sePerSec)}/sn`} valueColor="text-emerald-400" />
            <StatItem label="Güç" value={`×${formatSE(clickValue)}`} valueColor="text-amber-300" />
          </div>

          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-sm"
            style={{ background: '#1a0d2e', border: '1px solid #3b1f6a' }}
          >
            <LocationDotIcon color={currentRegion.color || '#8b5cf6'} />
            <span className="text-[7px] font-bold uppercase tracking-widest truncate max-w-[110px]" style={{ color: currentRegion.color || '#8b5cf6' }}>
              {currentRegion.bonus?.description || 'Bonus Yok'}
            </span>
          </div>

          <span className="absolute -bottom-0 left-1/2 -translate-x-1/2 text-[8px]" style={{ color: '#2a1810' }}>✦</span>
        </div>

        <span className="text-xs mx-3 flex-shrink-0 hidden md:block" style={{ color: '#2a1810' }}>✦</span>

        {/* ── MATERYALLER ────────────────────────────────────────────────── */}
        <div className="flex items-center flex-shrink-0">
          <ResourcePill
            label="Yokluk Tozu"
            value={vt}
            valueColor="text-purple-300"
            labelColor="text-purple-900"
            icon={<span className="text-[8px] text-purple-600 ml-0.5">VT</span>}
          />
          <ResourcePill
            label="Rüya Parçası"
            value={dp}
            valueColor="text-cyan-400"
            labelColor="text-cyan-900"
            icon={<span className="text-[8px] text-cyan-700 ml-0.5">DP</span>}
          />
        </div>
      </div>

      <style>{`
        @keyframes goldPulse {
          0%, 100% { color: #f0c060; }
          50% { color: #ffd870; }
        }
      `}</style>
    </div>
  );
}