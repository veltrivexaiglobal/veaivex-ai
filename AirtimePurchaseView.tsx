import React, { useState } from 'react';
import {
  Smartphone,
  CheckCircle2,
  Users,
  Tag,
  AlertCircle,
  Sparkles,
  ChevronRight,
  RotateCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NetworkId } from '../../types';
import { NETWORKS } from '../../data/mockData';
import { formatNaira, detectNetworkFromPhone, sanitizePhone, isValidNigerianPhone } from '../../utils';
import { NetworkBadge } from '../common/NetworkBadge';
import { PinModal } from '../common/PinModal';

export const AirtimePurchaseView: React.FC = () => {
  const {
    user,
    beneficiaries,
    buyAirtime,
    validatePromoCode,
    setSelectedReceiptTx,
  } = useApp();

  const [selectedNetwork, setSelectedNetwork] = useState<NetworkId>('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState<number>(1000);
  const [customAmountStr, setCustomAmountStr] = useState('1000');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [saveBeneficiary, setSaveBeneficiary] = useState(false);
  const [beneficiaryName, setBeneficiaryName] = useState('');

  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showBeneficiaryPicker, setShowBeneficiaryPicker] = useState(false);

  const presetAmounts = [100, 200, 500, 1000, 2000, 5000, 10000];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setPhoneNumber(raw);
    const detected = detectNetworkFromPhone(raw);
    if (detected && detected !== selectedNetwork) {
      setSelectedNetwork(detected);
    }
  };

  const handleAmountSelect = (val: number) => {
    setAmount(val);
    setCustomAmountStr(val.toString());
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmountStr(val);
    const num = parseInt(val, 10) || 0;
    setAmount(num);
  };

  const standardDiscountRate = NETWORKS[selectedNetwork]?.discountRate || 0.02;
  const standardDiscount = Math.floor(amount * standardDiscountRate);
  const finalAmount = Math.max(amount - standardDiscount - promoDiscount, 10);

  const handleApplyPromo = () => {
    if (!promoCode.trim() || amount <= 0) return;
    const result = validatePromoCode(promoCode, 'airtime', amount);
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
      setErrorMessage('Please enter a valid 11-digit Nigerian phone number.');
      return;
    }
    if (amount < 50) {
      setErrorMessage('Minimum airtime recharge is ₦50.00.');
      return;
    }
    if (user.walletBalance < finalAmount) {
      setErrorMessage(
        `Insufficient wallet balance. You need ${formatNaira(finalAmount)}, but your balance is ${formatNaira(user.walletBalance)}.`
      );
      return;
    }

    setIsPinModalOpen(true);
  };

  const handlePinSuccess = async () => {
    setIsPinModalOpen(false);
    setIsProcessing(true);

    const res = await buyAirtime({
      network: selectedNetwork,
      phone: sanitizePhone(phoneNumber),
      amount,
      promoCode: promoDiscount > 0 ? promoCode : undefined,
      saveBeneficiary,
      beneficiaryName,
    });
    setIsProcessing(false);

    if (res.success && res.transaction) {
      setSelectedReceiptTx(res.transaction);
      setPhoneNumber('');
      setPromoCode('');
      setPromoDiscount(0);
      setPromoMessage('');
      setSaveBeneficiary(false);
    } else {
      setErrorMessage(res.message || 'Transaction failed. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-amber-500" />
            Buy Airtime Top-up
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Instant VTU airtime recharge with automatic 2%–3% cashback discount
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
          1. Select Telco Network
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
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: net.color }} />
                    <span className="text-xs font-bold">{net.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {(net.discountRate * 100).toFixed(1)}% Discount
                  </p>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Recipient Phone Number */}
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

        <div className="flex items-center gap-3 pt-1">
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={saveBeneficiary}
              onChange={(e) => setSaveBeneficiary(e.target.checked)}
              className="rounded bg-white border-slate-300 text-emerald-600 focus:ring-0 w-4 h-4"
            />
            <span>Save to Beneficiaries</span>
          </label>

          {saveBeneficiary && (
            <input
              type="text"
              value={beneficiaryName}
              onChange={(e) => setBeneficiaryName(e.target.value)}
              placeholder="Contact label (e.g. My Line, Brother)"
              className="h-8 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 outline-none focus:border-emerald-500 shadow-xs"
            />
          )}
        </div>
      </div>

      {/* 3. Preset Denominations & Custom Amount */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          3. Recharge Amount
        </label>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {presetAmounts.map((amt) => {
            const isSelected = amount === amt;
            const discountAmt = Math.floor(amt * standardDiscountRate);
            const toPay = amt - discountAmt;
            return (
              <button
                key={amt}
                type="button"
                onClick={() => handleAmountSelect(amt)}
                className={`p-3 rounded-2xl border transition text-center ${
                  isSelected
                    ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/30 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs'
                }`}
              >
                <div className="text-xs font-extrabold text-slate-900 font-mono">₦{amt.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                  Pay ₦{toPay.toLocaleString()}
                </div>
              </button>
            );
          })}
        </div>

        {/* Custom Amount Input */}
        <div className="mt-3 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
          <input
            type="text"
            inputMode="numeric"
            value={customAmountStr}
            onChange={handleCustomAmountChange}
            placeholder="Or enter custom amount (e.g. 750)"
            className="w-full h-12 pl-8 pr-4 rounded-2xl bg-white border border-slate-200 focus:border-emerald-500 text-slate-900 font-mono font-bold text-sm outline-none transition shadow-xs placeholder-slate-400"
          />
        </div>
      </div>

      {/* 4. Promo Code */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-amber-500" />
          <span>Promo Code (Optional)</span>
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="e.g. VELTRIPAY50"
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

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 5. Checkout Breakdown */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 font-display">Payment Summary</h3>

        <div className="space-y-1.5 text-xs text-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-500">Network & Recipient</span>
            <span className="font-semibold text-slate-900">
              {NETWORKS[selectedNetwork].name} ({phoneNumber || 'Not entered'})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Recharge Value</span>
            <span>{formatNaira(amount)}</span>
          </div>
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Instant Telco Discount ({(standardDiscountRate * 100).toFixed(1)}%)</span>
            <span>-{formatNaira(standardDiscount)}</span>
          </div>
          {promoDiscount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Promo Code Discount</span>
              <span>-{formatNaira(promoDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-bold text-slate-900">
            <span>Total Payable</span>
            <span className="text-emerald-600 font-mono">{formatNaira(finalAmount)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleInitiateOrder}
          disabled={isProcessing || amount <= 0}
          className="w-full h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
        >
          {isProcessing ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Sending Airtime...</span>
            </>
          ) : (
            <>
              <span>Pay {formatNaira(finalAmount)} & Recharge</span>
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
        title="Authorize Airtime Top-up"
        subtitle={`Enter 4-digit PIN to recharge ₦${amount.toLocaleString()} on ${phoneNumber}`}
      />
    </div>
  );
};
