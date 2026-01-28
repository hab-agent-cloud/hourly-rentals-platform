import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function AboutSection() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="https://cdn.poehali.dev/projects/1a35ca30-983f-4a91-b0b4-3c6fa1c9a65b/files/eb1f7656-79bf-458f-a9d8-00f75775f384.jpg" 
            alt="120 минут" 
            className="h-20 w-20 object-contain mb-4"
          />
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            О платформе 120 минут
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-purple-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Icon name="Clock" size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-purple-900">Быстрое бронирование</h3>
              <p className="text-muted-foreground">
                Забронируйте номер всего за пару минут. Без лишних формальностей и ожидания.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Icon name="MapPin" size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-purple-900">По всей России</h3>
              <p className="text-muted-foreground">
                Сотни проверенных отелей и апартаментов в разных городах страны.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Icon name="Shield" size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-purple-900">Проверенные объекты</h3>
              <p className="text-muted-foreground">
                Все отели проходят модерацию. Мы гарантируем качество и безопасность.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                <Icon name="DollarSign" size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-purple-900">Выгодные цены</h3>
              <p className="text-muted-foreground">
                Прозрачные цены без скрытых комиссий. Оплата напрямую владельцу.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 border border-purple-200">
          <h3 className="text-2xl font-semibold mb-6 text-purple-900">Чем мы занимаемся?</h3>
          <div className="space-y-4 text-muted-foreground">
            <p className="text-base leading-relaxed">
              <strong className="text-purple-900">120 МИНУТ</strong> — первая российская платформа для почасовой аренды отелей и апартаментов. 
              Мы создали сервис, который объединяет владельцев жилья и гостей для быстрых и удобных сделок без посредников.
            </p>
            <p className="text-base leading-relaxed">
              <strong className="text-purple-900">Наша миссия:</strong> сделать краткосрочную аренду номеров доступной, безопасной и выгодной для всех участников. 
              Мы помогаем владельцам эффективно управлять своими объектами, а гостям — быстро находить подходящие варианты размещения от 2 часов.
            </p>
            <p className="text-base leading-relaxed">
              <strong className="text-purple-900">География:</strong> более 500 проверенных объектов в 21 городе России. 
              Все отели и апартаменты проходят тщательную модерацию на соответствие стандартам качества и безопасности.
            </p>
            <p className="text-base leading-relaxed">
              <strong className="text-purple-900">Преимущества:</strong> прямая связь с владельцами, прозрачные цены без скрытых комиссий, 
              удобный каталог с фотографиями и актуальными ценами, быстрое бронирование через телефон или Telegram.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}