import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Listing {
  id: number;
  title: string;
  city: string;
  district?: string;
  image_url: string;
  type: string;
}

interface OwnerExpertTabProps {
  listings: Listing[];
  token: string;
  ownerId: number;
  onUpdate: () => void;
}

export default function OwnerExpertTab({ listings }: OwnerExpertTabProps) {
  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Icon name="Lightbulb" size={24} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl mb-3">Рекомендации для успешной аренды</CardTitle>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <Icon name="Camera" size={18} className="text-purple-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Фотографии решают всё:</strong> Гости выбирают объекты в первую очередь по качеству фото. Используйте яркие, чёткие снимки с хорошим освещением.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="FileText" size={18} className="text-purple-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Полное описание:</strong> Укажите все удобства, особенности расположения и правила. Чем больше информации — тем больше доверия.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="Gift" size={18} className="text-purple-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Лояльность к гостям:</strong> Предлагайте акции и скидки при повторном бронировании. Постоянные клиенты — основа стабильного дохода.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="Zap" size={18} className="text-purple-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Быстрый отклик:</strong> Отвечайте на запросы гостей в течение 15-30 минут. Скорость ответа напрямую влияет на конверсию.</p>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="Star" size={18} className="text-purple-600 mt-0.5 flex-shrink-0" />
                  <p><strong>Репутация:</strong> Просите довольных гостей оставлять отзывы. Хорошие отзывы повышают доверие новых клиентов.</p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}