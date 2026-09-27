import React from 'react';
import { playClickSound, playWrongSound } from '../utils/sound';

interface LobbyUser {
  id: string;
  name: string;
  score: number;
  ping: number;
  flag: string;
}

interface LobbyKickModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const LobbyKickModal: React.FC<LobbyKickModalProps> = ({
  isOpen,
  onClose,
  onNotify
}) => {
  const [users, setUsers] = React.useState<LobbyUser[]>([
    { id: 'u-1', name: 'Shohrux_Frontend', score: 2450, ping: 22, flag: 'normal' },
    { id: 'u-2', name: 'SpamBot_99x', score: 0, ping: 198, flag: 'suspicious' },
    { id: 'u-3', name: 'Nodira_Samarkand', score: 1890, ping: 35, flag: 'normal' },
    { id: 'u-4', name: 'TrollUser_007', score: 120, ping: 240, flag: 'suspicious' },
    { id: 'u-5', name: 'Bek_Tashkent', score: 1200, ping: 28, flag: 'normal' }
  ]);

  if (!isOpen) return null;

  const handleKick = (user: LobbyUser) => {
    playWrongSound();
    setUsers(prev => prev.filter(u => u.id !== user.id));
    onNotify(`${user.name} o'yindan chetlatildi (Kick) 🚫`);
  };

  const handleBan = (user: LobbyUser) => {
    playWrongSound();
    setUsers(prev => prev.filter(u => u.id !== user.id));
    onNotify(`${user.name} qora ro'yxatga kiritildi (Ban) 🚫`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-[620px] bg-[#181e36] border-4 border-black shadow-[6px_6px_0px_#000000] rounded-xl p-5 flex flex-col gap-4">
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

        <p className="text-xs sm:text-sm text-[#c3c6d7]">
          Qoidabuzar yoki nojo'ya taxallusli o'yinchilarni xonadan chetlatish (Kick / Ban). Real vaqtda amalga oshiriladi:
        </p>

        <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1">
          {users.map(user => (
            <div
              key={user.id}
              className="p-3 bg-[#141a32] rounded-lg border-2 border-black flex items-center justify-between group hover:border-[#ffb4ab] transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${user.flag === 'suspicious' ? 'bg-[#ffb4ab]' : 'bg-[#5de6ff]'} animate-pulse`} />
                <span className="font-space text-sm font-bold text-[#dce1ff]">{user.name}</span>
                <span className="text-xs text-[#c3c6d7]">· {user.score.toLocaleString()} ball</span>
                {user.flag === 'suspicious' ? (
                  <span className="px-1.5 py-0.5 bg-[#93000a] text-[#ffdad6] text-[10px] font-space font-bold rounded">
                    SHUBHALI
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 bg-[#2d344c] text-[#5de6ff] text-[10px] font-space rounded">
                    PING {user.ping}ms
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleKick(user)}
                  className="px-2.5 py-1 bg-[#93000a] text-[#ffdad6] hover:bg-[#ffb4ab] hover:text-[#690005] font-space font-bold text-xs rounded border-2 border-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
                  title="O'yindan chiqarish"
                  type="button"
                >
                  Kick 🚫
                </button>
                <button
                  onClick={() => handleBan(user)}
                  className="px-2.5 py-1 bg-black text-[#eec200] hover:bg-[#eec200] hover:text-black font-space font-bold text-xs rounded border-2 border-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5"
                  title="Qora ro'yxatga olish"
                  type="button"
                >
                  Ban ⛔
                </button>
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="p-6 text-center text-[#c3c6d7] bg-[#141a32] rounded border border-black">
              Lobbida o'yinchilar qolmadi yoki barchasi tasdiqlangan.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t-2 border-black">
          <span className="font-space text-xs text-[#c3c6d7]">
            Jami faol nazoratda: <strong className="text-[#5de6ff]">{users.length} o'yinchi</strong>
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
