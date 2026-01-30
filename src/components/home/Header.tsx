import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-purple-200 shadow-sm">
      <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <img 
              src="https://cdn.poehali.dev/projects/1a35ca30-983f-4a91-b0b4-3c6fa1c9a65b/files/008f171e-27f6-47bb-9816-d1328901d901.jpg" 
              alt="120 минут" 
              className="flex-shrink-0 min-w-[64px] min-h-[64px] h-16 w-16 sm:h-16 sm:w-16 md:h-20 md:w-20 md:min-w-[80px] md:min-h-[80px] object-cover rounded-lg hover:scale-110 transition-transform duration-300 cursor-pointer shadow-lg"
              loading="eager"
            />
            <div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                120 минут
              </h1>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground whitespace-nowrap">Почасовая аренда по всей России</p>
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
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200 mb-3">
                      <div className="text-xs text-green-700 mb-1 flex items-center gap-1">
                        <Icon name="Phone" size={12} />
                        Бесплатная горячая линия
                      </div>
                      <a href="tel:88002347120" className="text-base font-bold text-green-600 hover:text-green-700">
                        8 800 234-71-20
                      </a>
                    </div>
                    <a href="/add-listing" className="block">
                      <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-800">
                        <Icon name="Plus" size={18} className="mr-2" />
                        Добавить объект
                      </Button>
                    </a>
                    <a href="/owner/login" className="block">
                      <Button variant="outline" className="w-full">
                        Экстранет для владельцев
                      </Button>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <div className="hidden lg:flex items-center mr-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg px-3 py-2 border border-green-200">
              <Icon name="Phone" size={16} className="text-green-600 mr-2" />
              <div className="flex flex-col">
                <span className="text-[10px] text-green-600 leading-tight">Бесплатная линия</span>
                <a href="tel:88002347120" className="text-sm font-bold text-green-700 hover:text-green-800 leading-tight">
                  8 800 234-71-20
                </a>
              </div>
            </div>
            
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
              <Button variant="outline">
                Экстранет для владельцев
              </Button>
            </a>
          </nav>
          </div>
        </div>
      </div>
    </header>
  );
}