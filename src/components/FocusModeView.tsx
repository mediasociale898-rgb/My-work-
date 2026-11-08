import React, { useState, useEffect, useRef } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Maximize2,
  Minimize2,
  CheckCircle2,
  Radio,
  Flame,
} from 'lucide-react';
import { DailyTask, FocusSession, ChannelType } from '../types';
import { soundscapePlayer, FocusSoundTrackType, FOCUS_TRACK_LIST } from '../utils/audioSynthesis';

interface FocusModeViewProps {
  currentChannel: ChannelType;
  tasks: DailyTask[];
  onCompleteSession: (session: FocusSession) => void;
  onToggleTask: (taskId: string) => void;
}

export const FocusModeView: React.FC<FocusModeViewProps> = ({
  currentChannel,
  tasks,
  onCompleteSession,
  onToggleTask,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [customMinutes, setCustomMinutes] = useState(30);
  const [timeLeft, setTimeLeft] = useState(selectedMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const [activeSoundtrack, setActiveSoundtrack] = useState<FocusSoundTrackType>('key-brain-alpha');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionCompletedNotice, setSessionCompletedNotice] = useState(false);
  const [showBreathingPacer, setShowBreathingPacer] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync timer when preset changes while not running
  const handleSelectPreset = (mins: number) => {
    setSelectedMinutes(mins);
    if (!isRunning) {
      setTimeLeft(mins * 60);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Completed session!
      const currentTask = tasks.find(t => t.id === selectedTaskId);
      const session: FocusSession = {
        id: `fs-${Date.now()}`,
        channel: currentChannel,
        durationMinutes: selectedMinutes,
        taskId: selectedTaskId,
        taskTitle: currentTask?.title || 'Undirected Focus Sprint',
        completedAt: new Date().toISOString(),
        soundscapeUsed: isAudioPlaying ? activeSoundtrack : undefined,
      };
      onCompleteSession(session);
      setSessionCompletedNotice(true);
      if (isAudioPlaying) {
        soundscapePlayer.stop();
        setIsAudioPlaying(false);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(selectedMinutes * 60);
    setSessionCompletedNotice(false);
  };

  const toggleSoundscape = () => {
    if (isAudioPlaying) {
      soundscapePlayer.stop();
      setIsAudioPlaying(false);
    } else {
      soundscapePlayer.setVolume(volume);
      soundscapePlayer.play(activeSoundtrack);
      setIsAudioPlaying(true);
    }
  };

  const handleSoundtrackChange = (track: typeof activeSoundtrack) => {
    setActiveSoundtrack(track);
    if (isAudioPlaying) {
      soundscapePlayer.play(track);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const totalSeconds = selectedMinutes * 60;
  const progressPercent = Math.min(100, Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100));

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  // Breathing pacer cycle (4s inhale, 4s hold, 4s exhale, 4s rest)
  useEffect(() => {
    if (!showBreathingPacer) return;
    const phases: Array<'Inhale' | 'Hold' | 'Exhale' | 'Rest'> = ['Inhale', 'Hold', 'Exhale', 'Rest'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % phases.length;
      setBreathingPhase(phases[idx]);
    }, 4000);
    return () => clearInterval(interval);
  }, [showBreathingPacer]);

  const activeTrackMeta = FOCUS_TRACK_LIST.find(t => t.id === activeSoundtrack) || FOCUS_TRACK_LIST[0];

  return (
    <div
      ref={containerRef}
      className={`space-y-6 pb-12 transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#07090f] p-8 overflow-y-auto' : ''
      }`}
    >
      {/* Session completion banner */}
      {sessionCompletedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-400 text-emerald-200 text-xs font-semibold shadow-2xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>
              Focus Sprint Completed! {selectedMinutes} minutes logged to your daily OS execution.
            </span>
          </div>
          <button
            onClick={() => setSessionCompletedNotice(false)}
            className="text-xs text-white underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-1">
            <Timer className="w-3.5 h-3.5" />
            <span>Single-Channel Immersion</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-white">Focus Mode</h2>
          <p className="text-xs text-slate-300 mt-1">
            Eliminate cognitive switching. Dedicate this block entirely to{' '}
            <strong className="text-cyan-300 font-mono">{currentChannel}</strong> with Key Brain & Color Music entrainment.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Box Breathing Pacer Toggle */}
          <button
            onClick={() => setShowBreathingPacer(!showBreathingPacer)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border cursor-pointer ${
              showBreathingPacer
                ? 'bg-purple-500/20 text-purple-200 border-purple-400/40 shadow-sm shadow-purple-500/20'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{showBreathingPacer ? 'Hide Pacer' : 'Box Breathing 4-4-4'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Box Breathing Pacer Banner */}
      {showBreathingPacer && (
        <div className="rounded-3xl p-4 glass-panel border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-purple-950/30 via-slate-900/40 to-cyan-950/30">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xs uppercase tracking-wider transition-all duration-1000 ${
                breathingPhase === 'Inhale'
                  ? 'bg-cyan-500/30 text-cyan-200 scale-110 shadow-lg shadow-cyan-500/40 border border-cyan-400'
                  : breathingPhase === 'Hold'
                  ? 'bg-purple-500/30 text-purple-200 scale-105 shadow-lg shadow-purple-500/40 border border-purple-400'
                  : breathingPhase === 'Exhale'
                  ? 'bg-amber-500/30 text-amber-200 scale-95 border border-amber-400'
                  : 'bg-slate-700/30 text-slate-300 scale-90 border border-slate-600'
              }`}
            >
              {breathingPhase}
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Box Breathing Nervous System Regulator</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                  4s • 4s • 4s • 4s
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {breathingPhase === 'Inhale' && 'Slowly inhale through nose, expanding belly.'}
                {breathingPhase === 'Hold' && 'Hold breath with gentle stillness. Do not tense.'}
                {breathingPhase === 'Exhale' && 'Smooth steady release through lips.'}
                {breathingPhase === 'Rest' && 'Neutral empty pause before next cycle.'}
              </p>
            </div>
          </div>
          <div className="text-[11px] font-mono text-purple-300/80">
            Phase: <span className="text-white font-bold">{breathingPhase}</span>
          </div>
        </div>
      )}

      {/* Main Focus Control Console */}
      <div className="max-w-2xl mx-auto rounded-3xl p-8 glass-panel-glow border border-cyan-500/30 flex flex-col items-center text-center space-y-6 relative overflow-hidden">
        {/* Subtle ambient orb in background */}
        <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-cyan-500/15 filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-52 h-52 rounded-full bg-blue-600/15 filter blur-3xl pointer-events-none" />

        {/* Channel & Track Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Active Channel: {currentChannel}</span>
          </div>
          {isAudioPlaying && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>{activeTrackMeta.label}</span>
            </div>
          )}
        </div>

        {/* Circular Progress Display & Giant Digital Clock */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              strokeWidth="5"
              stroke="rgba(255,255,255,0.06)"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              strokeWidth="5"
              stroke="url(#focus-gradient)"
              strokeDasharray={`${progressPercent * 2.76}, 276`}
              strokeLinecap="round"
              fill="none"
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="focus-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-extrabold font-mono text-white tracking-tighter">
              {formattedTime}
            </span>
            <span className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-1">
              {isRunning ? (
                <>
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  <span className="text-amber-300 font-bold">FLOW IN PROGRESS</span>
                </>
              ) : (
                'READY TO FOCUS'
              )}
            </span>
          </div>
        </div>

        {/* Current Target Task Selector */}
        <div className="w-full text-left space-y-1.5 bg-white/[0.03] p-3.5 rounded-2xl border border-white/6">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
            Target Commitment
          </span>
          <select
            value={selectedTaskId}
            onChange={e => setSelectedTaskId(e.target.value)}
            className="w-full px-2 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none"
          >
            {tasks.map(t => (
              <option key={t.id} value={t.id}>
                {t.isMainTask ? '★ [MAIN] ' : ''}{t.title}
              </option>
            ))}
          </select>

          {selectedTask && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400">
                {selectedTask.notes || 'No extra notes'}
              </span>
              <button
                onClick={() => onToggleTask(selectedTask.id)}
                className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
              >
                {selectedTask.completed ? 'Mark Incomplete' : 'Mark Completed'}
              </button>
            </div>
          )}
        </div>

        {/* Preset Durations (25, 40, 60, 90, custom) */}
        <div className="flex flex-wrap gap-2 justify-center">
          {[25, 40, 60, 90].map(minsVal => (
            <button
              key={minsVal}
              onClick={() => handleSelectPreset(minsVal)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer ${
                selectedMinutes === minsVal
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {minsVal}m
            </button>
          ))}
          <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-xl">
            <input
              type="number"
              min="1"
              max="180"
              value={customMinutes}
              onChange={e => {
                const val = parseInt(e.target.value) || 15;
                setCustomMinutes(val);
                handleSelectPreset(val);
              }}
              className="w-12 text-xs font-mono text-center bg-transparent text-white focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 font-mono">min</span>
          </div>
        </div>

        {/* Action Controls: Start / Pause / Reset */}
        <div className="flex gap-3">
          <button
            onClick={toggleTimer}
            className="py-3 px-8 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-xl shadow-cyan-500/25 active:scale-95 transition cursor-pointer"
          >
            {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isRunning ? 'Pause Flow' : 'Begin Sprint'}</span>
          </button>
          <button
            onClick={resetTimer}
            className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Working Focus Soundscape Console: Key Brain & Color Music */}
        <div className="w-full pt-5 border-t border-white/6 flex flex-col space-y-3.5 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSoundscape}
                className={`px-3.5 py-1.5 rounded-xl font-medium text-xs flex items-center gap-2 transition cursor-pointer ${
                  isAudioPlaying
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/20'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/8'
                }`}
              >
                {isAudioPlaying ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
                <span>{isAudioPlaying ? 'Mute Soundscape' : 'Play Focus Soundscape'}</span>
              </button>

              {/* Dynamic Animated Audio Spectrum Bars */}
              {isAudioPlaying && (
                <div className="flex items-end gap-1 h-5 px-2 py-0.5 rounded-lg bg-black/40 border border-cyan-500/20">
                  <span className="w-1 bg-cyan-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
                  <span className="w-1 bg-blue-400 rounded-full animate-[pulse_0.9s_ease-in-out_infinite] h-5" />
                  <span className="w-1 bg-indigo-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite] h-2.5" />
                  <span className="w-1 bg-purple-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite] h-4" />
                  <span className="w-1 bg-amber-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite] h-3.5" />
                </div>
              )}
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-mono">Vol</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  setVolume(val);
                  soundscapePlayer.setVolume(val);
                }}
                className="w-20 accent-cyan-400 h-1 bg-white/10 rounded cursor-pointer"
              />
              <span className="text-[10px] text-slate-400 font-mono w-6 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* Categorized Track Selector */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Audio Entrainment & Synesthesia Engine
            </span>
            <select
              value={activeSoundtrack}
              onChange={e => handleSoundtrackChange(e.target.value as FocusSoundTrackType)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
            >
              <optgroup label="🧠 KEY BRAIN WAVES (Binaural Beats)">
                {FOCUS_TRACK_LIST.filter(t => t.category === 'key-brain').map(t => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🎨 COLOR MUSIC (Gibran Synesthesia Drones)">
                {FOCUS_TRACK_LIST.filter(t => t.category === 'color-music').map(t => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="🌿 AMBIENT & NATURE NOISE">
                {FOCUS_TRACK_LIST.filter(t => t.category === 'ambient').map(t => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Active Track Description & Frequency Info */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/6 flex items-start gap-2.5">
            <div className={`w-3 h-3 rounded-full mt-0.5 bg-gradient-to-r ${activeTrackMeta.color} shadow-sm shrink-0`} />
            <div className="text-[11px] text-slate-300 leading-snug">
              <span className="font-bold text-white block">{activeTrackMeta.label}</span>
              <span className="text-slate-400">{activeTrackMeta.description}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

