import React, { useState } from 'react';
import { Language, UserRole, ShopOwnerProfile, SupplierProfile } from '../types';
import { translations } from '../i18n';
import { Store, Truck, ArrowRight, ShieldCheck, Sparkles, X } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onSelectRole: (role: UserRole) => void;
  shopProfile: ShopOwnerProfile;
  supplierProfile: SupplierProfile;
  onUpdateShopProfile: (p: ShopOwnerProfile) => void;
  onUpdateSupplierProfile: (p: SupplierProfile) => void;
}

export const RoleSelectionScreen: React.FC<Props> = ({
  lang,
  onLanguageChange,
  onSelectRole,
  shopProfile,
  supplierProfile,
  onUpdateShopProfile,
  onUpdateSupplierProfile
}) => {
  const t = translations[lang];
  const [modalRole, setModalRole] = useState<'shop_owner' | 'supplier' | null>(null);

  // Form states - clean inputs for user to enter their own name
  const [ownerName, setOwnerName] = useState(shopProfile.name || '');
  const [shopName, setShopName] = useState(shopProfile.shopName || '');
  const [shopDistrict, setShopDistrict] = useState(shopProfile.district || '');
  const [shopPhone, setShopPhone] = useState(shopProfile.phone || '');

  const [supName, setSupName] = useState(supplierProfile.name || '');
  const [supCompany, setSupCompany] = useState(supplierProfile.companyName || '');
  const [supLocation, setSupLocation] = useState(supplierProfile.marketLocation || '');
  const [supPhone, setSupPhone] = useState(supplierProfile.phone || '');

  const handleStartOnboarding = (role: 'shop_owner' | 'supplier') => {
    triggerHaptic('medium');
    setModalRole(role);
  };

  const handleConfirmOnboarding = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    triggerHaptic('success');

    if (modalRole === 'shop_owner') {
      const finalName = ownerName.trim() || 'Do\'kondor';
      const finalShop = shopName.trim() || (ownerName.trim() ? `${ownerName.trim()} Do'koni` : 'Baqqollik Do\'koni');
      const finalDist = shopDistrict.trim() || 'Chilonzor tumani';
      const finalPhone = shopPhone.trim() || '+998 90 123 45 67';

      onUpdateShopProfile({
        name: finalName,
        shopName: finalShop,
        district: finalDist,
        phone: finalPhone
      });
      onSelectRole('shop_owner');
    } else if (modalRole === 'supplier') {
      const finalName = supName.trim() || 'Ta\'minotchi';
      const finalCompany = supCompany.trim() || (supName.trim() ? `${supName.trim()} Optom` : 'Ulgurji Baza');
      const finalLocation = supLocation.trim() || 'O\'rikzor bozori';
      const finalPhone = supPhone.trim() || '+998 93 123 45 67';

      onUpdateSupplierProfile({
        name: finalName,
        companyName: finalCompany,
        marketLocation: finalLocation,
        phone: finalPhone,
        verified: true,
        rating: 4.9
      });
      onSelectRole('supplier');
    }
  };

  return (
    <div className="min-h-screen bg-cream-surface flex flex-col justify-between p-4 max-w-[390px] mx-auto select-none">
      {/* Top Bar with Language Switcher */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-gold-highlight text-ink font-serif font-black flex items-center justify-center text-lg shadow-xs">
            B
          </span>
          <span className="font-serif font-bold text-sm tracking-wide text-ink">
            Bozorchi AI
          </span>
        </div>

        {/* Language switcher */}
        <div className="flex items-center bg-[#E5DEC9] p-0.5 rounded-lg border border-[#D5CBB3] text-xs">
          {(['uz', 'ru', 'en'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => {
                triggerHaptic('light');
                onLanguageChange(l);
              }}
              className={`min-h-[34px] min-w-[34px] px-1.5 rounded uppercase font-bold text-[11px] transition-all flex items-center justify-center ${
                lang === l
                  ? 'bg-teal-action text-white shadow-xs'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {l === 'uz' ? "O'z" : l}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Brand Section */}
      <div className="my-auto py-6 text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-[#E8F3F1] border border-teal-action/20 text-teal-action text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-gold-highlight fill-gold-highlight" />
          <span>Toshkent B2B Ulgurji Platformasi</span>
        </div>

        <h1 className="font-serif font-black text-2xl text-ink leading-tight">
          Bozorchi AI
        </h1>
        <p className="text-xs text-ink-muted max-w-[280px] mx-auto font-medium leading-relaxed">
          "{t.roleSelection.tagline}"
        </p>

        {/* Two Large Role Cards */}
        <div className="pt-4 space-y-3.5 text-left">
          {/* Card 1: Shop Owner */}
          <div
            onClick={() => handleStartOnboarding('shop_owner')}
            className="bg-cream-card rounded-[14px] p-4 border-2 border-teal-action shadow-card hover:shadow-md active:scale-[0.99] transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-action text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Store className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 bg-[#E8F3F1] text-teal-action text-[10px] font-black px-2 py-0.2 rounded mb-1">
                    <span>Do'kondor</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-ink leading-tight">
                    {t.roleSelection.shopOwnerCardTitle}
                  </h3>
                  <p className="text-xs text-ink-muted mt-1 leading-snug">
                    {t.roleSelection.shopOwnerCardDesc}
                  </p>
                  <div className="mt-2 text-[10px] text-teal-action font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-action"></span>
                    <span>Baqqollik va do'kon xaridlari</span>
                  </div>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-teal-light text-teal-action flex items-center justify-center shrink-0 mt-2 group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
          </div>

          {/* Card 2: Supplier */}
          <div
            onClick={() => handleStartOnboarding('supplier')}
            className="bg-[#0A1714] text-white rounded-[14px] p-4 border-2 border-gold-highlight/70 shadow-card hover:shadow-md active:scale-[0.99] transition-all cursor-pointer relative overflow-hidden group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold-highlight text-ink flex items-center justify-center shrink-0 shadow-sm">
                  <Truck className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 bg-gold-highlight/20 text-gold-highlight border border-gold-highlight/40 text-[10px] font-black px-2 py-0.2 rounded mb-1">
                    <span>Ulgurji Baza</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-white leading-tight">
                    {t.roleSelection.supplierCardTitle}
                  </h3>
                  <p className="text-xs text-[#C6D2CF] mt-1 leading-snug">
                    {t.roleSelection.supplierCardDesc}
                  </p>
                  <div className="mt-2 text-[10px] text-gold-highlight font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-gold-highlight" />
                    <span>Ulgurji sotuv va distribyutsiya</span>
                  </div>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-white/10 text-gold-highlight flex items-center justify-center shrink-0 mt-2 group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="py-2 text-center">
        <p className="text-[10px] text-ink-muted">
          Bozorchi AI v2.0 • Lumora Competition Two-Sided Marketplace Demo
        </p>
      </div>

      {/* Onboarding Form Modal */}
      {modalRole && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center p-0 md:p-4 animate-fadeIn">
          <div className="w-full max-w-[390px] bg-cream-card rounded-t-3xl md:rounded-2xl p-5 shadow-float border border-[#DFD5BE] space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDE4D0] pb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    modalRole === 'shop_owner'
                      ? 'bg-teal-action text-white'
                      : 'bg-[#0A1714] text-gold-highlight'
                  }`}
                >
                  {modalRole === 'shop_owner' ? <Store className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                </div>
                <h3 className="font-serif font-bold text-base text-ink">
                  {modalRole === 'shop_owner'
                    ? t.roleSelection.onboardingShopTitle
                    : t.roleSelection.onboardingSupplierTitle}
                </h3>
              </div>
              <button
                onClick={() => setModalRole(null)}
                aria-label="Close"
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5"
              >
                <X className="w-4 h-4 text-ink-muted" />
              </button>
            </div>

            <p className="text-xs text-ink-muted">
              Ilovada ishlash uchun o'z ma'lumotlaringizni kiriting:
            </p>

            <form onSubmit={handleConfirmOnboarding} className="space-y-3">
              {modalRole === 'shop_owner' ? (
                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-ink-muted uppercase mb-0.5">
                      {t.roleSelection.nameLabel}
                    </label>
                    <input
                      type="text"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Ismingizni kiriting (masalan: Asliddin)"
                      className="w-full min-h-[42px] px-3 bg-white border border-[#DED4BD] rounded-xl text-ink font-semibold placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-teal-action/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-ink-muted uppercase mb-0.5">
                      {t.roleSelection.bizNameLabel}
                    </label>
                    <input
                      type="text"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      placeholder="Do'koningiz nomi (masalan: Baraka Market)"
                      className="w-full min-h-[42px] px-3 bg-white border border-[#DED4BD] rounded-xl text-ink font-semibold placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-teal-action/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-ink-muted uppercase mb-0.5">
                      {t.roleSelection.locationLabel}
                    </label>
                    <input
                      type="text"
                      value={shopDistrict}
                      onChange={(e) => setShopDistrict(e.target.value)}
                      placeholder="Tuman yoki mavze (masalan: Chilonzor-9)"
                      className="w-full min-h-[42px] px-3 bg-white border border-[#DED4BD] rounded-xl text-ink font-semibold placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-teal-action/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-ink-muted uppercase mb-0.5">
                      {t.roleSelection.phoneLabel}
                    </label>
                    <input
                      type="text"
                      value={shopPhone}
                      onChange={(e) => setShopPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full min-h-[42px] px-3 bg-white border border-[#DED4BD] rounded-xl text-ink font-semibold placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-teal-action/40"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-ink-muted uppercase mb-0.5">
                      {t.roleSelection.nameLabel}
                    </label>
                    <input
                      type="text"
                      value={supName}
                      onChange={(e) => setSupName(e.target.value)}
                      placeholder="Ismingizni kiriting (masalan: Asliddin)"
                      className="w-full min-h-[42px] px-3 bg-white border border-[#DED4BD] rounded-xl text-ink font-semibold placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-gold-highlight/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-ink-muted uppercase mb-0.5">
                      {t.roleSelection.bizNameLabel}
                    </label>
                    <input
                      type="text"
                      value={supCompany}
                      onChange={(e) => setSupCompany(e.target.value)}
                      placeholder="Ulgurji baza yoki firma nomi"
                      className="w-full min-h-[42px] px-3 bg-white border border-[#DED4BD] rounded-xl text-ink font-semibold placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-gold-highlight/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-ink-muted uppercase mb-0.5">
                      {t.roleSelection.locationLabel}
                    </label>
                    <input
                      type="text"
                      value={supLocation}
                      onChange={(e) => setSupLocation(e.target.value)}
                      placeholder="Bozor yoki ombor (masalan: O'rikzor 4-baza)"
                      className="w-full min-h-[42px] px-3 bg-white border border-[#DED4BD] rounded-xl text-ink font-semibold placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-gold-highlight/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-ink-muted uppercase mb-0.5">
                      {t.roleSelection.phoneLabel}
                    </label>
                    <input
                      type="text"
                      value={supPhone}
                      onChange={(e) => setSupPhone(e.target.value)}
                      placeholder="+998 93 123 45 67"
                      className="w-full min-h-[42px] px-3 bg-white border border-[#DED4BD] rounded-xl text-ink font-semibold placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-gold-highlight/40"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className={`w-full min-h-[48px] rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-[0.99] transition-all text-white mt-2 ${
                  modalRole === 'shop_owner'
                    ? 'bg-teal-action hover:bg-teal-hover'
                    : 'bg-[#0A1714] hover:bg-black border border-gold-highlight text-gold-highlight'
                }`}
              >
                <span>{t.roleSelection.continueBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
