import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ListingEditorHeaderProps {
  listing: any;
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
  onTrialDaysChange
}: ListingEditorHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-6 gap-4">
      <div className="flex-1 min-w-0">
        <Button variant="ghost" onClick={() => navigate('/manager')} className="mb-2">
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Назад к списку
        </Button>
        <h1 className="text-3xl font-bold truncate">{listing.name}</h1>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
            {listing.status === 'active' ? '✅ Активен' : '🧊 Заморожен'}
          </Badge>
          {listing.subscription_end && (
            <Badge variant="outline">
              Подписка до: {new Date(listing.subscription_end).toLocaleDateString()}
            </Badge>
          )}
        </div>
      </div>
      <div className="flex gap-2 flex-col sm:flex-row flex-shrink-0">
        {!listing.gold_gift_sent_at && listing.subscription_end && (
          <Button 
            className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-600 hover:via-amber-600 hover:to-yellow-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
            size="lg"
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
                Подарок: Пакет Золото на 14 дней
              </>
            )}
          </Button>
        )}
        {!listing.trial_activated_at && (
          <div className="relative">
            {!showTrialDaysSelector ? (
              <Button 
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                size="lg"
                onClick={() => onShowTrialDaysSelector(true)}
              >
                <Icon name="Sparkles" size={18} className="mr-2" />
                Бесплатный доступ • Активировать
              </Button>
            ) : (
              <div className="flex gap-2 items-center bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg border-2 border-purple-300">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-semibold text-purple-900">Дней:</label>
                  <input 
                    type="number"
                    min="1"
                    max="14"
                    value={trialDays}
                    onChange={(e) => onTrialDaysChange(Math.min(14, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-16 px-2 py-1 text-center border-2 border-purple-300 rounded font-bold text-purple-900"
                  />
                </div>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold"
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
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => window.open(`/owner?extend_sub=${id}`, '_blank')}
        >
          <Icon name="CreditCard" size={18} className="mr-2" />
          Оформить подписку
        </Button>
        <Button onClick={onSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Icon name="Save" size={18} className="mr-2" />
              Сохранить изменения
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
