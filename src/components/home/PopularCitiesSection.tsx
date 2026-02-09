import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';

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

interface PopularCitiesSectionProps {
  allCities?: string[];
}

export default function PopularCitiesSection({ allCities = [] }: PopularCitiesSectionProps) {
  const [showAllCities, setShowAllCities] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [detectedCity, setDetectedCity] = useState<string | null>(null);

  useEffect(() => {
    detectUserCity();
  }, []);

  const detectUserCity = async () => {
    try {
      const cityData = await api.detectCity();
      if (cityData && cityData.detected && cityData.city) {
        console.log('City detected in PopularCitiesSection:', cityData.city);
        setDetectedCity(cityData.city);
      }
    } catch (error) {
      console.error('Failed to detect city:', error);
    }
  };

  const filteredCities = useMemo(() => {
    if (!searchQuery) return allCities;
    return allCities.filter(city => 
      city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allCities, searchQuery]);

  const sortedCities = useMemo(() => {
    const cities = [...filteredCities];
    if (detectedCity && cities.includes(detectedCity)) {
      return [detectedCity, ...cities.filter(c => c !== detectedCity)];
    }
    return cities;
  }, [filteredCities, detectedCity]);

  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Аренда на час в популярных городах
          </h2>
          <p className="text-gray-700 text-xl max-w-3xl mx-auto font-medium">
            Выберите ваш город и найдите идеальный отель с почасовой арендой. 
            Работаем по всей России без комиссий и скрытых платежей.
          </p>
        </motion.div>
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
        <motion.button
          onClick={() => setShowAllCities(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          <Icon name="Map" size={20} />
          Посмотреть все города ({allCities.length})
          <Icon name="ChevronRight" size={20} />
        </motion.button>
      </div>

      {/* Modal with all cities */}
      <AnimatePresence>
        {showAllCities && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAllCities(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold">Все города</h3>
                  <button
                    onClick={() => setShowAllCities(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <Icon name="X" size={24} />
                  </button>
                </div>
                <div className="relative">
                  <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300" />
                  <Input
                    type="text"
                    placeholder="Поиск города..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-purple-200 focus:bg-white/30"
                  />
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
                {sortedCities.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Icon name="MapPin" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Город не найден</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {sortedCities.map((city, index) => {
                      const isDetectedCity = city === detectedCity;
                      return (
                        <motion.div
                          key={city}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                        >
                          <Link
                            to={`/?city=${encodeURIComponent(city)}`}
                            onClick={() => setShowAllCities(false)}
                            className={`block p-4 rounded-xl border-2 transition-all hover:shadow-lg group ${
                              isDetectedCity
                                ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-400 shadow-md'
                                : 'bg-white border-gray-200 hover:border-purple-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${
                                  isDetectedCity 
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-purple-100 text-purple-600 group-hover:bg-purple-500 group-hover:text-white'
                                } transition-colors`}>
                                  <Icon name="MapPin" size={20} />
                                </div>
                                <div>
                                  <p className={`font-semibold ${
                                    isDetectedCity ? 'text-purple-700' : 'text-gray-900'
                                  }`}>
                                    {city}
                                  </p>
                                  {isDetectedCity && (
                                    <p className="text-xs text-purple-600 font-medium flex items-center gap-1 mt-0.5">
                                      <Icon name="MapPin" size={12} />
                                      Ваш город
                                    </p>
                                  )}
                                </div>
                              </div>
                              <Icon 
                                name="ChevronRight" 
                                size={20} 
                                className={`transition-transform group-hover:translate-x-1 ${
                                  isDetectedCity ? 'text-purple-500' : 'text-gray-400'
                                }`}
                              />
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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