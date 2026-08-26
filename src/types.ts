export type Language = 'en';
export type Currency = 'NGN' | 'USD' | 'GBP' | 'EUR' | 'GHS' | 'KES';

export interface BusinessProfile {
  name: string;
  industry: 'Retail & Supermarket' | 'Wholesale & Distribution' | 'Fashion & Apparel' | 'Electronics & Gadgets' | 'FMCG & Groceries' | 'Restaurant & Food Services' | 'Pharmacy & Healthcare';
  currency: Currency;
  currencySymbol: string;
  ownerName: string;
  targetMarginPct: number;
  monthlyRevenueTarget: number;
  language: Language;
  voiceEnabled: boolean;
  autoSpeakResponse: boolean;
  location: string;
}

export interface SaleRecord {
  id: string;
  date: string; // YYYY-MM-DD
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  unitPrice: number;
  totalRevenue: number;
  costOfGoods: number;
  netProfit: number;
  channel: 'In-Store' | 'WhatsApp / Social' | 'Online Web' | 'Wholesale Rep';
  paymentMethod: 'Bank Transfer' | 'POS Card' | 'Cash' | 'Credit';
}

export interface ExpenseRecord {
  id: string;
  date: string;
  category: 'Salaries & Wages' | 'Shop Rent' | 'Logistics & Dispatch' | 'Marketing & Ads' | 'Utilities & Generator Fuel' | 'Packaging & Store Supplies' | 'Software & Internet' | 'Tax & Regulatory' | 'Miscellaneous';
  amount: number;
  description: string;
  isRecurring: boolean;
  isAnomaly?: boolean;
  varianceMoM?: number;
}

export type StockStatus = 'optimal' | 'low' | 'critical' | 'excess' | 'out_of_stock';

export interface ProductItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  description?: string;
  imageUrl?: string;
  unitPrice: number;
  unitCost: number;
  marginPct: number;
  currentStock: number;
  minThreshold: number;
  reorderQuantity: number;
  avgWeeklySales: number;
  daysOfStockRemaining: number;
  stockStatus: StockStatus;
  supplierLeadDays: number;
  supplierName: string;
  lastRestockDate: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  subtotal: number;
  imageUrl?: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  date: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  totalCost: number;
  netProfit: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'POS Card' | 'Credit';
  status: 'completed' | 'pending' | 'cancelled';
  cashierName?: string;
  notes?: string;
}

export type CustomerStatus = 'champion' | 'loyal' | 'at_risk' | 'inactive' | 'new';

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  totalSpend: number;
  totalOrders: number;
  averageOrderValue: number;
  firstOrderDate: string;
  lastOrderDate: string;
  daysSinceLastOrder: number;
  status: CustomerStatus;
  preferredProduct: string;
  reEngagementMessage?: {
    en: string;
    ha: string;
    ar: string;
  };
}

export interface BusinessMetrics {
  totalRevenue: number;
  revenueGrowthMoM: number;
  totalProfit: number;
  profitGrowthMoM: number;
  profitMarginPct: number;
  grossMarginPct: number;
  totalExpenses: number;
  expenseGrowthMoM: number;
  totalOrders: number;
  orderGrowthMoM: number;
  averageOrderValue: number;
  activeCustomers: number;
  atRiskCustomersCount: number;
  inactiveCustomersCount: number;
  inventoryHealthScore: number; // 0 - 100
  lowStockItemsCount: number;
  criticalStockItemsCount: number;
  inventoryValuation: number;
}

export interface HealthCategoryScore {
  name: string;
  score: number; // 0 - 100
  weight: number;
  status: 'good' | 'fair' | 'critical';
  trend: 'improving' | 'stable' | 'declining';
  keyFactor: string;
}

export interface BusinessHealthScore {
  overallScore: number; // 0 - 100
  previousScore: number;
  scoreDelta: number;
  status: 'excellent' | 'healthy' | 'caution' | 'critical';
  categories: HealthCategoryScore[];
  mainReasons: string[];
  recommendedImprovements: string[];
}

export interface WhyInvestigationDriver {
  factor: string;
  impactDirection: 'negative' | 'positive';
  contributionAmount: string;
  contributionPct: number;
  evidence: string;
}

export interface WhyInvestigation {
  metricId: string;
  metricLabel: string;
  currentValue: string;
  changeStatement: string;
  symptom: string;
  rootCause: string;
  drivers: WhyInvestigationDriver[];
  mathematicalProof: {
    baseFormula: string;
    previousPeriod: string;
    currentPeriod: string;
    variance: string;
  };
  businessImpact: string;
  recommendedAction: string;
  confidence: 'High' | 'Medium' | 'Estimated';
}

