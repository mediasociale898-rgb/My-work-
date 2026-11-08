/**
 * Procedural Web Audio API soundscape & brainwave generator.
 * Fully client-side, zero external audio asset dependencies, works offline.
 */

export type FocusSoundTrackType =
  | 'key-brain-alpha'
  | 'key-brain-theta'
  | 'key-brain-gamma'
  | 'key-brain-pineal'
  | 'color-music-gibran'
  | 'color-music-amber'
  | 'color-music-cyan'
  | 'color-music-emerald'
  | 'drone'
  | 'rain'
  | 'whitenoise'
  | 'forest-stream';

export interface FocusTrackInfo {
  id: FocusSoundTrackType;
  label: string;
  category: 'key-brain' | 'color-music' | 'ambient';
  color: string;
  description: string;
}

export const FOCUS_TRACK_LIST: FocusTrackInfo[] = [
  {
    id: 'key-brain-alpha',
    label: 'Key Brain: Alpha Flow (10Hz)',
    category: 'key-brain',
    color: 'from-cyan-400 to-blue-500',
    description: '10Hz binaural beat over 432Hz carrier for effortless calm concentration.',
  },
  {
    id: 'key-brain-theta',
    label: 'Key Brain: Theta Waves (6Hz)',
    category: 'key-brain',
    color: 'from-indigo-500 to-purple-600',
    description: '6Hz deep theta entrainment for intense coding and creative problem solving.',
  },
  {
    id: 'key-brain-gamma',
    label: 'Key Brain: Gamma Burst (40Hz)',
    category: 'key-brain',
    color: 'from-amber-400 to-orange-500',
    description: '40Hz high cognitive processing and memory consolidation pulse.',
  },
  {
    id: 'key-brain-pineal',
    label: 'Key Brain: 432Hz & 528Hz Solfeggio',
    category: 'key-brain',
    color: 'from-violet-400 to-fuchsia-600',
    description: 'Sacred harmonic dual frequency resonance for mental clarity and restoration.',
  },
  {
    id: 'color-music-gibran',
    label: 'Color Music: Gibran Cyan & Amber',
    category: 'color-music',
    color: 'from-amber-400 to-cyan-400',
    description: 'Kahlil Gibran synesthetic chordal drone in D Minor with warm color filter sweep.',
  },
  {
    id: 'color-music-amber',
    label: 'Color Music: Solar Amber (528Hz)',
    category: 'color-music',
    color: 'from-yellow-400 to-orange-500',
    description: 'Warm golden solar drone with rich sub-octaves and harmonic brilliance.',
  },
  {
    id: 'color-music-cyan',
    label: 'Color Music: Deep Ocean Cyan',
    category: 'color-music',
    color: 'from-cyan-400 to-teal-500',
    description: 'Atmospheric royal cyan spatial frequency stream with smooth reflections.',
  },
  {
    id: 'color-music-emerald',
    label: 'Color Music: Emerald Resonance',
    category: 'color-music',
    color: 'from-emerald-400 to-teal-600',
    description: 'Spring nature harmonic 528Hz with gentle binaural undertones.',
  },
  {
    id: 'drone',
    label: 'Cosmic Deep Drone',
    category: 'ambient',
    color: 'from-blue-600 to-indigo-800',
    description: 'Analog sawtooth dual detuned cosmic space drone.',
  },
  {
    id: 'rain',
    label: 'Soft Rainfall',
    category: 'ambient',
    color: 'from-slate-400 to-blue-500',
    description: 'Procedural gentle rain resonance on glass.',
  },
  {
    id: 'forest-stream',
    label: 'Forest River Ambient',
    category: 'ambient',
    color: 'from-emerald-500 to-teal-700',
    description: 'Procedural rippling water stream with natural modulation.',
  },
  {
    id: 'whitenoise',
    label: 'Pink / Focus Noise',
    category: 'ambient',
    color: 'from-rose-400 to-pink-600',
    description: 'Calibrated acoustic masking for speech and environmental distractions.',
  },
];

export type MusicVibePlaylist = 'chill' | 'energize' | 'work';

export interface VibePlaylistInfo {
  id: MusicVibePlaylist;
  title: string;
  tagline: string;
  badge: string;
  color: string;
  trackIds: FocusSoundTrackType[];
  description: string;
}

