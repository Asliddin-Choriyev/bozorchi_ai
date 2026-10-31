declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        enableClosingConfirmation: () => void;
        openTelegramLink: (url: string) => void;
        openLink: (url: string) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (ok: boolean) => void) => void;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
          setText: (text: string) => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
        BackButton: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}

export function isTelegramWebApp(): boolean {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp?.initDataUnsafe;
}

export function initTelegramApp() {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    try {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      window.Telegram.WebApp.setHeaderColor('#0B6B62');
      window.Telegram.WebApp.setBackgroundColor('#F4EFE4');
    } catch (e) {
      console.warn('Telegram WebApp init error', e);
    }
  }
}

export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
    try {
      if (type === 'success' || type === 'warning' || type === 'error') {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred(type);
      } else {
        window.Telegram.WebApp.HapticFeedback.impactOccurred(type);
      }
    } catch {
      // ignore
    }
  }
}

let currentMainButtonCb: (() => void) | null = null;
let currentBackButtonCb: (() => void) | null = null;

export function configureMainButton({
  text,
  onClick,
  isVisible = true,
  color = '#0B6B62',
  textColor = '#FFFFFF'
}: {
  text: string;
  onClick: () => void;
  isVisible?: boolean;
  color?: string;
  textColor?: string;
}) {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.MainButton) {
    const mb = window.Telegram.WebApp.MainButton;
    if (currentMainButtonCb) {
      mb.offClick(currentMainButtonCb);
    }
    if (isVisible) {
      mb.setText(text);
      mb.color = color;
      mb.textColor = textColor;
      currentMainButtonCb = onClick;
      mb.onClick(onClick);
      mb.show();
      mb.enable();
    } else {
      mb.hide();
      currentMainButtonCb = null;
    }
  }
}

export function hideMainButton() {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.MainButton) {
    const mb = window.Telegram.WebApp.MainButton;
    if (currentMainButtonCb) {
      mb.offClick(currentMainButtonCb);
      currentMainButtonCb = null;
    }
    mb.hide();
  }
}

export function configureBackButton(onClick: (() => void) | null) {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.BackButton) {
    const bb = window.Telegram.WebApp.BackButton;
    if (currentBackButtonCb) {
      bb.offClick(currentBackButtonCb);
      currentBackButtonCb = null;
    }
    if (onClick) {
      currentBackButtonCb = onClick;
      bb.onClick(onClick);
      bb.show();
    } else {
      bb.hide();
    }
  }
}
