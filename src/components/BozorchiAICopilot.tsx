import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../i18n';
import { askBozorchiAI, hasActiveAIKey } from '../utils/ai';
import { Bot, Send, Sparkles, X, MessageSquare, Zap } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  userName?: string;
}

export const BozorchiAICopilot: React.FC<Props> = ({ isOpen, onClose, lang, userName }) => {
  const t = translations[lang];
  const [messages, setMessages] = useState<
    { sender: 'user' | 'ai'; text: string; time: string }[]
  >([
    {
      sender: 'ai',
      text:
        lang === 'uz'
          ? `Assalomu alaykum${userName ? `, ${userName}` : ''}! Men Bozorchi AI — Toshkent ulgurji bozorlari bo'yicha shaxsiy maslahatchingizman. Qaysi mahsulot yoki bozor narxi haqida bilmoqchisiz?`
          : lang === 'ru'
          ? `Здравствуйте${userName ? `, ${userName}` : ''}! Я Bozorchi AI — ваш оптовый ассистент по рынкам Ташкента. Спросите меня о ценах на сахар, муку или пуле Чиланзар-9!`
          : `Hello${userName ? `, ${userName}` : ''}! I am Bozorchi AI, your Tashkent wholesale advisor. Ask me anything about bazaar trends, sugar prices, or the Chilonzor-9 pool!`,
      time: '12:00',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const isLiveKey = hasActiveAIKey();

  const quickPrompts = [
    {
      label: lang === 'uz' ? 'Shakar narxi tushadimi?' : lang === 'ru' ? 'Сахар подешевеет?' : 'Will sugar drop?',
      query: 'Shakar narxi oxirgi kunlarda tushmoqdami, hozir xarid qilish foydalimi?',
    },
    {
      label: lang === 'uz' ? 'Chilonzor-9 tejamkorligi' : lang === 'ru' ? 'Экономия пула' : 'Pool savings',
      query: 'Chilonzor-9 guruh xaridi orqali qancha pul va vaqt tejash mumkin?',
    },
    {
      label: lang === 'uz' ? 'Ta\'minotchiga xabar loyihasi' : lang === 'ru' ? 'Шаблон заказа' : 'Draft order message',
      query: 'Chorsu Optom ta\'minotchisiga 500 kg shakar uchun Telegramda buyurtma xati yozib ber.',
    },
  ];

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q || loading) return;

    triggerHaptic('light');
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: q, time: now }]);
    setInput('');
    setLoading(true);

    try {
      const response = await askBozorchiAI(q, lang);
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [...prev, { sender: 'ai', text: response, time: replyTime }]);
      triggerHaptic('success');
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: t.copilot.error,
          time: now,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0 md:p-4 animate-fadeIn">
      <div className="w-full max-w-[390px] bg-[#FAF7F0] rounded-t-3xl md:rounded-2xl flex flex-col max-h-[85vh] shadow-float border border-[#DFD3BA]">
        {/* Header */}
        <div className="bg-[#0B6B62] text-white px-4 py-3 rounded-t-3xl md:rounded-t-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gold-highlight text-ink flex items-center justify-center font-bold shadow-xs">
              <Bot className="w-5 h-5 text-ink" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-bold text-sm">Bozorchi AI Copilot</h3>
                <span className="text-[9px] bg-white/20 text-[#E3B341] font-bold px-1.5 py-0.2 rounded">
                  {isLiveKey ? 'ChatGPT Live' : 'AI Assistant'}
                </span>
              </div>
              <p className="text-[10px] text-[#CFEBE6]">{t.copilot.subtitle}</p>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 shadow-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-teal-action text-white rounded-tr-xs'
                    : 'bg-white text-ink border border-[#E7DFC8] rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <span
                  className={`text-[9px] block mt-1 text-right ${
                    m.sender === 'user' ? 'text-white/70' : 'text-ink-muted'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-ink-muted text-xs p-2 bg-white/80 rounded-xl border border-[#E7DFC8] w-fit">
              <div className="w-2 h-2 rounded-full bg-teal-action animate-ping"></div>
              <span>{t.copilot.analyzing}</span>
            </div>
          )}
        </div>

        {/* Quick prompt suggestions */}
        <div className="px-3 py-1.5 flex gap-1.5 overflow-x-auto scrollbar-none no-scrollbar border-t border-[#EAE1CE] bg-[#F4EFE4]">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p.query)}
              disabled={loading}
              className="min-h-[36px] px-2.5 py-1 bg-white hover:bg-[#F9F5EC] text-teal-action font-semibold text-[11px] rounded-lg border border-[#DDD3BC] whitespace-nowrap shrink-0 flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
            >
              <Sparkles className="w-3 h-3 text-gold-highlight fill-gold-highlight" />
              <span>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-[#E7DFC8] flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={t.copilot.placeholder}
            className="flex-1 min-h-[44px] px-3 bg-[#FAF7F0] border border-[#DDD3BD] rounded-xl text-xs text-ink placeholder-ink-muted focus:outline-none focus:ring-2 focus:ring-teal-action/40"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            aria-label="Send"
            className="min-h-[44px] min-w-[44px] bg-teal-action hover:bg-teal-hover disabled:opacity-50 text-white rounded-xl flex items-center justify-center shadow-xs active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
