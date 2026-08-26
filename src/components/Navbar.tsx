import React, { useState } from 'react';
import { VeaivexLogo } from './VeaivexLogo';
import { BusinessProfile, Language, Currency } from '../types';
import {
  Mic,
  Sparkles,
  Database,
  Globe,
  DollarSign,
  Menu,
  X,
  FileText,
  HelpCircle,
  LogIn,
  UserPlus,
  ArrowRight,
  LayoutDashboard,
  ShieldCheck,
  Compass,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  profile: BusinessProfile;
  onUpdateProfile: (updates: Partial<BusinessProfile>) => void;
  onOpenVoiceModal: () => void;
  onOpenDemoGuide: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  profile,
  onUpdateProfile,
  onOpenVoiceModal,
  onOpenDemoGuide,
  onOpenAuth,
  sidebarOpen,
  onToggleSidebar,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currencies: { code: Currency; symbol: string; label: string }[] = [
    { code: 'NGN', symbol: '₦', label: 'NGN (₦)' },
    { code: 'USD', symbol: '$', label: 'USD ($)' },
    { code: 'GBP', symbol: '£', label: 'GBP (£)' },
    { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  ];

  const scrollToLandingSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (currentView !== 'landing') {
      onNavigate('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/90 text-white select-none transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Brand Lockup & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentView !== 'landing' ? (
            <button
              id="btn-sidebar-toggle"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle Workspace Sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          ) : (
            <button
              id="btn-mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div
            id="brand-logo-button"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          >
            <VeaivexLogo size="sm" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-white font-extrabold tracking-wider text-sm sm:text-base">
                  VEAIVEX
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xs">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium hidden md:inline-block leading-none">
                Decision Intelligence for SMEs
              </span>
            </div>
          </div>
        </div>

        {/* Center: Navigation Links for Landing Page OR Business Title for App */}
        {currentView === 'landing' ? (
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
            <button
              onClick={() => onNavigate('landing')}
              className="text-white hover:text-blue-400 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToLandingSection('solution')}
              className="hover:text-white transition-colors"
            >
              Solution
            </button>
            <button
              onClick={() => scrollToLandingSection('product')}
              className="hover:text-white transition-colors"
            >
              Workspaces
            </button>
            <button
              onClick={() => scrollToLandingSection('how-it-works')}
              className="hover:text-white transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToLandingSection('ai-copilot')}
              className="hover:text-white transition-colors"
            >
              AI Copilot
            </button>
            <button
              onClick={() => scrollToLandingSection('sme-impact')}
              className="hover:text-white transition-colors"
            >
              Case Studies
            </button>
            <button
              onClick={() => scrollToLandingSection('faq')}
              className="hover:text-white transition-colors"
            >
              FAQ
            </button>
          </nav>
        ) : (
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            >
              <span>&larr; Website</span>
            </button>
            <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">Business:</span>
              <span className="font-bold text-slate-200 truncate max-w-[160px]">{profile.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block ml-0.5 animate-pulse"></span>
              <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider hidden lg:inline">Live BI</span>
            </div>
          </div>
        )}

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Hackathon Judge Demo Guide Trigger */}
          <button
            id="btn-nav-judge-guide"
            onClick={onOpenDemoGuide}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-extrabold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all hover:scale-105 active:scale-95 shadow-xs"
            title="Open 10Alytics BuildFest 2026 Judge Evaluation Guide"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Judge Guide</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-400 text-slate-950 uppercase tracking-tighter">
              2026
            </span>
          </button>

          {currentView === 'landing' ? (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 shadow-sm transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="hidden xs:inline">Live Workspace</span>
              </button>

              <button
                id="btn-nav-primary-ask-veaivex"
                onClick={() => onNavigate('ask-veaivex')}
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/25 ring-1 ring-blue-400/30 transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Ask VEAIVEX</span>
              </button>
            </>
          ) : (
            <>
              {/* Currency Selector */}
              <div className="relative hidden xs:block">
                <select
                  id="select-currency"
                  value={profile.currency}
                  onChange={(e) => {
                    const newCurr = e.target.value as Currency;
                    const match = currencies.find((c) => c.code === newCurr);
                    onUpdateProfile({
                      currency: newCurr,
                      currencySymbol: match ? match.symbol : '₦',
                    });
                  }}
                  className="bg-slate-900 text-xs font-semibold text-slate-200 border border-slate-800 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  aria-label="Select Currency"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} {c.code}
                    </option>
                  ))}
                </select>
              </div>

              {/* Voice Mode Action */}
              <button
                id="btn-voice-mode"
                onClick={onOpenVoiceModal}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-blue-300 hover:text-blue-200 transition-all shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Activate Conversational Voice Mode (TTS / Speech)"
              >
                <Mic className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                <span>Voice</span>
              </button>

              {/* Primary CTA: Ask VEAIVEX (Consistently styled across entire app) */}
              <button
                id="btn-ask-veaivex-nav"
                onClick={() => onNavigate('ask-veaivex')}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30 ring-1 ring-blue-400/40 transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span className="hidden sm:inline">Ask</span>
                <span>VEAIVEX</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu for Landing Page */}
      {currentView === 'landing' && mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              onClick={() => {
                onNavigate('landing');
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 min-h-[44px] flex items-center"
            >
              Home
            </button>
            <button
              onClick={() => scrollToLandingSection('solution')}
              className="text-left px-3 py-2.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 min-h-[44px] flex items-center"
            >
              Solution
            </button>
            <button
              onClick={() => scrollToLandingSection('product')}
              className="text-left px-3 py-2.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 min-h-[44px] flex items-center"
            >
              Workspaces
            </button>
            <button
              onClick={() => scrollToLandingSection('how-it-works')}
              className="text-left px-3 py-2.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 min-h-[44px] flex items-center"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToLandingSection('ai-copilot')}
              className="text-left px-3 py-2.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 min-h-[44px] flex items-center"
            >
              AI Copilot
            </button>
            <button
              onClick={() => scrollToLandingSection('sme-impact')}
              className="text-left px-3 py-2.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 min-h-[44px] flex items-center"
            >
              Case Studies
            </button>
            <button
              onClick={() => scrollToLandingSection('faq')}
              className="text-left px-3 py-2.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 min-h-[44px] flex items-center"
            >
              FAQ
            </button>
            <button
              onClick={() => scrollToLandingSection('contact')}
              className="text-left px-3 py-2.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 min-h-[44px] flex items-center"
            >
              Contact
            </button>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoGuide();
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>10Alytics BuildFest 2026 Judge Guide</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('dashboard');
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-blue-300 border border-slate-700 flex items-center justify-center gap-2 min-h-[44px]"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>Explore Live Workspace</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigate('ask-veaivex');
              }}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask VEAIVEX AI Copilot</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

