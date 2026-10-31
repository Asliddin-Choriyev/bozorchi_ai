import React from 'react';
import { Language, PoolOrder, ShopOwnerProfile } from '../../types';
import { translations } from '../../i18n';
import { formatUZS } from '../../utils/format';
import { Truck, CheckCircle2, Clock, ShieldCheck, ArrowRight, UserCheck, Check } from 'lucide-react';
import { triggerHaptic } from '../../utils/telegram';

interface Props {
  lang: Language;
  poolOrder: PoolOrder;
  onDispatchTruck: () => void;
  onNavigateResult: () => void;
  shopProfile?: ShopOwnerProfile;
}

export const SupplierOrderDetailScreen: React.FC<Props> = ({
  lang,
  poolOrder,
  onDispatchTruck,
  onNavigateResult,
  shopProfile
}) => {
  const t = translations[lang];

  // Helper to check step completion
  const getStepStatus = (step: number): 'done' | 'current' | 'waiting' => {
    switch (poolOrder.status) {
      case 'open':
        return step === 1 ? 'current' : 'waiting';
      case 'escrow_verified':
        return step <= 2 ? 'done' : step === 3 ? 'current' : 'waiting';
      case 'truck_departed':
        return step <= 3 ? 'done' : step === 4 ? 'current' : 'waiting';
      case 'delivered':
        return step <= 4 ? 'done' : 'current';
      case 'payout_released':
        return 'done';
      default:
        return 'waiting';
    }
  };

  const firstShopName = shopProfile?.name || shopProfile?.shopName || "Do'kon";

  const steps = [
    {
      num: 1,
      title: t.supplier.orderDetail.step1,
      subtitle: `5 ta do'kon (${firstShopName}, Farhod, Navro'z, Oqtepa, Nurziyo)`,
      time: poolOrder.createdAt || '10:20',
    },
    {
      num: 2,
      title: t.supplier.orderDetail.step2,
      subtitle: '13 890 000 UZS Bozorchi AI eskrou hisobida muzlatildi',
      time: poolOrder.escrowVerifiedAt || '10:25',
    },
    {
      num: 3,
      title: t.supplier.orderDetail.step3,
      subtitle: `Sanjarbek (${poolOrder.laboPlate}) yukni ombordan qabul qildi`,
      time: poolOrder.departedAt || (poolOrder.status !== 'escrow_verified' ? '10:45' : 'Kutilmoqda'),
    },
    {
      num: 4,
      title: t.supplier.orderDetail.step4,
      subtitle: 'Chilonzor 9-mavze, 1.5 km marshrut bo\'ylab yetkazilmoqda',
      time: poolOrder.deliveredAt || (poolOrder.status === 'delivered' || poolOrder.status === 'payout_released' ? '11:45' : 'Kutilmoqda'),
    },
    {
      num: 5,
      title: t.supplier.orderDetail.step5,
      subtitle: 'BozorVision AI skanerdan so\'ng 13 723 320 UZS tushdi',
      time: poolOrder.payoutReleasedAt || (poolOrder.status === 'payout_released' ? '11:48' : 'Kutilmoqda'),
    },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* Header Summary */}
      <div className="bg-[#0A1714] text-white rounded-[14px] p-4 border border-gold-highlight/40 shadow-card">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-gold-highlight font-black uppercase tracking-wider">
            {poolOrder.id}
          </span>
          <span className="text-[11px] text-[#A6B8B4]">Chilonzor-9 klasteri</span>
        </div>

        <h2 className="font-serif font-bold text-lg text-white">
          {poolOrder.poolName}
        </h2>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-xl font-serif font-black text-gold-highlight">
            {formatUZS(poolOrder.totalAmount)}
          </span>
          <span className="text-xs text-[#A6B8B4]">(Eskrou kafolatlangan)</span>
        </div>
      </div>

      {/* 5 Fulfillment Steps Timeline */}
      <div className="bg-cream-card rounded-[14px] p-4 border border-[#E3D9C4] shadow-card">
        <h3 className="font-serif font-bold text-xs text-ink uppercase tracking-wider mb-3">
          {t.supplier.orderDetail.title}
        </h3>

        <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E5DEC9]">
          {steps.map((s) => {
            const status = getStepStatus(s.num);
            const isDone = status === 'done';
            const isCurrent = status === 'current';

            return (
              <div key={s.num} className="flex items-start gap-3 relative z-10 text-xs">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                    isDone
                      ? 'bg-[#167E51] text-white ring-4 ring-[#EBF7F0]'
                      : isCurrent
                      ? 'bg-gold-highlight text-ink ring-4 ring-[#FCF5E2] animate-pulse'
                      : 'bg-[#E5DEC9] text-ink-muted'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                </div>

                <div className="flex-1 pt-0.5">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`font-serif font-bold ${
                        isDone || isCurrent ? 'text-ink' : 'text-ink-muted'
                      }`}
                    >
                      {s.title}
                    </h4>
                    <span className="text-[10px] text-ink-muted font-medium">{s.time}</span>
                  </div>
                  <p className="text-[11px] text-ink-muted mt-0.5 leading-snug">
                    {s.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        {poolOrder.status === 'escrow_verified' && (
          <button
            onClick={() => {
              triggerHaptic('success');
              onDispatchTruck();
            }}
            className="w-full min-h-[50px] bg-teal-action hover:bg-teal-hover text-white font-serif font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
          >
            <Truck className="w-4 h-4" />
            <span>{t.supplier.orderDetail.dispatchTruckAction}</span>
          </button>
        )}

        {poolOrder.status === 'truck_departed' && (
          <div className="p-3 rounded-xl bg-[#E8F3F1] border border-teal-action/40 text-center text-xs text-teal-action font-bold">
            🚚 Labo mashinasi yo'lda (Sanjarbek). Do'kondor fakturani skanerlagach, to'lov darhol yechiladi!
          </div>
        )}

        <button
          onClick={() => {
            triggerHaptic('medium');
            onNavigateResult();
          }}
          className="w-full min-h-[46px] bg-gradient-to-r from-gold-highlight to-[#F3C759] text-ink font-serif font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
        >
          <span>{t.supplier.orderDetail.seeResultsAction}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
