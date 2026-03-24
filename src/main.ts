/**
 * Times Tables Quest
 * Main entry point
 */

import './styles/main.css';
import './styles/components.css';
import { initI18n, t, getLanguage, type TranslationKey } from './i18n';
import { generateQuestion, generateChoices } from './game/Question';
import { AVATARS, DIFFICULTY_SETTINGS } from './game/types';
import { Timer } from './game/Timer';
import { TimerBar, MultipleChoice, NumberPad, AvatarPicker, initRotation, animateRotation, showPWAPromptIfNeeded } from './ui';

// Initialize i18n first
const detectedLanguage = initI18n();
console.log(`[App] Initialized with language: ${detectedLanguage}`);

// Initialize app
function initApp(): void {
  const app = document.getElementById('app');
  if (!app) {
    console.error('App container not found');
    return;
  }

  // Initialize rotation system
  initRotation(app);

  // Render start screen with i18n
  app.innerHTML = `
    <div class="screen">
      <h1>${t('app.title')}</h1>
      <div class="avatar avatar--large">🧙</div>
      <h2>${t('app.subtitle')}</h2>
      <p style="color: var(--color-text-secondary); font-size: var(--font-size-md); margin-bottom: var(--spacing-lg);">
        ${t('app.tagline')}
      </p>
      <div style="display: flex; flex-direction: column; gap: var(--spacing-md);">
        <button class="btn btn--primary btn--large" id="single-btn">
          ${t('start.singlePlayer')}
        </button>
        <button class="btn btn--secondary btn--large" id="multi-btn">
          ${t('start.twoPlayer')}
        </button>
      </div>
      <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-xl);">
        <button class="btn btn--secondary" id="demo-components">
          Demo Components
        </button>
        <button class="btn btn--secondary" id="demo-rotation">
          Demo Rotation
        </button>
      </div>
      <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-top: var(--spacing-lg);">
        Language: ${getLanguage().toUpperCase()} | Phase 3: UI Components
      </p>
    </div>
  `;

  // Demo: Test game logic
  const singleBtn = document.getElementById('single-btn');
  const multiBtn = document.getElementById('multi-btn');
  const demoComponentsBtn = document.getElementById('demo-components');
  const demoRotationBtn = document.getElementById('demo-rotation');

  singleBtn?.addEventListener('click', () => {
    demoGameWithComponents('single');
  });

  multiBtn?.addEventListener('click', () => {
    demoGameWithComponents('multi');
  });

  demoComponentsBtn?.addEventListener('click', () => {
    demoAllComponents();
  });

  demoRotationBtn?.addEventListener('click', () => {
    demoRotation();
  });

  // Show PWA prompt if on iOS Safari and not already installed
  showPWAPromptIfNeeded();
}

/**
 * Demo all UI components
 */
function demoAllComponents(): void {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="screen" style="gap: var(--spacing-xl);">
      <h2>UI Components Demo</h2>
      
      <div>
        <h3 style="margin-bottom: var(--spacing-md);">Timer Bar</h3>
        <div id="timer-container"></div>
        <div style="display: flex; gap: var(--spacing-sm); margin-top: var(--spacing-md);">
          <button class="btn btn--secondary" id="timer-start">Start</button>
          <button class="btn btn--secondary" id="timer-reset">Reset</button>
        </div>
      </div>

      <div>
        <h3 style="margin-bottom: var(--spacing-md);">Multiple Choice</h3>
        <div id="choice-container"></div>
      </div>

      <div>
        <h3 style="margin-bottom: var(--spacing-md);">Number Pad</h3>
        <div id="numpad-container"></div>
      </div>

      <div>
        <h3 style="margin-bottom: var(--spacing-md);">Avatar Picker</h3>
        <div id="avatar-container"></div>
      </div>

      <button class="btn btn--primary" id="back-btn">
        ${t('setup.back')}
      </button>
    </div>
  `;

  // Timer Bar
  const timerContainer = document.getElementById('timer-container')!;
  const timerBar = new TimerBar({
    duration: 10000,
    warningThreshold: 5000,
    criticalThreshold: 3000,
    showText: true,
  });
  timerBar.mount(timerContainer);

  const timer = new Timer(10000, {
    onTick: (remaining) => timerBar.update(remaining),
    onComplete: () => console.log('Timer complete!'),
  });

  document.getElementById('timer-start')?.addEventListener('click', () => {
    timer.reset();
    timerBar.reset();
    timer.start();
  });

  document.getElementById('timer-reset')?.addEventListener('click', () => {
    timer.reset();
    timerBar.reset();
  });

  // Multiple Choice
  const choiceContainer = document.getElementById('choice-container')!;
  const correctAnswer = 42;
  const multipleChoice = new MultipleChoice({
    choices: [36, 42, 48],
    correctAnswer,
    onSelect: (answer, isCorrect) => {
      console.log(`Selected: ${answer}, Correct: ${isCorrect}`);
    },
  });
  multipleChoice.mount(choiceContainer);

  // Number Pad
  const numpadContainer = document.getElementById('numpad-container')!;
  const numberPad = new NumberPad({
    maxDigits: 3,
    onSubmit: (value) => {
      console.log(`Submitted: ${value}`);
      alert(`You entered: ${value}`);
      numberPad.reset();
    },
  });
  numberPad.mount(numpadContainer);

  // Avatar Picker
  const avatarContainer = document.getElementById('avatar-container')!;
  const avatarPicker = new AvatarPicker({
    onSelect: (avatar) => {
      console.log(`Selected avatar: ${avatar.id}`);
    },
  });
  avatarPicker.mount(avatarContainer);

  // Back button
  document.getElementById('back-btn')?.addEventListener('click', () => {
    timer.destroy();
    initApp();
  });
}

/**
 * Demo rotation system
 */
function demoRotation(): void {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="screen">
      <h2>Rotation Demo</h2>
      <p style="color: var(--color-text-secondary);">
        The screen will rotate 180° to switch between players
      </p>
      
      <div class="turn-indicator">
        <div class="avatar avatar--large">🧙</div>
        <div class="turn-indicator__text">${t('game.yourTurn')}</div>
      </div>

      <div style="display: flex; gap: var(--spacing-md); margin-top: var(--spacing-xl);">
        <button class="btn btn--primary" id="rotate-btn">
          Rotate to Player 2
        </button>
        <button class="btn btn--secondary" id="back-btn">
          ${t('setup.back')}
        </button>
      </div>
    </div>
  `;

  let isPlayer1 = true;

  document.getElementById('rotate-btn')?.addEventListener('click', () => {
    animateRotation(isPlayer1 ? 'player2' : 'player1', () => {
      isPlayer1 = !isPlayer1;
      const btn = document.getElementById('rotate-btn');
      if (btn) {
        btn.textContent = `Rotate to Player ${isPlayer1 ? '2' : '1'}`;
      }
    });
  });

  document.getElementById('back-btn')?.addEventListener('click', initApp);
}

