import React, { useState } from 'react';
import { BusinessHealthScore, HealthCategoryScore } from '../types';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface BusinessHealthScoreCardProps {
  healthScore: BusinessHealthScore;
  onOpenWhy?: (metricId: string) => void;
  onNavigate?: (view: string) => void;
}

export const BusinessHealthScoreCard: React.FC<BusinessHealthScoreCardProps> = ({
  healthScore,
  onOpenWhy,
  onNavigate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 65) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                VEAIVEX Business Health Score
              </h2>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                  healthScore.status === 'healthy'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : healthScore.status === 'caution'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {healthScore.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Deterministic 6-pillar operational health composite (Reconciled from transactional ledger)
            </p>
          </div>
        </div>

        {/* Score Display & Toggle */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="flex items-baseline gap-2">
            <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {healthScore.overallScore}
              <span className="text-sm font-semibold text-slate-400">/100</span>
            </div>

            <div
              className={`flex items-center text-xs font-bold px-2 py-0.5 rounded-md border ${
                healthScore.scoreDelta >= 0
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-rose-700 bg-rose-50 border-rose-200'
              }`}
            >
              {healthScore.scoreDelta >= 0 ? (
                <>
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  +{healthScore.scoreDelta} pts
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                  {healthScore.scoreDelta} pts MoM
                </>
              )}
            </div>
          </div>

          {onOpenWhy && (
            <button
              onClick={() => onOpenWhy('health_score_drop')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors shadow-2xs"
              title="Investigate root cause of health score change"
            >
              <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Why?</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
            title={isExpanded ? 'Collapse breakdown' : 'Expand full 6-pillar breakdown'}
            aria-label="Toggle Health Score Breakdown"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 6 Category Progress Bars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
        {healthScore.categories.map((cat) => (
          <div
            key={cat.name}
            className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-3 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold text-slate-800">{cat.name}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900">{cat.score}</span>
                <span className="text-[10px] text-slate-400">({cat.weight * 100}%)</span>
              </div>
            </div>

            {/* Progress line */}
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                  cat.score
                )}`}
                style={{ width: `${cat.score}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
              {cat.keyFactor}
            </p>
          </div>
        ))}
      </div>

      {/* Expanded Breakdown & Explainability Drawer */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
          {/* Main Drag Factors */}
          <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Primary Score Drag Drivers This Month
              </div>
              {onOpenWhy && (
                <button
                  onClick={() => onOpenWhy('profit_drop')}
                  className="text-xs font-bold text-blue-700 hover:text-blue-800 underline flex items-center gap-1"
                >
                  <span>Investigate Profit Compression</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <ul className="space-y-1.5">
              {healthScore.mainReasons.map((reason, idx) => (
                <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Path to 85+ (Healthy) */}
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Prescriptive Actions to Restore 85+ Score
            </div>
            <div className="space-y-2">
              {healthScore.recommendedImprovements.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-emerald-200/60 rounded-lg p-2.5 flex items-center justify-between gap-2 text-xs"
                >
                  <span className="text-slate-800 font-medium">{rec}</span>
                  {onNavigate && (
                    <button
                      onClick={() => onNavigate('insights')}
                      className="px-2 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold shrink-0 text-[11px]"
                    >
                      Review Action
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
