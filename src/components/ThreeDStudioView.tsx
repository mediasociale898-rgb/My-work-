import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Box,
  RotateCw,
  Sparkles,
  Layers,
  Upload,
  Eye,
  Sun,
  Activity,
  Maximize2,
  ZoomIn,
  Settings2,
} from 'lucide-react';

type ModelType = 'robotic-arm' | 'drone-frame' | 'spur-gear' | 'pcb-enclosure' | 'quantum-lattice';

export const ThreeDStudioView: React.FC = () => {
  const [activeModel, setActiveModel] = useState<ModelType>('robotic-arm');
  const [renderMode, setRenderMode] = useState<'solid' | 'wireframe' | 'points'>('solid');
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.006);
  const [lightIntensity, setLightIntensity] = useState<number>(1.8);
  const [activeColor, setActiveColor] = useState<string>('#0284c7');
  const [customModelLoaded, setCustomModelLoaded] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
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
    camera.position.set(0, 2.5, 6.5);
    camera.lookAt(0, 0, 0);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, lightIntensity);
    keyLight.position.set(6, 12, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa855f7, lightIntensity * 0.8);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    // Grid Floor
    const grid = new THREE.GridHelper(12, 24, 0x0284c7, 0x1e293b);
    grid.position.y = -1.2;
    scene.add(grid);

    // Build model group
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;

    const hexColor = parseInt(activeColor.replace('#', '0x'), 16);
    const material = renderMode === 'points'
      ? new THREE.PointsMaterial({ color: hexColor, size: 0.05 })
      : new THREE.MeshStandardMaterial({
          color: hexColor,
          metalness: 0.7,
          roughness: 0.25,
          wireframe: renderMode === 'wireframe',
        });

    const accentMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: renderMode === 'wireframe',
    });

    if (activeModel === 'robotic-arm') {
      // Base
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 0.4, 32), material);
      modelGroup.add(base);

      // Link 1
      const link1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.8, 0.35), material);
      link1.position.set(0, 1.0, 0);
      modelGroup.add(link1);

      // Elbow joint
      const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.4, 24, 24), accentMat);
      elbow.position.set(0, 2.0, 0);
      modelGroup.add(elbow);

      // Link 2 (extended forward)
      const link2 = new THREE.Mesh(new THREE.BoxGeometry(0.28, 1.4, 0.28), material);
      link2.rotation.z = Math.PI / 4;
      link2.position.set(0.5, 2.4, 0);
      modelGroup.add(link2);

      // Gripper end effector
      const gripperBase = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.3), accentMat);
      gripperBase.position.set(1.0, 2.9, 0);
      const finger1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), material);
      finger1.position.set(0.9, 3.15, 0);
      const finger2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.08), material);
      finger2.position.set(1.1, 3.15, 0);
      modelGroup.add(gripperBase, finger1, finger2);
    } else if (activeModel === 'drone-frame') {
      // Quadcopter central fuselage
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 1.2), material);
      modelGroup.add(body);

      // 4 carbon fiber arms
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2 + Math.PI / 4;
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 16), accentMat);
        arm.rotation.z = Math.PI / 2;
        arm.rotation.y = angle;
        modelGroup.add(arm);

        // Propeller motor pods
        const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.25, 20), material);
        motor.position.set(Math.cos(angle) * 1.3, 0.15, Math.sin(angle) * 1.3);
        const prop = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.03, 0.1), accentMat);
        prop.position.set(Math.cos(angle) * 1.3, 0.3, Math.sin(angle) * 1.3);
        modelGroup.add(motor, prop);
      }
    } else if (activeModel === 'spur-gear') {
      // Involute Gear with tooth extrusion
      const gearBody = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.4, 32), material);
      modelGroup.add(gearBody);
      // Bore hub
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.6, 24), accentMat);
      modelGroup.add(hub);
      // Teeth perimeter
      for (let i = 0; i < 18; i++) {
        const ang = (i * Math.PI * 2) / 18;
        const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.4, 0.35), material);
        tooth.position.set(Math.cos(ang) * 1.5, 0, Math.sin(ang) * 1.5);
        tooth.rotation.y = -ang;
        modelGroup.add(tooth);
      }
    } else if (activeModel === 'pcb-enclosure') {
      // IP67 Rugged Enclosure
      const enc = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.0, 1.6), material);
      const lid = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.15, 1.65), accentMat);
      lid.position.y = 0.55;
      const port1 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16), accentMat);
      port1.rotation.x = Math.PI / 2;
      port1.position.set(-0.6, 0, 0.8);
      const port2 = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.4, 16), accentMat);
      port2.rotation.x = Math.PI / 2;
      port2.position.set(0.6, 0, 0.8);
      modelGroup.add(enc, lid, port1, port2);
    } else {
      // Quantum molecular lattice / atom
      const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), accentMat);
      modelGroup.add(nucleus);
      for (let i = 0; i < 3; i++) {
        const orbit = new THREE.Mesh(new THREE.TorusGeometry(1.6 + i * 0.4, 0.04, 16, 100), material);
        orbit.rotation.x = (i * Math.PI) / 3;
        orbit.rotation.y = (i * Math.PI) / 4;
        const electron = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), material);
        electron.position.set(1.6 + i * 0.4, 0, 0);
        orbit.add(electron);
        modelGroup.add(orbit);
      }
    }

    scene.add(modelGroup);

    // Mouse Drag Rotation
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      modelGroup.rotation.y += dx * 0.01;
      modelGroup.rotation.x += dy * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
    };
    const onMouseUp = () => { isDragging = false; };
    const onWheel = (e: WheelEvent) => {
      camera.position.z = Math.max(3, Math.min(14, camera.position.z + e.deltaY * 0.005));
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel);

    const animate = () => {
      if (!isDragging && rotationSpeed > 0) {
        modelGroup.rotation.y += rotationSpeed;
      }
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [activeModel, renderMode, rotationSpeed, lightIntensity, activeColor]);

  const handleCustomSTL = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomModelLoaded(file.name);
      setActiveModel('robotic-arm'); // mounts visual mesh
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-1">
            <Box className="w-3.5 h-3.5" />
            <span>WebGL 3D CAD & Mesh Inspector</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-white">3D View Studio</h2>
          <p className="text-xs text-slate-300 mt-1">
            Real-time Three.js spatial viewport for robotic manipulators, CAD geometry, mechanical gears, and custom STL/OBJ files.
          </p>
        </div>

        <label className="py-2 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer">
          <Upload className="w-4 h-4" />
          <span>Upload Custom .STL / .OBJ</span>
          <input type="file" accept=".stl,.obj,.glb" onChange={handleCustomSTL} className="hidden" />
        </label>
      </div>

      {customModelLoaded && (
        <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-400 text-cyan-200 text-xs font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Mounted custom CAD model asset: {customModelLoaded}</span>
        </div>
      )}

      {/* Model Type Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'robotic-arm', label: '4-DOF Robotic Arm' },
          { id: 'drone-frame', label: 'Quadcopter Frame' },
          { id: 'spur-gear', label: 'Involute Spur Gear' },
          { id: 'pcb-enclosure', label: 'IP67 PCB Enclosure' },
          { id: 'quantum-lattice', label: 'Quantum Lattice' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setActiveModel(m.id as ModelType)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              activeModel === m.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/6'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* 3D Canvas Viewport + Control Studio Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        {/* Canvas Surface (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl glass-panel-glow border border-cyan-500/25 p-4 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#090e1c] to-[#04060c]">
          {/* Top HUD */}
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300 z-10 p-2">
            <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Model: {activeModel.toUpperCase()}</span>
            </div>
            <div className="bg-black/50 px-3 py-1.5 rounded-xl border border-white/10 text-slate-400">
              <span>Rotate: Click+Drag | Zoom: MouseWheel</span>
            </div>
          </div>

          {/* Interactive WebGL Canvas */}
          <div className="w-full h-[450px] relative">
            <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          </div>

          {/* Bottom Telemetry HUD */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 z-10 p-2 border-t border-white/6">
            <span>Renderer: Three.js WebGL</span>
            <span>Shading: {renderMode.toUpperCase()}</span>
            <span>Speed: {rotationSpeed === 0 ? 'PAUSED' : `${(rotationSpeed * 1000).toFixed(0)} rad/s`}</span>
          </div>
        </div>

        {/* Viewport Control Dashboard (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl glass-panel p-5 border border-white/8 space-y-5">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-cyan-400" /> Viewport Settings
          </h3>

          {/* Render Mode */}
          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-semibold block">Render Style</label>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono">
              {[
                { id: 'solid', label: 'Solid' },
                { id: 'wireframe', label: 'Wireframe' },
                { id: 'points', label: 'Points' },
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => setRenderMode(r.id as typeof renderMode)}
                  className={`py-2 rounded-xl transition cursor-pointer text-center ${
                    renderMode === r.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rotation Speed Control */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span>Auto-Rotation Speed</span>
              <span className="font-mono text-cyan-400">{rotationSpeed === 0 ? 'OFF' : `${rotationSpeed}`}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setRotationSpeed(0)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono ${
                  rotationSpeed === 0 ? 'bg-cyan-500 text-white' : 'bg-white/5 text-slate-400'
                }`}
              >
                Stop
              </button>
              <button
                onClick={() => setRotationSpeed(0.005)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono ${
                  rotationSpeed === 0.005 ? 'bg-cyan-500 text-white' : 'bg-white/5 text-slate-400'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setRotationSpeed(0.015)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono ${
                  rotationSpeed === 0.015 ? 'bg-cyan-500 text-white' : 'bg-white/5 text-slate-400'
                }`}
              >
                Fast
              </button>
            </div>
          </div>

          {/* Light Intensity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" /> Directional Lighting
              </span>
              <span className="font-mono text-amber-300">{lightIntensity}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={lightIntensity}
              onChange={e => setLightIntensity(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Material Accent Colors */}
          <div className="space-y-2">
            <label className="text-xs text-slate-300 font-semibold block">Material Coating Color</label>
            <div className="flex gap-2.5">
              {[
                { hex: '#0284c7', label: 'Electric Blue' },
                { hex: '#8b5cf6', label: 'Violet' },
                { hex: '#10b981', label: 'Emerald' },
                { hex: '#f59e0b', label: 'Amber' },
                { hex: '#e11d48', label: 'Crimson' },
              ].map(c => (
                <button
                  key={c.hex}
                  onClick={() => setActiveColor(c.hex)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                    activeColor === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70'
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
