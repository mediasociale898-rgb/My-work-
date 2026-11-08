import React, { useState, useEffect, useMemo } from 'react';
import {
  DailyTask,
  DayPlan,
  NoteItem,
  QuizItem,
  ProjectItem,
  FileFolderItem,
  CodeProject,
  FocusSession,
  AppShortcut,
  IdeaItem,
  AppSettings,
  ChannelType,
  ProjectCategory,
} from './types';
import { storageManager, FullBackupPayload } from './utils/storage';
import { computeSystemRecommendations } from './utils/recommendations';
import {
  initialTasks,
  initialDayPlan,
  initialNotes,
  initialQuizzes,
  initialProjects,
  initialFolders,
  initialCodeProjects,
  initialSavedApps,
  initialFocusSessions,
  initialIdeas,
  initialSettings,
} from './utils/initialData';

import { Sidebar, ActiveModule } from './components/Sidebar';
import { Header } from './components/Header';
import { QuickCaptureModal } from './components/QuickCaptureModal';

import { DashboardView } from './components/DashboardView';
import { PlannerView } from './components/PlannerView';
import { NotesView } from './components/NotesView';
import { QuizView } from './components/QuizView';
import { FileManagerView } from './components/FileManagerView';
import { CodeStudioView } from './components/CodeStudioView';
import { ProjectLabView } from './components/ProjectLabView';
import { ThreeDStudioView } from './components/ThreeDStudioView';
import { ColorMusicPiano } from './components/ColorMusicPiano';
import { FocusModeView } from './components/FocusModeView';
import { AnalyticsView } from './components/AnalyticsView';
import { AppLauncherView } from './components/AppLauncherView';
import { IdeasStrategyView } from './components/IdeasStrategyView';
import { SettingsView } from './components/SettingsView';
import { PrivacyTermsView } from './components/PrivacyTermsView';
import { SecurityLockModal } from './components/SecurityLockModal';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOSLocked, setIsOSLocked] = useState(false);
  const [isFullscreenCode, setIsFullscreenCode] = useState(false);

  // Core Application Data
  const [tasks, setTasks] = useState<DailyTask[]>(initialTasks);
  const [dayPlan, setDayPlan] = useState<DayPlan>(initialDayPlan);
  const [notes, setNotes] = useState<NoteItem[]>(initialNotes);
  const [quizzes, setQuizzes] = useState<QuizItem[]>(initialQuizzes);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [folders, setFolders] = useState<FileFolderItem[]>(initialFolders);
  const [codeProjects, setCodeProjects] = useState<CodeProject[]>(initialCodeProjects);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(initialFocusSessions);
  const [savedApps, setSavedApps] = useState<AppShortcut[]>(initialSavedApps);
  const [ideas, setIdeas] = useState<IdeaItem[]>(initialIdeas);
  const [settings, setSettings] = useState<AppSettings>(initialSettings);

  // Load from IndexedDB on startup
  useEffect(() => {
    storageManager.loadAllData().then(data => {
      setTasks(data.tasks);
      setDayPlan(data.dayPlan);
      setNotes(data.notes);
      setQuizzes(data.quizzes);
      setProjects(data.projects);
      setFolders(data.folders);
      setCodeProjects(data.codeProjects);
      setFocusSessions(data.focusSessions);
      setSavedApps(data.savedApps);
      setIdeas(data.ideas);
      setSettings(data.settings);
      setIsLoaded(true);
    });
  }, []);

  // Save to IndexedDB when data changes (debounced)
  useEffect(() => {
    if (!isLoaded) return;
    const timeout = setTimeout(() => {
      const payload: FullBackupPayload = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        tasks,
        dayPlan,
        notes,
        quizzes,
        projects,
        folders,
        codeProjects,
        focusSessions,
        savedApps,
        ideas,
        settings,
      };
      storageManager.saveAllData(payload);
    }, 400);

    return () => clearTimeout(timeout);
  }, [
    isLoaded,
    tasks,
    dayPlan,
    notes,
    quizzes,
    projects,
    folders,
    codeProjects,
    focusSessions,
    savedApps,
    ideas,
    settings,
  ]);

  // Global Keyboard Shortcuts (Alt+C for Quick Capture)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'c') || (e.metaKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setIsQuickCaptureOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute Focus Score (matching reference 1: e.g. 86%)
  const focusScore = useMemo(() => {
    const mainTasks = tasks.filter(t => t.isMainTask);
    const completedMain = mainTasks.filter(t => t.completed).length;
    const taskScore = mainTasks.length > 0 ? (completedMain / mainTasks.length) * 50 : 25;

    const todayDateStr = new Date().toISOString().split('T')[0];
    const todaySessions = focusSessions.filter(s => s.completedAt.startsWith(todayDateStr));
    const todayMins = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const focusRatio = Math.min(1, todayMins / (dayPlan.focusGoalMinutes || 180));
    const focusPoints = focusRatio * 50;

    return Math.min(100, Math.round(taskScore + focusPoints));
  }, [tasks, focusSessions, dayPlan]);

  // Compute System Recommendations
  const recommendations = useMemo(() => {
    return computeSystemRecommendations(tasks, projects, quizzes, focusSessions);
  }, [tasks, projects, quizzes, focusSessions]);

  // Active Project
  const activeProject = projects.find(p => p.status === 'BUILDING') || projects[0];

  // Handlers for Tasks
  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const completed = !t.completed;
          return {
            ...t,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask: {
    title: string;
    isMainTask: boolean;
    prioritySlot?: 1 | 2 | 3;
    channel: ChannelType;
    estimatedMinutes: number;
    notes?: string;
  }) => {
    const created: DailyTask = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      isMainTask: newTask.isMainTask,
      prioritySlot: newTask.prioritySlot,
      completed: false,
      channel: newTask.channel,
      estimatedMinutes: newTask.estimatedMinutes,
      notes: newTask.notes,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [created, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Handlers for Notes & Quizzes
  const handleSaveNote = (note: NoteItem) => {
    setNotes(prev => {
      const idx = prev.findIndex(n => n.id === note.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = note;
        return copy;
      }
      return [note, ...prev];
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const handleAddQuiz = (quiz: QuizItem) => {
    setQuizzes(prev => [quiz, ...prev]);
  };

  const handleUpdateQuiz = (quiz: QuizItem) => {
    setQuizzes(prev => {
      const idx = prev.findIndex(q => q.id === quiz.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = quiz;
        return copy;
      }
      return [quiz, ...prev];
    });
  };

  // Handlers for Projects
  const handleSaveProject = (project: ProjectItem) => {
    setProjects(prev => {
      const idx = prev.findIndex(p => p.id === project.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = project;
        return copy;
      }
      return [project, ...prev];
    });
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  // Handlers for Files
  const handleAddFile = (file: FileFolderItem) => {
    setFolders(prev => [file, ...prev]);
  };

  const handleDeleteFile = (fileId: string) => {
    setFolders(prev => prev.filter(f => f.id !== fileId));
  };

  // Handlers for Focus Sessions
  const handleCompleteSession = (session: FocusSession) => {
    setFocusSessions(prev => [session, ...prev]);
  };

  // Handlers for App Launcher
  const handleSaveApp = (app: AppShortcut) => {
    setSavedApps(prev => {
      const idx = prev.findIndex(a => a.id === app.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = app;
        return copy;
      }
      return [...prev, app];
    });
  };

  const handleDeleteApp = (appId: string) => {
    setSavedApps(prev => prev.filter(a => a.id !== appId));
  };

  // Handlers for Ideas & Promotion to Project
  const handleSaveIdea = (idea: IdeaItem) => {
    setIdeas(prev => {
      const idx = prev.findIndex(i => i.id === idea.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = idea;
        return copy;
      }
      return [idea, ...prev];
    });
  };

  const handleDeleteIdea = (ideaId: string) => {
    setIdeas(prev => prev.filter(i => i.id !== ideaId));
  };

  const handleAddQuickNote = (note: { title: string; folder: string; content: string; tags: string[] }) => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: note.title,
      folder: note.folder,
      tags: note.tags,
      content: note.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    handleSaveNote(newNote);
  };

  const handleAddQuickIdea = (idea: { title: string; category: string; description: string }) => {
    const newIdea: IdeaItem = {
      id: `idea-${Date.now()}`,
      title: idea.title,
      category: idea.category,
      description: idea.description,
      stage: 'RAW',
      votes: 1,
      createdAt: new Date().toISOString(),
    };
    handleSaveIdea(newIdea);
  };

  const handlePromoteIdeaToProject = (idea: IdeaItem) => {
    const newProject: ProjectItem = {
      id: `proj-from-idea-${Date.now()}`,
      name: idea.title,
      category: (idea.category as ProjectCategory) || 'Robotics',
      status: 'PLANNING',
      description: idea.description,
      objective: 'Transitioned from idea incubator. Establish system architecture and requirements.',
      nextAction: 'Define technical specification and initial BOM.',
      progressPercent: 15,
      lastModified: new Date().toISOString(),
      attachedFiles: [],
      notesHistory: [
        {
          date: new Date().toISOString().split('T')[0],
          text: `Promoted from Idea Incubator with ${idea.votes} community validation points.`,
        },
      ],
    };
    handleSaveProject(newProject);
    setActiveModule('projects');
  };

  // Restore & Reset
  const handleRestoreBackup = (payload: FullBackupPayload) => {
    setTasks(payload.tasks);
    setDayPlan(payload.dayPlan);
    setNotes(payload.notes);
    setQuizzes(payload.quizzes);
    setProjects(payload.projects);
    setFolders(payload.folders);
    setCodeProjects(payload.codeProjects);
    setFocusSessions(payload.focusSessions);
    setSavedApps(payload.savedApps);
    setIdeas(payload.ideas);
    setSettings(payload.settings);
  };

  const handleResetToDemo = () => {
    setTasks(initialTasks);
    setDayPlan(initialDayPlan);
    setNotes(initialNotes);
    setQuizzes(initialQuizzes);
    setProjects(initialProjects);
    setFolders(initialFolders);
    setCodeProjects(initialCodeProjects);
    setFocusSessions(initialFocusSessions);
    setSavedApps(initialSavedApps);
    setIdeas(initialIdeas);
    setSettings(initialSettings);
  };

  const fullPayload: FullBackupPayload = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    tasks,
    dayPlan,
    notes,
    quizzes,
    projects,
    folders,
    codeProjects,
    focusSessions,
    savedApps,
    ideas,
    settings,
  };

  return (
    <div className="min-h-screen bg-[#080b12] text-[#e2e8f0] relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Ambient background glowing orbs */}
      <div className="fixed top-[-100px] right-[10%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-indigo-600/15 via-purple-700/10 to-cyan-500/10 orb-glow pointer-events-none z-0" />
      <div className="fixed bottom-[-150px] left-[5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-cyan-600/10 via-blue-700/10 to-indigo-800/10 orb-glow pointer-events-none z-0" />

      {/* 12-Module Sidebar (Hidden in Code Studio Fullscreen Zen Mode) */}
      {!isFullscreenCode && (
        <Sidebar
          activeModule={activeModule}
          onSelectModule={mod => {
            if (isFullscreenCode) setIsFullscreenCode(false);
            setActiveModule(mod);
          }}
          currentChannel={dayPlan.channel}
          onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
          isOpenMobile={isOpenMobile}
          onCloseMobile={() => setIsOpenMobile(false)}
          settings={settings}
          onLockOS={() => setIsOSLocked(true)}
        />
      )}

      {/* Main Content Area */}
      <div className={`${isFullscreenCode ? 'pl-0' : 'lg:pl-72'} flex flex-col min-h-screen relative z-10 transition-all duration-300`}>
        {!isFullscreenCode && (
          <Header
            onToggleMobileMenu={() => setIsOpenMobile(!isOpenMobile)}
            activeModule={activeModule}
            onSelectModule={setActiveModule}
            currentChannel={dayPlan.channel}
            activeProject={activeProject}
            onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
            focusScore={focusScore}
            onLockOS={() => setIsOSLocked(true)}
          />
        )}

        <main className={`flex-1 ${isFullscreenCode ? 'p-0 max-w-none w-full' : 'px-4 lg:px-8 pt-6 max-w-7xl w-full mx-auto'}`}>
          {activeModule === 'dashboard' && (
            <DashboardView
              dayPlan={dayPlan}
              tasks={tasks}
              onToggleTask={handleToggleTask}
              projects={projects}
              notes={notes}
              focusSessions={focusSessions}
              savedApps={savedApps}
              recommendations={recommendations}
              onSelectModule={setActiveModule}
              onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
              userName={settings.userName}
            />
          )}

          {activeModule === 'planner' && (
            <PlannerView
              dayPlan={dayPlan}
              onUpdateDayPlan={updates => setDayPlan(prev => ({ ...prev, ...updates }))}
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onSelectModule={setActiveModule}
            />
          )}

          {activeModule === 'notes' && (
            <NotesView
              notes={notes}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
              onAddQuiz={handleAddQuiz}
              onSelectModule={setActiveModule}
            />
          )}

          {activeModule === 'quizzes' && (
            <QuizView
              quizzes={quizzes}
              onUpdateQuiz={handleUpdateQuiz}
            />
          )}

          {activeModule === 'files' && (
            <FileManagerView
              files={folders}
              onAddFile={handleAddFile}
              onDeleteFile={handleDeleteFile}
            />
          )}

          {activeModule === 'code' && (
            <CodeStudioView
              codeProjects={codeProjects}
              isFullscreen={isFullscreenCode}
              onToggleFullscreen={setIsFullscreenCode}
              onSaveCodeProject={proj => {
                setCodeProjects(prev => {
                  const idx = prev.findIndex(p => p.id === proj.id);
                  if (idx >= 0) {
                    const copy = [...prev];
                    copy[idx] = proj;
                    return copy;
                  }
                  return [proj, ...prev];
                });
              }}
            />
          )}

          {activeModule === 'projects' && (
            <ProjectLabView
              projects={projects}
              onSaveProject={handleSaveProject}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {activeModule === '3dview' && (
            <ThreeDStudioView />
          )}

          {activeModule === 'piano' && (
            <ColorMusicPiano />
          )}

          {activeModule === 'focus' && (
            <FocusModeView
              currentChannel={dayPlan.channel}
              tasks={tasks}
              onCompleteSession={handleCompleteSession}
              onToggleTask={handleToggleTask}
            />
          )}

          {activeModule === 'analytics' && (
            <AnalyticsView
              tasks={tasks}
              projects={projects}
              quizzes={quizzes}
              notes={notes}
              focusSessions={focusSessions}
            />
          )}

          {activeModule === 'launcher' && (
            <AppLauncherView
              savedApps={savedApps}
              onSaveApp={handleSaveApp}
              onDeleteApp={handleDeleteApp}
            />
          )}

          {activeModule === 'strategy' && (
            <IdeasStrategyView
              ideas={ideas}
              onSaveIdea={handleSaveIdea}
              onDeleteIdea={handleDeleteIdea}
              recommendations={recommendations}
              onPromoteIdeaToProject={handlePromoteIdeaToProject}
              onSelectModule={setActiveModule}
            />
          )}

          {activeModule === 'settings' && (
            <SettingsView
              settings={settings}
              onUpdateSettings={updates => setSettings(prev => ({ ...prev, ...updates }))}
              fullPayload={fullPayload}
              onRestoreBackup={handleRestoreBackup}
              onResetToDemo={handleResetToDemo}
            />
          )}

          {activeModule === 'privacy' && (
            <PrivacyTermsView />
          )}
        </main>
      </div>

      {/* Security PIN & Biometric Lock Modal */}
      <SecurityLockModal
        isLocked={isOSLocked}
        pin={settings.pin}
        isBiometricEnabled={settings.isBiometricEnabled !== false}
        onUnlock={() => setIsOSLocked(false)}
        userName={settings.userName}
      />

      {/* Quick Capture Modal (Alt+C) */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        onAddTask={handleAddTask}
        onAddNote={handleAddQuickNote}
        onAddIdea={handleAddQuickIdea}
        currentChannel={dayPlan.channel}
      />
    </div>
  );
}
