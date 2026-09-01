import React, { useState } from 'react';
import { X, CheckCircle2, Copy, Check, Share2, Printer, Download, Sparkles, AlertCircle } from 'lucide-react';
import { Transaction } from '../../types';
import { formatNaira, formatDate } from '../../utils';
import { NetworkBadge } from './NetworkBadge';
import confetti from 'canvas-confetti';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onRepeat?: (tx: Transaction) => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose, onRepeat }) => {
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  if (!transaction) return null;

  const copyToClipboard = (text: string, isToken = false) => {
    navigator.clipboard.writeText(text);
    if (isToken) {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    } else {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `VeltriPay Receipt - ${transaction.reference}`,
          text: `VeltriPay Payment of ${formatNaira(transaction.finalAmount)} for ${transaction.type.toUpperCase()} was SUCCESSFUL. Ref: ${transaction.reference}`,
          url: window.location.href,
        });
      } catch {
        // Ignored if cancelled
      }
    } else {
      copyToClipboard(transaction.reference);
    }
  };

  const triggerSparkles = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100 hover:bg-slate-200 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Section */}
        <div id="printable-receipt" className="text-center pt-2">
          {/* Official VeltriPay Header */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm">
              PF
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 font-display">
              VeltriPay <span className="text-emerald-600 text-xs font-semibold uppercase tracking-wider">Nigeria</span>
            </span>
          </div>

          <p className="text-[11px] text-slate-500 font-medium">OFFICIAL TRANSACTION RECEIPT</p>

          {/* Status Badge */}
          <div className="my-4 inline-flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
              TRANSACTION SUCCESSFUL
            </span>
          </div>

          {/* Amount Display */}
          <div className="mb-6">
            <div className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              {formatNaira(transaction.finalAmount)}
            </div>
            <p className="text-xs text-slate-500 mt-1 capitalize">
              {transaction.type.replace('_', ' ')} Payment
            </p>
          </div>

          {/* Electricity Prepaid Token Card if applicable */}
          {transaction.metadata.token && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-left">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                  PREPAID METER TOKEN (20-DIGIT)
                </span>
                <button
                  onClick={() => copyToClipboard(transaction.metadata.token!, true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  {copiedToken ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono font-bold text-lg text-emerald-900 tracking-wider bg-white p-2.5 rounded-xl border border-emerald-200 text-center select-all shadow-xs">
                {transaction.metadata.token}
              </div>
              {transaction.metadata.units && (
                <div className="mt-2 text-right text-xs text-emerald-700 font-medium">
                  Units: <span className="font-bold">{transaction.metadata.units}</span>
                </div>
              )}
            </div>
          )}

          {/* Education e-PINs if applicable */}
          {transaction.metadata.generatedPins && transaction.metadata.generatedPins.length > 0 && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left">
              <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-2">
                ISSUED EXAM e-PIN & SERIAL
              </div>
              {transaction.metadata.generatedPins.map((pinStr, idx) => (
                <div
                  key={idx}
                  className="font-mono text-xs font-bold text-amber-900 bg-white p-2 rounded-lg border border-amber-200 mb-1.5 text-center select-all shadow-xs"
                >
                  {pinStr}
                </div>
              ))}
            </div>
          )}

          {/* Key-Value Breakdown Table */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2.5 text-left">
            <div className="flex justify-between items-center py-0.5 border-b border-slate-200 pb-2">
              <span className="text-slate-500">Transaction Reference</span>
              <div className="flex items-center gap-1.5 font-mono text-slate-800 font-medium">
                <span>{transaction.reference}</span>
                <button
                  onClick={() => copyToClipboard(transaction.reference)}
                  className="text-slate-400 hover:text-slate-700"
                  title="Copy Reference"
                >
                  {copiedRef ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500">Date & Time</span>
              <span className="text-slate-800 font-medium">{formatDate(transaction.timestamp)}</span>
            </div>

            {transaction.metadata.network && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Telco Network</span>
                <NetworkBadge network={transaction.metadata.network} size="sm" />
              </div>
            )}

            {transaction.metadata.recipientPhone && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Recipient Phone</span>
                <span className="text-slate-800 font-medium font-mono">{transaction.metadata.recipientPhone}</span>
              </div>
            )}

            {transaction.metadata.planName && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Data Plan</span>
                <span className="text-slate-800 font-semibold">{transaction.metadata.planName}</span>
              </div>
            )}

            {transaction.metadata.disco && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Electricity Disco</span>
                <span className="text-slate-800 font-semibold">{transaction.metadata.disco}</span>
              </div>
            )}

            {transaction.metadata.meterNumber && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Meter Number</span>
                <span className="text-slate-800 font-mono">{transaction.metadata.meterNumber}</span>
              </div>
            )}

            {transaction.metadata.customerName && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Customer Name</span>
                <span className="text-slate-800 font-medium uppercase text-[11px] max-w-[200px] text-right truncate">
                  {transaction.metadata.customerName}
                </span>
              </div>
            )}

            {transaction.metadata.cableProvider && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Cable Bouquet</span>
                <span className="text-slate-800 font-semibold">
                  {transaction.metadata.cableProvider} - {transaction.metadata.bouquetName}
                </span>
              </div>
            )}

            {transaction.metadata.smartCardNo && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">SmartCard / IUC No</span>
                <span className="text-slate-800 font-mono">{transaction.metadata.smartCardNo}</span>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-slate-200 pt-2">
              <span className="text-slate-500">Payment Method</span>
              <span className="text-slate-800 font-medium capitalize">
                VeltriPay Wallet ({transaction.paymentMethod.replace('_', ' ')})
              </span>
            </div>

            {transaction.discount > 0 && (
              <div className="flex justify-between items-center text-emerald-600">
                <span>Discount / Cashback Saved</span>
                <span>-{formatNaira(transaction.discount)}</span>
              </div>
            )}

            {transaction.metadata.loyaltyPointsEarned && transaction.metadata.loyaltyPointsEarned > 0 && (
              <div className="flex justify-between items-center text-amber-700">
                <span>Loyalty Points Earned</span>
                <span className="font-semibold">+{transaction.metadata.loyaltyPointsEarned} pts</span>
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 text-center">
            For support or complaints, quote Ref: <span className="font-mono text-emerald-600 font-medium">{transaction.reference}</span> in the Help Center.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 grid grid-cols-2 gap-2.5">
          <button
            onClick={handleShare}
            className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Receipt</span>
          </button>

          <button
            onClick={handlePrint}
            className="h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print / PDF</span>
          </button>
        </div>

        {onRepeat && (
          <button
            onClick={() => {
              onClose();
              onRepeat(transaction);
            }}
            className="w-full mt-2.5 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Repeat This Purchase</span>
          </button>
        )}
      </div>
    </div>
  );
};
