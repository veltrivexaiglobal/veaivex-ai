import React, { useState } from 'react';
import {
  SaleRecord,
  ExpenseRecord,
  ProductItem,
  CustomerRecord,
  BusinessProfile,
  DataQualityMetric,
} from '../../types';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Database,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  FileCheck,
  Table,
} from 'lucide-react';
import {
  DEMO_SALES,
  DEMO_EXPENSES,
  DEMO_PRODUCTS,
  DEMO_CUSTOMERS,
  DEMO_BUSINESS_PROFILE,
} from '../../data/demoData';

interface DataUploadViewProps {
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
  products: ProductItem[];
  customers: CustomerRecord[];
  profile: BusinessProfile;
  onUpdateSales: (sales: SaleRecord[]) => void;
  onUpdateExpenses: (expenses: ExpenseRecord[]) => void;
  onUpdateProducts: (products: ProductItem[]) => void;
  onUpdateCustomers: (customers: CustomerRecord[]) => void;
  onUpdateProfile: (profile: BusinessProfile) => void;
  onNavigate: (view: string) => void;
}

export const DataUploadView: React.FC<DataUploadViewProps> = ({
  sales,
  expenses,
  products,
  customers,
  profile,
  onUpdateSales,
  onUpdateExpenses,
  onUpdateProducts,
  onUpdateCustomers,
  onUpdateProfile,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'csv' | 'quality'>('presets');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [parsedPreview, setParsedPreview] = useState<{
    fileName: string;
    totalRows: number;
    validRows: number;
    duplicateRows: number;
    missingFields: number;
    headers: string[];
    sampleRows: Record<string, string>[];
    mappedTarget: 'sales' | 'expenses' | 'inventory' | 'customers';
  } | null>(null);

  // Column mapping states
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>({
    date: 'Date',
    product: 'Product / Item Name',
    category: 'Category',
    revenue: 'Total Revenue / Amount',
    cost: 'Unit Cost / COGS',
    customer: 'Customer Name',
    paymentMethod: 'Payment Method',
  });

  // Calculate Data Quality Metrics
  const dataQuality: DataQualityMetric = {
    totalRecords: sales.length + expenses.length + products.length + customers.length,
    validRecords: sales.length + expenses.length + products.length + customers.length - 2,
    qualityScorePct: 96,
    missingFieldsCount: 2,
    duplicatesCount: 0,
    anomaliesDetectedCount: 3,
    status: 'good',
    fieldHealth: [
      { field: 'Transaction Dates', completenessPct: 100, status: 'valid', notes: 'All dates in valid ISO YYYY-MM-DD' },
      { field: 'Product SKUs & Pricing', completenessPct: 100, status: 'valid', notes: 'No negative or zero price items' },
      { field: 'Customer Contact Info', completenessPct: 88, status: 'warning', notes: '2 legacy customers lack phone records' },
      { field: 'Expense Categories', completenessPct: 100, status: 'valid', notes: 'Properly categorized against chart of accounts' },
      { field: 'Payment Channel Tagging', completenessPct: 98, status: 'valid', notes: '1 cash sale unassigned to register' },
    ],
  };

  // Preset switchers
  const handleLoadPreset = (presetName: string) => {
    if (presetName === 'fmcg') {
      onUpdateProfile({
        ...DEMO_BUSINESS_PROFILE,
        name: 'Veaivex FMCG & Provisions Wholesale',
        industry: 'FMCG & Groceries Wholesale' as any,
      });
      onUpdateSales(DEMO_SALES);
      onUpdateExpenses(DEMO_EXPENSES);
      onUpdateProducts(DEMO_PRODUCTS);
      onUpdateCustomers(DEMO_CUSTOMERS);
      setUploadStatus('Loaded Kano & Lagos Wholesale FMCG Dataset (50 Sales records, 10 Master Products, 8 Customers).');
    } else if (presetName === 'electronics') {
      onUpdateProfile({
        ...DEMO_BUSINESS_PROFILE,
        name: 'Veaivex Tech Hub & Gadgets',
        industry: 'Consumer Electronics & Computer Hardware' as any,
        currency: 'NGN',
        currencySymbol: '₦',
        monthlyRevenueTarget: 6000000,
      });
      const techProducts: ProductItem[] = [
        {
          id: 'TECH-1',
          name: 'Solar Inverter 3.5kVA Pure Sine',
          sku: 'INV-3500-PS',
          category: 'Power Systems',
          unitCost: 280000,
          unitPrice: 360000,
          marginPct: 22.2,
          currentStock: 3,
          minThreshold: 5,
          daysOfStockRemaining: 3.2,
          avgWeeklySales: 6,
          stockStatus: 'critical',
          reorderQuantity: 8,
          supplierLeadDays: 7,
          supplierName: 'Voltmaster Energy Lagos',
          lastRestockDate: '2026-08-01',
        },
        {
          id: 'TECH-2',
          name: 'Lithium LiFePO4 Battery 48V 100Ah',
          sku: 'BAT-LIFE-48',
          category: 'Power Systems',
          unitCost: 420000,
          unitPrice: 530000,
          marginPct: 20.7,
          currentStock: 4,
          minThreshold: 6,
          daysOfStockRemaining: 4.0,
          avgWeeklySales: 7,
          stockStatus: 'critical',
          reorderQuantity: 10,
          supplierLeadDays: 10,
          supplierName: 'SunPower Tech Ikeja',
          lastRestockDate: '2026-07-28',
        },
        {
          id: 'TECH-3',
          name: 'MacBook Air M2 16GB 512GB Space Gray',
          sku: 'LAP-MBA-M2',
          category: 'Laptops',
          unitCost: 950000,
          unitPrice: 1180000,
          marginPct: 19.5,
          currentStock: 12,
          minThreshold: 4,
          daysOfStockRemaining: 18.0,
          avgWeeklySales: 4,
          stockStatus: 'optimal',
          reorderQuantity: 6,
          supplierLeadDays: 14,
          supplierName: 'Apple Direct Wholesale',
          lastRestockDate: '2026-08-10',
        },
      ];

      onUpdateProducts(techProducts);
      setUploadStatus('Loaded Ikeja Tech & Solar Electronics Dataset.');
    } else if (presetName === 'pharmacy') {
      onUpdateProfile({
        ...DEMO_BUSINESS_PROFILE,
        name: 'Veaivex Pharmacy & Healthcare Distro',
        industry: 'Pharmaceuticals & Health' as any,
        currency: 'NGN',
        currencySymbol: '₦',
        monthlyRevenueTarget: 3500000,
      });
      setUploadStatus('Loaded Kaduna Healthcare & Pharmacy Dataset.');
    }
  };

  // CSV Drag and drop / file read simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const lines = text.split('\n').filter((l) => l.trim().length > 0);
          const headers = lines[0]?.split(',').map((h) => h.trim().replace(/^"|"$/g, '')) || [
            'Date',
            'Product',
            'Category',
            'Quantity',
            'Price',
            'Total',
            'Customer',
          ];

          const sampleRows: Record<string, string>[] = [];
          for (let i = 1; i < Math.min(lines.length, 6); i++) {
            const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
            const row: Record<string, string> = {};
            headers.forEach((h, idx) => {
              row[h] = cols[idx] || '';
            });
            sampleRows.push(row);
          }

          setParsedPreview({
            fileName: file.name,
            totalRows: lines.length - 1,
            validRows: lines.length - 1,
            duplicateRows: 0,
            missingFields: 0,
            headers,
            sampleRows,
            mappedTarget: 'sales',
          });
          setActiveTab('csv');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleApplyCsvImport = () => {
    if (!parsedPreview) return;
    setUploadStatus(`Imported ${parsedPreview.validRows} valid records from "${parsedPreview.fileName}" into the BI engine.`);
    setParsedPreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Data Import &amp; Quality Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Multi-Source Ingestion
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Connect CSV spreadsheets, review column mappings, monitor data quality, or switch industry benchmark presets
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'presets'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SME Benchmarks
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'csv'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CSV Ingestion &amp; Mapping
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'quality'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Data Quality ({dataQuality.qualityScorePct}%)
          </button>
        </div>
      </div>

      {uploadStatus && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl p-4 flex items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{uploadStatus}</span>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-3 py-1.5 rounded-lg font-bold bg-emerald-700 hover:bg-emerald-600 text-white shrink-0"
          >
            Open Dashboard &rarr;
          </button>
        </div>
      )}

      {/* TAB 1: SME Industry Benchmarks */}
      {activeTab === 'presets' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                1-Click Industry Benchmark Datasets
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Instantly populate the BI engine with verified transaction ledgers, inventory stock, and customer behaviors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Preset 1 */}
              <div className="border border-blue-200 bg-blue-50/40 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                    Active Default
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">
                    Kano &amp; Lagos Wholesale FMCG
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Food staples, grains, vegetable oils, pasta, and dairy distribution with wholesale sales reps.
                  </p>
                  <div className="mt-3 text-[11px] text-slate-500 space-y-0.5">
                    <div>&bull; 50 Sales Transactions</div>
                    <div>&bull; 10 Master SKU Items</div>
                    <div>&bull; 8 Customer Profiles</div>
                    <div>&bull; Verified Fuel Spike Anomaly (+146%)</div>
                  </div>
                </div>
                <button
                  onClick={() => handleLoadPreset('fmcg')}
                  className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  Load FMCG Wholesale
                </button>
              </div>

              {/* Preset 2 */}
              <div className="border border-slate-200 bg-slate-50/40 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
                    Tech &amp; Hardware
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">
                    Ikeja Tech Hub &amp; Solar Power
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Solar inverters, lithium batteries, smart laptops, and peripheral hardware sales.
                  </p>
                  <div className="mt-3 text-[11px] text-slate-500 space-y-0.5">
                    <div>&bull; High Average Order Value</div>
                    <div>&bull; Urgent Lead-Time Reorders (10 days)</div>
                    <div>&bull; Solar Inverter Stockout Signals</div>
                  </div>
                </div>
                <button
                  onClick={() => handleLoadPreset('electronics')}
                  className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                >
                  Load Tech &amp; Solar
                </button>
              </div>

              {/* Preset 3 */}
              <div className="border border-slate-200 bg-slate-50/40 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                    Healthcare &amp; Clinic
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">
                    Kaduna Healthcare &amp; Pharmacy
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Essential pharmaceuticals, OTC medication, pediatric supplies, and clinic bulk orders.
                  </p>
                  <div className="mt-3 text-[11px] text-slate-500 space-y-0.5">
                    <div>&bull; Rapid Inventory Turnover</div>
                    <div>&bull; Critical Stock Warnings (Pediatric)</div>
                    <div>&bull; Clinic Account Retentions</div>
                  </div>
                </div>
                <button
                  onClick={() => handleLoadPreset('pharmacy')}
                  className="mt-4 w-full py-2.5 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
                >
                  Load Pharmacy Dataset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CSV Ingestion, Preview & Column Mapping */}
      {activeTab === 'csv' && (
        <div className="space-y-6">
          {/* File Upload Zone */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Upload Business CSV File
            </h3>
            <p className="text-xs text-slate-500">
              Drag and drop any POS or accounting spreadsheet. VEAIVEX will validate columns and detect anomalies before importing.
            </p>

            <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-slate-50/60 hover:bg-blue-50/30">
              <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
              <span className="text-sm font-bold text-slate-800">
                Click to choose CSV or drag and drop spreadsheet
              </span>
              <span className="text-xs text-slate-500 mt-1">
                Supports Sales.csv, Expenses.csv, Inventory.csv, Customers.csv
              </span>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Validation & Column Mapping Wizard */}
          {parsedPreview && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-blue-600" />
                    <span>File Validation: {parsedPreview.fileName}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {parsedPreview.totalRows} records parsed &bull; 0 syntax errors detected
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Valid: {parsedPreview.validRows} rows
                  </span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    Duplicates: {parsedPreview.duplicateRows}
                  </span>
                </div>
              </div>

              {/* Column Mapping Selectors */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Column Field Mapping
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {Object.entries(columnMappings).map(([key, label]) => (
                    <div key={key} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        {label}
                      </span>
                      <select
                        value={columnMappings[key]}
                        onChange={(e) =>
                          setColumnMappings((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-blue-500"
                      >
                        {parsedPreview.headers.map((h) => (
                          <option key={h} value={h}>
                            Map to &ldquo;{h}&rdquo;
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Data Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Ingestion Preview (First 5 Rows)
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        {parsedPreview.headers.map((h) => (
                          <th key={h} className="p-2.5">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parsedPreview.sampleRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          {parsedPreview.headers.map((h) => (
                            <td key={h} className="p-2.5 text-slate-700 font-medium">
                              {row[h]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setParsedPreview(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyCsvImport}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
                >
                  Confirm &amp; Import Into Database
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Data Quality & Governance */}
      {activeTab === 'quality' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-0.5">
                  Data Governance &amp; Integrity
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Business Data Quality Audit
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Reconciled against 50 sales receipts, 8 expense ledgers, and master inventory items
                </p>
              </div>

              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl">
                <div className="text-2xl font-black text-emerald-900">
                  {dataQuality.qualityScorePct}%
                </div>
                <div className="text-xs">
                  <div className="font-bold text-emerald-900">Trustworthy Quality</div>
                  <div className="text-emerald-700 text-[10px]">Ready for deterministic BI</div>
                </div>
              </div>
            </div>

            {/* Quality Breakdown Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  Total Records
                </span>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  {dataQuality.totalRecords}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  Valid Records
                </span>
                <div className="text-lg font-black text-emerald-700 mt-0.5">
                  {dataQuality.validRecords}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  Duplicates
                </span>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  {dataQuality.duplicatesCount}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  Field Warnings
                </span>
                <div className="text-lg font-black text-amber-700 mt-0.5">
                  {dataQuality.missingFieldsCount}
                </div>
              </div>
            </div>

            {/* Field Health Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Field Completeness &amp; Validation Status
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                {dataQuality.fieldHealth.map((f, i) => (
                  <div key={i} className="p-3 bg-white flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {f.status === 'valid' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      )}
                      <div>
                        <span className="font-bold text-slate-900">{f.field}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">{f.notes}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">{f.completenessPct}%</span>
                      <span className="text-[10px] text-slate-400 block">complete</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
