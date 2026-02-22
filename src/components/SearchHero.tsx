import SearchHeroInput from '@/components/search/SearchHeroInput';
import SearchHeroCities from '@/components/search/SearchHeroCities';
import SearchHeroFilters from '@/components/search/SearchHeroFilters';
import SearchHeroFeatures from '@/components/search/SearchHeroFeatures';

interface SearchHeroProps {
  searchCity: string;
  setSearchCity: (value: string) => void;
  selectedType: string;
  setSelectedType: (value: string) => void;
  selectedCity: string;
  setSelectedCity: (value: string) => void;
  cities: string[];
  showMap: boolean;
  setShowMap: (value: boolean) => void;
  hasParking: boolean;
  setHasParking: (value: boolean) => void;
  minHours: number | null;
  setMinHours: (value: number | null) => void;
  maxPrice: number | null;
  setMaxPrice: (value: number | null) => void;
  selectedFeatures: string[];
  setSelectedFeatures: (value: string[]) => void;
  detectedCity?: string | null;
  nearMe: boolean;
  setNearMe: (value: boolean) => void;
  setUserLocation: (value: {lat: number, lng: number} | null) => void;
  onFilterChange?: () => void;
  allListings?: Record<string, unknown>[];
  onCityAndSearchSelect?: (city: string, search: string) => void;
}

export default function SearchHero({
  searchCity,
  setSearchCity,
  selectedType,
  setSelectedType,
  selectedCity,
  setSelectedCity,
  cities,
  showMap,
  setShowMap,
  hasParking,
  setHasParking,
  minHours,
  setMinHours,
  maxPrice,
  setMaxPrice,
  selectedFeatures,
  setSelectedFeatures,
  detectedCity,
  nearMe,
  setNearMe,
  setUserLocation,
  onFilterChange,
  allListings = [],
  onCityAndSearchSelect,
}: SearchHeroProps) {
  return (
    <section className="mb-6 sm:mb-12 pt-12 sm:pt-16 md:pt-20 text-center animate-fade-in px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-3 sm:p-6 border border-purple-100">
          <SearchHeroInput
            searchCity={searchCity}
            setSearchCity={setSearchCity}
            selectedCity={selectedCity}
            setSelectedCity={setSelectedCity}
            cities={cities}
            detectedCity={detectedCity}
            allListings={allListings}
            onFilterChange={onFilterChange}
            onCityAndSearchSelect={onCityAndSearchSelect}
          />

          <div className="space-y-3 mt-4">
            <SearchHeroCities
              cities={cities}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
              setSearchCity={setSearchCity}
              detectedCity={detectedCity}
              onFilterChange={onFilterChange}
            />

            <SearchHeroFilters
              hasParking={hasParking}
              setHasParking={setHasParking}
              minHours={minHours}
              setMinHours={setMinHours}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              nearMe={nearMe}
              setNearMe={setNearMe}
              setUserLocation={setUserLocation}
              onFilterChange={onFilterChange}
            />

            <SearchHeroFeatures
              selectedFeatures={selectedFeatures}
              setSelectedFeatures={setSelectedFeatures}
              onFilterChange={onFilterChange}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
