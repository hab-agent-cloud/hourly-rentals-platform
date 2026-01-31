import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function AdminAnalyticsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="BarChart3" size={32} className="text-purple-600" />
        <div>
          <h2 className="text-3xl font-bold">Аналитика посещений</h2>
          <p className="text-muted-foreground">Статистика Яндекс.Метрики</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Users" size={20} className="text-blue-600" />
              Посещаемость
            </CardTitle>
            <CardDescription>Количество посетителей и просмотров за последние 30 дней</CardDescription>
          </CardHeader>
          <CardContent>
            <iframe
              src="https://metrika.yandex.ru/dashboard?id=101026698&period=month&group=day"
              width="100%"
              height="400"
              frameBorder="0"
              className="rounded-lg"
              title="Яндекс.Метрика - Посещаемость"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="TrendingUp" size={20} className="text-green-600" />
              География посетителей
            </CardTitle>
            <CardDescription>Из каких городов приходят пользователи</CardDescription>
          </CardHeader>
          <CardContent>
            <iframe
              src="https://metrika.yandex.ru/stat/geography?id=101026698&period=month"
              width="100%"
              height="400"
              frameBorder="0"
              className="rounded-lg"
              title="Яндекс.Метрика - География"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="MousePointer" size={20} className="text-purple-600" />
              Источники трафика
            </CardTitle>
            <CardDescription>Откуда приходят посетители</CardDescription>
          </CardHeader>
          <CardContent>
            <iframe
              src="https://metrika.yandex.ru/stat/sources?id=101026698&period=month"
              width="100%"
              height="400"
              frameBorder="0"
              className="rounded-lg"
              title="Яндекс.Метрика - Источники"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Clock" size={20} className="text-orange-600" />
              Популярные страницы
            </CardTitle>
            <CardDescription>Какие страницы просматривают чаще всего</CardDescription>
          </CardHeader>
          <CardContent>
            <iframe
              src="https://metrika.yandex.ru/stat/content?id=101026698&period=month"
              width="100%"
              height="400"
              frameBorder="0"
              className="rounded-lg"
              title="Яндекс.Метрика - Контент"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Activity" size={20} className="text-red-600" />
            Карта кликов (Вебвизор)
          </CardTitle>
          <CardDescription>Записи действий посетителей на сайте</CardDescription>
        </CardHeader>
        <CardContent>
          <iframe
            src="https://metrika.yandex.ru/webvisor2?id=101026698"
            width="100%"
            height="600"
            frameBorder="0"
            className="rounded-lg"
            title="Яндекс.Метрика - Вебвизор"
          />
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Для полного доступа</h3>
            <p className="text-sm text-blue-700">
              Если виджеты не отображаются, войдите в свой аккаунт Яндекс.Метрики в другой вкладке браузера.
              <br />
              <a 
                href="https://metrika.yandex.ru/dashboard?id=101026698" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-blue-900 font-medium"
              >
                Открыть полную версию Яндекс.Метрики →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
