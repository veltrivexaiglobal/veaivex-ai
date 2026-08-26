import React, { useState } from 'react';
import { VeaivexLogo } from '../VeaivexLogo';
import { VeaivexAvatar } from '../VeaivexAvatar';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Mic,
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  Receipt,
  CheckCircle2,
  HelpCircle,
  Play,
  Globe,
  DollarSign,
  Compass,
  Layers,
  LineChart,
  BarChart3,
  Search,
  Sliders,
  FileText,
  AlertTriangle,
  Send,
  MessageSquare,
  Shield,
  Activity,
  Bot,
  BrainCircuit,
  Lock,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  Check,
  Copy,
  Info,
  Clock,
  Building2,
  ShoppingBag,
  Cpu,
  Truck,
  FileSpreadsheet,
  PieChart,
  ShoppingCart,
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onOpenVoiceModal: () => void;
  onOpenDemoGuide: () => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onNavigate: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onOpenVoiceModal,
  onOpenDemoGuide,
  onOpenAuth,
  onNavigate,
}) => {
  // Interactive Product Tab State
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<string>('executive');

  // Interactive Copilot Demo State
  const [selectedPromptIdx, setSelectedPromptIdx] = useState<number>(0);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Show detailed 7-stage engine toggle
  const [showFullArchitecture, setShowFullArchitecture] = useState<boolean>(false);

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactBusiness, setContactBusiness] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactBusiness('');
      setContactSubject('');
      setContactMessage('');
    }, 4000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Conversational sample queries and structured responses
  const conversationalDemos = [
    {
      q: 'Why did net profit fall this month even though sales increased?',
      category: 'Profit Variance & Diagnostics',
      response: {
        headline: 'Net Profit declined by 18.4% due to a 146% surge in Generator Fuel & Energy overhead.',
        why: 'Revenue rose by +4.2% (₦2.44M vs ₦2.35M), but operating expenses spiked by +18.2% (₦648K vs ₦548K). Specifically, Utilities & Generator Fuel jumped by ₦205,000 MoM due to grid tariff adjustments and diesel cost inflation.',
        evidence: [
          { metric: 'Revenue Growth', value: '+4.2% (+₦97,300)' },
          { metric: 'Fuel Expense Spike', value: '+146.4% (+₦205,000)' },
          { metric: 'Net Margin Impact', value: 'Eroded from 21.8% to 17.1%' },
        ],
        action: 'Prioritized Action #2: Audit generator operating hours during off-peak shifts to recover ~₦85,000/month.',
      },
    },
    {
      q: 'Which items are at risk of running out before my next supplier delivery?',
      category: 'Predictive Inventory',
      response: {
        headline: 'Golden Penny Spaghetti is critical: Stockout in 3.4 days; Supplier lead time is 4.0 days.',
        why: 'Current stock is 8 cartons with a burn rate of 2.3 cartons/day. Because supplier turnaround is 4 days, ordering today prevents a projected 1.2-day out-of-stock window.',
        evidence: [
          { metric: 'Current Inventory', value: '8 cartons on hand' },
          { metric: 'Daily Sales Burn', value: '2.3 cartons / day' },
          { metric: 'Recommended Reorder', value: '15 cartons (₦157,500)' },
        ],
        action: 'Prioritized Action #1: Place emergency purchase order with Flour Mills Distributor today.',
      },
    },
    {
      q: 'Who are our top VIP customers at risk of churn?',
      category: 'Customer Intelligence',
      response: {
        headline: '3 VIP B2B Accounts have exceeded their normal ordering cycle by >14 days.',
        why: 'Rahama General Merchant and Horizon Mini-Mart normally purchase every 5-7 days, but have had zero orders in 18 days, risking ₦380,000 in monthly reorders.',
        evidence: [
          { metric: 'At-Risk VIP Accounts', value: '3 Major Buyers' },
          { metric: 'Historical LTV', value: '₦1,850,000 combined' },
          { metric: 'Inactivity Gap', value: '18 days (normal is 6)' },
        ],
        action: 'Prioritized Action #3: Dispatch account manager call & offer 2.5% bulk replenishment rebate.',
      },
    },
    {
      q: 'What operational decisions should I execute first today?',
      category: 'Autonomous CEO Action Engine',
      response: {
        headline: '3 High-ROI actions identified totaling ₦1.64M protected revenue and ₦185k cost savings.',
        why: 'Stockout risk on top revenue-driver staples and overdue wholesale buyer cycles create immediate weekend cashflow vulnerabilities.',
        evidence: [
          { metric: 'Urgent Restock Impact', value: '₦968,000 revenue preserved' },
          { metric: 'Wholesale Win-back', value: '₦1,250,000 pipeline at stake' },
          { metric: 'Energy Load Shedding', value: '₦185,000 monthly expense savings' },
        ],
        action: 'Execute Action #1 (Restock PO) and Action #2 (1-Click WhatsApp follow-ups) directly from your workspace.',
      },
    },
  ];

  const activePrompt = conversationalDemos[selectedPromptIdx] || conversationalDemos[0];

  const workspaceModules = [
    {
      id: 'executive',
      name: 'Executive Dashboard',
      badge: 'Core Command',
      icon: Activity,
      headline: 'Holistic Business Health Index (0-100) & CEO Daily Brief',
      description:
        'A single executive screen synthesizing financial integrity, margin strength, inventory velocity, customer retention, and immediate prioritized operational actions.',
      keyMetrics: [
        { label: 'Business Health', val: '72 / 100 (Good)', change: '+3 pts MoM' },
        { label: 'Reconciled Revenue', val: '₦2,447,300', change: '+4.2% MoM' },
        { label: 'Net Profit', val: '₦419,200', change: '-18.4% MoM' },
        { label: 'Critical Restocks', val: '2 Urgent SKUs', change: 'Lead time alert' },
      ],
      previewView: 'dashboard',
    },
    {
      id: 'why-engine',
      name: 'AI Insights & Root Cause',
      badge: 'The "Why?" Engine',
      icon: BrainCircuit,
      headline: 'Diagnostic Root-Cause for Every Ledger Variance',
      description:
        'No more guessing why margins dropped. VEAIVEX cross-analyzes COGS, supplier inflation, utility spikes, and product mix contributions with underlying mathematical proof.',
      keyMetrics: [
        { label: 'Top Cost Anomaly', val: '+146% Fuel Surge', change: '₦205,000 variance' },
        { label: 'Gross Margin Impact', val: '43.6% Reconciled', change: '-1.4% MoM' },
        { label: 'Confidence Score', val: '94% Deterministic', change: 'Audited ledger' },
      ],
      previewView: 'insights',
    },
    {
      id: 'pos-orders',
      name: 'POS & Counter Sales',
      badge: 'Live Counter',
      icon: ShoppingCart,
      headline: 'Visual Product Catalog, Instant Barcode POS & Digital Receipts',
      description:
        'Equip sales attendants and store managers with a lightning-fast visual POS register featuring high-res imagery, category filters, payment method routing, real-time margin visibility, and printable digital receipts.',
      keyMetrics: [
        { label: 'Register Speed', val: '<3 Sec / Checkout', change: 'Instant receipt' },
        { label: 'Payment Channels', val: 'Cash, Transfer, POS', change: 'Live reconciliation' },
        { label: 'Inventory Sync', val: 'Real-Time Deduction', change: 'Zero stockout lag' },
        { label: 'Profit Visibility', val: 'Per-Item Margin', change: 'Direct COGS tracking' },
      ],
      previewView: 'pos-orders',
    },
    {
      id: 'inventory-intel',
      name: 'Inventory & Lead Times',
      badge: 'Stockout Predictor',
      icon: Package,
      headline: 'Daily Sales Burn vs. Supplier Turnaround Forecasting',
      description:
        'Calculates exact days of stock remaining for every SKU and factors in supplier lead times to trigger optimal reorder quantities before lost sales occur.',
      keyMetrics: [
        { label: 'Spaghetti Stockout', val: 'In 3.4 Days', change: 'Lead time 4.0d' },
        { label: 'Capital Locked', val: '₦1,133,000 Total', change: '2 Slow-moving SKUs' },
        { label: 'Revenue Protected', val: '₦187,500 Estimated', change: 'With reorder' },
      ],
      previewView: 'inventory',
    },
    {
      id: 'customer-intel',
      name: 'Customer Intelligence',
      badge: 'RFM & Retention',
      icon: Users,
      headline: 'VIP Account Tracking & Churn Risk Radar',
      description:
        'Automated RFM (Recency, Frequency, Monetary) segmentation. Identifies high-value clients exceeding their expected purchase cycle before they transition to competitors.',
      keyMetrics: [
        { label: 'VIP Accounts', val: '4 Active Clients', change: '₦1.85M combined' },
        { label: 'At-Risk Accounts', val: '3 Inactive >14d', change: 'Call recommended' },
        { label: 'Repeat Order Rate', val: '64.2%', change: '+5.1% QoQ' },
      ],
      previewView: 'customers',
    },
    {
      id: 'what-if-sim',
      name: 'What-If Scenario Sandbox',
      badge: 'Risk-Free Modeling',
      icon: Sliders,
      headline: 'Model Price Elasticity, Fuel Cuts, and Volume Shifts',
      description:
        'Simulate decisions before spending capital. Adjust prices, forecast volume elasticity, model solar investment payback, or simulate expense reductions instantly.',
      keyMetrics: [
        { label: '+5% Price Increase', val: '+₦102,000 Profit', change: 'At -2% volume' },
        { label: 'Solar Conversion', val: '₦145,000/mo Saved', change: '9.2 mo payback' },
        { label: 'Breakeven Point', val: '₦1,480,000 / mo', change: 'Current safe zone' },
      ],
      previewView: 'what-if',
    },
    {
      id: 'conversational-copilot',
      name: 'Conversational Voice & BI',
      badge: 'Hands-Free Copilot',
      icon: MessageSquare,
      headline: 'Conversational Business Intelligence in Natural English',
      description:
        'Ask complex business questions using natural voice or text. Receive structured executive explanations with verified data citations and actionable next steps.',
      keyMetrics: [
        { label: 'Voice Processing', val: 'Native Speech & TTS', change: 'Continuous loop' },
        { label: 'Response Latency', val: '<1.2 Seconds', change: 'Sub-second math' },
        { label: 'Structured Format', val: 'Answer + Why + Action', change: 'Executive proof' },
      ],
      previewView: 'ask-veaivex',
    },
  ];

  const currentWorkspace =
    workspaceModules.find((w) => w.id === activeWorkspaceTab) || workspaceModules[0];

  const faqs = [
    {
      q: 'What makes VEAIVEX AI different from standard dashboards or generic AI chatbots?',
      a: 'Standard dashboards only display charts without explaining why numbers changed or what specific operational step to take. Generic AI chatbots hallucinate calculations. VEAIVEX combines deterministic mathematical reconciliation (auditing revenues, COGS, expenses, and stock burn against real ledger formulas) with Gemini AI reasoning to provide explainable root-cause diagnosis and ranked, actionable decisions with verifiable evidence.',
    },
    {
      q: 'How does VEAIVEX handle my business data and confidentiality?',
      a: 'Your financial and operational data is isolated to your private workspace session. VEAIVEX runs deterministic reconciliation on verified transaction records and does not train external public AI models on your proprietary ledgers or customer accounts.',
    },
    {
      q: 'Can VEAIVEX work with my existing POS or spreadsheet data?',
      a: 'Yes. VEAIVEX supports direct CSV imports for sales transactions, expense ledgers, customer records, and product inventory catalogs. It also includes pre-configured presets for retail FMCG, supermarkets, pharmacy, electronics, and distribution to get you started in seconds.',
    },
    {
      q: 'How does the Voice and Conversational Copilot assist SME business owners?',
      a: 'SME founders and operators need answers on the move without digging through raw tables. VEAIVEX allows leaders to speak or type plain business inquiries (e.g. "Why did profit drop?" or "Which items need restocking?") to receive boardroom-grade analytical briefings and concrete recommended actions.',
    },
    {
      q: 'Does VEAIVEX make automated decisions without human approval?',
      a: 'Never. VEAIVEX is a Decision Support Intelligence tool designed on a strict "Human-in-the-Loop" architecture. It analyzes, diagnoses, predicts, and recommends ranked actions with mathematical proof—empowering the business owner to review, modify, approve, and track execution.',
    },
  ];

  return (
    <div className="space-y-24 py-4 pb-28 text-slate-900 overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (High Impact, Clear, Authoritative, Product-Focal)       */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 lg:p-14 border border-slate-800 shadow-2xl">
        {/* Ambient Subtle Background Grid & Glows */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          {/* Top Announcement Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>10Alytics Business AI BuildFest 2026 &bull; BI Track Finalist</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Deterministic Math + Gemini AI
              </span>
            </div>
          </div>

          {/* Core Hero Headline & Brand Lockup */}
          <div className="text-center space-y-5 max-w-4xl mx-auto pt-2">
            {/* Recognizable VEAIVEX AI Avatar & Identity Lockup */}
            <div className="flex items-center justify-center gap-3.5">
              <VeaivexAvatar size="lg" state="verified" />
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-wider text-white">VEAIVEX</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xs">
                    AI
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Autonomous Decision Intelligence &amp; BI Copilot
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-white">
              Autonomous Decision Intelligence
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                Built for African &amp; Global SMEs.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              VEAIVEX converts messy sales, expense, and inventory ledgers into instant root-cause
              diagnostics (<strong className="text-white">&ldquo;Why did profit fall?&rdquo;</strong>), predictive stockout alerts, and prioritized ROI decisions in <strong className="text-white">Executive English</strong>.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
              <button
                id="btn-hero-launch-app"
                onClick={onLaunchDashboard}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 transition-all hover:scale-105 active:scale-95 min-h-[44px]"
              >
                <Activity className="w-4 h-4 text-white" />
                <span>Explore Live Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-hero-judge-guide"
                onClick={onOpenDemoGuide}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-950/20 transition-all hover:scale-105 active:scale-95 min-h-[44px]"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>3-Min Judge Demo Guide</span>
              </button>

              <button
                id="btn-hero-voice-demo"
                onClick={onOpenVoiceModal}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-blue-300 transition-all min-h-[44px]"
              >
                <Mic className="w-4 h-4 text-blue-400 animate-pulse" />
                <span>Voice Copilot Demo</span>
              </button>
            </div>

            {/* Quick feature pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Deterministic Math (Zero Hallucinations)
              </span>
              <span className="flex items-center gap-1 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Real-Time Root Cause &ldquo;Why?&rdquo; Engine
              </span>
              <span className="flex items-center gap-1 bg-slate-800/60 px-2.5 py-1 rounded-full border border-slate-700/50">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                10 Specialized SME Workspaces
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* REALISTIC HIGH-FIDELITY LIVE PRODUCT STAGE (HERO FOCAL POINT)              */}
          {/* ========================================================================= */}
          <div className="pt-6 max-w-4xl mx-auto text-left">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4">
              {/* Browser Chrome Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] text-slate-400 font-mono ml-2 hidden sm:inline">
                    veaivex.app/workspace/executive-dashboard
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Live Telemetry Synchronized
                  </span>
                </div>
              </div>

              {/* Live Metric Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Metric 1: Revenue */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Reconciled Revenue (MTD)</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" /> +4.2%
                    </span>
                  </div>
                  <div className="text-xl font-black text-white">₦2,447,300</div>
                  <div className="text-[11px] text-slate-400">50 verified sales transactions</div>
                </div>

                {/* Metric 2: Net Profit & Diagnosis */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Net Profit</span>
                    <span className="text-rose-400 font-bold flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" /> -18.4%
                    </span>
                  </div>
                  <div className="text-xl font-black text-white">₦419,200</div>
                  <div className="text-[11px] text-amber-300 font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Why? Generator Fuel spike +146%</span>
                  </div>
                </div>

                {/* Metric 3: Health Score */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Business Health Score</span>
                    <span className="text-blue-400 font-bold">Good</span>
                  </div>
                  <div className="text-xl font-black text-white">72 / 100</div>
                  <div className="text-[11px] text-slate-400">6-pillar weighted financial formula</div>
                </div>
              </div>

              {/* Priority Action Callout Banner */}
              <div className="bg-blue-950/70 border border-blue-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/30 font-black">
                    #1
                  </div>
                  <div>
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <span>Restock Golden Penny Spaghetti</span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Critical
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Stockout projected in <strong>3.4 days</strong> &bull; Supplier lead time is{' '}
                      <strong>4.0 days</strong> &bull; Protects ₦187,500 in revenue.
                    </p>
                  </div>
                </div>

                <button
                  onClick={onLaunchDashboard}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shrink-0 shadow-sm flex items-center justify-center gap-1.5"
                >
                  <span>Review Evidence</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Live Interactive Assistant Quote Strip */}
              <div className="bg-slate-900 border border-slate-800/80 rounded-xl p-3 flex items-center gap-3 text-xs">
                <VeaivexAvatar size="sm" state="speaking" />
                <div className="flex-1 truncate">
                  <span className="text-slate-400">VEAIVEX Copilot:</span>{' '}
                  <span className="text-slate-200 font-medium">
                    &ldquo;I detected a ₦205,000 generator fuel cost variance reducing your net margin
                    to 17.1%. Would you like to review recommended shift adjustments?&rdquo;
                  </span>
                </div>
                <button
                  onClick={() => onNavigate('ask-veaivex')}
                  className="text-blue-400 hover:text-blue-300 font-bold shrink-0 text-[11px]"
                >
                  Open Copilot &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRUST & SME REALITY BAR                                                */}
      {/* ========================================================================= */}
      <section className="bg-slate-100/90 border border-slate-200 rounded-2xl p-6 sm:p-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Engineered for Fast-Growing African &amp; Global Enterprises
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 text-center shadow-2xs">
              <div className="text-lg font-black text-slate-900">10 Workspaces</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Full enterprise coverage</div>
            </div>
            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 text-center shadow-2xs">
              <div className="text-lg font-black text-blue-600">0-100 Index</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Weighted health score</div>
            </div>
            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 text-center shadow-2xs">
              <div className="text-lg font-black text-slate-900">1-Click Actions</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Ranked ROI &amp; WhatsApp</div>
            </div>
            <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 text-center shadow-2xs">
              <div className="text-lg font-black text-emerald-600">&lt; 1.2s Latency</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Real-time root cause</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THE PROBLEM VS. THE VEAIVEX SOLUTION (HIGH-CONTRAST COMPARISON)        */}
      {/* ========================================================================= */}
      <section id="solution" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
            The Decision Dilemma
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            SMEs Have Data — But Struggle To Turn It Into Decisions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Why traditional spreadsheets and generic chatbots fail modern business leaders:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* The Old Way */}
          <div className="bg-rose-50/50 border border-rose-200 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-800 font-bold text-sm">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-black">
                ✕
              </div>
              <span>The Old Way: Spreadsheet Paralysis &amp; Guesswork</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">&bull;</span>
                <span>
                  <strong>Mystery Profit Drops:</strong> You see net income falling at month-end, but
                  cannot tell if it was fuel inflation, supplier price hikes, or low-margin product
                  mix.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">&bull;</span>
                <span>
                  <strong>Surprise Stockouts:</strong> Top-selling products run out on busy weekends
                  because reorders didn&apos;t factor in 4-day supplier delivery turnarounds.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">&bull;</span>
                <span>
                  <strong>Silent VIP Churn:</strong> High-spending wholesale accounts stop ordering
                  for weeks before anyone notices they switched to a competitor.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold shrink-0">&bull;</span>
                <span>
                  <strong>Generic AI Chatbots:</strong> Hallucinate arithmetic, ignore real ledger
                  ledgers, and give vague, unverified advice without proof.
                </span>
              </li>
            </ul>
          </div>

          {/* The VEAIVEX Way */}
          <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-2.5 text-blue-300 font-bold text-sm">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
                ✓
              </div>
              <span>The VEAIVEX Way: Deterministic Decision Intelligence</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold shrink-0">&bull;</span>
                <span>
                  <strong>Instant Root Cause:</strong> Deterministic variance attribution isolates
                  exact cost spikes (e.g. ₦205K fuel surge) and calculates margin impact.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold shrink-0">&bull;</span>
                <span>
                  <strong>Predictive Inventory Horizons:</strong> Daily consumption burn is matched
                  against supplier lead times to trigger sized purchase orders ahead of time.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold shrink-0">&bull;</span>
                <span>
                  <strong>RFM Loyalty &amp; Retention:</strong> Detects customer inactivity cycles
                  automatically and recommends targeted retention actions.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold shrink-0">&bull;</span>
                <span>
                  <strong>Prioritized Action Queue:</strong> Transforms confusing data into a
                  ranked 3-step action list with gain estimates and human approval workflows.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PRODUCT DEMONSTRATION & 10 DEDICATED WORKSPACES (INTERACTIVE STAGE)     */}
      {/* ========================================================================= */}
      <section id="product" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
            Comprehensive BI Platform
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            10 Dedicated Business Intelligence Workspaces
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Click a module below to inspect its specialized analytical engine and live telemetry:
          </p>
        </div>

        {/* Interactive Workspace Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto">
          {workspaceModules.map((ws) => {
            const Icon = ws.icon;
            const isActive = activeWorkspaceTab === ws.id;
            return (
              <button
                key={ws.id}
                onClick={() => setActiveWorkspaceTab(ws.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20 scale-102'
                    : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{ws.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Workspace Showcase Card */}
        <div className="max-w-5xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 mb-1.5">
                {currentWorkspace.badge}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {currentWorkspace.headline}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {currentWorkspace.description}
              </p>
            </div>

            <button
              onClick={() => onNavigate(currentWorkspace.previewView)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shrink-0 shadow-sm transition-all"
            >
              <span>Launch This Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Metric Telemetry Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {currentWorkspace.keyMetrics.map((km, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1"
              >
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {km.label}
                </div>
                <div className="text-lg font-black text-slate-900">{km.val}</div>
                <div className="text-[11px] text-blue-600 font-medium">{km.change}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 10 Workspaces Bento Grid Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 max-w-6xl mx-auto pt-2">
          {[
            { view: 'dashboard', icon: Activity, title: 'Dashboard', desc: 'Scorecard & daily CEO brief' },
            { view: 'insights', icon: BrainCircuit, title: 'AI Insights', desc: 'Anomalies & evidence citations' },
            { view: 'sales-analytics', icon: LineChart, title: 'Sales Analytics', desc: 'Revenue velocity & mix' },
            { view: 'profit-analytics', icon: DollarSign, title: 'Profit & Margins', desc: 'COGS & net margin audit' },
            { view: 'expense-analytics', icon: Receipt, title: 'Expense Tracker', desc: 'Overhead & fuel spikes' },
            { view: 'customers', icon: Users, title: 'Customers', desc: 'VIP RFM & churn risk radar' },
            { view: 'inventory', icon: Package, title: 'Inventory', desc: 'Days of stock & lead times' },
            { view: 'ask-veaivex', icon: MessageSquare, title: 'Ask VEAIVEX', desc: 'Voice/text Copilot (EN/HA/AR)' },
            { view: 'what-if', icon: Sliders, title: 'What-If Sandbox', desc: 'Price & cost simulations' },
            { view: 'reports', icon: FileText, title: 'Reports & PDF', desc: 'Executive board-ready export' },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => onNavigate(item.view)}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center text-[10px] font-bold text-blue-600">
                  <span>Open workspace &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS (SIMPLE 3-STEP CORE + EXPANDABLE 7-STAGE DEEP DIVE)       */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="bg-slate-900 text-white rounded-3xl p-6 sm:p-12 shadow-xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block">
            Simple 3-Step Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How VEAIVEX Turns Data Into Confident Decisions
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            From raw transaction files to human-approved operational execution:
          </p>
        </div>

        {/* 3 Large Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-base border border-blue-400/30">
                1
              </div>
              <h3 className="text-base font-bold text-white">Ingest or Connect Data</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Upload raw CSV ledgers from POS, accounting software, or select a verified sector
                benchmark. VEAIVEX audits column integrity and reconciles duplicate transactions
                automatically.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-mono text-blue-300 border-t border-slate-700/60">
              ✓ Sales, Expenses, Inventory, Customers
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black text-base border border-indigo-400/30">
                2
              </div>
              <h3 className="text-base font-bold text-white">VEAIVEX Diagnoses &amp; Predicts</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                The deterministic BI engine computes exact profit margins and burns rates, while the
                Gemini reasoning layer isolates cost anomalies (e.g. diesel spikes) and forecasts
                stockout dates.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-mono text-indigo-300 border-t border-slate-700/60">
              ✓ Deterministic Math + Gemini Root Cause
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-base border border-emerald-400/30">
                3
              </div>
              <h3 className="text-base font-bold text-white">Execute Prioritized Actions</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Receive ranked operational steps with calculated profit impact. Review the
                mathematical proof, approve actions, download board-ready reports, and track
                decisions safely.
              </p>
            </div>
            <div className="pt-2 text-[11px] font-mono text-emerald-300 border-t border-slate-700/60">
              ✓ Human-in-the-Loop Decision Support
            </div>
          </div>
        </div>

        {/* Expandable 7-Stage Engine Architecture for Technical Evaluators */}
        <div className="max-w-5xl mx-auto pt-2 text-center">
          <button
            onClick={() => setShowFullArchitecture(!showFullArchitecture)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 transition-colors"
          >
            <span>
              {showFullArchitecture ? 'Hide Technical Architecture' : 'View Full 7-Stage Pipeline'}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showFullArchitecture ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showFullArchitecture && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2.5 pt-6 text-center animate-in fade-in duration-300">
              {[
                { step: 'DATA INGESTION', desc: 'Raw POS & CSV Ledgers', num: '01' },
                { step: 'RECONCILIATION', desc: 'Deterministic Ledger Math', num: '02' },
                { step: 'BENCHMARKING', desc: 'Sector Margins & Velocities', num: '03' },
                { step: 'EXPLANATION', desc: 'Diagnostic "Why?" Isolation', num: '04' },
                { step: 'PREDICTION', desc: 'Stockout & Churn Horizons', num: '05' },
                { step: 'RECOMMENDATION', desc: 'Ranked Actions + Evidence', num: '06' },
                { step: 'DECISION', desc: 'Human-Approved Execution', num: '07' },
              ].map((node, i) => (
                <div
                  key={i}
                  className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 flex flex-col justify-between"
                >
                  <div className="text-[10px] font-black text-blue-400 mb-1">{node.num}</div>
                  <div className="text-[11px] font-extrabold text-white">{node.step}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{node.desc}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. CONVERSATIONAL & VOICE AI COPILOT (INTERACTIVE SHOWCASE)               */}
      {/* ========================================================================= */}
      <section id="ai-copilot" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
            Conversational Decision Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ask Complex Business Questions in Plain Words
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Interactive voice &amp; natural language queries with verified mathematical evidence and next actions:
          </p>
        </div>

        {/* Interactive Copilot Preview Box */}
        <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          {/* Section Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <VeaivexAvatar size="md" state="speaking" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">Ask VEAIVEX AI Copilot</h3>
                <span className="text-xs text-slate-500">
                  Select a live business query below to test the explainable intelligence:
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                <span>Voice Enabled &bull; EN</span>
              </span>
            </div>
          </div>

          {/* Sample Question Pills */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Select an Executive Question:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {conversationalDemos.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPromptIdx(idx)}
                  className={`text-left p-3 rounded-xl text-xs font-semibold border transition-all ${
                    selectedPromptIdx === idx
                      ? 'bg-blue-50/80 border-blue-400 text-blue-950 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-[10px] text-blue-600 font-bold uppercase mb-0.5">
                    {p.category}
                  </div>
                  <div className="line-clamp-2">&ldquo;{p.q}&rdquo;</div>
                </button>
              ))}
            </div>
          </div>

          {/* Structured Diagnostic Response Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-bold text-slate-200">
                  VEAIVEX Structured Diagnostic Response
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Confidence: 96% &bull; Audited
              </span>
            </div>

            {/* Answer Headline */}
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Direct Finding
              </div>
              <p className="text-sm sm:text-base font-bold text-white leading-snug">
                {activePrompt.response.headline}
              </p>
            </div>

            {/* Why / Root Cause */}
            <div className="space-y-1 bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/60">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>The Diagnostic &ldquo;Why?&rdquo;</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                {activePrompt.response.why}
              </p>
            </div>

            {/* Underlying Evidence Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {activePrompt.response.evidence.map((ev, i) => (
                <div
                  key={i}
                  className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 text-center"
                >
                  <div className="text-[10px] text-slate-400 uppercase">{ev.metric}</div>
                  <div className="text-xs font-extrabold text-blue-300 mt-0.5">{ev.value}</div>
                </div>
              ))}
            </div>

            {/* Recommended Action */}
            <div className="bg-emerald-950/60 border border-emerald-800/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-200">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-300">Recommended Action:</strong>{' '}
                {activePrompt.response.action}
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => onNavigate('ask-veaivex')}
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              <span>Open the full Ask VEAIVEX Copilot workspace &rarr;</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. REAL-WORLD SME IMPACT & CASE STUDIES (HUMAN ELEMENT)                    */}
      {/* ========================================================================= */}
      <section id="sme-impact" className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
            Real-World SME Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How Modern Business Owners Use VEAIVEX Daily
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real operational challenges solved with deterministic decision intelligence:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {/* Case 1: Supermarket / Retail */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Retail Supermarket</h3>
                  <span className="text-[11px] text-slate-500">Kano, Nigeria &bull; 1,200 SKUs</span>
                </div>
              </div>

              <div className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg">
                Challenge: Unexplained 18% Net Profit Margin Drop
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                &ldquo;Sales were high, but cash at the bank was shrinking. VEAIVEX pinpointed a
                ₦205,000 generator diesel spike during afternoon grid downtime in 30 seconds. We
                optimized our refrigeration cycle and protected ₦85,000 in monthly net
                profit.&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-900 flex justify-between">
              <span>Alhaji Musa Kabir</span>
              <span className="text-blue-600">Managing Director</span>
            </div>
          </div>

          {/* Case 2: FMCG Wholesale */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">FMCG Wholesale Distributor</h3>
                  <span className="text-[11px] text-slate-500">Lagos, Nigeria &bull; 4 Branches</span>
                </div>
              </div>

              <div className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                Challenge: Weekend Stockouts on Fast-Moving Pasta SKUs
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                &ldquo;We used to order when shelves were almost empty. VEAIVEX now calculates our
                consumption burn against the 4-day supplier turnaround time. We eliminated stockouts
                and preserved ₦187,500 in weekly revenue.&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-900 flex justify-between">
              <span>Mrs. Chioma Okafor</span>
              <span className="text-indigo-600">Head of Operations</span>
            </div>
          </div>

          {/* Case 3: Electronics & Solar */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Solar &amp; Power Systems</h3>
                  <span className="text-[11px] text-slate-500">Abuja, Nigeria &bull; B2B &amp; Retail</span>
                </div>
              </div>

              <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Challenge: High-Value VIP Client Churn Risk
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                &ldquo;The Customer Intelligence workspace flagged three installation contractors who
                had gone inactive past their normal 7-day reorder cycle. We called them with a custom
                rebate and recovered ₦640,000 in inverter sales.&rdquo;
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] font-bold text-slate-900 flex justify-between">
              <span>Engr. Tunde Adeleke</span>
              <span className="text-emerald-600">Commercial Lead</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. DATA SECURITY, INTEGRITY & DETERMINISTIC MATH PRINCIPLES               */}
      {/* ========================================================================= */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Deterministic Integrity &amp; Enterprise Confidentiality
              </h3>
              <p className="text-xs text-slate-400">
                Built on verifiable mathematics — not probabilistic guessing
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
              Zero Data Training
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300 leading-relaxed">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-2">
            <div className="font-bold text-white text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Verifiable Arithmetic</span>
            </div>
            <p>
              Revenues, COGS, gross margins, operating expenses, and net profit are calculated using
              deterministic ledger math. Numbers are never guessed.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-2">
            <div className="font-bold text-white text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Reasoning Over Math</span>
            </div>
            <p>
              Gemini AI analyzes the verified calculations to explain variance causation in natural
              words, providing explainable &ldquo;Why?&rdquo; proofs.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 space-y-2">
            <div className="font-bold text-white text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Human-in-the-Loop</span>
            </div>
            <p>
              Every recommendation is presented as a reviewable proposal with risk/gain estimates.
              Business leaders maintain complete sovereign control.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)                             */}
      {/* ========================================================================= */}
      <section id="faq" className="space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
            Common Inquiries
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Everything you need to know about deploying and using VEAIVEX AI:
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. CLOSING CALL TO ACTION BANNER                                         */}
      {/* ========================================================================= */}
      <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl max-w-5xl mx-auto text-center space-y-5">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>Ready for Sovereign Decision Intelligence?</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Start Making Data-Driven Decisions Today
          </h2>

          <p className="text-xs sm:text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
            Experience the full VEAIVEX AI suite right in your browser. Launch the interactive live
            workspace or request an enterprise integration consultation.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            onClick={onLaunchDashboard}
            className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-blue-900 hover:bg-blue-50 shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            <span>Launch Live BI Workspace</span>
          </button>

          <button
            onClick={() => onOpenAuth('signup')}
            className="px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-900/60 hover:bg-blue-900 border border-white/20 text-white transition-all"
          >
            <span>Create Free Account</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. ABOUT VEAIVEX & CONTACT FORM                                          */}
      {/* ========================================================================= */}
      <section id="about" className="space-y-8 max-w-5xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
            About VEAIVEX AI
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Executive Decision Intelligence for Growing Enterprises
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              <strong>VEAIVEX AI</strong> is a business intelligence and AI decision-support product
              developed by <strong>Veltrivex AI Global</strong>.
            </p>
            <p>
              The product is designed to help small, medium, and multi-branch enterprises understand
              their business data, identify risks and opportunities, and make better-informed
              decisions. By automating root-cause diagnosis, multi-factor variance analysis, and
              prioritized action recommendations, VEAIVEX AI enables business owners to take decisive
              actions with complete mathematical confidence.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div
          id="contact"
          className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-5"
        >
          <div className="text-center max-w-lg mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Get in Touch
            </span>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              Contact the Product Team
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Inquiries regarding VEAIVEX AI deployment, enterprise integrations, or product
              evaluation
            </p>
          </div>

          {contactSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2 text-emerald-900 animate-in fade-in">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm">Message Sent Successfully</h4>
              <p className="text-xs text-emerald-700">
                Thank you for reaching out. The Veltrivex AI Global product team will review your
                inquiry promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-3.5 max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amina Bello"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Business Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. amina@retailhub.ng"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Company / Enterprise Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kano Supermarket Ltd"
                    value={contactBusiness}
                    onChange={(e) => setContactBusiness(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Inquiry Subject
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Commercial Deployment / Custom Integration"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message Details
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us about your business, transaction volume, or deployment requirements..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Enterprise Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. PUBLIC WEBSITE FOOTER                                                 */}
      {/* ========================================================================= */}
      <footer className="pt-12 pb-8 border-t border-slate-200 text-center space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <VeaivexLogo size="sm" />
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-wider text-base">
                  VEAIVEX
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  AI
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600">A product of Veltrivex AI Global</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-semibold">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600">
              Live BI Workspace
            </button>
            <button onClick={() => scrollToSection('solution')} className="hover:text-blue-600">
              Solution
            </button>
            <button onClick={() => scrollToSection('product')} className="hover:text-blue-600">
              Workspaces
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-blue-600">
              How It Works
            </button>
            <button onClick={() => scrollToSection('ai-copilot')} className="hover:text-blue-600">
              AI Copilot
            </button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-blue-600">
              FAQ
            </button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-blue-600">
              Contact
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 max-w-5xl mx-auto text-[11px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 px-4">
          <p>&copy; 2026 Veltrivex AI Global. All rights reserved.</p>
          <p>10Alytics Business AI BuildFest 2026 &bull; Business Intelligence Track</p>
        </div>
      </footer>
    </div>
  );
};
