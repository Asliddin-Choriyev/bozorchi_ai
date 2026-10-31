import React, { useState } from 'react';
import { Language, Product } from '../../types';
import { translations } from '../../i18n';
import { formatUZS } from '../../utils/format';
import { Camera, FileText, Check, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { triggerHaptic } from '../../utils/telegram';

interface Props {
  lang: Language;
  products: Product[];
  onUpdatePrices: (prices: { [productId: string]: number }) => void;
  onNavigateDashboard: () => void;
}

export const SupplierPricesScreen: React.FC<Props> = ({
  lang,
  products,
  onUpdatePrices,
  onNavigateDashboard
}) => {
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<'manual' | 'photo'>('photo');
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiConfidence, setAiConfidence] = useState<string | null>(null);

  // Editable price list
  const [sugarPrice, setSugarPrice] = useState('11800');
  const [flourPrice, setFlourPrice] = useState('255000');
  const [oilPrice, setOilPrice] = useState('71500');
  const [ricePrice, setRicePrice] = useState('14200');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleScanPhoto = () => {
    triggerHaptic('medium');
    setIsAiScanning(true);
    setAiConfidence(null);

    setTimeout(() => {
      setIsAiScanning(false);
      setAiConfidence('98.7%');
      setSugarPrice('11400'); // parsed promo price
      setFlourPrice('255000');
      setOilPrice('71500');
      triggerHaptic('success');
    }, 1400);
  };

  const handleConfirm = () => {
    triggerHaptic('success');
    onUpdatePrices({
      sugar: parseInt(sugarPrice, 10) || 11800,
      flour: parseInt(flourPrice, 10) || 255000,
      oil: parseInt(oilPrice, 10) || 71500,
      rice: parseInt(ricePrice, 10) || 14200,
    });

    setToastMessage(t.supplier.prices.toastSuccess);
    setTimeout(() => {
      setToastMessage(null);
      onNavigateDashboard();
    }, 1500);
  };

  return (
    <div className="space-y-3.5 pb-20">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-[360px] mx-auto bg-[#167E51] text-white p-3 rounded-xl shadow-float flex items-center justify-center gap-2 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Screen Title */}
      <div className="bg-cream-card rounded-[14px] p-3.5 border border-[#E3D9C4] shadow-card">
        <h2 className="font-serif font-bold text-base text-ink">
          {t.supplier.prices.title}
        </h2>
        <p className="text-xs text-ink-muted mt-0.5">
          {t.supplier.prices.subtitle}
        </p>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-2 mt-3 p-1 bg-[#EFE8D6] rounded-xl border border-[#DDD3BC]">
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('photo');
            }}
            className={`min-h-[38px] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'photo'
                ? 'bg-[#0A1714] text-gold-highlight shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{t.supplier.prices.tabPhoto}</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('manual');
            }}
            className={`min-h-[38px] text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'manual'
                ? 'bg-[#0A1714] text-gold-highlight shadow-xs'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{t.supplier.prices.tabManual}</span>
          </button>
        </div>
      </div>

      {/* Photo AI OCR Box */}
      {activeTab === 'photo' && (
        <div className="bg-[#FAF6EC] border-2 border-dashed border-[#D2C5AB] rounded-[14px] p-4 text-center shadow-card space-y-3">
          {isAiScanning ? (
            <div className="py-6 space-y-2">
              <div className="w-12 h-12 mx-auto border-4 border-gold-highlight border-t-transparent rounded-full animate-spin"></div>
              <p className="font-serif font-bold text-sm text-ink">BozorVision AI Skaneri...</p>
              <p className="text-xs text-ink-muted">Qog'ozdagi kotirovkalar raqamlashtirilmoqda</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 mx-auto rounded-xl bg-gold-highlight text-ink flex items-center justify-center shadow-xs">
                <Camera className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-ink">
                  Daftar yoki hisob-faktura rasmini yuklash
                </h4>
                <p className="text-xs text-ink-muted mt-0.5">
                  {t.supplier.prices.photoPrompt}
                </p>
              </div>

              <button
                onClick={handleScanPhoto}
                className="w-full min-h-[46px] bg-[#0A1714] hover:bg-black text-gold-highlight font-bold text-xs rounded-xl border border-gold-highlight/60 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-gold-highlight fill-gold-highlight" />
                <span>BozorVision AI bilan fotosuratni tanish (Demo)</span>
              </button>

              {aiConfidence && (
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#167E51] bg-[#EBF7F0] px-3 py-1 rounded-full border border-[#167E51]/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.supplier.prices.aiParsedNotice} ({aiConfidence})</span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Editable Prices Form */}
      <div className="bg-cream-card rounded-[14px] p-4 border border-[#E3D9C4] shadow-card space-y-3">
        <h3 className="font-serif font-bold text-xs text-ink uppercase tracking-wider">
          Kotirovkalarni tekshirish va tahrirlash:
        </h3>

        <div className="space-y-2.5 text-xs">
          {/* Sugar */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF6EC] border border-[#E6DDCA]">
            <div>
              <span className="font-serif font-bold text-ink block">Shakar oq (Rossiya/Xorazm)</span>
              <span className="text-[10px] text-ink-muted">1 kg uchun ulgurji narx</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={sugarPrice}
                onChange={(e) => setSugarPrice(e.target.value)}
                className="w-24 min-h-[36px] text-right font-serif font-bold text-sm px-2 bg-white border border-[#D5C9AE] rounded-lg text-teal-action"
              />
              <span className="text-[11px] text-ink-muted font-bold">UZS</span>
            </div>
          </div>

          {/* Flour */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF6EC] border border-[#E6DDCA]">
            <div>
              <span className="font-serif font-bold text-ink block">Un 1-nav (Qozoq 50 kg)</span>
              <span className="text-[10px] text-ink-muted">1 qop uchun ulgurji narx</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={flourPrice}
                onChange={(e) => setFlourPrice(e.target.value)}
                className="w-24 min-h-[36px] text-right font-serif font-bold text-sm px-2 bg-white border border-[#D5C9AE] rounded-lg text-teal-action"
              />
              <span className="text-[11px] text-ink-muted font-bold">UZS</span>
            </div>
          </div>

          {/* Oil */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF6EC] border border-[#E6DDCA]">
            <div>
              <span className="font-serif font-bold text-ink block">Pista yog'i (5L)</span>
              <span className="text-[10px] text-ink-muted">1 dona uchun narx</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={oilPrice}
                onChange={(e) => setOilPrice(e.target.value)}
                className="w-24 min-h-[36px] text-right font-serif font-bold text-sm px-2 bg-white border border-[#D5C9AE] rounded-lg text-teal-action"
              />
              <span className="text-[11px] text-ink-muted font-bold">UZS</span>
            </div>
          </div>

          {/* Rice */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF6EC] border border-[#E6DDCA]">
            <div>
              <span className="font-serif font-bold text-ink block">Guruch Alanga (Xorazm)</span>
              <span className="text-[10px] text-ink-muted">1 kg uchun ulgurji narx</span>
            </div>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={ricePrice}
                onChange={(e) => setRicePrice(e.target.value)}
                className="w-24 min-h-[36px] text-right font-serif font-bold text-sm px-2 bg-white border border-[#D5C9AE] rounded-lg text-teal-action"
              />
              <span className="text-[11px] text-ink-muted font-bold">UZS</span>
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="w-full min-h-[50px] bg-gradient-to-r from-gold-highlight to-[#F3C759] text-ink font-serif font-bold text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all mt-4"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{t.supplier.prices.confirmBtn}</span>
        </button>
      </div>
    </div>
  );
};
