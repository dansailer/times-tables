/**
 * Times Tables Quest
 * Main entry point - Game App Controller
 */

import './styles/main.css';
import './styles/components.css';
import './styles/screens.css';
import './styles/animations.css';

import { initI18n } from './i18n';
import { Game } from './game/Game';
import type { GameMode } from './game/types';
import { soundEngine } from './audio';
import { 
  StartScreen, 
  SetupScreen, 
  GameScreen, 
  ResultsScreen,
  initRotation,
  animateRotation,
  showPWAPromptIfNeeded,
} from './ui';

// Initialize i18n first
initI18n();

// App state
type AppScreen = 'start' | 'setup' | 'game' | 'results';

class App {
  private appContainer: HTMLElement;
  private game: Game;
  private currentScreenComponent: StartScreen | SetupScreen | GameScreen | ResultsScreen | null = null;
  private selectedMode: GameMode = 'single';
  private soundInitialized: boolean = false;

  constructor() {
    const container = document.getElementById('app');
    if (!container) {
      throw new Error('App container not found');
    }
    this.appContainer = container;
    this.game = new Game();
    
    // Initialize rotation system
    initRotation(this.appContainer);
    
    // Initialize sound on first user interaction
    this.initSoundOnInteraction();
  }
  
  /**
   * Initialize sound engine on first user interaction (required for iOS)
   */
  private initSoundOnInteraction(): void {
    const handler = () => {
      if (!this.soundInitialized) {
        soundEngine.init();
        soundEngine.resume();
        this.soundInitialized = true;
        // Remove both listeners since one fired
        document.removeEventListener('touchstart', handler);
        document.removeEventListener('click', handler);
      }
    };
    
    // Listen for various interaction events
    document.addEventListener('touchstart', handler);
    document.addEventListener('click', handler);
  }

  /**
   * Start the app
   */
  start(): void {
    this.showScreen('start');
    
    // Show PWA prompt if on iOS Safari
    showPWAPromptIfNeeded();
  }

  /**
   * Navigate to a screen
   */
  private showScreen(screen: AppScreen): void {
    // Clean up current screen
    this.currentScreenComponent?.destroy();
    this.currentScreenComponent = null;
    
    // Clear container
    this.appContainer.innerHTML = '';
    
    switch (screen) {
      case 'start':
        this.showStartScreen();
        break;
      case 'setup':
        this.showSetupScreen();
        break;
      case 'game':
        this.showGameScreen();
        break;
      case 'results':
        this.showResultsScreen();
        break;
    }
  }

  /**
   * Show start screen
   */
  private showStartScreen(): void {
    const screen = new StartScreen({
      onSelectMode: (mode) => {
        this.selectedMode = mode;
        this.game.setMode(mode);
        this.showScreen('setup');
      },
    });
    
    screen.mount(this.appContainer);
    this.currentScreenComponent = screen;
  }

  /**
   * Show setup screen
   */
  private showSetupScreen(): void {
    const screen = new SetupScreen({
      mode: this.selectedMode,
      config: this.game.getConfig(),
      onStart: (config) => {
        // Apply configuration
        if (config.tables) this.game.setTables(config.tables);
        if (config.operation) this.game.setOperation(config.operation);
        if (config.difficulty) this.game.setDifficulty(config.difficulty);
        if (config.answerMode) this.game.setAnswerMode(config.answerMode);
        if (config.rounds) this.game.setRounds(config.rounds);
        
        // Apply avatar selections
        if (config.player1Avatar) this.game.setPlayerAvatar(1, config.player1Avatar);
        if (config.player2Avatar) this.game.setPlayerAvatar(2, config.player2Avatar);
        
        // Start the game
        this.game.dispatch({ type: 'START_GAME' });
        this.showScreen('game');
      },
      onBack: () => {
        this.showScreen('start');
      },
    });
    
    screen.mount(this.appContainer);
    this.currentScreenComponent = screen;
  }

  /**
   * Show game screen
   */
  private showGameScreen(): void {
    const screen = new GameScreen({
      game: this.game,
      onRoundEnd: () => {
        // Check if two-player mode needs rotation
        const config = this.game.getConfig();
        if (config.mode === 'multi') {
          // Animate rotation for next round
          animateRotation('player1', () => {
            (this.currentScreenComponent as GameScreen).startNewRound();
          });
        } else {
          // Single player - just start new round
          (this.currentScreenComponent as GameScreen).startNewRound();
        }
      },
      onGameEnd: () => {
        this.showScreen('results');
      },
    });
    
    screen.mount(this.appContainer);
    this.currentScreenComponent = screen;
  }

  /**
   * Show results screen
   */
  private showResultsScreen(): void {
    const screen = new ResultsScreen({
      game: this.game,
      onPlayAgain: () => {
        this.game.dispatch({ type: 'PLAY_AGAIN' });
        this.showScreen('game');
      },
      onNewGame: () => {
        this.game.dispatch({ type: 'NEW_GAME' });
        this.showScreen('start');
      },
    });
    
    screen.mount(this.appContainer);
    this.currentScreenComponent = screen;
  }
}

// Initialize and start app
const app = new App();
app.start();
