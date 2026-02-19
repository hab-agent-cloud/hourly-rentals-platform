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
  maxPrice: number | null;
  setMaxPrice: (value: number | null) => void;
  selectedFeatures: string[];
  setSelectedFeatures: (value: string[]) => void;
  detectedCity?: string | null;
  nearMe: boolean;
  setNearMe: (value: boolean) => void;
  setUserLocation: (value: {lat: number, lng: number} | null) => void;
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
  maxPrice,
  setMaxPrice,
  selectedFeatures,
  setSelectedFeatures,
  detectedCity,
  nearMe,
  setNearMe,
  setUserLocation,
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
    { icon: 'UserX', text: 'БЕЗ ПОСРЕДНИКОВ И БЕЗ РЕГИСТРАЦИИ' },
    { icon: 'Mic', text: 'УМНЫЙ ГОЛОСОВОЙ ПОИСК' },
    { icon: 'WifiOff', text: 'РАБОТАЕТ БЕЗ ИНТЕРНЕТА' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % messages.length);
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
    
    // Парсинг метро - ищем слово после "метро" ИЛИ после названия города
    let metro = '';
    const metroMatch = lowerText.match(/метро\s+([а-яё\s-]+?)(?:\s*,|\s*$)/i);
    if (metroMatch) {
      metro = metroMatch[1].trim();
    } else if (detectedCity) {
      // Если город найден, берём всё что после него (убираем название города из текста)
      const cityInText = lowerText.match(new RegExp(detectedCity, 'i'));
      if (cityInText) {
        const afterCity = lowerText.substring(cityInText.index! + cityInText[0].length).trim();
        // Убираем знаки препинания и берём первое слово
        metro = afterCity.replace(/^[,\s]+/, '').split(/[\s,]+/)[0] || '';
      }
    }
    
    return { city: detectedCity, metro };
  };

  const handleVoiceSearch = async () => {
    console.log('[Voice] Button clicked');
    console.log('[Voice] User agent:', navigator.userAgent);
    
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    console.log('[Voice] isIOS:', isIOS, 'isSafari:', isSafari);
    
    if (isIOS && !isSafari) {
      console.log('[Voice] Error: iOS but not Safari');
      setVoiceError('На iOS голосовой поиск работает только в Safari');
      return;
    }
    
    const hasWebkit = 'webkitSpeechRecognition' in window;
    const hasStandard = 'SpeechRecognition' in window;
    console.log('[Voice] webkitSpeechRecognition:', hasWebkit, 'SpeechRecognition:', hasStandard);
    
    if (!hasWebkit && !hasStandard) {
      console.log('[Voice] Error: No speech recognition support');
      setVoiceError('Голосовой поиск не поддерживается в вашем браузере');
      return;
    }

    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      console.log('[Voice] Creating recognition instance');
      const recognition = new SpeechRecognition();
      recognition.lang = 'ru-RU';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        console.log('[Voice] Recognition started');
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('[Voice] Transcript:', transcript);
        const parsed = parseVoiceQuery(transcript);
        console.log('[Voice] Parsed:', parsed);
        
        if (parsed.city) {
          setSelectedCity(parsed.city);
          // Если есть метро - ищем только по метро, город уже выбран фильтром
          setSearchCity(parsed.metro || '');
        } else if (parsed.metro) {
          setSearchCity(parsed.metro);
        } else {
          setSearchCity(transcript);
        }
        
        onFilterChange?.();
      };

      recognition.onerror = (event: any) => {
        console.log('[Voice] Error:', event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          setVoiceError('Речь не распознана. Попробуйте еще раз');
        } else if (event.error === 'not-allowed') {
          setVoiceError('Доступ к микрофону запрещен. Проверьте настройки браузера');
        } else {
          setVoiceError(`Ошибка: ${event.error}`);
        }
      };

      recognition.onend = () => {
        console.log('[Voice] Recognition ended');
        setIsListening(false);
      };

      console.log('[Voice] Starting recognition...');
      recognition.start();
    } catch (error) {
      console.error('[Voice] Exception:', error);
      setVoiceError('Ошибка инициализации голосового поиска');
      setIsListening(false);
    }
  };
  return (
    <section className="mb-6 sm:mb-12 pt-12 sm:pt-16 md:pt-20 text-center animate-fade-in px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-3 sm:p-6 border border-purple-100">
          <div className="flex flex-col md:flex-row gap-2 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={detectedCity ? `Поиск в ${detectedCity}...` : "Город, адрес, метро..."}
                  className="pl-10 pr-20 h-10 sm:h-12 text-base sm:text-lg border-purple-200"
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
                  type="button"
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 hover:scale-110 hover:shadow-2xl disabled:opacity-50 transition-all duration-300 shadow-xl hover:shadow-purple-500/50 ${isListening ? 'animate-pulse scale-110' : ''}`}
                  style={{ zIndex: 9999 }}
                  title="Голосовой поиск"
                  aria-label="Голосовой поиск"
                >
                  {isListening && (
                    <span className="absolute inset-0 rounded-full bg-purple-400 animate-ping opacity-75"></span>
                  )}
                  <Icon name={isListening ? "Radio" : "Mic"} size={20} className="relative" />
                </button>
              </div>
              {voiceError && (
                <p className="text-xs text-red-500 mt-1">{voiceError}</p>
              )}
              {!isListening && !voiceError && (
                <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                  <Icon name="Info" size={12} />
                  <span>Нажмите на микрофон и скажите: "Москва, метро Чистые пруды"</span>
                </p>
              )}
              {isListening && (
                <p className="text-xs text-purple-600 mt-1 flex items-center gap-1 animate-pulse">
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
            <div className="flex flex-wrap gap-2 items-center">
              {['Москва', 'Санкт-Петербург'].map(city => (
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
              <Icon name="MapPin" size={16} className="text-purple-600" />
              <span className="text-sm font-semibold text-purple-700">Все города:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {cities.filter(c => c !== 'Все города' && c !== 'Москва' && c !== 'Санкт-Петербург').slice(0, 8).map(city => (
                <Badge
                  key={city}
                  variant="secondary"
                  className="cursor-pointer hover:bg-purple-100"
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
              <Badge 
                variant={maxPrice === 1000 ? "default" : "secondary"} 
                className={`cursor-pointer ${maxPrice === 1000 ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'hover:bg-purple-100'}`}
                onClick={() => {
                  setMaxPrice(maxPrice === 1000 ? null : 1000);
                  onFilterChange?.();
                }}
              >
                <Icon name="DollarSign" size={14} className="mr-1" />
                До 1000₽
              </Badge>
              <Badge 
                variant={maxPrice === 1500 ? "default" : "secondary"} 
                className={`cursor-pointer ${maxPrice === 1500 ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'hover:bg-purple-100'}`}
                onClick={() => {
                  setMaxPrice(maxPrice === 1500 ? null : 1500);
                  onFilterChange?.();
                }}
              >
                <Icon name="DollarSign" size={14} className="mr-1" />
                До 1500₽
              </Badge>
              <Badge 
                variant={nearMe ? "default" : "secondary"} 
                className={`cursor-pointer ${nearMe ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'hover:bg-purple-100'}`}
                onClick={() => {
                  if (!nearMe) {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          setUserLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                          });
                          setNearMe(true);
                          onFilterChange?.();
                        },
                        () => {
                          alert('Не удалось определить ваше местоположение');
                        }
                      );
                    } else {
                      alert('Ваш браузер не поддерживает геолокацию');
                    }
                  } else {
                    setNearMe(false);
                    setUserLocation(null);
                    onFilterChange?.();
                  }
                }}
              >
                <Icon name="Navigation" size={14} className="mr-1" />
                Рядом со мной
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