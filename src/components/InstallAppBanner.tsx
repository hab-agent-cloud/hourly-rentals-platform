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
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Icon name="Smartphone" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Установка на iPhone/iPad</h3>
              <p className="text-sm text-gray-600">Следуйте инструкции ниже</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowIOSInstructions(false)}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-white p-4 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium">Нажмите кнопку «Поделиться»</p>
              <div className="flex items-center gap-2 mt-2 text-purple-600">
                <Icon name="Share" size={20} />
                <span className="text-sm">В нижней части экрана Safari</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Icon name="ArrowDown" size={24} className="text-purple-400 animate-bounce" />
          </div>

          <div className="flex items-start gap-3 bg-white p-4 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium">Выберите «На экран Домой»</p>
              <div className="flex items-center gap-2 mt-2 text-purple-600">
                <Icon name="PlusSquare" size={20} />
                <span className="text-sm">Прокрутите вниз в меню</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Icon name="ArrowDown" size={24} className="text-purple-400 animate-bounce" />
          </div>

          <div className="flex items-start gap-3 bg-white p-4 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <p className="font-medium">Нажмите «Добавить»</p>
              <p className="text-sm text-gray-600 mt-1">Готово! Иконка появится на главном экране</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Icon name="Smartphone" size={32} className="text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-xl mb-2">📱 Установите приложение</h3>
          <p className="text-gray-700 text-sm sm:text-base">
            Быстрый доступ к бронированию прямо с главного экрана вашего телефона
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="flex items-center gap-1 text-xs text-purple-700">
              <Icon name="Check" size={14} />
              <span>Работает без интернета</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-purple-700">
              <Icon name="Check" size={14} />
              <span>Мгновенная загрузка</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-purple-700">
              <Icon name="Check" size={14} />
              <span>Как обычное приложение</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={handleInstallClick}
            size="lg"
            className="flex-1 sm:flex-initial"
          >
            <Icon name="Download" size={20} className="mr-2" />
            {isIOS ? 'Как установить?' : 'Установить'}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={handleDismiss}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
