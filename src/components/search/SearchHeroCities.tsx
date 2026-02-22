import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface SearchHeroCitiesProps {
  cities: string[];
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  setSearchCity: (value: string) => void;
  detectedCity?: string | null;
  onFilterChange?: () => void;
}

export default function SearchHeroCities({
  cities,
  selectedCity,
  setSelectedCity,
  setSearchCity,
  detectedCity,
  onFilterChange,
}: SearchHeroCitiesProps) {
  return (
    <>
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
              setSelectedCity(selectedCity === city ? '' : city);
              setSearchCity(selectedCity === city ? '' : city);
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
    </>
  );
}
