import React, { useState } from 'react';
import {
  CalendarCheck2,
  CheckCircle2,
  Circle,
  Plus,
  Flame,
  Radio,
  Timer,
  Trash2,
  Sparkles,
  ArrowRight,
  ListTodo,
} from 'lucide-react';
import { DailyTask, DayPlan, ChannelType } from '../types';
import { ActiveModule } from './Sidebar';

interface PlannerViewProps {
  dayPlan: DayPlan;
  onUpdateDayPlan: (plan: Partial<DayPlan>) => void;
  tasks: DailyTask[];
  onAddTask: (task: { title: string; isMainTask: boolean; prioritySlot?: 1 | 2 | 3; channel: ChannelType; estimatedMinutes: number; notes?: string }) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onSelectModule: (mod: ActiveModule) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({
  dayPlan,
  onUpdateDayPlan,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onSelectModule,
}) => {
  const [newSupportingTitle, setNewSupportingTitle] = useState('');
  const [editingMainSlot, setEditingMainSlot] = useState<number | null>(null);
  const [slotTaskTitle, setSlotTaskTitle] = useState('');
  const [reflection, setReflection] = useState(dayPlan.reflectionNotes || '');

  const channels: ChannelType[] = [
    'Software',
    'Robotics',
    'Electrical',
    'Mathematics',
    'Physics',
    'Research',
    'Writing',
  ];

  const mainTasks = [1, 2, 3].map(slot => {
    return tasks.find(t => t.isMainTask && t.prioritySlot === slot);
  });

  const supportingTasks = tasks.filter(t => !t.isMainTask);

  const handleAddSupporting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupportingTitle.trim()) return;
    onAddTask({
      title: newSupportingTitle.trim(),
      isMainTask: false,
      channel: dayPlan.channel,
      estimatedMinutes: 20,
    });
    setNewSupportingTitle('');
  };

  const handleSetMainSlot = (slot: 1 | 2 | 3) => {
    if (!slotTaskTitle.trim()) return;
    onAddTask({
      title: slotTaskTitle.trim(),
      isMainTask: true,
      prioritySlot: slot,
      channel: dayPlan.channel,
      estimatedMinutes: slot === 1 ? 60 : 45,
    });
    setSlotTaskTitle('');
    setEditingMainSlot(null);
  };

  const handleSaveReflection = () => {
    onUpdateDayPlan({ reflectionNotes: reflection });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Operating Rule Header */}
      <div className="rounded-2xl p-6 glass-panel-glow border border-cyan-500/20 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-2">
              <CalendarCheck2 className="w-3.5 h-3.5" />
              <span>Personal Operating Strategy</span>
            </div>
            <h2 className="text-xl lg:text-2xl font-extrabold text-white">Daily & Weekly Planner</h2>
            <p className="text-xs text-slate-300 mt-1">
              Philosophy: Single-Channel Focus + The Three-Task Rule. Prevent cognitive fragmentation.
            </p>
          </div>

          <button
            onClick={() => onSelectModule('focus')}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 cursor-pointer shrink-0"
          >
            <Timer className="w-4 h-4" /> Start Focus Session
          </button>
        </div>

        {/* 1. Single-Channel Day Selector */}
        <div className="pt-3 border-t border-white/8 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              Step 1: Select Today's Dedicated Channel
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              Avoid switching disciplines
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {channels.map(ch => {
              const isActive = dayPlan.channel === ch;
              return (
                <button
                  key={ch}
                  onClick={() => onUpdateDayPlan({ channel: ch })}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 border border-cyan-400/40'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/8 border border-white/6'
                  }`}
                >
                  {ch}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. The Three-Task Rule (Core commitments) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Step 2: The Three-Task Rule (Priority 1, 2, 3)
              </h3>
              <p className="text-xs text-slate-400">
                Each day choose only three main tasks. Complete these to win the day.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(slotNum => {
            const task = mainTasks[slotNum - 1];
            const slotLabels = [
              { label: 'Priority 1', purpose: 'Most important work' },
              { label: 'Priority 2', purpose: 'Second important work' },
              { label: 'Priority 3', purpose: 'Third important work' },
            ];
            const meta = slotLabels[slotNum - 1];

            return (
              <div
                key={slotNum}
                className="rounded-2xl glass-panel p-5 border border-white/8 flex flex-col justify-between space-y-4 relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                      {meta.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{meta.purpose}</span>
                  </div>

                  {task ? (
                    <div className="space-y-2 mt-2">
                      <div
                        onClick={() => onToggleTask(task.id)}
                        className="flex items-start gap-2.5 cursor-pointer"
                      >
                        <button
                          className="mt-0.5 text-slate-400 hover:text-cyan-400 cursor-pointer"
                          aria-label={`Toggle task completion`}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-500 hover:text-cyan-400" />
                          )}
                        </button>
                        <span
                          className={`text-sm font-semibold leading-snug ${
                            task.completed ? 'line-through text-slate-500' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>
                      {task.notes && (
                        <p className="text-xs text-slate-400 pl-7">{task.notes}</p>
                      )}
                    </div>
                  ) : editingMainSlot === slotNum ? (
                    <div className="space-y-2 mt-2">
                      <input
                        type="text"
                        placeholder={`Define ${meta.label.toLowerCase()}...`}
                        value={slotTaskTitle}
                        onChange={e => setSlotTaskTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-cyan-500/40 text-xs text-white placeholder-slate-500 focus:outline-none"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSetMainSlot(slotNum as 1 | 2 | 3)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500 text-white font-semibold text-xs cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingMainSlot(null)}
                          className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-slate-500 text-xs border border-dashed border-white/10 rounded-xl mt-2">
                      Slot Empty
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-white/6 flex items-center justify-between">
                  {task ? (
                    <>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {task.estimatedMinutes}m est
                      </span>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition cursor-pointer"
                        aria-label="Remove priority task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingMainSlot(slotNum);
                        setSlotTaskTitle('');
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer w-full justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" /> Assign Task {slotNum}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Small Supporting Tasks (Optional) */}
      <div className="rounded-2xl glass-panel p-5 border border-white/8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-slate-300" />
            <div>
              <h3 className="text-sm font-bold text-white">Small Supporting Tasks</h3>
              <p className="text-xs text-slate-400">
                Low cognitive overhead tasks (errands, quick checks, calibration).
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {supportingTasks.filter(t => t.completed).length}/{supportingTasks.length} Done
          </span>
        </div>

        {/* Add supporting task form */}
        <form onSubmit={handleAddSupporting} className="flex gap-2">
          <input
            type="text"
            placeholder="Add small supporting task..."
            value={newSupportingTitle}
            onChange={e => setNewSupportingTitle(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-white/8 hover:bg-white/12 text-white font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        <div className="space-y-2">
          {supportingTasks.map(task => (
            <div
              key={task.id}
              className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
                task.completed
                  ? 'bg-emerald-500/5 border-emerald-500/15 text-slate-500'
                  : 'bg-white/[0.02] border-white/6 text-slate-300 hover:bg-white/[0.04]'
              }`}
            >
              <div
                onClick={() => onToggleTask(task.id)}
                className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
              >
                <button
                  className="text-slate-400 hover:text-cyan-400"
                  aria-label="Toggle supporting task"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-500" />
                  )}
                </button>
                <span className={`text-xs ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {task.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 font-mono">{task.channel}</span>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded cursor-pointer"
                  aria-label="Delete supporting task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Daily Operating Flow & End-of-Day Review */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Step-by-Step Daily Flow */}
        <div className="rounded-2xl glass-panel p-5 border border-white/8 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Daily Operating Flow
          </h3>
          <ol className="space-y-2 text-xs text-slate-300 font-normal">
            <li className="flex items-start gap-2">
              <span className="font-mono text-cyan-400 font-bold">1.</span>
              <span><strong>Select Channel:</strong> Pick one discipline for the day.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-cyan-400 font-bold">2.</span>
              <span><strong>Choose 3 Tasks:</strong> Lock in high-impact commitments.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-cyan-400 font-bold">3.</span>
              <span><strong>Start Focus Timer:</strong> Work on one task uninterrupted.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-cyan-400 font-bold">4.</span>
              <span><strong>Record & Rest:</strong> Take a 5-minute break between sprints.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-mono text-cyan-400 font-bold">5.</span>
              <span><strong>Review & Improve:</strong> Jot down daily insight before close.</span>
            </li>
          </ol>
        </div>

        {/* End of Day Reflection */}
        <div className="rounded-2xl glass-panel p-5 border border-white/8 space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Daily Reflection & Notes</h3>
            <p className="text-xs text-slate-400 mb-2">
              What went well? Any friction or interruptions during execution?
            </p>
            <textarea
              rows={3}
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              placeholder="e.g. Solved inverse kinematics. Friction: needed to recalibrate joint 2 angle bounds."
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/8 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            onClick={handleSaveReflection}
            className="self-end px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer"
          >
            Save Reflection
          </button>
        </div>
      </div>
    </div>
  );
};
