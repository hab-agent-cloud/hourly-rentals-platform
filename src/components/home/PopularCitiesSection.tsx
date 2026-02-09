import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { motion } from 'framer-motion';

interface PopularCity {
  name: string;
  slug: string;
  description: string;
  icon: string;
  gradient: string;
  objectsCount: string;
  minPrice: string;
}

const popularCities: PopularCity[] = [
  {
    name: 'Москва',
    slug: 'moskva',
    description: 'Столица России с более чем 150 отелями',
    icon: '🏛️',
    gradient: 'from-red-500 to-orange-500',
    objectsCount: '150+',
    minPrice: '500₽'
  },
  {
    name: 'Санкт-Петербург',
    slug: 'sankt-peterburg',
    description: 'Культурная столица с 100+ объектами',
    icon: '⚓',
    gradient: 'from-blue-500 to-cyan-500',
    objectsCount: '100+',
    minPrice: '450₽'
  },
  {
    name: 'Казань',
    slug: 'kazan',
    description: 'Столица Татарстана с 50+ отелями',
    icon: '🕌',
    gradient: 'from-green-500 to-emerald-500',
    objectsCount: '50+',
    minPrice: '400₽'
  },
  {
    name: 'Екатеринбург',
    slug: 'ekaterinburg',
    description: 'Столица Урала с 70+ объектами',
    icon: '⛰️',
    gradient: 'from-purple-500 to-pink-500',
    objectsCount: '70+',
    minPrice: '350₽'
  },
  {
    name: 'Новосибирск',
    slug: 'novosibirsk',
    description: 'Крупнейший город Сибири, 60+ отелей',
    icon: '🌲',
    gradient: 'from-indigo-500 to-blue-500',
    objectsCount: '60+',
    minPrice: '350₽'
  },
  {
    name: 'Нижний Новгород',
    slug: 'nizhnij-novgorod',
    description: 'Волжская жемчужина, 45+ объектов',
    icon: '🏰',
    gradient: 'from-amber-500 to-yellow-500',
    objectsCount: '45+',
    minPrice: '350₽'
  },
  {
    name: 'Краснодар',
    slug: 'krasnodar',
    description: 'Южная столица, 55+ отелей',
    icon: '🌴',
    gradient: 'from-orange-500 to-red-500',
    objectsCount: '55+',
    minPrice: '400₽'
  },
  {
    name: 'Сочи',
    slug: 'sochi',
    description: 'Курортный город, 80+ объектов',
    icon: '🏖️',
    gradient: 'from-cyan-500 to-teal-500',
    objectsCount: '80+',
    minPrice: '600₽'
  }
];

export default function PopularCitiesSection() {
  return (
    <div className="container mx-auto px-4 py-16 bg-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Аренда на час в популярных городах
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Выберите ваш город и найдите идеальный отель с почасовой арендой. 
          Работаем по всей России без комиссий и скрытых платежей.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {popularCities.map((city, index) => (
          <motion.div
            key={city.slug}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <Link to={`/city/${city.slug}`}>
              <div className="group relative bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-purple-100 hover:border-purple-300 h-full">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${city.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                
                <div className="relative z-10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`text-5xl mb-2 group-hover:scale-110 transition-transform`}>
                      {city.icon}
                    </div>
                    <Icon 
                      name="ArrowRight" 
                      size={24} 
                      className="text-purple-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" 
                    />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                    Аренда на час в {city.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {city.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-purple-100">
                    <div className="flex items-center gap-2">
                      <Icon name="Building2" size={16} className="text-purple-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        {city.objectsCount}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-500">от</span>
                      <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {city.minPrice}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Icon name="Map" size={20} />
            Посмотреть все города
            <Icon name="ChevronRight" size={20} />
          </motion.button>
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
          <p className="text-3xl font-bold text-blue-600 mb-1">3000+</p>
          <p className="text-sm text-gray-600">Объектов</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <p className="text-3xl font-bold text-green-600 mb-1">53</p>
          <p className="text-sm text-gray-600">Города</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <p className="text-3xl font-bold text-purple-600 mb-1">24/7</p>
          <p className="text-sm text-gray-600">Поддержка</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200">
          <p className="text-3xl font-bold text-amber-600 mb-1">0%</p>
          <p className="text-sm text-gray-600">Комиссия</p>
        </div>
      </div>
    </div>
  );
}
