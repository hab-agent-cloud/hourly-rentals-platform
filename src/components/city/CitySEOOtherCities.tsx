export default function CitySEOOtherCities({ citySlug }: { citySlug: string }) {
  return (
    <>
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
