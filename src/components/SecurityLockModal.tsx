import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Fingerprint,
  KeyRound,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  X,
} from 'lucide-react';

interface SecurityLockModalProps {
  isLocked: boolean;
  pin?: string;
  isBiometricEnabled?: boolean;
  onUnlock: () => void;
  userName: string;
}

export const SecurityLockModal: React.FC<SecurityLockModalProps> = ({
  isLocked,
  pin,
  isBiometricEnabled = true,
  onUnlock,
  userName,
}) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isScanningFingerprint, setIsScanningFingerprint] = useState(false);

  if (!isLocked) return null;

  const handleDigit = (digit: string) => {
    if (enteredPin.length < 6) {
      const next = enteredPin + digit;
      setEnteredPin(next);
      setErrorMsg('');
      if (pin && next === pin) {
        setEnteredPin('');
        onUnlock();
      } else if (!pin && next.length >= 4) {
        // Default unlock if no pin set
        setEnteredPin('');
        onUnlock();
      }
    }
  };

  const handleBackspace = () => {
    setEnteredPin(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleBiometricAuth = () => {
    setIsScanningFingerprint(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsScanningFingerprint(false);
      setEnteredPin('');
      onUnlock();
    }, 1100);
  };

  const handleVerifyPin = () => {
    if (pin) {
      if (enteredPin === pin) {
        setEnteredPin('');
        onUnlock();
      } else {
        setErrorMsg('Incorrect PIN. Please retry or use Fingerprint.');
        setEnteredPin('');
      }
    } else {
      onUnlock();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050811]/85 backdrop-blur-3xl select-none animate-fadeIn">
      {/* Background glowing aura */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-purple-600/15 filter blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm rounded-3xl p-8 glass-panel-glow border border-cyan-500/30 flex flex-col items-center text-center space-y-6 relative shadow-2xl">
        {/* Lock Icon and Brand */}
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">MY WORK OS Locked</h2>
          <p className="text-xs text-slate-400 mt-1">
            Welcome back, <strong className="text-white">{userName}</strong>. Verify identity to resume work.
          </p>
        </div>

        {/* PIN Dots Display */}
        <div className="flex gap-3 justify-center py-2">
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                enteredPin.length > idx
                  ? 'bg-cyan-400 border-cyan-400 shadow-md shadow-cyan-400/50 scale-110'
                  : 'bg-white/5 border-white/20'
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <div className="text-rose-400 text-xs font-mono flex items-center gap-1.5 animate-shake">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Numeric PIN Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleDigit(num)}
              className="h-12 rounded-2xl bg-white/[0.04] hover:bg-white/[0.12] active:bg-cyan-500/20 border border-white/8 text-white font-mono text-base font-bold transition flex items-center justify-center cursor-pointer"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="h-12 rounded-2xl bg-white/[0.02] hover:bg-white/[0.08] text-slate-400 text-xs font-mono font-semibold flex items-center justify-center cursor-pointer"
          >
            DEL
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-12 rounded-2xl bg-white/[0.04] hover:bg-white/[0.12] active:bg-cyan-500/20 border border-white/8 text-white font-mono text-base font-bold transition flex items-center justify-center cursor-pointer"
          >
            0
          </button>
          <button
            onClick={handleVerifyPin}
            className="h-12 rounded-2xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center cursor-pointer"
          >
            OK
          </button>
        </div>

        {/* Fingerprint / Touch ID Biometric button */}
        {isBiometricEnabled && (
          <div className="pt-2 w-full border-t border-white/8 flex flex-col items-center space-y-2">
            <button
              onClick={handleBiometricAuth}
              disabled={isScanningFingerprint}
              className={`p-3.5 rounded-2xl transition cursor-pointer flex items-center gap-2 text-xs font-semibold ${
                isScanningFingerprint
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400 animate-pulse'
                  : 'bg-white/[0.04] hover:bg-cyan-500/15 border border-white/8 text-slate-300 hover:text-cyan-300'
              }`}
            >
              <Fingerprint className={`w-5 h-5 ${isScanningFingerprint ? 'text-cyan-400 animate-spin' : 'text-cyan-400'}`} />
              <span>{isScanningFingerprint ? 'Scanning Biometrics...' : 'Touch ID / Fingerprint'}</span>
            </button>
            <span className="text-[10px] text-slate-500 font-mono">
              Simulated or WebAuthn Touch Sensor
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
