import React, { useState } from 'react';
import {
  Wallet,
  CreditCard,
  Building,
  Send,
  PlusCircle,
  Copy,
  Check,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  PhoneCall,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNaira, formatDate } from '../../utils';
import { PinModal } from '../common/PinModal';

export const WalletView: React.FC = () => {
  const {
    user,
    transactions,
    fundWallet,
    transferToPeer,
    withdrawCommission,
    setSelectedReceiptTx,
  } = useApp();

  const [activeFundTab, setActiveFundTab] = useState<'virtual_account' | 'card' | 'transfer_peer' | 'ussd'>('virtual_account');

  // Card Funding State
  const [cardAmount, setCardAmount] = useState<number>(5000);
  const [isFundingCard, setIsFundingCard] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  // Peer Transfer State
  const [recipientIdentifier, setRecipientIdentifier] = useState('');
  const [transferAmount, setTransferAmount] = useState<number>(1000);
  const [transferNote, setTransferNote] = useState('');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  // Commission withdrawal state
  const [isWithdrawingCommission, setIsWithdrawingCommission] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const copyVirtualAcc = () => {
    navigator.clipboard.writeText(user.virtualAccount.accountNumber);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2000);
  };

  const handleFundWithCard = async () => {
    if (cardAmount < 100) {
      setErrorMessage('Minimum card deposit is ₦100.00');
      return;
    }
    setIsFundingCard(true);
    setErrorMessage('');
    const res = await fundWallet(cardAmount, 'card');
    setIsFundingCard(false);
    if (res.success && res.transaction) {
      setFeedbackMessage(`Successfully funded wallet with ${formatNaira(cardAmount)}!`);
      setSelectedReceiptTx(res.transaction);
    }
  };

  const handleInitiatePeerTransfer = () => {
    setErrorMessage('');
    if (!recipientIdentifier.trim()) {
      setErrorMessage('Please enter recipient phone number or @username');
      return;
    }
    if (transferAmount < 50) {
      setErrorMessage('Minimum transfer is ₦50.00');
      return;
    }
    if (user.walletBalance < transferAmount) {
      setErrorMessage('Insufficient wallet balance for this transfer');
      return;
    }
    setIsPinModalOpen(true);
  };

  const handlePinSuccess = async () => {
    setIsPinModalOpen(false);
    setIsTransferring(true);
    const res = await transferToPeer(recipientIdentifier, transferAmount, transferNote);
    setIsTransferring(false);
    if (res.success && res.transaction) {
      setFeedbackMessage(`Transfer of ${formatNaira(transferAmount)} sent successfully!`);
      setSelectedReceiptTx(res.transaction);
      setRecipientIdentifier('');
      setTransferNote('');
    } else {
      setErrorMessage(res.message || 'Transfer failed');
    }
  };

  const handleWithdrawCommission = async () => {
    if (user.commissionBalance <= 0) {
      setErrorMessage('You have no commission balance to withdraw.');
      return;
    }
    setIsWithdrawingCommission(true);
    const res = await withdrawCommission();
    setIsWithdrawingCommission(false);
    if (res.success) {
      setFeedbackMessage('Commission successfully transferred to your main wallet balance!');
    }
  };

  const walletHistory = transactions.filter(
    (t) => t.type === 'wallet_fund' || t.type === 'peer_transfer' || t.type === 'refund'
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-600" />
            Wallet & Funding Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Deposit funds, transfer to peers with 0% fee, and manage commissions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            NDIC Insured Partner Banks
          </span>
        </div>
      </div>

      {/* Main Balances Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Wallet Balance */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400">Main Wallet Balance</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              {formatNaira(user.walletBalance)}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-slate-400">
              Account Status:{' '}
              <span className="font-bold text-emerald-400 uppercase">Tier 2 Verified</span>
            </div>
            <div className="text-slate-400">
              Daily Limit: <span className="font-mono text-slate-200">₦500,000.00</span>
            </div>
          </div>
        </div>

        {/* Commission & Cashback Vault */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold mb-1">
              <span>Commission Balance</span>
              <span className="text-amber-600 font-bold">Referrals & Discounts</span>
            </div>
            <div className="text-2xl font-extrabold text-amber-600 font-display">
              {formatNaira(user.commissionBalance)}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Earned from referral sign-ups and bill cashback.
            </p>
          </div>

          <button
            type="button"
            onClick={handleWithdrawCommission}
            disabled={isWithdrawingCommission || user.commissionBalance <= 0}
            className="w-full h-10 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            {isWithdrawingCommission ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span>Withdraw to Main Wallet</span>
          </button>
        </div>
      </div>

      {/* Funding & Transfer Method Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {[
          { id: 'virtual_account', label: 'Bank Transfer (NUBAN)', icon: Building },
          { id: 'card', label: 'Debit Card (Instant)', icon: CreditCard },
          { id: 'transfer_peer', label: 'Peer Transfer (0% Fee)', icon: Send },
          { id: 'ussd', label: 'Bank USSD Code', icon: PhoneCall },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeFundTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveFundTab(tab.id as any);
                setErrorMessage('');
                setFeedbackMessage('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
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

      {/* Messages */}
      {feedbackMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{feedbackMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1. Automated Virtual Account Details Tab */}
      {activeFundTab === 'virtual_account' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <Building className="w-5 h-5" />
            <h3>Your Dedicated Automated Virtual Account</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Transfer money from any Nigerian banking app (GTBank, Zenith, Access, Kuda, OPay, Palmpay, FirstBank, etc.) to this dedicated account. Your VeltriPay wallet will be credited automatically within 5 seconds.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex justify-between items-center text-xs border-b border-slate-200 pb-2">
              <span className="text-slate-500">Bank Name</span>
              <span className="font-bold text-slate-900 text-sm">{user.virtualAccount.bankName}</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-slate-200 pb-2">
              <span className="text-slate-500">Account Number</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-slate-900 text-base tracking-wider">
                  {user.virtualAccount.accountNumber}
                </span>
                <button
                  onClick={copyVirtualAcc}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-xs text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1 transition"
                >
                  {copiedBank ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBank ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Account Name</span>
              <span className="font-semibold text-slate-800 uppercase">{user.virtualAccount.accountName}</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800">
            💡 Zero transaction fees on all inbound bank transfers above ₦1,000.
          </div>
        </div>
      )}

      {/* 2. Instant Debit Card Funding */}
      {activeFundTab === 'card' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
            <CreditCard className="w-5 h-5" />
            <h3>Fund Wallet via Debit Card / ATM</h3>
          </div>
          <p className="text-xs text-slate-500">
            Instant top-up using Mastercard, Visa, or Verve cards secured by Paystack & Monnify gateways.
          </p>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {[1000, 2000, 5000, 10000, 20000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setCardAmount(amt)}
                className={`p-3 rounded-2xl border text-xs font-bold font-mono transition ${
                  cardAmount === amt
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 shadow-xs'
                }`}
              >
                ₦{amt.toLocaleString()}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₦</span>
            <input
              type="number"
              value={cardAmount}
              onChange={(e) => setCardAmount(Number(e.target.value))}
              placeholder="Or enter deposit amount"
              className="w-full h-12 pl-8 pr-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-mono font-bold text-sm outline-none focus:border-emerald-500 shadow-xs placeholder-slate-400"
            />
          </div>

          <button
            type="button"
            onClick={handleFundWithCard}
            disabled={isFundingCard || cardAmount <= 0}
            className="w-full h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
          >
            {isFundingCard ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Simulating Gateway Connection...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Pay {formatNaira(cardAmount)} via Card Gateway</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 3. Peer-to-Peer Transfer (Send Money) */}
      {activeFundTab === 'transfer_peer' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
            <Send className="w-5 h-5" />
            <h3>Peer-to-Peer Instant Wallet Transfer</h3>
          </div>
          <p className="text-xs text-slate-500">
            Send money instantly to any VeltriPay user with <strong>0% fee</strong> using their phone number or username.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Recipient Phone or @Username
              </label>
              <input
                type="text"
                value={recipientIdentifier}
                onChange={(e) => setRecipientIdentifier(e.target.value)}
                placeholder="e.g. 08031234567 or @kemi_adams"
                className="w-full h-12 px-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-mono text-sm outline-none focus:border-teal-500 shadow-xs placeholder-slate-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Amount to Transfer (₦)
              </label>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(Number(e.target.value))}
                placeholder="Amount in Naira"
                className="w-full h-12 px-4 rounded-2xl bg-white border border-slate-200 text-slate-900 font-mono text-sm outline-none focus:border-teal-500 shadow-xs placeholder-slate-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Note / Description (Optional)
              </label>
              <input
                type="text"
                value={transferNote}
                onChange={(e) => setTransferNote(e.target.value)}
                placeholder="e.g. Data money, Lunch contribution"
                className="w-full h-11 px-4 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs outline-none focus:border-teal-500 shadow-xs placeholder-slate-400"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleInitiatePeerTransfer}
            disabled={isTransferring}
            className="w-full h-13 rounded-2xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-md shadow-teal-600/20"
          >
            {isTransferring ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Processing Transfer...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send {formatNaira(transferAmount)} Instantly</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* 4. Bank USSD Code Tab */}
      {activeFundTab === 'ussd' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm text-xs">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
            <PhoneCall className="w-5 h-5" />
            <h3>Deposit via Bank USSD String</h3>
          </div>
          <p className="text-slate-500">
            Dial these shortcodes on your phone with your registered bank SIM to transfer funds directly into your VeltriPay virtual account.
          </p>

          <div className="space-y-2">
            {[
              { bank: 'GTBank', code: `*737*50*5000*${user.virtualAccount.accountNumber}#` },
              { bank: 'Zenith Bank', code: `*966*5000*${user.virtualAccount.accountNumber}#` },
              { bank: 'Access Bank', code: `*901*5000*${user.virtualAccount.accountNumber}#` },
              { bank: 'UBA', code: `*919*4*${user.virtualAccount.accountNumber}*5000#` },
            ].map((u) => (
              <div
                key={u.bank}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900">{u.bank}</span>
                  <p className="font-mono text-emerald-600 text-xs mt-0.5">{u.code}</p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(u.code)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs hover:text-slate-900 shadow-xs"
                >
                  Copy String
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wallet Inflow & Outflow History */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 font-display">Wallet Funding & Ledger History</h3>
        <div className="space-y-2">
          {walletHistory.length === 0 ? (
            <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-400">
              No wallet deposit history yet
            </div>
          ) : (
            walletHistory.map((tx) => (
              <div
                key={tx.id}
                onClick={() => setSelectedReceiptTx(tx)}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 flex items-center justify-between transition cursor-pointer shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                    {tx.type === 'wallet_fund' ? (
                      <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 capitalize">
                      {tx.type.replace('_', ' ')}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-mono">{formatDate(tx.timestamp)}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-mono font-bold ${
                      tx.type === 'wallet_fund' ? 'text-emerald-600' : 'text-slate-800'
                    }`}
                  >
                    {tx.type === 'wallet_fund' ? '+' : '-'}
                    {formatNaira(tx.finalAmount)}
                  </span>
                  <p className="text-[10px] text-emerald-600 font-semibold capitalize">
                    {tx.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
        title="Authorize Peer Transfer"
        subtitle={`Enter 4-digit PIN to transfer ${formatNaira(transferAmount)} to ${recipientIdentifier}`}
      />
    </div>
  );
};
