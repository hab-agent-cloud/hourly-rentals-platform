import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface VoiceSearchBannerProps {
  onTryVoiceSearch?: () => void;
}

export default function VoiceSearchBanner({ onTryVoiceSearch }: VoiceSearchBannerProps) {
  const handleTryClick = () => {
    const searchInput = document.querySelector('input[placeholder*="Город"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        searchInput.focus();
      }, 500);
    }
    onTryVoiceSearch?.();
  };
  return (
    <Card className="md:hidden border-2 border-purple-300 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 mb-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-300/20 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-300/20 rounded-full -ml-12 -mb-12"></div>
      
      <div className="p-4 sm:p-6 relative z-10">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center animate-pulse">
            <Icon name="Mic" size={20} className="text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-bold text-purple-900 mb-1 sm:mb-2">
              🎙️ Голосовой поиск на мобильных
            </h3>
            <p className="text-xs sm:text-sm text-purple-800 mb-2 sm:mb-3">
              Нажмите на микрофон в поисковой строке и скажите, что ищете — город, станцию метро, район. 
              Фильтры применятся автоматически!
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/60 rounded-full text-xs font-medium text-purple-700">
                <Icon name="Smartphone" size={12} />
                <span>Только для мобильных</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/60 rounded-full text-xs font-medium text-purple-700">
                <Icon name="Zap" size={12} />
                <span>Быстрый поиск</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/60 rounded-full text-xs font-medium text-purple-700">
                <Icon name="Shield" size={12} />
                <span>Без интернета</span>
              </div>
              <Button
                onClick={handleTryClick}
                size="sm"
                className="md:hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xs h-7"
              >
                <Icon name="Mic" size={12} className="mr-1" />
                Попробовать
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}