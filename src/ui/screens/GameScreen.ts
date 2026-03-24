/**
 * Times Tables Quest - Game Screen
 * 
 * Main gameplay screen showing:
 * - Round indicator
 * - Current player info
 * - Question display
 * - Timer bar
 * - Answer input (multiple choice or number pad)
 * - Feedback after answering
 */

import { Component } from '../components/Component';
import { TimerBar } from '../components/TimerBar';
import { MultipleChoice } from '../components/MultipleChoice';
import { NumberPad } from '../components/NumberPad';
import { t, type TranslationKey } from '../../i18n';
import type { Game } from '../../game/Game';
import type { Player } from '../../game/types';
import { DIFFICULTY_SETTINGS } from '../../game/types';

export interface GameScreenOptions {
  game: Game;
  onRoundEnd: () => void;
  onGameEnd: () => void;
}

type GameScreenState = 'ready' | 'question' | 'feedback' | 'transition';

export class GameScreen extends Component {
  private options: GameScreenOptions;
  private game: Game;
  
  // Child components
  private timerBar: TimerBar | null = null;
  private multipleChoice: MultipleChoice | null = null;
  private numberPad: NumberPad | null = null;
  
  // Screen state
  private screenState: GameScreenState = 'ready';
  private timerInterval: number | null = null;

  constructor(options: GameScreenOptions) {
    super('div');
    this.options = options;
    this.game = options.game;
    this.addClass('screen', 'game-screen');
    this.render();
  }

  render(): void {
    const config = this.game.getConfig();
    const currentPlayer = this.game.getCurrentPlayer();
    const currentRound = this.game.getCurrentRound();
    const totalRounds = this.game.getTotalRounds();
    const question = this.game.getCurrentQuestion();
    const timeLimit = DIFFICULTY_SETTINGS[config.difficulty].timeLimit;

    this.element.innerHTML = `
      <div class="game-screen__header">
        <div class="game-screen__round">
          ${t('game.round')} ${currentRound} ${t('game.of')} ${totalRounds}
        </div>
        ${config.mode === 'multi' ? this.renderScores() : ''}
      </div>

      <div class="game-screen__player">
        ${this.renderPlayerIndicator(currentPlayer)}
      </div>

      <div class="game-screen__question">
        ${question ? question.displayText : ''}
      </div>

      <div class="game-screen__timer" id="timer-container"></div>

      <div class="game-screen__answer" id="answer-container"></div>

      <div class="game-screen__feedback" id="feedback-container"></div>
    `;

    // Mount timer bar
    const timerContainer = this.element.querySelector('#timer-container') as HTMLElement;
    if (timerContainer) {
      this.timerBar = new TimerBar({
        duration: timeLimit,
        showText: true,
      });
      this.timerBar.mount(timerContainer);
    }

    // Mount answer component
    this.mountAnswerComponent();
    
    // Start the question
    this.startQuestion();
  }

