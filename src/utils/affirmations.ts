/**
 * Curated motivational quotes and affirmations designed for deep focus,
 * single-channel execution, craftsmanship, and mental clarity.
 */

export interface Affirmation {
  id: string;
  quote: string;
  author: string;
  role: string;
  theme: string;
  themeColor: string;
  reflectionPrompt: string;
}

export const CURATED_AFFIRMATIONS: Affirmation[] = [
  {
    id: 'aff-1',
    quote: 'The soul becomes dyed with the color of its thoughts. Focus only on what is in your power to execute today.',
    author: 'Marcus Aurelius',
    role: 'Stoic Philosopher & Roman Emperor',
    theme: 'Single-Channel Focus',
    themeColor: 'from-cyan-400 to-blue-500',
    reflectionPrompt: 'What is the one essential commitment you will refuse to compromise on today?',
  },
  {
    id: 'aff-2',
    quote: 'Simplicity is about subtracting the obvious and adding the meaningful. Strip away every task that is not essential.',
    author: 'John Maeda',
    role: 'Technologist & Designer',
    theme: 'Radical Elimination',
    themeColor: 'from-amber-400 to-orange-500',
    reflectionPrompt: 'Which secondary task can you eliminate right now to protect your 3 main commitments?',
  },
  {
    id: 'aff-3',
    quote: 'Real artists ship. Great work is not measured by open tabs or busyness, but by finished artifacts in the world.',
    author: 'Steve Jobs',
    role: 'Co-Founder of Apple',
    theme: 'Finished Output',
    themeColor: 'from-emerald-400 to-teal-500',
    reflectionPrompt: 'What unfinished project in your lab will move one step closer to completion today?',
  },
  {
    id: 'aff-4',
    quote: 'I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.',
    author: 'Bruce Lee',
    role: 'Martial Artist & Philosopher',
    theme: 'Deliberate Mastery',
    themeColor: 'from-rose-400 to-red-500',
    reflectionPrompt: 'Dedicate this sprint to mastering one difficult problem rather than skimming ten easy ones.',
  },
  {
    id: 'aff-5',
    quote: 'Clarity about what matters provides clarity about what does not. Guard your attention like your most valuable capital.',
    author: 'Cal Newport',
    role: 'Author of Deep Work',
    theme: 'Attention Shield',
    themeColor: 'from-purple-400 to-indigo-500',
    reflectionPrompt: 'Silence notifications and external inputs during your next 40-minute focus sprint.',
  },
  {
    id: 'aff-6',
    quote: 'You do not rise to the level of your goals. You fall to the level of your systems. Trust your daily routine.',
    author: 'James Clear',
    role: 'Author of Atomic Habits',
    theme: 'System Execution',
    themeColor: 'from-blue-400 to-cyan-500',
    reflectionPrompt: 'Let the My Work OS sequence guide you: Capture, Organize, Plan, Focus, Execute, Review.',
  },
  {
    id: 'aff-7',
    quote: 'Details make perfection, and perfection is not a detail. Bring quiet patience and pride to every line of code and design.',
    author: 'Leonardo da Vinci',
    role: 'Renaissance Polymath',
    theme: 'Craft & Precision',
    themeColor: 'from-amber-300 to-yellow-500',
    reflectionPrompt: 'Slow down for 10 minutes to polish the architecture of your active project.',
  },
  {
    id: 'aff-8',
    quote: 'Work is love made visible. When you build with passion and undivided attention, your work speaks across time.',
    author: 'Kahlil Gibran',
    role: 'Poet & Philosopher',
    theme: 'Passionate Craft',
    themeColor: 'from-pink-400 to-rose-500',
    reflectionPrompt: 'Infuse your active project with craftsmanship that you would be proud to showcase anywhere.',
  },
  {
    id: 'aff-9',
    quote: 'The present is theirs; the future, for which I really worked, is mine. Build things with deep structural integrity.',
    author: 'Nikola Tesla',
    role: 'Inventor & Electrical Engineer',
    theme: 'Visionary Engineering',
    themeColor: 'from-cyan-400 to-indigo-600',
    reflectionPrompt: 'Look past quick shortcuts; architect systems that will remain reliable months from now.',
  },
  {
    id: 'aff-10',
    quote: 'Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.',
    author: 'Marie Curie',
    role: 'Physicist & Nobel Laureate',
    theme: 'Fearless Inquiry',
    themeColor: 'from-teal-400 to-emerald-600',
    reflectionPrompt: 'Face that difficult bug or complex mathematical problem with calm, structured curiosity.',
  },
  {
    id: 'aff-11',
    quote: 'It is not that we have a short time to live, but that we waste a lot of it. Life is long enough if you spend it with intention.',
    author: 'Seneca',
    role: 'Stoic Philosopher',
    theme: 'Intentional Living',
    themeColor: 'from-violet-400 to-purple-600',
    reflectionPrompt: 'Treat every 60-minute focus block as an irreplaceable gift of creative agency.',
  },
  {
    id: 'aff-12',
    quote: 'The best moments in our lives are when our body or mind is stretched to its limits in a voluntary effort to accomplish something difficult.',
    author: 'Mihaly Csikszentmihalyi',
    role: 'Psychologist & Father of Flow',
    theme: 'Flow State',
    themeColor: 'from-sky-400 to-blue-600',
    reflectionPrompt: 'Immerse fully into your single channel today. Welcome the productive struggle.',
  },
  {
    id: 'aff-13',
    quote: 'Nature does not hurry, yet everything is accomplished. Consistent, calm momentum outperforms erratic hustle.',
    author: 'Lao Tzu',
    role: 'Ancient Philosopher',
    theme: 'Consistent Momentum',
    themeColor: 'from-emerald-400 to-green-600',
    reflectionPrompt: 'Progress is not made in desperate sprints, but in daily disciplined steps.',
  },
  {
    id: 'aff-14',
    quote: 'Action expresses priorities. If you say something is important, let your focus timer and calendar prove it.',
    author: 'Mahatma Gandhi',
    role: 'Philosopher & Leader',
    theme: 'Proof in Action',
    themeColor: 'from-amber-400 to-red-500',
    reflectionPrompt: 'Does your Task #1 truly reflect what matters most to your long-term output?',
  },
  {
    id: 'aff-15',
    quote: 'To do two things at once is to do neither. Single-tasking is the ultimate superpower of the modern era.',
    author: 'Publilius Syrus',
    role: 'Classical Thinker',
    theme: 'Singular Focus',
    themeColor: 'from-cyan-300 to-teal-500',
    reflectionPrompt: 'Close all background browser tabs and work exclusively on Task 1 until it is done.',
  },
];

