import React, { useState } from 'react';
import { X, CheckCircle2, FileText, Lightbulb, Sparkles, Folder } from 'lucide-react';
import { ChannelType } from '../types';

interface QuickCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: { title: string; isMainTask: boolean; channel: ChannelType; estimatedMinutes: number }) => void;
  onAddNote: (note: { title: string; folder: string; content: string; tags: string[] }) => void;
  onAddIdea: (idea: { title: string; category: string; description: string }) => void;
  currentChannel: ChannelType;
}

export const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  onAddNote,
  onAddIdea,
  currentChannel,
}) => {
  const [tab, setTab] = useState<'task' | 'note' | 'idea'>('task');
  
  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [isMainTask, setIsMainTask] = useState(false);
  const [channel, setChannel] = useState<ChannelType>(currentChannel);
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);

  // Note form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteFolder, setNoteFolder] = useState('Education/Programming');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState('notes, reference');

  // Idea form
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaCategory, setIdeaCategory] = useState('Robotics');
  const [ideaDesc, setIdeaDesc] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'task') {
      if (!taskTitle.trim()) return;
      onAddTask({
        title: taskTitle.trim(),
        isMainTask,
        channel,
        estimatedMinutes,
      });
      setTaskTitle('');
    } else if (tab === 'note') {
      if (!noteTitle.trim()) return;
      onAddNote({
        title: noteTitle.trim(),
        folder: noteFolder,
        content: noteContent.trim(),
        tags: noteTags.split(',').map(t => t.trim()).filter(Boolean),
      });
      setNoteTitle('');
      setNoteContent('');
    } else {
      if (!ideaTitle.trim()) return;
      onAddIdea({
        title: ideaTitle.trim(),
        category: ideaCategory,
        description: ideaDesc.trim(),
      });
      setIdeaTitle('');
      setIdeaDesc('');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl bg-[#0d1424] border border-white/10 shadow-2xl overflow-hidden glass-panel">
        {/* Header */}
        <div className="p-4 border-b border-white/8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-white tracking-tight">Quick Capture</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
              Personal Work OS
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
            aria-label="Close capture modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-white/6 px-4 pt-3 gap-2">
          {[
            { id: 'task', label: 'Task / Action', icon: CheckCircle2 },
            { id: 'note', label: 'Note / Material', icon: FileText },
            { id: 'idea', label: 'Raw Idea', icon: Lightbulb },
          ].map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id as typeof tab)}
                className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition cursor-pointer ${
                  active
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {tab === 'task' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement forward kinematics matrix in Python"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Channel
                  </label>
                  <select
                    value={channel}
                    onChange={e => setChannel(e.target.value as ChannelType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/8 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Robotics">Robotics</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Software">Software</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Research">Research</option>
                    <option value="Writing">Writing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Est. Minutes
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="240"
                    step="5"
                    value={estimatedMinutes}
                    onChange={e => setEstimatedMinutes(parseInt(e.target.value) || 25)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/8 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* The Three-Task Rule toggle */}
              <label className="flex items-center gap-3 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMainTask}
                  onChange={e => setIsMainTask(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 accent-cyan-500"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-cyan-200">
                    Set as one of the 3 Main Tasks of the Day
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Core daily commitment (Maximum 3 items to preserve deep focus)
                  </span>
                </div>
              </label>
            </>
          )}

          {tab === 'note' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fourier Transform Principles & Nyquist Sampling"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Folder
                  </label>
                  <select
                    value={noteFolder}
                    onChange={e => setNoteFolder(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/8 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Education/Mathematics">Education / Mathematics</option>
                    <option value="Education/Physics">Education / Physics</option>
                    <option value="Education/Programming">Education / Programming</option>
                    <option value="NTFY/Robotics">NTFY / Robotics</option>
                    <option value="NTFY/Electrical">NTFY / Electrical</option>
                    <option value="NTFY/Software">NTFY / Software</option>
                    <option value="Projects/Active">Projects / Active</option>
                    <option value="Research">Research</option>
                    <option value="Ideas">Ideas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={noteTags}
                    onChange={e => setNoteTags(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/8 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Content (Markdown / Definitions for Quiz generation)
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste or write notes... Format like 'Term: Definition' to enable 1-click quiz generation!"
                  value={noteContent}
                  onChange={e => setNoteContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </>
          )}

          {tab === 'idea' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Idea Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adaptive Impedance Matching RF Antenna"
                  value={ideaTitle}
                  onChange={e => setIdeaTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Category
                </label>
                <select
                  value={ideaCategory}
                  onChange={e => setIdeaCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/8 text-white text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="Robotics">Robotics</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Software">Software</option>
                  <option value="3D CAD">3D CAD</option>
                  <option value="PCB Design">PCB Design</option>
                  <option value="Research">Research</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Description & Value
                </label>
                <textarea
                  rows={3}
                  placeholder="What makes this idea interesting? What physical or software challenge does it solve?"
                  value={ideaDesc}
                  onChange={e => setIdeaDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>
            </>
          )}

          <div className="pt-2 flex justify-end gap-2.5 border-t border-white/6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              Save to System
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