  private renderScores(): string {
    const players = this.game.getPlayers();
    const currentPlayer = this.game.getCurrentPlayer();
    
    return `
      <div class="game-screen__scores">
        ${players.map(p => `
          <div class="score-display ${p.id === currentPlayer.id ? 'score-display--active' : ''}">
            <div class="score-display__avatar">${p.avatar.emoji}</div>
            <div class="score-display__info">
              <div class="score-display__name">${t(`avatar.${p.avatar.id}` as TranslationKey)}</div>
              <div class="score-display__score">${p.score} ${t('game.points')}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  private renderPlayerIndicator(player: Player): string {
    return `
      <div class="turn-indicator">
        <div class="avatar avatar--large">${player.avatar.emoji}</div>
        <div class="turn-indicator__text">${t('game.yourTurn')}</div>
      </div>
    `;
  }

  private mountAnswerComponent(): void {
    const container = this.element.querySelector('#answer-container') as HTMLElement;
    if (!container) return;

    const config = this.game.getConfig();
    const question = this.game.getCurrentQuestion();
    if (!question) return;

    if (config.answerMode === 'choice') {
      const choices = this.game.getCurrentChoices();
      this.multipleChoice = new MultipleChoice({
        choices,
        correctAnswer: question.correctAnswer,
        onSelect: (answer, isCorrect) => {
          this.handleAnswer(answer, isCorrect);
        },
      });
      this.multipleChoice.mount(container);
    } else {
      this.numberPad = new NumberPad({
        maxDigits: 3,
        onSubmit: (answer) => {
          const isCorrect = answer === question.correctAnswer;
          this.handleAnswer(answer, isCorrect);
        },
      });
      this.numberPad.mount(container);
    }
  }

  private startQuestion(): void {
    this.screenState = 'question';
    const timer = this.game.getTimer();
    const timeLimit = this.game.getTimeLimit();
    
    // Reset and start timer
    timer.reset(timeLimit);
    this.timerBar?.reset();
    timer.start();
    
    // Update timer bar on tick
    this.timerInterval = window.setInterval(() => {
      const remaining = timer.getRemaining();
      this.timerBar?.update(remaining);
      
      if (remaining <= 0) {
        this.handleTimeout();
      }
    }, 100);
  }

  private handleAnswer(answer: number, isCorrect: boolean): void {
    if (this.screenState !== 'question') return;
    
    this.screenState = 'feedback';
    this.stopTimer();
    
    // Submit answer to game
    this.game.dispatch({ type: 'ANSWER', answer });
    
    // Get the current question
    const question = this.game.getCurrentQuestion()!;
    
    // Show feedback
    this.showFeedback(isCorrect, question.correctAnswer, answer);
    
    // Disable answer components
    if (this.multipleChoice) {
      this.multipleChoice.showCorrectAnswer();
    }
    
    // After delay, proceed to next player or round end
    setTimeout(() => {
      this.proceedAfterFeedback();
    }, 2000);
  }

  private handleTimeout(): void {
    if (this.screenState !== 'question') return;
    
    this.screenState = 'feedback';
    this.stopTimer();
    
    // Submit timeout to game
    this.game.dispatch({ type: 'TIMEOUT' });
    
    const question = this.game.getCurrentQuestion()!;
    
    // Show feedback
    this.showFeedback(false, question.correctAnswer, null);
    
    // Show correct answer
    if (this.multipleChoice) {
      this.multipleChoice.showCorrectAnswer();
    }
    
    // After delay, proceed
    setTimeout(() => {
      this.proceedAfterFeedback();
    }, 2000);
  }

  private stopTimer(): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.game.getTimer().stop();
  }

  private showFeedback(isCorrect: boolean, correctAnswer: number, givenAnswer: number | null): void {
    const feedbackContainer = this.element.querySelector('#feedback-container') as HTMLElement;
    if (!feedbackContainer) return;

    const answerContainer = this.element.querySelector('#answer-container') as HTMLElement;
    if (answerContainer) {
      answerContainer.style.opacity = '0.5';
    }

    if (isCorrect) {
      feedbackContainer.innerHTML = `
        <div class="feedback feedback--correct">
          <div class="feedback__icon">✓</div>
          <div class="feedback__text">${t('game.correct')}</div>
        </div>
      `;
    } else {
      feedbackContainer.innerHTML = `
        <div class="feedback feedback--incorrect">
          <div class="feedback__icon">✗</div>
          <div class="feedback__text">${givenAnswer === null ? t('game.timeUp') : t('game.incorrect')}</div>
          <div class="feedback__answer">${t('game.theAnswerWas')} ${correctAnswer}</div>
        </div>
      `;
    }
  }

  private proceedAfterFeedback(): void {
    // Dispatch next player event
    this.game.dispatch({ type: 'NEXT_PLAYER' });
    
    // Check game state
    const state = this.game.getState();
    
    if (state === 'roundEnd') {
      // Check if game is over
      if (this.game.isGameOver()) {
        this.game.dispatch({ type: 'END_GAME' });
        this.options.onGameEnd();
      } else {
        // Start next round
        this.options.onRoundEnd();
      }
    } else if (state === 'question') {
      // Next player's turn (two-player mode)
      this.showTransition();
    }
  }

  private showTransition(): void {
    this.screenState = 'transition';
    const currentPlayer = this.game.getCurrentPlayer();
    
    // Clear screen and show transition
    this.element.innerHTML = `
      <div class="game-screen__transition">
        <div class="turn-indicator turn-indicator--transition">
          <div class="avatar avatar--large">${currentPlayer.avatar.emoji}</div>
          <div class="turn-indicator__text">${t('game.getReady')}</div>
        </div>
      </div>
    `;

    // After transition delay, re-render for next player
    setTimeout(() => {
      this.render();
    }, 2000);
  }

  /**
   * Start a new round (called externally)
   */
  startNewRound(): void {
    this.game.dispatch({ type: 'START_ROUND' });
    this.render();
  }

  destroy(): void {
    this.stopTimer();
    this.timerBar?.destroy();
    this.multipleChoice?.destroy();
    this.numberPad?.destroy();
    super.destroy();
  }
}
