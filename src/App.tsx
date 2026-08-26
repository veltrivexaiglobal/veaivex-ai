import React, { useState, useMemo } from 'react';
import {
  SaleRecord,
  ExpenseRecord,
  ProductItem,
  CustomerRecord,
  BusinessProfile,
  Language,
} from './types';
import {
  DEMO_SALES,
  DEMO_EXPENSES,
  DEMO_PRODUCTS,
  DEMO_CUSTOMERS,
  DEMO_BUSINESS_PROFILE,
} from './data/demoData';
import {
  calculateBusinessMetrics,
  detectAnomalies,
  generateRecommendedActions,
  generateDailyCeoBrief,
} from './lib/biEngine';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AudioVoiceModal } from './components/AudioVoiceModal';
import { JudgeDemoModal } from './components/JudgeDemoModal';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';

// Views
import { LandingPage } from './components/views/LandingPage';
import { DashboardView } from './components/views/DashboardView';
import { PosOrdersView } from './components/views/PosOrdersView';
import { SalesAnalyticsView } from './components/views/SalesAnalyticsView';
import { ProfitAnalyticsView } from './components/views/ProfitAnalyticsView';
import { ExpenseAnalyticsView } from './components/views/ExpenseAnalyticsView';
import { CustomerIntelligenceView } from './components/views/CustomerIntelligenceView';
import { InventoryIntelligenceView } from './components/views/InventoryIntelligenceView';
import { AiInsightsView } from './components/views/AiInsightsView';
import { AskVeaivexView } from './components/views/AskVeaivexView';
import { WhatIfSimulatorView } from './components/views/WhatIfSimulatorView';
import { ReportsView } from './components/views/ReportsView';
import { DataUploadView } from './components/views/DataUploadView';
import { SettingsView } from './components/views/SettingsView';
import { initialOrders } from './data/ordersData';
import { CustomerOrder } from './types';

