import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import PromotionBadge from '@/components/PromotionBadge';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllImages = (imageUrl: any): string[] => {
  if (!imageUrl) return [];
  if (typeof imageUrl === 'string') {
    try {
      const parsed = JSON.parse(imageUrl);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((u: unknown) => typeof u === 'string' && u.length > 0);
      }
    } catch {
      return [imageUrl];
    }
  }
  if (Array.isArray(imageUrl) && imageUrl.length > 0) {
    return imageUrl.filter((u: unknown) => typeof u === 'string' && u.length > 0);
  }
  return [];
};

interface ListingInfoCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listing: any;
}

export default function ListingInfoCard({ listing }: ListingInfoCardProps) {
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [virtualNumber, setVirtualNumber] = useState<string | null>(null);
  const [isLoadingNumber, setIsLoadingNumber] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const images = getAllImages(listing.image_url);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || images.length <= 1) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  }, [images.length, handleNext, handlePrev]);

  return (
    <>
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div
              className="relative group overflow-hidden rounded-xl"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {images.length > 0 ? (
                <>
                  <img src={images[currentIndex]} alt={listing.title} className="w-full h-64 object-cover" />
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                      >
                        <Icon name="ChevronLeft" size={20} />
                      </button>
                      <button
                        onClick={handleNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                      >
                        <Icon name="ChevronRight" size={20} />
                      </button>
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {images.slice(0, 8).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              idx === currentIndex ? 'bg-white w-4' : 'bg-white/60 hover:bg-white/80'
                            }`}
                          />
                        ))}
                        {images.length > 8 && (
                          <span className="text-white text-xs ml-0.5">+{images.length - 8}</span>
                        )}
                      </div>
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
                        {currentIndex + 1}/{images.length}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-9xl">
                  🏨
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                  <Icon name="MapPin" size={20} className="text-purple-600" />
                  Местоположение
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground font-medium">{listing.address || listing.district}</p>
                  
                  {listing.metro_stations && listing.metro_stations.length > 0 ? (
                    <div className="space-y-1.5 mt-3">
                      {listing.metro_stations.map((station: { station_name: string; walk_minutes: number }, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                          <span className="text-blue-600">Ⓜ️</span>
                          <span>{station.station_name}</span>
                          <Icon name="PersonStanding" size={14} className="ml-1" />
                          <span>{station.walk_minutes} мин пешком</span>
                        </div>
                      ))}
                    </div>
                  ) : listing.metro && listing.metro !== '-' ? (
                    <div className="flex items-center gap-2 text-muted-foreground mt-3">
                      <span className="text-blue-600">Ⓜ️</span>
                      <span>{listing.metro}</span>
                      {listing.metroWalk > 0 && (
                        <>
                          <Icon name="PersonStanding" size={14} className="ml-1" />
                          <span>{listing.metroWalk} мин пешком</span>
                        </>
                      )}
                    </div>
                  ) : listing.district ? (
                    <p className="text-sm text-muted-foreground mt-2">Район: {listing.district}</p>
                  ) : null}
                  {listing.hasParking && (
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <Icon name="Car" size={16} />
                      <span>Есть парковка</span>
                      {listing.parking_type === 'paid' && listing.parking_price_per_hour > 0 && (
                        <span className="text-muted-foreground font-normal">
                          ({listing.parking_price_per_hour} ₽/час)
                        </span>
                      )}
                      {listing.parking_type === 'free' && (
                        <span className="text-green-600">(бесплатно)</span>
                      )}
                      {listing.parking_type === 'street' && (
                        <span className="text-muted-foreground font-normal">(уличная)</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <PromotionBadge listingId={listing.id} />

              <div className="flex flex-col gap-3 pt-4">
                {listing.phone && (
                  <Button 
                    onClick={async () => {
                      console.log('[ListingInfoCard] Phone button clicked for listing:', listing.id);
                      setIsLoadingNumber(true);
                      try {
                        console.log('[ListingInfoCard] Fetching virtual number...');
                        const response = await fetch('https://functions.poehali.dev/4a500ec2-2f33-49d9-87d0-3779d8d52ae5', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ listing_id: listing.id })
                        });
                        console.log('[ListingInfoCard] Response status:', response.status);
                        const data = await response.json();
                        console.log('[ListingInfoCard] Response data:', data);
                        if (data.virtual_number) {
                          console.log('[ListingInfoCard] Got virtual number:', data.virtual_number);
                          setVirtualNumber(data.virtual_number);
                        } else {
                          console.log('[ListingInfoCard] No virtual number, using fallback:', listing.phone);
                          setVirtualNumber(listing.phone);
                        }
                      } catch (error) {
                        console.error('[ListingInfoCard] Failed to get virtual number:', error);
                        setVirtualNumber(listing.phone);
                      } finally {
                        setIsLoadingNumber(false);
                        setPhoneModalOpen(true);
                      }
                    }}
                    disabled={isLoadingNumber}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
                  >
                    {isLoadingNumber ? (
                      <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                    ) : (
                      <Icon name="Phone" size={20} className="mr-2" />
                    )}
                    Позвонить
                  </Button>
                )}
                {listing.telegram && (
                  <Button 
                    asChild
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg py-6"
                  >
                    <a href={listing.telegram.startsWith('http') ? listing.telegram : `https://t.me/${listing.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                      <Icon name="Send" size={20} className="mr-2" />
                      Написать в Telegram
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={phoneModalOpen} onOpenChange={setPhoneModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Контактный телефон</DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <a 
              href={`tel:${virtualNumber || listing.phone}`}
              className="text-3xl font-bold text-purple-600 hover:text-purple-700 transition-colors"
            >
              {virtualNumber || listing.phone}
            </a>
            <p className="text-sm text-muted-foreground mt-2">Нажмите, чтобы позвонить</p>
            {virtualNumber && virtualNumber !== listing.phone && (
              <p className="text-xs text-muted-foreground mt-4 bg-purple-50 p-3 rounded-lg">
                <Icon name="Info" size={14} className="inline mr-1" />
                Специальный номер для связи с владельцем этого объекта
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}