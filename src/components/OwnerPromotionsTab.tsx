import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Listing {
  id: number;
  title: string;
  subscription_expires_at?: string;
}

interface Promotion {
  id: number;
  listing_id: number;
  promotion_type: 'hot_offer' | 'three_for_two';
  discount_percent?: number;
  expires_at: string;
  is_active: boolean;
  created_at: string;
}

interface OwnerPromotionsTabProps {
  listings: Listing[];
  token: string;
}

export default function OwnerPromotionsTab({ listings, token }: OwnerPromotionsTabProps) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedListing, setSelectedListing] = useState<number | null>(null);
  const [promotionType, setPromotionType] = useState<'hot_offer' | 'three_for_two'>('hot_offer');
  const [discountPercent, setDiscountPercent] = useState(10);
  const [expiresInDays, setExpiresInDays] = useState(1);

  const hasActiveSubscription = (listing: Listing) => {
    return listing.subscription_expires_at && new Date(listing.subscription_expires_at) > new Date();
  };

  const activeListings = listings.filter(hasActiveSubscription);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/41a11d3f-dfa0-463c-9f3f-7d6c69d3d293', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setPromotions(data.promotions || []);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePromotion = async () => {
    if (!selectedListing) return;

    const selectedListingData = listings.find(l => l.id === selectedListing);
    if (!selectedListingData?.subscription_expires_at) return;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    setIsLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/41a11d3f-dfa0-463c-9f3f-7d6c69d3d293', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          listing_id: selectedListing,
          promotion_type: promotionType,
          discount_percent: promotionType === 'hot_offer' ? discountPercent : null,
          expires_at: expiresAt.toISOString()
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setShowDialog(false);
        fetchPromotions();
        alert('✅ Акция создана успешно!');
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating promotion:', error);
      alert('❌ Ошибка создания акции');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePromotion = async (promotionId: number) => {
    if (!confirm('Удалить акцию?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`https://functions.poehali.dev/41a11d3f-dfa0-463c-9f3f-7d6c69d3d293?id=${promotionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchPromotions();
        alert('✅ Акция удалена');
      } else {
        const data = await response.json();
        alert(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
      alert('❌ Ошибка удаления акции');
    } finally {
      setIsLoading(false);
    }
  };

  const getPromotionIcon = (type: string) => {
    return type === 'hot_offer' ? 'Flame' : 'Gift';
  };

  const getPromotionText = (promo: Promotion) => {
    if (promo.promotion_type === 'hot_offer') {
      return `🔥 Скидка ${promo.discount_percent}%`;
    }
    return `🎁 3 часа в подарок (1+1+подарок)`;
  };

  if (activeListings.length === 0) {
    return (
      <Card className="border-2 border-orange-200">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Icon name="Lock" size={24} className="text-orange-500" />
            Сначала продлите подписку
          </CardTitle>
          <CardDescription className="text-base mt-4">
            Акции доступны только для объектов с активной подпиской. 
            После продления подписки вы сможете размещать акции для привлечения гостей бесплатно!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Megaphone" size={24} className="text-orange-500" />
            Акции для привлечения гостей
          </CardTitle>
          <CardDescription>
            Создавайте специальные предложения для ваших объектов. Акции отображаются прямо в карточке объекта!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => setShowDialog(true)}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            disabled={isLoading}
          >
            <Icon name="Plus" size={18} className="mr-2" />
            Создать акцию
          </Button>
        </CardContent>
      </Card>

      {isLoading && promotions.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Icon name="Loader2" size={32} className="animate-spin text-purple-600" />
          </CardContent>
        </Card>
      ) : promotions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12 text-muted-foreground">
            <Icon name="Inbox" size={48} className="mx-auto mb-4 text-gray-300" />
            <p>У вас пока нет активных акций</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {promotions.map(promo => {
            const listing = listings.find(l => l.id === promo.listing_id);
            return (
              <Card key={promo.id} className="border-2 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon name={getPromotionIcon(promo.promotion_type)} size={20} className="text-orange-500" />
                        <h4 className="font-bold">{listing?.title}</h4>
                      </div>
                      <div className="space-y-1">
                        <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                          {getPromotionText(promo)}
                        </Badge>
                        <p className="text-sm text-muted-foreground">
                          Действует до: {new Date(promo.expires_at).toLocaleDateString('ru-RU', { 
                            day: 'numeric', 
                            month: 'long', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePromotion(promo.id)}
                      disabled={isLoading}
                    >
                      <Icon name="Trash2" size={16} className="text-red-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Создать акцию</DialogTitle>
            <DialogDescription>
              Выберите объект и настройте акцию для привлечения гостей
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Выберите объект</Label>
              <Select value={selectedListing?.toString()} onValueChange={(v) => setSelectedListing(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите объект" />
                </SelectTrigger>
                <SelectContent>
                  {activeListings.map(listing => (
                    <SelectItem key={listing.id} value={listing.id.toString()}>
                      {listing.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Тип акции</Label>
              <Select value={promotionType} onValueChange={(v: any) => setPromotionType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot_offer">🔥 Горящее предложение</SelectItem>
                  <SelectItem value="three_for_two">🎁 3 часа в подарок (1+1+подарок)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {promotionType === 'hot_offer' && (
              <div>
                <Label>Размер скидки (от 10%)</Label>
                <Input
                  type="number"
                  min={10}
                  max={100}
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                />
              </div>
            )}

            <div>
              <Label>Срок действия акции (дней)</Label>
              <Input
                type="number"
                min={1}
                max={365}
                value={expiresInDays}
                onChange={(e) => setExpiresInDays(Number(e.target.value))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Акция не может действовать дольше подписки
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreatePromotion}
                disabled={!selectedListing || isLoading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              >
                {isLoading ? (
                  <Icon name="Loader2" size={18} className="animate-spin mr-2" />
                ) : (
                  <Icon name="Check" size={18} className="mr-2" />
                )}
                Создать
              </Button>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
