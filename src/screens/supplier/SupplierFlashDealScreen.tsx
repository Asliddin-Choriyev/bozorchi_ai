import React, { useState, useEffect } from 'react';
import { Language, FlashDeal } from '../../types';
import { translations } from '../../i18n';
import { formatUZS } from '../../utils/format';
import { Zap, Clock, Users, ArrowRight, Check, Send, Sparkles } from 'lucide-react';
import { triggerHaptic } from '../../utils/telegram';

interface Props {
  lang: Language;
  flashDeal: FlashDeal;
  onUpdateFlashDeal: (deal: FlashDeal) => void;
  onNavigateOrders: () => void;
}

export const SupplierFlashDealScreen: React.FC<Props> = ({
  lang,
  flashDeal,
  onUpdateFlashDeal,
  onNavigateOrders
}) => {
  const t = translations[lang];

  const [promoPrice, setPromoPrice] = useState('11400');
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([
    'Chilonzor',
    'Uchtepa',
    'Yunusobod'
  ]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Countdown timer simulation
  const [secondsLeft, setSecondsLeft] = useState(7180); // 1h 59m 40s

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleBroadcast = () => {
    triggerHaptic('success');
    const newPrice = parseInt(promoPrice, 10) || 11400;

    onUpdateFlashDeal({
      ...flashDeal,
      flashPrice: newPrice,
      targetDistricts: selectedDistricts,
      isActive: true,
      buyersReachedCount: 48
    });

    setToastMessage(t.supplier.flash.successToast);
    setTimeout(() => {
      setToastMessage(null);
      onNavigateOrders();
    }, 1800);
  };

  const toggleDistrict = (d: string) => {
    triggerHaptic('light');
    if (selectedDistricts.includes(d)) {
      if (selectedDistricts.length > 1) {
        setSelectedDistricts(selectedDistricts.filter((x) => x !== d));
      }
    } else {
      setSelectedDistricts([...selectedDistricts, d]);
    }
  };

  return (
    <div className="space-y-3.5 pb-20">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-[360px] mx-auto bg-[#167E51] text-white p-3 rounded-xl shadow-float flex items-center justify-center gap-2 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Title */}
      <div className="bg-[#0A1714] text-white rounded-[14px] p-4 border border-gold-highlight/40 shadow-card">
        <div className="inline-flex items-center gap-1 bg-gold-highlight text-ink text-[10px] font-black px-2 py-0.5 rounded-full mb-1">
          <Zap className="w-3 h-3 fill-ink" />
          <span>{t.supplier.flash.dealBadge}</span>
        </div>
        <h2 className="font-serif font-bold text-lg text-white">
          {t.supplier.flash.title}
        </h2>
        <p className="text-xs text-[#C5D5D1] mt-0.5">
          {t.supplier.flash.subtitle}
        </p>

        {/* Live Countdown & Reach Stats */}
        <div className="mt-3.5 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
          <div className="bg-black/30 p-2.5 rounded-xl border border-white/10 text-center">
            <span className="text-[10px] text-[#A6B8B4] block uppercase font-bold">
              {t.supplier.flash.activeCountdown}
            </span>
            <span className="font-serif font-black text-lg text-gold-highlight">
              {formatTimer(secondsLeft)}
            </span>
          </div>

          <div className="bg-black/30 p-2.5 rounded-xl border border-white/10 text-center">
            <span className="text-[10px] text-[#A6B8B4] block uppercase font-bold">
              {t.supplier.flash.reachedLabel}
            </span>
            <span className="font-serif font-black text-lg text-white flex items-center justify-center gap-1">
              <Users className="w-4 h-4 text-teal-action" />
              <span>{t.supplier.flash.shopsCount}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Flash Configuration Card */}
      <div className="bg-cream-card rounded-[14px] p-4 border border-[#E3D9C4] shadow-card space-y-3.5">
        <h3 className="font-serif font-bold text-xs text-ink uppercase tracking-wider">
          {t.supplier.flash.configTitle}
        </h3>

        {/* Product & Volume (Pre-selected 25 t Sugar) */}
        <div className="p-3 rounded-xl bg-[#FAF6EC] border border-[#E6DDCA] space-y-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-serif font-bold text-ink">{t.supplier.flash.sugarProduct}</span>
            <span className="font-bold text-teal-action bg-[#E8F3F1] px-2 py-0.5 rounded text-[11px]">
              {t.supplier.flash.volumeBadge}
            </span>
          </div>
          <p className="text-[11px] text-ink-muted">
            {t.supplier.flash.originalPriceLabel}
          </p>
        </div>

        {/* New Flash Price Input */}
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
            {t.supplier.flash.newPriceLabel}
          </label>
          <div className="relative">
            <input
              type="number"
              value={promoPrice}
              onChange={(e) => setPromoPrice(e.target.value)}
              className="w-full min-h-[46px] px-3 pr-16 bg-white border border-[#DED4BD] rounded-xl text-base font-serif font-black text-teal-action focus:outline-none focus:ring-2 focus:ring-teal-action/40"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-xs font-bold text-ink-muted">UZS / kg</span>
            </div>
          </div>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-teal-action font-bold">
              {t.supplier.flash.discountAmount}
            </span>
            <span className="text-ink-muted">{t.supplier.flash.tier1Price}</span>
          </div>
        </div>

        {/* Target Districts */}
        <div>
          <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1.5">
            {t.supplier.flash.targetBuyersLabel}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Chilonzor', 'Uchtepa', 'Yunusobod', 'Sergeli', 'Shayxontohur'].map((district) => {
              const isSelected = selectedDistricts.includes(district);
              return (
                <button
                  type="button"
                  key={district}
                  onClick={() => toggleDistrict(district)}
                  className={`min-h-[38px] px-2 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-teal-action text-white border-teal-action shadow-2xs'
                      : 'bg-white text-ink border-[#DED4BD]'
                  }`}
                >
                  {district}
                </button>
              );
            })}
          </div>
        </div>

        {/* Broadcast Button */}
        <button
          onClick={handleBroadcast}
          className="w-full min-h-[50px] bg-gradient-to-r from-gold-highlight to-[#F3C759] text-ink font-serif font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all pt-1"
        >
          <Send className="w-4 h-4" />
          <span>{t.supplier.flash.startBtn}</span>
        </button>
      </div>
    </div>
  );
};
