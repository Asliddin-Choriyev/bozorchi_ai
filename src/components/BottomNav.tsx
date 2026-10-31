import React from 'react';
import { ScreenType, Language } from '../types';
import { translations } from '../i18n';
import { TrendingUp, Bell, Users, Store } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  lang: Language;
}

export const BottomNav: React.FC<Props> = ({ currentScreen, onNavigate, lang }) => {
  const t = translations[lang];

  const tabs: {
    id: ScreenType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    {
      id: 'price_board',
      label: t.tabs.prices,
      icon: TrendingUp
    },
    {
      id: 'alerts',
      label: t.tabs.alerts,
      icon: Bell,
      badge: '1' // 1 triggered today!
    },
    {
      id: 'group_order',
      label: t.tabs.pool,
      icon: Users,
      badge: '5/5' // Pool completed!
    },
    {
      id: 'profile',
      label: t.tabs.profile,
      icon: Store
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FBF8F0] border-t border-[#E5DEC9] shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
      <div className="max-w-[390px] mx-auto flex items-center justify-around px-2 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            currentScreen === tab.id ||
            (tab.id === 'price_board' &&
              (currentScreen === 'product_detail' || currentScreen === 'supplier_compare')) ||
            (tab.id === 'group_order' &&
              (currentScreen === 'delivery_scan' || currentScreen === 'savings_result'));

          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('light');
                onNavigate(tab.id);
              }}
              className={`flex-1 min-h-[48px] py-1 flex flex-col items-center justify-center relative transition-all duration-150 ${
                isActive ? 'text-teal-action' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && (
                  <span
                    className={`absolute -top-1 -right-2 text-[10px] font-black rounded-full px-1.5 py-0.2 leading-tight ${
                      tab.id === 'alerts'
                        ? 'bg-danger text-white ring-2 ring-[#FBF8F0]'
                        : 'bg-gold-highlight text-ink font-bold ring-2 ring-[#FBF8F0]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-0.5 ${
                  isActive ? 'font-bold text-teal-action' : 'font-medium text-ink-muted'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="w-4 h-0.5 bg-teal-action rounded-full mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
