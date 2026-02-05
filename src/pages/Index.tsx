import { useState, useEffect, useRef, useMemo } from 'react';
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
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [searchCity, setSearchCity] = useState('');
  const [selectedCity, setSelectedCity] = useState('Все города');
  const [selectedType, setSelectedType] = useState('all');
  const [hasParking, setHasParking] = useState(false);
  const [minHours, setMinHours] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('catalog');
  const [showMap, setShowMap] = useState(false);
  const [selectedListing, setSelectedListing] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [allListings, setAllListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem('guestTheme');
    return (saved as ThemeKey) || 'default';
  });
  
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadListings();
    detectUserCity();
    
    const handleThemeChange = (e: CustomEvent) => {
      setCurrentTheme(e.detail as ThemeKey);
    };
    
    window.addEventListener('themeChange', handleThemeChange as EventListener);
    return () => window.removeEventListener('themeChange', handleThemeChange as EventListener);
  }, []);

  const detectUserCity = async () => {
    try {
      const cityData = await api.detectCity();
      if (cityData && cityData.detected && cityData.city) {
        console.log('City detected:', cityData.city);
        setDetectedCity(cityData.city);
        setSelectedCity(cityData.city);
      }
    } catch (error) {
      console.error('Failed to detect city:', error);
    }
  };

  const loadListings = async () => {
    try {
      const startTime = performance.now();
      const data = await api.getPublicListings();
      const loadTime = performance.now() - startTime;
      
      console.log('=== PUBLIC LISTINGS LOADED ===');
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

  const uniqueCities = useMemo(() => 
    ['Все города', ...new Set(Array.isArray(allListings) ? allListings.map(l => l.city) : [])],
    [allListings]
  );

  const filteredListings = useMemo(() => {
    const listings = Array.isArray(allListings) ? allListings : [];
    const search = searchCity.toLowerCase();
    
    return listings
      .filter(l => !l.is_archived)
      .filter(l => selectedCity === 'Все города' || l.city === selectedCity)
      .filter(l => selectedType === 'all' || l.type === selectedType)
      .filter(l => !hasParking || l.hasParking)
      .filter(l => minHours === null || l.minHours <= minHours)
      .filter(l => {
        return l.title.toLowerCase().includes(search) || 
               l.city.toLowerCase().includes(search) ||
               (l.metro && l.metro.toLowerCase().includes(search)) ||
               (l.district && l.district.toLowerCase().includes(search));
      })
      .filter(l => {
        if (selectedFeatures.length === 0) return true;
        return l.rooms && l.rooms.some((room: any) => 
          selectedFeatures.every((feature) => room.features && room.features.includes(feature))
        );
      });
  }, [allListings, selectedCity, selectedType, hasParking, minHours, searchCity, selectedFeatures]);

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
    setTimeout(() => {
      scrollToResults();
    }, 200);
  };

  const handleFilterChange = (filterSetter: (value: any) => void, value: any) => {
    filterSetter(value);
    setTimeout(scrollToResults, 150);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themes[currentTheme].gradient} transition-all duration-500`}>
      <SEOStructuredData listings={filteredListings} cities={uniqueCities.filter(c => c !== 'Все города')} />
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'catalog' && (
        <>
          <SearchHero
            searchCity={searchCity}
            setSearchCity={setSearchCity}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            cities={uniqueCities}
            showMap={showMap}
            setShowMap={setShowMap}
            hasParking={hasParking}
            setHasParking={setHasParking}
            minHours={minHours}
            setMinHours={setMinHours}
            selectedFeatures={selectedFeatures}
            setSelectedFeatures={setSelectedFeatures}
            detectedCity={detectedCity}
            onFilterChange={() => setTimeout(scrollToResults, 200)}
          />

          <main className="container mx-auto px-4 py-8" ref={resultsRef}>
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
        </>
      )}

      {activeTab === 'about' && <AboutSection />}
      {activeTab === 'partners' && <PartnersSection />}
      {activeTab === 'support' && <SupportSection />}

      {activeTab === 'catalog' && <SEOTextSection />}

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
            <a href="/admin/login">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-purple-600">
                <Icon name="Shield" size={16} className="mr-2" />
                Админ панель
              </Button>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}