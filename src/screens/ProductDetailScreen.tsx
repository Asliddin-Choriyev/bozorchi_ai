import React from 'react';
import { Product, Language } from '../types';
import { translations } from '../i18n';
import { PriceTrendChart } from '../components/PriceTrendChart';
import { formatUZS, formatChange } from '../utils/format';
import { Bell, Scale, Users, ShieldCheck, ArrowRight, TrendingDown } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  product: Product;
  lang: Language;
  onCompareSuppliers: () => void;
  onSetAlert: (product: Product) => void;
  onJoinPool: () => void;
}

export const ProductDetailScreen: React.FC<Props> = ({
  product,
  lang,
  onCompareSuppliers,
  onSetAlert,
  onJoinPool
}) => {
  const t = translations[lang];
  const change = formatChange(product.change7dPercent);

  return (
    <div className="space-y-4 pb-8">
      {/* Product Header Card */}
      <div className="bg-cream-card rounded-card p-4 border border-[#E3D9C4] shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#EFE8D6] border border-[#DDD1B8] flex items-center justify-center text-3xl shadow-xs">
            {product.icon}
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-teal-action bg-[#E8F3F1] px-2 py-0.5 rounded-full border border-teal-action/20">
              <span>Ulgurji Asosiy Tovar</span>
            </div>
            <h2 className="font-serif font-bold text-lg text-ink leading-tight mt-1">
              {lang === 'uz' ? product.nameUz : lang === 'ru' ? product.nameRu : product.nameEn}
            </h2>
            <p className="text-xs text-ink-muted mt-0.5">
              Standart qop: {product.volumeMin} • Toshkent bozorlari
            </p>
          </div>
        </div>

        {/* Big Price Display */}
        <div className="mt-4 pt-3 border-t border-[#EDE4D0] flex items-end justify-between">
          <div>
            <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
              {t.productDetail.todayAvg}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-serif font-black text-ink tracking-tight">
                {formatUZS(product.todayPrice, false)}
              </span>
              <span className="text-sm font-bold text-ink-muted">UZS / {product.unit}</span>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`text-xs font-extrabold px-2 py-1 rounded-lg inline-flex items-center gap-1 ${
                change.isDrop
                  ? 'bg-[#EBF7F0] text-[#167E51] border border-[#167E51]/20'
                  : 'bg-[#FCEBEB] text-danger border border-danger/20'
              }`}
            >
              {change.text} (7 kun)
            </span>
            <p className="text-[10px] text-ink-muted mt-0.5">Oldingi: {formatUZS(product.previousPrice)}</p>
          </div>
        </div>

        {/* Fair Price Range Badge */}
        <div className="mt-3 bg-[#FCF8EC] border border-[#E7D6A7] rounded-xl p-2.5 flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#C99824] shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-[#6D520D] flex items-center gap-1.5">
              <span>{t.productDetail.fairPriceTitle}:</span>
              <span className="bg-[#E3B341]/25 px-1.5 py-0.2 rounded font-black text-ink">
                {formatUZS(product.fairMin, false)} – {formatUZS(product.fairMax, false)} UZS/{product.unit}
              </span>
            </div>
            <p className="text-[10px] text-[#85691F] mt-0.5">
              {t.productDetail.fairPriceDesc}
            </p>
          </div>
        </div>
      </div>

      {/* 30-Day Line Chart */}
      <div>
        <div className="flex items-center justify-between mb-1.5 px-1">
          <h3 className="font-serif font-bold text-sm text-ink flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-teal-action" />
            <span>{t.productDetail.trendTitle}</span>
          </h3>
          <span className="text-[10px] text-ink-muted font-medium">Inline SVG</span>
        </div>
        <PriceTrendChart
          points={product.trend30d}
          fairMin={product.fairMin}
          fairMax={product.fairMax}
          unit={product.unit}
        />
      </div>

      {/* Group Pool CTA Banner */}
      <div className="bg-gradient-to-br from-[#0B6B62] to-[#074741] text-white rounded-card p-4 shadow-card border border-teal-action/40 relative overflow-hidden">
        <div className="flex items-start justify-between gap-2 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1 bg-[#E3B341] text-ink text-[10px] font-black px-2 py-0.5 rounded-full mb-1">
              <span>★ Eng foydali variant</span>
            </div>
            <h4 className="font-serif font-bold text-base">
              {t.productDetail.joinPoolBannerTitle}
            </h4>
            <p className="text-xs text-[#D1ECE7] mt-0.5">
              {t.productDetail.joinPoolBannerSubtitle}
            </p>
            <div className="mt-2 text-xs font-semibold text-[#F7DE9B] flex items-center gap-1.5">
              <span className="line-through text-white/60">Yakka: 12 800 UZS</span>
              <span className="text-sm font-bold text-[#E3B341] bg-black/30 px-2 py-0.5 rounded">
                Guruh bilan: 11 400 UZS
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              triggerHaptic('medium');
              onJoinPool();
            }}
            className="min-h-[44px] px-3.5 bg-[#E3B341] text-ink font-bold text-xs rounded-xl shadow-md hover:bg-[#F3C759] active:scale-95 transition-all flex items-center gap-1 shrink-0 mt-3"
          >
            <span>Guruhga</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Action Buttons: Compare Suppliers & Set Alert */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => {
            triggerHaptic('light');
            onCompareSuppliers();
          }}
          className="min-h-[48px] bg-cream-card border-2 border-teal-action text-teal-action hover:bg-teal-light rounded-xl font-bold text-xs p-2.5 flex flex-col items-center justify-center gap-1 shadow-card active:scale-[0.98] transition-all"
        >
          <Scale className="w-4 h-4 stroke-[2.2]" />
          <span className="text-center leading-tight">5 ta ta'minotchini solishtirish</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            onSetAlert(product);
          }}
          className="min-h-[48px] bg-cream-card border border-[#D5C9AE] text-ink hover:border-gold-highlight hover:bg-gold-light rounded-xl font-bold text-xs p-2.5 flex flex-col items-center justify-center gap-1 shadow-card active:scale-[0.98] transition-all"
        >
          <Bell className="w-4 h-4 stroke-[2.2] text-[#B8871E]" />
          <span className="text-center leading-tight">Narx tushishini kutish</span>
        </button>
      </div>

      {/* Market Prices Breakdown Table */}
      <div className="bg-cream-card rounded-card p-3 border border-[#E3D9C4] shadow-card">
        <h4 className="font-serif font-bold text-xs text-ink mb-2">
          Bozorlar bo'yicha solishtirma (Bugun):
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#EFE7D4]">
            <span className="font-medium text-ink">Chorsu Optom:</span>
            <span className="font-bold font-serif text-teal-action">11 800 UZS/kg</span>
          </div>
          <div className="flex items-center justify-between pb-1.5 border-b border-[#EFE7D4]">
            <span className="font-medium text-ink">O'rikzor Baraka:</span>
            <span className="font-bold font-serif text-ink">11 950 UZS/kg</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-ink">Food City Sektor B:</span>
            <span className="font-bold font-serif text-ink">12 100 UZS/kg</span>
          </div>
        </div>
      </div>
    </div>
  );
};
