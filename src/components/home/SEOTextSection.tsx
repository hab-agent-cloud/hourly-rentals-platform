export default function SEOTextSection() {
  return (
    <div className="container mx-auto px-4 py-12 bg-white">
      <div className="max-w-4xl mx-auto prose prose-purple">
        <h1 className="text-3xl font-bold mb-6 text-purple-900">
          Аренда на час — отели и номера от 2 часов по всей России
        </h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>
            <strong>120 МИНУТ</strong> — сервис для <strong>аренды на час</strong> отелей и квартир 
            по всей России. <strong>Бронирование от 2 часов</strong> без переплат за полные сутки.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-purple-800">
            Как снять отель на час?
          </h3>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Выберите город и тип размещения</li>
            <li>Просмотрите объекты с ценами</li>
            <li>Свяжитесь с владельцем</li>
            <li>Забронируйте без переплат</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-purple-800">
            Преимущества
          </h3>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li><strong>Экономия</strong> — платите за нужное время</li>
            <li><strong>Без комиссий</strong> — прямое бронирование</li>
            <li><strong>Поддержка 24/7</strong> — 8 800 234-71-20</li>
          </ul>

          <h3 className="text-2xl font-semibold mt-8 mb-4 text-purple-800">
            Для кого подходит?
          </h3>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Деловые встречи</li>
            <li>Отдых между поездками</li>
            <li>Романтические свидания</li>
            <li>Дневной отдых</li>
          </ul>

          <p className="mt-6">
            <strong>Отель на час Москва</strong>, <strong>отель на час СПб</strong>, 
            <strong>гостиница на час</strong> — всё доступно на 120 МИНУТ.
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
