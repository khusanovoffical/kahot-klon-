import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { AVATAR_OPTIONS } from '../data/mockQuizData';
import {
  playClickSound,
  playCorrectSound,
  playPowerUpSound,
  playReactionSound,
  playTickSound
} from '../utils/sound';

interface PlayerViewProps {
  onSendReaction: (emoji: string, label: string) => void;
  onNotify: (msg: string) => void;
  roomPin?: string;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  onSendReaction,
  onNotify,
  roomPin = '749201'
}) => {
  // Mode switcher: 'lobby' (PIN & Ro'yxat) vs 'ingame' (O'yinchi Pulti Jonli)
  const [subView, setSubView] = useState<'lobby' | 'ingame'>('lobby');

  // PIN inputs
  const [pin, setPin] = useState<string[]>(['7', '4', '9', '2', '0', '1']);
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Nickname
  const [nickname, setNickname] = useState('CyberSardor');

  // Avatar Selection
  const [selectedAvatarIdx, setSelectedAvatarIdx] = useState(0);

  // In-Game state
  const [score, setScore] = useState(3450);
  const [streak, setStreak] = useState(3);
  const [timeLeft, setTimeLeft] = useState(14);
  const [selectedAnswer, setSelectedAnswer] = useState<'red' | 'blue' | 'yellow' | 'green' | null>(null);
  const [powerUp2xUsed, setPowerUp2xUsed] = useState(false);
  const [powerUp5050Used, setPowerUp5050Used] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [answerTime, setAnswerTime] = useState<string | null>(null);

  // Timer countdown simulation
  useEffect(() => {
    if (subView !== 'ingame') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 20; // Loop timer for interactive demo
        }
        if (prev <= 6) {
          playTickSound(true);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [subView]);

  // Handle PIN input chaining
  const handlePinChange = (idx: number, val: string) => {
    const char = val.slice(-1);
    if (!/^[0-9]?$/.test(char)) return;

    const nextPin = [...pin];
    nextPin[idx] = char;
    setPin(nextPin);

    if (char && idx < 5) {
      pinInputRefs.current[idx + 1]?.focus();
    }
  };

  const handlePinKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[idx] && idx > 0) {
      pinInputRefs.current[idx - 1]?.focus();
    }
  };

  const handleRandomAvatar = () => {
    playClickSound();
    const rand = Math.floor(Math.random() * AVATAR_OPTIONS.length);
    setSelectedAvatarIdx(rand);
  };

  const handleJoinGame = () => {
    playPowerUpSound();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
    setSubView('ingame');
    onNotify("Arenaga muvaffaqiyatli qo'shildingiz! Jang boshlandi 🚀");
  };

  // Submit Answer
  const handleSelectAnswer = (choice: 'red' | 'blue' | 'yellow' | 'green') => {
    if (eliminatedOptions.includes(choice)) return;
    playCorrectSound();
    setSelectedAnswer(choice);
    const recordedTime = (Math.random() * 0.8 + 0.8).toFixed(2);
    setAnswerTime(recordedTime);

    // Multiplier calculation
    const basePts = powerUp2xUsed ? 2000 : 1000;
    const speedBonus = 940;
    const earned = basePts + speedBonus;
    setScore(prev => prev + earned);
    setStreak(prev => prev + 1);

    onNotify(`${choice.toUpperCase()} javobi serverga jo'natildi (+${earned} ball) ⚡`);
  };

  const handleResetAnswer = () => {
    playClickSound();
    setSelectedAnswer(null);
    setAnswerTime(null);
  };

  // Power-up 2x
  const handleUse2x = () => {
    if (powerUp2xUsed) return;
    playPowerUpSound();
    setPowerUp2xUsed(true);
    onNotify('2X BALL KOZIRI FAOLLASHTIRILDI! Ushbu savolda 2 barobar ochko ⚡');
  };

  // Power-up 50/50
  const handleUse5050 = () => {
    if (powerUp5050Used) return;
    playPowerUpSound();
    setPowerUp5050Used(true);
    // Eliminate 2 wrong choices (say red and yellow)
    setEliminatedOptions(['red', 'yellow']);
    onNotify("50/50 KOZIRI FAOLLASHTIRILDI! 2 ta noto'g'ri variant o'chirildi 🎯");
  };

  // Send Floating Reaction
  const handleSendReactionBtn = (emoji: string, label: string) => {
    playReactionSound();
    onSendReaction(emoji, label);
    onNotify(`Reaksiya yuborildi: ${emoji} ${label}`);
  };

  // Launch celebration confetti on podium click
  const triggerPodiumConfetti = () => {
    playPowerUpSound();
    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.6 }
    });
    onNotify("3D Poydevor: Chempionlar tantanasi olqishlanmoqda! 🎊");
  };

  const fullPinString = pin.join('');

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Mode Switcher & Arena Broadcast Status Banner */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 py-2.5 mb-6 bg-[#141a32] rounded-xl px-4 border-2 border-black shadow-[4px_4px_0px_#000000]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#5de6ff] animate-ping" />
          <span className="font-space text-xs font-bold text-[#5de6ff] uppercase tracking-widest">
            Jonli Sinxronizatsiya: Aktiv
          </span>
          <span className="hidden sm:inline text-[#c3c6d7] text-xs">|</span>
          <span className="text-xs text-[#c3c6d7] flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-[#eec200]">bolt</span>
            Server kechikishi: <strong className="text-[#eec200] font-space">18ms</strong>
          </span>
        </div>

        {/* State View Toggle */}
        <div className="flex items-center bg-[#060d24] p-1 rounded-lg gap-1 border border-black">
          <button
            onClick={() => {
              playClickSound();
              setSubView('lobby');
            }}
            className={`px-3 py-1.5 rounded font-space text-xs font-bold transition-all ${
              subView === 'lobby'
                ? 'bg-[#2563eb] text-[#eeefff] shadow-[2px_2px_0px_#000000]'
                : 'text-[#c3c6d7] hover:text-[#dce1ff]'
            }`}
            type="button"
          >
            1. PIN & Ro'yxat
          </button>
          <button
            onClick={() => {
              playClickSound();
              setSubView('ingame');
            }}
            className={`px-3 py-1.5 rounded font-space text-xs font-bold transition-all ${
              subView === 'ingame'
                ? 'bg-[#2563eb] text-[#eeefff] shadow-[2px_2px_0px_#000000]'
                : 'text-[#c3c6d7] hover:text-[#dce1ff]'
            }`}
            type="button"
          >
            2. O'yinchi Pulti (Jonli)
          </button>
        </div>
      </div>

      {/* Main Dual Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / TAB 1: Game Onboarding & PIN Entry Chamber */}
        <section
          className={`lg:col-span-6 w-full flex flex-col gap-4 transition-all duration-300 ${
            subView === 'lobby' ? 'opacity-100' : 'opacity-90'
          }`}
        >
          <div className="relative bg-[#181e36] rounded-xl p-6 border-4 border-black shadow-[6px_6px_0px_#000000] overflow-hidden">
            {/* Neon Ambient Accents */}
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#5de6ff]/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-[#2563eb]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Header Card Deck */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-col">
                <span className="font-space text-xs uppercase tracking-wider text-[#5de6ff] flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-[18px]">sports_esports</span>
                  O'yinchilar Kirish Portali
                </span>
                <span className="font-space text-2xl font-bold text-[#dce1ff] mt-1">
                  ARENAGA QO'SHILISH
                </span>
              </div>
              <span className="bg-[#eec200] text-[#3c2f00] font-space text-xs font-bold px-3 py-1 rounded border border-black shadow-sm uppercase">
                PIN KOD TALAB
              </span>
            </div>

            <p className="text-sm text-[#c3c6d7] mb-6">
              Proyektor ekranidagi 6 xonali o'yin kodini tering, o'zingizga xos jangovar taxallus va pixel qahramon tanlang!
            </p>

            {/* 6-Digit Game PIN Input Cells */}
            <div className="flex flex-col gap-1 mb-5">
              <label className="font-space text-xs font-bold text-[#dce1ff] uppercase flex justify-between items-center">
                <span>O'yin PIN Kodi (6 Xonali)</span>
                <span className="text-[#5de6ff] text-xs font-mono font-medium">
                  {fullPinString.length === 6 ? `PIN Kiritildi: ${fullPinString}` : `${fullPinString.length}/6 kiritildi`}
                </span>
              </label>

              <div className="grid grid-cols-6 gap-2 sm:gap-3">
                {pin.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => {
                      pinInputRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handlePinChange(idx, e.target.value)}
                    onKeyDown={e => handlePinKeyDown(idx, e)}
                    className="w-full aspect-square text-center font-space text-2xl sm:text-3xl font-bold bg-[#060d24] text-[#5de6ff] rounded-lg border-2 border-black shadow-[3px_3px_0px_#000000] focus:bg-[#222941] focus:border-[#5de6ff] focus:outline-none transition-transform"
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5 mt-1.5 text-[#c3c6d7] text-xs">
                <span className="material-symbols-outlined text-[16px] text-[#5de6ff]">info</span>
                <span>
                  Maslahat: Ekranda ko'rsatilgan masofaviy PIN:{' '}
                  <strong className="text-[#eec200] font-space">{roomPin}</strong>
                </span>
              </div>
            </div>

            {/* Nickname Input Chamber */}
            <div className="flex flex-col gap-1 mb-5">
              <div className="flex justify-between items-center">
                <label className="font-space text-xs font-bold text-[#dce1ff] uppercase" htmlFor="nicknameInput">
                  Jangovar Taxallus (Nickname)
                </label>
                <span className="text-xs text-[#5de6ff] flex items-center gap-1 font-space">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span> Mos keldi
                </span>
              </div>

              <div className="relative flex items-center">
                <span className="absolute left-3 text-[#2563eb] font-space font-bold text-lg select-none">@</span>
                <input
                  id="nicknameInput"
                  type="text"
                  maxLength={16}
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="Masalan: HumoyunBlade"
                  className="w-full pl-9 pr-14 py-2.5 bg-[#060d24] text-[#dce1ff] rounded-lg font-space text-base font-bold border-2 border-black shadow-[3px_3px_0px_#000000] focus:bg-[#222941] focus:border-[#5de6ff] focus:outline-none transition-colors"
                />
                <span className="absolute right-3 font-space text-xs text-[#c3c6d7]">
                  {nickname.length}/16
                </span>
              </div>
            </div>

            {/* Pixel Boshlar Karuseli */}
            <div className="flex flex-col gap-2 mb-6 bg-[#141a32] p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#eec200] text-[20px]">face</span>
                  <span className="font-space text-xs font-bold text-[#dce1ff] uppercase tracking-wider">
                    Pixel Boshlar Karuseli
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="px-2.5 py-1 bg-[#222941] hover:bg-[#323851] text-[#eec200] rounded flex items-center gap-1 font-space text-xs font-bold transition-all border border-black shadow-sm active:scale-95"
                >
                  <span>🎲 Tasodifiy bosh</span>
                </button>
              </div>

              {/* Avatar Gallery */}
              <div className="grid grid-cols-5 gap-2 sm:gap-3 mt-1">
                {AVATAR_OPTIONS.map((item, idx) => {
                  const isSelected = idx === selectedAvatarIdx;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setSelectedAvatarIdx(idx);
                      }}
                      className={`relative aspect-square p-2 rounded-xl flex flex-col items-center justify-center transition-all border-2 border-black ${
                        isSelected
                          ? 'bg-[#2563eb] shadow-[3px_3px_0px_#000000] scale-105'
                          : 'bg-[#060d24] hover:bg-[#222941]'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#222941] flex items-center justify-center text-2xl select-none">
                        {item.emoji}
                      </div>
                      <span
                        className={`font-space text-[10px] mt-1 uppercase tracking-tight font-bold ${
                          isSelected ? 'text-[#eeefff]' : 'text-[#c3c6d7]'
                        }`}
                      >
                        {item.name}
                      </span>
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#eec200] text-[#3c2f00] rounded-full flex items-center justify-center text-[11px] font-bold border border-black shadow">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* High-Contrast Action Button */}
            <button
              type="button"
              onClick={handleJoinGame}
              className="w-full py-3.5 px-6 bg-[#eec200] text-[#3c2f00] rounded-xl font-space text-xl font-bold tracking-wide uppercase flex items-center justify-center gap-2 border-4 border-black shadow-[6px_6px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              <span>Jangga Kirish!</span>
              <span className="text-2xl">🚀</span>
            </button>
          </div>

          {/* Quick Session Footnote */}
          <div className="bg-[#141a32] p-4 rounded-xl flex items-center justify-between text-[#c3c6d7] border-2 border-black shadow-[3px_3px_0px_#000000]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#5de6ff] text-[18px]">vpn_key</span>
              <span className="font-space text-xs font-bold">Sessiya saqlangan (Token: #HQ-9821)</span>
            </div>
            <span className="text-xs text-[#5de6ff] font-space font-medium">Tayyor holat</span>
          </div>
        </section>

        {/* RIGHT / TAB 2: Active In-Game Mobile & Arena Controller Chamber */}
        <section
          className={`lg:col-span-6 w-full flex flex-col gap-4 transition-all duration-300 ${
            subView === 'ingame' ? 'opacity-100' : 'opacity-90'
          }`}
        >
          {/* Controller HUD Deck */}
          <div className="bg-[#181e36] rounded-xl p-5 border-4 border-black shadow-[6px_6px_0px_#000000] flex flex-col gap-4">
            {/* Upper Row: Question Tracker & Reconnect Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#2563eb] text-[#eeefff] font-space text-xs font-bold rounded border border-black shadow-sm">
                  SAVOL 04 / 10
                </span>
                <span className="px-2.5 py-1 bg-[#222941] text-[#5de6ff] font-space text-xs font-bold rounded border border-black hidden sm:inline">
                  Oddiy bosqich
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#060d24] rounded-lg text-[#5de6ff] font-space text-xs font-bold border border-black">
                <span className="w-2 h-2 rounded-full bg-[#5de6ff] animate-pulse" />
                <span>#HQ-9821</span>
              </div>
            </div>

            {/* Middle Row: Score + Streak & Circular Countdown */}
            <div className="grid grid-cols-12 gap-3 items-center bg-[#141a32] p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000]">
              <div className="col-span-8 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-[#eec200] text-2xl select-none">🔥</span>
                  <span className="font-space text-2xl sm:text-3xl font-bold text-[#dce1ff]">
                    {score.toLocaleString()}
                  </span>
                  <span className="font-space text-sm font-bold text-[#5de6ff]">Ball</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 bg-[#cea700] text-[#3c2f00] font-space text-[10px] rounded uppercase font-bold border border-black">
                    {streak}x Streak!
                  </span>
                  <span className="text-xs text-[#c3c6d7]">To'g'ri javoblar zanjiri</span>
                </div>
              </div>

              {/* Dynamic SVG Radial Timer */}
              <div className="col-span-4 flex items-center justify-end">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="transparent"
                      stroke="#2d344c"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="transparent"
                      stroke={timeLeft <= 5 ? '#ffb4ab' : '#eec200'}
                      strokeWidth="10"
                      strokeDasharray={264}
                      strokeDashoffset={264 - (timeLeft / 20) * 264}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className={`font-space text-2xl sm:text-3xl font-bold leading-none ${
                        timeLeft <= 5 ? 'text-[#ffb4ab] animate-pulse' : 'text-[#dce1ff]'
                      }`}
                    >
                      {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                    </span>
                    <span className="font-space text-[9px] text-[#c3c6d7] uppercase mt-0.5">
                      soniya
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3X STREAK MULTIPLIER BANNER */}
            <div className="p-3 bg-gradient-to-r from-[#cea700]/30 to-[#222941] border-2 border-[#eec200] rounded-xl flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#eec200] text-[#3c2f00] flex items-center justify-center text-xl font-bold shadow border border-black">
                  🔥
                </div>
                <div className="flex flex-col">
                  <span className="font-space text-xs font-bold text-[#eec200] tracking-wide uppercase flex items-center gap-1.5">
                    3X STREAK MULTIPLIER!
                    <span className="text-[9px] bg-[#eec200] text-[#3c2f00] px-1.5 py-0.5 rounded font-space font-bold">
                      AKTIV
                    </span>
                  </span>
                  <span className="text-xs text-[#c3c6d7]">
                    Ketma-ket 3 ta to'g'ri javob: Keyingi savolda{' '}
                    <strong className="text-[#5de6ff]">+300 Bonus Ball</strong> beriladi!
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-[#060d24] rounded-lg text-[#eec200] font-space text-xs font-bold border border-[#eec200]/40">
                <span>⚡️ KOMBO x3</span>
              </div>
            </div>

            {/* Blind Prompt Notice */}
            <div className="bg-[#2d344c]/60 p-2.5 rounded-lg flex items-center justify-between text-[#c3c6d7] border border-black">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#eec200]">tv</span>
                <span className="text-xs font-medium text-[#dce1ff]">
                  Savol matni va variantlar proyektor ekranida!
                </span>
              </div>
              <span className="font-space text-xs font-bold text-[#5de6ff] uppercase animate-pulse">
                Kuzating ⬆
              </span>
            </div>
          </div>

          {/* Maxsus Kozirlar (Power-ups) */}
          <div className="w-full flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="font-space text-xs font-bold text-[#5de6ff] uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">electric_bolt</span>
                Maxsus Kozirlar (Power-ups)
              </span>
              <span className="text-[#c3c6d7] text-xs">Savol davomida 1 marta</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleUse2x}
                disabled={powerUp2xUsed}
                className={`group relative p-3 rounded-xl flex items-center justify-between border-2 border-black transition-all shadow-[3px_3px_0px_#000000] ${
                  powerUp2xUsed
                    ? 'bg-[#181e36] opacity-60 cursor-not-allowed'
                    : 'bg-[#141a32] hover:bg-[#eec200]/10 border-[#eec200] active:scale-95'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#eec200] text-[#3c2f00] flex items-center justify-center font-bold text-base shadow border border-black">
                    ⚡️
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-space text-sm font-bold text-[#eec200] leading-tight">
                      2x Ball
                    </span>
                    <span className="text-[10px] text-[#c3c6d7] uppercase font-space">
                      {powerUp2xUsed ? 'ISHLATILDI' : '1 ta imkoniyat'}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded font-space text-[10px] uppercase font-bold border border-black ${
                    powerUp2xUsed ? 'bg-gray-700 text-gray-400' : 'bg-[#eec200] text-[#3c2f00]'
                  }`}
                >
                  {powerUp2xUsed ? 'FOYDALANILDI' : 'TAYYOR'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleUse5050}
                disabled={powerUp5050Used}
                className={`group relative p-3 rounded-xl flex items-center justify-between border-2 border-black transition-all shadow-[3px_3px_0px_#000000] ${
                  powerUp5050Used
                    ? 'bg-[#181e36] opacity-60 cursor-not-allowed'
                    : 'bg-[#141a32] hover:bg-[#5de6ff]/10 border-[#5de6ff] active:scale-95'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#5de6ff] text-[#00363e] flex items-center justify-center font-bold text-base shadow border border-black">
                    🎯
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-space text-sm font-bold text-[#5de6ff] leading-tight">
                      50 / 50
                    </span>
                    <span className="text-[10px] text-[#c3c6d7] uppercase font-space">
                      {powerUp5050Used ? "O'CHIRILDI" : "2 xato o'chiriladi"}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded font-space text-[10px] uppercase font-bold border border-black ${
                    powerUp5050Used ? 'bg-gray-700 text-gray-400' : 'bg-[#5de6ff] text-[#00363e]'
                  }`}
                >
                  {powerUp5050Used ? 'AKTIV' : 'TAYYOR'}
                </span>
              </button>
            </div>
          </div>

          {/* 4 HUGE Tactile Geometric Arcade Answer Buttons */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. RED / Triangle (▲) */}
            <button
              type="button"
              disabled={eliminatedOptions.includes('red')}
              onClick={() => handleSelectAnswer('red')}
              className={`group relative w-full min-h-[140px] sm:min-h-[160px] p-4 rounded-xl bg-[#93000a] text-[#ffdad6] border-4 border-black flex flex-col justify-between items-start transition-all ${
                eliminatedOptions.includes('red')
                  ? 'opacity-25 cursor-not-allowed line-through'
                  : selectedAnswer === 'red'
                  ? 'scale-[0.98] shadow-[2px_2px_0px_#000000] ring-4 ring-[#ffb4ab]'
                  : selectedAnswer
                  ? 'opacity-40 shadow-[4px_4px_0px_#000000]'
                  : 'shadow-[6px_6px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-1 active:translate-y-1'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="w-12 h-12 rounded-lg bg-[#ffb4ab] text-[#690005] flex items-center justify-center font-space text-2xl font-bold shadow border-2 border-black leading-none select-none">
                  ▲
                </span>
                <span className="font-space text-xs bg-black/60 text-[#ffb4ab] px-3 py-1 rounded border border-black uppercase font-bold">
                  Tugma 1
                </span>
              </div>
              <div className="w-full flex items-baseline justify-between mt-4">
                <span className="font-space text-xl sm:text-2xl font-bold tracking-tight uppercase">
                  Qizil Uchburchak
                </span>
                <span className="material-symbols-outlined text-[24px] opacity-75 group-hover:opacity-100 transition-opacity">
                  arrow_forward
                </span>
              </div>
            </button>

            {/* 2. BLUE / Circle (●) */}
            <button
              type="button"
              disabled={eliminatedOptions.includes('blue')}
              onClick={() => handleSelectAnswer('blue')}
              className={`group relative w-full min-h-[140px] sm:min-h-[160px] p-4 rounded-xl bg-[#2563eb] text-[#eeefff] border-4 border-black flex flex-col justify-between items-start transition-all ${
                eliminatedOptions.includes('blue')
                  ? 'opacity-25 cursor-not-allowed line-through'
                  : selectedAnswer === 'blue'
                  ? 'scale-[0.98] shadow-[2px_2px_0px_#000000] ring-4 ring-[#5de6ff]'
                  : selectedAnswer
                  ? 'opacity-40 shadow-[4px_4px_0px_#000000]'
                  : 'shadow-[6px_6px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-1 active:translate-y-1'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="w-12 h-12 rounded-lg bg-[#b4c5ff] text-[#002a78] flex items-center justify-center font-space text-2xl font-bold shadow border-2 border-black leading-none select-none">
                  ●
                </span>
                <span className="font-space text-xs bg-black/60 text-[#b4c5ff] px-3 py-1 rounded border border-black uppercase font-bold">
                  Tugma 2
                </span>
              </div>
              <div className="w-full flex items-baseline justify-between mt-4">
                <span className="font-space text-xl sm:text-2xl font-bold tracking-tight uppercase">
                  Ko'k Doira
                </span>
                <span className="material-symbols-outlined text-[24px] opacity-75 group-hover:opacity-100 transition-opacity">
                  arrow_forward
                </span>
              </div>
            </button>

            {/* 3. YELLOW / Square (■) */}
            <button
              type="button"
              disabled={eliminatedOptions.includes('yellow')}
              onClick={() => handleSelectAnswer('yellow')}
              className={`group relative w-full min-h-[140px] sm:min-h-[160px] p-4 rounded-xl bg-[#eec200] text-[#3c2f00] border-4 border-black flex flex-col justify-between items-start transition-all ${
                eliminatedOptions.includes('yellow')
                  ? 'opacity-25 cursor-not-allowed line-through'
                  : selectedAnswer === 'yellow'
                  ? 'scale-[0.98] shadow-[2px_2px_0px_#000000] ring-4 ring-white'
                  : selectedAnswer
                  ? 'opacity-40 shadow-[4px_4px_0px_#000000]'
                  : 'shadow-[6px_6px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-1 active:translate-y-1'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="w-12 h-12 rounded-lg bg-[#060d24] text-[#eec200] flex items-center justify-center font-space text-2xl font-bold shadow border-2 border-black leading-none select-none">
                  ■
                </span>
                <span className="font-space text-xs bg-black/60 text-[#eec200] px-3 py-1 rounded border border-black uppercase font-bold">
                  Tugma 3
                </span>
              </div>
              <div className="w-full flex items-baseline justify-between mt-4">
                <span className="font-space text-xl sm:text-2xl font-bold tracking-tight uppercase">
                  Sariq Kvadrat
                </span>
                <span className="material-symbols-outlined text-[24px] opacity-75 group-hover:opacity-100 transition-opacity">
                  arrow_forward
                </span>
              </div>
            </button>

            {/* 4. GREEN / Diamond (◆) */}
            <button
              type="button"
              disabled={eliminatedOptions.includes('green')}
              onClick={() => handleSelectAnswer('green')}
              className={`group relative w-full min-h-[140px] sm:min-h-[160px] p-4 rounded-xl bg-[#00cbe6] text-[#00363e] border-4 border-black flex flex-col justify-between items-start transition-all ${
                eliminatedOptions.includes('green')
                  ? 'opacity-25 cursor-not-allowed line-through'
                  : selectedAnswer === 'green'
                  ? 'scale-[0.98] shadow-[2px_2px_0px_#000000] ring-4 ring-[#5de6ff]'
                  : selectedAnswer
                  ? 'opacity-40 shadow-[4px_4px_0px_#000000]'
                  : 'shadow-[6px_6px_0px_#000000] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-1 active:translate-y-1'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="w-12 h-12 rounded-lg bg-[#5de6ff] text-[#00363e] flex items-center justify-center font-space text-2xl font-bold shadow border-2 border-black leading-none select-none">
                  ◆
                </span>
                <span className="font-space text-xs bg-black/60 text-[#5de6ff] px-3 py-1 rounded border border-black uppercase font-bold">
                  Tugma 4
                </span>
              </div>
              <div className="w-full flex items-baseline justify-between mt-4">
                <span className="font-space text-xl sm:text-2xl font-bold tracking-tight uppercase">
                  Yashil Romb
                </span>
                <span className="material-symbols-outlined text-[24px] opacity-75 group-hover:opacity-100 transition-opacity">
                  arrow_forward
                </span>
              </div>
            </button>
          </div>

          {/* Proyektorga Reaksiya Uchirish */}
          <div className="w-full bg-[#181e36] rounded-xl p-3 flex flex-col gap-2 border-2 border-black shadow-[4px_4px_0px_#000000]">
            <div className="flex items-center justify-between px-1">
              <span className="font-space text-xs font-bold text-[#dce1ff] uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#eec200]">send</span>
                Proyektorga Reaksiya Uchirish
              </span>
              <span className="text-[11px] text-[#5de6ff] font-medium animate-pulse font-space">
                Jonli jonatish
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleSendReactionBtn('🔥', 'Alanga')}
                className="p-2.5 bg-[#141a32] hover:bg-[#222941] active:scale-90 border-2 border-black rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all shadow-[2px_2px_0px_#000000]"
              >
                <span className="text-2xl select-none">🔥</span>
                <span className="font-space text-[10px] text-[#dce1ff] uppercase font-bold">Alanga</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendReactionBtn('😂', 'Kulgi')}
                className="p-2.5 bg-[#141a32] hover:bg-[#222941] active:scale-90 border-2 border-black rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all shadow-[2px_2px_0px_#000000]"
              >
                <span className="text-2xl select-none">😂</span>
                <span className="font-space text-[10px] text-[#dce1ff] uppercase font-bold">Kulgi</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendReactionBtn('❤️', 'Sevgi')}
                className="p-2.5 bg-[#141a32] hover:bg-[#222941] active:scale-90 border-2 border-black rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all shadow-[2px_2px_0px_#000000]"
              >
                <span className="text-2xl select-none">❤️</span>
                <span className="font-space text-[10px] text-[#dce1ff] uppercase font-bold">Sevgi</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendReactionBtn('⚡️', 'Chaqmoq')}
                className="p-2.5 bg-[#141a32] hover:bg-[#222941] active:scale-90 border-2 border-black rounded-lg flex flex-col items-center justify-center gap-0.5 transition-all shadow-[2px_2px_0px_#000000]"
              >
                <span className="text-2xl select-none">⚡️</span>
                <span className="font-space text-[10px] text-[#dce1ff] uppercase font-bold">Chaqmoq</span>
              </button>
            </div>
          </div>

          {/* Live Confirmation Overlay */}
          {selectedAnswer && (
            <div className="bg-[#222941] rounded-xl p-4 flex items-center justify-between border-2 border-black shadow-[4px_4px_0px_#000000]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#eec200] text-[#3c2f00] flex items-center justify-center font-space text-xl font-bold border border-black">
                  ✓
                </div>
                <div className="flex flex-col">
                  <span className="font-space text-base font-bold text-[#dce1ff]">
                    Javobingiz Qabul Qilindi!
                  </span>
                  <span className="text-xs text-[#5de6ff] font-space font-medium">
                    Tezlik bonusi: +940 ochko hisoblanmoqda ({answerTime}s) ⚡
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleResetAnswer}
                className="px-3 py-1.5 bg-[#2d344c] hover:bg-[#323851] text-[#dce1ff] rounded font-space text-xs font-bold border border-black shadow-sm"
              >
                Qaytarish
              </button>
            </div>
          )}

          {/* Diagnostic Status Ribbon */}
          <div className="bg-[#141a32] p-3 rounded-xl flex items-center justify-between text-[#c3c6d7] font-space text-xs font-bold border-2 border-black shadow-[3px_3px_0px_#000000]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-[#5de6ff]">
                <span className="material-symbols-outlined text-[18px]">volume_up</span>
                <span>Tovush yoqilgan</span>
              </div>
              <div className="flex items-center gap-1 text-[#eec200]">
                <span className="material-symbols-outlined text-[18px]">vibration</span>
                <span>Haptic active</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px] text-[#2563eb]">speed</span>
              <span className="text-[#dce1ff]">Vaqt: {answerTime ? `${answerTime}s` : '1.18s'}</span>
            </div>
          </div>
        </section>
      </div>

      {/* 3D Tantanali Chempionlar Poydevori */}
      <div className="mt-8 w-full bg-[#141a32] border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_#000000] relative overflow-hidden">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#2563eb]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 relative z-10">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[#eec200] text-xl">🏆</span>
              <span className="font-space text-xs font-bold text-[#eec200] uppercase tracking-wider">
                Grand Finale • Jonli G'oliblar
              </span>
            </div>
            <h3 className="font-space text-2xl font-bold text-[#dce1ff] mt-1">
              3D Tantanali Chempionlar Poydevori
            </h3>
          </div>

          <button
            type="button"
            onClick={triggerPodiumConfetti}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#181e36] hover:bg-[#222941] rounded-full text-[#5de6ff] font-space text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000000] active:scale-95 transition-all"
          >
            <span className="animate-ping w-2 h-2 rounded-full bg-[#5de6ff]" />
            <span>Jonli Natijalar Ko'rinishi 🎊</span>
          </button>
        </div>

        {/* 3 Step Podium */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-8 pb-4 max-w-[850px] mx-auto relative z-10">
          {/* #2 Silver Rank */}
          <div className="flex flex-col items-center group">
            <div className="relative flex flex-col items-center mb-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#222941] border-2 border-gray-400 flex items-center justify-center text-3xl shadow-lg relative">
                🥈 <span className="absolute -top-2 -right-2 text-xl select-none">🐱</span>
              </div>
              <span className="font-space text-sm sm:text-base font-bold text-[#dce1ff] mt-1 text-center">
                Jasur_Dev
              </span>
              <span className="font-space text-xs text-[#5de6ff]">8,920 ball</span>
            </div>

            <div className="w-full h-32 sm:h-40 bg-gradient-to-t from-[#060d24] to-[#2d344c] rounded-t-2xl border-t-4 border-l-2 border-r-2 border-gray-400 flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
              <span className="font-space text-3xl sm:text-5xl font-bold text-gray-300">#2</span>
              <span className="font-space text-[10px] text-gray-400 uppercase mt-1 tracking-wider font-bold">
                Kumush
              </span>
            </div>
          </div>

          {/* #1 Gold Champion */}
          <div className="flex flex-col items-center group -mt-6 sm:-mt-8">
            <div className="relative flex flex-col items-center mb-2">
              <div className="absolute -top-7 text-3xl animate-bounce select-none">👑</div>
              <div className="w-18 h-18 sm:w-22 sm:h-22 rounded-2xl bg-[#2563eb] border-4 border-[#eec200] flex items-center justify-center text-4xl shadow-2xl relative">
                🤖
                <span className="absolute -bottom-2 px-2 py-0.5 bg-[#eec200] text-[#3c2f00] text-[9px] font-space font-bold uppercase rounded-full shadow border border-black">
                  CHEMPION
                </span>
              </div>
              <span className="font-space text-base sm:text-xl font-bold text-[#eec200] mt-2 text-center">
                Player_01
              </span>
              <span className="font-space text-xs sm:text-sm font-bold text-[#dce1ff]">12,450 ball</span>
              <div className="flex items-center gap-1 text-[11px] text-[#eec200] mt-0.5">
                <span>🎊</span>
                <span className="font-semibold">10/10 To'liq</span>
                <span>🎉</span>
              </div>
            </div>

            <div className="w-full h-44 sm:h-56 bg-gradient-to-t from-[#060d24] via-[#cea700]/30 to-[#eec200]/25 rounded-t-2xl border-t-4 border-l-2 border-r-2 border-[#eec200] flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
              <span className="font-space text-5xl sm:text-7xl font-bold text-[#eec200] drop-shadow">
                #1
              </span>
              <span className="font-space text-xs text-[#eec200] uppercase mt-1 font-bold tracking-widest">
                Oltin Toj
              </span>
            </div>
          </div>

          {/* #3 Bronze Rank */}
          <div className="flex flex-col items-center group">
            <div className="relative flex flex-col items-center mb-2">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#222941] border-2 border-amber-600 flex items-center justify-center text-3xl shadow-lg relative">
                🥉 <span className="absolute -top-2 -right-2 text-xl select-none">🥷</span>
              </div>
              <span className="font-space text-sm sm:text-base font-bold text-[#dce1ff] mt-1 text-center">
                Samir_Quiz
              </span>
              <span className="font-space text-xs text-[#5de6ff]">7,610 ball</span>
            </div>

            <div className="w-full h-24 sm:h-32 bg-gradient-to-t from-[#060d24] to-[#181e36] rounded-t-2xl border-t-4 border-l-2 border-r-2 border-amber-600 flex flex-col items-center justify-center shadow-xl relative overflow-hidden">
              <span className="font-space text-3xl sm:text-5xl font-bold text-amber-500">#3</span>
              <span className="font-space text-[10px] text-amber-400 uppercase mt-1 tracking-wider font-bold">
                Bronza
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Arena Real-Time Live Activity Ticker */}
      <div className="mt-6 w-full bg-[#181e36] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-4 border-black shadow-[4px_4px_0px_#000000]">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-[#eec200] text-[#3c2f00] font-space text-xs font-bold rounded uppercase border border-black">
            ARENA XABARI
          </span>
          <span className="text-sm text-[#dce1ff]">
            Leaderboard yangilandi:{' '}
            <strong className="text-[#5de6ff] font-space">Player_01</strong> 1-o'ringa ko'tarildi!
          </span>
        </div>

        <div className="flex items-center gap-6 text-[#c3c6d7] text-xs font-space">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#5de6ff]">group</span>
            48 o'yinchi javob berdi
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#eec200]">military_tech</span>
            Mukofot jamg'armasi: 500k XP
          </span>
        </div>
      </div>
    </div>
  );
};
