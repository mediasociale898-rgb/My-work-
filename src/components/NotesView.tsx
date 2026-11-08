import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Folder,
  BrainCircuit,
  Trash2,
  Sparkles,
  Eye,
  Edit3,
  Pin,
  ArrowRight,
  Check,
  Download,
} from 'lucide-react';
import { NoteItem, QuizItem } from '../types';
import { generateQuestionsFromText } from '../utils/quizGenerator';
import { ActiveModule } from './Sidebar';

interface NotesViewProps {
  notes: NoteItem[];
  onSaveNote: (note: NoteItem) => void;
  onDeleteNote: (noteId: string) => void;
  onAddQuiz: (quiz: QuizItem) => void;
  onSelectModule: (mod: ActiveModule) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  onAddQuiz,
  onSelectModule,
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [isPreview, setIsPreview] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedNote = notes.find(n => n.id === selectedNoteId) || notes[0];

  const folders = [
    'all',
    'Education/Mathematics',
    'Education/Physics',
    'Education/Programming',
    'NTFY/Robotics',
    'NTFY/Electrical',
    'NTFY/Software',
    'Projects/Active',
    'Research',
    'Ideas',
  ];

  const filteredNotes = notes.filter(n => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = selectedFolder === 'all' || n.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const handleCreateNewNote = () => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      folder: selectedFolder === 'all' ? 'Education/Programming' : selectedFolder,
      tags: ['draft'],
      content: `# New Note\n\n**Concept**: Write definition here.\n\nAdd your technical notes or derivations.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSaveNote(newNote);
    setSelectedNoteId(newNote.id);
    setIsPreview(false);
  };

  const handleUpdateCurrentNote = (updates: Partial<NoteItem>) => {
    if (!selectedNote) return;
    const updated = {
      ...selectedNote,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    onSaveNote(updated);
  };

  const handleGenerateQuiz = () => {
    if (!selectedNote) return;
    const questions = generateQuestionsFromText(selectedNote.content, selectedNote.title);
    if (questions.length === 0) {
      setToastMessage('Could not detect distinct definitions. Add formats like "Term: Definition" to note.');
      setTimeout(() => setToastMessage(null), 3500);
      return;
    }

    const newQuiz: QuizItem = {
      id: `quiz-gen-${Date.now()}`,
      title: `${selectedNote.title} Recall Deck`,
      noteId: selectedNote.id,
      folder: selectedNote.folder,
      totalAttempts: 0,
      weakQuestionIds: [],
      questions,
    };

    onAddQuiz(newQuiz);
    setToastMessage(`Generated ${questions.length} quiz & recall questions!`);
    setTimeout(() => {
      setToastMessage(null);
      onSelectModule('quizzes');
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-cyan-950/90 border border-cyan-400 text-cyan-200 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Knowledge Capture & Structure</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-white">
            Notes & Recall Base
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Capture material, save in structured folders, and transform into active recall quizzes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateNewNote}
            className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Note
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[620px]">
        {/* Left: Folder Tree (3 cols) */}
        <div className="lg:col-span-3 rounded-2xl glass-panel p-4 border border-white/8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-cyan-400" /> Folder Directory
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search notes or tags..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/8 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1">
            {folders.map(folder => {
              const count = folder === 'all'
                ? notes.length
                : notes.filter(n => n.folder === folder).length;
              const isActive = selectedFolder === folder;
              return (
                <button
                  key={folder}
                  onClick={() => setSelectedFolder(folder)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-purple-500/20 text-purple-200 border border-purple-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="truncate">{folder === 'all' ? 'All Knowledge' : folder}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Middle: Notes list (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl glass-panel p-4 border border-white/8 flex flex-col space-y-3">
          <div className="flex items-center justify-between border-b border-white/6 pb-2">
            <span className="text-xs font-bold text-white">
              {selectedFolder === 'all' ? 'All Notes' : selectedFolder} ({filteredNotes.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500">
                No notes found matching query.
              </div>
            ) : (
              filteredNotes.map(n => {
                const isSelected = selectedNote?.id === n.id;
                return (
                  <div
                    key={n.id}
                    onClick={() => setSelectedNoteId(n.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-purple-500/15 border-purple-500/40 shadow-sm shadow-purple-500/10'
                        : 'bg-white/[0.02] border-white/6 hover:bg-white/[0.05] hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-purple-300">
                        {n.folder.split('/')[1] || n.folder}
                      </span>
                      {n.isPinned && (
                        <Pin className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-1">{n.title}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {n.content.replace(/[#*`_]/g, '')}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>{new Date(n.updatedAt).toLocaleDateString()}</span>
                      <span className="font-mono">{n.tags.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Active Note Editor & Quiz Generation Trigger (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl glass-panel p-5 border border-white/8 flex flex-col space-y-4">
          {selectedNote ? (
            <>
              {/* Note actions toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/6 pb-3">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsPreview(!isPreview)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                      isPreview
                        ? 'bg-white/10 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isPreview ? 'Edit' : 'Preview'}</span>
                  </button>
                  <button
                    onClick={() => handleUpdateCurrentNote({ isPinned: !selectedNote.isPinned })}
                    className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
                      selectedNote.isPinned
                        ? 'text-amber-400 bg-amber-400/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                    title="Pin note"
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* EXPORT STANDALONE NOTES.HTML */}
                  <a
                    href="/notes.html"
                    download="notes.html"
                    className="py-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/8 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    title="Export as complete standalone interactive study HTML (notes.html)"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">Export notes.html</span>
                  </a>

                  {/* GENERATE QUIZ BUTTON */}
                  <button
                    onClick={handleGenerateQuiz}
                    className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-purple-500/20 cursor-pointer"
                  >
                    <BrainCircuit className="w-3.5 h-3.5" />
                    <span>Generate Quiz</span>
                  </button>

                  <button
                    onClick={() => onDeleteNote(selectedNote.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/5 cursor-pointer"
                    title="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Metadata inputs */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={e => handleUpdateCurrentNote({ title: e.target.value })}
                  className="w-full text-base font-extrabold text-white bg-transparent border-b border-white/6 pb-1 focus:outline-none focus:border-purple-400"
                  placeholder="Note Title"
                />

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono block">Folder</label>
                    <select
                      value={selectedNote.folder}
                      onChange={e => handleUpdateCurrentNote({ folder: e.target.value })}
                      className="w-full mt-0.5 px-2 py-1 rounded-lg bg-slate-900 border border-white/8 text-white text-xs focus:outline-none"
                    >
                      {folders.filter(f => f !== 'all').map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-mono block">Tags</label>
                    <input
                      type="text"
                      value={selectedNote.tags.join(', ')}
                      onChange={e => handleUpdateCurrentNote({
                        tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean),
                      })}
                      className="w-full mt-0.5 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/8 text-white text-xs focus:outline-none"
                      placeholder="tag1, tag2"
                    />
                  </div>
                </div>
              </div>

              {/* Content editor or Markdown preview */}
              <div className="flex-1 min-h-[340px] flex flex-col">
                {isPreview ? (
                  <div className="flex-1 p-3.5 rounded-xl bg-white/[0.02] border border-white/6 overflow-y-auto text-xs text-slate-200 leading-relaxed space-y-2 font-mono whitespace-pre-wrap">
                    {selectedNote.content}
                  </div>
                ) : (
                  <textarea
                    value={selectedNote.content}
                    onChange={e => handleUpdateCurrentNote({ content: e.target.value })}
                    placeholder="Write markdown note here... Definitions formatted with colons or asterisks automatically turn into quizzes!"
                    className="w-full flex-1 p-3.5 rounded-xl bg-white/[0.03] border border-white/8 text-white text-xs font-mono leading-relaxed focus:outline-none focus:border-purple-400 resize-none"
                  />
                )}
              </div>

              <div className="text-[10px] text-slate-500 font-mono flex justify-between items-center pt-1 border-t border-white/6">
                <span>{selectedNote.content.length} characters</span>
                <span>Auto-saved to IndexedDB</span>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
              <FileText className="w-8 h-8 mb-2 opacity-40" />
              <span>Select or create a note to start writing.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
