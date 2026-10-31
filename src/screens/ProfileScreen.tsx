import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n';
import { MOCK_USER_PROFILE } from '../data/mock';
import { formatUZS } from '../utils/format';
import { Store, ShieldCheck, Coins, Award, MapPin, Phone, HelpCircle } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const ProfileScreen: React.FC<Props> = ({ lang, onLanguageChange }) => {
  const t = translations[lang];

  return (
    <div className="space-y-4 pb-12">
      {/* Profile Card */}
      <div className="bg-cream-card rounded-card p-4 border border-[#E3D9C4] shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-teal-action text-white flex items-center justify-center font-serif font-black text-2xl shadow-sm">
            D
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#167E51] bg-[#EBF7F0] px-2 py-0.5 rounded-full border border-[#167E51]/20">
              <ShieldCheck className="w-3 h-3 text-[#167E51]" />
              <span>Tasdiqlangan baqqol</span>
            </div>
            <h2 className="font-serif font-bold text-lg text-ink leading-tight mt-1">
              {MOCK_USER_PROFILE.shopName}
            </h2>
            <p className="text-xs text-ink-muted">
              {MOCK_USER_PROFILE.ownerName}
            </p>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-[#EDE4D0] space-y-2 text-xs">
          <div className="flex items-center gap-2 text-ink-muted">
            <MapPin className="w-3.5 h-3.5 text-teal-action shrink-0" />
            <span>{MOCK_USER_PROFILE.address}</span>
          </div>
          <div className="flex items-center gap-2 text-ink-muted">
            <Phone className="w-3.5 h-3.5 text-teal-action shrink-0" />
            <span>{MOCK_USER_PROFILE.phone}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-cream-card rounded-card p-3.5 border border-[#E3D9C4] shadow-card">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-semibold">
            <Coins className="w-4 h-4 text-gold-highlight" />
            <span>BozorCoins</span>
          </div>
          <div className="text-xl font-serif font-bold text-ink mt-1">
            {formatUZS(MOCK_USER_PROFILE.bozorCoins, false)}
          </div>
          <p className="text-[10px] text-[#8C7D68] mt-0.5">Fakturalar uchun mukofot</p>
        </div>

        <div className="bg-cream-card rounded-card p-3.5 border border-[#E3D9C4] shadow-card">
          <div className="flex items-center gap-2 text-ink-muted text-xs font-semibold">
            <Award className="w-4 h-4 text-teal-action" />
            <span>Jami tejamkorlik</span>
          </div>
          <div className="text-xl font-serif font-bold text-teal-action mt-1">
            {formatUZS(MOCK_USER_PROFILE.totalSavedUZS)}
          </div>
          <p className="text-[10px] text-[#8C7D68] mt-0.5">{MOCK_USER_PROFILE.joinedPoolsCount} ta guruh xaridida</p>
        </div>
      </div>

      {/* Language Preference Card */}
      <div className="bg-cream-card rounded-card p-3.5 border border-[#E3D9C4] shadow-card">
        <h3 className="font-serif font-bold text-sm text-ink mb-2">
          Ilova tili / Язык приложения
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {(['uz', 'ru', 'en'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                triggerHaptic('light');
                onLanguageChange(l);
              }}
              className={`min-h-[44px] rounded-xl font-bold text-xs border flex items-center justify-center transition-all ${
                lang === l
                  ? 'bg-teal-action text-white border-teal-action shadow-xs'
                  : 'bg-white text-ink border-[#DCD3BE] hover:border-teal-action/40'
              }`}
            >
              {l === 'uz' ? "O'zbekcha" : l === 'ru' ? 'Русский' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* About App */}
      <div className="bg-cream-card rounded-card p-3.5 border border-[#E3D9C4] shadow-card">
        <h3 className="font-serif font-bold text-xs text-ink uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-teal-action" />
          <span>BozorNarx haqida</span>
        </h3>
        <p className="text-xs text-ink-muted leading-relaxed">
          Toshkentdagi kichik baqqollik va minimarketlar uchun ulgurji narxlar axboroti hamda mahalliy birgalikda xarid (pooling) tizimi.
        </p>
        <div className="mt-2 text-[11px] text-teal-action font-semibold">
          Lumora IT Case Competition • Tashkent 2026
        </div>
      </div>
    </div>
  );
};
