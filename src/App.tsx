import React, { useState, useEffect } from 'react';
import {
  ScreenType,
  Product,
  Supplier,
  GroupPool,
  PriceAlert,
  Language
} from './types';
import {
  MOCK_PRODUCTS,
  MOCK_SUPPLIERS,
  MOCK_CHILONZOR_POOL,
  MOCK_ALERTS
} from './data/mock';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { DemoBanner } from './components/DemoBanner';
import { SampleDataFooter } from './components/SampleDataFooter';
import { PriceBoardScreen } from './screens/PriceBoardScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { SupplierScreen } from './screens/SupplierScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { GroupOrderScreen } from './screens/GroupOrderScreen';
import { DeliveryScanScreen } from './screens/DeliveryScanScreen';
import { SavingsResultScreen } from './screens/SavingsResultScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { BozorchiAICopilot } from './components/BozorchiAICopilot';
import {
  initTelegramApp,
  configureMainButton,
  hideMainButton,
  configureBackButton,
  isTelegramWebApp,
  triggerHaptic
} from './utils/telegram';

export const App: React.FC = () => {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('price_board');
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>(['price_board']);

  // Language State (in-memory)
  const [lang, setLang] = useState<Language>('uz');

  // In-memory application state
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product>(MOCK_PRODUCTS[0]); // Sugar default
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pool, setPool] = useState<GroupPool>(MOCK_CHILONZOR_POOL);
  const [alerts, setAlerts] = useState<PriceAlert[]>(MOCK_ALERTS);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isAutoDeliveryTriggered, setIsAutoDeliveryTriggered] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Initialize Telegram WebApp on mount
  useEffect(() => {
    initTelegramApp();
  }, []);

  // Handle Navigation
  const navigateTo = (screen: ScreenType) => {
    setScreenHistory((prev) => [...prev, screen]);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop(); // remove current
      const prevScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('price_board');
      setScreenHistory(['price_board']);
    }
  };

  // Sync Telegram MainButton & BackButton
  useEffect(() => {
    // BackButton logic
    const canGoBack = currentScreen !== 'price_board' &&
      currentScreen !== 'alerts' &&
      currentScreen !== 'group_order' &&
      currentScreen !== 'profile';

    if (canGoBack) {
      configureBackButton(handleBack);
    } else {
      configureBackButton(null);
    }

    // MainButton logic
    if (currentScreen === 'group_order') {
      configureMainButton({
        text: "Eskrouga to'lash (13 890 000 UZS)",
        onClick: () => {
          triggerHaptic('success');
          navigateTo('delivery_scan');
        },
        color: '#0B6B62'
      });
    } else if (currentScreen === 'delivery_scan') {
      hideMainButton();
    } else if (currentScreen === 'product_detail') {
      configureMainButton({
        text: "Chilonzor-9 Guruhiga qo'shilish",
        onClick: () => {
          triggerHaptic('medium');
          navigateTo('group_order');
        },
        color: '#0B6B62'
      });
    } else {
      hideMainButton();
    }

    return () => {
      hideMainButton();
      configureBackButton(null);
    };
  }, [currentScreen, screenHistory]);

  // Alert toggle
  const handleToggleAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isActive: !a.isActive } : a))
    );
  };

  // Create alert
  const handleCreateAlert = (productId: string, targetPrice: number, market: string) => {
    const prod = products.find((p) => p.id === productId);
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      productId,
      productName: prod ? prod.nameUz : productId,
      targetPrice,
      currentPrice: prod ? prod.todayPrice : targetPrice + 200,
      market,
      isActive: true,
      isTriggeredToday: false
    };
    setAlerts((prev) => [newAlert, ...prev]);
  };

  const getScreenTitle = (): string | undefined => {
    switch (currentScreen) {
      case 'product_detail':
        return selectedProduct.nameUz.split('(')[0].trim();
      case 'supplier_compare':
        return "Ta'minotchilar";
      case 'alerts':
        return 'Narx Xabarlari';
      case 'group_order':
        return 'Chilonzor-9 Guruhi';
      case 'delivery_scan':
        return 'Yetkazish & Skaner';
      case 'savings_result':
        return 'Tejamkorlik Natijasi';
      case 'profile':
        return 'Do\'kon Profili';
      default:
        return undefined;
    }
  };

  return (
    <div className="min-h-screen bg-[#EBE5D6] flex justify-center selection:bg-teal-action selection:text-white">
      {/* 390px Mobile Viewport Container */}
      <div className="w-full max-w-[390px] min-h-screen bg-cream-surface flex flex-col relative shadow-2xl border-x border-[#DFD5BE]/60">
        {/* Floating Demo Mode Controller */}
        <DemoBanner
          currentScreen={currentScreen}
          onNavigate={(screen) => navigateTo(screen)}
          lang={lang}
          onAutofillSearch={(q) => {
            setSearchQuery(q);
          }}
          onTriggerDeliveryScan={() => {
            setIsAutoDeliveryTriggered(true);
          }}
        />

        {/* Telegram Header */}
        <Header
          currentScreen={currentScreen}
          onBack={handleBack}
          lang={lang}
          onLanguageChange={setLang}
          screenTitle={getScreenTitle()}
          isTelegram={isTelegramWebApp()}
          onOpenAI={() => setIsAIOpen(true)}
        />

        {/* Main Screen Content */}
        <main className="flex-1 px-3 pt-3">
          {currentScreen === 'price_board' && (
            <PriceBoardScreen
              products={products}
              onSelectProduct={(p) => {
                setSelectedProduct(p);
                navigateTo('product_detail');
              }}
              lang={lang}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onQuickJoinPool={() => navigateTo('group_order')}
            />
          )}

          {currentScreen === 'product_detail' && (
            <ProductDetailScreen
              product={selectedProduct}
              lang={lang}
              onCompareSuppliers={() => navigateTo('supplier_compare')}
              onSetAlert={(p) => {
                setSelectedProduct(p);
                navigateTo('alerts');
              }}
              onJoinPool={() => navigateTo('group_order')}
            />
          )}

          {currentScreen === 'supplier_compare' && (
            <SupplierScreen
              suppliers={MOCK_SUPPLIERS}
              lang={lang}
              onJoinPool={() => navigateTo('group_order')}
              onSelectSupplier={(s) => setSelectedSupplier(s)}
            />
          )}

          {currentScreen === 'alerts' && (
            <AlertsScreen
              alerts={alerts}
              products={products}
              lang={lang}
              onToggleAlert={handleToggleAlert}
              onCreateAlert={handleCreateAlert}
            />
          )}

          {currentScreen === 'group_order' && (
            <GroupOrderScreen
              pool={pool}
              lang={lang}
              onPayToEscrow={() => navigateTo('delivery_scan')}
            />
          )}

          {currentScreen === 'delivery_scan' && (
            <DeliveryScanScreen
              lang={lang}
              autoTrigger={isAutoDeliveryTriggered}
              onConfirmSuccess={() => navigateTo('savings_result')}
            />
          )}

          {currentScreen === 'savings_result' && (
            <SavingsResultScreen
              lang={lang}
              onRestart={() => {
                setSearchQuery('');
                setIsAutoDeliveryTriggered(false);
                navigateTo('price_board');
              }}
            />
          )}

          {currentScreen === 'profile' && (
            <ProfileScreen
              lang={lang}
              onLanguageChange={setLang}
              onOpenAI={() => setIsAIOpen(true)}
            />
          )}

          {/* Sample Data Disclaimer Footer */}
          <SampleDataFooter lang={lang} />
        </main>

        {/* Bozorchi AI Copilot Sheet */}
        <BozorchiAICopilot
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
          lang={lang}
        />

        {/* Bottom Navigation Bar */}
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={(screen) => navigateTo(screen)}
          lang={lang}
        />
      </div>
    </div>
  );
};

export default App;
