import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function OMPortal() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <img 
            src="https://cdn.poehali.dev/projects/1a35ca30-983f-4a91-b0b4-3c6fa1c9a65b/files/67e411bb-a84a-41da-b7d3-5702e81761bb.jpg" 
            alt="120 минут" 
            className="h-20 w-20 sm:h-24 sm:w-24 object-contain mx-auto mb-4"
          />
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Добро пожаловать
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Выберите тип кабинета для входа
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          <Card 
            className="cursor-pointer hover:shadow-xl transition-all border-2 hover:border-purple-300 group"
            onClick={() => navigate('/owner/login')}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon name="Building" size={32} className="text-white" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Кабинет владельца</CardTitle>
              <CardDescription className="text-sm">
                Управление объектами и бронированиями
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Check" size={16} className="text-purple-600" />
                <span>Просмотр и редактирование объектов</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Check" size={16} className="text-purple-600" />
                <span>Управление бронированиями</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Check" size={16} className="text-purple-600" />
                <span>Статистика и аналитика</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Check" size={16} className="text-purple-600" />
                <span>Продвижение объектов</span>
              </div>
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                size="lg"
              >
                <Icon name="LogIn" size={18} className="mr-2" />
                Войти как владелец
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-xl transition-all border-2 hover:border-blue-300 group"
            onClick={() => navigate('/manager')}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon name="Users" size={32} className="text-white" />
              </div>
              <CardTitle className="text-xl sm:text-2xl">Кабинет менеджера</CardTitle>
              <CardDescription className="text-sm">
                Работа с клиентами и задачами
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Check" size={16} className="text-blue-600" />
                <span>Управление подписками</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Check" size={16} className="text-blue-600" />
                <span>Работа с клиентами</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Check" size={16} className="text-blue-600" />
                <span>Финансовая отчетность</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Check" size={16} className="text-blue-600" />
                <span>Задачи и аналитика</span>
              </div>
              <Button 
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                size="lg"
              >
                <Icon name="LogIn" size={18} className="mr-2" />
                Войти как менеджер
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            Вернуться на главную
          </Button>
        </div>
      </div>
    </div>
  );
}
