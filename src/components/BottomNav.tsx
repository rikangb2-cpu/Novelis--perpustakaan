import React from 'react';
import { TabType } from '../types/novel';
import { Home, BookMarked, Search, Heart, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  favoritesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  favoritesCount = 0
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Beranda', icon: Home },
    { id: 'collection' as TabType, label: 'Koleksi', icon: BookMarked },
    { id: 'search' as TabType, label: 'Pencarian', icon: Search },
    { id: 'favorites' as TabType, label: 'Favorit', icon: Heart, badge: favoritesCount },
    { id: 'profile' as TabType, label: 'Profil', icon: User }
  ];

  return (
    <nav className="h-16 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 flex items-center justify-around shrink-0 z-30 select-none shadow-xs">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex-1 min-h-[48px] flex flex-col items-center justify-center relative touch-press group cursor-pointer transition-colors"
          >
            {/* Active Pill Indicator for Clean Digital Novel App */}
            <div
              className={`relative px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                isActive
                  ? 'bg-amber-100 text-amber-800'
                  : 'text-slate-400 group-hover:text-slate-700'
              }`}
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? 'scale-105 stroke-[2.4]' : 'stroke-[1.8]'
                } ${tab.id === 'favorites' && isActive ? 'fill-amber-700' : ''}`}
              />

              {/* Badge if any */}
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center shadow-xs">
                  {tab.badge}
                </span>
              ) : null}
            </div>

            {/* Label */}
            <span
              className={`text-[10px] tracking-tight font-medium mt-0.5 transition-colors ${
                isActive ? 'text-amber-900 font-bold' : 'text-slate-500'
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
