import React, { useState, useEffect, useRef } from 'react';
import {
  Music,
  Play,
  Pause,
  Square,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  Radio,
  Sliders,
  Disc,
  Upload,
  ListMusic,
  Trash2,
  FolderHeart,
  Headphones,
  Check,
} from 'lucide-react';

interface PianoKey {
  note: string;
  freq: number;
  isBlack: boolean;
  charKey: string;
  color: string;
  glow: string;
}

const PIANO_KEYS: PianoKey[] = [
  { note: 'C4', freq: 261.63, isBlack: false, charKey: 'A', color: 'from-rose-500 to-red-600', glow: 'rgba(244, 63, 94, 0.6)' },
  { note: 'C#4', freq: 277.18, isBlack: true, charKey: 'W', color: 'from-rose-600 to-orange-600', glow: 'rgba(225, 29, 72, 0.7)' },
  { note: 'D4', freq: 293.66, isBlack: false, charKey: 'S', color: 'from-orange-500 to-amber-600', glow: 'rgba(249, 115, 22, 0.6)' },
  { note: 'D#4', freq: 311.13, isBlack: true, charKey: 'E', color: 'from-amber-600 to-yellow-600', glow: 'rgba(217, 119, 6, 0.7)' },
  { note: 'E4', freq: 329.63, isBlack: false, charKey: 'D', color: 'from-yellow-400 to-lime-500', glow: 'rgba(234, 179, 8, 0.6)' },
  { note: 'F4', freq: 349.23, isBlack: false, charKey: 'F', color: 'from-emerald-400 to-green-600', glow: 'rgba(16, 185, 129, 0.6)' },
  { note: 'F#4', freq: 369.99, isBlack: true, charKey: 'T', color: 'from-emerald-600 to-teal-600', glow: 'rgba(5, 150, 105, 0.7)' },
  { note: 'G4', freq: 392.00, isBlack: false, charKey: 'G', color: 'from-teal-400 to-cyan-500', glow: 'rgba(20, 184, 166, 0.6)' },
  { note: 'G#4', freq: 415.30, isBlack: true, charKey: 'Y', color: 'from-cyan-600 to-sky-600', glow: 'rgba(8, 145, 178, 0.7)' },
  { note: 'A4', freq: 440.00, isBlack: false, charKey: 'H', color: 'from-sky-500 to-blue-600', glow: 'rgba(14, 165, 233, 0.6)' },
  { note: 'A#4', freq: 466.16, isBlack: true, charKey: 'U', color: 'from-blue-600 to-indigo-600', glow: 'rgba(37, 99, 235, 0.7)' },
  { note: 'B4', freq: 493.88, isBlack: false, charKey: 'J', color: 'from-indigo-500 to-violet-600', glow: 'rgba(99, 102, 241, 0.6)' },
  { note: 'C5', freq: 523.25, isBlack: false, charKey: 'K', color: 'from-violet-500 to-purple-600', glow: 'rgba(139, 92, 246, 0.6)' },
  { note: 'C#5', freq: 554.37, isBlack: true, charKey: 'O', color: 'from-purple-600 to-fuchsia-600', glow: 'rgba(147, 51, 234, 0.7)' },
  { note: 'D5', freq: 587.33, isBlack: false, charKey: 'L', color: 'from-fuchsia-500 to-pink-600', glow: 'rgba(217, 70, 239, 0.6)' },
  { note: 'D#5', freq: 622.25, isBlack: true, charKey: 'P', color: 'from-pink-600 to-rose-600', glow: 'rgba(219, 39, 119, 0.7)' },
  { note: 'E5', freq: 659.25, isBlack: false, charKey: ';', color: 'from-rose-400 to-red-500', glow: 'rgba(244, 63, 94, 0.6)' },
];

export interface GibranTrack {
  id: string;
  title: string;
  poeticTheme: string;
  keySignature: string;
  colorSpectrum: string;
  bpm: number;
  durationLabel: string;
  quote: string;
  sequence: { notes: { freq: number; note: string }[]; stepMs: number; chordName: string }[];
}

