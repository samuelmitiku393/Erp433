export const shareToTelegram = (text, url) => {
  const tg = window.Telegram?.WebApp;
  
  if (tg && tg.shareMessage) {
    tg.shareMessage(text, url);
  } else {
    // Fallback for web
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  }
};

export const openTelegramChat = (username) => {
  const tg = window.Telegram?.WebApp;
  
  if (tg && tg.openTelegramLink) {
    tg.openTelegramLink(`https://t.me/${username}`);
  } else {
    window.open(`https://t.me/${username}`, '_blank');
  }
};