/**
 * Demo game with actual components
 */
function demoGameWithComponents(mode: 'single' | 'multi'): void {
  const app = document.getElementById('app');
  if (!app) return;

  // Generate a sample question
  const question = generateQuestion([5, 6, 7], 'multiply');
  const choices = generateChoices(question.correctAnswer);
  const difficulty = DIFFICULTY_SETTINGS.easy;

  app.innerHTML = `
    <div class="screen">
      <h2>${t('game.round')} 1 ${t('game.of')} 10</h2>
      
      <div class="score-display score-display--active">
        <div class="score-display__avatar">${AVATARS[0]?.emoji}</div>
        <div class="score-display__info">
          <div class="score-display__name">${t(`avatar.${AVATARS[0]?.id}` as TranslationKey)}</div>
          <div class="score-display__score">0 ${t('game.points')}</div>
        </div>
      </div>

      <div class="question">${question.displayText}</div>
      
      <div id="timer-container" style="width: 100%;"></div>
      
      <div id="answer-container" style="width: 100%;"></div>

      <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-top: var(--spacing-lg);">
        ${t('difficulty.easy')}: ${difficulty.timeLimit / 1000}s | 
        ${t('operation.multiply')} | 
        ${mode === 'single' ? t('start.singlePlayer') : t('start.twoPlayer')}
      </p>

      <button class="btn btn--secondary" id="back-btn" style="margin-top: var(--spacing-md);">
        ${t('setup.back')}
      </button>
    </div>
  `;

  // Create timer bar
  const timerContainer = document.getElementById('timer-container')!;
  const timerBar = new TimerBar({
    duration: difficulty.timeLimit,
    showText: true,
  });
  timerBar.mount(timerContainer);

  // Create multiple choice
  const answerContainer = document.getElementById('answer-container')!;
  const multipleChoice = new MultipleChoice({
    choices,
    correctAnswer: question.correctAnswer,
    onSelect: (_answer, isCorrect) => {
      timer.stop();
      
      setTimeout(() => {
        const message = isCorrect 
          ? `${t('game.correct')} +100 ${t('game.points')}!` 
          : `${t('game.incorrect')}. ${t('game.theAnswerWas')} ${question.correctAnswer}`;
        alert(message);
        initApp();
      }, 500);
    },
  });
  multipleChoice.mount(answerContainer);

  // Create timer
  const timer = new Timer(difficulty.timeLimit, {
    onTick: (remaining) => timerBar.update(remaining),
    onComplete: () => {
      multipleChoice.showCorrectAnswer();
      setTimeout(() => {
        alert(`${t('game.timeUp')} ${t('game.theAnswerWas')} ${question.correctAnswer}`);
        initApp();
      }, 1000);
    },
  });
  timer.start();

  // Back button
  document.getElementById('back-btn')?.addEventListener('click', () => {
    timer.destroy();
    initApp();
  });
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
