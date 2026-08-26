import React, { useState } from 'react';
import { VeaivexLogo } from './VeaivexLogo';
import { BusinessProfile, Currency, Language } from '../types';
import {
  X,
  Building2,
  DollarSign,
  TrendingUp,
  Database,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Store,
  Utensils,
  Wrench,
  Factory,
  Pill,
  Cpu,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: BusinessProfile, datasetPreset: string) => void;
  initialProfile: BusinessProfile;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialProfile,
}) => {
  const [step, setStep] = useState<number>(1);
  const [businessName, setBusinessName] = useState(initialProfile.name || 'Aliyu & Sons Supermarket');
  const [ownerName, setOwnerName] = useState(initialProfile.ownerName || 'Aliyu Abubakar');
  const [industry, setIndustry] = useState<string>('Retail & Supermarket');
  const [currency, setCurrency] = useState<Currency>(initialProfile.currency || 'NGN');
  const [currencySymbol, setCurrencySymbol] = useState<string>(initialProfile.currencySymbol || '₦');
  const [monthlyTarget, setMonthlyTarget] = useState<number>(initialProfile.monthlyRevenueTarget || 3500000);
  const [targetMargin, setTargetMargin] = useState<number>(initialProfile.targetMarginPct || 25);
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(initialProfile.language || 'en');
  const [selectedDataset, setSelectedDataset] = useState<'fmcg' | 'electronics' | 'pharmacy' | 'blank'>('fmcg');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      const updatedProfile: BusinessProfile = {
        ...initialProfile,
        name: businessName,
        ownerName: ownerName,
        industry: industry as any,
        currency,
        currencySymbol,
        monthlyRevenueTarget: monthlyTarget,
        targetMarginPct: targetMargin,
        language: preferredLanguage,
      };
      onComplete(updatedProfile, selectedDataset);
      onClose();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleCurrencyChange = (curr: Currency) => {
    setCurrency(curr);
    const symbols: Record<Currency, string> = {
      NGN: '₦',
      USD: '$',
      GBP: '£',
      EUR: '€',
      GHS: '₵',
      KES: 'KSh',
    };
    setCurrencySymbol(symbols[curr] || '₦');
  };

  const industryOptions = [
    { label: 'Retail & Supermarket', icon: Store, desc: 'FMCG, provisions, household items, beverages' },
    { label: 'Wholesale & Distribution', icon: Building2, desc: 'Bulk supply, rep sales, carton volume' },
    { label: 'Electronics & Gadgets', icon: Cpu, desc: 'Solar inverters, computers, phones, parts' },
    { label: 'Pharmacy & Healthcare', icon: Pill, desc: 'Prescription drugs, clinic supplies, OTC' },
    { label: 'Restaurant & Food Services', icon: Utensils, desc: 'Kitchen prep, perishables, walk-in dining' },
    { label: 'Manufacturing & Production', icon: Factory, desc: 'Raw materials, assembly, batch runs' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Progress Bar */}
        <div className="bg-slate-900 text-white p-6 pb-4 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <VeaivexLogo size="sm" />
              <span className="font-bold text-sm tracking-wider">VEAIVEX ONBOARDING</span>
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-400/20">
              Step {step} of 6
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Welcome */}
          {step === 1 && (
            <div className="text-center space-y-4 py-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Welcome to VEAIVEX AI
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Let&apos;s set up your executive business intelligence workspace. In just a few moments, your transactions will transform into root-cause diagnoses, stockout forecasts, and prioritized daily decisions.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 text-left space-y-2 max-w-md mx-auto">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Deterministic financial reconciliation engine</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Instant &apos;Why?&apos; root-cause diagnostic drilldowns</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Conversational Decision Copilot in Natural English</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Business Name & Owner */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Identity Setup
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  What is your business named?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This helps customize all reports, AI briefings, and purchase orders.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Business Trading Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Al-Barakah Provisions & Supermarket"
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Owner / Decision Maker Name
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Aliyu Abubakar"
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-semibold"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Industry / Business Type */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Operational Sector
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Select your business type
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  VEAIVEX tunes inventory turnover velocity and margin benchmarks based on your sector.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {industryOptions.map((item) => {
                  const Icon = item.icon;
                  const isSelected = industry === item.label;
                  return (
                    <div
                      key={item.label}
                      onClick={() => setIndustry(item.label)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-500'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{item.label}</div>
                        <div className="text-[11px] text-slate-500 leading-tight mt-0.5">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Currency */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Financial Currency
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Choose your accounting currency
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  All ledger totals, unit costs, and profit calculations will format in this symbol.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
                  { code: 'USD', name: 'US Dollar', symbol: '$' },
                  { code: 'GBP', name: 'British Pound', symbol: '£' },
                  { code: 'EUR', name: 'Euro', symbol: '€' },
                  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
                  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
                ].map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleCurrencyChange(c.code as Currency)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      currency === c.code
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="text-2xl font-black text-slate-900 block mb-1">
                      {c.symbol}
                    </span>
                    <span className="font-bold text-xs text-slate-900 block">{c.code}</span>
                    <span className="text-[10px] text-slate-500">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Financial Targets */}
          {step === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Benchmarking &amp; Health
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Set your monthly targets
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Used by the Business Health Score engine to grade performance.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Monthly Revenue Target ({currencySymbol})
                </label>
                <input
                  type="number"
                  value={monthlyTarget}
                  onChange={(e) => setMonthlyTarget(Number(e.target.value))}
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Target Net Profit Margin (%)
                </label>
                <input
                  type="number"
                  value={targetMargin}
                  onChange={(e) => setTargetMargin(Number(e.target.value))}
                  className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Default AI Language
                </label>
                <div className="py-2.5 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>English (Global / Executive BI)</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] uppercase font-extrabold">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Data Setup */}
          {step === 6 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Data Activation
                </span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Select your initial data setup
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Load a verified SME benchmark or prepare for CSV file upload.
                </p>
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => setSelectedDataset('fmcg')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedDataset === 'fmcg'
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      Use Kano &amp; Lagos Wholesale FMCG Benchmark (Recommended)
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      50 Transactions
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Preloaded with staple food products, real expense ledger entries, fuel spikes, and at-risk wholesale customers.
                  </p>
                </div>

                <div
                  onClick={() => setSelectedDataset('electronics')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedDataset === 'electronics'
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      Use Ikeja Tech &amp; Solar Power Benchmark
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      High AOV
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Power inverters, lithium storage batteries, laptops with urgent supplier lead times.
                  </p>
                </div>

                <div
                  onClick={() => setSelectedDataset('blank')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedDataset === 'blank'
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">
                      I will upload my own CSV files
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Custom CSV
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Takes you to the column mapping &amp; data validation ingestion view.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 px-6 sm:px-8 flex items-center justify-between shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all"
          >
            <span>{step === 6 ? 'Complete & Launch Workspace' : 'Continue'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
