import { City } from '@/data/citiesData';
import CityHeader from '@/components/city/CityHeader';
import CityFeatures from '@/components/city/CityFeatures';
import CityGuides from '@/components/city/CityGuides';
import CitySEOContent from '@/components/city/CitySEOContent';
import CityFooter from '@/components/city/CityFooter';
import Breadcrumbs from '@/components/Breadcrumbs';

interface CityContentProps {
  city: City;
  citySlug: string;
}

export default function CityContent({ city, citySlug }: CityContentProps) {
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