/**
 * Deterministically computes the daily affirmation for any given date.
 * Ensures every single day has a distinct quote that stays stable throughout that 24-hour day.
 */
export function getDailyAffirmation(date: Date = new Date()): Affirmation {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const diffTime = date.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Hash combining year and day of year for variety across years
  const index = Math.abs((year * 31 + dayOfYear) % CURATED_AFFIRMATIONS.length);
  return CURATED_AFFIRMATIONS[index];
}

/**
 * Returns a random affirmation excluding the current one if specified.
 */
export function getRandomAffirmation(excludeId?: string): Affirmation {
  const filtered = excludeId
    ? CURATED_AFFIRMATIONS.filter(a => a.id !== excludeId)
    : CURATED_AFFIRMATIONS;
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex] || CURATED_AFFIRMATIONS[0];
}

/**
 * Local storage key for storing user custom intent mantra.
 */
export const DAILY_MANTRA_STORAGE_KEY = 'mywork_daily_intent_mantra';

export interface StoredDailyIntent {
  date: string;
  mantra: string;
  author: string;
  theme: string;
  isCustom: boolean;
}

export function saveStoredDailyIntent(intent: StoredDailyIntent): void {
  try {
    localStorage.setItem(DAILY_MANTRA_STORAGE_KEY, JSON.stringify(intent));
  } catch {
    // ignore in SSR / private contexts
  }
}

export function getStoredDailyIntent(): StoredDailyIntent | null {
  try {
    const raw = localStorage.getItem(DAILY_MANTRA_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
