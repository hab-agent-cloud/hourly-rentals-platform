import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Listing {
  id: number;
  title: string;
  city: string;
  price: number;
  auction: number;
  lat: number;
  lng: number;
}

interface InteractiveMapProps {
  listings: Listing[];
  selectedId: number | null;
  onSelectListing: (id: number) => void;
  selectedCity?: string;
}

export default function InteractiveMap({ listings, selectedId, onSelectListing, selectedCity }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    if ((window as any).ymaps) {
      setIsScriptLoaded(true);
      return;
    }

    const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsScriptLoaded(true));
      return;
    }

    const loadMapScript = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/aac578aa-3e58-43b2-825d-b31024c23163');
        const data = await response.json();
        const apiKey = data.apiKey || '';
        
        console.log('Yandex Maps API Key loaded:', apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No');

        const script = document.createElement('script');
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
        script.async = true;
        script.onload = () => setIsScriptLoaded(true);
        script.onerror = () => console.error('Failed to load Yandex Maps script');
        document.head.appendChild(script);
      } catch (error) {
        console.error('Failed to load map API key:', error);
      }
    };

    loadMapScript();
  }, []);

  useEffect(() => {
    if (!mapRef.current || !isScriptLoaded || listings.length === 0) {
      console.log('Map init blocked:', { hasRef: !!mapRef.current, isScriptLoaded, listingsCount: listings.length });
      return;
    }

    const ymaps = (window as any).ymaps;
    if (!ymaps) {
      console.error('ymaps not available on window');
      return;
    }

    console.log('Initializing map with ymaps.ready...');
    
    ymaps.ready(['Map', 'Placemark', 'Clusterer']).then(() => {
      console.log('ymaps ready, creating map...');
      
      if (!mapRef.current) {
        console.error('mapRef lost during init');
        return;
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }

      const bounds = listings.map(l => [l.lat, l.lng]);
      
      try {
        const map = new ymaps.Map(mapRef.current, {
          center: bounds.length ? bounds[0] : [55.75, 37.62],
          zoom: 10,
          controls: ['zoomControl', 'fullscreenControl']
        }, {
          searchControlProvider: 'yandex#search'
        });
        
        console.log('Map created successfully');

        mapInstanceRef.current = map;

        const clusterer = new ymaps.Clusterer({
          preset: 'islands#violetClusterIcons',
          clusterDisableClickZoom: false,
          clusterOpenBalloonOnClick: false,
          gridSize: 64
        });

        const placemarks = listings.map((listing) => {
          const placemark = new ymaps.Placemark(
            [listing.lat, listing.lng],
            {
              balloonContentHeader: `<strong>${listing.title}</strong>`,
              balloonContentBody: `
                <div style="padding: 8px;">
                  <p style="margin: 4px 0;">📍 ${listing.city}</p>
                  <p style="margin: 4px 0;">💰 <strong>${listing.price} ₽</strong> / час</p>
                  <button onclick="window.location.href='/listing/${listing.id}'" style="margin-top: 8px; padding: 6px 12px; background: linear-gradient(to right, #9333ea, #ec4899); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
                    Открыть объект →
                  </button>
                </div>
              `,
              hintContent: listing.title,
              clusterCaption: listing.title
            },
            {
              preset: listing.auction <= 3 ? 'islands#redIcon' : 'islands#violetIcon',
              iconColor: listing.id === selectedId ? '#F97316' : (listing.auction <= 3 ? '#D946EF' : '#8B5CF6')
            }
          );

          placemark.events.add('click', () => {
            window.location.href = `/listing/${listing.id}`;
          });

          return placemark;
        });

        clusterer.add(placemarks);
        map.geoObjects.add(clusterer);

        if (bounds.length > 1) {
          map.setBounds(clusterer.getBounds(), { 
            checkZoomRange: true, 
            zoomMargin: 50
          });
        }
      } catch (error) {
        console.error('Error creating map:', error);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [listings, selectedId, isScriptLoaded]);

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Ваш браузер не поддерживает геолокацию');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter([latitude, longitude], 13, { duration: 500 });
          
          const ymaps = (window as any).ymaps;
          if (ymaps) {
            const myLocationPlacemark = new ymaps.Placemark(
              [latitude, longitude],
              { hintContent: 'Вы здесь' },
              { preset: 'islands#blueCircleIcon' }
            );
            mapInstanceRef.current.geoObjects.add(myLocationPlacemark);
          }
        }
        setIsLocating(false);
      },
      () => {
        alert('Не удалось определить ваше местоположение');
        setIsLocating(false);
      }
    );
  };

  return (
    <Card className="h-full overflow-hidden border-2 border-purple-200">
      <div className="relative w-full h-full">
        <div ref={mapRef} className="w-full h-full" />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-[200px]">
          <div className="text-xs font-semibold mb-2">Легенда карты:</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <span>ТОП-1/2/3</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
              <span>Обычные</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Выбранный</span>
            </div>
          </div>
        </div>
        <Button
          onClick={handleMyLocation}
          disabled={isLocating}
          className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 text-gray-900 shadow-lg border border-gray-200"
          size="icon"
        >
          {isLocating ? (
            <Icon name="Loader2" size={20} className="animate-spin" />
          ) : (
            <Icon name="Locate" size={20} />
          )}
        </Button>
        {listings.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
            <div className="text-center p-8">
              <div className="text-4xl mb-3">🗺️</div>
              <p className="text-muted-foreground">Нет объектов для отображения</p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}