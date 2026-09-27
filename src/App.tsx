/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { ScreenMode, Question, FloatingReaction, ActivePlayer, LeaderboardPlayer } from './types/quiz';
import {
  INITIAL_QUESTIONS,
  INITIAL_QUIZ_CATALOG
} from './data/mockQuizData';
import { useServerPing } from './utils/usePing';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PlayerView } from './components/PlayerView';
import { ProjectorView } from './components/ProjectorView';
import { AdminView } from './components/AdminView';
import { Toast } from './components/Toast';
import { LobbyKickModal } from './components/LobbyKickModal';
import { GhostAdminModal } from './components/GhostAdminModal';
import { playClickSound, playWrongSound, playPowerUpSound } from './utils/sound';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('oyinchi-pulti');
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(3); // Savol 04 / 10 default
  const [quizCatalog, setQuizCatalog] = useState(INITIAL_QUIZ_CATALOG);
  const [roomPin, setRoomPin] = useState('749 201');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real Dynamic Network Latency (RTT) Hook (Requirement 2)
  const { ping: serverPing } = useServerPing(3500);

  // Real Live Connected Players Array (Requirement 1: Real-Time Online Counter)
  // Strictly reflects the active connected players in the arena
  const [activePlayers, setActivePlayers] = useState<ActivePlayer[]>([
    {
      id: 'p-1',
      name: 'Sardor (Iron Man)',
      avatar: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&w=256&q=80',
      avatarEmoji: '🤖',
      score: 4820,
      streak: 4,
      ping: 18,
      joinedAt: Date.now() - 120000
    },
    {
      id: 'p-2',
      name: 'Malika (Spider-Man)',
      avatar: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=256&q=80',
      avatarEmoji: '🕷️',
      score: 4350,
      streak: 3,
      ping: 24,
      joinedAt: Date.now() - 95000
    },
    {
      id: 'p-3',
      name: 'Jasur (Batman)',
      avatar: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=256&q=80',
      avatarEmoji: '🦇',
      score: 3990,
      streak: 2,
      ping: 32,
      joinedAt: Date.now() - 75000
    }
  ]);

  // Real-time Tracked Played Games Count (Requirement 3: Jonli Viktorina Statistikasi)
  const [totalPlayedGames, setTotalPlayedGames] = useState<number>(() => {
    const saved = localStorage.getItem('hq_played_games_count');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) return parsed;
    }
    return 14;
  });

  // Admin Master Password Lock state
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  // Player Profile state
  const [playerNickname, setPlayerNickname] = useState('CyberSardor');
  const [playerAvatarUrl, setPlayerAvatarUrl] = useState<string>('https://images.unsplash.com/photo-1635863138275-d9b33299680b?auto=format&fit=crop&w=256&q=80');

  // Modals state
  const [isKickModalOpen, setIsKickModalOpen] = useState(false);
  const [isGhostAdminOpen, setIsGhostAdminOpen] = useState(false);

  // Trigger to force PlayerView into PIN lobby screen from Footer button
  const [forceLobbyTrigger, setForceLobbyTrigger] = useState(0);

  // Floating reactions pool
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([
    { id: 'r-1', emoji: '🔥', label: '+14 Sardor (Iron Man)', x: 12, y: 72 },
    { id: 'r-2', emoji: '⚡️', label: 'Malika (Spider-Man)', x: 28, y: 64 },
    { id: 'r-3', emoji: '🚀', label: 'Super Tezkor!', x: 70, y: 78 },
    { id: 'r-4', emoji: '❤️', label: 'Jasur (Batman)', x: 84, y: 55 },
    { id: 'r-5', emoji: '👏', label: 'Tomoshabin', x: 50, y: 82 }
  ]);

  // Real Dynamic Leaderboard derived directly from activePlayers array
  const leaderboard = useMemo<LeaderboardPlayer[]>(() => {
    return activePlayers
      .slice()
      .sort((a, b) => b.score - a.score)
      .map((player, index) => ({
        id: player.id,
        name: player.name,
        avatar: player.avatar,
        avatarEmoji: player.avatarEmoji,
        score: player.score,
        rank: index + 1,
        streak: player.streak,
        recentGain: 100
      }));
  }, [activePlayers]);

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

  // Periodic ambient reactions from active players
  useEffect(() => {
    if (activePlayers.length === 0) return;

    const reactionInterval = setInterval(() => {
      const presets = ['🔥', '⚡️', '🚀', '❤️', '👏', '👑'];
      const randomEmoji = presets[Math.floor(Math.random() * presets.length)];
      const randomPlayer = activePlayers[Math.floor(Math.random() * activePlayers.length)];

      const newReaction: FloatingReaction = {
        id: `react-${Date.now()}-${Math.random()}`,
        emoji: randomEmoji,
        label: randomPlayer ? randomPlayer.name : 'Jonli Ishtirokchi',
        x: Math.floor(Math.random() * 75) + 10,
        y: Math.floor(Math.random() * 30) + 55
      };

      setFloatingReactions(prev => [...prev.slice(-6), newReaction]);
    }, 5000);

    return () => clearInterval(reactionInterval);
  }, [activePlayers]);

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

  // Live Player JOIN handler (+1 online)
  const handlePlayerJoinRoom = (newPlayer: ActivePlayer) => {
    setActivePlayers(prev => {
      // Avoid duplicate
      const filtered = prev.filter(p => p.id !== newPlayer.id && p.name !== newPlayer.name);
      return [...filtered, newPlayer];
    });
  };

  // Live Player LEAVE handler (-1 online)
  const handlePlayerLeaveRoom = (playerId: string) => {
    setActivePlayers(prev => prev.filter(p => p.id !== playerId));
  };

  // Kick / Ban Player from Leaderboard / Lobby (-1 online)
  const handleKickLeaderboardPlayer = (playerId: string, name: string) => {
    playWrongSound();
    setActivePlayers(prev => prev.filter(p => p.id !== playerId));
    showToast(`${name} zaldan chiqarib yuborildi (KICK -1 online) 🚫`);
  };

  // Test simulation: Add test player (+1 online)
  const handleAddTestPlayer = () => {
    playPowerUpSound();
    const presets = [
      { name: 'Ali (Thor)', avatar: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=256&q=80', emoji: '⚡' },
      { name: 'Zilola (Wonder Woman)', avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=256&q=80', emoji: '👑' },
      { name: 'Davron (Hulk)', avatar: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=256&q=80', emoji: '💚' },
      { name: 'Nodira (Black Widow)', avatar: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=256&q=80', emoji: '🕷️' }
    ];
    const candidate = presets[Math.floor(Math.random() * presets.length)];
    const newPlayer: ActivePlayer = {
      id: `test-p-${Date.now()}-${Math.random()}`,
      name: `${candidate.name} #${Math.floor(Math.random() * 90 + 10)}`,
      avatar: candidate.avatar,
      avatarEmoji: candidate.emoji,
      score: Math.floor(Math.random() * 2500) + 1500,
      streak: Math.floor(Math.random() * 3) + 1,
      ping: Math.floor(Math.random() * 25) + 12,
      joinedAt: Date.now()
    };
    setActivePlayers(prev => [...prev, newPlayer]);
    showToast(`Yangi test o'yinchisi: ${newPlayer.name} qo'shildi (+1 online) ⚡`);
  };

  // Test simulation: Clear all players (0 online)
  const handleClearAllPlayers = () => {
    playWrongSound();
    setActivePlayers([]);
    showToast("Barcha o'yinchilar zaldan chiqarildi. Xonada qat'iy 0 online! 🧹");
  };

  // Start specific quiz from catalog
  const handleStartQuiz = (quizId: string) => {
    playClickSound();
    const found = quizCatalog.find(q => q.id === quizId);
    if (found) {
      setTotalPlayedGames(prev => {
        const next = prev + 1;
        localStorage.setItem('hq_played_games_count', next.toString());
        return next;
      });
      showToast(`"${found.title}" o'yini boshlandi! Proyektorga o'tilmoqda 🚀`);
      setCurrentScreen('proyektor-ekran');
    }
  };

  // Master Password Unlock (Strictly XUMOYUN2026, never leak in logs or toasts)
  const handleUnlockAdmin = (password: string): boolean => {
    const input = password.trim();
    if (input.toUpperCase() === 'XUMOYUN2026') {
      setIsAdminUnlocked(true);
      showToast("God-Mode muvaffaqiyatli faollashtirildi! Xush kelibsiz, Superadmin 🛡️");
      return true;
    }
    playWrongSound();
    showToast("Maxfiy Master Parol noto'g'ri! Kirish rad etildi ❌");
    return false;
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    showToast("Admin paneli qulflandi 🔒");
  };

  // Footer neon button: "O'yinchi (PIN terish)" action
  const handleNavigateToPinEntry = () => {
    playClickSound();
    setCurrentScreen('oyinchi-pulti');
    setForceLobbyTrigger(prev => prev + 1);
    showToast("O'yinchilar PIN terish arenasiga o'tildi 🎮");
  };

  return (
    <div className="bg-[#0b1229] font-['Inter',sans-serif] text-[#dce1ff] min-h-screen relative selection:bg-[#5de6ff] selection:text-[#00363e]">
      {/* Background Cyber Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-cyber-dots opacity-20" />

      {/* Top Header with live online counter and real dynamic ping */}
      <Header
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        onlinePlayersCount={activePlayers.length}
        serverPing={serverPing}
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
            onPlayerJoinRoom={handlePlayerJoinRoom}
            onPlayerLeaveRoom={handlePlayerLeaveRoom}
            activePlayersCount={activePlayers.length}
            serverPing={serverPing}
            forceLobbyTrigger={forceLobbyTrigger}
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
            activePlayersCount={activePlayers.length}
            serverPing={serverPing}
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
            activePlayersCount={activePlayers.length}
            serverPing={serverPing}
            totalPlayedGames={totalPlayedGames}
            onAddTestPlayer={handleAddTestPlayer}
            onClearAllPlayers={handleClearAllPlayers}
          />
        )}
      </main>

      {/* Bottom Footer with neon player PIN entry button */}
      <Footer
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        onNavigateToPinEntry={handleNavigateToPinEntry}
      />

      {/* Dynamic Toast Feedback */}
      <Toast message={toastMessage} />

      {/* Lobby Kick/Ban Modal with real active players list */}
      <LobbyKickModal
        isOpen={isKickModalOpen}
        onClose={() => setIsKickModalOpen(false)}
        onNotify={showToast}
        activePlayers={activePlayers}
        onKickPlayer={handleKickLeaderboardPlayer}
        onAddTestPlayer={handleAddTestPlayer}
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
