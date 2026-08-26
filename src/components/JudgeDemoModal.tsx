import React from 'react';
import {
  HelpCircle,
  X,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Mic,
  FileText,
  Sliders,
  DollarSign,
} from 'lucide-react';
import { VeaivexLogo } from './VeaivexLogo';

interface JudgeDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const JudgeDemoModal: React.FC<JudgeDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: '1. Executive Briefing & Voice TTS',
      view: 'dashboard',
      action: 'Click "Listen Aloud" on the Daily CEO Brief card',
      description:
        'Demonstrates autonomous synthesis of Revenue (₦2.44M), Net Profit (₦419k), and Audio read-aloud playback.',
    },
    {
      step: '2. "What Should I Do Next?" Action Engine',
      view: 'dashboard',
      action: 'Inspect Top 3 Prioritized Actions Today',
      description:
        'Demonstrates our primary winning feature: Action + Reason + Mathematical Evidence + Financial Impact + 1-Click Execution.',
    },
    {
      step: '3. Conversational Voice & Root-Cause BI',
      view: 'ask-veaivex',
      action: 'Click "Why did profit drop this month?" or tap Voice Mic',
      description:
        'Proves deep root-cause reasoning explaining fuel spikes (+146.8%), wholesale client pauses, and stockout signals.',
    },
    {
      step: '4. Anomaly Detection & Expense Control',
      view: 'expense-analytics',
      action: 'Examine Generator Diesel (+146.8%) & Dispatch Logistics (+73.3%)',
      description:
        'Shows 96% AI confidence root-cause diagnostics and actionable load-shedding / batch dispatch solutions.',
    },
    {
      step: '5. What-If Decision Sandbox',
      view: 'what-if',
      action: 'Move the Price (+5%) and Expense Cut (-10%) Sliders',
      description:
        'Interactive financial modeling projecting instant variance against actual baseline numbers.',
    },
    {
      step: '6. Audit-Ready Board Report & Export',
      view: 'reports',
      action: 'Review the Executive Document & Click "Print / Save PDF"',
      description:
        'Complete end-to-end report generation for SME stakeholders, bankers, and investors.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl text-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VeaivexLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight">
                  10Alytics BuildFest 2026 Judge Demo Flow
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500 text-white uppercase">
                  3-Min Tour
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Track: AI for Business &bull; Specialization: BI Tools
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-4 text-xs">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-blue-900">
            <span className="font-bold block mb-1">Welcome, 10Alytics BuildFest Judges!</span>
            <p className="leading-relaxed">
              VEAIVEX AI was built specifically to solve the SME decision dilemma: turning unstructured operational data into clear, explainable, multilingual decisions with prioritized actions. Follow this step-by-step tour:
            </p>
          </div>

          <div className="space-y-3">
            {steps.map((item, idx) => (
              <div
                key={idx}
                className="border border-slate-200 hover:border-blue-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:bg-slate-50"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">{item.step}</span>
                  </div>
                  <p className="text-blue-700 font-semibold">{item.action}</p>
                  <p className="text-slate-500 leading-relaxed">{item.description}</p>
                </div>

                <button
                  onClick={() => {
                    onNavigate(item.view);
                    onClose();
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-blue-600 text-white transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-center shadow-xs"
                >
                  <span>Launch Step</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            VEAIVEX AI &bull; A product of Veltrivex AI Global
          </span>
          <button
            onClick={() => {
              onNavigate('dashboard');
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
          >
            Start Evaluating
          </button>
        </div>
      </div>
    </div>
  );
};
