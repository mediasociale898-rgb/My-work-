import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Timer,
  Boxes,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  FileText,
  ExternalLink,
  Flame,
  Plus,
} from 'lucide-react';
import {
  DailyTask,
  DayPlan,
  ProjectItem,
  NoteItem,
  FocusSession,
  AppShortcut,
  SystemRecommendation,
} from '../types';
import { ActiveModule } from './Sidebar';
import { DailyAffirmationCard } from './DailyAffirmationCard';

interface DashboardViewProps {
  dayPlan: DayPlan;
  tasks: DailyTask[];
  onToggleTask: (taskId: string) => void;
  projects: ProjectItem[];
  notes: NoteItem[];
  focusSessions: FocusSession[];
  savedApps: AppShortcut[];
  recommendations: SystemRecommendation[];
  onSelectModule: (mod: ActiveModule) => void;
  onOpenQuickCapture: () => void;
  userName: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  dayPlan,
  tasks,
  onToggleTask,
  projects,
  notes,
  focusSessions,
  savedApps,
  recommendations,
  onSelectModule,
  onOpenQuickCapture,
  userName,
}) => {
  // 1. What am I working on today?
  const activeChannel = dayPlan.channel;
  const activeProject = projects.find(p => p.status === 'BUILDING') || projects[0];

  // 2. Three main tasks of the day
  const mainTasks = tasks
    .filter(t => t.isMainTask)
    .sort((a, b) => (a.prioritySlot || 3) - (b.prioritySlot || 3))
    .slice(0, 3);
  const completedMainCount = mainTasks.filter(t => t.completed).length;

  // 3. How much time have I focused?
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todaySessions = focusSessions.filter(s => s.completedAt.startsWith(todayDateStr));
  const todayFocusMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const focusGoalMinutes = dayPlan.focusGoalMinutes || 180;
  const focusPercent = Math.min(100, Math.round((todayFocusMinutes / focusGoalMinutes) * 100));

  // 4. What is unfinished?
  const unfinishedProjects = projects.filter(p => p.status !== 'COMPLETED' && p.status !== 'ARCHIVED');
  const unfinishedTasks = tasks.filter(t => !t.completed);

  // 5. Weekly progression (last 7 days dummy or computed)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyFocusData = [
    { day: 'Mon', minutes: 120, tasks: 5 },
    { day: 'Tue', minutes: 160, tasks: 6 },
    { day: 'Wed', minutes: 90, tasks: 3 },
    { day: 'Thu', minutes: todayFocusMinutes || 110, tasks: tasks.filter(t => t.completed).length || 4 },
    { day: 'Fri', minutes: 0, tasks: 0 },
    { day: 'Sat', minutes: 0, tasks: 0 },
    { day: 'Sun', minutes: 0, tasks: 0 },
  ];

  const primaryRecommendation = recommendations[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Welcome banner with Glowing Celestial Orb (Matching reference Image 1) */}
      <div className="relative overflow-hidden rounded-3xl p-6 lg:p-8 glass-panel-glow border border-white/10">
        {/* Celestial Glowing Orb element */}
        <div className="absolute top-[-30px] right-[-20px] lg:right-12 w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-br from-indigo-500/40 via-purple-600/30 to-cyan-400/20 filter blur-2xl pointer-events-none" />
        <div className="absolute top-6 right-6 lg:right-24 w-20 h-20 lg:w-28 lg:h-28 rounded-full bg-gradient-to-tr from-cyan-400 via-indigo-400 to-purple-500 shadow-2xl shadow-cyan-500/40 opacity-80 pointer-events-none flex items-center justify-center border border-white/20">
          <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-900/60" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Single-Channel Operating System</span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white">
            Good morning, {userName}
          </h2>

          <p className="text-sm text-slate-300 font-normal leading-relaxed">
            Your personal work OS is ready to keep you in flow. Today’s single focus channel is{' '}
            <span className="font-semibold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
              {activeChannel}
            </span>
            . No multitasking, no context switching.
          </p>

          {/* 5 Core Answers Quick Bar */}
          <div className="pt-2 flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Focus: <strong className="text-white font-mono">{todayFocusMinutes}m</strong> / {focusGoalMinutes}m
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Main Commitments: <strong className="text-white font-mono">{completedMainCount}/{mainTasks.length}</strong>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Unfinished Backlog: <strong className="text-white font-mono">{unfinishedTasks.length} tasks</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Component: Daily Affirmation & Focused Intent Anchor */}
      <DailyAffirmationCard />

      {/* Main Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): 3 Main Tasks + Weekly Chart */}
        <div className="lg:col-span-8 space-y-6">
          {/* Component: Three Main Tasks of the Day */}
          <div className="rounded-2xl glass-panel p-5 border border-white/8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    The Three-Task Rule
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    The 3 core commitments for today. Finish these before anything else.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectModule('planner')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition cursor-pointer"
              >
                <span>Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {mainTasks.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-white/10 rounded-xl text-xs text-slate-400">
                  No main tasks assigned for today.{' '}
                  <button
                    onClick={() => onSelectModule('planner')}
                    className="text-cyan-400 font-semibold underline ml-1 cursor-pointer"
                  >
                    Set 3 Main Tasks in Planner
                  </button>
                </div>
              ) : (
                mainTasks.map((task, idx) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                      task.completed
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-400'
                        : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/8 text-slate-200'
                    }`}
                  >
                    <button
                      className="mt-0.5 text-slate-400 hover:text-cyan-400 cursor-pointer"
                      aria-label={`Toggle completion of ${task.title}`}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400 font-bold border border-white/5">
                          Task {idx + 1}
                        </span>
                        <span
                          className={`text-xs font-semibold leading-snug ${
                            task.completed ? 'line-through text-slate-500' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      {task.notes && (
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{task.notes}</p>
                      )}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-medium whitespace-nowrap">
                      {task.channel}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Component: Weekly Progression & Consistency Chart */}
          <div className="rounded-2xl glass-panel p-5 border border-white/8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Weekly Focus & Completed Work
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Real execution vs backlog</span>
            </div>

            {/* SVG Bar Chart */}
            <div className="pt-2">
              <div className="grid grid-cols-7 gap-2 items-end h-32 px-2 border-b border-white/6 pb-2">
                {weeklyFocusData.map((d, i) => {
                  const maxMins = 180;
                  const barHeightPercent = Math.min(100, (d.minutes / maxMins) * 100);
                  const isToday = i === 3;
                  return (
                    <div key={d.day} className="flex flex-col items-center gap-2 h-full justify-end">
                      <div className="text-[10px] font-mono text-slate-400">
                        {d.minutes > 0 ? `${d.minutes}m` : '-'}
                      </div>
                      <div className="w-full bg-white/[0.04] rounded-t-lg h-24 flex items-end overflow-hidden p-0.5">
                        <div
                          style={{ height: `${barHeightPercent || 4}%` }}
                          className={`w-full rounded-t-md transition-all duration-500 ${
                            isToday
                              ? 'bg-gradient-to-t from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30'
                              : d.minutes > 0
                              ? 'bg-gradient-to-t from-indigo-600/70 to-purple-500/70'
                              : 'bg-white/5'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-mono ${
                          isToday ? 'text-cyan-400 font-bold' : 'text-slate-500'
                        }`}
                      >
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between pt-3 text-[11px] text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-cyan-500" /> Today's Focus
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-indigo-600" /> Past Routine
                  </span>
                </div>
                <button
                  onClick={() => onSelectModule('analytics')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  Full Analytics <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Component: Recent Notes & Rapid Quiz Recall */}
          <div className="rounded-2xl glass-panel p-5 border border-white/8 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Knowledge & Active Recall
                </h3>
              </div>
              <button
                onClick={() => onSelectModule('quizzes')}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Take Quizzes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {notes.slice(0, 2).map(n => (
                <div
                  key={n.id}
                  onClick={() => onSelectModule('notes')}
                  className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/6 hover:border-purple-500/30 transition cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono text-purple-300">{n.folder}</span>
                    <span>{new Date(n.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{n.title}</h4>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {n.tags.slice(0, 2).join(' · ')}
                    </span>
                    <span className="text-[10px] font-semibold text-purple-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Quiz Ready
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Active Project + Focus Ring + Saved Apps + Recommendation */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Project Card */}
          {activeProject && (
            <div className="rounded-2xl glass-panel p-5 border border-white/8 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                  <Boxes className="w-3.5 h-3.5 text-blue-400" /> Active Project
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {activeProject.status}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white tracking-tight">{activeProject.name}</h4>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {activeProject.description}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-cyan-300 font-bold">{activeProject.progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    style={{ width: `${activeProject.progressPercent}%` }}
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/6 text-xs text-slate-300">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide block mb-0.5">
                  Next Action:
                </span>
                <span>{activeProject.nextAction}</span>
              </div>

              <div className="pt-1 flex gap-2">
                <button
                  onClick={() => onSelectModule('projects')}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-500/30 text-xs font-semibold text-center transition cursor-pointer"
                >
                  Open in Project Lab
                </button>
                <button
                  onClick={() => onSelectModule('code')}
                  className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/8 text-xs font-medium cursor-pointer"
                  title="Open in Code Studio"
                >
                  Code
                </button>
              </div>
            </div>
          )}

          {/* Focus Timer Launch Card */}
          <div className="rounded-2xl glass-panel p-5 border border-white/8 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-cyan-400" /> Focus Controller
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Pomodoro 25/50</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-cyan-400"
                    strokeDasharray={`${focusPercent}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-xs font-mono font-bold text-white">{focusPercent}%</span>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-white">
                  {todayFocusMinutes} <span className="text-xs font-normal text-slate-400">mins logged</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Goal: {focusGoalMinutes}m daily deep concentration
                </p>
              </div>
            </div>

            <button
              onClick={() => onSelectModule('focus')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 cursor-pointer"
            >
              <Timer className="w-4 h-4" /> Start Focus Session
            </button>
          </div>

          {/* System Recommendation Banner (Per blueprint section 11) */}
          {primaryRecommendation && (
            <div className="rounded-2xl p-4 bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-500/25 space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>OS Recommendation</span>
              </div>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">
                {primaryRecommendation.recommendation}
              </p>
              {primaryRecommendation.actionModule && (
                <button
                  onClick={() => onSelectModule(primaryRecommendation.actionModule as ActiveModule)}
                  className="text-[11px] text-cyan-300 hover:text-cyan-200 font-semibold flex items-center gap-1 pt-1 cursor-pointer"
                >
                  {primaryRecommendation.actionLabel || 'Take Action'} <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Saved Apps Shortcuts Dock (Blueprint Section 7) */}
          <div className="rounded-2xl glass-panel p-4 border border-white/8 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white tracking-tight">Saved Apps</span>
              <button
                onClick={() => onSelectModule('launcher')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono cursor-pointer"
              >
                View all 12 →
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {savedApps.slice(0, 8).map(app => (
                <a
                  key={app.id}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/6 hover:border-cyan-500/30 transition text-center group flex flex-col items-center justify-center gap-1"
                  title={`${app.name} (${app.category})`}
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition">
                    {app.name.charAt(0)}
                  </div>
                  <span className="text-[10px] text-slate-300 truncate w-full group-hover:text-cyan-300">
                    {app.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
