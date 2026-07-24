import React from 'react';
import { X, CheckCircle2, PlusCircle, BookOpen } from 'lucide-react';

interface QuickActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecordAttendance: () => void;
  onSelectCreateCourse: () => void;
}

export const QuickActionSheet: React.FC<QuickActionSheetProps> = ({
  isOpen,
  onClose,
  onSelectRecordAttendance,
  onSelectCreateCourse,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center animate-fade-in select-none">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="w-full max-w-md bg-white border border-zinc-200/80 p-5 rounded-t-3xl sm:rounded-3xl shadow-2xl space-y-4 relative animate-scale-up z-10 font-sans">
        <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto sm:hidden" />

        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h2 className="text-base font-black text-zinc-900 tracking-tight font-outfit">
              Quick Actions
            </h2>
            <p className="text-xs text-zinc-400 font-semibold">
              Choose an action to perform
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5 pt-1">
          {/* Action 1: Record Attendance */}
          <button
            onClick={() => {
              onClose();
              onSelectRecordAttendance();
            }}
            className="w-full p-4 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200/80 rounded-2xl text-left transition-all cursor-pointer flex items-center space-x-3.5 group active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-emerald-900 uppercase tracking-wider group-hover:text-emerald-950">
                Record Attendance Session
              </h3>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                Log presence or absence for today or a past date.
              </p>
            </div>
          </button>

          {/* Action 2: Create New Subject Course */}
          <button
            onClick={() => {
              onClose();
              onSelectCreateCourse();
            }}
            className="w-full p-4 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-200/80 rounded-2xl text-left transition-all cursor-pointer flex items-center space-x-3.5 group active:scale-[0.99]"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-indigo-900 uppercase tracking-wider group-hover:text-indigo-950">
                Create New Subject Course
              </h3>
              <p className="text-[11px] text-indigo-700 font-medium mt-0.5">
                Add a new course to your semester roster.
              </p>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};
