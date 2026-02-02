import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

export default function Career() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Карьерный Рост
          </h1>
          <p className="text-xl text-muted-foreground">
            Прозрачная система развития и вознаграждений
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Ступень 1 - Копирайтер */}
          <Card className="border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center text-2xl font-bold">
                    1
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Копирайтер (Стажер)</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Первая ступень карьеры</p>
                  </div>
                </div>
                <Badge className="bg-purple-600 text-white text-lg px-4 py-2">
                  Старт за 3 дня
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Icon name="Target" size={20} className="text-purple-600" />
                      Задача
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                        <span>Добавить 200 объектов на сайт</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                        <span>Срок выполнения: 3 дня</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                        <span>Заполнение информации об объектах</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Icon name="Wallet" size={20} className="text-green-600" />
                      Вознаграждение
                    </h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        20 000 ₽
                      </div>
                      <p className="text-sm text-muted-foreground">
                        100 ₽ за каждый объект × 200 объектов
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Icon name="TrendingUp" size={18} className="text-purple-600" />
                    После успешного выполнения — переход на должность Менеджера
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ступень 2 - Менеджер */}
          <Card className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-cyan-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                    2
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Менеджер</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Работа с владельцами объектов</p>
                  </div>
                </div>
                <Badge className="bg-blue-600 text-white text-lg px-4 py-2">
                  15% от оборота
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Icon name="Briefcase" size={20} className="text-blue-600" />
                    Обязанности
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                      <span>Сопровождение 200-400 объектов</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                      <span>Привлечение владельцев к пополнению подписки</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                      <span>Консультации по объектам</span>
                    </li>
                  </ul>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Icon name="Calculator" size={18} className="text-blue-600" />
                      Пример: 200 объектов
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">200 объектов × 5000 ₽ = 1 000 000 ₽</p>
                      <p className="text-2xl font-bold text-blue-600">150 000 ₽</p>
                      <p className="text-xs text-muted-foreground">15% комиссия</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Icon name="TrendingUp" size={18} className="text-green-600" />
                      Пример: 400 объектов
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">400 объектов × 5000 ₽ = 2 000 000 ₽</p>
                      <p className="text-2xl font-bold text-green-600">300 000 ₽</p>
                      <p className="text-xs text-muted-foreground">15% комиссия</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ступень 3 - ОМ */}
          <Card className="border-2 border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-orange-100 to-yellow-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center text-2xl font-bold">
                    3
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Оперативный Менеджер (ОМ)</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Управление командой менеджеров</p>
                  </div>
                </div>
                <Badge className="bg-orange-600 text-white text-lg px-4 py-2">
                  5% от оборота команды
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Icon name="Users" size={20} className="text-orange-600" />
                    Зона ответственности
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                      <span>Управление до 30 менеджеров</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                      <span>Контроль выполнения планов</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                      <span>Обучение и развитие команды</span>
                    </li>
                  </ul>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Icon name="Calculator" size={18} className="text-orange-600" />
                      Средние показатели
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">15 менеджеров × 200 объектов × 5000 ₽</p>
                      <p className="text-muted-foreground">или</p>
                      <p className="text-muted-foreground">30 менеджеров × 100 объектов × 5000 ₽</p>
                      <p className="text-2xl font-bold text-orange-600 mt-2">600 000 ₽</p>
                      <p className="text-xs text-muted-foreground">5% комиссия</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Icon name="TrendingUp" size={18} className="text-green-600" />
                      Максимальная активность
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">30 менеджеров × 200 объектов × 5000 ₽</p>
                      <p className="text-2xl font-bold text-green-600 mt-2">1 500 000 ₽</p>
                      <p className="text-xs text-muted-foreground">5% комиссия от полной команды</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ступень 4 - УМ */}
          <Card className="border-2 border-red-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="bg-gradient-to-r from-red-100 to-rose-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center text-2xl font-bold">
                    4
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Управляющий Менеджер (УМ)</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Стратегическое управление</p>
                  </div>
                </div>
                <Badge className="bg-red-600 text-white text-lg px-4 py-2">
                  2% от оборота всех ОМ
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Icon name="Crown" size={20} className="text-red-600" />
                    Зона ответственности
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                      <span>Управление несколькими ОМ</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                      <span>Стратегическое планирование</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={18} className="text-green-600 mt-0.5" />
                      <span>Контроль всей структуры</span>
                    </li>
                  </ul>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Icon name="Calculator" size={18} className="text-red-600" />
                      Средние показатели
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">Совокупный оборот всех ОМ</p>
                      <p className="text-2xl font-bold text-red-600 mt-2">900 000 ₽</p>
                      <p className="text-xs text-muted-foreground">2% комиссия</p>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Icon name="TrendingUp" size={18} className="text-green-600" />
                      Максимальная активность
                    </h4>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">При полной загрузке всех ОМ</p>
                      <p className="text-2xl font-bold text-green-600 mt-2">2 400 000 ₽</p>
                      <p className="text-xs text-muted-foreground">2% комиссия</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Призыв к действию */}
          <Card className="border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="py-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold">Начните свой путь сегодня!</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Прозрачная система вознаграждений, быстрый карьерный рост и неограниченный потенциал заработка
                </p>
                <div className="flex gap-4 justify-center pt-4">
                  <Button size="lg" onClick={() => navigate('/admin/login')} className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <Icon name="Rocket" size={20} className="mr-2" />
                    Начать работу
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate('/')}>
                    <Icon name="Home" size={20} className="mr-2" />
                    На главную
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
