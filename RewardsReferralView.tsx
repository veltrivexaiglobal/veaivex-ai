import React, { useState } from 'react';
import {
  Gift,
  Share2,
  Copy,
  Check,
  Award,
  Wallet,
  Users,
  Tag,
  ArrowRight,
  RotateCw,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PROMO_CODES } from '../../data/mockData';
import { formatNaira } from '../../utils';

export const RewardsReferralView: React.FC = () => {
  const { user, redeemLoyaltyPoints } = useApp();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPromo, setCopiedPromo] = useState<string | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState('');

  const referralCode = 'FLEX-TUNDE7';
  const referralLink = `https://veltrivexaiglobal.com/register?ref=${referralCode}`;

  const copyRefCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyRefLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedPromo(code);
    setTimeout(() => setCopiedPromo(null), 2000);
  };

  const handleRedeemPoints = async () => {
    if (user.loyaltyPoints < 100) return;
    setIsRedeeming(true);
    const res = await redeemLoyaltyPoints(user.loyaltyPoints);
    setIsRedeeming(false);
    if (res.success) {
      setRedeemSuccess(res.message);
      setTimeout(() => setRedeemSuccess(''), 4000);
    }
  };

  // Mock list of referees
  const referees = [
    { name: 'Emeka Nwosu', date: '2026-08-18', bonus: 150, status: 'Active' },
    { name: 'Khadijah Bello', date: '2026-08-14', bonus: 150, status: 'Active' },
    { name: 'Ayomide Balogun', date: '2026-08-02', bonus: 150, status: 'Active' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
            <Gift className="w-6 h-6 text-indigo-600" />
            Rewards, Loyalty & Referrals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Earn instant cash commissions on referrals and redeem reward points for airtime/data
          </p>
        </div>
      </div>

      {redeemSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{redeemSuccess}</span>
        </div>
      )}

      {/* 1. Loyalty Points Hub */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              VeltriPay Loyalty Club — Tier: <strong className="text-amber-400">{user.loyaltyTier}</strong>
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-white font-mono">
              {user.loyaltyPoints} Points
            </span>
            <span className="text-xs text-emerald-400 font-semibold">
              ≈ {formatNaira(user.loyaltyPoints)} Naira Value
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-md">
            Earn 1 point per ₦100 spent across all data, airtime, and utility purchases.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRedeemPoints}
          disabled={isRedeeming || user.loyaltyPoints < 100}
          className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-950"
        >
          {isRedeeming ? (
            <RotateCw className="w-4 h-4 animate-spin" />
          ) : (
            <Wallet className="w-4 h-4 text-amber-300" />
          )}
          <span>Convert All Points to Wallet (₦)</span>
        </button>
      </div>

      {/* 2. Referral Program Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Referral Code & Share Link */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              Invite Friends & Earn ₦150
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Give friends ₦50 off their first purchase and earn ₦150 commission directly in your wallet.
            </p>
          </div>

          <div className="space-y-2.5">
            <div>
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Your Referral Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralCode}
                  className="flex-1 h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 outline-none shadow-xs"
                />
                <button
                  onClick={copyRefCode}
                  className="px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold text-emerald-700 border border-emerald-200 flex items-center gap-1.5 transition"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Shareable Web Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="flex-1 h-11 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 outline-none truncate shadow-xs"
                />
                <button
                  onClick={copyRefLink}
                  className="px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5 transition"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Referee History */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 font-display">Your Referred Friends ({referees.length})</h3>
            <span className="text-xs text-emerald-600 font-mono font-bold">Earned: ₦450.00</span>
          </div>

          <div className="space-y-2">
            {referees.map((r, i) => (
              <div
                key={i}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-800">{r.name}</p>
                  <p className="text-[10px] text-slate-500">Joined on {r.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-emerald-600 font-mono font-bold">+{formatNaira(r.bonus)}</span>
                  <p className="text-[10px] text-emerald-700 font-semibold">{r.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Active Promo Codes Carousel */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-600" />
          Active Public Coupons & Discounts
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PROMO_CODES.map((promo) => (
            <div
              key={promo.code}
              className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-extrabold text-sm text-emerald-600 tracking-wider">
                    {promo.code}
                  </span>
                  <span className="text-[10px] font-bold text-slate-700 uppercase bg-slate-100 px-2 py-0.5 rounded-full">
                    {promo.discountType === 'percentage' ? `${promo.discountValue}% OFF` : `₦${promo.discountValue} OFF`}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{promo.description}</p>
              </div>

              <button
                type="button"
                onClick={() => copyPromoCode(promo.code)}
                className="w-full h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-center gap-1.5 transition mt-2"
              >
                {copiedPromo === promo.code ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
