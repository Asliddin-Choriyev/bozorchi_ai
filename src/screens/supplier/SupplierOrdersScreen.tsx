import React from 'react';
import { Language, PoolOrder } from '../../types';
import { translations } from '../../i18n';
import { formatUZS } from '../../utils/format';
import { Truck, ShieldCheck, CheckCircle2, ChevronRight, Clock, Store, MapPin } from 'lucide-react';
import { triggerHaptic } from '../../utils/telegram';

interface Props {
  lang: Language;
  poolOrder: PoolOrder;
  onSelectOrder: () => void;
  onDispatchTruck: () => void;
}

export const SupplierOrdersScreen: React.FC<Props> = ({
  lang,
  poolOrder,
  onSelectOrder,
  onDispatchTruck
}) => {
  const t = translations[lang];

  const canDispatch =
    poolOrder.status === 'escrow_verified' ||
    poolOrder.status === 'truck_departed' ||
    poolOrder.status === 'delivered' ||
    poolOrder.status === 'payout_released';

  const isDispatched =
    poolOrder.status === 'truck_departed' ||
    poolOrder.status === 'delivered' ||
    poolOrder.status === 'payout_released';

  return (
    <div className="space-y-3.5 pb-20">
      {/* Header */}
      <div className="px-1 flex items-center justify-between">
        <div>
          <h2 className="font-serif font-bold text-base text-ink">
            {t.supplier.orders.title}
          </h2>
          <p className="text-xs text-ink-muted">
            Do'kondorlar klasterlaridan kelgan ulgurji talablar
          </p>
        </div>
        <span className="text-[10px] font-bold text-teal-action bg-[#E8F3F1] px-2 py-0.5 rounded-full border border-teal-action/20">
          1 ta yangi buyurtma
        </span>
      </div>

      {/* Main Incoming Pool Order Card */}
      <div className="bg-cream-card rounded-[14px] p-4 border-2 border-teal-action/60 shadow-card space-y-3 relative overflow-hidden">
        {/* Tier badge & Escrow tag */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1 bg-gold-highlight text-ink text-[10px] font-black px-2 py-0.5 rounded-full">
            <span>{t.supplier.orders.tierLabel} (5 do'kon)</span>
          </div>

          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
              poolOrder.status === 'payout_released'
                ? 'bg-[#EBF7F0] text-[#167E51] border-[#167E51]/20'
                : 'bg-gold-light text-[#8C6D1F] border-gold-highlight/30'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>
              {poolOrder.status === 'payout_released'
                ? t.supplier.orders.deliveredBadge
                : isDispatched
                ? t.supplier.orders.dispatchedBadge
                : t.supplier.orders.escrowVerifiedBadge}
            </span>
          </span>
        </div>

        {/* Order Details Header */}
        <div>
          <h3 className="font-serif font-bold text-base text-ink">
            {poolOrder.poolName}
          </h3>
          <p className="text-xs text-ink-muted">
            {poolOrder.cluster}
          </p>
        </div>

        {/* Products List Breakdown */}
        <div className="bg-[#FAF6EC] rounded-xl p-3 border border-[#E8DEC9] space-y-1.5 text-xs">
          <div className="font-bold text-[11px] text-ink-muted uppercase tracking-wider pb-1 border-b border-[#EAE0CF]">
            Buyurtma tarkibi:
          </div>
          {poolOrder.itemsDetail.map((item, idx) => (
            <div key={idx} className="flex justify-between py-0.5">
              <span className="font-medium text-ink">
                {item.name} ({item.qty})
              </span>
              <span className="font-serif font-bold text-teal-action">
                {formatUZS(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>

        {/* Route info */}
        <div className="p-2.5 rounded-xl bg-[#E8F3F1] border border-teal-action/20 flex items-center gap-2 text-xs">
          <Truck className="w-4 h-4 text-teal-action shrink-0" />
          <div className="text-[11px]">
            <span className="font-bold text-ink block">{poolOrder.routeDescription}</span>
            <span className="text-teal-action">Yuk mashinasi: {poolOrder.laboPlate} ({poolOrder.driverName})</span>
          </div>
        </div>

        {/* Total & Action Button */}
        <div className="pt-2 border-t border-[#EDE4D0] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-ink-muted uppercase font-bold block">
              Jami to'lov:
            </span>
            <span className="text-lg font-serif font-black text-teal-action">
              {formatUZS(poolOrder.totalAmount)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isDispatched ? (
              <button
                onClick={() => {
                  triggerHaptic('success');
                  onDispatchTruck();
                }}
                disabled={!canDispatch}
                className="min-h-[42px] px-3.5 bg-teal-action hover:bg-teal-hover disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{t.supplier.orders.dispatchBtn}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  triggerHaptic('light');
                  onSelectOrder();
                }}
                className="min-h-[42px] px-3.5 bg-cream-card border border-teal-action text-teal-action font-bold text-xs rounded-xl flex items-center gap-1 active:scale-95 transition-all"
              >
                <span>Bosqichlar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
