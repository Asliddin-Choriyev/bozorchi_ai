import React from 'react';
import { Market, Language } from '../types';
import { translations } from '../i18n';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  selectedMarket: Market;
  onSelect: (market: Market) => void;
  lang: Language;
}

export const MarketChips: React.FC<Props> = ({ selectedMarket, onSelect, lang }) => {
  const t = translations[lang];

  const chips: { key: Market; label: string }[] = [
    { key: 'All', label: t.markets.all },
    { key: 'Chorsu', label: t.markets.chorsu },
    { key: "O'rikzor", label: t.markets.orikzor },
    { key: 'Food City', label: t.markets.foodcity },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none no-scrollbar py-1">
      {chips.map((chip) => {
        const isSelected = selectedMarket === chip.key;
        return (
          <button
            key={chip.key}
            onClick={() => {
              triggerHaptic('light');
              onSelect(chip.key);
            }}
            className={`min-h-[44px] px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center justify-center border ${
              isSelected
                ? 'bg-teal-action text-white border-teal-action shadow-sm'
                : 'bg-cream-card text-ink border-[#E2D8C3] hover:border-teal-action/40'
            }`}
          >
            {chip.label}
          </button>
        );
      })}
    </div>
  );
};
