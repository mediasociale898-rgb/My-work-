import React, { useState } from 'react';
import {
  Menu,
  Timer,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  Search,
  Plus,
  Compass,
  Lock,
  SkipForward,
  SkipBack,
} from 'lucide-react';
import { ActiveModule } from './Sidebar';
import { ChannelType, ProjectItem } from '../types';
import {
  soundscapePlayer,
  FocusSoundTrackType,
  FOCUS_TRACK_LIST,
  VIBE_PLAYLISTS,
  MusicVibePlaylist,
} from '../utils/audioSynthesis';

interface HeaderProps {
  onToggleMobileMenu: () => void;
  activeModule: ActiveModule;
  onSelectModule: (mod: ActiveModule) => void;
  currentChannel: ChannelType;
  activeProject?: ProjectItem;
  onOpenQuickCapture: () => void;
  focusScore: number;
  onLockOS?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleMobileMenu,
  activeModule: _activeModule,
  onSelectModule,
  currentChannel,
  activeProject,
  onOpenQuickCapture,
  focusScore,
  onLockOS,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioTrack, setAudioTrack] = useState<FocusSoundTrackType>('key-brain-alpha');
  const [activePlaylist, setActivePlaylist] = useState<MusicVibePlaylist | null>('work');
  const [volume, setVolume] = useState(0.4);
  const [showAudioMenu, setShowAudioMenu] = useState(false);

  const handlePlaylistSelect = (vibe: MusicVibePlaylist) => {
    setActivePlaylist(vibe);
    soundscapePlayer.setVolume(volume);
    soundscapePlayer.playPlaylist(vibe);
    const currTrack = soundscapePlayer.getCurrentTrack();
    if (currTrack) setAudioTrack(currTrack);
    setIsPlayingAudio(true);
  };

  const handleNextTrack = () => {
    soundscapePlayer.nextTrack();
    const currTrack = soundscapePlayer.getCurrentTrack();
    if (currTrack) setAudioTrack(currTrack);
    setIsPlayingAudio(true);
  };

  const handlePrevTrack = () => {
    soundscapePlayer.prevTrack();
    const currTrack = soundscapePlayer.getCurrentTrack();
    if (currTrack) setAudioTrack(currTrack);
    setIsPlayingAudio(true);
  };

  const toggleSound = () => {
    if (isPlayingAudio) {
      soundscapePlayer.stop();
      setIsPlayingAudio(false);
    } else {
      soundscapePlayer.setVolume(volume);
      soundscapePlayer.play(audioTrack);
      setIsPlayingAudio(true);
    }
  };

  const handleTrackChange = (track: FocusSoundTrackType) => {
    setAudioTrack(track);
    if (isPlayingAudio) {
      soundscapePlayer.play(track);
    }
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-[#090d16]/75 backdrop-blur-xl border-b border-white/6 px-4 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile trigger & Date badge */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white tracking-tight flex items-center gap-1.5">
              <span>{formattedDate}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Channel: <span className="text-cyan-300 font-semibold">{currentChannel}</span>
            </span>
          </div>
        </div>

        {/* Active Project Tag */}
        {activeProject && (
          <div
            onClick={() => onSelectModule('projects')}
            className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-200 cursor-pointer hover:bg-blue-500/20 transition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            <span className="text-slate-400">Active:</span>
            <span className="font-medium max-w-[140px] truncate">{activeProject.name}</span>
          </div>
        )}
      </div>

      {/* Right controls: Ambient soundscape, focus score, start focus, quick capture */}
      <div className="flex items-center gap-2.5">
        {/* Ambient Soundscapes Player */}
        <div className="relative">
          <div className="flex items-center gap-1 bg-white/[0.03] border border-white/8 rounded-xl p-1">
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                isPlayingAudio
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title={isPlayingAudio ? 'Stop ambient audio' : 'Play procedural ambient sound'}
              aria-label="Toggle ambient focus audio"
            >
              {isPlayingAudio ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline text-[11px]">Ambient ON</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline text-[11px]">Soundscape</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowAudioMenu(!showAudioMenu)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
              aria-label="Audio soundscape settings"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sound settings dropdown */}
          {showAudioMenu && (
            <div className="absolute right-0 mt-2 w-72 p-3.5 rounded-2xl bg-[#0e1626]/95 backdrop-blur-2xl border border-white/10 shadow-2xl z-50 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Soundscape & Playlists
                </span>
                <span className="text-[10px] text-slate-400 font-mono">WebAudio</span>
              </div>

              {/* 3 Curated Vibe Playlists (Chill, Energize, Work) */}
              <div className="p-2 rounded-xl bg-white/[0.03] border border-white/8 space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase font-bold">
                  <span>Curated Playlists</span>
                  {activePlaylist && (
                    <span className="text-cyan-300 capitalize">{activePlaylist} mode</span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['chill', 'energize', 'work'] as MusicVibePlaylist[]).map(vibe => {
                    const info = VIBE_PLAYLISTS[vibe];
                    const isActive = activePlaylist === vibe && isPlayingAudio;
                    return (
                      <button
                        key={vibe}
                        onClick={() => handlePlaylistSelect(vibe)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer flex flex-col items-center gap-0.5 border ${
                          isActive
                            ? 'bg-cyan-500/25 border-cyan-400/50 text-cyan-200 shadow-sm'
                            : 'bg-white/5 border-white/8 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                        title={info.tagline}
                      >
                        <span>{info.badge}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Playlist Player Controls (Prev, Track Title, Next) */}
                <div className="pt-1 flex items-center justify-between text-xs">
                  <button
                    onClick={handlePrevTrack}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                    title="Previous Track"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>

                  <div className="text-[10px] font-mono text-cyan-300 truncate max-w-[140px] text-center">
                    {FOCUS_TRACK_LIST.find(t => t.id === audioTrack)?.label || audioTrack}
                  </div>

                  <button
                    onClick={handleNextTrack}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                    title="Next Track"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {/* Key Brain Waves */}
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block px-1 mb-1">
                    🧠 Key Brain Focus
                  </span>
                  <div className="space-y-0.5">
                    {FOCUS_TRACK_LIST.filter(t => t.category === 'key-brain').map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleTrackChange(item.id)}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                          audioTrack === item.id
                            ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-500/40 font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {audioTrack === item.id && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Music */}
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block px-1 mb-1 pt-1">
                    🎨 Color Music Synesthesia
                  </span>
                  <div className="space-y-0.5">
                    {FOCUS_TRACK_LIST.filter(t => t.category === 'color-music').map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleTrackChange(item.id)}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                          audioTrack === item.id
                            ? 'bg-amber-500/25 text-amber-200 border border-amber-500/40 font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {audioTrack === item.id && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nature Ambient */}
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block px-1 mb-1 pt-1">
                    🌿 Nature & White Noise
                  </span>
                  <div className="space-y-0.5">
                    {FOCUS_TRACK_LIST.filter(t => t.category === 'ambient').map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleTrackChange(item.id)}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                          audioTrack === item.id
                            ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-500/40 font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {audioTrack === item.id && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Volume Slider */}
              <div className="space-y-1 pt-1 border-t border-white/6">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Volume</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    soundscapePlayer.setVolume(val);
                  }}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Focus Score Ring Widget (Matching reference 1) */}
        <div
          onClick={() => onSelectModule('analytics')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/6 hover:border-violet-500/30 transition cursor-pointer"
          title="Daily Focus Score"
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400 transition-all duration-700"
                strokeDasharray={`${focusScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium">Focus Score</span>
            <span className="text-xs font-bold text-white font-mono">{focusScore}%</span>
          </div>
        </div>

        {/* Start Focus Timer Button */}
        <button
          onClick={() => onSelectModule('focus')}
          className="py-1.5 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
        >
          <Timer className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Start Focus</span>
        </button>

        {/* Quick Capture Button */}
        <button
          onClick={onOpenQuickCapture}
          className="p-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 transition cursor-pointer shadow-md shadow-cyan-500/20"
          title="Quick Capture (Alt+C)"
          aria-label="Quick capture"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Lock OS Button */}
        {onLockOS && (
          <button
            onClick={onLockOS}
            className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer border border-white/6"
            title="Lock Personal OS (PIN / Biometric)"
            aria-label="Lock OS"
          >
            <Lock className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
