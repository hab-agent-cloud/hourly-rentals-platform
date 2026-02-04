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
        <CardContent className="py-8">
          <div className="text-center">
            <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-2 text-purple-600" />
            <p className="text-sm text-muted-foreground">Загрузка подарков...</p>
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
    <Card className="border-purple-300 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-xl shadow-md">
            <Icon name="Gift" size={28} className="text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">🎁 {hasGifts ? 'Ваши подарки' : 'Подарок от команды'}</CardTitle>
            <CardDescription className="text-base">
              {hasGifts 
                ? `У вас ${gifts.length} ${gifts.length === 1 ? 'подарок' : gifts.length < 5 ? 'подарка' : 'подарков'} от нашей команды`
                : 'Получите пробную подписку бесплатно'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {showTrialOffer && (
          <div className="relative overflow-hidden bg-white rounded-xl border-2 border-purple-200 shadow-md hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-bl-full" />
            
            <div className="relative p-5 flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-xl">
                <Icon name="Gift" size={32} className="text-purple-600" />
              </div>
              
              <div className="flex-1">
                <div className="mb-2">
                  <h3 className="font-bold text-lg text-purple-900">
                    🎉 Подписка на 14 дней бесплатно
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Попробуйте все возможности платформы
                  </p>
                </div>
                
                <Button
                  onClick={handleActivateTrial}
                  disabled={activatingTrial}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all animate-pulse"
                  size="lg"
                >
                  {activatingTrial ? (
                    <>
                      <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                      Активация...
                    </>
                  ) : (
                    <>
                      <Icon name="Sparkles" size={18} className="mr-2" />
                      Активировать пробную подписку
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
        {gifts.map((gift) => (
          <div
            key={gift.id}
            className="relative overflow-hidden bg-white rounded-xl border-2 border-purple-200 shadow-md hover:shadow-lg transition-all"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-bl-full" />
            
            <div className="relative p-5 flex items-center gap-4">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-4 rounded-xl">
                <Icon name="Gift" size={32} className="text-purple-600" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-purple-900">
                      Подарок: Подписка на {gift.gift_value} {gift.gift_value === 1 ? 'день' : gift.gift_value < 5 ? 'дня' : 'дней'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Для объекта: {gift.listing_name}
                    </p>
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                    Новый
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  Получено {new Date(gift.created_at).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                
                <Button
                  onClick={() => handleActivateGift(gift.id)}
                  disabled={activating === gift.id}
                  className="w-full sm:w-auto bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                >
                  {activating === gift.id ? (
                    <>
                      <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                      Активация...
                    </>
                  ) : (
                    <>
                      <Icon name="Sparkles" size={18} className="mr-2" />
                      Активировать подарок
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="bg-purple-100 border-2 border-purple-200 rounded-xl p-4 mt-4">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-purple-600 mt-0.5" />
            <p className="text-sm text-purple-900">
              <strong>Как активировать?</strong> Нажмите кнопку "Активировать подарок", и подписка автоматически продлится на указанное количество дней.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}