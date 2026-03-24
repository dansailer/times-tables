/**
 * Times Tables Quest - Screen Rotation
 * 
 * Handles 180° rotation for two-player mode.
 */

export type RotationState = 'player1' | 'player2';

// Current rotation state
let currentRotation: RotationState = 'player1';
let rotationElement: HTMLElement | null = null;

/**
 * Initialize rotation system
 * 
 * @param element - The element to rotate (usually #app or a screen container)
 */
export function initRotation(element: HTMLElement): void {
  rotationElement = element;
  rotationElement.classList.add('rotatable');
  setRotation('player1');
}

/**
 * Set rotation state
 * 
 * @param state - 'player1' (0°) or 'player2' (180°)
 */
export function setRotation(state: RotationState): void {
  currentRotation = state;
  
  if (!rotationElement) {
    console.warn('[Rotation] No element initialized');
    return;
  }

  if (state === 'player2') {
    rotationElement.classList.add('rotatable--rotated');
  } else {
    rotationElement.classList.remove('rotatable--rotated');
  }
}

/**
 * Toggle rotation between players
 */
export function toggleRotation(): void {
  const newState = currentRotation === 'player1' ? 'player2' : 'player1';
  setRotation(newState);
}

/**
 * Get current rotation state
 */
export function getRotation(): RotationState {
  return currentRotation;
}

/**
 * Rotate to specific player
 * 
 * @param playerId - Player ID (1 or 2)
 */
export function rotateToPlayer(playerId: 1 | 2): void {
  setRotation(playerId === 1 ? 'player1' : 'player2');
}

/**
 * Animate rotation with callback
 * 
 * @param state - Target rotation state
 * @param onComplete - Callback after animation completes
 */
export function animateRotation(state: RotationState, onComplete?: () => void): void {
  if (!rotationElement) {
    onComplete?.();
    return;
  }

  // Add transition class for animation
  rotationElement.classList.add('rotatable--animating');
  
  // Set rotation
  setRotation(state);

  // Wait for animation to complete
  const handleTransitionEnd = (e: TransitionEvent) => {
    if (e.propertyName === 'transform') {
      rotationElement?.classList.remove('rotatable--animating');
      rotationElement?.removeEventListener('transitionend', handleTransitionEnd);
      onComplete?.();
    }
  };

  rotationElement.addEventListener('transitionend', handleTransitionEnd);

  // Fallback timeout in case transition doesn't fire
  setTimeout(() => {
    rotationElement?.classList.remove('rotatable--animating');
    rotationElement?.removeEventListener('transitionend', handleTransitionEnd);
    onComplete?.();
  }, 600);
}

/**
 * Clean up rotation system
 */
export function destroyRotation(): void {
  if (rotationElement) {
    rotationElement.classList.remove('rotatable', 'rotatable--rotated', 'rotatable--animating');
  }
  rotationElement = null;
  currentRotation = 'player1';
}
