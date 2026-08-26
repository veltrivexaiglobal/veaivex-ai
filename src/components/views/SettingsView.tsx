import React, { useState } from 'react';
import { BusinessProfile, Language, Currency } from '../../types';
import {
  Settings,
  Building2,
  DollarSign,
  Globe,
  Target,
  Sparkles,
  CheckCircle2,
  Save,
  Info,
} from 'lucide-react';

interface SettingsViewProps {
  profile: BusinessProfile;
  onUpdateProfile: (updates: Partial<BusinessProfile>) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  profile,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = useState<BusinessProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Business Profile &amp; Engine Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure currency standards, default intelligence language, and monthly targets
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Business Identity */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Business Entity Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Enterprise Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Industry Sector
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Currency & Language Localization */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-600" />
            <span>Currency &amp; Multilingual Settings</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reporting Currency
              </label>
              <select
                value={formData.currency}
                onChange={(e) => {
                  const curr = e.target.value as Currency;
                  const sym = curr === 'NGN' ? '₦' : curr === 'USD' ? '$' : curr === 'GBP' ? '£' : '€';
                  setFormData({ ...formData, currency: curr, currencySymbol: sym });
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="NGN">Nigerian Naira (₦)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="GBP">British Pound (£)</option>
                <option value="EUR">Euro (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Intelligence Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value as Language })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="en">English (Executive / International)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Financial Targets */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600" />
            <span>Target Benchmarks &amp; Health Baselines</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Monthly Revenue Target ({formData.currencySymbol})
              </label>
              <input
                type="number"
                value={formData.monthlyRevenueTarget}
                onChange={(e) => setFormData({ ...formData, monthlyRevenueTarget: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Net Profit Margin (%)
              </label>
              <input
                type="number"
                value={formData.targetMarginPct}
                onChange={(e) => setFormData({ ...formData, targetMarginPct: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>

      {/* Product & Attribution Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 text-xs">
        <div className="flex items-center gap-2 text-slate-800 font-bold uppercase tracking-wider text-[11px] pb-2 border-b border-slate-100">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Product Information &amp; Legal Attribution</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600">
          <div>
            <span className="text-slate-400 block text-[11px]">Product</span>
            <span className="font-bold text-slate-900 text-sm">VEAIVEX AI</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Parent / Company Brand</span>
            <span className="font-bold text-slate-900 text-sm">Veltrivex AI Global</span>
          </div>
        </div>
        <p className="text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
          VEAIVEX AI is a business intelligence and AI decision-support product developed by <strong>Veltrivex AI Global</strong>. The product is designed to help SMEs understand their business data, identify risks and opportunities, and make better-informed decisions.
        </p>
        <div className="text-[11px] text-slate-400 pt-1">
          &copy; 2026 Veltrivex AI Global. All rights reserved.
        </div>
      </div>
    </div>
  );
};
