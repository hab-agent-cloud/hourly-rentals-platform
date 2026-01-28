import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { City } from '@/data/citiesData';

interface CityGuidesProps {
  city: City;
}

export default function CityGuides({ city }: CityGuidesProps) {
  return (
    <>
      <Card className="border-purple-200 bg-white/80 backdrop-blur-sm mb-8">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-purple-900">
            Как арендовать номер в {city.name}?
          </h2>
          <ol className="space-y-4 text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-semibold">1</span>
              <span>Выберите подходящий отель в каталоге на главной странице</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-semibold">2</span>
              <span>Просмотрите фотографии, цены и условия размещения</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-semibold">3</span>
              <span>Свяжитесь с владельцем напрямую по телефону или в Telegram</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-semibold">4</span>
              <span>Договоритесь о времени заезда и оплате — без комиссии платформы</span>
            </li>
          </ol>
        </CardContent>
      </Card>

      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-purple-900">
            Почему выбирают 120 МИНУТ в {city.name}?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <Icon name="CheckCircle2" size={24} className="text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Проверенные объекты</h3>
                <p className="text-sm text-muted-foreground">Все отели проходят модерацию перед публикацией</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Icon name="DollarSign" size={24} className="text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Без комиссии</h3>
                <p className="text-sm text-muted-foreground">Оплата напрямую владельцу, без наценок</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Icon name="Clock" size={24} className="text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">От 2 часов</h3>
                <p className="text-sm text-muted-foreground">Минимальный срок аренды от 2 часов</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Icon name="Shield" size={24} className="text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Безопасно</h3>
                <p className="text-sm text-muted-foreground">Прямая связь с владельцами, никаких посредников</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-12 text-center">
        <Link to="/">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            <Icon name="Search" size={20} className="mr-2" />
            Смотреть все отели в {city.name}
          </Button>
        </Link>
      </div>
    </>
  );
}
