import React, { useState } from 'react';
import { Language, ShopOwnerProfile } from '../types';
import { translations } from '../i18n';
import { MOCK_USER_PROFILE } from '../data/mock';
import { formatUZS } from '../utils/format';
import { getOpenAIApiKey, saveOpenAIApiKey, hasActiveAIKey } from '../utils/ai';
import { Store, ShieldCheck, Coins, Award, MapPin, Phone, HelpCircle, Bot, Key, Check, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenAI?: () => void;
  onSwitchRole?: () => void;
  profile?: ShopOwnerProfile;
}

export const ProfileScreen: React.FC<Props> = ({ lang, onLanguageChange, onOpenAI, onSwitchRole, profile }) => {
  const t = translations[lang];
  const [apiKeyInput, setApiKeyInput] = useState(getOpenAIApiKey());
  const [keySaved, setKeySaved] = useState(false);
  const isKeyActive = hasActiveAIKey();

  const currentShopName = profile?.shopName || profile?.name || MOCK_USER_PROFILE.shopName;
  const currentOwnerName = profile?.name || MOCK_USER_PROFILE.ownerName;
  const currentDistrict = profile?.district || MOCK_USER_PROFILE.address;
  const currentPhone = profile?.phone || MOCK_USER_PROFILE.phone;
  const avatarLetter = (currentShopName || currentOwnerName || 'D')[0].toUpperCase();

  const handleSaveKey = () => {
    triggerHaptic('success');
    saveOpenAIApiKey(apiKeyInput);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2500);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Profile Card */}
      <div className="bg-cream-card rounded-card p-4 border border-[#E3D9C4] shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-teal-action text-white flex items-center justify-center font-serif font-black text-2xl shadow-sm">
            {avatarLetter}
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#167E51] bg-[#EBF7F0] px-2 py-0.5 rounded-full border border-[#167E51]/20">
              <ShieldCheck className="w-3 h-3 text-[#167E51]" />
              <span>Tasdiqlangan baqqol</span>
            </div>
            <h2 className="font-serif font-bold text-lg text-ink leading-tight mt-1">
              {currentShopName}
            </h2>
            <p className="text-xs text-ink-muted">
              {currentOwnerName}
            </p>
          </div>
        </div>

        <div className="mt-3.5 pt-3 border-t border-[#EDE4D0] space-y-2 text-xs">
          <div className="flex items-center gap-2 text-ink-muted">
            <MapPin className="w-3.5 h-3.5 text-teal-action shrink-0" />
            <span>{currentDistrict}</span>
          </div>
          <div className="flex items-center gap-2 text-ink-muted">
            <Phone className="w-3.5 h-3.5 text-teal-action shrink-0" />
            <span>{currentPhone}</span>
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

      {/* Switch Role Card */}
      {onSwitchRole && (
        <div className="bg-cream-card rounded-card p-3.5 border border-[#E3D9C4] shadow-card">
          <h3 className="font-serif font-bold text-xs text-ink uppercase tracking-wider mb-2">
            Rolni o'zgartirish:
          </h3>
          <button
            onClick={() => {
              triggerHaptic('medium');
              onSwitchRole();
            }}
            className="w-full min-h-[44px] bg-[#0A1714] hover:bg-black text-gold-highlight font-bold text-xs rounded-xl border border-gold-highlight/50 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs"
          >
            <span>{t.roleSelection.switchRoleBtn} (Bosh sahifaga qaytish)</span>
          </button>
        </div>
      )}

      {/* OpenAI AI Integration Card */}
      <div className="bg-cream-card rounded-card p-3.5 border border-[#E3D9C4] shadow-card space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gold-highlight text-ink flex items-center justify-center">
              <Bot className="w-4 h-4 text-ink" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xs text-ink uppercase tracking-wider">
                Sun'iy Intellekt (OpenAI)
              </h3>
              <p className="text-[10px] text-ink-muted">BozorVision va Bozorchi AI uchun</p>
            </div>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isKeyActive
                ? 'bg-[#EBF7F0] text-[#167E51] border-[#167E51]/20'
                : 'bg-[#FCF5E2] text-[#8C6D1F] border-[#E3B341]/30'
            }`}
          >
            {isKeyActive ? '● ChatGPT Live' : '○ Smart Demo'}
          </span>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            OpenAI API Token (sk-...):
          </label>
          <div className="flex items-center gap-1.5">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="sk-proj-..."
              className="flex-1 min-h-[40px] px-3 bg-white border border-[#DCD3BE] rounded-xl text-xs text-ink placeholder-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-teal-action/40"
            />
            <button
              onClick={handleSaveKey}
              className="min-h-[40px] px-3 bg-teal-action hover:bg-teal-hover text-white font-bold text-xs rounded-xl flex items-center gap-1 active:scale-95 transition-all"
            >
              {keySaved ? <Check className="w-3.5 h-3.5" /> : <Key className="w-3.5 h-3.5" />}
              <span>{keySaved ? 'Saqlandi' : 'Saqlash'}</span>
            </button>
          </div>
          <p className="text-[10px] text-ink-muted mt-1 leading-tight">
            Kalit kiritilsa, BozorVision fakturalarni bevosita GPT-4o-mini orqali tahlil qiladi. Kiritilmasa, barqaror demo rejim ishlaydi.
          </p>
        </div>

        {onOpenAI && (
          <button
            onClick={() => {
              triggerHaptic('medium');
              onOpenAI();
            }}
            className="w-full min-h-[40px] bg-[#E8F3F1] hover:bg-[#D5EAE6] text-teal-action font-bold text-xs rounded-xl border border-teal-action/30 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-highlight fill-gold-highlight" />
            <span>Bozorchi AI bilan suhbatlashish</span>
          </button>
        )}
      </div>

      {/* About App */}
      <div className="bg-cream-card rounded-card p-3.5 border border-[#E3D9C4] shadow-card">
        <h3 className="font-serif font-bold text-xs text-ink uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-teal-action" />
          <span>Bozorchi AI haqida</span>
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
