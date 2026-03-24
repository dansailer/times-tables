/**
 * Times Tables Quest - Avatar Picker Component
 * 
 * Grid of avatar options for player selection.
 */

import { Component } from './Component';
import { t, type TranslationKey } from '../../i18n';
import { AVATARS, type Avatar } from '../../game/types';

export interface AvatarPickerOptions {
  /** Currently selected avatar ID */
  selectedId?: string;
  /** Avatar IDs to disable (already selected by other player) */
  disabledIds?: string[];
  /** Callback when avatar is selected */
  onSelect?: (avatar: Avatar) => void;
  /** Player number for labeling */
  playerNumber?: 1 | 2;
}

export class AvatarPicker extends Component {
  private selectedId: string | null;
  private disabledIds: Set<string>;
  private onSelect?: (avatar: Avatar) => void;
  private touchHandled: boolean = false;

  constructor(options: AvatarPickerOptions = {}) {
    super('div');
    
    this.selectedId = options.selectedId ?? null;
    this.disabledIds = new Set(options.disabledIds ?? []);
    this.onSelect = options.onSelect;

    this.addClass('avatar-picker');
    this.element.setAttribute('role', 'radiogroup');
    this.element.setAttribute('aria-label', t('setup.selectAvatar'));

    this.render();
  }

  /**
   * Render the avatar grid
   */
  render(): void {
    this.element.innerHTML = '';

    // Create grid of avatars
    const grid = document.createElement('div');
    grid.className = 'avatar-picker__grid';

    for (const avatar of AVATARS) {
      const isSelected = avatar.id === this.selectedId;
      const isDisabled = this.disabledIds.has(avatar.id);
      
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'avatar-picker__option';
      button.dataset.avatarId = avatar.id;
      button.disabled = isDisabled;
      button.setAttribute('role', 'radio');
      button.setAttribute('aria-checked', String(isSelected));
      button.setAttribute('aria-label', t(avatar.nameKey as TranslationKey));
      
      if (isSelected) {
        button.classList.add('avatar-picker__option--selected');
      }
      if (isDisabled) {
        button.classList.add('avatar-picker__option--disabled');
      }

      // Avatar emoji
      const emoji = document.createElement('span');
      emoji.className = 'avatar-picker__emoji';
      emoji.textContent = avatar.emoji;
      button.appendChild(emoji);

      // Avatar name
      const name = document.createElement('span');
      name.className = 'avatar-picker__name';
      name.textContent = t(avatar.nameKey as TranslationKey);
      button.appendChild(name);

      // Click handler
      if (!isDisabled) {
        button.addEventListener('touchend', (e) => {
          if (!isDisabled) {
            e.preventDefault();
            this.touchHandled = true;
            this.selectAvatar(avatar);
            // Reset flag after a short delay
            setTimeout(() => { this.touchHandled = false; }, 100);
          }
        });
        
        button.addEventListener('click', (e) => {
          e.preventDefault();
          // Only handle click if not already handled by touch
          if (!this.touchHandled) {
            this.selectAvatar(avatar);
          }
        });
      }

      grid.appendChild(button);
    }

    this.element.appendChild(grid);
  }

  /**
   * Handle avatar selection
   */
  private selectAvatar(avatar: Avatar): void {
    if (this.disabledIds.has(avatar.id)) {
      return;
    }

    this.selectedId = avatar.id;
    this.render();
    this.onSelect?.(avatar);
  }

  /**
   * Get currently selected avatar
   */
  getSelectedAvatar(): Avatar | null {
    return AVATARS.find(a => a.id === this.selectedId) ?? null;
  }

  /**
   * Set selected avatar
   */
  setSelected(avatarId: string): void {
    this.selectedId = avatarId;
    this.render();
  }

  /**
   * Set disabled avatars
   */
  setDisabled(avatarIds: string[]): void {
    this.disabledIds = new Set(avatarIds);
    this.render();
  }

  /**
   * Reset picker
   */
  reset(): void {
    this.selectedId = null;
    this.disabledIds.clear();
    this.render();
  }

  /**
   * Set select callback
   */
  setOnSelect(callback: (avatar: Avatar) => void): void {
    this.onSelect = callback;
  }
}
