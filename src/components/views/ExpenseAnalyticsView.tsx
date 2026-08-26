import React from 'react';
import { ExpenseRecord, BusinessProfile, BusinessMetrics } from '../../types';
import { formatCurrency } from '../../lib/biEngine';
import {
  Receipt,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  Zap,
  ArrowRight,
  Flame,
  Truck,
  Building2,
  Users,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

interface ExpenseAnalyticsViewProps {
  expenses: ExpenseRecord[];
  profile: BusinessProfile;
  metrics: BusinessMetrics;
  onNavigate: (view: string) => void;
}

export const ExpenseAnalyticsView: React.FC<ExpenseAnalyticsViewProps> = ({
  expenses,
  profile,
  metrics,
  onNavigate,
}) => {
  const curr = profile.currency;

  // August 2026 expenses
  const currentExpenses = expenses.filter((e) => e.date.startsWith('2026-08'));

  // Category map
  const categoryMap = new Map<string, { amount: number; isAnomaly?: boolean }>();
  currentExpenses.forEach((e) => {
    const existing = categoryMap.get(e.category) || { amount: 0, isAnomaly: false };
    existing.amount += e.amount;
    if (e.isAnomaly) existing.isAnomaly = true;
    categoryMap.set(e.category, existing);
  });

  const categoryChartData = Array.from(categoryMap.entries()).map(([category, val]) => ({
    category: category.length > 18 ? category.slice(0, 18) + '...' : category,
    fullName: category,
    amount: val.amount,
    isAnomaly: val.isAnomaly,
  })).sort((a, b) => b.amount - a.amount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Expense Intelligence &amp; Cost Control
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
              +{metrics.expenseGrowthMoM.toFixed(1)}% MoM
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Detect irregular overhead spikes, audit recurring bills, and recover profit margins
          </p>
        </div>

        <button
          onClick={() => onNavigate('ask-veaivex')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI About Expenses</span>
        </button>
      </div>

      {/* Detected Anomaly Focus Box */}
      <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-rose-900 text-white rounded-2xl p-5 sm:p-6 border border-rose-800/80 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-rose-800/60">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              CRITICAL EXPENSE ANOMALIES DETECTED
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/40 uppercase">
            96% AI Confidence
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Fuel Anomaly */}
          <div className="bg-black/30 border border-rose-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-rose-300">1. Generator Diesel Fuel (+146.8%)</span>
              <span className="text-rose-400 font-extrabold">{formatCurrency(395000, curr)}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              <strong>Root Cause:</strong> Grid electricity outage required running the 30kVA diesel plant for 14 hours/day during high fuel pricing.
            </p>
            <p className="text-emerald-300 mt-2 font-medium">
              <strong>Recommended Action:</strong> Enforce load-shedding during slow afternoon lull (1:00 PM - 3:30 PM) to save ~₦115,000/month.
            </p>
          </div>

          {/* Dispatch Logistics Anomaly */}
          <div className="bg-black/30 border border-amber-500/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-amber-300">2. Dispatch &amp; Logistics Freight (+73.3%)</span>
              <span className="text-amber-400 font-extrabold">{formatCurrency(260000, curr)}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              <strong>Root Cause:</strong> Ad-hoc individual customer dispatches caused inefficient van trips and fuel surcharges.
            </p>
            <p className="text-emerald-300 mt-2 font-medium">
              <strong>Recommended Action:</strong> Batch deliveries into 2 fixed daily departure runs (11:00 AM &amp; 4:00 PM) to reduce dispatch runs by 40%.
            </p>
          </div>
        </div>
      </div>

      {/* Expense Category Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Monthly Overhead by Cost Center
            </h3>
            <p className="text-xs text-slate-500">
              Breakdown of all {currentExpenses.length} expense allocations for August 2026
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} angle={-15} textAnchor="end" />
              <YAxis
                stroke="#94a3b8"
                fontSize={10}
                tickFormatter={(val) => formatCurrency(val, curr)}
              />
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val), curr), 'Total Expense']}
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {categoryChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isAnomaly ? '#dc2626' : '#2563eb'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expense Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
          Operating Expense Records (August 2026)
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          All logged overhead line items
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {currentExpenses.map((exp) => (
                <tr
                  key={exp.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    exp.isAnomaly ? 'bg-rose-50/40' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-medium text-slate-500 whitespace-nowrap">
                    {exp.date}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      {exp.isAnomaly && <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                      {exp.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                    {exp.description}
                  </td>
                  <td className="py-2.5 px-3">
                    {exp.isAnomaly ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        Anomaly (+{exp.varianceMoM}%)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                        {exp.isRecurring ? 'Recurring' : 'One-Off'}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right font-black text-slate-900">
                    {formatCurrency(exp.amount, curr)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
