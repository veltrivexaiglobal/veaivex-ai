import React, { useState } from 'react';
import { DailyCeoBrief as DailyCeoBriefType, BusinessProfile } from '../types';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Package,
  ArrowRight,
  Volume2,
  VolumeX,
  CheckCircle2,
  Clock,
  Compass,
} from 'lucide-react';
import { speechService } from '../lib/speech';

interface DailyCeoBriefProps {
  brief: DailyCeoBriefType;
  profile: BusinessProfile;
  onNavigate: (view: string) => void;
  onExecuteAction?: (actionId: string) => void;
}

export const DailyCeoBrief: React.FC<DailyCeoBriefProps> = ({
  brief,
  profile,
  onNavigate,
  onExecuteAction,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleToggleVoiceBrief = () => {
    if (isPlayingAudio) {
      speechService.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      const speechScript = `Veaivex Daily CEO Brief for ${brief.date}. ${brief.headline} Monthly Revenue is ${brief.revenue.formatted}. Net Profit is ${brief.profit.formatted}. Top performing product is ${brief.bestProduct.name}. Critical inventory risk: ${brief.inventoryRisk.name} has only ${brief.inventoryRisk.daysRemaining.toFixed(1)} days of stock left. Top customer risk: ${brief.customerRisk.count} high value clients need re-engagement. Today's top recommended action: ${brief.top3Actions[0]?.title || 'Restock critical staples'}.`;

      setIsPlayingAudio(true);
      speechService.speak(
        speechScript,
        profile.language,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false)
      );
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
      {/* Background ambient pattern */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                VEAIVEX DAILY BRIEF
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                Executive Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">{brief.date}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Audio read-aloud button */}
          <button
            id="btn-voice-brief"
            onClick={handleToggleVoiceBrief}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isPlayingAudio
                ? 'bg-blue-600 text-white border-blue-400 animate-pulse shadow-md'
                : 'bg-slate-800/90 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
            title="Listen to Executive Audio Brief"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Listen Aloud</span>
              </>
            )}
          </button>

          <button
            onClick={() => onNavigate('insights')}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-semibold ml-1"
          >
            <span>Full Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Headline & Summary */}
      <div className="mt-4 bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5 sm:p-4">
        <p className="text-sm font-semibold text-slate-100 leading-snug">
          {brief.headline}
        </p>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          {brief.summary}
        </p>
      </div>

      {/* Key Metric Blocks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        {/* Revenue */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Revenue
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">
              {brief.revenue.formatted}
            </span>
            <span className="flex items-center text-xs font-bold text-emerald-400">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              +{brief.revenue.growthPct}%
            </span>
          </div>
        </div>

        {/* Profit */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Net Profit
          </span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">
              {brief.profit.formatted}
            </span>
            <span className="flex items-center text-xs font-bold text-rose-400">
              <TrendingDown className="w-3 h-3 mr-0.5" />
              {brief.profit.growthPct}%
            </span>
          </div>
        </div>

        {/* Top Product */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Best Product
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-100 truncate mt-1">
            {brief.bestProduct.name}
          </p>
          <span className="text-[10px] text-emerald-400 font-semibold">
            {brief.bestProduct.unitsSold} units sold this month
          </span>
        </div>

        {/* Growth Opportunity */}
        <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-3">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Opportunity
          </span>
          <p className="text-xs sm:text-sm font-bold text-blue-300 truncate mt-1">
            {brief.opportunity.title}
          </p>
          <span className="text-[10px] text-blue-400 font-semibold">
            Exp. {brief.opportunity.expectedGain}
          </span>
        </div>
      </div>

      {/* Top 2 Risk Callouts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        {/* Inventory Risk */}
        <div
          onClick={() => onNavigate('inventory')}
          className="bg-rose-950/20 border border-rose-800/40 hover:border-rose-700/60 rounded-xl p-3 flex items-start gap-2.5 cursor-pointer transition-all group"
        >
          <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
            <Package className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-300">
                Inventory Risk ({brief.inventoryRisk.daysRemaining.toFixed(1)} Days Left)
              </span>
              <span className="text-[10px] text-rose-400 group-hover:underline flex items-center gap-0.5">
                Restock <ChevronRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
              {brief.inventoryRisk.name}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              {brief.inventoryRisk.action}
            </p>
          </div>
        </div>

        {/* Customer Risk */}
        <div
          onClick={() => onNavigate('customers')}
          className="bg-amber-950/20 border border-amber-800/40 hover:border-amber-700/60 rounded-xl p-3 flex items-start gap-2.5 cursor-pointer transition-all group"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <Users className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">
                Customer Risk ({brief.customerRisk.count} Inactive Accounts)
              </span>
              <span className="text-[10px] text-amber-400 group-hover:underline flex items-center gap-0.5">
                Re-engage <ChevronRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
              High-value wholesale buyers pending re-order
            </p>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
              {brief.customerRisk.action}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
