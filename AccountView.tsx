import React, { useState } from 'react';
import {
  User,
  Shield,
  KeyRound,
  Fingerprint,
  Users,
  Bell,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NetworkId, Beneficiary } from '../../types';
import { NETWORKS } from '../../data/mockData';
import { formatNaira, sanitizePhone, isValidNigerianPhone } from '../../utils';
import { NetworkBadge } from '../common/NetworkBadge';

export const AccountView: React.FC = () => {
  const {
    user,
    beneficiaries,
    addBeneficiary,
    deleteBeneficiary,
    updateUserSecurity,
    setMonthlySpendingLimit,
  } = useApp();

  // PIN / Security form
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [biometrics, setBiometrics] = useState(user.biometricsEnabled);
  const [spendingLimitInput, setSpendingLimitInput] = useState(user.monthlySpendingLimit.toString());

  // Beneficiary modal/form
  const [showAddBeneficiary, setShowAddBeneficiary] = useState(false);
  const [bName, setBName] = useState('');
  const [bPhone, setBPhone] = useState('');
  const [bNetwork, setBNetwork] = useState<NetworkId>('mtn');

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (newPin.length !== 4 || isNaN(Number(newPin))) {
      setErrorMessage('PIN must be exactly 4 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setErrorMessage('PIN confirmation does not match.');
      return;
    }

    updateUserSecurity(newPin, biometrics);
    setNewPin('');
    setConfirmPin('');
    setSuccessMessage('Security PIN updated successfully!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleToggleBiometrics = (val: boolean) => {
    setBiometrics(val);
    updateUserSecurity(user.transactionPin, val);
    setSuccessMessage(`Biometric authentication ${val ? 'enabled' : 'disabled'}.`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleUpdateLimit = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = Number(spendingLimitInput);
    if (limit < 1000) {
      setErrorMessage('Minimum monthly limit is ₦1,000.00.');
      return;
    }
    setMonthlySpendingLimit(limit);
    setSuccessMessage('Monthly spending limit updated.');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleAddBeneficiary = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = sanitizePhone(bPhone);
    if (!clean || !isValidNigerianPhone(clean)) {
      setErrorMessage('Please enter a valid 11-digit Nigerian phone number.');
      return;
    }
    if (!bName.trim()) {
      setErrorMessage('Please enter a contact name.');
      return;
    }

    addBeneficiary({
      name: bName.trim(),
      phone: clean,
      network: bNetwork,
      serviceType: 'data',
    });

    setShowAddBeneficiary(false);
    setBName('');
    setBPhone('');
    setSuccessMessage('New beneficiary added.');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
            <User className="w-6 h-6 text-emerald-600" />
            Account & Security Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal profile, 4-digit PIN, biometric security, and saved beneficiaries
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-extrabold text-xl">
            {user.fullName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{user.fullName}</h3>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                Tier 2 Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{user.phone} • {user.email}</p>
          </div>
        </div>

        <div className="text-xs text-slate-500 sm:text-right">
          <div>
            NIN / BVN Status:{' '}
            <span className="text-emerald-600 font-bold">LINKED & ENCRYPTED</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Member since August 2026</p>
        </div>
      </div>

      {/* Security & PIN Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Set / Change PIN */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm font-display">
            <KeyRound className="w-4 h-4 text-emerald-600" />
            <h3>Transaction Security PIN</h3>
          </div>
          <p className="text-xs text-slate-500">
            Set or update your 4-digit authorization PIN used to confirm payments and transfers.
          </p>

          <form onSubmit={handleUpdatePin} className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                New 4-Digit PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••"
                className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-sm text-center font-mono font-bold text-slate-900 outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Confirm New PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••"
                className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-sm text-center font-mono font-bold text-slate-900 outline-none focus:border-emerald-500 shadow-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-xs"
            >
              Update Security PIN
            </button>
          </form>
        </div>

        {/* Biometrics & Spending Limit */}
        <div className="space-y-4">
          {/* Biometrics Toggle */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm font-display">
                <Fingerprint className="w-4 h-4 text-emerald-600" />
                <h3>Biometric Quick Auth</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={biometrics}
                  onChange={(e) => handleToggleBiometrics(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            <p className="text-xs text-slate-500">
              Use your device Face ID or Fingerprint scanner to authorize payments instead of typing your PIN.
            </p>
          </div>

          {/* Monthly Spending Budget */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm font-display">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <h3>Monthly Telecom Budget Limit</h3>
            </div>
            <p className="text-xs text-slate-500">
              Set a monthly limit to prevent accidental overspending on data and airtime.
            </p>

            <form onSubmit={handleUpdateLimit} className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₦</span>
                <input
                  type="number"
                  value={spendingLimitInput}
                  onChange={(e) => setSpendingLimitInput(e.target.value)}
                  className="w-full h-10 pl-8 pr-3 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 outline-none focus:border-teal-500 shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="px-4 h-10 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition"
              >
                Save Limit
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Beneficiaries Manager */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Saved Beneficiaries ({beneficiaries.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Quickly recharge frequent numbers in 1-tap without memorizing numbers
            </p>
          </div>

          <button
            onClick={() => setShowAddBeneficiary(true)}
            className="h-9 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Contact</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {beneficiaries.map((b) => (
            <div
              key={b.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <NetworkBadge network={b.network} size="sm" showName={false} />
                  <span className="text-xs font-bold text-slate-900 truncate">{b.name}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{b.phone}</p>
              </div>

              <button
                onClick={() => deleteBeneficiary(b.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 transition"
                title="Delete beneficiary"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Beneficiary Modal */}
      {showAddBeneficiary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-display">Add Saved Beneficiary</h3>

            <form onSubmit={handleAddBeneficiary} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Contact Name / Label
                </label>
                <input
                  type="text"
                  value={bName}
                  onChange={(e) => setBName(e.target.value)}
                  placeholder="e.g. My MTN Router, Daddy, Sister"
                  required
                  className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-emerald-500 shadow-xs placeholder-slate-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  11-Digit Phone Number
                </label>
                <input
                  type="tel"
                  value={bPhone}
                  onChange={(e) => setBPhone(e.target.value)}
                  placeholder="08031234567"
                  maxLength={14}
                  required
                  className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 outline-none focus:border-emerald-500 shadow-xs placeholder-slate-400"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Mobile Network
                </label>
                <select
                  value={bNetwork}
                  onChange={(e) => setBNetwork(e.target.value as NetworkId)}
                  className="w-full h-11 px-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 outline-none focus:border-emerald-500 shadow-xs"
                >
                  {(['mtn', 'airtel', 'glo', '9mobile'] as NetworkId[]).map((n) => (
                    <option key={n} value={n}>
                      {NETWORKS[n].name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  Save Contact
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBeneficiary(false)}
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
