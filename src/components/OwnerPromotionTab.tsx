import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Listing {
  id: number;
  title: string;
  city: string;
  auction: number;
  type: string;
  image_url: string;
  district: string;
  subscription_expires_at: string | null;
  is_archived: boolean;
}

interface PromotionPackage {
  id: number;
  listing_id: number | null;
  listing_title: string | null;
  owner_id: number | null;
  package_type: 'bronze' | 'silver' | 'gold';
  price_paid: number;
  start_date: string | null;
  end_date: string | null;
  current_position: number;
}

interface PromotionInfo {
  packages: PromotionPackage[];
  pricing: {
    bronze: { price: number; range: string; description: string };
    silver: { price: number; range: string; description: string };
    gold: { price: number; range: string; description: string };
  };
  city: string;
}

interface Owner {
  id: number;
  balance: number;
  bonus_balance: number;
}

interface OwnerPromotionTabProps {
  listings: Listing[];
  selectedListing: Listing | null;
  promotionInfo: PromotionInfo | null;
  owner: Owner | null;
  isLoading: boolean;
  onSelectListing: (listing: Listing) => void;
  onPurchasePackage: (listingId: number, city: string, packageType: 'bronze' | 'silver' | 'gold') => Promise<void>;
}

export default function OwnerPromotionTab({
  listings,
  selectedListing,
  promotionInfo,
  owner,
  isLoading,
  onSelectListing,
  onPurchasePackage,
}: OwnerPromotionTabProps) {
  const [selectedPackage, setSelectedPackage] = useState<'bronze' | 'silver' | 'gold' | null>(null);

  const totalBalance = (owner?.balance || 0) + (owner?.bonus_balance || 0);

  const myActivePackage = promotionInfo?.packages.find(
    pkg => pkg.listing_id === selectedListing?.id
  );

  const packageDetails = {
    bronze: {
      name: 'Бронза',
      icon: 'Medal',
      color: 'from-amber-700 to-amber-900',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
      textColor: 'text-amber-900',
    },
    silver: {
      name: 'Серебро',
      icon: 'Award',
      color: 'from-gray-400 to-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-900',
    },
    gold: {
      name: 'Золото',
      icon: 'Crown',
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-900',
    },
  };

  const handlePurchase = async (packageType: 'bronze' | 'silver' | 'gold') => {
    if (!selectedListing) return;
    setSelectedPackage(packageType);
    try {
      await onPurchasePackage(selectedListing.id, selectedListing.city, packageType);
    } finally {
      setSelectedPackage(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <label className="text-sm font-medium mb-3 block">Выберите объект для продвижения:</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {listings.map((listing) => (
              <Button
                key={listing.id}
                variant={selectedListing?.id === listing.id ? 'default' : 'outline'}
                onClick={() => onSelectListing(listing)}
                className="justify-start h-auto py-3"
              >
                <div className="text-left">
                  <div className="font-semibold">{listing.title}</div>
                  <div className="text-xs opacity-70">{listing.city}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedListing ? (
        <div className="space-y-6">
          {myActivePackage ? (
            <Card className="border-2 border-green-500 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="CheckCircle" size={24} className="text-green-600" />
                  У вас активен пакет {packageDetails[myActivePackage.package_type].name}
                </CardTitle>
                <CardDescription>
                  Ваша текущая позиция: <strong>#{myActivePackage.current_position}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Объект</div>
                    <div className="font-semibold">{myActivePackage.listing_title}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Оплачено</div>
                    <div className="font-semibold">{myActivePackage.price_paid} ₽</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Начало</div>
                    <div className="font-semibold">
                      {myActivePackage.start_date ? new Date(myActivePackage.start_date).toLocaleDateString('ru-RU') : '—'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Окончание</div>
                    <div className="font-semibold">
                      {myActivePackage.end_date ? new Date(myActivePackage.end_date).toLocaleDateString('ru-RU') : '—'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Как работает продвижение?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Icon name="TrendingUp" size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Ежедневная ротация позиций</div>
                      <div className="text-sm text-muted-foreground">
                        Ваше объявление каждый день автоматически получает новую позицию в пределах выбранного диапазона
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="Clock" size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Срок действия: 30 дней</div>
                      <div className="text-sm text-muted-foreground">
                        После покупки пакет действует ровно месяц с момента активации
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Icon name="MapPin" size={20} className="text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Привязка к городу</div>
                      <div className="text-sm text-muted-foreground">
                        Пакет работает только для выбранного города, где размещён объект
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {promotionInfo && Object.entries(promotionInfo.pricing).map(([key, pkg]) => {
                  const packageType = key as 'bronze' | 'silver' | 'gold';
                  const details = packageDetails[packageType];
                  const canAfford = totalBalance >= pkg.price;

                  return (
                    <Card
                      key={key}
                      className={`relative overflow-hidden transition-all hover:shadow-lg ${
                        !canAfford ? 'opacity-60' : ''
                      }`}
                    >
                      <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${details.color}`} />
                      <CardHeader className="text-center">
                        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-gradient-to-br ${details.color} shadow-lg mb-3`}>
                          <Icon name={details.icon as any} size={32} className="text-white" />
                        </div>
                        <CardTitle className="text-2xl">{details.name}</CardTitle>
                        <CardDescription className="text-lg font-bold text-purple-900">
                          {pkg.price.toLocaleString('ru-RU')} ₽
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className={`text-center p-3 rounded-lg ${details.bgColor}`}>
                          <div className="text-sm text-muted-foreground mb-1">Диапазон позиций</div>
                          <div className={`text-xl font-bold ${details.textColor}`}>{pkg.range}</div>
                        </div>
                        <div className="text-sm text-center text-muted-foreground">
                          {pkg.description}
                        </div>
                        <Button
                          onClick={() => handlePurchase(packageType)}
                          disabled={!canAfford || isLoading || selectedPackage === packageType}
                          className={`w-full bg-gradient-to-r ${details.color} hover:opacity-90`}
                        >
                          {isLoading && selectedPackage === packageType ? (
                            <>
                              <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                              Оформление...
                            </>
                          ) : !canAfford ? (
                            <>
                              <Icon name="AlertCircle" size={16} className="mr-2" />
                              Недостаточно средств
                            </>
                          ) : (
                            <>
                              <Icon name="ShoppingCart" size={16} className="mr-2" />
                              Купить пакет
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-purple-700 mb-1">Ваш баланс</div>
                      <div className="text-2xl font-bold text-purple-900">
                        {totalBalance.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                    <Icon name="Wallet" size={40} className="text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Выберите объект для продвижения</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
