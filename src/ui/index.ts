/**
 * Times Tables Quest - UI Components
 * 
 * Export all UI components.
 */

export { Component } from './components/Component';
export { TimerBar, type TimerBarOptions } from './components/TimerBar';
export { NumberPad, type NumberPadOptions } from './components/NumberPad';
export { MultipleChoice, type MultipleChoiceOptions } from './components/MultipleChoice';
export { AvatarPicker, type AvatarPickerOptions } from './components/AvatarPicker';

export {
  initRotation,
  setRotation,
  toggleRotation,
  getRotation,
  rotateToPlayer,
  animateRotation,
  destroyRotation,
  type RotationState,
} from './rotation';
