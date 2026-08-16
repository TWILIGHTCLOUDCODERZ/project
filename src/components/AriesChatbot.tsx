import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { X, Send, Zap, Globe, ChevronDown, Mic, MicOff, Volume2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAriesCustomer } from '../data/ariesCustomers';
import type { Language } from '../data/ariesCustomers';
import { generateAriesResponse, getWelcomeMessage, type AriesResponse, type AriesCard } from '../lib/ariesEngine';

interface Props {
  onClose: () => void;
}

interface ChatMessage {
  role: 'user' | 'aries';
  text: string;
  cards?: AriesCard[];
}

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'zh', label: 'Chinese', native: '中文' },
  { code: 'ms', label: 'Malay', native: 'Bahasa Melayu' },
];

const SPEECH_LANG: Record<Language, string> = {
  en: 'en-US',
  zh: 'zh-CN',
  ms: 'ms-MY',
};

export default function AriesChatbot({ onClose }: Props) {
  const { user } = useAuth();
  const customer = getAriesCustomer(user?.email);
  const [language, setLanguage] = useState<Language>(customer?.preferredLanguage ?? 'en');
  const [langOpen, setLangOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check speech recognition support
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      setSpeechSupported(true);
    }
  }, []);

  // Initialize greeting
  useEffect(() => {
    setMessages([{ role: 'aries', text: getWelcomeMessage(language, customer) }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-greet when language changes — update the first message if it's the only one (greeting)
  const handleLanguageChange = useCallback((newLang: Language) => {
    setLanguage(newLang);
    setLangOpen(false);
    // If only the greeting message exists, replace it in the new language
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === 'aries') {
        return [{ role: 'aries', text: getWelcomeMessage(newLang, customer) }];
      }
      return prev;
    });
  }, [customer]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  // Speak response using Web Speech API
  const speak = useCallback((text: string, lang: Language) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LANG[lang];
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* noop */ }
      }
    };
  }, []);

  const handleSend = (overrideText?: string) => {
    const trimmed = (overrideText ?? input).trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response: AriesResponse = generateAriesResponse(trimmed, language, customer);
      setMessages((prev) => [
        ...prev,
        { role: 'aries', text: response.text, cards: response.cards },
      ]);
      setIsTyping(false);
      speak(response.text, language);
    }, 700 + Math.random() * 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Voice input
  const toggleListening = () => {
    if (!speechSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = SPEECH_LANG[language];
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Auto-send after recognition
      setTimeout(() => handleSend(transcript), 300);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const quickPrompts: Record<Language, string[]> = {
    en: ['Track my order', 'Recommend products', 'Help'],
    zh: ['追踪我的订单', '推荐产品', '帮助'],
    ms: ['Jejak pesanan saya', 'Cadang produk', 'Bantuan'],
  };

  const placeholder: Record<Language, string> = {
    en: 'Type or speak a message...',
    zh: '输入或说出消息...',
    ms: 'Taip atau cakap mesej...',
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm sm:p-4">
      <div className="relative w-full sm:max-w-md h-[100dvh] sm:h-[620px] sm:max-h-[85vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-blue-200">

        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-5 py-4 flex items-center justify-between shrink-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_20%_50%,rgba(255,255,255,0.08),transparent)]" />
          <div className="relative flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base leading-tight flex items-center gap-1.5">
                Aries
                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold tracking-wider uppercase text-blue-200 bg-blue-500/40 px-1.5 py-0.5 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
                  AI
                </span>
              </h3>
              <p className="text-[11px] text-blue-200 leading-tight">
                {customer ? `${customer.name} • ` : ''}
                {LANGUAGES.find((l) => l.code === language)?.native}
                {voiceEnabled && <span className="ml-1.5 inline-flex items-center gap-0.5"><Volume2 className="w-2.5 h-2.5" />Voice</span>}
              </p>
            </div>
          </div>
          <div className="relative flex items-center gap-2">
            {/* Voice toggle */}
            <button
              onClick={() => {
                setVoiceEnabled(!voiceEnabled);
                if (voiceEnabled && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                voiceEnabled ? 'bg-white/20 text-white' : 'bg-white/10 text-white/50'
              }`}
              title={voiceEnabled ? 'Voice output on' : 'Voice output off'}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            {/* Language selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{LANGUAGES.find((l) => l.code === language)?.native}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-40 bg-white rounded-lg shadow-xl border border-neutral-200 overflow-hidden z-10">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors ${
                        language === lang.code
                          ? 'bg-blue-50 text-blue-700 font-semibold'
                          : 'text-neutral-700 hover:bg-neutral-50'
                      }`}
                    >
                      {lang.native}
                      {language === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-gradient-to-b from-blue-50/30 to-white">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {msg.role === 'aries' && (
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Zap className="w-3.5 h-3.5 text-white fill-white" />
                  </div>
                )}
                <div>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-md'
                        : 'bg-white text-neutral-800 border border-blue-100 rounded-tl-md shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.cards && msg.cards.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {msg.cards.map((card, ci) => {
                        const link = card.productId ? `/product/${card.productId}` : '/women';
                        return (
                          <Link
                            key={ci}
                            to={link}
                            className="flex items-center gap-2 px-3 py-2.5 bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg text-xs text-neutral-700 transition-colors group"
                          >
                            <div className="w-7 h-7 rounded bg-blue-100 flex items-center justify-center shrink-0">
                              <span className="text-blue-600 font-bold text-[10px]">{ci + 1}</span>
                            </div>
                            <span className="font-medium flex-1">{card.name}</span>
                            <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold">View →</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Zap className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <div className="px-4 py-3 bg-white border border-blue-100 rounded-2xl rounded-tl-md shadow-sm">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick prompts */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
            {quickPrompts[language].map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 rounded-full text-xs font-medium text-blue-700 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-3 border-t border-neutral-100 bg-white shrink-0">
          <div className="flex items-center gap-2">
            {speechSupported && (
              <button
                onClick={toggleListening}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all shrink-0 ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
                title={isListening ? 'Stop listening' : 'Speak'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? (language === 'zh' ? '正在聆听...' : language === 'ms' ? 'Mendengar...' : 'Listening...') : placeholder[language]}
              className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isListening}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
