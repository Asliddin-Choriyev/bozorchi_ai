import React, { useState } from 'react';
import { PriceAlert, Product, Language } from '../types';
import { translations } from '../i18n';
import { formatUZS } from '../utils/format';
import { Bell, BellRing, Plus, Check, Zap, AlertCircle } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  alerts: PriceAlert[];
  products: Product[];
  lang: Language;
  onToggleAlert: (alertId: string) => void;
  onCreateAlert: (productId: string, targetPrice: number, market: string) => void;
  onSelectProductAlert?: (product: Product) => void;
}

export const AlertsScreen: React.FC<Props> = ({
  alerts,
  products,
  lang,
  onToggleAlert,
  onCreateAlert,
  onSelectProductAlert
}) => {
  const t = translations[lang];

  // Form state
  const [selectedProductId, setSelectedProductId] = useState<string>('sugar');
  const [targetPrice, setTargetPrice] = useState<string>('11500');
  const [selectedMarket, setSelectedMarket] = useState<string>('Chorsu');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseInt(targetPrice.replace(/\s+/g, ''), 10);
    if (!priceNum || isNaN(priceNum)) return;

    triggerHaptic('success');
    onCreateAlert(selectedProductId, priceNum, selectedMarket);
    setToastMessage(t.alerts.alertSavedToast);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const triggeredAlert = alerts.find((a) => a.isTriggeredToday);

  return (
    <div className="space-y-4 pb-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-[360px] mx-auto bg-[#167E51] text-white p-3 rounded-xl shadow-float flex items-center gap-2 text-xs font-bold animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Triggered Alert Highlight Card */}
      {triggeredAlert && (
        <div className="bg-gradient-to-r from-[#FFF6E5] to-[#FCF1DB] border-2 border-gold-highlight rounded-card p-3.5 shadow-card relative overflow-hidden">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-highlight text-ink flex items-center justify-center shrink-0 shadow-xs">
              <BellRing className="w-5 h-5 text-ink animate-bounce" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-danger text-white text-[10px] font-black px-2 py-0.5 rounded-full mb-1">
                <span>⚡ {t.alerts.triggeredTitle}</span>
              </div>
              <h3 className="font-serif font-bold text-sm text-ink">
                {triggeredAlert.productName}
              </h3>
              <p className="text-xs text-[#7A5B0B] font-semibold mt-0.5">
                {triggeredAlert.triggeredMessage || t.alerts.triggeredNotice}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs font-black font-serif text-teal-action bg-white/80 px-2 py-0.5 rounded border border-[#E0D2B4]">
                  {t.alerts.currentPriceLabel} {formatUZS(triggeredAlert.currentPrice)}
                </span>
                <span className="text-[11px] text-ink-muted">Chorsu Optom</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Alerts List with Switches */}
      <div className="bg-cream-card rounded-card p-3.5 border border-[#E3D9C4] shadow-card">
        <h3 className="font-serif font-bold text-sm text-ink mb-2.5 flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-action" />
          <span>{t.alerts.activeAlerts} ({alerts.length})</span>
        </h3>

        <div className="space-y-2.5">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#F6F0E4] border border-[#E5DBCA]"
            >
              <div>
                <h4 className="font-serif font-bold text-xs text-ink leading-tight">
                  {alert.productName}
                </h4>
                <p className="text-[11px] text-ink-muted mt-0.5">
                  Chegara narx: <strong className="text-teal-action font-bold">{formatUZS(alert.targetPrice)}</strong> • {alert.market}
                </p>
              </div>

              {/* Toggle switch min 44px hit target */}
              <button
                onClick={() => {
                  triggerHaptic('light');
                  onToggleAlert(alert.id);
                }}
                aria-label="Toggle alert"
                className="min-h-[44px] min-w-[50px] flex items-center justify-center"
              >
                <div
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                    alert.isActive ? 'bg-teal-action' : 'bg-[#D2C5B0]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      alert.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Alert Form */}
      <div className="bg-cream-card rounded-card p-3.5 border border-[#E3D9C4] shadow-card">
        <h3 className="font-serif font-bold text-sm text-ink mb-2 flex items-center gap-2">
          <Plus className="w-4 h-4 text-teal-action" />
          <span>{t.alerts.createAlertTitle}</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
              {t.alerts.productLabel}
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => {
                setSelectedProductId(e.target.value);
                const p = products.find((pr) => pr.id === e.target.value);
                if (p) setTargetPrice((p.todayPrice - 300).toString());
              }}
              className="w-full min-h-[44px] px-3 bg-[#FDFBF7] border border-[#DED4BD] rounded-xl text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-teal-action/40"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {lang === 'uz' ? p.nameUz : lang === 'ru' ? p.nameRu : p.nameEn} ({formatUZS(p.todayPrice)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
              {t.alerts.targetPriceLabel}
            </label>
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder={t.alerts.placeholderPrice}
              className="w-full min-h-[44px] px-3 bg-[#FDFBF7] border border-[#DED4BD] rounded-xl text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-teal-action/40"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-1">
              {t.alerts.marketLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Chorsu', "O'rikzor", 'Food City'].map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setSelectedMarket(m)}
                  className={`min-h-[40px] px-2 rounded-xl text-xs font-semibold border ${
                    selectedMarket === m
                      ? 'bg-teal-action text-white border-teal-action'
                      : 'bg-[#FDFBF7] text-ink border-[#DED4BD]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full min-h-[46px] bg-teal-action hover:bg-teal-hover text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-[0.99] transition-all mt-2"
          >
            <Bell className="w-4 h-4" />
            <span>{t.alerts.saveAlertBtn}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
