/**
 * Times Tables Quest - Multiple Choice Component
 * 
 * Shows multiple answer options for easy mode.
 */

import { Component } from './Component';

export interface MultipleChoiceOptions {
  /** Answer choices */
  choices: number[];
  /** Correct answer */
  correctAnswer: number;
  /** Callback when answer is selected */
  onSelect?: (answer: number, isCorrect: boolean) => void;
}

export class MultipleChoice extends Component {
  private choices: number[];
  private correctAnswer: number;
  private onSelect?: (answer: number, isCorrect: boolean) => void;
  private buttons: HTMLButtonElement[] = [];
  private selectedAnswer: number | null = null;
  private disabled: boolean = false;

  constructor(options: MultipleChoiceOptions) {
    super('div');
    
    this.choices = options.choices;
    this.correctAnswer = options.correctAnswer;
    this.onSelect = options.onSelect;

    this.addClass('multiple-choice');
    this.element.setAttribute('role', 'group');
    this.element.setAttribute('aria-label', 'Answer choices');

    this.render();
  }

  /**
   * Create choice buttons
   */
  render(): void {
    // Clear existing buttons
    this.element.innerHTML = '';
    this.buttons = [];

    // Create button for each choice
    for (const choice of this.choices) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'multiple-choice__option';
      button.textContent = String(choice);
      button.dataset.value = String(choice);
      button.disabled = this.disabled;
      
      // Apply state classes
      if (this.selectedAnswer !== null) {
        if (choice === this.correctAnswer) {
          button.classList.add('multiple-choice__option--correct');
        } else if (choice === this.selectedAnswer) {
          button.classList.add('multiple-choice__option--incorrect');
        }
      }

      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectAnswer(choice);
      });
      
      // Prevent double-tap zoom on iOS
      button.addEventListener('touchend', (e) => {
        if (!this.disabled) {
          e.preventDefault();
          this.selectAnswer(choice);
        }
      });

      this.buttons.push(button);
      this.element.appendChild(button);
    }
  }

  /**
   * Handle answer selection
   */
  private selectAnswer(answer: number): void {
    if (this.disabled || this.selectedAnswer !== null) {
      return;
    }

    this.selectedAnswer = answer;
    this.disabled = true;
    
    const isCorrect = answer === this.correctAnswer;
    
    // Update button states
    this.render();
    
    // Notify listener
    this.onSelect?.(answer, isCorrect);
  }

  /**
   * Reset for new question
   */
  reset(newChoices?: number[], newCorrectAnswer?: number): void {
    if (newChoices !== undefined) {
      this.choices = newChoices;
    }
    if (newCorrectAnswer !== undefined) {
      this.correctAnswer = newCorrectAnswer;
    }
    
    this.selectedAnswer = null;
    this.disabled = false;
    this.render();
  }

  /**
   * Disable all buttons
   */
  disable(): void {
    this.disabled = true;
    for (const button of this.buttons) {
      button.disabled = true;
    }
  }

  /**
   * Enable all buttons
   */
  enable(): void {
    this.disabled = false;
    for (const button of this.buttons) {
      button.disabled = false;
    }
  }

  /**
   * Show correct answer (e.g., on timeout)
   */
  showCorrectAnswer(): void {
    this.disabled = true;
    for (const button of this.buttons) {
      button.disabled = true;
      const value = parseInt(button.dataset.value || '0', 10);
      if (value === this.correctAnswer) {
        button.classList.add('multiple-choice__option--correct');
      }
    }
  }

  /**
   * Set select callback
   */
  setOnSelect(callback: (answer: number, isCorrect: boolean) => void): void {
    this.onSelect = callback;
  }
}
