import { useState, useCallback, useRef, useId } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import PromotionBadge from '@/components/PromotionBadge';
import ReviewForm from '@/components/ReviewForm';
import { metrika } from '@/lib/metrika';

type Listing = {
  id: number;
  title: string;
  type: string;
  city: string;
  district: string;
  address?: string;
  price: number;
  auction: number;
  image_url: string;
  logo_url?: string;
  metro: string;
  metroWalk: number;
  metro_stations?: { station_name: string; walk_minutes: number }[];
  hasParking: boolean;
  features?: string[];
  lat: number;
  lng: number;
  minHours: number;
  rooms: { type: string; price: number; images?: string[] | string }[];
  phone?: string;
  telegram?: string;
  subscription_expires_at?: string;
  distance?: number;
  description?: string;
};

interface ListingCardProps {
  listing: Listing;
  showPosition?: boolean;
  position?: number;
  onCardClick: (listing: Listing) => void;
  onPhoneClick?: (phone: string, e: React.MouseEvent, listingId?: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllImages = (imageUrl: any, rooms?: any[]): string[] => {
  const mainImages: string[] = [];
  
  if (imageUrl) {
    if (typeof imageUrl === 'string') {
      try {
        const parsed = JSON.parse(imageUrl);
        if (Array.isArray(parsed) && parsed.length > 0) {
          mainImages.push(...parsed.filter((u: unknown) => typeof u === 'string' && u.length > 0));
        }
      } catch {
        mainImages.push(imageUrl);
      }
    } else if (Array.isArray(imageUrl) && imageUrl.length > 0) {
      mainImages.push(...imageUrl.filter((u: unknown) => typeof u === 'string' && u.length > 0));
    }
  }
  
  if (rooms && rooms.length === 1 && rooms[0].images) {
    let roomImages: string[] = [];
    
    if (Array.isArray(rooms[0].images)) {
      roomImages = rooms[0].images.filter((u: unknown) => typeof u === 'string' && u.length > 0);
    } else if (typeof rooms[0].images === 'string') {
      try {
        const parsed = JSON.parse(rooms[0].images);
        if (Array.isArray(parsed)) {
          roomImages = parsed.filter((u: unknown) => typeof u === 'string' && u.length > 0);
        }
      } catch {
        // Ignore parse errors
      }
    }
    
    mainImages.push(...roomImages.filter((img: string) => !mainImages.includes(img)));
  }
  
  return mainImages;
};

export default function ListingCard({ 
  listing, 
  showPosition = true, 
  position = 0,
  onCardClick,
  onPhoneClick 
}: ListingCardProps) {
  const hasActiveSubscription = listing.subscription_expires_at && new Date(listing.subscription_expires_at) > new Date();
  const images = getAllImages(listing.image_url, listing.rooms);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [descExpanded, setDescExpanded] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const handlePrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || images.length <= 1) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      e.stopPropagation();
      if (diff > 0) {
        setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
      } else {
        setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }
    touchStartX.current = null;
  }, [images.length]);

  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-all hover:shadow-xl group bg-white ${
        hasActiveSubscription 
          ? 'border-4 border-transparent shadow-2xl relative before:absolute before:inset-0 before:p-[3px] before:rounded-lg before:bg-gradient-to-r before:from-purple-600 before:via-pink-600 before:to-orange-500 before:-z-10 before:animate-pulse' 
          : 'border-2 border-gray-200 hover:border-purple-300'
      }`}
      onClick={() => {
        metrika.trackListingView(listing.id, listing.title, listing.city, listing.price);
        onCardClick(listing);
      }}
    >
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.length > 0 ? (
          <>
            <img 
              src={images[currentIndex]} 
              alt={listing.title} 
              className="w-full h-48 object-cover transition-transform duration-300" 
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                  aria-label="Предыдущее фото"
                >
                  <Icon name="ChevronLeft" size={18} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                  aria-label="Следующее фото"
                >
                  <Icon name="ChevronRight" size={18} />
                </button>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                  {images.slice(0, 7).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(idx);
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        idx === currentIndex 
                          ? 'bg-white w-3' 
                          : 'bg-white/60 hover:bg-white/80'
                      }`}
                    />
                  ))}
                  {images.length > 7 && (
                    <span className="text-white text-[10px] leading-none ml-0.5">+{images.length - 7}</span>
                  )}
                </div>
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded z-10">
                  {currentIndex + 1}/{images.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-6xl">
            🏨
          </div>
        )}

        {listing.logo_url && (
          <div className="absolute top-3 left-3 w-12 h-12 bg-white rounded-full shadow-lg overflow-hidden border-2 border-white">
            <img src={listing.logo_url} alt="logo" className="w-full h-full object-cover" />
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h4 className="font-bold text-lg line-clamp-2 flex-1">{listing.title}</h4>
        </div>

        <div className="space-y-1 mb-3">
          {listing.distance !== undefined && (
            <div className="flex items-center gap-2 text-sm font-semibold text-green-600 bg-green-50 rounded-md px-2 py-1">
              <Icon name="Navigation" size={14} />
              <span>{listing.distance < 1 ? `${(listing.distance * 1000).toFixed(0)} м` : `${listing.distance.toFixed(1)} км`} от вас</span>
            </div>
          )}
          {listing.address && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="MapPin" size={14} />
              <span className="truncate">{listing.address}</span>
            </div>
          )}

          {listing.metro_stations && listing.metro_stations.length > 0 ? (
            <div className="flex flex-col gap-1">
              {listing.metro_stations.slice(0, 2).map((station, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-blue-600">Ⓜ️</span>
                  <span className="truncate">{station.station_name}</span>
                  <Icon name="PersonStanding" size={13} />
                  <span className="text-xs">{station.walk_minutes} мин</span>
                </div>
              ))}
            </div>
          ) : listing.metro ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="text-blue-600">Ⓜ️</span>
              <span className="truncate">{listing.metro}</span>
              <Icon name="PersonStanding" size={13} />
              <span className="text-xs">{listing.metroWalk} мин</span>
            </div>
          ) : null}

          {!listing.address && !listing.metro && !listing.metro_stations?.length && listing.district && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="MapPin" size={14} />
              <span className="truncate">р-н {listing.district}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {listing.hasParking && (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              <Icon name="Car" size={12} className="mr-1" />
              Парковка
            </Badge>
          )}
          {listing.features && listing.features.slice(0, 2).map((feature, idx) => (
            <Badge key={idx} variant="secondary">{feature}</Badge>
          ))}
        </div>

        {listing.description && (
          <div className="mb-3" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-medium mb-1"
              onClick={() => setDescExpanded(!descExpanded)}
            >
              <Icon name={descExpanded ? 'ChevronUp' : 'ChevronDown'} size={14} />
              {descExpanded ? 'Скрыть' : 'Подробнее об объекте'}
            </button>
            {descExpanded && (
              <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed border-l-2 border-purple-200 pl-3">
                {listing.description}
              </p>
            )}
          </div>
        )}

        <div className="border-t pt-3 mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-600">
              {listing.price.toLocaleString('ru-RU')} ₽
            </span>
            <span className="text-sm text-muted-foreground">
              / {listing.minHours}ч
            </span>
          </div>
          
          {listing.rooms && listing.rooms.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {listing.rooms.slice(0, 3).map((room, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {room.type}: {room.price.toLocaleString('ru-RU')} ₽
                </Badge>
              ))}
            </div>
          )}
        </div>

        <PromotionBadge listingId={listing.id} />

        <div className="space-y-2">
          <div className="flex gap-2">
            {listing.phone && onPhoneClick && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => onPhoneClick(listing.phone!, e, listing.id)}
              >
                <Icon name="Phone" size={14} className="mr-1" />
                Позвонить
              </Button>
            )}
            {listing.telegram && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://t.me/${listing.telegram.replace('@', '')}`, '_blank');
                }}
              >
                <Icon name="Send" size={14} className="mr-1" />
                Telegram
              </Button>
            )}
          </div>
          <div onClick={(e) => e.stopPropagation()} className="flex justify-start">
            <ReviewForm listingId={listing.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}