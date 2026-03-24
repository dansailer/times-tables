/**
 * Times Tables Quest - Setup Screen
 * 
 * Game configuration screen for selecting:
 * - Player avatars
 * - Times tables (2-10)
 * - Operation (multiply/divide)
 * - Difficulty (easy/medium/hard)
 * - Answer mode (choice/input)
 * - Number of rounds (5/10/15)
 */

import { Component } from '../components/Component';
import { AvatarPicker } from '../components/AvatarPicker';
import { t, type TranslationKey } from '../../i18n';
import type { 
  GameMode, 
  GameConfig, 
  Operation, 
  Difficulty, 
  AnswerMode, 
  RoundCount,
  Avatar 
} from '../../game/types';
import { AVATARS } from '../../game/types';

export interface SetupScreenOptions {
  mode: GameMode;
  config: GameConfig;
  onStart: (config: Partial<GameConfig>) => void;
  onBack: () => void;
}

export class SetupScreen extends Component {
  private options: SetupScreenOptions;
  private avatarPicker1: AvatarPicker | null = null;
  private avatarPicker2: AvatarPicker | null = null;
  
  // Selected values
  private selectedTables: Set<number> = new Set([2, 3, 4, 5]);
  private selectedOperation: Operation = 'multiply';
  private selectedDifficulty: Difficulty = 'easy';
  private selectedAnswerMode: AnswerMode = 'choice';
  private selectedRounds: RoundCount = 10;
  private player1Avatar: Avatar = AVATARS[0]!;
  private player2Avatar: Avatar = AVATARS[1]!;

  constructor(options: SetupScreenOptions) {
    super('div');
    this.options = options;
    this.addClass('screen', 'setup-screen');
    
    // Initialize from existing config
    this.selectedTables = new Set(options.config.tables);
    this.selectedOperation = options.config.operation;
    this.selectedDifficulty = options.config.difficulty;
    this.selectedAnswerMode = options.config.answerMode;
    this.selectedRounds = options.config.rounds;
    this.player1Avatar = options.config.players[0]?.avatar ?? AVATARS[0]!;
    if (options.mode === 'multi') {
      this.player2Avatar = options.config.players[1]?.avatar ?? AVATARS[1]!;
    }
    
    this.render();
  }

  render(): void {
    const isTwoPlayer = this.options.mode === 'multi';
    
    this.element.innerHTML = `
      <h2>${t('setup.title')}</h2>
      
      <div class="setup-screen__content">
        <!-- Avatar Selection -->
        <section class="setup-section">
          <h3>${t('setup.selectAvatar')}</h3>
          <div class="setup-avatars ${isTwoPlayer ? 'setup-avatars--two-player' : ''}">
            <div class="setup-avatar-column">
              ${isTwoPlayer ? `<div class="setup-player-label">${t('setup.player1')}</div>` : ''}
              <div id="avatar-picker-1"></div>
            </div>
            ${isTwoPlayer ? `
              <div class="setup-avatar-column">
                <div class="setup-player-label">${t('setup.player2')}</div>
                <div id="avatar-picker-2"></div>
              </div>
            ` : ''}
          </div>
        </section>

        <!-- Times Tables Selection -->
        <section class="setup-section">
          <h3>${t('setup.selectTables')}</h3>
          <div class="setup-tables">
            ${[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `
              <button 
                class="setup-table-btn ${this.selectedTables.has(n) ? 'setup-table-btn--selected' : ''}" 
                data-table="${n}"
              >
                ${n}
              </button>
            `).join('')}
          </div>
        </section>

        <!-- Operation -->
        <section class="setup-section">
          <h3>${t('setup.selectOperation')}</h3>
          <div class="setup-options">
            <button 
              class="setup-option ${this.selectedOperation === 'multiply' ? 'setup-option--selected' : ''}" 
              data-operation="multiply"
            >
              ${t('operation.multiply')}
            </button>
            <button 
              class="setup-option ${this.selectedOperation === 'divide' ? 'setup-option--selected' : ''}" 
              data-operation="divide"
            >
              ${t('operation.divide')}
            </button>
          </div>
        </section>

        <!-- Difficulty -->
        <section class="setup-section">
          <h3>${t('setup.selectDifficulty')}</h3>
          <div class="setup-options">
            ${(['easy', 'medium', 'hard'] as Difficulty[]).map(d => `
              <button 
                class="setup-option ${this.selectedDifficulty === d ? 'setup-option--selected' : ''}" 
                data-difficulty="${d}"
              >
                <span class="setup-option__label">${t(`difficulty.${d}` as TranslationKey)}</span>
                <span class="setup-option__desc">${t(`difficulty.${d}Desc` as TranslationKey)}</span>
              </button>
            `).join('')}
          </div>
        </section>

        <!-- Answer Mode -->
        <section class="setup-section">
          <h3>${t('setup.selectAnswerMode')}</h3>
          <div class="setup-options">
            <button 
              class="setup-option ${this.selectedAnswerMode === 'choice' ? 'setup-option--selected' : ''}" 
              data-answer-mode="choice"
            >
              ${t('answerMode.choice')}
            </button>
            <button 
              class="setup-option ${this.selectedAnswerMode === 'input' ? 'setup-option--selected' : ''}" 
              data-answer-mode="input"
            >
              ${t('answerMode.input')}
            </button>
          </div>
        </section>

        <!-- Rounds -->
        <section class="setup-section">
          <h3>${t('setup.selectRounds')}</h3>
          <div class="setup-options">
            ${([5, 10, 15] as RoundCount[]).map(r => `
              <button 
                class="setup-option ${this.selectedRounds === r ? 'setup-option--selected' : ''}" 
                data-rounds="${r}"
              >
                ${r}
              </button>
            `).join('')}
          </div>
        </section>
      </div>

      <!-- Action Buttons -->
      <div class="setup-actions">
        <button class="btn btn--secondary" id="setup-back">
          ${t('setup.back')}
        </button>
        <button class="btn btn--primary btn--large" id="setup-start">
          ${t('setup.startGame')}
        </button>
      </div>
    `;

    this.bindEvents();
    this.mountAvatarPickers();
  }

