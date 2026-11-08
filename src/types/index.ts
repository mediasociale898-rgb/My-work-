export type ChannelType = 
  | 'Software' 
  | 'Robotics' 
  | 'Electrical' 
  | 'Mathematics' 
  | 'Physics' 
  | 'Research' 
  | 'Writing';

export interface DailyTask {
  id: string;
  title: string;
  isMainTask: boolean; // True for the 3 main daily commitments
  prioritySlot?: 1 | 2 | 3;
  completed: boolean;
  channel: ChannelType;
  estimatedMinutes?: number;
  actualMinutes?: number;
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface DayPlan {
  date: string; // YYYY-MM-DD
  channel: ChannelType;
  focusGoalMinutes: number;
  reflectionNotes?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  folder: string; // e.g., 'Education/Programming' or 'NTFY/Robotics'
  tags: string[];
  content: string; // Markdown / text
  createdAt: string;
  updatedAt: string;
  isPinned?: boolean;
}

export type QuestionType = 'multiple-choice' | 'true-false' | 'flashcard' | 'fill-blank';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string;
  explanation?: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface QuizItem {
  id: string;
  title: string;
  noteId?: string;
  folder: string;
  questions: QuizQuestion[];
  lastAttemptScore?: number; // 0 - 100
  totalAttempts: number;
  lastAttemptDate?: string;
  weakQuestionIds: string[];
}

export type ProjectStatus = 
  | 'IDEA' 
  | 'PLANNING' 
  | 'BUILDING' 
  | 'TESTING' 
  | 'REVISION' 
  | 'COMPLETED' 
  | 'ARCHIVED';

export type ProjectCategory = 
  | 'Software' 
  | 'Robotics' 
  | 'Electrical' 
  | '3D CAD' 
  | 'PCB Design' 
  | 'Research';

export interface ProjectAttachedFile {
  id: string;
  name: string;
  size: number;
  type: string; // 'stl' | 'obj' | 'glb' | 'kicad_pcb' | 'kicad_sch' | 'code' | 'doc'
  lastModified: string;
  contentSnippet?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  category: ProjectCategory;
  status: ProjectStatus;
  description: string;
  objective: string;
  nextAction: string;
  coverImage?: string;
  progressPercent: number;
  progressHistory?: { day: string; progress: number }[];
  lastModified: string;
  attachedFiles: ProjectAttachedFile[];
  notesHistory: { date: string; text: string }[];
}

export interface FileFolderItem {
  id: string;
  name: string;
  path: string; // e.g., 'Education/Mathematics'
  size: number;
  extension: string;
  updatedAt: string;
  tags: string[];
  content?: string;
  mediaUrl?: string; // Data URL or object URL for videos, photos, word docs
  fileCategory?: 'video' | 'photo' | 'code' | 'document' | '3d' | 'pcb' | 'other';
}

export interface CodeProject {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  pythonCode?: string;
  cppCode?: string;
  language?: 'web' | 'python' | 'cpp';
  updatedAt: string;
}

export interface FocusSession {
  id: string;
  channel: ChannelType;
  durationMinutes: number;
  taskId?: string;
  taskTitle?: string;
  completedAt: string;
  notes?: string;
  soundscapeUsed?: string;
}

export interface AppShortcut {
  id: string;
  name: string;
  url: string;
  category: string;
  icon: string;
  isFavorite: boolean;
  order: number;
}

export interface IdeaItem {
  id: string;
  title: string;
  category: string;
  description: string;
  stage: 'RAW' | 'EVALUATING' | 'READY_FOR_PROJECT';
  votes: number;
  createdAt: string;
}

export interface SystemRecommendation {
  id: string;
  situation: string;
  recommendation: string;
  severity: 'low' | 'medium' | 'high';
  category: 'workload' | 'project' | 'recall' | 'focus' | 'strategy';
  actionLabel?: string;
  actionModule?: string;
}

export interface AppSettings {
  theme: 'deep-charcoal' | 'sunset-amber' | 'midnight-obsidian';
  soundEnabled: boolean;
  defaultTimerMinutes: number;
  enableEncryption: boolean;
  userName: string;
  pin?: string;
  isPinEnabled?: boolean;
  isBiometricEnabled?: boolean;
}

export interface MusicTrack {
  id: string;
  title: string;
  composer: string;
  category: 'gibran-al-color' | 'user-upload';
  harmonicKey: string;
  colorSpectrum: string;
  duration: string;
  description: string;
  audioUrl?: string;
  proceduralChords?: { notes: { freq: number; note: string }[]; duration: number }[];
}

