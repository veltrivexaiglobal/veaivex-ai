import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  DollarSign,
  Receipt,
  Users,
  Package,
  MessageSquareText,
  Sliders,
  FileText,
  UploadCloud,
  Settings,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  ShoppingCart,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
  criticalStockCount: number;
  atRiskCustomerCount: number;
  anomalyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpen,
  onClose,
  criticalStockCount,
  atRiskCustomerCount,
  anomalyCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      description: 'Executive Overview',
    },
    {
      id: 'pos-orders',
      label: 'POS & Orders',
      icon: ShoppingCart,
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      description: 'Counter Sales & Receipts',
    },
    {
      id: 'insights',
      label: 'AI Insights',
      icon: Sparkles,
      badge: anomalyCount > 0 ? `${anomalyCount} alerts` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      description: 'Anomalies & Evidence',
    },
    {
      id: 'sales-analytics',
      label: 'Sales Analytics',
      icon: TrendingUp,
      badge: null,
      description: 'Velocity & Channels',
    },
    {
      id: 'profit-analytics',
      label: 'Profit & Margins',
      icon: DollarSign,
      badge: null,
      description: 'Gross & Net Margins',
    },
    {
      id: 'expense-analytics',
      label: 'Expense Tracker',
      icon: Receipt,
      badge: '+18% MoM',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      description: 'Overhead & Anomalies',
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
      badge: atRiskCustomerCount > 0 ? `${atRiskCustomerCount} at risk` : null,
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      description: 'RFM & Retention',
    },
    {
      id: 'inventory',
      label: 'Catalog & Stock',
      icon: Package,
      badge: criticalStockCount > 0 ? `${criticalStockCount} critical` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      description: 'Product Catalog & Alerts',
    },
    {
      id: 'ask-veaivex',
      label: 'Ask VEAIVEX',
      icon: MessageSquareText,
      badge: 'Multilingual',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      description: 'Conversational BI',
    },
    {
      id: 'what-if',
      label: 'What-If Simulator',
      icon: Sliders,
      badge: 'Scenario',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      description: 'Simulations & Pricing',
    },
    {
      id: 'reports',
      label: 'Reports & Export',
      icon: FileText,
      badge: null,
      description: 'Executive Summaries',
    },
  ];

  const secondaryItems = [
    {
      id: 'data-upload',
      label: 'Data Import & CSV',
      icon: UploadCloud,
      description: 'Upload Datasets',
    },
    {
      id: 'settings',
      label: 'Settings & Profile',
      icon: Settings,
      description: 'Business Configuration',
    },
    {
      id: 'demo-guide',
      label: 'Judge Demo Flow',
      icon: HelpCircle,
      description: '3-Min Guided Tour',
    },
  ];

  const handleSelect = (viewId: string) => {
    onNavigate(viewId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-30 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed lg:static top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="overflow-y-auto py-4 px-3 space-y-6">
          {/* Quick link to Landing Page */}
          <div>
            <button
              onClick={() => handleSelect('landing')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span className="text-blue-400">&larr;</span>
                <span>Public Website</span>
              </div>
              <span className="text-[10px] uppercase font-mono text-slate-400">Home</span>
            </button>
          </div>

          {/* Section: Main BI Navigation */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Business Intelligence
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                      isActive
                        ? 'bg-blue-600/90 text-white shadow-sm font-bold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                          item.badgeColor || 'bg-slate-700 text-slate-300 border-slate-600'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section: Management & Tools */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Management & Tools
            </div>
            <nav className="space-y-1">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
                      isActive
                        ? 'bg-slate-800 text-white font-bold border border-slate-700'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section: 10Alytics Track Badge */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className="rounded-lg p-2.5 bg-slate-800/60 border border-slate-700/60 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-blue-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>10Alytics BuildFest 2026</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-tight">
              Track: AI for Business &amp; Productivity
              <br />
              <span className="text-slate-300 font-medium">Specialization: BI Tools</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
