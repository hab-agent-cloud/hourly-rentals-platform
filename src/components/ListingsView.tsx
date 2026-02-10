import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import ListingCard from '@/components/ListingCard';
import CityCarousel from '@/components/CityCarousel';
import MapView from '@/components/MapView';
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
  distance?: number;
  subscription_expires_at?: string;
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
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
  const [isLoadingPhone, setIsLoadingPhone] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredListings.length]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const sortedListings = useMemo(() => {
    return [...filteredListings].sort((a, b) => {
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
  }, [filteredListings, sortBy]);

  const groupedByCity = useMemo(() => {
    return sortedListings.reduce((acc, listing) => {
      if (!acc[listing.city]) {
        acc[listing.city] = [];
      }
      acc[listing.city].push(listing);
      return acc;
    }, {} as Record<string, Listing[]>);
  }, [sortedListings]);

  const getPositionInCity = (listing: Listing): number => {
    const sameCity = groupedByCity[listing.city] || [];
    return sameCity.findIndex(l => l.id === listing.id) + 1;
  };

  const handlePhoneClick = async (phone: string, e: React.MouseEvent, listingId?: number) => {
    console.log('[ListingsView] handlePhoneClick called', { phone, listingId });
    e.stopPropagation();
    
    if (!listingId) {
      console.log('[ListingsView] No listingId - showing direct phone');
      setSelectedPhone(phone);
      setPhoneModalOpen(true);
      return;
    }

    console.log('[ListingsView] Will fetch virtual number');
    setIsLoadingPhone(true);
    setPhoneModalOpen(true);
    setSelectedListingId(listingId);
    
    try {
      console.log('Requesting virtual number for listing:', listingId);
      const response = await fetch('https://functions.poehali.dev/4a500ec2-2f33-49d9-87d0-3779d8d52ae5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          listing_id: listingId,
          client_phone: 'web_user_' + Date.now()
        })
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok && data.virtual_number) {
        console.log('Got virtual number:', data.virtual_number);
        setSelectedPhone(data.virtual_number);
      } else {
        console.log('Using fallback phone:', phone);
        setSelectedPhone(phone);
      }
    } catch (error) {
      console.error('Failed to get virtual number:', error);
      setSelectedPhone(phone);
    } finally {
      setIsLoadingPhone(false);
    }
  };

  const showCityCarousels = selectedCity === 'Все города';

  const totalPages = Math.ceil(sortedListings.length / ITEMS_PER_PAGE);
  const paginatedListings = sortedListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (showMap) {
    console.log('Showing map with', filteredListings.length, 'listings');
    return (
      <MapView
        listings={filteredListings}
        selectedListing={selectedListing}
        onListingSelect={onListingSelect}
        onToggleMap={onToggleMap}
        selectedCity={selectedCity}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
        <p className="text-gray-500">Загрузка объектов...</p>
      </div>
    );
  }

  if (sortedListings.length === 0) {
    if (selectedCity === 'Все города') {
      return (
        <div className="text-center py-12 bg-purple-50 rounded-xl border-2 border-purple-200">
          <Icon name="MapPin" size={48} className="mx-auto mb-4 text-purple-400" />
          <p className="text-xl text-gray-600 mb-2">Выберите город для просмотра объектов</p>
          <p className="text-sm text-gray-500">Используйте фильтр выше для выбора города</p>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">

        <div className="flex items-center gap-3 flex-wrap">
        </div>
      </div>

      {showCityCarousels ? (
        <div className="space-y-12">
          {Object.entries(groupedByCity).map(([city, cityListings]) => (
            <CityCarousel 
              key={city} 
              city={city} 
              cityListings={cityListings}
              onCardClick={onCardClick}
              onPhoneClick={handlePhoneClick}
              getPositionInCity={getPositionInCity}
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                position={getPositionInCity(listing)}
                onCardClick={onCardClick}
                onPhoneClick={handlePhoneClick}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <>
              <div className="text-center text-sm text-muted-foreground mt-6">
                Показаны объекты {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, sortedListings.length)} из {sortedListings.length}
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-full sm:w-auto"
              >
                <Icon name="ChevronLeft" size={18} />
                Назад
              </Button>
              
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {totalPages <= 7 ? (
                  Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))
                ) : (
                  <>
                    <Button
                      variant={currentPage === 1 ? "default" : "outline"}
                      onClick={() => setCurrentPage(1)}
                      className="w-10"
                    >
                      1
                    </Button>
                    
                    {currentPage > 3 && <span className="px-2">...</span>}
                    
                    {Array.from({ length: 3 }, (_, i) => {
                      const page = currentPage - 1 + i;
                      if (page <= 1 || page >= totalPages) return null;
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      );
                    })}
                    
                    {currentPage < totalPages - 2 && <span className="px-2">...</span>}
                    
                    <Button
                      variant={currentPage === totalPages ? "default" : "outline"}
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-10"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-full sm:w-auto"
              >
                Вперёд
                <Icon name="ChevronRight" size={18} />
              </Button>
            </div>
            </>
          )}
        </>
      )}

      <Dialog open={phoneModalOpen} onOpenChange={setPhoneModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Номер телефона</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {isLoadingPhone ? (
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Подключаем безопасный номер...</p>
              </div>
            ) : (
              <>
                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg text-center">
                  <a 
                    href={`tel:${selectedPhone}`}
                    className="text-2xl font-bold text-purple-600 hover:text-purple-700"
                  >
                    {selectedPhone}
                  </a>
                  <p className="text-xs text-muted-foreground mt-2">
                    Защищённый номер действует 10 минут
                  </p>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => window.location.href = `tel:${selectedPhone}`}
                >
                  <Icon name="Phone" size={18} className="mr-2" />
                  Позвонить
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}