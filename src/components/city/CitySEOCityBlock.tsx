interface CitySEOCityBlockProps {
  citySlug: string;
}

export default function CitySEOCityBlock({ citySlug }: CitySEOCityBlockProps) {
  return (
    <>
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
                Большинство отелей в Москве предлагают почасовую аренду от 1 часа. Это стандартный минимум 
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

      {citySlug === 'samara' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Самаре</h3>
          <p className="text-muted-foreground">
            <strong>Центр города (площадь Куйбышева, Ленинградская улица)</strong> — отели для деловых встреч и туристов. 
            Идеально для посещения театров, музеев и деловых центров. Цены: от 600₽ за 2 часа.
          </p>
          <p className="text-muted-foreground">
            <strong>Набережная Волги</strong> — отели с видом на реку для романтических встреч и отдыха. 
            Популярное место для краткосрочной аренды. Цены: от 550₽ за 2 часа.
          </p>
          <p className="text-muted-foreground">
            <strong>Возле аэропорта Курумоч</strong> — отели с почасовой оплатой для транзитных пассажиров. 
            Удобно для отдыха между рейсами. Цены: от 400₽ за 2 часа.
          </p>
          <p className="text-muted-foreground">
            <strong>Железнодорожный район (возле вокзала)</strong> — номера для краткосрочного отдыха после дороги. 
            Цены: от 450₽ за 2 часа.
          </p>
          <p className="text-muted-foreground">
            <strong>Районы метро (Российская, Московская)</strong> — бюджетные варианты с почасовой арендой. 
            Удобная транспортная доступность. Цены: от 350₽ за 2 часа.
          </p>

          <h3 className="text-xl font-bold text-purple-900 mt-8">Для каких целей арендуют номера на несколько часов?</h3>
          <p className="text-muted-foreground">
            <strong>Деловые встречи</strong> — многие бизнесмены арендуют номера для переговоров, презентаций 
            или работы в спокойной обстановке. В центре Самары представлены отели с конференц-залами.
          </p>
          <p className="text-muted-foreground">
            <strong>Отдых между поездками</strong> — транзитные пассажиры часто арендуют номера возле аэропорта 
            или вокзала для отдыха перед вылетом/отправлением.
          </p>
          <p className="text-muted-foreground">
            <strong>Романтические свидания</strong> — пары выбирают почасовую аренду для приватных встреч. 
            Особенно популярны отели с джакузи и видом на Волгу.
          </p>
          <p className="text-muted-foreground">
            <strong>Отдых после дороги</strong> — водители дальних рейсов и туристы арендуют номера для 
            короткого отдыха после долгой дороги.
          </p>

          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Самаре?</h4>
              <p className="text-muted-foreground">
                Цены на почасовую аренду в Самаре начинаются от 350₽ за 2 часа. В центре города и на набережной 
                цены выше — от 600₽ за 2 часа.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-purple-900">Есть ли отели с почасовой оплатой возле аэропорта Курумоч?</h4>
              <p className="text-muted-foreground">
                Да, в каталоге представлены отели возле аэропорта Курумоч с почасовой оплатой. Это удобно для 
                транзитных пассажиров и тех, кто прилетает рано утром или поздно вечером.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-purple-900">Какой минимальный срок аренды?</h4>
              <p className="text-muted-foreground">
                Минимальный срок аренды в большинстве отелей Самары — 2 часа. Можно продлить время пребывания 
                по договоренности с владельцем.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-purple-900">Можно ли арендовать номер с видом на Волгу?</h4>
              <p className="text-muted-foreground">
                Да, на платформе представлены отели с видом на Волгу. Они особенно популярны для романтических 
                встреч и отдыха. Цены начинаются от 550₽ за 2 часа.
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

      {citySlug === 'khabarovsk' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Хабаровске</h3>
          <p className="text-muted-foreground"><strong>Центральный район</strong> — отели возле улицы Муравьёва-Амурского и набережной Амура. Идеально для деловых встреч и туристов. Цены: от 450₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта</strong> — почасовые номера для транзитных пассажиров. Удобно для отдыха между рейсами. Цены: от 350₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Железнодорожный район</strong> — отели возле главного вокзала для краткосрочного отдыха. Цены: от 300₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Хабаровске?</h4><p className="text-muted-foreground">Цены начинаются от 300₽ за 2 часа. В центре города — от 450₽ за 2 часа.</p></div>
            <div><h4 className="font-bold text-purple-900">Можно ли забронировать номер заранее?</h4><p className="text-muted-foreground">Да, свяжитесь с владельцем по телефону или Telegram, укажите дату и время — вам подтвердят бронирование.</p></div>
          </div>
        </>
      )}

      {citySlug === 'tolyatti' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Тольятти</h3>
          <p className="text-muted-foreground"><strong>Автозаводский район</strong> — самый большой район города с широким выбором почасовых отелей. Цены: от 300₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Центральный район</strong> — отели для деловых встреч и романтических свиданий. Цены: от 350₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Тольятти?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа — одни из самых доступных в Поволжье.</p></div>
            <div><h4 className="font-bold text-purple-900">Какой минимальный срок аренды?</h4><p className="text-muted-foreground">Минимальный срок в большинстве отелей Тольятти — 2 часа.</p></div>
          </div>
        </>
      )}

      {citySlug === 'izhevsk' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Ижевске</h3>
          <p className="text-muted-foreground"><strong>Центр (улица Пушкинская, набережная)</strong> — лучшие варианты для деловых встреч и туристов. Цены: от 350₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта и вокзала</strong> — почасовые номера для транзита и отдыха после дороги. Цены: от 280₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Ижевске?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа. Столица Удмуртии — один из доступных городов для почасовой аренды.</p></div>
            <div><h4 className="font-bold text-purple-900">Можно ли снять номер с джакузи?</h4><p className="text-muted-foreground">Да, в каталоге представлены номера с джакузи для романтических встреч. Уточняйте наличие у владельца при бронировании.</p></div>
          </div>
        </>
      )}

      {citySlug === 'yaroslavl' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Ярославле</h3>
          <p className="text-muted-foreground"><strong>Исторический центр (набережная Волги, Советская площадь)</strong> — отели в старинном городе Золотого кольца. Идеально для туристов. Цены: от 450₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта Туношна и вокзалов</strong> — почасовые номера для отдыха в пути. Цены: от 300₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Ярославле?</h4><p className="text-muted-foreground">Цены начинаются от 300₽ за 2 часа. В историческом центре — от 450₽ за 2 часа.</p></div>
            <div><h4 className="font-bold text-purple-900">Есть ли отели с видом на Волгу?</h4><p className="text-muted-foreground">Да, в каталоге есть номера с видом на набережную Волги — популярный выбор для романтических встреч в Ярославле.</p></div>
          </div>
        </>
      )}

      {citySlug === 'astrakhan' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Астрахани</h3>
          <p className="text-muted-foreground"><strong>Центр (возле Кремля, набережная Волги)</strong> — лучшие отели для туристов и деловых гостей. Цены: от 350₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта и вокзала</strong> — удобные почасовые номера для транзита. Цены: от 280₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Астрахани?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа — доступные варианты для всех бюджетов.</p></div>
            <div><h4 className="font-bold text-purple-900">Работают ли отели круглосуточно?</h4><p className="text-muted-foreground">Большинство объектов в каталоге работают круглосуточно. Уточняйте режим работы у конкретного владельца.</p></div>
          </div>
        </>
      )}

      {citySlug === 'orenburg' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Оренбурге</h3>
          <p className="text-muted-foreground"><strong>Центр (набережная Урала, пешеходный мост)</strong> — живописные отели в воротах из Европы в Азию. Цены: от 350₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта Центральный и вокзала</strong> — почасовые номера для транзитных гостей. Цены: от 280₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Оренбурге?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа — одни из наиболее доступных в Приволжском округе.</p></div>
            <div><h4 className="font-bold text-purple-900">Можно ли арендовать номер для деловой встречи?</h4><p className="text-muted-foreground">Да, ряд отелей в центре Оренбурга предлагают номера, удобные для переговоров и деловых встреч.</p></div>
          </div>
        </>
      )}

      {citySlug === 'novokuznetsk' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Новокузнецке</h3>
          <p className="text-muted-foreground"><strong>Центр (проспект Металлургов)</strong> — основные отели для деловых гостей Кузбасса. Цены: от 350₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта Спиченково и вокзала</strong> — удобные варианты для транзита. Цены: от 280₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Новокузнецке?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа. Доступные варианты в промышленном центре Кузбасса.</p></div>
            <div><h4 className="font-bold text-purple-900">Работают ли отели ночью?</h4><p className="text-muted-foreground">Многие объекты в каталоге работают круглосуточно — уточните режим при бронировании.</p></div>
          </div>
        </>
      )}

      {citySlug === 'tomsk' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Томске</h3>
          <p className="text-muted-foreground"><strong>Центр (проспект Ленина, набережная Томи)</strong> — студенческая столица Сибири с уютными отелями. Цены: от 350₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Университетский квартал</strong> — бюджетные варианты рядом с вузами. Цены: от 280₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта Богашево</strong> — почасовые номера для транзитных пассажиров. Цены: от 300₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Томске?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа — Томск один из самых доступных городов Сибири для почасовой аренды.</p></div>
            <div><h4 className="font-bold text-purple-900">Есть ли отели рядом с университетами?</h4><p className="text-muted-foreground">Да, в каталоге есть варианты вблизи Томского государственного университета и других вузов города.</p></div>
          </div>
        </>
      )}

      {citySlug === 'kemerovo' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Кемерово</h3>
          <p className="text-muted-foreground"><strong>Центр (Советский проспект, набережная Томи)</strong> — главные отели столицы Кузбасса. Цены: от 350₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта и вокзала</strong> — номера для транзитных гостей. Цены: от 280₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Кемерово?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа. Доступные варианты в столице Кузбасса.</p></div>
            <div><h4 className="font-bold text-purple-900">Можно ли снять номер без предоплаты?</h4><p className="text-muted-foreground">Условия оплаты устанавливает каждый владелец отдельно — уточняйте при бронировании.</p></div>
          </div>
        </>
      )}

      {citySlug === 'ryazan' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Рязани</h3>
          <p className="text-muted-foreground"><strong>Центр (возле Кремля, набережная Оки)</strong> — исторический центр с уютными отелями. Цены: от 350₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле вокзала Рязань-1</strong> — удобные номера для транзитных гостей из Москвы. Цены: от 280₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Рязани?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа — одни из самых доступных в Центральном федеральном округе.</p></div>
            <div><h4 className="font-bold text-purple-900">Есть ли отели с видом на Кремль?</h4><p className="text-muted-foreground">Да, в каталоге представлены варианты рядом с Рязанским Кремлём — идеально для туристов и романтических встреч.</p></div>
          </div>
        </>
      )}

      {citySlug === 'naberezhnye-chelny' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Набережных Челнах</h3>
          <p className="text-muted-foreground"><strong>Центр (проспект Мира, новый город)</strong> — современные отели в городе КАМАЗа. Цены: от 300₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Автозаводский район</strong> — бюджетные варианты рядом с промышленными предприятиями. Цены: от 250₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Набережных Челнах?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа. Один из доступных городов Татарстана для почасовой аренды.</p></div>
            <div><h4 className="font-bold text-purple-900">Работают ли отели круглосуточно?</h4><p className="text-muted-foreground">Большинство объектов в каталоге работают круглосуточно. Уточняйте режим работы у владельца.</p></div>
          </div>
        </>
      )}

      {citySlug === 'penza' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Пензе</h3>
          <p className="text-muted-foreground"><strong>Центр (улица Московская, набережная Суры)</strong> — уютные отели в сердце Поволжья. Цены: от 300₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле вокзала Пенза-1</strong> — номера для отдыха после дороги. Цены: от 260₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Пензе?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа — доступная почасовая аренда в Приволжском регионе.</p></div>
            <div><h4 className="font-bold text-purple-900">Как быстро можно забронировать номер?</h4><p className="text-muted-foreground">Свяжитесь с владельцем в Telegram или по телефону — большинство подтверждают бронирование в течение нескольких минут.</p></div>
          </div>
        </>
      )}

      {citySlug === 'cheboksary' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Чебоксарах</h3>
          <p className="text-muted-foreground"><strong>Центр (Чебоксарский залив, набережная)</strong> — живописные отели у воды в столице Чувашии. Цены: от 300₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта и вокзала</strong> — удобные номера для транзита. Цены: от 260₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Чебоксарах?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа. Доступная почасовая аренда в столице Чувашии.</p></div>
            <div><h4 className="font-bold text-purple-900">Есть ли номера с видом на залив?</h4><p className="text-muted-foreground">Да, в каталоге есть варианты рядом с Чебоксарским заливом — популярное место для романтических встреч.</p></div>
          </div>
        </>
      )}

      {citySlug === 'kaliningrad' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Калининграде</h3>
          <p className="text-muted-foreground"><strong>Остров Канта и исторический центр</strong> — европейская атмосфера бывшего Кёнигсберга. Цены: от 500₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Рыбный порт и набережная</strong> — живописные отели у воды, популярные для романтических встреч. Цены: от 450₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта Храброво</strong> — удобные номера для транзитных пассажиров. Цены: от 380₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Калининграде?</h4><p className="text-muted-foreground">Цены начинаются от 350₽ за 2 часа. Уникальный европейский город с богатым выбором отелей.</p></div>
            <div><h4 className="font-bold text-purple-900">Есть ли отели возле аэропорта Храброво?</h4><p className="text-muted-foreground">Да, в каталоге представлены отели с почасовой оплатой рядом с аэропортом — удобно для транзитных рейсов в Европу.</p></div>
          </div>
        </>
      )}

      {citySlug === 'belgorod' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Белгороде</h3>
          <p className="text-muted-foreground"><strong>Центр (Соборная площадь, проспект Гражданский)</strong> — отели в белом городе на юге России. Цены: от 300₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта и вокзала</strong> — номера для транзитных гостей. Цены: от 260₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Белгороде?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа — доступные варианты в Центральном федеральном округе.</p></div>
            <div><h4 className="font-bold text-purple-900">Работают ли отели ночью?</h4><p className="text-muted-foreground">Большинство объектов каталога работают круглосуточно. Режим работы уточняйте у владельца.</p></div>
          </div>
        </>
      )}

      {citySlug === 'tula' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Туле</h3>
          <p className="text-muted-foreground"><strong>Центр (возле Кремля, набережная Упы)</strong> — исторический центр оружейной столицы России. Цены: от 350₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле вокзала Тула-1</strong> — удобные номера для гостей из Москвы и других городов. Цены: от 280₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Туле?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа. Тула близко к Москве, поэтому популярна для коротких поездок.</p></div>
            <div><h4 className="font-bold text-purple-900">Есть ли отели в историческом центре Тулы?</h4><p className="text-muted-foreground">Да, в каталоге представлены отели рядом с Тульским Кремлём и Kremlin Park — отличный выбор для туристов.</p></div>
          </div>
        </>
      )}

      {citySlug === 'kursk' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Курске</h3>
          <p className="text-muted-foreground"><strong>Центр (Красная площадь, проспект Победы)</strong> — основные отели черноземного города. Цены: от 300₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта и вокзала</strong> — номера для транзитных гостей. Цены: от 260₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Курске?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа — доступная аренда в историческом городе.</p></div>
            <div><h4 className="font-bold text-purple-900">Можно ли снять номер без регистрации?</h4><p className="text-muted-foreground">Условия устанавливает каждый владелец. При краткосрочной аренде регистрация, как правило, не требуется — уточняйте при бронировании.</p></div>
          </div>
        </>
      )}

      {citySlug === 'bryansk' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Брянске</h3>
          <p className="text-muted-foreground"><strong>Центр (набережная Десны, площадь Партизан)</strong> — отели в городе-герое. Цены: от 300₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле вокзала Брянск-1</strong> — удобные номера для гостей. Цены: от 260₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Брянске?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа — одни из самых доступных в Центральной России.</p></div>
            <div><h4 className="font-bold text-purple-900">Как быстро можно заселиться?</h4><p className="text-muted-foreground">Большинство отелей принимают гостей в течение 15-30 минут после подтверждения бронирования.</p></div>
          </div>
        </>
      )}

      {citySlug === 'ulan-ude' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Улан-Удэ</h3>
          <p className="text-muted-foreground"><strong>Центр (площадь Советов, набережная Уды)</strong> — отели в столице Бурятии. Цены: от 300₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта Байкал и вокзала</strong> — номера для транзитных гостей на пути к Байкалу. Цены: от 270₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Улан-Удэ?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа. Удобная база для туристов, едущих на Байкал.</p></div>
            <div><h4 className="font-bold text-purple-900">Есть ли отели рядом с Байкалом?</h4><p className="text-muted-foreground">В Улан-Удэ есть отели с удобным доступом к Байкалу. Также можно найти варианты для отдыха между экскурсиями.</p></div>
          </div>
        </>
      )}

      {citySlug === 'tver' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Твери</h3>
          <p className="text-muted-foreground"><strong>Центр (набережная Волги, Путевой дворец)</strong> — отели в городе на полпути между Москвой и Петербургом. Цены: от 350₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле вокзала Тверь</strong> — популярное место для транзитных гостей. Цены: от 280₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Твери?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа. Тверь популярна у транзитных гостей между Москвой и СПб.</p></div>
            <div><h4 className="font-bold text-purple-900">Есть ли почасовые отели рядом с вокзалом?</h4><p className="text-muted-foreground">Да, в каталоге есть варианты рядом со станцией Тверь — удобно для транзитных пассажиров поезда Москва–Петербург.</p></div>
          </div>
        </>
      )}

      {citySlug === 'magnitogorsk' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Магнитогорске</h3>
          <p className="text-muted-foreground"><strong>Правый берег (центр)</strong> — административный центр с основными гостиницами. Цены: от 300₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Левый берег (промышленный)</strong> — бюджетные варианты рядом с ММК. Цены: от 260₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Магнитогорске?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа — доступная аренда в сталелитейной столице Урала.</p></div>
            <div><h4 className="font-bold text-purple-900">Есть ли отели возле аэропорта?</h4><p className="text-muted-foreground">Да, в каталоге представлены варианты рядом с аэропортом Магнитогорск для транзитных пассажиров.</p></div>
          </div>
        </>
      )}

      {citySlug === 'chita' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Чите</h3>
          <p className="text-muted-foreground"><strong>Центр (улица Ленина, площадь Ленина)</strong> — основные отели столицы Забайкалья. Цены: от 300₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта Кадала и вокзала</strong> — удобные номера для транзитных гостей. Цены: от 270₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Чите?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа. Доступная аренда в столице Забайкальского края.</p></div>
            <div><h4 className="font-bold text-purple-900">Работают ли отели круглосуточно?</h4><p className="text-muted-foreground">Большинство объектов каталога работают 24/7 — важно для гостей, приезжающих ночными рейсами и поездами.</p></div>
          </div>
        </>
      )}

      {citySlug === 'nizhniy-tagil' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Нижнем Тагиле</h3>
          <p className="text-muted-foreground"><strong>Центр (проспект Ленина)</strong> — основные гостиницы горнозаводского центра Урала. Цены: от 300₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле вокзала</strong> — удобные номера для гостей из Екатеринбурга и других городов. Цены: от 260₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Нижнем Тагиле?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа — доступная аренда в уральском промышленном городе.</p></div>
            <div><h4 className="font-bold text-purple-900">Как далеко Нижний Тагил от Екатеринбурга?</h4><p className="text-muted-foreground">Около 140 км. Многие гости приезжают в Нижний Тагил по деловым нуждам и арендуют номер на несколько часов.</p></div>
          </div>
        </>
      )}

      {citySlug === 'vologda' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Вологде</h3>
          <p className="text-muted-foreground"><strong>Центр (Кремль, Советский проспект)</strong> — кружевная столица России с атмосферными отелями. Цены: от 300₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле вокзала Вологда-1</strong> — удобные номера для транзитных гостей. Цены: от 260₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Вологде?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа — доступная аренда в северном городе России.</p></div>
            <div><h4 className="font-bold text-purple-900">Есть ли отели рядом с Вологодским Кремлём?</h4><p className="text-muted-foreground">Да, в каталоге представлены варианты в историческом центре Вологды — идеально для туристов и романтических встреч.</p></div>
          </div>
        </>
      )}

      {citySlug === 'arkhangelsk' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Архангельске</h3>
          <p className="text-muted-foreground"><strong>Центр (набережная Северной Двины, проспект Чумбарова-Лучинского)</strong> — отели у берегов главной северной реки. Цены: от 400₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта Талаги и вокзала</strong> — номера для транзитных гостей Арктики. Цены: от 320₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Архангельске?</h4><p className="text-muted-foreground">Цены начинаются от 300₽ за 2 часа. Ворота в Арктику с достойным выбором почасовых отелей.</p></div>
            <div><h4 className="font-bold text-purple-900">Есть ли отели с видом на Двину?</h4><p className="text-muted-foreground">Да, в каталоге представлены варианты на набережной Северной Двины — живописное место для романтических встреч.</p></div>
          </div>
        </>
      )}

      {citySlug === 'smolensk' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Смоленске</h3>
          <p className="text-muted-foreground"><strong>Центр (Крепостная стена, набережная Днепра)</strong> — исторический город-герой на западных рубежах. Цены: от 300₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле вокзала Смоленск</strong> — удобные номера на трассе Москва–Минск. Цены: от 260₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Смоленске?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа — доступная аренда в городе-герое Смоленске.</p></div>
            <div><h4 className="font-bold text-purple-900">Есть ли отели рядом со Смоленской крепостью?</h4><p className="text-muted-foreground">Да, в каталоге есть варианты вблизи знаменитых крепостных стен — атмосферное место для туристических остановок.</p></div>
          </div>
        </>
      )}

      {citySlug === 'saratov' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Саратове</h3>
          <p className="text-muted-foreground"><strong>Центр (проспект Кирова, набережная Волги)</strong> — главные отели крупного волжского города. Цены: от 350₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта Гагарин и вокзала</strong> — номера для транзитных гостей. Цены: от 280₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Саратове?</h4><p className="text-muted-foreground">Цены начинаются от 250₽ за 2 часа. Доступная аренда на берегу Волги.</p></div>
            <div><h4 className="font-bold text-purple-900">Есть ли отели с видом на Волгу?</h4><p className="text-muted-foreground">Да, в каталоге представлены варианты на набережной Волги — популярный выбор для романтических свиданий в Саратове.</p></div>
          </div>
        </>
      )}

      {citySlug === 'surgut' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Сургуте</h3>
          <p className="text-muted-foreground"><strong>Центр (набережная Оби, проспект Ленина)</strong> — современные отели нефтяной столицы Западной Сибири. Цены: от 500₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта Сургут</strong> — номера для транзитных нефтяников и деловых гостей. Цены: от 400₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Сургуте?</h4><p className="text-muted-foreground">Цены начинаются от 350₽ за 2 часа. Сургут — деловой центр, поэтому отели ориентированы на бизнес-гостей.</p></div>
            <div><h4 className="font-bold text-purple-900">Есть ли отели для деловых встреч?</h4><p className="text-muted-foreground">Да, в каталоге есть варианты с переговорными комнатами и деловой инфраструктурой — популярный выбор для нефтяной отрасли.</p></div>
          </div>
        </>
      )}

      {citySlug === 'stavropol' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Ставрополе</h3>
          <p className="text-muted-foreground"><strong>Центр (проспект Карла Маркса, площадь Ленина)</strong> — отели в столице Северного Кавказа. Цены: от 400₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта и вокзала</strong> — удобные номера для транзитных гостей. Цены: от 320₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Ставрополе?</h4><p className="text-muted-foreground">Цены начинаются от 300₽ за 2 часа. Ставрополь — воздушные ворота Кавказа с хорошим выбором отелей.</p></div>
            <div><h4 className="font-bold text-purple-900">Есть ли отели рядом с курортами КМВ?</h4><p className="text-muted-foreground">Да, от Ставрополя удобно добираться до Кисловодска, Пятигорска и Ессентуков. В каталоге есть варианты для транзита на курорты.</p></div>
          </div>
        </>
      )}
    </>
  );
}
