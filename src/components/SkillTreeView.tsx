import { useState } from 'react';
import { useSkillTreeStore } from '../store/skillTreeStore';
import { SKILL_NODES, BRANCH_META } from '../data/skillTreeData';
import type { SkillBranch } from '../types';

// ─── Layout constants ─────────────────────────────────────────────────────────
const NODE_W   = 130;
const NODE_H   = 52;
const COL_GAP  = 160;
const ROW_GAP  = 68;
const PADDING  = 24;

function nodeX(col: number) { return PADDING + col * COL_GAP; }
function nodeY(row: number) { return PADDING + row * ROW_GAP; }

// Void warning modal
function VoidWarning({ node, onConfirm, onCancel }: {
  node: typeof SKILL_NODES[0];
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 bg-dark border-2 border-void/60 rounded-xl p-6 shadow-[0_0_40px_rgba(167,139,250,0.3)]">
        <div className="text-center mb-4">
          <span className="text-4xl">🕳️</span>
          <h2 className="font-cinzel text-lg font-black text-void mt-2">YOKLUK YOLU</h2>
          <p className="text-xs text-ink-dim mt-1 font-cinzel uppercase tracking-widest">Geri Dönüş Yok</p>
        </div>
        <p className="text-sm text-ink-dim text-center leading-relaxed mb-2">
          <span className="text-void font-bold">"{node.name}"</span> seçimi geri alınamaz.
        </p>
        <p className="text-sm text-ink text-center leading-relaxed mb-6">
          {node.description}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2 font-cinzel text-sm uppercase tracking-wider text-ink-dim border border-border rounded hover:bg-surface transition-colors"
          >
            Geri Dön
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 font-cinzel text-sm uppercase tracking-wider text-void font-bold border border-void/50 rounded bg-void/10 hover:bg-void/20 transition-colors"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SkillTreeView() {
  const dp         = useSkillTreeStore(s => s.dp);
  const purchased  = useSkillTreeStore(s => s.purchased);
  const canUnlock  = useSkillTreeStore(s => s.canUnlock);
  const unlockNode = useSkillTreeStore(s => s.unlockNode);
  const bonuses    = useSkillTreeStore(s => s.bonuses);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [voidPending, setVoidPending] = useState<string | null>(null);
  const [activeBranch, setActiveBranch] = useState<SkillBranch | 'all'>('all');

  // Filter nodes by branch
  const visibleNodes = activeBranch === 'all'
    ? SKILL_NODES
    : SKILL_NODES.filter(n => n.branch === activeBranch);

  // SVG bounding box
  const maxCol = Math.max(...visibleNodes.map(n => n.col));
  const maxRow = Math.max(...visibleNodes.map(n => n.row));
  const svgW   = nodeX(maxCol) + NODE_W + PADDING;
  const svgH   = nodeY(maxRow) + NODE_H + PADDING;

  const handleNodeClick = (nodeId: string) => {
    const node = SKILL_NODES.find(n => n.id === nodeId);
    if (!node || !canUnlock(nodeId)) return;
    if (node.voidPath) {
      setVoidPending(nodeId);
    } else {
      unlockNode(nodeId);
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-black/40">
        <div className="flex items-center gap-2 font-cinzel text-xs tracking-[0.25em] uppercase text-void">
          🕸 Lanet Ağacı
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-ink-dim font-cinzel">Rüya Parçası:</span>
          <span className="text-sm font-black text-purple-400 font-cinzel">{dp} DP</span>
        </div>
      </div>

      {/* ── Branch filter tabs ── */}
      <div className="flex border-b border-border bg-black/30">
        {(['all', 'death', 'decay', 'chaos', 'void'] as const).map(branch => {
          const meta = branch === 'all' ? { label: 'Tümü', icon: '✦', color: '#a09faf' } : BRANCH_META[branch];
          return (
            <button
              key={branch}
              onClick={() => setActiveBranch(branch)}
              className={[
                'flex-1 py-1.5 font-cinzel text-[0.6rem] uppercase tracking-wider transition-colors',
                activeBranch === branch ? 'border-b-2' : 'text-ink-dim hover:text-ink',
              ].join(' ')}
              style={activeBranch === branch ? { color: meta.color, borderColor: meta.color } : {}}
            >
              {meta.icon} {meta.label}
            </button>
          );
        })}
      </div>

      {/* ── SVG Tree ── */}
      <div className="flex-1 overflow-auto p-2">
        <svg
          width={svgW}
          height={svgH}
          className="min-w-full"
          style={{ minHeight: svgH }}
        >
          {/* Edges (connections) */}
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
                    stroke={isPurchased ? branchMeta.color : '#ffffff15'}
                    strokeWidth={isPurchased ? 2 : 1}
                    strokeDasharray={isPurchased ? '0' : '4 3'}
                  />
                );
              })
          )}

          {/* Nodes */}
          {visibleNodes.map(node => {
            const isPurchased  = purchased.has(node.id);
            const canBuy       = canUnlock(node.id);
            const isHovered    = hoveredId === node.id;
            const branchMeta   = BRANCH_META[node.branch];
            const x = nodeX(node.col);
            const y = nodeY(node.row);

            let fillColor = '#0a060f';
            let strokeColor = '#ffffff18';
            let opacity = 0.45;

            if (isPurchased) {
              fillColor  = `${branchMeta.color}22`;
              strokeColor = branchMeta.color;
              opacity    = 1;
            } else if (canBuy) {
              fillColor  = `${branchMeta.color}10`;
              strokeColor = `${branchMeta.color}70`;
              opacity    = 1;
            }

            return (
              <g
                key={node.id}
                onClick={() => handleNodeClick(node.id)}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ cursor: canBuy ? 'pointer' : isPurchased ? 'default' : 'not-allowed', opacity }}
              >
                {/* Node rect */}
                <rect
                  x={x} y={y} width={NODE_W} height={NODE_H}
                  rx={8} ry={8}
                  fill={fillColor}
                  stroke={isHovered && canBuy ? branchMeta.color : strokeColor}
                  strokeWidth={isPurchased ? 1.5 : isHovered ? 1.5 : 1}
                  filter={isPurchased ? `drop-shadow(0 0 6px ${branchMeta.color}60)` : undefined}
                />

                {/* Void badge */}
                {node.voidPath && (
                  <text x={x + NODE_W - 10} y={y + 14} textAnchor="middle" fontSize={10}>⚠️</text>
                )}

                {/* Name */}
                <text
                  x={x + NODE_W / 2} y={y + 20}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="bold"
                  fontFamily="'Cormorant SC', serif"
                  fill={isPurchased ? branchMeta.color : canBuy ? '#fef9ec' : '#6b7280'}
                >
                  {node.name}
                </text>

                {/* Cost */}
                <text
                  x={x + NODE_W / 2} y={y + 34}
                  textAnchor="middle"
                  fontSize={9}
                  fontFamily="'Alegreya Sans', sans-serif"
                  fill={isPurchased ? '#10b981' : canBuy ? '#a78bfa' : '#4b5563'}
                >
                  {isPurchased ? '✓ Alındı' : `${node.dpCost} DP`}
                </text>

                {/* Effect (on hover) */}
                {isHovered && (
                  <>
                    <rect
                      x={x} y={y + NODE_H + 4} width={NODE_W + 20} height={28}
                      rx={4} fill="#050010" stroke={branchMeta.color} strokeWidth={0.8} opacity={0.95}
                    />
                    <text
                      x={x + (NODE_W + 20) / 2} y={y + NODE_H + 18}
                      textAnchor="middle" fontSize={8.5}
                      fontFamily="'Alegreya Sans', sans-serif"
                      fill="#fef9ec"
                    >
                      {node.effect}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Active Bonuses summary ── */}
      <div className="border-t border-border bg-black/40 px-3 py-2">
        <div className="text-[0.6rem] font-cinzel uppercase tracking-widest text-ink-dim/60 mb-1">Aktif Bonuslar</div>
        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-[0.65rem] text-ink-dim">
          {bonuses.globalSEMult > 1     && <span>🔁 Üretim ×{bonuses.globalSEMult.toFixed(2)}</span>}
          {bonuses.clickMult > 1        && <span>👆 Click ×{bonuses.clickMult.toFixed(2)}</span>}
          {bonuses.ritualChanceBonus > 0 && <span>🔮 Ritüel +%{Math.round(bonuses.ritualChanceBonus * 100)}</span>}
          {bonuses.offlineMult > 1      && <span>💤 Offline ×{bonuses.offlineMult.toFixed(1)}</span>}
          {bonuses.buildTimeMult < 1    && <span>🏗 İnşaat −%{Math.round((1 - bonuses.buildTimeMult) * 100)}</span>}
          {bonuses.curseStoneBonus > 0  && <span>💎 +{bonuses.curseStoneBonus}/sn</span>}
          {purchased.size === 0 && (
            <span className="italic opacity-50">Henüz node alınmadı — Rüya Parçası kazan!</span>
          )}
        </div>
      </div>

      {/* ── Void Warning Modal ── */}
      {voidPending && (
        <VoidWarning
          node={SKILL_NODES.find(n => n.id === voidPending)!}
          onConfirm={() => { unlockNode(voidPending!); setVoidPending(null); }}
          onCancel={() => setVoidPending(null)}
        />
      )}
    </div>
  );
}
