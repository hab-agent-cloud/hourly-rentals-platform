import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { City } from '@/data/citiesData';

interface CityHeaderProps {
  city: City;
}

export function CityHeader({ city }: CityHeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-purple-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="https://cdn.poehali.dev/projects/1a35ca30-983f-4a91-b0b4-3c6fa1c9a65b/files/eb1f7656-79bf-458f-a9d8-00f75775f384.jpg" 
              alt="120 минут" 
              className="h-16 w-16 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                120 минут
              </h1>
              <p className="text-xs text-muted-foreground">Почасовая аренда по всей России</p>
            </div>
          </Link>
          <Link to="/">
            <Button variant="outline">
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              На главную
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}