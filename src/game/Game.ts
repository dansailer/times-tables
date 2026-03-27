/**
 * Times Tables Quest - Game Controller
 * 
 * Main game state machine that controls game flow.
 */

import type {
  GameState,
  GameConfig,
  GameMode,
  Player,
  Question,
  AnswerResult,
  RoundResult,
  Operation,
  Difficulty,
  AnswerMode,
  RoundCount,
  Avatar,
} from './types';
import { AVATARS, DIFFICULTY_SETTINGS } from './types';
import { generateQuestion, generateChoices, clearQuestionHistory } from './Question';
import { Timer } from './Timer';
import { createAnswerResult, determineRoundWinner, calculateAccuracy } from './Scoring';

// Game event types
export type GameEvent = 
  | { type: 'START_SETUP'; mode: GameMode }
  | { type: 'CONFIGURE'; config: Partial<GameConfig> }
  | { type: 'START_GAME' }
  | { type: 'START_ROUND' }
  | { type: 'SHOW_QUESTION' }
  | { type: 'ANSWER'; answer: number }
  | { type: 'TIMEOUT' }
  | { type: 'NEXT_PLAYER' }
  | { type: 'END_ROUND' }
  | { type: 'END_GAME' }
  | { type: 'PLAY_AGAIN' }
  | { type: 'NEW_GAME' };

// Game state change listener
export type GameListener = (state: GameState, game: Game) => void;

/**
 * Create a default player
 */
function createPlayer(id: 1 | 2, avatar: Avatar): Player {
  return {
    id,
    avatar,
    score: 0,
    roundsWon: 0,
    streak: 0,
    correctAnswers: 0,
    totalAnswers: 0,
  };
}

/**
 * Main Game class - controls all game state and logic
 */
export class Game {
  // Current state
  private state: GameState = 'start';
  
  // Configuration
  private config: GameConfig;
  
  // Game data
  private currentRound: number = 0;
  private currentPlayerIndex: number = 0;
  private currentQuestion: Question | null = null;
  private currentChoices: number[] = [];
  private roundResults: RoundResult[] = [];
  private currentRoundAnswers: AnswerResult[] = [];
  
  // Timer
  private timer: Timer;
  
  // Listeners
  private listeners: Set<GameListener> = new Set();

  constructor() {
    // Default configuration
    this.config = {
      mode: 'multi',
      tables: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      operation: 'multiply',
      difficulty: 'easy',
      answerMode: 'choice',
      rounds: 10,
      speedWins: false, // Default: both correct = tie
      celebrations: true, // Default: show celebration effects
      players: [
        createPlayer(1, AVATARS[0]!),
        createPlayer(2, AVATARS[1]!),
      ],
    };

    // Initialize timer with default duration
    this.timer = new Timer(DIFFICULTY_SETTINGS.easy.timeLimit, {
      onTick: this.handleTimerTick.bind(this),
      onWarning: this.handleTimerWarning.bind(this),
      onComplete: this.handleTimerComplete.bind(this),
    });
  }

  // ===== Public API =====

  /**
   * Add a state change listener
   */
  addListener(listener: GameListener): void {
    this.listeners.add(listener);
  }

  /**
   * Remove a state change listener
   */
  removeListener(listener: GameListener): void {
    this.listeners.delete(listener);
  }

  /**
   * Get current game state
   */
  getState(): GameState {
    return this.state;
  }

  /**
   * Get game configuration
   */
  getConfig(): GameConfig {
    return { ...this.config };
  }

  /**
   * Get current players
   */
  getPlayers(): Player[] {
    return [...this.config.players];
  }

  /**
   * Get current player
   */
  getCurrentPlayer(): Player {
    return this.config.players[this.currentPlayerIndex]!;
  }

  /**
   * Get current round number (1-indexed)
   */
  getCurrentRound(): number {
    return this.currentRound;
  }

  /**
   * Get total rounds
   */
  getTotalRounds(): number {
    return this.config.rounds;
  }

  /**
   * Get current question
   */
  getCurrentQuestion(): Question | null {
    return this.currentQuestion;
  }

  /**
   * Get current choices (for multiple choice mode)
   */
  getCurrentChoices(): number[] {
    return [...this.currentChoices];
  }

  /**
   * Get round results
   */
  getRoundResults(): RoundResult[] {
    return [...this.roundResults];
  }

  /**
   * Get timer instance
   */
  getTimer(): Timer {
    return this.timer;
  }

  /**
   * Get time limit for current difficulty
   */
  getTimeLimit(): number {
    return DIFFICULTY_SETTINGS[this.config.difficulty].timeLimit;
  }

