import React, { useState } from 'react';
import { VeaivexLogo } from '../VeaivexLogo';
import { VeaivexAvatar } from '../VeaivexAvatar';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Package,
  Users,
  Receipt,
  CheckCircle2,
  HelpCircle,
  Play,
  Layers,
  LineChart,
  BarChart3,
  Bot,
  BrainCircuit,
  Lock,
  ChevronDown,
  LayoutDashboard,
  Building2,
  ShoppingCart,
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onOpenVoiceModal: () => void;
  onOpenDemoGuide: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onOpenDemoGuide,
  onOpenAuth,
  onNavigate,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What makes VEAIVEX AI different from standard accounting software?",
      a: "Standard accounting tools only record what happened in the past. VEAIVEX AI acts as an autonomous Decision Intelligence Copilot that pinpoints the exact mathematical root-cause behind profit margin changes, forecasts stockout horizons, and provides prioritized action plans."
    },
    {
      q: "Does VEAIVEX AI require complex data migrations?",
      a: "No. You can easily upload raw spreadsheets (CSV/Excel) or use our built-in instant Touch POS register for day-to-day sales."
    },
    {
      q: "Is business data kept private and secure?",
      a: "Yes. All financial ledgers, inventory metrics, and customer lists are securely processed with institutional-grade encryption standards."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2">
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider">10Alytics BuildFest 2026</span>
        <span>VEAIVEX AI is live &bull; Participant ID: BF-1495</span>
      </div>

      {/* Navigation Header */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <VeaivexLogo size="md" />
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">VEAIVEX AI</span>
            <span className="block text-[10px] text-slate-400 font-medium -mt-1">Decision Intelligence Copilot</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenDemoGuide}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition"
          >
            Judge Guide
          </button>
          <button 
            onClick={onLaunchDashboard}
            className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition"
          >
            Launch Platform <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6">
          <BrainCircuit className="w-4 h-4" />
          Autonomous Decision Intelligence &amp; BI Copilot for African SMEs
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15] mb-6">
          Turn Raw Ledgers into <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Verified Boardroom Actions
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Stop guessing why your profit margins dropped. VEAIVEX AI automatically isolates cost spikes, forecasts inventory stockout risks, and calculates exact mathematical root causes.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button 
            onClick={onLaunchDashboard}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-blue-600/25 flex items-center gap-2 text-sm transition transform hover:-translate-y-0.5"
          >
            <LayoutDashboard className="w-4 h-4" /> Enter Live BI Workspace
          </button>
          <button 
            onClick={onOpenDemoGuide}
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl flex items-center gap-2 text-sm transition"
          >
            <Play className="w-4 h-4 text-blue-400" /> Watch Demo Guide
          </button>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Deterministic "Why?" Engine</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Mathematical ledger reconciliation isolating cost surges (e.g. generator diesel spikes, supplier increases) down to the exact percentage.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Predictive Stockout Radar</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Daily inventory velocity matched against supplier lead times to trigger proactive reorders before critical stockouts occur.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/60 p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Conversational CEO Copilot</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Ask natural language business questions in English or voice mode and get verified answers with clear ledger proofs.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-black text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-800/40 border border-slate-700/60 rounded-xl overflow-hidden">
              <button 
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-semibold text-sm text-white hover:bg-slate-800/80 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <p>&copy; 2026 VEAIVEX AI &bull; Veltrivex AI Global. 10Alytics BuildFest 2026 Finalist.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
