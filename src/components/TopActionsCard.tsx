import React, { useState } from 'react';
import { RecommendedAction, BusinessProfile, ActionApprovalStatus } from '../types';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Zap,
  Info,
  Clock,
  Eye,
  FileCheck,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ActionReviewModal } from './ActionReviewModal';

interface TopActionsCardProps {
  actions: RecommendedAction[];
  profile: BusinessProfile;
  onNavigate: (view: string) => void;
  onActionComplete?: (actionId: string) => void;
}

export const TopActionsCard: React.FC<TopActionsCardProps> = ({
  actions,
  profile,
  onNavigate,
  onActionComplete,
}) => {
  const [selectedActionForReview, setSelectedActionForReview] = useState<RecommendedAction | null>(null);
  const [actionStatuses, setActionStatuses] = useState<Record<string, ActionApprovalStatus>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'approved' | 'completed'>('all');

  const handleUpdateStatus = (
    actionId: string,
    status: ActionApprovalStatus,
    notes?: string,
    taskDate?: string
  ) => {
    setActionStatuses((prev) => ({ ...prev, [actionId]: status }));
    if (status === 'completed' && onActionComplete) {
      onActionComplete(actionId);
    }
  };

  const handleQuickApprove = (actionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleUpdateStatus(actionId, 'approved');
  };

  const handleQuickComplete = (actionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    handleUpdateStatus(actionId, 'completed');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'inventory':
        return <Package className="w-4 h-4 text-rose-500" />;
      case 'customer':
        return <Users className="w-4 h-4 text-amber-500" />;
      case 'expense':
        return <DollarSign className="w-4 h-4 text-purple-500" />;
      case 'pricing':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      default:
        return <Zap className="w-4 h-4 text-emerald-500" />;
    }
  };

  const filteredActions = actions.filter((action) => {
    const current = actionStatuses[action.id] || action.approvalStatus || 'pending_review';
    if (filterTab === 'pending') return current === 'pending_review';
    if (filterTab === 'approved') return current === 'approved' || current === 'task_created';
    if (filterTab === 'completed') return current === 'completed';
    return true;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Top Prioritized Actions Today
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Action-Ranked Engine
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Prescriptive decision recommendations requiring human review and approval
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(['all', 'pending', 'approved', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterTab === tab
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'all' ? `All (${actions.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Action Cards List */}
      <div className="space-y-3.5 mt-4">
        {filteredActions.slice(0, 4).map((action, index) => {
          const status = actionStatuses[action.id] || action.approvalStatus || 'pending_review';
          const isDone = status === 'completed';
          const isApproved = status === 'approved' || status === 'task_created';
          const isExpanded = expandedId === action.id;

          return (
            <div
              key={action.id}
              className={`border rounded-xl p-4 transition-all ${
                isDone
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : isApproved
                  ? 'bg-blue-50/30 border-blue-200 shadow-2xs'
                  : action.priority === 'high'
                  ? 'bg-gradient-to-r from-white to-slate-50/60 border-slate-300 shadow-2xs'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-700 shrink-0 mt-0.5">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                        {getCategoryIcon(action.category)}
                        {action.category}
                      </span>

                      {action.priority === 'high' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 uppercase">
                          High Priority
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Impact: {action.potentialImpact}
                      </span>

                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {action.confidence || 'High'} Conf.
                      </span>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : isApproved
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {status.replace('_', ' ')}
                      </span>
                    </div>

                    <h4
                      className={`text-sm font-bold text-slate-900 leading-snug ${
                        isDone ? 'line-through text-slate-500' : ''
                      }`}
                    >
                      {action.title}
                    </h4>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      <strong className="text-slate-800">Reason:</strong> {action.reason}
                    </p>

                    {/* Operational Action Text */}
                    <div className="mt-2 text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5">
                      <span className="font-bold text-blue-700">Prescribed Step:</span>{' '}
                      {action.action}
                    </div>

                    {/* Expandable Evidence Table */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                          <Info className="w-3.5 h-3.5" />
                          Quantitative Evidence &amp; Calculation Basis:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {action.evidence.map((ev, i) => (
                            <div
                              key={i}
                              className="bg-white border border-slate-200 rounded-lg p-2 text-xs"
                            >
                              <span className="text-[10px] text-slate-500 block truncate">
                                {ev.label}
                              </span>
                              <span className="font-bold text-slate-800">{ev.value}</span>
                              {ev.calculationBasis ? (
                                <span className="text-[10px] text-blue-600 block mt-0.5">
                                  {ev.calculationBasis}
                                </span>
                              ) : ev.benchmark ? (
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  Ref: {ev.benchmark}
                                </span>
                              ) : null}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Workflow Buttons */}
                <div className="flex flex-wrap items-center lg:flex-col lg:items-end gap-2 shrink-0 pt-2 lg:pt-0">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : action.id)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 px-2 py-1 rounded"
                    >
                      {isExpanded ? 'Hide Data' : 'Evidence'}
                    </button>

                    <button
                      onClick={() => setSelectedActionForReview(action)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-2xs flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Details</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!isApproved && !isDone && (
                      <button
                        onClick={(e) => handleQuickApprove(action.id, e)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                      >
                        Approve
                      </button>
                    )}

                    <button
                      onClick={(e) => handleQuickComplete(action.id, e)}
                      disabled={isDone}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Review Modal */}
      <ActionReviewModal
        action={selectedActionForReview}
        profile={profile}
        isOpen={Boolean(selectedActionForReview)}
        onClose={() => setSelectedActionForReview(null)}
        onUpdateActionStatus={handleUpdateStatus}
      />
    </div>
  );
};
