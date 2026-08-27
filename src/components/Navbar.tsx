import React, { useState } from 'react';
import {
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  ShieldCheck,
  Award,
  Globe,
  Mic
} from 'lucide-react';
import { ViewMode, BusinessProfile, CurrencyCode } from '../types';
import VeaivexLogo from './VeaivexLogo';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  profile: BusinessProfile;
  onUpdateProfile: (updates: Partial<BusinessProfile>) => void;
  onOpenAudioBrief: () => void;
  onOpenOnboarding: () => void;
  onOpenJudgeDemo: () => void;
}

const currencies: { code: CurrencyCode; label: string; symbol: string; flag: string }[] = [
  { code: 'USD', label: 'USD ($)', symbol: '$', flag: '🇺🇸' },
  { code: 'NGN', label: 'NGN (₦)', symbol: '₦', flag: '🇳🇬' },
  { code: 'KES', label: 'KES (KSh)', symbol: 'KSh', flag: '🇰🇪' },
  { code: 'GHS', label: 'GHS (GH₵)', symbol: 'GH₵', flag: '🇬🇭' },
  { code: 'GBP', label: 'GBP (£)', symbol: '£', flag: '🇬🇧' },
  { code: 'EUR', label: 'EUR (€)', symbol: '€', flag: '🇪🇺' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  sidebarOpen,
  setSidebarOpen,
  profile,
  onUpdateProfile,
  onOpenAudioBrief,
  onOpenJudgeDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: ViewMode) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white select-none">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        {/* Left: Hamburger & Logo */}
        <div className="flex items-center gap-2 shrink-0">
          {currentView !== 'landing' ? (
            <button
              id="btn-sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none flex items-center justify-center shrink-0"
              aria-label="Toggle Sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          ) : (
            <button
              id="btn-mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none flex items-center justify-center shrink-0"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <VeaivexLogo size="sm" className="w-6 h-6 shrink-0" />
            <div className="flex items-center gap-1">
              <span className="text-white font-black tracking-wider text-sm sm:text-base">
                VEAIVEX
              </span>
              <span className="px-1 py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase bg-blue-600 text-white shrink-0">
                AI
              </span>
            </div>
          </div>
        </div>

        {/* Center: Desktop Nav Links (Landing Only) */}
        {currentView === 'landing' && (
          <nav className="hidden lg:flex items-center gap-1 text-xs text-slate-300 font-semibold">
            <button
              onClick={() => document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50"
            >
              Features
            </button>
            <button
              onClick={() => document.getElementById('sdg-impact-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50"
            >
              SDG Impact
            </button>
            <button
              onClick={() => document.getElementById('interactive-demo-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50"
            >
              Live Demo
            </button>
            <button
              onClick={() => document.getElementById('case-studies-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50"
            >
              Case Studies
            </button>
            <button
              onClick={() => document.getElementById('pricing-roi-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50"
            >
              ROI Calculator
            </button>
          </nav>
        )}

        {/* Right: Actions (Strictly Constrained for Mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Judge Guide Button - Compact Shield on Mobile */}
          <button
            id="btn-nav-judge-guide"
            onClick={onOpenJudgeDemo}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 shrink-0"
            title="Judge Guide"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Judge Guide</span>
          </button>

          {currentView !== 'landing' && (
            <>
              {/* Currency Selector (Desktop only) */}
              <div className="relative hidden md:block">
                <select
                  id="select-currency"
                  value={profile.currency}
                  onChange={(e) => onUpdateProfile({ currency: e.target.value as CurrencyCode })}
                  className="appearance-none bg-slate-900 text-slate-200 text-xs font-bold pl-6 pr-5 py-1.5 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
                <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Voice Briefing Button (Desktop only) */}
              <button
                id="btn-voice-briefing-nav"
                onClick={onOpenAudioBrief}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30"
              >
                <Mic className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>Voice</span>
              </button>
            </>
          )}

          {/* Primary CTA: Ask VEAIVEX */}
          <button
            id="btn-ask-veaivex-nav"
            onClick={() => onNavigate('ask-veaivex')}
            className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all shrink-0 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200 shrink-0" />
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Landing Mode) */}
      {currentView === 'landing' && mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-blue-600/20 text-blue-300 font-bold text-xs border border-blue-500/30"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>Launch App</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJudgeDemo();
              }}
              className="flex items-center justify-center gap-2 p-2 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Judge Guide</span>
            </button>
          </div>

          <div className="space-y-1 text-xs text-slate-300 pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 font-medium"
            >
              Key Features
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('sdg-impact-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 font-medium text-emerald-400"
            >
              SDG 8 & 12 Impact
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('interactive-demo-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 font-medium"
            >
              Interactive Product Demo
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('case-studies-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 font-medium"
            >
              SME Case Studies
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('pricing-roi-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 font-medium"
            >
              Pricing & ROI Calculator
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
