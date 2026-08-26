import React, { useState } from 'react';
import { VeaivexLogo } from './VeaivexLogo';
import {
  X,
  Lock,
  Mail,
  User,
  Building2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  KeyRound,
  AlertCircle,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { name: string; email: string; businessName?: string }) => void;
  onStartOnboarding: () => void;
  initialMode?: 'signin' | 'signup' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onStartOnboarding,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'reset'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'signin') {
        if (!email || !password) {
          setMessage({ type: 'error', text: 'Please enter both your email and password.' });
          return;
        }
        setMessage({ type: 'success', text: 'Authentication successful. Loading workspace...' });
        setTimeout(() => {
          onSuccess({
            name: name || 'Demo Executive',
            email: email,
            businessName: businessName || 'Veaivex Retail & Provisions',
          });
          onClose();
        }, 500);
      } else if (mode === 'signup') {
        if (!email || !password || !name) {
          setMessage({ type: 'error', text: 'Please complete all required fields.' });
          return;
        }
        if (password !== confirmPassword) {
          setMessage({ type: 'error', text: 'Passwords do not match.' });
          return;
        }
        setMessage({ type: 'success', text: 'Account registered! Starting business onboarding...' });
        setTimeout(() => {
          onSuccess({ name, email, businessName });
          onClose();
          onStartOnboarding();
        }, 600);
      } else if (mode === 'forgot') {
        if (!email) {
          setMessage({ type: 'error', text: 'Please enter your business email.' });
          return;
        }
        setMessage({
          type: 'success',
          text: `Password reset link and security PIN have been sent to ${email}.`,
        });
      }
    }, 400);
  };

  const handleDemoQuickAccess = () => {
    onSuccess({
      name: 'BuildFest Judge',
      email: 'judge@10alytics.io',
      businessName: 'Veaivex Retail & Distribution',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 pb-5 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <VeaivexLogo size="sm" />
            <span className="font-extrabold text-white text-base tracking-wider">VEAIVEX AI</span>
          </div>

          <h3 className="text-xl font-bold tracking-tight">
            {mode === 'signin' && 'Sign in to your Workspace'}
            {mode === 'signup' && 'Create your SME Account'}
            {mode === 'forgot' && 'Reset your Password'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'signin' && 'Access deterministic BI analytics & decision copilot'}
            {mode === 'signup' && 'Set up automated data-driven recommendations in minutes'}
            {mode === 'forgot' && 'Enter your verified business email for instant recovery'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {message && (
            <div
              className={`mb-4 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aliyu Abubakar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Business Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Aliyu Super Stores"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Business Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="owner@yourbusiness.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] font-semibold text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>
            )}

            {mode === 'signin' && (
              <div className="flex items-center justify-between text-xs text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember this device for 30 days</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>
                    {mode === 'signin' && 'Sign In'}
                    {mode === 'signup' && 'Create Account & Continue'}
                    {mode === 'forgot' && 'Send Reset Instructions'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Mode for Judges */}
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                10Alytics BuildFest 2026 Testing
              </span>
              <button
                type="button"
                onClick={handleDemoQuickAccess}
                className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Explore Live Demo Workspace (Instant Access)</span>
              </button>
            </div>
          </div>

          {/* Switch mode links */}
          <div className="mt-4 text-center text-xs text-slate-500">
            {mode === 'signin' && (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Create one now
                </button>
              </p>
            )}
            {mode === 'signup' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            )}
            {mode === 'forgot' && (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Return to Sign In
                </button>
              </p>
            )}
          </div>

          {/* Subtle Product Attribution */}
          <div className="mt-5 pt-3 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 font-medium">
              VEAIVEX AI &mdash; A product of Veltrivex AI Global
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
