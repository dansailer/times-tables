/**
 * Times Tables Quest - Scoring System
 * 
 * Calculates points based on correctness, speed, and streaks.
 */

import type { Difficulty, AnswerResult, Question } from './types';
import { SCORING, DIFFICULTY_SETTINGS } from './types';

/**
 * Calculate speed bonus based on remaining time
 * 
 * @param timeRemaining - Remaining time in ms
 * @param totalTime - Total time allowed in ms
 * @param difficulty - Current difficulty level
 * @returns Speed bonus points (0 if not applicable)
 */
export function calculateSpeedBonus(
  timeRemaining: number,
  totalTime: number,
  difficulty: Difficulty
): number {
  // Speed bonus only applies in hard mode
  if (!DIFFICULTY_SETTINGS[difficulty].hasSpeedBonus) {
    return 0;
  }

  // Calculate percentage of time remaining
  const timePercent = timeRemaining / totalTime;

  // Speed bonus scales with remaining time (max 50% of base points)
  const bonusPercent = timePercent * (SCORING.MAX_SPEED_BONUS_PERCENT / 100);
  
  return Math.round(SCORING.BASE_POINTS * bonusPercent);
}

/**
 * Calculate streak bonus multiplier
 * 
 * @param streak - Current correct answer streak
 * @returns Bonus multiplier (1.0 = no bonus)
 */
export function calculateStreakMultiplier(streak: number): number {
  const effectiveStreak = Math.min(streak, SCORING.MAX_STREAK);
  return 1 + (effectiveStreak * SCORING.STREAK_MULTIPLIER);
}

/**
 * Calculate total points for an answer
 * 
 * @param isCorrect - Whether the answer was correct
 * @param timeRemaining - Remaining time in ms
 * @param totalTime - Total time allowed in ms
 * @param difficulty - Current difficulty level
 * @param streak - Current streak (before this answer)
 * @returns Object with base points, speed bonus, and total
 */
export function calculatePoints(
  isCorrect: boolean,
  timeRemaining: number,
  totalTime: number,
  difficulty: Difficulty,
  streak: number = 0
): { basePoints: number; speedBonus: number; streakBonus: number; total: number } {
  if (!isCorrect) {
    return { basePoints: 0, speedBonus: 0, streakBonus: 0, total: 0 };
  }

  const basePoints = SCORING.BASE_POINTS;
  const speedBonus = calculateSpeedBonus(timeRemaining, totalTime, difficulty);
  
  // Streak bonus applies to base points only
  const streakMultiplier = calculateStreakMultiplier(streak);
  const streakBonus = Math.round(basePoints * (streakMultiplier - 1));

  const total = basePoints + speedBonus + streakBonus;

  return { basePoints, speedBonus, streakBonus, total };
}

/**
 * Create an answer result object
 * 
 * @param playerId - Player ID (1 or 2)
 * @param question - The question that was answered
 * @param givenAnswer - The answer given (null if timeout)
 * @param timeRemaining - Time remaining when answered
 * @param totalTime - Total time allowed
 * @param difficulty - Current difficulty level
 * @param streak - Current streak before this answer
 * @returns Complete answer result
 */
export function createAnswerResult(
  playerId: 1 | 2,
  question: Question,
  givenAnswer: number | null,
  timeRemaining: number,
  totalTime: number,
  difficulty: Difficulty,
  streak: number = 0
): AnswerResult {
  const isCorrect = givenAnswer === question.correctAnswer;
  const timeTaken = totalTime - timeRemaining;
  
  const { speedBonus, total: points } = calculatePoints(
    isCorrect,
    timeRemaining,
    totalTime,
    difficulty,
    streak
  );

  return {
    playerId,
    question,
    givenAnswer,
    isCorrect,
    timeRemaining,
    timeTaken,
    points,
    speedBonus,
  };
}

/**
 * Determine round winner based on answer results
 * 
 * @param player1Result - Player 1's answer result
 * @param player2Result - Player 2's answer result (null for single player)
 * @returns Winner ID (1, 2, or null for tie/both wrong)
 */
export function determineRoundWinner(
  player1Result: AnswerResult,
  player2Result: AnswerResult | null
): 1 | 2 | null {
  // Single player mode - win if correct
  if (player2Result === null) {
    return player1Result.isCorrect ? 1 : null;
  }

  // Both wrong or both timeout
  if (!player1Result.isCorrect && !player2Result.isCorrect) {
    return null;
  }

  // Only player 1 correct
  if (player1Result.isCorrect && !player2Result.isCorrect) {
    return 1;
  }

  // Only player 2 correct
  if (!player1Result.isCorrect && player2Result.isCorrect) {
    return 2;
  }

  // Both correct - fastest wins
  if (player1Result.timeTaken < player2Result.timeTaken) {
    return 1;
  } else if (player2Result.timeTaken < player1Result.timeTaken) {
    return 2;
  }

  // Exact tie (very rare)
  return null;
}

/**
 * Calculate accuracy percentage
 * 
 * @param correct - Number of correct answers
 * @param total - Total number of answers
 * @returns Accuracy as percentage (0-100)
 */
export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Get encouraging message based on accuracy
 * 
 * @param accuracy - Accuracy percentage
 * @returns Translation key for message
 */
export function getEncouragingMessageKey(accuracy: number): string {
  if (accuracy === 100) {
    return 'results.perfect';
  } else if (accuracy >= 80) {
    return 'results.amazing';
  } else if (accuracy >= 60) {
    return 'results.greatJob';
  } else {
    return 'results.keepPracticing';
  }
}
