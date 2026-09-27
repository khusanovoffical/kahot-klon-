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
  currentQuestion: Question;
  onSaveQuestion: (updated: Question) => void;
  onNotify: (msg: string) => void;
  onOpenKickModal: () => void;
  onOpenGhostAdmin: () => void;
  onStartQuiz: (quizId: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  quizCatalog,
  currentQuestion,
  onSaveQuestion,
  onNotify,
  onOpenKickModal,
  onOpenGhostAdmin,
  onStartQuiz
}) => {
  // Filter tab: 'all' | 'active' | 'draft'
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'draft'>('all');

  // AI Quiz Generator states
  const [aiTopic, setAiTopic] = useState('Marvel qahramonlari va Multiverse');
  const [diffLevel, setDiffLevel] = useState<'Oson' | "O'rta" | 'Pro / Arkada'>('Pro / Arkada');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiProgress, setAiProgress] = useState(70);

  // Question Editor state
  const [questionText, setQuestionText] = useState(currentQuestion.text);
  const [mediaUrl, setMediaUrl] = useState(currentQuestion.imageUrl || 'https://assets.humoyunquiz.uz/img/js-microtask-v2.png');
  const [selectedTimer, setSelectedTimer] = useState(currentQuestion.timeLimit || 20);
  const [pointMode, setPointMode] = useState<'1000' | '2000'>('1000');
  const [optionA, setOptionA] = useState(currentQuestion.options.A);
  const [optionB, setOptionB] = useState(currentQuestion.options.B);
  const [optionC, setOptionC] = useState(currentQuestion.options.C);
  const [optionD, setOptionD] = useState(currentQuestion.options.D);
  const [correctOption, setCorrectOption] = useState<'A' | 'B' | 'C' | 'D'>(currentQuestion.correctOption);

  // Active question index in pagination
  const [activeQuestionNum, setActiveQuestionNum] = useState(4);

  // Sync state if prop changes
  React.useEffect(() => {
    setQuestionText(currentQuestion.text);
    if (currentQuestion.imageUrl) setMediaUrl(currentQuestion.imageUrl);
    setSelectedTimer(currentQuestion.timeLimit);
    setOptionA(currentQuestion.options.A);
    setOptionB(currentQuestion.options.B);
    setOptionC(currentQuestion.options.C);
    setOptionD(currentQuestion.options.D);
    setCorrectOption(currentQuestion.correctOption);
  }, [currentQuestion]);

  // Handle AI Quiz Generation
  const handleGenerateAiQuiz = () => {
    playPowerUpSound();
    setIsGeneratingAi(true);
    setAiProgress(20);

    const stepInterval = setInterval(() => {
      setAiProgress(p => {
        if (p >= 100) {
          clearInterval(stepInterval);
          setIsGeneratingAi(false);
          playCorrectSound();

          // Populate question editor with AI generated question based on topic!
          if (aiTopic.toLowerCase().includes('marvel')) {
            setQuestionText("Marvel Kinoolamida Thanos barcha 6 ta cheksizlik toshini qaysi filmda to'liq yig'adi?");
            setOptionA("Avengers: Age of Ultron");
            setOptionB("Avengers: Infinity War (2018)");
            setOptionC("Guardians of the Galaxy");
            setOptionD("Captain America: Civil War");
            setCorrectOption('B');
          } else {
            setQuestionText(`${aiTopic} bo'yicha eng muhim asosiy tushuncha yoki tamoyil nima deb ataladi?`);
            setOptionA("Sinxron bloklash modeli");
            setOptionB("Asinxron reaktiv pipeline");
            setOptionC("Statik xotira arxitekturasi");
            setOptionD("To'g'ridan-to'g'ri bog'lanish");
            setCorrectOption('B');
          }

          onNotify(`AI generatsiya muvaffaqiyatli yakunlandi! 10 ta savol to'plami tayyor ⚡`);
          return 100;
        }
        return p + 25;
      });
    }, 400);
  };

  // Handle Save Question
  const handleSaveBtn = () => {
    playCorrectSound();
    const updated: Question = {
      ...currentQuestion,
      text: questionText,
      timeLimit: selectedTimer,
      points: pointMode === '2000' ? 2000 : 1000,
      imageUrl: mediaUrl,
      options: {
        A: optionA,
        B: optionB,
        C: optionC,
        D: optionD
      },
      correctOption
    };
    onSaveQuestion(updated);
    onNotify(`Savol #${activeQuestionNum} muvaffaqiyatli saqlandi! ⚡`);
  };

  // Handle Clear Editor
  const handleClear = () => {
    playClickSound();
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    onNotify("Forma tozalandi. Yangi savol kiritishingiz mumkin");
  };

  // Handle Next Question
  const handleNextQuestionBtn = () => {
    playClickSound();
    setActiveQuestionNum(prev => (prev < 8 ? prev + 1 : 1));
    onNotify(`Savol #${activeQuestionNum < 8 ? activeQuestionNum + 1 : 1} yuklandi 🎯`);
  };

  const filteredQuizzes = quizCatalog.filter(q => {
    if (filterTab === 'active') return q.status === 'active';
    if (filterTab === 'draft') return q.status === 'draft';
    return true;
  });

  return (
    <div className="w-full flex flex-col pb-12">
      {/* Top Section: Superadmin HUD Header */}
      <section className="w-full flex flex-col gap-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 lg:p-6 bg-[#181e36] border-4 border-black shadow-[6px_6px_0px_#000000] rounded-xl">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#eec200] text-[#3c2f00] font-space text-sm font-bold uppercase rounded border-2 border-black shadow-[2px_2px_0px_#000000]">
              <span className="material-symbols-outlined text-[20px]">shield_person</span>
              <span>ROLE: SUPERADMIN</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#2d344c] text-[#5de6ff] font-space text-xs font-bold rounded border-2 border-black shadow-[2px_2px_0px_#000000]">
              <span className="material-symbols-outlined text-[18px]">key</span>
              <span>
                Master Key aktiv: <span className="tracking-widest">••••••••••84f9</span>
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-[#141a32] text-[#c3c6d7] font-space text-xs font-bold rounded border border-black">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5de6ff] animate-ping" />
              <span>SERVER LATENCY: 14ms</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onOpenKickModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#060d24] text-[#5de6ff] font-space text-xs font-bold rounded border-2 border-black shadow-[3px_3px_0px_#000000] hover:text-white hover:bg-black transition-all"
              title="Jonli Lobbini Boshqarish"
            >
              <span className="material-symbols-outlined text-[18px]">person_remove</span>
              <span className="hidden sm:inline">Lobbini Boshqarish (Kick)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                onOpenGhostAdmin();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-[#eec200] font-space text-xs font-bold rounded border-2 border-[#5de6ff] shadow-[3px_3px_0px_#000000] hover:bg-[#222941] transition-all"
              title="Ghost Admin Kiber Terminal"
            >
              <span className="material-symbols-outlined text-[18px]">terminal</span>
              <span className="hidden sm:inline">Ghost Admin</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                navigator.clipboard?.writeText('849210');
                onNotify("O'yin xonasi HOST PIN: 849-210 nusxalandi 📋");
              }}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#2563eb] text-[#eeefff] font-space text-xs sm:text-sm font-bold rounded border-2 border-black shadow-[3px_3px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">cell_tower</span>
              <span>HOST PIN: 849-210</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                onNotify('Server holati yangilandi (Sync ok) ⚡');
              }}
              className="w-9 h-9 flex items-center justify-center bg-[#222941] text-[#dce1ff] rounded border-2 border-black shadow-[2px_2px_0px_#000000] hover:text-[#5de6ff] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">sync</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <div className="p-4 bg-[#141a32] border-4 border-black shadow-[4px_4px_0px_#000000] rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-space text-xs uppercase tracking-wider text-[#c3c6d7] font-bold">
                Jami Quizlar
              </span>
              <span className="w-8 h-8 rounded bg-[#2563eb]/20 text-[#2563eb] flex items-center justify-center border-2 border-black font-bold">
                <span className="material-symbols-outlined text-[20px]">quiz</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-space text-3xl sm:text-4xl font-bold text-[#b4c5ff]">18</span>
              <span className="font-space text-xs text-[#c3c6d7]">ta to'plam</span>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[#5de6ff] font-space text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>+3 yangi bu hafta</span>
            </div>
          </div>

          {/* Stat 2 */}
          <div className="p-4 bg-[#141a32] border-4 border-black shadow-[4px_4px_0px_#000000] rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-space text-xs uppercase tracking-wider text-[#c3c6d7] font-bold">
                O'tkazilgan O'yinlar
              </span>
              <span className="w-8 h-8 rounded bg-[#5de6ff]/20 text-[#5de6ff] flex items-center justify-center border-2 border-black font-bold">
                <span className="material-symbols-outlined text-[20px]">sports_esports</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-space text-3xl sm:text-4xl font-bold text-[#5de6ff]">142</span>
              <span className="font-space text-xs text-[#c3c6d7]">ta sessiya</span>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[#b4c5ff] font-space text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>99.4% muvaffaqiyatli</span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="p-4 bg-[#141a32] border-4 border-black shadow-[4px_4px_0px_#000000] rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-space text-xs uppercase tracking-wider text-[#c3c6d7] font-bold">
                Faol O'yinchilar
              </span>
              <span className="w-8 h-8 rounded bg-[#eec200]/20 text-[#eec200] flex items-center justify-center border-2 border-black font-bold">
                <span className="material-symbols-outlined text-[20px]">group</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-space text-3xl sm:text-4xl font-bold text-[#eec200]">3,890</span>
              <span className="font-space text-xs text-[#c3c6d7]">ishtirokchi</span>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[#eec200] font-space text-xs font-bold">
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span>Eng yuqori: 512 bir vaqtda</span>
            </div>
          </div>

          {/* Stat 4 */}
          <div className="p-4 bg-[#141a32] border-4 border-black shadow-[4px_4px_0px_#000000] rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="font-space text-xs uppercase tracking-wider text-[#c3c6d7] font-bold">
                O'rtacha Reyting
              </span>
              <span className="w-8 h-8 rounded bg-[#ffe083]/20 text-[#ffe083] flex items-center justify-center border-2 border-black font-bold">
                <span className="material-symbols-outlined text-[20px]">star</span>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-space text-3xl sm:text-4xl font-bold text-[#dce1ff]">4.9</span>
              <span className="font-space text-xs text-[#eec200] font-bold">/ 5.0</span>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[#c3c6d7] font-space text-xs">
              <span className="material-symbols-outlined text-[16px]">thumb_up</span>
              <span>1,140 ta ovoz berilgan</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two Column Split Layout */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Quizlar Katalogi & CRUD (5 Spans) */}
        <div className="xl:col-span-5 flex flex-col gap-4">
          {/* Create Quiz Action Button */}
          <button
            type="button"
            onClick={() => {
              playPowerUpSound();
              onNotify('Yangi Quiz loyihasi boshlandi 🚀');
            }}
            className="w-full py-3.5 px-6 bg-[#eec200] text-[#3c2f00] font-space text-base font-bold uppercase tracking-wider rounded-xl border-4 border-black shadow-[6px_6px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 group"
          >
            <span className="material-symbols-outlined text-[26px] group-hover:rotate-90 transition-transform">
              add_circle
            </span>
            <span>YANGI QUIZ YARATISH +</span>
          </button>

          {/* Section Title & Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#5de6ff] text-[24px]">library_books</span>
              <h2 className="font-space text-lg font-bold uppercase text-[#dce1ff]">
                Mavjud Quizlar
              </h2>
            </div>

            <div className="flex items-center gap-1 bg-[#060d24] p-1 rounded-lg border-2 border-black">
              <button
                type="button"
                onClick={() => setFilterTab('all')}
                className={`px-3 py-1 font-space text-xs font-bold rounded ${
                  filterTab === 'all'
                    ? 'bg-[#2563eb] text-[#eeefff]'
                    : 'text-[#c3c6d7] hover:text-[#dce1ff]'
                }`}
              >
                Barchasi ({quizCatalog.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('active')}
                className={`px-3 py-1 font-space text-xs font-bold rounded ${
                  filterTab === 'active'
                    ? 'bg-[#2563eb] text-[#eeefff]'
                    : 'text-[#c3c6d7] hover:text-[#dce1ff]'
                }`}
              >
                Faol (14)
              </button>
              <button
                type="button"
                onClick={() => setFilterTab('draft')}
                className={`px-3 py-1 font-space text-xs font-bold rounded ${
                  filterTab === 'draft'
                    ? 'bg-[#2563eb] text-[#eeefff]'
                    : 'text-[#c3c6d7] hover:text-[#dce1ff]'
                }`}
              >
                Qoralama (4)
              </button>
            </div>
          </div>

          {/* Quiz Catalog Cards List */}
          <div className="flex flex-col gap-4">
            {filteredQuizzes.map(quiz => {
              const isDraft = quiz.status === 'draft';
              return (
                <article
                  key={quiz.id}
                  className={`p-4 bg-[#181e36] border-4 border-black shadow-[4px_4px_0px_#000000] rounded-xl flex flex-col gap-3 transition-transform hover:-translate-y-0.5 ${
                    isDraft ? 'opacity-90 border-dashed border-[#434655]' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    {/* Cover Preview */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-lg border-2 border-black overflow-hidden relative shadow-[2px_2px_0px_#000000] bg-[#222941] flex items-center justify-center">
                      {quiz.imageUrl ? (
                        <img
                          src={quiz.imageUrl}
                          alt={quiz.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="material-symbols-outlined text-[#8d90a0] text-[40px]">
                          image_not_supported
                        </span>
                      )}
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-[#060d24] text-[#5de6ff] font-space text-[10px] font-bold rounded border border-black">
                        {quiz.timePerQuestion} S
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 font-space text-[10px] uppercase rounded border border-black font-bold ${
                              isDraft
                                ? 'bg-[#434655] text-white'
                                : 'bg-[#00cbe6] text-[#00363e]'
                            }`}
                          >
                            {isDraft ? 'Qoralama' : 'Faol'}
                          </span>
                          <span className="text-xs text-[#c3c6d7] truncate">{quiz.category}</span>
                        </div>
                        <h3 className="font-space text-base font-bold text-[#dce1ff] line-clamp-2">
                          {quiz.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-[#c3c6d7]">
                        <span className="flex items-center gap-1 font-space">
                          <span className="material-symbols-outlined text-[15px]">help</span>
                          {quiz.questionCount} savol
                        </span>
                        {!isDraft && (
                          <span className="flex items-center gap-1 font-space">
                            <span className="material-symbols-outlined text-[15px]">visibility</span>
                            {quiz.timesPlayed.toLocaleString()} o'yin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t-2 border-[#2d344c]">
                    <button
                      type="button"
                      disabled={isDraft}
                      onClick={() => onStartQuiz(quiz.id)}
                      className={`col-span-2 sm:col-span-1 flex items-center justify-center gap-1 py-1.5 rounded font-space text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 ${
                        isDraft
                          ? 'bg-[#323851] text-[#8d90a0] cursor-not-allowed'
                          : 'bg-[#eec200] text-[#3c2f00] hover:bg-[#ffe083]'
                      }`}
                    >
                      <span>Boshlash 🚀</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        onNotify(`${quiz.title} tahrirlash uchun yuklandi ✏️`);
                      }}
                      className="flex items-center justify-center gap-1 py-1.5 bg-[#222941] text-[#dce1ff] hover:text-[#5de6ff] rounded font-space text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000000]"
                    >
                      <span>Tahrir ✏️</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        onNotify(`${quiz.title} nusxalandi 📋`);
                      }}
                      className="flex items-center justify-center gap-1 py-1.5 bg-[#222941] text-[#dce1ff] hover:text-[#5de6ff] rounded font-space text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000000]"
                    >
                      <span>Nusxa 📋</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playWrongSound();
                        onNotify(`${quiz.title} o'chirildi 🗑️`);
                      }}
                      className="flex items-center justify-center gap-1 py-1.5 bg-[#93000a] text-[#ffdad6] hover:bg-[#ffb4ab] hover:text-black rounded font-space text-xs font-bold border-2 border-black shadow-[2px_2px_0px_#000000]"
                    >
                      <span>O'chirish 🗑️</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Savollar Konstruktori (7 Spans) */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          {/* AI Quiz Generator NEO-AI v3 Card */}
          <div className="p-5 lg:p-6 bg-[#222941] border-4 border-black shadow-[6px_6px_0px_#000000] rounded-xl flex flex-col gap-4 relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 pb-2 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded bg-[#eec200] text-[#3c2f00] flex items-center justify-center font-bold text-lg border-2 border-black shadow-[2px_2px_0px_#000000]">
                  ⚡
                </span>
                <h3 className="font-space text-lg font-bold uppercase text-[#dce1ff] flex items-center gap-2">
                  AI Quiz Generator{' '}
                  <span className="px-2 py-0.5 bg-[#5de6ff] text-[#00363e] font-space text-xs font-bold rounded border border-black animate-pulse">
                    NEO-AI v3
                  </span>
                </h3>
              </div>
              <span className="font-space text-xs text-[#5de6ff] font-bold">
                10 soniyada 10 ta savol
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-7 flex flex-col gap-1">
                <label className="font-space text-xs font-bold uppercase tracking-wider text-[#dce1ff] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-[#eec200]">
                    auto_awesome
                  </span>
                  <span>Mavzuni kiriting:</span>
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  placeholder="Masalan: Marvel qahramonlari, Kvant fizikasi, Node.js..."
                  className="w-full p-2.5 px-3 bg-white text-black font-semibold rounded-lg border-2 border-black shadow-[3px_3px_0px_#000000] focus:outline-none focus:border-[#5de6ff] text-sm"
                />
              </div>

              <div className="md:col-span-5 flex flex-col gap-1">
                <span className="font-space text-xs font-bold uppercase tracking-wider text-[#dce1ff] flex items-center justify-between">
                  <span>Qiyinlik darajasi:</span>
                  <span className="text-[#eec200] font-bold">{diffLevel}</span>
                </span>
                <div className="grid grid-cols-3 gap-1 bg-[#060d24] p-1 rounded-lg border-2 border-black">
                  {(['Oson', "O'rta", 'Pro / Arkada'] as const).map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setDiffLevel(level);
                      }}
                      className={`py-1 text-center font-space text-xs rounded transition-all font-bold ${
                        diffLevel === level
                          ? 'bg-[#eec200] text-[#3c2f00] border border-black shadow-[2px_2px_0px_#000000]'
                          : 'text-[#c3c6d7] hover:text-[#dce1ff]'
                      }`}
                    >
                      {level === 'Pro / Arkada' ? 'Arkada ⚡' : level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
              <button
                type="button"
                disabled={isGeneratingAi}
                onClick={handleGenerateAiQuiz}
                className="w-full py-3 px-4 bg-[#eec200] hover:bg-[#ffe083] text-[#3c2f00] font-space text-sm sm:text-base font-bold uppercase tracking-wider rounded-xl border-4 border-black shadow-[4px_4px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[24px]">bolt</span>
                <span>
                  {isGeneratingAi
                    ? 'Generatsiya qilinmoqda...'
                    : '10 soniyada 10 ta savol generatsiya qilish ⚡️'}
                </span>
              </button>
            </div>

            {/* AI Status progress ribbon */}
            <div className="p-2 px-3 bg-[#060d24] border-2 border-black rounded-lg flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5de6ff] animate-ping" />
                <span className="font-space text-xs font-bold text-[#5de6ff] uppercase tracking-wider">
                  AI Status:
                </span>
                <span className="text-xs text-[#dce1ff] animate-pulse">
                  {isGeneratingAi
                    ? `Generatsiya qilinmoqda (${Math.floor(aiProgress / 10)}/10)...`
                    : '10 ta kiber-savol generatsiya qilinmoqda (7/10)...'}
                </span>
              </div>
              <span className="px-2 py-0.5 bg-[#2563eb] text-[#eeefff] font-space text-xs font-bold rounded border border-black">
                {aiProgress}% Tayyor
              </span>
            </div>
          </div>

          {/* Savollar Konstruktori Chassis Container */}
          <div className="p-5 lg:p-6 bg-[#181e36] border-4 border-black shadow-[6px_6px_0px_#000000] rounded-xl flex flex-col gap-4">
            {/* Editor Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-4 border-black">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#2563eb] text-[#eeefff] font-space text-sm font-bold rounded border-2 border-black shadow-[2px_2px_0px_#000000]">
                  SAVOL #0{activeQuestionNum}
                </span>
                <span className="text-xs text-[#c3c6d7]">/ 15 ta savol ichidan</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveQuestionNum(prev => (prev > 1 ? prev - 1 : 8));
                  }}
                  className="px-3 py-1 bg-[#222941] hover:bg-[#323851] text-[#dce1ff] rounded border-2 border-black font-space text-xs font-bold"
                >
                  ← Oldingisi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveQuestionNum(prev => (prev < 8 ? prev + 1 : 1));
                  }}
                  className="px-3 py-1 bg-[#222941] hover:bg-[#323851] text-[#dce1ff] rounded border-2 border-black font-space text-xs font-bold"
                >
                  Keyingisi →
                </button>
              </div>
            </div>

            {/* 1. Question Text Area */}
            <div className="flex flex-col gap-1">
              <label className="font-space text-xs font-bold uppercase tracking-wider text-[#dce1ff] flex items-center justify-between">
                <span>Savol Matni:</span>
                <span className="text-xs text-[#c3c6d7] font-normal">
                  Maksimal 140 belgi ({questionText.length}/140)
                </span>
              </label>
              <textarea
                value={questionText}
                onChange={e => setQuestionText(e.target.value)}
                maxLength={140}
                rows={2}
                placeholder="Savol matnini kiriting..."
                className="w-full p-3 bg-white text-black font-space text-base font-bold rounded-lg border-4 border-black shadow-[4px_4px_0px_#000000] focus:outline-none focus:shadow-[6px_6px_0px_#5de6ff] transition-all resize-none"
              />
            </div>

            {/* 2. Media URL & Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Media Uploader Input */}
              <div className="flex flex-col gap-1">
                <label className="font-space text-xs font-bold uppercase tracking-wider text-[#dce1ff] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px] text-[#5de6ff]">image</span>
                  <span>Media yuklash (Rasm/GIF URL):</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={mediaUrl}
                    onChange={e => setMediaUrl(e.target.value)}
                    placeholder="https://domain.com/photo.gif"
                    className="flex-1 p-2 px-3 bg-white text-black text-xs font-medium rounded-lg border-2 border-black shadow-[3px_3px_0px_#000000] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      onNotify('Rasm URL tekshirildi va biriktirildi');
                    }}
                    className="px-3 py-2 bg-[#2d344c] text-[#5de6ff] border-2 border-black rounded-lg shadow-[2px_2px_0px_#000000] hover:bg-[#323851]"
                  >
                    <span className="material-symbols-outlined text-[18px]">upload</span>
                  </button>
                </div>

                {/* Media thumbnail preview */}
                <div className="h-20 w-full mt-1 bg-[#060d24] rounded-lg border-2 border-black overflow-hidden flex items-center justify-between px-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[#5de6ff] text-[24px]">
                      image_search
                    </span>
                    <span className="text-xs text-[#c3c6d7] truncate max-w-[200px]">
                      js-microtask-v2.png (840 KB)
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-[#00cbe6] text-[#00515d] font-space text-[10px] font-bold rounded border border-black">
                    Tayyor
                  </span>
                </div>
              </div>

              {/* Time limit & Score Mode Controls */}
              <div className="flex flex-col justify-between gap-3 bg-[#141a32] p-3 rounded-lg border-2 border-black shadow-[3px_3px_0px_#000000]">
                {/* Vaqt limiti */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-space text-xs font-bold uppercase text-[#dce1ff] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#eec200]">
                        timer
                      </span>
                      <span>Vaqt Limiti:</span>
                    </span>
                    <span className="font-space text-sm font-bold text-[#eec200]">
                      {selectedTimer} soniya
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[10, 20, 30, 60].map(sec => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setSelectedTimer(sec);
                        }}
                        className={`py-1 font-space text-xs font-bold rounded border-2 border-black ${
                          selectedTimer === sec
                            ? 'bg-[#eec200] text-[#3c2f00] shadow-[2px_2px_0px_#000000]'
                            : 'bg-[#181e36] text-[#dce1ff] hover:bg-[#222941]'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ball Tanlovi */}
                <div>
                  <span className="font-space text-xs font-bold uppercase text-[#dce1ff] flex items-center gap-1 mb-1.5">
                    <span className="material-symbols-outlined text-[16px] text-[#5de6ff]">
                      star_half
                    </span>
                    <span>Ball qiymati:</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setPointMode('1000');
                      }}
                      className={`py-1 px-2 font-space text-xs font-bold rounded border-2 border-black ${
                        pointMode === '1000'
                          ? 'bg-[#2563eb] text-[#eeefff] shadow-[2px_2px_0px_#000000]'
                          : 'bg-[#181e36] text-[#dce1ff] hover:bg-[#222941]'
                      }`}
                    >
                      1000 Standart
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playClickSound();
                        setPointMode('2000');
                      }}
                      className={`py-1 px-2 font-space text-xs font-bold rounded border-2 border-black ${
                        pointMode === '2000'
                          ? 'bg-[#2563eb] text-[#eeefff] shadow-[2px_2px_0px_#000000]'
                          : 'bg-[#181e36] text-[#dce1ff] hover:bg-[#222941]'
                      }`}
                    >
                      2000 ×2 Double
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Quad-Action 4 Answer Variants Configuration */}
            <div className="flex flex-col gap-2 pt-1">
              <span className="font-space text-xs font-bold uppercase tracking-wider text-[#dce1ff] flex items-center justify-between">
                <span>4 ta Javob Varianti:</span>
                <span className="text-[#eec200] font-space text-xs font-bold">
                  To'g'ri javobni belgilang 🎯
                </span>
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Answer A: Red */}
                <div className="p-3 bg-[#93000a] text-[#ffdad6] rounded-xl border-4 border-black shadow-[4px_4px_0px_#000000] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded bg-black text-white flex items-center justify-center font-bold text-xs">
                        ▲
                      </span>
                      <span className="font-space text-sm font-bold uppercase tracking-wider">
                        A Variant
                      </span>
                    </div>
                    <label className="flex items-center gap-1 cursor-pointer select-none bg-black/40 px-2 py-0.5 rounded border border-black">
                      <input
                        type="radio"
                        name="correct_answer"
                        value="A"
                        checked={correctOption === 'A'}
                        onChange={() => setCorrectOption('A')}
                        className="w-4 h-4 accent-[#eec200] cursor-pointer"
                      />
                      <span className="font-space text-xs text-white">
                        {correctOption === 'A' ? "✓ To'g'ri" : "To'g'ri"}
                      </span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={optionA}
                    onChange={e => setOptionA(e.target.value)}
                    placeholder="Variant matnini kiriting..."
                    className="w-full p-2 px-3 bg-white text-black font-semibold rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] focus:outline-none text-xs sm:text-sm"
                  />
                </div>

                {/* Answer B: Blue */}
                <div className="p-3 bg-[#2563eb] text-[#eeefff] rounded-xl border-4 border-black shadow-[4px_4px_0px_#000000] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded bg-black text-white flex items-center justify-center font-bold text-xs">
                        ●
                      </span>
                      <span className="font-space text-sm font-bold uppercase tracking-wider">
                        B Variant
                      </span>
                    </div>
                    <label className="flex items-center gap-1 cursor-pointer select-none bg-black/40 px-2 py-0.5 rounded border border-black">
                      <input
                        type="radio"
                        name="correct_answer"
                        value="B"
                        checked={correctOption === 'B'}
                        onChange={() => setCorrectOption('B')}
                        className="w-4 h-4 accent-[#eec200] cursor-pointer"
                      />
                      <span className="font-space text-xs text-[#eec200] font-bold">
                        {correctOption === 'B' ? "✓ To'g'ri" : "To'g'ri"}
                      </span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={optionB}
                    onChange={e => setOptionB(e.target.value)}
                    placeholder="Variant matnini kiriting..."
                    className="w-full p-2 px-3 bg-white text-black font-semibold rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] focus:outline-none text-xs sm:text-sm"
                  />
                </div>

                {/* Answer C: Yellow */}
                <div className="p-3 bg-[#eec200] text-[#3c2f00] rounded-xl border-4 border-black shadow-[4px_4px_0px_#000000] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded bg-black text-white flex items-center justify-center font-bold text-xs">
                        ■
                      </span>
                      <span className="font-space text-sm font-bold uppercase tracking-wider">
                        C Variant
                      </span>
                    </div>
                    <label className="flex items-center gap-1 cursor-pointer select-none bg-black/40 px-2 py-0.5 rounded border border-black">
                      <input
                        type="radio"
                        name="correct_answer"
                        value="C"
                        checked={correctOption === 'C'}
                        onChange={() => setCorrectOption('C')}
                        className="w-4 h-4 accent-[#eec200] cursor-pointer"
                      />
                      <span className="font-space text-xs text-white">
                        {correctOption === 'C' ? "✓ To'g'ri" : "To'g'ri"}
                      </span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={optionC}
                    onChange={e => setOptionC(e.target.value)}
                    placeholder="Variant matnini kiriting..."
                    className="w-full p-2 px-3 bg-white text-black font-semibold rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] focus:outline-none text-xs sm:text-sm"
                  />
                </div>

                {/* Answer D: Green */}
                <div className="p-3 bg-[#00cbe6] text-[#00363e] rounded-xl border-4 border-black shadow-[4px_4px_0px_#000000] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded bg-black text-white flex items-center justify-center font-bold text-xs">
                        ◆
                      </span>
                      <span className="font-space text-sm font-bold uppercase tracking-wider">
                        D Variant
                      </span>
                    </div>
                    <label className="flex items-center gap-1 cursor-pointer select-none bg-black/40 px-2 py-0.5 rounded border border-black">
                      <input
                        type="radio"
                        name="correct_answer"
                        value="D"
                        checked={correctOption === 'D'}
                        onChange={() => setCorrectOption('D')}
                        className="w-4 h-4 accent-[#eec200] cursor-pointer"
                      />
                      <span className="font-space text-xs text-white">
                        {correctOption === 'D' ? "✓ To'g'ri" : "To'g'ri"}
                      </span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={optionD}
                    onChange={e => setOptionD(e.target.value)}
                    placeholder="Variant matnini kiriting..."
                    className="w-full p-2 px-3 bg-white text-black font-semibold rounded-lg border-2 border-black shadow-[2px_2px_0px_#000000] focus:outline-none text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 4. Anti-Cheat Security Info Banner */}
            <div className="p-3 bg-[#060d24] border-2 border-black rounded-lg flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-[#5de6ff]/10 text-[#5de6ff] flex items-center justify-center shrink-0 border border-black">
                <span className="material-symbols-outlined text-[20px]">lock</span>
              </div>
              <p className="text-xs text-[#c3c6d7] leading-snug">
                <strong className="text-[#5de6ff] font-space">🔒 Eslatma:</strong> To'g'ri javob
                faqat serverda saqlanadi va o'yinchi pultiga oldindan oshkor qilinmaydi. WebSocket
                xavfsiz shifrlangan.
              </p>
            </div>

            {/* 5. Neo-Brutalist Action Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={handleClear}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#222941] hover:bg-[#323851] text-[#dce1ff] font-space text-sm font-bold uppercase rounded-xl border-2 border-black shadow-[3px_3px_0px_#000000] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[20px]">delete_sweep</span>
                <span>Tozalash</span>
              </button>

              <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveBtn}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#2563eb] text-[#eeefff] font-space text-sm font-bold uppercase tracking-wider rounded-xl border-4 border-black shadow-[4px_4px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[20px]">save</span>
                  <span>Savolni Saqlash</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextQuestionBtn}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#00cbe6] text-[#00363e] font-space text-sm font-bold uppercase tracking-wider rounded-xl border-4 border-black shadow-[4px_4px_0px_#000000] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Keyingisiga O'tish</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Question Track Navigation Bar */}
          <div className="p-3 bg-[#141a32] border-2 border-black rounded-xl flex items-center justify-between overflow-x-auto gap-2">
            <span className="font-space text-xs uppercase font-bold text-[#c3c6d7] shrink-0">
              Savollar kartasi:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setActiveQuestionNum(num);
                  }}
                  className={`w-8 h-8 rounded-lg border-2 border-black font-space text-xs font-bold transition-transform ${
                    num === activeQuestionNum
                      ? 'bg-[#2563eb] text-[#eeefff] shadow-[2px_2px_0px_#000000] scale-110'
                      : num < activeQuestionNum
                      ? 'bg-[#00cbe6] text-[#00363e]'
                      : 'bg-[#181e36] text-[#dce1ff] hover:bg-[#222941]'
                  }`}
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onNotify("Yangi savol #9 qo'shildi!");
                }}
                className="w-8 h-8 rounded-lg border-2 border-dashed border-[#8d90a0] text-[#c3c6d7] font-space text-xs font-bold hover:border-solid hover:bg-[#222941]"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
