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
  rooms: { type: string; price: number }[];
  phone?: string;
  telegram?: string;
  subscription_expires_at?: string;
  distance?: number;
};

interface ListingCardProps {
  listing: Listing;
  showPosition?: boolean;
  position?: number;
  onCardClick: (listing: Listing) => void;
  onPhoneClick?: (phone: string, e: React.MouseEvent, listingId?: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export default function ListingCard({ 
  listing, 
  showPosition = true, 
  position = 0,
  onCardClick,
  onPhoneClick 
}: ListingCardProps) {
  const hasActiveSubscription = listing.subscription_expires_at && new Date(listing.subscription_expires_at) > new Date();

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
      <div className="relative">
        {getFirstImage(listing.image_url) ? (
          <img 
            src={getFirstImage(listing.image_url)!} 
            alt={listing.title} 
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
          />
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
          
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <ReviewForm listingId={listing.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}