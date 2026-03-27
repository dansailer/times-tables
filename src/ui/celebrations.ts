/**
 * Times Tables Quest - Celebration Engine
 * 
 * Visual celebration effects for correct answers:
 * - Confetti particles
 * - Encouraging messages
 * - Avatar animations
 * - Streak flames
 */

import { t, type TranslationKey } from '../i18n';

// Confetti particle interface
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  life: number;
  maxLife: number;
}

// Celebration colors (ocean theme inspired)
const CONFETTI_COLORS = [
  '#FFD700', // Gold
  '#FF6B6B', // Coral
  '#4ECDC4', // Teal
  '#45B7D1', // Sky blue
  '#96CEB4', // Mint
  '#FFEAA7', // Light yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Sea green
];

// Encouraging messages (random selection)
const CORRECT_MESSAGE_KEYS: TranslationKey[] = [
  'celebration.correct1',
  'celebration.correct2',
  'celebration.correct3',
  'celebration.correct4',
  'celebration.correct5',
  'celebration.correct6',
  'celebration.correct7',
  'celebration.correct8',
];

class CelebrationEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private animationFrame: number | null = null;
  private messageElement: HTMLElement | null = null;
  private streakElement: HTMLElement | null = null;

  /**
   * Initialize the celebration engine
   */
  init(): void {
    // Create canvas for confetti
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'celebration-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.resize();

    // Create message element
    this.messageElement = document.createElement('div');
    this.messageElement.id = 'celebration-message';
    this.messageElement.style.cssText = `
      position: fixed;
      top: 20%;
      left: 50%;
      transform: translateX(-50%) scale(0);
      font-size: 2.5rem;
      font-weight: bold;
      color: #FFD700;
      text-shadow: 0 0 10px rgba(255, 215, 0, 0.5), 2px 2px 4px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      pointer-events: none;
      transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    document.body.appendChild(this.messageElement);

    // Create streak element
    this.streakElement = document.createElement('div');
    this.streakElement.id = 'celebration-streak';
    this.streakElement.style.cssText = `
      position: fixed;
      top: 30%;
      left: 50%;
      transform: translateX(-50%) scale(0);
      font-size: 1.8rem;
      font-weight: bold;
      color: #FF6B6B;
      text-shadow: 0 0 15px rgba(255, 107, 107, 0.7), 2px 2px 4px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      pointer-events: none;
      transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    document.body.appendChild(this.streakElement);

    // Handle resize
    window.addEventListener('resize', this.resize.bind(this));
  }

  /**
   * Resize canvas to match window
   */
  private resize(): void {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  /**
   * Trigger celebration for correct answer
   */
  celebrate(streak: number, isFast: boolean = false): void {
    // Show confetti
    this.spawnConfetti(50 + streak * 10); // More confetti for higher streaks

    // Show encouraging message
    this.showMessage(streak, isFast);

    // Show streak indicator if streak >= 3
    if (streak >= 3) {
      this.showStreak(streak);
    }

    // Start animation loop if not running
    if (this.animationFrame === null) {
      this.animate();
    }
  }

  /**
   * Spawn confetti particles
   */
  private spawnConfetti(count: number): void {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      const angle = (Math.random() * Math.PI * 2);
      const velocity = 8 + Math.random() * 8;
      
      this.particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 5, // Slight upward bias
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!,
        size: 6 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        life: 0,
        maxLife: 80 + Math.random() * 40,
      });
    }
  }

  /**
   * Show encouraging message
   */
  private showMessage(_streak: number, isFast: boolean): void {
    if (!this.messageElement) return;

    let message: string;
    
    if (isFast) {
      message = t('celebration.fast');
    } else {
      const key = CORRECT_MESSAGE_KEYS[Math.floor(Math.random() * CORRECT_MESSAGE_KEYS.length)]!;
      message = t(key);
    }

    this.messageElement.textContent = message;
    this.messageElement.style.transform = 'translateX(-50%) scale(1)';

    // Hide after delay
    setTimeout(() => {
      if (this.messageElement) {
        this.messageElement.style.transform = 'translateX(-50%) scale(0)';
      }
    }, 1500);
  }

  /**
   * Show streak indicator with flames
   */
  private showStreak(streak: number): void {
    if (!this.streakElement) return;

    let message: string;
    let flames = '';

    if (streak >= 10) {
      message = t('celebration.streak10');
      flames = '🔥🔥🔥';
    } else if (streak >= 5) {
      message = t('celebration.streak5');
      flames = '🔥🔥';
    } else {
      message = t('celebration.streak3');
      flames = '🔥';
    }

    this.streakElement.innerHTML = `${flames} ${streak} ${message} ${flames}`;
    this.streakElement.style.transform = 'translateX(-50%) scale(1)';

    // Animate flames
    this.streakElement.style.animation = 'none';
    this.streakElement.offsetHeight; // Trigger reflow
    this.streakElement.style.animation = 'streak-pulse 0.5s ease-in-out 3';

    // Hide after delay
    setTimeout(() => {
      if (this.streakElement) {
        this.streakElement.style.transform = 'translateX(-50%) scale(0)';
      }
    }, 2000);
  }

  /**
   * Animation loop
   */
  private animate(): void {
    if (!this.ctx || !this.canvas) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]!;

      // Update physics
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // Gravity
      p.vx *= 0.99; // Air resistance
      p.rotation += p.rotationSpeed;
      p.life++;

      // Calculate opacity based on life
      const lifeRatio = p.life / p.maxLife;
      const opacity = 1 - lifeRatio;

      // Remove dead particles
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }

      // Draw particle
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = opacity;
      this.ctx.fillStyle = p.color;
      
      // Draw rectangle confetti
      this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      
      this.ctx.restore();
    }

    // Continue animation if particles exist
    if (this.particles.length > 0) {
      this.animationFrame = requestAnimationFrame(this.animate.bind(this));
    } else {
      this.animationFrame = null;
    }
  }

  /**
   * Apply bounce animation to avatar element
   */
  bounceAvatar(avatarElement: HTMLElement): void {
    avatarElement.style.animation = 'none';
    avatarElement.offsetHeight; // Trigger reflow
    avatarElement.style.animation = 'avatar-bounce 0.6s ease-out';
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    
    this.canvas?.remove();
    this.messageElement?.remove();
    this.streakElement?.remove();
    
    window.removeEventListener('resize', this.resize.bind(this));
  }
}

// CSS animations (injected once)
const celebrationStyles = document.createElement('style');
celebrationStyles.textContent = `
  @keyframes avatar-bounce {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.2) rotate(-5deg); }
    50% { transform: scale(1.1) rotate(5deg); }
    75% { transform: scale(1.15) rotate(-3deg); }
  }

  @keyframes streak-pulse {
    0%, 100% { transform: translateX(-50%) scale(1); }
    50% { transform: translateX(-50%) scale(1.15); }
  }
`;
document.head.appendChild(celebrationStyles);

// Singleton instance
export const celebrationEngine = new CelebrationEngine();
