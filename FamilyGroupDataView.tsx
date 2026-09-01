import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Zap,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NetworkId, DataPlan } from '../../types';
import { NETWORKS } from '../../data/mockData';
import { formatNaira, detectNetworkFromPhone, sanitizePhone, isValidNigerianPhone } from '../../utils';
import { NetworkBadge } from '../common/NetworkBadge';
import { PinModal } from '../common/PinModal';

interface GroupMemberItem {
  id: string;
  name: string;
  phone: string;
  network: NetworkId;
  planId: string;
}

export const FamilyGroupDataView: React.FC = () => {
  const { user, dataPlans, buyData, setSelectedReceiptTx } = useApp();

  const [members, setMembers] = useState<GroupMemberItem[]>([
    { id: '1', name: 'My SIM', phone: '08031234567', network: 'mtn', planId: 'mtn-sme-2' },
    { id: '2', name: 'Mum', phone: '08129876543', network: 'airtel', planId: 'airtel-corp-2' },
    { id: '3', name: 'Sister', phone: '08051122334', network: 'glo', planId: 'glo-sme-3' },
  ]);

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const addMember = () => {
    if (members.length >= 5) {
      setErrorMessage('Maximum 5 lines per family batch recharge.');
      return;
    }
    const newId = (members.length + 1).toString();
    setMembers([
      ...members,
      { id: newId, name: `Line ${members.length + 1}`, phone: '', network: 'mtn', planId: 'mtn-sme-1' },
    ]);
  };

  const removeMember = (id: string) => {
    if (members.length <= 1) return;
    setMembers(members.filter((m) => m.id !== id));
  };

  const updateMember = (id: string, updates: Partial<GroupMemberItem>) => {
    setMembers(
      members.map((m) => {
        if (m.id === id) {
          const updated = { ...m, ...updates };
          if (updates.phone) {
            const detected = detectNetworkFromPhone(updates.phone);
            if (detected) {
              updated.network = detected;
              // Reset to first plan for detected network
              const firstPlan = dataPlans.find((p) => p.network === detected);
              if (firstPlan) updated.planId = firstPlan.id;
            }
          }
          return updated;
        }
        return m;
      })
    );
  };

  const calculateTotal = () => {
    return members.reduce((sum, m) => {
      const plan = dataPlans.find((p) => p.id === m.planId);
      return sum + (plan ? plan.price : 0);
    }, 0);
  };

  const totalCost = calculateTotal();
  const bulkDiscount = Math.floor(totalCost * 0.03); // 3% extra bulk family discount
  const finalPayable = Math.max(totalCost - bulkDiscount, 0);

  const handleInitiateBatch = () => {
    setErrorMessage('');
    for (const m of members) {
      const clean = sanitizePhone(m.phone);
      if (!clean || !isValidNigerianPhone(clean)) {
        setErrorMessage(`Invalid phone number for ${m.name || 'a member'}.`);
        return;
      }
    }
    if (user.walletBalance < finalPayable) {
      setErrorMessage(
        `Insufficient wallet balance. You need ${formatNaira(finalPayable)}, but balance is ${formatNaira(user.walletBalance)}.`
      );
      return;
    }
    setIsPinModalOpen(true);
  };

  const handlePinSuccess = async () => {
    setIsPinModalOpen(false);
    setIsProcessing(true);

    let lastTx = null;
    for (const m of members) {
      const plan = dataPlans.find((p) => p.id === m.planId);
      if (plan) {
        const res = await buyData({
          network: m.network,
          phone: sanitizePhone(m.phone),
          plan,
        });
        if (res.success && res.transaction) {
          lastTx = res.transaction;
        }
      }
    }

    setIsProcessing(false);
    if (lastTx) {
      setSelectedReceiptTx(lastTx);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600" />
            Family & Group Data Recharges
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Recharge multiple phone numbers simultaneously in 1 tap with extra 3% bulk family discount
          </p>
        </div>
        <div className="text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
          Wallet Balance:{' '}
          <span className="font-bold text-emerald-600 font-mono">
            {formatNaira(user.walletBalance)}
          </span>
        </div>
      </div>

      {/* Member Cards */}
      <div className="space-y-3">
        {members.map((member, index) => {
          const availablePlansForNet = dataPlans.filter((p) => p.network === member.network);
          const currentPlan = dataPlans.find((p) => p.id === member.planId) || availablePlansForNet[0];

          return (
            <div
              key={member.id}
              className="p-4 rounded-3xl bg-white border border-slate-200 space-y-3 relative shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) => updateMember(member.id, { name: e.target.value })}
                    placeholder="Recipient Name"
                    className="h-8 px-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-900 outline-none focus:border-teal-500"
                  />
                </div>

                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(member.id)}
                    className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition"
                    title="Remove line"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Phone */}
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={member.phone}
                    onChange={(e) => updateMember(member.id, { phone: e.target.value })}
                    placeholder="08034567890"
                    maxLength={14}
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono outline-none focus:border-teal-500"
                  />
                </div>

                {/* Network */}
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Network
                  </label>
                  <select
                    value={member.network}
                    onChange={(e) => {
                      const net = e.target.value as NetworkId;
                      const firstPlan = dataPlans.find((p) => p.network === net);
                      updateMember(member.id, { network: net, planId: firstPlan?.id || '' });
                    }}
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-teal-500"
                  >
                    {(['mtn', 'airtel', 'glo', '9mobile'] as NetworkId[]).map((n) => (
                      <option key={n} value={n} className="bg-white text-slate-900">
                        {NETWORKS[n].name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Plan */}
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Data Bundle
                  </label>
                  <select
                    value={member.planId}
                    onChange={(e) => updateMember(member.id, { planId: e.target.value })}
                    className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 outline-none focus:border-teal-500"
                  >
                    {availablePlansForNet.map((p) => (
                      <option key={p.id} value={p.id} className="bg-white text-slate-900">
                        {p.size} ({p.category}) - {formatNaira(p.price)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                <NetworkBadge network={member.network} size="sm" />
                <span className="font-mono font-bold text-emerald-600">
                  {currentPlan ? formatNaira(currentPlan.price) : '₦0.00'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Line Button */}
      {members.length < 5 && (
        <button
          type="button"
          onClick={addMember}
          className="w-full h-12 rounded-2xl border-2 border-dashed border-slate-300 hover:border-teal-500 hover:bg-white text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center justify-center gap-2 transition"
        >
          <Plus className="w-4 h-4 text-teal-600" />
          <span>Add Another Line ({members.length}/5)</span>
        </button>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Order Summary */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900 font-display">Batch Order Summary</h3>

        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex justify-between">
            <span className="text-slate-500">Total Lines to Top-up</span>
            <span className="font-bold text-slate-900">{members.length} lines</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Subtotal Price</span>
            <span>{formatNaira(totalCost)}</span>
          </div>
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Family Group Bulk Discount (3%)</span>
            <span>-{formatNaira(bulkDiscount)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-900">
            <span>Total Payable</span>
            <span className="text-emerald-600 font-mono">{formatNaira(finalPayable)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleInitiateBatch}
          disabled={isProcessing}
          className="w-full h-13 rounded-2xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-md shadow-teal-600/20"
        >
          {isProcessing ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Processing Batch Recharge...</span>
            </>
          ) : (
            <>
              <span>Recharge All {members.length} Lines ({formatNaira(finalPayable)})</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
        title="Authorize Batch Recharge"
        subtitle={`Enter 4-digit PIN to top-up ${members.length} numbers for ${formatNaira(finalPayable)}`}
      />
    </div>
  );
};
