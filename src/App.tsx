/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ScreenMode, Question, FloatingReaction } from './types/quiz';
import {
  INITIAL_QUESTIONS,
  INITIAL_LEADERBOARD,
  INITIAL_QUIZ_CATALOG
} from './data/mockQuizData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PlayerView } from './components/PlayerView';
import { ProjectorView } from './components/ProjectorView';
import { AdminView } from './components/AdminView';
import { Toast } from './components/Toast';
import { LobbyKickModal } from './components/LobbyKickModal';
import { GhostAdminModal } from './components/GhostAdminModal';
import { playClickSound, playWrongSound } from './utils/sound';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('oyinchi-pulti');
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(3); // Savol 04 / 10 default
  const [leaderboard, setLeaderboard] = useState(INITIAL_LEADERBOARD);
  const [quizCatalog, setQuizCatalog] = useState(INITIAL_QUIZ_CATALOG);
  const [roomPin, setRoomPin] = useState('749 201');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin Master Password Lock state (Requirement 2)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  // Player Profile state
  const [playerNickname, setPlayerNickname] = useState('CyberSardor');
  const [playerAvatarUrl, setPlayerAvatarUrl] = useState<string>('https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&w=256&q=80');

  // Modals state
  const [isKickModalOpen, setIsKickModalOpen] = useState(false);
  const [isGhostAdminOpen, setIsGhostAdminOpen] = useState(false);

  // Floating reactions pool
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([
    { id: 'r-1', emoji: '🔥', label: '+14 Sardor_Dev', x: 12, y: 72 },
    { id: 'r-2', emoji: '⚡️', label: 'Malika_AI', x: 28, y: 64 },
    { id: 'r-3', emoji: '🚀', label: 'Super Tezkor!', x: 70, y: 78 },
    { id: 'r-4', emoji: '❤️', label: 'Jasur', x: 84, y: 55 },
    { id: 'r-5', emoji: '👏', label: 'Tomoshabin', x: 50, y: 82 }
  ]);

  // Toast notifier
  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Periodic random ambient reaction simulator to give a true lively multiplayer feel
  useEffect(() => {
    const reactionInterval = setInterval(() => {
      const presets = [
        { emoji: '🔥', label: '+1 Sardor (Iron Man)' },
        { emoji: '⚡️', label: 'Malika (Spider-Man)' },
        { emoji: '🚀', label: 'Jasur (Batman)' },
        { emoji: '❤️', label: 'Anvar (Thor)' },
        { emoji: '👏', label: 'Bravo!' },
        { emoji: '👑', label: 'Top 1 Peshqadam' }
      ];
      const randomPreset = presets[Math.floor(Math.random() * presets.length)];
      const newReaction: FloatingReaction = {
        id: `react-${Date.now()}-${Math.random()}`,
        emoji: randomPreset.emoji,
        label: randomPreset.label,
        x: Math.floor(Math.random() * 75) + 10,
        y: Math.floor(Math.random() * 30) + 55
      };

      setFloatingReactions(prev => [...prev.slice(-6), newReaction]);
    }, 5000);

    return () => clearInterval(reactionInterval);
  }, []);

  // Handle user reaction submission from PlayerView
  const handleSendReaction = (emoji: string, label: string) => {
    const newReaction: FloatingReaction = {
      id: `react-${Date.now()}`,
      emoji,
      label: `${playerNickname}: ${label}`,
      x: Math.floor(Math.random() * 60) + 20,
      y: 70
    };
    setFloatingReactions(prev => [...prev.slice(-6), newReaction]);
  };

  // Next question handler
  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
  };

  // Save specific question by index from AdminView
  const handleSaveQuestionByIndex = (index: number, updated: Question) => {
    setQuestions(prev => prev.map((q, idx) => (idx === index ? updated : q)));
    showToast(`Savol #${index + 1} muvaffaqiyatli saqlandi! 💾`);
  };

  // Add new question
  const handleAddQuestion = (newQuestion: Question) => {
    setQuestions(prev => [...prev, newQuestion]);
    setCurrentQuestionIndex(questions.length);
    showToast(`Yangi savol muvaffaqiyatli qo'shildi! (Jami: ${questions.length + 1} ta) ✨`);
  };

  // Delete question
  const handleDeleteQuestion = (index: number) => {
    if (questions.length <= 1) {
      showToast("Xatolik: kamida 1 ta savol qolishi shart! ⚠️");
      return;
    }
    setQuestions(prev => prev.filter((_, idx) => idx !== index));
    setCurrentQuestionIndex(0);
    showToast(`Savol #${index + 1} o'chirildi 🗑️`);
  };

  // Bulk update (from AI Generator)
  const handleBulkUpdateQuestions = (newQuestions: Question[]) => {
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    showToast(`${newQuestions.length} ta savol muvaffaqiyatli yuklandi! ⚡`);
  };

  // Kick player from Leaderboard / Lobby
  const handleKickLeaderboardPlayer = (playerId: string, name: string) => {
    playWrongSound();
    setLeaderboard(prev => prev.filter(p => p.id !== playerId));
    showToast(`${name} zaldan chiqarib yuborildi (KICK) 🚫`);
  };

  // Start specific quiz from catalog
  const handleStartQuiz = (quizId: string) => {
    playClickSound();
    const found = quizCatalog.find(q => q.id === quizId);
    if (found) {
      showToast(`"${found.title}" o'yini boshlandi! Proyektorga o'tilmoqda 🚀`);
      setCurrentScreen('proyektor-ekran');
    }
  };

  // Master Password Unlock (Requirement 2)
  const handleUnlockAdmin = (password: string): boolean => {
    // Secret master passwords allowed
    const validKeys = ['admin777', 'superadmin', 'admin', 'humoyun2026'];
    if (validKeys.includes(password.trim().toLowerCase())) {
      setIsAdminUnlocked(true);
      showToast("God-Mode muvaffaqiyatli faollashtirildi! Xush kelibsiz, Superadmin 🛡️");
      return true;
    }
    playWrongSound();
    showToast("Maxfiy kalit noto'g'ri! Kirish rad etildi ❌");
    return false;
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    showToast("Admin paneli qulflandi 🔒");
  };

  return (
    <div className="bg-[#0b1229] font-['Inter',sans-serif] text-[#dce1ff] min-h-screen relative selection:bg-[#5de6ff] selection:text-[#00363e]">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-cyber-dots opacity-20" />

      {/* Top Header with strict player isolation */}
      <Header
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        onlinePlayersCount={1280}
        playerNickname={playerNickname}
        playerAvatarUrl={playerAvatarUrl}
        isAdminUnlocked={isAdminUnlocked}
        onLockAdmin={handleLockAdmin}
      />

      {/* Main Content Area */}
      <main className="relative z-10 w-full pt-24 max-w-[1280px] mx-auto px-4 lg:px-12 min-h-[calc(100vh-80px)]">
        {currentScreen === 'oyinchi-pulti' && (
          <PlayerView
            onSendReaction={handleSendReaction}
            onNotify={showToast}
            roomPin={roomPin}
            activeQuestion={questions[currentQuestionIndex] || questions[0]}
            onPlayerProfileUpdate={(name, avatar) => {
              setPlayerNickname(name);
              setPlayerAvatarUrl(avatar);
            }}
          />
        )}

        {currentScreen === 'proyektor-ekran' && (
          <ProjectorView
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            onNextQuestion={handleNextQuestion}
            leaderboard={leaderboard}
            reactions={floatingReactions}
            onNotify={showToast}
            roomPin={roomPin}
            onKickPlayer={handleKickLeaderboardPlayer}
          />
        )}

        {currentScreen === 'admin-boshqaruv' && (
          <AdminView
            quizCatalog={quizCatalog}
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            onSelectQuestion={setCurrentQuestionIndex}
            onSaveQuestion={handleSaveQuestionByIndex}
            onAddQuestion={handleAddQuestion}
            onDeleteQuestion={handleDeleteQuestion}
            onBulkUpdateQuestions={handleBulkUpdateQuestions}
            onNotify={showToast}
            onOpenKickModal={() => setIsKickModalOpen(true)}
            onOpenGhostAdmin={() => setIsGhostAdminOpen(true)}
            onStartQuiz={handleStartQuiz}
            roomPin={roomPin}
            onUpdateRoomPin={setRoomPin}
            isUnlocked={isAdminUnlocked}
            onUnlock={handleUnlockAdmin}
            onLock={handleLockAdmin}
            playersCount={42}
          />
        )}
      </main>

      {/* Bottom Footer with discreet navigation */}
      <Footer
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
      />

      {/* Dynamic Toast Feedback */}
      <Toast message={toastMessage} />

      {/* Lobby Kick/Ban Modal */}
      <LobbyKickModal
        isOpen={isKickModalOpen}
        onClose={() => setIsKickModalOpen(false)}
        onNotify={showToast}
      />

      {/* Ghost Admin Cyberpunk Terminal Modal */}
      <GhostAdminModal
        isOpen={isGhostAdminOpen}
        onClose={() => setIsGhostAdminOpen(false)}
        onNotify={showToast}
      />
    </div>
  );
}
