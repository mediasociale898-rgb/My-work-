import React, { useState, useRef } from 'react';
import {
  Upload,
  FileCode,
  Video,
  Image as ImageIcon,
  FileText,
  Box,
  CheckCircle2,
  Folder,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { FileFolderItem } from '../types';

interface FolderFileUploadZoneProps {
  currentPath: string;
  availableFolders?: { name: string; category: string }[];
  onFileAttached: (file: FileFolderItem) => void;
  compact?: boolean;
  className?: string;
}

interface StagedFile {
  id: string;
  nativeFile: File;
  name: string;
  size: number;
  extension: string;
  category: FileFolderItem['fileCategory'];
  content?: string;
  mediaUrl?: string;
  status: 'ready' | 'processing' | 'done';
}

export const FolderFileUploadZone: React.FC<FolderFileUploadZoneProps> = ({
  currentPath,
  availableFolders = [
    { name: 'Education/Mathematics', category: 'Education' },
    { name: 'Education/Physics', category: 'Education' },
    { name: 'Education/Programming', category: 'Education' },
    { name: 'NTFY/Robotics', category: 'NTFY' },
    { name: 'NTFY/Electrical', category: 'NTFY' },
    { name: 'NTFY/Software', category: 'NTFY' },
    { name: 'Projects/Active', category: 'Projects' },
    { name: 'Projects/Unfinished', category: 'Projects' },
    { name: 'Projects/Completed', category: 'Projects' },
    { name: 'Research', category: 'Core' },
    { name: 'Ideas', category: 'Core' },
    { name: 'Documents', category: 'Core' },
    { name: 'Media', category: 'Core' },
    { name: 'Archive', category: 'Core' },
  ],
  onFileAttached,
  compact = false,
  className = '',
}) => {
  const [targetFolder, setTargetFolder] = useState<string>(currentPath);
  const [isDragOver, setIsDragOver] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep targetFolder synced if currentPath changes and no manual override
  React.useEffect(() => {
    setTargetFolder(currentPath);
  }, [currentPath]);

  const categorizeFile = (extension: string): FileFolderItem['fileCategory'] => {
    const ext = extension.toLowerCase();
    if (['mp4', 'webm', 'mov', 'avi', 'mkv'].includes(ext)) return 'video';
    if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif', 'bmp'].includes(ext)) return 'photo';
    if (['py', 'cpp', 'c', 'h', 'hpp', 'js', 'ts', 'tsx', 'jsx', 'html', 'css', 'rs', 'go'].includes(ext)) return 'code';
    if (['docx', 'doc', 'pdf', 'txt', 'md', 'rtf'].includes(ext)) return 'document';
    if (['stl', 'obj', 'glb', 'gltf', 'step', 'stp', '3mf'].includes(ext)) return '3d';
    if (['kicad_pcb', 'kicad_sch', 'brd', 'sch', 'gerber'].includes(ext)) return 'pcb';
    return 'other';
  };

  const processFiles = (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList);
    if (filesArray.length === 0) return;

    filesArray.forEach((file) => {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'dat';
      const category = categorizeFile(ext);
      const stagedId = `staged-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      const staged: StagedFile = {
        id: stagedId,
        nativeFile: file,
        name: file.name,
        size: file.size,
        extension: ext,
        category,
        status: 'processing',
      };

      setStagedFiles((prev) => [...prev, staged]);

      // Read using browser File API
      const reader = new FileReader();

      if (category === 'photo' || category === 'video') {
        // Media files: read as Data URL for inline video/image rendering
        reader.onload = (evt) => {
          const dataUrl = evt.target?.result as string;
          updateStagedAndAttach(stagedId, file, ext, category, `Media container for ${file.name}`, dataUrl);
        };
        reader.readAsDataURL(file);
      } else {
        // Source code (C++, Python) and text documents: read as Text
        reader.onload = (evt) => {
          const text = (evt.target?.result as string) || '';
          updateStagedAndAttach(stagedId, file, ext, category, text);
        };
        reader.onerror = () => {
          // Fallback if binary file
          updateStagedAndAttach(stagedId, file, ext, category, `Binary data for ${file.name} (${file.size} bytes)`);
        };
        reader.readAsText(file);
      }
    });
  };

  const updateStagedAndAttach = (
    stagedId: string,
    file: File,
    ext: string,
    category: FileFolderItem['fileCategory'],
    content: string,
    mediaUrl?: string
  ) => {
    const newItem: FileFolderItem = {
      id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: file.name,
      path: targetFolder,
      size: file.size,
      extension: ext,
      updatedAt: new Date().toISOString().split('T')[0],
      tags: [ext, category || 'file', targetFolder.split('/')[0].toLowerCase()],
      content,
      mediaUrl,
      fileCategory: category,
    };

    onFileAttached(newItem);

    setStagedFiles((prev) =>
      prev.map((s) => (s.id === stagedId ? { ...s, status: 'done', mediaUrl, content } : s))
    );

    setFeedbackMsg(`Attached ${file.name} to /${targetFolder}`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    // Reset input so same file can be re-selected if desired
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeStaged = (id: string) => {
    setStagedFiles((prev) => prev.filter((s) => s.id !== id));
  };

  const getCategoryIcon = (category: FileFolderItem['fileCategory']) => {
    switch (category) {
      case 'video':
        return <Video className="w-4 h-4 text-rose-400" />;
      case 'photo':
        return <ImageIcon className="w-4 h-4 text-purple-400" />;
      case 'code':
        return <FileCode className="w-4 h-4 text-cyan-400" />;
      case 'document':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case '3d':
        return <Box className="w-4 h-4 text-amber-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Target Folder Selector Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-white/[0.03] border border-white/8">
        <div className="flex items-center gap-2">
          <Folder className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-300">Target Folder:</span>
          <select
            value={targetFolder}
            onChange={(e) => setTargetFolder(e.target.value)}
            className="px-2.5 py-1 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
          >
            {availableFolders.map((f) => (
              <option key={f.name} value={f.name}>
                /{f.name}
              </option>
            ))}
          </select>
        </div>

        {feedbackMsg && (
          <span className="text-[11px] font-mono text-emerald-300 flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {feedbackMsg}
          </span>
        )}
      </div>

      {/* Reusable Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center text-center border-2 border-dashed ${
          isDragOver
            ? 'border-cyan-400 bg-cyan-950/30 scale-[0.99] shadow-xl shadow-cyan-500/20'
            : 'border-white/15 bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan-500/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="video/*,image/*,.cpp,.c,.h,.hpp,.py,.js,.ts,.docx,.doc,.pdf,.stl,.obj,.kicad_pcb"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-105 transition">
          <Upload className={`w-6 h-6 ${isDragOver ? 'text-cyan-300 animate-bounce' : 'text-cyan-400'}`} />
        </div>

        <h4 className="text-sm font-bold text-white mb-1">
          {isDragOver ? 'Drop files here to attach!' : 'Drop media or source code files here'}
        </h4>

        <p className="text-xs text-slate-400 max-w-md">
          Drag & drop or <span className="text-cyan-400 font-semibold underline underline-offset-2">browse</span> from your computer. Attach media (<span className="text-rose-300 font-mono">.mp4</span>, <span className="text-purple-300 font-mono">.png</span>) or source code (<span className="text-amber-300 font-mono">.py</span>, <span className="text-cyan-300 font-mono">.cpp</span>) to <span className="text-white font-mono font-semibold">/{targetFolder}</span>.
        </p>

        {/* Supported Format Pills */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-3 pt-3 border-t border-white/6 text-[10px] font-mono text-slate-400">
          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">Videos (.mp4, .webm)</span>
          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">Images (.png, .jpg)</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">Python (.py)</span>
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">C++ (.cpp, .h)</span>
          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">Word (.docx)</span>
        </div>
      </div>

      {/* Staged / Attached Files Tray */}
      {stagedFiles.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Attached in this session ({stagedFiles.length})
            </span>
            <button
              onClick={() => setStagedFiles([])}
              className="text-[10px] text-slate-500 hover:text-white cursor-pointer"
            >
              Clear Tray
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {stagedFiles.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-white/[0.04] border border-white/8 flex items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="p-1 rounded bg-black/40 shrink-0">
                    {getCategoryIcon(item.category)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate max-w-[150px]">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {(item.size / 1024).toFixed(1)} KB · <span className="text-cyan-300 uppercase">{item.extension}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Attached to folder" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStaged(item.id);
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
