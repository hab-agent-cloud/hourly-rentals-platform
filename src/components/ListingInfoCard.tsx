import { useState, useEffect } from 'react';
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

interface ListingInfoCardProps {
  listing: any;
}

export default function ListingInfoCard({ listing }: ListingInfoCardProps) {
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [virtualNumber, setVirtualNumber] = useState<string | null>(null);
  const [isLoadingNumber, setIsLoadingNumber] = useState(false);

  const getFirstImage = (imageUrl: any) => {
    if (!imageUrl) return null;
    
    if (typeof imageUrl === 'string') {
      try {
        const parsed = JSON.parse(imageUrl);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
      } catch {
        return imageUrl;
      }
    }
    
    if (Array.isArray(imageUrl) && imageUrl.length > 0) {
      return imageUrl[0];
    }
    
    return null;
  };

  const firstImage = getFirstImage(listing.image_url);

  return (
    <>
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative">
              {firstImage ? (
                <img src={firstImage} alt={listing.title} className="w-full h-64 object-cover rounded-xl" />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-9xl rounded-xl">
                  🏨
                </div>
              )}
              {listing.auction <= 3 && (
                <Badge className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg px-4 py-2">
                  <Icon name="Trophy" size={20} className="mr-2" />
                  ТОП-{listing.auction}
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                  <Icon name="MapPin" size={20} className="text-purple-600" />
                  Местоположение
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">{listing.city}</p>
                  <p className="text-muted-foreground">{listing.district}</p>
                  {listing.metro_stations && listing.metro_stations.length > 0 ? (
                    <div className="space-y-1">
                      {listing.metro_stations.map((station: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-muted-foreground">
                          <span className="text-blue-600">Ⓜ️</span>
                          <span>{station.station_name}</span>
                          <Icon name="PersonStanding" size={14} className="ml-1" />
                          <span>{station.walk_minutes} мин</span>
                        </div>
                      ))}
                    </div>
                  ) : listing.metro && listing.metro !== '-' && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-blue-600">Ⓜ️</span>
                      <span>{listing.metro}</span>
                      {listing.metroWalk > 0 && (
                        <>
                          <Icon name="PersonStanding" size={14} className="ml-1" />
                          <span>{listing.metroWalk} мин</span>
                        </>
                      )}
                    </div>
                  )}
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

              <div className="flex flex-col gap-3 pt-4">
                {listing.phone && (
                  <Button 
                    onClick={async () => {
                      setIsLoadingNumber(true);
                      try {
                        const response = await fetch('https://functions.poehali.dev/4a500ec2-2f33-49d9-87d0-3779d8d52ae5', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ listing_id: listing.id })
                        });
                        const data = await response.json();
                        if (data.virtual_number) {
                          setVirtualNumber(data.virtual_number);
                        } else {
                          setVirtualNumber(listing.phone);
                        }
                      } catch (error) {
                        console.error('Failed to get virtual number:', error);
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