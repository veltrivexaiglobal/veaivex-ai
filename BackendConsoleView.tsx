import React, { useState, useEffect } from 'react';
import {
  Server,
  Terminal,
  Activity,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCw,
  Copy,
  Check,
  Code2,
  Database,
  Radio,
  Clock,
  Zap,
} from 'lucide-react';

interface ApiLogItem {
  id: string;
  method: string;
  url: string;
  status: number;
  durationMs: number;
  payload?: any;
  response?: any;
  timestamp: string;
}

export const BackendConsoleView: React.FC = () => {
  const [healthData, setHealthData] = useState<any>(null);
  const [logs, setLogs] = useState<ApiLogItem[]>([]);
  const [isLoadingHealth, setIsLoadingHealth] = useState(false);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Endpoint Tester State
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/health');
  const [customMethod, setCustomMethod] = useState<'GET' | 'POST'>('GET');
  const [requestBodyInput, setRequestBodyInput] = useState<string>('{}');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  const endpointsCatalog = [
    {
      method: 'GET',
      path: '/api/health',
      desc: 'System health, uptime, and gateway status',
      sampleBody: '',
    },
    {
      method: 'GET',
      path: '/api/admin/metrics',
      desc: 'Financial KPIs, volume, and gateway status',
      sampleBody: '',
    },
    {
      method: 'GET',
      path: '/api/admin/logs',
      desc: 'Live HTTP request/response logs stream',
      sampleBody: '',
    },
    {
      method: 'POST',
      path: '/api/vtu/validate-meter',
      desc: 'Verify Nigerian electricity Disco prepaid meter',
      sampleBody: JSON.stringify(
        { disco: 'ikeja-electric', meterNumber: '14235678901', meterType: 'prepaid' },
        null,
        2
      ),
    },
    {
      method: 'POST',
      path: '/api/vtu/validate-smartcard',
      desc: 'Verify DStv/GOtv SmartCard IUC number',
      sampleBody: JSON.stringify({ provider: 'dstv', smartCardNo: '4123456789' }, null, 2),
    },
    {
      method: 'POST',
      path: '/api/vtu/process-order',
      desc: 'Dispatch airtime or data bundle order to SIM',
      sampleBody: JSON.stringify(
        {
          type: 'data',
          network: 'mtn',
          recipient: '08031234567',
          amount: 1400,
          reference: 'PFX-TEST-001',
        },
        null,
        2
      ),
    },
    {
      method: 'POST',
      path: '/api/wallet/fund',
      desc: 'Simulate automated bank transfer webhook',
      sampleBody: JSON.stringify(
        { amount: 5000, method: 'virtual_account', senderBank: 'Wema Bank' },
        null,
        2
      ),
    },
  ];

  const fetchHealth = async () => {
    setIsLoadingHealth(true);
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealthData(data);
    } catch (e) {
      console.error('Failed to fetch health:', e);
    } finally {
      setIsLoadingHealth(false);
    }
  };

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const res = await fetch('/api/admin/logs');
      const data = await res.json();
      if (data.logs) setLogs(data.logs);
    } catch (e) {
      console.error('Failed to fetch logs:', e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectEndpoint = (ep: (typeof endpointsCatalog)[0]) => {
    setSelectedEndpoint(ep.path);
    setCustomMethod(ep.method as any);
    setRequestBodyInput(ep.sampleBody || '{}');
    setTestResult(null);
  };

  const handleExecuteTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    const startTime = Date.now();
    try {
      let options: RequestInit = {
        method: customMethod,
        headers: { 'Content-Type': 'application/json' },
      };

      if (customMethod === 'POST') {
        options.body = requestBodyInput;
      }

      const res = await fetch(selectedEndpoint, options);
      const data = await res.json();
      setTestResult({
        status: res.status,
        statusText: res.statusText,
        durationMs: Date.now() - startTime,
        headers: Object.fromEntries(res.headers.entries()),
        body: data,
      });
      // Refresh logs
      fetchLogs();
    } catch (err: any) {
      setTestResult({
        error: true,
        message: err.message || 'Network error occurred',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const curlSnippet =
    customMethod === 'GET'
      ? `curl -X GET "${window.location.origin}${selectedEndpoint}" -H "Accept: application/json"`
      : `curl -X POST "${window.location.origin}${selectedEndpoint}" \\
  -H "Content-Type: application/json" \\
  -d '${requestBodyInput.replace(/\n/g, '')}'`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-display">VeltriPay Core Backend API</h1>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                ONLINE • PORT 3000
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Production Express.js microservice handling VTU routing, Disco validations & settlement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              fetchHealth();
              fetchLogs();
            }}
            className="h-10 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoadingHealth ? 'animate-spin' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Backend Architecture & Server KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Terminal className="w-3.5 h-3.5 text-emerald-600" />
            <span>Runtime Server</span>
          </div>
          <p className="text-sm font-bold text-slate-900 font-mono">Node.js + Express</p>
          <p className="text-[10px] text-emerald-600 font-semibold">Port 3000 (Active Proxy)</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Radio className="w-3.5 h-3.5 text-teal-600" />
            <span>VTU Core Engine</span>
          </div>
          <p className="text-sm font-bold text-slate-900 font-mono">
            {healthData?.providerMode || 'VTPass Direct API'}
          </p>
          <p className="text-[10px] text-slate-500">Auto failover ready</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Server Uptime</span>
          </div>
          <p className="text-sm font-bold text-slate-900 font-mono">
            {healthData?.uptimeSeconds ? `${healthData.uptimeSeconds}s` : '99.98%'}
          </p>
          <p className="text-[10px] text-emerald-600 font-semibold">Zero Unplanned Outages</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <Database className="w-3.5 h-3.5 text-amber-600" />
            <span>Ledger Store</span>
          </div>
          <p className="text-sm font-bold text-slate-900 font-mono">In-Memory + Synced</p>
          <p className="text-[10px] text-slate-500">Atomic balance locks</p>
        </div>
      </div>

      {/* Main Console Grid: Endpoint Tester + Live Traffic Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive API Tester */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-600" />
                  Interactive API Endpoint Tester
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Execute live requests against the local backend server
                </p>
              </div>
            </div>

            {/* Catalog Pills */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Select API Route:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {endpointsCatalog.map((ep) => (
                  <button
                    key={ep.path}
                    type="button"
                    onClick={() => handleSelectEndpoint(ep)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition ${
                      selectedEndpoint === ep.path
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded font-mono ${
                          ep.method === 'GET'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-mono truncate">{ep.path}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate font-normal">
                      {ep.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Request Bar */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex gap-2">
                <select
                  value={customMethod}
                  onChange={(e) => setCustomMethod(e.target.value as any)}
                  className="h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800 outline-none"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                </select>

                <input
                  type="text"
                  value={selectedEndpoint}
                  onChange={(e) => setSelectedEndpoint(e.target.value)}
                  className="flex-1 h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 outline-none focus:border-emerald-500 shadow-xs"
                />

                <button
                  onClick={handleExecuteTest}
                  disabled={isTesting}
                  className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
                >
                  {isTesting ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-white" />
                  )}
                  <span>Send</span>
                </button>
              </div>

              {/* POST Body Editor */}
              {customMethod === 'POST' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    JSON Request Body:
                  </label>
                  <textarea
                    rows={4}
                    value={requestBodyInput}
                    onChange={(e) => setRequestBodyInput(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs outline-none border border-slate-800 resize-none shadow-inner"
                  />
                </div>
              )}
            </div>

            {/* cURL snippet */}
            <div className="p-3 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] flex items-center justify-between gap-3 overflow-x-auto">
              <span className="truncate">{curlSnippet}</span>
              <button
                onClick={copyCurl}
                className="shrink-0 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                title="Copy cURL command"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Test Result Output */}
            {testResult && (
              <div className="space-y-2 pt-2 border-t border-slate-100 animate-in fade-in">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">HTTP Response:</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold font-mono px-2 py-0.5 rounded text-[10px] ${
                        testResult.status >= 200 && testResult.status < 300
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {testResult.status} {testResult.statusText || 'OK'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {testResult.durationMs}ms
                    </span>
                  </div>
                </div>

                <pre className="p-3.5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-60 border border-slate-800">
                  {JSON.stringify(testResult.body || testResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Real-Time HTTP Traffic Stream */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-600" />
                  Live HTTP Traffic Logs ({logs.length})
                </h3>
                <p className="text-[11px] text-slate-500">Real-time requests received by server</p>
              </div>

              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                STREAMING
              </span>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto max-h-[520px] pr-1">
              {logs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No HTTP traffic logged yet. Trigger an API test on the left to see requests.
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs space-y-1.5 font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            log.method === 'GET'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {log.method}
                        </span>
                        <span className="font-bold text-slate-900">{log.url}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-1.5 rounded ${
                          log.status >= 200 && log.status < 300
                            ? 'text-emerald-700 bg-emerald-100'
                            : 'text-rose-700 bg-rose-100'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Latency: {log.durationMs}ms</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>

                    {log.payload && Object.keys(log.payload).length > 0 && (
                      <div className="pt-1 text-[10px] text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 overflow-x-auto">
                        Payload: {JSON.stringify(log.payload)}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
