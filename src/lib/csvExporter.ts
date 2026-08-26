import {
  SaleRecord,
  ExpenseRecord,
  ProductItem,
  CustomerRecord,
  BusinessProfile,
  BusinessMetrics,
} from '../types';

function escapeCsvField(val: string | number | undefined | null): string {
  if (val === undefined || val === null) return '""';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCsvFile(csvContent: string, filename: string) {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSalesCsv(sales: SaleRecord[], profileName: string) {
  const headers = [
    'Transaction ID',
    'Date',
    'Product ID',
    'Product Name',
    'Category',
    'Customer ID',
    'Customer Name',
    'Quantity',
    'Unit Price',
    'Total Revenue',
    'Cost of Goods Sold',
    'Gross Profit',
    'Sales Channel',
    'Payment Method',
  ];

  const rows = sales.map((s) => [
    escapeCsvField(s.id),
    escapeCsvField(s.date),
    escapeCsvField(s.productId),
    escapeCsvField(s.productName),
    escapeCsvField(s.category),
    escapeCsvField(s.customerId),
    escapeCsvField(s.customerName),
    escapeCsvField(s.quantity),
    escapeCsvField(s.unitPrice),
    escapeCsvField(s.totalRevenue),
    escapeCsvField(s.costOfGoods),
    escapeCsvField(s.netProfit),
    escapeCsvField(s.channel),
    escapeCsvField(s.paymentMethod),
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  const safeName = profileName.replace(/[^a-zA-Z0-9_-]/g, '_');
  downloadCsvFile(csv, `VEAIVEX_Sales_Ledger_${safeName}_${dateStr}.csv`);
}

export function exportExpensesCsv(expenses: ExpenseRecord[], profileName: string) {
  const headers = [
    'Expense ID',
    'Date',
    'Category',
    'Amount',
    'Description',
    'Recurring',
    'Anomaly Flag',
    'Variance MoM (%)',
  ];

  const rows = expenses.map((e) => [
    escapeCsvField(e.id),
    escapeCsvField(e.date),
    escapeCsvField(e.category),
    escapeCsvField(e.amount),
    escapeCsvField(e.description),
    escapeCsvField(e.isRecurring ? 'Yes' : 'No'),
    escapeCsvField(e.isAnomaly ? 'Yes' : 'No'),
    escapeCsvField(e.varianceMoM !== undefined ? e.varianceMoM.toFixed(1) : ''),
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  const safeName = profileName.replace(/[^a-zA-Z0-9_-]/g, '_');
  downloadCsvFile(csv, `VEAIVEX_Expense_Ledger_${safeName}_${dateStr}.csv`);
}

export function exportInventoryCsv(products: ProductItem[], profileName: string) {
  const headers = [
    'Product ID',
    'SKU',
    'Product Name',
    'Category',
    'Unit Cost Price',
    'Unit Selling Price',
    'Margin (%)',
    'Current Stock',
    'Min Threshold',
    'Reorder Quantity',
    'Weekly Velocity',
    'Days Stock Remaining',
    'Stock Status',
    'Supplier Name',
    'Supplier Lead Days',
    'Total Stock Valuation',
  ];

  const rows = products.map((p) => [
    escapeCsvField(p.id),
    escapeCsvField(p.sku),
    escapeCsvField(p.name),
    escapeCsvField(p.category),
    escapeCsvField(p.unitCost),
    escapeCsvField(p.unitPrice),
    escapeCsvField(p.marginPct.toFixed(1)),
    escapeCsvField(p.currentStock),
    escapeCsvField(p.minThreshold),
    escapeCsvField(p.reorderQuantity),
    escapeCsvField(p.avgWeeklySales),
    escapeCsvField(p.daysOfStockRemaining.toFixed(1)),
    escapeCsvField(p.stockStatus),
    escapeCsvField(p.supplierName),
    escapeCsvField(p.supplierLeadDays),
    escapeCsvField(p.currentStock * p.unitCost),
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  const safeName = profileName.replace(/[^a-zA-Z0-9_-]/g, '_');
  downloadCsvFile(csv, `VEAIVEX_Inventory_Stock_${safeName}_${dateStr}.csv`);
}

export function exportCustomersCsv(customers: CustomerRecord[], profileName: string) {
  const headers = [
    'Customer ID',
    'Customer Name',
    'Phone',
    'Email',
    'Location',
    'Status Segment',
    'Total Cumulative Spend',
    'Total Orders',
    'Average Order Value',
    'First Order Date',
    'Last Order Date',
    'Days Inactive',
    'Preferred Category/Product',
  ];

  const rows = customers.map((c) => [
    escapeCsvField(c.id),
    escapeCsvField(c.name),
    escapeCsvField(c.phone),
    escapeCsvField(c.email),
    escapeCsvField(c.location),
    escapeCsvField(c.status),
    escapeCsvField(c.totalSpend),
    escapeCsvField(c.totalOrders),
    escapeCsvField(c.averageOrderValue),
    escapeCsvField(c.firstOrderDate),
    escapeCsvField(c.lastOrderDate),
    escapeCsvField(c.daysSinceLastOrder),
    escapeCsvField(c.preferredProduct),
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  const safeName = profileName.replace(/[^a-zA-Z0-9_-]/g, '_');
  downloadCsvFile(csv, `VEAIVEX_Customer_Accounts_${safeName}_${dateStr}.csv`);
}

export function exportExecutiveSummaryCsv(
  profile: BusinessProfile,
  metrics: BusinessMetrics,
  sales: SaleRecord[],
  expenses: ExpenseRecord[],
  products: ProductItem[],
  customers: CustomerRecord[]
) {
  const lines: string[] = [];

  lines.push('VEAIVEX AI — EXECUTIVE BUSINESS INTELLIGENCE DATA EXPORT');
  lines.push('A product of Veltrivex AI Global');
  lines.push(`Business Name,${escapeCsvField(profile.name)}`);
  lines.push(`Industry,${escapeCsvField(profile.industry)}`);
  lines.push(`Currency,${escapeCsvField(profile.currency)}`);
  lines.push(`Export Timestamp,${escapeCsvField(new Date().toISOString())}`);
  lines.push('');

  lines.push('CORE EXECUTIVE KPIS');
  lines.push('Metric,Value,MoM Variance (%)');
  lines.push(`Total Revenue,${metrics.totalRevenue},+${metrics.revenueGrowthMoM.toFixed(1)}%`);
  lines.push(`Total Operating Expenses,${metrics.totalExpenses},+${metrics.expenseGrowthMoM.toFixed(1)}%`);
  lines.push(`Net Operating Profit,${metrics.totalProfit},${metrics.profitGrowthMoM.toFixed(1)}%`);
  lines.push(`Net Profit Margin (%),${metrics.profitMarginPct.toFixed(1)}%,-`);
  lines.push(`Gross Margin (%),${metrics.grossMarginPct.toFixed(1)}%,-`);
  lines.push(`Total Orders,${metrics.totalOrders},+${metrics.orderGrowthMoM.toFixed(1)}%`);
  lines.push(`Average Order Value,${metrics.averageOrderValue.toFixed(0)},-`);
  lines.push(`Inventory Health Score (0-100),${metrics.inventoryHealthScore},-`);
  lines.push(`Critical Low Stock SKUs,${metrics.criticalStockItemsCount},-`);
  lines.push(`Total Inventory Valuation,${metrics.inventoryValuation},-`);
  lines.push(`Active Customers,${metrics.activeCustomers},-`);
  lines.push(`At-Risk Customers,${metrics.atRiskCustomersCount},-`);
  lines.push('');

  lines.push('DATASET SUMMARY COUNTS');
  lines.push('Category,Total Records');
  lines.push(`Sales Transactions,${sales.length}`);
  lines.push(`Expense Records,${expenses.length}`);
  lines.push(`Inventory SKUs,${products.length}`);
  lines.push(`Customer Profiles,${customers.length}`);

  const csv = lines.join('\r\n');
  const dateStr = new Date().toISOString().slice(0, 10);
  const safeName = profile.name.replace(/[^a-zA-Z0-9_-]/g, '_');
  downloadCsvFile(csv, `VEAIVEX_Executive_Summary_${safeName}_${dateStr}.csv`);
}
