import React from 'react';
import { Language, PoolOrder } from '../../types';
import { translations } from '../../i18n';
import { formatUZS } from '../../utils/format';
import { Award, ShieldCheck, Check, Sparkles, TrendingUp, RotateCcw, ArrowRight } from 'lucide-react';
import { triggerHaptic } from '../../utils/telegram';

interface Props {
  lang: Language;
  poolOrder: PoolOrder;
  onNavigateDashboard: () => void;
}

export const SupplierResultScreen: React.FC<Props> = ({
  lang,
  poolOrder,
  onNavigateDashboard
}) => {
  const t = translations[lang];

  return (
    <div className="space-y-4 pb-20">
      {/* Hero Victory Card */}
      <div className="bg-[#0A1714] text-white rounded-[14px] p-5 text-center shadow-card border border-gold-highlight/40 relative overflow-hidden">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gold-highlight text-ink flex items-center justify-center text-3xl shadow-sm mb-2">
          🏆
        </div>

        <div className="inline-flex items-center gap-1 bg-gold-highlight text-ink text-[11px] font-black px-3 py-0.5 rounded-full mb-1">
          <span>{t.supplier.result.title}</span>
        </div>

        <h2 className="font-serif font-black text-2xl text-white mt-1">
          25 Tonna Yuk Sotildi!
        </h2>
        <p className="text-xs text-gold-highlight font-bold mt-1 max-w-[280px] mx-auto leading-relaxed">
          "{t.supplier.result.subtitle}"
        </p>

        <div className="mt-3 inline-flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs text-[#CFE5E1]">
          <span>4 kun bozor xaridorini kutish o'rniga 12 daqiqada</span>
        </div>
      </div>

      {/* Payout & Platform Fee Breakdown */}
      <div className="bg-cream-card rounded-[14px] p-4 border border-[#E3D9C4] shadow-card space-y-2.5">
        <h3 className="font-serif font-bold text-xs text-ink uppercase tracking-wider text-center">
          Mablag' Yechilishi & Hisob-Kitob
        </h3>

        <div className="space-y-2 text-xs pt-1">
          <div className="flex justify-between items-center py-1.5 border-b border-[#EDE4D0]">
            <span className="text-ink font-medium">{t.supplier.result.payoutLabel}</span>
            <span className="font-serif font-bold text-ink">
              {formatUZS(poolOrder.totalAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-[#EDE4D0]">
            <span className="text-ink-muted">
              {t.supplier.result.feeLabel}
            </span>
            <span className="font-serif font-bold text-danger">
              -{formatUZS(poolOrder.platformFeeAmount)}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div>
              <span className="font-serif font-bold text-sm text-ink block">
                {t.supplier.result.netPayout}
              </span>
              <span className="text-[10px] text-[#167E51] font-semibold">
                Hisob raqamingizga o'tkazildi ✓
              </span>
            </div>
            <span className="font-serif font-black text-lg text-teal-action">
              {formatUZS(poolOrder.payoutAmount)}
            </span>
          </div>
        </div>
      </div>

      {/* Verified Supplier Subscription Plan Card ($35/mo) */}
      <div className="bg-gradient-to-br from-[#12221E] to-[#0A1714] text-white rounded-[14px] p-4 border-2 border-gold-highlight/70 shadow-card space-y-2.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gold-highlight text-ink flex items-center justify-center font-bold">
              ★
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-gold-highlight">
                {t.supplier.result.verifiedCardTitle}
              </h4>
              <p className="text-[11px] text-[#A6B8B4]">
                Toshkentning 120 ta baqqollik klasteriga to'g'ridan-to'g'ri chiqish
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#C5D5D1] leading-relaxed">
          {t.supplier.result.verifiedCardDesc}
        </p>

        <div className="space-y-1 text-xs text-[#D5E5E1]">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-gold-highlight" />
            <span>Klasterlar qidiruvida doim 1-o'rinda chiqish</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-gold-highlight" />
            <span>2 soatlik Flash aksiyalarni cheksiz yuborish</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-gold-highlight" />
            <span>Eskrou orqali 0% to'lov kafolati</span>
          </div>
        </div>

        <button
          onClick={() => {
            triggerHaptic('success');
            alert("Verified Ta'minotchi obunasi faollashtirildi!");
          }}
          className="w-full min-h-[44px] bg-gold-highlight hover:bg-[#F3C759] text-ink font-serif font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all mt-2"
        >
          <span>{t.supplier.result.subscribeBtn}</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Return to Dashboard */}
      <button
        onClick={() => {
          triggerHaptic('light');
          onNavigateDashboard();
        }}
        className="w-full min-h-[46px] bg-cream-card border border-[#D5C9AE] text-ink font-bold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>{t.supplier.result.backBtn}</span>
      </button>
    </div>
  );
};