  /**
   * Dispatch a game event
   */
  dispatch(event: GameEvent): void {
    this.handleEvent(event);
  }

  // ===== Configuration Methods =====

  setMode(mode: GameMode): void {
    this.config.mode = mode;
    if (mode === 'single') {
      this.config.players = [this.config.players[0]!];
    } else if (this.config.players.length === 1) {
      this.config.players = [
        this.config.players[0]!,
        createPlayer(2, AVATARS[1]!),
      ];
    }
  }

  setTables(tables: number[]): void {
    this.config.tables = tables.filter(t => t >= 2 && t <= 10);
  }

  setOperation(operation: Operation): void {
    this.config.operation = operation;
  }

  setDifficulty(difficulty: Difficulty): void {
    this.config.difficulty = difficulty;
    this.timer.reset(DIFFICULTY_SETTINGS[difficulty].timeLimit);
  }

  setAnswerMode(answerMode: AnswerMode): void {
    this.config.answerMode = answerMode;
  }

  setRounds(rounds: RoundCount): void {
    this.config.rounds = rounds;
  }

  setSpeedWins(speedWins: boolean): void {
    this.config.speedWins = speedWins;
  }

  setCelebrations(celebrations: boolean): void {
    this.config.celebrations = celebrations;
  }

  setPlayerAvatar(playerId: 1 | 2, avatar: Avatar): void {
    const playerIndex = playerId - 1;
    if (this.config.players[playerIndex]) {
      this.config.players[playerIndex]!.avatar = avatar;
    }
  }

  // ===== Event Handler =====

  private handleEvent(event: GameEvent): void {
    switch (event.type) {
      case 'START_SETUP':
        this.setMode(event.mode);
        this.setState('setup');
        break;

      case 'CONFIGURE':
        if (event.config.tables) this.setTables(event.config.tables);
        if (event.config.operation) this.setOperation(event.config.operation);
        if (event.config.difficulty) this.setDifficulty(event.config.difficulty);
        if (event.config.answerMode) this.setAnswerMode(event.config.answerMode);
        if (event.config.rounds) this.setRounds(event.config.rounds);
        if (event.config.speedWins !== undefined) this.setSpeedWins(event.config.speedWins);
        if (event.config.celebrations !== undefined) this.setCelebrations(event.config.celebrations);
        break;

      case 'START_GAME':
        this.startGame();
        break;

      case 'START_ROUND':
        this.startRound();
        break;

      case 'SHOW_QUESTION':
        this.showQuestion();
        break;

      case 'ANSWER':
        this.submitAnswer(event.answer);
        break;

      case 'TIMEOUT':
        this.handleTimeout();
        break;

      case 'NEXT_PLAYER':
        this.nextPlayer();
        break;

      case 'END_ROUND':
        this.endRound();
        break;

      case 'END_GAME':
        this.setState('gameEnd');
        break;

      case 'PLAY_AGAIN':
        this.resetGame();
        this.startGame();
        break;

      case 'NEW_GAME':
        this.resetGame();
        this.setState('start');
        break;
    }
  }

  // ===== Game Flow Methods =====

  private startGame(): void {
    // Reset all player scores
    for (const player of this.config.players) {
      player.score = 0;
      player.roundsWon = 0;
      player.streak = 0;
      player.correctAnswers = 0;
      player.totalAnswers = 0;
    }

    // Reset game state
    this.currentRound = 0;
    this.roundResults = [];
    clearQuestionHistory();

    // Update timer duration
    this.timer.reset(DIFFICULTY_SETTINGS[this.config.difficulty].timeLimit);

    this.setState('playing');
    this.startRound();
  }

  private startRound(): void {
    this.currentRound++;
    this.currentPlayerIndex = 0;
    this.currentRoundAnswers = [];
    
    // Generate new question
    this.currentQuestion = generateQuestion(
      this.config.tables,
      this.config.operation
    );

    // Generate choices for multiple choice mode
    if (this.config.answerMode === 'choice') {
      this.currentChoices = generateChoices(this.currentQuestion.correctAnswer);
    } else {
      this.currentChoices = [];
    }

    this.showQuestion();
  }

  private showQuestion(): void {
    this.setState('question');
    this.timer.reset(DIFFICULTY_SETTINGS[this.config.difficulty].timeLimit);
    this.timer.start();
  }

