import React, { useState } from 'react';
import { RecommendedAction, BusinessProfile, ActionApprovalStatus } from '../types';
import {
  X,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Copy,
  Check,
  Calendar,
  User,
  FileText,
  Clock,
  ShieldCheck,
  Zap,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActionReviewModalProps {
  action: RecommendedAction | null;
  profile: BusinessProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdateActionStatus: (
    actionId: string,
    status: ActionApprovalStatus,
    notes?: string,
    taskDate?: string
  ) => void;
}

export const ActionReviewModal: React.FC<ActionReviewModalProps> = ({
  action,
  profile,
  isOpen,
  onClose,
  onUpdateActionStatus,
}) => {
  const [currentStatus, setCurrentStatus] = useState<ActionApprovalStatus>(
    action?.approvalStatus || 'pending_review'
  );
  const [userNotes, setUserNotes] = useState<string>(action?.userNotes || '');
  const [taskDueDate, setTaskDueDate] = useState<string>(
    action?.createdTaskDate || '2026-08-27'
  );
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'task' | 'export'>('details');

  if (!isOpen || !action) return null;

  const handleApprove = () => {
    setCurrentStatus('approved');
    onUpdateActionStatus(action.id, 'approved', userNotes, taskDueDate);
  };

  const handleCreateTask = () => {
    setCurrentStatus('task_created');
    onUpdateActionStatus(action.id, 'task_created', userNotes, taskDueDate);
    setActiveTab('task');
  };

  const handleMarkComplete = () => {
    setCurrentStatus('completed');
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    onUpdateActionStatus(action.id, 'completed', userNotes, taskDueDate);
  };

  const handleCopyActionBrief = () => {
    const briefText = `[VEAIVEX ACTION BRIEF]\nTitle: ${action.title}\nCategory: ${action.category}\nPriority: ${action.priority.toUpperCase()}\n\nOperational Action:\n${action.action}\n\nEvidence & Basis:\n${action.evidence.map((e) => `- ${e.label}: ${e.value} (Basis: ${e.calculationBasis || e.benchmark || 'Verified data'})`).join('\n')}\n\nExpected Impact:\n${action.potentialImpact}\n\nNotes / Assignee Instructions:\n${userNotes || 'Standard SOP execution'}`;
    navigator.clipboard.writeText(briefText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 p-5 sm:p-6 flex items-start justify-between gap-3 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Action Review &amp; Approval Engine
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  currentStatus === 'completed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : currentStatus === 'approved'
                    ? 'bg-blue-100 text-blue-800'
                    : currentStatus === 'task_created'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                Status: {currentStatus.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mt-1">
              {action.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 border-b border-slate-100 flex items-center gap-4 text-xs font-bold text-slate-600 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            1. Evidence &amp; Impact
          </button>
          <button
            onClick={() => setActiveTab('task')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'task'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            2. Task Assignment
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'export'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            3. Export &amp; Share
          </button>
        </div>

        {/* Body Content based on Tab */}
        <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
          {activeTab === 'details' && (
            <>
              {/* Prescriptive Operational Action */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block mb-1">
                  Prescriptive Operational Action
                </span>
                <p className="text-slate-900 font-medium leading-relaxed">{action.action}</p>
              </div>

              {/* Underlying Reason */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                  Analytical Justification &amp; Root Cause
                </span>
                <p className="text-slate-700 leading-relaxed">{action.reason}</p>
              </div>

              {/* Data Evidence & Quantitative Proof */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Quantitative Evidence &amp; Calculation Basis
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {action.evidence.map((ev, i) => (
                    <div
                      key={i}
                      className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs text-xs"
                    >
                      <span className="text-[10px] text-slate-400 block truncate">{ev.label}</span>
                      <span className="font-bold text-slate-900 block mt-0.5">{ev.value}</span>
                      {ev.calculationBasis ? (
                        <span className="text-[10px] text-blue-600 block mt-1">
                          Basis: {ev.calculationBasis}
                        </span>
                      ) : ev.benchmark ? (
                        <span className="text-[10px] text-slate-500 block mt-1">
                          Ref: {ev.benchmark}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Commercial Impact */}
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-emerald-900 block">Expected Business Outcome:</span>
                  <span className="text-emerald-800">{action.potentialImpact}</span>
                </div>
                <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0 text-[11px]">
                  Verified Projection
                </span>
              </div>
            </>
          )}

          {activeTab === 'task' && (
            <div className="space-y-4">
              <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-4 text-xs">
                <span className="font-bold text-purple-900 block mb-1">
                  Assign to Operational Workflow
                </span>
                <p className="text-purple-800">
                  Assign this recommendation as a formal team task. VEAIVEX maintains an audit
                  trail of approvals and completion confirmations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Operational Owner
                  </label>
                  <input
                    type="text"
                    defaultValue={`${profile.ownerName} (Store Manager)`}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Execution Notes &amp; Instructions
                </label>
                <textarea
                  rows={3}
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="e.g. Call Premier Commodities and confirm Friday 9am delivery window before issuing payment."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={handleCreateTask}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-xs"
                >
                  Save Task to Board
                </button>
              </div>
            </div>
          )}

          {activeTab === 'export' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Copy structured brief for WhatsApp dispatch, purchase orders, or team standups.
              </p>

              <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs max-h-48 overflow-y-auto leading-relaxed border border-slate-800">
                <p className="text-blue-400 font-bold">[VEAIVEX ACTION BRIEF]</p>
                <p>Title: {action.title}</p>
                <p>Category: {action.category}</p>
                <p>Priority: {action.priority.toUpperCase()}</p>
                <p className="mt-2 text-slate-400">Action Plan:</p>
                <p>{action.action}</p>
                <p className="mt-2 text-slate-400">Impact:</p>
                <p>{action.potentialImpact}</p>
              </div>

              <button
                onClick={handleCopyActionBrief}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{isCopied ? 'Copied to Clipboard' : 'Copy Formatted Brief'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Workflow Buttons (Recommendation → Review → Approve → Create Task → Mark Complete) */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Audit Trail: Human Approval Required</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentStatus !== 'approved' && currentStatus !== 'completed' && (
              <button
                onClick={handleApprove}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                Approve Action
              </button>
            )}

            {currentStatus !== 'task_created' && currentStatus !== 'completed' && (
              <button
                onClick={() => {
                  setActiveTab('task');
                  handleCreateTask();
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors"
              >
                Create Task
              </button>
            )}

            {currentStatus !== 'completed' ? (
              <button
                onClick={handleMarkComplete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Completed</span>
              </button>
            ) : (
              <span className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Action Completed</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
