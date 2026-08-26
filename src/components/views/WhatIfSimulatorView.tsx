import React, { useState } from 'react';
import { BusinessProfile, BusinessMetrics } from '../../types';
import { formatCurrency } from '../../lib/biEngine';
import {
  Sliders,
  Sparkles,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Zap,
  RotateCcw,
  CheckCircle,
  HelpCircle,
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
} from 'recharts';

interface WhatIfSimulatorViewProps {
  profile: BusinessProfile;
  metrics: BusinessMetrics;
  onNavigate: (view: string) => void;
}

export const WhatIfSimulatorView: React.FC<WhatIfSimulatorViewProps> = ({
  profile,
  metrics,
  onNavigate,
}) => {
  const curr = profile.currency;

  // Base actuals
  const baseRevenue = metrics.totalRevenue;
  const baseExpenses = metrics.totalExpenses;
  const baseProfit = metrics.totalProfit;

  // Simulation Sliders
  const [priceChangePct, setPriceChangePct] = useState<number>(5); // e.g. +5% price adjustment
  const [volumeElasticityPct, setVolumeElasticityPct] = useState<number>(-2); // volume change due to price
  const [expenseCutPct, setExpenseCutPct] = useState<number>(10); // e.g. 10% expense optimization
  const [customerReengagedCount, setCustomerReengagedCount] = useState<number>(4); // win back 4 inactive clients
  const [marketingBudget, setMarketingBudget] = useState<number>(50000); // ₦50,000 promo investment

  // Calculate Simulated Metrics
  const priceMultiplier = 1 + priceChangePct / 100;
  const volumeMultiplier = 1 + volumeElasticityPct / 100;
  const reengagedRevenueGain = customerReengagedCount * 140000; // avg spend ~₦140k
  const reengagedCost = customerReengagedCount * 95000;

  const simulatedRevenue = baseRevenue * priceMultiplier * volumeMultiplier + reengagedRevenueGain;
  const simulatedExpense = baseExpenses * (1 - expenseCutPct / 100) + marketingBudget;
  const simulatedCOGS = (metrics.totalRevenue - (metrics.totalRevenue * (metrics.grossMarginPct / 100))) * volumeMultiplier + reengagedCost;
  const simulatedGrossProfit = simulatedRevenue - simulatedCOGS;
  const simulatedNetProfit = simulatedGrossProfit - simulatedExpense;
  const simulatedMarginPct = simulatedRevenue > 0 ? (simulatedNetProfit / simulatedRevenue) * 100 : 0;

  const profitDifference = simulatedNetProfit - baseProfit;
  const revenueDifference = simulatedRevenue - baseRevenue;

  const chartComparison = [
    {
      metric: 'Revenue',
      Actual: baseRevenue,
      Simulated: Math.round(simulatedRevenue),
    },
    {
      metric: 'Expenses',
      Actual: baseExpenses,
      Simulated: Math.round(simulatedExpense),
    },
    {
      metric: 'Net Profit',
      Actual: baseProfit,
      Simulated: Math.round(simulatedNetProfit),
    },
  ];

  const handleReset = () => {
    setPriceChangePct(0);
    setVolumeElasticityPct(0);
    setExpenseCutPct(0);
    setCustomerReengagedCount(0);
    setMarketingBudget(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              What-If Scenario Simulator
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Interactive Decision Sandbox
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Model the financial impact of price adjustments, expense cuts, and customer win-backs before executing
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sliders</span>
        </button>
      </div>

      {/* Impact KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Simulated Revenue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Simulated Revenue
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {formatCurrency(simulatedRevenue, curr)}
            </span>
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                revenueDifference >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
              }`}
            >
              {revenueDifference >= 0 ? '+' : ''}
              {formatCurrency(revenueDifference, curr)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            vs. current actuals of {formatCurrency(baseRevenue, curr)}
          </p>
        </div>

        {/* Simulated Net Profit */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Simulated Net Profit
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {formatCurrency(simulatedNetProfit, curr)}
            </span>
            <span
              className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                profitDifference >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
              }`}
            >
              {profitDifference >= 0 ? '+' : ''}
              {formatCurrency(profitDifference, curr)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Bottom-line profit gain for the business owner
          </p>
        </div>

        {/* Simulated Net Margin */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Simulated Net Margin
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {simulatedMarginPct.toFixed(1)}%
            </span>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
              Base: {metrics.profitMarginPct.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Target benchmark: {profile.targetMarginPct}%
          </p>
        </div>
      </div>

      {/* Simulator Control Sliders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Container */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 tracking-tight pb-2 border-b border-slate-100">
            Scenario Levers &amp; Operational Controls
          </h3>

          {/* Lever 1: Price Adjustment */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">1. Product Price Adjustment</span>
              <span className="text-blue-700 font-bold">
                {priceChangePct > 0 ? `+${priceChangePct}%` : `${priceChangePct}%`}
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="30"
              step="1"
              value={priceChangePct}
              onChange={(e) => setPriceChangePct(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Simulate selective price hikes across high-margin staples.
            </span>
          </div>

          {/* Lever 2: Expense Reduction */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">2. Overhead Expense Reduction</span>
              <span className="text-emerald-700 font-bold">-{expenseCutPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={expenseCutPct}
              onChange={(e) => setExpenseCutPct(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Cutting generator diesel hours and optimizing batch delivery routes.
            </span>
          </div>

          {/* Lever 3: Win Back Inactive Accounts */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">3. Re-engage Inactive Wholesale Customers</span>
              <span className="text-purple-700 font-bold">+{customerReengagedCount} Clients</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={customerReengagedCount}
              onChange={(e) => setCustomerReengagedCount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Expected revenue increment: +{formatCurrency(reengagedRevenueGain, curr)}
            </span>
          </div>

          {/* Lever 4: Marketing / Promotion Budget */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">4. WhatsApp / Local Promo Budget</span>
              <span className="text-slate-900 font-bold">{formatCurrency(marketingBudget, curr)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              step="10000"
              value={marketingBudget}
              onChange={(e) => setMarketingBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
            />
          </div>
        </div>

        {/* Chart Comparison */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
              Actual vs. Simulated Projections
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Real-time model variance based on active scenario levers
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartComparison} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={10}
                    tickFormatter={(val) => formatCurrency(val, curr)}
                  />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val), curr), '']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="Actual" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Simulated" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Scenario Insight:</span> Implementing a +5% price adjustment combined with a 10% reduction in diesel utility costs would increase your monthly net take-home cash by{' '}
              <strong className="text-purple-950 font-black">+{formatCurrency(profitDifference, curr)}</strong> without impacting customer retention.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