export default function App() {
  // Core Domain State
  const [sales, setSales] = useState<SaleRecord[]>(DEMO_SALES);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(DEMO_EXPENSES);
  const [products, setProducts] = useState<ProductItem[]>(DEMO_PRODUCTS);
  const [customers, setCustomers] = useState<CustomerRecord[]>(DEMO_CUSTOMERS);
  const [orders, setOrders] = useState<CustomerOrder[]>(initialOrders);
  const [profile, setProfile] = useState<BusinessProfile>(DEMO_BUSINESS_PROFILE);

  // Navigation & UI State
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false);
  const [judgeDemoModalOpen, setJudgeDemoModalOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [onboardingModalOpen, setOnboardingModalOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    businessName?: string;
  } | null>({
    name: 'Aliyu Abubakar',
    email: 'aliyu@veaivex-retail.ng',
    businessName: 'Veaivex FMCG & Provisions Wholesale',
  });
  const [activePreset, setActivePreset] = useState<string>('fmcg');

  // Computed BI Engine State (Memoized for high performance)
  const metrics = useMemo(
    () => calculateBusinessMetrics(sales, expenses, products, customers, profile),
    [sales, expenses, products, customers, profile]
  );

  const anomalies = useMemo(
    () => detectAnomalies(sales, expenses, products, customers, profile),
    [sales, expenses, products, customers, profile]
  );

  const actions = useMemo(
    () => generateRecommendedActions(sales, expenses, products, customers, profile),
    [sales, expenses, products, customers, profile]
  );

  const dailyBrief = useMemo(
    () => generateDailyCeoBrief(sales, expenses, products, customers, profile),
    [sales, expenses, products, customers, profile]
  );

  const handleAddProduct = (newProduct: ProductItem) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleAddOrder = (newOrder: CustomerOrder) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Create corresponding sale records
    const newSales: SaleRecord[] = newOrder.items.map((item, idx) => ({
      id: `sale-${Date.now()}-${idx}`,
      date: newOrder.date,
      customerId: newOrder.customerId,
      customerName: newOrder.customerName,
      productId: item.productId,
      productName: item.productName,
      category: 'In-Store Sales',
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalRevenue: item.subtotal,
      costOfGoods: item.unitCost * item.quantity,
      netProfit: (item.unitPrice - item.unitCost) * item.quantity,
      channel: 'In-Store',
      paymentMethod: newOrder.paymentMethod,
    }));

    setSales((prev) => [...newSales, ...prev]);

    // Decrement inventory stock
    setProducts((prev) =>
      prev.map((p) => {
        const matchedItem = newOrder.items.find((item) => item.productId === p.id);
        if (matchedItem) {
          const updatedStock = Math.max(0, p.currentStock - matchedItem.quantity);
          return {
            ...p,
            currentStock: updatedStock,
            stockStatus:
              updatedStock <= p.minThreshold / 2
                ? 'critical'
                : updatedStock <= p.minThreshold
                ? 'low'
                : 'optimal',
          };
        }
        return p;
      })
    );
  };

  const handleUpdateProfile = (updates: Partial<BusinessProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const handleUpdateLanguage = (lang: Language) => {
    setProfile((prev) => ({ ...prev, language: lang }));
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: { name: string; email: string; businessName?: string }) => {
    setCurrentUser(user);
    if (user.businessName) {
      setProfile((prev) => ({ ...prev, name: user.businessName!, ownerName: user.name }));
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setActivePreset(presetId);
    if (presetId === 'fmcg') {
      setProfile(DEMO_BUSINESS_PROFILE);
      setProducts(DEMO_PRODUCTS);
      setSales(DEMO_SALES);
      setExpenses(DEMO_EXPENSES);
      setCustomers(DEMO_CUSTOMERS);
    } else if (presetId === 'solar_tech') {
      setProfile({
        name: 'NovaTech Solar & Electronics Wholesalers',
        industry: 'Solar & Electronics',
        currency: 'USD',
        currencySymbol: '$',
        ownerName: 'David Chen & Partners',
        targetMarginPct: 32,
        monthlyRevenueTarget: 45000,
        language: 'en',
        voiceEnabled: true,
        autoSpeakResponse: false,
        location: 'Nairobi & Lagos Tech Corridor',
      });
      const techProducts: ProductItem[] = [
        {
          id: 'TECH-1',
          name: 'Solar Inverter 3.5kVA Pure Sine Hybrid',
          sku: 'INV-3500-PS',
          category: 'Power Systems',
          unitCost: 350,
          unitPrice: 480,
          marginPct: 27.1,
          currentStock: 4,
          minThreshold: 8,
          daysOfStockRemaining: 2.8,
          avgWeeklySales: 10,
          stockStatus: 'critical',
          reorderQuantity: 15,
          supplierLeadDays: 5,
          supplierName: 'Voltmaster Solar Ltd',
          lastRestockDate: '2026-08-10',
        },
        {
          id: 'TECH-2',
          name: 'Lithium LiFePO4 Battery 48V 100Ah',
          sku: 'BAT-48V-100',
          category: 'Energy Storage',
          unitCost: 750,
          unitPrice: 980,
          marginPct: 23.5,
          currentStock: 6,
          minThreshold: 10,
          daysOfStockRemaining: 3.5,
          avgWeeklySales: 12,
          stockStatus: 'critical',
          reorderQuantity: 20,
          supplierLeadDays: 6,
          supplierName: 'Voltmaster Solar Ltd',
          lastRestockDate: '2026-08-12',
        },
        {
          id: 'TECH-3',
          name: 'Monocrystalline Solar Panel 550W Tier 1',
          sku: 'PAN-550-MN',
          category: 'Solar Panels',
          unitCost: 95,
          unitPrice: 135,
          marginPct: 29.6,
          currentStock: 45,
          minThreshold: 20,
          daysOfStockRemaining: 18.0,
          avgWeeklySales: 18,
          stockStatus: 'optimal',
          reorderQuantity: 50,
          supplierLeadDays: 4,
          supplierName: 'SunPower Global Imports',
          lastRestockDate: '2026-08-14',
        },
      ];
      setProducts(techProducts);
    } else if (presetId === 'pharmacy') {
      setProfile({
        name: 'Al-Nur Modern Pharmacy & Clinical Distribution',
        industry: 'Pharmacy & Healthcare',
        currency: 'NGN',
        currencySymbol: '₦',
        ownerName: 'Dr. Fatima Bello',
        targetMarginPct: 35,
        monthlyRevenueTarget: 18500000,
        language: 'ha',
        voiceEnabled: true,
        autoSpeakResponse: false,
        location: 'Kano & Kaduna Distribution Hub, Nigeria',
      });
    }
  };

  const handleOnboardingComplete = (newProfile: BusinessProfile, preset: string) => {
    setProfile(newProfile);
    if (preset === 'electronics') {
      handleSelectPreset('solar_tech');
    }
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950/5 text-slate-900 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onOpenVoiceModal={() => setVoiceModalOpen(true)}
        onOpenDemoGuide={() => setJudgeDemoModalOpen(true)}
        onOpenAuth={handleOpenAuth}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        {currentView !== 'landing' && (
          <Sidebar
            currentView={currentView}
            onNavigate={setCurrentView}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            criticalStockCount={metrics.criticalStockItemsCount}
            atRiskCustomerCount={metrics.atRiskCustomersCount}
            anomalyCount={anomalies.length}
          />
        )}

        {/* View Container */}
        <main
          id="main-content-scroll"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full"
        >
          {currentView === 'landing' && (
            <LandingPage
              onLaunchDashboard={() => setCurrentView('dashboard')}
              onOpenVoiceModal={() => setVoiceModalOpen(true)}
              onOpenDemoGuide={() => setJudgeDemoModalOpen(true)}
              onOpenAuth={handleOpenAuth}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardView
              sales={sales}
              expenses={expenses}
              products={products}
              customers={customers}
              profile={profile}
              metrics={metrics}
              anomalies={anomalies}
              actions={actions}
              brief={dailyBrief}
              onNavigate={setCurrentView}
              onOpenDemoGuide={() => setJudgeDemoModalOpen(true)}
              activePreset={activePreset}
              onSelectPreset={handleSelectPreset}
            />
          )}

          {currentView === 'pos-orders' && (
            <PosOrdersView
              products={products}
              customers={customers}
              profile={profile}
              orders={orders}
              onNavigate={setCurrentView}
              onAddOrder={handleAddOrder}
              onAddProduct={handleAddProduct}
            />
          )}

          {currentView === 'sales-analytics' && (
            <SalesAnalyticsView
              sales={sales}
              products={products}
              profile={profile}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'profit-analytics' && (
            <ProfitAnalyticsView
              sales={sales}
              expenses={expenses}
              profile={profile}
              metrics={metrics}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'expense-analytics' && (
            <ExpenseAnalyticsView
              expenses={expenses}
              profile={profile}
              metrics={metrics}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'customers' && (
            <CustomerIntelligenceView
              customers={customers}
              profile={profile}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'inventory' && (
            <InventoryIntelligenceView
              products={products}
              profile={profile}
              metrics={metrics}
              onNavigate={setCurrentView}
              onAddProduct={handleAddProduct}
            />
          )}

          {currentView === 'insights' && (
            <AiInsightsView
              anomalies={anomalies}
              profile={profile}
              metrics={metrics}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'ask-veaivex' && (
            <AskVeaivexView
              sales={sales}
              expenses={expenses}
              products={products}
              customers={customers}
              profile={profile}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'what-if' && (
            <WhatIfSimulatorView
              profile={profile}
              metrics={metrics}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'reports' && (
            <ReportsView
              sales={sales}
              expenses={expenses}
              products={products}
              customers={customers}
              profile={profile}
              metrics={metrics}
              brief={dailyBrief}
              actions={actions}
            />
          )}

          {currentView === 'data-upload' && (
            <DataUploadView
              sales={sales}
              expenses={expenses}
              products={products}
              customers={customers}
              profile={profile}
              onUpdateSales={setSales}
              onUpdateExpenses={setExpenses}
              onUpdateProducts={setProducts}
              onUpdateCustomers={setCustomers}
              onUpdateProfile={setProfile}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {currentView === 'demo-guide' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900">10Alytics BuildFest Judge Demo Guide</h2>
                <p className="text-xs text-slate-500 mt-1">Interactive step-by-step walkthrough</p>
                <button
                  onClick={() => setJudgeDemoModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-xs"
                >
                  Open Guided Tour Modal
                </button>
              </div>
            </div>
          )}

          {/* Application Footer */}
          {currentView !== 'landing' && (
            <footer className="mt-10 pt-6 pb-4 border-t border-slate-200/80 text-xs text-slate-500">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <span className="font-bold">VEAIVEX AI</span>
                  <span className="text-slate-300 font-normal">&bull;</span>
                  <span className="font-normal text-slate-500">A product of Veltrivex AI Global</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  &copy; 2026 Veltrivex AI Global. All rights reserved.
                </div>
              </div>
            </footer>
          )}
        </main>
      </div>

      {/* Voice Decision Copilot Modal */}
      <AudioVoiceModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        sales={sales}
        expenses={expenses}
        products={products}
        customers={customers}
        profile={profile}
        onUpdateLanguage={handleUpdateLanguage}
      />

      {/* Judge Demo Guide Modal */}
      <JudgeDemoModal
        isOpen={judgeDemoModalOpen}
        onClose={() => setJudgeDemoModalOpen(false)}
        onNavigate={setCurrentView}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        onStartOnboarding={() => setOnboardingModalOpen(true)}
        initialMode={authMode}
      />

      {/* 6-Step Onboarding Modal */}
      <OnboardingModal
        isOpen={onboardingModalOpen}
        onClose={() => setOnboardingModalOpen(false)}
        onComplete={handleOnboardingComplete}
        initialProfile={profile}
      />
    </div>
  );
}
