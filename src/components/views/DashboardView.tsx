import React, { useState } from 'react';
import {
  SaleRecord,
  ExpenseRecord,
  ProductItem,
  CustomerRecord,
  BusinessProfile,
  BusinessMetrics,
  AnomalyAlert,
  RecommendedAction,
  DailyCeoBrief as DailyCeoBriefType,
  WhyInvestigation,
} from '../../types';
import {
  formatCurrency,
  calculateBusinessHealthScore,
  getWhyInvestigations,
  generateBusinessOpportunities,
} from '../../lib/biEngine';
import { BusinessHealthScoreCard } from '../BusinessHealthScoreCard';
import { WhyInvestigationModal } from '../WhyInvestigationModal';
import { OpportunityRadarSection } from '../OpportunityRadarSection';
import { DailyCeoBrief } from '../DailyCeoBrief';
import { TopActionsCard } from '../TopActionsCard';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  Users,
  Package,
  ShoppingCart,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Percent,
  CheckCircle,
  Activity,
  HelpCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DashboardViewProps {
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
  products: ProductItem[];
  customers: CustomerRecord[];
  profile: BusinessProfile;
  metrics: BusinessMetrics;
  anomalies: AnomalyAlert[];
  actions: RecommendedAction[];
  brief: DailyCeoBriefType;
  onNavigate: (view: string) => void;
  onOpenDemoGuide?: () => void;
  activePreset?: string;
  onSelectPreset?: (presetId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  sales,
  expenses,
  products,
  customers,
  profile,
  metrics,
  anomalies,
  actions,
  brief,
  onNavigate,
  onOpenDemoGuide,
  activePreset = 'fmcg',
  onSelectPreset,
}) => {
  const curr = profile.currency;
  const [selectedWhyInvestigation, setSelectedWhyInvestigation] = useState<WhyInvestigation | null>(null);

  // Derived health score & investigations from central engine
  const healthScore = calculateBusinessHealthScore(metrics, profile);
  const whyInvestigations = getWhyInvestigations(metrics, curr);
  const opportunities = generateBusinessOpportunities(sales, customers, curr);

  // Monthly aggregated trend data (June, July, August 2026 + September Forecast)
  const trendData = [
    { month: 'Jun 2026', revenue: 1844200, profit: 376200, expenses: 1100000, type: 'actual' },
    { month: 'Jul 2026', revenue: 2348500, profit: 513500, expenses: 1180000, type: 'actual' },
    { month: 'Aug 2026 (MTD)', revenue: 2447300, profit: 419200, expenses: 1393000, type: 'actual' },
    { month: 'Sep 2026 (Forecast)', revenue: 2780000, profit: 620000, expenses: 1220000, type: 'forecast' },
  ];

  // Category revenue breakdown
  const categoryMap = new Map<string, number>();
  sales.forEach((s) => {
    categoryMap.set(s.category, (categoryMap.get(s.category) || 0) + s.totalRevenue);
  });
  const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));
  const COLORS = ['#2563eb', '#0284c7', '#7c3aed', '#059669', '#d97706', '#dc2626'];

  const handleOpenWhy = (investigationKey: string) => {
    const inv = whyInvestigations[investigationKey] || whyInvestigations.profit_drop;
    setSelectedWhyInvestigation(inv);
  };

  return (
    <div className="space-y-6">
      {/* 10Alytics BuildFest 2026 Judge Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-blue-800/40 shadow-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-3 h-3 text-amber-300" />
                10Alytics Business AI BuildFest 2026
              </span>
              <span className="text-xs text-blue-200 font-medium">Business Solutions Track</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Autonomous Decision Intelligence &amp; BI Copilot for African &amp; Global SMEs
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Transforming raw POS &amp; expense ledgers into instant root-cause explanations (<span className="text-amber-300 font-semibold">&ldquo;Why did profit drop?&rdquo;</span>), stockout forecasts, and prioritized ROI actions in <span className="text-white font-semibold">Executive English</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="btn-pos-dashboard"
              onClick={() => onNavigate('pos-orders')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/20 transition-all hover:scale-105 active:scale-95 min-h-[44px]"
            >
              <ShoppingCart className="w-4 h-4 text-slate-950" />
              <span>POS &amp; Counter Sales</span>
            </button>

            {onOpenDemoGuide && (
              <button
                id="btn-judge-guide-dashboard"
                onClick={onOpenDemoGuide}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-950/20 transition-all hover:scale-105 active:scale-95 min-h-[44px]"
              >
                <HelpCircle className="w-4 h-4 text-slate-950" />
                <span>3-Min Judge Demo Guide</span>
              </button>
            )}

            <button
              id="btn-ask-veaivex-hero"
              onClick={() => onNavigate('ask-veaivex')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30 ring-1 ring-blue-400/40 transition-all hover:scale-105 active:scale-95 min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-blue-200" />
              <span>Ask VEAIVEX</span>
            </button>
          </div>
        </div>

        {/* 1-Click Interactive Preset Scenario Switcher */}
        {onSelectPreset && (
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Try Live SME Preset Scenarios:</span>
            <button
              onClick={() => onSelectPreset('fmcg')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all min-h-[36px] ${
                activePreset === 'fmcg'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🏪 FMCG Supermarket (NGN)
            </button>
            <button
              onClick={() => onSelectPreset('solar_tech')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all min-h-[36px] ${
                activePreset === 'solar_tech'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ⚡ Solar &amp; Tech Wholesale (USD)
            </button>
            <button
              onClick={() => onSelectPreset('pharmacy')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all min-h-[36px] ${
                activePreset === 'pharmacy'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              💊 Pharmacy &amp; Clinic Supply (NGN)
            </button>
          </div>
        )}
      </div>

      {/* 1. VEAIVEX Business Health Score (0 - 100 explainable score) */}
      <BusinessHealthScoreCard
        healthScore={healthScore}
        onOpenWhy={handleOpenWhy}
        onNavigate={onNavigate}
      />

      {/* KPI Cards Grid with Complete "Why?" Diagnostics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Revenue */}
        <div
          onClick={() => onNavigate('sales-analytics')}
          className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Revenue (MTD)
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenWhy('revenue_growth');
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                title="Investigate revenue acceleration drivers"
              >
                <HelpCircle className="w-3 h-3 text-emerald-600" />
                <span>Why?</span>
              </button>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {formatCurrency(metrics.totalRevenue, curr)}
              </span>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                +{metrics.revenueGrowthMoM.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 truncate">
              Target: {formatCurrency(profile.monthlyRevenueTarget, curr)}
            </span>
            <button
              onClick={() => onNavigate('sales-analytics')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
            >
              Trends &rarr;
            </button>
          </div>
        </div>

        {/* Net Profit with "Why?" Button */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Net Profit (MTD)
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenWhy('profit_drop');
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                title="Investigate root-cause of profit decline"
              >
                <HelpCircle className="w-3 h-3 text-rose-600" />
                <span>Why?</span>
              </button>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {formatCurrency(metrics.totalProfit, curr)}
              </span>
              <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                <TrendingDown className="w-3 h-3 mr-0.5" />
                {metrics.profitGrowthMoM.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">
              Margin: <strong className="text-slate-800">{metrics.profitMarginPct.toFixed(1)}%</strong>
            </span>
            <button
              onClick={() => onNavigate('profit-analytics')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
            >
              Analyze &rarr;
            </button>
          </div>
        </div>

        {/* Operating Expenses with "Why?" Button */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-rose-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Operating Expenses
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenWhy('expense_spike');
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                title="Investigate fuel & utility cost surge"
              >
                <HelpCircle className="w-3 h-3 text-rose-600" />
                <span>Why?</span>
              </button>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {formatCurrency(metrics.totalExpenses, curr)}
              </span>
              <span className="flex items-center text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                +{metrics.expenseGrowthMoM.toFixed(1)}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] text-rose-600 font-semibold truncate">
              Fuel spike: +146% MoM
            </span>
            <button
              onClick={() => onNavigate('expense-analytics')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
            >
              Ledger &rarr;
            </button>
          </div>
        </div>

        {/* Inventory Stock Health with "Why?" Button */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Inventory Health
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenWhy('inventory_risk');
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors"
                title="Investigate low staple coverage & stockout risks"
              >
                <HelpCircle className="w-3 h-3 text-amber-600" />
                <span>Why?</span>
              </button>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {metrics.inventoryHealthScore}/100
              </span>
              <span className="flex items-center text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                {metrics.criticalStockItemsCount} Critical Items
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-500">
              Valuation: {formatCurrency(metrics.inventoryValuation, curr)}
            </span>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
            >
              Restock &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Daily CEO Brief Section */}
      <DailyCeoBrief
        brief={brief}
        profile={profile}
        onNavigate={onNavigate}
      />

      {/* Top Prioritized Actions Card */}
      <TopActionsCard
        actions={actions}
        profile={profile}
        onNavigate={onNavigate}
      />

      {/* Business Opportunity Radar */}
      <OpportunityRadarSection
        opportunities={opportunities}
        profile={profile}
        onNavigate={onNavigate}
      />

      {/* Charts Row: Historical + Forecast Trend & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Revenue &amp; Net Profit Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Historical monthly performance with September 2026 probabilistic forecast
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="flex items-center gap-1 text-blue-600">
                <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
                Revenue
              </span>
              <span className="flex items-center gap-1 text-emerald-600 ml-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
                Net Profit
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => formatCurrency(val, curr)}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(Number(value), curr), '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                  name="Revenue"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorProfit)"
                  name="Net Profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Contribution Donut */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Revenue by Category
            </h3>
            <p className="text-xs text-slate-500 mb-2">
              Sales contribution across core product segments
            </p>

            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val), curr), 'Revenue']}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 mt-2">
            {categoryData.map((cat, idx) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-600 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="font-bold text-slate-900 shrink-0">
                  {formatCurrency(cat.value, curr)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Anomaly Diagnostic Ticker */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold tracking-tight text-white">
              Active Anomaly &amp; Risk Diagnostics ({anomalies.length})
            </h3>
          </div>
          <button
            onClick={() => onNavigate('insights')}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
          >
            Investigate All &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {anomalies.slice(0, 2).map((anom) => (
            <div
              key={anom.id}
              onClick={() => onNavigate('insights')}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-3.5 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 truncate">
                  {anom.title}
                </span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                  {anom.metricImpact}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                {anom.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Investigation Root-Cause Modal */}
      <WhyInvestigationModal
        investigation={selectedWhyInvestigation}
        profile={profile}
        isOpen={Boolean(selectedWhyInvestigation)}
        onClose={() => setSelectedWhyInvestigation(null)}
        onNavigateToResolve={onNavigate}
      />
    </div>
  );
};
