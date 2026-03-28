import { X, Volume2, VolumeX, AlertTriangle, Trash2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { soundManager } from '../systems/soundManager';
import { useState } from 'react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm anim-fade-in">
      <div className="relative w-full max-w-sm bg-mid border border-border shadow-2xl rounded-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-black/40">
          <h2 className="font-cinzel text-[0.9rem] tracking-widest text-gold uppercase flex items-center gap-2">
            ⚙️ Ayarlar
          </h2>
          <button
            onClick={() => {
              setShowConfirm(false);
              onClose();
            }}
            className="text-ink-dim hover:text-white transition-colors p-1"
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col p-6 gap-6">
          <div className="flex items-center justify-between bg-black/20 p-4 rounded border border-border">
            <span className="text-ink-dim uppercase tracking-widest text-sm font-cinzel">Ses Efektleri</span>
            <button
              onClick={toggleSound}
              className={`p-2 rounded border transition-colors ${
                isMuted 
                  ? 'border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20' 
                  : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
              }`}
              aria-label={isMuted ? 'Sesi Aç' : 'Sesi Kapat'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>

          <div className="border-t border-border pt-6">
            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                className="w-full py-3 flex items-center justify-center gap-2 rounded text-red-500 border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/50 transition-all uppercase tracking-widest text-xs font-cinzel font-bold"
              >
                <Trash2 size={16} /> Verileri Temizle
              </button>
            ) : (
              <div className="flex flex-col gap-3 anim-fade-in">
                <div className="flex items-start gap-3 text-red-400/90 text-xs border border-red-500/30 p-3 bg-red-500/10 rounded">
                  <AlertTriangle size={24} className="shrink-0 text-red-500" />
                  <span className="leading-snug">
                    Tüm ilerlemen, ordun, ve SE'n tamamen silinecek. <br/><strong>Bu işlem geri alınamaz!</strong> Emin misin?
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-2.5 border border-border bg-surface text-ink-dim rounded hover:text-white transition-colors text-xs font-cinzel tracking-widest uppercase"
                  >
                    İptal
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 py-2.5 border border-red-500/50 bg-red-500/20 text-red-300 font-bold rounded hover:bg-red-500/40 hover:text-white transition-colors text-xs font-cinzel tracking-widest uppercase shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                  >
                    Eminim, Sil
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
