/**
 * Times Tables Quest
 * Main entry point
 */

import './styles/main.css';

// Game configuration types
interface GameConfig {
  mode: 'single' | 'multi';
  tables: number[];
  operation: 'multiply' | 'divide';
  difficulty: 'easy' | 'medium' | 'hard';
  answerMode: 'choice' | 'input';
  rounds: 5 | 10 | 15;
}

// Default configuration
const defaultConfig: GameConfig = {
  mode: 'multi',
  tables: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  operation: 'multiply',
  difficulty: 'easy',
  answerMode: 'choice',
  rounds: 10,
};

// Initialize app
function initApp(): void {
  const app = document.getElementById('app');
  if (!app) {
    console.error('App container not found');
    return;
  }

  // Render start screen placeholder
  app.innerHTML = `
    <div class="screen">
      <h1>Times Tables Quest</h1>
      <div class="avatar avatar--large">🧙</div>
      <h2>Adventure Awaits!</h2>
      <p style="color: var(--color-text-secondary); font-size: var(--font-size-md); margin-bottom: var(--spacing-lg);">
        Master multiplication and division on your quest for glory!
      </p>
      <button class="btn btn--primary btn--large" id="start-btn">
        Start Quest
      </button>
      <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-top: var(--spacing-xl);">
        Project setup complete. Game coming soon!
      </p>
    </div>
  `;

  // Add event listener for demo
  const startBtn = document.getElementById('start-btn');
  startBtn?.addEventListener('click', () => {
    console.log('Game starting with config:', defaultConfig);
    alert('Game setup complete! Full game coming in next phases.');
  });
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
