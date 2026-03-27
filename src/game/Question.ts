/**
 * Times Tables Quest - Question Generator
 * 
 * Generates multiplication and division questions from selected times tables.
 */

import type { Question, Operation } from './types';

// Track recent questions to avoid immediate repeats (includes rotations like 6×7 and 7×6)
let recentQuestions: Set<string> = new Set();
const MAX_RECENT = 10;

/**
 * Generate a unique question ID
 */
function generateId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a normalized question key for tracking duplicates.
 * Uses sorted operands to detect rotations (6×7 same as 7×6).
 */
function getQuestionKey(operand1: number, operand2: number, operation: 'multiply' | 'divide'): string {
  if (operation === 'multiply') {
    // For multiplication, normalize by sorting operands (6×7 = 7×6)
    const sorted = [operand1, operand2].sort((a, b) => a - b);
    return `${sorted[0]}_${sorted[1]}_multiply`;
  } else {
    // For division, order matters (dividend ÷ divisor)
    return `${operand1}_${operand2}_divide`;
  }
}

/**
 * Generate a multiplication question
 */
function generateMultiplication(tables: number[]): Question {
  // Select a random table
  const table = tables[Math.floor(Math.random() * tables.length)]!;
  
  // Select a random multiplier (2-10, avoiding 1)
  const multiplier = Math.floor(Math.random() * 9) + 2;
  
  // Randomly decide order (e.g., 3×7 or 7×3)
  const swap = Math.random() > 0.5;
  const operand1 = swap ? multiplier : table;
  const operand2 = swap ? table : multiplier;
  
  const correctAnswer = operand1 * operand2;
  
  return {
    id: generateId(),
    operand1,
    operand2,
    operation: 'multiply',
    correctAnswer,
    displayText: `${operand1} × ${operand2} = ?`,
  };
}

/**
 * Generate a division question
 */
function generateDivision(tables: number[]): Question {
  // Select a random table (this will be the divisor)
  const divisor = tables[Math.floor(Math.random() * tables.length)]!;
  
  // Select a random quotient (2-10, avoiding 1)
  const quotient = Math.floor(Math.random() * 9) + 2;
  
  // Calculate dividend (the product)
  const dividend = divisor * quotient;
  
  return {
    id: generateId(),
    operand1: dividend,
    operand2: divisor,
    operation: 'divide',
    correctAnswer: quotient,
    displayText: `${dividend} ÷ ${divisor} = ?`,
  };
}

/**
 * Generate a new question avoiding recent duplicates
 * 
 * @param tables - Array of times tables to use (e.g., [2, 3, 5])
 * @param operation - 'multiply', 'divide', or 'both'
 * @returns Generated question
 */
export function generateQuestion(tables: number[], operation: Operation): Question {
  let question: Question;
  let attempts = 0;
  const maxAttempts = 30;
  
  // Ensure we have valid tables
  const validTables = tables.filter(t => t >= 2 && t <= 11);
  if (validTables.length === 0) {
    // Fallback to all tables if none valid
    validTables.push(2, 3, 4, 5, 6, 7, 8, 9, 10, 11);
  }
  
  // If 'both' is selected, randomly pick multiply or divide for each question
  const effectiveOperation: 'multiply' | 'divide' = 
    operation === 'both' 
      ? (Math.random() > 0.5 ? 'multiply' : 'divide')
      : operation;
  
  do {
    question = effectiveOperation === 'multiply' 
      ? generateMultiplication(validTables)
      : generateDivision(validTables);
    
    const key = getQuestionKey(question.operand1, question.operand2, effectiveOperation);
    
    // Check if this question (or its rotation) was recently asked
    if (!recentQuestions.has(key) || attempts >= maxAttempts) {
      // Add to recent questions
      recentQuestions.add(key);
      
      // Trim old entries if we exceed max
      if (recentQuestions.size > MAX_RECENT) {
        const firstKey = recentQuestions.values().next().value;
        if (firstKey) recentQuestions.delete(firstKey);
      }
      break;
    }
    
    attempts++;
  } while (attempts < maxAttempts);
  
  return question;
}

/**
 * Generate plausible wrong answers for multiple choice
 * 
 * @param correctAnswer - The correct answer
 * @param count - Number of wrong answers to generate
 * @returns Array of wrong answers
 */
export function generateWrongAnswers(correctAnswer: number, count: number = 2): number[] {
  const wrongAnswers: Set<number> = new Set();
  
  // Strategy: Generate plausible wrong answers
  const strategies = [
    // Off by 1-2
    () => correctAnswer + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1),
    // Off by the table value (e.g., 42 instead of 35 for 5×7)
    () => correctAnswer + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 10 + 1),
    // Digit swap for larger numbers
    () => {
      if (correctAnswer >= 10) {
        const tens = Math.floor(correctAnswer / 10);
        const ones = correctAnswer % 10;
        return ones * 10 + tens;
      }
      return correctAnswer + Math.floor(Math.random() * 5) + 1;
    },
    // Common multiplication error (off by one operand)
    () => correctAnswer + Math.floor(Math.random() * 10) + 1,
  ];
  
  let attempts = 0;
  while (wrongAnswers.size < count && attempts < 50) {
    const strategy = strategies[Math.floor(Math.random() * strategies.length)]!;
    const wrongAnswer = strategy();
    
    // Ensure wrong answer is positive, different from correct, and not already used
    if (wrongAnswer > 0 && wrongAnswer !== correctAnswer && !wrongAnswers.has(wrongAnswer)) {
      wrongAnswers.add(wrongAnswer);
    }
    
    attempts++;
  }
  
  // Fallback: if we couldn't generate enough, add sequential numbers
  let fallback = 1;
  while (wrongAnswers.size < count) {
    const candidate = correctAnswer + fallback;
    if (candidate > 0 && candidate !== correctAnswer && !wrongAnswers.has(candidate)) {
      wrongAnswers.add(candidate);
    }
    fallback = fallback > 0 ? -fallback : -fallback + 1;
  }
  
  return Array.from(wrongAnswers);
}

/**
 * Generate multiple choice options (shuffled)
 * 
 * @param correctAnswer - The correct answer
 * @param wrongCount - Number of wrong answers (default 2 for 3 total options)
 * @returns Shuffled array of answer options
 */
export function generateChoices(correctAnswer: number, wrongCount: number = 2): number[] {
  const wrongAnswers = generateWrongAnswers(correctAnswer, wrongCount);
  const allAnswers = [correctAnswer, ...wrongAnswers];
  
  // Fisher-Yates shuffle
  for (let i = allAnswers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allAnswers[i], allAnswers[j]] = [allAnswers[j]!, allAnswers[i]!];
  }
  
  return allAnswers;
}

/**
 * Clear recent questions history (useful when starting new game)
 */
export function clearQuestionHistory(): void {
  recentQuestions = new Set();
}
