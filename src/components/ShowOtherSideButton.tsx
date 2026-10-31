import React from 'react';
import { UserRole, Language, ShopOwnerProfile, SupplierProfile } from '../types';
import { translations } from '../i18n';
import { ArrowLeftRight, Store, Truck } from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface Props {
  activeRole: UserRole;
  onToggleRole: () => void;
  lang: Language;
  shopProfile?: ShopOwnerProfile;
  supplierProfile?: SupplierProfile;
}

export const ShowOtherSideButton: React.FC<Props> = ({
  activeRole,
  onToggleRole,
  lang,
  shopProfile,
  supplierProfile
}) => {
  const t = translations[lang];

  if (activeRole === 'unselected') return null;

  const isShop = activeRole === 'shop_owner';
  const supLabel = supplierProfile?.name ? `(${supplierProfile.name})` : '';
  const shopLabel = shopProfile?.name ? `(${shopProfile.name})` : '';

  return (
    <div className="fixed bottom-[60px] left-0 right-0 z-40 pointer-events-none px-3">
      <div className="max-w-[390px] mx-auto flex justify-center">
        <button
          onClick={() => {
            triggerHaptic('medium');
            onToggleRole();
          }}
          className={`pointer-events-auto min-h-[38px] px-3.5 py-1.5 rounded-full shadow-float flex items-center gap-2 border-2 transition-all duration-200 active:scale-95 animate-pulse hover:animate-none ${
            isShop
              ? 'bg-[#0A1714] text-gold-highlight border-gold-highlight/80 hover:bg-black'
              : 'bg-teal-action text-white border-white/60 hover:bg-teal-hover'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5 stroke-[2.5]" />
          <div className="flex items-center gap-1.5 text-xs font-bold tracking-tight">
            <span>{t.roleSelection.showOtherSideBtn}:</span>
            <span className="underline font-black flex items-center gap-1">
              {isShop ? (
                <>
                  <Truck className="w-3.5 h-3.5" />
                  <span>{t.roleSelection.supplierRoleLabel} {supLabel}</span>
                </>
              ) : (
                <>
                  <Store className="w-3.5 h-3.5" />
                  <span>{t.roleSelection.shopRoleLabel} {shopLabel}</span>
                </>
              )}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
