import React from 'react';
import { BookOpen, Plus, Smartphone } from 'lucide-react';
import { SemesterStats } from '../utils/calculations';

interface NavbarProps {
  stats: SemesterStats;
  activeTab: 'courses' | 'dashboard' | 'settings';
  canInstallPwa: boolean;
  onInstallPwa: () => void;
  onOpenAddCourse: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  activeTab,
  canInstallPwa,
  onInstallPwa,
  onOpenAddCourse,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/80 shadow-2xs">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-black text-zinc-900 tracking-tight font-outfit leading-none">
              Attendance
            </h1>
            <p className="text-[10px] font-bold text-zinc-400 mt-0.5">
              Semester 2026
            </p>
          </div>
        </div>

        {/* Action Buttons: Add Course (visible ONLY on Dashboard tab) & PWA */}
        <div className="flex items-center space-x-2">
          {activeTab === 'dashboard' && (
            <button
              onClick={onOpenAddCourse}
              className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1 active:scale-95 animate-fade-in"
              title="Create New Subject Course"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Course</span>
            </button>
          )}

          {canInstallPwa && (
            <button
              onClick={onInstallPwa}
              className="p-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-[10px] rounded-xl transition-all cursor-pointer flex items-center space-x-1 active:scale-95"
              title="Install App"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
