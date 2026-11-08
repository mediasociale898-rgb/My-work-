import test from 'node:test';
import assert from 'node:assert/strict';
import { generateQuestionsFromText } from './quizGenerator';
import { computeSystemRecommendations } from './recommendations';
import { DailyTask, ProjectItem, QuizItem, FocusSession } from '../types';

test('quiz generator extracts definitions and creates flashcards and multiple-choice questions', () => {
  const note = `
# Kinematics and Control
Ohm's Law: The direct proportional relationship between voltage and current across a conductor.
Nyquist Criterion: A graphical stability test based on the open-loop frequency response of a dynamic system.
Closed-loop control is a control method utilizing real-time feedback to correct deviations.
  `;

  const questions = generateQuestionsFromText(note, 'Test Note');
  assert.ok(questions.length >= 3, 'Should generate at least 3 questions from 3 definitions');
  
  const flashcards = questions.filter(q => q.type === 'flashcard');
  const multipleChoice = questions.filter(q => q.type === 'multiple-choice');

  assert.ok(flashcards.length >= 2, 'Should create flashcards for detected definitions');
  assert.ok(multipleChoice.length >= 2, 'Should create multiple choice questions');
  assert.equal(multipleChoice[0].options?.length, 4, 'Multiple choice should have 4 options');
  assert.ok(multipleChoice[0].options?.includes(multipleChoice[0].correctAnswer), 'Options must contain correct answer');
});

test('recommendation engine triggers workload reduction when multiple main tasks are unfinished', () => {
  const tasks: DailyTask[] = [
    { id: '1', title: 'Task 1', isMainTask: true, prioritySlot: 1, completed: false, channel: 'Software', createdAt: '' },
    { id: '2', title: 'Task 2', isMainTask: true, prioritySlot: 2, completed: false, channel: 'Software', createdAt: '' },
    { id: '3', title: 'Task 3', isMainTask: true, prioritySlot: 3, completed: false, channel: 'Software', createdAt: '' },
  ];
  const projects: ProjectItem[] = [];
  const quizzes: QuizItem[] = [];
  const focusSessions: FocusSession[] = [];

  const recs = computeSystemRecommendations(tasks, projects, quizzes, focusSessions);
  const workloadRec = recs.find(r => r.id === 'rec-workload-reduction');
  assert.ok(workloadRec, 'Should recommend reducing workload when 3 main tasks are unfinished');
  assert.equal(workloadRec?.category, 'workload');
});

test('recommendation engine flags projects inactive for over 7 days', () => {
  const eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString();
  const tasks: DailyTask[] = [
    { id: '1', title: 'Task 1', isMainTask: true, prioritySlot: 1, completed: true, channel: 'Software', createdAt: '' },
  ];
  const projects: ProjectItem[] = [
    {
      id: 'p-stale',
      name: 'Old PCB Inverter',
      category: 'PCB Design',
      status: 'BUILDING',
      description: '',
      objective: '',
      nextAction: 'Re-route high voltage isolation',
      progressPercent: 40,
      lastModified: eightDaysAgo,
      attachedFiles: [],
      notesHistory: [],
    },
  ];
  const quizzes: QuizItem[] = [];
  const focusSessions: FocusSession[] = [];

  const recs = computeSystemRecommendations(tasks, projects, quizzes, focusSessions);
  const staleRec = recs.find(r => r.id === 'rec-stale-project-p-stale');
  assert.ok(staleRec, 'Should trigger stale project recommendation');
  assert.match(staleRec?.situation || '', /idle for over 7 days/);
});

test('recommendation engine triggers recall alert when weak questions exist', () => {
  const tasks: DailyTask[] = [];
  const projects: ProjectItem[] = [];
  const quizzes: QuizItem[] = [
    {
      id: 'q1',
      title: 'Physics Test',
      folder: 'Education',
      totalAttempts: 2,
      lastAttemptScore: 50,
      weakQuestionIds: ['q1-a', 'q1-b', 'q1-c'],
      questions: [],
    },
  ];
  const focusSessions: FocusSession[] = [];

  const recs = computeSystemRecommendations(tasks, projects, quizzes, focusSessions);
  const recallRec = recs.find(r => r.id === 'rec-quiz-accuracy-low');
  assert.ok(recallRec, 'Should suggest recall session for weak questions or low score');
});

test('daily affirmation engine returns valid, deterministic quotes for a given day', async () => {
  const { getDailyAffirmation, getRandomAffirmation, CURATED_AFFIRMATIONS } = await import('./affirmations');
  
  assert.ok(CURATED_AFFIRMATIONS.length >= 10, 'Should have rich curated collection of affirmations');
  
  const testDate1 = new Date(2026, 3, 16); // April 16, 2026
  const aff1 = getDailyAffirmation(testDate1);
  const aff1Repeat = getDailyAffirmation(testDate1);
  
  assert.equal(aff1.id, aff1Repeat.id, 'Same date must return identical affirmation deterministically');
  assert.ok(aff1.quote.length > 10, 'Quote must be substantial');
  assert.ok(aff1.author.length > 2, 'Author must be populated');
  assert.ok(aff1.theme.length > 2, 'Theme must be populated');
  assert.ok(aff1.reflectionPrompt.length > 10, 'Reflection prompt must exist');

  const testDate2 = new Date(2026, 3, 17); // April 17, 2026 (next day)
  const aff2 = getDailyAffirmation(testDate2);
  assert.notEqual(aff1.id, aff2.id, 'Consecutive days should return different daily affirmations');
  
  const random = getRandomAffirmation(aff1.id);
  assert.notEqual(random.id, aff1.id, 'getRandomAffirmation must exclude specified ID');
});

test('music playlists contain curated chill, energize, and work modes', async () => {
  const { VIBE_PLAYLISTS } = await import('./audioSynthesis');
  assert.ok(VIBE_PLAYLISTS.chill, 'Chill playlist must exist');
  assert.ok(VIBE_PLAYLISTS.energize, 'Energize playlist must exist');
  assert.ok(VIBE_PLAYLISTS.work, 'Work playlist must exist');
  
  assert.ok(VIBE_PLAYLISTS.chill.trackIds.length >= 3, 'Chill playlist should have at least 3 tracks');
  assert.ok(VIBE_PLAYLISTS.energize.trackIds.length >= 3, 'Energize playlist should have at least 3 tracks');
  assert.ok(VIBE_PLAYLISTS.work.trackIds.length >= 3, 'Work playlist should have at least 3 tracks');
  
  assert.ok(VIBE_PLAYLISTS.chill.trackIds.includes('rain'), 'Chill playlist must include rain');
  assert.ok(VIBE_PLAYLISTS.energize.trackIds.includes('key-brain-gamma'), 'Energize playlist must include gamma burst');
  assert.ok(VIBE_PLAYLISTS.work.trackIds.includes('key-brain-alpha'), 'Work playlist must include alpha flow');
});


