import React, { useState, useEffect } from 'react';
import { Question, LeaderboardPlayer, FloatingReaction } from '../types/quiz';
import { QRCodeDisplay } from './QRCodeDisplay';
import {
  playClickSound,
  playTickSound,
  playCorrectSound,
  toggleBgm,
  getIsBgmPlaying
} from '../utils/sound';

interface ProjectorViewProps {
  questions: Question[];
  currentQuestionIndex: number;
  onNextQuestion: () => void;
  leaderboard: LeaderboardPlayer[];
  reactions: FloatingReaction[];
  onNotify: (msg: string) => void;
  roomPin?: string;
  onKickPlayer?: (playerId: string, name: string) => void;
}

export const ProjectorView: React.FC<ProjectorViewProps> = ({
  questions,
  currentQuestionIndex,
  onNextQuestion,
  leaderboard,
  reactions,
  onNotify,
  roomPin = '749 201',
  onKickPlayer
}) => {
  const currentQ = questions[currentQuestionIndex] || questions[0];

  // Timer state
  const [secondsLeft, setSecondsLeft] = useState(8);
  const [isPaused, setIsPaused] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(getIsBgmPlaying());
  const [submissionCount, setSubmissionCount] = useState(38);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [showCenterQrCard, setShowCenterQrCard] = useState(true);
  const totalCircumference = 301.6;

  // Countdown timer loop
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          return 20; // reset loop for preview demonstration
        }
        if (prev <= 6) {
          playTickSound(true);
        }
        // randomly increment submissions towards 42
        setSubmissionCount(sc => (sc < 42 && Math.random() > 0.4 ? sc + 1 : sc));
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Handle Music Toggle
  const handleMusicToggle = () => {
    playClickSound();
    const playing = toggleBgm();
    setIsMusicOn(playing);
    onNotify(playing ? 'Arena musiqasi yoqildi 🎶' : "Arena musiqasi to'xtatildi 🔇");
  };

  // Handle Pause Toggle
  const handlePauseToggle = () => {
    playClickSound();
    setIsPaused(prev => !prev);
    onNotify(!isPaused ? "Taymer vaqtinchalik to'xtatildi ⏸️" : 'Taymer davom ettirilmoqda ▶️');
  };

  // Handle Next Question
  const handleNextBtn = () => {
    playCorrectSound();
    setSecondsLeft(20);
    setSubmissionCount(Math.floor(Math.random() * 8) + 32);
    onNextQuestion();
    onNotify(`Keyingi savol yuklandi (${currentQuestionIndex + 2}-savol) ⏩`);
  };

  // Copy PIN
  const handleCopyPin = () => {
    playClickSound();
    navigator.clipboard?.writeText(roomPin.replace(/\s+/g, ''));
    onNotify(`Xona PIN kodi nusxalandi: ${roomPin} 📋`);
  };

  const isPanicMode = secondsLeft <= 5;
  const strokeDashoffset = totalCircumference * (1 - secondsLeft / 20);

  return (
    <div className="relative w-full flex flex-col pb-10">
      {/* Floating Reaction Sprites Layer */}
      <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
        {reactions.map(r => (
          <div
            key={r.id}
            style={{ left: `${r.x}%`, top: `${r.y}%` }}
            className="absolute px-3 py-1.5 rounded-full bg-[#181e36]/85 backdrop-blur-md border border-[#5de6ff]/50 shadow-xl shadow-[#5de6ff]/20 animate-reaction-float flex items-center gap-1.5"
          >
            <span className="text-2xl">{r.emoji}</span>
            <span className="text-xs font-space font-bold text-[#5de6ff]">{r.label}</span>
          </div>
        ))}
      </div>

      {/* Top Stage Marquee & Host Bar */}
      <div className="w-full flex flex-col xl:flex-row items-center justify-between gap-4 py-2.5 bg-[#141a32] rounded-xl px-4 border-4 border-black shadow-[6px_6px_0px_#000000] mb-6">
        {/* Left: Room PIN & Quick Join QR badge */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleCopyPin}
            className="flex items-center gap-2.5 bg-[#2d344c] px-4 py-1.5 rounded-lg border-2 border-[#5de6ff]/40 shadow-lg shadow-[#5de6ff]/10 hover:border-[#eec200] transition-colors"
            title="PIN nusxalash"
          >
            <span className="font-space text-xs font-bold text-[#5de6ff] uppercase tracking-widest">
              Xona PIN:
            </span>
            <span className="font-space text-2xl font-bold text-[#eec200] tracking-widest select-all animate-pulse">
              {roomPin}
            </span>
          </button>

          {/* Stylized QR badge */}
          <div className="relative group flex items-center gap-2 bg-[#060d24] px-3.5 py-1.5 rounded-xl border-2 border-[#5de6ff]/60 shadow-lg shadow-[#5de6ff]/20">
            <div className="relative w-9 h-9 bg-[#181e36] p-1 rounded-lg flex items-center justify-center border border-black">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#eec200]" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#eec200]" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#eec200]" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#eec200]" />

              <svg className="w-7 h-7 text-[#5de6ff]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2 2h7v7H2zm2 2v3h3V4zm5-2h2v2H9zm4 0h7v7h-7zm2 2v3h3V4zm-6 3h2v2H9zm-7 4h2v2H2zm4 0h3v2H6zm5 0h2v2h-2zm4 0h2v2h-2zm4 0h3v2h-3zM2 15h7v7H2zm2 2v3h3v-3zm6-2h2v2h-2zm3 0h3v2h-3zm4 0h2v2h-2zm-7 4h2v3H9zm4 0h4v2h-4zm5 0h2v3h-2zm-3 2h2v1h-2z" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="font-space text-xs font-bold text-[#5de6ff] leading-tight">
                  humoyunquiz.uz/join
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#eec200] animate-ping" />
              </div>
              <span className="text-[10px] text-[#eec200] font-bold leading-tight">
                📷 Kamerani qarating & tezkor kiring!
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Participant Status Badge */}
        <div className="flex items-center gap-2.5 bg-[#2d344c] px-4 py-1.5 rounded-full border-2 border-black shadow-sm">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5de6ff] opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#5de6ff]" />
          </span>
          <span className="font-space text-base font-bold text-[#dce1ff] tracking-wide">
            👥 42 <span className="text-xs text-[#c3c6d7] font-normal">o'yinchi maydonda</span>
          </span>
        </div>

        {/* Right: Stage Master Controls */}
        <div className="flex items-center gap-2">
          {!showCenterQrCard && (
            <button
              type="button"
              onClick={() => setShowCenterQrCard(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eec200] text-[#3c2f00] rounded font-space text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000000] transition-colors hover:bg-yellow-400"
              title="Katta QR-kodni ko'rsatish"
            >
              <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
              <span>QR Kodni Ko'rsatish</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleMusicToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-space text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000000] transition-colors ${
              isMusicOn
                ? 'bg-[#eec200] text-[#3c2f00]'
                : 'bg-[#181e36] text-[#dce1ff] hover:bg-[#222941]'
            }`}
            title="Musiqa sozlamasi"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isMusicOn ? 'music_note' : 'music_off'}
            </span>
            <span className="hidden sm:inline">Musiqa</span>
          </button>

          <button
            type="button"
            onClick={handlePauseToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181e36] text-[#dce1ff] hover:bg-[#222941] rounded font-space text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000000] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPaused ? 'play_arrow' : 'pause'}
            </span>
            <span className="hidden sm:inline">{isPaused ? 'Davom' : "To'xtatish"}</span>
          </button>

          <button
            type="button"
            onClick={handleNextBtn}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2563eb] text-[#eeefff] hover:bg-[#0053db] rounded font-space text-xs font-bold border-2 border-black shadow-[3px_3px_0px_#000000] hover:-translate-y-0.5 active:translate-y-0.5 transition-all"
          >
            <span>Keyingi savol</span>
            <span className="material-symbols-outlined text-[18px]">fast_forward</span>
          </button>
        </div>
      </div>

      {/* Requirement 4: Center QR Component & Direct Join & Room PIN */}
      {showCenterQrCard && (
        <div className="w-full bg-[#181e36] rounded-xl p-5 border-4 border-black shadow-[6px_6px_0px_#000000] mb-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-[#5de6ff]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#eec200]/10 rounded-full blur-2xl pointer-events-none" />

          {/* Left instructions */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 max-w-md z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#2563eb] text-[#eeefff] rounded-full text-xs font-space font-bold uppercase tracking-wider border border-black shadow-sm">
              <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
              <span>Proyektor Skanerlash Markazi</span>
            </div>
            <h2 className="font-space text-2xl sm:text-3xl font-bold text-[#dce1ff]">
              O'yinga Darhol Qo'shiling!
            </h2>
            <p className="text-sm text-[#c3c6d7]">
              Smartfoningiz kamerasini QR-kodga qarating yoki to'g'ridan-to'g'ri link orqali 6 xonali PIN kodni kiriting.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222941] hover:bg-[#2d344c] text-[#5de6ff] rounded-lg font-space text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000000] transition-transform active:translate-y-0.5"
              >
                <span className="material-symbols-outlined text-[16px]">fullscreen</span>
                <span>To'liq Ekran QR</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCenterQrCard(false)}
                className="text-xs text-[#c3c6d7] hover:text-white underline font-space py-1 px-2"
              >
                Yashirish ✕
              </button>
            </div>
          </div>

          {/* Center/Right: Big Scannable QR and Big PIN Code */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-[#0e1428] p-4 rounded-xl border-2 border-black shadow-inner z-10">
            {/* Scannable QR Code */}
            <div className="shrink-0 bg-white p-2 rounded-lg border-2 border-black shadow">
              <QRCodeDisplay roomPin={roomPin} size={140} />
            </div>

            {/* Direct Link and 6-digit BIG PIN code */}
            <div className="flex flex-col items-center sm:items-start gap-2.5">
              <div className="flex flex-col">
                <span className="text-[11px] font-space font-bold uppercase tracking-wider text-[#c3c6d7]">
                  To'g'ridan-to'g'ri havola:
                </span>
                <span className="font-mono text-sm text-[#5de6ff] font-bold select-all bg-[#181e36] px-2 py-0.5 rounded border border-black/60">
                  humoyunquiz.uz/join
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-[11px] font-space font-bold uppercase tracking-wider text-[#eec200]">
                  6 Xonali Katta O'yin PIN Kodi:
                </span>
                <button
                  type="button"
                  onClick={handleCopyPin}
                  className="font-space text-3xl sm:text-4xl font-black text-[#eec200] tracking-widest select-all bg-[#141a32] px-4 py-1.5 rounded-lg border-2 border-[#eec200] shadow-[3px_3px_0px_#000000] hover:scale-105 active:scale-95 transition-transform"
                  title="Nusxalash uchun bosing"
                >
                  {roomPin}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Index & Category Overline Bar */}
      <div className="w-full flex items-center justify-between pb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#eec200] text-[#3c2f00] font-space text-xs font-bold uppercase tracking-wider border border-black shadow-sm">
            Savol 0{currentQuestionIndex + 1} / 10
          </span>
          <span className="px-3 py-1 rounded bg-[#181e36] text-[#5de6ff] font-space text-xs font-bold uppercase border border-black">
            {currentQ.category}
          </span>
        </div>

        {/* Real-time Submissions Indicator */}
        <div className="flex items-center gap-1.5 bg-[#2d344c] px-3 py-1 rounded-lg border-2 border-black shadow-sm">
          <span className="material-symbols-outlined text-[#eec200] text-[18px]">bolt</span>
          <span className="font-space text-base font-bold text-[#dce1ff]">
            {submissionCount}
          </span>
          <span className="text-xs text-[#c3c6d7]">/ 42 javob berildi</span>
        </div>
      </div>

      {/* Primary Question Showcase & Visual Media Stage */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 my-2">
        {/* Big Headline Board */}
        <div className="lg:col-span-8 flex flex-col justify-between p-6 lg:p-8 bg-[#181e36] rounded-xl border-4 border-black shadow-[6px_6px_0px_#000000] relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#2563eb]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-2">
            <span className="font-space text-xs font-bold text-[#5de6ff] uppercase tracking-widest">
              #Nazariy_Strukturalar • {currentQ.points.toLocaleString()} Ball
            </span>
            <h1 className="font-space text-2xl sm:text-4xl font-bold text-[#dce1ff] leading-tight">
              {currentQ.text}
            </h1>
          </div>

          {/* Real-time Audio Spectrum Visualization Simulation */}
          <div className="relative z-10 mt-6 flex items-center justify-between pt-3 bg-[#141a32]/80 rounded-lg px-4 border border-black">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#5de6ff] text-[22px] animate-pulse">
                graphic_eq
              </span>
              <span className="font-space text-xs font-bold text-[#c3c6d7] tracking-wider">
                ARENA OVOZ OQIMI
              </span>
            </div>

            {/* Animated Spectrum Bars */}
            <div className="flex items-end gap-1.5 h-6">
              <span className="w-1.5 bg-[#5de6ff] rounded-t h-3 animate-pulse" />
              <span className="w-1.5 bg-[#eec200] rounded-t h-5 animate-pulse" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 bg-[#5de6ff] rounded-t h-2 animate-pulse" style={{ animationDelay: '300ms' }} />
              <span className="w-1.5 bg-[#2563eb] rounded-t h-6 animate-pulse" style={{ animationDelay: '75ms' }} />
              <span className="w-1.5 bg-[#eec200] rounded-t h-4 animate-pulse" style={{ animationDelay: '200ms' }} />
              <span className="w-1.5 bg-[#5de6ff] rounded-t h-5 animate-pulse" style={{ animationDelay: '400ms' }} />
              <span className="w-1.5 bg-[#2563eb] rounded-t h-3 animate-pulse" style={{ animationDelay: '100ms' }} />
            </div>
          </div>
        </div>

        {/* Media / Centerpiece & Timer HUD Widget */}
        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4">
          {/* High Tension Circular Countdown Timer */}
          <div
            className={`flex-1 bg-[#222941] rounded-xl p-4 flex items-center justify-around border-4 border-black shadow-[4px_4px_0px_#000000] relative overflow-hidden ${
              isPanicMode ? 'panic-pulse border-[#ffb4ab]' : ''
            }`}
          >
            {isPanicMode && (
              <div className="absolute inset-0 bg-[#93000a]/20 animate-pulse pointer-events-none rounded-xl" />
            )}

            <div className="relative flex items-center justify-center">
              {isPanicMode && (
                <div className="absolute w-24 h-24 rounded-full bg-[#ffb4ab]/20 animate-ping pointer-events-none" />
              )}
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="transparent"
                  stroke="#2d344c"
                  strokeWidth="8"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="transparent"
                  stroke={isPanicMode ? '#ffb4ab' : '#eec200'}
                  strokeWidth="8"
                  strokeDasharray={totalCircumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span
                  className={`font-space text-3xl font-bold leading-none ${
                    isPanicMode ? 'text-[#ffb4ab] animate-pulse' : 'text-[#dce1ff]'
                  }`}
                >
                  {secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}
                </span>
                <span
                  className={`font-space text-[10px] font-bold uppercase mt-1 tracking-wider ${
                    isPanicMode ? 'text-[#ffb4ab]' : 'text-[#eec200]'
                  }`}
                >
                  SONIYA
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start gap-1 z-10">
              {isPanicMode ? (
                <div className="flex items-center gap-1 bg-[#93000a] px-2 py-0.5 rounded text-[#ffdad6] text-[10px] font-space font-bold uppercase animate-pulse border border-black">
                  <span className="material-symbols-outlined text-[14px]">alarm</span>
                  SO'NGGI 5 SONIYA!
                </div>
              ) : (
                <span className="font-space text-xs text-[#c3c6d7]">Javob vaqti</span>
              )}
              <span className="font-space text-lg font-bold text-[#5de6ff]">Tezkor +25%</span>
              <span className="text-[11px] text-[#eec200] flex items-center gap-1">
                ⏱️ {isPanicMode ? 'SFX: TICKING FAST' : 'Har 1s: -50 ball'}
              </span>
            </div>
          </div>

          {/* Arcade Retro Visual Graphic */}
          <div className="flex-1 bg-[#141a32] rounded-xl p-4 flex items-center gap-4 overflow-hidden relative border-4 border-black shadow-[4px_4px_0px_#000000]">
            <div className="w-20 h-20 bg-[#2d344c] rounded-lg overflow-hidden shrink-0 flex items-center justify-center border-2 border-black">
              {currentQ.imageUrl ? (
                <img
                  src={currentQ.imageUrl}
                  alt={currentQ.imageAlt || 'Question visual preview'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl">👾</span>
              )}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-space text-xs font-bold text-[#2563eb] truncate uppercase">
                Algoritm Vizuali
              </span>
              <span className="text-xs text-[#c3c6d7] line-clamp-2 mt-0.5">
                {currentQ.explanation || 'LIFO mexanizmi: oxirgi kiritilgan element birinchi chiqariladi.'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quad-Action Neon Choice Vectors (The 4 Answer Portals) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
        {/* Option A: Red / Triangle */}
        <div className="group relative flex items-center justify-between p-5 rounded-xl bg-[#93000a] text-[#ffdad6] border-4 border-black shadow-[6px_6px_0px_#000000] transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-lg bg-[#060d24] flex items-center justify-center text-[#ffb4ab] shrink-0 border-2 border-black shadow">
              <span className="text-3xl font-bold leading-none">▲</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-space text-xs font-bold text-[#ffdad6] uppercase opacity-80">
                Variant A
              </span>
              <span className="font-space text-xl sm:text-2xl font-bold text-white truncate">
                {currentQ.options.A}
              </span>
            </div>
          </div>
          <span className="font-space text-xl font-bold px-3 py-1 rounded bg-[#060d24]/60 text-white border border-black">
            0{currentQ.votes.A}
          </span>
        </div>

        {/* Option B: Blue / Circle */}
        <div className="group relative flex items-center justify-between p-5 rounded-xl bg-[#2563eb] text-[#eeefff] border-4 border-black shadow-[6px_6px_0px_#000000] transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-lg bg-[#060d24] flex items-center justify-center text-[#5de6ff] shrink-0 border-2 border-black shadow">
              <span className="text-3xl font-bold leading-none">●</span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-space text-xs font-bold text-[#eeefff] uppercase opacity-80">
                  Variant B
                </span>
                {currentQ.correctOption === 'B' && (
                  <span className="bg-[#5de6ff] text-[#00363e] px-2 py-0.5 rounded text-[10px] font-space font-bold uppercase tracking-wider flex items-center gap-0.5 border border-black shadow-sm">
                    <span className="material-symbols-outlined text-[13px]">check</span> TO'G'RI
                  </span>
                )}
              </div>
              <span className="font-space text-xl sm:text-2xl font-bold text-white truncate">
                {currentQ.options.B}
              </span>
            </div>
          </div>
          <span className="font-space text-xl font-bold px-3 py-1 rounded bg-[#060d24]/60 text-white border border-black">
            {currentQ.votes.B}
          </span>
        </div>

        {/* Option C: Yellow / Square */}
        <div className="group relative flex items-center justify-between p-5 rounded-xl bg-[#eec200] text-[#3c2f00] border-4 border-black shadow-[6px_6px_0px_#000000] transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-lg bg-[#060d24] flex items-center justify-center text-[#eec200] shrink-0 border-2 border-black shadow">
              <span className="text-3xl font-bold leading-none">■</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-space text-xs font-bold text-[#3c2f00] uppercase opacity-80">
                Variant C
              </span>
              <span className="font-space text-xl sm:text-2xl font-bold text-black truncate">
                {currentQ.options.C}
              </span>
            </div>
          </div>
          <span className="font-space text-xl font-bold px-3 py-1 rounded bg-[#060d24]/60 text-white border border-black">
            0{currentQ.votes.C}
          </span>
        </div>

        {/* Option D: Green / Diamond */}
        <div className="group relative flex items-center justify-between p-5 rounded-xl bg-[#00cbe6] text-[#00363e] border-4 border-black shadow-[6px_6px_0px_#000000] transition-transform hover:-translate-y-1">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-14 h-14 rounded-lg bg-[#060d24] flex items-center justify-center text-[#5de6ff] shrink-0 border-2 border-black shadow">
              <span className="text-3xl font-bold leading-none">◆</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-space text-xs font-bold text-[#00363e] uppercase opacity-80">
                Variant D
              </span>
              <span className="font-space text-xl sm:text-2xl font-bold text-black truncate">
                {currentQ.options.D}
              </span>
            </div>
          </div>
          <span className="font-space text-xl font-bold px-3 py-1 rounded bg-[#060d24]/60 text-white border border-black">
            0{currentQ.votes.D}
          </span>
        </div>
      </div>

      {/* Live Mini Top-5 Auditorium Leaderboard Drawer */}
      <div className="w-full bg-[#141a32] rounded-xl p-4 mt-3 border-4 border-black shadow-[6px_6px_0px_#000000]">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#eec200] text-[24px]">leaderboard</span>
            <span className="font-space text-base sm:text-lg font-bold text-[#dce1ff]">
              JONLI YETAKCHILAR (TOP 5)
            </span>
            <span className="text-xs bg-[#181e36] px-2.5 py-0.5 rounded text-[#5de6ff] font-space font-bold border border-black">
              LIVE RADAR
            </span>
          </div>
          <span className="text-xs text-[#c3c6d7]">Reyting har soniyada hisoblanadi</span>
        </div>

        {/* Five Column Bento Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {leaderboard.map(player => (
            <div
              key={player.id}
              className={`group flex flex-col p-3 rounded-lg relative overflow-hidden border-2 border-black shadow-[3px_3px_0px_#000000] transition-all hover:border-[#ffb4ab] ${
                player.rank === 1
                  ? 'bg-[#222941] ring-2 ring-[#eec200]'
                  : player.rank === 2
                  ? 'bg-[#222941] ring-2 ring-[#5de6ff]'
                  : 'bg-[#181e36]'
              }`}
            >
              {/* Rank label */}
              <div
                className={`absolute top-0 right-0 px-2 py-0.5 rounded-bl font-space text-[10px] font-bold border-l-2 border-b-2 border-black ${
                  player.rank === 1
                    ? 'bg-[#eec200] text-[#3c2f00]'
                    : player.rank === 2
                    ? 'bg-[#2d344c] text-white'
                    : 'bg-[#00cbe6] text-[#00363e]'
                }`}
              >
                #{player.rank}
              </div>

              {/* Hover Quick Kick Action */}
              {onKickPlayer && (
                <button
                  type="button"
                  onClick={() => onKickPlayer(player.id, player.name)}
                  className="absolute top-1 right-7 opacity-0 group-hover:opacity-100 bg-[#93000a] hover:bg-[#ffb4ab] text-white hover:text-black px-1.5 py-0.5 rounded text-[9px] font-space font-bold uppercase transition-all z-20 flex items-center gap-0.5 border border-black shadow"
                  title="Lobbiyadan chiqarish (Kick)"
                >
                  <span className="material-symbols-outlined text-[10px]">block</span> Kick
                </button>
              )}

              {/* Avatar & details */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded bg-[#060d24] overflow-hidden shrink-0 border-2 border-black flex items-center justify-center text-lg">
                  {player.avatar ? (
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-space font-bold text-xs text-[#5de6ff]">
                      {player.avatarEmoji || player.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="font-space text-xs font-bold text-[#dce1ff] truncate">
                    {player.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-[#eec200] font-space font-bold">
                      🔥 {player.streak}x STREAK
                    </span>
                    <span className="text-[9px] bg-[#eec200]/20 text-[#eec200] px-1 rounded font-bold">
                      +{player.recentGain}
                    </span>
                  </div>
                </div>
              </div>

              {/* Score footer */}
              <div className="mt-auto flex items-baseline justify-between pt-1 border-t border-black/40">
                <span className="font-space text-lg font-bold text-[#dce1ff] leading-none">
                  {player.score.toLocaleString()}
                </span>
                <span className="text-xs text-[#5de6ff] font-space font-bold">
                  +{player.recentGain}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Theater QR Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#060d24]/95 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative max-w-xl w-full bg-[#181e36] rounded-2xl p-8 border-4 border-black shadow-[10px_10px_0px_#000000] flex flex-col items-center text-center">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-lg bg-[#222941] text-[#c3c6d7] hover:text-white hover:bg-[#93000a] flex items-center justify-center border-2 border-black font-bold text-lg transition-colors"
            >
              ✕
            </button>

            <span className="px-4 py-1 rounded-full bg-[#eec200] text-[#3c2f00] font-space text-xs font-bold uppercase tracking-widest border border-black mb-4">
              PROYEKTOR & AUDITORIYA REJIMI
            </span>

            <h2 className="font-space text-3xl sm:text-4xl font-black text-white mb-2">
              Kamerani Qarating & O'yinga Kiring!
            </h2>
            <p className="text-sm text-[#c3c6d7] mb-6 max-w-md">
              Katta zaldagi barcha ishtirokchilar uchun yuqori aniqlikdagi skanerlash QR-kodi
            </p>

            {/* Giant QR Canvas */}
            <div className="p-4 bg-white rounded-2xl border-4 border-black shadow-[6px_6px_0px_#000000] mb-6">
              <QRCodeDisplay roomPin={roomPin} size={280} />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <div className="flex flex-col items-center sm:items-start bg-[#0e1428] px-5 py-3 rounded-xl border-2 border-black">
                <span className="text-xs text-[#c3c6d7] font-space uppercase">To'g'ridan-to'g'ri Link:</span>
                <span className="font-space font-bold text-[#5de6ff] text-base">humoyunquiz.uz/join</span>
              </div>

              <div className="flex flex-col items-center sm:items-start bg-[#0e1428] px-5 py-3 rounded-xl border-2 border-[#eec200]">
                <span className="text-xs text-[#c3c6d7] font-space uppercase">Xona PIN Kodi:</span>
                <span className="font-space font-black text-[#eec200] text-3xl tracking-widest">{roomPin}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsQrModalOpen(false)}
              className="mt-6 px-6 py-2.5 bg-[#2563eb] text-white rounded-xl font-space font-bold border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-blue-600 transition-colors"
            >
              Savollarga Qaytish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
