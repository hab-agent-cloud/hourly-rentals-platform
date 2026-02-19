import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { themes, type ThemeKey } from '@/components/ThemeSwitcher';
import SearchHero from '@/components/SearchHero';
import ListingsView from '@/components/ListingsView';
import HotelModal from '@/components/HotelModal';
import Header from '@/components/home/Header';
import AboutSection from '@/components/home/AboutSection';
import PartnersSection from '@/components/home/PartnersSection';
import SupportSection from '@/components/home/SupportSection';
import SEOTextSection from '@/components/home/SEOTextSection';
import InstallAppBanner from '@/components/InstallAppBanner';
import VoiceSearchBanner from '@/components/VoiceSearchBanner';
import SEOStructuredData from '@/components/SEOStructuredData';
import FAQSection from '@/components/home/FAQSection';
import PopularCitiesSection from '@/components/home/PopularCitiesSection';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { cities } from '@/data/citiesData';

export default function Index() {
  const [searchCity, setSearchCity] = useState('');
  const [selectedCity, setSelectedCity] = useState('Все города');
  const [selectedType, setSelectedType] = useState('all');
  const [hasParking, setHasParking] = useState(false);
  const [minHours, setMinHours] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('catalog');
  const [showMap, setShowMap] = useState(false);
  const [selectedListing, setSelectedListing] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [nearMe, setNearMe] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem('guestTheme') as ThemeKey;
    // Проверяем, что сохранённая тема существует в новом списке
    return (saved && themes[saved]) ? saved : 'default';
  });
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    detectUserCity();
    
    const cityParam = searchParams.get('city');
    if (cityParam) {
      setSelectedCity(cityParam);
      loadListings(cityParam);
      setTimeout(() => {
        scrollToResults();
      }, 500);
    }
    
    const handleThemeChange = (e: CustomEvent) => {
      console.log('🎨 Index.tsx received theme change:', e.detail);
      setCurrentTheme(e.detail as ThemeKey);
    };
    
    window.addEventListener('themeChange', handleThemeChange as EventListener);
    return () => window.removeEventListener('themeChange', handleThemeChange as EventListener);
  }, [searchParams]);

  const detectUserCity = async () => {
    try {
      const cityData = await api.detectCity();
      if (cityData && cityData.detected && cityData.city) {
        console.log('City detected:', cityData.city);
        setDetectedCity(cityData.city);
        setSelectedCity(cityData.city);
        await loadListings(cityData.city);
        setTimeout(() => scrollToResults(), 300);
      }
    } catch (error) {
      console.error('Failed to detect city:', error);
    }
  };

  const loadListings = async (city?: string) => {
    try {
      setIsLoading(true);
      const startTime = performance.now();
      // Если город не указан - не загружаем (слишком много данных)
      if (!city || city === 'Все города') {
        setAllListings([]);
        setIsLoading(false);
        return;
      }
      
      const data = await api.getPublicListings(city);
      const loadTime = performance.now() - startTime;
      
      console.log('=== PUBLIC LISTINGS LOADED ===');
      console.log('City:', city);
      console.log('Data type:', typeof data);
      console.log('Is array:', Array.isArray(data));
      console.log('Data length:', Array.isArray(data) ? data.length : 'N/A');
      console.log(`Load time: ${loadTime.toFixed(2)}ms`);
      
      if (data && data.error) {
        throw new Error(data.error);
      }
      
      if (!Array.isArray(data)) {
        console.error('API returned non-array:', data);
        setAllListings([]);
        return;
      }
      
      setAllListings(data);
    } catch (error: any) {
      console.error('Failed to load listings:', error);
      setAllListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Список городов из статического справочника (не зависит от загруженных объектов)
  const uniqueCities = useMemo(() => {
    const cityNames = Object.values(cities).map(c => c.name);
    return ['Все города', ...cityNames.sort()];
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filteredListings = useMemo(() => {
    const listings = Array.isArray(allListings) ? allListings : [];
    const search = searchCity.toLowerCase();
    
    let filtered = listings
      .filter(l => !l.is_archived)
      .filter(l => selectedCity === 'Все города' || l.city === selectedCity)
      .filter(l => selectedType === 'all' || l.type === selectedType)
      .filter(l => !hasParking || l.hasParking)
      .filter(l => minHours === null || l.minHours <= minHours)
      .filter(l => maxPrice === null || l.price <= maxPrice)
      .filter(l => {
        if (!search) return true;
        return l.title.toLowerCase().includes(search) || 
               l.city.toLowerCase().includes(search) ||
               (l.metro && l.metro.toLowerCase().includes(search)) ||
               (l.district && l.district.toLowerCase().includes(search)) ||
               (l.address && l.address.toLowerCase().includes(search)) ||
               (Array.isArray(l.metro_stations) && l.metro_stations.some((s: any) =>
                 s.station_name && s.station_name.toLowerCase().includes(search)
               ));
      })
      .filter(l => {
        if (selectedFeatures.length === 0) return true;
        return l.rooms && l.rooms.some((room: any) => 
          selectedFeatures.every((feature) => room.features && room.features.includes(feature))
        );
      });

    if (nearMe && userLocation) {
      filtered = filtered
        .map(l => ({
          ...l,
          distance: calculateDistance(userLocation.lat, userLocation.lng, l.lat, l.lng)
        }))
        .filter(l => l.distance <= 10)
        .sort((a, b) => a.distance - b.distance);
    }

    return filtered;
  }, [allListings, selectedCity, selectedType, hasParking, minHours, maxPrice, searchCity, selectedFeatures, nearMe, userLocation]);

  const handleCardClick = (listing: any) => {
    window.location.href = `/listing/${listing.id}`;
  };

  const scrollToResults = () => {
    if (resultsRef.current) {
      const headerHeight = 100;
      const elementPosition = resultsRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    loadListings(city);
    setTimeout(() => {
      scrollToResults();
    }, 200);
  };

  const handleFilterChange = (filterSetter: (value: any) => void, value: any) => {
    filterSetter(value);
    setTimeout(scrollToResults, 150);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themes[currentTheme].gradient} ${themes[currentTheme].pattern} transition-all duration-500`}>
      <SEOStructuredData listings={filteredListings} cities={uniqueCities.filter(c => c !== 'Все города')} />
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'catalog' && (
        <>
          <PopularCitiesSection allCities={uniqueCities.filter(c => c !== 'Все города')} />
          
          <div className="-mt-6">
            <SearchHero
            searchCity={searchCity}
            setSearchCity={setSearchCity}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedCity={selectedCity}
            setSelectedCity={handleCityChange}
            cities={uniqueCities}
            showMap={showMap}
            setShowMap={setShowMap}
            hasParking={hasParking}
            setHasParking={setHasParking}
            minHours={minHours}
            setMinHours={setMinHours}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            selectedFeatures={selectedFeatures}
            setSelectedFeatures={setSelectedFeatures}
            detectedCity={detectedCity}
            nearMe={nearMe}
            setNearMe={setNearMe}
            setUserLocation={setUserLocation}
            onFilterChange={() => setTimeout(scrollToResults, 200)}
            allListings={allListings}
            onCityAndSearchSelect={(city, search) => {
              handleCityChange(city);
              setSearchCity(search);
              setTimeout(scrollToResults, 400);
            }}
            />
          </div>

          <main className="container mx-auto px-4 py-4 -mt-6" ref={resultsRef} data-results-section>
            <div className="mb-8">
              <VoiceSearchBanner />
              <InstallAppBanner />
            </div>

            <ListingsView
              filteredListings={filteredListings}
              selectedCity={selectedCity}
              showMap={showMap}
              selectedListing={selectedListing}
              onListingSelect={setSelectedListing}
              onToggleMap={() => setShowMap(!showMap)}
              onCardClick={handleCardClick}
              isLoading={isLoading}
            />
          </main>

          <div className="-mt-6">
            <FAQSection />
          </div>
          <div className="-mt-6">
            <SEOTextSection />
          </div>
        </>
      )}

      {activeTab === 'about' && (
        <div className="py-6">
          <AboutSection />
        </div>
      )}
      {activeTab === 'partners' && (
        <div className="py-6">
          <PartnersSection />
        </div>
      )}
      {activeTab === 'support' && (
        <div className="py-6">
          <SupportSection />
        </div>
      )}

      <HotelModal
        open={dialogOpen}
        hotel={selectedHotel}
        onClose={() => {
          setDialogOpen(false);
          setSelectedHotel(null);
        }}
      />
      
      <footer className="bg-white/80 backdrop-blur-md border-t border-purple-200 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <img 
              src="https://cdn.poehali.dev/projects/1a35ca30-983f-4a91-b0b4-3c6fa1c9a65b/files/67e411bb-a84a-41da-b7d3-5702e81761bb.jpg" 
              alt="120 минут" 
              className="h-16 w-16 object-contain"
            />
            <Link to="/admin/login">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-purple-600">
                <Icon name="Shield" size={16} className="mr-2" />
                Админ панель
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}