export const VIBE_PLAYLISTS: Record<MusicVibePlaylist, VibePlaylistInfo> = {
  chill: {
    id: 'chill',
    title: 'Chill & Unwind',
    tagline: 'Ambient Calm & Nature Immersion',
    badge: '☕ Chill',
    color: 'from-emerald-400 to-teal-500',
    trackIds: ['rain', 'forest-stream', 'color-music-emerald', 'color-music-cyan'],
    description: 'Soft rainfall, forest river resonance, 528Hz emerald nature, and deep oceanic frequencies.',
  },
  energize: {
    id: 'energize',
    title: 'High Energy & Spark',
    tagline: 'Rapid Cognition & Momentum',
    badge: '⚡ Energize',
    color: 'from-amber-400 to-orange-500',
    trackIds: ['key-brain-gamma', 'color-music-amber', 'key-brain-pineal'],
    description: '40Hz Gamma bursts, 528Hz Solar Amber harmonic drone, and dual Solfeggio frequency pulse.',
  },
  work: {
    id: 'work',
    title: 'Deep Work Flow',
    tagline: 'Zero Distraction Concentration',
    badge: '💼 Deep Work',
    color: 'from-cyan-400 to-blue-600',
    trackIds: ['key-brain-alpha', 'key-brain-theta', 'color-music-gibran', 'whitenoise'],
    description: '10Hz Alpha flow, 6Hz deep Theta entrainment, Gibran D-Minor synesthetic chordal drone, and speech-masking noise.',
  },
};

class AudioSynthesizer {
  private ctx: AudioContext | null = null;
  private currentTrack: FocusSoundTrackType | null = null;
  private currentPlaylist: MusicVibePlaylist | null = null;
  private currentPlaylistIndex: number = 0;
  private activeNodes: { stop?: () => void; disconnect?: () => void }[] = [];
  private masterGain: GainNode | null = null;
  private volume: number = 0.5;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentTrack(): FocusSoundTrackType | null {
    return this.currentTrack;
  }

  public getCurrentPlaylist(): MusicVibePlaylist | null {
    return this.currentPlaylist;
  }

  public getCurrentPlaylistIndex(): number {
    return this.currentPlaylistIndex;
  }

  public playPlaylist(playlistId: MusicVibePlaylist, trackIndex = 0) {
    const playlist = VIBE_PLAYLISTS[playlistId];
    if (!playlist || playlist.trackIds.length === 0) return;
    this.currentPlaylist = playlistId;
    this.currentPlaylistIndex = (trackIndex + playlist.trackIds.length) % playlist.trackIds.length;
    const track = playlist.trackIds[this.currentPlaylistIndex];
    this.play(track);
  }

  public nextTrack() {
    if (!this.currentPlaylist) return;
    this.playPlaylist(this.currentPlaylist, this.currentPlaylistIndex + 1);
  }

  public prevTrack() {
    if (!this.currentPlaylist) return;
    this.playPlaylist(this.currentPlaylist, this.currentPlaylistIndex - 1);
  }

