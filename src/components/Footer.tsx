import React from 'react';
import { ScreenMode } from '../types/quiz';
import { playClickSound } from '../utils/sound';

interface FooterProps {
  currentScreen?: ScreenMode;
  onScreenChange?: (screen: ScreenMode) => void;
  onNavigateToPinEntry?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentScreen,
  onScreenChange,
  onNavigateToPinEntry
}) => {
  const handleGoToPlayerPin = () => {
    playClickSound();
    if (onNavigateToPinEntry) {
      onNavigateToPinEntry();
    } else if (onScreenChange) {
      onScreenChange('oyinchi-pulti');
    }
  };

  return (
    <footer className="relative z-10 w-full bg-[#060d24] border-t-2 border-black/40 mt-12">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="font-space font-bold text-lg text-[#eec200]">HUMOYUN QUIZ</span>
          <span className="text-xs sm:text-sm text-[#c3c6d7]">— Jonli intellektual jang maydoni</span>
        </div>

        {/* Central Switcher Bar with Bright Neon Player PIN Button */}
        {onScreenChange && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 bg-[#141a32] px-3 py-2 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] text-xs font-space">
            {/* The requested Bright Neon Player PIN Entry Button */}
            <button
              type="button"
              onClick={handleGoToPlayerPin}
              className={`px-3 py-1.5 rounded-lg border-2 border-[#5de6ff] font-space font-bold text-xs tracking-wide uppercase transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 ${
                currentScreen === 'oyinchi-pulti'
                  ? 'bg-[#5de6ff] text-[#00363e] shadow-[0_0_12px_#5de6ff]'
                  : 'bg-[#0b1633] text-[#5de6ff] hover:bg-[#5de6ff]/20'
              }`}
              title="Ishtirokchilar uchun PIN kod kiritish oynasi"
            >
              <span className="text-base select-none">🎮</span>
              <span>O'yinchi (PIN terish)</span>
            </button>

            <span className="text-zinc-600 hidden sm:inline">|</span>

            {/* Host Projector Screen */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onScreenChange('proyektor-ekran');
              }}
              className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-space font-bold text-xs ${
                currentScreen === 'proyektor-ekran'
                  ? 'bg-[#2563eb] text-white border-2 border-black shadow-[2px_2px_0px_#000000]'
                  : 'text-[#c3c6d7] hover:text-[#5de6ff]'
              }`}
              title="Auditoriya va Katta Ekran Proyektor ko'rinishi"
            >
              <span>📺 Katta Proyektor</span>
            </button>

            <span className="text-zinc-600 hidden sm:inline">|</span>

            {/* Admin Controls */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onScreenChange('admin-boshqaruv');
              }}
              className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-space font-bold text-xs ${
                currentScreen === 'admin-boshqaruv'
                  ? 'bg-[#2563eb] text-white border-2 border-black shadow-[2px_2px_0px_#000000]'
                  : 'text-[#c3c6d7] hover:text-[#eec200]'
              }`}
              title="Superadmin boshqaruv paneli"
            >
              <span>🔒 Admin Boshqaruv</span>
            </button>
          </div>
        )}

        {/* Engine status & copyright */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs text-[#c3c6d7]">
          <span className="font-space font-bold text-[#5de6ff] uppercase tracking-wider hidden sm:inline">
            ARCADE ENGINE v3.3
          </span>
          <span>
            © {new Date().getFullYear()} Barcha huquqlar himoyalangan.
          </span>
        </div>
      </div>
    </footer>
  );
};
