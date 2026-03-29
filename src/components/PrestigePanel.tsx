import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { calcCurseStones, calcDarkCrystals, calcDissolutionSparks } from '../systems/numberUtils';
import { soundManager } from '../systems/soundManager';
import TooltipWrapper from './TooltipWrapper';
import { Skull, Gem, Zap, Sparkles, Lock, ChevronRight } from 'lucide-react';

export default function PrestigePanel() {
  const [activeTab, setActiveTab] = useState(0);
  const [showStore, setShowStore] = useState(false);

  // Store State
  const totalSE = useGameStore(s => s.totalSE);
  const curseStones = useGameStore(s => s.curseStones);
  const dc = useGameStore(s => s.dc);
  const sd = useGameStore(s => s.sd);
  
  const prestigeCount = useGameStore(s => s.prestigeCount);
  const prestigeCountDC = useGameStore(s => s.prestigeCountDC);
  const prestigeCountSD = useGameStore(s => s.prestigeCountSD);

  const prestigePowers = useGameStore(s => s.prestigePowers);
  const prestigePowersDC = useGameStore(s => s.prestigePowersDC);
  const prestigePowersSD = useGameStore(s => s.prestigePowersSD);

  const prestige = useGameStore(s => s.prestige);
  const prestigeDC = useGameStore(s => s.prestigeDC);
  const prestigeSD = useGameStore(s => s.prestigeSD);

  const buyPower = useGameStore(s => s.buyPrestigePower);
  const buyPowerDC = useGameStore(s => s.buyPrestigePowerDC);
  const buyPowerSD = useGameStore(s => s.buyPrestigePowerSD);

  // Calculations
  const earnedL1 = calcCurseStones(totalSE);
  const earnedL2 = calcDarkCrystals(curseStones);
  const earnedL3 = calcDissolutionSparks(dc);

  const isL2Unlocked = curseStones >= 1000 || prestigeCountDC > 0 || dc > 0 || sd > 0;
  const isL3Unlocked = dc >= 100 || prestigeCountSD > 0 || sd > 0;

  const tabs = [
    { id: 0, label: 'KADEME I', sub: 'RİTÜEL', icon: <Skull size={14} />, color: 'text-red-500', border: 'border-red-900/40', bg: 'bg-red-900/5', unlocked: true },
    { id: 1, label: 'KADEME II', sub: 'ÇÖZÜLÜŞ', icon: <Gem size={14} />, color: 'text-purple-400', border: 'border-purple-900/40', bg: 'bg-purple-900/5', unlocked: isL2Unlocked },
    { id: 2, label: 'KADEME III', sub: 'ÇÖZÜLME', icon: <Zap size={14} />, color: 'text-amber-400', border: 'border-amber-900/40', bg: 'bg-amber-900/5', unlocked: isL3Unlocked },
  ];

  const renderStore = (powers: any[], currency: number, buyFn: any, icon: any, currencyLabel: string, colorClass: string) => (
    <div className="flex flex-col gap-2 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
      {powers.map(p => {
        const isPurchased = p.purchased;
        const canAfford = currency >= p.cost;
        const state = isPurchased ? 'purchased' : canAfford ? 'available' : 'locked';
        
        return (
          <TooltipWrapper key={p.id} content={`${p.name}\n\n${p.description}\n\nBedel: ${p.cost} ${currencyLabel}`}>
            <div
              onClick={() => {
                if (!isPurchased && canAfford) {
                  soundManager.init();
                  soundManager.playBuy();
                  buyFn(p.id);
                }
              }}
              className={`relative flex flex-col p-3 rounded-sm border transition-all duration-300
                          ${state === 'purchased' ? 'border-emerald-900/30 bg-emerald-950/10 cursor-default opacity-80' : ''}
                          ${state === 'available' ? 'border-[#1e1210] bg-[#0a0608] hover:bg-white/[0.03] hover:border-stone-700 cursor-pointer' : ''}
                          ${state === 'locked'    ? 'border-stone-900 bg-stone-950/10 opacity-40 cursor-not-allowed grayscale' : ''}`}
              style={state === 'available' ? { borderLeftColor: '#c9a85c44' } : {}}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`font-cinzel text-[11px] font-black tracking-wide ${isPurchased ? 'text-emerald-400' : 'text-stone-300'}`}>
                  {isPurchased ? '✓ ' : ''}{p.name}
                </span>
                <span className={`flex items-center gap-1 font-cinzel text-[10px] font-black ${isPurchased ? 'text-emerald-400' : colorClass}`}>
                   {isPurchased ? 'AKTİF' : <>{p.cost} {icon}</>}
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium leading-relaxed">{p.description}</p>
            </div>
          </TooltipWrapper>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Tab Header */}
      <div className="flex border-b" style={{ background: '#0a0608', borderColor: '#1e1210' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => tab.unlocked && setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 font-cinzel transition-all duration-300 border-r last:border-r-0
                        ${activeTab === tab.id ? 'bg-white/[0.02] shadow-[inset_0_-2px_0_#c9a85c]' : 'opacity-40 hover:opacity-60'}
                        ${!tab.unlocked ? 'grayscale' : ''}`}
            style={{ borderColor: '#1e1210' }}
          >
            <div className={`flex items-center gap-1.5 text-[9px] font-black tracking-[0.2em] mb-0.5 ${activeTab === tab.id ? 'text-[#c9a85c]' : 'text-stone-600'}`}>
               {tab.unlocked ? tab.icon : <Lock size={10} />}
               {tab.label}
            </div>
            <span className={`text-[10px] font-black tracking-widest ${activeTab === tab.id ? tab.color : 'text-stone-700'}`}>
               {tab.unlocked ? tab.sub : 'KİLİTLİ'}
            </span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-none p-4 space-y-4">
        {activeTab === 0 && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex justify-between items-center mb-3">
               <div className="flex flex-col">
                  <span className="text-[9px] text-stone-600 font-black uppercase tracking-widest">Döngü Sırası</span>
                  <span className="text-sm font-cinzel font-black text-stone-400">#{prestigeCount}</span>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-[9px] text-stone-600 font-black uppercase tracking-widest">Lanet Taşları</span>
                  <span className="text-sm font-cinzel font-black text-blue-400 flex items-center gap-1">
                    {curseStones} <Gem size={12} />
                  </span>
               </div>
            </div>
            
            <div className="relative p-5 rounded-sm border border-red-900/30 overflow-hidden bg-red-900/5">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
              <div className="text-[10px] text-red-700 font-black uppercase tracking-widest mb-3 flex justify-between">
                <span>Birikmiş Kan</span>
                <span className="text-red-400">+{earnedL1} Ruh</span>
              </div>
              <TooltipWrapper content={`Tüm SE, Ordu ve Geliştirmeler sıfırlanır.\n\nKazanılacak: ${earnedL1} Lanet Taşı`}>
                <button
                  disabled={earnedL1 <= 0}
                  onClick={() => { soundManager.init(); soundManager.playPrestige(); prestige(); }}
                  className={`w-full py-4 rounded-sm font-cinzel text-xs font-black tracking-[0.3em] transition-all duration-300
                              ${earnedL1 > 0 
                                ? 'bg-[#0a0608] border border-red-900/60 text-red-500 hover:text-red-300 hover:border-red-500 hover:bg-red-900/10' 
                                : 'bg-[#0d0809] border border-stone-900 text-stone-700 cursor-not-allowed'}`}
                >
                  {earnedL1 > 0 ? '☠ KAN RİTÜELİ ☠' : 'YETERSİZ KURBAN'}
                </button>
              </TooltipWrapper>
            </div>

            <div className="mt-6">
              <button
                 onClick={() => setShowStore(!showStore)}
                 className="flex items-center justify-between w-full px-4 py-2 bg-[#0d0809] border border-[#1e1210] rounded-sm text-stone-400 hover:bg-white/5 transition-all outline-none"
              >
                <span className="font-cinzel text-[10px] font-black tracking-widest uppercase">Lanet Taşı Mağazası</span>
                <ChevronRight size={14} className={`transition-transform duration-300 ${showStore ? 'rotate-90' : ''}`} />
              </button>
              {showStore && renderStore(prestigePowers, curseStones, buyPower, <Gem size={10} />, '💎', 'text-blue-400')}
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
             <div className="flex justify-between items-center mb-3">
               <div className="flex flex-col">
                  <span className="text-[9px] text-stone-600 font-black uppercase tracking-widest">Çözülüş Sırası</span>
                  <span className="text-sm font-cinzel font-black text-stone-400">#{prestigeCountDC}</span>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-[9px] text-stone-600 font-black uppercase tracking-widest">Karanlık Kristaller</span>
                  <span className="text-sm font-cinzel font-black text-purple-400 flex items-center gap-1">
                    {dc} <Sparkles size={12} />
                  </span>
               </div>
            </div>

            <div className="relative p-5 rounded-sm border border-purple-900/30 overflow-hidden bg-purple-900/5">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
              <div className="text-[10px] text-purple-700 font-black uppercase tracking-widest mb-3 flex justify-between">
                <span>Kristalize Öz</span>
                <span className="text-purple-400">+{earnedL2} Kristal</span>
              </div>
              <TooltipWrapper content={`Multiversal Reset!\n\nL1 taşları ve güçleri dahil her şey sıfırlanır.\n\nKazanılacak: ${earnedL2} Kristal`}>
                <button
                  disabled={earnedL2 <= 0}
                  onClick={() => { soundManager.init(); soundManager.playPrestige(); prestigeDC(); }}
                  className={`w-full py-4 rounded-sm font-cinzel text-xs font-black tracking-[0.3em] transition-all duration-300
                              ${earnedL2 > 0 
                                ? 'bg-[#0a0608] border border-purple-900/60 text-purple-400 hover:text-purple-300 hover:border-purple-500 hover:bg-purple-950/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                                : 'bg-[#0d0809] border border-stone-900 text-stone-700 cursor-not-allowed'}`}
                >
                  {earnedL2 > 0 ? '✦ KARANLIK ÇÖZÜLÜŞ ✦' : '1000 LANET TAŞI GEREKLİ'}
                </button>
              </TooltipWrapper>
            </div>

            {renderStore(prestigePowersDC, dc, buyPowerDC, <Sparkles size={10} />, '✦', 'text-purple-400')}
          </div>
        )}

        {activeTab === 2 && (
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
             <div className="flex justify-between items-center mb-3">
               <div className="flex flex-col">
                  <span className="text-[9px] text-stone-600 font-black uppercase tracking-widest">Çözülme Sırası</span>
                  <span className="text-sm font-cinzel font-black text-stone-400">#{prestigeCountSD}</span>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-[9px] text-stone-600 font-black uppercase tracking-widest">Mutlak Kıvılcımlar</span>
                  <span className="text-sm font-cinzel font-black text-amber-400 flex items-center gap-1">
                    {sd} <Zap size={12} />
                  </span>
               </div>
            </div>

            <div className="relative p-5 rounded-sm border border-amber-900/30 overflow-hidden bg-amber-900/5">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
              <div className="text-[10px] text-amber-700 font-black uppercase tracking-widest mb-3 flex justify-between">
                <span>Hiçlik Kıvılcımı</span>
                <span className="text-amber-400">+{earnedL3} Kıvılcım</span>
              </div>
              <TooltipWrapper content={`Mutlak Sıfırlama!\n\nL2 kristalleri ve güçleri dahil her şey sıfırlanır.\n\nKazanılacak: ${earnedL3} Kıvılcım`}>
                <button
                  disabled={earnedL3 <= 0}
                  onClick={() => { soundManager.init(); soundManager.playPrestige(); prestigeSD(); }}
                  className={`w-full py-4 rounded-sm font-cinzel text-xs font-black tracking-[0.3em] transition-all duration-300
                              ${earnedL3 > 0 
                                ? 'bg-[#0a0608] border border-amber-900/60 text-amber-400 hover:text-amber-200 hover:border-amber-500 hover:bg-amber-950/20' 
                                : 'bg-[#0d0809] border border-stone-900 text-stone-700 cursor-not-allowed'}`}
                >
                  {earnedL3 > 0 ? '⚡ MUTLAK ÇÖZÜLME ⚡' : '100 KRİSTAL GEREKLİ'}
                </button>
              </TooltipWrapper>
            </div>

            {renderStore(prestigePowersSD, sd, buyPowerSD, <Zap size={10} />, '⚡', 'text-amber-400')}
          </div>
        )}
      </div>
    </div>
  );
}