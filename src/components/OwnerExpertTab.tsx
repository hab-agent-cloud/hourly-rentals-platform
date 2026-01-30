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

      {listings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Icon name="Building" size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground">У вас пока нет объектов</p>
          </CardContent>
        </Card>
      ) : (
        listings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={listing.image_url} 
                    alt={listing.title} 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <CardTitle className="text-lg">{listing.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{listing.city}{listing.district ? `, ${listing.district}` : ''}</p>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <Alert className="border-purple-200 bg-purple-50/50">
                <Icon name="Info" size={20} className="text-purple-600" />
                <AlertDescription className="ml-2">
                  Следуйте рекомендациям выше для повышения привлекательности ваших объектов.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
