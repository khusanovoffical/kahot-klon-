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
        { emoji: '🔥', label: '+1 Sardor_Dev' },
        { emoji: '⚡️', label: 'Malika_AI' },
        { emoji: '🚀', label: 'Tezkor!' },
        { emoji: '❤️', label: 'Jasur' },
        { emoji: '👏', label: 'Bravo!' },
        { emoji: '😂', label: 'Anvar' }
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
    }, 4500);

    return () => clearInterval(reactionInterval);
  }, []);

  // Handle user reaction submission from PlayerView
  const handleSendReaction = (emoji: string, label: string) => {
    const newReaction: FloatingReaction = {
      id: `react-${Date.now()}`,
      emoji,
      label: `Player_01: ${label}`,
      x: Math.floor(Math.random() * 60) + 20,
      y: 70
    };
    setFloatingReactions(prev => [...prev.slice(-6), newReaction]);
  };

  // Next question handler
  const handleNextQuestion = () => {
    setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
  };

  // Save question from AdminView
  const handleSaveQuestion = (updated: Question) => {
    setQuestions(prev =>
      prev.map((q, idx) => (idx === currentQuestionIndex ? updated : q))
    );
  };

  // Kick player from Leaderboard
  const handleKickLeaderboardPlayer = (playerId: string, name: string) => {
    playWrongSound();
    setLeaderboard(prev => prev.filter(p => p.id !== playerId));
    showToast(`${name} lobbiyadan chiqarildi (Kick) 🚫`);
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

  return (
    <div className="bg-[#0b1229] font-['Inter',sans-serif] text-[#dce1ff] min-h-screen relative selection:bg-[#5de6ff] selection:text-[#00363e]">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-cyber-dots opacity-20" />

      {/* Top Header */}
      <Header
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        onlinePlayersCount={1280}
      />

      {/* Main Content Area */}
      <main className="relative z-10 w-full pt-24 max-w-[1280px] mx-auto px-4 lg:px-12 min-h-[calc(100vh-80px)]">
        {currentScreen === 'oyinchi-pulti' && (
          <PlayerView
            onSendReaction={handleSendReaction}
            onNotify={showToast}
            roomPin={roomPin}
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
            currentQuestion={questions[currentQuestionIndex] || questions[0]}
            onSaveQuestion={handleSaveQuestion}
            onNotify={showToast}
            onOpenKickModal={() => setIsKickModalOpen(true)}
            onOpenGhostAdmin={() => setIsGhostAdminOpen(true)}
            onStartQuiz={handleStartQuiz}
          />
        )}
      </main>

      {/* Bottom Footer */}
      <Footer />

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
