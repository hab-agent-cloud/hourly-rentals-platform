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
      <div className="inline-block">
        <Card className="border-purple-200 bg-gradient-to-br from-white to-purple-50 max-w-xs">
          <CardContent className="py-3">
            <div className="text-center">
              <Icon name="Loader2" size={20} className="animate-spin mx-auto mb-1 text-purple-600" />
              <p className="text-xs text-muted-foreground">Загрузка...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasGifts = gifts.length > 0;
  const showTrialOffer = !hasGifts && !trialActivated;

  // Если нет подарков и пробная подписка уже активирована, не показываем карточку
  if (!hasGifts && trialActivated) {
    return null;
  }

  return (
    <div className="w-full sm:w-[320px]">
      <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-100 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4">
        {showTrialOffer && (
          <div className="bg-white rounded-xl p-3 border-2 border-purple-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-2 rounded-full shadow-md animate-pulse">
                <Icon name="Gift" size={20} className="text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <Icon name="Sparkles" size={14} className="text-purple-600" />
                  <span className="text-xs font-medium text-purple-600">Подарок от команды</span>
                </div>
                <h3 className="font-bold text-base text-purple-900 flex items-center gap-1">
                  🎉 14 дней бесплатно
                </h3>
              </div>
            </div>
            
            <Button
              onClick={handleActivateTrial}
              disabled={activatingTrial}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all animate-pulse hover:scale-105"
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
            className="bg-white rounded-xl border-2 border-purple-200 p-3 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-2 rounded-full shadow-md animate-pulse">
                <Icon name="Gift" size={20} className="text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <Icon name="Sparkles" size={14} className="text-purple-600" />
                    <span className="text-xs font-medium text-purple-600">Подарок</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-xs animate-pulse shadow-md">
                    Новый
                  </Badge>
                </div>
                <h3 className="font-bold text-sm text-purple-900">
                  {gift.gift_value} {gift.gift_value === 1 ? 'день' : gift.gift_value < 5 ? 'дня' : 'дней'} подписки
                </h3>
                <p className="text-xs text-muted-foreground">
                  {gift.listing_name}
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => handleActivateGift(gift.id)}
              disabled={activating === gift.id}
              className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-bold shadow-md hover:shadow-lg transition-all"
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
    </div>
  );
}