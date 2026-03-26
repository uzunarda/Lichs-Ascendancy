import { useGameStore, AppNotification } from '../store/gameStore';
import { Info, CheckCircle2, AlertTriangle, X } from 'lucide-react';

const ICONS = {
  info: <Info size={16} className="text-blue-400" />,
  success: <CheckCircle2 size={16} className="text-emerald-400" />,
  warning: <AlertTriangle size={16} className="text-orange-400" />,
};

const BORDERS = {
  info: 'border-blue-500/30 bg-blue-900/20',
  success: 'border-emerald-500/30 bg-emerald-900/20',
  warning: 'border-orange-500/30 bg-orange-900/20',
};

export default function NotificationManager() {
  const notifications = useGameStore(s => s.notifications);
  const removeNotification = useGameStore(s => s.removeNotification);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {notifications.map((n: AppNotification) => (
        <div
          key={n.id}
          className={`flex items-start gap-3 p-3 rounded-lg border shadow-lg w-72 pointer-events-auto
                      backdrop-blur-md anim-fade-in ${BORDERS[n.type]}`}
        >
          <div className="mt-0.5 shrink-0">{ICONS[n.type]}</div>
          <div className="flex-1 font-cinzel text-[0.8rem] text-ink leading-snug">
            {n.message}
          </div>
          <button
            onClick={() => removeNotification(n.id)}
            className="shrink-0 text-ink-dim hover:text-ink transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
