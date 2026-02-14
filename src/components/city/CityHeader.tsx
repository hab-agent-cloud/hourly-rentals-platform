import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { City } from '@/data/citiesData';

interface CityHeaderProps {
  city: City;
}

export default function CityHeader({ city }: CityHeaderProps) {
  return (
    <>
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-purple-200 shadow-sm mb-8">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 sm:gap-4 hover:opacity-80 transition-opacity">
              <img 
                src="https://cdn.poehali.dev/projects/1a35ca30-983f-4a91-b0b4-3c6fa1c9a65b/files/67e411bb-a84a-41da-b7d3-5702e81761bb.jpg" 
                alt="120 минут" 
                className="flex-shrink-0 min-w-[64px] min-h-[64px] h-16 w-16 sm:h-16 sm:w-16 md:h-20 md:w-20 md:min-w-[80px] md:min-h-[80px] object-contain rounded-lg hover:scale-110 transition-transform duration-300"
                loading="eager"
              />
              <div>
                <h1 className="text-xs sm:text-base md:text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent whitespace-nowrap">
                  Почасовая аренда по всей России
                </h1>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-purple-700 hover:bg-purple-50 hover:text-purple-800">
                  <Icon name="Home" size={18} className="mr-2" />
                  <span className="hidden sm:inline">Главная</span>
                </Button>
              </Link>
              <a href="/add-listing">
                <Button variant="outline" size="sm" className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-800">
                  <Icon name="Plus" size={18} className="mr-2" />
                  <span className="hidden sm:inline">Добавить объект</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* City Content */}
      <div className="container mx-auto px-2 sm:px-4 mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-purple-600">Главная</Link>
          <Icon name="ChevronRight" size={16} />
          <span>{city.name}</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Аренда на час в {city.name} — отели и номера от 1 часа
        </h2>
        <p className="text-lg text-muted-foreground mb-2">{city.description}</p>
        <p className="text-sm text-muted-foreground">{city.region}</p>
      </div>
    </>
  );
}