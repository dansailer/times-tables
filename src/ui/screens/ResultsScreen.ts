/**
 * Times Tables Quest - Results Screen
 * 
 * End game screen showing:
 * - Winner announcement
 * - Final scores
 * - Stats (rounds won, accuracy)
 * - Play again / New game buttons
 */

import { Component } from '../components/Component';
import { t, type TranslationKey } from '../../i18n';
import type { Game } from '../../game/Game';
import type { Player } from '../../game/types';

export interface ResultsScreenOptions {
  game: Game;
  onPlayAgain: () => void;
  onNewGame: () => void;
}

export class ResultsScreen extends Component {
  private options: ResultsScreenOptions;
  private game: Game;

  constructor(options: ResultsScreenOptions) {
    super('div');
    this.options = options;
    this.game = options.game;
    this.addClass('screen', 'results-screen');
    this.render();
  }

  render(): void {
    const config = this.game.getConfig();
    const winner = this.game.getWinner();
    const players = this.game.getPlayers();
    const isSinglePlayer = config.mode === 'single';

    this.element.innerHTML = `
      <h1>${t('results.title')}</h1>
      
      ${this.renderWinner(winner, isSinglePlayer)}
      
      <div class="results-screen__stats">
        ${players.map(p => this.renderPlayerStats(p)).join('')}
      </div>

      <div class="results-screen__actions">
        <button class="btn btn--primary btn--large" id="play-again">
          ${t('results.playAgain')}
        </button>
        <button class="btn btn--secondary" id="new-game">
          ${t('results.newGame')}
        </button>
      </div>
    `;

    this.bindEvents();
  }

  private renderWinner(winner: Player | null, isSinglePlayer: boolean): string {
    if (isSinglePlayer) {
      const player = this.game.getPlayers()[0]!;
      const accuracy = this.game.getPlayerAccuracy(1);
      const message = this.getPerformanceMessage(accuracy);
      
      return `
        <div class="results-winner results-winner--single">
          <div class="avatar avatar--large">${player.avatar.emoji}</div>
          <div class="results-winner__message">${message}</div>
          <div class="results-winner__score">${player.score} ${t('game.points')}</div>
        </div>
      `;
    }

    if (winner === null) {
      return `
        <div class="results-winner results-winner--tie">
          <div class="results-winner__emojis">
            ${this.game.getPlayers().map(p => `
              <div class="avatar avatar--large">${p.avatar.emoji}</div>
            `).join('')}
          </div>
          <div class="results-winner__message">${t('results.tie')}</div>
        </div>
      `;
    }

    return `
      <div class="results-winner">
        <div class="avatar avatar--large results-winner__avatar">${winner.avatar.emoji}</div>
        <div class="results-winner__crown">👑</div>
        <div class="results-winner__name">${t(`avatar.${winner.avatar.id}` as TranslationKey)}</div>
        <div class="results-winner__label">${t('results.winner')}!</div>
        <div class="results-winner__score">${winner.score} ${t('game.points')}</div>
      </div>
    `;
  }

  private renderPlayerStats(player: Player): string {
    const accuracy = this.game.getPlayerAccuracy(player.id);
    const config = this.game.getConfig();
    const isSinglePlayer = config.mode === 'single';

    return `
      <div class="results-player">
        <div class="results-player__header">
          <div class="avatar">${player.avatar.emoji}</div>
          <div class="results-player__name">${t(`avatar.${player.avatar.id}` as TranslationKey)}</div>
        </div>
        <div class="results-player__stats">
          <div class="results-stat">
            <div class="results-stat__label">${t('results.finalScore')}</div>
            <div class="results-stat__value">${player.score}</div>
          </div>
          ${!isSinglePlayer ? `
            <div class="results-stat">
              <div class="results-stat__label">${t('results.roundsWon')}</div>
              <div class="results-stat__value">${player.roundsWon} / ${config.rounds}</div>
            </div>
          ` : ''}
          <div class="results-stat">
            <div class="results-stat__label">${t('results.accuracy')}</div>
            <div class="results-stat__value">${accuracy}%</div>
          </div>
        </div>
      </div>
    `;
  }

  private getPerformanceMessage(accuracy: number): string {
    if (accuracy === 100) return t('results.perfect');
    if (accuracy >= 80) return t('results.amazing');
    if (accuracy >= 60) return t('results.greatJob');
    return t('results.keepPracticing');
  }

  private bindEvents(): void {
    this.element.querySelector('#play-again')?.addEventListener('click', () => {
      this.options.onPlayAgain();
    });

    this.element.querySelector('#new-game')?.addEventListener('click', () => {
      this.options.onNewGame();
    });
  }
}
