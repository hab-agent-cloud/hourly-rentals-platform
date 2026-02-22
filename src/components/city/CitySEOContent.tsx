import { City } from '@/data/citiesData';
import CitySEOIntro from './CitySEOIntro';
import CitySEOCityBlock from './CitySEOCityBlock';
import CitySEOAdvantages from './CitySEOAdvantages';
import CitySEOPlatform from './CitySEOPlatform';

interface CitySEOContentProps {
  city: City;
  citySlug: string;
}

export default function CitySEOContent({ city, citySlug }: CitySEOContentProps) {
  return (
    <div className="mt-12 prose prose-purple max-w-none">
      <CitySEOIntro city={city} />
      <CitySEOCityBlock citySlug={citySlug} />
      <CitySEOAdvantages city={city} />
      <CitySEOPlatform city={city} />
    </div>
  );
}
