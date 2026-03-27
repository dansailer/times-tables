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
import { CONFETTI_COLORS } from './constants';

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
  private boundResize: () => void = () => {};

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
      font-size: 0.8rem;
      font-weight: bold;
      color: #FF6B6B;
      text-shadow: 0 0 15px rgba(255, 107, 107, 0.7), 2px 2px 4px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      pointer-events: none;
      transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    `;
    document.body.appendChild(this.streakElement);

    // Handle resize
    this.boundResize = this.resize.bind(this);
    window.addEventListener('resize', this.boundResize);
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
   * @param streak Current streak count
   * @param isFast Whether the answer was fast
   * @param isRotated Whether to rotate 180° for player 2
   */
  celebrate(streak: number, isFast: boolean = false, isRotated: boolean = false): void {
    // Randomly choose celebration style
    const celebrationStyle = Math.random();
    
    if (celebrationStyle < 0.7) {
      // 70% chance: confetti burst from center
      this.spawnConfetti(Math.min(100, 30 + streak * 5));
    } else if (celebrationStyle < 0.9) {
      // 20% chance: confetti rain from top
      this.spawnConfettiRain(Math.min(120, 40 + streak * 3));
    }
    // 10% chance: no confetti, just message

    // Show encouraging message
    this.showMessage(streak, isFast, isRotated);

    // Show streak indicator if streak >= 3
    if (streak >= 3) {
      this.showStreak(streak, isRotated);
    }

    // Start animation loop if not running
    if (this.animationFrame === null) {
      this.animate();
    }
  }

  /**
   * Spawn confetti particles from center (burst effect)
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
   * Spawn confetti particles falling from top (rain effect)
   */
  private spawnConfettiRain(count: number): void {
    if (count <= 0) {
      return;
    }

    let spawned = 0;
    let intervalId: number | null = null;

    const spawnParticle = () => {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: -20,
        vx: (Math.random() - 0.5) * 2,
        vy: 3 + Math.random() * 3,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!,
        size: 6 + Math.random() * 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        life: 0,
        maxLife: 120 + Math.random() * 60,
      });

      // Ensure animation is running
      if (this.animationFrame === null) {
        this.animate();
      }

      spawned += 1;
      if (spawned >= count && intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Spawn first particle immediately, then stagger subsequent ones
    spawnParticle();
    if (spawned < count) {
      intervalId = window.setInterval(spawnParticle, 30); // Stagger by 30ms each
    }
  }

  /**
   * Show encouraging message
   */
  private showMessage(_streak: number, isFast: boolean, isRotated: boolean = false): void {
    if (!this.messageElement) return;

    let message: string;
    
    if (isFast) {
      message = t('celebration.fast');
    } else {
      const key = CORRECT_MESSAGE_KEYS[Math.floor(Math.random() * CORRECT_MESSAGE_KEYS.length)]!;
      message = t(key);
    }

    this.messageElement.textContent = message;
    const rotation = isRotated ? 'rotate(180deg)' : '';
    this.messageElement.style.transform = `translateX(-50%) scale(1) ${rotation}`;

    // Hide after delay
    setTimeout(() => {
      if (this.messageElement) {
        this.messageElement.style.transform = `translateX(-50%) scale(0) ${rotation}`;
      }
    }, 1500);
  }

  /**
   * Show streak indicator with flames
   */
  private showStreak(streak: number, isRotated: boolean = false): void {
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

    this.streakElement.textContent = `${flames} ${message} ${flames}`;
    const rotation = isRotated ? 'rotate(180deg)' : '';
    this.streakElement.style.transform = `translateX(-50%) scale(1) ${rotation}`;

    // Animate flames
    this.streakElement.style.animation = 'none';
    this.streakElement.offsetHeight; // Trigger reflow
    this.streakElement.style.animation = 'streak-pulse 0.5s ease-in-out 3';

    // Hide after delay
    setTimeout(() => {
      if (this.streakElement) {
        this.streakElement.style.transform = `translateX(-50%) scale(0) ${rotation}`;
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
    
    window.removeEventListener('resize', this.boundResize);
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
