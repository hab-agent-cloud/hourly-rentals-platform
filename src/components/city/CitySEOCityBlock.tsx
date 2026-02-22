import CitySEOMoscow from './CitySEOMoscow';
import CitySEOSPbKazan from './CitySEOSPbKazan';
import CitySEOMillionCities from './CitySEOMillionCities';
import CitySEOOtherCities from './CitySEOOtherCities';

interface CitySEOCityBlockProps {
  citySlug: string;
}

export default function CitySEOCityBlock({ citySlug }: CitySEOCityBlockProps) {
  return (
    <>
      {citySlug === 'moskva' && <CitySEOMoscow />}
      <CitySEOSPbKazan citySlug={citySlug} />
      <CitySEOMillionCities citySlug={citySlug} />
      <CitySEOOtherCities citySlug={citySlug} />
    </>
  );
}
