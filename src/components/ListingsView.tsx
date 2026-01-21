import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import InteractiveMap from '@/components/InteractiveMap';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

interface ListingsViewProps {
  filteredListings: Listing[];
  selectedCity: string;
  showMap: boolean;
  selectedListing: number | null;
  onListingSelect: (id: number | null) => void;
  onToggleMap: () => void;
  onCardClick: (listing: Listing) => void;
  isLoading?: boolean;
}

export default function ListingsView({
  filteredListings,
  selectedCity,
  showMap,
  selectedListing,
  onListingSelect,
  onToggleMap,
  onCardClick,
  isLoading = false,
}: ListingsViewProps) {
  const [sortBy, setSortBy] = useState<string>('auction');
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

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

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'auction':
      default:
        if (a.city !== b.city) {
          return a.city.localeCompare(b.city);
        }
        return a.auction - b.auction;
    }
  });

  const groupedByCity = sortedListings.reduce((acc, listing) => {
    if (!acc[listing.city]) {
      acc[listing.city] = [];
    }
    acc[listing.city].push(listing);
    return acc;
  }, {} as Record<string, Listing[]>);

  const getPositionInCity = (listing: Listing): number => {
    const sameCity = groupedByCity[listing.city] || [];
    return sameCity.findIndex(l => l.id === listing.id) + 1;
  };

  const handlePhoneClick = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedPhone(phone);
    setPhoneModalOpen(true);
  };

  const showCityCarousels = selectedCity === 'Все города';

  const totalPages = Math.ceil(sortedListings.length / ITEMS_PER_PAGE);
  const paginatedListings = sortedListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const CityCarousel = ({ city, cityListings }: { city: string; cityListings: Listing[] }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const topListings = cityListings.slice(0, 5);

    const scroll = (direction: 'left' | 'right') => {
      if (scrollRef.current) {
        const scrollAmount = 340;
        scrollRef.current.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    };

    return (
      <div>
        <div className="flex items-center gap-3 mb-6">
          <Icon name="MapPin" size={24} className="text-purple-600 flex-shrink-0" />
          <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {city}
          </h3>
          <Badge variant="outline" className="text-base px-3 py-1">
            {cityListings.length}
          </Badge>
        </div>

        <div className="relative group">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('left')}
          >
            <Icon name="ChevronLeft" size={24} />
          </Button>

          <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
          >
            {topListings.map((listing) => (
              <div key={listing.id} className="flex-shrink-0 w-[320px] snap-start">
                <ListingCard listing={listing} />
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('right')}
          >
            <Icon name="ChevronRight" size={24} />
          </Button>
        </div>

        {cityListings.length > 5 && (
          <div className="text-center mt-4">
            <Button 
              variant="outline" 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-purple-600 hover:text-purple-700"
            >
              Показать все {cityListings.length} объектов в {city}
              <Icon name="ChevronUp" size={16} className="ml-2" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const ListingCard = ({ listing, showPosition = true }: { listing: Listing; showPosition?: boolean }) => {
    const position = getPositionInCity(listing);
    const isTopThree = position <= 3;

    return (
      <Card 
        className="overflow-hidden cursor-pointer border-2 border-purple-100 hover:border-purple-300 transition-all hover:shadow-xl group"
        onClick={() => onCardClick(listing)}
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
          {showPosition && isTopThree && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold shadow-lg">
              ТОП-{position}
            </Badge>
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

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Icon name="MapPin" size={14} />
            <span className="truncate">{listing.city}, {listing.district}</span>
          </div>

          {listing.metro && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <span className="text-blue-600">Ⓜ️</span>
              <span>{listing.metro}</span>
              <span className="text-xs">• {listing.metroWalk} мин</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="text-xs">
              От {listing.minHours}ч
            </Badge>
            {listing.hasParking && (
              <Badge variant="secondary" className="text-xs">
                <Icon name="ParkingCircle" size={12} className="mr-1" />
                Парковка
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-purple-100">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {listing.price} ₽
              <span className="text-xs font-normal text-muted-foreground ml-1">/час</span>
            </div>
            
            <div className="flex gap-2">
              {listing.phone && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => handlePhoneClick(listing.phone!, e)}
                >
                  <Icon name="Phone" size={14} />
                </Button>
              )}
              {listing.telegram && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://t.me/${listing.telegram.replace('@', '')}`, '_blank');
                  }}
                >
                  <Icon name="Send" size={14} />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">⏳</div>
        <p className="text-lg text-muted-foreground">Загрузка объектов...</p>
      </div>
    );
  }

  return (
    <section className="px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
        <h3 className="text-2xl font-bold">Доступные объекты</h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          {!showCityCarousels && (
            <div className="flex items-center gap-2">
              <Icon name="ArrowUpDown" size={16} className="text-purple-600" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[200px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auction">По позиции</SelectItem>
                  <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                  <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <Button 
            variant={showMap ? 'default' : 'outline'} 
            size="sm"
            onClick={onToggleMap}
            className={`${showMap ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''} h-9`}
          >
            <Icon name={showMap ? 'List' : 'Map'} size={16} className="mr-2" />
            {showMap ? 'Списком' : 'На карте'}
          </Button>
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-8xl mb-6">🔍</div>
          <h3 className="text-3xl font-bold mb-3 text-purple-600">Ничего не найдено</h3>
          <p className="text-muted-foreground text-lg mb-6">
            Попробуйте изменить параметры поиска или фильтры
          </p>
        </div>
      ) : showMap ? (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
            {sortedListings.map((listing) => (
              <Card 
                key={listing.id} 
                className={`overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedListing === listing.id 
                    ? 'border-purple-500 shadow-lg scale-[1.02]' 
                    : 'border-purple-100 hover:border-purple-300'
                }`}
                onClick={() => onListingSelect(listing.id)}
              >
                <div className="flex gap-4 p-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    {getFirstImage(listing.image_url) ? (
                      <img src={getFirstImage(listing.image_url)!} alt={listing.title} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center text-3xl">
                        🏨
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold mb-1 truncate">{listing.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Icon name="MapPin" size={14} />
                      <span className="truncate">{listing.city}, {listing.district}</span>
                    </div>
                    <div className="text-lg font-bold text-purple-600">{listing.price} ₽<span className="text-xs font-normal">/час</span></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="sticky top-24 h-[700px]">
            <InteractiveMap 
              listings={sortedListings} 
              selectedId={selectedListing}
              onSelectListing={onListingSelect}
            />
          </div>
        </div>
      ) : showCityCarousels ? (
        <div className="space-y-12">
          {Object.entries(groupedByCity).map(([city, cityListings]) => (
            <CityCarousel key={city} city={city} cityListings={cityListings} />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {paginatedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <Icon name="ChevronLeft" size={16} className="mr-2" />
                Назад
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    return page === 1 || 
                           page === totalPages || 
                           Math.abs(page - currentPage) <= 1;
                  })
                  .map((page, idx, array) => {
                    if (idx > 0 && array[idx - 1] !== page - 1) {
                      return (
                        <div key={`ellipsis-${page}`} className="flex items-center gap-2">
                          <span className="text-muted-foreground">...</span>
                          <Button
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={currentPage === page ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
                          >
                            {page}
                          </Button>
                        </div>
                      );
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? 'bg-gradient-to-r from-purple-600 to-pink-600' : ''}
                      >
                        {page}
                      </Button>
                    );
                  })}
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Вперед
                <Icon name="ChevronRight" size={16} className="ml-2" />
              </Button>
            </div>
          )}
        </>
      )}

      <Dialog open={phoneModalOpen} onOpenChange={setPhoneModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Контактный телефон</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <a 
              href={`tel:${selectedPhone}`}
              className="block text-center text-2xl font-bold text-purple-600 hover:text-purple-700 py-4 px-6 bg-purple-50 rounded-lg transition-colors"
            >
              {selectedPhone}
            </a>
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                onClick={() => {
                  window.location.href = `tel:${selectedPhone}`;
                }}
              >
                <Icon name="Phone" size={18} className="mr-2" />
                Позвонить
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(selectedPhone);
                }}
              >
                <Icon name="Copy" size={18} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
