/**
 * Times Tables Quest - Sound Engine
 * 
 * Web Audio API-based sound synthesis for game effects.
 * No external audio files needed - all sounds are synthesized.
 * 
 * Sounds:
 * - correct: Pleasant ascending chime
 * - wrong: Descending buzz
 * - tick: Subtle click for timer
 * - tickWarning: Urgent tick for final seconds
 * - timeout: Time's up sound
 * - cheer: Victory celebration with crowd cheer effect
 * - buttonClick: UI feedback
 */

type SoundType = 'correct' | 'wrong' | 'tick' | 'tickWarning' | 'timeout' | 'cheer' | 'buttonClick';

class SoundEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled: boolean = true;
  private initialized: boolean = false;
  
  /**
   * Initialize the audio context (must be called from user interaction)
   */
  init(): void {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.5;
      this.initialized = true;
    } catch {
      // Mark as initialized to avoid repeated failing attempts; disable audio
      this.initialized = true;
      this.enabled = false;
    }
  }
  
  /**
   * Resume audio context (needed for iOS Safari)
   */
  async resume(): Promise<void> {
    try {
      if (this.audioContext?.state === 'suspended') {
        await this.audioContext.resume();
      }
    } catch {
      // Silently ignore - audio just won't play
    }
  }
  
  /**
   * Enable or disable all sounds
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
  
  /**
   * Check if sounds are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
  
  /**
   * Set master volume (0-1)
   */
  setVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }
  
  /**
   * Play a sound effect
   */
  play(type: SoundType): void {
    // Auto-initialize if not done yet (fallback)
    if (!this.initialized) {
      this.init();
    }
    
    if (!this.enabled || !this.audioContext || !this.masterGain) {
      return;
    }
    
    // Ensure context is running (iOS requires this on each interaction)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().then(() => {
        this.playSound(type);
      }).catch(() => {
        // Silently ignore - audio just won't play
      });
    } else {
      this.playSound(type);
    }
  }
  
  /**
   * Internal: actually play the sound
   */
  private playSound(type: SoundType): void {
    switch (type) {
      case 'correct':
        this.playCorrect();
        break;
      case 'wrong':
        this.playWrong();
        break;
      case 'tick':
        this.playTick(false);
        break;
      case 'tickWarning':
        this.playTick(true);
        break;
      case 'timeout':
        this.playTimeout();
        break;
      case 'cheer':
        this.playCheer();
        break;
      case 'buttonClick':
        this.playButtonClick();
        break;
    }
  }
  
  /**
   * Correct answer - pleasant ascending chime (C-E-G arpeggio)
   */
  private playCorrect(): void {
    const ctx = this.audioContext!;
    const now = ctx.currentTime;
    
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    const duration = 0.15;
    
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.3, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + duration);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + duration);
    });
  }
  
  /**
   * Wrong answer - descending buzz
   */
  private playWrong(): void {
    const ctx = this.audioContext!;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start(now);
    osc.stop(now + 0.3);
  }
  
  /**
   * Timer tick - subtle click
   */
  private playTick(warning: boolean): void {
    const ctx = this.audioContext!;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = warning ? 880 : 440; // A5 for warning, A4 normal
    
    const volume = warning ? 0.2 : 0.1;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start(now);
    osc.stop(now + 0.05);
  }
  
  /**
   * Timeout - descending tone
   */
  private playTimeout(): void {
    const ctx = this.audioContext!;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.5);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start(now);
    osc.stop(now + 0.5);
  }
  
  /**
   * Button click - quick blip
   */
  private playButtonClick(): void {
    const ctx = this.audioContext!;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = 600;
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
    
    osc.connect(gain);
    gain.connect(this.masterGain!);
    
    osc.start(now);
    osc.stop(now + 0.03);
  }

  /**
   * Victory cheer - celebratory crowd-like sound with rising tones
   * Creates a multi-layered effect simulating cheering
   */
  private playCheer(): void {
    const ctx = this.audioContext!;
    const now = ctx.currentTime;

    // Layer 1: Rising triumphant melody (main theme)
    const melodyNotes = [
      { freq: 523.25, start: 0, duration: 0.15 },      // C5
      { freq: 659.25, start: 0.12, duration: 0.15 },   // E5
      { freq: 783.99, start: 0.24, duration: 0.15 },   // G5
      { freq: 1046.50, start: 0.36, duration: 0.4 },   // C6 (high, held)
    ];

    melodyNotes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = note.freq;
      
      gain.gain.setValueAtTime(0, now + note.start);
      gain.gain.linearRampToValueAtTime(0.15, now + note.start + 0.03);
      gain.gain.setValueAtTime(0.15, now + note.start + note.duration - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + note.start + note.duration);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start(now + note.start);
      osc.stop(now + note.start + note.duration);
    });

    // Layer 2: Crowd noise simulation using filtered noise
    const noiseLength = 1.2;
    const bufferSize = ctx.sampleRate * noiseLength;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    
    // Bandpass filter to make it sound more like voices
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 0.5;
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.08, now + 0.1);
    noiseGain.gain.setValueAtTime(0.08, now + 0.5);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + noiseLength);
    
    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain!);
    
    noiseSource.start(now);
    noiseSource.stop(now + noiseLength);

    // Layer 3: Bass foundation for power
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    
    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(130.81, now); // C3
    bassOsc.frequency.linearRampToValueAtTime(261.63, now + 0.8); // Rise to C4
    
    bassGain.gain.setValueAtTime(0.15, now);
    bassGain.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
    
    bassOsc.connect(bassGain);
    bassGain.connect(this.masterGain!);
    
    bassOsc.start(now);
    bassOsc.stop(now + 1.0);

    // Layer 4: Sparkle/shimmer effect (high frequency arpeggios)
    const sparkleNotes = [
      { freq: 1318.51, start: 0.5 },  // E6
      { freq: 1567.98, start: 0.55 }, // G6
      { freq: 2093.00, start: 0.6 },  // C7
      { freq: 1567.98, start: 0.65 }, // G6
      { freq: 2093.00, start: 0.7 },  // C7
    ];

    sparkleNotes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = note.freq;
      
      gain.gain.setValueAtTime(0, now + note.start);
      gain.gain.linearRampToValueAtTime(0.06, now + note.start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, now + note.start + 0.12);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start(now + note.start);
      osc.stop(now + note.start + 0.15);
    });
  }
}

// Singleton instance
export const soundEngine = new SoundEngine();
