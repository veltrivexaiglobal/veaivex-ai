import React from 'react';
import { Home, Zap, Wallet, Receipt, User, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, isAdminMode, setIsAdminMode } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'data', label: 'Data/Bills', icon: Zap },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'transactions', label: 'History', icon: Receipt },
    { id: 'account', label: 'Account', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around shadow-lg safe-bottom-padding">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id && !isAdminMode;

        return (
          <button
            key={item.id}
            onClick={() => {
              setIsAdminMode(false);
              setActiveTab(item.id);
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-150 min-w-[60px] min-h-[48px] ${
              isActive
                ? 'text-emerald-600 font-bold scale-105'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div
              className={`p-1 rounded-xl transition ${
                isActive ? 'bg-emerald-50 text-emerald-600' : ''
              }`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}

      {/* Admin Mobile Switcher */}
      <button
        onClick={() => {
          setIsAdminMode(!isAdminMode);
          if (!isAdminMode) setActiveTab('admin');
          else setActiveTab('home');
        }}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition min-w-[50px] min-h-[48px] ${
          isAdminMode ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <div className={`p-1 rounded-xl ${isAdminMode ? 'bg-amber-100 text-amber-600' : ''}`}>
          <ShieldCheck className="w-5 h-5" />
        </div>
        <span className="text-[10px] tracking-tight mt-0.5">Admin</span>
      </button>
    </nav>
  );
};
