import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';

interface RoomCategoryCardProps {
  room: any;
  roomIndex: number;
  listingImageUrl: string;
  listingPriceWarningHolidays?: boolean;
  listingPriceWarningDaytime?: boolean;
  onOpenGallery: (roomIndex: number) => void;
}

const featureIcons: Record<string, string> = {
  'WiFi': 'Wifi',
  'Двуспальная кровать': 'BedDouble',
  '2 односпальные кровати': 'BedSingle',
  'Смарт ТВ': 'Tv',
  'Кондиционер': 'Wind',
  'Джакузи': 'Bath',
  'Душевая кабина': 'ShowerHead',
  'Фен': 'Wind',
  'Халаты': 'Shirt',
  'Тапочки': 'Footprints',
  'Холодильник': 'Refrigerator',
  'Микроволновка': 'Microwave',
  'Чайник': 'Coffee',
  'Посуда': 'UtensilsCrossed',
  'Сейф': 'Lock',
  'Зеркала': 'Sparkles',
  'Музыкальная система': 'Music',
  'Настольные игры': 'Dices',
  'PlayStation': 'Gamepad2',
  'Бар': 'Wine',
  'Косметика': 'Sparkles',
  'Полотенца': 'Sheet',
  'Постельное бельё': 'Bed',
  'Кухня': 'ChefHat',
  'Обеденный стол': 'Utensils',
  'Диван': 'Sofa',
  'Ароматерапия': 'Flower',
};

export default function RoomCategoryCard({
  room,
  roomIndex,
  listingImageUrl,
  listingPriceWarningHolidays,
  listingPriceWarningDaytime,
  onOpenGallery,
}: RoomCategoryCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageTransition, setImageTransition] = useState<'fade-in' | 'fade-out' | ''>('');

  const roomImages = room.images && Array.isArray(room.images) && room.images.length > 0 
    ? room.images 
    : [listingImageUrl];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageTransition('fade-out');
    setTimeout(() => {
      setCurrentImageIndex(currentImageIndex === 0 ? roomImages.length - 1 : currentImageIndex - 1);
      setImageTransition('');
    }, 250);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageTransition('fade-out');
    setTimeout(() => {
      setCurrentImageIndex(currentImageIndex === roomImages.length - 1 ? 0 : currentImageIndex + 1);
      setImageTransition('');
    }, 250);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Фото номера */}
          <div className="relative overflow-hidden">
            <img
              src={roomImages[currentImageIndex]}
              alt={room.type}
              className={`w-full h-[400px] object-cover cursor-pointer transition-opacity duration-500 ${
                imageTransition === 'fade-out' ? 'opacity-0' : 'opacity-100'
              }`}
              onClick={() => onOpenGallery(roomIndex)}
            />
            {roomImages.length > 1 && (
              <>
                <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {roomImages.length}
                </div>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                >
                  <Icon name="ChevronLeft" size={24} />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all hover:scale-110"
                >
                  <Icon name="ChevronRight" size={24} />
                </button>
              </>
            )}
            <button
              onClick={() => onOpenGallery(roomIndex)}
              className="absolute bottom-4 right-4 bg-white/90 hover:bg-white px-4 py-2 rounded-lg shadow-lg font-medium flex items-center gap-2 transition-all"
            >
              <Icon name="Maximize2" size={18} />
              Все фото
            </button>
          </div>

          {/* Информация о номере */}
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{room.type}</h3>
              <div className="flex items-center gap-3 mb-3">
                {room.square_meters > 0 && (
                  <Badge variant="secondary" className="text-base px-3 py-1">
                    <Icon name="Square" size={16} className="mr-1" />
                    {room.square_meters} м²
                  </Badge>
                )}
                {room.min_hours > 0 && (
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-base px-3 py-1">
                    <Icon name="Clock" size={16} className="mr-1" />
                    от {room.min_hours}ч
                  </Badge>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Стоимость</div>
              <div className="text-3xl font-bold text-purple-600">{room.price} ₽</div>
              <div className="text-sm text-muted-foreground">за час</div>
            </div>

            {/* Предупреждения о ценах */}
            {(listingPriceWarningHolidays || listingPriceWarningDaytime) && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 space-y-2">
                {listingPriceWarningHolidays && (
                  <div className="flex items-start gap-2">
                    <Icon name="AlertCircle" size={14} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-red-700">
                      Внимание: Цены в праздничные и выходные дни могут отличаться
                    </p>
                  </div>
                )}
                {listingPriceWarningDaytime && (
                  <div className="flex items-start gap-2">
                    <Icon name="AlertCircle" size={14} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-red-700">
                      Цены указаны на дневной тариф
                    </p>
                  </div>
                )}
              </div>
            )}

            {room.description && (
              <div>
                <h4 className="font-bold text-lg mb-2">Описание</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{room.description}</p>
              </div>
            )}

            {room.features && room.features.length > 0 && (
              <div>
                <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Icon name="Sparkles" size={18} className="text-purple-600" />
                  Удобства
                </h4>
                <div className="flex flex-wrap gap-2">
                  {room.features.map((feature: string, idx: number) => {
                    const iconName = featureIcons[feature] || 'Check';
                    return (
                      <div
                        key={idx}
                        className="group relative inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 hover:bg-purple-200 transition-all cursor-help hover:scale-110"
                        title={feature}
                      >
                        <Icon name={iconName} size={20} className="text-purple-600" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {feature}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {room.payment_methods && (
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Icon name="CreditCard" size={18} className="text-purple-600" />
                  Способы оплаты
                </h4>
                <p className="text-muted-foreground text-sm">{room.payment_methods}</p>
              </div>
            )}

            {room.cancellation_policy && (
              <div>
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Icon name="RotateCcw" size={18} className="text-purple-600" />
                  Условия отмены
                </h4>
                <p className="text-muted-foreground text-sm">{room.cancellation_policy}</p>
              </div>
            )}

            <Button 
              onClick={() => onOpenGallery(roomIndex)}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6 mt-4"
            >
              <Icon name="Calendar" size={20} className="mr-2" />
              Забронировать
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
