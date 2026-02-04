import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function OwnerGoldPromoCard() {
  return (
    <div className="inline-block">
      <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 shadow-lg hover:shadow-xl transition-all duration-300 max-w-md">
        <CardContent className="p-4">
          <div className="bg-white rounded-xl p-4 border-2 border-yellow-300 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-br from-yellow-500 to-amber-500 p-2.5 rounded-full shadow-md flex-shrink-0">
                <Icon name="Gift" size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-base text-yellow-900 mb-1 flex items-center gap-2">
                  <Icon name="Sparkles" size={16} className="text-yellow-600" />
                  Акция: Пакет Золото
                </h3>
                <p className="text-sm text-yellow-800 leading-relaxed mb-2">
                  При первом продлении подписки обратитесь к Вашему менеджеру и получите подарок: 
                  <strong className="text-yellow-900"> +14 дней к подписке бесплатно!</strong>
                </p>
                <div className="flex items-center gap-1 text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-md">
                  <Icon name="Info" size={14} />
                  <span>Подарок доступен после оплаты подписки минимум на 1 месяц</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
