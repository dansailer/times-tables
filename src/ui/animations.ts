/**
 * Times Tables Quest - Animation Helpers
 * 
 * JavaScript helpers for triggering and managing animations.
 */

/**
 * Confetti colors for celebrations
 */
const CONFETTI_COLORS = [
  '#FFD700', // Gold
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
];

/**
 * Confetti shapes
 */
type ConfettiShape = 'circle' | 'square' | 'triangle';

/**
 * Create a single confetti piece
 */
function createConfettiPiece(container: HTMLElement): HTMLElement {
  const piece = document.createElement('div');
  piece.className = 'confetti';
  
  // Random shape
  const shapes: ConfettiShape[] = ['circle', 'square', 'triangle'];
  const shape = shapes[Math.floor(Math.random() * shapes.length)]!;
  piece.classList.add(`confetti--${shape}`);
  
  // Random color
  const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!;
  if (shape === 'triangle') {
    piece.style.borderBottomColor = color;
  } else {
    piece.style.backgroundColor = color;
  }
  
  // Random position
  piece.style.left = `${Math.random() * 100}%`;
  
  // Random size
  const size = 8 + Math.random() * 8;
  if (shape !== 'triangle') {
    piece.style.width = `${size}px`;
    piece.style.height = `${size}px`;
  }
  
  // Random animation duration and delay
  const duration = 2 + Math.random() * 2;
  const delay = Math.random() * 0.5;
  piece.style.animationDuration = `${duration}s`;
  piece.style.animationDelay = `${delay}s`;
  
  container.appendChild(piece);
  
  // Remove after animation
  setTimeout(() => {
    piece.remove();
  }, (duration + delay) * 1000 + 100);
  
  return piece;
}

/**
 * Launch confetti celebration
 */
export function launchConfetti(count: number = 50): void {
  // Create container if it doesn't exist
  let container = document.querySelector('.confetti-container') as HTMLElement;
  if (!container) {
    container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);
  }
  
  // Track max lifetime for cleanup
  let maxLifetime = 0;
  
  // Create confetti pieces in batches
  const batchSize = 10;
  let created = 0;
  
  const createBatch = () => {
    const toCreate = Math.min(batchSize, count - created);
    for (let i = 0; i < toCreate; i++) {
      const piece = createConfettiPiece(container);
      // Track the longest animation duration for cleanup
      const duration = parseFloat(piece.style.animationDuration) || 4;
      const delay = parseFloat(piece.style.animationDelay) || 0.5;
      maxLifetime = Math.max(maxLifetime, (duration + delay) * 1000);
    }
    created += toCreate;
    
    if (created < count) {
      requestAnimationFrame(createBatch);
    }
  };
  
  createBatch();
  
  // Clean up container after all confetti has definitely fallen
  // Add extra buffer time to ensure all pieces are removed
  setTimeout(() => {
    container.remove();
  }, maxLifetime + 500);
}

/**
 * Apply shake animation to an element
 */
export function shakeElement(element: HTMLElement): Promise<void> {
  return new Promise(resolve => {
    element.classList.add('animate-shake');
    
    const handleEnd = () => {
      element.classList.remove('animate-shake');
      element.removeEventListener('animationend', handleEnd);
      resolve();
    };
    
    element.addEventListener('animationend', handleEnd);
  });
}

/**
 * Apply pulse animation to an element
 */
export function pulseElement(element: HTMLElement): Promise<void> {
  return new Promise(resolve => {
    element.classList.add('animate-pulse');
    
    const handleEnd = () => {
      element.classList.remove('animate-pulse');
      element.removeEventListener('animationend', handleEnd);
      resolve();
    };
    
    element.addEventListener('animationend', handleEnd);
  });
}

/**
 * Apply pop-in animation to an element
 */
export function popInElement(element: HTMLElement): Promise<void> {
  return new Promise(resolve => {
    element.classList.add('animate-pop-in');
    
    const handleEnd = () => {
      element.removeEventListener('animationend', handleEnd);
      resolve();
    };
    
    element.addEventListener('animationend', handleEnd);
  });
}

/**
 * Apply bounce animation to an element
 */
export function startBounce(element: HTMLElement): void {
  element.classList.add('animate-bounce');
}

/**
 * Stop bounce animation
 */
export function stopBounce(element: HTMLElement): void {
  element.classList.remove('animate-bounce');
}

/**
 * Apply glow animation to an element
 */
export function startGlow(element: HTMLElement): void {
  element.classList.add('animate-glow');
}

/**
 * Stop glow animation
 */
export function stopGlow(element: HTMLElement): void {
  element.classList.remove('animate-glow');
}

/**
 * Fade in an element
 */
export function fadeIn(element: HTMLElement): Promise<void> {
  return new Promise(resolve => {
    element.classList.remove('animate-fade-out');
    element.classList.add('animate-fade-in');
    
    const handleEnd = () => {
      element.removeEventListener('animationend', handleEnd);
      resolve();
    };
    
    element.addEventListener('animationend', handleEnd);
  });
}

/**
 * Fade out an element
 */
export function fadeOut(element: HTMLElement): Promise<void> {
  return new Promise(resolve => {
    element.classList.remove('animate-fade-in');
    element.classList.add('animate-fade-out');
    
    const handleEnd = () => {
      element.removeEventListener('animationend', handleEnd);
      resolve();
    };
    
    element.addEventListener('animationend', handleEnd);
  });
}

/**
 * Slide up animation
 */
export function slideUp(element: HTMLElement): Promise<void> {
  return new Promise(resolve => {
    element.classList.add('animate-slide-up');
    
    const handleEnd = () => {
      element.removeEventListener('animationend', handleEnd);
      resolve();
    };
    
    element.addEventListener('animationend', handleEnd);
  });
}

/**
 * Create and show celebration stars around an element
 */
export function showStars(element: HTMLElement, count: number = 5): void {
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.textContent = '⭐';
    star.style.cssText = `
      position: fixed;
      left: ${centerX}px;
      top: ${centerY}px;
      font-size: 24px;
      pointer-events: none;
      z-index: 1001;
      animation: starBurst 0.8s ease-out forwards;
      animation-delay: ${i * 0.1}s;
    `;
    
    // Random direction
    const angle = (i / count) * Math.PI * 2;
    const distance = 50 + Math.random() * 30;
    star.style.setProperty('--star-x', `${Math.cos(angle) * distance}px`);
    star.style.setProperty('--star-y', `${Math.sin(angle) * distance}px`);
    
    document.body.appendChild(star);
    
    // Remove after animation
    setTimeout(() => {
      star.remove();
    }, 1000);
  }
}
