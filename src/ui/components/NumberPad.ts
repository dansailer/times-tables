/**
 * Times Tables Quest - Number Pad Component
 * 
 * On-screen number pad for entering answers in hard mode.
 */

import { Component } from './Component';
import { t } from '../../i18n';

export interface NumberPadOptions {
  /** Maximum digits allowed */
  maxDigits?: number;
  /** Callback when answer is submitted */
  onSubmit?: (value: number) => void;
  /** Callback when value changes */
  onChange?: (value: string) => void;
}

export class NumberPad extends Component {
  private display: HTMLElement;
  private currentValue: string = '';
  private maxDigits: number;
  private onSubmit?: (value: number) => void;
  private onChange?: (value: string) => void;

  constructor(options: NumberPadOptions = {}) {
    super('div');
    
    this.maxDigits = options.maxDigits ?? 3;
    this.onSubmit = options.onSubmit;
    this.onChange = options.onChange;

    this.addClass('number-pad');
    
    // Create display
    this.display = document.createElement('div');
    this.display.className = 'number-pad__display';
    this.display.setAttribute('aria-live', 'polite');
    this.display.setAttribute('aria-label', 'Current answer');
    this.element.appendChild(this.display);

    // Create keypad
    const keypad = document.createElement('div');
    keypad.className = 'number-pad__keys';
    
    // Number buttons 1-9
    for (let i = 1; i <= 9; i++) {
      keypad.appendChild(this.createKey(String(i), () => this.addDigit(String(i))));
    }
    
    // Clear button
    keypad.appendChild(this.createKey(t('game.clear'), () => this.clear(), 'number-pad__key--action'));
    
    // Zero button
    keypad.appendChild(this.createKey('0', () => this.addDigit('0')));
    
    // Enter button
    keypad.appendChild(this.createKey(t('game.enter'), () => this.submit(), 'number-pad__key--submit'));
    
    this.element.appendChild(keypad);
    this.render();
  }

  /**
   * Create a keypad button
   */
  private createKey(label: string, onClick: () => void, extraClass?: string): HTMLElement {
    const key = document.createElement('button');
    key.type = 'button';
    key.className = 'number-pad__key';
    if (extraClass) {
      key.classList.add(extraClass);
    }
    key.textContent = label;
    
    // Track if touch already handled this interaction
    let touchHandled = false;
    
    key.addEventListener('touchend', (e) => {
      e.preventDefault();
      touchHandled = true;
      onClick();
      // Reset flag after a short delay
      setTimeout(() => { touchHandled = false; }, 100);
    });
    
    key.addEventListener('click', (e) => {
      e.preventDefault();
      // Only handle click if not already handled by touch
      if (!touchHandled) {
        onClick();
      }
    });
    
    return key;
  }

  /**
   * Add a digit to the current value
   */
  private addDigit(digit: string): void {
    if (this.currentValue.length >= this.maxDigits) {
      return;
    }
    
    // Don't allow leading zeros (except single zero)
    if (this.currentValue === '0') {
      this.currentValue = digit;
    } else {
      this.currentValue += digit;
    }
    
    this.render();
    this.onChange?.(this.currentValue);
  }

  /**
   * Clear the current value
   */
  clear(): void {
    this.currentValue = '';
    this.render();
    this.onChange?.(this.currentValue);
  }

  /**
   * Submit the current value
   */
  private submit(): void {
    if (this.currentValue === '') {
      return;
    }
    
    const value = parseInt(this.currentValue, 10);
    this.onSubmit?.(value);
  }

  /**
   * Get current value as number (or null if empty)
   */
  getValue(): number | null {
    if (this.currentValue === '') {
      return null;
    }
    return parseInt(this.currentValue, 10);
  }

  /**
   * Reset the number pad
   */
  reset(): void {
    this.currentValue = '';
    this.render();
  }

  /**
   * Render the display
   */
  render(): void {
    this.display.textContent = this.currentValue || '?';
    this.display.classList.toggle('number-pad__display--empty', this.currentValue === '');
  }

  /**
   * Set submit callback
   */
  setOnSubmit(callback: (value: number) => void): void {
    this.onSubmit = callback;
  }
}
