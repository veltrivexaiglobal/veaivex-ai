import React, { useState } from 'react';
import {
  TrendingUp,
  PieChart,
  PiggyBank,
  Plus,
  Lock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Zap,
  BarChart3,
  ShieldCheck,
  Target,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNaira } from '../../utils';

export const SmartInsightsView: React.FC = () => {
  const { user, savingsGoals, createSavingsGoal, topUpSavingsGoal, setActiveTab } = useApp();

  // Savings Goal Modal / Form State
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTargetAmount, setGoalTargetAmount] = useState<number>(10000);
  const [goalCategory, setGoalCategory] = useState<'data' | 'bills' | 'general'>('data');
  const [goalLockUntil, setGoalLockUntil] = useState('2026-10-31');

  // Quick Deposit State
  const [selectedGoalForDeposit, setSelectedGoalForDeposit] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<number>(2000);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim() || goalTargetAmount <= 0) {
      setErrorMessage('Please provide a goal title and target amount.');
      return;
    }

    createSavingsGoal({
      title: goalTitle,
      targetAmount: goalTargetAmount,
      category: goalCategory,
      lockUntil: goalLockUntil,
    });

    setShowNewGoalModal(false);
    setGoalTitle('');
    setGoalTargetAmount(10000);
    setSuccessMessage('New Target Savings Vault created successfully!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleDeposit = async (goalId: string) => {
    if (depositAmount <= 0) return;
    if (user.walletBalance < depositAmount) {
      setErrorMessage('Insufficient wallet balance for this deposit.');
      return;
    }

    const res = await topUpSavingsGoal(goalId, depositAmount);
    if (res.success) {
      setSelectedGoalForDeposit(null);
      setSuccessMessage(res.message);
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setErrorMessage(res.message);
    }
  };

  // Spending Breakdown categories
  const spendingCategories = [
    { name: 'Mobile Data (SME & Direct)', amount: 6200, pct: 54, color: 'bg-emerald-600' },
    { name: 'Airtime Top-ups', amount: 2800, pct: 24, color: 'bg-amber-500' },
    { name: 'Electricity NEPA Bills', amount: 2000, pct: 17, color: 'bg-yellow-500' },
    { name: 'Cable TV & Education', amount: 550, pct: 5, color: 'bg-blue-600' },
  ];

  // Weekly spending bars
  const weeklySpend = [
    { day: 'Mon', amount: 1200 },
    { day: 'Tue', amount: 450 },
    { day: 'Wed', amount: 2400 },
    { day: 'Thu', amount: 980 },
    { day: 'Fri', amount: 3500 },
    { day: 'Sat', amount: 1800 },
    { day: 'Sun', amount: 1120 },
  ];

  const maxWeeklySpend = Math.max(...weeklySpend.map((w) => w.amount));

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
            Spending Analytics & Target Vault
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Data usage forecasting, expense breakdown, and dedicated utility savings
          </p>
        </div>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. Telco Spend Optimizer Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <Target className="w-3 h-3 text-emerald-400" />
            Telecom Plan Optimization
          </span>
          <span className="text-xs text-slate-400">Consumption Rate Analysis</span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white font-display">
          Estimated Data Exhaustion: In ~9 Days
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
          Based on your average consumption rate of ~180MB/day on MTN line 08031234567, you will likely need a data top-up before the 25th of this month. By switching your next 5GB recharge from Direct Telecom to SME Data, you will save <strong className="text-emerald-400">₦350.00</strong>.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('data')}
            className="h-10 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition"
          >
            <span>Browse SME Bundles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Spending Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weekly Spending Bar Chart */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 font-display">Weekly Spending Trend</h3>
            <span className="text-xs text-emerald-700 font-mono font-bold">
              Total: {formatNaira(user.currentMonthlySpend)}
            </span>
          </div>

          <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2">
            {weeklySpend.map((w) => {
              const heightPct = (w.amount / maxWeeklySpend) * 100;
              return (
                <div key={w.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full h-28 flex items-end justify-center">
                    <div
                      className="w-full max-w-[28px] bg-emerald-600 group-hover:bg-emerald-500 rounded-t-lg transition-all"
                      style={{ height: `${Math.max(heightPct, 15)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{w.day}</span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            Peak telecom expenditure observed on Fridays & Wednesdays.
          </p>
        </div>

        {/* Category Breakdown */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 font-display">Spending by Category</h3>
            <span className="text-xs text-slate-500">This Month</span>
          </div>

          <div className="space-y-3 pt-1">
            {spendingCategories.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-medium">{cat.name}</span>
                  <span className="text-slate-900 font-mono font-semibold">
                    {formatNaira(cat.amount)} ({cat.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Target Savings Vaults Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-rose-600" />
              Target Savings Vaults
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Lock money away specifically for your monthly data or utility bills
            </p>
          </div>

          <button
            onClick={() => setShowNewGoalModal(true)}
            className="h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Create Vault</span>
          </button>
        </div>

        {/* List of active Savings Goals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savingsGoals.map((goal) => {
            const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            return (
              <div
                key={goal.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      {goal.category} VAULT
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1.5">{goal.title}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Lock className="w-3 h-3 text-slate-400" />
                      Locked until {goal.lockUntil}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-bold text-slate-900 font-mono">
                      {formatNaira(goal.currentAmount)}
                    </span>
                    <p className="text-[11px] text-slate-500">Target: {formatNaira(goal.targetAmount)}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">{progress.toFixed(0)}% Saved</span>
                    <span className="text-rose-700 font-semibold">
                      {formatNaira(goal.targetAmount - goal.currentAmount)} remaining
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-rose-600 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Deposit action trigger */}
                {selectedGoalForDeposit === goal.id ? (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        className="flex-1 h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeposit(goal.id)}
                        className="h-9 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                      >
                        Deposit
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedGoalForDeposit(null)}
                        className="h-9 px-2 rounded-lg bg-slate-200 text-slate-700 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedGoalForDeposit(goal.id)}
                    className="w-full h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-rose-600" />
                    <span>Top-up This Vault</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Goal Modal */}
      {showNewGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display">Create Target Savings Vault</h3>

            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Vault Title / Purpose
                </label>
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Next Month Data Budget"
                  required
                  className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-rose-500 shadow-xs placeholder-slate-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Target Amount (₦)
                </label>
                <input
                  type="number"
                  value={goalTargetAmount}
                  onChange={(e) => setGoalTargetAmount(Number(e.target.value))}
                  required
                  className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 font-mono outline-none focus:border-rose-500 shadow-xs placeholder-slate-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Lock Until Date
                </label>
                <input
                  type="date"
                  value={goalLockUntil}
                  onChange={(e) => setGoalLockUntil(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-rose-500 shadow-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
                >
                  Create Vault
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewGoalModal(false)}
                  className="px-4 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
