import React, { useState } from 'react';
import { UserRole, ShopOwnerScreenType, SupplierScreenType, Language } from '../types';
import { translations } from '../i18n';
import { Zap, ChevronRight, RotateCcw, X, Play, CheckCircle2 } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  activeRole: UserRole;
  currentShopScreen: ShopOwnerScreenType;
  currentSupplierScreen: SupplierScreenType;
  onNavigateShop: (screen: ShopOwnerScreenType) => void;
  onNavigateSupplier: (screen: SupplierScreenType) => void;
  lang: Language;
  onAutofillSearch?: (query: string) => void;
  onTriggerDeliveryScan?: () => void;
  onDispatchTruck?: () => void;
}

export const DemoBanner: React.FC<Props> = ({
  activeRole,
  currentShopScreen,
  currentSupplierScreen,
  onNavigateShop,
  onNavigateSupplier,
  lang,
  onAutofillSearch,
  onTriggerDeliveryScan,
  onDispatchTruck
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const t = translations[lang];

  if (activeRole === 'unselected') return null;

  const isSupplier = activeRole === 'supplier';

  // Map screens to flow step index
  const getStepIndex = (): number => {
    if (isSupplier) {
      switch (currentSupplierScreen) {
        case 'dashboard':
          return 0;
        case 'prices':
          return 1;
        case 'flash_discount':
          return 2;
        case 'orders':
          return 3;
        case 'order_detail':
          return 4;
        case 'supplier_result':
          return 5;
        default:
          return 0;
      }
    } else {
      switch (currentShopScreen) {
        case 'price_board':
          return 0;
        case 'product_detail':
          return 1;
        case 'supplier_compare':
          return 2;
        case 'group_order':
          return 3;
        case 'delivery_scan':
          return 4;
        case 'savings_result':
          return 5;
        default:
          return 0;
      }
    }
  };

  const stepIdx = getStepIndex();

  const handleNextStep = () => {
    triggerHaptic('medium');
    if (isSupplier) {
      switch (stepIdx) {
        case 0:
          // Dashboard -> Prices
          onNavigateSupplier('prices');
          break;
        case 1:
          // Prices -> Flash Discount
          onNavigateSupplier('flash_discount');
          break;
        case 2:
          // Flash Discount -> Orders
          onNavigateSupplier('orders');
          break;
        case 3:
          // Orders -> Order Detail
          onNavigateSupplier('order_detail');
          break;
        case 4:
          // Order Detail -> Dispatch Truck -> Result
          if (onDispatchTruck) onDispatchTruck();
          setTimeout(() => {
            onNavigateSupplier('supplier_result');
          }, 400);
          break;
        case 5:
          // Reset
          onNavigateSupplier('dashboard');
          break;
      }
    } else {
      switch (stepIdx) {
        case 0:
          // From Price Board -> Search sugar & open product detail
          if (onAutofillSearch) onAutofillSearch('shakar 500 kg');
          setTimeout(() => {
            onNavigateShop('product_detail');
          }, 150);
          break;
        case 1:
          // From Product Detail -> Compare 5 Suppliers
          onNavigateShop('supplier_compare');
          break;
        case 2:
          // From Supplier Compare -> Join Chilonzor-9 Group Pool
          onNavigateShop('group_order');
          break;
        case 3:
          // From Group Order -> Pay to Escrow & open Delivery Screen
          onNavigateShop('delivery_scan');
          break;
        case 4:
          // From Delivery Scan -> Trigger invoice scan match & go to Savings
          if (onTriggerDeliveryScan) onTriggerDeliveryScan();
          setTimeout(() => {
            onNavigateShop('savings_result');
          }, 500);
          break;
        case 5:
          // Reset to beginning
          onNavigateShop('price_board');
          break;
      }
    }
  };

  const handleReset = () => {
    triggerHaptic('light');
    if (isSupplier) {
      onNavigateSupplier('dashboard');
    } else {
      if (onAutofillSearch) onAutofillSearch('');
      onNavigateShop('price_board');
    }
  };

  const stepNames = isSupplier
    ? t.demo.supplierStepNames || [
        '1. Ta\'minotchi Dashbodi',
        '2. Prays-list yangilash',
        '3. Flash chegirma (25t)',
        '4. Eskroudagi buyurtma',
        '5. Mashina jo\'natish',
        '6. 25t sotildi & Payout'
      ]
    : t.demo.stepNames;

  if (!isExpanded) {
    return (
      <div className="fixed top-14 right-3 z-50">
        <button
          onClick={() => {
            triggerHaptic('light');
            setIsExpanded(true);
          }}
          className="bg-gold-highlight text-ink font-bold text-xs px-3 py-2 rounded-full shadow-float flex items-center gap-1.5 border-2 border-white animate-pulse"
        >
          <Zap className="w-3.5 h-3.5 fill-ink" />
          <span>Pitch Demo</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-14 left-0 right-0 z-50 px-3 pointer-events-none">
      <div className="max-w-[390px] mx-auto pointer-events-auto bg-[#0A1714] text-white rounded-xl p-2.5 shadow-float border border-gold-highlight/40 backdrop-blur-md">
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-gold-highlight text-ink flex items-center justify-center text-[10px] font-black">
              ⚡
            </span>
            <span className="text-[11px] font-bold tracking-wide text-gold-highlight">
              {isSupplier ? 'Ta\'minotchi Demo (60s)' : 'Baqqol Demo (60s)'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleReset}
              title="Qayta boshlash"
              className="text-[10px] text-white/70 hover:text-white px-1.5 py-0.5 rounded flex items-center gap-0.5"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white/60 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-1 mb-2">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= stepIdx ? 'bg-gold-highlight' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Current step banner and Next Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="text-[11px] font-medium leading-tight truncate">
            <span className="text-white/60 mr-1">Qadam {stepIdx + 1}/6:</span>
            <span className="text-white font-bold">{stepNames[stepIdx]}</span>
          </div>

          <button
            onClick={handleNextStep}
            className="min-h-[36px] bg-gradient-to-r from-gold-highlight to-[#F3C759] text-ink font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm hover:brightness-105 active:scale-95 transition-all whitespace-nowrap shrink-0"
          >
            <span>{stepIdx === 5 ? 'Qayta' : 'Keyingi qadam'}</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
