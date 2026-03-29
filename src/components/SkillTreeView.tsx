import { useState } from 'react';
import { useSkillTreeStore } from '../store/skillTreeStore';
import { useGameStore } from '../store/gameStore';
import { SKILL_NODES, BRANCH_META } from '../data/skillTreeData';
import type { SkillBranch } from '../types';
import { X, Sparkles, AlertTriangle, Hexagon } from 'lucide-react';
import RuneCorner from './shared/RuneCorner';

// ─── Layout constants ─────────────────────────────────────────────────────────
const NODE_W   = 160;
const NODE_H   = 65;
const COL_GAP  = 190;
const ROW_GAP  = 90;
const PADDING  = 40;

function nodeX(col: number) { return PADDING + col * COL_GAP; }
function nodeY(row: number) { return PADDING + row * ROW_GAP; }

// Void warning modal
function VoidWarning({ node, onConfirm, onCancel }: {
  node: typeof SKILL_NODES[0];
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-500">
      <div 
        className="w-full max-w-sm mx-4 relative overflow-hidden p-8 border"
        style={{ background: '#0a0608', borderColor: '#1e1210' }}
      >
        <RuneCorner position="top-left" opacity={0.5} />
        <RuneCorner position="top-right" opacity={0.5} />
        <RuneCorner position="bottom-left" opacity={0.5} />
        <RuneCorner position="bottom-right" opacity={0.5} />

        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
             <AlertTriangle size={48} className="text-red-600 animate-pulse" />
          </div>
          <h2 className="font-cinzel text-xl font-black text-red-500 mt-2 tracking-[0.2em] uppercase">KARANLIK ANLAŞMA</h2>
          <p className="text-[10px] text-stone-500 mt-1 font-cinzel uppercase tracking-[0.3em] font-bold">Geri Dönüşü Olmayan Yol</p>
        </div>

        <p className="text-sm text-stone-400 text-center leading-relaxed mb-4 italic">
          <span className="text-red-400 font-black">"{node.name}"</span> düğümü ruhuna kazınacak.
        </p>
        
        <p className="text-xs text-stone-500 text-center leading-relaxed mb-8 border-y border-white/5 py-4">
          {node.description}
        </p>

        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 py-3 font-cinzel text-xs font-black uppercase tracking-widest text-stone-600 border border-stone-900 rounded-sm hover:text-stone-400 transition-colors"
          >
            Vazgeç
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 font-cinzel text-xs font-black uppercase tracking-widest text-red-500 border border-red-900/40 rounded-sm bg-red-900/5 hover:bg-red-900/10 transition-colors"
          >
            Mühürle
          </button>
        </div>
      </div>
    </div>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SkillTreeView({ isOpen, onClose }: Props) {
  const dp         = useSkillTreeStore(s => s.dp);
  const purchased  = useSkillTreeStore(s => s.purchased);
  const canUnlock  = useSkillTreeStore(s => s.canUnlock);
  const unlockNode = useSkillTreeStore(s => s.unlockNode);
  const bonuses    = useSkillTreeStore(s => s.bonuses);
  
  const prestigePowersSD = useGameStore(s => s.prestigePowersSD);
  const hasWisdom = prestigePowersSD?.some(p => p.id === 'infinite_wisdom' && p.purchased);
  const costMult = hasWisdom ? 0.5 : 1;

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [voidPending, setVoidPending] = useState<string | null>(null);
  const [activeBranch, setActiveBranch] = useState<SkillBranch | 'all'>('all');

  if (!isOpen) return null;

  const visibleNodes = activeBranch === 'all'
    ? SKILL_NODES
    : SKILL_NODES.filter(n => n.branch === activeBranch);

  const maxCol = Math.max(...visibleNodes.map(n => n.col));
  const maxRow = Math.max(...visibleNodes.map(n => n.row));
  const svgW   = nodeX(maxCol) + NODE_W + PADDING;
  const svgH   = nodeY(maxRow) + NODE_H + PADDING;

  const handleNodeClick = (nodeId: string) => {
    const node = SKILL_NODES.find(n => n.id === nodeId);
    if (!node || !canUnlock(nodeId, costMult)) return;
    if (node.voidPath) {
      setVoidPending(nodeId);
    } else {
      unlockNode(nodeId, costMult);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[150] flex flex-col backdrop-blur-3xl animate-in fade-in duration-700 overflow-hidden"
      style={{ background: '#0d0809' }}
    >
      <RuneCorner position="top-left" opacity={0.3} size={48} className="m-2" />
      <RuneCorner position="top-right" opacity={0.3} size={48} className="m-2" />
      <RuneCorner position="bottom-left" opacity={0.3} size={48} className="m-2" />
      <RuneCorner position="bottom-right" opacity={0.3} size={48} className="m-2" />

      {/* Header */}
      <div 
        className="flex items-center justify-between px-8 py-6 border-b relative z-10"
        style={{ background: '#0a0608aa', borderColor: '#1e1210' }}
      >
        <div className="flex items-center gap-4 font-cinzel text-xl tracking-[0.4em] uppercase text-stone-200 font-black">
          <Hexagon size={24} className="text-[#c9a85c] opacity-70" />
          Lanet Ağacı
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-stone-600 font-black font-cinzel uppercase tracking-[0.3em]">Rüya Parçaları</span>
            <span className="text-2xl font-black text-purple-400 font-cinzel tracking-widest" style={{ textShadow: '0 0 15px rgba(168,85,247,0.3)' }}>{dp} DP</span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-stone-600 hover:text-red-500 border border-stone-900 hover:border-red-900/40 rounded-sm transition-all duration-300"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b relative z-10" style={{ background: '#0d0809', borderColor: '#1e1210' }}>
        {(['all', 'death', 'decay', 'chaos', 'void'] as const).map(branch => {
          const meta = branch === 'all' ? { label: 'Tümü', icon: '✦', color: '#c9a85c' } : BRANCH_META[branch];
          const isActive = activeBranch === branch;
          return (
            <button
              key={branch}
              onClick={() => setActiveBranch(branch)}
              className={`flex-1 py-4 font-cinzel text-xs uppercase tracking-[0.3em] transition-all duration-500
                ${isActive ? 'font-black' : 'text-stone-700 hover:text-stone-400 hover:bg-white/[0.01]'}`}
              style={isActive ? { color: meta.color, background: `${meta.color}08`, boxShadow: `inset 0 -2px 0 ${meta.color}` } : {}}
            >
              <span className="mr-2 opacity-50">{meta.icon}</span> {meta.label}
            </button>
          );
        })}
      </div>

      {/* SVG Tree Content */}
      <div className="flex-1 overflow-auto p-8 scrollbar-none relative z-10">
        <svg
          width={svgW}
          height={svgH}
          className="mx-auto"
        >
          {/* Connections (Lines) */}
          {visibleNodes.map(node =>
            node.requires
              .filter(reqId => visibleNodes.some(n => n.id === reqId))
              .map(reqId => {
                const parent = SKILL_NODES.find(n => n.id === reqId);
                if (!parent) return null;
                const isPurchased = purchased.has(node.id) && purchased.has(reqId);
                const branchMeta  = BRANCH_META[node.branch];

                return (
                  <line
                    key={`${reqId}-${node.id}`}
                    x1={nodeX(parent.col) + NODE_W}
                    y1={nodeY(parent.row) + NODE_H / 2}
                    x2={nodeX(node.col)}
                    y2={nodeY(node.row)  + NODE_H / 2}
                    stroke={isPurchased ? branchMeta.color : '#1e1210'}
                    strokeWidth={isPurchased ? 2 : 1}
                    strokeDasharray={isPurchased ? '0' : '5 4'}
                    className="transition-all duration-1000"
                  />
                );
              })
          )}

          {/* Nodes */}
          {visibleNodes.map(node => {
            const isPurchased  = purchased.has(node.id);
            const canBuy       = canUnlock(node.id, costMult);
            const isHovered    = hoveredId === node.id;
            const branchMeta   = BRANCH_META[node.branch];
            const x = nodeX(node.col);
            const y = nodeY(node.row);

            let strokeColor = '#1e1210';
            let fillColor = '#0a0608';
            let textColor = '#2a1810';
            let dpColor = '#2a1810';

            if (isPurchased) {
              strokeColor = branchMeta.color;
              fillColor = `${branchMeta.color}15`;
              textColor = branchMeta.color;
              dpColor = '#10b981';
            } else if (canBuy) {
              strokeColor = `${branchMeta.color}44`;
              fillColor = `${branchMeta.color}05`;
              textColor = '#a8a29e';
              dpColor = '#c4b5fd';
            }

            return (
              <g
                key={node.id}
                onClick={() => handleNodeClick(node.id)}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="transition-all duration-300"
                style={{ cursor: canBuy ? 'pointer' : isPurchased ? 'default' : 'not-allowed' }}
              >
                {/* Node Box */}
                <rect
                  x={x} y={y} width={NODE_W} height={NODE_H}
                  rx={2} ry={2}
                  fill={fillColor}
                  stroke={isHovered && canBuy ? branchMeta.color : strokeColor}
                  strokeWidth={isPurchased ? 1.5 : (isHovered && canBuy) ? 1.5 : 1}
                  className="transition-all duration-300"
                />

                {/* Branch Accent (Left Bar) */}
                <rect 
                  x={x} y={y} width="3" height={NODE_H} 
                  fill={isPurchased || canBuy ? branchMeta.color : '#1e1210'} 
                  className="transition-all duration-500"
                />

                {/* Void Icon */}
                {node.voidPath && (
                  <text x={x + NODE_W - 14} y={y + 16} textAnchor="middle" fontSize={10} className="opacity-50">⚠️</text>
                )}

                {/* Node Name */}
                <text
                  x={x + 12} y={y + 26}
                  textAnchor="start"
                  fontSize={13}
                  fontWeight="900"
                  fontFamily="Cinzel, serif"
                  fill={textColor}
                  className="transition-colors duration-300 uppercase tracking-wider"
                >
                  {node.name}
                </text>

                {/* Node Cost */}
                <text
                  x={x + 12} y={y + 48}
                  textAnchor="start"
                  fontSize={10}
                  fontWeight="900"
                  fontFamily="Cinzel, serif"
                  fill={dpColor}
                  className="transition-colors duration-300 opacity-60 tracking-tighter"
                >
                  {isPurchased ? '✓ MÜHÜRLENDİ' : `${Math.floor(node.dpCost * costMult)} PARÇA`}
                </text>

                {/* Tooltip-like effect on hover */}
                {isHovered && (
                  <g className="animate-in fade-in zoom-in-95 duration-200">
                    <rect
                      x={x} y={y + NODE_H + 4} width={NODE_W * 1.5} height={40}
                      rx={2} fill="#0a0608" stroke={branchMeta.color} strokeWidth={1}
                      className="shadow-2xl z-50"
                    />
                    <text
                      x={x + 10} y={y + NODE_H + 28}
                      textAnchor="start" fontSize={11}
                      fontWeight="500"
                      fontFamily="'Alegreya Sans', sans-serif"
                      fill="#d1d5db"
                    >
                      {node.effect}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Footer Bonuses Summary */}
      <div 
        className="px-10 py-6 border-t relative z-10"
        style={{ background: '#0a0608', borderColor: '#1e1210' }}
      >
        <div className="text-[10px] font-cinzel font-black uppercase tracking-[0.4em] text-[#c9a85c] mb-4 flex items-center gap-3">
          <Sparkles size={12} className="opacity-50" />
          Karakter Bağlantıları & Aktif Sırr-ı Kadim
          <div className="flex-1 h-px bg-white/5" />
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-3 text-[11px] text-stone-500 font-black uppercase tracking-widest">
          {bonuses.globalSEMult > 1     && <span className="flex items-center gap-2"><div className="w-1 h-1 bg-red-500 rounded-full" /> Ruh ×{bonuses.globalSEMult.toFixed(2)}</span>}
          {bonuses.clickMult > 1        && <span className="flex items-center gap-2"><div className="w-1 h-1 bg-amber-500 rounded-full" /> Pençe ×{bonuses.clickMult.toFixed(2)}</span>}
          {bonuses.ritualChanceBonus > 0 && <span className="flex items-center gap-2"><div className="w-1 h-1 bg-purple-500 rounded-full" /> Ayin +%{Math.round(bonuses.ritualChanceBonus * 100)}</span>}
          {bonuses.offlineMult > 1      && <span className="flex items-center gap-2"><div className="w-1 h-1 bg-blue-500 rounded-full" /> Uyku ×{bonuses.offlineMult.toFixed(1)}</span>}
          {bonuses.buildTimeMult < 1    && <span className="flex items-center gap-2"><div className="w-1 h-1 bg-emerald-500 rounded-full" /> Mimari −%{Math.round((1 - bonuses.buildTimeMult) * 100)}</span>}
          {bonuses.curseStoneBonus > 0  && <span className="flex items-center gap-2"><div className="w-1 h-1 bg-white rounded-full" /> Cevher +{bonuses.curseStoneBonus}/sn</span>}
          {purchased.size === 0 && (
            <span className="italic opacity-30">Ağaç henüz filizlenmedi — Rüya Parçası topla!</span>
          )}
        </div>
      </div>

      {/* Void Warning Modal */}
      {voidPending && (
        <VoidWarning
          node={SKILL_NODES.find(n => n.id === voidPending)!}
          onConfirm={() => { unlockNode(voidPending!, costMult); setVoidPending(null); }}
          onCancel={() => setVoidPending(null)}
        />
      )}
    </div>
  );
}
