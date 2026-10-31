import React from 'react';
import { Supplier, Language } from '../types';
import { translations } from '../i18n';
import { formatUZS } from '../utils/format';
import { CheckCircle2, Star, Shield, Users, ArrowRight, Truck, Phone } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  suppliers: Supplier[];
  lang: Language;
  onJoinPool: () => void;
  onSelectSupplier?: (supplier: Supplier) => void;
}

export const SupplierScreen: React.FC<Props> = ({
  suppliers,
  lang,
  onJoinPool,
  onSelectSupplier
}) => {
  const t = translations[lang];

  // Sort cheapest first
  const sorted = [...suppliers].sort((a, b) => a.pricePerUnit - b.pricePerUnit);

  return (
    <div className="space-y-3.5 pb-8">
      {/* Group Pool Banner Callout */}
      <div className="bg-gradient-to-r from-[#0B6B62] to-[#0A564F] text-white rounded-card p-3.5 shadow-card border border-gold-highlight/30">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1 bg-[#E3B341] text-ink text-[10px] font-black px-2 py-0.5 rounded-full mb-1">
              <span>{t.suppliers.secretBadge}</span>
            </div>
            <h3 className="font-serif font-bold text-sm text-white">
              {t.suppliers.poolBanner}
            </h3>
            <p className="text-[11px] text-[#D3EBE7] mt-0.5 leading-snug">
              {t.suppliers.poolBannerDesc}
            </p>
          </div>
          <button
            onClick={() => {
              triggerHaptic('medium');
              onJoinPool();
            }}
            className="min-h-[44px] px-3 bg-[#E3B341] text-ink font-bold text-xs rounded-xl shadow-sm hover:bg-[#F3C759] active:scale-95 transition-all flex items-center gap-1 shrink-0 mt-2"
          >
            <span>{t.suppliers.toPool}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Screen Title & Subtitle */}
      <div className="px-1 flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-base text-ink">
            {t.suppliers.title}
          </h2>
          <p className="text-[11px] text-ink-muted">
            {t.suppliers.subtitle}
          </p>
        </div>
        <span className="text-[10px] font-bold text-teal-action bg-[#E8F3F1] px-2 py-0.5 rounded-full border border-teal-action/20">
          {t.suppliers.productPill}
        </span>
      </div>

      {/* Suppliers List (5 Suppliers) */}
      <div className="space-y-2.5">
        {sorted.map((sup, index) => {
          const isCheapestSolo = index === 0;

          return (
            <div
              key={sup.id}
              className={`bg-cream-card rounded-card p-3 border transition-all duration-150 shadow-card ${
                isCheapestSolo
                  ? 'border-teal-action/60 ring-1 ring-teal-action/20'
                  : 'border-[#E3D9C4]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="w-5 h-5 rounded-full bg-[#EFE8D6] text-ink text-xs font-serif font-black flex items-center justify-center">
                      {index + 1}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-ink">
                      {sup.name}
                    </h4>
                    {sup.verified && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-[#167E51] bg-[#EBF7F0] px-1.5 py-0.2 rounded border border-[#167E51]/20">
                        <CheckCircle2 className="w-3 h-3 text-[#167E51]" />
                        <span>{t.suppliers.verifiedBadge}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-ink-muted">
                    {sup.market}
                  </p>

                  <div className="flex items-center gap-3 text-[11px] text-ink-muted pt-0.5">
                    <div className="flex items-center gap-1 text-[#B8871E] font-bold">
                      <Star className="w-3.5 h-3.5 fill-[#E3B341] stroke-[#B8871E]" />
                      <span>{sup.rating}</span>
                      <span className="text-[10px] text-ink-muted font-normal">({sup.reviewCount})</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-teal-action" />
                      <span>{sup.deliveryTime}</span>
                    </div>
                  </div>
                </div>

                {/* Right Price & Min order */}
                <div className="text-right shrink-0">
                  <div className="text-base font-bold font-serif text-ink tracking-tight">
                    {formatUZS(sup.pricePerUnit)}
                  </div>
                  <div className="text-[10px] text-ink-muted -mt-0.5">/{sup.unit}</div>

                  <div className="mt-1 text-[10px] text-ink-muted">
                    Min: <strong className="text-ink font-semibold">{sup.minOrderQty} {sup.unit}</strong>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="mt-3 pt-2.5 border-t border-[#EFE7D4] flex items-center justify-between text-xs">
                <span className="text-[10px] text-ink-muted">
                  {t.suppliers.soloPriceFor500} <strong className="text-ink font-bold">{formatUZS(sup.pricePerUnit * 500)}</strong>
                </span>

                <button
                  onClick={() => {
                    triggerHaptic('light');
                    if (onSelectSupplier) onSelectSupplier(sup);
                    onJoinPool();
                  }}
                  className="min-h-[44px] px-3 py-1 bg-cream-card hover:bg-teal-light text-teal-action font-bold text-xs rounded-lg border border-teal-action/40 active:scale-95 transition-all flex items-center gap-1"
                >
                  <span>{t.suppliers.chooseBtn}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky-style Join Pool Button */}
      <div className="pt-2">
        <button
          onClick={() => {
            triggerHaptic('medium');
            onJoinPool();
          }}
          className="w-full min-h-[48px] bg-teal-action hover:bg-teal-hover text-white font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
        >
          <Users className="w-4 h-4 stroke-[2.5]" />
          <span>{t.suppliers.joinPoolBtn}</span>
        </button>
      </div>
    </div>
  );
};