  private bindEvents(): void {
    // Tables selection
    this.element.querySelectorAll('[data-table]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const table = parseInt((e.currentTarget as HTMLElement).dataset.table!, 10);
        this.toggleTable(table);
        (e.currentTarget as HTMLElement).classList.toggle('setup-table-btn--selected');
      });
    });

    // Operation selection
    this.element.querySelectorAll('[data-operation]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const operation = (e.currentTarget as HTMLElement).dataset.operation as Operation;
        this.selectedOperation = operation;
        this.updateSelection('[data-operation]', `[data-operation="${operation}"]`);
      });
    });

    // Difficulty selection
    this.element.querySelectorAll('[data-difficulty]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const difficulty = (e.currentTarget as HTMLElement).dataset.difficulty as Difficulty;
        this.selectedDifficulty = difficulty;
        this.updateSelection('[data-difficulty]', `[data-difficulty="${difficulty}"]`);
      });
    });

    // Answer mode selection
    this.element.querySelectorAll('[data-answer-mode]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = (e.currentTarget as HTMLElement).dataset.answerMode as AnswerMode;
        this.selectedAnswerMode = mode;
        this.updateSelection('[data-answer-mode]', `[data-answer-mode="${mode}"]`);
      });
    });

    // Rounds selection
    this.element.querySelectorAll('[data-rounds]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rounds = parseInt((e.currentTarget as HTMLElement).dataset.rounds!, 10) as RoundCount;
        this.selectedRounds = rounds;
        this.updateSelection('[data-rounds]', `[data-rounds="${rounds}"]`);
      });
    });

    // Back button
    this.element.querySelector('#setup-back')?.addEventListener('click', () => {
      this.options.onBack();
    });

    // Start button
    this.element.querySelector('#setup-start')?.addEventListener('click', () => {
      this.handleStart();
    });
  }

  private mountAvatarPickers(): void {
    const container1 = this.element.querySelector('#avatar-picker-1') as HTMLElement;
    if (container1) {
      this.avatarPicker1 = new AvatarPicker({
        selectedId: this.player1Avatar.id,
        disabledIds: this.options.mode === 'multi' ? [this.player2Avatar.id] : [],
        onSelect: (avatar) => {
          this.player1Avatar = avatar;
          // Update player 2 picker to disable this avatar
          if (this.avatarPicker2) {
            this.avatarPicker2.setDisabled([avatar.id]);
          }
        },
      });
      this.avatarPicker1.mount(container1);
    }

    if (this.options.mode === 'multi') {
      const container2 = this.element.querySelector('#avatar-picker-2') as HTMLElement;
      if (container2) {
        this.avatarPicker2 = new AvatarPicker({
          selectedId: this.player2Avatar.id,
          disabledIds: [this.player1Avatar.id],
          onSelect: (avatar) => {
            this.player2Avatar = avatar;
            // Update player 1 picker to disable this avatar
            if (this.avatarPicker1) {
              this.avatarPicker1.setDisabled([avatar.id]);
            }
          },
        });
        this.avatarPicker2.mount(container2);
      }
    }
  }

  private toggleTable(table: number): void {
    if (this.selectedTables.has(table)) {
      // Don't allow deselecting if it's the last one
      if (this.selectedTables.size > 1) {
        this.selectedTables.delete(table);
      }
    } else {
      this.selectedTables.add(table);
    }
  }

  private updateSelection(allSelector: string, selectedSelector: string): void {
    this.element.querySelectorAll(allSelector).forEach(btn => {
      btn.classList.remove('setup-option--selected');
    });
    this.element.querySelector(selectedSelector)?.classList.add('setup-option--selected');
  }

  private handleStart(): void {
    // Ensure at least one table is selected
    if (this.selectedTables.size === 0) {
      this.selectedTables.add(2);
    }

    this.options.onStart({
      tables: Array.from(this.selectedTables).sort((a, b) => a - b),
      operation: this.selectedOperation,
      difficulty: this.selectedDifficulty,
      answerMode: this.selectedAnswerMode,
      rounds: this.selectedRounds,
    });
  }

  destroy(): void {
    this.avatarPicker1?.destroy();
    this.avatarPicker2?.destroy();
    super.destroy();
  }
}
