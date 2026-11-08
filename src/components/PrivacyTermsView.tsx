import React from 'react';
import {
  ShieldCheck,
  Lock,
  HardDrive,
  EyeOff,
  FileCheck,
  Sparkles,
  ServerOff,
  UserCheck,
} from 'lucide-react';

export const PrivacyTermsView: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Transparent Commitment</span>
        </div>
        <h2 className="text-xl lg:text-2xl font-extrabold text-white">
          Privacy Policy & Terms of Service
        </h2>
        <p className="text-xs text-slate-300 mt-1">
          Last updated: November 2026 · Local-First Data Sovereignty Guarantee.
        </p>
      </div>

      {/* Hero Pledge Banner */}
      <div className="rounded-3xl p-6 lg:p-8 glass-panel-glow border border-emerald-500/30 space-y-4 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Our Ironclad Privacy Rule: We Do Not Steal, Sell, or Track Your Data
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              MY WORK is engineered as a <strong>100% local-first personal work operating system</strong>.
              Your files, code snippets (C++, Python, Web), videos, photos, 3D CAD models, PCB designs,
              notes, and daily plans stay solely on your machine inside your browser’s private IndexedDB storage.
              We do not possess a central database, we do not log your ideas, and we do not monetize or harvest your intellectual property.
            </p>
          </div>
        </div>
      </div>

      {/* The 4 Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            icon: ServerOff,
            title: 'No Central Server Storage',
            desc: 'Every file you save, upload, or create lives on your local device. Nothing is transferred to remote servers or third-party cloud data warehouses.',
            color: 'text-cyan-400',
          },
          {
            icon: EyeOff,
            title: 'Zero Telemetry & Tracking',
            desc: 'We do not inject tracking pixels, behavioral telemetry, keyloggers, or advertising trackers. Your work rhythm and focus metrics remain strictly personal.',
            color: 'text-indigo-400',
          },
          {
            icon: HardDrive,
            title: 'You Own All Intellectual Property',
            desc: 'All engineering prototypes, robotics code, PCB schematics, and study notes remain 100% your property. You can export complete unencrypted or AES-GCM encrypted JSON backups anytime.',
            color: 'text-emerald-400',
          },
          {
            icon: UserCheck,
            title: 'Optional PIN & Biometric Vault',
            desc: 'Add a local PIN code or Fingerprint/Touch ID scanner directly in your browser. Authentication happens strictly on-device without remote auth servers.',
            color: 'text-purple-400',
          },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="rounded-2xl glass-panel p-5 border border-white/8 space-y-3">
              <div className="flex items-center gap-2.5">
                <Icon className={`w-5 h-5 ${item.color}`} />
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Terms of Service Section */}
      <div className="rounded-2xl glass-panel p-6 border border-white/8 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-cyan-400" /> Terms of Service & User Responsibility
        </h3>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            <strong>1. Local Backup Responsibility:</strong> Because MY WORK is local-first, if you clear your browser cookies and site storage without having created an export backup, your records could be cleared by the browser. We strongly encourage utilizing the built-in <em>Export Backup (.json)</em> feature located in Settings.
          </p>
          <p>
            <strong>2. Client-Side Encryption:</strong> When you enable password protection on exports, encryption is performed using Web Crypto API AES-GCM with PBKDF2 key derivation. Because there is no backdoor or server key store, forgotten passwords cannot be recovered by anyone.
          </p>
          <p>
            <strong>3. Free & Open Operating System:</strong> You are free to use MY WORK for educational, engineering, commercial robotics, and scientific research purposes without restriction or subscription traps.
          </p>
        </div>
      </div>
    </div>
  );
};