const GIBRAN_MUSIC_LIBRARY: GibranTrack[] = [
  {
    id: 'gib-1',
    title: "The Prophet's Dawning",
    poeticTheme: "Awakening of the Spirit & Golden Dawn",
    keySignature: "D Minor · Amber Gold & Royal Cyan",
    colorSpectrum: "from-amber-500 via-rose-500 to-cyan-500",
    bpm: 72,
    durationLabel: "0:48 (Loop)",
    quote: "Your daily life is your temple and your religion. Whenever you enter into it, take with you your all.",
    sequence: [
      { chordName: 'D Minor', notes: [{ freq: 293.66, note: 'D4' }, { freq: 349.23, note: 'F4' }, { freq: 440.00, note: 'A4' }], stepMs: 1400 },
      { chordName: 'B-flat Major', notes: [{ freq: 293.66, note: 'D4' }, { freq: 349.23, note: 'F4' }, { freq: 466.16, note: 'A#4' }], stepMs: 1400 },
      { chordName: 'C Major', notes: [{ freq: 261.63, note: 'C4' }, { freq: 329.63, note: 'E4' }, { freq: 392.00, note: 'G4' }], stepMs: 1400 },
      { chordName: 'D Minor 7', notes: [{ freq: 293.66, note: 'D4' }, { freq: 349.23, note: 'F4' }, { freq: 440.00, note: 'A4' }, { freq: 523.25, note: 'C5' }], stepMs: 1600 },
      { chordName: 'G Minor', notes: [{ freq: 293.66, note: 'D4' }, { freq: 392.00, note: 'G4' }, { freq: 466.16, note: 'A#4' }], stepMs: 1400 },
      { chordName: 'A Dominant 7', notes: [{ freq: 329.63, note: 'E4' }, { freq: 392.00, note: 'G4' }, { freq: 440.00, note: 'A4' }, { freq: 554.37, note: 'C#5' }], stepMs: 1600 },
    ],
  },
  {
    id: 'gib-2',
    title: "The Prophet on Love & Music",
    poeticTheme: "Harmonic Communion & Sacred Geometry",
    keySignature: "C Major · Emerald Green & Solar Yellow",
    colorSpectrum: "from-emerald-400 via-teal-500 to-yellow-400",
    bpm: 64,
    durationLabel: "0:52 (Loop)",
    quote: "Sing and dance together and be joyous, but let each one of you be alone, even as the strings of a lute are alone though they quiver with the same music.",
    sequence: [
      { chordName: 'C Major', notes: [{ freq: 261.63, note: 'C4' }, { freq: 329.63, note: 'E4' }, { freq: 392.00, note: 'G4' }], stepMs: 1500 },
      { chordName: 'G Major', notes: [{ freq: 293.66, note: 'D4' }, { freq: 392.00, note: 'G4' }, { freq: 493.88, note: 'B4' }], stepMs: 1500 },
      { chordName: 'A Minor', notes: [{ freq: 261.63, note: 'C4' }, { freq: 329.63, note: 'E4' }, { freq: 440.00, note: 'A4' }], stepMs: 1500 },
      { chordName: 'F Major 7', notes: [{ freq: 261.63, note: 'C4' }, { freq: 329.63, note: 'E4' }, { freq: 349.23, note: 'F4' }, { freq: 440.00, note: 'A4' }], stepMs: 1700 },
      { chordName: 'C Major 9', notes: [{ freq: 261.63, note: 'C4' }, { freq: 329.63, note: 'E4' }, { freq: 392.00, note: 'G4' }, { freq: 587.33, note: 'D5' }], stepMs: 1800 },
    ],
  },
  {
    id: 'gib-3',
    title: "Sand & Foam: The Ethereal Tide",
    poeticTheme: "Meditative Sea of Longing & Oceanic Calm",
    keySignature: "A Minor · Royal Indigo & Deep Turquoise",
    colorSpectrum: "from-indigo-500 via-cyan-400 to-teal-500",
    bpm: 80,
    durationLabel: "0:44 (Loop)",
    quote: "A grain of sand is a longing, and the sea is a song. We walk upon the shores of eternity.",
    sequence: [
      { chordName: 'A Minor', notes: [{ freq: 261.63, note: 'C4' }, { freq: 329.63, note: 'E4' }, { freq: 440.00, note: 'A4' }], stepMs: 1300 },
      { chordName: 'D Minor 9', notes: [{ freq: 293.66, note: 'D4' }, { freq: 349.23, note: 'F4' }, { freq: 440.00, note: 'A4' }, { freq: 659.25, note: 'E5' }], stepMs: 1400 },
      { chordName: 'F Major', notes: [{ freq: 349.23, note: 'F4' }, { freq: 440.00, note: 'A4' }, { freq: 523.25, note: 'C5' }], stepMs: 1300 },
      { chordName: 'E Minor 7', notes: [{ freq: 293.66, note: 'D4' }, { freq: 329.63, note: 'E4' }, { freq: 392.00, note: 'G4' }, { freq: 493.88, note: 'B4' }], stepMs: 1500 },
    ],
  },
  {
    id: 'gib-4',
    title: "The Wanderer's Solitude",
    poeticTheme: "Inner Silence & Mystical Valleys",
    keySignature: "F# Minor · Cosmic Violet & Rose Quartz",
    colorSpectrum: "from-purple-600 via-fuchsia-500 to-rose-400",
    bpm: 68,
    durationLabel: "0:50 (Loop)",
    quote: "I met myself in the deep mist of the high mountain, and my spirit said: Be patient, for the dawn is awakening inside you.",
    sequence: [
      { chordName: 'F# Minor', notes: [{ freq: 277.18, note: 'C#4' }, { freq: 369.99, note: 'F#4' }, { freq: 440.00, note: 'A4' }], stepMs: 1600 },
      { chordName: 'D Major', notes: [{ freq: 293.66, note: 'D4' }, { freq: 369.99, note: 'F#4' }, { freq: 440.00, note: 'A4' }], stepMs: 1600 },
      { chordName: 'B Minor', notes: [{ freq: 293.66, note: 'D4' }, { freq: 369.99, note: 'F#4' }, { freq: 493.88, note: 'B4' }], stepMs: 1600 },
      { chordName: 'C# Dominant 7', notes: [{ freq: 277.18, note: 'C#4' }, { freq: 349.23, note: 'F4' }, { freq: 415.30, note: 'G#4' }, { freq: 493.88, note: 'B4' }], stepMs: 1800 },
    ],
  },
  {
    id: 'gib-5',
    title: "Spirits Rebellious: The Awakening",
    poeticTheme: "Kinetic Freedom & The Breaking of Bonds",
    keySignature: "G Major · Ruby Flame & Electric Sky",
    colorSpectrum: "from-rose-600 via-orange-500 to-cyan-400",
    bpm: 92,
    durationLabel: "0:42 (Loop)",
    quote: "Life without rebellion is like seasons without spring. Break the mold and sing your own harmonic song.",
    sequence: [
      { chordName: 'G Major', notes: [{ freq: 293.66, note: 'D4' }, { freq: 392.00, note: 'G4' }, { freq: 493.88, note: 'B4' }], stepMs: 1200 },
      { chordName: 'E Minor', notes: [{ freq: 329.63, note: 'E4' }, { freq: 392.00, note: 'G4' }, { freq: 493.88, note: 'B4' }], stepMs: 1200 },
      { chordName: 'C Major', notes: [{ freq: 261.63, note: 'C4' }, { freq: 329.63, note: 'E4' }, { freq: 392.00, note: 'G4' }], stepMs: 1200 },
      { chordName: 'D Dominant 7', notes: [{ freq: 261.63, note: 'C4' }, { freq: 293.66, note: 'D4' }, { freq: 369.99, note: 'F#4' }, { freq: 440.00, note: 'A4' }], stepMs: 1400 },
    ],
  },
  {
    id: 'gib-6',
    title: "The Garden of the Prophet",
    poeticTheme: "Eternity Gazing at Itself in Light",
    keySignature: "E Major · Sunlit Gold & Spring Emerald",
    colorSpectrum: "from-lime-400 via-emerald-400 to-sky-400",
    bpm: 74,
    durationLabel: "0:46 (Loop)",
    quote: "Beauty is eternity gazing at itself in a mirror. But you are eternity and you are the mirror.",
    sequence: [
      { chordName: 'E Major', notes: [{ freq: 329.63, note: 'E4' }, { freq: 415.30, note: 'G#4' }, { freq: 493.88, note: 'B4' }], stepMs: 1400 },
      { chordName: 'A Major', notes: [{ freq: 329.63, note: 'E4' }, { freq: 440.00, note: 'A4' }, { freq: 554.37, note: 'C#5' }], stepMs: 1400 },
      { chordName: 'B Major', notes: [{ freq: 369.99, note: 'F#4' }, { freq: 493.88, note: 'B4' }, { freq: 622.25, note: 'D#5' }], stepMs: 1400 },
      { chordName: 'C# Minor', notes: [{ freq: 329.63, note: 'E4' }, { freq: 415.30, note: 'G#4' }, { freq: 554.37, note: 'C#5' }], stepMs: 1600 },
    ],
  },
];

