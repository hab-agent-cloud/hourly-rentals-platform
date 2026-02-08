import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { useState, useEffect } from 'react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const wasDismissed = localStorage.getItem('pwa-install-dismissed');

    if (!isInstalled && !wasDismissed) {
      setShowInstallButton(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallButton(false);
        localStorage.setItem('pwa-install-dismissed', 'true');
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-purple-200 shadow-sm">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <img 
                src="https://cdn.poehali.dev/projects/1a35ca30-983f-4a91-b0b4-3c6fa1c9a65b/files/67e411bb-a84a-41da-b7d3-5702e81761bb.jpg" 
                alt="120 минут" 
                className="flex-shrink-0 min-w-[64px] min-h-[64px] h-16 w-16 sm:h-16 sm:w-16 md:h-20 md:w-20 md:min-w-[80px] md:min-h-[80px] object-contain rounded-lg hover:scale-110 transition-transform duration-300 cursor-pointer"
                loading="eager"
              />
              <div>
                <h1 className="text-xs sm:text-base md:text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
                  Почасовая аренда по всей России
                </h1>
                <p className="text-[10px] sm:text-xs md:text-sm font-bold bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 bg-clip-text text-transparent animate-shimmer-btn whitespace-nowrap">✨ Более 3000 объектов по России ✨</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="outline" size="sm">
                    <Icon name="Menu" size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Меню</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-2 mt-6">
                    <Button 
                      variant={activeTab === 'catalog' ? 'default' : 'ghost'} 
                      onClick={() => onTabChange('catalog')}
                      className="w-full justify-start"
                    >
                      Каталог
                    </Button>
                    <Button 
                      variant={activeTab === 'about' ? 'default' : 'ghost'} 
                      onClick={() => onTabChange('about')}
                      className="w-full justify-start"
                    >
                      О платформе
                    </Button>
                    <Button 
                      variant={activeTab === 'partners' ? 'default' : 'ghost'} 
                      onClick={() => onTabChange('partners')}
                      className="w-full justify-start"
                    >
                      Партнерам
                    </Button>
                    <Button 
                      variant={activeTab === 'support' ? 'default' : 'ghost'} 
                      onClick={() => onTabChange('support')}
                      className="w-full justify-start"
                    >
                      Поддержка
                    </Button>
                    <div className="border-t pt-4 mt-4 space-y-2">
                      <a href="/add-listing" className="block">
                        <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-800">
                          <Icon name="Plus" size={18} className="mr-2" />
                          Добавить объект
                        </Button>
                      </a>
                      <a href="/owner/login" className="block">
                        <Button variant="outline" className="w-full group border-blue-300 text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-800 hover:border-blue-400">
                          <Icon name="LogIn" size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                          Войти в аккаунт
                        </Button>
                      </a>
                    </div>
                    <div className="border-t pt-4 mt-4">
                      <div className="text-sm font-medium mb-2">Сменить фон:</div>
                      <ThemeSwitcher />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              <nav className="hidden md:flex items-center gap-3">
                <Button 
                  variant={activeTab === 'catalog' ? 'default' : 'ghost'} 
                  onClick={() => onTabChange('catalog')}
                  className={activeTab === 'catalog' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' : 'text-purple-700 hover:bg-purple-50 hover:text-purple-800'}
                >
                  Каталог
                </Button>
                <Button 
                  variant={activeTab === 'about' ? 'default' : 'ghost'} 
                  onClick={() => onTabChange('about')}
                  className={activeTab === 'about' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' : 'text-purple-700 hover:bg-purple-50 hover:text-purple-800'}
                >
                  О платформе
                </Button>
                <Button 
                  variant={activeTab === 'partners' ? 'default' : 'ghost'} 
                  onClick={() => onTabChange('partners')}
                  className={activeTab === 'partners' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' : 'text-purple-700 hover:bg-purple-50 hover:text-purple-800'}
                >
                  Партнерам
                </Button>
                <Button 
                  variant={activeTab === 'support' ? 'default' : 'ghost'} 
                  onClick={() => onTabChange('support')}
                  className={activeTab === 'support' ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' : 'text-purple-700 hover:bg-purple-50 hover:text-purple-800'}
                >
                  Поддержка
                </Button>
                <a href="/add-listing">
                  <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-800">
                    <Icon name="Plus" size={18} className="mr-2" />
                    Добавить объект
                  </Button>
                </a>
                <a href="/owner/login">
                  <Button variant="outline" className="group border-blue-300 text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-800 hover:border-blue-400 transition-all duration-300">
                    <Icon name="LogIn" size={18} className="mr-2 group-hover:scale-110 transition-transform" />
                    Войти в аккаунт
                  </Button>
                </a>
              </nav>
            </div>
          </div>
        
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 pt-2 border-t border-purple-100">
            <a href="tel:88002347120" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:from-green-100 hover:to-emerald-100 transition-all w-full sm:w-auto justify-center">
              <Icon name="Phone" size={18} className="text-green-600" />
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="text-base sm:text-lg font-bold text-green-700 leading-tight">8 800 234-71-20</span>
                <span className="text-[10px] sm:text-xs text-green-600 leading-tight">Бесплатная горячая линия</span>
              </div>
            </a>
            
            {showInstallButton && (
              <Button
                onClick={handleInstall}
                size="sm"
                variant="outline"
                className="gap-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 text-blue-700 w-full sm:w-auto"
              >
                <Icon name="Download" size={18} className="text-blue-600" />
                <span className="hidden lg:inline font-medium">Установить приложение</span>
                <span className="lg:hidden font-medium">Установить</span>
              </Button>
            )}
            
            <ThemeSwitcher />
          </div>
          
          {showIOSInstructions && (
            <div className="mt-2 p-4 bg-white rounded-lg border-2 border-blue-200 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-sm">Установка на iPhone/iPad</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowIOSInstructions(false)}>
                  <Icon name="X" size={16} />
                </Button>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">1.</span>
                  <p>Нажмите <Icon name="Share" size={14} className="inline" /> в Safari (внизу экрана)</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">2.</span>
                  <p>Выберите «На экран Домой»</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-blue-600">3.</span>
                  <p>Нажмите «Добавить»</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}