import { Language } from '../types';

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isPaused: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis || null;
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
      }
    }
  }

  public isVoiceInputSupported(): boolean {
    return !!this.recognition;
  }

  public isVoiceOutputSupported(): boolean {
    return !!this.synth;
  }

  public startListening(
    language: Language = 'en',
    onResult: (result: SpeechRecognitionResult) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser environment. You can type your query.');
      return false;
    }

    try {
      this.recognition.lang = 'en-US';
      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        let isFinal = false;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }

        onResult({ transcript: transcript.trim(), isFinal });
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition event error:', event.error);
        if (event.error === 'not-allowed') {
          this.isListening = false;
          onError('Microphone access was denied. Please allow microphone permission in your browser or type your question.');
        } else if (event.error === 'no-speech') {
          // Keep listening or give guidance
        } else if (event.error === 'network') {
          this.isListening = false;
          onError('Speech network connection issue. You can type your question directly.');
        } else {
          this.isListening = false;
          onError(`Speech recognition notice: ${event.error}`);
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          // If ended naturally without explicit stop, trigger onEnd
          this.isListening = false;
        }
        onEnd();
      };

      this.recognition.start();
      return true;
    } catch (e: any) {
      this.isListening = false;
      onError(e.message || 'Failed to start microphone. Please check permissions.');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      this.isListening = false;
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
  }

  public speak(
    text: string,
    language: Language = 'en',
    onStart?: () => void,
    onEnd?: () => void,
    onPause?: () => void,
    onResume?: () => void
  ): boolean {
    if (!this.synth) {
      return false;
    }

    try {
      this.synth.cancel(); // cancel any ongoing speech
      this.isPaused = false;

      // Clean markdown tags or bullets for speech
      const cleanText = text
        .replace(/[*#_`~>]/g, '')
        .replace(/\n+/g, '. ')
        .slice(0, 500); // keep concise and audible

      const utterance = new SpeechSynthesisUtterance(cleanText);
      this.currentUtterance = utterance;

      const voices = this.synth.getVoices();
      const englishVoice = voices.find(
        (v) => (v.lang.startsWith('en') || v.name.includes('Google') || v.name.includes('Natural')) && !v.name.includes('Compact')
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      if (onStart) utterance.onstart = onStart;
      if (onEnd) {
        utterance.onend = () => {
          this.isPaused = false;
          this.currentUtterance = null;
          onEnd();
        };
      }
      if (onPause) utterance.onpause = onPause;
      if (onResume) utterance.onresume = onResume;

      this.synth.speak(utterance);
      return true;
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      return false;
    }
  }

  public pauseSpeaking(): void {
    if (this.synth && this.synth.speaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  public resumeSpeaking(): void {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  public stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
      this.isPaused = false;
      this.currentUtterance = null;
    }
  }
}

export const speechService = new SpeechService();
