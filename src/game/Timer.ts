/**
 * Times Tables Quest - Timer
 * 
 * Countdown timer with callbacks for game timing.
 */

import type { TimerCallbacks } from './types';

export class Timer {
  private originalDuration: number; // Original duration for reset
  private duration: number; // Current countdown duration in ms
  private remaining: number; // Remaining time in ms
  private startTime: number = 0;
  private timerId: number | null = null;
  private callbacks: TimerCallbacks;
  private warningThreshold: number = 3000; // 3 seconds warning
  private warningFired: boolean = false;
  private tickInterval: number = 100; // Update every 100ms

  /**
   * Create a new timer
   * 
   * @param duration - Duration in milliseconds
   * @param callbacks - Callback functions for timer events
   */
  constructor(duration: number, callbacks: TimerCallbacks = {}) {
    this.originalDuration = duration;
    this.duration = duration;
    this.remaining = duration;
    this.callbacks = callbacks;
  }

  /**
   * Start the timer
   */
  start(): void {
    if (this.timerId !== null) {
      this.stop();
    }

    this.startTime = performance.now();
    this.warningFired = false;
    
    // Initial tick
    this.tick();

    // Set up interval for updates
    this.timerId = window.setInterval(() => {
      this.tick();
    }, this.tickInterval);
  }

  /**
   * Internal tick function
   */
  private tick(): void {
    const elapsed = performance.now() - this.startTime;
    this.remaining = Math.max(0, this.duration - elapsed);

    // Fire tick callback
    if (this.callbacks.onTick) {
      this.callbacks.onTick(this.remaining, this.duration);
    }

    // Fire warning callback (once)
    if (!this.warningFired && this.remaining <= this.warningThreshold && this.remaining > 0) {
      this.warningFired = true;
      if (this.callbacks.onWarning) {
        this.callbacks.onWarning(this.remaining);
      }
    }

    // Timer complete
    if (this.remaining <= 0) {
      this.stop();
      if (this.callbacks.onComplete) {
        this.callbacks.onComplete();
      }
    }
  }

  /**
   * Stop the timer
   */
  stop(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * Pause the timer
   */
  pause(): void {
    this.stop();
    // remaining is already updated to current value
  }

  /**
   * Resume a paused timer
   */
  resume(): void {
    if (this.remaining > 0 && this.timerId === null) {
      // Adjust startTime to account for already elapsed time
      // This keeps duration unchanged so progress calculation remains correct
      const elapsed = this.duration - this.remaining;
      this.startTime = performance.now() - elapsed;
      
      // Set up interval for updates
      this.timerId = window.setInterval(() => {
        this.tick();
      }, this.tickInterval);
      
      // Initial tick
      this.tick();
    }
  }

  /**
   * Reset the timer to initial state
   * 
   * @param newDuration - Optional new duration
   */
  reset(newDuration?: number): void {
    this.stop();
    if (newDuration !== undefined) {
      this.originalDuration = newDuration;
      this.duration = newDuration;
    } else {
      this.duration = this.originalDuration;
    }
    this.remaining = this.duration;
    this.warningFired = false;
  }

  /**
   * Get remaining time in milliseconds
   */
  getRemaining(): number {
    return this.remaining;
  }

  /**
   * Get elapsed time in milliseconds
   */
  getElapsed(): number {
    return this.duration - this.remaining;
  }

  /**
   * Get remaining time as percentage (0-1)
   */
  getProgress(): number {
    return this.remaining / this.duration;
  }

  /**
   * Check if timer is running
   */
  isRunning(): boolean {
    return this.timerId !== null;
  }

  /**
   * Set warning threshold
   * 
   * @param threshold - Threshold in milliseconds
   */
  setWarningThreshold(threshold: number): void {
    this.warningThreshold = threshold;
  }

  /**
   * Update callbacks
   * 
   * @param callbacks - New callback functions
   */
  setCallbacks(callbacks: TimerCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Clean up timer resources
   */
  destroy(): void {
    this.stop();
    this.callbacks = {};
  }
}
