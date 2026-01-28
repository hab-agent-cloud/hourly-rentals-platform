import { Card, CardContent } from '@/components/ui/card';
import { City } from '@/data/citiesData';

interface CityFeaturesProps {
  city: City;
}

export default function CityFeatures({ city }: CityFeaturesProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {city.features.map((feature, index) => (
        <Card key={index} className="border-purple-200 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="text-3xl mb-2">
              {index === 0 && '🏨'}
              {index === 1 && '💰'}
              {index === 2 && '📍'}
              {index === 3 && '⏰'}
            </div>
            <p className="font-semibold text-purple-900">{feature}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