  public stop() {
    this.activeNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // ignore already stopped nodes
      }
    });
    this.activeNodes = [];
    this.currentTrack = null;
  }

  public play(trackType: FocusSoundTrackType) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    this.stop();
    this.currentTrack = trackType;

    switch (trackType) {
      case 'key-brain-alpha':
        this.startBinauralBeats(432, 10, 'sine', 0.28);
        this.addSoftNoiseBed(300, 800, 0.05);
        break;
      case 'key-brain-theta':
        this.startBinauralBeats(216, 6, 'sine', 0.32);
        this.addSubBassDrone(54, 0.15);
        break;
      case 'key-brain-gamma':
        this.startBinauralBeats(320, 40, 'triangle', 0.25);
        break;
      case 'key-brain-pineal':
        this.startDualToneSolfeggio(432, 528);
        break;
      case 'color-music-gibran':
        this.startColorMusicGibran();
        break;
      case 'color-music-amber':
        this.startColorMusicAmber();
        break;
      case 'color-music-cyan':
        this.startColorMusicCyan();
        break;
      case 'color-music-emerald':
        this.startColorMusicEmerald();
        break;
      case 'drone':
        this.startCosmicDrone();
        break;
      case 'rain':
        this.startRainSynth();
        break;
      case 'forest-stream':
        this.startForestStream();
        break;
      case 'whitenoise':
      default:
        this.startFilteredNoise(400, 1200);
        break;
    }
  }

  private startBinauralBeats(carrierFreq: number, beatOffset: number, oscType: OscillatorType = 'sine', gainVal = 0.3) {
    if (!this.ctx || !this.masterGain) return;

    const oscL = this.ctx.createOscillator();
    oscL.type = oscType;
    oscL.frequency.setValueAtTime(carrierFreq, this.ctx.currentTime);

    const oscR = this.ctx.createOscillator();
    oscR.type = oscType;
    oscR.frequency.setValueAtTime(carrierFreq + beatOffset, this.ctx.currentTime);

    const merger = this.ctx.createChannelMerger(2);
    oscL.connect(merger, 0, 0); // Left channel
    oscR.connect(merger, 0, 1); // Right channel

    const beatGain = this.ctx.createGain();
    beatGain.gain.setValueAtTime(gainVal, this.ctx.currentTime);

    merger.connect(beatGain);
    beatGain.connect(this.masterGain);

    oscL.start();
    oscR.start();

    this.activeNodes.push(oscL, oscR, merger, beatGain);
  }

  private addSubBassDrone(freq: number, gainVal = 0.15) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    this.activeNodes.push(osc, gain);
  }

  private addSoftNoiseBed(lowCut: number, highCut: number, gainVal = 0.05) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime((lowCut + highCut) / 2, this.ctx.currentTime);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start();
    this.activeNodes.push(noise, filter, gain);
  }

  private startDualToneSolfeggio(f1: number, f2: number) {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(f1, this.ctx.currentTime);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(f2, this.ctx.currentTime);

    const pan1 = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const pan2 = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (pan1) pan1.pan.setValueAtTime(-0.4, this.ctx.currentTime);
    if (pan2) pan2.pan.setValueAtTime(0.4, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.24, this.ctx.currentTime);

    if (pan1 && pan2) {
      osc1.connect(pan1);
      pan1.connect(gain);
      osc2.connect(pan2);
      pan2.connect(gain);
      this.activeNodes.push(pan1, pan2);
    } else {
      osc1.connect(gain);
      osc2.connect(gain);
    }

    gain.connect(this.masterGain);
    osc1.start();
    osc2.start();
    this.activeNodes.push(osc1, osc2, gain);
  }

  private startColorMusicGibran() {
    if (!this.ctx || !this.masterGain) return;

    // Multi-voice chordal pad in D Minor: D3 (146.8Hz), A3 (220Hz), F4 (349.2Hz), C5 (523.2Hz)
    const freqs = [146.83, 220.0, 349.23, 523.25];
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.22, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

    // Warm LFO color modulation
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.1, this.ctx.currentTime); // 10s period
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(280, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.connect(filter);
      osc.start();
      this.activeNodes.push(osc);
    });

    filter.connect(gain);
    gain.connect(this.masterGain);
    lfo.start();
    this.activeNodes.push(filter, lfo, lfoGain, gain);
  }

  private startColorMusicAmber() {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(264, this.ctx.currentTime); // C4

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(528, this.ctx.currentTime); // 528Hz Solfeggio amber

    const sub = this.ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(132, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(550, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    sub.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    sub.start();
    this.activeNodes.push(osc1, osc2, sub, filter, gain);
  }

  private startColorMusicCyan() {
    if (!this.ctx || !this.masterGain) return;

    // Oceanic spatial cyan tones at G4 (392Hz) and D5 (587.3Hz)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(392, this.ctx.currentTime);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(587.33, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(700, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.26, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    lfo.start();
    this.activeNodes.push(osc1, osc2, lfo, lfoGain, filter, gain);
  }

  private startColorMusicEmerald() {
    if (!this.ctx || !this.masterGain) return;

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, this.ctx.currentTime); // Emerald 528Hz

    const oscOctave = this.ctx.createOscillator();
    oscOctave.type = 'triangle';
    oscOctave.frequency.setValueAtTime(264, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.24, this.ctx.currentTime);

    osc.connect(gain);
    oscOctave.connect(gain);
    gain.connect(this.masterGain);

    this.addSoftNoiseBed(200, 600, 0.04);

    osc.start();
    oscOctave.start();
    this.activeNodes.push(osc, oscOctave, gain);
  }

  private startCosmicDrone() {
    if (!this.ctx || !this.masterGain) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const subOsc = this.ctx.createOscillator();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(110, this.ctx.currentTime);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(110.8, this.ctx.currentTime);

    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(55, this.ctx.currentTime);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.5, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    lfoGain.gain.setValueAtTime(90, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    subOsc.connect(filter);
    filter.connect(droneGain);
    droneGain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    subOsc.start();
    lfo.start();

    this.activeNodes.push(osc1, osc2, subOsc, lfo, filter, droneGain);
  }

  private startRainSynth() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const rainSource = this.ctx.createBufferSource();
    rainSource.buffer = noiseBuffer;
    rainSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(950, this.ctx.currentTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(140, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    rainSource.connect(filter);
    filter.connect(highpass);
    highpass.connect(gain);
    gain.connect(this.masterGain);

    rainSource.start();
    this.activeNodes.push(rainSource, filter, highpass, gain);
  }

  private startForestStream() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const streamSource = this.ctx.createBufferSource();
    streamSource.buffer = noiseBuffer;
    streamSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.2, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(1.8, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(160, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);

    streamSource.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    streamSource.start();
    lfo.start();
    this.activeNodes.push(streamSource, filter, lfo, gain);
  }

  private startFilteredNoise(lowCut: number, highCut: number) {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime((lowCut + highCut) / 2, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(1.0, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    whiteNoise.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.masterGain);

    whiteNoise.start();
    this.activeNodes.push(whiteNoise, bandpass, gain);
  }
}

export const soundscapePlayer = new AudioSynthesizer();
