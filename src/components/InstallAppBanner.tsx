import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallAppBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Определяем iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Проверяем, установлено ли приложение
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    // Проверяем, было ли закрыто ранее
    const wasDismissed = localStorage.getItem('pwa-banner-dismissed');

    if (!isInstalled && !wasDismissed) {
      setShowBanner(true);
      setTimeout(() => setIsVisible(true), 100);
    }

    // Для Android/Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowBanner(false);
      localStorage.setItem('pwa-banner-dismissed', 'true');
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!showBanner) {
    return null;
  }

  if (showIOSInstructions) {
    return (
      <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Icon name="Smartphone" size={20} className="text-white sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">📱 Установка на iOS</h3>
              <p className="text-xs sm:text-sm text-gray-600">Инструкция для iPhone/iPad</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowIOSInstructions(false)}
          >
            <Icon name="X" size={18} />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2 sm:gap-3 bg-white p-3 sm:p-4 rounded-lg shadow">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm sm:text-base">Нажмите кнопку «Поделиться»</p>
              <div className="flex items-center gap-2 mt-1 text-purple-600">
                <Icon name="Share" size={16} />
                <span className="text-xs sm:text-sm">Внизу экрана Safari</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Icon name="ArrowDown" size={20} className="text-purple-400 animate-bounce" />
          </div>

          <div className="flex items-start gap-2 sm:gap-3 bg-white p-3 sm:p-4 rounded-lg shadow">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm sm:text-base">Выберите «На экран Домой»</p>
              <div className="flex items-center gap-2 mt-1 text-purple-600">
                <Icon name="PlusSquare" size={16} />
                <span className="text-xs sm:text-sm">Прокрутите список вниз</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Icon name="ArrowDown" size={20} className="text-purple-400 animate-bounce" />
          </div>

          <div className="flex items-start gap-2 sm:gap-3 bg-white p-3 sm:p-4 rounded-lg shadow">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              ✓
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm sm:text-base">Нажмите «Добавить»</p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">🎉 Готово! Приложение на главном экране</p>
            </div>
          </div>
        </div>
      </Card>
      </div>
    );
  }

  return (
    <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <Icon name="Smartphone" size={24} className="text-white sm:w-8 sm:h-8" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2">📱 Установите приложение</h3>
          <p className="text-gray-700 text-xs sm:text-base mb-2">
            Быстрый доступ с главного экрана {isIOS ? 'iPhone' : 'телефона'}
          </p>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-purple-700 bg-white/60 px-2 py-1 rounded-full">
              <Icon name="WifiOff" size={12} />
              <span>Без интернета</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-purple-700 bg-white/60 px-2 py-1 rounded-full">
              <Icon name="Zap" size={12} />
              <span>Быстро</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-purple-700 bg-white/60 px-2 py-1 rounded-full col-span-2 sm:col-span-1">
              <Icon name="Check" size={12} />
              <span>Как обычное приложение</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={handleInstallClick}
            size="lg"
            className="flex-1 sm:flex-initial bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm sm:text-base"
          >
            <Icon name={isIOS ? "Info" : "Download"} size={18} className="mr-2" />
            {isIOS ? 'Инструкция' : 'Установить'}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={handleDismiss}
            className="px-3"
          >
            <Icon name="X" size={18} />
          </Button>
        </div>
      </div>
    </Card>
    </div>
  );
}