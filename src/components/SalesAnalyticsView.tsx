import React, { useState } from 'react';
import { SaleRecord, ProductItem, BusinessProfile } from '../../types';
import { formatCurrency } from '../../lib/biEngine';
import {
  TrendingUp,
  Sparkles,
  Search,
  Filter,
  ShoppingCart,
  CheckCircle,
  Package,
  Layers,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface SalesAnalyticsViewProps {
  sales: SaleRecord[];
  products: ProductItem[];
  profile: BusinessProfile;
  onNavigate: (view: string) => void;
}

export const SalesAnalyticsView: React.FC<SalesAnalyticsViewProps> = ({
  sales,
  products,
  profile,
  onNavigate,
}) => {
  const curr = profile.currency;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');

  // Filter sales
  const filteredSales = sales.filter((s) => {
    const matchesSearch =
      s.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = selectedChannel === 'all' || s.channel === selectedChannel;
    return matchesSearch && matchesChannel;
  });

  // Calculate Product Sales Performance
  const productPerformance = products.map((p) => {
    const matchingSales = sales.filter((s) => s.productId === p.id);
    const totalRev = matchingSales.reduce((acc, s) => acc + s.totalRevenue, 0);
    const unitsSold = matchingSales.reduce((acc, s) => acc + s.quantity, 0);
    const profit = matchingSales.reduce((acc, s) => acc + s.netProfit, 0);

    return {
      ...p,
      totalRev,
      unitsSold,
      profit,
    };
  }).sort((a, b) => b.totalRev - a.totalRev);

  // Top products chart data
  const topProductsChart = productPerformance.slice(0, 6).map((p) => ({
    name: p.name.length > 18 ? p.name.slice(0, 18) + '...' : p.name,
    revenue: p.totalRev,
    profit: p.profit,
  }));

  // Channel revenue breakdown
  const channelMap = new Map<string, number>();
  sales.forEach((s) => {
    channelMap.set(s.channel, (channelMap.get(s.channel) || 0) + s.totalRevenue);
  });
  const channels = Array.from(channelMap.entries()).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Sales Intelligence &amp; Velocity
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {sales.length} Transactions
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Analyze product velocity, multi-channel performance, and top revenue drivers
          </p>
        </div>

        <button
          onClick={() => onNavigate('ask-veaivex')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>Ask AI About Sales</span>
        </button>
      </div>

      {/* AI Sales Explanation Card */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-blue-800 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-blue-200 uppercase tracking-wider">
            AI Sales Diagnostic Engine
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
            <span className="font-bold text-blue-300 block mb-1">What Changed?</span>
            <p className="text-slate-200 leading-relaxed">
              Sales increased by +4.2% MoM, driven strongly by Bulk Wholesale Grains and Fast-Moving Pasta lines.
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
            <span className="font-bold text-indigo-300 block mb-1">Why Did It Change?</span>
            <p className="text-slate-200 leading-relaxed">
              Commercial restaurant clients increased order volume by +28%, compensating for retail consumer basket shrink.
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
            <span className="font-bold text-emerald-300 block mb-1">Recommended Action</span>
            <p className="text-slate-200 leading-relaxed">
              Offer scheduled auto-restock subscriptions to top 5 catering and wholesale accounts to lock in weekly run-rate.
            </p>
          </div>
        </div>
      </div>

      {/* Sales Velocity Chart & Channel Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products Bar Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Top Revenue &amp; Profit Generating Products
              </h3>
              <p className="text-xs text-slate-500">
                Comparison of revenue vs net profit per product line
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProductsChart} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} angle={-15} textAnchor="end" />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={10}
                  tickFormatter={(val) => formatCurrency(val, curr)}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val), curr), '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="revenue" fill="#2563eb" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="#059669" name="Net Profit" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Share */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Sales by Sales Channel
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Where your transactions originate
            </p>

            <div className="space-y-3">
              {channels.map((ch) => {
                const totalRev = sales.reduce((acc, s) => acc + s.totalRevenue, 0);
                const pct = totalRev > 0 ? (ch.value / totalRev) * 100 : 0;
                return (
                  <div key={ch.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">{ch.name}</span>
                      <span className="text-slate-900 font-bold">{formatCurrency(ch.value, curr)} ({pct.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900">
            <span className="font-bold">Growth Tip:</span> Wholesale Rep and WhatsApp Social orders have a 42% higher Average Order Value than In-Store walks-ins.
          </div>
        </div>
      </div>

      {/* Transaction Log Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Transaction Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Showing {filteredSales.length} validated sales records
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search product, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Channel Filter */}
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Channels</option>
              <option value="In-Store">In-Store</option>
              <option value="WhatsApp / Social">WhatsApp / Social</option>
              <option value="Online Web">Online Web</option>
              <option value="Wholesale Rep">Wholesale Rep</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Product</th>
                <th className="py-2.5 px-3">Qty</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3 text-right">Revenue</th>
                <th className="py-2.5 px-3 text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-500 whitespace-nowrap">
                    {sale.date}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-[180px] truncate">
                    {sale.customerName}
                  </td>
                  <td className="py-2.5 px-3 max-w-[200px] truncate">
                    <span className="font-medium text-slate-800">{sale.productName}</span>
                    <span className="block text-[10px] text-slate-400">{sale.category}</span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">
                    {sale.quantity}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {sale.channel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                    {formatCurrency(sale.totalRevenue, curr)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-600">
                    {formatCurrency(sale.netProfit, curr)}
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