  private submitAnswer(answer: number): void {
    this.timer.stop();
    
    const player = this.getCurrentPlayer();
    const question = this.currentQuestion!;
    const timeRemaining = this.timer.getRemaining();
    const totalTime = DIFFICULTY_SETTINGS[this.config.difficulty].timeLimit;

    // Create answer result
    const result = createAnswerResult(
      player.id,
      question,
      answer,
      timeRemaining,
      totalTime,
      this.config.difficulty,
      player.streak
    );

    // Update player stats
    player.totalAnswers++;
    if (result.isCorrect) {
      player.correctAnswers++;
      player.score += result.points;
      player.streak++;
    } else {
      player.streak = 0;
    }

    this.currentRoundAnswers.push(result);
    this.setState('feedback');

    // After feedback, either next player or end round
    // (This would be triggered by UI after showing feedback)
  }

  private handleTimeout(): void {
    const player = this.getCurrentPlayer();
    const question = this.currentQuestion!;
    const totalTime = DIFFICULTY_SETTINGS[this.config.difficulty].timeLimit;

    // Create timeout result
    const result = createAnswerResult(
      player.id,
      question,
      null,
      0,
      totalTime,
      this.config.difficulty,
      player.streak
    );

    // Update player stats
    player.totalAnswers++;
    player.streak = 0;

    this.currentRoundAnswers.push(result);
    this.setState('feedback');
  }

  private nextPlayer(): void {
    // In single player, go directly to end round
    if (this.config.mode === 'single') {
      this.endRound();
      return;
    }

    // In multi player, switch to player 2 if not done
    if (this.currentPlayerIndex === 0) {
      this.currentPlayerIndex = 1;
      
      // Generate a NEW question for player 2 (fairness - they shouldn't see player 1's answer)
      this.currentQuestion = generateQuestion(
        this.config.tables,
        this.config.operation
      );
      
      // Generate new choices for multiple choice mode
      if (this.config.answerMode === 'choice') {
        this.currentChoices = generateChoices(this.currentQuestion.correctAnswer);
      }
      
      this.showQuestion();
    } else {
      this.endRound();
    }
  }

  private endRound(): void {
    const player1Result = this.currentRoundAnswers[0]!;
    const player2Result = this.config.mode === 'multi' 
      ? this.currentRoundAnswers[1] ?? null 
      : null;

    // Determine winner (pass speedWins config)
    const winnerId = determineRoundWinner(player1Result, player2Result, this.config.speedWins);

    // Update rounds won
    if (winnerId !== null) {
      const winner = this.config.players.find(p => p.id === winnerId);
      if (winner) {
        winner.roundsWon++;
      }
    }

    // Store round result
    this.roundResults.push({
      roundNumber: this.currentRound,
      player1Result,
      player2Result,
      winnerId,
    });

    this.setState('roundEnd');

    // Check if game is over
    // (UI will trigger next round or end game)
  }

  private resetGame(): void {
    this.currentRound = 0;
    this.currentPlayerIndex = 0;
    this.currentQuestion = null;
    this.currentChoices = [];
    this.roundResults = [];
    this.currentRoundAnswers = [];
    this.timer.stop();
    clearQuestionHistory();
  }

  // ===== Timer Handlers =====

  private handleTimerTick(_remaining: number, _total: number): void {
    // UI will poll timer for updates
  }

  private handleTimerWarning(_remaining: number): void {
    // Could trigger warning sound/visual
  }

  private handleTimerComplete(): void {
    this.handleTimeout();
  }

  // ===== State Management =====

  private setState(newState: GameState): void {
    this.state = newState;
    this.notifyListeners();
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener(this.state, this);
    }
  }

  // ===== Utility Methods =====

  /**
   * Check if game is over
   */
  isGameOver(): boolean {
    return this.currentRound >= this.config.rounds;
  }

  /**
   * Get winner (for game end)
   */
  getWinner(): Player | null {
    if (this.config.mode === 'single') {
      return this.config.players[0]!;
    }

    const [p1, p2] = this.config.players;
    if (!p1 || !p2) return null;

    if (p1.roundsWon > p2.roundsWon) return p1;
    if (p2.roundsWon > p1.roundsWon) return p2;
    
    // Tie breaker: total score
    if (p1.score > p2.score) return p1;
    if (p2.score > p1.score) return p2;

    return null; // True tie
  }

  /**
   * Get player accuracy
   */
  getPlayerAccuracy(playerId: 1 | 2): number {
    const player = this.config.players.find(p => p.id === playerId);
    if (!player) return 0;
    return calculateAccuracy(player.correctAnswers, player.totalAnswers);
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.timer.destroy();
    this.listeners.clear();
  }
}
