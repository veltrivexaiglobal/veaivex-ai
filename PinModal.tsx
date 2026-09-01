import React, { useState } from 'react';
import { Lock, Fingerprint, Delete, X, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  subtitle?: string;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Authorize Transaction',
  subtitle = 'Enter your 4-digit VeltriPay security PIN to confirm',
}) => {
  const { user } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isBiometricAuthenticating, setIsBiometricAuthenticating] = useState(false);

  if (!isOpen) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setError('');

      // Auto-submit on 4th digit
      if (nextPin.length === 4) {
        // In prototype, any 4-digit PIN (default 1234 or user created) succeeds
        setTimeout(() => {
          setPin('');
          onSuccess();
        }, 200);
      }
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  const handleBiometricAuth = () => {
    setIsBiometricAuthenticating(true);
    setTimeout(() => {
      setIsBiometricAuthenticating(false);
      onSuccess();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mx-auto w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4 text-emerald-600">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 font-display">{title}</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">{subtitle}</p>

        {/* PIN Indicators */}
        <div className="flex justify-center items-center gap-4 my-6">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                pin.length > index
                  ? 'bg-emerald-600 ring-4 ring-emerald-500/20 scale-110'
                  : 'bg-slate-100 border border-slate-300'
              }`}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-rose-600 mb-4">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-emerald-600 active:text-white text-xl font-semibold text-slate-800 transition flex items-center justify-center select-none shadow-2xs border border-slate-100"
            >
              {digit}
            </button>
          ))}

          {/* Biometrics button */}
          {user.biometricsEnabled ? (
            <button
              type="button"
              onClick={handleBiometricAuth}
              disabled={isBiometricAuthenticating}
              className="h-14 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition flex items-center justify-center"
              title="Authenticate with Fingerprint/Face ID"
            >
              <Fingerprint className={`w-6 h-6 ${isBiometricAuthenticating ? 'animate-pulse' : ''}`} />
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 active:bg-emerald-600 active:text-white text-xl font-semibold text-slate-800 transition flex items-center justify-center select-none shadow-2xs border border-slate-100"
          >
            0
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition flex items-center justify-center border border-slate-100"
          >
            <Delete className="w-6 h-6" />
          </button>
        </div>

        <p className="text-[11px] text-slate-400 mt-5">
          Forgot PIN? Reset from your Security Settings.
        </p>
      </div>
    </div>
  );
};
