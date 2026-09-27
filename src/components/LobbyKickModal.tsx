import React from 'react';
import { ActivePlayer } from '../types/quiz';
import { playClickSound, playWrongSound } from '../utils/sound';

interface LobbyKickModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
  activePlayers: ActivePlayer[];
  onKickPlayer: (id: string, name: string) => void;
  onAddTestPlayer?: () => void;
}

export const LobbyKickModal: React.FC<LobbyKickModalProps> = ({
  isOpen,
  onClose,
  onNotify,
  activePlayers,
  onKickPlayer,
  onAddTestPlayer
}) => {
  if (!isOpen) return null;

  const handleKick = (player: ActivePlayer) => {
    playWrongSound();
    onKickPlayer(player.id, player.name);
    onNotify(`${player.name} o'yindan chiqarildi (KICK) 🚫`);
  };

  const handleBan = (player: ActivePlayer) => {
    playWrongSound();
    onKickPlayer(player.id, player.name);
    onNotify(`${player.name} qora ro'yxatga kiritildi (BAN) ⛔`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[620px] bg-[#181e36] border-4 border-black shadow-[6px_6px_0px_#000000] rounded-xl p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-[#93000a] text-[#ffdad6] flex items-center justify-center border-2 border-black font-bold">
              <span className="material-symbols-outlined text-[20px]">gavel</span>
            </span>
            <h3 className="font-space font-bold text-lg text-[#dce1ff] uppercase">
              Jonli Lobbida O'yinchilar Nazorati
            </h3>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded bg-[#222941] border-2 border-black text-[#dce1ff] hover:text-[#ffb4ab] flex items-center justify-center font-bold"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs sm:text-sm text-[#c3c6d7]">
            Faqat xonaga PIN orqali haqiqatda ulangan jonli o'yinchilar ro'yxati:
          </p>
          {onAddTestPlayer && (
            <button
              type="button"
              onClick={onAddTestPlayer}
              className="px-2.5 py-1 bg-[#eec200] hover:bg-[#ffe083] text-[#3c2f00] text-xs font-space font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] shrink-0"
              title="Jonli hisoblagichni sinash uchun o'yinchi qo'shish (+1)"
            >
              +1 Test O'yinchi
            </button>
          )}
        </div>

        {/* Players List */}
        <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1">
          {activePlayers.map(player => (
            <div
              key={player.id}
              className="p-3 bg-[#141a32] rounded-lg border-2 border-black flex items-center justify-between group hover:border-[#ffb4ab] transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded bg-[#222941] border border-black overflow-hidden shrink-0 flex items-center justify-center text-sm">
                  {player.avatar ? (
                    <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
                  ) : (
                    player.avatarEmoji || '👤'
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#5de6ff] animate-pulse" />
                    <span className="font-space text-sm font-bold text-[#dce1ff] truncate">
                      {player.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#c3c6d7] font-space">
                    {player.score.toLocaleString()} ball • Ping: {player.ping || 16}ms
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => handleKick(player)}
                  className="px-2.5 py-1 bg-[#93000a] text-[#ffdad6] hover:bg-[#ffb4ab] hover:text-[#690005] font-space font-bold text-xs rounded border-2 border-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
                  title="O'yindan chiqarish (-1)"
                  type="button"
                >
                  Kick 🚫
                </button>
                <button
                  onClick={() => handleBan(player)}
                  className="px-2.5 py-1 bg-black text-[#eec200] hover:bg-[#eec200] hover:text-black font-space font-bold text-xs rounded border-2 border-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
                  title="Qora ro'yxatga olish (-1)"
                  type="button"
                >
                  Ban ⛔
                </button>
              </div>
            </div>
          ))}

          {activePlayers.length === 0 && (
            <div className="p-8 text-center text-[#c3c6d7] bg-[#141a32] rounded-lg border-2 border-black">
              <span className="text-3xl block mb-2">👥</span>
              <p className="font-space font-bold text-sm text-[#dce1ff]">
                Hozirda xonada faol o'yinchilar yo'q (0 online)
              </p>
              <p className="text-xs text-[#c3c6d7] mt-1 font-space">
                Ishtirokchilar PIN orqali maydonga ulanganda bu yerda real vaqtda paydo bo'ladi.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-black">
          <span className="font-space text-xs text-[#c3c6d7]">
            Jonli o'yinchilar: <strong className="text-[#5de6ff]">{activePlayers.length} nafar</strong>
          </span>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#222941] text-[#dce1ff] font-space font-bold text-xs rounded border-2 border-black shadow-[2px_2px_0px_#000000] hover:bg-[#323851]"
            type="button"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
