import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { cities } from '@/data/citiesData';
import { useCitySEO } from '@/hooks/useCitySEO';
import { CityHeader } from '@/components/CityHeader';
import CityContent from '@/components/CityContent';

export default function CityPage() {
  const { citySlug } = useParams();
  const city = citySlug ? cities[citySlug as keyof typeof cities] : null;

  useCitySEO(city, citySlug);

  if (!city) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Icon name="MapPin" size={48} className="mx-auto mb-4 text-purple-600" />
            <h1 className="text-2xl font-bold mb-2">Город не найден</h1>
            <p className="text-muted-foreground mb-6">К сожалению, для этого города пока нет объявлений</p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Icon name="Home" size={18} className="mr-2" />
                На главную
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <CityHeader city={city} />
      <CityContent city={city} citySlug={citySlug} />
    </div>
  );
}
