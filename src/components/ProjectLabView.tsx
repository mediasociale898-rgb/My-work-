import React, { useState, useEffect, useRef } from 'react';
import {
  Boxes,
  Plus,
  Box,
  Cpu,
  FileCode,
  Tag,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  RotateCw,
  Eye,
  CheckCircle2,
  Trash2,
  Upload,
  TrendingUp,
} from 'lucide-react';
import * as THREE from 'three';
import { ResponsiveContainer, AreaChart, Area, Tooltip } from 'recharts';
import { ProjectItem, ProjectStatus, ProjectCategory, ProjectAttachedFile } from '../types';

interface ProjectLabViewProps {
  projects: ProjectItem[];
  onSaveProject: (project: ProjectItem) => void;
  onDeleteProject: (projectId: string) => void;
}

export const ProjectLabView: React.FC<ProjectLabViewProps> = ({
  projects,
  onSaveProject,
  onDeleteProject,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedProject, setSelectedProject] = useState<ProjectItem>(projects[0]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerMode, setViewerMode] = useState<'3D' | 'PCB'>('3D');
  const [isWireframe, setIsWireframe] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNextAction, setNewNextAction] = useState('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | null>(null);

  const statuses: (ProjectStatus | 'ALL')[] = [
    'ALL',
    'IDEA',
    'PLANNING',
    'BUILDING',
    'TESTING',
    'REVISION',
    'COMPLETED',
    'ARCHIVED',
  ];

  const filteredProjects = projects.filter(p => {
    return selectedStatus === 'ALL' || p.status === selectedStatus;
  });

  const getProjectSparklineData = (proj: ProjectItem) => {
    if (proj.progressHistory && proj.progressHistory.length > 0) {
      return proj.progressHistory;
    }
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const current = proj.progressPercent;
    const start = Math.max(0, current - 25);
    return days.map((day, i) => {
      const fraction = i / 6;
      const progress = Math.round(start + (current - start) * Math.pow(fraction, 1.2));
      return { day, progress };
    });
  };

  // Three.js interactive 3D model simulation for .stl / 3D projects
  useEffect(() => {
    if (!isViewerOpen || viewerMode !== '3D' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.0);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);
    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 1.5);
    dirLight2.position.set(-5, -5, -2);
    scene.add(dirLight2);

    // Group for 3D Robotic Manipulator Model
    const modelGroup = new THREE.Group();

    // Base bracket
    const baseGeo = new THREE.CylinderGeometry(0.8, 0.9, 0.3, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: isWireframe,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    modelGroup.add(baseMesh);

    // Joint 1 Arm Segment
    const armGeo = new THREE.BoxGeometry(0.3, 1.6, 0.3);
    const armMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.7,
      roughness: 0.3,
      wireframe: isWireframe,
    });
    const armMesh = new THREE.Mesh(armGeo, armMat);
    armMesh.position.set(0, 0.9, 0);
    modelGroup.add(armMesh);

    // Wrist Actuator
    const wristGeo = new THREE.SphereGeometry(0.35, 24, 24);
    const wristMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: isWireframe,
    });
    const wristMesh = new THREE.Mesh(wristGeo, wristMat);
    wristMesh.position.set(0, 1.8, 0);
    modelGroup.add(wristMesh);

    // End Effector Gripper fingers
    const fingerGeo = new THREE.BoxGeometry(0.08, 0.5, 0.15);
    const finger1 = new THREE.Mesh(fingerGeo, baseMat);
    finger1.position.set(0.15, 2.2, 0);
    const finger2 = new THREE.Mesh(fingerGeo, baseMat);
    finger2.position.set(-0.15, 2.2, 0);
    modelGroup.add(finger1, finger2);

    scene.add(modelGroup);

    // Subtle grid plane
    const grid = new THREE.GridHelper(10, 20, 0x38bdf8, 0x1e293b);
    grid.position.y = -0.15;
    scene.add(grid);

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      modelGroup.rotation.y += deltaX * 0.01;
      modelGroup.rotation.x += deltaY * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const animate = () => {
      if (!isDragging) {
        modelGroup.rotation.y += 0.006;
      }
      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [isViewerOpen, viewerMode, isWireframe]);

  const handleAddProjectNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedProject) return;

    const updated: ProjectItem = {
      ...selectedProject,
      notesHistory: [
        { date: new Date().toISOString().split('T')[0], text: newNoteText.trim() },
        ...selectedProject.notesHistory,
      ],
      lastModified: new Date().toISOString(),
    };
    onSaveProject(updated);
    setSelectedProject(updated);
    setNewNoteText('');
  };

  const handleUpdateNextAction = () => {
    if (!newNextAction.trim() || !selectedProject) return;
    const updated: ProjectItem = {
      ...selectedProject,
      nextAction: newNextAction.trim(),
      lastModified: new Date().toISOString(),
    };
    onSaveProject(updated);
    setSelectedProject(updated);
    setNewNextAction('');
  };

  const handleStatusChange = (newStatus: ProjectStatus) => {
    if (!selectedProject) return;
    const updated: ProjectItem = {
      ...selectedProject,
      status: newStatus,
      lastModified: new Date().toISOString(),
    };
    onSaveProject(updated);
    setSelectedProject(updated);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-semibold mb-1">
            <Boxes className="w-3.5 h-3.5" />
            <span>Unfinished Work Management</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-white">Project Lab</h2>
          <p className="text-xs text-slate-300 mt-1">
            Preserve unfinished prototypes, websites, 3D CAD (.stl/.obj), and PCB designs (.kicad_pcb).
          </p>
        </div>

        <button
          onClick={() => {
            const newProj: ProjectItem = {
              id: `proj-${Date.now()}`,
              name: 'New Engineering Prototype',
              category: 'Robotics',
              status: 'BUILDING',
              description: 'Unfinished project prototype.',
              objective: 'Define target milestone and execution roadmap.',
              nextAction: 'Create initial CAD model or schematic.',
              progressPercent: 20,
              lastModified: new Date().toISOString(),
              attachedFiles: [],
              notesHistory: [{ date: new Date().toISOString().split('T')[0], text: 'Project created.' }],
            };
            onSaveProject(newProj);
            setSelectedProject(newProj);
          }}
          className="py-2 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {statuses.map(st => {
          const isActive = selectedStatus === st;
          return (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition cursor-pointer ${
                isActive
                  ? 'bg-blue-500/20 text-blue-200 border border-blue-500/40 shadow-sm'
                  : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/6 border border-white/6'
              }`}
            >
              {st}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Projects List + Inspector / Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Projects Catalog (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredProjects.map(proj => {
            const isSelected = selectedProject?.id === proj.id;
            return (
              <div
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className={`p-4 rounded-2xl border transition cursor-pointer space-y-3 ${
                  isSelected
                    ? 'bg-blue-500/15 border-blue-500/40 shadow-lg shadow-blue-500/10'
                    : 'glass-panel hover:bg-white/[0.05] border-white/8'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-cyan-300 font-bold">
                    {proj.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      proj.status === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : proj.status === 'BUILDING'
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {proj.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">{proj.name}</h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{proj.description}</p>
                </div>

                {/* Milestone Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Milestone Progress</span>
                    <span className="text-cyan-300 font-bold">{proj.progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      style={{ width: `${proj.progressPercent}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                    />
                  </div>
                </div>

                {/* 7-Day Sparkline Chart via Recharts */}
                <div className="pt-1 space-y-1">
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-2.5 h-2.5 text-cyan-400" />
                      <span>7-Day Velocity Sparkline</span>
                    </span>
                    <span className="text-cyan-300 font-semibold">{proj.progressPercent}% now</span>
                  </div>
                  <div className="h-10 w-full rounded-xl bg-black/30 p-1 border border-white/5 overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={getProjectSparklineData(proj)}>
                        <defs>
                          <linearGradient id={`spark-${proj.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor={proj.status === 'COMPLETED' ? '#10b981' : '#06b6d4'}
                              stopOpacity={0.45}
                            />
                            <stop
                              offset="95%"
                              stopColor={proj.status === 'COMPLETED' ? '#059669' : '#3b82f6'}
                              stopOpacity={0.0}
                            />
                          </linearGradient>
                        </defs>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const d = payload[0].payload as { day: string; progress: number };
                              return (
                                <div className="rounded-lg bg-slate-900 border border-white/10 px-2 py-0.5 text-[9px] font-mono shadow-xl text-white">
                                  <span className="text-cyan-300">{d.day}:</span> {d.progress}%
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="progress"
                          stroke={proj.status === 'COMPLETED' ? '#10b981' : '#22d3ee'}
                          strokeWidth={2}
                          fillOpacity={1}
                          fill={`url(#spark-${proj.id})`}
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-[10px]">
                    {proj.attachedFiles.length} files attached
                  </span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-1">
                    Details <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Project Dossier & 3D/PCB Viewer (7 cols) */}
        {selectedProject && (
          <div className="lg:col-span-7 rounded-2xl glass-panel p-6 border border-white/8 space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Header & Status selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/6 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{selectedProject.name}</h3>
                    <span className="text-xs font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10">
                      {selectedProject.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Last modified: {new Date(selectedProject.lastModified).toLocaleDateString()}
                  </p>
                </div>

                {/* Status dropdown */}
                <select
                  value={selectedProject.status}
                  onChange={e => handleStatusChange(e.target.value as ProjectStatus)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono text-xs focus:outline-none"
                >
                  {statuses.filter(s => s !== 'ALL').map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* Objective & Description */}
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/6 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                    Objective & Milestone
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedProject.objective}
                  </p>
                </div>

                {/* Next Action Box */}
                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Next Immediate Action
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-white">
                    {selectedProject.nextAction || 'No immediate action set.'}
                  </p>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Update next action..."
                      value={newNextAction}
                      onChange={e => setNewNextAction(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      onClick={handleUpdateNextAction}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs cursor-pointer"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>

              {/* Attached Files & 3D/PCB Viewer Trigger */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    Attached Engineering Files ({selectedProject.attachedFiles.length})
                  </span>
                  <button
                    onClick={() => setIsViewerOpen(!isViewerOpen)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {isViewerOpen ? 'Close Viewer' : 'Open 3D / PCB Viewer'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedProject.attachedFiles.map(file => (
                    <div
                      key={file.id}
                      onClick={() => {
                        setIsViewerOpen(true);
                        setViewerMode(file.type === 'kicad_pcb' ? 'PCB' : '3D');
                      }}
                      className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/6 hover:border-cyan-500/30 transition cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {file.type === 'kicad_pcb' ? (
                          <Cpu className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Box className="w-4 h-4 text-cyan-400" />
                        )}
                        <span className="text-xs text-slate-200 truncate">{file.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-300 px-1.5 py-0.5 rounded bg-cyan-500/10 uppercase">
                        {file.type}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Interactive 3D / PCB Modal Viewer */}
                {isViewerOpen && (
                  <div className="p-4 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyan-300">
                          {viewerMode === '3D' ? 'WebGL 3D CAD Mesh View' : 'KiCad PCB Multi-Layer Viewer'}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setViewerMode('3D')}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                              viewerMode === '3D' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-slate-400'
                            }`}
                          >
                            3D Model
                          </button>
                          <button
                            onClick={() => setViewerMode('PCB')}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                              viewerMode === 'PCB' ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400'
                            }`}
                          >
                            PCB Layers
                          </button>
                        </div>
                      </div>

                      {viewerMode === '3D' && (
                        <button
                          onClick={() => setIsWireframe(!isWireframe)}
                          className={`px-2 py-1 rounded text-[10px] font-mono transition ${
                            isWireframe ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Wireframe: {isWireframe ? 'ON' : 'OFF'}
                        </button>
                      )}
                    </div>

                    {viewerMode === '3D' ? (
                      <div className="relative h-64 rounded-xl overflow-hidden bg-gradient-to-b from-[#0a0f1d] to-[#04060a] border border-white/10">
                        <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
                        <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-1 rounded">
                          Drag mouse to rotate 3D geometry
                        </div>
                      </div>
                    ) : (
                      /* Interactive PCB schematic & trace layer visualizer */
                      <div className="relative h-64 rounded-xl overflow-hidden bg-[#06150e] border border-emerald-500/30 p-4 font-mono flex flex-col justify-between">
                        <div className="flex justify-between items-center text-[10px] text-emerald-400 border-b border-emerald-500/20 pb-1">
                          <span>Layer: F.Cu (Top Copper) + Edge.Cuts</span>
                          <span>Grid: 0.5mm</span>
                        </div>
                        {/* Render simulated high-speed differential pairs & SMD pads */}
                        <svg className="w-full h-44" viewBox="0 0 300 150">
                          {/* Board outline */}
                          <rect x="10" y="10" width="280" height="130" rx="8" fill="#042014" stroke="#10b981" strokeWidth="2" />
                          {/* Ground plane copper pour grid */}
                          <path d="M 20 20 L 280 20 M 20 50 L 280 50 M 20 80 L 280 80 M 20 110 L 280 110" stroke="#064e3b" strokeWidth="0.5" strokeDasharray="3 3" />
                          {/* IC QFN Package */}
                          <rect x="110" y="45" width="40" height="40" fill="#022c22" stroke="#34d399" strokeWidth="1.5" />
                          {/* IC Pins */}
                          <rect x="105" y="50" width="5" height="4" fill="#fbbf24" />
                          <rect x="105" y="60" width="5" height="4" fill="#fbbf24" />
                          <rect x="105" y="70" width="5" height="4" fill="#fbbf24" />
                          <rect x="150" y="50" width="5" height="4" fill="#fbbf24" />
                          <rect x="150" y="60" width="5" height="4" fill="#fbbf24" />
                          <rect x="150" y="70" width="5" height="4" fill="#fbbf24" />
                          {/* Differential Traces with 90-ohm controlled impedance */}
                          <path d="M 155 52 L 210 52 L 240 75 L 270 75" fill="none" stroke="#38bdf8" strokeWidth="2" />
                          <path d="M 155 62 L 208 62 L 238 85 L 270 85" fill="none" stroke="#38bdf8" strokeWidth="2" />
                          {/* Ground Vias */}
                          <circle cx="215" cy="45" r="3" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.5" />
                          <circle cx="245" cy="68" r="3" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.5" />
                          <text x="25" y="32" fill="#6ee7b7" fontSize="8" fontFamily="monospace">MOTOR_DRIVER_FOC_REV2</text>
                        </svg>
                        <div className="text-[10px] text-emerald-300">
                          Differential pairs matched length skew: 0.12mm (Pass)
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Progress History & Log Timeline */}
              <div className="space-y-3 pt-2 border-t border-white/6">
                <span className="text-xs font-bold text-white block">Progress History Log</span>
                <form onSubmit={handleAddProjectNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Log work entry (e.g. Assembled gearbox and tested current draw)..."
                    value={newNoteText}
                    onChange={e => setNewNoteText(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/8 text-white text-xs placeholder-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-blue-500 text-white font-semibold text-xs cursor-pointer"
                  >
                    Log Entry
                  </button>
                </form>

                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {selectedProject.notesHistory.map((h, i) => (
                    <div key={i} className="text-xs p-2 rounded-lg bg-white/[0.02] border border-white/5 space-y-0.5">
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>{h.date}</span>
                      </div>
                      <p className="text-slate-300">{h.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/6 flex justify-between items-center text-xs">
              <button
                onClick={() => onDeleteProject(selectedProject.id)}
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Project
              </button>
              <span className="text-slate-500 font-mono text-[10px]">
                Project ID: {selectedProject.id}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
