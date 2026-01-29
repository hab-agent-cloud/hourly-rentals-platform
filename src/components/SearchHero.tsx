import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';

interface SearchHeroProps {
  searchCity: string;
  setSearchCity: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  cities: string[];
  showMap: boolean;
  setShowMap: (value: boolean) => void;
  hasParking: boolean;
  setHasParking: (value: boolean) => void;
  minHours: number | null;
  setMinHours: (value: number | null) => void;
  selectedFeatures: string[];
  setSelectedFeatures: (value: string[]) => void;
  detectedCity?: string | null;
  onFilterChange?: () => void;
}

export default function SearchHero({
  searchCity,
  setSearchCity,
  selectedType,
  setSelectedType,
  selectedCity,
  setSelectedCity,
  cities,
  showMap,
  setShowMap,
  hasParking,
  setHasParking,
  minHours,
  setMinHours,
  selectedFeatures,
  setSelectedFeatures,
  detectedCity,
  onFilterChange,
}: SearchHeroProps) {
  const popularFeatures = [
    { name: 'Джакузи', icon: 'Bath' },
    { name: 'Кухня', icon: 'ChefHat' },
    { name: 'PlayStation', icon: 'Gamepad2' },
  ];

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
    onFilterChange?.();
  };

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const messages = [
    { icon: 'UserX', text: 'БЕЗ ПОСРЕДНИКОВ' },
    { icon: 'UserCheck', text: 'БЕЗ РЕГИСТРАЦИИ НА САЙТЕ' },
    { icon: 'WifiOff', text: 'РАБОТАЕТ БЕЗ ИНТЕРНЕТА' },
    { icon: 'Mic', text: 'УМНЫЙ ГОЛОСОВОЙ ПОИСК' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        const newIndex = (prev + 2) % messages.length;
        console.log('Message index changed:', prev, '->', newIndex);
        return newIndex;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [messages.length]);

  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const parseVoiceQuery = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Парсинг города
    const cityPatterns = [
      { pattern: /москв/i, city: 'Москва' },
      { pattern: /(санкт[- ]петербург|питер|спб)/i, city: 'Санкт-Петербург' },
      { pattern: /казан/i, city: 'Казань' },
      { pattern: /самар/i, city: 'Самара' },
      { pattern: /екатеринбург/i, city: 'Екатеринбург' },
      { pattern: /уф/i, city: 'Уфа' },
      { pattern: /ростов/i, city: 'Ростов-на-Дону' },
      { pattern: /краснодар/i, city: 'Краснодар' },
      { pattern: /(нижний новгород|нижний)/i, city: 'Нижний Новгород' },
      { pattern: /новосибирск/i, city: 'Новосибирск' }
    ];
    
    let detectedCity = '';
    for (const { pattern, city } of cityPatterns) {
      if (pattern.test(lowerText)) {
        detectedCity = city;
        break;
      }
    }
    
    // Парсинг метро (простое извлечение слова после "метро")
    const metroMatch = lowerText.match(/метро\s+([а-яё\s-]+?)(?:\s|,|$)/i);
    const metro = metroMatch ? metroMatch[1].trim() : '';
    
    return { city: detectedCity, metro };
  };

  const handleVoiceSearch = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setVoiceError('Голосовой поиск не поддерживается в вашем браузере');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceError(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const parsed = parseVoiceQuery(transcript);
      
      if (parsed.city) {
        setSelectedCity(parsed.city);
        setSearchCity(parsed.metro ? `${parsed.city}, ${parsed.metro}` : parsed.city);
      } else if (parsed.metro) {
        setSearchCity(parsed.metro);
      } else {
        setSearchCity(transcript);
      }
      
      onFilterChange?.();
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      if (event.error === 'no-speech') {
        setVoiceError('Речь не распознана. Попробуйте еще раз');
      } else {
        setVoiceError('Ошибка распознавания речи');
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };
  return (
    <section className="mb-6 sm:mb-12 pt-12 sm:pt-16 md:pt-20 text-center animate-fade-in px-2">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent leading-tight">
          ПОЧАСОВАЯ АРЕНДА
        </h2>
        <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent leading-tight">
          ОТЕЛЕЙ И АПАРТАМЕНТОВ
        </h3>
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 md:gap-8 mb-4 sm:mb-6 min-h-[32px] sm:min-h-[40px]">
          <div key={`msg1-${currentMessageIndex}`} className="flex items-center justify-center gap-2 text-sm sm:text-lg md:text-xl font-semibold text-purple-700 animate-fade-in">
            <Icon name={messages[currentMessageIndex].icon as any} size={20} className="text-green-500 flex-shrink-0" />
            <span>{messages[currentMessageIndex].text}</span>
          </div>
          <div key={`msg2-${currentMessageIndex}`} className="flex items-center justify-center gap-2 text-sm sm:text-lg md:text-xl font-semibold text-purple-700 animate-fade-in">
            <Icon name={messages[(currentMessageIndex + 1) % messages.length].icon as any} size={20} className="text-green-500 flex-shrink-0" />
            <span>{messages[(currentMessageIndex + 1) % messages.length].text}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-6 mb-6 sm:mb-8 text-[11px] sm:text-base md:text-lg font-medium">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">1</div>
            <span className="whitespace-nowrap">ВЫБИРАЕТЕ</span>
          </div>
          <Icon name="ArrowRight" size={14} className="text-purple-600 rotate-90 sm:rotate-0 flex-shrink-0" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">2</div>
            <span className="whitespace-nowrap">СВЯЗЫВАЕТЕСЬ</span>
          </div>
          <Icon name="ArrowRight" size={14} className="text-purple-600 rotate-90 sm:rotate-0 flex-shrink-0" />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0">3</div>
            <span className="whitespace-nowrap">БРОНИРУЕТЕ</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-3 sm:p-6 border border-purple-100">
          <div className="flex flex-col md:flex-row gap-2 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Город, адрес, метро..."
                  className="pl-10 pr-16 h-10 sm:h-12 text-base sm:text-lg border-purple-200"
                  value={searchCity}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchCity(value);
                    // Если введенное значение точно совпадает с городом из списка, выбираем его
                    const matchingCity = cities.find(city => 
                      city.toLowerCase() === value.toLowerCase()
                    );
                    if (matchingCity) {
                      setSelectedCity(matchingCity);
                    } else if (value === '') {
                      setSelectedCity('');
                    }
                  }}
                />
                <button
                  onClick={handleVoiceSearch}
                  disabled={isListening}
                  className={`md:hidden absolute right-3 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 disabled:cursor-not-allowed transition-all z-20 ${isListening ? 'animate-pulse' : ''}`}
                  title="Голосовой поиск"
                >
                  {isListening && (
                    <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-75"></span>
                  )}
                  <Icon name={isListening ? "Radio" : "Mic"} size={16} className="relative z-10" />
                </button>
              </div>
              {voiceError && (
                <p className="text-xs text-red-500 mt-1 md:hidden">{voiceError}</p>
              )}
              {!isListening && !voiceError && (
                <p className="text-xs text-purple-600 mt-1 md:hidden flex items-center gap-1">
                  <Icon name="Info" size={12} />
                  <span>Нажмите на микрофон и скажите: "Москва, метро Чистые пруды"</span>
                </p>
              )}
              {isListening && (
                <p className="text-xs text-purple-600 mt-1 md:hidden flex items-center gap-1 animate-pulse">
                  <Icon name="Radio" size={12} />
                  <span>Слушаю...</span>
                </p>
              )}
            </div>

            <Button size="lg" className="h-10 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-sm sm:text-base">
              <Icon name="Search" size={18} className="mr-2" />
              Найти
            </Button>
          </div>

          <div className="space-y-3 mt-4">
            <div className="flex items-center gap-2">
              <Icon name="MapPin" size={16} className="text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Популярные города:</span>
              {detectedCity && (
                <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                  <Icon name="MapPinned" size={12} className="mr-1" />
                  Ваш город: {detectedCity}
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {['Уфа', 'Москва', 'Санкт-Петербург', 'Казань', 'Самара', 'Ростов-на-Дону', 'Краснодар', 'Нижний Новгород', 'Екатеринбург', 'Новосибирск'].map(city => (
                <Badge
                  key={city}
                  variant={selectedCity === city ? "default" : "secondary"}
                  className={`cursor-pointer ${selectedCity === city ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'hover:bg-purple-100'}`}
                  onClick={() => {
                    setSelectedCity(city);
                    setSearchCity(city);
                    onFilterChange?.();
                  }}
                >
                  {city}
                </Badge>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Icon name="Filter" size={16} className="text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Фильтры:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant={hasParking ? "default" : "secondary"} 
                className={`cursor-pointer ${hasParking ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'hover:bg-purple-100'}`}
                onClick={() => {
                  setHasParking(!hasParking);
                  onFilterChange?.();
                }}
              >
                <Icon name="Car" size={14} className="mr-1" />
                С парковкой
              </Badge>
              <Badge 
                variant={minHours === 1 ? "default" : "secondary"} 
                className={`cursor-pointer ${minHours === 1 ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'hover:bg-purple-100'}`}
                onClick={() => {
                  setMinHours(minHours === 1 ? null : 1);
                  onFilterChange?.();
                }}
              >
                <Icon name="Clock" size={14} className="mr-1" />
                От 1 часа
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-purple-100" onClick={() => setShowMap(!showMap)}>
                <Icon name="Map" size={14} className="mr-1" />
                <span className="hidden sm:inline">{showMap ? 'Показать списком' : 'Показать на карте'}</span>
                <span className="sm:hidden">{showMap ? 'Списком' : 'На карте'}</span>
              </Badge>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Icon name="Sparkles" size={16} className="text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Удобства в номере:</span>
              {selectedFeatures.length > 0 && (
                <button
                  onClick={() => setSelectedFeatures([])}
                  className="text-xs text-purple-600 hover:text-purple-800 underline"
                >
                  Очистить ({selectedFeatures.length})
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {popularFeatures.map((feature) => {
                const isSelected = selectedFeatures.includes(feature.name);
                return (
                  <Badge
                    key={feature.name}
                    variant={isSelected ? "default" : "secondary"}
                    className={`cursor-pointer group relative ${isSelected ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'hover:bg-purple-100'}`}
                    onClick={() => toggleFeature(feature.name)}
                  >
                    <Icon name={feature.icon} size={14} className="mr-1" />
                    {feature.name}
                    {isSelected && (
                      <Icon name="X" size={12} className="ml-1" />
                    )}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}