import React, { useState } from 'react';
import { Product, Market, Language } from '../types';
import { translations } from '../i18n';
import { MarketChips } from '../components/MarketChips';
import { formatUZS, formatChange } from '../utils/format';
import { Search, ChevronRight, Users, Sparkles, Filter, AlertTriangle } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  lang: Language;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onQuickJoinPool: () => void;
}

export const PriceBoardScreen: React.FC<Props> = ({
  products,
  onSelectProduct,
  lang,
  searchQuery,
  onSearchChange,
  onQuickJoinPool
}) => {
  const [selectedMarket, setSelectedMarket] = useState<Market>('All');
  const t = translations[lang];

  // Filter products based on search query and market
  const filteredProducts = products.filter((p) => {
    // Search query matching (matches nameUz, nameRu, nameEn, id)
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.nameUz.toLowerCase().includes(q) ||
      p.nameRu.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      (q.includes('shakar') && p.id === 'sugar') ||
      (q.includes('sugar') && p.id === 'sugar') ||
      (q.includes('un') && p.id === 'flour') ||
      (q.includes('yog') && p.id === 'oil');

    // Market matching
    if (selectedMarket === 'All') return matchesSearch;
    return matchesSearch && !!p.markets[selectedMarket];
  });

  return (
    <div className="space-y-3.5 pb-6">
      {/* Top Welcome / Context Card */}
      <div className="bg-[#FAF6EC] border border-[#E8DFC9] rounded-card p-3 shadow-card">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold text-teal-action uppercase tracking-wider">
              {t.priceBoard.topBannerTitle}
            </span>
          </div>
          <span className="text-[10px] text-ink-muted bg-[#EDE4D0] px-2 py-0.5 rounded font-medium">
            {t.priceBoard.topBannerUpdated}
          </span>
        </div>
        <p className="text-xs text-ink-muted">
          {t.priceBoard.topBannerDesc}
        </p>
      </div>

      {/* Group Pool Callout Banner */}
      <div
        onClick={() => {
          triggerHaptic('medium');
          onQuickJoinPool();
        }}
        className="bg-gradient-to-r from-teal-action to-[#0D7F75] text-white rounded-card p-3 shadow-card cursor-pointer hover:brightness-105 active:scale-[0.99] transition-all relative overflow-hidden"
      >
        <div className="absolute right-[-10px] -bottom-3 text-6xl opacity-15 select-none pointer-events-none">
          👥
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1 bg-[#E3B341] text-ink text-[10px] font-black px-2 py-0.5 rounded-full mb-1">
              <span>{t.priceBoard.poolCalloutBadge}</span>
            </div>
            <h3 className="font-serif font-bold text-sm">{t.priceBoard.poolCalloutTitle}</h3>
            <p className="text-[11px] text-[#D4ECE8] mt-0.5">
              {t.priceBoard.poolCalloutDesc}
            </p>
          </div>
          <button className="min-h-[44px] px-3 bg-[#E3B341] text-ink font-bold text-xs rounded-xl flex items-center gap-1 shadow-sm shrink-0">
            <span>{t.priceBoard.poolCalloutBtn}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-[#7A6E59]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.priceBoard.searchPlaceholder}
          className="w-full min-h-[46px] pl-10 pr-24 py-2.5 bg-cream-card border border-[#DED4BD] rounded-xl text-xs font-medium text-ink placeholder-[#8F836E] focus:outline-none focus:ring-2 focus:ring-teal-action/40 focus:border-teal-action transition-all shadow-xs"
        />
        {searchQuery ? (
          <button
            onClick={() => onSearchChange('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-ink-muted hover:text-ink"
          >
            {t.priceBoard.clear}
          </button>
        ) : (
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <span className="text-[10px] font-bold text-teal-action bg-teal-light px-2 py-0.5 rounded-md border border-teal-action/20">
              {t.priceBoard.wholesalePill}
            </span>
          </div>
        )}
      </div>

      {/* Market Selector Chips */}
      <div>
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <span className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
            {t.priceBoard.marketSelectorTitle}
          </span>
          <span className="text-[11px] text-teal-action font-semibold">
            {filteredProducts.length} {t.priceBoard.itemsCount}
          </span>
        </div>
        <MarketChips
          selectedMarket={selectedMarket}
          onSelect={setSelectedMarket}
          lang={lang}
        />
      </div>

      {/* Staple Goods List */}
      <div className="space-y-2.5">
        {filteredProducts.map((p) => {
          const change = formatChange(p.change7dPercent);
          const displayPrice =
            selectedMarket !== 'All' && p.markets[selectedMarket]
              ? p.markets[selectedMarket]!
              : p.todayPrice;

          const isSugarPitchItem = p.id === 'sugar';

          return (
            <div
              key={p.id}
              onClick={() => {
                triggerHaptic('light');
                onSelectProduct(p);
              }}
              className={`bg-cream-card rounded-card p-3 border transition-all duration-150 cursor-pointer hover:shadow-md active:scale-[0.99] relative ${
                isSugarPitchItem
                  ? 'border-teal-action/60 ring-1 ring-teal-action/30 shadow-card'
                  : 'border-[#E3D9C4] shadow-card'
              }`}
            >
              {isSugarPitchItem && (
                <div className="absolute -top-2.5 right-3 bg-gold-highlight text-ink text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-white">
                  <span>{t.priceBoard.pitchHeroBadge}</span>
                </div>
              )}

              <div className="flex items-start justify-between gap-2">
                {/* Left info */}
                <div className="flex items-start gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#EFE8D6] flex items-center justify-center text-xl shrink-0 shadow-xs border border-[#DFD3BA]">
                    {p.icon}
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-ink leading-tight">
                      {lang === 'uz' ? p.nameUz : lang === 'ru' ? p.nameRu : p.nameEn}
                    </h4>
                    <p className="text-[11px] text-ink-muted mt-0.5">
                      Min: <span className="font-semibold text-ink">{p.volumeMin}</span> • {p.markets["Chorsu"] ? "Chorsu" : "Food City"}
                    </p>

                    {/* Fair range indicator */}
                    <div className="mt-1.5 flex items-center gap-1 text-[10px]">
                      <span className="text-ink-muted">{t.priceBoard.fairCorridor}</span>
                      <span className="font-semibold text-teal-action bg-[#E8F3F1] px-1.5 py-0.2 rounded border border-teal-action/20">
                        {formatUZS(p.fairMin, false)} - {formatUZS(p.fairMax, false)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right price and change */}
                <div className="text-right shrink-0">
                  <div className="text-base font-bold font-serif text-ink tracking-tight">
                    {formatUZS(displayPrice)}
                  </div>
                  <div className="text-[10px] text-ink-muted -mt-0.5">/{p.unit}</div>

                  {/* 7-day change badge */}
                  <div className="mt-1.5 flex items-center justify-end">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                        change.isDrop
                          ? 'bg-[#EBF7F0] text-[#167E51] border border-[#167E51]/20'
                          : 'bg-[#FCEBEB] text-danger border border-danger/20'
                      }`}
                    >
                      {change.text}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pool Discount Teaser row */}
              <div className="mt-2.5 pt-2 border-t border-[#EFE7D4] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-teal-action">
                  <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="text-[11px] font-semibold">
                    {t.priceBoard.withPool} <strong className="text-ink font-bold">{formatUZS(p.poolPrice)}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-0.5 text-teal-action font-bold text-[11px]">
                  <span>{t.priceBoard.compareAction}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="bg-cream-card rounded-card p-6 text-center border border-[#E3D9C4]">
            <p className="text-xs text-ink-muted">"{searchQuery}" {t.priceBoard.noResults}</p>
            <button
              onClick={() => onSearchChange('')}
              className="mt-2 text-xs text-teal-action font-bold underline"
            >
              {t.priceBoard.clearSearch}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
