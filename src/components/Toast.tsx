import React from 'react';
import { ToastNotification } from '../types/attendance';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toast: ToastNotification;
  onRemove: (id: string) => void;
}

export const ToastItem: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const cardStyles = {
    success: 'border-emerald-500/20 bg-white/95 shadow-emerald-500/5',
    error: 'border-rose-500/20 bg-white/95 shadow-rose-500/5',
    info: 'border-indigo-500/20 bg-white/95 shadow-indigo-500/5',
  };

  const iconStyles = {
    success: 'bg-emerald-50 border border-emerald-100 text-emerald-600',
    error: 'bg-rose-50 border border-rose-100 text-rose-600',
    info: 'bg-indigo-50 border border-indigo-100 text-indigo-650',
  };

  const icons = {
    success: <CheckCircle2 className="w-4.5 h-4.5" />,
    error: <AlertCircle className="w-4.5 h-4.5" />,
    info: <Info className="w-4.5 h-4.5" />,
  };

  return (
    <div
      className={`flex items-start gap-3.5 p-4 rounded-2xl border backdrop-blur-md shadow-xl transition-all duration-300 animate-slide-in-right max-w-sm w-full ${cardStyles[toast.type]}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconStyles[toast.type]}`}>
        {icons[toast.type]}
      </div>

      <div className="flex-1 min-w-0 pr-2 font-sans text-left">
        <h5 className="text-[11px] font-black text-zinc-900 tracking-tight leading-none mt-1 font-outfit">
          {toast.title}
        </h5>
        <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed mt-1.5">
          {toast.message}
        </p>
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        className="shrink-0 p-1 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer self-start"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
