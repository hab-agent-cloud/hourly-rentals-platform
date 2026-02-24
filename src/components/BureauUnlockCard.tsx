import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const BUREAU_UNLOCK_URL = 'https://functions.poehali.dev/76042759-86cc-405a-8d90-42485c692e6d';

interface UnlockTier {
  rooms: number;
  price: number;
}

interface BureauUnlockCardProps {
  ownerId: number;
  onUnlockSuccess?: () => void;
}

export default function BureauUnlockCard({ ownerId, onUnlockSuccess }: BureauUnlockCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState<number | null>(null);
  const [data, setData] = useState<{
    current_limit: number;
    current_rooms: number;
    base_limit: number;
    available_unlocks: UnlockTier[];
  } | null>(null);
  const { toast } = useToast();

  const fetchLimitInfo = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BUREAU_UNLOCK_URL}?owner_id=${ownerId}`);
      const json = await res.json();
      setData(json);
    } catch {
      // игнорируем
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (ownerId) fetchLimitInfo();
  }, [ownerId]);

  const handleUnlock = async (level: number, price: number) => {
    setUnlockLoading(level);
    try {
      const res = await fetch(BUREAU_UNLOCK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner_id: ownerId, unlock_level: level }),
      });
      const json = await res.json();

      if (json.error) {
        if (json.required && json.available !== undefined) {
          toast({
            title: 'Недостаточно средств',
            description: `Нужно ${json.required.toLocaleString('ru')} ₽, доступно ${json.available.toLocaleString('ru')} ₽`,
            variant: 'destructive',
          });
        } else {
          toast({ title: 'Ошибка', description: json.error, variant: 'destructive' });
        }
        return;
      }

      toast({
        title: 'Готово!',
        description: json.message || `Разблокировано до ${level} квартир в бюро`,
      });
      await fetchLimitInfo();
      onUnlockSuccess?.();
    } catch {
      toast({ title: 'Ошибка соединения', description: 'Попробуйте позже', variant: 'destructive' });
    } finally {
      setUnlockLoading(null);
    }
  };

  if (isLoading || !data) return null;
  if (data.available_unlocks.length === 0 && data.current_limit >= 20) return null;

  return (
    <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="bg-amber-500 p-1.5 rounded-lg">
            <Icon name="Building2" size={16} className="text-white" />
          </div>
          Квартирное бюро — лимит квартир
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Текущий лимит */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Текущий лимит</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-amber-400 text-amber-700 font-bold">
              {data.current_rooms} / {data.current_limit} квартир
            </Badge>
          </div>
        </div>

        {/* Прогресс */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full transition-all"
            style={{ width: `${Math.min(100, (data.current_rooms / data.current_limit) * 100)}%` }}
          />
        </div>

        {/* Разблокировки */}
        {data.available_unlocks.length > 0 && (
          <div className="space-y-2 pt-1">
            <p className="text-xs text-gray-500 font-medium">Разблокировать дополнительные места — разовая оплата:</p>
            <div className="grid gap-2">
              {data.available_unlocks.map((tier) => (
                <div
                  key={tier.rooms}
                  className="flex items-center justify-between bg-white border border-amber-200 rounded-lg p-3"
                >
                  <div>
                    <p className="font-semibold text-sm text-gray-900">до {tier.rooms} квартир</p>
                    <p className="text-xs text-gray-500">Платить повторно не нужно</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleUnlock(tier.rooms, tier.price)}
                    disabled={unlockLoading !== null}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  >
                    {unlockLoading === tier.rooms ? (
                      <Icon name="Loader2" size={14} className="animate-spin" />
                    ) : (
                      <>
                        <Icon name="Unlock" size={14} className="mr-1" />
                        {tier.price.toLocaleString('ru')} ₽
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.current_limit >= 20 && (
          <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 p-2 rounded-lg">
            <Icon name="CheckCircle2" size={14} />
            Максимальный лимит достигнут — до 20 квартир
          </div>
        )}
      </CardContent>
    </Card>
  );
}
