/**
 * Times Tables Quest - Question Generator
 * 
 * Generates multiplication and division questions from selected times tables.
 */

import type { Question, Operation } from './types';

// Track recent questions to avoid immediate repeats
let recentQuestions: string[] = [];
const MAX_RECENT = 5;

/**
 * Generate a unique question ID
 */
function generateId(): string {
  return `q_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a question key for tracking duplicates
 */
function getQuestionKey(operand1: number, operand2: number, operation: Operation): string {
  return `${operand1}_${operand2}_${operation}`;
}

/**
 * Generate a multiplication question
 */
function generateMultiplication(tables: number[]): Question {
  // Select a random table
  const table = tables[Math.floor(Math.random() * tables.length)]!;
  
  // Select a random multiplier (1-10)
  const multiplier = Math.floor(Math.random() * 10) + 1;
  
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
  
  // Select a random quotient (1-10)
  const quotient = Math.floor(Math.random() * 10) + 1;
  
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
  const maxAttempts = 20;
  
  // Ensure we have valid tables
  const validTables = tables.filter(t => t >= 2 && t <= 10);
  if (validTables.length === 0) {
    // Fallback to all tables if none valid
    validTables.push(2, 3, 4, 5, 6, 7, 8, 9, 10);
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
    
    const key = getQuestionKey(question.operand1, question.operand2, question.operation);
    
    // Check if this question was recently asked
    if (!recentQuestions.includes(key) || attempts >= maxAttempts) {
      // Add to recent questions
      recentQuestions.push(key);
      if (recentQuestions.length > MAX_RECENT) {
        recentQuestions.shift();
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
  recentQuestions = [];
}
