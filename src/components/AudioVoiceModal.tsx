import React, { useState, useEffect } from 'react';
import {
  SaleRecord,
  ExpenseRecord,
  ProductItem,
  CustomerRecord,
  BusinessProfile,
  Language,
  ChatFocusMode,
} from '../types';
import { askVeaivexAi } from '../lib/geminiService';
import { speechService } from '../lib/speech';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Globe,
  Bot,
  CheckCircle,
  Briefcase,
  PhoneCall,
  ExternalLink,
  Compass,
} from 'lucide-react';
import { VeaivexLogo } from './VeaivexLogo';

interface AudioVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sales: SaleRecord[];
  expenses: ExpenseRecord[];
  products: ProductItem[];
  customers: CustomerRecord[];
  profile: BusinessProfile;
  onUpdateLanguage: (lang: Language) => void;
}

export const AudioVoiceModal: React.FC<AudioVoiceModalProps> = ({
  isOpen,
  onClose,
  sales,
  expenses,
  products,
  customers,
  profile,
}) => {
  const [focusMode, setFocusMode] = useState<ChatFocusMode>('business');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Tap microphone or select a prompt to begin voice dialogue');

  useEffect(() => {
    if (!isOpen) {
      speechService.stopListening();
      speechService.stopSpeaking();
      setIsListening(false);
      setIsSpeaking(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartVoice = () => {
    speechService.stopSpeaking();
    setIsSpeaking(false);
    setAiResponse(null);
    setTranscript('');
    setStatusMessage(
      focusMode === 'business'
        ? 'Listening for your business question... Speak clearly...'
        : 'Listening for your greetings, questions, or daily chat...'
    );

    const started = speechService.startListening(
      'en',
      (result) => {
        setTranscript(result.transcript);
        if (result.isFinal) {
          speechService.stopListening();
          setIsListening(false);
          processVoiceQuery(result.transcript);
        }
      },
      (err) => {
        setStatusMessage(err);
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

  const handleStopVoice = () => {
    speechService.stopListening();
    setIsListening(false);
    if (transcript.trim()) {
      processVoiceQuery(transcript);
    } else {
      setStatusMessage('Voice input cancelled.');
    }
  };

  const processVoiceQuery = async (queryText: string) => {
    setIsLoading(true);
    setStatusMessage('Processing dialogue and analyzing response...');

    try {
      const res = await askVeaivexAi({
        query: queryText,
        sales,
        expenses,
        products,
        customers,
        profile,
        forceLanguage: 'en',
        focusMode,
      });

      setAiResponse(res);
      setIsLoading(false);
      setStatusMessage('Response complete.');

      // Auto-speak the AI answer
      setIsSpeaking(true);
      const isGeneral = focusMode === 'general';
      const textToSpeak = isGeneral
        ? res.answer
        : `${res.answer}. ${res.why ? `Details: ${res.why}.` : ''} ${res.recommendedAction ? `Next step: ${res.recommendedAction}` : ''}`;
      speechService.speak(
        textToSpeak,
        'en',
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    } catch (err: any) {
      setIsLoading(false);
      setStatusMessage('Error processing request.');
    }
  };

  const businessPrompts = [
    'Why did profit drop this month?',
    'What should I restock urgently today?',
    'Which customers have churn risk?',
    'Why are operating expenses increasing?',
  ];

  const generalPrompts = [
    '👋 Hello, how are you, my friend?',
    '💡 Can you help me with an idea for something I want to do?',
    '☕ Tell me a funny joke to brighten my day',
    '✨ Give me 3 tips for a productive day',
    '🌐 Recommend specialized AI societies for research',
  ];

  const activePrompts = focusMode === 'business' ? businessPrompts : generalPrompts;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <VeaivexLogo size="xs" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-tight text-white">
                  Voice Dialogue &amp; Decision Copilot
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase">
                  Dual Mode
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Choice 1: Business BI &bull; Choice 2: Phone Chat &amp; Q&amp;A</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setFocusMode('business')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  focusMode === 'business'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                <span className="hidden sm:inline">1. Business</span>
              </button>
              <button
                onClick={() => setFocusMode('general')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  focusMode === 'general'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <PhoneCall className="w-3 h-3" />
                <span className="hidden sm:inline">2. Phone / General</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 flex flex-col items-center justify-center text-center">
          {/* Animated Central Mic Pulsing Orb */}
          <div className="relative my-2">
            {isListening && (
              <div className="absolute -inset-4 bg-blue-500/30 rounded-full animate-ping pointer-events-none" />
            )}
            {isSpeaking && (
              <div className="absolute -inset-4 bg-emerald-500/30 rounded-full animate-ping pointer-events-none" />
            )}

            <button
              onClick={isListening ? handleStopVoice : handleStartVoice}
              className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-xl transition-all ${
                isListening
                  ? 'bg-rose-600 hover:bg-rose-500 scale-110'
                  : isSpeaking
                  ? 'bg-emerald-600 hover:bg-emerald-500'
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-600 hover:scale-105'
              }`}
            >
              {isListening ? (
                <MicOff className="w-10 h-10 animate-pulse" />
              ) : isSpeaking ? (
                <Volume2 className="w-10 h-10 animate-bounce" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          {/* Status Label */}
          <div>
            <p className="text-sm font-semibold text-slate-200">{statusMessage}</p>
            {transcript && (
              <p className="text-xs text-blue-300 font-mono mt-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 inline-block max-w-md">
                "{transcript}"
              </p>
            )}
          </div>

          {/* AI Result Card if generated */}
          {aiResponse && (
            <div className="w-full text-left bg-slate-800/90 border border-slate-700/90 rounded-2xl p-4 sm:p-5 space-y-3 animate-fadeIn text-xs">
              <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                <span className="font-bold text-blue-400 uppercase tracking-wider">
                  VEAIVEX Intelligence
                </span>
                <span className="text-[10px] text-slate-400">Audio Playback Active</span>
              </div>

              <p className="text-sm font-bold text-white leading-snug whitespace-pre-line">{aiResponse.answer}</p>

              {aiResponse.why && (
                <div className="bg-black/30 p-2.5 rounded-lg border border-white/5">
                  <strong className="text-slate-300 block mb-0.5">Context / Details:</strong>
                  <span className="text-slate-200 whitespace-pre-line">{aiResponse.why}</span>
                </div>
              )}

              {aiResponse.recommendedAction && (
                <div className="bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/30 text-emerald-200">
                  <strong className="text-emerald-300 block mb-0.5">Recommended Takeaway:</strong>
                  <span>{aiResponse.recommendedAction}</span>
                </div>
              )}

              {aiResponse.aiSocietyRedirects && aiResponse.aiSocietyRedirects.length > 0 && (
                <div className="bg-indigo-950/40 p-3 rounded-lg border border-indigo-500/30 text-slate-200 space-y-2">
                  <strong className="text-indigo-300 block flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-400" />
                    Specialized AI Societies &amp; Research Hubs:
                  </strong>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {aiResponse.aiSocietyRedirects.map((soc: any, i: number) => (
                      <div key={i} className="bg-black/40 p-2 rounded text-[11px] border border-white/5">
                        <div className="font-bold text-white flex justify-between items-center">
                          <span>{soc.societyName}</span>
                          <span className="text-[9px] text-indigo-300 font-normal">{soc.category}</span>
                        </div>
                        <p className="text-slate-300 text-[10px] mt-0.5">{soc.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Voice Prompt Buttons */}
          {!isListening && (
            <div className="space-y-2 w-full pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {focusMode === 'business' ? 'Sample Business Queries:' : 'Sample Everyday Prompts:'}
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {activePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTranscript(prompt);
                      processVoiceQuery(prompt);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 border border-slate-700 transition-all shadow-xs"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
