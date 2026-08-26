import React, { useState } from 'react';
import { CustomerRecord, BusinessProfile, Language } from '../../types';
import { formatCurrency } from '../../lib/biEngine';
import {
  Users,
  AlertTriangle,
  Sparkles,
  Phone,
  MessageCircle,
  Clock,
  Search,
  CheckCircle2,
  Share2,
  Copy,
  TrendingUp,
  UserCheck,
  ShieldAlert,
  Globe,
  Check,
} from 'lucide-react';

interface CustomerIntelligenceViewProps {
  customers: CustomerRecord[];
  profile: BusinessProfile;
  onNavigate: (view: string) => void;
}

export const CustomerIntelligenceView: React.FC<CustomerIntelligenceViewProps> = ({
  customers,
  profile,
  onNavigate,
}) => {
  const curr = profile.currency;
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSegment, setActiveSegment] = useState<string>('all');
  const [generatedMessage, setGeneratedMessage] = useState<{
    customerId: string;
    customerName: string;
    text: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const atRiskCustomers = customers.filter((c) => c.status === 'at_risk' || c.status === 'inactive');
  const champions = customers.filter((c) => c.status === 'champion');
  const regulars = customers.filter((c) => c.status === 'loyal');

  const totalAtRiskSpend = atRiskCustomers.reduce((a, c) => a + c.totalSpend, 0);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      (c.preferredProduct && c.preferredProduct.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSegment =
      activeSegment === 'all'
        ? true
        : activeSegment === 'at_risk'
        ? c.status === 'at_risk' || c.status === 'inactive'
        : c.status === activeSegment;
    return matchesSearch && matchesSegment;
  });

  const getMessageText = (customer: CustomerRecord) => {
    const prod = customer.preferredProduct || 'grain and pantry essentials';
    return `Hello ${customer.name}! Warm greetings from ${profile.name}. We noticed it has been a few weeks since your last restock of ${prod}. We have reserved fresh inventory and a 3.5% early-settlement incentive for your next order this week. Would you like us to prepare your dispatch?`;
  };

  const handleGenerateWhatsAppMessage = (customer: CustomerRecord) => {
    const text = getMessageText(customer);
    setGeneratedMessage({
      customerId: customer.id,
      customerName: customer.name,
      text,
    });
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Customer Retention &amp; Risk Radar
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              {atRiskCustomers.length} Accounts At-Risk
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Detect churn signals early, monitor client purchase cycles, and generate multilingual outreach
          </p>
        </div>

        <button
          onClick={() => onNavigate('ask-veaivex')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI About Churn</span>
        </button>
      </div>

      {/* Customer Risk Radar Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* At-Risk Callout */}
        <div
          onClick={() => setActiveSegment('at_risk')}
          className={`border rounded-2xl p-5 cursor-pointer transition-all ${
            activeSegment === 'at_risk'
              ? 'bg-amber-500/10 border-amber-500 shadow-xs'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              At-Risk Accounts
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {atRiskCustomers.length}
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              Cycle Exceeded
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Historic exposure: <strong className="text-slate-800">{formatCurrency(totalAtRiskSpend, curr)}</strong>
          </p>
        </div>

        {/* Champions */}
        <div
          onClick={() => setActiveSegment('champion')}
          className={`border rounded-2xl p-5 cursor-pointer transition-all ${
            activeSegment === 'champion'
              ? 'bg-blue-500/10 border-blue-500 shadow-xs'
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              VIP Champions
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {champions.length}
            </span>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
              Top 20%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generates 64% of gross business revenue
          </p>
        </div>

        {/* Regulars */}
        <div
          onClick={() => setActiveSegment('loyal')}
          className={`border rounded-2xl p-5 cursor-pointer transition-all ${
            activeSegment === 'loyal'
              ? 'bg-emerald-500/10 border-emerald-500 shadow-xs'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Loyal Regulars
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {regulars.length}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Consistent 10-18 day re-order velocity
          </p>
        </div>
      </div>

      {/* WhatsApp Re-engagement Generator modal / drawer if active */}
      {generatedMessage && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Re-engagement Outreach Draft for {generatedMessage.customerName}
                </h3>
                <span className="text-[11px] text-slate-400">
                  Preview and copy message (Human approval &amp; dispatch)
                </span>
              </div>
            </div>

            {/* Dismiss button */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                English
              </span>
              <button
                onClick={() => setGeneratedMessage(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed">
            "{generatedMessage.text}"
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <span className="text-[11px] text-slate-400">
              Note: Messages are copied to your clipboard to send via WhatsApp or SMS.
            </span>

            <button
              onClick={() => handleCopyText(generatedMessage.customerId, generatedMessage.text)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs"
            >
              {copiedId === generatedMessage.customerId ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Customer Directory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Customer Accounts &amp; Churn Risk
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredCustomers.length} verified customer accounts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search name, phone, product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setActiveSegment('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                activeSegment === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveSegment('at_risk')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                activeSegment === 'at_risk' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              At Risk ({atRiskCustomers.length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Risk Status</th>
                <th className="py-2.5 px-3">Last Order</th>
                <th className="py-2.5 px-3">Orders</th>
                <th className="py-2.5 px-3">Total Spend</th>
                <th className="py-2.5 px-3">Key Staple</th>
                <th className="py-2.5 px-3 text-right">Outreach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCustomers.map((c) => (
                <tr
                  key={c.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    c.status === 'at_risk' ? 'bg-amber-50/40' : ''
                  }`}
                >
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-slate-900 block">{c.name}</span>
                    <span className="text-[10px] text-slate-400">{c.phone}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    {c.status === 'champion' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        VIP Champion
                      </span>
                    ) : c.status === 'at_risk' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        At Risk ({c.daysSinceLastOrder}d)
                      </span>
                    ) : c.status === 'inactive' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        Inactive ({c.daysSinceLastOrder}d)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        Loyal Regular
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                    {c.lastOrderDate}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">
                    {c.totalOrders}
                  </td>
                  <td className="py-2.5 px-3 font-black text-slate-900">
                    {formatCurrency(c.totalSpend, curr)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 truncate max-w-[140px]">
                    {c.preferredProduct}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => handleGenerateWhatsAppMessage(c)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors inline-flex items-center gap-1"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Draft Message</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