interface UploadedAudioTrack {
  id: string;
  name: string;
  size: number;
  audioUrl: string;
  durationLabel: string;
  uploadedAt: string;
}

export const ColorMusicPiano: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'piano' | 'gibran' | 'uploads'>('piano');
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [synthType, setSynthType] = useState<'acoustic' | 'synthwave' | 'warm-sine' | 'chiptune'>('synthwave');
  const [volume, setVolume] = useState(0.4);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState<{ note: string; time: number }[]>([]);
  const [isPlayingBack, setIsPlayingBack] = useState(false);
  const [recentKey, setRecentKey] = useState<string>('Press any key or click piano keys');

  // Gibran Al-Color procedural player state
  const [playingGibranId, setPlayingGibranId] = useState<string | null>(null);
  const [currentGibranChord, setCurrentGibranChord] = useState<string>('');
  const gibranLoopRef = useRef<number[]>([]);

  // User uploaded tracks state
  const [uploadedTracks, setUploadedTracks] = useState<UploadedAudioTrack[]>([
    {
      id: 'demo-uploaded-1',
      name: 'atmospheric_synth_ambient_loop.mp3',
      size: 4200000,
      audioUrl: '',
      durationLabel: '02:45',
      uploadedAt: '2026-11-06',
    },
  ]);
  const [playingUploadedId, setPlayingUploadedId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const recordStartTimeRef = useRef<number>(0);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playNoteAudio = (freq: number, noteName: string, customDuration = 1.2) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    setRecentKey(`${noteName} (${Math.round(freq)} Hz)`);

    // Track active note for visual feedback on piano keys
    setActiveNotes(prev => new Set(prev).add(noteName));
    setTimeout(() => {
      setActiveNotes(prev => {
        const next = new Set(prev);
        next.delete(noteName);
        return next;
      });
    }, 450);

    // Recording track
    if (isRecording) {
      const offset = Date.now() - recordStartTimeRef.current;
      setRecordedNotes(prev => [...prev, { note: noteName, time: offset }]);
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (synthType === 'acoustic') {
      osc.type = 'triangle';
      const subOsc = ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(freq * 2, ctx.currentTime);
      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + customDuration);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start();
      subOsc.stop(ctx.currentTime + customDuration);
    } else if (synthType === 'synthwave') {
      osc.type = 'sawtooth';
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + customDuration * 0.8);
      osc.connect(filter);
      filter.connect(gain);
    } else if (synthType === 'warm-sine') {
      osc.type = 'sine';
    } else {
      osc.type = 'square';
    }

    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // ADSR Envelope
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.03); // Attack
    gain.gain.exponentialRampToValueAtTime(volume * 0.65, now + 0.2); // Decay
    gain.gain.exponentialRampToValueAtTime(0.0001, now + customDuration); // Release

    if (synthType !== 'synthwave') {
      osc.connect(gain);
    }
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + customDuration + 0.2);
  };

  // Physical Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const keyUpper = e.key.toUpperCase();
      const match = PIANO_KEYS.find(k => k.charKey === keyUpper);
      if (match && !activeNotes.has(match.note)) {
        playNoteAudio(match.freq, match.note);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [synthType, volume, isRecording, activeNotes]);

  // Record toggle
  const toggleRecording = () => {
    if (!isRecording) {
      setRecordedNotes([]);
      recordStartTimeRef.current = Date.now();
      setIsRecording(true);
    } else {
      setIsRecording(false);
    }
  };

  // Playback recorded track
  const handlePlayback = () => {
    if (recordedNotes.length === 0 || isPlayingBack) return;
    setIsPlayingBack(true);
    recordedNotes.forEach(item => {
      setTimeout(() => {
        const found = PIANO_KEYS.find(k => k.note === item.note);
        if (found) playNoteAudio(found.freq, found.note);
      }, item.time);
    });
    const maxTime = Math.max(...recordedNotes.map(n => n.time)) + 800;
    setTimeout(() => setIsPlayingBack(false), maxTime);
  };

  // Stop Gibran procedural music
  const stopGibranPlayback = () => {
    gibranLoopRef.current.forEach(t => clearTimeout(t));
    gibranLoopRef.current = [];
    setPlayingGibranId(null);
    setCurrentGibranChord('');
  };

  // Play Gibran Al-Color procedural music piece
  const playGibranTrack = (track: GibranTrack) => {
    if (playingGibranId === track.id) {
      stopGibranPlayback();
      return;
    }

    stopGibranPlayback();
    setPlayingGibranId(track.id);

    let cumulativeTime = 0;
    track.sequence.forEach((step, idx) => {
      const timerId = window.setTimeout(() => {
        setCurrentGibranChord(`${step.chordName} (${track.keySignature})`);
        step.notes.forEach(n => {
          playNoteAudio(n.freq, n.note, step.stepMs / 1000);
        });

        // Loop after last chord
        if (idx === track.sequence.length - 1) {
          const loopTimer = window.setTimeout(() => {
            if (playingGibranId === track.id) {
              playGibranTrack(track);
            } else {
              stopGibranPlayback();
            }
          }, step.stepMs);
          gibranLoopRef.current.push(loopTimer);
        }
      }, cumulativeTime);

      gibranLoopRef.current.push(timerId);
      cumulativeTime += step.stepMs;
    });
  };

  // User Music Upload Handler
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const newTrack: UploadedAudioTrack = {
      id: `audio-${Date.now()}`,
      name: file.name,
      size: file.size,
      audioUrl: url,
      durationLabel: 'Uploaded Audio',
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    setUploadedTracks(prev => [newTrack, ...prev]);
    setActiveTab('uploads');
  };

  const togglePlayUploaded = (track: UploadedAudioTrack) => {
    if (playingUploadedId === track.id) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setPlayingUploadedId(null);
    } else {
      if (audioPlayerRef.current && track.audioUrl) {
        audioPlayerRef.current.src = track.audioUrl;
        audioPlayerRef.current.play();
      }
      setPlayingUploadedId(track.id);
    }
  };

  const deleteUploadedTrack = (id: string) => {
    if (playingUploadedId === id && audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      setPlayingUploadedId(null);
    }
    setUploadedTracks(prev => prev.filter(t => t.id !== id));
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      stopGibranPlayback();
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
    };
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Hidden audio element for uploaded user tracks */}
      <audio
        ref={audioPlayerRef}
        onEnded={() => setPlayingUploadedId(null)}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-1">
            <Music className="w-3.5 h-3.5" />
            <span>Al-Color Synthesizer Studio & Harmonic Library</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-white">
            Color Music Piano & Audio Synth
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Visual chromatic piano, Kahlil Gibran Al-Color music suites, and custom audio track uploader with real-time spectrum feedback.
          </p>
        </div>

        {/* Synthesizer & Control toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Synth preset selector */}
          <div className="flex bg-white/[0.04] p-1 rounded-xl border border-white/8 text-xs font-mono">
            {[
              { id: 'synthwave', label: '80s Synth' },
              { id: 'acoustic', label: 'Grand Piano' },
              { id: 'warm-sine', label: 'Warm Sine' },
              { id: 'chiptune', label: '8-Bit Retro' },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setSynthType(s.id as typeof synthType)}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  synthType === s.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Record button */}
          <button
            onClick={toggleRecording}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
              isRecording
                ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-white/[0.04] border-white/8 text-slate-300 hover:text-white'
            }`}
          >
            <Disc className="w-3.5 h-3.5 text-rose-400" />
            <span>{isRecording ? 'Recording...' : 'Record'}</span>
          </button>

          {/* Playback button */}
          <button
            onClick={handlePlayback}
            disabled={recordedNotes.length === 0 || isPlayingBack}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border ${
              isPlayingBack
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : recordedNotes.length > 0
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
                : 'bg-white/[0.02] border-white/5 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Playback ({recordedNotes.length})</span>
          </button>

          {/* Upload Custom Music Track Button */}
          <label className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-purple-500/20 transition">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Music</span>
            <input
              type="file"
              accept="audio/*"
              onChange={handleAudioUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Mode Sub-Tabs (Interactive Piano vs Gibran Music vs Uploaded Tracks) */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/8 pb-3">
        {[
          { id: 'piano', label: '🎹 Interactive Color Piano', badge: '17 Keys' },
          { id: 'gibran', label: '🎼 Gibran Al-Color Music Library', badge: `${GIBRAN_MUSIC_LIBRARY.length} Masterpieces` },
          { id: 'uploads', label: '🎵 My Uploaded Tracks', badge: `${uploadedTracks.length} Audio Files` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500/25 to-blue-600/20 text-cyan-200 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/8 text-slate-300">
              {tab.badge}
            </span>
          </button>
        ))}
      </div>

      {/* Live Animated Multi-Band Chromatic Frequency Visualizer Bar */}
      <div className="p-3 rounded-2xl bg-black/40 border border-white/8 flex items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${playingGibranId || playingUploadedId ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`} />
          <span className="text-slate-400">Spectrum Telemetry:</span>
          <span className="text-cyan-300 font-bold truncate max-w-[280px]">
            {playingGibranId ? currentGibranChord || 'Playing Gibran Suite...' : playingUploadedId ? 'Playing Uploaded Track' : recentKey}
          </span>
        </div>

        {/* 16 Animated Color Spectrum Frequency Bars */}
        <div className="flex items-end gap-1 h-6">
          {[
            'bg-rose-500', 'bg-orange-500', 'bg-amber-400', 'bg-yellow-400',
            'bg-lime-400', 'bg-emerald-400', 'bg-teal-400', 'bg-cyan-400',
            'bg-sky-400', 'bg-blue-500', 'bg-indigo-500', 'bg-violet-500',
            'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-400',
          ].map((c, i) => {
            const isPlaying = !!playingGibranId || !!playingUploadedId;
            const heights = isPlaying
              ? [70, 90, 60, 100, 45, 80, 95, 75, 85, 65, 90, 50, 75, 100, 80, 60]
              : [30, 20, 40, 25, 35, 30, 25, 45, 30, 20, 35, 40, 25, 30, 20, 25];
            return (
              <div
                key={i}
                style={{ height: `${heights[i]}%` }}
                className={`w-1 rounded-full transition-all duration-300 ${c} ${isPlaying ? 'opacity-100 shadow-sm' : 'opacity-40'}`}
              />
            );
          })}
        </div>
      </div>

      {/* TAB 1: THE CHROMATIC COLOR PIANO */}
      {(activeTab === 'piano' || activeTab === 'gibran') && (
        <div className="rounded-3xl p-6 lg:p-8 glass-panel-glow border border-cyan-500/25 space-y-6 relative overflow-hidden">
          {/* Glow backdrop */}
          <div className="absolute top-0 right-1/4 w-80 h-40 bg-gradient-to-b from-cyan-500/15 via-purple-600/10 to-transparent filter blur-3xl pointer-events-none" />

          {/* Key surface */}
          <div className="relative pt-4 pb-2 px-2 overflow-x-auto select-none">
            <div className="flex justify-center relative min-w-[700px] h-64 bg-[#0a0d16] p-4 rounded-2xl border border-white/10 shadow-2xl">
              {PIANO_KEYS.map((key) => {
                const isActive = activeNotes.has(key.note);
                if (key.isBlack) {
                  return (
                    <button
                      key={key.note}
                      onMouseDown={() => playNoteAudio(key.freq, key.note)}
                      style={{
                        left: `${
                          key.note === 'C#4' ? 14 :
                          key.note === 'D#4' ? 22.5 :
                          key.note === 'F#4' ? 39.5 :
                          key.note === 'G#4' ? 48 :
                          key.note === 'A#4' ? 56.5 :
                          key.note === 'C#5' ? 73.5 : 82
                        }%`,
                        boxShadow: isActive ? `0 0 25px ${key.glow}` : '0 4px 12px rgba(0,0,0,0.8)',
                      }}
                      className={`absolute z-20 w-9 h-36 rounded-b-xl border border-white/15 transition-all duration-75 cursor-pointer flex flex-col justify-between items-center pb-2 ${
                        isActive
                          ? `bg-gradient-to-b ${key.color} scale-[0.98] translate-y-1`
                          : 'bg-gradient-to-b from-slate-900 to-black hover:from-slate-800 hover:to-slate-950'
                      }`}
                    >
                      <span className="text-[9px] font-mono font-bold text-slate-400 pt-1">
                        {key.charKey}
                      </span>
                      <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                        {key.note}
                      </span>
                    </button>
                  );
                }

                // White keys
                return (
                  <button
                    key={key.note}
                    onMouseDown={() => playNoteAudio(key.freq, key.note)}
                    style={{
                      boxShadow: isActive ? `0 0 30px ${key.glow}` : undefined,
                    }}
                    className={`flex-1 h-56 mx-0.5 rounded-b-2xl border border-white/10 transition-all duration-75 cursor-pointer flex flex-col justify-end items-center pb-3 relative overflow-hidden group ${
                      isActive
                        ? `bg-gradient-to-b ${key.color} translate-y-1 text-white shadow-lg`
                        : 'bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-white/[0.02] hover:bg-white/[0.12] text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-full h-1.5 rounded-full mb-1 transition bg-gradient-to-r ${key.color} opacity-70 group-hover:opacity-100`}
                    />
                    <span className="text-xs font-bold font-mono">{key.note}</span>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold mt-0.5">
                      [{key.charKey}]
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chords Quick Pad */}
          <div className="pt-2 border-t border-white/8 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Instant Harmonizer Chords
              </span>
              <span>Trigger triple-voice harmony</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { name: 'C Major (C-E-G)', notes: [{ f: 261.63, n: 'C4' }, { f: 329.63, n: 'E4' }, { f: 392.00, n: 'G4' }] },
                { name: 'A Minor (A-C-E)', notes: [{ f: 220.00, n: 'A3' }, { f: 261.63, n: 'C4' }, { f: 329.63, n: 'E4' }] },
                { name: 'F Major (F-A-C)', notes: [{ f: 349.23, n: 'F4' }, { f: 440.00, n: 'A4' }, { f: 523.25, n: 'C5' }] },
                { name: 'G7 Dominant (G-B-D-F)', notes: [{ f: 392.00, n: 'G4' }, { f: 493.88, n: 'B4' }, { f: 587.33, n: 'D5' }, { f: 349.23, n: 'F4' }] },
              ].map((chord, i) => (
                <button
                  key={i}
                  onClick={() => {
                    chord.notes.forEach(n => playNoteAudio(n.f, n.n));
                  }}
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-cyan-500/15 border border-white/6 hover:border-cyan-500/30 text-xs font-medium text-slate-300 hover:text-cyan-200 transition text-left cursor-pointer"
                >
                  <div className="font-bold text-white">{chord.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{chord.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GIBRAN AL-COLOR MUSIC LIBRARY */}
      {activeTab === 'gibran' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderHeart className="w-4 h-4 text-rose-400" />
              <span>Gibran Al-Color Harmonic Suites</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              6 Chromatic Pieces · Inspired by Kahlil Gibran & Scriabin
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {GIBRAN_MUSIC_LIBRARY.map(track => {
              const isPlayingThis = playingGibranId === track.id;
              return (
                <div
                  key={track.id}
                  className={`p-5 rounded-3xl border transition flex flex-col justify-between space-y-4 ${
                    isPlayingThis
                      ? 'bg-gradient-to-br from-cyan-950/40 via-purple-950/30 to-slate-900 border-cyan-400/50 shadow-xl shadow-cyan-500/15'
                      : 'bg-[#0b0e18]/80 border-white/8 hover:border-white/15'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{track.title}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {track.durationLabel}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          {track.keySignature} · {track.bpm} BPM
                        </p>
                      </div>

                      {/* Play / Stop Button */}
                      <button
                        onClick={() => playGibranTrack(track)}
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer transition shadow-md ${
                          isPlayingThis
                            ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/25 animate-pulse'
                            : 'bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-cyan-500/25'
                        }`}
                        title={isPlayingThis ? 'Stop Suite' : 'Play Gibran Al-Color Music'}
                      >
                        {isPlayingThis ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>
                    </div>

                    {/* Color Wave Strip */}
                    <div className="mt-3 w-full h-2 rounded-full overflow-hidden bg-black/40">
                      <div className={`w-full h-full bg-gradient-to-r ${track.colorSpectrum} ${isPlayingThis ? 'animate-pulse' : 'opacity-60'}`} />
                    </div>

                    <p className="text-xs text-slate-300 italic mt-3 border-l-2 border-cyan-500/40 pl-2.5">
                      "{track.quote}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-white/6">
                    <span>Theme: {track.poeticTheme}</span>
                    <span className="text-cyan-300 font-semibold">{track.sequence.length} Chords</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: UPLOADED MUSIC TRACKS LIST */}
      {activeTab === 'uploads' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Headphones className="w-4 h-4 text-purple-400" />
                <span>My Uploaded Music & Audio Tracks</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload your MP3, WAV, OGG, or FLAC audio files to listen, analyze, and play along with the visual color piano.
              </p>
            </div>

            <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-500/20 transition w-fit">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Audio File</span>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-2.5">
            {uploadedTracks.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-300 font-bold">No uploaded audio tracks yet</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Click "Upload Audio File" above to add your own songs and recordings.
                </p>
              </div>
            ) : (
              uploadedTracks.map(track => {
                const isPlaying = playingUploadedId === track.id;
                return (
                  <div
                    key={track.id}
                    className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                      isPlaying
                        ? 'bg-purple-950/30 border-purple-500/40 shadow-lg shadow-purple-950/20'
                        : 'bg-white/[0.03] border-white/8 hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button
                        onClick={() => togglePlayUploaded(track)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 cursor-pointer transition ${
                          isPlaying
                            ? 'bg-purple-500 text-white shadow-md shadow-purple-500/25'
                            : 'bg-white/10 hover:bg-white/15 text-slate-200'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>

                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{track.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                          <span>{(track.size / (1024 * 1024)).toFixed(1)} MB</span>
                          <span>·</span>
                          <span>{track.durationLabel}</span>
                          <span>·</span>
                          <span>Uploaded {track.uploadedAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteUploadedTrack(track.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer transition"
                        title="Delete audio track"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
