import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { City } from '@/data/citiesData';

interface CityHeaderProps {
  city: City;
}

export default function CityHeader({ city }: CityHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link to="/" className="hover:text-purple-600">Главная</Link>
        <Icon name="ChevronRight" size={16} />
        <span>{city.name}</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
        Почасовая аренда отелей в {city.name}
      </h1>
      <p className="text-lg text-muted-foreground mb-2">{city.description}</p>
      <p className="text-sm text-muted-foreground">{city.region}</p>
    </div>
  );
}
