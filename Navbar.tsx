import React, { useState } from 'react';
import {
  Bell,
  Wallet,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ChevronDown,
  User,
  LogOut,
  Gift,
  HelpCircle,
  TrendingUp,
  Settings,
  X,
  Server,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNaira } from '../../utils';

export const Navbar: React.FC = () => {
  const {
    user,
    notifications,
    activeTab,
    setActiveTab,
    isAdminMode,
    setIsAdminMode,
    markNotificationsAsRead,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleOpenNotifs = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen && unreadCount > 0) {
      markNotificationsAsRead();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('home')}>
          <img
            src="/assets/brand/veltripay-logo.png"
            alt="VeltriPay"
            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 font-display tracking-tight">
                VeltriPay
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded uppercase">
                NG
              </span>
            </div>
            <p className="text-[10px] text-slate-500 hidden sm:block">Digital Utilities • VTU & Payments</p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {[
            { id: 'home', label: 'Home' },
            { id: 'data', label: 'Data' },
            { id: 'airtime', label: 'Airtime' },
            { id: 'bills', label: 'Bills' },
            { id: 'group_data', label: 'Family' },
            { id: 'wallet', label: 'Wallet' },
            { id: 'insights', label: 'Analytics' },
            { id: 'rewards', label: 'Rewards' },
            { id: 'support', label: 'Help' },
            { id: 'backend', label: 'Backend API' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setIsAdminMode(false);
                setActiveTab(item.id);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                activeTab === item.id && !isAdminMode
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions: Wallet Snapshot, Backend / Admin Portal, Notifs, Profile */}
        <div className="flex items-center gap-2">
          {/* Backend API Quick Button */}
          <button
            onClick={() => {
              setIsAdminMode(false);
              setActiveTab('backend');
            }}
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition ${
              activeTab === 'backend'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs font-bold'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
            }`}
            title="Inspect live Express backend API and endpoint logs"
          >
            <Server className="w-3.5 h-3.5 text-emerald-600" />
            <span>API Console</span>
          </button>

          {/* Admin Portal Toggle */}
          <button
            onClick={() => {
              setIsAdminMode(!isAdminMode);
              if (!isAdminMode) setActiveTab('admin');
              else setActiveTab('home');
            }}
            className={`hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border transition ${
              isAdminMode
                ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs font-bold'
                : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 shadow-xs'
            }`}
            title="Switch between User App and Admin Management Panel"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>{isAdminMode ? 'Exit Admin' : 'Admin'}</span>
          </button>

          {/* Quick Wallet Balance Pill */}
          <button
            onClick={() => {
              setIsAdminMode(false);
              setActiveTab('wallet');
            }}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-2.5 sm:px-3 py-1.5 rounded-xl transition shadow-xs"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Wallet className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <div className="text-left">
              <p className="text-[9px] text-slate-500 font-medium leading-none hidden sm:block">Wallet</p>
              <p className="text-xs font-bold text-emerald-700 font-mono leading-tight">
                {formatNaira(user.walletBalance)}
              </p>
            </div>
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={handleOpenNotifs}
              className="relative p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 transition shadow-xs"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-600" />
                    <h4 className="text-sm font-bold text-slate-900 font-display">Notifications</h4>
                  </div>
                  <button
                    onClick={() => setIsNotifOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3 max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No notifications yet</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.linkTab) {
                            setActiveTab(n.linkTab);
                            setIsNotifOpen(false);
                          }
                        }}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                          n.read
                            ? 'bg-slate-50 border-slate-200'
                            : 'bg-emerald-50/60 border-emerald-200'
                        } hover:border-emerald-400`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-bold text-slate-800">{n.title}</p>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <button
            onClick={() => {
              setIsAdminMode(false);
              setActiveTab('account');
            }}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition shadow-xs"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xs">
              {user.fullName ? user.fullName[0] : 'U'}
            </div>
            <span className="text-xs font-semibold text-slate-700 hidden xl:inline max-w-[80px] truncate">
              {user.fullName.split(' ')[0]}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
