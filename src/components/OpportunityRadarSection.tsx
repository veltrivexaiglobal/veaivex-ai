import React, { useState } from 'react';
import { BusinessOpportunity, BusinessProfile } from '../types';
import {
  Compass,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Package,
  Users,
} from 'lucide-react';

interface OpportunityRadarSectionProps {
  opportunities: BusinessOpportunity[];
  profile: BusinessProfile;
  onNavigate: (view: string) => void;
  onReviewOpportunity?: (opp: BusinessOpportunity) => void;
}

export const OpportunityRadarSection: React.FC<OpportunityRadarSectionProps> = ({
  opportunities,
  profile,
  onNavigate,
  onReviewOpportunity,
}) => {
  const [approvedIds, setApprovedIds] = useState<string[]>([]);

  const handleApproveOpp = (id: string) => {
    if (!approvedIds.includes(id)) {
      setApprovedIds([...approvedIds, id]);
    }
  };

  const getOppIcon = (type: string) => {
    switch (type) {
      case 'growth_product':
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'untapped_customer':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'cross_selling':
        return <Package className="w-4 h-4 text-purple-500" />;
      default:
        return <Compass className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                VEAIVEX Opportunity Radar
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {opportunities.length} Growth Signals
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Automated high-upside signals derived from transaction velocity &amp; cross-purchasing
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('what-if')}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
        >
          <span>Test in What-If Simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
        {opportunities.map((opp) => {
          const isApproved = approvedIds.includes(opp.id);

          return (
            <div
              key={opp.id}
              className={`border rounded-xl p-4 flex flex-col justify-between transition-all ${
                isApproved
                  ? 'bg-emerald-50/30 border-emerald-200'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
              }`}
            >
              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    {getOppIcon(opp.type)}
                    {opp.type.replace('_', ' ')}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                    {opp.confidence} Conf.
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {opp.title}
                </h4>

                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  <strong className="text-slate-800">Signal:</strong> {opp.signal}
                </p>

                {/* Quantitative Evidence */}
                <div className="mt-3 space-y-1 bg-slate-50 border border-slate-100 rounded-lg p-2 text-xs">
                  {opp.evidence.map((ev, i) => (
                    <div key={i} className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">{ev.label}:</span>
                      <span className="font-bold text-slate-800">{ev.value}</span>
                    </div>
                  ))}
                </div>

                {/* Expected Gain */}
                <div className="mt-3 text-xs font-bold text-emerald-700 bg-emerald-50/70 border border-emerald-200/60 rounded-lg p-2 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{opp.estimatedPotentialGain}</span>
                </div>
              </div>

              {/* Recommended Next Step & Button */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-[11px] text-slate-600 mb-2 leading-relaxed">
                  <strong className="text-slate-800">Next Step:</strong> {opp.recommendedNextStep}
                </p>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {opp.timeframe}
                  </span>

                  <button
                    onClick={() => handleApproveOpp(opp.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                    }`}
                  >
                    {isApproved ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approved</span>
                      </>
                    ) : (
                      <>
                        <span>Approve Strategy</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
