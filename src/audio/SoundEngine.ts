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
 * - fanfare: Victory celebration
 * - buttonClick: UI feedback
 */

type SoundType = 'correct' | 'wrong' | 'tick' | 'tickWarning' | 'timeout' | 'fanfare' | 'buttonClick';

class SoundEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private enabled: boolean = true;
  
  /**
   * Initialize the audio context (must be called from user interaction)
   */
  init(): void {
    if (this.audioContext) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.5;
    } catch (e) {
      console.warn('[SoundEngine] Web Audio API not supported:', e);
      this.enabled = false;
    }
  }
  
  /**
   * Resume audio context (needed for iOS Safari)
   */
  async resume(): Promise<void> {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
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
    if (!this.enabled || !this.audioContext || !this.masterGain) return;
    
    // Ensure context is running
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
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
      case 'fanfare':
        this.playFanfare();
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
   * Victory fanfare - triumphant melody
   */
  private playFanfare(): void {
    const ctx = this.audioContext!;
    const now = ctx.currentTime;
    
    // Fanfare melody: G-C-E-G (octave higher)
    const notes = [
      { freq: 392.00, start: 0, duration: 0.15 },     // G4
      { freq: 523.25, start: 0.15, duration: 0.15 },  // C5
      { freq: 659.25, start: 0.30, duration: 0.15 },  // E5
      { freq: 783.99, start: 0.45, duration: 0.4 },   // G5 (held)
    ];
    
    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.value = note.freq;
      
      gain.gain.setValueAtTime(0, now + note.start);
      gain.gain.linearRampToValueAtTime(0.15, now + note.start + 0.02);
      gain.gain.setValueAtTime(0.15, now + note.start + note.duration - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + note.start + note.duration);
      
      osc.connect(gain);
      gain.connect(this.masterGain!);
      
      osc.start(now + note.start);
      osc.stop(now + note.start + note.duration);
    });
    
    // Add a bass note for depth
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    
    bassOsc.type = 'sine';
    bassOsc.frequency.value = 130.81; // C3
    
    bassGain.gain.setValueAtTime(0.2, now);
    bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    
    bassOsc.connect(bassGain);
    bassGain.connect(this.masterGain!);
    
    bassOsc.start(now);
    bassOsc.stop(now + 0.8);
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
}

// Singleton instance
export const soundEngine = new SoundEngine();
