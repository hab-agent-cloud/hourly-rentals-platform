import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface SearchHeroFiltersProps {
  hasParking: boolean;
  setHasParking: (value: boolean) => void;
  minHours: number | null;
  setMinHours: (value: number | null) => void;
  maxPrice: number | null;
  setMaxPrice: (value: number | null) => void;
  nearMe: boolean;
  setNearMe: (value: boolean) => void;
  setUserLocation: (value: { lat: number; lng: number } | null) => void;
  onFilterChange?: () => void;
}

export default function SearchHeroFilters({
  hasParking,
  setHasParking,
  minHours,
  setMinHours,
  maxPrice,
  setMaxPrice,
  nearMe,
  setNearMe,
  setUserLocation,
  onFilterChange,
}: SearchHeroFiltersProps) {
  return (
    <>
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
    </>
  );
}
