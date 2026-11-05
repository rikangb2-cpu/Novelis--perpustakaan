import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, Sparkles } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  // Layout mode switcher for desktop users who want phone width vs full expansive library width
  const [deviceView, setDeviceView] = useState<'responsive' | 'phone'>('responsive');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-start text-slate-900 antialiased selection:bg-amber-100 selection:text-amber-900">
      {/* Top Device Bar (Only visible on wide desktop screens to allow testing any gadget aspect ratio!) */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-5xl px-6 py-2.5 my-1 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-serif-novel font-bold text-amber-700 text-sm">NOVELIA</span>
          <span className="text-[11px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
            Akses Segala Gadget (HP, Tablet, Laptop)
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            onClick={() => setDeviceView('responsive')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              deviceView === 'responsive'
                ? 'bg-amber-600 text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Tampilan Responsif Tablet & Desktop"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Tablet / Komputer</span>
          </button>

          <button
            onClick={() => setDeviceView('phone')}
            className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
              deviceView === 'phone'
                ? 'bg-amber-600 text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Tampilan Layar HP Android / iOS"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Layar Smartphone</span>
          </button>
        </div>
      </div>

      {/* Main App Container */}
      <main
        className={`w-full min-h-screen flex flex-col bg-white shadow-xl relative border-x border-slate-200 transition-all duration-300 ${
          deviceView === 'phone'
            ? 'max-w-md lg:my-3 lg:rounded-3xl lg:overflow-hidden lg:min-h-[860px] lg:border'
            : 'max-w-5xl'
        }`}
      >
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {children}
        </div>
      </main>
    </div>
  );
};
