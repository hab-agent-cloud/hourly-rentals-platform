export default function CitySEOMillionCities({ citySlug }: { citySlug: string }) {
  return (
    <>
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
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Самаре?</h4><p className="text-muted-foreground">Цены на почасовую аренду в Самаре начинаются от 350₽ за 2 часа. В центре города и на набережной цены выше — от 600₽ за 2 часа.</p></div>
            <div><h4 className="font-bold text-purple-900">Есть ли отели с почасовой оплатой возле аэропорта Курумоч?</h4><p className="text-muted-foreground">Да, в каталоге представлены отели возле аэропорта Курумоч с почасовой оплатой. Это удобно для транзитных пассажиров и тех, кто прилетает рано утром или поздно вечером.</p></div>
            <div><h4 className="font-bold text-purple-900">Какой минимальный срок аренды?</h4><p className="text-muted-foreground">Минимальный срок аренды в большинстве отелей Самары — 2 часа. Можно продлить время пребывания по договоренности с владельцем.</p></div>
            <div><h4 className="font-bold text-purple-900">Можно ли арендовать номер с видом на Волгу?</h4><p className="text-muted-foreground">Да, на платформе представлены отели с видом на Волгу. Они особенно популярны для романтических встреч и отдыха. Цены начинаются от 550₽ за 2 часа.</p></div>
          </div>
        </>
      )}

      {citySlug === 'ekaterinburg' && (
        <>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Популярные районы для почасовой аренды в Екатеринбурге</h3>
          <p className="text-muted-foreground"><strong>Центр города (площадь 1905 года, Плотинка)</strong> — отели для деловых встреч и туристов. Цены: от 550₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Возле аэропорта Кольцово</strong> — отели с почасовой оплатой для транзитных пассажиров. Цены: от 350₽ за 2 часа.</p>
          <p className="text-muted-foreground"><strong>Улица Вайнера</strong> — туристический центр с множеством отелей. Цены: от 500₽ за 2 часа.</p>
          <h3 className="text-xl font-bold text-purple-900 mt-8">Часто задаваемые вопросы</h3>
          <div className="space-y-4">
            <div><h4 className="font-bold text-purple-900">Сколько стоит снять номер на час в Екатеринбурге?</h4><p className="text-muted-foreground">Цены на почасовую аренду в Екатеринбурге начинаются от 350₽ за 2 часа. В центре города цены выше — от 550₽ за 2 часа.</p></div>
            <div><h4 className="font-bold text-purple-900">Какой минимальный срок аренды?</h4><p className="text-muted-foreground">Минимальный срок аренды в отелях Екатеринбурга — 2 часа. Можно продлить время пребывания по договоренности с владельцем.</p></div>
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
          <p className="text-muted-foreground"><strong>Возле вокзала и автостанции</strong> — удобные номера для транзитных гостей. Цены: от 260₽ за 2 часа.</p>
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
    </>
  );
}
