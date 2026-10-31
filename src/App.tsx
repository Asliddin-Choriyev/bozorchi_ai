import React, { useState, useEffect } from 'react';
import {
  UserRole,
  ShopOwnerScreenType,
  SupplierScreenType,
  Product,
  Supplier,
  GroupPool,
  PriceAlert,
  PoolOrder,
  FlashDeal,
  ShopOwnerProfile,
  SupplierProfile,
  Language
} from './types';
import {
  MOCK_PRODUCTS,
  MOCK_SUPPLIERS,
  MOCK_CHILONZOR_POOL,
  MOCK_ALERTS,
  INITIAL_POOL_ORDER,
  INITIAL_FLASH_DEAL,
  DEMO_SHOP_PROFILE,
  DEMO_SUPPLIER_PROFILE
} from './data/mock';
import { translations } from './i18n';

// Shop Owner Components & Screens
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { PriceBoardScreen } from './screens/PriceBoardScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { SupplierScreen } from './screens/SupplierScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { GroupOrderScreen } from './screens/GroupOrderScreen';
import { DeliveryScanScreen } from './screens/DeliveryScanScreen';
import { SavingsResultScreen } from './screens/SavingsResultScreen';
import { ProfileScreen } from './screens/ProfileScreen';

// Supplier Components & Screens
import { SupplierHeader } from './components/SupplierHeader';
import { SupplierBottomNav } from './components/SupplierBottomNav';
import { SupplierDashboardScreen } from './screens/supplier/SupplierDashboardScreen';
import { SupplierPricesScreen } from './screens/supplier/SupplierPricesScreen';
import { SupplierFlashDealScreen } from './screens/supplier/SupplierFlashDealScreen';
import { SupplierOrdersScreen } from './screens/supplier/SupplierOrdersScreen';
import { SupplierOrderDetailScreen } from './screens/supplier/SupplierOrderDetailScreen';
import { SupplierResultScreen } from './screens/supplier/SupplierResultScreen';
import { SupplierProfileScreen } from './screens/supplier/SupplierProfileScreen';

