import React, { useState } from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Flame,
  Award,
  Layers,
  Check,
  X,
} from 'lucide-react';
import { QuizItem, QuizQuestion } from '../types';

interface QuizViewProps {
  quizzes: QuizItem[];
  onUpdateQuiz: (quiz: QuizItem) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ quizzes, onUpdateQuiz }) => {
  const [selectedQuizId, setSelectedQuizId] = useState<string>(quizzes[0]?.id || '');
  const [activeSession, setActiveSession] = useState<{
    quiz: QuizItem;
    currentIndex: number;
    answers: Record<string, string>;
    showExplanation: boolean;
    isFinished: boolean;
    flashcardFlipped: boolean;
    score: number;
    weakIds: string[];
  } | null>(null);

  const selectedQuiz = quizzes.find(q => q.id === selectedQuizId) || quizzes[0];

  const startQuiz = (quiz: QuizItem, onlyWeak: boolean = false) => {
    let questionsToUse = quiz.questions;
    if (onlyWeak && quiz.weakQuestionIds?.length > 0) {
      questionsToUse = quiz.questions.filter(q => quiz.weakQuestionIds.includes(q.id));
    }
    if (questionsToUse.length === 0) questionsToUse = quiz.questions;

    setActiveSession({
      quiz: { ...quiz, questions: questionsToUse },
      currentIndex: 0,
      answers: {},
      showExplanation: false,
      isFinished: false,
      flashcardFlipped: false,
      score: 0,
      weakIds: [],
    });
  };

  const handleAnswer = (answer: string) => {
    if (!activeSession) return;
    const currentQ = activeSession.quiz.questions[activeSession.currentIndex];
    const isCorrect =
      currentQ.type === 'fill-blank'
        ? answer.trim().toLowerCase() === currentQ.correctAnswer.toLowerCase()
        : answer === currentQ.correctAnswer;

    const newWeakIds = [...activeSession.weakIds];
    if (!isCorrect && !newWeakIds.includes(currentQ.id)) {
      newWeakIds.push(currentQ.id);
    }

    setActiveSession({
      ...activeSession,
      answers: { ...activeSession.answers, [currentQ.id]: answer },
      showExplanation: true,
      score: isCorrect ? activeSession.score + 1 : activeSession.score,
      weakIds: newWeakIds,
    });
  };

  const handleFlashcardRating = (known: boolean) => {
    if (!activeSession) return;
    const currentQ = activeSession.quiz.questions[activeSession.currentIndex];
    const newWeakIds = [...activeSession.weakIds];
    if (!known && !newWeakIds.includes(currentQ.id)) {
      newWeakIds.push(currentQ.id);
    }
    const newScore = known ? activeSession.score + 1 : activeSession.score;

    goToNextQuestion(newScore, newWeakIds);
  };

  const goToNextQuestion = (
    overrideScore?: number,
    overrideWeakIds?: string[]
  ) => {
    if (!activeSession) return;
    const nextIdx = activeSession.currentIndex + 1;
    const score = overrideScore !== undefined ? overrideScore : activeSession.score;
    const weakIds = overrideWeakIds !== undefined ? overrideWeakIds : activeSession.weakIds;

    if (nextIdx >= activeSession.quiz.questions.length) {
      // Completed quiz!
      const total = activeSession.quiz.questions.length;
      const finalPercent = Math.round((score / total) * 100);

      const updatedQuiz: QuizItem = {
        ...activeSession.quiz,
        totalAttempts: (activeSession.quiz.totalAttempts || 0) + 1,
        lastAttemptScore: finalPercent,
        lastAttemptDate: new Date().toISOString(),
        weakQuestionIds: weakIds,
      };
      onUpdateQuiz(updatedQuiz);

      setActiveSession({
        ...activeSession,
        currentIndex: nextIdx,
        isFinished: true,
        score,
        weakIds,
      });
    } else {
      setActiveSession({
        ...activeSession,
        currentIndex: nextIdx,
        showExplanation: false,
        flashcardFlipped: false,
        score,
        weakIds,
      });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-1">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Active Recall System</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-white">Quiz & Recall</h2>
          <p className="text-xs text-slate-300 mt-1">
            Turn your study notes into flashcards and quizzes to strengthen long-term retention.
          </p>
        </div>
      </div>

      {/* Main active quiz runner modal/screen */}
      {activeSession ? (
        <div className="rounded-2xl p-6 lg:p-8 glass-panel-glow border border-cyan-500/30 max-w-2xl mx-auto space-y-6 animate-fadeIn">
          {activeSession.isFinished ? (
            /* Results Screen */
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center border border-cyan-400/40">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white">Recall Session Completed!</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Deck: {activeSession.quiz.title}
                </p>
              </div>

              <div className="flex justify-center gap-6 py-2">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/8 min-w-[100px]">
                  <span className="text-[10px] text-slate-400 font-mono block">Score</span>
                  <span className="text-xl font-bold font-mono text-cyan-400">
                    {activeSession.score} / {activeSession.quiz.questions.length}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/8 min-w-[100px]">
                  <span className="text-[10px] text-slate-400 font-mono block">Accuracy</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    {Math.round((activeSession.score / activeSession.quiz.questions.length) * 100)}%
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/8 min-w-[100px]">
                  <span className="text-[10px] text-slate-400 font-mono block">Weak Items</span>
                  <span className="text-xl font-bold font-mono text-amber-400">
                    {activeSession.weakIds.length}
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                {activeSession.weakIds.length > 0 && (
                  <button
                    onClick={() => startQuiz(activeSession.quiz, true)}
                    className="py-2.5 px-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold cursor-pointer"
                  >
                    Retry Weak Questions Only ({activeSession.weakIds.length})
                  </button>
                )}
                <button
                  onClick={() => setActiveSession(null)}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold shadow-lg shadow-cyan-500/25 cursor-pointer"
                >
                  Return to Quizzes
                </button>
              </div>
            </div>
          ) : (
            /* Active Question Taking */
            (() => {
              const currentQ = activeSession.quiz.questions[activeSession.currentIndex];
              const progressPercent = Math.round(
                ((activeSession.currentIndex + 1) / activeSession.quiz.questions.length) * 100
              );
              const hasAnswered = !!activeSession.answers[currentQ.id];

              return (
                <div className="space-y-6">
                  {/* Progress bar and counter */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>
                        Question {activeSession.currentIndex + 1} of{' '}
                        {activeSession.quiz.questions.length}
                      </span>
                      <span className="text-cyan-400 font-bold">
                        Type: {currentQ.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        style={{ width: `${progressPercent}%` }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* FLASHCARD MODE */}
                  {currentQ.type === 'flashcard' ? (
                    <div className="space-y-4">
                      <div
                        onClick={() =>
                          setActiveSession({
                            ...activeSession,
                            flashcardFlipped: !activeSession.flashcardFlipped,
                          })
                        }
                        className="min-h-[200px] p-6 rounded-2xl bg-white/[0.04] border border-cyan-500/30 flex flex-col justify-between items-center text-center cursor-pointer transition hover:bg-white/[0.07]"
                      >
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                          {activeSession.flashcardFlipped ? 'Answer / Definition (Back)' : 'Concept (Click to Flip)'}
                        </span>

                        <div className="text-base lg:text-lg font-bold text-white max-w-lg my-auto">
                          {activeSession.flashcardFlipped
                            ? currentQ.correctAnswer
                            : currentQ.question}
                        </div>

                        <span className="text-[11px] text-slate-400">
                          {activeSession.flashcardFlipped ? 'Click card to see question' : 'Click to flip and test memory'}
                        </span>
                      </div>

                      {activeSession.flashcardFlipped && (
                        <div className="flex gap-3 justify-center pt-2">
                          <button
                            onClick={() => handleFlashcardRating(false)}
                            className="flex-1 py-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <X className="w-4 h-4" /> Still Uncertain (Mark Weak)
                          </button>
                          <button
                            onClick={() => handleFlashcardRating(true)}
                            className="flex-1 py-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Check className="w-4 h-4" /> Got It Right
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* MULTIPLE CHOICE / TRUE-FALSE MODE */
                    <div className="space-y-4">
                      <h4 className="text-base font-bold text-white leading-relaxed">
                        {currentQ.question}
                      </h4>

                      <div className="space-y-2.5">
                        {currentQ.options?.map((opt, i) => {
                          const isSelected = activeSession.answers[currentQ.id] === opt;
                          const isCorrect = opt === currentQ.correctAnswer;
                          let btnStyle =
                            'bg-white/[0.03] border-white/8 hover:bg-white/[0.06] text-slate-200';

                          if (hasAnswered) {
                            if (isCorrect) {
                              btnStyle = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200';
                            } else if (isSelected) {
                              btnStyle = 'bg-rose-500/20 border-rose-500/40 text-rose-200';
                            } else {
                              btnStyle = 'bg-white/[0.01] border-white/5 text-slate-500';
                            }
                          }

                          return (
                            <button
                              key={i}
                              disabled={hasAnswered}
                              onClick={() => handleAnswer(opt)}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {hasAnswered && isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                              )}
                              {hasAnswered && isSelected && !isCorrect && (
                                <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation banner */}
                      {activeSession.showExplanation && (
                        <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs space-y-1">
                          <span className="font-bold text-cyan-300 block">Explanation</span>
                          <p className="text-slate-300">
                            {currentQ.explanation || `Correct answer: ${currentQ.correctAnswer}`}
                          </p>
                        </div>
                      )}

                      {/* Next button */}
                      {hasAnswered && (
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => goToNextQuestion()}
                            className="py-2 px-5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-cyan-500/25"
                          >
                            <span>Next Question</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cancel test button */}
                  <div className="pt-2 border-t border-white/6 flex justify-between items-center text-[11px] text-slate-400">
                    <button
                      onClick={() => setActiveSession(null)}
                      className="hover:text-white cursor-pointer"
                    >
                      Exit Quiz
                    </button>
                    <span>Current Score: {activeSession.score}</span>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      ) : (
        /* Quiz Catalog & Recall Dashboard */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map(quiz => {
            const weakCount = quiz.weakQuestionIds?.length || 0;
            return (
              <div
                key={quiz.id}
                className="rounded-2xl glass-panel p-5 border border-white/8 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-purple-300">{quiz.folder}</span>
                    <span className="text-slate-400">{quiz.questions.length} questions</span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight">{quiz.title}</h3>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">
                      {quiz.totalAttempts || 0} attempts
                    </span>
                    {quiz.lastAttemptScore !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          quiz.lastAttemptScore >= 70
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {quiz.lastAttemptScore}% Score
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/6 space-y-2">
                  {weakCount > 0 && (
                    <div className="text-[11px] text-amber-400 font-medium flex items-center justify-between">
                      <span>{weakCount} weak items need recall</span>
                      <button
                        onClick={() => startQuiz(quiz, true)}
                        className="underline hover:text-amber-300 cursor-pointer font-bold"
                      >
                        Practice Weak
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => startQuiz(quiz)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 cursor-pointer"
                  >
                    <BrainCircuit className="w-4 h-4" /> Start Recall Quiz
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
