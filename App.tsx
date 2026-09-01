import React, { useCallback, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { ReceiptModal } from './components/common/ReceiptModal';
import { SplashScreen } from './components/common/SplashScreen';

// Views
import { HomeView } from './components/home/HomeView';
import { DataPurchaseView } from './components/data/DataPurchaseView';
import { AirtimePurchaseView } from './components/airtime/AirtimePurchaseView';
import { BillsView } from './components/bills/BillsView';
import { FamilyGroupDataView } from './components/group/FamilyGroupDataView';
import { WalletView } from './components/wallet/WalletView';
import { SmartInsightsView } from './components/smart/SmartInsightsView';
import { RewardsReferralView } from './components/rewards/RewardsReferralView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { SupportView } from './components/support/SupportView';
import { AccountView } from './components/account/AccountView';
import { AdminPortalView } from './components/admin/AdminPortalView';
import { BackendConsoleView } from './components/admin/BackendConsoleView';

const MainContent: React.FC = () => {
  const {
    activeTab,
    isAdminMode,
    selectedReceiptTx,
    setSelectedReceiptTx,
    setActiveTab,
  } = useApp();

  const renderActiveView = () => {
    if (isAdminMode) {
      return <AdminPortalView />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'data':
        return <DataPurchaseView />;
      case 'airtime':
        return <AirtimePurchaseView />;
      case 'bills':
      case 'electricity':
      case 'cable':
      case 'education':
        return <BillsView />;
      case 'group_data':
        return <FamilyGroupDataView />;
      case 'wallet':
        return <WalletView />;
      case 'insights':
      case 'savings':
        return <SmartInsightsView />;
      case 'rewards':
        return <RewardsReferralView />;
      case 'transactions':
        return <TransactionsView />;
      case 'support':
        return <SupportView />;
      case 'account':
        return <AccountView />;
      case 'backend':
        return <BackendConsoleView />;
      case 'admin':
        return <AdminPortalView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-20 md:pb-10">
        {renderActiveView()}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Official Transaction Receipt Modal */}
      <ReceiptModal
        transaction={selectedReceiptTx}
        onClose={() => setSelectedReceiptTx(null)}
        onRepeat={(tx) => {
          if (tx.type === 'data') setActiveTab('data');
          else if (tx.type === 'airtime') setActiveTab('airtime');
          else if (tx.type === 'electricity' || tx.type === 'cable' || tx.type === 'education') setActiveTab('bills');
        }}
      />
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const finishSplash = useCallback(() => setShowSplash(false), []);

  return (
    <AppProvider>
      {showSplash && <SplashScreen onComplete={finishSplash} />}
      <div className={showSplash ? 'veltripay-app-shell veltripay-app-shell--hidden' : 'veltripay-app-shell'}>
        <MainContent />
      </div>
    </AppProvider>
  );
}
