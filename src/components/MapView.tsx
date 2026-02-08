import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import InteractiveMap from '@/components/InteractiveMap';
import { useToast } from '@/hooks/use-toast';

type Listing = {
  id: number;
  title: string;
  type: string;
  city: string;
  district: string;
  price: number;
  auction: number;
  image_url: string;
  logo_url?: string;
  metro: string;
  metroWalk: number;
  hasParking: boolean;
  features: string[];
  lat: number;
  lng: number;
  minHours: number;
  rooms: { type: string; price: number }[];
  phone?: string;
  telegram?: string;
};

interface MapViewProps {
  listings: Listing[];
  selectedListing: number | null;
  onListingSelect: (id: number | null) => void;
  onToggleMap: () => void;
  selectedCity?: string;
}

export default function MapView({ 
  listings, 
  selectedListing, 
  onListingSelect, 
  onToggleMap,
  selectedCity
}: MapViewProps) {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isAutoGeocoding, setIsAutoGeocoding] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalToProcess, setTotalToProcess] = useState(0);
  const { toast } = useToast();

  const handleGeocode = async () => {
    setIsGeocoding(true);
    try {
      const response = await fetch('https://functions.poehali.dev/f7e412a1-066f-4874-9e38-1e5beec62eae', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      toast({
        title: 'Геокодирование завершено',
        description: `Обновлено: ${data.updated}, Не удалось: ${data.failed}`,
      });
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось запустить геокодирование',
        variant: 'destructive'
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleAutoGeocode = async () => {
    setIsAutoGeocoding(true);
    setProcessedCount(0);
    setTotalToProcess(1499);

    let totalUpdated = 0;
    let totalFailed = 0;
    let iteration = 0;
    const maxIterations = 50;

    while (iteration < maxIterations) {
      try {
        const response = await fetch('https://functions.poehali.dev/f7e412a1-066f-4874-9e38-1e5beec62eae', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        
        totalUpdated += data.updated || 0;
        totalFailed += data.failed || 0;
        setProcessedCount(totalUpdated + totalFailed);

        if (data.total === 0) {
          toast({
            title: 'Геокодирование завершено!',
            description: `Успешно обработано: ${totalUpdated}, Не удалось: ${totalFailed}`,
          });
          window.location.reload();
          break;
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
        iteration++;
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Геокодирование прервано из-за ошибки',
          variant: 'destructive'
        });
        break;
      }
    }

    if (iteration >= maxIterations) {
      toast({
        title: 'Геокодирование приостановлено',
        description: `Обработано: ${totalUpdated}, осталось еще объектов. Запустите снова.`,
      });
      window.location.reload();
    }

    setIsAutoGeocoding(false);
  };

  return (
    <div className="relative h-[70vh] min-h-[400px] max-h-[800px] rounded-xl overflow-hidden border-2 border-purple-200 shadow-xl">
      <InteractiveMap
        listings={listings}
        selectedId={selectedListing}
        onSelectListing={onListingSelect}
        selectedCity={selectedCity}
      />
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="bg-white hover:bg-gray-100 shadow-lg"
            onClick={handleGeocode}
            disabled={isGeocoding || isAutoGeocoding}
          >
            <Icon name="MapPin" size={18} className="mr-2" />
            {isGeocoding ? 'Обновление...' : 'Обновить (30 шт)'}
          </Button>
          <Button
            variant="secondary"
            className="bg-white hover:bg-gray-100 shadow-lg"
            onClick={onToggleMap}
            disabled={isAutoGeocoding}
          >
            <Icon name="List" size={18} className="mr-2" />
            Показать список
          </Button>
        </div>
        <Button
          variant="default"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
          onClick={handleAutoGeocode}
          disabled={isAutoGeocoding || isGeocoding}
        >
          <Icon name="Zap" size={18} className="mr-2" />
          {isAutoGeocoding ? `Обработано: ${processedCount} / ${totalToProcess}` : 'Обработать все объекты'}
        </Button>
      </div>
    </div>
  );
}