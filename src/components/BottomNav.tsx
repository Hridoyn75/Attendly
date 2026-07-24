import React from 'react';
import { BookOpen, LayoutDashboard, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'courses' | 'dashboard' | 'settings';
  onSelectTab: (tab: 'courses' | 'dashboard' | 'settings') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const navItems: { id: 'courses' | 'dashboard' | 'settings'; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-3.5 left-0 right-0 z-40 px-4 pointer-events-none">
      <nav className="max-w-xs mx-auto glass-panel border border-zinc-200/80 p-1.5 rounded-full shadow-xl shadow-indigo-950/5 pointer-events-auto flex items-center justify-between transition-all font-sans bg-white/85 backdrop-blur-xl">
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-full transition-all duration-300 select-none cursor-pointer outline-none ${
                isActive
                  ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-600/25 scale-[1.03]'
                  : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/60 active:scale-95 font-bold'
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-[11px] tracking-tight font-outfit ${isActive ? 'block font-extrabold' : 'hidden sm:inline font-semibold'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

      </nav>
    </div>
  );
};
