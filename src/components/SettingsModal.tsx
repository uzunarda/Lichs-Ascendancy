import { X, Volume2, VolumeX, AlertTriangle, Trash2, Settings } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../systems/soundManager';
import { useState } from 'react';
import RuneCorner from './shared/RuneCorner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: Props) {
  const resetGame = useGameStore(s => s.resetGame);
  const [isMuted, setIsMuted] = useState(soundManager.isMuted);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const toggleSound = () => {
    soundManager.toggleMute();
    setIsMuted(soundManager.isMuted);
  };

  const handleReset = () => {
    resetGame();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-sm border shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
        style={{ background: '#0a0608', borderColor: '#1e1210' }}
      >
        <RuneCorner position="top-left" opacity={0.4} />
        <RuneCorner position="top-right" opacity={0.4} />
        <RuneCorner position="bottom-left" opacity={0.4} />
        <RuneCorner position="bottom-right" opacity={0.4} />

        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b relative z-10"
          style={{ background: '#0d0809ee', borderColor: '#1e1210' }}
        >
          <h2 className="font-cinzel text-[10px] md:text-xs tracking-[0.35em] text-[#c9a85c] font-black uppercase flex items-center gap-3">
            <Settings size={18} className="opacity-70" />
            Sistem Ayarları
          </h2>
          <button
            onClick={() => { setShowConfirm(false); onClose(); }}
            className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-red-500 border border-stone-900 hover:border-red-900/40 rounded-sm transition-all duration-300"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="flex flex-col p-8 gap-8 relative z-10">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-4 rounded-sm border border-stone-900 bg-stone-950/20">
            <span className="text-stone-500 uppercase tracking-[0.2em] text-[10px] font-black font-cinzel">Ruhların Sesi</span>
            <button
              onClick={toggleSound}
              className={`w-12 h-12 flex items-center justify-center rounded-sm border transition-all duration-300 ${
                isMuted 
                  ? 'border-red-950 text-red-900 bg-red-950/10 hover:border-red-600 hover:text-red-600' 
                  : 'border-emerald-950 text-emerald-900 bg-emerald-950/10 hover:border-emerald-500 hover:text-emerald-500'
              }`}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-white/5 pt-8">
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full py-4 flex items-center justify-center gap-3 rounded-sm text-stone-700 border border-stone-900 hover:text-red-600 hover:border-red-900/40 hover:bg-red-950/5 transition-all uppercase tracking-[0.3em] text-[10px] font-black font-cinzel"
              >
                <Trash2 size={16} /> Hafızayı Mühürle
              </button>
            ) : (
              <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                <div className="flex items-start gap-4 text-red-600/80 text-[10px] border border-red-900/30 p-4 bg-red-950/5 rounded-sm font-bold uppercase tracking-widest leading-relaxed">
                  <AlertTriangle size={24} className="shrink-0 text-red-600 animate-pulse" />
                  <span>
                    Tüm ilerlemen, ordun ve kazandığın güçler sonsuza dek silinecek. <br/><span className="text-red-500 font-black">Geri Dönüş Yok!</span>
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-3 border border-stone-900 text-stone-600 hover:text-white transition-all text-[10px] font-black font-cinzel tracking-widest uppercase rounded-sm"
                  >
                    Vazgeç
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 border border-red-900/40 bg-red-900/10 text-red-500 font-black hover:bg-red-900/20 transition-all text-[10px] font-black font-cinzel tracking-widest uppercase rounded-sm"
                  >
                    SİLİNSİN
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
