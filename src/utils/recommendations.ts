import { DailyTask, ProjectItem, QuizItem, FocusSession, SystemRecommendation } from '../types';

export function computeSystemRecommendations(
  tasks: DailyTask[],
  projects: ProjectItem[],
  quizzes: QuizItem[],
  focusSessions: FocusSession[]
): SystemRecommendation[] {
  const recommendations: SystemRecommendation[] = [];

  // 1. Check unfinished main tasks
  const mainTasks = tasks.filter(t => t.isMainTask);
  const unfinishedMain = mainTasks.filter(t => !t.completed);
  if (mainTasks.length >= 3 && unfinishedMain.length >= 2) {
    recommendations.push({
      id: 'rec-workload-reduction',
      situation: `${unfinishedMain.length} main daily tasks remained unfinished today.`,
      recommendation: "Reduce tomorrow's workload. Commit to just 1 or 2 high-impact items so you rebuild momentum without cognitive burnout.",
      severity: 'high',
      category: 'workload',
      actionLabel: 'Open Planner',
      actionModule: 'planner',
    });
  }

  // 2. Check inactive projects (> 7 days)
  const now = new Date().getTime();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const staleProjects = projects.filter(p => {
    if (p.status === 'COMPLETED' || p.status === 'ARCHIVED') return false;
    const modifiedTime = new Date(p.lastModified).getTime();
    return now - modifiedTime > sevenDaysMs;
  });

  if (staleProjects.length > 0) {
    const p = staleProjects[0];
    recommendations.push({
      id: `rec-stale-project-${p.id}`,
      situation: `Project "${p.name}" has been idle for over 7 days.`,
      recommendation: `Review its next action: "${p.nextAction || 'Define immediate next milestone'}". Unblock it with a quick 20-minute focus sprint or archive it.`,
      severity: 'medium',
      category: 'project',
      actionLabel: 'View Project',
      actionModule: 'projects',
    });
  }

  // 3. Many projects active (> 3 active simultaneously)
  const activeProjects = projects.filter(p => p.status === 'BUILDING' || p.status === 'TESTING');
  if (activeProjects.length > 3) {
    recommendations.push({
      id: 'rec-too-many-active',
      situation: `${activeProjects.length} projects are currently marked as active / in building.`,
      recommendation: 'Single-channel principle: Choose one primary priority project. Put the remaining into PLANNING or REVISION to avoid split focus.',
      severity: 'high',
      category: 'strategy',
      actionLabel: 'Triage Projects',
      actionModule: 'projects',
    });
  }

  // 4. Quiz accuracy is low (< 70%) or weak questions exist
  const totalWeakQuestions = quizzes.reduce((acc, q) => acc + (q.weakQuestionIds?.length || 0), 0);
  const lowScoreQuizzes = quizzes.filter(q => (q.lastAttemptScore !== undefined && q.lastAttemptScore < 70));

  if (lowScoreQuizzes.length > 0 || totalWeakQuestions >= 3) {
    recommendations.push({
      id: 'rec-quiz-accuracy-low',
      recommendation: 'Schedule a recall session to test weak questions before moving to new material. Active recall cements long-term retention.',
      situation: `${totalWeakQuestions} weak recall items identified in recent quizzes.`,
      severity: 'medium',
      category: 'recall',
      actionLabel: 'Review Weak Questions',
      actionModule: 'quizzes',
    });
  }

  // 5. Focus time check
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = focusSessions.filter(s => s.completedAt.startsWith(today));
  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  if (todayMinutes === 0 && tasks.length > 0) {
    recommendations.push({
      id: 'rec-focus-start',
      situation: 'Zero deep work sessions logged so far today.',
      recommendation: 'Start with a 25-minute Pomodoro on your #1 main task to break friction and enter flow state.',
      severity: 'low',
      category: 'focus',
      actionLabel: 'Start Focus',
      actionModule: 'focus',
    });
  }

  // 6. Balanced default recommendation if everything is smooth
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec-routine-healthy',
      situation: 'Execution rhythm is balanced and daily commitments are in check.',
      recommendation: 'Maintain your single-channel cadence. Do an end-of-day 5-minute review before shutting down.',
      severity: 'low',
      category: 'strategy',
      actionLabel: 'Review Dashboard',
      actionModule: 'dashboard',
    });
  }

  return recommendations;
}
