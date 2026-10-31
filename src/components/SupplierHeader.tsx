import React from 'react';
import { Language, SupplierScreenType, SupplierProfile } from '../types';
import { translations } from '../i18n';
import { ArrowLeft, Sparkles, ShieldCheck, Truck } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  currentScreen: SupplierScreenType;
  onBack: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  screenTitle?: string;
  profile?: SupplierProfile;
  onOpenAI?: () => void;
}

export const SupplierHeader: React.FC<Props> = ({
  currentScreen,
  onBack,
  lang,
  onLanguageChange,
  screenTitle,
  profile,
  onOpenAI
}) => {
  const t = translations[lang];
  const showBack = currentScreen === 'order_detail' || currentScreen === 'supplier_result';

  const defaultTitle = profile?.companyName || profile?.name || (lang === 'uz' ? 'Ulgurji Baza' : lang === 'ru' ? 'Оптовая База' : 'Wholesale Supplier');
  const defaultLocation = profile?.marketLocation || (lang === 'uz' ? "O'rikzor 4-blok" : lang === 'ru' ? "Урикзор 4-блок" : "O'rikzor Block 4");

  return (
    <header className="sticky top-0 z-40 bg-[#0A1714] text-white px-4 py-3 shadow-md border-b border-gold-highlight/30">
      <div className="flex items-center justify-between gap-2 max-w-[390px] mx-auto">
        <div className="flex items-center gap-2">
          {showBack ? (
            <button
              onClick={() => {
                triggerHaptic('light');
                onBack();
              }}
              aria-label="Back"
              className="min-h-[44px] min-w-[44px] -ml-2 flex items-center justify-center rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors text-gold-highlight"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-gold-highlight text-[#0A1714] font-serif font-black flex items-center justify-center text-lg shadow-sm">
                <Truck className="w-5 h-5" />
              </span>
            </div>
          )}

          <div>
            <h1 className="font-serif font-bold text-base leading-tight tracking-wide flex items-center gap-1.5 text-white">
              {screenTitle ? screenTitle : defaultTitle}
              {!screenTitle && (
                <span className="inline-flex items-center gap-0.5 text-[9px] uppercase font-sans tracking-wider bg-gold-highlight/20 text-gold-highlight px-1.5 py-0.5 rounded font-bold border border-gold-highlight/40">
                  <ShieldCheck className="w-3 h-3 text-gold-highlight" />
                  <span>Verified</span>
                </span>
              )}
            </h1>
            <p className="text-[11px] text-[#A6B8B4] leading-none">
              {defaultLocation} • {t.header.supplierSubtitle}
            </p>
          </div>
        </div>

        {/* AI Copilot & Language switcher */}
        <div className="flex items-center gap-1.5">
          {onOpenAI && (
            <button
              onClick={() => {
                triggerHaptic('medium');
                onOpenAI();
              }}
              title="Bozorchi AI Maslahatchi"
              className="min-h-[36px] px-2 rounded-lg bg-gold-highlight text-[#0A1714] font-bold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 fill-[#0A1714]" />
              <span className="text-[11px] font-black">AI</span>
            </button>
          )}

          <div className="flex items-center bg-[#172622] p-0.5 rounded-lg border border-white/10 text-xs">
            {(['uz', 'ru', 'en'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => {
                  triggerHaptic('light');
                  onLanguageChange(l);
                }}
                className={`min-h-[34px] min-w-[34px] px-1.5 rounded uppercase font-bold text-[11px] transition-all flex items-center justify-center ${
                  lang === l
                    ? 'bg-gold-highlight text-[#0A1714] shadow-xs'
                    : 'text-white/70 hover:text-white'
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
