import React, { useState, useRef } from 'react';
import { Language } from '../types';
import { translations } from '../i18n';
import { REAL_DECK_NUMBERS } from '../data/mock';
import { formatUZS } from '../utils/format';
import { Camera, CheckCircle2, Coins, Truck, ArrowRight, ShieldCheck, Sparkles, FileText } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  lang: Language;
  onConfirmSuccess: () => void;
  autoTrigger?: boolean;
}

export const DeliveryScanScreen: React.FC<Props> = ({
  lang,
  onConfirmSuccess,
  autoTrigger = false
}) => {
  const t = translations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [isVerified, setIsVerified] = useState(autoTrigger);

  const startScanSimulation = () => {
    triggerHaptic('medium');
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsVerified(true);
      triggerHaptic('success');
    }, 1400);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      startScanSimulation();
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Hidden file input with camera capture for real mobile testing */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Delivery Status Card */}
      <div className="bg-cream-card rounded-card p-4 border border-[#E3D9C4] shadow-card">
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1.5 bg-[#EBF7F0] text-[#167E51] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#167E51]/20">
            <span className="w-2 h-2 rounded-full bg-[#167E51] animate-ping"></span>
            <span>{t.delivery.statusArrived}</span>
          </div>
          <span className="text-[11px] text-ink-muted">Yetkazildi: 11:45</span>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <div className="w-12 h-12 rounded-xl bg-teal-light text-teal-action flex items-center justify-center text-xl shrink-0 border border-teal-action/20">
            <Truck className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-ink">
              Chilonzor-9 klaster yetkazmasi
            </h3>
            <p className="text-xs text-ink-muted">
              {t.delivery.driverName}
            </p>
            <p className="text-[11px] text-teal-action font-semibold mt-0.5">
              Yuk: Shakar (500 kg), Un (15 qop), Yog' (60 dona)
            </p>
          </div>
        </div>
      </div>

      {/* Invoice Scanner Box */}
      {!isVerified ? (
        <div className="bg-[#FAF6EC] border-2 border-dashed border-[#D2C5AB] rounded-card p-5 text-center shadow-card relative overflow-hidden">
          {isScanning ? (
            <div className="py-6 space-y-3">
              <div className="w-16 h-16 mx-auto relative flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-teal-action/20 border-t-teal-action rounded-full animate-spin"></div>
                <FileText className="w-6 h-6 text-teal-action absolute" />
              </div>
              <p className="font-serif font-bold text-sm text-ink">
                BozorVision AI Skaneri
              </p>
              <p className="text-xs text-ink-muted animate-pulse">
                {t.delivery.scanningText}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-white border border-[#E2D8C3] flex items-center justify-center text-teal-action shadow-xs">
                <Camera className="w-8 h-8 stroke-[1.8]" />
              </div>

              <div>
                <h3 className="font-serif font-bold text-base text-ink">
                  BozorVision bilan hisob-fakturani tekshirish
                </h3>
                <p className="text-xs text-ink-muted mt-1 max-w-[280px] mx-auto">
                  Haydovchi keltirgan qog'oz fakturani rasmga oling. AI narxlar kotirovkaga to'g'ri kelishini soniyada tasdiqlaydi.
                </p>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full min-h-[48px] bg-teal-action hover:bg-teal-hover text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t.delivery.scanBtn}</span>
                </button>

                <button
                  onClick={startScanSimulation}
                  className="w-full min-h-[44px] bg-white border border-[#DACFBA] text-ink hover:bg-[#F2ECE0] font-bold text-xs rounded-xl flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
                >
                  <Sparkles className="w-4 h-4 text-gold-highlight fill-gold-highlight" />
                  <span>{t.delivery.demoInvoiceBtn} (Pitch)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Verified Card (Fake BozorVision Result) */
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#EBF7F0] to-[#E2F3E9] border-2 border-[#167E51] rounded-card p-4 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#167E51] text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 bg-[#167E51] text-white text-[10px] font-black px-2 py-0.2 rounded-full mb-0.5">
                  <span>BozorVision Verified ✓</span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#0D5735]">
                  {t.delivery.verifiedTitle}
                </h3>
                <p className="text-xs text-[#1D6C47] mt-0.5">
                  {t.delivery.verifiedDesc}
                </p>
              </div>
            </div>

            {/* OCR Extracted Items Table */}
            <div className="mt-3.5 bg-white/90 rounded-xl p-3 border border-[#BCE3CC] space-y-1.5 text-xs">
              <div className="font-bold text-[11px] text-ink-muted uppercase tracking-wider pb-1 border-b border-[#E0F0E6]">
                Faktura qatorlari (Skanerlandi):
              </div>
              <div className="flex justify-between py-0.5">
                <span className="font-medium text-ink">Shakar oq: 500 kg × 11 400 UZS</span>
                <span className="font-bold text-[#167E51]">Mos keldi ✓</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="font-medium text-ink">Un 1-nav: 15 qop × 255 000 UZS</span>
                <span className="font-bold text-[#167E51]">Mos keldi ✓</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="font-medium text-ink">Pista yog'i: 60 dona × 71 500 UZS</span>
                <span className="font-bold text-[#167E51]">Mos keldi ✓</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="font-medium text-ink">Labo yetkazish ulushi: 75 000 UZS</span>
                <span className="font-bold text-[#167E51]">Mos keldi ✓</span>
              </div>
            </div>

            {/* BozorCoins Reward Card */}
            <div className="mt-3 bg-gradient-to-r from-[#FFF5DB] to-[#FCEEC5] border border-gold-highlight rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gold-highlight text-ink flex items-center justify-center font-serif font-black text-sm shadow-xs">
                  🪙
                </div>
                <div>
                  <span className="font-serif font-bold text-xs text-ink block">
                    BozorCoins Mukofoti
                  </span>
                  <span className="text-[11px] text-[#785B0D] font-medium">
                    Haqiqiy narx ma'lumotini kiritganingiz uchun
                  </span>
                </div>
              </div>
              <div className="font-serif font-black text-sm text-[#785B0D] bg-white/80 px-2 py-1 rounded-lg border border-gold-highlight/40">
                +2 500
              </div>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={() => {
              triggerHaptic('success');
              onConfirmSuccess();
            }}
            className="w-full min-h-[50px] bg-teal-action hover:bg-teal-hover text-white font-serif font-bold text-base rounded-xl shadow-float flex items-center justify-center gap-2 active:scale-[0.99] transition-all"
          >
            <span>{t.delivery.seeSavingsBtn}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
