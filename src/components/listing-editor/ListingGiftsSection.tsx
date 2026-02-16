import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const GIFTS_FUNC_URL = 'https://functions.poehali.dev/f3efd862-21a8-46cf-bb7e-be0a792a4fad';

interface Gift {
  id: number;
  gift_type: string;
  gift_value: number;
  status: string;
  created_at: string;
  activated_at?: string;
  description: string;
  manager_name?: string;
}

interface ListingGiftsSectionProps {
  listingId: number;
}

export default function ListingGiftsSection({ listingId }: ListingGiftsSectionProps) {
  const { toast } = useToast();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [daysCount, setDaysCount] = useState('7');
  const [showGiftForm, setShowGiftForm] = useState(false);

  const getManagerId = (): number | null => {
    const token = localStorage.getItem('adminToken');
    if (!token) return null;
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      const decoded = JSON.parse(jsonPayload);
      return decoded?.admin_id || null;
    } catch {
      return null;
    }
  };

  const fetchGifts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${GIFTS_FUNC_URL}?listing_id=${listingId}`);
      const data = await response.json();
      if (data.gifts) {
        setGifts(data.gifts);
      }
    } catch (error) {
      console.error('Ошибка загрузки подарков:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendGift = async () => {
    const days = parseInt(daysCount);
    
    if (isNaN(days) || days < 1 || days > 14) {
      toast({
        title: 'Ошибка',
        description: 'Количество дней должно быть от 1 до 14',
        variant: 'destructive'
      });
      return;
    }

    setSending(true);
    try {
      const response = await fetch(GIFTS_FUNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          gift_type: 'subscription',
          gift_value: days,
          manager_id: getManagerId()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: '🎁 Подарок отправлен!',
          description: `Владелец получит подписку на ${days} дн.`
        });
        setDaysCount('7');
        setShowGiftForm(false);
        fetchGifts();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось отправить подарок',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при отправке подарка',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">⏳ Ожидает</Badge>;
      case 'activated':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">✅ Активирован</Badge>;
      case 'expired':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">⏱️ Истёк</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Gift" size={24} />
              Подарки
            </CardTitle>
            <CardDescription>Отправляйте подарки владельцу объекта</CardDescription>
          </div>
          <Button 
            onClick={() => {
              setShowGiftForm(!showGiftForm);
              if (!showGiftForm) fetchGifts();
            }}
            variant={showGiftForm ? "outline" : "default"}
          >
            {showGiftForm ? (
              <>
                <Icon name="X" size={16} className="mr-2" />
                Закрыть
              </>
            ) : (
              <>
                <Icon name="Gift" size={16} className="mr-2" />
                Отправить подарок
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {showGiftForm && (
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-orange-50 p-6 rounded-lg border-2 border-dashed border-purple-200">
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <Icon name="Gift" size={32} className="text-purple-600" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">🎁 Подарок: Подписка</h3>
                  <p className="text-sm text-muted-foreground">
                    Подарите владельцу бесплатную подписку от 1 до 14 дней
                  </p>
                </div>

                <div className="grid gap-2 max-w-xs">
                  <Label htmlFor="days">Количество дней (1-14)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="days"
                      type="number"
                      min="1"
                      max="14"
                      value={daysCount}
                      onChange={(e) => setDaysCount(e.target.value)}
                      placeholder="7"
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleSendGift} 
                      disabled={sending}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {sending ? (
                        <>
                          <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                          Отправка...
                        </>
                      ) : (
                        <>
                          <Icon name="Send" size={16} className="mr-2" />
                          Отправить
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-4">
              <Icon name="Loader2" size={24} className="animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Загрузка истории подарков...</p>
            </div>
          ) : gifts.length > 0 ? (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">История подарков</h4>
              <div className="space-y-2">
                {gifts.map((gift) => (
                  <div 
                    key={gift.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Icon name="Gift" size={20} className="text-purple-600" />
                      <div>
                        <p className="font-medium text-sm">{gift.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(gift.created_at).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(gift.status)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              История подарков пуста
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}