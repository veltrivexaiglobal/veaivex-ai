import React, { useState } from 'react';
import {
  Wallet,
  PlusCircle,
  Send,
  Eye,
  EyeOff,
  Copy,
  Check,
  Zap,
  Smartphone,
  Tv,
  Lightbulb,
  GraduationCap,
  Users,
  PiggyBank,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  Gift,
  Server,
  Receipt,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNaira, formatDate } from '../../utils';
import { NetworkBadge } from '../common/NetworkBadge';
import { Transaction } from '../../types';

export const HomeView: React.FC = () => {
  const {
    user,
    transactions,
    dataPlans,
    savingsGoals,
    setActiveTab,
    setSelectedReceiptTx,
    buyData,
  } = useApp();

  const [showBalance, setShowBalance] = useState(true);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [isQuickBuying, setIsQuickBuying] = useState(false);

  const copyVirtualAccount = () => {
    navigator.clipboard.writeText(user.virtualAccount.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // Recommended SME bundle for quick 1-tap reorder
  const recommendedPlan = dataPlans.find((p) => p.id === 'mtn-sme-5') || dataPlans[0];

  const handleQuickBuyRecommendation = async () => {
    setIsQuickBuying(true);
    const res = await buyData({
      network: recommendedPlan.network,
      phone: user.phone,
      plan: recommendedPlan,
    });
    setIsQuickBuying(false);
    if (res.success && res.transaction) {
      setSelectedReceiptTx(res.transaction);
    }
  };

  const recentTransactions = transactions.slice(0, 5);

  const services = [
    {
      id: 'data',
      name: 'Buy Data',
      desc: 'SME & Direct from ₦260',
      icon: Zap,
      badge: 'Save 50%',
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      action: () => setActiveTab('data'),
    },
    {
      id: 'airtime',
      name: 'Airtime',
      desc: 'Instant 2% Discount',
      icon: Smartphone,
      badge: '2% Off',
      iconBg: 'bg-amber-50 text-amber-700 border-amber-200',
      action: () => setActiveTab('airtime'),
    },
    {
      id: 'electricity',
      name: 'Electricity',
      desc: 'Prepaid Token & Postpaid',
      icon: Lightbulb,
      iconBg: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      action: () => setActiveTab('bills'),
    },
    {
      id: 'cable',
      name: 'Cable TV',
      desc: 'DStv, GOtv, StarTimes',
      icon: Tv,
      iconBg: 'bg-blue-50 text-blue-700 border-blue-200',
      action: () => setActiveTab('bills'),
    },
    {
      id: 'education',
      name: 'Exam PINs',
      desc: 'WAEC, JAMB, NECO',
      icon: GraduationCap,
      badge: 'Instant',
      iconBg: 'bg-purple-50 text-purple-700 border-purple-200',
      action: () => setActiveTab('bills'),
    },
    {
      id: 'group_data',
      name: 'Family Data',
      desc: 'Batch multi-line topup',
      icon: Users,
      iconBg: 'bg-teal-50 text-teal-700 border-teal-200',
      action: () => setActiveTab('group_data'),
    },
    {
      id: 'savings',
      name: 'Target Vault',
      desc: 'Auto-save bill budgets',
      icon: PiggyBank,
      iconBg: 'bg-rose-50 text-rose-700 border-rose-200',
      action: () => setActiveTab('insights'),
    },
    {
      id: 'rewards',
      name: 'Rewards',
      desc: `${user.loyaltyPoints} points available`,
      icon: Gift,
      iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      action: () => setActiveTab('rewards'),
    },
  ];

  return (
    <div className="space-y-5 pb-12">
      {/* 1. Wallet Hero Card - Clean Bank Grade Design */}
      <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Balance Details */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
              <span>Available Wallet Balance</span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-slate-400 hover:text-slate-700 transition p-1"
                aria-label="Toggle Balance Visibility"
              >
                {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
                {showBalance ? formatNaira(user.walletBalance) : '₦ ••••••••'}
              </span>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                Tier {user.loyaltyTier}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <div>
                Commission Earned:{' '}
                <span className="font-semibold text-slate-800">
                  {showBalance ? formatNaira(user.commissionBalance) : '₦ •••'}
                </span>
              </div>
              <div className="h-3 w-px bg-slate-200" />
              <div>
                Loyalty Points:{' '}
                <span className="font-semibold text-emerald-700 font-mono">
                  {user.loyaltyPoints} pts
                </span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setActiveTab('wallet')}
              className="flex-1 sm:flex-none h-11 sm:h-12 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Fund Wallet</span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className="flex-1 sm:flex-none h-11 sm:h-12 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-200 flex items-center justify-center gap-2 transition"
            >
              <Send className="w-4 h-4 text-slate-600" />
              <span>Transfer</span>
            </button>
          </div>
        </div>

        {/* Dedicated Virtual Account Info Box */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-[11px] shrink-0 shadow-xs">
              NUBAN
            </div>
            <div>
              <p className="text-[11px] text-slate-500">
                Instant Automatic Top-up via Bank Transfer ({user.virtualAccount.bankName})
              </p>
              <p className="font-mono font-bold text-slate-900 text-sm tracking-wider">
                {user.virtualAccount.accountNumber}
              </p>
            </div>
          </div>

          <button
            onClick={copyVirtualAccount}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition shadow-xs"
          >
            {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copiedAccount ? 'Copied Account' : 'Copy Number'}</span>
          </button>
        </div>
      </div>

      {/* 2. Core Digital Services Grid - Mobile First 4-Column Layout */}
      <div>
        <div className="flex items-center justify-between mb-3 px-0.5">
          <h2 className="text-sm font-bold text-slate-900 font-display">Services & Utilities</h2>
          <span className="text-[11px] text-slate-500">Instant Delivery Guaranteed</span>
        </div>

        {/* Android / Mobile Grid: 4 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <button
                key={srv.id}
                onClick={srv.action}
                className="group p-2.5 sm:p-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-center sm:text-left transition flex flex-col items-center sm:items-start justify-between min-h-[96px] sm:h-32 relative overflow-hidden shadow-xs"
              >
                {srv.badge && (
                  <span className="hidden sm:block absolute top-2.5 right-2.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {srv.badge}
                  </span>
                )}

                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center ${srv.iconBg} shrink-0`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <div className="mt-1.5 sm:mt-0 w-full">
                  <h4 className="text-[11px] sm:text-sm font-bold text-slate-800 group-hover:text-slate-900 transition truncate">
                    {srv.name}
                  </h4>
                  <p className="hidden sm:block text-[11px] text-slate-500 mt-0.5 truncate">{srv.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Reorder & Fast Top-up Widget */}
      <div className="rounded-3xl bg-white border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
              Frequent Recharge
            </span>
            <span className="text-xs font-semibold text-emerald-700 font-mono">
              Save ₦350 vs Telco Price
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900">
            {recommendedPlan.name} ({recommendedPlan.validity}) for {user.phone}
          </h3>
          <p className="text-xs text-slate-500">
            1-step instant recharge without filling forms again.
          </p>
        </div>

        <button
          onClick={handleQuickBuyRecommendation}
          disabled={isQuickBuying}
          className="shrink-0 h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
        >
          {isQuickBuying ? (
            <>
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Reorder ({formatNaira(recommendedPlan.price)})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* 4. Spending Budget & Target Savings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Spending Progress */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 font-display">Monthly Spending Target</h3>
            </div>
            <button
              onClick={() => setActiveTab('insights')}
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              View Analytics
            </button>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-500">Spent: {formatNaira(user.currentMonthlySpend)}</span>
              <span className="text-slate-500">Limit: {formatNaira(user.monthlySpendingLimit)}</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((user.currentMonthlySpend / user.monthlySpendingLimit) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            Telecom and utility expenses are currently within your budgeted monthly allocation.
          </p>
        </div>

        {/* Target Savings Vault Preview */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900 font-display">Target Savings Vault</h3>
            </div>
            <button
              onClick={() => setActiveTab('insights')}
              className="text-xs font-semibold text-rose-600 hover:underline"
            >
              Manage Vault
            </button>
          </div>

          {savingsGoals.length > 0 ? (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold text-slate-800">{savingsGoals[0].title}</span>
                <span className="font-mono text-rose-700 font-bold">
                  {formatNaira(savingsGoals[0].currentAmount)} / {formatNaira(savingsGoals[0].targetAmount)}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{
                    width: `${Math.min((savingsGoals[0].currentAmount / savingsGoals[0].targetAmount) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">No active savings goal created yet.</p>
          )}

          <p className="text-[11px] text-slate-500">
            Lock monthly data budget in advance to avoid impulsive overdrafts.
          </p>
        </div>
      </div>

      {/* 5. Developer & Backend API Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-slate-200">Express Backend API Active</span>
              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                PORT 3000
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Live VTU routing, Disco meter validation, and transaction telemetry endpoints.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('backend')}
          className="h-9 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700 shrink-0"
        >
          <span>Open Backend Console</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6. Recent Transactions List */}
      <div>
        <div className="flex items-center justify-between mb-3 px-0.5">
          <h2 className="text-sm font-bold text-slate-900 font-display">Recent Activity</h2>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
          >
            <span>All History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentTransactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => setSelectedReceiptTx(tx)}
              className="p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 transition flex items-center justify-between gap-3 cursor-pointer shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                  {tx.type === 'data' && <Zap className="w-4 h-4 text-emerald-600" />}
                  {tx.type === 'airtime' && <Smartphone className="w-4 h-4 text-amber-500" />}
                  {tx.type === 'electricity' && <Lightbulb className="w-4 h-4 text-amber-600" />}
                  {tx.type === 'cable' && <Tv className="w-4 h-4 text-blue-600" />}
                  {tx.type === 'wallet_fund' && <Wallet className="w-4 h-4 text-teal-600" />}
                  {tx.type === 'education' && <GraduationCap className="w-4 h-4 text-purple-600" />}
                  {tx.type === 'savings_deposit' && <PiggyBank className="w-4 h-4 text-rose-600" />}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-800 capitalize truncate">
                      {tx.metadata.planName || tx.type.replace('_', ' ')}
                    </h4>
                    {tx.metadata.network && <NetworkBadge network={tx.metadata.network} size="sm" />}
                  </div>
                  <p className="text-[11px] text-slate-500 truncate font-mono mt-0.5">
                    {tx.metadata.recipientPhone || tx.metadata.meterNumber || tx.reference}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p
                  className={`text-xs font-bold font-mono ${
                    tx.type === 'wallet_fund' || tx.type === 'refund'
                      ? 'text-emerald-600'
                      : 'text-slate-900'
                  }`}
                >
                  {tx.type === 'wallet_fund' || tx.type === 'refund' ? '+' : '-'}
                  {formatNaira(tx.finalAmount)}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(tx.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
