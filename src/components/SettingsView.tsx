import React, { useState, useEffect } from 'react';
import {
  Settings,
  HardDrive,
  Download,
  Upload,
  Lock,
  Palette,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  User,
} from 'lucide-react';
import { AppSettings } from '../types';
import { storageManager, FullBackupPayload } from '../utils/storage';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  fullPayload: FullBackupPayload;
  onRestoreBackup: (payload: FullBackupPayload) => void;
  onResetToDemo: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  fullPayload,
  onRestoreBackup,
  onResetToDemo,
}) => {
  const [storageEstimate, setStorageEstimate] = useState<{
    usage: number;
    quota: number;
    percent: number;
  }>({ usage: 0, quota: 1, percent: 0 });

  const [password, setPassword] = useState('');
  const [importPassword, setImportPassword] = useState('');
  const [useEncryption, setUseEncryption] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    storageManager.getStorageEstimate().then(setStorageEstimate);
  }, []);

  const handleExportJSON = async () => {
    try {
      setIsExporting(true);
      const serialized = await storageManager.exportBackup(
        fullPayload,
        useEncryption && password ? password : undefined
      );

      const blob = new Blob([serialized], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-work-os-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMessage('Full IndexedDB backup successfully exported!');
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: unknown) {
      setStatusMessage(`Export failed: ${(err as Error).message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const content = evt.target?.result as string;
          const restored = await storageManager.importBackup(content, importPassword || undefined);
          onRestoreBackup(restored);
          setStatusMessage('System restored successfully from backup!');
          setTimeout(() => setStatusMessage(null), 4000);
        } catch (err: unknown) {
          setStatusMessage(`Import failed: ${(err as Error).message}`);
        }
      };
      reader.readAsText(file);
    } catch (err: unknown) {
      setStatusMessage(`Read error: ${(err as Error).message}`);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Status toast */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-cyan-950/90 border border-cyan-400 text-cyan-200 text-xs font-semibold shadow-2xl flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-1">
          <Settings className="w-3.5 h-3.5" />
          <span>Local Storage & System Preferences</span>
        </div>
        <h2 className="text-xl lg:text-2xl font-extrabold text-white">System Settings</h2>
        <p className="text-xs text-slate-300 mt-1">
          Local-first architecture. All records are stored directly in your browser's IndexedDB.
        </p>
      </div>

      <div className="space-y-6">
        {/* User Identity & Profile Name */}
        <div className="rounded-2xl glass-panel p-5 border border-white/8 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-cyan-400" /> Personal Identity
          </h3>
          <div className="max-w-md">
            <label className="block text-xs text-slate-400 mb-1">Display Name</label>
            <input
              type="text"
              value={settings.userName}
              onChange={e => onUpdateSettings({ userName: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/8 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Security & Optional PIN / Biometric Fingerprint Section */}
        <div className="rounded-2xl glass-panel-glow p-5 border border-cyan-500/25 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" /> Device PIN & Biometric Security (Optional)
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
              {settings.isPinEnabled ? 'PIN Active' : 'Simple Optional'}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Lock your workspace with a 4-digit numeric PIN or authenticate using your device’s Fingerprint / Touch ID sensor.
            Everything is checked locally in your browser with zero remote servers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* PIN Toggle & Input */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/8 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.isPinEnabled || false}
                  onChange={e => onUpdateSettings({ isPinEnabled: e.target.checked })}
                  className="rounded text-cyan-500 accent-cyan-500"
                />
                <span className="text-xs font-semibold text-white">Enable 4-Digit Numeric PIN</span>
              </label>

              <div>
                <label className="block text-[11px] text-slate-400 font-mono mb-1">Set 4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="e.g. 1234"
                  value={settings.pin || ''}
                  onChange={e => onUpdateSettings({ pin: e.target.value, isPinEnabled: true })}
                  className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white font-mono text-sm tracking-widest focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Fingerprint / Biometric Sensor Toggle */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/8 space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.isBiometricEnabled !== false}
                  onChange={e => onUpdateSettings({ isBiometricEnabled: e.target.checked })}
                  className="rounded text-cyan-500 accent-cyan-500"
                />
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Enable Fingerprint / Touch ID
                </span>
              </label>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Allows one-tap instant fingerprint authentication to unlock your personal workspace.
              </p>
            </div>
          </div>
        </div>

        {/* Local Storage Manager (Section 8) */}
        <div className="rounded-2xl glass-panel p-5 border border-white/8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" /> Browser Storage Manager
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
              Local-First Offline
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">IndexedDB Estimated Space</span>
              <span className="text-cyan-300 font-bold">
                {(storageEstimate.usage / (1024 * 1024)).toFixed(2)} MB used /{' '}
                {(storageEstimate.quota / (1024 * 1024 * 1024)).toFixed(1)} GB available
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                style={{ width: `${Math.max(2, storageEstimate.percent)}%` }}
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center font-mono">
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 block">Tasks</span>
              <span className="text-sm font-bold text-white">{fullPayload.tasks.length}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 block">Notes</span>
              <span className="text-sm font-bold text-white">{fullPayload.notes.length}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 block">Quizzes</span>
              <span className="text-sm font-bold text-white">{fullPayload.quizzes.length}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-[10px] text-slate-400 block">Projects</span>
              <span className="text-sm font-bold text-white">{fullPayload.projects.length}</span>
            </div>
          </div>
        </div>

        {/* Backup, Restore & AES Encryption (Section 8) */}
        <div className="rounded-2xl glass-panel p-5 border border-white/8 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Backup & Data Recovery
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Export format: JSON</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Browser cache can be cleared or device storage purged. Regular offline JSON backups
            guarantee permanent data preservation across systems.
          </p>

          {/* Encryption toggle */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/6 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useEncryption}
                onChange={e => setUseEncryption(e.target.checked)}
                className="rounded text-cyan-500 accent-cyan-500"
              />
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" /> Enable Password-Protected AES-GCM Encryption
              </span>
            </label>

            {useEncryption && (
              <div className="max-w-xs">
                <input
                  type="password"
                  placeholder="Set encryption passphrase..."
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white text-xs focus:outline-none"
                />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportJSON}
              disabled={isExporting}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export Complete Backup (.json)
            </button>

            <label className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-2 cursor-pointer border border-white/10">
              <Upload className="w-4 h-4" /> Restore from Backup
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>
        </div>

        {/* Reset / Demo Data */}
        <div className="rounded-2xl glass-panel p-5 border border-white/8 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-amber-400" /> Seed & Factory Data
          </h3>
          <p className="text-xs text-slate-400">
            Reset workspace to the initial reference state with pre-populated NTFY robotics,
            mathematics, and CAD files.
          </p>
          <button
            onClick={() => {
              if (window.confirm('Reset all workspace data to factory initial state?')) {
                onResetToDemo();
                setStatusMessage('Reset completed! Initial demo data reloaded.');
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-semibold text-xs cursor-pointer"
          >
            Reset Workspace to Factory Demo
          </button>
        </div>
      </div>
    </div>
  );
};
