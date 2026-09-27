import React from 'react';
import { ScreenMode } from '../types/quiz';
import { playClickSound, setMuted, getMuted } from '../utils/sound';

interface HeaderProps {
  currentScreen: ScreenMode;
  onScreenChange: (screen: ScreenMode) => void;
  onlinePlayersCount?: number;
  serverPing?: number;
  playerNickname?: string;
  playerAvatarUrl?: string;
  isAdminUnlocked?: boolean;
  onLockAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onScreenChange,
  onlinePlayersCount = 0,
  serverPing = 14,
  playerNickname = 'Player_01',
  playerAvatarUrl,
  isAdminUnlocked,
  onLockAdmin
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

  const isPlayerMode = currentScreen === 'oyinchi-pulti';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#060d24]/95 backdrop-blur-md border-b-4 border-black shadow-[0px_4px_0px_#000000]">
      <div className="h-20 max-w-[1280px] mx-auto px-4 lg:px-12 flex items-center justify-between gap-3">
        {/* Brand & Live Counter */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playClickSound();
                onScreenChange('oyinchi-pulti');
              }}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 bg-[#eec200] text-[#3c2f00] rounded-lg font-space font-bold text-lg sm:text-xl uppercase tracking-wider border-2 border-black shadow-[3px_3px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
              type="button"
            >
              <span>HUMOYUN QUIZ</span>
              <span className="text-[#060d24]">⚡</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#181e36] rounded-lg border-2 border-black shadow-sm">
              <span className={`w-2.5 h-2.5 rounded-full ${onlinePlayersCount > 0 ? 'bg-[#5de6ff] animate-pulse' : 'bg-zinc-500'}`} />
              <span className="font-space text-xs font-bold uppercase tracking-wider">
                {onlinePlayersCount > 0 ? (
                  <span className="text-[#5de6ff]">
                    {onlinePlayersCount} JONLI O'YINCHI{onlinePlayersCount > 1 ? 'LAR' : ''}
                  </span>
                ) : (
                  <span className="text-[#c3c6d7]">0 ONLINE</span>
                )}
              </span>
            </div>

            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0e1428] rounded-lg border-2 border-black text-xs font-mono font-bold text-[#5de6ff] shadow-sm"
              title="Haqiqiy server kechikishi (RTT latency)"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  serverPing < 50
                    ? 'bg-emerald-400'
                    : serverPing < 120
                    ? 'bg-yellow-400'
                    : 'bg-red-400'
                } animate-pulse`}
              />
              <span>{serverPing}ms</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs: STRICTLY HIDDEN in Player View according to Requirement 3 */}
        {!isPlayerMode ? (
          <nav className="flex items-center gap-1 p-1 bg-[#141a32] rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000]">
            <button
              onClick={() => {
                playClickSound();
                onScreenChange('proyektor-ekran');
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-md font-space text-xs sm:text-sm font-bold transition-all ${
                currentScreen === 'proyektor-ekran'
                  ? 'bg-[#2563eb] text-[#eeefff] shadow-[2px_2px_0px_#000000]'
                  : 'text-[#c3c6d7] hover:text-[#dce1ff] hover:bg-[#181e36]'
              }`}
              type="button"
            >
              Proyektor Ekran
            </button>

            <button
              onClick={() => {
                playClickSound();
                onScreenChange('admin-boshqaruv');
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-md font-space text-xs sm:text-sm font-bold transition-all flex items-center gap-1 ${
                currentScreen === 'admin-boshqaruv'
                  ? 'bg-[#2563eb] text-[#eeefff] shadow-[2px_2px_0px_#000000]'
                  : 'text-[#c3c6d7] hover:text-[#dce1ff] hover:bg-[#181e36]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">
                {isAdminUnlocked ? 'lock_open' : 'lock'}
              </span>
              <span>Admin Boshqaruv</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                onScreenChange('oyinchi-pulti');
              }}
              className="px-2.5 py-1.5 bg-[#222941] text-[#eec200] hover:bg-[#323851] rounded-md font-space text-xs font-bold transition-all border border-black"
              title="O'yinchi Pultiga o'tish"
              type="button"
            >
              Pultga O'tish 🎮
            </button>
          </nav>
        ) : (
          /* When in Player Mode: STRICT ISOLATION according to Requirement 3 - no Admin or Projector buttons */
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#141a32] text-[#5de6ff] rounded-lg border-2 border-black font-space text-xs font-bold">
              <span className="material-symbols-outlined text-[16px] text-[#eec200]">sports_esports</span>
              <span>O'yinchi Pulti (Jonli)</span>
            </span>
          </div>
        )}

        {/* Right Settings & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleMuteToggle}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-[#181e36] rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] text-[#dce1ff] hover:bg-[#222941] hover:text-[#5de6ff] transition-colors"
            title={muted ? "Ovozni yoqish" : "Ovozni o'chirish"}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] sm:text-[20px]">
              {muted ? 'volume_off' : 'volume_up'}
            </span>
          </button>

          {/* Player Profile Badge */}
          <div className="flex items-center gap-2 pl-1 pr-3 py-1 bg-[#141a32] rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000]">
            <div className="w-8 h-8 rounded-lg bg-[#2563eb] overflow-hidden border border-black flex items-center justify-center text-white font-bold shrink-0">
              {playerAvatarUrl ? (
                <img
                  src={playerAvatarUrl}
                  alt={playerNickname}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to initial
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <span className="material-symbols-outlined text-[18px]">person</span>
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="font-space text-xs font-bold text-[#dce1ff] leading-tight truncate max-w-[100px] sm:max-w-[120px]">
                {playerNickname}
              </span>
              <span className="text-[10px] text-[#5de6ff] font-medium leading-tight font-space">
                Level 12
              </span>
            </div>
          </div>

          {/* Admin Lock status button if unlocked */}
          {isAdminUnlocked && !isPlayerMode && onLockAdmin && (
            <button
              onClick={onLockAdmin}
              className="p-1.5 bg-[#93000a] text-[#ffdad6] rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] hover:bg-black transition-colors"
              title="Admin panelni qulflash"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
