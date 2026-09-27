import React from 'react';
import { ScreenMode } from '../types/quiz';
import { playClickSound, setMuted, getMuted } from '../utils/sound';

interface HeaderProps {
  currentScreen: ScreenMode;
  onScreenChange: (screen: ScreenMode) => void;
  onlinePlayersCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onScreenChange,
  onlinePlayersCount = 1280
}) => {
  const [muted, setLocalMuted] = React.useState(getMuted());

  const handleMuteToggle = () => {
    const nextState = !muted;
    setMuted(nextState);
    setLocalMuted(nextState);
    if (!nextState) {
      playClickSound();
    }
  };

  const handleNav = (screen: ScreenMode) => {
    playClickSound();
    onScreenChange(screen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#060d24]/90 backdrop-blur-md border-b-2 border-black/40">
      <div className="h-20 max-w-[1280px] mx-auto px-4 lg:px-12 flex items-center justify-between gap-4">
        {/* Brand & Live Counter */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => handleNav('oyinchi-pulti')}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#eec200] text-[#3c2f00] rounded font-space font-bold text-xl uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            type="button"
          >
            <span>HUMOYUN QUIZ</span>
            <span className="text-[#060d24]">⚡</span>
          </button>

          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#181e36] rounded border border-black/50 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#5de6ff] animate-pulse"></span>
            <span className="font-space text-xs font-bold text-[#5de6ff] uppercase tracking-wider">
              {onlinePlayersCount.toLocaleString()} jonli o'yinchilar
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 p-1 bg-[#141a32] rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000]">
          <button
            onClick={() => handleNav('oyinchi-pulti')}
            className={`px-3 sm:px-4 py-2 rounded font-space text-xs sm:text-sm font-bold transition-all ${
              currentScreen === 'oyinchi-pulti'
                ? 'bg-[#2563eb] text-[#eeefff] shadow-[2px_2px_0px_#000000]'
                : 'text-[#c3c6d7] hover:text-[#dce1ff] hover:bg-[#181e36]'
            }`}
            type="button"
          >
            O'yinchi Pulti
          </button>

          <button
            onClick={() => handleNav('proyektor-ekran')}
            className={`px-3 sm:px-4 py-2 rounded font-space text-xs sm:text-sm font-bold transition-all ${
              currentScreen === 'proyektor-ekran'
                ? 'bg-[#2563eb] text-[#eeefff] shadow-[2px_2px_0px_#000000]'
                : 'text-[#c3c6d7] hover:text-[#dce1ff] hover:bg-[#181e36]'
            }`}
            type="button"
          >
            Proyektor Ekran
          </button>

          <button
            onClick={() => handleNav('admin-boshqaruv')}
            className={`px-3 sm:px-4 py-2 rounded font-space text-xs sm:text-sm font-bold transition-all ${
              currentScreen === 'admin-boshqaruv'
                ? 'bg-[#2563eb] text-[#eeefff] shadow-[2px_2px_0px_#000000]'
                : 'text-[#c3c6d7] hover:text-[#dce1ff] hover:bg-[#181e36]'
            }`}
            type="button"
          >
            Admin Boshqaruv
          </button>
        </nav>

        {/* Right Settings & Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleMuteToggle}
            className="w-10 h-10 flex items-center justify-center bg-[#181e36] rounded border-2 border-black shadow-[2px_2px_0px_#000000] text-[#dce1ff] hover:bg-[#222941] hover:text-[#5de6ff] transition-colors"
            title={muted ? "Ovozni yoqish" : "Ovozni o'chirish"}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">
              {muted ? 'volume_off' : 'volume_up'}
            </span>
          </button>

          <div className="flex items-center gap-2 pl-1 pr-3 py-1 bg-[#141a32] rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000]">
            <div className="w-8 h-8 rounded bg-[#2563eb] flex items-center justify-center text-white font-bold">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-space text-xs font-bold text-[#dce1ff] leading-tight">Player_01</span>
              <span className="text-[11px] text-[#5de6ff] font-medium leading-tight">Level 12</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
