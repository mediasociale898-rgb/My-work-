import { QuizQuestion, QuestionType } from '../types';

/**
 * Rule-based heuristic question generator from note content.
 * Parses definitions, bullet points, numbered lists, and header sections.
 */
export function generateQuestionsFromText(text: string, title: string = 'Note'): QuizQuestion[] {
  const lines = text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const questions: QuizQuestion[] = [];
  const definitions: { term: string; definition: string }[] = [];
  const statements: string[] = [];

  // Parse patterns: "Term: Definition", "Term - Definition", "Term is a Definition"
  for (const line of lines) {
    // Strip markdown formatting
    const cleanLine = line.replace(/^[#*-]+\s*/, '').replace(/\*\*/g, '').trim();
    if (cleanLine.length < 15) continue;

    // Pattern 1: Colon separator (e.g., "Ohm's Law: V = I * R")
    if (cleanLine.includes(':') && !cleanLine.startsWith('http')) {
      const parts = cleanLine.split(':');
      const term = parts[0].trim();
      const def = parts.slice(1).join(':').trim();
      if (term.length >= 3 && term.length <= 40 && def.length >= 10) {
        definitions.push({ term, definition: def });
        continue;
      }
    }

    // Pattern 2: Dash separator (e.g., "Kinematics - the branch of mechanics")
    if (cleanLine.includes(' - ')) {
      const parts = cleanLine.split(' - ');
      const term = parts[0].trim();
      const def = parts.slice(1).join(' - ').trim();
      if (term.length >= 3 && term.length <= 40 && def.length >= 10) {
        definitions.push({ term, definition: def });
        continue;
      }
    }

    // Pattern 3: "is defined as", "is a", "refers to"
    const isMatch = cleanLine.match(/^([A-Za-z0-9\s]{3,35})\s+(?:is defined as|is an|is a|refers to)\s+(.+)$/i);
    if (isMatch) {
      definitions.push({ term: isMatch[1].trim(), definition: isMatch[2].trim() });
      continue;
    }

    // General factual sentences
    if (cleanLine.endsWith('.') && cleanLine.split(' ').length >= 6) {
      statements.push(cleanLine);
    }
  }

  // Fallback if notes don't have explicit definitions: build from lines
  if (definitions.length === 0 && statements.length > 0) {
    statements.slice(0, 4).forEach((stmt, idx) => {
      const words = stmt.split(' ');
      const keyTerm = words[0] + ' ' + (words[1] || '');
      definitions.push({ term: keyTerm, definition: stmt });
    });
  }

  // 1. Flashcards from definitions
  definitions.forEach((def, index) => {
    questions.push({
      id: `q-fc-${Date.now()}-${index}`,
      type: 'flashcard',
      question: `What is the definition and core principle of "${def.term}"?`,
      correctAnswer: def.definition,
      explanation: `Core reference from notes on ${title}.`,
    });
  });

  // 2. Multiple Choice Questions
  definitions.forEach((def, index) => {
    const distractors = definitions
      .filter((_, i) => i !== index)
      .map(d => d.definition)
      .slice(0, 3);

    // Provide default plausible distractors if not enough in this note
    while (distractors.length < 3) {
      const genericDistractors = [
        `A high-level framework focusing primarily on database scaling and caching.`,
        `A redundant process in engineering that is deprecated in modern architectures.`,
        `A measurement protocol strictly applied only to physical hardware calibration.`,
        `An abstract protocol that handles peripheral bus synchronization.`,
      ];
      distractors.push(genericDistractors[distractors.length]);
    }

    const options = [def.definition, ...distractors].sort(() => Math.random() - 0.5);

    questions.push({
      id: `q-mc-${Date.now()}-${index}`,
      type: 'multiple-choice',
      question: `Which of the following best defines "${def.term}"?`,
      options,
      correctAnswer: def.definition,
      explanation: `As noted: "${def.term}: ${def.definition}"`,
    });
  });

  // 3. True / False Questions from statements
  statements.slice(0, 3).forEach((stmt, index) => {
    const isTrue = index % 2 === 0;
    let questionText = stmt;
    let answer = 'True';

    if (!isTrue) {
      // Create a false variant by negating
      questionText = stmt.replace(/\b(is|are|can|will|has)\b/i, '$1 NOT');
      if (questionText === stmt) {
        questionText = `It is incorrect that: ${stmt}`;
      }
      answer = 'False';
    }

    questions.push({
      id: `q-tf-${Date.now()}-${index}`,
      type: 'true-false',
      question: `True or False: ${questionText}`,
      options: ['True', 'False'],
      correctAnswer: answer,
      explanation: `Original reference: "${stmt}"`,
    });
  });

  // 4. Fill in the blank
  definitions.slice(0, 2).forEach((def, index) => {
    const words = def.definition.split(' ');
    if (words.length > 5) {
      const targetWordIndex = Math.floor(words.length / 2);
      const targetWord = words[targetWordIndex].replace(/[^a-zA-Z0-9]/g, '');
      const maskedDef = words.map((w, i) => (i === targetWordIndex ? '_______' : w)).join(' ');

      questions.push({
        id: `q-fib-${Date.now()}-${index}`,
        type: 'fill-blank',
        question: `Fill in the blank for "${def.term}": "${maskedDef}"`,
        correctAnswer: targetWord.toLowerCase(),
        explanation: `Full phrase: "${def.definition}"`,
      });
    }
  });

  return questions;
}
