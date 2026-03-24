/**
 * Times Tables Quest
 * Main entry point
 */

import './styles/main.css';
import { initI18n, t, getLanguage, type TranslationKey } from './i18n';
import { generateQuestion, generateChoices } from './game/Question';
import { AVATARS, DIFFICULTY_SETTINGS } from './game/types';

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
      <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-top: var(--spacing-xl);">
        Language: ${getLanguage().toUpperCase()} | Phase 2: Core Logic Complete
      </p>
    </div>
  `;

  // Demo: Test game logic
  const singleBtn = document.getElementById('single-btn');
  const multiBtn = document.getElementById('multi-btn');

  singleBtn?.addEventListener('click', () => {
    demoGameLogic('single');
  });

  multiBtn?.addEventListener('click', () => {
    demoGameLogic('multi');
  });
}

/**
 * Demo function to test game logic (temporary - will be replaced by UI)
 */
function demoGameLogic(mode: 'single' | 'multi'): void {
  const app = document.getElementById('app');
  if (!app) return;

  // Generate a sample question
  const question = generateQuestion([5, 6, 7], 'multiply');
  const choices = generateChoices(question.correctAnswer);

  // Get difficulty settings
  const difficulty = DIFFICULTY_SETTINGS.easy;

  app.innerHTML = `
    <div class="screen">
      <h2>${t('game.round')} 1 ${t('game.of')} 10</h2>
      
      <div style="display: flex; align-items: center; gap: var(--spacing-lg); margin: var(--spacing-lg) 0;">
        <div class="avatar">${AVATARS[0]?.emoji}</div>
        <div>
          <div style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
            ${t(`avatar.${AVATARS[0]?.id}` as TranslationKey)}
          </div>
          <div style="font-size: var(--font-size-lg); font-weight: bold;">
            ${t('game.score')}: 0
          </div>
        </div>
      </div>

      <div class="question">${question.displayText}</div>
      
      <div style="display: flex; gap: var(--spacing-md); margin: var(--spacing-lg) 0;">
        ${choices.map(choice => `
          <button class="btn btn--secondary" data-answer="${choice}" style="font-size: var(--font-size-xl); min-width: 80px;">
            ${choice}
          </button>
        `).join('')}
      </div>

      <div style="
        width: 100%;
        max-width: 400px;
        height: 20px;
        background: var(--color-bg-dark);
        border-radius: var(--border-radius-md);
        overflow: hidden;
        margin: var(--spacing-lg) 0;
      ">
        <div style="
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, var(--color-timer-full), var(--color-timer-mid));
          transition: width 0.1s linear;
        "></div>
      </div>

      <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">
        ${t('difficulty.easy')}: ${difficulty.timeLimit / 1000}s | 
        ${t('operation.multiply')} | 
        Mode: ${mode === 'single' ? t('start.singlePlayer') : t('start.twoPlayer')}
      </p>

      <button class="btn btn--primary" id="back-btn" style="margin-top: var(--spacing-lg);">
        ${t('setup.back')}
      </button>
    </div>
  `;

  // Handle answer buttons
  const answerBtns = app.querySelectorAll('[data-answer]');
  answerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const answer = parseInt((e.target as HTMLElement).dataset.answer || '0', 10);
      const isCorrect = answer === question.correctAnswer;
      
      // Show feedback
      const feedbackText = isCorrect 
        ? `${t('game.correct')} +100 ${t('game.points')}!` 
        : `${t('game.incorrect')}. ${t('game.theAnswerWas')} ${question.correctAnswer}`;
      
      alert(feedbackText);
      
      // Go back to start
      initApp();
    });
  });

  // Back button
  const backBtn = document.getElementById('back-btn');
  backBtn?.addEventListener('click', initApp);
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
