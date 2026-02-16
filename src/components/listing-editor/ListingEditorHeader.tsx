import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ListingEditorHeaderProps {
  listing: {
    name: string;
    status: string;
    subscription_end?: string;
    subscription_purchased_by_owner?: boolean;
    subscription_is_gift?: boolean;
    gold_gift_sent_at?: string;
    trial_activated_at?: string;
  };
  saving: boolean;
  sendingGoldGift: boolean;
  activatingTrial: boolean;
  showTrialDaysSelector: boolean;
  trialDays: number;
  id: string | undefined;
  onSave: () => void;
  onSendGoldGift: () => void;
  onActivateTrial: () => void;
  onShowTrialDaysSelector: (show: boolean) => void;
  onTrialDaysChange: (days: number) => void;
  onMoveToInactive?: () => void;
}

export default function ListingEditorHeader({
  listing,
  saving,
  sendingGoldGift,
  activatingTrial,
  showTrialDaysSelector,
  trialDays,
  id,
  onSave,
  onSendGoldGift,
  onActivateTrial,
  onShowTrialDaysSelector,
  onTrialDaysChange,
  onMoveToInactive
}: ListingEditorHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resettingSubscription, setResettingSubscription] = useState(false);
  const [showInactiveDaysSelector, setShowInactiveDaysSelector] = useState(false);
  const [inactiveDays, setInactiveDays] = useState(7);
  const [movingToInactive, setMovingToInactive] = useState(false);

  const canResetSubscription = listing.subscription_end && 
    !listing.subscription_purchased_by_owner && 
    !listing.subscription_is_gift;

  const calculateRemainingDays = () => {
    if (!listing.subscription_end) return 0;
    const endDate = new Date(listing.subscription_end);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const remainingDays = calculateRemainingDays();

  const getAdminIdFromToken = (): number | null => {
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

  const handleResetSubscription = async () => {
    if (!window.confirm('Вы уверены, что хотите обнулить подписку? Это действие необратимо.')) {
      return;
    }

    const adminId = getAdminIdFromToken();
    if (!adminId) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось определить ID менеджера. Попробуйте перезайти в систему.',
        variant: 'destructive'
      });
      return;
    }

    setResettingSubscription(true);
    try {
      const response = await fetch('https://functions.poehali.dev/6c4f7ec8-42fb-47e5-9187-fcc55e47eceb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reset_subscription',
          listing_id: parseInt(id || '0'),
          manager_id: adminId
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно',
          description: 'Подписка обнулена'
        });
        window.location.reload();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось обнулить подписку',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при обнулении подписки',
        variant: 'destructive'
      });
    } finally {
      setResettingSubscription(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-purple-200 p-4 sm:p-6 mb-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Button variant="ghost" onClick={() => navigate('/manager')} className="mb-3 -ml-2">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад к списку
            </Button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{listing.name}</h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant={listing.status === 'active' ? 'default' : 'secondary'} className="text-sm">
                {listing.status === 'active' ? '✅ Активен' : '🧊 Заморожен'}
              </Badge>
              {listing.subscription_end && (
                <Badge variant="outline" className="text-sm border-purple-300">
                  <Icon name="Calendar" size={14} className="mr-1" />
                  До: {new Date(listing.subscription_end).toLocaleDateString()}
                </Badge>
              )}
              {listing.subscription_purchased_by_owner && (
                <Badge className="bg-green-500 text-white text-sm">
                  <Icon name="CreditCard" size={14} className="mr-1" />
                  Куплена владельцем
                </Badge>
              )}
              {listing.subscription_is_gift && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-sm">
                  <Icon name="Gift" size={14} className="mr-1" />
                  Подарок
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline"
            onClick={() => navigate('/manager/inactive-listings')}
            className="border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            <Icon name="Archive" size={18} className="mr-2" />
            Базы неактивных
          </Button>

          {!listing.gold_gift_sent_at && listing.subscription_end && (
            <Button 
              className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-600 hover:via-amber-600 hover:to-yellow-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              onClick={onSendGoldGift}
              disabled={sendingGoldGift}
            >
              {sendingGoldGift ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Gift" size={18} className="mr-2" />
                  Подарить Золото (14 дней)
                </>
              )}
            </Button>
          )}

          {!listing.trial_activated_at && (
            <div className="flex items-center gap-2">
              {!showTrialDaysSelector ? (
                <Button 
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-semibold shadow-md hover:shadow-lg transition-all"
                  onClick={() => onShowTrialDaysSelector(true)}
                >
                  <Icon name="Sparkles" size={18} className="mr-2" />
                  Подарить подписку
                </Button>
              ) : (
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 p-2 rounded-lg border-2 border-purple-300">
                  <label className="text-sm font-semibold text-purple-900 whitespace-nowrap">Дней:</label>
                  <input 
                    type="number"
                    min="1"
                    max="14"
                    value={trialDays}
                    onChange={(e) => onTrialDaysChange(Math.min(14, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-16 px-2 py-1 text-center border-2 border-purple-300 rounded font-bold text-purple-900"
                  />
                  <Button 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
                    size="sm"
                    onClick={onActivateTrial}
                    disabled={activatingTrial}
                  >
                    {activatingTrial ? (
                      <>
                        <Icon name="Loader2" size={16} className="mr-1 animate-spin" />
                        Активация...
                      </>
                    ) : (
                      <>
                        <Icon name="Check" size={16} className="mr-1" />
                        Активировать
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onShowTrialDaysSelector(false);
                      onTrialDaysChange(14);
                    }}
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              )}
            </div>
          )}

          {!showInactiveDaysSelector ? (
            <Button 
              variant="outline"
              onClick={() => setShowInactiveDaysSelector(true)}
              className="border-orange-400 text-orange-700 hover:bg-orange-50"
            >
              <Icon name="ArchiveX" size={18} className="mr-2" />
              Перенести в неактивные
            </Button>
          ) : (
            <div className="flex items-center gap-2 bg-orange-50 p-2 rounded-lg border-2 border-orange-300">
              <label className="text-sm font-semibold text-orange-900 whitespace-nowrap">Дней обратной связи:</label>
              <input 
                type="number"
                min="1"
                max="30"
                value={inactiveDays}
                onChange={(e) => setInactiveDays(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-16 px-2 py-1 text-center border-2 border-orange-300 rounded font-bold text-orange-900"
              />
              <Button 
                className="bg-orange-600 hover:bg-orange-700 text-white"
                size="sm"
                onClick={async () => {
                  if (!window.confirm(`Перенести объект в неактивные с таймером обратной связи ${inactiveDays} ${inactiveDays === 1 ? 'день' : inactiveDays < 5 ? 'дня' : 'дней'}?`)) {
                    return;
                  }
                  setMovingToInactive(true);
                  try {
                    const response = await fetch('https://functions.poehali.dev/4d42288a-e311-4754-98a2-944dfc667bd2', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        listing_id: parseInt(id || '0'),
                        move_to_inactive: true,
                        inactive_days: inactiveDays,
                        inactive_reason: 'Владелец против размещения'
                      })
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                      toast({ title: 'Успешно', description: `Объект перенесен в неактивные. Обратная связь через ${inactiveDays} дней` });
                      navigate('/manager/inactive-listings');
                    } else {
                      toast({ title: 'Ошибка', description: data.error || 'Не удалось перенести', variant: 'destructive' });
                    }
                  } catch (error) {
                    console.error(error);
                    toast({ title: 'Ошибка', description: 'Не удалось перенести объект', variant: 'destructive' });
                  } finally {
                    setMovingToInactive(false);
                  }
                }}
                disabled={movingToInactive}
              >
                {movingToInactive ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-1 animate-spin" />
                    Перенос...
                  </>
                ) : (
                  <>
                    <Icon name="Check" size={16} className="mr-1" />
                    Подтвердить
                  </>
                )}
              </Button>
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowInactiveDaysSelector(false);
                  setInactiveDays(7);
                }}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          )}

          {canResetSubscription && (
            <Button 
              variant="outline"
              onClick={handleResetSubscription}
              disabled={resettingSubscription}
              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              {resettingSubscription ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Обнуление...
                </>
              ) : (
                <>
                  <Icon name="RotateCcw" size={18} className="mr-2" />
                  Обнулить подписку ({remainingDays} {remainingDays === 1 ? 'день' : remainingDays < 5 ? 'дня' : 'дней'})
                </>
              )}
            </Button>
          )}

          <Button onClick={onSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white font-semibold">
            {saving ? (
              <>
                <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Icon name="Save" size={18} className="mr-2" />
                Сохранить
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}