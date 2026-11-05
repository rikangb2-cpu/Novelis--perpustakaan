// Synthesized Web Audio ambient sound generator for reading relaxation
// 100% offline, zero external audio network requests, zero broken assets!

export type AmbientSoundType = 'none' | 'rain' | 'fireplace' | 'waves' | 'cafe';

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private currentType: AmbientSoundType = 'none';
  private gainNode: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(type: AmbientSoundType) {
    if (this.currentType === type) return;
    this.stop();

    if (type === 'none') {
      this.currentType = 'none';
      return;
    }

    try {
      this.initContext();
      if (!this.ctx || !this.gainNode) return;

      this.currentType = type;

      // Create pink/brown noise buffer for natural calming sound
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          // Pink noise filter (soothing rain shower)
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        } else if (type === 'fireplace') {
          // Brown noise with randomized crackles
          b0 = (b0 + 0.02 * white) / 1.02;
          const crackle = Math.random() > 0.998 ? (Math.random() - 0.5) * 0.6 : 0;
          output[i] = b0 * 0.25 + crackle;
        } else if (type === 'waves') {
          // Slow modulated ocean surf
          b0 = (b0 + 0.015 * white) / 1.015;
          const mod = Math.sin((i / this.ctx.sampleRate) * Math.PI * 0.3);
          output[i] = b0 * 0.3 * (0.6 + 0.4 * mod);
        } else {
          // Cafe murmur / warm brown noise
          b0 = (b0 + 0.025 * white) / 1.025;
          output[i] = b0 * 0.15;
        }
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Lowpass filter to ensure gentle sound without harsh high frequencies
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(type === 'rain' ? 1200 : type === 'fireplace' ? 800 : 600, this.ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(this.gainNode);
      whiteNoise.start();

      this.noiseNode = whiteNoise;
    } catch (e) {
      console.warn('Audio synthesis not supported or blocked by user interaction policy', e);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public stop() {
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioBufferSourceNode).stop();
        this.noiseNode.disconnect();
      } catch (e) {
        // ignore
      }
      this.noiseNode = null;
    }
    this.currentType = 'none';
  }

  public getCurrentType(): AmbientSoundType {
    return this.currentType;
  }
}

export const ambientSound = new AmbientSoundEngine();
