export default function SEOTextSection() {
  return (
    <div className="container mx-auto px-4 py-12 bg-white">
      <div className="max-w-4xl mx-auto prose prose-purple">
        <h2 className="text-3xl font-bold mb-6 text-purple-900">
          Почасовая аренда отелей и номеров по России
        </h2>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            <strong>120 МИНУТ</strong> — современный сервис для <strong>почасовой аренды отелей</strong>, квартир, 
            а также уже скоро (стример номера, сауны, конференц залы, коворкинг и др.) во всех городах России. 
            Мы предлагаем удобное бронирование гостиниц на любое количество часов — от 1 часа и более, что идеально 
            подходит для краткосрочного отдыха, деловых встреч или остановки в пути.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-purple-800">
            Как снять отель на час или на несколько часов?
          </h3>
          <p>
            <strong>Снять отель на час</strong> или <strong>гостиницу на час</strong> — просто:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Выберите город и тип размещения</li>
            <li>Просмотрите доступные объекты с фотографиями и ценами</li>
            <li>Свяжитесь с владельцем по телефону или в Telegram</li>
            <li>Забронируйте <strong>номер на несколько часов</strong> без переплаты за сутки</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-purple-800">
            Преимущества почасовой аренды номеров
          </h3>
          <p>
            <strong>Аренда номера по часам</strong> имеет множество преимуществ:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Экономия</strong> — платите только за нужное время</li>
            <li><strong>Гибкость</strong> — <strong>снять номер на 2 часа</strong> или на 5 часов</li>
            <li><strong>Без комиссий</strong> — прямое бронирование у владельца</li>
            <li><strong>Проверенные объекты</strong> — все гостиницы проходят модерацию</li>
            <li><strong>Круглосуточная поддержка</strong> — бесплатная горячая линия 8 800 234-71-20</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-purple-800">
            Краткосрочная аренда отелей для бизнеса и отдыха
          </h3>
          <p>
            <strong>Краткосрочная аренда отеля</strong> подходит для:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Деловых встреч и переговоров</li>
            <li>Отдыха между рейсами или поездками</li>
            <li>Романтических свиданий</li>
            <li>Дневного отдыха или работы в тишине</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-purple-800">
            Популярные запросы: отель на час, гостиница на час
          </h3>
          <p>
            <strong>Отель на час Москва</strong>, <strong>отель на час СПб</strong>, 
            <strong>гостиница на час Москва</strong>, <strong>гостиница на час СПб</strong> — 
            самые популярные запросы пользователей. Наша платформа специализируется именно на таких предложениях.
          </p>
          
          <p className="mt-4">
            Также востребованы: <strong>отель на час Казань</strong>, <strong>отель на час Екатеринбург</strong>, 
            <strong>гостиница почасовая Москва</strong>, <strong>снять номер на час</strong>, 
            <strong>номер на 3 часа</strong>, <strong>номер на 4 часа</strong>. Все эти варианты 
            доступны на 120 МИНУТ с возможностью быстрого бронирования.
          </p>

          <p className="mt-6">
            <strong>Отель на час в Москве</strong>, <strong>гостиница на час в Москве</strong>, 
            <strong>почасовая аренда в СПб</strong>, <strong>почасовая аренда Санкт Петербург</strong> — 
            всё это доступно на платформе 120 МИНУТ. Выбирайте удобное время, бронируйте онлайн 
            и наслаждайтесь комфортом без переплат!
          </p>

          <div className="mt-10 p-8 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 rounded-2xl border-2 border-yellow-300 shadow-2xl relative overflow-hidden animate-pulse-slow">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            <div className="relative z-10">
              <p className="text-3xl font-bold text-white mb-3 drop-shadow-lg flex items-center gap-3">
                <span className="text-5xl">✨</span>
                <span>Больше 3000 объектов</span>
                <span className="text-5xl">✨</span>
              </p>
              <p className="text-xl font-semibold text-yellow-50 mt-2">
                по всей России
              </p>
              <p className="text-white/90 mt-3 text-lg">
                Начните пользоваться сервисом прямо сейчас!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}