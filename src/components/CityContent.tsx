import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { City } from '@/data/citiesData';

interface CityContentProps {
  city: City;
  citySlug: string;
}

export default function CityContent({ city, citySlug }: CityContentProps) {
  return (
    <>
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-purple-600">Главная</Link>
              <Icon name="ChevronRight" size={16} />
              <span>{city.name}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Почасовая аренда отелей в {city.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-2">{city.description}</p>
            <p className="text-sm text-muted-foreground">{city.region}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {city.features.map((feature, index) => (
              <Card key={index} className="border-purple-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">
                    {index === 0 && '🏨'}
                    {index === 1 && '💰'}
                    {index === 2 && '📍'}
                    {index === 3 && '⏰'}
                  </div>
                  <p className="font-semibold text-purple-900">{feature}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-purple-200 bg-white/80 backdrop-blur-sm mb-8">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6 text-purple-900">
                Как арендовать номер в {city.name}?
              </h2>
              <ol className="space-y-4 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-semibold">1</span>
                  <span>Выберите подходящий отель в каталоге на главной странице</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-semibold">2</span>
                  <span>Просмотрите фотографии, цены и условия размещения</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-semibold">3</span>
                  <span>Свяжитесь с владельцем напрямую по телефону или в Telegram</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center font-semibold">4</span>
                  <span>Договоритесь о времени заезда и оплате — без комиссии платформы</span>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-purple-900">
                Почему выбирают 120 МИНУТ в {city.name}?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-3">
                  <Icon name="CheckCircle2" size={24} className="text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Проверенные объекты</h3>
                    <p className="text-sm text-muted-foreground">Все отели проходят модерацию перед публикацией</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Icon name="DollarSign" size={24} className="text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Без комиссии</h3>
                    <p className="text-sm text-muted-foreground">Оплата напрямую владельцу, без наценок</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Icon name="Clock" size={24} className="text-purple-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">От 2 часов</h3>
                    <p className="text-sm text-muted-foreground">Минимальный срок аренды от 2 часов</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Icon name="Shield" size={24} className="text-purple-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Безопасно</h3>
                    <p className="text-sm text-muted-foreground">Прямая связь с владельцами, никаких посредников</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 text-center">
            <Link to="/">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Icon name="Search" size={20} className="mr-2" />
                Смотреть все отели в {city.name}
              </Button>
            </Link>
          </div>

          <div className="mt-12 prose prose-purple max-w-none">
            <h2 className="text-2xl font-bold text-purple-900">О почасовой аренде отелей в {city.name}</h2>
            <p className="text-muted-foreground">
              Сервис 120 МИНУТ предоставляет удобную платформу для поиска и бронирования номеров в отелях {city.name} 
              на почасовой основе. Все объекты в каталоге проходят тщательную проверку перед публикацией. 
              Вы можете выбрать подходящий вариант по фотографиям, описанию и ценам, а затем связаться 
              с владельцем напрямую для бронирования.
            </p>
            <p className="text-muted-foreground">
              Почасовая аренда номеров — это удобный формат размещения для тех, кому нужен номер на несколько часов. 
              Это может быть деловая встреча, отдых между рейсами, романтическое свидание или просто отдых после долгой дороги. 
              В {city.name} представлены отели разного уровня комфорта и ценового сегмента.
            </p>
            
            {citySlug === 'moskva' && (
              <>
                <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Москве</h3>
                <p className="text-muted-foreground">
                  <strong>Центральный округ (ЦАО)</strong> — самый востребованный район для краткосрочной аренды номеров. 
                  Здесь расположены отели возле Красной площади, Кремля, Тверской улицы. Идеально для деловых встреч 
                  и туристов. Цены: от 800₽ за 2 часа.
                </p>
                <p className="text-muted-foreground">
                  <strong>Возле аэропортов (Шереметьево, Домодедово, Внуково)</strong> — отели с почасовой оплатой для транзитных 
                  пассажиров. Удобно для отдыха между рейсами. Многие объекты работают круглосуточно. Цены: от 500₽ за 2 часа.
                </p>
                <p className="text-muted-foreground">
                  <strong>Возле вокзалов (Казанский, Курский, Ленинградский, Павелецкий)</strong> — номера для краткосрочного 
                  отдыха после долгой дороги или в ожидании поезда. Цены: от 600₽ за 2 часа.
                </p>
                <p className="text-muted-foreground">
                  <strong>Деловые районы (Москва-Сити, Белорусская, Новослободская)</strong> — отели для бизнес-встреч, 
                  переговоров, отдыха между деловыми визитами. Цены: от 700₽ за 2 часа.
                </p>
                <p className="text-muted-foreground">
                  <strong>Спальные районы (СВАО, ЮВАО, САО)</strong> — бюджетные варианты с почасовой оплатой. 
                  Хорошо подходят для местных жителей. Цены: от 400₽ за 2 часа.
                </p>

                <h3 className="text-xl font-bold text-purple-900 mt-8">Для каких целей арендуют номера на несколько часов?</h3>
                <ul className="text-muted-foreground list-disc pl-6">
                  <li><strong>Отдых между рейсами</strong> — если у вас длительная пересадка в Москве (4-8 часов), удобнее снять номер и отдохнуть, чем сидеть в аэропорту</li>
                  <li><strong>Деловые встречи</strong> — переговоры, презентации, рабочие сессии в комфортной обстановке отеля</li>
                  <li><strong>Романтические свидания</strong> — уединенная атмосфера для пар, многие отели предлагают номера с джакузи</li>
                  <li><strong>Отдых после долгой дороги</strong> — принять душ, выспаться перед важной встречей или мероприятием</li>
                  <li><strong>Работа в тишине</strong> — удаленная работа, учеба, подготовка к экзаменам в спокойной обстановке</li>
                  <li><strong>Ожидание заселения</strong> — если вы приехали в город рано утром, а заселение в отель только с 14:00</li>
                </ul>

                <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Москве?</h4>
                    <p className="text-muted-foreground">
                      Цены на почасовую аренду в Москве начинаются от 400₽ за 2 часа в спальных районах и от 800₽ 
                      в центре города. Стоимость зависит от района, уровня комфорта и дополнительных услуг.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-900">Нужно ли вносить предоплату?</h4>
                    <p className="text-muted-foreground">
                      Условия оплаты устанавливает владелец объекта. Некоторые просят предоплату, другие принимают 
                      оплату по факту заселения. Все детали уточняйте при бронировании напрямую с владельцем.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-900">Какой минимальный срок аренды?</h4>
                    <p className="text-muted-foreground">
                      Большинство отелей в Москве предлагают почасовую аренду от 2 часов. Это стандартный минимум 
                      для краткосрочного размещения. При необходимости можно продлить время пребывания.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-900">Можно ли забронировать номер заранее?</h4>
                    <p className="text-muted-foreground">
                      Да, большинство владельцев принимают предварительные заказы. Свяжитесь с владельцем по телефону 
                      или в Telegram, укажите желаемую дату и время — вам подтвердят бронирование.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-900">Есть ли почасовые отели возле аэропортов Москвы?</h4>
                    <p className="text-muted-foreground">
                      Да, в каталоге представлены отели возле Шереметьево, Домодедово и Внуково с почасовой оплатой. 
                      Это удобный вариант для транзитных пассажиров и тех, кто хочет отдохнуть перед вылетом.
                    </p>
                  </div>
                </div>
              </>
            )}

            {citySlug === 'sankt-peterburg' && (
              <>
                <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Санкт-Петербурге</h3>
                <p className="text-muted-foreground">
                  <strong>Центральный район</strong> — отели возле Невского проспекта, Дворцовой площади, Эрмитажа. 
                  Удобно для туристов и деловых встреч. Цены: от 700₽ за 2 часа.
                </p>
                <p className="text-muted-foreground">
                  <strong>Васильевский остров</strong> — тихий район с множеством отелей для краткосрочной аренды. 
                  Хорошо подходит для романтических свиданий. Цены: от 500₽ за 2 часа.
                </p>
                <p className="text-muted-foreground">
                  <strong>Московский район (возле аэропорта Пулково)</strong> — номера для транзитных пассажиров. 
                  Удобно для отдыха между рейсами. Цены: от 450₽ за 2 часа.
                </p>
                <p className="text-muted-foreground">
                  <strong>Возле вокзалов (Московский, Витебский, Ладожский)</strong> — отели для краткосрочного отдыха 
                  после дороги. Цены: от 500₽ за 2 часа.
                </p>

                <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Санкт-Петербурге?</h4>
                    <p className="text-muted-foreground">
                      Цены на почасовую аренду в СПб начинаются от 450₽ за 2 часа. В центре города и на Невском 
                      проспекте цены выше — от 700₽ за 2 часа.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-900">Есть ли отели с почасовой оплатой возле Пулково?</h4>
                    <p className="text-muted-foreground">
                      Да, в каталоге представлены отели возле аэропорта Пулково с почасовой оплатой. Это удобно 
                      для транзитных пассажиров и тех, кто прилетает рано утром.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-900">Какой минимальный срок аренды?</h4>
                    <p className="text-muted-foreground">
                      Минимальный срок аренды в большинстве отелей Санкт-Петербурга — 2 часа. Можно продлить 
                      время пребывания по договоренности с владельцем.
                    </p>
                  </div>
                </div>
              </>
            )}

            {citySlug === 'kazan' && (
              <>
                <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Казани</h3>
                <p className="text-muted-foreground">
                  <strong>Вахитовский район (центр города)</strong> — отели возле Кремля, улицы Баумана, набережной Казанки. 
                  Идеально для туристов и деловых встреч. Цены: от 600₽ за 2 часа.
                </p>
                <p className="text-muted-foreground">
                  <strong>Возле аэропорта</strong> — отели с почасовой оплатой для транзитных пассажиров. 
                  Цены: от 400₽ за 2 часа.
                </p>
                <p className="text-muted-foreground">
                  <strong>Московский район</strong> — бюджетные варианты с почасовой арендой. Цены: от 350₽ за 2 часа.
                </p>

                <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Казани?</h4>
                    <p className="text-muted-foreground">
                      Цены на почасовую аренду в Казани начинаются от 350₽ за 2 часа. В центре города цены выше — 
                      от 600₽ за 2 часа.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-900">Какой минимальный срок аренды?</h4>
                    <p className="text-muted-foreground">
                      Минимальный срок аренды в отелях Казани — 2 часа. Можно продлить время пребывания.
                    </p>
                  </div>
                </div>
              </>
            )}

            {citySlug === 'ekaterinburg' && (
              <>
                <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Екатеринбурге</h3>
                <p className="text-muted-foreground">
                  <strong>Центр города (площадь 1905 года, Плотинка)</strong> — отели для деловых встреч и туристов. 
                  Цены: от 550₽ за 2 часа.
                </p>
                <p className="text-muted-foreground">
                  <strong>Возле аэропорта Кольцово</strong> — отели с почасовой оплатой для транзитных пассажиров. 
                  Цены: от 350₽ за 2 часа.
                </p>
                <p className="text-muted-foreground">
                  <strong>Улица Вайнера</strong> — туристический центр с множеством отелей. Цены: от 500₽ за 2 часа.
                </p>

                <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Екатеринбурге?</h4>
                    <p className="text-muted-foreground">
                      Цены на почасовую аренду в Екатеринбурге начинаются от 350₽ за 2 часа. В центре города цены 
                      выше — от 550₽ за 2 часа.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-900">Какой минимальный срок аренды?</h4>
                    <p className="text-muted-foreground">
                      Минимальный срок аренды в отелях Екатеринбурга — 2 часа. Можно продлить время пребывания 
                      по договоренности с владельцем.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="inline-block">
                <img 
                  src="https://cdn.poehali.dev/projects/1a35ca30-983f-4a91-b0b4-3c6fa1c9a65b/files/8251a8b2-9b61-4cee-9e68-aae6e7ec6e96.jpg" 
                  alt="120 минут" 
                  className="h-16 w-16 object-contain mb-4"
                />
              </Link>
              <h3 className="text-xl font-bold mb-4">120 МИНУТ</h3>
              <p className="text-purple-200 text-sm">
                Платформа для поиска отелей с почасовой арендой по всей России
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">О сервисе</h4>
              <ul className="space-y-2 text-sm text-purple-200">
                <li><Link to="/about" className="hover:text-white transition">О нас</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition">Как это работает</Link></li>
                <li><Link to="/contacts" className="hover:text-white transition">Контакты</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Владельцам</h4>
              <ul className="space-y-2 text-sm text-purple-200">
                <li><Link to="/add-hotel" className="hover:text-white transition">Разместить объект</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition">Тарифы</Link></li>
                <li><Link to="/rules" className="hover:text-white transition">Правила размещения</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Помощь</h4>
              <ul className="space-y-2 text-sm text-purple-200">
                <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
                <li><Link to="/support" className="hover:text-white transition">Поддержка</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition">Политика конфиденциальности</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-700 mt-8 pt-8 text-center text-sm text-purple-200">
            <p>&copy; 2025 120 МИНУТ. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </>
  );
}