import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n';

interface Props {
  lang: Language;
}

export const SampleDataFooter: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];

  return (
    <footer className="mt-8 mb-20 px-4 text-center">
      <div className="inline-block bg-[#EFE8D6] border border-[#DDD3BC] rounded-lg px-3 py-1.5">
        <p className="text-[10px] text-ink-muted">
          {t.priceBoard.disclaimer}
        </p>
        <p className="text-[9px] text-[#8C7D68] mt-0.5">
          BozorNarx v1.0 • Lumora Competition Demo • Tashkent 2026
        </p>
      </div>
    </footer>
  );
};
