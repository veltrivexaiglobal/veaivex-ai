import React, { useState, useEffect } from 'react';
import {
  Zap,
  Smartphone,
  CheckCircle2,
  Tag,
  Users,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ChevronRight,
  UserPlus,
  RotateCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NetworkId, PlanCategory, DataPlan } from '../../types';
import { NETWORKS } from '../../data/mockData';
import { formatNaira, detectNetworkFromPhone, sanitizePhone, isValidNigerianPhone } from '../../utils';
import { NetworkBadge } from '../common/NetworkBadge';
import { PinModal } from '../common/PinModal';

export const DataPurchaseView: React.FC = () => {
  const {
    user,
    dataPlans,
    beneficiaries,
    buyData,
    validatePromoCode,
    setSelectedReceiptTx,
  } = useApp();

  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId>('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PlanCategory>('SME');
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const [beneficiaryName, setBeneficiaryName] = useState('');

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showBeneficiaryPicker, setShowBeneficiaryPicker] = useState(false);

  // Auto-detect network when phone number changes
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setPhoneNumber(raw);
    const detected = detectNetworkFromPhone(raw);
    if (detected && detected !== selectedNetwork) {
      setSelectedNetwork(detected);
    }
  };

  // Filter plans based on selected network & category
  const availablePlans = dataPlans.filter(
    (p) => p.network === selectedNetwork && p.category === selectedCategory && p.isAvailable
  );

  // Auto-select first plan when network/category changes
  useEffect(() => {
    if (availablePlans.length > 0) {
      setSelectedPlan(availablePlans[0]);
    } else {
      setSelectedPlan(null);
    }
  }, [selectedNetwork, selectedCategory]);

  const handleApplyPromo = () => {
    if (!promoCode.trim() || !selectedPlan) return;
    const result = validatePromoCode(promoCode, 'data', selectedPlan.price);
    if (result.valid) {
      setPromoDiscount(result.discount);
      setPromoMessage(result.message);
      setErrorMessage('');
    } else {
      setPromoDiscount(0);
      setPromoMessage('');
      setErrorMessage(result.message);
    }
  };

  const handleInitiateOrder = () => {
    setErrorMessage('');
    const cleanPhone = sanitizePhone(phoneNumber);
    if (!cleanPhone || !isValidNigerianPhone(cleanPhone)) {
      setErrorMessage('Please enter a valid 11-digit Nigerian phone number (e.g. 08031234567).');
      return;
    }
    if (!selectedPlan) {
      setErrorMessage('Please select a data bundle to proceed.');
      return;
    }

    const finalAmount = Math.max(selectedPlan.price - promoDiscount, 0);
    if (user.walletBalance < finalAmount) {
      setErrorMessage(
        `Insufficient wallet balance. You need ${formatNaira(finalAmount)}, but your balance is ${formatNaira(user.walletBalance)}.`
      );
      return;
    }

    // Open PIN confirmation
    setIsPinModalOpen(true);
  };

  const handlePinSuccess = async () => {
    setIsPinModalOpen(false);
    if (!selectedPlan) return;

    setIsProcessing(true);
    const res = await buyData({
      network: selectedNetwork,
      phone: sanitizePhone(phoneNumber),
      plan: selectedPlan,
      promoCode: promoDiscount > 0 ? promoCode : undefined,
      saveBeneficiary,
      beneficiaryName,
    });
    setIsProcessing(false);

    if (res.success && res.transaction) {
      setSelectedReceiptTx(res.transaction);
      // Reset form
      setPhoneNumber('');
      setPromoCode('');
      setPromoDiscount(0);
      setPromoMessage('');
      setSaveBeneficiary(false);
    } else {
      setErrorMessage(res.message || 'Transaction failed. Please try again.');
    }
  };

  const categories: PlanCategory[] = ['SME', 'Corporate', 'Gifting', 'Direct'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
            <Zap className="w-6 h-6 text-emerald-600" />
            Buy Mobile Data Bundles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated SME & Corporate bundles delivered within 2–10 seconds
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Wallet Balance:{' '}
          <span className="font-bold text-emerald-600 font-mono">
            {formatNaira(user.walletBalance)}
          </span>
        </div>
      </div>

      {/* 1. Telco Network Selector */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          1. Select Mobile Network
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(['mtn', 'airtel', 'glo', '9mobile'] as NetworkId[]).map((netId) => {
            const net = NETWORKS[netId];
            const isSelected = selectedNetwork === netId;
            return (
              <button
                key={netId}
                type="button"
                onClick={() => setSelectedNetwork(netId)}
                className={`p-3.5 rounded-2xl border transition text-left flex items-center justify-between ${
                  isSelected
                    ? `${net.bgLight} ${net.borderColor} ring-2 ring-emerald-500/20 shadow-sm`
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{ backgroundColor: net.color }}
                  />
                  <span className="text-xs font-bold">{net.name}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Recipient Phone Number Input & Beneficiaries */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            2. Recipient Phone Number
          </label>
          <button
            type="button"
            onClick={() => setShowBeneficiaryPicker(!showBeneficiaryPicker)}
            className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Saved Contacts ({beneficiaries.length})</span>
          </button>
        </div>

        {/* Beneficiary Quick Picker Sheet */}
        {showBeneficiaryPicker && beneficiaries.length > 0 && (
          <div className="p-3 bg-white border border-slate-200 rounded-2xl space-y-2 animate-in fade-in duration-150 shadow-sm">
            <p className="text-[11px] font-semibold text-slate-500">Select a saved contact:</p>
            <div className="flex flex-wrap gap-2">
              {beneficiaries.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setPhoneNumber(b.phone);
                    setSelectedNetwork(b.network);
                    setShowBeneficiaryPicker(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-800 flex items-center gap-2 transition"
                >
                  <NetworkBadge network={b.network} size="sm" showName={false} />
                  <span className="font-medium">{b.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({b.phone})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="relative">
          <input
            type="tel"
            inputMode="numeric"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="e.g. 08034567890"
            maxLength={14}
            className="w-full h-13 px-4 rounded-2xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-mono text-base outline-none transition shadow-xs placeholder-slate-400"
          />
          {phoneNumber && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <NetworkBadge network={selectedNetwork} size="sm" />
            </div>
          )}
        </div>

        {/* Save as Beneficiary option */}
        <div className="flex items-center gap-3 pt-1">
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={saveBeneficiary}
              onChange={(e) => setSaveBeneficiary(e.target.checked)}
              className="rounded bg-white border-slate-300 text-emerald-600 focus:ring-0 w-4 h-4"
            />
            <span>Save to Beneficiaries for 1-tap reorders</span>
          </label>

          {saveBeneficiary && (
            <input
              type="text"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              placeholder="Contact label (e.g. My SIM, Mum, Bro)"
              className="h-8 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 outline-none focus:border-emerald-500 shadow-xs"
            />
          )}
        </div>
      </div>

      {/* 3. Plan Category Tabs */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          3. Select Bundle Type
        </label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat} Bundles
            </button>
          ))}
        </div>
      </div>

      {/* 4. Available Data Plans Grid */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          4. Choose Data Plan
        </label>

        {availablePlans.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
            No {selectedCategory} data plans currently available for {NETWORKS[selectedNetwork].name}.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {availablePlans.map((plan) => {
              const isSelected = selectedPlan?.id === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`p-4 rounded-2xl border cursor-pointer transition relative flex flex-col justify-between h-32 ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {plan.isPopular && (
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded-full">
                      POPULAR
                    </span>
                  )}
                  {plan.isBestValue && (
                    <span className="absolute top-2.5 right-2.5 text-[9px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1.5 py-0.5 rounded-full">
                      BEST VALUE
                    </span>
                  )}

                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 font-display">
                      {plan.size}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{plan.validity}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-sm font-extrabold text-emerald-600 font-mono">
                      {formatNaira(plan.price)}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {isSelected ? 'SELECTED' : 'SELECT'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Promo Code Input */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-emerald-600" />
          <span>Apply Promo Code (Optional)</span>
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="e.g. VELTRIPAY50 or NAIJA2026"
            className="flex-1 h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 uppercase font-mono outline-none focus:border-emerald-500 focus:bg-white placeholder-slate-400"
          />
          <button
            type="button"
            onClick={handleApplyPromo}
            className="h-11 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-xs font-bold text-white transition"
          >
            Apply Code
          </button>
        </div>

        {promoMessage && (
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{promoMessage}</span>
          </p>
        )}
      </div>

      {/* Error Display */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 6. Order Summary & Checkout Button */}
      {selectedPlan && (
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-900 font-display">Order Summary</h3>

          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Plan</span>
              <span className="font-semibold text-slate-900">
                {selectedPlan.name} ({selectedPlan.validity})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Recipient</span>
              <span className="font-mono text-slate-900 font-semibold">
                {phoneNumber || 'Not specified'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bundle Price</span>
              <span>{formatNaira(selectedPlan.price)}</span>
            </div>
            {promoDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Promo Discount</span>
                <span>-{formatNaira(promoDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-bold text-slate-900">
              <span>Total Payable</span>
              <span className="text-emerald-600 font-mono">
                {formatNaira(Math.max(selectedPlan.price - promoDiscount, 0))}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleInitiateOrder}
            disabled={isProcessing}
            className="w-full h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
          >
            {isProcessing ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <span>Confirm & Pay {formatNaira(Math.max(selectedPlan.price - promoDiscount, 0))}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* 4-digit PIN Authorization Modal */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
        title="Confirm Data Purchase"
        subtitle={`Enter 4-digit PIN to send ${selectedPlan?.name} to ${phoneNumber}`}
      />
    </div>
  );
};
