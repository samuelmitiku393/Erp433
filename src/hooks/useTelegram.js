import { useEffect, useState } from 'react';

const useTelegram = () => {
  const [webApp, setWebApp] = useState(null);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (!tg) {
      console.warn('Telegram WebApp not found, running in browser mode');
      return;
    }

    try {
      tg.ready();
      tg.expand();

      setTheme(tg.colorScheme || 'light');
      setUser(tg.initDataUnsafe?.user || null);
      setWebApp(tg);

      document.body.className = `tg-theme-${tg.colorScheme || 'light'}`;

      tg.onEvent('themeChanged', () => {
        setTheme(tg.colorScheme || 'light');
        document.body.className = `tg-theme-${tg.colorScheme || 'light'}`;
      });

      if (tg.BackButton) {
        tg.BackButton.onClick(() => {
          if (window.history.length > 1) window.history.back();
          else tg.close();
        });
      }

      console.log('✅ Telegram WebApp ready');
    } catch (err) {
      console.error('Telegram init error:', err);
    }
  }, []);

  return {
    webApp,
    user,
    theme,
    sendData: (data) => webApp?.sendData(JSON.stringify(data)),
    close: () => webApp?.close(),
    showAlert: (msg) => webApp?.showAlert(msg),
    hapticFeedback: webApp?.HapticFeedback,
  };
};

export default useTelegram;
