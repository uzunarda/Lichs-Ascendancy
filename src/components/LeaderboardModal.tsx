import { useLeaderboardStore } from '../store/leaderboardStore';
import { useGameStore } from '../store/gameStore';
import { formatSE } from '../systems/numberUtils';
import { X, Trophy, Medal, Crown, Star, RefreshCw, Award, Hexagon } from 'lucide-react';
import { useEffect } from 'react';
import RuneCorner from './shared/RuneCorner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaderboardModal({ isOpen, onClose }: Props) {
  const { entries, isLoading, refresh } = useLeaderboardStore();
  const playerTotalSE = useGameStore(s => s.totalSE);

  useEffect(() => {
    if (isOpen) refresh();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="w-full max-w-lg relative border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300"
        style={{ background: '#0a0608', borderColor: '#1e1210' }}
      >
        <RuneCorner position="top-left" opacity={0.4} />
        <RuneCorner position="top-right" opacity={0.4} />
        <RuneCorner position="bottom-left" opacity={0.4} />
        <RuneCorner position="bottom-right" opacity={0.4} />

        {/* Header */}
        <div 
          className="px-8 py-6 border-b flex justify-between items-center relative z-10"
          style={{ background: '#0d0809ee', borderColor: '#1e1210' }}
        >
          <div className="flex items-center gap-4">
              <Crown size={24} className="text-[#c9a85c] opacity-70" />
              <div>
                 <h2 className="font-cinzel text-sm md:text-base font-black text-[#c9a85c] tracking-[0.3em] uppercase">Efsaneler Kürsüsü</h2>
                 <p className="text-[9px] font-cinzel text-stone-600 uppercase tracking-[0.2em] font-bold">Karanlığın kadim efendileri...</p>
              </div>
          </div>
          <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-red-500 border border-stone-900 hover:border-red-900/40 rounded-sm transition-all duration-300"
          >
              <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-none relative z-10 space-y-3">
            {entries.map((entry) => (
                <div 
                    key={entry.rank}
                    className="relative flex items-center justify-between p-4 rounded-sm border transition-all duration-500 hover:bg-white/[0.02]"
                    style={{ 
                        background: entry.rank === 1 ? '#0d0809' : '#0a0608',
                        borderColor: entry.rank === 1 ? '#c9a85c66' : '#1e1210',
                        boxShadow: entry.rank === 1 ? '0 0 20px rgba(201, 168, 92, 0.1)' : 'none'
                    }}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center relative">
                            {entry.rank === 1 && (
                               <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex justify-center">
                                  <div className="w-1 h-1 bg-[#c9a85c] rounded-full animate-ping" />
                               </div>
                            )}
                            {entry.rank <= 3 ? (
                                <Star size={24} className={entry.rank === 1 ? 'text-[#c9a85c]' : entry.rank === 2 ? 'text-stone-400' : 'text-amber-800'} />
                            ) : (
                                <span className="text-stone-800 font-black font-cinzel text-lg">#{entry.rank}</span>
                            )}
                            {entry.rank <= 3 && <span className="absolute text-[10px] font-black text-black/80">{entry.rank}</span>}
                        </div>
                        <div className="flex flex-col">
                            <span className={`font-cinzel text-sm font-black tracking-widest ${entry.rank === 1 ? 'text-[#f0c060]' : 'text-stone-300'}`}>
                                {entry.name}
                            </span>
                            <span className="text-[8px] text-stone-600 uppercase tracking-[0.2em] font-black">LICH EFENDİSİ</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-black font-cinzel text-stone-200 tracking-wider tabular-nums">{entry.totalSE}</span>
                        <span className="text-[8px] text-stone-700 font-black uppercase tracking-[0.2em]">Toplam Ruh</span>
                    </div>

                    {/* Rank 1 special marker */}
                    {entry.rank === 1 && (
                       <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#c9a85c] opacity-50" />
                    )}
                </div>
            ))}
        </div>

        {/* Player Position Footer */}
        <div className="p-6 border-t relative z-10" style={{ background: '#0d0809', borderColor: '#1e1210' }}>
            <div className="flex items-center justify-between px-5 py-4 bg-[#0a0608] rounded-sm border border-[#c9a85c33]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-sm bg-[#c9a85c11] border border-[#c9a85c22] flex items-center justify-center text-[#c9a85c] font-black font-cinzel text-sm">
                        ?
                    </div>
                    <div>
                        <span className="font-cinzel text-[10px] font-black text-[#f0c060] tracking-[0.3em] uppercase">Mevcut Makamın</span>
                        <div className="text-[9px] text-stone-600 font-bold font-cinzel uppercase tracking-widest">Yeterli veri toplanıyor...</div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-sm font-black font-cinzel text-[#c9a85c] tracking-wider tabular-nums">{formatSE(playerTotalSE)}</span>
                    <div className="text-[8px] text-stone-700 font-black uppercase tracking-[0.2em] leading-none mt-1">SE</div>
                </div>
            </div>
            
            <div className="mt-4 flex justify-center">
                 <button
                    onClick={refresh}
                    className="flex items-center gap-3 text-[10px] font-black font-cinzel text-stone-600 hover:text-[#c9a85c] uppercase tracking-[0.3em] transition-all"
                 >
                    <RefreshCw size={12} className={isLoading ? 'animate-spin text-[#c9a85c]' : ''} />
                    Ritüeli Güncelle
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
}