// Shared Global Components
import { RoleSelectionScreen } from './screens/RoleSelectionScreen';
import { ShowOtherSideButton } from './components/ShowOtherSideButton';
import { DemoBanner } from './components/DemoBanner';
import { SampleDataFooter } from './components/SampleDataFooter';
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
  // Active Role: 'unselected' on start, opens Role Selection screen
  const [activeRole, setActiveRole] = useState<UserRole>('unselected');

  // Navigation States
  const [shopScreen, setShopScreen] = useState<ShopOwnerScreenType>('price_board');
  const [shopHistory, setShopHistory] = useState<ShopOwnerScreenType[]>(['price_board']);

  const [supplierScreen, setSupplierScreen] = useState<SupplierScreenType>('dashboard');
  const [supplierHistory, setSupplierHistory] = useState<SupplierScreenType[]>(['dashboard']);

  // Language State (in-memory)
  const [lang, setLang] = useState<Language>('uz');

  // Shared in-memory domain state (actions on one side update the other)
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [selectedProduct, setSelectedProduct] = useState<Product>(MOCK_PRODUCTS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pool, setPool] = useState<GroupPool>(MOCK_CHILONZOR_POOL);
  const [alerts, setAlerts] = useState<PriceAlert[]>(MOCK_ALERTS);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const [poolOrder, setPoolOrder] = useState<PoolOrder>(INITIAL_POOL_ORDER);
  const [flashDeal, setFlashDeal] = useState<FlashDeal>(INITIAL_FLASH_DEAL);

  const [shopProfile, setShopProfile] = useState<ShopOwnerProfile>(DEMO_SHOP_PROFILE);
  const [supplierProfile, setSupplierProfile] = useState<SupplierProfile>(DEMO_SUPPLIER_PROFILE);

  const [isAutoDeliveryTriggered, setIsAutoDeliveryTriggered] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Profile update handlers that keep shared state synced
  const handleUpdateShopProfile = (newProfile: ShopOwnerProfile) => {
    setShopProfile(newProfile);
    setPool((prev) => ({
      ...prev,
      participants: prev.participants.map((p) =>
        p.isCurrentUser
          ? {
              ...p,
              name: `${newProfile.shopName || newProfile.name || "Do'konim"} (Siz)`,
              mahalla: newProfile.district || p.mahalla
            }
          : p
      )
    }));
  };

  const handleUpdateSupplierProfile = (newProfile: SupplierProfile) => {
    setSupplierProfile(newProfile);
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === 'sup-2'
          ? {
              ...s,
              name: `${newProfile.companyName || newProfile.name || 'Ulgurji Baza'} (Siz)`,
              market: newProfile.marketLocation || s.market,
              phone: newProfile.phone || s.phone
            }
          : s
      )
    );
  };

  // Initialize Telegram WebApp on mount
  useEffect(() => {
    initTelegramApp();
  }, []);

  // Update Telegram theme color when switching roles
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      if (activeRole === 'supplier') {
        window.Telegram.WebApp.setHeaderColor('#0A1714');
        window.Telegram.WebApp.setBackgroundColor('#0A1714');
      } else {
        window.Telegram.WebApp.setHeaderColor('#0B6B62');
        window.Telegram.WebApp.setBackgroundColor('#F4EFE4');
      }
    }
  }, [activeRole]);

  // Handle Shop Navigation
  const navigateShopTo = (screen: ShopOwnerScreenType) => {
    setShopHistory((prev) => [...prev, screen]);
    setShopScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShopBack = () => {
    if (shopHistory.length > 1) {
      const newHistory = [...shopHistory];
      newHistory.pop();
      const prev = newHistory[newHistory.length - 1];
      setShopHistory(newHistory);
      setShopScreen(prev);
    } else {
      setShopScreen('price_board');
      setShopHistory(['price_board']);
    }
  };

  // Handle Supplier Navigation
  const navigateSupplierTo = (screen: SupplierScreenType) => {
    setSupplierHistory((prev) => [...prev, screen]);
    setSupplierScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSupplierBack = () => {
    if (supplierHistory.length > 1) {
      const newHistory = [...supplierHistory];
      newHistory.pop();
      const prev = newHistory[newHistory.length - 1];
      setSupplierHistory(newHistory);
      setSupplierScreen(prev);
    } else {
      setSupplierScreen('dashboard');
      setSupplierHistory(['dashboard']);
    }
  };

  // Sync Telegram MainButton & BackButton
  useEffect(() => {
    if (activeRole === 'unselected') {
      hideMainButton();
      configureBackButton(null);
      return;
    }

    if (activeRole === 'shop_owner') {
      const canGoBack =
        shopScreen !== 'price_board' &&
        shopScreen !== 'alerts' &&
        shopScreen !== 'group_order' &&
        shopScreen !== 'profile';

      configureBackButton(canGoBack ? handleShopBack : null);

      if (shopScreen === 'group_order') {
        const payEscrowText =
          lang === 'uz'
            ? "Eskrouga to'lash (13 890 000 UZS)"
            : lang === 'ru'
            ? 'Оплатить на эскроу (13 890 000 сум)'
            : 'Pay into Escrow (13,890,000 UZS)';
        configureMainButton({
          text: payEscrowText,
          onClick: () => {
            triggerHaptic('success');
            handleShopPayToEscrow();
          },
          color: '#0B6B62'
        });
      } else if (shopScreen === 'product_detail') {
        const joinPoolText =
          lang === 'uz'
            ? "Chilonzor-9 Guruhiga qo'shilish"
            : lang === 'ru'
            ? 'Вступить в пул Чиланзар-9'
            : 'Join Chilonzor-9 Pool';
        configureMainButton({
          text: joinPoolText,
          onClick: () => {
            triggerHaptic('medium');
            navigateShopTo('group_order');
          },
          color: '#0B6B62'
        });
      } else {
        hideMainButton();
      }
    } else if (activeRole === 'supplier') {
      const canGoBack =
        supplierScreen === 'order_detail' || supplierScreen === 'supplier_result';

      configureBackButton(canGoBack ? handleSupplierBack : null);

      if (supplierScreen === 'order_detail' && poolOrder.status === 'escrow_verified') {
        const dispatchTruckText =
          lang === 'uz'
            ? "Labo mashinasini jo'natish (Sanjarbek)"
            : lang === 'ru'
            ? 'Отправить машину Labo (Санжарбек)'
            : 'Dispatch Labo Truck (Sanjarbek)';
        configureMainButton({
          text: dispatchTruckText,
          onClick: () => {
            triggerHaptic('success');
            handleSupplierDispatchTruck();
          },
          color: '#E3B341',
          textColor: '#0A1714'
        });
      } else {
        hideMainButton();
      }
    }

    return () => {
      hideMainButton();
      configureBackButton(null);
    };
  }, [activeRole, shopScreen, supplierScreen, poolOrder.status]);

  // CONNECTED SHARED ACTIONS
  // 1. Supplier updates prices -> updates shop owner's price board & supplier list
  const handleUpdatePricesBySupplier = (newPrices: { [productId: string]: number }) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (newPrices[p.id]) {
          const np = newPrices[p.id];
          return {
            ...p,
            todayPrice: np,
            markets: {
              ...p.markets,
              "O'rikzor": np
            }
          };
        }
        return p;
      })
    );

    // Update Elyor Baraka Optom in supplier list
    if (newPrices['sugar']) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === 'sup-2' ? { ...s, pricePerUnit: newPrices['sugar'] } : s
        )
      );
    }
  };

  // 2. Supplier broadcasts flash deal -> updates shop owner board with promo price
  const handleUpdateFlashDeal = (deal: FlashDeal) => {
    setFlashDeal(deal);
    // Updates sugar price on shop owner board
    setProducts((prev) =>
      prev.map((p) =>
        p.id === 'sugar'
          ? {
              ...p,
              todayPrice: deal.flashPrice,
              poolPrice: deal.flashPrice,
              markets: { ...p.markets, "O'rikzor": deal.flashPrice }
            }
          : p
      )
    );
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === 'sup-2' ? { ...s, pricePerUnit: deal.flashPrice } : s
      )
    );
  };

  // 3. Shop owner pays to escrow -> updates poolOrder status
  const handleShopPayToEscrow = () => {
    setPoolOrder((prev) => ({
      ...prev,
      status: 'escrow_verified',
      escrowVerifiedAt: 'Bugun 10:25'
    }));
    navigateShopTo('delivery_scan');
  };

  // 4. Supplier dispatches truck -> updates poolOrder status
  const handleSupplierDispatchTruck = () => {
    setPoolOrder((prev) => ({
      ...prev,
      status: 'truck_departed',
      departedAt: 'Bugun 10:45'
    }));
  };

  // 5. Shop owner confirms delivery by scan -> payout released automatically to supplier!
  const handleShopConfirmDelivery = () => {
    setPoolOrder((prev) => ({
      ...prev,
      status: 'payout_released',
      deliveredAt: 'Bugun 11:45',
      payoutReleasedAt: 'Bugun 11:48'
    }));
    navigateShopTo('savings_result');
  };

  // 6. Switch role (returns to role selection screen)
  const handleSwitchRole = () => {
    triggerHaptic('medium');
    setActiveRole('unselected');
  };

  // 7. Show the other side (instant toggle between shop owner and supplier views)
  const handleToggleRole = () => {
    triggerHaptic('medium');
    if (activeRole === 'shop_owner') {
      setActiveRole('supplier');
      // If shop owner was on group_order or delivery_scan, open supplier order detail
      if (shopScreen === 'group_order' || shopScreen === 'delivery_scan') {
        setSupplierScreen('order_detail');
      } else if (shopScreen === 'savings_result') {
        setSupplierScreen('supplier_result');
      }
    } else {
      setActiveRole('shop_owner');
      if (supplierScreen === 'order_detail' || supplierScreen === 'orders') {
        setShopScreen('delivery_scan');
      } else if (supplierScreen === 'supplier_result') {
        setShopScreen('savings_result');
      }
    }
  };

  // Alerts management
  const handleToggleAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, isActive: !a.isActive } : a))
    );
  };

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

  // IF ROLE IS NOT SELECTED, SHOW ROLE SELECTION FIRST
  if (activeRole === 'unselected') {
    return (
      <RoleSelectionScreen
        lang={lang}
        onLanguageChange={setLang}
        onSelectRole={(r) => {
          setActiveRole(r);
          if (r === 'shop_owner') {
            setShopScreen('price_board');
          } else {
            setSupplierScreen('dashboard');
          }
        }}
        shopProfile={shopProfile}
        supplierProfile={supplierProfile}
        onUpdateShopProfile={handleUpdateShopProfile}
        onUpdateSupplierProfile={handleUpdateSupplierProfile}
      />
    );
  }

  const t = translations[lang];

  // Titles for Shop Owner Header
  const getShopScreenTitle = (): string | undefined => {
    switch (shopScreen) {
      case 'product_detail': {
        const pName = lang === 'uz' ? selectedProduct.nameUz : lang === 'ru' ? selectedProduct.nameRu : selectedProduct.nameEn;
        return pName.split('(')[0].trim();
      }
      case 'supplier_compare':
        return t.header.screenTitles.supplierCompare;
      case 'alerts':
        return t.header.screenTitles.alerts;
      case 'group_order':
        return t.header.screenTitles.groupOrder;
      case 'delivery_scan':
        return t.header.screenTitles.deliveryScan;
      case 'savings_result':
        return t.header.screenTitles.savingsResult;
      case 'profile':
        return t.header.screenTitles.profile;
      default:
        return undefined;
    }
  };

  // Titles for Supplier Header
  const getSupplierScreenTitle = (): string | undefined => {
    switch (supplierScreen) {
      case 'prices':
        return t.header.screenTitles.prices;
      case 'flash_discount':
        return t.header.screenTitles.flashDiscount;
      case 'orders':
        return t.header.screenTitles.orders;
      case 'order_detail':
        return t.header.screenTitles.orderDetail;
      case 'supplier_result':
        return t.header.screenTitles.supplierResult;
      case 'profile':
        return t.header.screenTitles.supplierProfile;
      default:
        return undefined;
    }
  };

  return (
    <div className="min-h-screen bg-[#EBE5D6] flex justify-center selection:bg-teal-action selection:text-white">
      {/* 390px Mobile Viewport Container */}
      <div
        className={`w-full max-w-[390px] min-h-screen flex flex-col relative shadow-2xl border-x ${
          activeRole === 'supplier'
            ? 'bg-[#12221E] border-[#203630]'
            : 'bg-cream-surface border-[#DFD5BE]/60'
        }`}
      >
        {/* Floating Demo Mode Controller (works for both roles) */}
        <DemoBanner
          activeRole={activeRole}
          currentShopScreen={shopScreen}
          currentSupplierScreen={supplierScreen}
          onNavigateShop={navigateShopTo}
          onNavigateSupplier={navigateSupplierTo}
          lang={lang}
          onAutofillSearch={(q) => setSearchQuery(q)}
          onTriggerDeliveryScan={() => setIsAutoDeliveryTriggered(true)}
          onDispatchTruck={handleSupplierDispatchTruck}
        />

        {/* Floating "Show the other side" One-Tap Switch Button */}
        <ShowOtherSideButton
          activeRole={activeRole}
          onToggleRole={handleToggleRole}
          lang={lang}
          shopProfile={shopProfile}
          supplierProfile={supplierProfile}
        />

        {/* ROLE-BASED HEADER */}
        {activeRole === 'shop_owner' ? (
          <Header
            currentScreen={shopScreen}
            onBack={handleShopBack}
            lang={lang}
            onLanguageChange={setLang}
            screenTitle={getShopScreenTitle()}
            isTelegram={isTelegramWebApp()}
            onOpenAI={() => setIsAIOpen(true)}
          />
        ) : (
          <SupplierHeader
            currentScreen={supplierScreen}
            onBack={handleSupplierBack}
            lang={lang}
            onLanguageChange={setLang}
            screenTitle={getSupplierScreenTitle()}
            profile={supplierProfile}
            onOpenAI={() => setIsAIOpen(true)}
          />
        )}

        {/* MAIN CONTENT AREA */}
        <main
          className={`flex-1 px-3 pt-3 ${
            activeRole === 'supplier' ? 'bg-[#12221E] text-white' : 'bg-cream-surface text-ink'
          }`}
        >
          {/* SHOP OWNER SCREENS */}
          {activeRole === 'shop_owner' && (
            <>
              {shopScreen === 'price_board' && (
                <PriceBoardScreen
                  products={products}
                  onSelectProduct={(p) => {
                    setSelectedProduct(p);
                    navigateShopTo('product_detail');
                  }}
                  lang={lang}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onQuickJoinPool={() => navigateShopTo('group_order')}
                />
              )}

              {shopScreen === 'product_detail' && (
                <ProductDetailScreen
                  product={selectedProduct}
                  lang={lang}
                  onCompareSuppliers={() => navigateShopTo('supplier_compare')}
                  onSetAlert={(p) => {
                    setSelectedProduct(p);
                    navigateShopTo('alerts');
                  }}
                  onJoinPool={() => navigateShopTo('group_order')}
                />
              )}

              {shopScreen === 'supplier_compare' && (
                <SupplierScreen
                  suppliers={suppliers}
                  lang={lang}
                  onJoinPool={() => navigateShopTo('group_order')}
                  onSelectSupplier={(s) => setSelectedSupplier(s)}
                />
              )}

              {shopScreen === 'alerts' && (
                <AlertsScreen
                  alerts={alerts}
                  products={products}
                  lang={lang}
                  onToggleAlert={handleToggleAlert}
                  onCreateAlert={handleCreateAlert}
                />
              )}

              {shopScreen === 'group_order' && (
                <GroupOrderScreen
                  pool={pool}
                  lang={lang}
                  onPayToEscrow={handleShopPayToEscrow}
                  shopProfile={shopProfile}
                />
              )}

              {shopScreen === 'delivery_scan' && (
                <DeliveryScanScreen
                  lang={lang}
                  autoTrigger={isAutoDeliveryTriggered}
                  onConfirmSuccess={handleShopConfirmDelivery}
                />
              )}

              {shopScreen === 'savings_result' && (
                <SavingsResultScreen
                  lang={lang}
                  shopProfile={shopProfile}
                  onRestart={() => {
                    setSearchQuery('');
                    setIsAutoDeliveryTriggered(false);
                    navigateShopTo('price_board');
                  }}
                />
              )}

              {shopScreen === 'profile' && (
                <ProfileScreen
                  lang={lang}
                  onLanguageChange={setLang}
                  onOpenAI={() => setIsAIOpen(true)}
                  onSwitchRole={handleSwitchRole}
                  profile={shopProfile}
                />
              )}
            </>
          )}

          {/* SUPPLIER SCREENS */}
          {activeRole === 'supplier' && (
            <>
              {supplierScreen === 'dashboard' && (
                <SupplierDashboardScreen
                  lang={lang}
                  poolOrder={poolOrder}
                  flashDeal={flashDeal}
                  supplierProfile={supplierProfile}
                  onNavigatePrices={() => navigateSupplierTo('prices')}
                  onNavigateFlash={() => navigateSupplierTo('flash_discount')}
                  onNavigateOrderDetail={() => navigateSupplierTo('order_detail')}
                />
              )}

              {supplierScreen === 'prices' && (
                <SupplierPricesScreen
                  lang={lang}
                  products={products}
                  onUpdatePrices={handleUpdatePricesBySupplier}
                  onNavigateDashboard={() => navigateSupplierTo('dashboard')}
                />
              )}

              {supplierScreen === 'flash_discount' && (
                <SupplierFlashDealScreen
                  lang={lang}
                  flashDeal={flashDeal}
                  onUpdateFlashDeal={handleUpdateFlashDeal}
                  onNavigateOrders={() => navigateSupplierTo('orders')}
                />
              )}

              {supplierScreen === 'orders' && (
                <SupplierOrdersScreen
                  lang={lang}
                  poolOrder={poolOrder}
                  onSelectOrder={() => navigateSupplierTo('order_detail')}
                  onDispatchTruck={handleSupplierDispatchTruck}
                />
              )}

              {supplierScreen === 'order_detail' && (
                <SupplierOrderDetailScreen
                  lang={lang}
                  poolOrder={poolOrder}
                  onDispatchTruck={handleSupplierDispatchTruck}
                  onNavigateResult={() => navigateSupplierTo('supplier_result')}
                  shopProfile={shopProfile}
                />
              )}

              {supplierScreen === 'supplier_result' && (
                <SupplierResultScreen
                  lang={lang}
                  poolOrder={poolOrder}
                  onNavigateDashboard={() => navigateSupplierTo('dashboard')}
                />
              )}

              {supplierScreen === 'profile' && (
                <SupplierProfileScreen
                  lang={lang}
                  onLanguageChange={setLang}
                  profile={supplierProfile}
                  onSwitchRole={handleSwitchRole}
                />
              )}
            </>
          )}

          {/* Sample Data Disclaimer Footer */}
          <SampleDataFooter lang={lang} />
        </main>

        {/* ROLE-BASED BOTTOM NAVIGATION */}
        {activeRole === 'shop_owner' ? (
          <BottomNav
            currentScreen={shopScreen}
            onNavigate={(screen) => navigateShopTo(screen)}
            lang={lang}
          />
        ) : (
          <SupplierBottomNav
            currentScreen={supplierScreen}
            onNavigate={(screen) => navigateSupplierTo(screen)}
            lang={lang}
            hasIncomingOrder={poolOrder.status !== 'open'}
          />
        )}

        {/* Bozorchi AI Copilot Assistant Sheet */}
        <BozorchiAICopilot
          isOpen={isAIOpen}
          onClose={() => setIsAIOpen(false)}
          lang={lang}
          userName={
            activeRole === 'shop_owner'
              ? shopProfile.name || shopProfile.shopName
              : supplierProfile.name || supplierProfile.companyName
          }
        />
      </div>
    </div>
  );
};

export default App;
