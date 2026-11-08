import React, { useState } from 'react';
import {
  FolderKanban,
  Folder,
  File,
  Upload,
  Download,
  Trash2,
  Tag,
  Search,
  Eye,
  FileCode,
  Box,
  Cpu,
  Video,
  Image as ImageIcon,
  FileText,
  Plus,
  Play,
  X,
  Sparkles,
} from 'lucide-react';
import { FileFolderItem } from '../types';
import { FolderFileUploadZone } from './FolderFileUploadZone';

interface FileManagerViewProps {
  files: FileFolderItem[];
  onAddFile: (file: FileFolderItem) => void;
  onDeleteFile: (fileId: string) => void;
}

export const FileManagerView: React.FC<FileManagerViewProps> = ({
  files,
  onAddFile,
  onDeleteFile,
}) => {
  const [currentPath, setCurrentPath] = useState<string>('Projects/Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileFolderItem | null>(null);
  const [previewModalFile, setPreviewModalFile] = useState<FileFolderItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAttachZone, setShowAttachZone] = useState(false);
  const [createModalTab, setCreateModalTab] = useState<'upload' | 'manual'>('upload');

  // New file creation form
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<'video' | 'photo' | 'python' | 'cpp' | 'word'>('python');
  const [newFileContent, setNewFileContent] = useState('');

  const predefinedFolders = [
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
  ];

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'video' | 'photo' | 'code' | 'document' | 'hardware'>('all');

  const filesInCurrentPath = files.filter(f => {
    const matchesPath = f.path === currentPath;
    const matchesSearch =
      !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const ext = f.extension.toLowerCase();
    const isVid = ['mp4', 'webm', 'mov'].includes(ext) || f.fileCategory === 'video';
    const isPhoto = ['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(ext) || f.fileCategory === 'photo';
    const isCode = ['py', 'cpp', 'c', 'h', 'js', 'ts', 'html', 'css'].includes(ext) || f.fileCategory === 'code';
    const isDoc = ['docx', 'doc', 'pdf', 'txt', 'md'].includes(ext) || f.fileCategory === 'document';
    const isHard = ['stl', 'obj', 'glb', 'kicad_pcb', 'kicad_sch'].includes(ext) || f.fileCategory === '3d' || f.fileCategory === 'pcb';

    let matchesCat = true;
    if (activeCategoryFilter === 'video') matchesCat = isVid;
    else if (activeCategoryFilter === 'photo') matchesCat = isPhoto;
    else if (activeCategoryFilter === 'code') matchesCat = isCode;
    else if (activeCategoryFilter === 'document') matchesCat = isDoc;
    else if (activeCategoryFilter === 'hardware') matchesCat = isHard;

    return matchesPath && matchesSearch && matchesCat;
  });

  const folderVideos = files.filter(f => f.path === currentPath && (['mp4', 'webm', 'mov'].includes(f.extension.toLowerCase()) || f.fileCategory === 'video'));
  const folderPhotos = files.filter(f => f.path === currentPath && (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(f.extension.toLowerCase()) || f.fileCategory === 'photo'));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    const extension = uploaded.name.split('.').pop()?.toLowerCase() || 'bin';
    const isVid = ['mp4', 'webm', 'mov'].includes(extension);
    const isPhoto = ['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(extension);
    const isDoc = ['docx', 'doc', 'pdf', 'txt'].includes(extension);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      const newFile: FileFolderItem = {
        id: `file-${Date.now()}`,
        name: uploaded.name,
        path: currentPath,
        size: uploaded.size,
        extension,
        updatedAt: new Date().toISOString().split('T')[0],
        tags: [extension, currentPath.split('/')[0].toLowerCase()],
        content: `Uploaded ${uploaded.name} (${uploaded.size} bytes)`,
        mediaUrl: isVid || isPhoto ? dataUrl : undefined,
        fileCategory: isVid ? 'video' : isPhoto ? 'photo' : isDoc ? 'document' : 'other',
      };
      onAddFile(newFile);
    };

    if (isVid || isPhoto) {
      reader.readAsDataURL(uploaded);
    } else {
      reader.readAsText(uploaded);
    }
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    let ext = 'py';
    let cat: FileFolderItem['fileCategory'] = 'code';
    let defaultContent = newFileContent;

    if (newFileType === 'python') {
      ext = 'py';
      cat = 'code';
      if (!defaultContent) defaultContent = `# Python 3 script in /${currentPath}\nprint("Executed in OS")`;
    } else if (newFileType === 'cpp') {
      ext = 'cpp';
      cat = 'code';
      if (!defaultContent) defaultContent = `// C++ routine in /${currentPath}\n#include <iostream>\nint main() { std::cout << "OK"; return 0; }`;
    } else if (newFileType === 'word') {
      ext = 'docx';
      cat = 'document';
      if (!defaultContent) defaultContent = `Executive Word Document Summary for /${currentPath}\nAuthor: Engineer\nProject Status: Validated.`;
    } else if (newFileType === 'video') {
      ext = 'mp4';
      cat = 'video';
      defaultContent = 'Video Asset metadata container';
    } else if (newFileType === 'photo') {
      ext = 'png';
      cat = 'photo';
      defaultContent = 'Photo / Schematic capture';
    }

    const fullName = newFileName.includes('.') ? newFileName : `${newFileName}.${ext}`;

    const newFile: FileFolderItem = {
      id: `file-${Date.now()}`,
      name: fullName,
      path: currentPath,
      size: 1024 * (cat === 'video' ? 12400 : 45),
      extension: ext,
      updatedAt: new Date().toISOString().split('T')[0],
      tags: [ext, cat || 'asset'],
      content: defaultContent,
      fileCategory: cat,
      mediaUrl: newFileType === 'photo' ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80' : undefined,
    };

    onAddFile(newFile);
    setNewFileName('');
    setNewFileContent('');
    setShowCreateModal(false);
  };

  const getFileIcon = (file: FileFolderItem) => {
    const ext = file.extension.toLowerCase();
    if (['mp4', 'webm', 'mov'].includes(ext) || file.fileCategory === 'video') {
      return <Video className="w-5 h-5 text-rose-400" />;
    }
    if (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(ext) || file.fileCategory === 'photo') {
      return <ImageIcon className="w-5 h-5 text-purple-400" />;
    }
    if (['docx', 'doc'].includes(ext)) {
      return <FileText className="w-5 h-5 text-blue-400" />;
    }
    if (['py'].includes(ext)) {
      return <FileCode className="w-5 h-5 text-amber-400" />;
    }
    if (['cpp', 'h', 'c'].includes(ext)) {
      return <FileCode className="w-5 h-5 text-cyan-400" />;
    }
    if (['stl', 'obj', 'glb'].includes(ext)) {
      return <Box className="w-5 h-5 text-cyan-300" />;
    }
    if (['kicad_pcb', 'kicad_sch'].includes(ext)) {
      return <Cpu className="w-5 h-5 text-emerald-400" />;
    }
    return <File className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-1">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Structured Multi-Asset Vault</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-white">Local File Manager</h2>
          <p className="text-xs text-slate-300 mt-1">
            Store and preview Videos (.mp4), Photos (.png), Python scripts (.py), C++ code (.cpp), Word docs (.docx), 3D STL, and PCB designs in each folder.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAttachZone(!showAttachZone)}
            className={`py-2 px-3.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 cursor-pointer border transition ${
              showAttachZone
                ? 'bg-cyan-500/25 border-cyan-400 text-cyan-200 shadow-sm'
                : 'bg-white/8 hover:bg-white/12 text-slate-200 border-white/8'
            }`}
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>{showAttachZone ? 'Hide Attach Zone' : 'Attach Media & Code'}</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create New Asset
          </button>
        </div>
      </div>

      {/* Reusable File-Upload Component Drawer / Section */}
      {showAttachZone && (
        <div className="p-5 rounded-3xl glass-panel-glow border border-cyan-500/30">
          <div className="flex items-center justify-between mb-3 border-b border-white/6 pb-2.5">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Attach Media & Source Code Files (Browser File API)
              </span>
            </div>
            <button
              onClick={() => setShowAttachZone(false)}
              className="text-slate-400 hover:text-white text-xs font-mono"
            >
              Close [✕]
            </button>
          </div>
          <FolderFileUploadZone
            currentPath={currentPath}
            availableFolders={predefinedFolders}
            onFileAttached={onAddFile}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Folder Hierarchy (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl glass-panel p-4 border border-white/8 space-y-4">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Folder className="w-4 h-4 text-cyan-400" /> System Directory Tree
          </span>

          <div className="space-y-1 max-h-[520px] overflow-y-auto pr-1">
            {predefinedFolders.map(f => {
              const isActive = currentPath === f.name;
              const fileCount = files.filter(item => item.path === f.name).length;
              return (
                <button
                  key={f.name}
                  onClick={() => setCurrentPath(f.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/25 to-blue-600/15 text-cyan-200 border border-cyan-500/35 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Folder className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="truncate">{f.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300">
                    {fileCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Files in selected folder & details (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl glass-panel p-5 border border-white/8 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Folder Header & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/6 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  /{currentPath}
                </span>
                <span className="text-xs text-slate-500">
                  ({filesInCurrentPath.length} assets)
                </span>
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter name, tag, or extension..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/8 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Folder Asset Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white/[0.02] p-1.5 rounded-2xl border border-white/6">
              {[
                { id: 'all', label: 'All Assets', count: files.filter(f => f.path === currentPath).length },
                { id: 'video', label: '🎬 Videos', count: folderVideos.length },
                { id: 'photo', label: '🖼️ Photos', count: folderPhotos.length },
                { id: 'code', label: '💻 Code (.py/.cpp)', count: files.filter(f => f.path === currentPath && (['py', 'cpp', 'c', 'h'].includes(f.extension.toLowerCase()) || f.fileCategory === 'code')).length },
                { id: 'document', label: '📄 Word & Docs', count: files.filter(f => f.path === currentPath && (['docx', 'doc', 'pdf'].includes(f.extension.toLowerCase()) || f.fileCategory === 'document')).length },
                { id: 'hardware', label: '📐 3D & PCB', count: files.filter(f => f.path === currentPath && (['stl', 'obj', 'kicad_pcb'].includes(f.extension.toLowerCase()) || f.fileCategory === '3d' || f.fileCategory === 'pcb')).length },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategoryFilter(cat.id as typeof activeCategoryFilter)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                    activeCategoryFilter === cat.id
                      ? 'bg-gradient-to-r from-cyan-500/25 to-blue-600/20 text-cyan-200 border border-cyan-500/40 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/8 text-slate-300">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* DEDICATED VIDEO & IMAGE ASSET SECTION IN EACH FOLDER */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-white/[0.03] to-cyan-950/15 border border-white/8 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Folder Media & Visual Assets Showcase
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({folderVideos.length} Videos · {folderPhotos.length} Photos)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-semibold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-2.5 py-1 rounded-xl cursor-pointer flex items-center gap-1 transition">
                    <Video className="w-3 h-3" />
                    <span>+ Add Video</span>
                    <input type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <label className="text-[10px] font-semibold text-purple-300 hover:text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 px-2.5 py-1 rounded-xl cursor-pointer flex items-center gap-1 transition">
                    <ImageIcon className="w-3 h-3" />
                    <span>+ Add Photo</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Media Cards Gallery */}
              {folderVideos.length === 0 && folderPhotos.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-white/10 bg-black/20 text-center">
                  <p className="text-xs text-slate-400">
                    No videos or photos saved in <span className="text-cyan-300 font-mono">/{currentPath}</span> yet.
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Click "+ Add Video", "+ Add Photo", or drag & drop files using the Browser File API to attach assets to this folder.
                  </p>
                  <div className="flex justify-center gap-2 mt-3">
                    <button
                      onClick={() => setShowAttachZone(true)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
                    >
                      <Upload className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Open File Attachment Zone</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Video Cards */}
                  {folderVideos.map(vid => (
                    <div
                      key={vid.id}
                      onClick={() => setPreviewModalFile(vid)}
                      className="group relative rounded-xl overflow-hidden border border-rose-500/30 bg-slate-950 p-2.5 flex flex-col justify-between hover:border-rose-400/60 transition cursor-pointer shadow-lg shadow-rose-950/20"
                    >
                      <div className="relative h-24 rounded-lg bg-gradient-to-br from-rose-950/40 to-slate-900 border border-rose-500/20 flex items-center justify-center overflow-hidden">
                        <Video className="w-8 h-8 text-rose-400 group-hover:scale-110 transition duration-200" />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-rose-500/80 text-white flex items-center justify-center shadow-md">
                            <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.2 rounded bg-black/70 text-[9px] font-mono text-white">
                          HD Video · {vid.extension.toUpperCase()}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate max-w-[140px]" title={vid.name}>
                          {vid.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {(vid.size / (1024 * 1024)).toFixed(1)} MB
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Photo Cards */}
                  {folderPhotos.map(photo => (
                    <div
                      key={photo.id}
                      onClick={() => setPreviewModalFile(photo)}
                      className="group relative rounded-xl overflow-hidden border border-purple-500/30 bg-slate-950 p-2.5 flex flex-col justify-between hover:border-purple-400/60 transition cursor-pointer shadow-lg shadow-purple-950/20"
                    >
                      <div className="relative h-24 rounded-lg bg-slate-900 border border-purple-500/20 flex items-center justify-center overflow-hidden">
                        <img
                          src={photo.mediaUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'}
                          alt={photo.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition" />
                        <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.2 rounded bg-black/70 text-[9px] font-mono text-purple-200">
                          {photo.extension.toUpperCase()}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate max-w-[140px]" title={photo.name}>
                          {photo.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {(photo.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Asset Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
              {filesInCurrentPath.length === 0 ? (
                <div className="col-span-2 text-center py-20 text-xs text-slate-500 border border-dashed border-white/10 rounded-2xl">
                  Folder is empty. Click "Create New Asset" or "Upload File" to store Python code, C++, Videos, Photos, or Word docs here.
                </div>
              ) : (
                filesInCurrentPath.map(file => (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFile(file)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                      selectedFile?.id === file.id
                        ? 'bg-cyan-500/15 border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                        : 'bg-white/[0.03] border-white/6 hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-white/5 shrink-0">
                      {getFileIcon(file)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{file.name}</h4>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/5 text-cyan-300">
                          {file.extension}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                        <span>{(file.size / 1024).toFixed(1)} KB</span>
                        <span>·</span>
                        <span>{file.updatedAt}</span>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                        <div className="flex gap-1">
                          {file.tags.map(t => (
                            <span
                              key={t}
                              className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-400"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewModalFile(file);
                          }}
                          className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                        >
                          <Eye className="w-3 h-3" /> Preview
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Selected File Details Bar */}
          {selectedFile && (
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" /> {selectedFile.name}
                </span>
                <p className="text-[11px] text-slate-400 font-mono">
                  Path: {selectedFile.path} · Size: {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewModalFile(selectedFile)}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold cursor-pointer"
                >
                  Open Asset Preview
                </button>
                <button
                  onClick={() => onDeleteFile(selectedFile.id)}
                  className="px-3 py-1.5 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-medium cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create New Asset Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-3xl bg-[#0c1220] border border-cyan-500/30 shadow-2xl p-6 space-y-4 glass-panel max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/6 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Attach or Create Asset in /{currentPath}</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex bg-white/[0.04] p-1 rounded-xl border border-white/8 text-xs font-mono">
              <button
                type="button"
                onClick={() => setCreateModalTab('upload')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer font-semibold flex items-center justify-center gap-1.5 ${
                  createModalTab === 'upload'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Attach Files (Browser File API)</span>
              </button>
              <button
                type="button"
                onClick={() => setCreateModalTab('manual')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer font-semibold flex items-center justify-center gap-1.5 ${
                  createModalTab === 'manual'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Manual File Creator</span>
              </button>
            </div>

            {createModalTab === 'upload' ? (
              <div className="pt-2">
                <FolderFileUploadZone
                  currentPath={currentPath}
                  availableFolders={predefinedFolders}
                  onFileAttached={(f) => {
                    onAddFile(f);
                    setShowCreateModal(false);
                  }}
                />
              </div>
            ) : (
              <form onSubmit={handleCreateAsset} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Asset Type</label>
                  <select
                    value={newFileType}
                    onChange={e => setNewFileType(e.target.value as typeof newFileType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none"
                  >
                    <option value="python">Python Script (.py)</option>
                    <option value="cpp">C++ Source Routine (.cpp)</option>
                    <option value="word">Word Document (.docx)</option>
                    <option value="video">Video Container (.mp4)</option>
                    <option value="photo">Photo / Schematic (.png)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Asset Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. forward_kinematics or motor_spec"
                    value={newFileName}
                    onChange={e => setNewFileName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Initial Content / Code / Document Text</label>
                  <textarea
                    rows={4}
                    value={newFileContent}
                    onChange={e => setNewFileContent(e.target.value)}
                    placeholder="Write code or document summary..."
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/6">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs"
                  >
                    Save to Folder
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Asset Preview Modal (Supports Video, Photo, Code, Word) */}
      {previewModalFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-3xl bg-[#090d16] border border-cyan-500/30 shadow-2xl p-6 space-y-4 glass-panel max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/6 pb-3">
              <div className="flex items-center gap-2">
                {getFileIcon(previewModalFile)}
                <h3 className="text-sm font-bold text-white">{previewModalFile.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-cyan-300">
                  {previewModalFile.path}
                </span>
              </div>
              <button
                onClick={() => setPreviewModalFile(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="rounded-2xl bg-black/50 p-4 border border-white/8 min-h-[240px] flex items-center justify-center">
              {['mp4', 'webm'].includes(previewModalFile.extension.toLowerCase()) || previewModalFile.fileCategory === 'video' ? (
                /* Video Player Preview */
                <div className="w-full space-y-3">
                  {previewModalFile.mediaUrl ? (
                    <video
                      controls
                      autoPlay
                      className="w-full max-h-80 rounded-xl bg-black border border-white/10 shadow-xl"
                      src={previewModalFile.mediaUrl}
                    />
                  ) : (
                    <div className="w-full h-64 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden p-6 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center mb-3">
                        <Video className="w-7 h-7 text-rose-400" />
                      </div>
                      <span className="text-sm font-bold text-white mb-1">
                        {previewModalFile.name}
                      </span>
                      <span className="text-xs font-mono text-cyan-300">
                        1080p · 60 FPS · High Bitrate Encoding · {(previewModalFile.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                      <div className="flex items-center gap-2 mt-4">
                        <button className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-500/25 cursor-pointer">
                          <Play className="w-4 h-4 fill-current" />
                          <span>Stream HD Video</span>
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-t border-white/6 pt-2">
                    <span>Format: {previewModalFile.extension.toUpperCase()} Video Stream</span>
                    <span>Status: Stream Buffer Ready</span>
                  </div>
                </div>
              ) :
 ['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(previewModalFile.extension.toLowerCase()) || previewModalFile.fileCategory === 'photo' ? (
                /* Photo / Image Lightbox */
                <div className="w-full text-center space-y-2">
                  <img
                    src={previewModalFile.mediaUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
                    alt={previewModalFile.name}
                    className="max-h-72 mx-auto rounded-xl border border-white/10 shadow-lg object-contain"
                  />
                  <span className="text-[11px] text-slate-400 font-mono">
                    High-Resolution Capture Preview
                  </span>
                </div>
              ) : ['docx', 'doc'].includes(previewModalFile.extension.toLowerCase()) ? (
                /* Word Document Viewer */
                <div className="w-full p-6 rounded-xl bg-white text-slate-900 font-sans shadow-lg space-y-3">
                  <div className="border-b border-slate-200 pb-2 flex justify-between items-center text-xs text-slate-500 font-mono">
                    <span>Microsoft Word (.docx) Format</span>
                    <span>Confidential</span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900">{previewModalFile.name}</h2>
                  <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                    {previewModalFile.content || 'Word Document text content loaded directly from local storage.'}
                  </div>
                </div>
              ) : (
                /* Code / Text Viewer */
                <div className="w-full">
                  <pre className="text-xs font-mono text-cyan-200 bg-[#060911] p-4 rounded-xl border border-white/8 overflow-x-auto leading-relaxed whitespace-pre-wrap">
                    {previewModalFile.content || `// Content for ${previewModalFile.name}`}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-2 text-xs">
              <span className="text-slate-400 font-mono">
                Size: {(previewModalFile.size / 1024).toFixed(1)} KB
              </span>
              <button
                onClick={() => {
                  const blob = new Blob([previewModalFile.content || ''], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = previewModalFile.name;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
