import React from 'react';
import { ScreenMode } from '../types/quiz';
import { playClickSound } from '../utils/sound';

interface FooterProps {
  currentScreen?: ScreenMode;
  onScreenChange?: (screen: ScreenMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentScreen, onScreenChange }) => {
  return (
    <footer className="relative z-10 w-full bg-[#060d24] border-t-2 border-black/40 mt-12">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-space font-bold text-lg text-[#eec200]">HUMOYUN QUIZ</span>
          <span className="text-sm text-[#c3c6d7]">— Jonli intellektual jang maydoni</span>
        </div>

        {/* Discreet Host & Admin switchers in the footer for organizers without polluting player controller */}
        {onScreenChange && (
          <div className="flex items-center gap-3 bg-[#141a32] px-3 py-1.5 rounded-lg border border-black/60 text-xs font-space">
            <span className="text-[#c3c6d7] hidden md:inline">Tashkilotchi:</span>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onScreenChange('proyektor-ekran');
              }}
              className={`px-2 py-0.5 rounded transition-colors ${
                currentScreen === 'proyektor-ekran'
                  ? 'bg-[#2563eb] text-white font-bold'
                  : 'text-[#c3c6d7] hover:text-[#5de6ff]'
              }`}
            >
              📺 Katta Proyektor
            </button>
            <span className="text-zinc-600">|</span>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onScreenChange('admin-boshqaruv');
              }}
              className={`px-2 py-0.5 rounded transition-colors flex items-center gap-1 ${
                currentScreen === 'admin-boshqaruv'
                  ? 'bg-[#2563eb] text-white font-bold'
                  : 'text-[#c3c6d7] hover:text-[#eec200]'
              }`}
            >
              <span>🔒 Admin Boshqaruv (Master Parol)</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-6">
          <span className="font-space text-xs font-bold text-[#5de6ff] uppercase tracking-wider">
            ARCADE ENGINE v3.2
          </span>
          <span className="text-xs text-[#c3c6d7]">
            © {new Date().getFullYear()} Barcha huquqlar himoyalangan.
          </span>
        </div>
      </div>
    </footer>
  );
};
