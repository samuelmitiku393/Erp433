import { useEffect, useState } from 'react';

const useTelegram = () => {
  const [webApp, setWebApp] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let checkTelegram;

    const initTelegram = () => {
      const tg = window.Telegram?.WebApp;
      if (!tg) return;

      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();

      document.body.className = `tg-theme-${tg.colorScheme || 'default'}`;

      const userData = tg.initDataUnsafe?.user || null;

      if (tg.BackButton?.onClick) {
        tg.BackButton.onClick(() => {
          if (window.history.length > 1) window.history.back();
          else tg.close();
        });
      }

      if (tg.MainButton?.setText && tg.MainButton?.onClick) {
        tg.MainButton.setText('Save');
        tg.MainButton.onClick(() => {
          tg.showPopup({
            title: 'Action',
            message: 'Main button clicked!',
            buttons: [{ type: 'ok' }]
          });
        });
      }

      setWebApp(tg);
      setUser(userData);
      setIsLoading(false);

      tg.onEvent('themeChanged', () => {
        document.body.className = `tg-theme-${tg.colorScheme || 'default'}`;
      });

      console.log('Telegram WebApp initialized:', userData);
    };

    if (window.Telegram?.WebApp) {
      initTelegram();
    } else {
      checkTelegram = setInterval(() => {
        if (window.Telegram?.WebApp) {
          clearInterval(checkTelegram);
          initTelegram();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkTelegram);
        if (!window.Telegram?.WebApp) {
          console.error('❌ Telegram WebApp SDK not loaded');
          setIsLoading(false);
        }
      }, 3000);
    }

    return () => clearInterval(checkTelegram);
  }, []);

  return {
    webApp,
    user,
    isLoading,
    initData: webApp?.initData,
    initDataUnsafe: webApp?.initDataUnsafe,
    sendData: (data) => webApp?.sendData(JSON.stringify(data)),
    close: () => webApp?.close(),
    showAlert: (message) => webApp?.showAlert(message),
    showConfirm: (message, callback) => webApp?.showConfirm(message, callback),
    hapticFeedback: webApp?.HapticFeedback
  };
};

export default useTelegram;
