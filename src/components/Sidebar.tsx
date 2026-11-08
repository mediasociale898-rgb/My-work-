import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck2,
  FileText,
  BrainCircuit,
  FolderKanban,
  Code2,
  Boxes,
  Timer,
  BarChart3,
  Compass,
  Lightbulb,
  Settings,
  PlusCircle,
  Sparkles,
  ChevronRight,
  Radio,
  Box,
  Music,
  Lock,
  ShieldCheck,
  Fingerprint,
} from 'lucide-react';
import { ChannelType, AppSettings } from '../types';

export type ActiveModule =
  | 'dashboard'
  | 'planner'
  | 'notes'
  | 'quizzes'
  | 'files'
  | 'code'
  | 'projects'
  | '3dview'
  | 'piano'
  | 'focus'
  | 'analytics'
  | 'launcher'
  | 'strategy'
  | 'settings'
  | 'privacy';

interface SidebarProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  currentChannel: ChannelType;
  onOpenQuickCapture: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  settings: AppSettings;
  onLockOS: () => void;
}

interface NavSection {
  title: string;
  items: {
    id: ActiveModule;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    highlight?: boolean;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  currentChannel,
  onOpenQuickCapture,
  isOpenMobile,
  onCloseMobile,
  settings,
  onLockOS,
}) => {
  const sections: NavSection[] = [
    {
      title: 'WORKSPACE',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'planner', label: 'Planner', icon: CalendarCheck2 },
        { id: 'notes', label: 'Notes', icon: FileText },
        { id: 'quizzes', label: 'Quiz & Recall', icon: BrainCircuit, badge: 'Active' },
      ],
    },
    {
      title: 'CREATIVE & BUILD',
      items: [
        { id: '3dview', label: '3D View Studio', icon: Box, badge: 'CAD', highlight: true },
        { id: 'piano', label: 'Color Music Piano', icon: Music, badge: 'Synth', highlight: true },
        { id: 'code', label: 'Code Studio', icon: Code2 },
        { id: 'projects', label: 'Project Lab', icon: Boxes, badge: '4' },
        { id: 'files', label: 'File Manager', icon: FolderKanban },
      ],
    },
    {
      title: 'FOCUS & INSIGHTS',
      items: [
        { id: 'focus', label: 'Focus Mode', icon: Timer },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'launcher', label: 'App Launcher', icon: Compass, badge: '12' },
      ],
    },
    {
      title: 'STRATEGY & VAULT',
      items: [
        { id: 'strategy', label: 'Ideas & Strategy', icon: Lightbulb },
        { id: 'settings', label: 'Settings & Security', icon: Settings },
        { id: 'privacy', label: 'Privacy & Terms', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col bg-[#070b14]/95 backdrop-blur-3xl border-r border-white/8 transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 lg:p-5 border-b border-white/6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-violet-600 p-[1px] shadow-lg shadow-cyan-500/25">
              <div className="w-full h-full bg-[#0a0f1d] rounded-[15px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                  MY WORK
                </h1>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30">
                  OS 1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Personal Work OS</p>
            </div>
          </div>
        </div>

        {/* Quick Capture & Working Channel Bar */}
        <div className="p-3.5 space-y-2.5">
          <button
            onClick={() => {
              onOpenQuickCapture();
              onCloseMobile();
            }}
            className="w-full py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 active:scale-[0.98] transition cursor-pointer"
            aria-label="Quick capture modal"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Quick Capture</span>
            <kbd className="ml-auto text-[10px] bg-black/30 px-1.5 py-0.5 rounded-lg text-cyan-100 font-mono">
              Alt+C
            </kbd>
          </button>

          {/* Current Working Channel pill */}
          <div
            onClick={() => {
              onSelectModule('planner');
              onCloseMobile();
            }}
            className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/6 hover:border-cyan-500/30 transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                Active Channel
              </span>
              <span className="text-[10px] text-slate-500 group-hover:text-cyan-400 flex items-center">
                Switch <ChevronRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
            <div className="text-xs font-bold text-white mt-1 flex items-center justify-between">
              <span>{currentChannel}</span>
              <span className="text-[9px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                Single-Channel
              </span>
            </div>
          </div>

          {/* Optional PIN / Fingerprint Security Vault Pill in Navbar */}
          <div className="p-2.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-cyan-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white">Biometric Vault</span>
                <span className="text-[9px] text-slate-400 font-mono">
                  {settings.isPinEnabled ? 'PIN Protected' : 'Simple Optional PIN'}
                </span>
              </div>
            </div>
            <button
              onClick={onLockOS}
              className="px-2 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition"
              title="Lock OS Now"
            >
              <Lock className="w-3 h-3" />
              <span>Lock</span>
            </button>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-4">
          {sections.map(sec => (
            <div key={sec.title} className="space-y-1">
              <div className="px-3 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                {sec.title}
              </div>
              <div className="space-y-0.5">
                {sec.items.map(item => {
                  const isActive = activeModule === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectModule(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-2xl text-xs font-semibold transition cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/25 to-blue-600/15 text-cyan-200 border border-cyan-500/35 shadow-sm shadow-cyan-500/10'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 ${
                            isActive
                              ? 'text-cyan-400'
                              : item.highlight
                              ? 'text-cyan-300'
                              : 'text-slate-500'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            isActive
                              ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-500/30'
                              : item.highlight
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                              : 'bg-white/5 text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Operating Cycle & Privacy Guarantee */}
        <div className="p-3 border-t border-white/6 bg-white/[0.01] flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>LOCAL-FIRST · ZERO TRACKING</span>
          <button
            onClick={() => {
              onSelectModule('privacy');
              onCloseMobile();
            }}
            className="text-cyan-400 hover:underline"
          >
            Privacy
          </button>
        </div>
      </aside>
    </>
  );
};
