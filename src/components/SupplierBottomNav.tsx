import React from 'react';
import { SupplierScreenType, Language } from '../types';
import { translations } from '../i18n';
import { LayoutDashboard, FileText, ShoppingBag, Store } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  currentScreen: SupplierScreenType;
  onNavigate: (screen: SupplierScreenType) => void;
  lang: Language;
  hasIncomingOrder?: boolean;
}

export const SupplierBottomNav: React.FC<Props> = ({
  currentScreen,
  onNavigate,
  lang,
  hasIncomingOrder = true
}) => {
  const t = translations[lang];

  const tabs: {
    id: SupplierScreenType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    {
      id: 'dashboard',
      label: t.supplier.tabs.dashboard,
      icon: LayoutDashboard
    },
    {
      id: 'prices',
      label: t.supplier.tabs.prices,
      icon: FileText
    },
    {
      id: 'orders',
      label: t.supplier.tabs.orders,
      icon: ShoppingBag,
      badge: hasIncomingOrder ? '1' : undefined
    },
    {
      id: 'profile',
      label: t.supplier.tabs.profile,
      icon: Store
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A1714] border-t border-gold-highlight/30 shadow-[0_-4px_16px_rgba(0,0,0,0.2)]">
      <div className="max-w-[390px] mx-auto flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            currentScreen === tab.id ||
            (tab.id === 'orders' && (currentScreen === 'order_detail' || currentScreen === 'supplier_result')) ||
            (tab.id === 'prices' && currentScreen === 'flash_discount');

          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('light');
                onNavigate(tab.id);
              }}
              className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center relative transition-all duration-150 ${
                isActive ? 'text-gold-highlight' : 'text-[#7B8F8A] hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 text-[10px] font-black rounded-full px-1.5 py-0.2 leading-tight bg-gold-highlight text-ink ring-2 ring-[#0A1714]">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-0.5 ${
                  isActive ? 'font-bold text-gold-highlight' : 'font-medium text-[#7B8F8A]'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="w-4 h-0.5 bg-gold-highlight rounded-full mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
