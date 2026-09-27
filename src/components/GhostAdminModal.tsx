import React from 'react';
import { playClickSound, playPowerUpSound } from '../utils/sound';

interface GhostAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export const GhostAdminModal: React.FC<GhostAdminModalProps> = ({
  isOpen,
  onClose,
  onNotify
}) => {
  const [masterKey, setMasterKey] = React.useState('#CYBER-ADMIN-KEY-9900');
  const [consoleLog, setConsoleLog] = React.useState<string[]>([
    '> SYSTEM INITIALIZING...',
    '> ENCRYPTION PROTOCOL: SHA-256 ACTIVE',
    '> WEBSOCKET ROOT TUNNEL: 127.0.0.1:9092 OPEN',
    '> READY FOR COMMAND OVERRIDES.'
  ]);

  if (!isOpen) return null;

  const handleCommand = (cmd: string, msg: string) => {
    playPowerUpSound();
    setConsoleLog(prev => [...prev, `> EXEC: ${cmd}`, `[SUCCESS] ${msg}`]);
    onNotify(msg);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-[580px] bg-black border-4 border-[#5de6ff] shadow-[8px_8px_0px_#5de6ff] rounded-xl p-5 flex flex-col gap-4 font-mono text-[#5de6ff]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b-2 border-[#5de6ff] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#5de6ff] animate-ping" />
            <h3 className="font-space font-bold text-white text-lg tracking-wider">
              [GHOST ADMIN_TERMINAL]
            </h3>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="w-8 h-8 rounded border-2 border-[#5de6ff] bg-black text-[#5de6ff] hover:text-white flex items-center justify-center font-bold"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Status Line */}
        <div className="p-2.5 bg-[#060d24] border border-[#5de6ff]/40 rounded flex items-center justify-between text-xs">
          <span className="font-space font-bold text-[#5de6ff]">STATUS: SECURE_CHANNEL_READY</span>
          <span className="px-2 py-0.5 bg-[#00cbe6] text-[#00515d] font-space font-bold rounded">
            ACCESS: SUPERADMIN
          </span>
        </div>

        {/* Master Key Input */}
        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase text-[#c3c6d7] font-space">
            SUPERADMIN MASTER KEY:
          </label>
          <input
            type="text"
            value={masterKey}
            onChange={e => setMasterKey(e.target.value)}
            className="w-full p-2 bg-[#060d24] text-[#eec200] border-2 border-[#5de6ff] rounded font-space font-bold tracking-widest focus:outline-none focus:border-[#eec200] shadow-[3px_3px_0px_#000000]"
          />
        </div>

        {/* Capabilities Notice */}
        <div className="p-3 bg-[#141a32] rounded border border-[#5de6ff]/30 text-xs leading-relaxed text-[#c3c6d7]">
          <p className="text-[#eec200] font-bold mb-1.5 flex items-center gap-1 font-space">
            <span>⚠️</span> MAFIYA / GHOST REJIMI IMTIYOZLARI:
          </p>
          <p>• Faol o'yin natijalarini real vaqtda qayta hisoblash</p>
          <p>• Savollar bazasini to'g'ridan-to'g'ri bypass qilish va shifrlash</p>
          <p>• Barcha ishtirokchilar pultiga favqulodda signal jo'natish</p>
        </div>

        {/* Console logs */}
        <div className="bg-[#0b1229] border border-black p-3 rounded h-28 overflow-y-auto text-[11px] leading-tight space-y-1 text-emerald-400">
          {consoleLog.map((log, idx) => (
            <div key={idx}>{log}</div>
          ))}
        </div>

        {/* Terminal Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#5de6ff]/40">
          <button
            onClick={() => handleCommand('SYNC_LEADERBOARD', 'Reyting to\'liq qayta sinxronizatsiya qilindi ⚡')}
            className="p-2 bg-[#181e36] text-[#5de6ff] hover:bg-[#222941] rounded border border-[#5de6ff] font-space text-xs font-bold"
            type="button"
          >
            ⚡ Sync Radar
          </button>
          <button
            onClick={() => handleCommand('FLUSH_CACHE', 'Sessiya xotirasi to\'liq yangilandi')}
            className="p-2 bg-[#181e36] text-[#eec200] hover:bg-[#222941] rounded border border-[#eec200] font-space text-xs font-bold"
            type="button"
          >
            🧹 Flush Cache
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-4 py-1.5 bg-[#181e36] text-[#dce1ff] font-space font-bold text-xs rounded border-2 border-black hover:bg-[#222941]"
            type="button"
          >
            Yopish
          </button>
          <button
            onClick={() => {
              playPowerUpSound();
              onNotify('SUPERADMIN vakolatlari terminal orqali tasdiqlandi ⚡');
              onClose();
            }}
            className="px-5 py-1.5 bg-[#5de6ff] text-black font-space font-bold text-sm uppercase tracking-wider rounded border-2 border-black shadow-[4px_4px_0px_#000000] hover:bg-[#eec200] transition-colors"
            type="button"
          >
            Tasdiqlash 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
