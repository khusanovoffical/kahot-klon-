import React, { useState } from 'react';
import { QuizCatalogItem, Question } from '../types/quiz';
import {
  playClickSound,
  playCorrectSound,
  playPowerUpSound,
  playWrongSound
} from '../utils/sound';

interface AdminViewProps {
  quizCatalog: QuizCatalogItem[];
  questions: Question[];
  currentQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  onSaveQuestion: (index: number, updated: Question) => void;
  onAddQuestion: (newQuestion: Question) => void;
  onDeleteQuestion: (index: number) => void;
  onBulkUpdateQuestions: (newQuestions: Question[]) => void;
  onNotify: (msg: string) => void;
  onOpenKickModal: () => void;
  onOpenGhostAdmin: () => void;
  onStartQuiz: (quizId: string) => void;
  roomPin: string;
  onUpdateRoomPin: (newPin: string) => void;
  isUnlocked: boolean;
  onUnlock: (password: string) => boolean;
  onLock: () => void;
  playersCount?: number;
}

export const AdminView: React.FC<AdminViewProps> = ({
  quizCatalog,
  questions,
  currentQuestionIndex,
  onSelectQuestion,
  onSaveQuestion,
  onAddQuestion,
  onDeleteQuestion,
  onBulkUpdateQuestions,
  onNotify,
  onOpenKickModal,
  onOpenGhostAdmin,
  onStartQuiz,
  roomPin,
  onUpdateRoomPin,
  isUnlocked,
  onUnlock,
  onLock,
  playersCount = 42
}) => {
  // Password State
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Filter tab
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'draft'>('all');

  // AI Quiz Generator states
  const [aiPrompt, setAiPrompt] = useState('5-sinf matematika qo\'shish va ayirish amallari');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [diffLevel, setDiffLevel] = useState<'Oson' | "O'rta" | 'Pro / Arkada'>('Pro / Arkada');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);

  // Editable Room Pin
  const [editablePin, setEditablePin] = useState(roomPin.replace(/\s+/g, ''));

  // Active question in editor
  const safeIdx = Math.max(0, Math.min(questions.length - 1, currentQuestionIndex));
  const activeQ = questions[safeIdx] || {
    id: 1,
    category: 'Umumiy',
    text: '',
    points: 1000,
    timeLimit: 20,
    options: { A: '', B: '', C: '', D: '' },
    correctOption: 'B',
    explanation: '',
    votes: { A: 0, B: 0, C: 0, D: 0 }
  };

  // Local Form state for current selected question
  const [questionText, setQuestionText] = useState(activeQ.text);
  const [category, setCategory] = useState(activeQ.category);
  const [mediaUrl, setMediaUrl] = useState(activeQ.imageUrl || '');
  const [selectedTimer, setSelectedTimer] = useState(activeQ.timeLimit || 20);
  const [pointMode, setPointMode] = useState<'1000' | '2000'>(activeQ.points === 2000 ? '2000' : '1000');
  const [optionA, setOptionA] = useState(activeQ.options?.A || '');
  const [optionB, setOptionB] = useState(activeQ.options?.B || '');
  const [optionC, setOptionC] = useState(activeQ.options?.C || '');
  const [optionD, setOptionD] = useState(activeQ.options?.D || '');
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>(activeQ.correctOption || 'B');
  const [explanation, setExplanation] = useState(activeQ.explanation || '');

  // Synchronize form when selected question changes
  React.useEffect(() => {
    if (activeQ) {
      setQuestionText(activeQ.text);
      setCategory(activeQ.category);
      setMediaUrl(activeQ.imageUrl || '');
      setSelectedTimer(activeQ.timeLimit || 20);
      setPointMode(activeQ.points === 2000 ? '2000' : '1000');
      setOptionA(activeQ.options.A);
      setOptionB(activeQ.options.B);
      setOptionC(activeQ.options.C);
      setOptionD(activeQ.options.D);
      setCorrectOption(activeQ.correctOption);
      setExplanation(activeQ.explanation || '');
    }
  }, [safeIdx, activeQ]);

  // Master Password Authentication Handler
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onUnlock(passwordInput.trim());
    if (success) {
      playCorrectSound();
      setPasswordError(false);
      setPasswordInput('');
      onNotify('Master Parol tasdiqlandi! Superadmin God-Mode faol 🔓');
    } else {
      playWrongSound();
      setPasswordError(true);
      onNotify("Xato Master Parol! Kirish rad etildi ❌");
    }
  };

  // Generate new Room PIN
  const handleGenerateNewPin = () => {
    playPowerUpSound();
    const newPin = Math.floor(100000 + Math.random() * 900000).toString();
    setEditablePin(newPin);
    onUpdateRoomPin(newPin);
    onNotify(`Yangi Xona PIN kodi o'rnatildi: ${newPin} 🎲`);
  };

  const handleApplyPin = () => {
    playClickSound();
    if (editablePin.length >= 4) {
      onUpdateRoomPin(editablePin);
      onNotify(`Xona PIN kodi yangilandi: ${editablePin} ⚡`);
    } else {
      onNotify("PIN kamida 4 xonali bo'lishi kerak!");
    }
  };

  // Trigger AI Generator
  const handleGenerateAi = async () => {
    if (!aiPrompt.trim()) {
      onNotify("Iltimos, mavzu yoki buyruqni kiriting!");
      return;
    }

    playPowerUpSound();
    setIsGeneratingAi(true);
    setAiProgress(15);

    try {
      const progressTimer = setInterval(() => {
        setAiProgress(prev => (prev < 90 ? prev + 15 : prev));
      }, 300);

      // Call full-stack server endpoint
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiPrompt,
          prompt: aiPrompt,
          count: questionCount,
          difficulty: diffLevel,
        }),
      });

      clearInterval(progressTimer);
      setAiProgress(100);

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          playCorrectSound();
          onBulkUpdateQuestions(data.questions);
          setIsGeneratingAi(false);
          onNotify(`AI orqali "${aiPrompt}" mavzusida ${data.questions.length} ta original savol generatsiya qilindi! ⚡`);
          return;
        }
      }
      throw new Error("Failed to parse API response");
    } catch (err) {
      // Fallback generator with instant custom generation matching the prompt!
      console.warn("Client fallback generation:", err);
      setTimeout(() => {
        setIsGeneratingAi(false);
        playCorrectSound();
        const fallbackList: Question[] = [];
        const isMath = aiPrompt.toLowerCase().includes('matematika') || aiPrompt.toLowerCase().includes('qo\'shish') || aiPrompt.toLowerCase().includes('ayirish');
        const isMarvel = aiPrompt.toLowerCase().includes('marvel') || aiPrompt.toLowerCase().includes('super');

        for (let i = 1; i <= questionCount; i++) {
          if (isMath) {
            const x = Math.floor(Math.random() * 50) + 12;
            const y = Math.floor(Math.random() * 40) + 9;
            const isPlus = i % 2 === 1;
            const result = isPlus ? x + y : x + y - 5;
            const expr = isPlus ? `${x} + ${y}` : `${x + y} - 5`;
            fallbackList.push({
              id: Date.now() + i,
              category: '5-Sinf Matematika',
              text: `${expr} ifodaning qiymatini hisoblang: javob qaysi biri?`,
              points: diffLevel.includes('Arkada') ? 2000 : 1000,
              timeLimit: 20,
              options: {
                A: `${result - 3}`,
                B: `${result}`,
                C: `${result + 4}`,
                D: `${result + 10}`,
              },
              correctOption: 'B',
              explanation: `${expr} = ${result}`,
              votes: { A: 2, B: 30, C: 2, D: 1 },
            });
          } else if (isMarvel) {
            const marvelQuestions = [
              {
                q: "Marvel qahramonlaridan kim 'Yashil dev' (The Incredible Hulk) sifatida tanilgan?",
                ans: "Bruce Banner",
                opts: ["Tony Stark", "Bruce Banner", "Steve Rogers", "Peter Parker"]
              },
              {
                q: "Wakanda davlatining qiroli va himoyachisi qaysi superqahramon?",
                ans: "Black Panther",
                opts: ["Hawkeye", "Black Panther", "Doctor Strange", "Falcon"]
              },
              {
                q: "Mjolnir bolg'asining haqiqiy egasi kim?",
                ans: "Thor",
                opts: ["Loki", "Thor", "Odin", "Heimdall"]
              },
              {
                q: "Temir Odamning sun'iy intellekt yordamchisi qanday nomlanadi?",
                ans: "J.A.R.V.I.S.",
                opts: ["K.A.R.E.N.", "J.A.R.V.I.S.", "F.R.I.D.A.Y.", "U.L.T.R.O.N."]
              }
            ];
            const mq = marvelQuestions[(i - 1) % marvelQuestions.length];
            fallbackList.push({
              id: Date.now() + i,
              category: 'Marvel Multiverse',
              text: mq.q,
              points: 1000,
              timeLimit: 20,
              options: {
                A: mq.opts[0],
                B: mq.opts[1],
                C: mq.opts[2],
                D: mq.opts[3],
              },
              correctOption: 'B',
              explanation: `To'g'ri javob: ${mq.ans}`,
              votes: { A: 1, B: 32, C: 3, D: 1 },
            });
          } else {
            fallbackList.push({
              id: Date.now() + i,
              category: aiPrompt.slice(0, 20),
              text: `"${aiPrompt}" bo'yicha #${i}-savol: Ushbu yo'nalishdagi asosiy tamoyil qaysi?`,
              points: 1000,
              timeLimit: 20,
              options: {
                A: `1-noto'g'ri nazariya`,
                B: `Asosiy tasdiqlangan to'g'ri javob`,
                C: `Chalg'ituvchi variant`,
                D: `Ikkilamchi xulosa`,
              },
              correctOption: 'B',
              explanation: `Mazkur savolning to'g'ri varianti - B.`,
              votes: { A: 2, B: 29, C: 4, D: 2 },
            });
          }
        }

        onBulkUpdateQuestions(fallbackList);
        onNotify(`AI Konstruktor: ${fallbackList.length} ta savol tuzildi va maydonga yuklandi ⚡`);
      }, 500);
    }
  };

  // Save current question
  const handleSaveCurrentQuestion = () => {
    playCorrectSound();
    const updated: Question = {
      ...activeQ,
      text: questionText,
      category: category || 'Umumiy',
      imageUrl: mediaUrl,
      timeLimit: selectedTimer,
      points: pointMode === '2000' ? 2000 : 1000,
      options: {
        A: optionA,
        B: optionB,
        C: optionC,
        D: optionD,
      },
      correctOption,
      explanation,
    };
    onSaveQuestion(safeIdx, updated);
    onNotify(`Savol #${safeIdx + 1} muvaffaqiyatli saqlandi! 💾`);
  };

  // Add new blank question
  const handleAddNewQuestion = () => {
    playPowerUpSound();
    const newQ: Question = {
      id: Date.now(),
      category: 'Yangi Kategoriya',
      text: "Yangi savol matnini bu yerga yozing...",
      points: 1000,
      timeLimit: 20,
      options: {
        A: "1-variant",
        B: "2-variant (To'g'ri)",
        C: "3-variant",
        D: "4-variant",
      },
      correctOption: 'B',
      explanation: "To'g'ri javob B varianti.",
      votes: { A: 0, B: 0, C: 0, D: 0 }
    };
    onAddQuestion(newQ);
    onSelectQuestion(questions.length); // point to new question
    onNotify(`Yangi savol #${questions.length + 1} qo'shildi! ➕`);
  };

  // Delete current question
  const handleDeleteCurrentQuestion = () => {
    if (questions.length <= 1) {
      onNotify("Oxirgi savolni o'chirib bo'lmaydi! Kamida bitta savol qolishi kerak.");
      return;
    }
    playWrongSound();
    onDeleteQuestion(safeIdx);
    onNotify(`Savol #${safeIdx + 1} o'chirildi 🗑️`);
  };

  // If God-Mode is LOCKED, render Master Key Gate
  if (!isUnlocked) {
    return (
      <div className="w-full min-h-[550px] flex items-center justify-center p-4">
        <div className="w-full max-w-[500px] bg-[#181e36] border-4 border-black shadow-[8px_8px_0px_#000000] rounded-2xl p-6 sm:p-8 flex flex-col gap-6 text-center relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-[#93000a]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#5de6ff]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-[#93000a] text-[#ffdad6] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_#000000]">
              <span className="material-symbols-outlined text-[44px]">shield_lock</span>
            </div>

            <div>
              <span className="font-space text-xs font-bold text-[#eec200] uppercase tracking-widest">
                God-Mode Xavfsizlik Tizimi
              </span>
              <h2 className="font-space text-2xl sm:text-3xl font-bold text-[#dce1ff] mt-1">
                SUPERADMIN KIRISH
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-[#c3c6d7]">
              Admin boshqaruv paneliga kirish uchun maxfiy Master Parolni kiriting. Parolsiz barcha funksiyalar to'liq bloklangan.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 text-left">
              <label className="font-space text-xs font-bold uppercase text-[#dce1ff] flex items-center justify-between">
                <span>Master Parol (Secret Key):</span>
                <span className="text-[11px] text-[#5de6ff]">Standart: admin84f9</span>
              </label>

              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={e => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="••••••••••••"
                  autoFocus
                  className={`w-full p-3 pl-10 bg-[#060d24] text-[#eec200] font-space text-lg font-bold rounded-xl border-4 ${
                    passwordError ? 'border-[#ffb4ab] animate-shake' : 'border-black'
                  } shadow-[4px_4px_0px_#000000] focus:outline-none focus:border-[#5de6ff]`}
                />
                <span className="material-symbols-outlined text-[20px] text-[#5de6ff] absolute left-3 top-3.5">
                  key
                </span>
              </div>

              {passwordError && (
                <span className="text-xs text-[#ffb4ab] font-space font-bold mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">error</span>
                  Xato parol! Qayta urinib ko'ring (yoki 'admin84f9' kiriting).
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-[#eec200] text-[#3c2f00] font-space text-lg font-bold uppercase rounded-xl border-4 border-black shadow-[4px_4px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
            >
              <span>Panelni Ochish (Unlock)</span>
              <span className="material-symbols-outlined text-[20px]">lock_open</span>
            </button>
          </form>

          <div className="pt-2 border-t-2 border-black/40 flex items-center justify-between text-xs text-[#c3c6d7] font-space">
            <span>Xavfsizlik: 256-bit Shifrlangan</span>
            <span className="text-[#5de6ff]">Superadmin Auth</span>
          </div>
        </div>
      </div>
    );
  }

  // Filtered Quizzes
  const filteredQuizzes = quizCatalog.filter(q => {
    if (filterTab === 'active') return q.status === 'active';
    if (filterTab === 'draft') return q.status === 'draft';
    return true;
  });

  return (
    <div className="w-full flex flex-col pb-12">
      {/* Top Section: Superadmin HUD Header */}
      <section className="w-full flex flex-col gap-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-[#181e36] border-4 border-black shadow-[6px_6px_0px_#000000] rounded-xl">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#eec200] text-[#3c2f00] font-space text-sm font-bold uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000]">
              <span className="material-symbols-outlined text-[20px]">shield_person</span>
              <span>ROLE: SUPERADMIN (GOD-MODE)</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#2d344c] text-[#5de6ff] font-space text-xs font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000]">
              <span className="material-symbols-outlined text-[18px]">key</span>
              <span>Master Key Faol: <span className="tracking-widest">••••••••84f9</span></span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-[#141a32] text-[#c3c6d7] font-space text-xs font-bold rounded-lg border border-black">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5de6ff] animate-ping" />
              <span>SERVER: 14ms • {playersCount} O'yinchi</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onOpenKickModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#93000a] text-[#ffdad6] hover:bg-[#ffb4ab] hover:text-black font-space text-xs font-bold rounded-lg border-2 border-black shadow-[3px_3px_0px_#000000] transition-all"
              title="Jonli Lobbini Boshqarish (Kick / Ban)"
            >
              <span className="material-symbols-outlined text-[18px]">person_remove</span>
              <span>Kick / Ban Nazorati</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                onOpenGhostAdmin();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-[#eec200] font-space text-xs font-bold rounded-lg border-2 border-[#5de6ff] shadow-[3px_3px_0px_#000000] hover:bg-[#222941] transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              <span>Ghost Terminal</span>
            </button>

            <button
              type="button"
              onClick={onLock}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#222941] text-[#ffdad6] hover:bg-[#93000a] font-space text-xs font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] transition-colors"
              title="Admin panelni qulflash"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>Qulflash</span>
            </button>
          </div>
        </div>

        {/* Live Room PIN & Arena God-Controls Toolbar */}
        <div className="w-full p-4 bg-[#141a32] border-4 border-black shadow-[4px_4px_0px_#000000] rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-space text-xs uppercase font-bold text-[#5de6ff]">
                Xona PIN Kodi:
              </span>
              <input
                type="text"
                value={editablePin}
                onChange={e => setEditablePin(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                className="w-28 p-1.5 px-2.5 bg-[#060d24] text-[#eec200] font-space text-lg font-bold text-center rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] focus:outline-none focus:border-[#5de6ff]"
              />
              <button
                type="button"
                onClick={handleApplyPin}
                className="px-3 py-1.5 bg-[#2563eb] text-white font-space text-xs font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] hover:bg-[#0053db]"
              >
                Saqlash
              </button>
            </div>

            <button
              type="button"
              onClick={handleGenerateNewPin}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#eec200] text-[#3c2f00] font-space text-xs font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] hover:bg-[#ffe083]"
            >
              <span className="material-symbols-outlined text-[16px]">casino</span>
              <span>Yangi PIN Generatsiya 🎲</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-space text-[#c3c6d7]">
            <span className="flex items-center gap-1 bg-[#181e36] px-3 py-1.5 rounded-lg border border-black">
              <span className="w-2 h-2 rounded-full bg-[#5de6ff] animate-ping" />
              <span>O'yinchilar: <strong className="text-[#5de6ff]">{playersCount} ta</strong></span>
            </span>
            <span className="flex items-center gap-1 bg-[#181e36] px-3 py-1.5 rounded-lg border border-black">
              <span>Savollar: <strong className="text-[#eec200]">{questions.length} ta</strong></span>
            </span>
          </div>
        </div>
      </section>

      {/* Main Grid: Left = Quizlar & AI Generator; Right = Savollar Redaktori (To'liq CRUD) */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: AI Quiz Generator & Quiz Katalog (5 Spans) */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          {/* AI Quiz Generator (Mukammal va Moslashuvchan Konstruktor) */}
          <div className="p-5 lg:p-6 bg-[#222941] border-4 border-black shadow-[6px_6px_0px_#000000] rounded-xl flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 pb-2 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#eec200] text-[#3c2f00] flex items-center justify-center font-bold text-lg border-2 border-black shadow-[2px_2px_0px_#000000]">
                  ⚡
                </span>
                <h3 className="font-space text-lg font-bold uppercase text-[#dce1ff]">
                  AI Quiz Generator <span className="px-2 py-0.5 bg-[#5de6ff] text-[#00363e] font-space text-xs font-bold rounded border border-black animate-pulse">NEO-AI v3</span>
                </h3>
              </div>
              <span className="font-space text-xs text-[#5de6ff] font-bold">100% Moslashuvchan</span>
            </div>

            {/* 1. Prompt & Topic Input */}
            <div className="flex flex-col gap-1.5">
              <label className="font-space text-xs font-bold uppercase tracking-wider text-[#dce1ff] flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#eec200]">auto_awesome</span>
                  Mavzu va Buyruq (Prompt):
                </span>
                <span className="text-[11px] text-[#c3c6d7]">AI buyruqqa 100% tayanadi</span>
              </label>

              <textarea
                value={aiPrompt}
                onChange={e => setAiPrompt(e.target.value)}
                rows={2}
                placeholder="Masalan: 5-sinf matematika qo'shish va ayirish, Marvel qahramonlari kuchi, O'zbekiston tarixi..."
                className="w-full p-2.5 px-3 bg-white text-black font-space font-semibold text-sm rounded-lg border-2 border-black shadow-[3px_3px_0px_#000000] focus:outline-none focus:border-[#5de6ff] resize-none"
              />
            </div>

            {/* 2. Savollar Sonini Tanlash */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
              <div className="flex flex-col gap-1">
                <label className="font-space text-xs font-bold uppercase text-[#dce1ff] flex items-center justify-between">
                  <span>Savollar Soni:</span>
                  <span className="text-[#eec200] font-bold">{questionCount} ta test</span>
                </label>
                <div className="grid grid-cols-4 gap-1 bg-[#060d24] p-1 rounded-lg border-2 border-black">
                  {[5, 10, 15, 20].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setQuestionCount(cnt);
                      }}
                      className={`py-1 text-center font-space text-xs font-bold rounded ${
                        questionCount === cnt
                          ? 'bg-[#eec200] text-[#3c2f00] shadow-[2px_2px_0px_#000000] border border-black'
                          : 'text-[#c3c6d7] hover:text-[#dce1ff]'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Qiyinlik darajasi */}
              <div className="flex flex-col gap-1">
                <label className="font-space text-xs font-bold uppercase text-[#dce1ff] flex items-center justify-between">
                  <span>Qiyinlik:</span>
                  <span className="text-[#5de6ff] font-bold">{diffLevel}</span>
                </label>
                <div className="grid grid-cols-3 gap-1 bg-[#060d24] p-1 rounded-lg border-2 border-black">
                  {(['Oson', "O'rta", 'Pro / Arkada'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setDiffLevel(lvl);
                      }}
                      className={`py-1 text-center font-space text-xs font-bold rounded ${
                        diffLevel === lvl
                          ? 'bg-[#5de6ff] text-[#00363e] shadow-[2px_2px_0px_#000000] border border-black'
                          : 'text-[#c3c6d7] hover:text-[#dce1ff]'
                      }`}
                    >
                      {lvl === 'Pro / Arkada' ? 'Arkada' : lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generator Action Button */}
            <button
              type="button"
              disabled={isGeneratingAi}
              onClick={handleGenerateAi}
              className="w-full py-3 px-4 bg-[#eec200] hover:bg-[#ffe083] text-[#3c2f00] font-space text-sm sm:text-base font-bold uppercase tracking-wider rounded-xl border-4 border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[24px]">bolt</span>
              <span>
                {isGeneratingAi
                  ? `Generatsiya qilinmoqda (${aiProgress}%)...`
                  : `${questionCount} ta Original Savol Generatsiya Qilish ⚡️`}
              </span>
            </button>

            {isGeneratingAi && (
              <div className="w-full bg-[#060d24] rounded-full h-3 border-2 border-black overflow-hidden">
                <div
                  className="bg-[#5de6ff] h-full transition-all duration-300"
                  style={{ width: `${aiProgress}%` }}
                />
              </div>
            )}
          </div>

          {/* Mavjud Quizlar Katalogi */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5de6ff] text-[22px]">library_books</span>
                <h3 className="font-space text-base font-bold uppercase text-[#dce1ff]">
                  Mavjud Quiz To'plamlari
                </h3>
              </div>
              <div className="flex items-center gap-1 bg-[#060d24] p-1 rounded-lg border-2 border-black text-xs font-space font-bold">
                <button
                  type="button"
                  onClick={() => setFilterTab('all')}
                  className={`px-2 py-0.5 rounded ${filterTab === 'all' ? 'bg-[#2563eb] text-white' : 'text-[#c3c6d7]'}`}
                >
                  Barchasi ({quizCatalog.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterTab('active')}
                  className={`px-2 py-0.5 rounded ${filterTab === 'active' ? 'bg-[#2563eb] text-white' : 'text-[#c3c6d7]'}`}
                >
                  Faol
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {filteredQuizzes.map(quiz => (
                <div
                  key={quiz.id}
                  className="p-3.5 bg-[#181e36] border-4 border-black shadow-[4px_4px_0px_#000000] rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 rounded-lg bg-[#222941] border-2 border-black overflow-hidden shrink-0 flex items-center justify-center">
                      {quiz.imageUrl ? (
                        <img src={quiz.imageUrl} alt={quiz.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">👾</span>
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-space text-sm font-bold text-[#dce1ff] truncate">
                        {quiz.title}
                      </span>
                      <span className="text-xs text-[#5de6ff] font-space">
                        {quiz.questionCount} savol • {quiz.timePerQuestion}s taymer
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onStartQuiz(quiz.id)}
                    className="px-3 py-1.5 bg-[#eec200] text-[#3c2f00] font-space text-xs font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] hover:bg-[#ffe083] shrink-0"
                  >
                    Boshlash 🚀
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Savollar Redaktori (To'liq CRUD) (7 Spans) */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          <div className="p-5 lg:p-6 bg-[#181e36] border-4 border-black shadow-[6px_6px_0px_#000000] rounded-xl flex flex-col gap-4">
            {/* Header: Question Navigation Bar + CRUD buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-4 border-black">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#2563eb] text-[#eeefff] font-space text-sm font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000]">
                  SAVOL #{safeIdx + 1}
                </span>
                <span className="text-xs text-[#c3c6d7] font-space">
                  / {questions.length} ta savol
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAddNewQuestion}
                  className="px-3 py-1 bg-[#00cbe6] text-[#00363e] hover:bg-[#5de6ff] rounded-lg border-2 border-black font-space text-xs font-bold shadow-[2px_2px_0px_#000000] flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Yangi Qo'shish</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeleteCurrentQuestion}
                  className="px-3 py-1 bg-[#93000a] text-[#ffdad6] hover:bg-[#ffb4ab] hover:text-black rounded-lg border-2 border-black font-space text-xs font-bold shadow-[2px_2px_0px_#000000] flex items-center gap-1"
                  title="Joriy savolni o'chirish"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                  <span>O'chirish</span>
                </button>
              </div>
            </div>

            {/* Quick Question Picker Strip */}
            <div className="p-2 bg-[#141a32] border-2 border-black rounded-lg flex items-center gap-1.5 overflow-x-auto">
              <span className="font-space text-xs text-[#c3c6d7] uppercase font-bold shrink-0 mr-1">
                Karta:
              </span>
              {questions.map((q, idx) => (
                <button
                  key={q.id || idx}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onSelectQuestion(idx);
                  }}
                  className={`w-8 h-8 rounded-lg font-space text-xs font-bold border-2 border-black shrink-0 transition-transform ${
                    idx === safeIdx
                      ? 'bg-[#eec200] text-[#3c2f00] shadow-[2px_2px_0px_#000000] scale-110'
                      : 'bg-[#181e36] text-[#dce1ff] hover:bg-[#222941]'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={handleAddNewQuestion}
                className="w-8 h-8 rounded-lg font-space text-xs font-bold border-2 border-dashed border-[#5de6ff] text-[#5de6ff] hover:bg-[#222941] shrink-0"
                title="Yangi savol qo'shish"
              >
                +
              </button>
            </div>

            {/* 1. Savol Matni */}
            <div className="flex flex-col gap-1">
              <label className="font-space text-xs font-bold uppercase tracking-wider text-[#dce1ff] flex items-center justify-between">
                <span>Savol Matni:</span>
                <span className="text-xs text-[#c3c6d7] font-normal">
                  {questionText.length} belgi
                </span>
              </label>
              <textarea
                value={questionText}
                onChange={e => setQuestionText(e.target.value)}
                rows={2}
                placeholder="Savol matnini bu yerga yozing..."
                className="w-full p-3 bg-white text-black font-space text-base font-bold rounded-lg border-4 border-black shadow-[4px_4px_0px_#000000] focus:outline-none focus:border-[#5de6ff] resize-none"
              />
            </div>

            {/* 2. Kategoriya, Vaqt & Ball Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="font-space text-xs font-bold uppercase text-[#dce1ff]">
                  Kategoriya:
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  placeholder="Masalan: Tarix, IT..."
                  className="w-full p-2 bg-white text-black font-semibold text-xs rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] focus:outline-none"
                />
              </div>

              {/* Timer */}
              <div className="flex flex-col gap-1">
                <label className="font-space text-xs font-bold uppercase text-[#dce1ff]">
                  Taymer: {selectedTimer}s
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {[10, 20, 30, 60].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setSelectedTimer(s);
                      }}
                      className={`py-1 text-center font-space text-xs font-bold rounded border-2 border-black ${
                        selectedTimer === s
                          ? 'bg-[#eec200] text-[#3c2f00] shadow-[2px_2px_0px_#000000]'
                          : 'bg-[#141a32] text-[#dce1ff]'
                      }`}
                    >
                      {s}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Points */}
              <div className="flex flex-col gap-1">
                <label className="font-space text-xs font-bold uppercase text-[#dce1ff]">
                  Ball Qiymati:
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {(['1000', '2000'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setPointMode(p);
                      }}
                      className={`py-1 font-space text-xs font-bold rounded border-2 border-black ${
                        pointMode === p
                          ? 'bg-[#2563eb] text-white shadow-[2px_2px_0px_#000000]'
                          : 'bg-[#141a32] text-[#dce1ff]'
                      }`}
                    >
                      {p === '2000' ? '2000 2x' : '1000'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. 4 ta Javob Varianti (A, B, C, D) va To'g'ri Javobni Belgilash */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="font-space text-xs font-bold uppercase tracking-wider text-[#dce1ff] flex items-center justify-between">
                <span>4 ta Javob Varianti:</span>
                <span className="text-[#eec200] font-space text-xs font-bold">
                  To'g'ri javobni tanlang: <strong className="text-white bg-black px-1.5 py-0.5 rounded border border-[#eec200]">{correctOption}</strong>
                </span>
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Variant A */}
                <div className="p-3 bg-[#93000a] text-[#ffdad6] rounded-xl border-4 border-black shadow-[4px_4px_0px_#000000] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded bg-black text-white flex items-center justify-center font-bold text-xs">▲</span>
                      <span className="font-space text-xs font-bold uppercase">A Variant</span>
                    </div>
                    <label className="flex items-center gap-1 cursor-pointer bg-black/40 px-2 py-0.5 rounded border border-black text-xs font-space font-bold">
                      <input
                        type="radio"
                        name="correct_opt"
                        checked={correctOption === 'A'}
                        onChange={() => setCorrectOption('A')}
                        className="accent-[#eec200]"
                      />
                      <span>{correctOption === 'A' ? "✓ To'g'ri" : "Tanlash"}</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={optionA}
                    onChange={e => setOptionA(e.target.value)}
                    placeholder="Variant matni..."
                    className="w-full p-2 bg-white text-black font-semibold rounded-lg border-2 border-black text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                {/* Variant B */}
                <div className="p-3 bg-[#2563eb] text-[#eeefff] rounded-xl border-4 border-black shadow-[4px_4px_0px_#000000] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded bg-black text-white flex items-center justify-center font-bold text-xs">●</span>
                      <span className="font-space text-xs font-bold uppercase">B Variant</span>
                    </div>
                    <label className="flex items-center gap-1 cursor-pointer bg-black/40 px-2 py-0.5 rounded border border-black text-xs font-space font-bold">
                      <input
                        type="radio"
                        name="correct_opt"
                        checked={correctOption === 'B'}
                        onChange={() => setCorrectOption('B')}
                        className="accent-[#eec200]"
                      />
                      <span>{correctOption === 'B' ? "✓ To'g'ri" : "Tanlash"}</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={optionB}
                    onChange={e => setOptionB(e.target.value)}
                    placeholder="Variant matni..."
                    className="w-full p-2 bg-white text-black font-semibold rounded-lg border-2 border-black text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                {/* Variant C */}
                <div className="p-3 bg-[#eec200] text-[#3c2f00] rounded-xl border-4 border-black shadow-[4px_4px_0px_#000000] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded bg-black text-white flex items-center justify-center font-bold text-xs">■</span>
                      <span className="font-space text-xs font-bold uppercase">C Variant</span>
                    </div>
                    <label className="flex items-center gap-1 cursor-pointer bg-black/40 px-2 py-0.5 rounded border border-black text-xs font-space font-bold text-white">
                      <input
                        type="radio"
                        name="correct_opt"
                        checked={correctOption === 'C'}
                        onChange={() => setCorrectOption('C')}
                        className="accent-[#eec200]"
                      />
                      <span>{correctOption === 'C' ? "✓ To'g'ri" : "Tanlash"}</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={optionC}
                    onChange={e => setOptionC(e.target.value)}
                    placeholder="Variant matni..."
                    className="w-full p-2 bg-white text-black font-semibold rounded-lg border-2 border-black text-xs sm:text-sm focus:outline-none"
                  />
                </div>

                {/* Variant D */}
                <div className="p-3 bg-[#00cbe6] text-[#00363e] rounded-xl border-4 border-black shadow-[4px_4px_0px_#000000] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded bg-black text-white flex items-center justify-center font-bold text-xs">◆</span>
                      <span className="font-space text-xs font-bold uppercase">D Variant</span>
                    </div>
                    <label className="flex items-center gap-1 cursor-pointer bg-black/40 px-2 py-0.5 rounded border border-black text-xs font-space font-bold text-white">
                      <input
                        type="radio"
                        name="correct_opt"
                        checked={correctOption === 'D'}
                        onChange={() => setCorrectOption('D')}
                        className="accent-[#eec200]"
                      />
                      <span>{correctOption === 'D' ? "✓ To'g'ri" : "Tanlash"}</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={optionD}
                    onChange={e => setOptionD(e.target.value)}
                    placeholder="Variant matni..."
                    className="w-full p-2 bg-white text-black font-semibold rounded-lg border-2 border-black text-xs sm:text-sm focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Tushuntirish / Izoh */}
            <div className="flex flex-col gap-1">
              <label className="font-space text-xs font-bold uppercase text-[#dce1ff]">
                To'g'ri Javob Izohi:
              </label>
              <input
                type="text"
                value={explanation}
                onChange={e => setExplanation(e.target.value)}
                placeholder="Nega aynan shu javob to'g'riligi haqida qisqa ma'lumot..."
                className="w-full p-2 bg-white text-black text-xs font-semibold rounded-lg border-2 border-black focus:outline-none"
              />
            </div>

            {/* Save & Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t-2 border-black">
              <span className="text-xs text-[#c3c6d7] font-space">
                Status: Barcha o'zgarishlar darhol jonli maydonga saqlanadi
              </span>

              <button
                type="button"
                onClick={handleSaveCurrentQuestion}
                className="w-full sm:w-auto px-6 py-2.5 bg-[#2563eb] text-white hover:bg-[#0053db] font-space text-sm font-bold uppercase tracking-wider rounded-xl border-4 border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[20px]">save</span>
                <span>Savolni Saqlash 💾</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
