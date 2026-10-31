import React, { useState } from 'react';
import { Language, ShopOwnerProfile } from '../types';
import { translations } from '../i18n';
import { REAL_DECK_NUMBERS } from '../data/mock';
import { formatUZS } from '../utils/format';
import { Sparkles, Share2, Check, Clock, TrendingDown, ArrowRight, RotateCcw } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  lang: Language;
  onRestart: () => void;
  shopProfile?: ShopOwnerProfile;
}

export const SavingsResultScreen: React.FC<Props> = ({ lang, onRestart, shopProfile }) => {
  const t = translations[lang];
  const { oldWay, pooledWay, savings } = REAL_DECK_NUMBERS;
  const [copied, setCopied] = useState(false);

  const displayShopName = shopProfile?.shopName || shopProfile?.name || "Do'konimiz";
  const displayDistrict = shopProfile?.district || "Chilonzor-9";

  const shareText = `📊 Bozorchi AI bilan xarid natijam:\n🏪 ${displayShopName} (${displayDistrict})\n💰 1 840 000 UZS tejaldi (-11.7%)\n⏱ 15 soat 45 daqiqa tejaldi!\nJami: 13 890 000 UZS (oldin 15 730 000 UZS edi).\nKlasterda birgalikda xarid qildik! 🚀`;

  const handleShare = () => {
    triggerHaptic('success');
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      try {
        const tgUrl = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/BozorchiAiBot')}&text=${encodeURIComponent(shareText)}`;
        window.Telegram.WebApp.openTelegramLink(tgUrl);
        return;
      } catch (e) {
        // fallback
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Toast */}
      {copied && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-[360px] mx-auto bg-[#167E51] text-white p-3 rounded-xl shadow-float flex items-center justify-center gap-2 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4" />
          <span>{t.savings.copiedToast}</span>
        </div>
      )}

      {/* Hero Savings Trophy Banner */}
      <div className="bg-gradient-to-br from-[#0B6B62] via-[#095E56] to-[#06423C] text-white rounded-card p-5 text-center shadow-card relative overflow-hidden border border-gold-highlight/30">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-[#E3B341] text-ink flex items-center justify-center text-3xl shadow-sm mb-2">
          🏆
        </div>

        <div className="inline-flex items-center gap-1 bg-[#E3B341] text-ink text-[11px] font-black px-3 py-0.5 rounded-full mb-1">
          <span>{displayShopName} — {displayDistrict}</span>
        </div>

        <h2 className="font-serif font-black text-2xl text-white mt-1">
          {formatUZS(savings.moneyUZS)}
        </h2>
        <p className="text-xs text-[#E3B341] font-bold">
          {t.savings.highlightSaved}
        </p>

        {/* Time Saved Pill */}
        <div className="mt-3 inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-xs text-[#D8EFEB]">
          <Clock className="w-3.5 h-3.5 text-[#E3B341]" />
          <span>{t.savings.timeSaved} ({t.savings.timeSavedTrip})</span>
        </div>
      </div>

      {/* Before vs After Side-by-Side Comparison */}
      <div className="bg-cream-card rounded-card p-4 border border-[#E3D9C4] shadow-card">
        <h3 className="font-serif font-bold text-sm text-ink mb-3 text-center">
          {t.savings.comparisonTitle}
        </h3>

        <div className="space-y-3 text-xs">
          {/* Sugar Comparison */}
          <div className="p-2.5 rounded-xl bg-[#F6F0E4] border border-[#E5DBCA]">
            <div className="flex justify-between items-center mb-1">
              <span className="font-serif font-bold text-ink">1. {t.savings.sugarRow}</span>
              <span className="text-[10px] font-bold text-[#167E51] bg-[#EBF7F0] px-1.5 py-0.2 rounded">
                -700 000 UZS
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#EAE0CF]">
              <div>
                <span className="text-ink-muted block text-[10px]">{t.savings.oldWayTitle}:</span>
                <span className="line-through text-danger/80">
                  {formatUZS(oldWay.sugar.total)} (12 800)
                </span>
              </div>
              <div className="text-right">
                <span className="text-teal-action font-semibold block text-[10px]">{t.savings.pooledWayTitle}:</span>
                <span className="font-bold text-teal-action font-serif">
                  {formatUZS(pooledWay.sugar.total)} (11 400)
                </span>
              </div>
            </div>
          </div>

          {/* Flour Comparison */}
          <div className="p-2.5 rounded-xl bg-[#F6F0E4] border border-[#E5DBCA]">
            <div className="flex justify-between items-center mb-1">
              <span className="font-serif font-bold text-ink">2. {t.savings.flourRow}</span>
              <span className="text-[10px] font-bold text-[#167E51] bg-[#EBF7F0] px-1.5 py-0.2 rounded">
                -375 000 UZS
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#EAE0CF]">
              <div>
                <span className="text-ink-muted block text-[10px]">{t.savings.oldWayTitle}:</span>
                <span className="line-through text-danger/80">
                  {formatUZS(oldWay.flour.total)} (280 000)
                </span>
              </div>
              <div className="text-right">
                <span className="text-teal-action font-semibold block text-[10px]">{t.savings.pooledWayTitle}:</span>
                <span className="font-bold text-teal-action font-serif">
                  {formatUZS(pooledWay.flour.total)} (255 000)
                </span>
              </div>
            </div>
          </div>

          {/* Cooking Oil Comparison */}
          <div className="p-2.5 rounded-xl bg-[#F6F0E4] border border-[#E5DBCA]">
            <div className="flex justify-between items-center mb-1">
              <span className="font-serif font-bold text-ink">3. {t.savings.oilRow}</span>
              <span className="text-[10px] font-bold text-[#167E51] bg-[#EBF7F0] px-1.5 py-0.2 rounded">
                -390 000 UZS
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[#EAE0CF]">
              <div>
                <span className="text-ink-muted block text-[10px]">{t.savings.oldWayTitle}:</span>
                <span className="line-through text-danger/80">
                  {formatUZS(oldWay.oil.total)} (78 000)
                </span>
              </div>
              <div className="text-right">
                <span className="text-teal-action font-semibold block text-[10px]">{t.savings.pooledWayTitle}:</span>
                <span className="font-bold text-teal-action font-serif">
                  {formatUZS(pooledWay.oil.total)} (71 500)
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Comparison */}
          <div className="p-2.5 rounded-xl bg-[#E8F3F1] border border-teal-action/30">
            <div className="flex justify-between items-center mb-1">
              <span className="font-serif font-bold text-ink">4. {t.savings.deliveryRow}</span>
              <span className="text-[10px] font-bold text-[#167E51] bg-[#EBF7F0] px-1.5 py-0.2 rounded">
                -375 000 UZS
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-teal-action/10">
              <div>
                <span className="text-ink-muted block text-[10px]">{t.savings.aloneTruck}</span>
                <span className="line-through text-danger/80">
                  {formatUZS(oldWay.deliveryTruck)}
                </span>
              </div>
              <div className="text-right">
                <span className="text-teal-action font-semibold block text-[10px]">{t.savings.sharedLabo}</span>
                <span className="font-bold text-teal-action font-serif">
                  {formatUZS(pooledWay.sharedVan)}
                </span>
              </div>
            </div>
          </div>

          {/* Grand Totals */}
          <div className="pt-3 border-t-2 border-[#E1D6C0] space-y-1.5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-serif font-bold text-ink-muted">{t.savings.oldTotal}</span>
              <span className="font-serif font-bold line-through text-danger/90">
                {formatUZS(oldWay.totalCost)} ({t.savings.hours16})
              </span>
            </div>
            <div className="flex justify-between items-center text-base">
              <span className="font-serif font-extrabold text-teal-action">{t.savings.withBozorchi}</span>
              <span className="font-serif font-black text-teal-action text-lg">
                {formatUZS(pooledWay.totalCost)} ({t.savings.mins15})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Share and Restart Buttons */}
      <div className="space-y-2.5 pt-1">
        <button
          onClick={handleShare}
          className="w-full min-h-[50px] bg-[#E3B341] hover:bg-[#F3C759] text-ink font-serif font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
        >
          <Share2 className="w-4 h-4 stroke-[2.5]" />
          <span>{t.savings.shareBtn}</span>
        </button>

        <button
          onClick={() => {
            triggerHaptic('light');
            onRestart();
          }}
          className="w-full min-h-[46px] bg-cream-card border border-[#D5C9AE] text-ink hover:bg-[#EFE8D6] font-bold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.savings.backToBoard}</span>
        </button>
      </div>
    </div>
  );
};
