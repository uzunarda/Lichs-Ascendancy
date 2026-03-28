import { X } from 'lucide-react';
import RegionMap from './RegionMap';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorldsModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm anim-fade-in">
      <div className="relative w-full max-w-md bg-mid border border-border shadow-2xl rounded-lg overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-black/40">
          <h2 className="font-cinzel text-[0.9rem] tracking-widest text-gold uppercase flex items-center gap-2">
            🌍 Bölgeler
          </h2>
          <button
            onClick={onClose}
            className="text-ink-dim hover:text-white transition-colors"
            aria-label="Kapat"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <RegionMap />
        </div>
      </div>
    </div>
  );
}
