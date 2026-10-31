import React from 'react';
import { GroupPool, Language, ShopOwnerProfile } from '../types';
import { translations } from '../i18n';
import { formatUZS } from '../utils/format';
import { REAL_DECK_NUMBERS } from '../data/mock';
import { Users, Truck, ShieldCheck, CheckCircle2, Lock, ArrowRight, Store, Clock } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  pool: GroupPool;
  lang: Language;
  onPayToEscrow: () => void;
  shopProfile?: ShopOwnerProfile;
}

export const GroupOrderScreen: React.FC<Props> = ({
  pool,
  lang,
  onPayToEscrow,
  shopProfile
}) => {
  const t = translations[lang];
  const { oldWay, pooledWay, savings } = REAL_DECK_NUMBERS;

  const currentCount = pool.participants.length; // 5 shops
  const maxSlots = 5;

  return (
    <div className="space-y-4 pb-12">
      {/* Pool Header Card */}
      <div className="bg-gradient-to-br from-[#0B6B62] to-[#08524B] text-white rounded-card p-4 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1 bg-[#E3B341] text-ink text-[10px] font-black px-2.5 py-0.5 rounded-full">
            <Users className="w-3 h-3 text-ink" />
            <span>{t.groupOrder.poolBadge}</span>
          </div>
          <span className="text-[11px] text-[#D0ECE7] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{t.groupOrder.minutesLeft}</span>
          </span>
        </div>

        <h2 className="font-serif font-bold text-lg leading-tight">
          {pool.name}
        </h2>
        <p className="text-xs text-[#CFECE6] mt-0.5">
          {pool.district} • Klaster #CH-902
        </p>

        {/* Tier Progress bar */}
        <div className="mt-4 bg-black/25 rounded-xl p-3 border border-white/10">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-white/90">
              {t.groupOrder.progressSlots}: <strong className="text-[#E3B341]">{currentCount} / {maxSlots} ta</strong>
            </span>
            <span className="text-[11px] font-bold text-[#E3B341] bg-white/10 px-2 py-0.5 rounded">
              {t.groupOrder.tier1Cheapest}
            </span>
          </div>

          <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden flex">
            <div
              className="bg-gradient-to-r from-[#E3B341] to-[#F7D479] h-full rounded-full transition-all duration-500"
              style={{ width: `${(currentCount / maxSlots) * 100}%` }}
            />
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-2 text-[10px] text-[#DCEFEA] pt-1 border-t border-white/10">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-white/40"></span>
              <span>{t.groupOrder.tier3Desc}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-[#E3B341]">
              <span className="w-2 h-2 rounded-full bg-[#E3B341]"></span>
              <span>{t.groupOrder.tier5Desc}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Shop Slots Visualization */}
      <div className="bg-cream-card rounded-card p-3.5 border border-[#E3D9C4] shadow-card">
        <h3 className="font-serif font-bold text-xs text-ink mb-2.5 uppercase tracking-wider flex items-center gap-1.5">
          <Store className="w-3.5 h-3.5 text-teal-action" />
          <span>{t.groupOrder.shopsInPoolTitle}</span>
        </h3>

        <div className="space-y-2">
          {pool.participants.map((p, idx) => (
            <div
              key={p.id}
              className={`flex items-center justify-between p-2.5 rounded-xl text-xs border ${
                p.isCurrentUser
                  ? 'bg-[#E8F3F1] border-teal-action/50 shadow-xs'
                  : 'bg-[#F9F5EC] border-[#E8DEC9]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-serif font-black text-xs ${
                    p.isCurrentUser
                      ? 'bg-teal-action text-white'
                      : 'bg-[#E7DFC8] text-ink'
                  }`}
                >
                  {idx + 1}
                </div>
                <div>
                  <div className="font-serif font-bold text-ink flex items-center gap-1.5">
                    <span>
                      {p.isCurrentUser
                        ? (shopProfile?.shopName || shopProfile?.name || p.name)
                        : p.name}
                    </span>
                    {p.isCurrentUser && (
                      <span className="text-[9px] bg-teal-action text-white px-1.5 py-0.2 rounded font-bold">
                        {t.groupOrder.you}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-ink-muted">
                    {p.isCurrentUser
                      ? (shopProfile?.district || p.mahalla)
                      : p.mahalla} • {p.item} ({p.qty} {p.unit})
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-[#167E51] bg-[#EBF7F0] px-2 py-0.5 rounded-full border border-[#167E51]/20 flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3 text-[#167E51]" />
                  <span>{t.groupOrder.joined}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Lines (Exact Pitch Deck Numbers) */}
      <div className="bg-cream-card rounded-card p-3.5 border border-[#E3D9C4] shadow-card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-serif font-bold text-sm text-ink">
            {t.groupOrder.basketTitle}
          </h3>
          <span className="text-[10px] text-ink-muted font-semibold bg-[#EDE4D0] px-2 py-0.5 rounded">
            {t.groupOrder.volumeDiscount}
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          {/* Sugar */}
          <div className="p-2.5 rounded-xl bg-[#F6F0E3] border border-[#E6DDCA]">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-serif font-bold text-ink">{t.groupOrder.sugarItem}</span>
                <p className="text-[11px] text-ink-muted">500 kg × 11 400 UZS</p>
                <p className="text-[10px] text-danger/80 line-through">{t.groupOrder.oldPrefix} 500 × 12 800 = 6 400 000 UZS</p>
              </div>
              <div className="text-right">
                <span className="font-serif font-bold text-sm text-teal-action">
                  {formatUZS(pooledWay.sugar.total)}
                </span>
                <p className="text-[10px] font-bold text-[#167E51]">
                  -{formatUZS(oldWay.sugar.total - pooledWay.sugar.total)}
                </p>
              </div>
            </div>
          </div>

          {/* Flour */}
          <div className="p-2.5 rounded-xl bg-[#F6F0E3] border border-[#E6DDCA]">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-serif font-bold text-ink">{t.groupOrder.flourItem}</span>
                <p className="text-[11px] text-ink-muted">15 qop × 255 000 UZS</p>
                <p className="text-[10px] text-danger/80 line-through">{t.groupOrder.oldPrefix} 15 × 280 000 = 4 200 000 UZS</p>
              </div>
              <div className="text-right">
                <span className="font-serif font-bold text-sm text-teal-action">
                  {formatUZS(pooledWay.flour.total)}
                </span>
                <p className="text-[10px] font-bold text-[#167E51]">
                  -{formatUZS(oldWay.flour.total - pooledWay.flour.total)}
                </p>
              </div>
            </div>
          </div>

          {/* Cooking Oil */}
          <div className="p-2.5 rounded-xl bg-[#F6F0E3] border border-[#E6DDCA]">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-serif font-bold text-ink">{t.groupOrder.oilItem}</span>
                <p className="text-[11px] text-ink-muted">60 dona × 71 500 UZS</p>
                <p className="text-[10px] text-danger/80 line-through">{t.groupOrder.oldPrefix} 60 × 78 000 = 4 680 000 UZS</p>
              </div>
              <div className="text-right">
                <span className="font-serif font-bold text-sm text-teal-action">
                  {formatUZS(pooledWay.oil.total)}
                </span>
                <p className="text-[10px] font-bold text-[#167E51]">
                  -{formatUZS(oldWay.oil.total - pooledWay.oil.total)}
                </p>
              </div>
            </div>
          </div>

          {/* Shared Labo Van Delivery */}
          <div className="p-2.5 rounded-xl bg-[#E8F3F1] border border-teal-action/30">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-teal-action mt-0.5" />
                <div>
                  <span className="font-serif font-bold text-ink">{t.groupOrder.sharedVanTitle}</span>
                  <p className="text-[11px] text-ink-muted">{t.groupOrder.sharedVanDesc}</p>
                  <p className="text-[10px] text-danger/80 line-through">{t.groupOrder.aloneTruckDesc}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-serif font-bold text-sm text-teal-action">
                  {formatUZS(pooledWay.sharedVan)}
                </span>
                <p className="text-[10px] font-bold text-[#167E51]">
                  -375 000 UZS
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Summary */}
        <div className="mt-3.5 pt-3 border-t-2 border-[#E5DEC9] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-ink uppercase tracking-wider">
              {t.groupOrder.totalTitle}
            </span>
            <p className="text-[11px] text-ink-muted line-through">
              {t.groupOrder.oldPrefix} {formatUZS(oldWay.totalCost)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-black font-serif text-teal-action">
              {formatUZS(pooledWay.totalCost)}
            </div>
            <div className="text-xs font-extrabold text-[#167E51] bg-[#EBF7F0] px-2 py-0.5 rounded border border-[#167E51]/20 inline-block mt-0.5">
              {t.groupOrder.savingsPrefix} {formatUZS(savings.moneyUZS)} (-{savings.percent}%)
            </div>
          </div>
        </div>
      </div>

      {/* Escrow Trust Information */}
      <div className="bg-[#FAF6EC] border border-[#E7D6A7] rounded-xl p-3 flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-teal-action shrink-0 mt-0.5" />
        <div className="text-xs text-ink-muted leading-snug">
          <strong className="text-ink font-bold block mb-0.5">{t.groupOrder.escrowGuaranteeTitle}</strong>
          {t.groupOrder.escrowSafety}
        </div>
      </div>

      {/* Big Main CTA Button */}
      <button
        onClick={() => {
          triggerHaptic('success');
          onPayToEscrow();
        }}
        className="w-full min-h-[52px] bg-teal-action hover:bg-teal-hover text-white font-serif font-bold text-base rounded-xl shadow-float flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
      >
        <Lock className="w-4 h-4" />
        <span>{t.groupOrder.payEscrowBtn}</span>
      </button>
    </div>
  );
};
