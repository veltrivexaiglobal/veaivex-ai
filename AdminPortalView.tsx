import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Activity,
  DollarSign,
  Zap,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Settings,
  Plus,
  RefreshCw,
  AlertTriangle,
  FileText,
  Tag,
  ToggleLeft,
  ToggleRight,
  Server,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NetworkId, DataPlan, Transaction } from '../../types';
import { NETWORKS, DISCO_PROVIDERS } from '../../data/mockData';
import { formatNaira, formatDate } from '../../utils';
import { NetworkBadge } from '../common/NetworkBadge';

export const AdminPortalView: React.FC = () => {
  const {
    adminStats,
    transactions,
    dataPlans,
    supportTickets,
    updateDataPlanPrice,
    togglePlanAvailability,
    updateTransactionStatus,
    replySupportTicket,
    addPromoCode,
    setSelectedReceiptTx,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'transactions' | 'plans' | 'providers' | 'support' | 'promos'
  >('overview');

  // Plan editing modal
  const [editingPlan, setEditingPlan] = useState<DataPlan | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editCost, setEditCost] = useState<number>(0);

  // Promo creation
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState<number>(50);
  const [newPromoType, setNewPromoType] = useState<'fixed' | 'percentage'>('fixed');
  const [newPromoDesc, setNewPromoDesc] = useState('');

  // Selected support ticket in admin
  const [adminReplyText, setAdminReplyText] = useState('');
  const [selectedAdminTicketId, setSelectedAdminTicketId] = useState<string | null>(
    supportTickets.length > 0 ? supportTickets[0].id : null
  );

  const [adminNotice, setAdminNotice] = useState('');

  const handleSavePlanEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    updateDataPlanPrice(editingPlan.id, editPrice, editCost);
    setEditingPlan(null);
    setAdminNotice(`Updated pricing for ${editingPlan.name}.`);
    setTimeout(() => setAdminNotice(''), 3000);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim()) return;

    addPromoCode({
      code: newPromoCode.trim().toUpperCase(),
      discountType: newPromoType,
      discountValue: newPromoDiscount,
      minPurchase: 500,
      description: newPromoDesc || `${newPromoCode} Special Discount`,
      active: true,
      maxUses: 100,
      timesUsed: 0,
    });

    setNewPromoCode('');
    setNewPromoDesc('');
    setAdminNotice('New promotional code created.');
    setTimeout(() => setAdminNotice(''), 3000);
  };

  const handleAdminReplyTicket = (ticketId: string) => {
    if (!adminReplyText.trim()) return;
    replySupportTicket(ticketId, adminReplyText, 'admin');
    setAdminReplyText('');
    setAdminNotice('Replied to user ticket.');
    setTimeout(() => setAdminNotice(''), 3000);
  };

  const currentAdminTicket = supportTickets.find((t) => t.id === selectedAdminTicketId);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Admin Top Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white font-display">VeltriPay Commercial Admin Suite</h1>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                SUPER ADMIN
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live transaction logs, margin configurator, telco API gateway switches & support desk
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Production Server (Port 3000)
          </span>
        </div>
      </div>

      {adminNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{adminNotice}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
        {[
          { id: 'overview', label: 'Platform KPIs', icon: TrendingUp },
          { id: 'transactions', label: 'Live Transactions Audit', icon: Activity },
          { id: 'plans', label: 'Data Plan Margins', icon: Zap },
          { id: 'providers', label: 'API Gateway Routing', icon: Server },
          { id: 'support', label: 'Support Helpdesk', icon: MessageSquare },
          { id: 'promos', label: 'Promo Coupons', icon: Tag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= 1. OVERVIEW KPIS ================= */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">Total Platform Volume</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {formatNaira(adminStats.totalVolume)}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">+18.4% this week</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">Gross Profit Margins</span>
              <div className="text-2xl font-extrabold text-emerald-600 font-mono">
                {formatNaira(adminStats.totalRevenue)}
              </div>
              <span className="text-[10px] text-slate-500">VTU spread markup</span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">Total Registered Users</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {adminStats.totalUsers.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">
                {adminStats.activeUsersToday.toLocaleString()} active today
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-1 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold">System Delivery Rate</span>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {adminStats.successRate}%
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Avg 3.2s latency</span>
            </div>
          </div>

          {/* Telco Network Health Status Panel */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 font-display">Telco API Infrastructure Health</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['mtn', 'airtel', 'glo', '9mobile'] as NetworkId[]).map((n) => {
                const net = NETWORKS[n];
                return (
                  <div
                    key={n}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: net.color }} />
                      <span className="text-xs font-bold text-slate-900">{net.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      OPERATIONAL
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. LIVE TRANSACTIONS AUDIT ================= */}
      {activeAdminTab === 'transactions' && (
        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Live Audit & Force Settlement Log ({transactions.length})
            </h3>
            <span className="text-xs text-slate-500">Click actions to override telco status</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                <tr>
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Recipient / Account</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900">{tx.reference}</td>
                    <td className="py-3 px-3 capitalize">
                      <div className="flex items-center gap-1.5">
                        {tx.metadata.network && (
                          <NetworkBadge network={tx.metadata.network} size="sm" showName={false} />
                        )}
                        <span className="text-slate-800">{tx.type.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">
                      {tx.metadata.recipientPhone || tx.metadata.meterNumber || 'Wallet'}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {formatNaira(tx.finalAmount)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          tx.status === 'successful'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : tx.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      <button
                        onClick={() => setSelectedReceiptTx(tx)}
                        className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-700"
                      >
                        Receipt
                      </button>

                      {tx.status === 'pending' && (
                        <button
                          onClick={() => updateTransactionStatus(tx.id, 'successful')}
                          className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-[10px] font-bold text-white shadow-xs"
                        >
                          Force Success
                        </button>
                      )}

                      {tx.status === 'successful' && (
                        <button
                          onClick={() => updateTransactionStatus(tx.id, 'reversed')}
                          className="px-2 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-[10px]"
                        >
                          Refund User
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= 3. DATA PLAN PRICING & MARGINS ================= */}
      {activeAdminTab === 'plans' && (
        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 font-display">Data Bundle Margins & Catalog</h3>
            <span className="text-xs text-slate-500">Real-time selling price & cost markup editor</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {dataPlans.map((plan) => {
              const profitMargin = plan.price - plan.costPrice;
              return (
                <div
                  key={plan.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <NetworkBadge network={plan.network} size="sm" />
                      <button
                        onClick={() => togglePlanAvailability(plan.id)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          plan.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {plan.isAvailable ? 'ACTIVE' : 'DISABLED'}
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mt-1">{plan.name}</h4>
                    <p className="text-[11px] text-slate-500">{plan.validity} • {plan.category}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Selling Price</span>
                      <span className="font-bold text-slate-900 font-mono">{formatNaira(plan.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Cost Price</span>
                      <span className="text-slate-500 font-mono">{formatNaira(plan.costPrice)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Profit Margin</span>
                      <span className="font-mono">+{formatNaira(profitMargin)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEditingPlan(plan);
                      setEditPrice(plan.price);
                      setEditCost(plan.costPrice);
                    }}
                    className="w-full h-8 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition flex items-center justify-center gap-1 shadow-xs"
                  >
                    <span>Edit Pricing / Margin</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= 4. PROVIDER API ROUTING ================= */}
      {activeAdminTab === 'providers' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">VTU & Payment Gateway Configuration</h3>
            <p className="text-xs text-slate-500 mt-1">
              Switch upstream API providers dynamically without code redeployments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Active VTU Core Engine
              </span>
              <select className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none shadow-xs">
                <option value="vtpass">VTPass Nigeria (Primary Production Gateway)</option>
                <option value="clubkonnect">ClubKonnect API (Automated Backup)</option>
                <option value="shago">Shago Payments API</option>
                <option value="mock">Simulated Mock Engine (Development)</option>
              </select>
              <p className="text-[11px] text-slate-500">
                Fallback failover is active. If primary fails 3 times, auto-routes to backup.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                Virtual Account / Collection Gateway
              </span>
              <select className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none shadow-xs">
                <option value="monnify">Monnify (Wema / Sterling Dynamic NUBANs)</option>
                <option value="paystack">Paystack Dedicated Virtual Accounts (Titan Trust)</option>
                <option value="flutterwave">Flutterwave Virtual Accounts</option>
              </select>
              <p className="text-[11px] text-slate-500">
                Webhooks are active at <code>/api/webhooks/payment</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= 5. SUPPORT HELPDESK ================= */}
      {activeAdminTab === 'support' && (
        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 font-display">Customer Tickets Helpdesk</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              {supportTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedAdminTicketId(t.id)}
                  className={`p-3 rounded-2xl border cursor-pointer text-left transition ${
                    selectedAdminTicketId === t.id
                      ? 'bg-amber-50 border-amber-500 text-slate-900'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <div className="flex justify-between text-[10px]">
                    <span className="font-mono text-amber-700 font-bold">{t.id}</span>
                    <span className="font-bold uppercase text-slate-600">{t.priority}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">{t.subject}</h4>
                  <p className="text-[10px] text-slate-500">{formatDate(t.createdAt)}</p>
                </div>
              ))}
            </div>

            {currentAdminTicket && (
              <div className="md:col-span-2 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between h-96">
                <div>
                  <div className="border-b border-slate-200 pb-2 mb-2 flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{currentAdminTicket.subject}</span>
                    <span className="text-[10px] font-mono text-amber-700 font-bold">
                      User Ref: {currentAdminTicket.linkedTransactionRef || 'N/A'}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1 text-xs">
                    {currentAdminTicket.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`p-3 rounded-2xl max-w-[85%] ${
                          m.sender === 'admin'
                            ? 'ml-auto bg-amber-600 text-white font-medium'
                            : 'mr-auto bg-white border border-slate-200 text-slate-800 shadow-xs'
                        }`}
                      >
                        <p>{m.text}</p>
                        <span className="text-[9px] opacity-70 block text-right mt-1 font-mono">
                          {formatDate(m.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-200">
                  <input
                    type="text"
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    placeholder="Type official admin response to customer..."
                    className="flex-1 h-10 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-amber-500 shadow-xs placeholder-slate-400"
                  />
                  <button
                    onClick={() => handleAdminReplyTicket(currentAdminTicket.id)}
                    className="px-4 h-10 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs"
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= 6. PROMO COUPONS ================= */}
      {activeAdminTab === 'promos' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-xs">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display">Create Promotional Discount Coupon</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Generate promo codes that give customers instant discounts on checkout.
            </p>
          </div>

          <form onSubmit={handleCreatePromo} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                value={newPromoCode}
                onChange={(e) => setNewPromoCode(e.target.value.toUpperCase())}
                placeholder="e.g. FLASH100"
                required
                className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs uppercase font-mono font-bold text-slate-900 outline-none focus:border-amber-500 shadow-xs placeholder-slate-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Discount Type
              </label>
              <select
                value={newPromoType}
                onChange={(e) => setNewPromoType(e.target.value as any)}
                className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-amber-500 shadow-xs"
              >
                <option value="fixed">Fixed Naira Amount (₦)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Discount Value
              </label>
              <input
                type="number"
                value={newPromoDiscount}
                onChange={(e) => setNewPromoDiscount(Number(e.target.value))}
                required
                className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 outline-none focus:border-amber-500 shadow-xs placeholder-slate-400"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs"
              >
                Create Coupon
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Plan Pricing Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display">Edit Bundle Pricing</h3>
            <p className="text-xs text-slate-500">{editingPlan.name}</p>

            <form onSubmit={handleSavePlanEdit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Customer Selling Price (₦)
                </label>
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(Number(e.target.value))}
                  required
                  className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500 shadow-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Telco API Cost Price (₦)
                </label>
                <input
                  type="number"
                  value={editCost}
                  onChange={(e) => setEditCost(Number(e.target.value))}
                  required
                  className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 outline-none focus:border-amber-500 shadow-xs"
                />
              </div>

              <div className="flex justify-between text-xs text-emerald-600 font-semibold pt-1">
                <span>Calculated Profit:</span>
                <span>+{formatNaira(editPrice - editCost)}</span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs"
                >
                  Save Pricing
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
