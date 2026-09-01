import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Filter,
  Download,
  Zap,
  Smartphone,
  Lightbulb,
  Tv,
  Wallet,
  GraduationCap,
  Users,
  PiggyBank,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Transaction, TransactionType, TransactionStatus } from '../../types';
import { formatNaira, formatDate } from '../../utils';
import { NetworkBadge } from '../common/NetworkBadge';

export const TransactionsView: React.FC = () => {
  const { transactions, setSelectedReceiptTx, setActiveTab } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredTransactions = transactions.filter((tx) => {
    // Search filter
    const matchesSearch =
      tx.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.metadata.recipientPhone && tx.metadata.recipientPhone.includes(searchQuery)) ||
      (tx.metadata.meterNumber && tx.metadata.meterNumber.includes(searchQuery)) ||
      (tx.metadata.customerName && tx.metadata.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.metadata.planName && tx.metadata.planName.toLowerCase().includes(searchQuery.toLowerCase()));

    // Type filter
    const matchesType = selectedType === 'all' || tx.type === selectedType;

    // Status filter
    const matchesStatus = selectedStatus === 'all' || tx.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'successful':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'pending':
        return <Clock className="w-3.5 h-3.5 text-amber-600" />;
      case 'failed':
        return <XCircle className="w-3.5 h-3.5 text-rose-600" />;
      case 'reversed':
        return <RotateCcw className="w-3.5 h-3.5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getServiceIcon = (type: TransactionType) => {
    switch (type) {
      case 'data':
        return <Zap className="w-4 h-4 text-emerald-600" />;
      case 'airtime':
        return <Smartphone className="w-4 h-4 text-amber-600" />;
      case 'electricity':
        return <Lightbulb className="w-4 h-4 text-amber-600" />;
      case 'cable':
        return <Tv className="w-4 h-4 text-blue-600" />;
      case 'wallet_fund':
        return <Wallet className="w-4 h-4 text-teal-600" />;
      case 'education':
        return <GraduationCap className="w-4 h-4 text-purple-600" />;
      case 'wallet_transfer':
        return <Users className="w-4 h-4 text-indigo-600" />;
      case 'savings_deposit':
        return <PiggyBank className="w-4 h-4 text-pink-600" />;
      default:
        return <Receipt className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-600" />
            Transaction History & Receipts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time audit log of all data, airtime, and utility purchases with downloadable receipts
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reference, recipient phone, meter or service..."
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-slate-200 focus:border-emerald-500 text-slate-900 placeholder-slate-400 text-xs outline-none transition shadow-xs"
          />
        </div>

        {/* Type & Status Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'data', label: 'Data' },
              { id: 'airtime', label: 'Airtime' },
              { id: 'electricity', label: 'Electricity' },
              { id: 'cable', label: 'Cable' },
              { id: 'wallet_fund', label: 'Wallet Inflow' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedType === t.id
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 outline-none shadow-xs"
          >
            <option value="all">All Statuses</option>
            <option value="successful">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="reversed">Reversed</option>
          </select>
        </div>
      </div>

      {/* Transaction Records List */}
      <div className="space-y-2.5">
        {filteredTransactions.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-2 shadow-xs">
            <Receipt className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No matching transactions found</p>
            <p className="text-xs text-slate-500">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => setSelectedReceiptTx(tx)}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 transition flex items-center justify-between gap-3 cursor-pointer shadow-xs group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  {getServiceIcon(tx.type)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 capitalize truncate">
                      {tx.metadata.planName || tx.type.replace('_', ' ')}
                    </h4>
                    {tx.metadata.network && (
                      <NetworkBadge network={tx.metadata.network} size="sm" showName={false} />
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">
                    {tx.metadata.recipientPhone || tx.metadata.meterNumber || tx.reference}
                  </p>
                  <p className="text-[10px] text-slate-400">{formatDate(tx.timestamp)}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p
                  className={`text-xs font-bold font-mono ${
                    tx.type === 'wallet_fund' || tx.type === 'refund'
                      ? 'text-emerald-600'
                      : 'text-slate-900'
                  }`}
                >
                  {tx.type === 'wallet_fund' || tx.type === 'refund' ? '+' : '-'}
                  {formatNaira(tx.finalAmount)}
                </p>

                <div className="flex items-center justify-end gap-1 mt-1">
                  {getStatusIcon(tx.status)}
                  <span className="text-[10px] font-semibold text-slate-500 capitalize">
                    {tx.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
