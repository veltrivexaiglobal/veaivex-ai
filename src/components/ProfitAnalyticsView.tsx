import React from 'react';
import { SaleRecord, ExpenseRecord, BusinessProfile, BusinessMetrics } from '../../types';
import { formatCurrency } from '../../lib/biEngine';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Percent,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
} from 'recharts';

interface ProfitAnalyticsViewProps {
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
  profile: BusinessProfile;
  metrics: BusinessMetrics;
  onNavigate: (view: string) => void;
}

export const ProfitAnalyticsView: React.FC<ProfitAnalyticsViewProps> = ({
  sales,
  expenses,
  profile,
  metrics,
  onNavigate,
}) => {
  const curr = profile.currency;

  const profitWaterfall = [
    { stage: 'Gross Revenue', amount: metrics.totalRevenue, color: '#2563eb' },
    { stage: 'Cost of Goods (COGS)', amount: metrics.totalRevenue - (metrics.totalRevenue * (metrics.grossMarginPct / 100)), color: '#dc2626' },
    { stage: 'Gross Profit', amount: metrics.totalRevenue * (metrics.grossMarginPct / 100), color: '#059669' },
    { stage: 'Operating Overhead', amount: metrics.totalExpenses, color: '#e11d48' },
    { stage: 'Net Profit', amount: metrics.totalProfit, color: '#16a34a' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Profit &amp; Margin Diagnostics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Target: {profile.targetMarginPct}% Margin
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Understand gross vs net margins, cost leakage, and profit sustainability
          </p>
        </div>

        <button
          onClick={() => onNavigate('what-if')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs"
        >
          <Zap className="w-4 h-4" />
          <span>Simulate Pricing &amp; Margin</span>
        </button>
      </div>

      {/* Margin Anomaly Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1 text-xs">
          <h4 className="font-bold text-amber-900 text-sm">
            Margin Compression Detected: Net Margin down to {metrics.profitMarginPct.toFixed(1)}% (Target: {profile.targetMarginPct}%)
          </h4>
          <p className="text-amber-800 mt-1 leading-relaxed">
            While product gross margins are healthy at {metrics.grossMarginPct.toFixed(1)}%, operating expenses (specifically diesel generator fuel and dispatch logistics) increased by +18.2% MoM, eroding 4.4 percentage points of bottom-line profit.
          </p>
          <div className="mt-2.5 flex items-center gap-3">
            <button
              onClick={() => onNavigate('expense-analytics')}
              className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1"
            >
              <span>Examine Expense Spikes</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Key Metric Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Gross Margin
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {metrics.grossMarginPct.toFixed(1)}%
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Healthy
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Revenue minus direct cost of inventory
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Net Profit Margin
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {metrics.profitMarginPct.toFixed(1)}%
            </span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
              -4.4% vs July
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Profit retained after all operating overhead
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Net Profit (MTD)
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {formatCurrency(metrics.totalProfit, curr)}
            </span>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
              17.1% Conversion
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Current net cash generated this billing cycle
          </p>
        </div>
      </div>

      {/* Profit Breakdown Stages */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
          Revenue to Net Profit Decomposition
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Tracking how top-line revenue flows down into final owner take-home profit
        </p>

        <div className="space-y-3">
          {profitWaterfall.map((item) => (
            <div key={item.stage} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  {item.stage}
                </span>
                <span className="text-[11px] text-slate-500">
                  {item.stage.includes('COGS') || item.stage.includes('Overhead') ? 'Deduction' : 'Value Balance'}
                </span>
              </div>
              <span
                className="text-sm font-black"
                style={{ color: item.color }}
              >
                {formatCurrency(item.amount, curr)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
