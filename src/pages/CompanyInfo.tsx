import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function CompanyInfo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        <header className="text-center mb-8">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            120 минут
          </h1>
          <p className="text-lg text-muted-foreground">
            Платформа для поиска почасовой аренды
          </p>
        </header>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Building2" size={24} />
                Информация о компании
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Наименование</div>
                  <div className="font-semibold">ИП Иванов Иван Иванович</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">ИНН</div>
                  <div className="font-semibold">123456789012</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">ОГРНИП</div>
                  <div className="font-semibold">123456789012345</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Дата регистрации</div>
                  <div className="font-semibold">01.01.2024</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="MapPin" size={24} />
                Юридический адрес
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">
                450000, Республика Башкортостан, г. Уфа, ул. Ленина, д. 1, офис 100
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Phone" size={24} />
                Контактная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Телефон</div>
                <a href="tel:+79991234567" className="font-semibold text-purple-600 hover:underline">
                  +7 (999) 123-45-67
                </a>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Email</div>
                <a href="mailto:info@120min.ru" className="font-semibold text-purple-600 hover:underline">
                  info@120min.ru
                </a>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Telegram</div>
                <a href="https://t.me/support120min" target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-600 hover:underline">
                  @support120min
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="CreditCard" size={24} />
                Банковские реквизиты
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Банк</div>
                  <div className="font-semibold">ПАО Сбербанк</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">БИК</div>
                  <div className="font-semibold">044525225</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Корр. счёт</div>
                  <div className="font-semibold">30101810400000000225</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Расчётный счёт</div>
                  <div className="font-semibold">40802810123456789012</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="FileText" size={24} />
                Правовая информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Вид деятельности</div>
                <div className="font-semibold">Деятельность по предоставлению прочих вспомогательных услуг для бизнеса</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">ОКВЭД</div>
                <div className="font-semibold">82.99 - Деятельность по предоставлению прочих вспомогательных услуг для бизнеса</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Shield" size={24} className="text-purple-600" />
                О платформе
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <strong>120 минут</strong> — это агрегатор предложений почасовой аренды номеров и апартаментов.
              </p>
              <p>
                Мы не являемся владельцами объектов размещения. Платформа работает как маркетплейс, 
                соединяющий владельцев гостиниц с потенциальными клиентами.
              </p>
              <p>
                Все договоры заключаются напрямую между клиентом и собственником объекта. 
                Платформа взимает комиссию с владельцев за размещение и продвижение их предложений.
              </p>
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  Политика конфиденциальности | Пользовательское соглашение | Публичная оферта
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
