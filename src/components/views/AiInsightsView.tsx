import React, { useState } from 'react';
import { AnomalyAlert, BusinessProfile, BusinessMetrics, SaleRecord, CustomerRecord, WhyInvestigation } from '../../types';
import { formatCurrency, getWhyInvestigations, generateBusinessOpportunities } from '../../lib/biEngine';
import { WhyInvestigationModal } from '../WhyInvestigationModal';
import { OpportunityRadarSection } from '../OpportunityRadarSection';
import {
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Users,
  Package,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Info,
  CheckCircle,
  Zap,
  HelpCircle,
  Scale,
  Compass,
} from 'lucide-react';

interface AiInsightsViewProps {
  anomalies: AnomalyAlert[];
  profile: BusinessProfile;
  metrics: BusinessMetrics;
  sales?: SaleRecord[];
  customers?: CustomerRecord[];
  onNavigate: (view: string) => void;
}

export const AiInsightsView: React.FC<AiInsightsViewProps> = ({
  anomalies,
  profile,
  metrics,
  sales = [],
  customers = [],
  onNavigate,
}) => {
  const curr = profile.currency;
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [addressedIds, setAddressedIds] = useState<string[]>([]);
  const [selectedWhyInvestigation, setSelectedWhyInvestigation] = useState<WhyInvestigation | null>(null);

  const whyInvestigations = getWhyInvestigations(metrics, curr);
  const opportunities = generateBusinessOpportunities(sales, customers, curr);

  const filteredAnomalies = anomalies.filter((a) => {
    return selectedDomain === 'all' || a.category === selectedDomain;
  });

  const handleToggleAddressed = (id: string) => {
    if (addressedIds.includes(id)) {
      setAddressedIds(addressedIds.filter((x) => x !== id));
    } else {
      setAddressedIds([...addressedIds, id]);
    }
  };

  const getDomainIcon = (cat?: string) => {
    switch (cat) {
      case 'inventory':
        return <Package className="w-4 h-4 text-rose-500" />;
      case 'customer':
        return <Users className="w-4 h-4 text-amber-500" />;
      case 'expense':
        return <Flame className="w-4 h-4 text-purple-500" />;
      case 'sales':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Diagnostic, Anomaly &amp; Root-Cause Engine
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              {anomalies.length} Active Signals
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Deterministic root-cause attribution, variance math, and prescriptive business actions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedWhyInvestigation(whyInvestigations.profit_drop)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-rose-600" />
            <span>Investigate Profit Compression</span>
          </button>

          <button
            onClick={() => onNavigate('ask-veaivex')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>Interactive Diagnosis</span>
          </button>
        </div>
      </div>

      {/* Root-Cause Explorer Highlight Cards */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 sm:p-6 border border-slate-700 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Root-Cause Explorer: Deep Diagnostic Attribution
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Click to inspect math &amp; evidence</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(whyInvestigations).map(([key, inv]) => (
            <div
              key={key}
              onClick={() => setSelectedWhyInvestigation(inv)}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl p-3.5 cursor-pointer transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-200">{inv.metricLabel}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {inv.confidence}
                  </span>
                </div>
                <p className="text-xs text-rose-300 font-semibold">{inv.changeStatement}</p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{inv.rootCause}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-blue-400 font-bold">
                <span>View Proof &amp; Drivers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Opportunity Radar */}
      <OpportunityRadarSection
        opportunities={opportunities}
        profile={profile}
        onNavigate={onNavigate}
      />

      {/* Intelligence Pipeline Flow Graphic */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            VEAIVEX 8-Stage Intelligence Pipeline
          </span>
          <span className="text-[11px] text-slate-400">SME Decision Support Architecture</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-xs">
          {[
            { step: '1. DATA', desc: 'Ingestion & Schema' },
            { step: '2. UNDERSTAND', desc: 'SME Domain Context' },
            { step: '3. ANALYZE', desc: 'Deterministic BI' },
            { step: '4. DETECT', desc: 'Anomalies & Variance' },
            { step: '5. PREDICT', desc: 'Forecasting & Risk' },
            { step: '6. EXPLAIN', desc: 'Root Cause & Proof' },
            { step: '7. RECOMMEND', desc: 'Ranked Actions' },
            { step: '8. ACTION', desc: 'Review & Approvals' },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col justify-center"
            >
              <span className="font-extrabold text-blue-700 text-[11px] block">{item.step}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {['all', 'inventory', 'customer', 'expense', 'sales'].map((dom) => (
          <button
            key={dom}
            onClick={() => setSelectedDomain(dom)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
              selectedDomain === dom
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {dom === 'all'
              ? 'All Signals'
              : `${dom} (${anomalies.filter((a) => a.category === dom).length})`}
          </button>
        ))}
      </div>

      {/* Anomaly Deep Cards */}
      <div className="space-y-4">
        {filteredAnomalies.map((anom) => {
          const isAddressed = addressedIds.includes(anom.id);

          return (
            <div
              key={anom.id}
              className={`bg-white border rounded-2xl p-5 sm:p-6 transition-all ${
                isAddressed
                  ? 'border-emerald-200 bg-emerald-50/20 opacity-70'
                  : anom.severity === 'critical'
                  ? 'border-rose-200 shadow-xs'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    {getDomainIcon(anom.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{anom.title}</h3>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          anom.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800'
                            : anom.severity === 'warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {anom.severity}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">
                      Category:{' '}
                      <strong className="text-slate-700 capitalize">{anom.category}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                    Impact: {anom.metricImpact}
                  </span>
                  <button
                    onClick={() => handleToggleAddressed(anom.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isAddressed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isAddressed ? 'Addressed' : 'Mark Addressed'}
                  </button>
                </div>
              </div>

              {/* Body: Description & Root Cause */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
                <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5">
                  <span className="font-bold text-slate-900 block mb-1">Observed Anomaly:</span>
                  <p className="text-slate-600 leading-relaxed">{anom.description}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5">
                  <span className="font-bold text-slate-900 block mb-1">Diagnostic Root Cause:</span>
                  <p className="text-slate-600 leading-relaxed">{anom.rootCause || anom.suspectedReason}</p>
                </div>
              </div>

              {/* Quantitative Evidence Table */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Mathematical Evidence &amp; Baselines
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {anom.evidence.map((ev, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs">
                      <span className="text-[10px] text-slate-400 block truncate">{ev.label}</span>
                      <span className="font-black text-slate-900 text-sm block mt-0.5">{ev.value}</span>
                      {ev.benchmark && (
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Baseline: {ev.benchmark}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Action CTA */}
              <div className="mt-4 bg-blue-50/80 border border-blue-200/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-blue-900 block">Recommended Action:</span>
                  <span className="text-blue-800">{anom.action || anom.recommendedAction}</span>
                </div>

                <button
                  onClick={() =>
                    onNavigate(
                      anom.category === 'inventory'
                        ? 'inventory'
                        : anom.category === 'customer'
                        ? 'customers'
                        : 'what-if'
                    )
                  }
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs flex items-center gap-1 shrink-0"
                >
                  <span>Review Solution</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Why Investigation Modal */}
      <WhyInvestigationModal
        investigation={selectedWhyInvestigation}
        profile={profile}
        isOpen={Boolean(selectedWhyInvestigation)}
        onClose={() => setSelectedWhyInvestigation(null)}
        onNavigateToResolve={onNavigate}
      />
    </div>
  );
};
