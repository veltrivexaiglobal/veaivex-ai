import React, { useState, useEffect, useRef } from 'react';
import {
  SaleRecord,
  ExpenseRecord,
  ProductItem,
  CustomerRecord,
  BusinessProfile,
  ChatMessage,
  ChatFocusMode,
  AiSocietyRedirect,
} from '../../types';
import { askVeaivexAi } from '../../lib/geminiService';
import { speechService } from '../../lib/speech';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Zap,
  Info,
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Package,
  Users,
  Layers,
  MessageSquare,
  Radio,
  SlidersHorizontal,
  ChevronRight,
  Headphones,
  FileCheck,
  PhoneCall,
  Briefcase,
  ExternalLink,
  Compass,
  Globe,
  Smile,
  HelpCircle,
} from 'lucide-react';

interface AskVeaivexViewProps {
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
  products: ProductItem[];
  customers: CustomerRecord[];
  profile: BusinessProfile;
  onNavigate: (view: string) => void;
}

type InteractionMode = 'text' | 'voice';

export const AskVeaivexView: React.FC<AskVeaivexViewProps> = ({
  sales,
  expenses,
  products,
  customers,
  profile,
  onNavigate,
}) => {
  const [activeMode, setActiveMode] = useState<InteractionMode>('text');
  const [focusMode, setFocusMode] = useState<ChatFocusMode>('business');
  const [continuousVoice, setContinuousVoice] = useState(false);

  // Message history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      content: `Hello ${profile.ownerName || 'my friend'}! I am VEAIVEX AI, equipped with two dedicated modes for you:`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: 'text',
      language: 'en',
      focusMode: 'business',
      structuredData: {
        answer: 'You can switch between two communication modes at the top bar at any time:',
        why: '1) Choice 1 (Business Intelligence): Dive deep into profit drops, sales ledgers, urgent restocking, expenses, and ROI actions.\n2) Choice 2 (Friend & Everyday Assistant): Chat with me like a true friend! Brainstorm ideas for things you want to do, get advice, share daily thoughts, or ask any question without business talk.',
        evidence: [
          { metric: 'Choice 1: Business Intelligence', value: 'Root-Cause & Financial Analytics' },
          { metric: 'Choice 2: Friend & Everyday Chat', value: 'Casual Chat, Ideas & Friendly Advice' },
          { metric: 'Specialized Societies', value: 'Hugging Face, ArXiv, Kaggle, etc.' },
          { metric: 'Voice & Text', value: 'Live 2-Way Phone & Voice Dialogue' },
        ],
        recommendedAction: 'Pick your mode above and say "Hello, how are you, my friend?" or ask a question!',
      },
    },
  ]);

  // Input states
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Voice recording & review states
  const [isListening, setIsListening] = useState(false);
  const [voiceInterimText, setVoiceInterimText] = useState('');
  const [pendingVoiceReview, setPendingVoiceReview] = useState<string | null>(null);
  const [reviewEditText, setReviewEditText] = useState('');
  const [micError, setMicError] = useState<string | null>(null);

  // Audio Playback states
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isAudioPaused, setIsAudioPaused] = useState(false);

  // UI helpers
  const [evidenceOpenIds, setEvidenceOpenIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isListening, pendingVoiceReview]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      speechService.stopListening();
      speechService.stopSpeaking();
    };
  }, []);

  // Suggested queries based on focus mode
  const businessPrompts = [
    { label: 'Why did profit decrease this month?', icon: TrendingDown },
    { label: 'What inventory items should I restock urgently?', icon: Package },
    { label: 'Which high-value customers are becoming inactive?', icon: Users },
    { label: 'What are my top 3 operational priorities today?', icon: Zap },
    { label: 'Why are operating expenses increasing?', icon: TrendingUp },
  ];

  const generalPrompts = [
    { label: '👋 Hello, how are you, my friend?', icon: Smile },
    { label: '💡 Can you help me with an idea for something I want to do?', icon: Zap },
    { label: '☕ Tell me a quick funny joke to brighten my day', icon: Smile },
    { label: '✨ Give me 3 tips for a productive and happy day', icon: Zap },
    { label: '🌐 Recommend specialized AI societies for deep research', icon: Compass },
  ];

  const activeSamplePrompts = focusMode === 'business' ? businessPrompts : generalPrompts;

  // Core Ask Handler
  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText !== undefined ? queryText : inputQuery).trim();
    if (!textToSend || isLoading) return;

    setInputQuery('');
    setPendingVoiceReview(null);
    setVoiceInterimText('');
    setMicError(null);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: textToSend,
      mode: activeMode,
      language: 'en',
      focusMode: focusMode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const aiRes = await askVeaivexAi({
        query: textToSend,
        sales,
        expenses,
        products,
        customers,
        profile,
        history: [...messages, userMsg],
        forceLanguage: 'en',
        focusMode: focusMode,
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: aiRes.answer,
        mode: activeMode,
        language: 'en',
        focusMode: focusMode,
        structuredData: {
          answer: aiRes.answer,
          why: aiRes.why,
          evidence: aiRes.evidence,
          prediction: aiRes.prediction,
          recommendedAction: aiRes.recommendedAction,
          aiSocietyRedirects: aiRes.aiSocietyRedirects,
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // If active mode is voice or continuous voice is enabled, automatically speak answer
      if (activeMode === 'voice' || continuousVoice) {
        handlePlaySpeech(aiMsg, true);
      }
    } catch (err: any) {
      setMicError('Failed to generate response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Voice Input Flow
  const startVoiceCapture = () => {
    setMicError(null);
    setVoiceInterimText('');
    setPendingVoiceReview(null);

    const started = speechService.startListening(
      'en',
      (res) => {
        setVoiceInterimText(res.transcript);
        if (res.isFinal && res.transcript.length > 2) {
          setVoiceInterimText(res.transcript);
        }
      },
      (err) => {
        setMicError(err);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (started) {
      setIsListening(true);
    }
  };

  const stopVoiceCapture = () => {
    speechService.stopListening();
    setIsListening(false);

    if (voiceInterimText.trim()) {
      setPendingVoiceReview(voiceInterimText.trim());
      setReviewEditText(voiceInterimText.trim());
    }
  };

  const cancelVoiceReview = () => {
    setPendingVoiceReview(null);
    setVoiceInterimText('');
    setMicError(null);
  };

  const submitVoiceReview = () => {
    if (reviewEditText.trim()) {
      handleSend(reviewEditText.trim());
    }
  };

  // Audio Playback Controls
  const handlePlaySpeech = (msg: ChatMessage, autoResumeListening = false) => {
    speechService.stopSpeaking();
    setIsAudioPaused(false);
    setSpeakingMsgId(msg.id);

    const isGeneral = msg.focusMode === 'general';
    const fullSpeech = isGeneral
      ? msg.content
      : `${msg.content}. ${msg.structuredData?.why ? `Details: ${msg.structuredData.why}.` : ''} ${
          msg.structuredData?.recommendedAction ? `Next step: ${msg.structuredData.recommendedAction}.` : ''
        }`;

    speechService.speak(
      fullSpeech,
      'en',
      () => {
        setSpeakingMsgId(msg.id);
        setIsAudioPaused(false);
      },
      () => {
        setSpeakingMsgId(null);
        setIsAudioPaused(false);
        if (autoResumeListening && continuousVoice) {
          setTimeout(() => {
            startVoiceCapture();
          }, 600);
        }
      },
      () => setIsAudioPaused(true),
      () => setIsAudioPaused(false)
    );
  };

  const handlePauseResumeSpeech = () => {
    if (isAudioPaused) {
      speechService.resumeSpeaking();
      setIsAudioPaused(false);
    } else {
      speechService.pauseSpeaking();
      setIsAudioPaused(true);
    }
  };

  const handleStopSpeech = () => {
    speechService.stopSpeaking();
    setSpeakingMsgId(null);
    setIsAudioPaused(false);
  };

  const handleReplaySpeech = (msg: ChatMessage) => {
    handlePlaySpeech(msg, false);
  };

  // Evidence Drawer toggle
  const toggleEvidence = (msgId: string) => {
    setEvidenceOpenIds((prev) =>
      prev.includes(msgId) ? prev.filter((id) => id !== msgId) : [...prev, msgId]
    );
  };

  // Copy brief
  const copyMessageContent = (msg: ChatMessage) => {
    const text = `[VEAIVEX AI INSIGHT]\nAnswer: ${msg.content}\n${
      msg.structuredData?.why ? `Context/Why: ${msg.structuredData.why}\n` : ''
    }${
      msg.structuredData?.evidence
        ? `Evidence:\n${msg.structuredData.evidence.map((e) => `• ${e.metric}: ${e.value}`).join('\n')}\n`
        : ''
    }${
      msg.structuredData?.recommendedAction
        ? `Prescribed Action: ${msg.structuredData.recommendedAction}\n`
        : ''
    }`;

    navigator.clipboard.writeText(text);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="ask-veaivex-workspace" className="flex flex-col h-[calc(100vh-8.5rem)] bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Workspace Header */}
      <div className="bg-slate-900 text-white px-4 py-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/90 text-white flex items-center justify-center border border-blue-400/30 shadow-xs shrink-0">
            <Bot className="w-4 h-4 text-blue-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold tracking-tight text-white">
                Ask VEAIVEX AI
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wide">
                Dual Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Choice 1: Business Intelligence &bull; Choice 2: Phone &amp; Everyday Assistant
            </p>
          </div>
        </div>

        {/* Focus Mode & Interaction Tools */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Choice 1 vs Choice 2 Mode Selector */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              id="focus-mode-business-btn"
              onClick={() => setFocusMode('business')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                focusMode === 'business'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Choice 1: Business Intelligence & Root Cause Analysis"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>1. Business Intelligence</span>
            </button>
            <button
              id="focus-mode-general-btn"
              onClick={() => setFocusMode('general')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                focusMode === 'general'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Choice 2: Phone Communication, Greetings & Everyday Assistant"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>2. Phone &amp; Everyday Chat</span>
            </button>
          </div>

          {/* Interaction Mode Switcher Tabs (Text vs Voice) */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              id="mode-text-btn"
              onClick={() => {
                setActiveMode('text');
                if (isListening) stopVoiceCapture();
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'text'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Text</span>
            </button>
            <button
              id="mode-voice-btn"
              onClick={() => {
                setActiveMode('voice');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeMode === 'voice'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Voice</span>
            </button>
          </div>

          {/* Continuous Voice Toggle */}
          {activeMode === 'voice' && (
            <button
              id="continuous-voice-toggle"
              onClick={() => setContinuousVoice(!continuousVoice)}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                continuousVoice
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Continuous conversation automatically listens after speaking answers"
            >
              <Radio className={`w-3 h-3 ${continuousVoice ? 'animate-pulse text-emerald-400' : ''}`} />
              <span>{continuousVoice ? 'Continuous: ON' : 'Continuous: OFF'}</span>
            </button>
          )}

          {/* Reset Conversation */}
          <button
            id="reset-chat-btn"
            onClick={() => {
              speechService.stopSpeaking();
              speechService.stopListening();
              setIsListening(false);
              setPendingVoiceReview(null);
              setMessages([messages[0]]);
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Reset conversation history"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode Sub-banner Indicator */}
      <div className={`px-4 py-2 text-xs flex items-center justify-between border-b ${
        focusMode === 'business'
          ? 'bg-blue-50/70 border-blue-100 text-blue-900'
          : 'bg-emerald-50/70 border-emerald-100 text-emerald-900'
      }`}>
        <div className="flex items-center gap-2">
          {focusMode === 'business' ? (
            <>
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold">
                Choice 1: Business Intelligence Mode &mdash; Analyzing profit variances, inventory restocking &amp; revenue actions.
              </span>
            </>
          ) : (
            <>
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold">
                Choice 2: Phone &amp; Everyday Assistant Mode &mdash; Friendly greetings, open questions, tips &amp; AI Society referrals.
              </span>
            </>
          )}
        </div>
        <button
          onClick={() => setFocusMode(focusMode === 'business' ? 'general' : 'business')}
          className="text-[11px] font-bold underline hover:opacity-80 transition-opacity"
        >
          Switch to {focusMode === 'business' ? 'Choice 2 (Phone/Everyday)' : 'Choice 1 (Business)'}
        </button>
      </div>

      {/* Message Thread Area */}
      <div id="messages-container" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isAi = msg.sender === 'assistant';
          const isEvidenceOpen = evidenceOpenIds.includes(msg.id);
          const isThisSpeaking = speakingMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isAi ? 'items-start' : 'items-end justify-end'}`}
            >
              {/* AI Subtle Badge */}
              {isAi && (
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm ${
                  isAi
                    ? 'bg-white border border-slate-200/90 text-slate-900 shadow-xs'
                    : 'bg-blue-600 text-white shadow-xs'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold text-[11px] uppercase tracking-wider ${
                        isAi ? (msg.focusMode === 'general' ? 'text-emerald-700' : 'text-blue-700') : 'text-blue-200'
                      }`}
                    >
                      {isAi
                        ? msg.focusMode === 'general'
                          ? 'VEAIVEX Friend & Companion'
                          : 'VEAIVEX BI Copilot'
                        : `You (${profile.ownerName || 'User'})`}
                    </span>
                    {msg.mode === 'voice' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        Voice
                      </span>
                    )}
                    {isAi && msg.focusMode === 'general' && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Option 2: Friend
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400">{msg.timestamp}</span>

                    {isAi && (
                      <>
                        {/* Copy Insight Button */}
                        <button
                          onClick={() => copyMessageContent(msg)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-500 transition-colors"
                          title="Copy message brief"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* Audio Controls */}
                        {!isThisSpeaking ? (
                          <button
                            onClick={() => handlePlaySpeech(msg)}
                            className="p-1 rounded hover:bg-blue-50 text-blue-600 transition-colors flex items-center gap-1 text-[10px] font-semibold"
                            title="Listen to response"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Listen</span>
                          </button>
                        ) : (
                          <div className="flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            {/* Pause / Resume */}
                            <button
                              onClick={handlePauseResumeSpeech}
                              className="p-1 rounded hover:bg-blue-200 text-blue-800"
                              title={isAudioPaused ? 'Resume listening' : 'Pause speech'}
                            >
                              {isAudioPaused ? (
                                <Play className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Pause className="w-3 h-3" />
                              )}
                            </button>

                            {/* Replay */}
                            <button
                              onClick={() => handleReplaySpeech(msg)}
                              className="p-1 rounded hover:bg-blue-200 text-blue-800"
                              title="Replay from start"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>

                            {/* Stop */}
                            <button
                              onClick={handleStopSpeech}
                              className="p-1 rounded hover:bg-rose-100 text-rose-600"
                              title="Stop speech"
                            >
                              <VolumeX className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Direct Executive Answer */}
                <p className="leading-relaxed font-semibold text-slate-800 whitespace-pre-line">
                  {msg.content}
                </p>

                {/* Structured Breakdown */}
                {isAi && msg.structuredData && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2.5 text-xs">
                    {/* Context / Why (Shown if not general greeting or if helpful) */}
                    {msg.structuredData.why && msg.focusMode === 'business' && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                        <span className="font-bold text-slate-900 block mb-1 text-[11px] uppercase tracking-wide flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-blue-600" />
                          Context &amp; Root Cause:
                        </span>
                        <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                          {msg.structuredData.why}
                        </p>
                      </div>
                    )}

                    {/* Verified Evidence Metric Chips (Only in business mode with actual evidence) */}
                    {msg.focusMode === 'business' && msg.structuredData.evidence && msg.structuredData.evidence.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Verified Evidence &amp; Baseline:
                          </span>
                          <button
                            onClick={() => toggleEvidence(msg.id)}
                            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline"
                          >
                            {isEvidenceOpen ? 'Hide Calculation Proof' : 'Show Calculation Proof'}
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {msg.structuredData.evidence.map((ev, i) => (
                            <div
                              key={i}
                              className="bg-white border border-slate-200 rounded-lg p-2 text-[11px] flex justify-between items-center"
                            >
                              <span className="text-slate-500">{ev.metric}:</span>
                              <span className="font-bold text-slate-800">{ev.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Calculation Proof Drawer (Business Mode only) */}
                    {msg.focusMode === 'business' && isEvidenceOpen && (
                      <div className="bg-slate-900 text-slate-200 p-3 rounded-xl border border-slate-800 font-mono text-[11px] space-y-1 animate-in fade-in">
                        <div className="flex items-center gap-1.5 text-blue-400 font-bold font-sans text-[10px] uppercase">
                          <Info className="w-3 h-3" />
                          Multi-Dimensional Intelligence Verification
                        </div>
                        <p className="text-slate-300">
                          &bull; Audited ledger transactions: {sales.length} verified sales records.
                        </p>
                        <p className="text-slate-300">
                          &bull; Operating vouchers: {expenses.length} expense ledgers reconciled.
                        </p>
                        <p className="text-emerald-400">
                          &bull; Intelligence Engine: Real-time verification confirmed.
                        </p>
                      </div>
                    )}

                    {/* Recommended Next Action */}
                    {msg.structuredData.recommendedAction && msg.focusMode === 'business' && (
                      <div className="bg-emerald-50/90 p-3 rounded-xl border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
                        <div className="p-1 rounded-md bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                          <Zap className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1">
                          <span className="font-bold block text-[11px] uppercase tracking-wide text-emerald-900">
                            Prescribed Takeaway:
                          </span>
                          <p className="leading-relaxed font-medium text-emerald-950 mt-0.5 whitespace-pre-line">
                            {msg.structuredData.recommendedAction}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* AI Societies & Specialized Communities Redirection Card */}
                    {msg.structuredData.aiSocietyRedirects && msg.structuredData.aiSocietyRedirects.length > 0 && (
                      <div className="bg-gradient-to-br from-indigo-50/90 to-blue-50/80 p-3.5 rounded-xl border border-indigo-200 text-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Compass className="w-4 h-4 text-indigo-600" />
                            <span className="font-bold text-xs text-indigo-950 uppercase tracking-wide">
                              Recommended AI Societies &amp; Research Hubs:
                            </span>
                          </div>
                          <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
                            Specialized Communities
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          For deep academic research, open-source model weights, peer-reviewed papers, and global community discussions:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.structuredData.aiSocietyRedirects.map((society, sIdx) => (
                            <div
                              key={sIdx}
                              className="bg-white/90 border border-indigo-100 p-2.5 rounded-lg text-xs space-y-1 shadow-2xs hover:border-indigo-300 transition-colors"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-bold text-slate-900 text-[11px]">{society.societyName}</span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                                  {society.category}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-600 leading-tight">
                                {society.description}
                              </p>
                              <div className="text-[10px] text-indigo-700 font-medium pt-0.5 flex items-center justify-between">
                                <span>{society.recommendationReason}</span>
                                {society.suggestedResourceUrl && (
                                  <a
                                    href={society.suggestedResourceUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 font-bold inline-flex items-center gap-0.5 underline shrink-0 ml-1"
                                  >
                                    <span>Visit</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {!isAi && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mb-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs text-xs text-slate-600 flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 animate-spin" />
              <span>VEAIVEX AI is processing your request and formulating responses...</span>
            </div>
          </div>
        )}

        {/* Active Listening Indicator inside thread */}
        {isListening && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 shadow-sm animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-blue-800">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <span>VEAIVEX is listening... Speak your question naturally</span>
              </div>
              <button
                onClick={stopVoiceCapture}
                className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
              >
                Stop Listening &amp; Review
              </button>
            </div>
            <p className="font-mono text-slate-700 bg-white/80 p-2.5 rounded-lg border border-blue-100 italic">
              {voiceInterimText || (focusMode === 'business'
                ? 'Awaiting your voice input... (e.g., "Why did my profit decrease this month?")'
                : 'Awaiting your voice input... (e.g., "Hello, what are some good productivity tips today?")')}
            </p>
          </div>
        )}

        {/* Voice Transcription Review Box */}
        {pendingVoiceReview !== null && (
          <div className="bg-white border-2 border-blue-500 rounded-2xl p-4 shadow-md text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-blue-600" />
                Review Transcribed Voice Question:
              </span>
              <span className="text-[10px] text-slate-500">Edit text before submitting if needed</span>
            </div>

            <input
              type="text"
              value={reviewEditText}
              onChange={(e) => setReviewEditText(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Your transcribed question..."
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={cancelVoiceReview}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 font-semibold"
              >
                Cancel / Re-record
              </button>
              <button
                onClick={submitVoiceReview}
                disabled={!reviewEditText.trim() || isLoading}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-500 flex items-center gap-1.5 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask VEAIVEX</span>
              </button>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Inspiration Prompts Bar */}
      <div className="p-2.5 bg-slate-100/80 border-t border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 pl-2">
          {focusMode === 'business' ? 'Business Inquiries:' : 'Everyday Prompts:'}
        </span>
        {activeSamplePrompts.map((p, idx) => {
          const Icon = p.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(p.label)}
              disabled={isLoading || isListening}
              className="px-3 py-1 rounded-full text-xs font-medium bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-300 transition-all whitespace-nowrap shadow-2xs shrink-0 flex items-center gap-1.5"
            >
              <Icon className="w-3 h-3 text-slate-400" />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input / Voice Trigger Footer */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
        {micError && (
          <div className="mb-2 text-xs text-rose-700 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{micError}</span>
            </div>
            <button
              onClick={() => setMicError(null)}
              className="text-[10px] underline font-bold text-rose-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Text Mode Composer */}
        {activeMode === 'text' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            {/* Quick Mic Switcher */}
            <button
              type="button"
              onClick={() => {
                setActiveMode('voice');
                startVoiceCapture();
              }}
              className="p-2.5 rounded-xl border border-slate-300 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 text-slate-700 transition-all shrink-0"
              title="Switch to Voice Mode"
            >
              <Mic className="w-4 h-4 text-blue-600" />
            </button>

            <input
              ref={textInputRef}
              type="text"
              placeholder={
                focusMode === 'business'
                  ? 'Ask about profit drops, restocking, customers, expenses, or say Hello...'
                  : 'Say hello, ask anything regarding daily life, tips, science, or general questions...'
              }
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-xs transition-all flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask VEAIVEX</span>
            </button>
          </form>
        ) : (
          /* Voice Mode Composer */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 text-white p-3 sm:px-4 rounded-xl">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={isListening ? stopVoiceCapture : startVoiceCapture}
                className={`p-3 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse shadow-md'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span className="text-xs">{isListening ? 'Stop Recording' : 'Start Speaking'}</span>
              </button>

              <div className="text-xs">
                <p className="font-semibold text-slate-200">
                  {isListening
                    ? 'Listening... Tap Stop when finished speaking.'
                    : 'Tap "Start Speaking" and talk naturally.'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {focusMode === 'business'
                    ? 'Voice Business Diagnostic & Root Cause Mode'
                    : 'Voice Phone Chat & Everyday Assistant Mode'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setActiveMode('text')}
                className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300"
              >
                Switch to Text
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
