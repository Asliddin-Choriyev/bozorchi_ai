import React from 'react';
import { Language, ScreenType } from '../types';
import { translations } from '../i18n';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  currentScreen: ScreenType;
  onBack: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  screenTitle?: string;
  isTelegram: boolean;
  onOpenAI?: () => void;
}

export const Header: React.FC<Props> = ({
  currentScreen,
  onBack,
  lang,
  onLanguageChange,
  screenTitle,
  isTelegram,
  onOpenAI
}) => {
  const t = translations[lang];
  const showBack = currentScreen !== 'price_board' && currentScreen !== 'profile' && currentScreen !== 'alerts' && currentScreen !== 'group_order';

  return (
    <header className="sticky top-0 z-40 bg-[#0B6B62] text-white px-4 py-3 shadow-md">
      <div className="flex items-center justify-between gap-2 max-w-[390px] mx-auto">
        <div className="flex items-center gap-2">
          {showBack ? (
            <button
              onClick={() => {
                triggerHaptic('light');
                onBack();
              }}
              aria-label="Back"
              className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#E3B341] text-[#0A1714] font-serif font-black flex items-center justify-center text-lg shadow-sm">
                B
              </span>
            </div>
          )}

          <div>
            <h1 className="font-serif font-bold text-base leading-tight tracking-wide flex items-center gap-1.5">
              {screenTitle ? screenTitle : 'Bozorchi AI'}
              {!screenTitle && (
                <span className="text-[10px] uppercase font-sans tracking-wider bg-[#E3B341]/20 text-[#E3B341] px-1.5 py-0.5 rounded font-bold border border-[#E3B341]/40">
                  Tashkent
                </span>
              )}
            </h1>
            <p className="text-[11px] text-[#D1E7E3] leading-none">
              {screenTitle ? t.header.shopClusterSubtitle : t.header.shopDefaultSubtitle}
            </p>
          </div>
        </div>

        {/* Bozorchi AI Button & Language switcher */}
        <div className="flex items-center gap-1.5">
          {onOpenAI && (
            <button
              onClick={() => {
                triggerHaptic('medium');
                onOpenAI();
              }}
              title="Bozorchi AI Maslahatchi"
              className="min-h-[36px] px-2 rounded-lg bg-[#E3B341] text-[#0A1714] font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 fill-[#0A1714]" />
              <span className="hidden xs:inline">AI</span>
            </button>
          )}

          <div className="flex items-center bg-[#08534C] p-0.5 rounded-lg border border-white/10 text-xs">
            {(['uz', 'ru', 'en'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => {
                  triggerHaptic('light');
                  onLanguageChange(l);
                }}
                className={`min-h-[36px] min-w-[36px] px-1.5 rounded uppercase font-bold text-[11px] transition-all flex items-center justify-center ${
                  lang === l
                    ? 'bg-[#E3B341] text-[#0A1714] shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {l === 'uz' ? "O'z" : l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
