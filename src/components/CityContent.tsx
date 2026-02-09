import { useState, useEffect, useMemo } from 'react';
import { City } from '@/data/citiesData';
import CityHeader from '@/components/city/CityHeader';
import CityFeatures from '@/components/city/CityFeatures';
import CityGuides from '@/components/city/CityGuides';
import CitySEOContent from '@/components/city/CitySEOContent';
import CityFooter from '@/components/city/CityFooter';
import Breadcrumbs from '@/components/Breadcrumbs';
import ListingCard from '@/components/ListingCard';
import { api } from '@/lib/api';

interface CityContentProps {
  city: City;
  citySlug: string;
}

export default function CityContent({ city, citySlug }: CityContentProps) {
  const [allListings, setAllListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    try {
      const data = await api.getPublicListings();
      if (Array.isArray(data)) {
        setAllListings(data);
      }
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cityListings = useMemo(() => {
    return allListings.filter(listing => 
      listing.city.toLowerCase() === city.name.toLowerCase() && !listing.is_archived
    );
  }, [allListings, city.name]);

  const handlePhoneClick = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  };

  const handleCardClick = (listing: any) => {
    window.location.href = `/listing/${listing.id}`;
  };

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Города', path: '/' },
    { label: `Аренда на час в ${city.name}` }
  ];

  return (
    <>
      <div className="bg-white/80 backdrop-blur-md border-b border-purple-200">
        <div className="container mx-auto">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Listings Section - moved to top */}
          <div className="mb-16">
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Аренда на час в {city.name.endsWith('е') || city.name.endsWith('и') ? city.name.slice(0, -1) + 'е' : city.name}
            </h1>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
                <p className="text-gray-500">Загрузка объектов...</p>
              </div>
            ) : cityListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cityListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    position={1}
                    onCardClick={handleCardClick}
                    onPhoneClick={handlePhoneClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-purple-50 rounded-xl border-2 border-purple-200">
                <p className="text-xl text-gray-600 mb-2">Объекты в городе {city.name} скоро появятся</p>
                <p className="text-sm text-gray-500">Следите за обновлениями!</p>
              </div>
            )}
          </div>

          {/* SEO content moved to bottom */}
          <div className="max-w-4xl mx-auto space-y-12 mt-20">
            <CityHeader city={city} />
            <CityFeatures city={city} />
            <CityGuides city={city} />
            <CitySEOContent city={city} citySlug={citySlug} />
          </div>
        </div>
      </main>
      <CityFooter />
    </>
  );
}