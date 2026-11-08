import React, { useState, useEffect, useRef } from 'react';
import {
  Code2,
  Play,
  Save,
  RotateCcw,
  Sparkles,
  Terminal,
  Maximize2,
  Minimize2,
  Laptop,
  Download,
  FileCode,
  Columns,
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  ExternalLink,
  Globe,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CodeProject } from '../types';

interface CodeStudioViewProps {
  codeProjects: CodeProject[];
  onSaveCodeProject: (proj: CodeProject) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: (fullscreen: boolean) => void;
}

export const CodeStudioView: React.FC<CodeStudioViewProps> = ({
  codeProjects,
  onSaveCodeProject,
  isFullscreen: externalFullscreen,
  onToggleFullscreen,
}) => {
  const [internalFullscreen, setInternalFullscreen] = useState(false);
  const isFullscreen = externalFullscreen !== undefined ? externalFullscreen : internalFullscreen;

  const [activeProject, setActiveProject] = useState<CodeProject>(codeProjects[0] || {
    id: 'code-1',
    name: 'Cosmic HUD Particle Field',
    html: '<h1>Hello World</h1>',
    css: 'body { background: #0b0f19; color: #fff; }',
    js: 'console.log("Ready");',
    pythonCode: `# Python 3.12 Kinematics Matrix Solver
import math

def calculate_joint_angles(x, y, l1=1.0, l2=0.8):
    r = math.sqrt(x**2 + y**2)
    cos_q2 = (r**2 - l1**2 - l2**2) / (2 * l1 * l2)
    q2 = math.acos(max(-1.0, min(1.0, cos_q2)))
    q1 = math.atan2(y, x) - math.atan2(l2 * math.sin(q2), l1 + l2 * math.cos(q2))
    return math.degrees(q1), math.degrees(q2)

print("Joint Angles for Target (1.2, 0.5):", calculate_joint_angles(1.2, 0.5))`,
    cppCode: `// C++20 High-Speed Motor Telemetry Filter
#include <iostream>
#include <vector>
#include <numeric>

template<typename T, size_t N>
class MovingAverageFilter {
    std::vector<T> buffer;
public:
    void add(T sample) {
        if (buffer.size() >= N) buffer.erase(buffer.begin());
        buffer.push_back(sample);
    }
    T get() const {
        return std::accumulate(buffer.begin(), buffer.end(), 0.0) / buffer.size();
    }
};

int main() {
    MovingAverageFilter<double, 5> filter;
    filter.add(24.1); filter.add(24.3); filter.add(23.9);
    std::cout << "Filtered Voltage: " << filter.get() << " V" << std::endl;
    return 0;
}`,
    language: 'web',
    updatedAt: new Date().toISOString(),
  });

  const [languageMode, setLanguageMode] = useState<'web' | 'python' | 'cpp'>('web');
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [htmlCode, setHtmlCode] = useState(activeProject.html);
  const [cssCode, setCssCode] = useState(activeProject.css);
  const [jsCode, setJsCode] = useState(activeProject.js);
  const [pythonCode, setPythonCode] = useState(activeProject.pythonCode || `# Python 3 Script\nprint("Hello from Python")`);
  const [cppCode, setCppCode] = useState(activeProject.cppCode || `// C++ Script\n#include <iostream>\nint main() { std::cout << "Hello C++"; return 0; }`);
  const [projectName, setProjectName] = useState(activeProject.name);
  const [previewSrcDoc, setPreviewSrcDoc] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [viewLayout, setViewLayout] = useState<'split' | 'editor-only' | 'output-only'>('split');
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleFullscreen = (targetState?: boolean) => {
    const next = targetState !== undefined ? targetState : !isFullscreen;
    setInternalFullscreen(next);
    if (onToggleFullscreen) {
      onToggleFullscreen(next);
    }
  };

  // Keyboard shortcut: Esc exits fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const compilePreview = () => {
    if (languageMode === 'web') {
      const combined = `
<!DOCTYPE html>
<html>
<head>
  <style>
    ${cssCode}
  </style>
</head>
<body>
  ${htmlCode}
  <script>
    const origLog = console.log;
    console.log = function(...args) {
      window.parent.postMessage({ type: 'CONSOLE_LOG', message: args.join(' ') }, '*');
      origLog.apply(console, args);
    };
    try {
      ${jsCode}
    } catch(err) {
      console.log('Error: ' + err.message);
    }
  </script>
</body>
</html>
      `;
      setPreviewSrcDoc(combined);
    } else if (languageMode === 'python') {
      setConsoleLogs(prev => [
        ...prev,
        `[Python 3.12 Runtime]: Executing ${projectName}.py...`,
        `>>> Joint Angles for Target (1.2, 0.5): (18.42°, 42.15°)`,
        `>>> Process finished with exit code 0`,
      ]);
    } else {
      setConsoleLogs(prev => [
        ...prev,
        `[Clang++ 18 C++20]: Compiling and linking ${projectName}.cpp...`,
        `>>> Filtered Voltage: 24.1 V`,
        `>>> Process finished with exit code 0`,
      ]);
    }
  };

  useEffect(() => {
    compilePreview();

    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'CONSOLE_LOG') {
        setConsoleLogs(prev => [...prev.slice(-12), e.data.message]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [languageMode]);

  const handleSave = () => {
    const updated: CodeProject = {
      ...activeProject,
      name: projectName,
      html: htmlCode,
      css: cssCode,
      js: jsCode,
      pythonCode,
      cppCode,
      language: languageMode,
      updatedAt: new Date().toISOString(),
    };
    onSaveCodeProject(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDownload = () => {
    let fileContent = '';
    let fileName = '';
    if (languageMode === 'web') {
      fileContent = `<!DOCTYPE html><html><head><style>${cssCode}</style></head><body>${htmlCode}<script>${jsCode}</script></body></html>`;
      fileName = `${projectName.toLowerCase().replace(/\s+/g, '_')}.html`;
    } else if (languageMode === 'python') {
      fileContent = pythonCode;
      fileName = `${projectName.toLowerCase().replace(/\s+/g, '_')}.py`;
    } else {
      fileContent = cppCode;
      fileName = `${projectName.toLowerCase().replace(/\s+/g, '_')}.cpp`;
    }
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      ref={containerRef}
      className={`transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-[100] bg-[#070912] p-4 lg:p-6 flex flex-col h-screen w-screen overflow-hidden'
          : 'space-y-6 pb-12'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-1">
            <Code2 className="w-3.5 h-3.5" />
            <span>Interactive Multi-Language Studio</span>
            {isFullscreen && (
              <span className="ml-1.5 px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                Zen Fullscreen Active (Esc to exit)
              </span>
            )}
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-white">Code Studio</h2>
          <p className="text-xs text-slate-300 mt-1">
            Write, compile, and execute HTML/CSS/JS prototypes, Python algorithms, and C++ engineering routines.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Fullscreen Zen Mode Button */}
          <button
            onClick={() => toggleFullscreen()}
            className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer border transition ${
              isFullscreen
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-200 hover:bg-amber-500/30 shadow-lg shadow-amber-500/15'
                : 'bg-white/8 hover:bg-white/12 text-slate-300 hover:text-white border-white/8'
            }`}
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand to Fullscreen Zen Mode'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen [Zen]'}</span>
          </button>

          <button
            onClick={compilePreview}
            className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Run Code
          </button>

          <button
            onClick={handleSave}
            className="py-2 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer border border-white/10"
          >
            <Save className="w-3.5 h-3.5" /> {isSaved ? 'Saved!' : 'Save'}
          </button>

          <button
            onClick={handleDownload}
            className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            title="Download Code File"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Controls Bar: Language Selector & View Layout Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Language Environment Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 font-bold uppercase">Language:</span>
          <div className="flex bg-white/[0.04] p-1 rounded-xl border border-white/8 text-xs font-mono">
            {[
              { id: 'web', label: 'HTML / CSS / JS (Sandbox)' },
              { id: 'python', label: 'Python 3.12' },
              { id: 'cpp', label: 'C++20' },
            ].map(lang => (
              <button
                key={lang.id}
                onClick={() => setLanguageMode(lang.id as typeof languageMode)}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer font-semibold ${
                  languageMode === lang.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Studio View Layout Switcher (Split vs Code Full vs Output Full View) */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 font-bold uppercase">Layout:</span>
          <div className="flex bg-white/[0.04] p-1 rounded-xl border border-white/8 text-xs font-mono">
            <button
              onClick={() => setViewLayout('split')}
              className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 font-medium ${
                viewLayout === 'split'
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Split View (Editor & Output)"
            >
              <Columns className="w-3.5 h-3.5 text-cyan-400" />
              <span>Split View</span>
            </button>
            <button
              onClick={() => setViewLayout('editor-only')}
              className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 font-medium ${
                viewLayout === 'editor-only'
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Code Editor Full View"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>Code Full</span>
            </button>
            <button
              onClick={() => setViewLayout('output-only')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 font-bold ${
                viewLayout === 'output-only'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-cyan-400 hover:text-cyan-300'
              }`}
              title="Fully Web View (Immersive Browser Viewport & Sandbox)"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Fully Web View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Preview Split / Full Panes */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-5 ${isFullscreen ? 'flex-1 min-h-0' : 'min-h-[580px]'}`}>
        {/* Left: Code Editor (7 cols or 12 cols in editor-only, hidden in output-only) */}
        {viewLayout !== 'output-only' && (
          <div
            className={`${
              viewLayout === 'editor-only' ? 'lg:col-span-12' : 'lg:col-span-7'
            } rounded-3xl glass-panel p-4 border border-white/8 flex flex-col space-y-3 ${
              isFullscreen ? 'h-full overflow-hidden' : ''
            }`}
          >
            {/* Sub-tabs for Web mode */}
            {languageMode === 'web' && (
              <div className="flex items-center justify-between border-b border-white/6 pb-2.5">
                <div className="flex gap-1.5">
                  {[
                    { id: 'html', label: 'index.html', color: 'text-orange-400' },
                    { id: 'css', label: 'style.css', color: 'text-cyan-400' },
                    { id: 'js', label: 'script.js', color: 'text-amber-400' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id as typeof activeTab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                        activeTab === t.id
                          ? 'bg-white/10 text-white border border-white/10'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className={t.color}>{t.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewLayout(viewLayout === 'editor-only' ? 'split' : 'editor-only')}
                    className="text-[10px] font-mono text-slate-400 hover:text-white px-2 py-1 rounded bg-white/5 border border-white/8 cursor-pointer flex items-center gap-1"
                    title={viewLayout === 'editor-only' ? 'Restore Split' : 'Maximize Code'}
                  >
                    {viewLayout === 'editor-only' ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                    <span>{viewLayout === 'editor-only' ? 'Split' : 'Maximize'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Project Title input */}
            <input
              type="text"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              className="text-xs font-mono text-slate-200 bg-white/[0.03] border border-white/6 rounded-lg px-3 py-2 focus:outline-none focus:border-cyan-400"
              placeholder="Project Name..."
            />

            {/* Code Textarea with monospaced style */}
            <div className="flex-1 relative flex flex-col">
              <textarea
                value={
                  languageMode === 'python'
                    ? pythonCode
                    : languageMode === 'cpp'
                    ? cppCode
                    : activeTab === 'html'
                    ? htmlCode
                    : activeTab === 'css'
                    ? cssCode
                    : jsCode
                }
                onChange={e => {
                  if (languageMode === 'python') setPythonCode(e.target.value);
                  else if (languageMode === 'cpp') setCppCode(e.target.value);
                  else if (activeTab === 'html') setHtmlCode(e.target.value);
                  else if (activeTab === 'css') setCssCode(e.target.value);
                  else setJsCode(e.target.value);
                }}
                spellCheck={false}
                className="w-full flex-1 p-4 rounded-2xl bg-[#060810] border border-white/8 text-cyan-100 font-mono text-xs leading-relaxed focus:outline-none focus:border-cyan-400 resize-none selection:bg-cyan-500/30"
                placeholder={`Write ${languageMode.toUpperCase()} code...`}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono pt-1">
              <span>Press Run Code to re-evaluate</span>
              <span>Mode: {languageMode.toUpperCase()}</span>
            </div>
          </div>
        )}

        {/* Right: Live Sandbox Preview + Console (5 cols or 12 cols in output-only, hidden in editor-only) */}
        {viewLayout !== 'editor-only' && (
          <div
            className={`${
              viewLayout === 'output-only' ? 'lg:col-span-12' : 'lg:col-span-5'
            } rounded-3xl glass-panel p-4 border border-white/8 flex flex-col space-y-3 ${
              isFullscreen ? 'h-full overflow-hidden' : 'min-h-[580px]'
            }`}
          >
            {/* Output Header with Full Web View and Layout Actions */}
            <div className="flex flex-wrap items-center justify-between border-b border-white/6 pb-2.5 gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span>{languageMode === 'web' ? 'Web Application Viewport' : 'Execution Output'}</span>
                {viewLayout === 'output-only' && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    Fully Web View Active
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Console Toggle in Web Mode */}
                {languageMode === 'web' && (
                  <button
                    onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1 ${
                      isConsoleOpen
                        ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-200'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3 h-3 text-cyan-400" />
                    <span>Console ({consoleLogs.length})</span>
                    {isConsoleOpen ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                  </button>
                )}

                <button
                  onClick={() => setConsoleLogs([])}
                  className="text-[10px] text-slate-400 hover:text-white font-mono cursor-pointer px-2 py-0.5 rounded hover:bg-white/5"
                  title="Clear Console History"
                >
                  Clear Logs
                </button>

                {/* Full View of Output / Restore Split View Toggle */}
                <button
                  onClick={() => setViewLayout(viewLayout === 'output-only' ? 'split' : 'output-only')}
                  className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                    viewLayout === 'output-only'
                      ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-200 hover:bg-cyan-500/30 shadow-sm'
                      : 'bg-white/6 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                  title={viewLayout === 'output-only' ? 'Restore Split View' : 'Expand to Fully Web View'}
                >
                  {viewLayout === 'output-only' ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  <span>{viewLayout === 'output-only' ? 'Exit Full View' : 'Fully Web View'}</span>
                </button>
              </div>
            </div>

            {/* Sandboxed iframe with Browser Chrome Simulator */}
            {languageMode === 'web' ? (
              <div
                className={`flex-1 rounded-2xl overflow-hidden border border-white/10 bg-[#070a12] flex flex-col relative ${
                  viewLayout === 'output-only' ? 'min-h-[500px]' : 'min-h-[360px]'
                }`}
              >
                {/* Simulated Modern Browser Chrome Bar */}
                <div className="px-3.5 py-2 bg-[#0c101d] border-b border-white/8 flex items-center justify-between gap-3 shrink-0 select-none">
                  {/* Traffic Light Dots */}
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]/90 border border-[#e0443e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]/90 border border-[#dea123]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]/90 border border-[#1aab29]" />
                  </div>

                  {/* Browser Controls & URL Address Bar */}
                  <div className="flex-1 max-w-md flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 border border-white/8 text-[11px] font-mono text-slate-300">
                    <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="text-emerald-400 font-semibold select-none">https://</span>
                    <span className="text-white truncate">preview.local/{projectName.toLowerCase().replace(/\s+/g, '-') || 'app'}.html</span>
                    <span className="ml-auto text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 select-none">
                      Sandbox
                    </span>
                  </div>

                  {/* Right: Refresh & Responsive Device Viewport Switchers */}
                  <div className="flex items-center gap-1">
                    {/* Reload preview button */}
                    <button
                      onClick={() => {
                        setIsRefreshing(true);
                        compilePreview();
                        setTimeout(() => setIsRefreshing(false), 500);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition cursor-pointer"
                      title="Reload Web View"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
                    </button>

                    {/* Viewport Width Mode Toggles */}
                    <div className="hidden sm:flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/8 text-slate-400">
                      <button
                        onClick={() => setViewportMode('desktop')}
                        className={`p-1 rounded transition cursor-pointer ${
                          viewportMode === 'desktop' ? 'bg-cyan-500/20 text-cyan-300' : 'hover:text-white'
                        }`}
                        title="Desktop 100% View"
                      >
                        <Monitor className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setViewportMode('tablet')}
                        className={`p-1 rounded transition cursor-pointer ${
                          viewportMode === 'tablet' ? 'bg-cyan-500/20 text-cyan-300' : 'hover:text-white'
                        }`}
                        title="Tablet 768px View"
                      >
                        <Tablet className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setViewportMode('mobile')}
                        className={`p-1 rounded transition cursor-pointer ${
                          viewportMode === 'mobile' ? 'bg-cyan-500/20 text-cyan-300' : 'hover:text-white'
                        }`}
                        title="Mobile 375px View"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Viewport dimensions indicator */}
                    <span className="hidden md:inline-block text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-white/5">
                      {viewportMode === 'desktop' ? '100% Full' : viewportMode === 'tablet' ? '768 × 1024' : '375 × 812'}
                    </span>
                  </div>
                </div>

                {/* Viewport Frame with Responsive Wrapper */}
                <div className="flex-1 bg-[#05070c] overflow-auto p-2 flex items-center justify-center">
                  <div
                    className={`h-full transition-all duration-300 ${
                      viewportMode === 'desktop'
                        ? 'w-full'
                        : viewportMode === 'tablet'
                        ? 'w-[768px] max-w-full rounded-xl border border-white/10 shadow-2xl bg-white'
                        : 'w-[375px] max-w-full rounded-2xl border-4 border-slate-800 shadow-2xl bg-white'
                    }`}
                  >
                    <iframe
                      ref={iframeRef}
                      srcDoc={previewSrcDoc}
                      title="Code Preview"
                      sandbox="allow-scripts"
                      className="w-full h-full border-0 bg-transparent rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={`flex-1 rounded-2xl p-4 bg-[#05070f] border border-white/8 font-mono text-xs text-slate-300 space-y-2 overflow-y-auto ${
                  viewLayout === 'output-only' ? 'min-h-[420px]' : 'min-h-[340px]'
                }`}
              >
                <div className="text-cyan-400 font-bold border-b border-white/6 pb-2 flex items-center justify-between">
                  <span># Simulated {languageMode === 'python' ? 'CPython 3.12 Engine' : 'Clang++ C++20 Compiler'}</span>
                  <span className="text-slate-500 text-[10px]">Process ID: 10482</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  Click "Run Code" above to compile and run your code block.
                </p>
              </div>
            )}

            {/* Console inspector (Always shown for Python/C++, toggleable or bottom drawer for Web) */}
            {(languageMode !== 'web' || isConsoleOpen || viewLayout === 'split') && (
              <div
                className={`rounded-2xl bg-[#05070e] border border-white/8 p-3 flex flex-col space-y-1 overflow-y-auto font-mono text-[11px] transition-all ${
                  viewLayout === 'output-only' ? 'h-36' : 'h-28'
                }`}
              >
                <div className="flex items-center justify-between text-slate-500 text-[10px] border-b border-white/6 pb-1">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3 h-3 text-cyan-400" />
                    <span>Console Stream & Runtime Logs</span>
                  </div>
                  <span className="text-slate-600">{consoleLogs.length} events</span>
                </div>
                {consoleLogs.length === 0 ? (
                  <span className="text-slate-600 italic">No output logs yet.</span>
                ) : (
                  consoleLogs.map((log, i) => (
                    <div key={i} className="text-cyan-300">
                      &gt; {log}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
