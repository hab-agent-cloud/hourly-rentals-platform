import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HotelSubscriptionCardProps {
  listing: {
    id: number;
    title: string;
    city: string;
    district: string;
    type: string;
    image_url: string;
    subscription_expires_at: string | null;
    is_archived: boolean;
    auction: number;
    moderation_status?: string;
    moderation_comment?: string;
  };
  subscriptionInfo: {
    days_left: number | null;
    price_per_month: number;
    prices: {
      '30_days': number;
      '90_days': number;
    };
  } | null;
  onExtend: (listingId: number, days: number) => void;
  onEdit?: (listing: any) => void;
  onUnarchive?: (listingId: number) => void;
  isLoading: boolean;
}

export default function HotelSubscriptionCard({ listing, subscriptionInfo, onExtend, onEdit, onUnarchive, isLoading }: HotelSubscriptionCardProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!listing.subscription_expires_at) {
      setTimeLeft('');
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const expiresAt = new Date(listing.subscription_expires_at!);
      const diff = expiresAt.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Истекла');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days}д ${hours}ч ${minutes}м`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}ч ${minutes}м ${seconds}с`);
      } else {
        setTimeLeft(`${minutes}м ${seconds}с`);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000); // Обновление каждую секунду

    return () => clearInterval(timer);
  }, [listing.subscription_expires_at]);

  const daysLeft = subscriptionInfo?.days_left ?? null;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 7;
  const isExpired = daysLeft === 0 || listing.is_archived;

  // Получаем первую фотографию из массива или строку
  const getFirstImage = () => {
    if (!listing.image_url) return null;
    
    // Если это строка, пытаемся распарсить как JSON
    if (typeof listing.image_url === 'string') {
      try {
        const parsed = JSON.parse(listing.image_url);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
      } catch {
        // Если не JSON, возвращаем как есть
        return listing.image_url;
      }
    }
    
    // Если это уже массив
    if (Array.isArray(listing.image_url) && listing.image_url.length > 0) {
      return listing.image_url[0];
    }
    
    return null;
  };

  const firstImage = getFirstImage();

  return (
    <Card className={`overflow-hidden ${isExpired ? 'opacity-60' : ''}`}>
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-purple-100 to-pink-100">
        {firstImage ? (
          <img 
            src={firstImage} 
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-4xl">
            🏨
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          {listing.moderation_status === 'pending' ? (
            <Badge className="bg-orange-500">
              На проверке
            </Badge>
          ) : listing.moderation_status === 'rejected' ? (
            <Badge variant="destructive" className="bg-red-600">
              Отклонено
            </Badge>
          ) : isExpired ? (
            <Badge variant="destructive" className="bg-red-600">
              Неактивно
            </Badge>
          ) : isExpiringSoon ? (
            <Badge className="bg-orange-500">
              Заканчивается
            </Badge>
          ) : (
            <Badge className="bg-green-600">
              Активно
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        <div>
          <h3 className="font-bold text-base sm:text-lg">{listing.title}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">{listing.city}, {listing.district}</p>
          <div className="flex gap-1.5 sm:gap-2 mt-1">
            <Badge variant="outline" className="text-[10px] sm:text-xs px-1.5 sm:px-2">
              {listing.type === 'hotel' ? 'Отель' : 'Апартаменты'}
            </Badge>
            <Badge variant="secondary" className="text-[10px] sm:text-xs px-1.5 sm:px-2">
              Позиция #{listing.auction || '—'}
            </Badge>
          </div>
        </div>

        {daysLeft !== null && !isExpired && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-2 sm:p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Icon name="Clock" size={16} className="text-purple-600" />
                <span className="text-xs sm:text-sm font-medium">Осталось:</span>
              </div>
              <div className={`text-right ${isExpiringSoon ? 'text-orange-600' : 'text-purple-600'}`}>
                <div className="font-bold text-sm sm:text-base">{timeLeft}</div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">{daysLeft} дней</div>
              </div>
            </div>
          </div>
        )}

        {subscriptionInfo && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <Button
                size="sm"
                onClick={() => onExtend(listing.id, 30)}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-8 sm:h-9 text-xs sm:text-sm"
              >
                {isLoading ? (
                  <Icon name="Loader2" size={12} className="animate-spin" />
                ) : (
                  <>
                    <Icon name="Plus" size={12} className="mr-0.5 sm:mr-1" />
                    30 дней
                  </>
                )}
              </Button>
              <div className="text-right">
                <div className="text-[10px] sm:text-xs text-muted-foreground">Стоимость</div>
                <div className="font-bold text-xs sm:text-sm">{subscriptionInfo.prices['30_days']} ₽</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onExtend(listing.id, 90)}
                disabled={isLoading}
                className="border-2 border-purple-300 hover:bg-purple-50 h-8 sm:h-9 text-xs sm:text-sm"
              >
                {isLoading ? (
                  <Icon name="Loader2" size={12} className="animate-spin" />
                ) : (
                  <>
                    <Icon name="Sparkles" size={12} className="mr-0.5 sm:mr-1" />
                    90 дней
                  </>
                )}
              </Button>
              <div className="text-right">
                <div className="text-[10px] sm:text-xs text-green-600 font-medium">Скидка 15%</div>
                <div className="font-bold text-xs sm:text-sm">{subscriptionInfo.prices['90_days']} ₽</div>
              </div>
            </div>

            <div className="text-[10px] sm:text-xs text-muted-foreground bg-blue-50 p-1.5 sm:p-2 rounded leading-tight">
              <Icon name="Info" size={10} className="inline mr-1" />
              {isExpired ? 
                'При оплате объект снова станет активным на 30 дней' :
                'Время накапливается, можно продлить заранее'
              }
            </div>
          </div>
        )}

        {listing.moderation_status === 'pending' && (
          <div className="bg-orange-50 border border-orange-200 p-2 sm:p-3 rounded-lg">
            <div className="flex items-start gap-1.5 sm:gap-2">
              <Icon name="Clock" size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs sm:text-sm text-orange-900">
                <p className="font-medium">Объект на проверке</p>
                <p className="text-orange-700">Ожидает одобрения модератора</p>
              </div>
            </div>
          </div>
        )}

        {listing.moderation_status === 'rejected' && listing.moderation_comment && (
          <div className="bg-red-50 border border-red-200 p-2 sm:p-3 rounded-lg">
            <div className="flex items-start gap-1.5 sm:gap-2">
              <Icon name="AlertCircle" size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs sm:text-sm text-red-900">
                <p className="font-medium">Объект отклонён</p>
                <p className="text-red-700 mt-1">
                  <strong>Комментарий модератора:</strong><br />
                  {listing.moderation_comment}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(listing)}
              className="w-full h-8 sm:h-9 text-xs sm:text-sm"
            >
              <Icon name="Edit" size={14} className="mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{listing.moderation_status === 'rejected' ? 'Исправить и отправить повторно' : 'Редактировать объект'}</span>
              <span className="sm:hidden">{listing.moderation_status === 'rejected' ? 'Исправить' : 'Редактировать'}</span>
            </Button>
          )}

          {listing.is_archived && onUnarchive && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onUnarchive(listing.id)}
              className="w-full h-8 sm:h-9 text-xs sm:text-sm bg-green-600 hover:bg-green-700"
            >
              <Icon name="ArchiveRestore" size={14} className="mr-1 sm:mr-2" />
              <span>Восстановить из архива</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}