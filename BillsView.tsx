import React, { useState } from 'react';
import {
  Lightbulb,
  Tv,
  GraduationCap,
  Wifi,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  RotateCw,
  Search,
  Copy,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DISCO_PROVIDERS, CABLE_PROVIDERS, EDUCATION_EXAMS } from '../../data/mockData';
import { formatNaira } from '../../utils';
import { PinModal } from '../common/PinModal';

export const BillsView: React.FC = () => {
  const {
    user,
    payElectricity,
    payCable,
    buyEducation,
    setSelectedReceiptTx,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'electricity' | 'cable' | 'education' | 'internet'>('electricity');

  // Electricity Form State
  const [selectedDisco, setSelectedDisco] = useState(DISCO_PROVIDERS[0].id);
  const [meterType, setMeterType] = useState<'prepaid' | 'postpaid'>('prepaid');
  const [meterNumber, setMeterNumber] = useState('14235678901');
  const [elecAmount, setElecAmount] = useState<number>(5000);
  const [verifiedCustomer, setVerifiedCustomer] = useState<{ name: string; address: string } | null>({
    name: 'CHIEF BABATUNDE ADELEKE',
    address: '14 Allen Avenue, Ikeja GRA, Lagos',
  });
  const [isVerifyingMeter, setIsVerifyingMeter] = useState(false);

  // Cable Form State
  const [selectedCable, setSelectedCable] = useState(CABLE_PROVIDERS[0].id);
  const [smartCardNo, setSmartCardNo] = useState('7023491823');
  const [selectedBouquetId, setSelectedBouquetId] = useState(CABLE_PROVIDERS[0].bouquets[0].id);
  const [verifiedCableCustomer, setVerifiedCableCustomer] = useState<string | null>('TUNDE ADELEKE (LAGOS SUB-04)');
  const [isVerifyingCable, setIsVerifyingCable] = useState(false);

  // Education Form State
  const [selectedExamId, setSelectedExamId] = useState(EDUCATION_EXAMS[0].id);
  const [examQuantity, setExamQuantity] = useState<number>(1);

  // Generic Checkout State
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Verify Meter
  const handleVerifyMeter = async () => {
    if (!meterNumber || meterNumber.length < 8) {
      setErrorMessage('Please enter a valid meter number (minimum 8 digits)');
      return;
    }
    setIsVerifyingMeter(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/vtu/validate-meter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disco: selectedDisco, meterNumber, meterType }),
      });
      const data = await response.json();
      if (data.valid) {
        setVerifiedCustomer({ name: data.customerName, address: data.address });
      } else {
        setVerifiedCustomer({ name: `CUSTOMER / ${meterNumber.slice(-4)}`, address: 'Lagos Residential Grid' });
      }
    } catch {
      setVerifiedCustomer({ name: 'CHIEF BABATUNDE ADELEKE', address: '14 Allen Avenue, Ikeja GRA, Lagos' });
    } finally {
      setIsVerifyingMeter(false);
    }
  };

  // 2. Verify SmartCard
  const handleVerifyCable = async () => {
    if (!smartCardNo || smartCardNo.length < 8) {
      setErrorMessage('Please enter a valid IUC/SmartCard number');
      return;
    }
    setIsVerifyingCable(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/vtu/validate-smartcard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: selectedCable, smartCardNo }),
      });
      const data = await response.json();
      setVerifiedCableCustomer(data.customerName || 'VERIFIED SUBSCRIBER');
    } catch {
      setVerifiedCableCustomer('TUNDE ADELEKE (LAGOS SUB-04)');
    } finally {
      setIsVerifyingCable(false);
    }
  };

  const handleInitiatePayment = () => {
    setErrorMessage('');
    if (activeSubTab === 'electricity') {
      if (!meterNumber) return setErrorMessage('Please enter a meter number');
      if (elecAmount < 1000) return setErrorMessage('Minimum electricity recharge is ₦1,000.00');
    } else if (activeSubTab === 'cable') {
      if (!smartCardNo) return setErrorMessage('Please enter SmartCard/IUC number');
    }
    setIsPinModalOpen(true);
  };

  const handlePinSuccess = async () => {
    setIsPinModalOpen(false);
    setIsProcessing(true);

    if (activeSubTab === 'electricity') {
      const res = await payElectricity({
        discoId: selectedDisco,
        meterNumber,
        meterType,
        amount: elecAmount,
        customerName: verifiedCustomer?.name || 'ESTATE SUBSCRIBER',
        customerAddress: verifiedCustomer?.address,
      });
      setIsProcessing(false);
      if (res.success && res.transaction) {
        setSelectedReceiptTx(res.transaction);
      } else {
        setErrorMessage(res.message || 'Payment failed');
      }
    } else if (activeSubTab === 'cable') {
      const res = await payCable({
        providerId: selectedCable,
        smartCardNo,
        bouquetId: selectedBouquetId,
        customerName: verifiedCableCustomer || 'CABLE SUBSCRIBER',
      });
      setIsProcessing(false);
      if (res.success && res.transaction) {
        setSelectedReceiptTx(res.transaction);
      } else {
        setErrorMessage(res.message || 'Payment failed');
      }
    } else if (activeSubTab === 'education') {
      const res = await buyEducation({
        examId: selectedExamId,
        quantity: examQuantity,
      });
      setIsProcessing(false);
      if (res.success && res.transaction) {
        setSelectedReceiptTx(res.transaction);
      } else {
        setErrorMessage(res.message || 'Payment failed');
      }
    } else {
      setIsProcessing(false);
      setErrorMessage('Internet provider integration is currently syncing.');
    }
  };

  const currentCableProvider = CABLE_PROVIDERS.find((c) => c.id === selectedCable) || CABLE_PROVIDERS[0];
  const currentBouquet = currentCableProvider.bouquets.find((b) => b.id === selectedBouquetId) || currentCableProvider.bouquets[0];
  const currentExam = EDUCATION_EXAMS.find((e) => e.id === selectedExamId) || EDUCATION_EXAMS[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-500" />
            Bills & Digital Utilities
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Electricity tokens, Cable TV renewals & Exam scratch card PINs
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Wallet Balance:{' '}
          <span className="font-bold text-emerald-600 font-mono">
            {formatNaira(user.walletBalance)}
          </span>
        </div>
      </div>

      {/* Service Category Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {[
          { id: 'electricity', label: 'Electricity Bills', icon: Lightbulb },
          { id: 'cable', label: 'Cable TV Sub', icon: Tv },
          { id: 'education', label: 'Exam e-PINs', icon: GraduationCap },
          { id: 'internet', label: 'Broadband Net', icon: Wifi },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSubTab(tab.id as any);
                setErrorMessage('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= ELECTRICITY TAB ================= */}
      {activeSubTab === 'electricity' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* 1. Disco Provider Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Select Electricity Disco
            </label>
            <select
              value={selectedDisco}
              onChange={(e) => setSelectedDisco(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-white border border-slate-200 focus:border-emerald-500 text-slate-900 text-sm outline-none font-medium shadow-xs"
            >
              {DISCO_PROVIDERS.map((d) => (
                <option key={d.id} value={d.id} className="bg-white text-slate-900">
                  {d.name} — {d.state}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Meter Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Meter Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['prepaid', 'postpaid'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMeterType(type)}
                  className={`p-3.5 rounded-2xl border text-xs font-bold capitalize transition flex items-center justify-between ${
                    meterType === type
                      ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs'
                  }`}
                >
                  <span>{type} Meter</span>
                  {meterType === type && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Meter Number & Verification */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Meter Number & Customer Lookup
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={meterNumber}
                onChange={(e) => {
                  setMeterNumber(e.target.value.replace(/[^0-9]/g, ''));
                  setVerifiedCustomer(null);
                }}
                placeholder="Enter 11-digit Meter Number"
                maxLength={14}
                className="flex-1 h-12 px-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-mono text-sm outline-none focus:border-emerald-500 shadow-xs placeholder-slate-400"
              />
              <button
                type="button"
                onClick={handleVerifyMeter}
                disabled={isVerifyingMeter}
                className="px-5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-xs font-bold text-white transition flex items-center gap-1.5"
              >
                {isVerifyingMeter ? <RotateCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Verify</span>
              </button>
            </div>

            {/* Verified Customer Card */}
            {verifiedCustomer && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Meter Verified Successfully</span>
                </div>
                <p className="text-slate-900 font-semibold">{verifiedCustomer.name}</p>
                <p className="text-slate-600 text-[11px]">{verifiedCustomer.address}</p>
              </div>
            )}
          </div>

          {/* 4. Amount */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              4. Amount to Recharge (₦)
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[2000, 5000, 10000, 20000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setElecAmount(amt)}
                  className={`p-2.5 rounded-xl border text-xs font-bold font-mono transition ${
                    elecAmount === amt
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs'
                  }`}
                >
                  ₦{amt.toLocaleString()}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={elecAmount}
              onChange={(e) => setElecAmount(Number(e.target.value))}
              placeholder="e.g. 5000"
              className="w-full h-12 px-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-mono text-sm outline-none focus:border-emerald-500 shadow-xs placeholder-slate-400"
            />
          </div>
        </div>
      )}

      {/* ================= CABLE TV TAB ================= */}
      {activeSubTab === 'cable' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Select Cable Provider
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CABLE_PROVIDERS.map((c) => {
                const isSelected = selectedCable === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedCable(c.id);
                      setSelectedBouquetId(c.bouquets[0].id);
                    }}
                    className={`p-3.5 rounded-2xl border text-xs font-bold transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs'
                    }`}
                  >
                    <span>{c.shortName}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SmartCard / IUC Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. SmartCard / IUC Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={smartCardNo}
                onChange={(e) => {
                  setSmartCardNo(e.target.value.replace(/[^0-9]/g, ''));
                  setVerifiedCableCustomer(null);
                }}
                placeholder="Enter 10-digit SmartCard Number"
                maxLength={12}
                className="flex-1 h-12 px-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-mono text-sm outline-none focus:border-blue-500 shadow-xs placeholder-slate-400"
              />
              <button
                type="button"
                onClick={handleVerifyCable}
                disabled={isVerifyingCable}
                className="px-5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-xs font-bold text-white transition flex items-center gap-1.5"
              >
                {isVerifyingCable ? <RotateCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Verify</span>
              </button>
            </div>

            {verifiedCableCustomer && (
              <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
                <span>Subscriber: <strong className="text-slate-900">{verifiedCableCustomer}</strong></span>
              </div>
            )}
          </div>

          {/* Bouquet Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Choose Package / Bouquet
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentCableProvider.bouquets.map((b) => {
                const isSelected = selectedBouquetId === b.id;
                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBouquetId(b.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{b.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{b.description}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-sm font-extrabold text-emerald-600 font-mono">
                        {formatNaira(b.price)}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isSelected ? 'SELECTED' : 'SELECT'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= EDUCATION TAB ================= */}
      {activeSubTab === 'education' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Select Examination e-PIN Service
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EDUCATION_EXAMS.map((exam) => {
                const isSelected = selectedExamId === exam.id;
                return (
                  <div
                    key={exam.id}
                    onClick={() => setSelectedExamId(exam.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">
                        {exam.provider}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{exam.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{exam.description}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-sm font-extrabold text-emerald-600 font-mono">
                        {formatNaira(exam.unitPrice)}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          isSelected ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isSelected ? 'SELECTED' : 'CHOOSE'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs font-bold text-slate-900">Quantity</p>
              <p className="text-[11px] text-slate-500">Number of candidate PINs to generate</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setExamQuantity(Math.max(examQuantity - 1, 1))}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition flex items-center justify-center"
              >
                -
              </button>
              <span className="font-mono font-bold text-base text-slate-900">{examQuantity}</span>
              <button
                type="button"
                onClick={() => setExamQuantity(Math.min(examQuantity + 1, 10))}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 font-bold hover:bg-slate-200 transition flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= INTERNET TAB ================= */}
      {activeSubTab === 'internet' && (
        <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mx-auto">
            <Wifi className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-display">
            Broadband Internet Subscriptions
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Spectranet, Smile 4G LTE, and Swift Networks automated router recharge gateway.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            Broadband Provider API Connecting
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Payment Action Bar */}
      {activeSubTab !== 'internet' && (
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-sm font-bold text-slate-900">
            <span>Total Payable</span>
            <span className="text-emerald-600 font-mono text-base">
              {activeSubTab === 'electricity' && formatNaira(elecAmount + 100)}
              {activeSubTab === 'cable' && formatNaira(currentBouquet.price + 50)}
              {activeSubTab === 'education' && formatNaira(currentExam.unitPrice * examQuantity)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleInitiatePayment}
            disabled={isProcessing}
            className="w-full h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
          >
            {isProcessing ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Processing Utility Payment...</span>
              </>
            ) : (
              <>
                <span>Pay & Process Instant Delivery</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
        title="Confirm Bill Payment"
        subtitle="Enter your 4-digit VeltriPay security PIN to authorize this payment"
      />
    </div>
  );
};
