import React, { useState, useEffect } from 'react';
import {
  Quote,
  Sparkles,
  Shuffle,
  Copy,
  Check,
  Target,
  Edit3,
  RotateCcw,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import {
  Affirmation,
  getDailyAffirmation,
  getRandomAffirmation,
  getStoredDailyIntent,
  saveStoredDailyIntent,
  StoredDailyIntent,
} from '../utils/affirmations';

interface DailyAffirmationCardProps {
  onSetIntentChannel?: (theme: string) => void;
}

export const DailyAffirmationCard: React.FC<DailyAffirmationCardProps> = () => {
  const [currentAffirmation, setCurrentAffirmation] = useState<Affirmation>(() => getDailyAffirmation());
  const [isIntentLocked, setIsIntentLocked] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEditingCustom, setIsEditingCustom] = useState<boolean>(false);
  const [customQuoteText, setCustomQuoteText] = useState<string>('');
  const [customTheme, setCustomTheme] = useState<string>('Personal Focus');
  const [isCustomActive, setIsCustomActive] = useState<boolean>(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const formattedToday = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  // Check stored intent on mount
  useEffect(() => {
    const stored = getStoredDailyIntent();
    if (stored && stored.date === todayStr) {
      if (stored.isCustom) {
        setIsCustomActive(true);
        setCustomQuoteText(stored.mantra);
        setCustomTheme(stored.theme);
        setCurrentAffirmation({
          id: 'custom-daily-mantra',
          quote: stored.mantra,
          author: stored.author || 'You',
          role: 'Personal Daily Intent Anchor',
          theme: stored.theme || 'Personal Commitment',
          themeColor: 'from-amber-400 to-cyan-400',
          reflectionPrompt: 'Honor your own commitment today with uncompromising single-channel focus.',
        });
      }
      setIsIntentLocked(true);
    }
  }, [todayStr]);

  const handleNextQuote = () => {
    setIsCustomActive(false);
    setIsEditingCustom(false);
    const next = getRandomAffirmation(currentAffirmation.id);
    setCurrentAffirmation(next);
  };

  const handleResetToDailyDefault = () => {
    setIsCustomActive(false);
    setIsEditingCustom(false);
    const defaultAff = getDailyAffirmation();
    setCurrentAffirmation(defaultAff);
  };

  const handleLockIntent = () => {
    const intentData: StoredDailyIntent = {
      date: todayStr,
      mantra: currentAffirmation.quote,
      author: currentAffirmation.author,
      theme: currentAffirmation.theme,
      isCustom: isCustomActive,
    };
    saveStoredDailyIntent(intentData);
    setIsIntentLocked(true);
  };

  const handleSaveCustomMantra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuoteText.trim()) return;

    const customAff: Affirmation = {
      id: `custom-${Date.now()}`,
      quote: customQuoteText.trim(),
      author: 'Personal Mantra',
      role: 'Self-Determined Commitment',
      theme: customTheme.trim() || 'Focus Intent',
      themeColor: 'from-amber-400 to-cyan-400',
      reflectionPrompt: 'This is your self-chosen standard for today. Protect it relentlessly.',
    };

    setCurrentAffirmation(customAff);
    setIsCustomActive(true);
    setIsEditingCustom(false);

    const intentData: StoredDailyIntent = {
      date: todayStr,
      mantra: customAff.quote,
      author: customAff.author,
      theme: customAff.theme,
      isCustom: true,
    };
    saveStoredDailyIntent(intentData);
    setIsIntentLocked(true);
  };

  const handleCopy = () => {
    const textToCopy = `"${currentAffirmation.quote}" — ${currentAffirmation.author} (${currentAffirmation.theme})`;
    navigator.clipboard.writeText(textToCopy).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 lg:p-7 glass-panel-glow border border-white/10 space-y-4">
      {/* Background ambient watermarks and glow */}
      <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-cyan-500/10 filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-44 h-44 rounded-full bg-indigo-600/10 filter blur-3xl pointer-events-none" />
      <div className="absolute right-4 top-2 select-none pointer-events-none text-white/[0.03] font-serif text-9xl leading-none">
        “
      </div>

      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-300 shadow-sm">
            <Compass className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                Daily Focus Intent & Affirmation
              </span>
              {isIntentLocked && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Intent Locked
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Anchor for {formattedToday} • Single-Minded Focus
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={handleCopy}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/8 transition cursor-pointer flex items-center gap-1.5"
            title="Copy quote to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => setIsEditingCustom(!isEditingCustom)}
            className={`p-2 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
              isEditingCustom
                ? 'bg-amber-500/20 text-amber-200 border-amber-500/40 shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/8'
            }`}
            title="Write your own custom daily intent mantra"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{isEditingCustom ? 'Cancel' : 'Custom Mantra'}</span>
          </button>

          <button
            onClick={handleNextQuote}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/8 transition cursor-pointer flex items-center gap-1.5"
            title="Show another curated focus quote"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          {isCustomActive && (
            <button
              onClick={handleResetToDailyDefault}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/8 transition cursor-pointer"
              title="Reset to today's standard quote"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>
      </div>

      {/* Custom Mantra Inline Form */}
      {isEditingCustom ? (
        <form onSubmit={handleSaveCustomMantra} className="space-y-3 pt-2 relative z-10">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              Write Your Personal Intent Mantra for Today:
            </label>
            <textarea
              value={customQuoteText}
              onChange={e => setCustomQuoteText(e.target.value)}
              placeholder="e.g. Today I will build the core data structures with zero distractions and deep stillness."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#070a14] border border-white/12 text-white text-xs leading-relaxed focus:outline-none focus:border-cyan-400 placeholder:text-slate-600 resize-none"
              autoFocus
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-mono">Theme Tag:</span>
              <input
                type="text"
                value={customTheme}
                onChange={e => setCustomTheme(e.target.value)}
                placeholder="e.g. Pure Execution"
                className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400 w-36"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditingCustom(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold text-xs transition shadow-md shadow-orange-500/20 cursor-pointer"
              >
                Set as Daily Mantra
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Quote Display */
        <div className="space-y-3.5 relative z-10">
          {/* Quote Body with Typographic Elegance */}
          <div className="flex items-start gap-3">
            <Quote className="w-5 h-5 text-cyan-400 shrink-0 mt-1 opacity-70" />
            <blockquote className="text-sm lg:text-base font-medium text-slate-100 italic leading-relaxed tracking-wide">
              "{currentAffirmation.quote}"
            </blockquote>
          </div>

          {/* Author, Theme & Reflection Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-white/6">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-xl bg-gradient-to-tr ${currentAffirmation.themeColor} flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0`}
              >
                {currentAffirmation.author.charAt(0)}
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  {currentAffirmation.author}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {currentAffirmation.role}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                {currentAffirmation.theme}
              </span>

              {/* Set as Today's Intent Button */}
              {!isIntentLocked ? (
                <button
                  onClick={handleLockIntent}
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition cursor-pointer"
                  title="Lock this affirmation as your operating intent for today"
                >
                  <Target className="w-3 h-3" />
                  <span>Lock Daily Intent</span>
                </button>
              ) : (
                <button
                  onClick={handleLockIntent}
                  className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs flex items-center gap-1 border border-white/8 transition cursor-pointer"
                  title="Re-lock this quote as current intent"
                >
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-[11px]">Active</span>
                </button>
              )}
            </div>
          </div>

          {/* Micro-Anchor / Reflection Prompt Box */}
          <div className="p-3 rounded-2xl bg-white/[0.025] border border-white/6 flex items-start gap-2.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 shrink-0 mt-0.5">
              Intent Prompt:
            </span>
            <p className="text-[11px] text-slate-300 leading-snug">
              {currentAffirmation.reflectionPrompt}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
