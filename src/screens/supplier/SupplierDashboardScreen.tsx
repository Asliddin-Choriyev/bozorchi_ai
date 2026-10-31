import React from 'react';
import { Language, PoolOrder, FlashDeal } from '../../types';
import { translations } from '../../i18n';
import { formatUZS } from '../../utils/format';
import {
  Truck,
  TrendingUp,
  Clock,
  Zap,
  ShieldCheck,
  FileText,
  ArrowRight,
  PackageCheck,
  CheckCircle2,
  AlertTriangle,
  Store
} from 'lucide-react';
import { triggerHaptic } from '../../utils/telegram';

interface Props {
  lang: Language;
  poolOrder: PoolOrder;
  flashDeal: FlashDeal;
  onNavigatePrices: () => void;
  onNavigateFlash: () => void;
  onNavigateOrderDetail: () => void;
}

export const SupplierDashboardScreen: React.FC<Props> = ({
  lang,
  poolOrder,
  flashDeal,
  onNavigatePrices,
  onNavigateFlash,
  onNavigateOrderDetail
}) => {
  const t = translations[lang];

  return (
    <div className="space-y-3.5 pb-16">
      {/* Supplier Profile Banner */}
      <div className="bg-[#0A1714] text-white rounded-[14px] p-4 border border-gold-highlight/40 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1 bg-gold-highlight text-ink text-[10px] font-black px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3 text-ink" />
            <span>Verified Wholesale Supplier</span>
          </div>
          <span className="text-[10px] text-[#A6B8B4]">O'rikzor 4-blok, 12-ombor</span>
        </div>

        <h2 className="font-serif font-bold text-lg text-white">
          {t.supplier.dashboard.welcome}
        </h2>
        <p className="text-xs text-[#C5D5D1] mt-0.5">
          Bugungi kunda Toshkent bo'yicha 12 ta klaster sizning ulgurji zaxirangizga ulangan.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-white/10">
          <button
            onClick={() => {
              triggerHaptic('light');
              onNavigatePrices();
            }}
            className="min-h-[44px] bg-[#1B2925] hover:bg-[#253934] text-white font-bold text-xs rounded-xl border border-white/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-gold-highlight" />
            <span>{t.supplier.dashboard.updatePricesBtn}</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('medium');
              onNavigateFlash();
            }}
            className="min-h-[44px] bg-gradient-to-r from-gold-highlight to-[#F3C759] text-ink font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Zap className="w-3.5 h-3.5 fill-ink" />
            <span>{t.supplier.dashboard.broadcastFlashBtn}</span>
          </button>
        </div>
      </div>

      {/* Stock Incoming Alert Banner */}
      <div className="bg-[#FFF8E6] border-2 border-gold-highlight/80 rounded-[14px] p-3.5 shadow-card flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-gold-highlight text-ink flex items-center justify-center shrink-0 shadow-xs font-bold text-lg">
          🚚
        </div>
        <div className="flex-1">
          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8C6D1F] bg-gold-highlight/30 px-2 py-0.2 rounded mb-0.5">
            <span>Logistika bildirishnomasi</span>
          </div>
          <h4 className="font-serif font-bold text-xs text-ink">
            {t.supplier.dashboard.stockAlert}
          </h4>
          <p className="text-[11px] text-[#785B0D] mt-0.5 leading-snug">
            {t.supplier.dashboard.stockAlertDesc}
          </p>
          <button
            onClick={() => {
              triggerHaptic('light');
              onNavigateFlash();
            }}
            className="mt-2 text-xs font-bold text-teal-action underline flex items-center gap-1"
          >
            <span>2 soatlik chegirma e'lon qilish</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 4 Summary Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Open Pool Orders */}
        <div className="bg-cream-card rounded-[14px] p-3 border border-[#E3D9C4] shadow-card">
          <div className="flex items-center justify-between text-ink-muted text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider">Guruh Buyurtmalari</span>
            <Store className="w-4 h-4 text-teal-action" />
          </div>
          <div className="text-xl font-serif font-black text-ink mt-1">
            1 ta klaster
          </div>
          <p className="text-[10px] text-teal-action font-semibold mt-0.5">5 ta baqqol birlashgan</p>
        </div>

        {/* Stock on Hand */}
        <div className="bg-cream-card rounded-[14px] p-3 border border-[#E3D9C4] shadow-card">
          <div className="flex items-center justify-between text-ink-muted text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider">Kutilayotgan Yuk</span>
            <PackageCheck className="w-4 h-4 text-gold-highlight" />
          </div>
          <div className="text-xl font-serif font-black text-ink mt-1">
            25 tonna
          </div>
          <p className="text-[10px] text-ink-muted mt-0.5">Shakar (Xorazm/Rossiya)</p>
        </div>

        {/* Escrow Balance */}
        <div className="bg-cream-card rounded-[14px] p-3 border border-[#E3D9C4] shadow-card">
          <div className="flex items-center justify-between text-ink-muted text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider">Eskrou Mablag'i</span>
            <ShieldCheck className="w-4 h-4 text-[#167E51]" />
          </div>
          <div className="text-base font-serif font-bold text-teal-action mt-1">
            {formatUZS(poolOrder.totalAmount)}
          </div>
          <p className="text-[10px] text-[#167E51] font-semibold mt-0.5">Mablag' tasdiqlangan ✓</p>
        </div>

        {/* Active Flash Deals */}
        <div className="bg-cream-card rounded-[14px] p-3 border border-[#E3D9C4] shadow-card">
          <div className="flex items-center justify-between text-ink-muted text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider">Aktiv Aksiya</span>
            <Zap className="w-4 h-4 text-gold-highlight" />
          </div>
          <div className="text-xl font-serif font-black text-ink mt-1">
            {flashDeal.isActive ? '11 400 UZS' : 'Faol emas'}
          </div>
          <p className="text-[10px] text-ink-muted mt-0.5">48 do'konga bildirilgan</p>
        </div>
      </div>

      {/* Incoming Order Spotlight Card */}
      <div className="bg-cream-card rounded-[14px] p-3.5 border-2 border-teal-action/50 shadow-card space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-action animate-ping"></span>
            <h3 className="font-serif font-bold text-sm text-ink">
              {t.supplier.dashboard.ordersReadyTitle}
            </h3>
          </div>
          <span className="text-[10px] font-bold text-[#167E51] bg-[#EBF7F0] px-2 py-0.5 rounded-full border border-[#167E51]/20">
            {poolOrder.status === 'payout_released'
              ? 'To\'lov yechildi ✓'
              : poolOrder.status === 'delivered'
              ? 'Do\'konga yetkazildi'
              : poolOrder.status === 'truck_departed'
              ? 'Labo yo\'lda'
              : 'Eskrou tasdiqlangan ✓'}
          </span>
        </div>

        <div className="bg-[#FAF6EC] rounded-xl p-2.5 border border-[#E8DEC9] space-y-1 text-xs">
          <div className="flex justify-between font-bold text-ink">
            <span>{poolOrder.poolName}</span>
            <span className="font-serif text-teal-action">{formatUZS(poolOrder.totalAmount)}</span>
          </div>
          <p className="text-[11px] text-ink-muted">
            {poolOrder.itemsSummary}
          </p>
          <div className="text-[10px] text-ink-muted pt-1 flex items-center justify-between border-t border-[#EAE0CF]">
            <span>{poolOrder.routeDescription}</span>
            <span className="font-semibold text-teal-action">Sanjarbek (01 723 A)</span>
          </div>
        </div>

        <button
          onClick={() => {
            triggerHaptic('medium');
            onNavigateOrderDetail();
          }}
          className="w-full min-h-[44px] bg-teal-action hover:bg-teal-hover text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
        >
          <span>{t.supplier.dashboard.viewOrderDetail}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
