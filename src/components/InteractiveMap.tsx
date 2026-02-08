import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
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

  useEffect(() => {
    const loadYandexMaps = async () => {
      console.log('🗺️ InteractiveMap: Starting to load Yandex Maps');
      console.log('🗺️ Listings count:', listings.length);
      
      if ((window as any).ymaps) {
        console.log('🗺️ Yandex Maps API already loaded');
        initMap();
        return;
      }

      try {
        console.log('🗺️ Fetching API key...');
        const response = await fetch('https://functions.poehali.dev/aac578aa-3e58-43b2-825d-b31024c23163');
        const data = await response.json();
        const apiKey = data.apiKey || '';
        console.log('🗺️ API key received:', apiKey ? 'YES' : 'NO');

        const script = document.createElement('script');
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
        script.async = true;
        script.onload = () => {
          console.log('🗺️ Yandex Maps script loaded');
          (window as any).ymaps.ready(initMap);
        };
        script.onerror = (err) => {
          console.error('🗺️ Failed to load Yandex Maps script:', err);
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('🗺️ Failed to load Yandex Maps:', error);
      }
    };

    const initMap = () => {
      console.log('🗺️ initMap called');
      console.log('🗺️ mapRef.current:', mapRef.current);
      console.log('🗺️ listings.length:', listings.length);
      
      if (!mapRef.current || listings.length === 0) {
        console.log('🗺️ initMap aborted: no container or no listings');
        return;
      }

      if (mapInstanceRef.current) {
        console.log('🗺️ Destroying existing map instance');
        mapInstanceRef.current.destroy();
      }

      const ymaps = (window as any).ymaps;
      console.log('🗺️ Creating map instance...');
      
      const map = new ymaps.Map(mapRef.current, {
        center: [55.751244, 37.618423],
        zoom: 10,
        controls: ['zoomControl', 'fullscreenControl']
      });

      console.log('🗺️ Map created successfully');
      mapInstanceRef.current = map;

      setTimeout(() => {
        map.container.fitToViewport();
        console.log('🗺️ Map container fitted to viewport');
      }, 100);

      const clusterer = new ymaps.Clusterer({
        preset: 'islands#violetClusterIcons',
        clusterDisableClickZoom: false,
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
            hintContent: listing.title
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

      if (listings.length > 1) {
        map.setBounds(clusterer.getBounds(), { checkZoomRange: true, zoomMargin: 50 });
      }
    };

    loadYandexMaps();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [listings, selectedId]);

  return (
    <Card className="h-full overflow-hidden border-2 border-purple-200">
      <div className="relative w-full h-full">
        <div 
          ref={mapRef} 
          style={{ 
            width: '100%', 
            height: '600px'
          }} 
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-[200px] z-10">
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