export type ScreenMode = 'oyinchi-pulti' | 'proyektor-ekran' | 'admin-boshqaruv';

export interface AnswerOption {
  id: 'A' | 'B' | 'C' | 'D';
  label: string;
  shape: 'triangle' | 'circle' | 'square' | 'diamond';
  color: string;
  votes: number;
}

export interface Question {
  id: number;
  category: string;
  points: number;
  timeLimit: number;
  text: string;
  highlightKeyword?: string;
  imageUrl?: string;
  imageAlt?: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  votes: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
}

export interface LeaderboardPlayer {
  id: string;
  name: string;
  avatar: string;
  avatarEmoji?: string;
  score: number;
  rank: number;
  streak: number;
  recentGain: number;
  isCurrentUser?: boolean;
}

export interface QuizCatalogItem {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'draft';
  questionCount: number;
  timesPlayed: number;
  timePerQuestion: number;
  imageUrl: string;
}

export interface FloatingReaction {
  id: string;
  emoji: string;
  label: string;
  x: number;
  y: number;
  color?: string;
}
