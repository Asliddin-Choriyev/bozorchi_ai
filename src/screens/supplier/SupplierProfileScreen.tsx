import React from 'react';
import { Language, SupplierProfile } from '../../types';
import { translations } from '../../i18n';
import { Truck, ShieldCheck, MapPin, Phone, ArrowLeftRight, HelpCircle } from 'lucide-react';
import { triggerHaptic } from '../../utils/telegram';

interface Props {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  profile: SupplierProfile;
  onSwitchRole: () => void;
}

export const SupplierProfileScreen: React.FC<Props> = ({
  lang,
  onLanguageChange,
  profile,
  onSwitchRole
}) => {
  const t = translations[lang];

  return (
    <div className="space-y-4 pb-20">
      {/* Profile Card */}
      <div className="bg-[#0A1714] text-white rounded-[14px] p-4 border border-gold-highlight/40 shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gold-highlight text-ink flex items-center justify-center font-serif font-black text-2xl shadow-sm">
            {(profile.companyName || profile.name || 'T')[0].toUpperCase()}
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-gold-highlight bg-gold-highlight/20 px-2 py-0.5 rounded-full border border-gold-highlight/40">
              <ShieldCheck className="w-3 h-3 text-gold-highlight" />
              <span>{t.supplier.dashboard.badgeVerified}</span>
            </div>
            <h2 className="font-serif font-bold text-lg text-white leading-tight mt-1">
              {profile.companyName}
            </h2>
            <p className="text-xs text-[#A6B8B4]">
              {profile.name}
            </p>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-white/10 space-y-2 text-xs text-[#C5D5D1]">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-gold-highlight shrink-0" />
            <span>{profile.marketLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5 text-gold-highlight shrink-0" />
            <span>{profile.phone}</span>
          </div>
        </div>
      </div>

      {/* Switch Role Button */}
      <div className="bg-cream-card rounded-[14px] p-3.5 border border-[#E3D9C4] shadow-card">
        <h3 className="font-serif font-bold text-xs text-ink uppercase tracking-wider mb-2">
          Rolni o'zgartirish:
        </h3>
        <button
          onClick={() => {
            triggerHaptic('medium');
            onSwitchRole();
          }}
          className="w-full min-h-[44px] bg-[#E8F3F1] hover:bg-[#D4ECE8] text-teal-action font-bold text-xs rounded-xl border border-teal-action/40 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>{t.roleSelection.switchRoleBtn} (Bosh sahifaga qaytish)</span>
        </button>
      </div>

      {/* Language Preference Card */}
      <div className="bg-cream-card rounded-[14px] p-3.5 border border-[#E3D9C4] shadow-card">
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
                  ? 'bg-[#0A1714] text-gold-highlight border-gold-highlight shadow-xs'
                  : 'bg-white text-ink border-[#DCD3BE] hover:border-[#0A1714]/40'
              }`}
            >
              {l === 'uz' ? "O'zbekcha" : l === 'ru' ? 'Русский' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-cream-card rounded-[14px] p-3.5 border border-[#E3D9C4] shadow-card">
        <h3 className="font-serif font-bold text-xs text-ink uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-gold-highlight" />
          <span>Bozorchi AI Ta'minotchi Portali</span>
        </h3>
        <p className="text-xs text-ink-muted leading-relaxed">
          Toshkentdagi ulgurji bazalar va yirik distribyutorlar uchun mahalliy do'konlar klasterlariga to'g'ridan-to'g'ri chiqish va kafolatlangan eskrou to'lovlari platformasi.
        </p>
      </div>
    </div>
  );
};
