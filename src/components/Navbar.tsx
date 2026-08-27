import React, { useState } from 'react';
import {
  Menu,
  X,
  Sparkles,
  LayoutDashboard,
  TrendingUp,
  Receipt,
  Boxes,
  PieChart,
  BrainCircuit,
  SlidersHorizontal,
  FileText,
  Settings,
  HelpCircle,
  ShieldCheck,
  Award,
  Globe,
  Mic,
  Users,
  ShoppingCart
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
  onOpenOnboarding,
  onOpenJudgeDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: ViewMode) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800/90 text-white select-none transition-all">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-3 w-full">
        {/* Left: Brand Lockup & Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 min-w-0">
          {currentView !== 'landing' ? (
            <button
              id="btn-sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-center shrink-0"
              aria-label="Toggle Workspace Sidebar"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          ) : (
            <button
              id="btn-mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-center shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div
            id="brand-logo-button"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer group shrink-0"
          >
            <VeaivexLogo size="sm" className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-white font-extrabold tracking-wider text-xs sm:text-base whitespace-nowrap">
                  VEAIVEX
                </span>
                <span className="px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xs shrink-0">
                  AI
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium hidden md:inline-block leading-none truncate">
                Decision Intelligence for SMEs
              </span>
            </div>
          </div>
        </div>

        {/* Center: Landing Navigation (When in Landing Mode) */}
        {currentView === 'landing' && (
          <nav className="hidden lg:flex items-center gap-1 text-sm text-slate-300">
            <button
              onClick={() => {
                const el = document.getElementById('features-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors text-xs font-semibold"
            >
              Features
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('sdg-impact-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors text-xs font-semibold"
            >
              SDG Impact
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('interactive-demo-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors text-xs font-semibold"
            >
              Live Demo
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('case-studies-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors text-xs font-semibold"
            >
              Case Studies
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('pricing-roi-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/50 transition-colors text-xs font-semibold"
            >
              ROI Calculator
            </button>
          </nav>
        )}

        {/* Right Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          {/* Hackathon Judge Demo Guide Trigger */}
          <button
            id="btn-nav-judge-guide"
            onClick={onOpenJudgeDemo}
            className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-extrabold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all hover:scale-105 active:scale-95 shadow-xs shrink-0"
            title="Open 10Alytics BuildFest 2026 Judge Evaluation Guide"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden xs:inline">Judge Guide</span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-black bg-amber-400 text-slate-950 uppercase tracking-tighter">
              2026
            </span>
          </button>

          {currentView === 'landing' ? (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 shadow-sm transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Live Workspace</span>
              </button>

              <button
                onClick={() => onNavigate('ask-veaivex')}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/25 ring-1 ring-blue-400/30 transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                <span className="hidden xs:inline">Ask </span>
                <span>VEAIVEX</span>
              </button>
            </>
          ) : (
            <>
              {/* Currency Selector */}
              <div className="relative hidden md:block">
                <select
                  id="select-currency"
                  value={profile.currency}
                  onChange={(e) => onUpdateProfile({ currency: e.target.value as CurrencyCode })}
                  className="appearance-none bg-slate-900 hover:bg-slate-800/90 text-slate-200 text-xs font-bold pl-7 pr-6 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-xs"
                >
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                      {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
                <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                  ▾
                </div>
              </div>

              {/* Audio CEO Briefing Trigger */}
              <button
                id="btn-voice-briefing-nav"
                onClick={onOpenAudioBrief}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 transition-all hover:scale-105 active:scale-95 shadow-xs"
                title="Play AI Audio CEO Briefing"
              >
                <Mic className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>Voice</span>
              </button>

              {/* Primary CTA: Ask VEAIVEX */}
              <button
                id="btn-ask-veaivex-nav"
                onClick={() => onNavigate('ask-veaivex')}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30 ring-1 ring-blue-400/40 transition-all hover:scale-105 active:scale-95 whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                <span className="hidden xs:inline">Ask </span>
                <span>VEAIVEX</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation (When on Landing Page) */}
      {currentView === 'landing' && mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900/98 border-b border-slate-800 px-4 py-3 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-800">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-600/20 text-blue-300 font-bold text-xs border border-blue-500/30"
            >
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
              <span>Launch App</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJudgeDemo();
              }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>Judge Guide</span>
            </button>
          </div>

          <div className="space-y-1 text-sm text-slate-300 pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs font-medium"
            >
              Key Features
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('sdg-impact-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs font-medium text-emerald-400"
            >
              SDG 8 & 12 Impact
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('interactive-demo-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs font-medium"
            >
              Interactive Product Demo
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('case-studies-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs font-medium"
            >
              SME Case Studies
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                document.getElementById('pricing-roi-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-xs font-medium"
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
