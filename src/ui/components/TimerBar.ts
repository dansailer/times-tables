/**
 * Times Tables Quest - Timer Bar Component
 * 
 * Visual countdown timer bar that changes color based on remaining time.
 */

import { Component } from './Component';

export interface TimerBarOptions {
  /** Total duration in milliseconds */
  duration: number;
  /** Warning threshold in milliseconds (changes color) */
  warningThreshold?: number;
  /** Critical threshold in milliseconds (changes to red) */
  criticalThreshold?: number;
  /** Show time text */
  showText?: boolean;
}

export class TimerBar extends Component {
  private bar: HTMLElement;
  private text: HTMLElement | null = null;
  private duration: number;
  private remaining: number;
  private warningThreshold: number;
  private criticalThreshold: number;
  private showText: boolean;

  constructor(options: TimerBarOptions) {
    super('div');
    
    this.duration = options.duration;
    this.remaining = options.duration;
    this.warningThreshold = options.warningThreshold ?? 5000;
    this.criticalThreshold = options.criticalThreshold ?? 3000;
    this.showText = options.showText ?? false;

    // Container styles
    this.addClass('timer-bar');
    this.element.setAttribute('role', 'progressbar');
    this.element.setAttribute('aria-valuemin', '0');
    this.element.setAttribute('aria-valuemax', String(this.duration));
    this.element.setAttribute('aria-valuenow', String(this.remaining));

    // Create progress bar
    this.bar = document.createElement('div');
    this.bar.className = 'timer-bar__progress';
    this.element.appendChild(this.bar);

    // Create text display (optional)
    if (this.showText) {
      this.text = document.createElement('div');
      this.text.className = 'timer-bar__text';
      this.element.appendChild(this.text);
    }

    this.render();
  }

  /**
   * Update the timer bar with remaining time
   */
  update(remaining: number): void {
    this.remaining = Math.max(0, remaining);
    this.element.setAttribute('aria-valuenow', String(this.remaining));
    this.render();
  }

  /**
   * Reset timer to full
   */
  reset(newDuration?: number): void {
    if (newDuration !== undefined) {
      this.duration = newDuration;
      this.element.setAttribute('aria-valuemax', String(this.duration));
    }
    this.remaining = this.duration;
    this.render();
  }

  /**
   * Get progress as percentage (0-100)
   */
  getProgress(): number {
    return (this.remaining / this.duration) * 100;
  }

  /**
   * Render the timer bar
   */
  render(): void {
    const progress = this.getProgress();
    
    // Update bar width
    this.bar.style.width = `${progress}%`;

    // Update color based on remaining time
    this.bar.classList.remove('timer-bar__progress--warning', 'timer-bar__progress--critical');
    
    if (this.remaining <= this.criticalThreshold) {
      this.bar.classList.add('timer-bar__progress--critical');
    } else if (this.remaining <= this.warningThreshold) {
      this.bar.classList.add('timer-bar__progress--warning');
    }

    // Update text
    if (this.text) {
      const seconds = Math.ceil(this.remaining / 1000);
      this.text.textContent = `${seconds}s`;
    }
  }
}
