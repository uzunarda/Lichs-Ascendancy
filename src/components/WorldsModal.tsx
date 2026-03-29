import { X, Globe } from 'lucide-react';
import RegionMap from './RegionMap';
import RuneCorner from './shared/RuneCorner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorldsModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
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
          <h2 className="font-cinzel text-[10px] md:text-sm tracking-[0.35em] text-[#c9a85c] font-black uppercase flex items-center gap-3">
            <Globe size={18} className="opacity-70" />
            Dünya Haritası
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-stone-600 hover:text-red-500 border border-stone-900 hover:border-red-900/40 rounded-sm transition-all duration-300"
            aria-label="Kapat"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-none relative z-10">
          <RegionMap />
        </div>
      </div>
    </div>
  );
}
