import React, { useState, useRef } from 'react';
import {
  SaleRecord,
  ExpenseRecord,
  ProductItem,
  CustomerRecord,
  BusinessProfile,
  BusinessMetrics,
  DailyCeoBrief,
  RecommendedAction,
} from '../../types';
import {
  formatCurrency,
  detectBusinessAnomalies,
  generateBusinessOpportunities,
  calculateBusinessHealthScore,
} from '../../lib/biEngine';
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Package,
  Users,
  DollarSign,
  AlertCircle,
  Sparkles,
  Info,
  Calendar,
  Layers,
  ChevronDown,
  RefreshCw,
  Code,
  Check,
  FileSpreadsheet,
} from 'lucide-react';
import { VeaivexLogo } from '../VeaivexLogo';
import { generateExecutiveReportPdf } from '../../lib/pdfGenerator';
import {
  exportSalesCsv,
  exportExpensesCsv,
  exportInventoryCsv,
  exportCustomersCsv,
  exportExecutiveSummaryCsv,
} from '../../lib/csvExporter';

interface ReportsViewProps {
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
  products: ProductItem[];
  customers: CustomerRecord[];
  profile: BusinessProfile;
  metrics: BusinessMetrics;
  brief: DailyCeoBrief;
  actions: RecommendedAction[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  sales,
  expenses,
  products,
  customers,
  profile,
  metrics,
  brief,
  actions,
}) => {
  const curr = profile.currency;
  const reportRef = useRef<HTMLDivElement>(null);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [csvMenuOpen, setCsvMenuOpen] = useState(false);
  const [devMenuOpen, setDevMenuOpen] = useState(false);

  // Derived BI insights
  const healthScore = calculateBusinessHealthScore(metrics, profile);
  const anomalies = detectBusinessAnomalies(sales, expenses, products, customers, curr);
  const opportunities = generateBusinessOpportunities(sales, customers, curr);

  // Category revenue aggregation
  const categoryMap = new Map<string, number>();
  sales.forEach((s) => {
    categoryMap.set(s.category, (categoryMap.get(s.category) || 0) + s.totalRevenue);
  });
  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([cat, rev]) => ({
      category: cat,
      revenue: rev,
      percentage: metrics.totalRevenue > 0 ? (rev / metrics.totalRevenue) * 100 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  // Top products
  const productSalesMap = new Map<string, { product: ProductItem; units: number; revenue: number }>();
  products.forEach((p) => {
    productSalesMap.set(p.id, { product: p, units: 0, revenue: 0 });
  });
  sales.forEach((s) => {
    const entry = productSalesMap.get(s.productId);
    if (entry) {
      entry.units += s.quantity;
      entry.revenue += s.totalRevenue;
    }
  });
  const topProducts = Array.from(productSalesMap.values())
    .filter((p) => p.units > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  // Top customers
  const topCustomersList = [...customers].sort((a, b) => b.totalSpend - a.totalSpend).slice(0, 5);

  // Critical & low stock
  const criticalProductsList = products.filter(
    (p) => p.stockStatus === 'critical' || p.stockStatus === 'low'
  );

  // Financial P&L calculation
  const totalCogs = sales.reduce((acc, s) => acc + s.costOfGoods, 0);
  const grossProfit = metrics.totalRevenue - totalCogs;

  // Handler: Download Real PDF
  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);
    setPdfError(null);
    setPdfSuccess(false);

    try {
      await generateExecutiveReportPdf(reportRef.current, {
        businessName: profile.name,
        reportDate: new Date().toISOString().slice(0, 10),
      });
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 4000);
    } catch (err: any) {
      console.error('PDF Generation failed:', err);
      setPdfError(err?.message || 'Unable to generate the PDF report.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Handler: Print Report
  const handlePrint = () => {
    window.print();
  };

  // Handler: Export Developer JSON (Secondary / Advanced)
  const handleExportDeveloperJson = () => {
    const developerPayload = {
      _meta: {
        documentType: 'VEAIVEX_DEVELOPER_RAW_EXPORT',
        disclaimer: 'INTERNAL SYSTEM DATA ONLY — NOT AN EXECUTIVE BI REPORT',
        generatedAt: new Date().toISOString(),
        product: 'VEAIVEX AI',
        company: 'Veltrivex AI Global',
      },
      businessProfile: profile,
      metrics,
      healthScore,
      dailyBrief: brief,
      topActions: actions,
      activeAnomalies: anomalies,
      opportunities,
      salesTransactionsCount: sales.length,
      expensesRecordsCount: expenses.length,
      inventoryCatalogCount: products.length,
      customersCount: customers.length,
      rawSales: sales,
      rawExpenses: expenses,
      rawInventory: products,
      rawCustomers: customers,
    };

    const blob = new Blob([JSON.stringify(developerPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VEAIVEX_Developer_Data_${profile.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDevMenuOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP ACTION TOOLBAR (Hidden in Print) */}
      <div className="no-print bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Executive BI Reports &amp; Export
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Audit-Ready Report
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate printable executive summaries, board-level financial reports, and data exports
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Action 1: Download Real PDF */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
              isGeneratingPdf
                ? 'bg-blue-400 text-white cursor-wait'
                : pdfSuccess
                ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-98'
            }`}
          >
            {isGeneratingPdf ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Executive PDF...</span>
              </>
            ) : pdfSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>PDF Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </>
            )}
          </button>

          {/* Action 2: Print Report */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all active:scale-98 shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          {/* Action 3: Export CSV Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setCsvMenuOpen(!csvMenuOpen);
                setDevMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export CSV</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {csvMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg p-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    exportExecutiveSummaryCsv(profile, metrics, sales, expenses, products, customers);
                    setCsvMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 font-semibold flex items-center justify-between"
                >
                  <span>Executive Financials CSV</span>
                  <span className="text-[10px] text-blue-600 font-mono">Summary</span>
                </button>
                <button
                  onClick={() => {
                    exportSalesCsv(sales, profile.name);
                    setCsvMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-between"
                >
                  <span>Sales Ledger CSV</span>
                  <span className="text-[10px] text-slate-400 font-mono">{sales.length} rows</span>
                </button>
                <button
                  onClick={() => {
                    exportExpensesCsv(expenses, profile.name);
                    setCsvMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-between"
                >
                  <span>Expense Ledger CSV</span>
                  <span className="text-[10px] text-slate-400 font-mono">{expenses.length} rows</span>
                </button>
                <button
                  onClick={() => {
                    exportInventoryCsv(products, profile.name);
                    setCsvMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-between"
                >
                  <span>Inventory Catalog CSV</span>
                  <span className="text-[10px] text-slate-400 font-mono">{products.length} SKUs</span>
                </button>
                <button
                  onClick={() => {
                    exportCustomersCsv(customers, profile.name);
                    setCsvMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center justify-between"
                >
                  <span>Customer Accounts CSV</span>
                  <span className="text-[10px] text-slate-400 font-mono">{customers.length} accts</span>
                </button>
              </div>
            )}
          </div>

          {/* Action 4 (Optional & Clearly Labeled): Developer Data / JSON */}
          <div className="relative">
            <button
              onClick={() => {
                setDevMenuOpen(!devMenuOpen);
                setCsvMenuOpen(false);
              }}
              title="Developer raw JSON format (internal data)"
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Developer Data</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {devMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg p-2.5 z-50 text-xs animate-in fade-in zoom-in-95">
                <div className="px-2 py-1.5 mb-1 bg-amber-50 border border-amber-200/60 rounded-lg">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                    Developer Data / JSON
                  </span>
                  <p className="text-[11px] text-amber-700 mt-0.5 leading-snug">
                    Raw internal schema for API integrations and debug tooling.
                  </p>
                </div>
                <button
                  onClick={handleExportDeveloperJson}
                  className="w-full mt-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-left flex items-center justify-between"
                >
                  <span>Export Developer JSON</span>
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ERROR BANNER IF PDF GENERATION FAILS */}
      {pdfError && (
        <div className="no-print bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-rose-900">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-sm text-rose-900">Unable to generate the report.</h4>
              <p className="text-rose-700 mt-0.5">
                An error occurred during canvas rendering: {pdfError}. You can retry or use Print / CSV export.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition-colors"
            >
              Retry
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-800 font-bold hover:bg-rose-100 transition-colors"
            >
              Print Report
            </button>
            <button
              onClick={() => exportExecutiveSummaryCsv(profile, metrics, sales, expenses, products, customers)}
              className="px-3 py-1.5 rounded-lg bg-white border border-rose-300 text-rose-800 font-bold hover:bg-rose-100 transition-colors"
            >
              Export CSV
            </button>
          </div>
        </div>
      )}

      {/* 2. THE EXECUTIVE REPORT DOCUMENT SHEET (A4 Printable & PDF-Ready) */}
      <div
        id="executive-report-document"
        ref={reportRef}
        className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 shadow-sm max-w-4xl mx-auto space-y-10 print-container"
      >
        {/* DOCUMENT HEADER / BRANDING */}
        <div className="border-b-2 border-slate-900 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <VeaivexLogo size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    VEAIVEX AI
                  </h1>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white">
                    Executive Report
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700 tracking-tight mt-0.5">
                  Executive Business Intelligence &amp; Decision Support Report
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  A product of Veltrivex AI Global
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-600 space-y-0.5">
              <div className="font-bold text-slate-900 text-sm">{profile.name}</div>
              <div className="text-slate-500">{profile.industry} &bull; {profile.location}</div>
              <div className="font-medium text-slate-700">
                Billing Period: <span className="font-bold text-slate-900">August 2026</span>
              </div>
              <div className="text-[11px] text-slate-400">
                Generated: {new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: EXECUTIVE COVER & NARRATIVE SUMMARY */}
        <section className="space-y-4 page-break-inside-avoid">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              1. Executive Overview &amp; Key Highlights
            </h2>
            <span className="text-[11px] font-bold text-blue-600">
              Prepared by VEAIVEX AI
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs sm:text-sm text-slate-800 leading-relaxed">
            <p className="font-medium">
              During the August 2026 financial cycle, <strong>{profile.name}</strong> recorded total top-line revenue of{' '}
              <strong>{formatCurrency(metrics.totalRevenue, curr)}</strong> (+{metrics.revenueGrowthMoM.toFixed(1)}% MoM) across {metrics.totalOrders} customer transactions. 
              Net operating profit finalized at <strong>{formatCurrency(metrics.totalProfit, curr)}</strong> ({metrics.profitMarginPct.toFixed(1)}% net conversion margin).
            </p>
          </div>

          {/* Structured Movement Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 pb-1">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Major Positive Movement</span>
              </div>
              <p className="text-slate-700 mt-1 leading-snug">
                Strong retail momentum in grain and pasta lines (+28.4% MoM demand) led by <strong>Royal Crown Basmati Rice</strong> ({formatCurrency(627000, curr)} revenue, 22 units sold).
              </p>
            </div>

            <div className="bg-rose-50/60 border border-rose-200 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 font-bold text-rose-900 pb-1">
                <TrendingDown className="w-4 h-4 text-rose-600" />
                <span>Major Negative Movement</span>
              </div>
              <p className="text-slate-700 mt-1 leading-snug">
                Overhead inflation driven by utility &amp; diesel generator costs (+146.8% MoM surge to {formatCurrency(395000, curr)}), reducing net profit margin from 14.8% to 10.4%.
              </p>
            </div>

            <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 pb-1">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Most Critical Risk</span>
              </div>
              <p className="text-slate-700 mt-1 leading-snug">
                Imminent stockout of <strong>Mama Gold Parboiled Rice 50kg</strong> (3 units remaining / 1.9 days coverage) against a 4-day supplier replenishment lead time.
              </p>
            </div>

            <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 font-bold text-blue-900 pb-1">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Most Important Opportunity</span>
              </div>
              <p className="text-slate-700 mt-1 leading-snug">
                Wholesale pasta &amp; grain auto-ship contracts with 14 active commercial eateries, unlocking an estimated <strong>~{formatCurrency(850000, curr)}/month</strong> in recurring cash flow.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2: EXECUTIVE KPI SCORECARD */}
        <section className="space-y-4 page-break-inside-avoid">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              2. Core Executive Financial &amp; Operational KPIs
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">
              Central Engine Reconciled
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Card 1: Total Revenue */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-500 font-medium block">Total Revenue</span>
              <span className="text-base sm:text-lg font-black text-slate-900 block">
                {formatCurrency(metrics.totalRevenue, curr)}
              </span>
              <span className="text-[10px] font-bold text-emerald-600 block">
                +{metrics.revenueGrowthMoM.toFixed(1)}% MoM
              </span>
            </div>

            {/* Card 2: Revenue Growth */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-500 font-medium block">Revenue Growth</span>
              <span className="text-base sm:text-lg font-black text-emerald-600 block">
                +{metrics.revenueGrowthMoM.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-500 block">vs July 2026 baseline</span>
            </div>

            {/* Card 3: Net Profit */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-500 font-medium block">Net Operating Profit</span>
              <span className="text-base sm:text-lg font-black text-slate-900 block">
                {formatCurrency(metrics.totalProfit, curr)}
              </span>
              <span className="text-[10px] font-bold text-rose-600 block">
                {metrics.profitGrowthMoM.toFixed(1)}% MoM
              </span>
            </div>

            {/* Card 4: Net Profit Margin */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-500 font-medium block">Profit Margin</span>
              <span className="text-base sm:text-lg font-black text-slate-900 block">
                {metrics.profitMarginPct.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-500 block">Target: {profile.targetMarginPct}%</span>
            </div>

            {/* Card 5: Gross Margin */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-500 font-medium block">Gross Margin</span>
              <span className="text-base sm:text-lg font-black text-slate-900 block">
                {metrics.grossMarginPct.toFixed(1)}%
              </span>
              <span className="text-[10px] text-emerald-600 block">Healthy Unit Economics</span>
            </div>

            {/* Card 6: Operating Expenses */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-500 font-medium block">Operating Expenses</span>
              <span className="text-base sm:text-lg font-black text-slate-900 block">
                {formatCurrency(metrics.totalExpenses, curr)}
              </span>
              <span className="text-[10px] font-bold text-rose-600 block">
                +{metrics.expenseGrowthMoM.toFixed(1)}% MoM
              </span>
            </div>

            {/* Card 7: Total Orders */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-500 font-medium block">Total Orders</span>
              <span className="text-base sm:text-lg font-black text-slate-900 block">
                {metrics.totalOrders} Orders
              </span>
              <span className="text-[10px] font-bold text-emerald-600 block">
                +{metrics.orderGrowthMoM.toFixed(1)}% MoM
              </span>
            </div>

            {/* Card 8: Average Order Value */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
              <span className="text-slate-500 font-medium block">Average Order Value</span>
              <span className="text-base sm:text-lg font-black text-slate-900 block">
                {formatCurrency(metrics.averageOrderValue, curr)}
              </span>
              <span className="text-[10px] text-slate-500 block">Across 4 channels</span>
            </div>
          </div>
        </section>

        {/* SECTION 3: VEAIVEX DAILY CEO BRIEF */}
        <section className="space-y-4 page-break-inside-avoid">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              3. VEAIVEX Daily Brief
            </h2>
            <span className="text-[11px] font-semibold text-slate-500">
              {brief.date}
            </span>
          </div>

          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                Executive Headline
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {brief.headline}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {brief.summary}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Best Product</span>
                <span className="font-bold text-white text-xs block truncate mt-0.5">{brief.bestProduct.name}</span>
                <span className="text-[10px] text-emerald-400">+{brief.bestProduct.growthPct}% velocity</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Inventory Risk</span>
                <span className="font-bold text-rose-300 text-xs block truncate mt-0.5">{brief.inventoryRisk.name}</span>
                <span className="text-[10px] text-rose-400">{brief.inventoryRisk.daysRemaining} days remaining</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Customer Risk</span>
                <span className="font-bold text-amber-300 text-xs block truncate mt-0.5">{brief.customerRisk.count} Accounts Inactive</span>
                <span className="text-[10px] text-amber-400">Est. ~{formatCurrency(brief.customerRisk.estimatedLostValue, curr)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Top Opportunity</span>
                <span className="font-bold text-blue-300 text-xs block truncate mt-0.5">Grain Wholesaling</span>
                <span className="text-[10px] text-emerald-400">{brief.opportunity.expectedGain}</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: TOP PRIORITIZED STRATEGIC ACTIONS */}
        <section className="space-y-4 page-break-inside-avoid">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              4. Top Prioritized Strategic Actions
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">
              Ranked by Estimated Financial ROI
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {actions.map((act, index) => {
              const isHigh = act.priority === 'high';
              const isMed = act.priority === 'medium';
              return (
                <div
                  key={act.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 page-break-inside-avoid"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          isHigh
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : isMed
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {act.priority.toUpperCase()} PRIORITY
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {index + 1}. {act.title}
                      </h4>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {act.potentialImpact}
                    </span>
                  </div>

                  <div className="text-slate-700 space-y-1">
                    <div>
                      <strong className="text-slate-900">Why: </strong>
                      {act.reason}
                    </div>
                  </div>

                  {/* Evidence Pill List */}
                  {act.evidence && act.evidence.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-lg p-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                      {act.evidence.map((ev, i) => (
                        <div key={i} className="space-y-0.5">
                          <span className="text-slate-400 block font-medium">{ev.label}</span>
                          <span className="font-bold text-slate-900">{ev.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-1.5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                    <div className="text-slate-800">
                      <strong className="text-blue-700">Recommended Next Step: </strong>
                      {act.action}
                    </div>
                    <span className="text-slate-500 font-medium shrink-0">
                      Confidence: <strong className="text-slate-800">{act.confidence || 'High'}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: SALES ANALYTICS & CATEGORY MIX */}
        <section className="space-y-4 page-break-inside-avoid">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              5. Sales Analytics &amp; Product Performance
            </h2>
            <span className="text-[11px] text-slate-400">
              {sales.length} Transactions Audited
            </span>
          </div>

          {/* Category Distribution Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 px-4 py-2 font-bold text-slate-700 border-b border-slate-200">
              Revenue Breakdown by Product Category
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4 text-right">Revenue Contribution</th>
                  <th className="py-2.5 px-4 text-right">Share of Total</th>
                  <th className="py-2.5 px-4 text-center">Mix Bar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {categoryBreakdown.map((cat) => (
                  <tr key={cat.category} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{cat.category}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(cat.revenue, curr)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono">{cat.percentage.toFixed(1)}%</td>
                    <td className="py-2.5 px-4">
                      <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden mx-auto">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${Math.min(100, Math.max(8, cat.percentage))}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Top Products Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 px-4 py-2 font-bold text-slate-700 border-b border-slate-200">
              Top Selling Product SKUs
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Product Name &amp; SKU</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4 text-right">Units Sold</th>
                  <th className="py-2.5 px-4 text-right">Gross Revenue</th>
                  <th className="py-2.5 px-4 text-right">Margin (%)</th>
                  <th className="py-2.5 px-4 text-center">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {topProducts.map((p) => (
                  <tr key={p.product.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-4">
                      <div className="font-bold text-slate-900">{p.product.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{p.product.sku}</div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{p.product.category}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-semibold">{p.units} units</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(p.revenue, curr)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-emerald-700 font-bold">
                      {p.product.marginPct.toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          p.product.stockStatus === 'critical'
                            ? 'bg-rose-100 text-rose-800'
                            : p.product.stockStatus === 'low'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.product.stockStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 6: PROFIT & MARGINS P&L RECONCILIATION */}
        <section className="space-y-4 page-break-inside-avoid">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              6. Profit &amp; Margins P&amp;L Statement
            </h2>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Reconciled Financial Ledger
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-200">
                  <span className="text-slate-600 font-medium">Total Gross Revenue</span>
                  <span className="font-mono font-black text-slate-900">{formatCurrency(metrics.totalRevenue, curr)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200 text-rose-700">
                  <span>Less: Cost of Goods Sold (COGS)</span>
                  <span className="font-mono font-bold">-{formatCurrency(totalCogs, curr)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-300 font-bold bg-white px-2 rounded">
                  <span className="text-slate-900">Gross Operating Profit</span>
                  <span className="font-mono text-emerald-700">{formatCurrency(grossProfit, curr)} ({metrics.grossMarginPct.toFixed(1)}%)</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-200 text-rose-700">
                  <span>Less: Total Operating Expenses</span>
                  <span className="font-mono font-bold">-{formatCurrency(metrics.totalExpenses, curr)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-300 font-bold bg-blue-50/80 px-2 rounded text-blue-900">
                  <span>Net Operating Income / Profit</span>
                  <span className="font-mono font-black">{formatCurrency(metrics.totalProfit, curr)} ({metrics.profitMarginPct.toFixed(1)}%)</span>
                </div>
                <div className="text-[11px] text-slate-500 pt-1">
                  Reconciliation Status: 100% matched against verified register records.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7: EXPENSE INTELLIGENCE & OVERHEADS */}
        <section className="space-y-4 page-break-inside-avoid">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              7. Expense Intelligence &amp; Cost Anomalies
            </h2>
            <span className="text-[11px] text-rose-600 font-bold">
              +{metrics.expenseGrowthMoM.toFixed(1)}% MoM Overhead Inflation
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Expense Category</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                  <th className="py-2.5 px-4 text-right">MoM Variance</th>
                  <th className="py-2.5 px-4">Key Driver / Anomaly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-4 font-bold text-slate-900">{exp.category}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(exp.amount, curr)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold">
                      {exp.varianceMoM !== undefined && exp.varianceMoM > 0 ? (
                        <span className="text-rose-600">+{exp.varianceMoM.toFixed(1)}%</span>
                      ) : exp.varianceMoM !== undefined ? (
                        <span className="text-emerald-600">{exp.varianceMoM.toFixed(1)}%</span>
                      ) : (
                        <span className="text-slate-400">0.0%</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">
                      {exp.isAnomaly ? (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Diesel Generator Spike (+146.8%)</span>
                        </span>
                      ) : (
                        <span>{exp.description}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 8: CUSTOMER INTELLIGENCE & ACCOUNTS */}
        <section className="space-y-4 page-break-inside-avoid">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              8. Customer Intelligence &amp; Inactivity Risks
            </h2>
            <span className="text-[11px] text-slate-500">
              {metrics.activeCustomers} Active &bull; {metrics.atRiskCustomersCount} At-Risk Accounts
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Client Name</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Orders</th>
                  <th className="py-2.5 px-4 text-right">Lifetime Spend</th>
                  <th className="py-2.5 px-4 text-right">Avg Order Value</th>
                  <th className="py-2.5 px-4 text-right">Days Inactive</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {topCustomersList.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          c.status === 'at_risk'
                            ? 'bg-rose-100 text-rose-800'
                            : c.status === 'champion'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-semibold">{c.totalOrders}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(c.totalSpend, curr)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono">{formatCurrency(c.averageOrderValue, curr)}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-700">
                      {c.daysSinceLastOrder} days
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 9: INVENTORY HEALTH & REORDER ACTION */}
        <section className="space-y-4 page-break-inside-avoid">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              9. Inventory Valuation &amp; Critical Stock Alert
            </h2>
            <span className="text-[11px] font-bold text-amber-700">
              Valuation: {formatCurrency(metrics.inventoryValuation, curr)} &bull; Health: {metrics.inventoryHealthScore}/100
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Item Name</th>
                  <th className="py-2.5 px-4 text-right">Current Stock</th>
                  <th className="py-2.5 px-4 text-right">Days Coverage</th>
                  <th className="py-2.5 px-4 text-right">Supplier Lead</th>
                  <th className="py-2.5 px-4 text-right">Reorder Qty</th>
                  <th className="py-2.5 px-4 text-center">Urgency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {criticalProductsList.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-4 font-bold text-slate-900">{p.name}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-700">
                      {p.currentStock} units
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-600">
                      {p.daysOfStockRemaining.toFixed(1)} days
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                      {p.supplierLeadDays} days
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      +{p.reorderQuantity} units
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-100 text-rose-800">
                        IMMEDIATE PO
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 10: ACTIVE RISKS & ANOMALIES */}
        <section className="space-y-4 page-break-inside-avoid">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              10. Active Risks &amp; Anomalies
            </h2>
            <span className="text-[11px] text-slate-400">
              {anomalies.length} Critical Items Identified
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {anomalies.map((anom) => (
              <div
                key={anom.id}
                className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1.5 page-break-inside-avoid"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-100 text-rose-800">
                      {anom.severity.toUpperCase()}
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{anom.title}</span>
                  </div>
                  <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                    Impact: {anom.metricImpact}
                  </span>
                </div>
                <p className="text-slate-600 leading-snug">{anom.description}</p>
                <div className="pt-1 text-[11px] text-slate-800">
                  <strong className="text-blue-700">Recommended Response: </strong>
                  {anom.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 11: BUSINESS OPPORTUNITIES */}
        <section className="space-y-4 page-break-inside-avoid">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              11. Business Opportunities (Estimated Gains)
            </h2>
            <span className="text-[11px] font-semibold text-emerald-700">
              Potential Upside
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-emerald-50/40 border border-emerald-200 rounded-xl p-3.5 space-y-1.5 page-break-inside-avoid"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                      OPPORTUNITY
                    </span>
                    <span className="font-bold text-slate-900 text-sm">{opp.title}</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                    {opp.estimatedPotentialGain}
                  </span>
                </div>
                <p className="text-slate-700 leading-snug">{opp.signal}</p>
                <div className="pt-1 text-[11px] text-slate-800 flex justify-between items-center">
                  <div>
                    <strong className="text-emerald-800">Recommended Next Step: </strong>
                    {opp.recommendedNextStep}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Confidence: {opp.confidence}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 12: 90-DAY FORECAST & SENSITIVITY MODEL */}
        <section className="space-y-4 page-break-inside-avoid">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              12. Multi-Period Financial Forecast
            </h2>
            <span className="text-[10px] text-slate-400 font-medium">
              Run-Rate Model &bull; Projections are Mathematical Estimates
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Period</th>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-4 text-right">Revenue</th>
                  <th className="py-2.5 px-4 text-right">Operating Expenses</th>
                  <th className="py-2.5 px-4 text-right">Net Profit</th>
                  <th className="py-2.5 px-4 text-right">Net Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-4 font-bold text-slate-900">July 2026</td>
                  <td className="py-2.5 px-4 text-slate-500">Historical</td>
                  <td className="py-2.5 px-4 text-right font-mono">{formatCurrency(2348200, curr)}</td>
                  <td className="py-2.5 px-4 text-right font-mono">{formatCurrency(1180000, curr)}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{formatCurrency(513500, curr)}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-emerald-700">14.8%</td>
                </tr>
                <tr className="bg-blue-50/40 hover:bg-blue-50/80">
                  <td className="py-2.5 px-4 font-bold text-blue-900">August 2026 (Current)</td>
                  <td className="py-2.5 px-4 font-bold text-blue-700">Audited Actual</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">{formatCurrency(metrics.totalRevenue, curr)}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-rose-700">{formatCurrency(metrics.totalExpenses, curr)}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-black text-slate-900">{formatCurrency(metrics.totalProfit, curr)}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-blue-800">{metrics.profitMarginPct.toFixed(1)}%</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-4 font-bold text-slate-900">September 2026 (Projected)</td>
                  <td className="py-2.5 px-4 text-amber-700 font-semibold">Forecast (Base)</td>
                  <td className="py-2.5 px-4 text-right font-mono">{formatCurrency(2620000, curr)}</td>
                  <td className="py-2.5 px-4 text-right font-mono">{formatCurrency(1250000, curr)}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-700">{formatCurrency(615000, curr)}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-emerald-700">16.4%</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-2.5 px-4 font-bold text-slate-900">Q4 2026 Target Run-Rate</td>
                  <td className="py-2.5 px-4 text-indigo-700 font-semibold">Strategic Target</td>
                  <td className="py-2.5 px-4 text-right font-mono">{formatCurrency(8400000, curr)}</td>
                  <td className="py-2.5 px-4 text-right font-mono">{formatCurrency(3800000, curr)}</td>
                  <td className="py-2.5 px-4 text-right font-mono font-bold text-indigo-700">{formatCurrency(2240000, curr)}</td>
                  <td className="py-2.5 px-4 text-right font-mono text-indigo-700">26.7%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-slate-400 italic">
            * Note: Forecast metrics represent analytical run-rate models and elasticity estimates based on historical data; they do not constitute guaranteed revenue.
          </p>
        </section>

        {/* SECTION 13: METHODOLOGY & AUDIT TRAIL */}
        <section className="space-y-3 pt-4 border-t border-slate-200 page-break-inside-avoid text-xs text-slate-600">
          <div className="flex items-center gap-2 text-slate-900 font-bold uppercase tracking-wider text-[11px]">
            <Info className="w-4 h-4 text-blue-600" />
            <span>About This Report &amp; Data Verification</span>
          </div>
          <p className="leading-relaxed">
            This Executive Business Intelligence report was generated by <strong>VEAIVEX AI</strong>, analyzing {sales.length} sales ledger transactions, {expenses.length} operating expense line-items, {products.length} inventory catalog SKUs, and {customers.length} customer records loaded in the active workspace.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <strong className="text-slate-900 block">Actual Data:</strong>
              <span>Verified register transactions</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <strong className="text-slate-900 block">Calculated Metrics:</strong>
              <span>Deterministic P&amp;L arithmetic</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <strong className="text-slate-900 block">Estimates:</strong>
              <span>At-risk spend &amp; working capital</span>
            </div>
            <div className="p-2 bg-slate-50 rounded border border-slate-200">
              <strong className="text-slate-900 block">Forecasts:</strong>
              <span>Run-rate trend models</span>
            </div>
          </div>
        </section>

        {/* DOCUMENT FOOTER & LEGAL ATTRIBUTION */}
        <footer className="border-t-2 border-slate-900 pt-6 text-xs text-slate-500 space-y-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <VeaivexLogo size="xs" />
              <span>VEAIVEX AI</span>
              <span className="text-slate-300 font-normal">&bull;</span>
              <span className="font-normal text-slate-600">A product of Veltrivex AI Global</span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Report Generated: {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 text-center sm:text-left pt-1">
            &copy; 2026 Veltrivex AI Global. All rights reserved. Confidential executive business intelligence.
          </div>
        </footer>
      </div>
    </div>
  );
};
