/**
 * Times Tables Quest - Start Screen
 * 
 * Initial screen with game mode selection.
 */

import { Component } from '../components/Component';
import { t } from '../../i18n';
import type { GameMode } from '../../game/types';

export interface StartScreenOptions {
  onSelectMode: (mode: GameMode) => void;
}

export class StartScreen extends Component {
  private options: StartScreenOptions;

  constructor(options: StartScreenOptions) {
    super('div');
    this.options = options;
    this.addClass('screen', 'start-screen');
    this.render();
  }

  render(): void {
    this.element.innerHTML = `
      <h1>${t('app.title')}</h1>
      <div class="avatar avatar--large start-screen__hero">
        <span class="start-screen__hero-emoji">🧙</span>
      </div>
      <h2>${t('app.subtitle')}</h2>
      <p class="start-screen__tagline">
        ${t('app.tagline')}
      </p>
      
      <div class="start-screen__how-to-play">
        <h3>${t('start.howToPlay')}</h3>
        <ul>
          <li>${t('start.howToPlay1')}</li>
          <li>${t('start.howToPlay2')}</li>
          <li>${t('start.howToPlay3')}</li>
        </ul>
      </div>
      
      <div class="start-screen__buttons">
        <button class="btn btn--primary btn--large" data-mode="single">
          ${t('start.singlePlayer')}
        </button>
        <button class="btn btn--secondary btn--large" data-mode="multi">
          ${t('start.twoPlayer')}
        </button>
        <p class="start-screen__hint">${t('start.twoPlayerHint')}</p>
      </div>
    `;

    // Bind button events
    this.element.querySelectorAll('[data-mode]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const mode = (e.currentTarget as HTMLElement).dataset.mode as GameMode;
        this.options.onSelectMode(mode);
      });
    });
  }
}
