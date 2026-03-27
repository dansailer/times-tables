/**
 * Times Tables Quest - Type Definitions
 */

// Game modes
export type GameMode = 'single' | 'multi';
export type Operation = 'multiply' | 'divide' | 'both';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type AnswerMode = 'choice' | 'input';
export type RoundCount = 5 | 10 | 15;

// Game states
export type GameState = 
  | 'start'
  | 'setup'
  | 'playing'
  | 'question'
  | 'answer'
  | 'feedback'
  | 'roundEnd'
  | 'gameEnd';

// Avatar configuration
export interface Avatar {
  id: string;
  emoji: string;
  nameKey: string; // i18n key for avatar name
}

// Player data
export interface Player {
  id: 1 | 2;
  avatar: Avatar;
  score: number;
  roundsWon: number;
  streak: number;
  correctAnswers: number;
  totalAnswers: number;
}

// Question data
export interface Question {
  id: string;
  operand1: number;
  operand2: number;
  operation: Operation;
  correctAnswer: number;
  displayText: string;
}

// Answer result
export interface AnswerResult {
  playerId: 1 | 2;
  question: Question;
  givenAnswer: number | null;
  isCorrect: boolean;
  timeRemaining: number; // milliseconds
  timeTaken: number; // milliseconds
  points: number;
  speedBonus: number;
}

// Round result
export interface RoundResult {
  roundNumber: number;
  player1Result: AnswerResult;
  player2Result: AnswerResult | null; // null for single player
  winnerId: 1 | 2 | null; // null for tie or both wrong
}

// Game configuration
export interface GameConfig {
  mode: GameMode;
  tables: number[];
  operation: Operation;
  difficulty: Difficulty;
  answerMode: AnswerMode;
  rounds: RoundCount;
  players: [Player] | [Player, Player];
  speedWins: boolean; // If true, fastest correct answer wins; if false, both correct = tie
}

// Difficulty settings
export interface DifficultySettings {
  timeLimit: number; // milliseconds
  hasSpeedBonus: boolean;
}

// Timer callback types
export interface TimerCallbacks {
  onTick?: (remaining: number, total: number) => void;
  onWarning?: (remaining: number) => void;
  onComplete?: () => void;
}

// Available avatars
export const AVATARS: Avatar[] = [
  { id: 'wizard', emoji: '🧙', nameKey: 'avatar.wizard' },
  { id: 'knight', emoji: '⚔️', nameKey: 'avatar.knight' },
  { id: 'dragon', emoji: '🐉', nameKey: 'avatar.dragon' },
  { id: 'elf', emoji: '🧝', nameKey: 'avatar.elf' },
  { id: 'archer', emoji: '🏹', nameKey: 'avatar.archer' },
  { id: 'pirate', emoji: '🏴‍☠️', nameKey: 'avatar.pirate' },
  { id: 'princess', emoji: '👸', nameKey: 'avatar.princess' },
  { id: 'fairy', emoji: '🧚', nameKey: 'avatar.fairy' },
  { id: 'mermaid', emoji: '🧜‍♀️', nameKey: 'avatar.mermaid' },
  { id: 'unicorn', emoji: '🦄', nameKey: 'avatar.unicorn' },
  { id: 'ninja', emoji: '🥷', nameKey: 'avatar.ninja' },
  { id: 'explorer', emoji: '🧭', nameKey: 'avatar.explorer' },
];

// Difficulty presets
export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: { timeLimit: 15000, hasSpeedBonus: false },
  medium: { timeLimit: 10000, hasSpeedBonus: false },
  hard: { timeLimit: 5000, hasSpeedBonus: true },
};

// Scoring constants
export const SCORING = {
  BASE_POINTS: 100,
  MAX_SPEED_BONUS_PERCENT: 50, // Up to 50% extra for fast answers
  STREAK_MULTIPLIER: 0.1, // 10% bonus per streak (max 5)
  MAX_STREAK: 5,
} as const;
