import React, { useState } from 'react';
import {
  Compass,
  Plus,
  ExternalLink,
  Star,
  Trash2,
  Edit2,
  Folder,
  Layers,
  Code2,
  Palette,
  BookOpen,
  Cpu,
  Terminal,
  Laptop,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { AppShortcut } from '../types';

interface AppLauncherViewProps {
  savedApps: AppShortcut[];
  onSaveApp: (app: AppShortcut) => void;
  onDeleteApp: (appId: string) => void;
}

export const AppLauncherView: React.FC<AppLauncherViewProps> = ({
  savedApps,
  onSaveApp,
  onDeleteApp,
}) => {
  const [editingApp, setEditingApp] = useState<AppShortcut | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Form states
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('Code');
  const [isFavorite, setIsFavorite] = useState(false);

  const categories = ['ALL', 'Code', 'Design', 'Hardware', 'Knowledge', 'Mathematics', 'Research', 'Strategy', 'Reference'];

  const filteredApps = savedApps.filter(app => {
    return selectedCategory === 'ALL' || app.category === selectedCategory;
  });

  const handleOpenEdit = (app?: AppShortcut) => {
    if (app) {
      setEditingApp(app);
      setName(app.name);
      setUrl(app.url);
      setCategory(app.category);
      setIsFavorite(app.isFavorite);
    } else {
      setEditingApp({
        id: `app-${Date.now()}`,
        name: '',
        url: '',
        category: 'Code',
        icon: 'Code2',
        isFavorite: false,
        order: savedApps.length + 1,
      });
      setName('');
      setUrl('');
      setCategory('Code');
      setIsFavorite(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim() || !editingApp) return;

    let validUrl = url.trim();
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = 'https://' + validUrl;
    }

    const updated: AppShortcut = {
      ...editingApp,
      name: name.trim(),
      url: validUrl,
      category,
      isFavorite,
    };
    onSaveApp(updated);
    setEditingApp(null);
  };

  const toggleFavorite = (app: AppShortcut) => {
    onSaveApp({ ...app, isFavorite: !app.isFavorite });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Work Dock</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-white">12-App Launcher</h2>
          <p className="text-xs text-slate-300 mt-1">
            Fast access dock for your essential engineering tools, CAD resources, notebooks, and platforms.
          </p>
        </div>

        <button
          onClick={() => handleOpenEdit()}
          className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Application
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/6 border border-white/6'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid of 12 Applications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredApps.map(app => (
          <div
            key={app.id}
            className="rounded-2xl glass-panel p-5 border border-white/8 hover:border-cyan-500/30 transition flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-cyan-300 font-bold">
                  {app.category}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleFavorite(app)}
                    className={`p-1 rounded cursor-pointer ${
                      app.isFavorite ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                    }`}
                    title="Toggle Favorite"
                  >
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(app)}
                    className="p-1 rounded text-slate-500 hover:text-white cursor-pointer"
                    title="Edit App"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteApp(app.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 cursor-pointer"
                    title="Delete App"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 text-cyan-300 font-bold text-base flex items-center justify-center border border-cyan-500/30 group-hover:scale-105 transition">
                  {app.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                    {app.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono truncate max-w-[140px]">
                    {app.url.replace(/^https?:\/\//, '')}
                  </p>
                </div>
              </div>
            </div>

            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-cyan-500/15 border border-white/6 hover:border-cyan-500/30 text-xs text-slate-300 hover:text-cyan-200 font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <span>Launch App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {editingApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl bg-[#0c1220] border border-white/10 shadow-2xl p-6 space-y-4 glass-panel">
            <h3 className="text-sm font-bold text-white">
              {editingApp.name ? `Edit ${editingApp.name}` : 'Add Saved Application'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Application Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. GitHub"
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">URL</label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none"
                >
                  {categories.filter(c => c !== 'ALL').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={e => setIsFavorite(e.target.checked)}
                  className="rounded text-cyan-500 accent-cyan-500"
                />
                <span>Add to Dashboard Favorites Dock</span>
              </label>

              <div className="flex justify-end gap-2 pt-2 border-t border-white/6">
                <button
                  type="button"
                  onClick={() => setEditingApp(null)}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs cursor-pointer"
                >
                  Save App
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
