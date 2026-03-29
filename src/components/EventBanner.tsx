import { useEventStore } from '../store/eventStore';
import { Timer, Sparkles, Scroll, Hexagon, X } from 'lucide-react';
import RuneCorner from './shared/RuneCorner';

export default function EventBanner() {
  const activeEvent = useEventStore(s => s.activeEvent);
  const timeLeft = useEventStore(s => s.timeLeft);
  const resolveEvent = useEventStore(s => s.resolveEvent);

  if (!activeEvent) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none p-4 animate-in fade-in duration-500 bg-black/40 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg border shadow-2xl pointer-events-auto overflow-hidden animate-in zoom-in-95 duration-300 relative rounded-sm"
        style={{ background: '#0a0608', borderColor: '#1e1210' }}
      >
        <RuneCorner position="top-left" opacity={0.5} size={48} />
        <RuneCorner position="top-right" opacity={0.5} size={48} />
        <RuneCorner position="bottom-left" opacity={0.5} size={48} />
        <RuneCorner position="bottom-right" opacity={0.5} size={48} />

        {/* Header Progress Bar */}
        <div className="h-1 w-full bg-white/5 relative z-10">
          <div 
            className="h-full bg-[#c9a85c] transition-all duration-1000 ease-linear shadow-[0_0_10px_#c9a85c44]"
            style={{ width: `${(timeLeft / activeEvent.duration) * 100}%` }}
          />
        </div>

        <div className="p-8 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 border border-[#c9a85c33] bg-[#c9a85c0a] rounded-sm text-[#c9a85c]">
              <Scroll size={28} className="opacity-80" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg md:text-xl font-black text-stone-200 tracking-[0.2em] uppercase">
                {activeEvent.name}
              </h2>
              <div className="flex items-center gap-2 text-[10px] font-black font-cinzel text-stone-600 tracking-[0.2em]">
                <Timer size={12} className="text-[#c9a85c] opacity-50" />
                <span>MEAL-İ KADER: {Math.ceil(timeLeft)}s</span>
              </div>
            </div>
          </div>

          <p className="text-sm text-stone-400 leading-relaxed mb-10 italic border-l-2 border-[#1e1210] pl-6 py-2">
            "{activeEvent.description}"
          </p>

          <div className="grid grid-cols-1 gap-3">
            {activeEvent.choices.map(choice => (
              <button
                key={choice.id}
                onClick={() => resolveEvent(choice.id)}
                className="group relative flex flex-col items-start p-4 border transition-all duration-300 text-left rounded-sm"
                style={{ background: '#0d0809', borderColor: '#1e1210' }}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-cinzel text-[11px] font-black text-[#c9a85c] tracking-widest uppercase group-hover:text-[#f0c060] transition-colors">
                    {choice.label}
                  </span>
                  <Hexagon size={12} className="text-stone-800 group-hover:text-[#c9a85c44] transition-colors" />
                </div>
                <span className="text-[10px] text-stone-500 leading-tight font-medium group-hover:text-stone-300 transition-colors">
                  {choice.description}
                </span>
                
                {/* Visual affordance highlight */}
                <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        <div 
          className="px-8 py-4 border-t flex justify-center"
          style={{ background: '#0d0809', borderColor: '#1e1210' }}
        >
          <span className="text-[9px] font-cinzel text-stone-700 font-black uppercase tracking-[0.3em] opacity-80">
            Kaderin kalemini sen tutuyorsun, Efendi.
          </span>
        </div>
      </div>
    </div>
  );
}