export interface BusinessOpportunity {
  id: string;
  title: string;
  type: 'growth_product' | 'untapped_customer' | 'cross_selling' | 'high_margin' | 'bulk_reorder' | 'seasonal';
  signal: string;
  estimatedPotentialGain: string;
  confidence: 'High' | 'Medium' | 'Moderate';
  evidence: { label: string; value: string }[];
  recommendedNextStep: string;
  timeframe: string;
  status: 'active' | 'approved' | 'dismissed';
}

export interface AnomalyAlert {
  id: string;
  date: string;
  type: 'expense_spike' | 'sales_dip' | 'margin_drop' | 'stockout_risk' | 'customer_churn' | 'revenue_surge';
  severity: 'critical' | 'warning' | 'info';
  category?: 'inventory' | 'customer' | 'expense' | 'sales' | 'margin';
  title: string;
  description: string;
  metricImpact: string;
  confidencePct: number;
  suspectedReason: string;
  rootCause?: string;
  action?: string;
  recommendedAction: string;
  evidence: { label: string; value: string; benchmark?: string }[];
}

export type ActionApprovalStatus = 'pending_review' | 'approved' | 'task_created' | 'completed' | 'dismissed';

export interface RecommendedAction {
  id: string;
  priority: 'high' | 'medium' | 'low';
  priorityOrder: number;
  category: 'inventory' | 'customer' | 'pricing' | 'expense' | 'marketing';
  title: string;
  action: string;
  reason: string;
  evidence: { label: string; value: string; benchmark?: string; calculationBasis?: string }[];
  potentialImpact: string;
  confidence?: 'High' | 'Medium' | 'Estimated';
  difficulty: 'quick_win' | 'medium_effort' | 'strategic';
  approvalStatus?: ActionApprovalStatus;
  status?: 'pending' | 'in_progress' | 'completed' | 'dismissed';
  userNotes?: string;
  createdTaskDate?: string;
  timestamp: string;
}

export interface DailyCeoBrief {
  date: string;
  headline: string;
  statusTone: 'positive' | 'cautious' | 'urgent';
  summary: string;
  revenue: { current: number; growthPct: number; formatted: string };
  profit: { current: number; growthPct: number; formatted: string };
  bestProduct: { name: string; revenue: number; unitsSold: number; growthPct: number };
  inventoryRisk: { name: string; daysRemaining: number; currentStock: number; action: string };
  customerRisk: { count: number; estimatedLostValue: number; action: string };
  opportunity: { title: string; description: string; expectedGain: string };
  top3Actions: RecommendedAction[];
}

export type ChatFocusMode = 'business' | 'general';

export interface AiSocietyRedirect {
  societyName: string;
  category: 'AI Research' | 'Developer & Code' | 'Data Science' | 'Science & Academic' | 'Industry & Business' | 'Medical & Health' | 'General Society';
  description: string;
  recommendationReason: string;
  suggestedResourceUrl?: string;
  suggestedSearchQuery?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  language: Language;
  timestamp: string;
  mode: 'text' | 'voice';
  focusMode?: ChatFocusMode;
  structuredData?: {
    answer: string;
    why: string;
    evidence: { metric: string; value: string }[];
    recommendedAction: string;
    prediction?: string;
    confidence?: string;
    aiSocietyRedirects?: AiSocietyRedirect[];
  };
  audioBase64?: string;
  isTranscribing?: boolean;
  isLoading?: boolean;
}

export interface WhatIfSimulation {
  priceChangePct: number;
  volumeElasticity: number;
  costChangePct: number;
  marketingSpendDeltaPct: number;
  expenseReductionPct: number;
  projectedRevenue: number;
  revenueDelta: number;
  projectedProfit: number;
  profitDelta: number;
  projectedMarginPct: number;
  marginDeltaPct: number;
  breakEvenSalesNeeded: number;
  summaryExplanation: string;
}

export interface DataQualityFieldHealth {
  field: string;
  completenessPct: number;
  status: 'valid' | 'warning' | 'error';
  notes: string;
}

export interface DataQualityMetric {
  totalRecords: number;
  validRecords: number;
  qualityScorePct: number;
  missingFieldsCount: number;
  duplicatesCount: number;
  anomaliesDetectedCount: number;
  status: 'clean' | 'good' | 'requires_attention';
  fieldHealth: DataQualityFieldHealth[];
}
