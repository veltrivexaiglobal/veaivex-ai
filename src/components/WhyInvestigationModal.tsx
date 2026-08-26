import React, { useState } from 'react';
import { WhyInvestigation, BusinessProfile } from '../types';
import {
  X,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight,
  Calculator,
  Scale,
} from 'lucide-react';

interface WhyInvestigationModalProps {
  investigation: WhyInvestigation | null;
  profile: BusinessProfile;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToResolve?: (category: string) => void;
}

export const WhyInvestigationModal: React.FC<WhyInvestigationModalProps> = ({
  investigation,
  profile,
  isOpen,
  onClose,
  onNavigateToResolve,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !investigation) return null;

  const handleCopyDiagnostic = () => {
    const summaryText = `[VEAIVEX ROOT CAUSE DIAGNOSIS]\nMetric: ${investigation.metricLabel} (${investigation.currentValue})\nIssue: ${investigation.changeStatement}\nRoot Cause: ${investigation.rootCause}\nFormula: ${investigation.mathematicalProof.baseFormula}\nVariance: ${investigation.mathematicalProof.variance}\nImpact: ${investigation.businessImpact}\nAction: ${investigation.recommendedAction}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-5 sm:p-6 flex items-start justify-between gap-3 z-10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  VEAIVEX Root-Cause Explorer
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Confidence: {investigation.confidence}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
                Why Did {investigation.metricLabel} Change?
              </h2>
              <p className="text-xs text-rose-600 font-semibold mt-0.5">
                {investigation.changeStatement}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 text-xs sm:text-sm">
          {/* 1. Executive Summary & Root Cause */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Observed Symptom
              </span>
              <p className="text-slate-800 font-medium leading-relaxed">
                {investigation.symptom}
              </p>
            </div>

            <div className="bg-rose-50/60 border border-rose-200/80 rounded-xl p-3.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800 block mb-1">
                Diagnostic Root Cause
              </span>
              <p className="text-rose-950 font-semibold leading-relaxed">
                {investigation.rootCause}
              </p>
            </div>
          </div>

          {/* 2. Driver Factor Contribution Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-blue-600" />
                Multi-Factor Variance Attribution (% Contribution)
              </span>
              <span className="text-[11px] text-slate-500">Calculated from Ledger</span>
            </div>

            <div className="space-y-2.5">
              {investigation.drivers.map((driver, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          driver.impactDirection === 'negative'
                            ? 'bg-rose-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">
                        {driver.factor}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold text-xs ${
                          driver.impactDirection === 'negative'
                            ? 'text-rose-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {driver.contributionAmount}
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {driver.contributionPct}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {driver.evidence}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Mathematical Proof & Reconciliation */}
          <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-blue-400 font-bold uppercase tracking-wider font-sans text-[11px]">
              <Calculator className="w-3.5 h-3.5" />
              Mathematical Proof &amp; Ledger Reconciliation
            </div>
            <div className="text-slate-300">
              <span className="text-slate-500 block">Formula:</span>
              <p className="text-slate-100">{investigation.mathematicalProof.baseFormula}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">July Baseline:</span>
                <span className="text-slate-300">{investigation.mathematicalProof.previousPeriod}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">August Ledger:</span>
                <span className="text-slate-300">{investigation.mathematicalProof.currentPeriod}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-amber-300 text-[11px]">
              <strong className="text-amber-400">Variance Proof:</strong> {investigation.mathematicalProof.variance}
            </div>
          </div>

          {/* 4. Business Impact & Prescriptive Action */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 space-y-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block">
                Commercial Impact on Business
              </span>
              <p className="text-xs text-blue-950 mt-0.5 leading-relaxed">
                {investigation.businessImpact}
              </p>
            </div>

            <div className="pt-2 border-t border-blue-200/60">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block">
                Prescriptive Recommended Action
              </span>
              <p className="text-xs font-semibold text-blue-900 mt-0.5 leading-relaxed">
                {investigation.recommendedAction}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopyDiagnostic}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Full Diagnostic Brief'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                if (onNavigateToResolve) onNavigateToResolve('what-if');
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs flex items-center gap-1.5"
            >
              <span>Simulate Fix in What-If</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
