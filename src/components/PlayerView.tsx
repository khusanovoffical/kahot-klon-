import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { CHARACTER_AVATARS, CharacterAvatar, getAvatarFallbackUrl } from '../data/avatarsData';
import { Question } from '../types/quiz';
import {
  playClickSound,
  playCorrectSound,
  playWrongSound,
  playPowerUpSound,
  playReactionSound,
  playTickSound
} from '../utils/sound';

interface PlayerViewProps {
  onSendReaction: (emoji: string, label: string) => void;
  onNotify: (msg: string) => void;
  roomPin: string;
  activeQuestion?: Question;
  onPlayerProfileUpdate?: (name: string, avatarUrl: string) => void;
}

export const PlayerView: React.FC<PlayerViewProps> = ({
  onSendReaction,
  onNotify,
  roomPin,
  activeQuestion,
  onPlayerProfileUpdate
}) => {
  // Mode switcher: 'lobby' (PIN & Ro'yxat) vs 'ingame' (O'yinchi Pulti Jonli)
  const [subView, setSubView] = useState<'lobby' | 'ingame'>('lobby');

  // PIN inputs
  const cleanRoomPin = roomPin.replace(/\s+/g, '');
  const [pinDigits, setPinDigits] = useState<string[]>(['7', '4', '9', '2', '0', '1']);
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [pinError, setPinError] = useState<string | null>(null);

  // Nickname
  const [nickname, setNickname] = useState('CyberSardor');

  // 40 Character Avatars selection
  const [avatarCategory, setAvatarCategory] = useState<'all' | 'Marvel' | 'DC' | 'Animatsiya & O\'yinlar'>('all');
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('iron-man');

  // In-Game state
  const [score, setScore] = useState(3450);
  const [streak, setStreak] = useState(3);
  const [timeLeft, setTimeLeft] = useState(14);
  const [selectedAnswer, setSelectedAnswer] = useState<'red' | 'blue' | 'yellow' | 'green' | null>(null);
  const [answerResult, setAnswerResult] = useState<'correct' | 'wrong' | null>(null);
  const [scoreDelta, setScoreDelta] = useState<number>(0);
  const [powerUp2xUsed, setPowerUp2xUsed] = useState(false);
  const [powerUp5050Used, setPowerUp5050Used] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<string[]>([]);
  const [answerTime, setAnswerTime] = useState<string | null>(null);

  // Dynamic Mood Emojis: 'neutral' | 'win' | 'loss'
  const [playerMood, setPlayerMood] = useState<'neutral' | 'win' | 'loss'>('neutral');

  // Find selected avatar object
  const currentAvatar = CHARACTER_AVATARS.find(a => a.id === selectedAvatarId) || CHARACTER_AVATARS[0];

  // Inform parent about player profile
  useEffect(() => {
    onPlayerProfileUpdate?.(nickname, currentAvatar.imageUrl);
  }, [nickname, currentAvatar, onPlayerProfileUpdate]);

  // Timer countdown simulation
  useEffect(() => {
    if (subView !== 'ingame') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 20; // reset loop for interactive controller
        }
        if (prev <= 5) {
          playTickSound(true);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [subView]);

  // PIN chaining input handler
  const handlePinChange = (idx: number, val: string) => {
    const char = val.slice(-1);
    if (!/^[0-9]?$/.test(char)) return;

    setPinError(null);
    const nextPin = [...pinDigits];
    nextPin[idx] = char;
    setPinDigits(nextPin);

    if (char && idx < 5) {
      pinInputRefs.current[idx + 1]?.focus();
    }
  };

  const handlePinKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pinDigits[idx] && idx > 0) {
      pinInputRefs.current[idx - 1]?.focus();
    }
  };

  // Join Game validation - STRICT PIN VALIDATION according to Requirement 3
  const handleJoinGame = () => {
    const enteredPin = pinDigits.join('');
    if (enteredPin.length < 6) {
      playWrongSound();
      setPinError("Iltimos, to'liq 6 xonali o'yin PIN kodini kiriting!");
      onNotify("PIN to'liq kiritilmadi! 6 xonali kod kerak.");
      return;
    }

    if (enteredPin !== cleanRoomPin) {
      playWrongSound();
      setPinError("Bunday o'yin mavjud emas! PIN kodni qayta tekshiring.");
      onNotify("Bunday o'yin mavjud emas! PIN kodni qayta tekshiring ❌");
      return;
    }

    // Success
    setPinError(null);
    playPowerUpSound();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
    setSubView('ingame');
    onNotify(`Arenaga xush kelibsiz, ${nickname}! O'yin pulti faollashtirildi 🚀`);
  };

  // Select Random Avatar
  const handleRandomAvatar = () => {
    playClickSound();
    const randomIndex = Math.floor(Math.random() * CHARACTER_AVATARS.length);
    setSelectedAvatarId(CHARACTER_AVATARS[randomIndex].id);
  };

  // Submit Answer with FAIR SCORING:
  // - Correct: +Points + Speed Bonus
  // - Wrong: STRICTLY SUBTRACT -50 points, streak = 0, crying emojis!
  const handleSelectAnswer = (choice: 'red' | 'blue' | 'yellow' | 'green') => {
    if (eliminatedOptions.includes(choice)) return;

    // Map choice color to option letter
    const colorToLetterMap: Record<string, 'A' | 'B' | 'C' | 'D'> = {
      red: 'A',
      blue: 'B',
      yellow: 'C',
      green: 'D'
    };
    const chosenLetter = colorToLetterMap[choice];
    const correctLetter = activeQuestion?.correctOption || 'B';

    setSelectedAnswer(choice);
    const recordedTime = (Math.random() * 0.7 + 0.9).toFixed(2);
    setAnswerTime(recordedTime);

    if (chosenLetter === correctLetter) {
      // Correct answer!
      playCorrectSound();
      confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
      const basePts = powerUp2xUsed ? 2000 : (activeQuestion?.points || 1000);
      const speedBonus = Math.floor(Number(timeLeft) * 35);
      const totalEarned = basePts + speedBonus;

      setScore(prev => prev + totalEarned);
      setStreak(prev => prev + 1);
      setScoreDelta(totalEarned);
      setAnswerResult('correct');
      setPlayerMood('win');

      onNotify(`To'g'ri javob! +${totalEarned} ball qo'shildi 🔥`);
    } else {
      // WRONG ANSWER - STRICT PENALTY (Ayirish!)
      playWrongSound();
      const penalty = 50; // deduct points
      setScore(prev => Math.max(0, prev - penalty));
      setStreak(0); // reset streak
      setScoreDelta(-penalty);
      setAnswerResult('wrong');
      setPlayerMood('loss');

      onNotify(`Noto'g'ri javob! -${penalty} ball jarima berildi 😭`);
    }
  };

  const handleResetAnswer = () => {
    playClickSound();
    setSelectedAnswer(null);
    setAnswerResult(null);
    setAnswerTime(null);
    setPlayerMood('neutral');
  };

  // Power-up 2x
  const handleUse2x = () => {
    if (powerUp2xUsed) return;
    playPowerUpSound();
    setPowerUp2xUsed(true);
    onNotify('2X BALL KOZIRI FAOLLASHTIRILDI! Keyingi to\'g\'ri javobda 2 barobar ochko ⚡');
  };

  // Power-up 50/50
  const handleUse5050 = () => {
    if (powerUp5050Used) return;
    playPowerUpSound();
    setPowerUp5050Used(true);
    setEliminatedOptions(['red', 'yellow']);
    onNotify("50/50 KOZIRI FAOLLASHTIRILDI! 2 ta xato variant o'chirildi 🎯");
  };

  // Send Floating Reaction
  const handleSendReactionBtn = (emoji: string, label: string) => {
    playReactionSound();
    onSendReaction(emoji, label);
    onNotify(`Reaksiya yuborildi: ${emoji} ${label}`);
  };

  // Filtered Avatars
  const filteredAvatars = CHARACTER_AVATARS.filter(a => {
    if (avatarCategory === 'all') return true;
    return a.universe === avatarCategory;
  });

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Dynamic Arena Broadcast Status Bar */}
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

        {/* State View Toggle (Lobby vs Ingame) */}
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
        {/* LEFT / TAB 1: Game Onboarding & 40 Character Avatars */}
        <section
          className={`lg:col-span-6 w-full flex flex-col gap-4 transition-all duration-300 ${
            subView === 'lobby' ? 'opacity-100' : 'opacity-85'
          }`}
        >
          <div className="relative bg-[#181e36] rounded-xl p-6 border-4 border-black shadow-[6px_6px_0px_#000000] overflow-hidden">
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

            <p className="text-xs sm:text-sm text-[#c3c6d7] mb-5">
              Proyektor ekranidagi 6 xonali o'yin kodini tering, o'zingizga xos jangovar taxallus va 40 ta realistik Marvel, DC yoki multfilm qahramonidan birini tanlang!
            </p>

            {/* 6-Digit Game PIN Input Cells with Error Warning */}
            <div className="flex flex-col gap-1.5 mb-5">
              <label className="font-space text-xs font-bold text-[#dce1ff] uppercase flex justify-between items-center">
                <span>O'yin PIN Kodi (6 Xonali)</span>
                <span className="text-[#5de6ff] text-xs font-mono font-medium">
                  Masofaviy PIN: <strong className="text-[#eec200]">{cleanRoomPin}</strong>
                </span>
              </label>

              <div className="grid grid-cols-6 gap-2 sm:gap-3">
                {pinDigits.map((digit, idx) => (
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
                    className={`w-full aspect-square text-center font-space text-2xl sm:text-3xl font-bold bg-[#060d24] text-[#5de6ff] rounded-lg border-2 ${
                      pinError ? 'border-[#ffb4ab]' : 'border-black'
                    } shadow-[3px_3px_0px_#000000] focus:bg-[#222941] focus:border-[#5de6ff] focus:outline-none transition-transform`}
                  />
                ))}
              </div>

              {/* Strict PIN Error Banner according to Requirement 3 */}
              {pinError && (
                <div className="mt-2 p-3 bg-[#93000a] text-[#ffdad6] border-2 border-black rounded-lg flex items-center gap-2 font-space text-xs font-bold shadow-[2px_2px_0px_#000000] animate-shake">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{pinError}</span>
                </div>
              )}
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
                  className="w-full pl-9 pr-14 py-2.5 bg-[#060d24] text-[#dce1ff] rounded-lg font-space text-base font-bold border-2 border-black shadow-[3px_3px_0px_#000000] focus:bg-[#222941] focus:border-[#5de6ff] focus:outline-none"
                />
                <span className="absolute right-3 font-space text-xs text-[#c3c6d7]">
                  {nickname.length}/16
                </span>
              </div>
            </div>

            {/* 40 TA REALISTIK AVATAR TANLASH (Requirement 3: Marvel, DC va multfilmlar) */}
            <div className="flex flex-col gap-2 mb-6 bg-[#141a32] p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#eec200] text-[20px]">photo_camera_front</span>
                  <span className="font-space text-xs font-bold text-[#dce1ff] uppercase tracking-wider">
                    40 ta Realistik Avatar (Marvel, DC, Multfilmlar)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="px-2.5 py-1 bg-[#222941] hover:bg-[#323851] text-[#eec200] rounded-lg flex items-center gap-1 font-space text-xs font-bold transition-all border border-black shadow-sm self-start sm:self-auto"
                >
                  <span>🎲 Tasodifiy personaj</span>
                </button>
              </div>

              {/* Universe filter tabs */}
              <div className="flex items-center gap-1 bg-[#060d24] p-1 rounded-lg border border-black text-xs font-space font-bold overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setAvatarCategory('all')}
                  className={`px-2.5 py-1 rounded shrink-0 ${avatarCategory === 'all' ? 'bg-[#2563eb] text-white' : 'text-[#c3c6d7]'}`}
                >
                  Barchasi (40)
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarCategory('Marvel')}
                  className={`px-2.5 py-1 rounded shrink-0 ${avatarCategory === 'Marvel' ? 'bg-[#ef4444] text-white' : 'text-[#c3c6d7]'}`}
                >
                  Marvel (15)
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarCategory('DC')}
                  className={`px-2.5 py-1 rounded shrink-0 ${avatarCategory === 'DC' ? 'bg-[#3b82f6] text-white' : 'text-[#c3c6d7]'}`}
                >
                  DC (9)
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarCategory('Animatsiya & O\'yinlar')}
                  className={`px-2.5 py-1 rounded shrink-0 ${avatarCategory === 'Animatsiya & O\'yinlar' ? 'bg-[#10b981] text-white' : 'text-[#c3c6d7]'}`}
                >
                  Multfilm & O'yinlar (16)
                </button>
              </div>

              {/* Selected Character Preview Badge */}
              <div className="flex items-center gap-3 p-2 bg-[#060d24] rounded-lg border border-[#5de6ff]/30">
                <div className="w-12 h-12 rounded-lg overflow-hidden border-2 border-[#eec200] shrink-0 bg-[#222941]">
                  <img
                    src={currentAvatar.imageUrl}
                    alt={currentAvatar.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getAvatarFallbackUrl(currentAvatar.name);
                    }}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-space text-sm font-bold text-[#eec200]">
                    {currentAvatar.name}
                  </span>
                  <span className="text-[11px] text-[#5de6ff] font-space">
                    {currentAvatar.universe} koinoti
                  </span>
                </div>
              </div>

              {/* Scrollable Avatar Grid (40 high quality characters) */}
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[220px] overflow-y-auto p-1 pr-1.5 border border-black rounded-lg bg-[#060d24]">
                {filteredAvatars.map(char => {
                  const isSelected = char.id === selectedAvatarId;
                  return (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setSelectedAvatarId(char.id);
                      }}
                      className={`relative aspect-square rounded-xl p-1 flex flex-col items-center justify-center transition-all border-2 ${
                        isSelected
                          ? 'border-[#eec200] bg-[#222941] shadow-[0_0_12px_#eec200] scale-105 z-10'
                          : 'border-black bg-[#181e36] hover:border-[#5de6ff]'
                      }`}
                      title={char.name}
                    >
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg overflow-hidden bg-black/60 flex items-center justify-center">
                        <img
                          src={char.imageUrl}
                          alt={char.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getAvatarFallbackUrl(char.name);
                          }}
                        />
                      </div>
                      <span className="font-space text-[9px] font-bold text-[#dce1ff] truncate w-full text-center mt-1 leading-tight">
                        {char.name.split(' ')[0]}
                      </span>

                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#eec200] text-[#3c2f00] rounded-full flex items-center justify-center text-[10px] font-bold border border-black shadow">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Join Button */}
            <button
              type="button"
              onClick={handleJoinGame}
              className="w-full py-3.5 px-6 bg-[#eec200] text-[#3c2f00] rounded-xl font-space text-xl font-bold tracking-wide uppercase flex items-center justify-center gap-2 border-4 border-black shadow-[6px_6px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
            >
              <span>Jangga Kirish!</span>
              <span className="text-2xl">🚀</span>
            </button>
          </div>
        </section>

        {/* RIGHT / TAB 2: Active In-Game Arena Controller Chamber */}
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
                <span className="px-3 py-1 bg-[#2563eb] text-[#eeefff] font-space text-xs font-bold rounded-lg border border-black shadow-sm">
                  SAVOL 04 / 10
                </span>
                <span className="px-2.5 py-1 bg-[#222941] text-[#5de6ff] font-space text-xs font-bold rounded-lg border border-black hidden sm:inline">
                  {activeQuestion?.category || 'Dasturlash'}
                </span>
              </div>

              {/* Dynamic Mood & Streak Indicator */}
              <div className="flex items-center gap-2">
                {playerMood === 'win' && (
                  <span className="px-2 py-0.5 bg-[#eec200] text-[#3c2f00] font-space text-xs font-bold rounded-lg border border-black flex items-center gap-1 animate-bounce">
                    <span>🔥👑⚡️</span>
                    <span>G'alaba!</span>
                  </span>
                )}
                {playerMood === 'loss' && (
                  <span className="px-2 py-0.5 bg-[#93000a] text-[#ffdad6] font-space text-xs font-bold rounded-lg border border-black flex items-center gap-1 animate-shake">
                    <span>😭🤦‍♂️💔</span>
                    <span>Xato!</span>
                  </span>
                )}
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#060d24] rounded-lg text-[#5de6ff] font-space text-xs font-bold border border-black">
                  <span className="w-2 h-2 rounded-full bg-[#5de6ff] animate-pulse" />
                  <span>#{cleanRoomPin}</span>
                </div>
              </div>
            </div>

            {/* Score & Multiplier Block + Countdown */}
            <div className="grid grid-cols-12 gap-3 items-center bg-[#141a32] p-4 rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000]">
              <div className="col-span-8 flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-[#eec200] text-2xl select-none">
                    {playerMood === 'win' ? '👑' : playerMood === 'loss' ? '💔' : '🔥'}
                  </span>
                  <span className="font-space text-2xl sm:text-3xl font-bold text-[#dce1ff]">
                    {score.toLocaleString()}
                  </span>
                  <span className="font-space text-sm font-bold text-[#5de6ff]">Ball</span>

                  {/* Score Delta Badge */}
                  {scoreDelta !== 0 && (
                    <span
                      className={`px-2 py-0.5 rounded font-space text-xs font-bold ${
                        scoreDelta > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`px-2 py-0.5 rounded font-space text-[10px] uppercase font-bold border border-black ${
                      streak > 0 ? 'bg-[#cea700] text-[#3c2f00]' : 'bg-[#222941] text-[#c3c6d7]'
                    }`}
                  >
                    {streak > 0 ? `${streak}x Streak!` : "Streak 0"}
                  </span>
                  <span className="text-xs text-[#c3c6d7]">
                    {streak > 0 ? "To'g'ri javoblar zanjiri" : "Xato javob sababli to'xtadi"}
                  </span>
                </div>
              </div>

              {/* Dynamic SVG Radial Timer */}
              <div className="col-span-4 flex items-center justify-end">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="transparent" stroke="#2d344c" strokeWidth="10" />
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

            {/* Dynamic Mood Card (Adolatli Ball va Dinamik Kayfiyat) */}
            {playerMood === 'win' && (
              <div className="p-3 bg-emerald-950/70 border-2 border-emerald-400 rounded-xl flex items-center justify-between shadow-lg animate-pulse">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🔥👑⚡️</span>
                  <div className="flex flex-col">
                    <span className="font-space text-sm font-bold text-emerald-300">
                      G'alaba Qozondingiz! +{scoreDelta} Ball
                    </span>
                    <span className="text-xs text-[#c3c6d7]">
                      Tezlik bonusi bilan to'liq hisoblandi! Davom eting!
                    </span>
                  </div>
                </div>
              </div>
            )}

            {playerMood === 'loss' && (
              <div className="p-3 bg-rose-950/70 border-2 border-rose-500 rounded-xl flex items-center justify-between shadow-lg animate-shake">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">😭🤦‍♂️💔</span>
                  <div className="flex flex-col">
                    <span className="font-space text-sm font-bold text-rose-300">
                      Afsus, Noto'g'ri Javob! {scoreDelta} Ball
                    </span>
                    <span className="text-xs text-[#c3c6d7]">
                      Xato javob uchun balldan ayirildi. Keyingi savolda diqqat qiling!
                    </span>
                  </div>
                </div>
              </div>
            )}

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
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚡️</span>
                  <div className="flex flex-col text-left">
                    <span className="font-space text-xs font-bold text-[#eec200] leading-tight">2x Ball</span>
                    <span className="text-[10px] text-[#c3c6d7] uppercase font-space">
                      {powerUp2xUsed ? 'ISHLATILDI' : '1 marta'}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-[#eec200] text-[#3c2f00] rounded font-space text-[10px] uppercase font-bold border border-black">
                  {powerUp2xUsed ? 'OK' : 'TAYYOR'}
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
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  <div className="flex flex-col text-left">
                    <span className="font-space text-xs font-bold text-[#5de6ff] leading-tight">50 / 50</span>
                    <span className="text-[10px] text-[#c3c6d7] uppercase font-space">
                      {powerUp5050Used ? "O'CHIRILDI" : "2 ta xato"}
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-[#5de6ff] text-[#00363e] rounded font-space text-[10px] uppercase font-bold border border-black">
                  {powerUp5050Used ? 'OK' : 'TAYYOR'}
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

          {/* Live Confirmation / Feedback Overlay */}
          {selectedAnswer && (
            <div className="bg-[#222941] rounded-xl p-4 flex items-center justify-between border-2 border-black shadow-[4px_4px_0px_#000000]">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-space text-xl font-bold border border-black ${
                    answerResult === 'correct' ? 'bg-[#eec200] text-[#3c2f00]' : 'bg-[#93000a] text-[#ffdad6]'
                  }`}
                >
                  {answerResult === 'correct' ? '✓' : '✕'}
                </div>
                <div className="flex flex-col">
                  <span className="font-space text-base font-bold text-[#dce1ff]">
                    {answerResult === 'correct' ? "Javobingiz To'g'ri! 🎉" : "Noto'g'ri Javob Tanlandi! 😭"}
                  </span>
                  <span
                    className={`text-xs font-space font-medium ${
                      answerResult === 'correct' ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {answerResult === 'correct' ? `+${scoreDelta} ball qo'shildi (${answerTime}s)` : `${scoreDelta} ball jarima belgilandi`}
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
        </section>
      </div>
    </div>
  );
};
