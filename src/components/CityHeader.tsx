import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { City } from '@/data/citiesData';


interface CityHeaderProps {
  city: City;
}

export function CityHeader({ city }: CityHeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img 
              src="https://cdn.poehali.dev/projects/1a35ca30-983f-4a91-b0b4-3c6fa1c9a65b/bucket/logo-new.png" 
              alt="120 минут" 
              className="h-12 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <Icon name="ArrowLeft" size={18} />
                На главную
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}