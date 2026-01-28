import { City } from '@/data/citiesData';
import CityHeader from '@/components/city/CityHeader';
import CityFeatures from '@/components/city/CityFeatures';
import CityGuides from '@/components/city/CityGuides';
import CitySEOContent from '@/components/city/CitySEOContent';
import CityFooter from '@/components/city/CityFooter';

interface CityContentProps {
  city: City;
  citySlug: string;
}

export default function CityContent({ city, citySlug }: CityContentProps) {
  return (
    <>
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <CityHeader city={city} />
          <CityFeatures city={city} />
          <CityGuides city={city} />
          <CitySEOContent city={city} citySlug={citySlug} />
        </div>
      </main>
      <CityFooter />
    </>
  );
}
