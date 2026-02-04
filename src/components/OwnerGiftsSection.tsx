import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const OWNER_GIFTS_URL = 'https://functions.poehali.dev/ef04f7b6-7c8d-4345-b0ba-11c1121471be';
const ACTIVATE_TRIAL_URL = 'https://functions.poehali.dev/cc1242a8-bbc8-46d9-9bf4-03af08578a3b';

interface Gift {
  id: number;
  gift_type: string;
  gift_value: number;
  status: string;
  created_at: string;
  description: string;
  listing_id: number;
  listing_name: string;
}

interface OwnerGiftsSectionProps {
  ownerId: number;
  onGiftActivated?: () => void;
}

export default function OwnerGiftsSection({ ownerId, onGiftActivated }: OwnerGiftsSectionProps) {
  const { toast } = useToast();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState<number | null>(null);
  const [trialActivated, setTrialActivated] = useState(false);
  const [activatingTrial, setActivatingTrial] = useState(false);

  const fetchGifts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${OWNER_GIFTS_URL}?owner_id=${ownerId}`);
      const data = await response.json();
      if (data.gifts) {
        setGifts(data.gifts);
      }
      if (data.trial_activated !== undefined) {
        setTrialActivated(data.trial_activated);
      }
    } catch (error) {
      console.error('Ошибка загрузки подарков:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ownerId) {
      fetchGifts();
    }
  }, [ownerId]);

  const handleActivateGift = async (giftId: number) => {
    setActivating(giftId);
    try {
      const response = await fetch(OWNER_GIFTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gift_id: giftId })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: '🎉 Подарок активирован!',
          description: data.message
        });
        
        // Удаляем подарок из списка
        setGifts(gifts.filter(g => g.id !== giftId));
        
        // Уведомляем родительский компонент
        if (onGiftActivated) {
          onGiftActivated();
        }
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось активировать подарок',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при активации подарка',
        variant: 'destructive'
      });
    } finally {
      setActivating(null);
    }
  };

  const handleActivateTrial = async () => {
    setActivatingTrial(true);
    try {
      const response = await fetch(ACTIVATE_TRIAL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner_id: ownerId })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: '🎉 Пробная подписка активирована!',
          description: data.message
        });
        
        // Отмечаем, что пробная подписка активирована
        setTrialActivated(true);
        
        // Уведомляем родительский компонент
        if (onGiftActivated) {
          onGiftActivated();
        }
      } else {
        toast({
          title: 'Ошибка',
          description: data.message || data.error || 'Не удалось активировать пробную подписку',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при активации пробной подписки',
        variant: 'destructive'
      });
    } finally {
      setActivatingTrial(false);
    }
  };

  if (loading) {
    return (
      <Card className="border-purple-200 bg-gradient-to-br from-white to-purple-50">
        <CardContent className="py-4">
          <div className="text-center">
            <Icon name="Loader2" size={24} className="animate-spin mx-auto mb-1 text-purple-600" />
            <p className="text-xs text-muted-foreground">Загрузка...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasGifts = gifts.length > 0;
  const showTrialOffer = !hasGifts && !trialActivated;

  // Если нет подарков и пробная подписка уже активирована, не показываем карточку
  if (!hasGifts && trialActivated) {
    return null;
  }

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-lg">
            <Icon name="Gift" size={20} className="text-white" />
          </div>
          <div>
            <CardTitle className="text-base">🎁 {hasGifts ? 'Ваши подарки' : 'Подарок от команды'}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {showTrialOffer && (
          <div className="bg-white rounded-lg border border-purple-200 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-2 rounded-lg">
                <Icon name="Gift" size={20} className="text-purple-600" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-purple-900">
                  🎉 Подписка на 14 дней
                </h3>
              </div>
            </div>
            
            <Button
              onClick={handleActivateTrial}
              disabled={activatingTrial}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-medium animate-pulse"
              size="sm"
            >
              {activatingTrial ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-1 animate-spin" />
                  Активация...
                </>
              ) : (
                <>
                  <Icon name="Sparkles" size={16} className="mr-1" />
                  Активировать
                </>
              )}
            </Button>
          </div>
        )}
        {gifts.map((gift) => (
          <div
            key={gift.id}
            className="bg-white rounded-lg border border-purple-200 p-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-2 rounded-lg">
                <Icon name="Gift" size={20} className="text-purple-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-purple-900">
                    Подписка на {gift.gift_value} {gift.gift_value === 1 ? 'день' : gift.gift_value < 5 ? 'дня' : 'дней'}
                  </h3>
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-xs">
                    Новый
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {gift.listing_name}
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => handleActivateGift(gift.id)}
              disabled={activating === gift.id}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-medium"
              size="sm"
            >
              {activating === gift.id ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-1 animate-spin" />
                  Активация...
                </>
              ) : (
                <>
                  <Icon name="Sparkles" size={16} className="mr-1" />
                  Активировать
                </>
              )}
            </Button>
          </div>
        ))}

      </CardContent>
    </Card>
  );
}