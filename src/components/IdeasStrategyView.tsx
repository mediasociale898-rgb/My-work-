import React, { useState } from 'react';
import {
  Lightbulb,
  Plus,
  ThumbsUp,
  ArrowRight,
  Boxes,
  Sparkles,
  ShieldAlert,
  Compass,
  CheckCircle2,
  Workflow,
} from 'lucide-react';
import { IdeaItem, SystemRecommendation, ProjectItem } from '../types';
import { ActiveModule } from './Sidebar';

interface IdeasStrategyViewProps {
  ideas: IdeaItem[];
  onSaveIdea: (idea: IdeaItem) => void;
  onDeleteIdea: (ideaId: string) => void;
  recommendations: SystemRecommendation[];
  onPromoteIdeaToProject: (idea: IdeaItem) => void;
  onSelectModule: (mod: ActiveModule) => void;
}

export const IdeasStrategyView: React.FC<IdeasStrategyViewProps> = ({
  ideas,
  onSaveIdea,
  onDeleteIdea,
  recommendations,
  onPromoteIdeaToProject,
  onSelectModule,
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Robotics');
  const [newDesc, setNewDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const stages = ['ALL', 'RAW', 'EVALUATING', 'READY_FOR_PROJECT'];

  const filteredIdeas = ideas.filter(idea => {
    return selectedStage === 'ALL' || idea.stage === selectedStage;
  });

  const handleVote = (idea: IdeaItem) => {
    onSaveIdea({ ...idea, votes: idea.votes + 1 });
  };

  const handleStageChange = (idea: IdeaItem, newStage: IdeaItem['stage']) => {
    onSaveIdea({ ...idea, stage: newStage });
  };

  const handleCreateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newIdea: IdeaItem = {
      id: `idea-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      description: newDesc.trim(),
      stage: 'RAW',
      votes: 1,
      createdAt: new Date().toISOString(),
    };
    onSaveIdea(newIdea);
    setNewTitle('');
    setNewDesc('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold mb-1">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Incubation & Strategic Advice</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-white">Ideas & Strategy</h2>
          <p className="text-xs text-slate-300 mt-1">
            Incubate concepts, evaluate feasibility, and monitor rule-based system recommendations.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Incubate Idea
        </button>
      </div>

      {/* Internal System Recommendations Section (Blueprint Section 11) */}
      <div className="rounded-2xl p-6 glass-panel-glow border border-indigo-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Transparent OS Recommendations
              </h3>
              <p className="text-xs text-slate-400">
                Data-driven strategic adjustments calculated from your actual execution history.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Rules Engine v1.0
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {recommendations.map(rec => (
            <div
              key={rec.id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                rec.severity === 'high'
                  ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                  : rec.severity === 'medium'
                  ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                  : 'bg-white/[0.03] border-white/8 text-slate-300'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/5">
                    {rec.category}
                  </span>
                  <span className="text-[10px] font-mono capitalize">
                    Priority: {rec.severity}
                  </span>
                </div>
                <div className="text-xs font-semibold text-white">{rec.situation}</div>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {rec.recommendation}
                </p>
              </div>

              {rec.actionModule && (
                <button
                  onClick={() => onSelectModule(rec.actionModule as ActiveModule)}
                  className="self-start text-[11px] font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 pt-1 cursor-pointer"
                >
                  {rec.actionLabel || 'Resolve in System'} <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add New Idea form */}
      {isAdding && (
        <form onSubmit={handleCreateIdea} className="rounded-2xl glass-panel p-5 border border-white/8 space-y-4 animate-fadeIn">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Capture New Idea Concept
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs text-slate-400 mb-1">Idea Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Active Magnetic Levitation Bearing"
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Category</label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none"
              >
                <option value="Robotics">Robotics</option>
                <option value="Electrical">Electrical</option>
                <option value="Software">Software</option>
                <option value="Research">Research</option>
                <option value="3D CAD">3D CAD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Concept Description & Technical Merit</label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="What core problem does this solve? What experimental testing is required?"
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-semibold text-xs cursor-pointer"
            >
              Save Idea
            </button>
          </div>
        </form>
      )}

      {/* Idea Pipeline Stages */}
      <div className="flex flex-wrap gap-2">
        {stages.map(st => {
          const isActive = selectedStage === st;
          return (
            <button
              key={st}
              onClick={() => setSelectedStage(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/6 border border-white/6'
              }`}
            >
              {st}
            </button>
          );
        })}
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIdeas.map(idea => (
          <div
            key={idea.id}
            className="rounded-2xl glass-panel p-5 border border-white/8 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-amber-300 font-bold">
                  {idea.category}
                </span>
                <select
                  value={idea.stage}
                  onChange={e => handleStageChange(idea, e.target.value as IdeaItem['stage'])}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 border border-white/10 text-slate-300 focus:outline-none"
                >
                  <option value="RAW">RAW</option>
                  <option value="EVALUATING">EVALUATING</option>
                  <option value="READY_FOR_PROJECT">READY FOR PROJECT</option>
                </select>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">{idea.title}</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{idea.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-white/6 flex items-center justify-between">
              <button
                onClick={() => handleVote(idea)}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition cursor-pointer"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span className="font-mono">{idea.votes}</span>
              </button>

              <button
                onClick={() => onPromoteIdeaToProject(idea)}
                className="py-1.5 px-3 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
              >
                <Boxes className="w-3.5 h-3.5" /> Promote to Project Lab
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
