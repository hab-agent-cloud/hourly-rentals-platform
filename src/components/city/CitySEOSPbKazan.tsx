export default function CitySEOSPbKazan({ citySlug }: { citySlug: string }) {
  return (
    <>
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
                Минимальный срок аренды в большинстве отелей Казани — 2 часа. Можно продлить время пребывания 
                по договоренности с владельцем.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
