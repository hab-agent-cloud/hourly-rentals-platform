import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const FUNC_URLS = {
  managerData: 'https://functions.poehali.dev/ccbc7231-4004-46e0-9caa-8afc6d0fa9db',
  managerOperations: 'https://functions.poehali.dev/6c4f7ec8-42fb-47e5-9187-fcc55e47eceb',
  managerSubscription: 'https://functions.poehali.dev/e4343b5f-706a-45d1-b658-8fe3cb25e2e7'
};

function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default function ManagerDashboard() {
  const [managerData, setManagerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<number | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    const decoded = decodeJWT(token);
    if (decoded?.admin_id) {
      setAdminId(decoded.admin_id);
    } else {
      navigate('/admin/login');
    }
  }, []);
  
  useEffect(() => {
    if (adminId) {
      fetchManagerData();
    }
  }, [adminId]);
  
  const fetchManagerData = async () => {
    try {
      const response = await fetch(`${FUNC_URLS.managerData}?admin_id=${adminId}`);
      const data = await response.json();
      setManagerData(data);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTakeListing = async (listingId: number) => {
    try {
      const response = await fetch(FUNC_URLS.managerOperations, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'take',
          manager_id: adminId,
          listing_id: listingId
        })
      });
      
      if (response.ok) {
        alert('Объект взят в сопровождение!');
        fetchManagerData();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleFreezeListing = async (listingId: number) => {
    try {
      const response = await fetch(FUNC_URLS.managerOperations, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'freeze',
          manager_id: adminId,
          listing_id: listingId,
          reason: 'Заморозка через интерфейс'
        })
      });
      
      if (response.ok) {
        alert('Объект заморожен!');
        fetchManagerData();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Загрузка...</div>;
  }
  
  if (!managerData) {
    return <div className="flex items-center justify-center h-screen">Ошибка загрузки данных</div>;
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Шапка */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Личный кабинет менеджера</h1>
          <p className="text-muted-foreground mt-1">{managerData.name}</p>
        </div>
        <Button>
          <Icon name="Briefcase" size={18} className="mr-2" />
          Карьера
        </Button>
      </div>
      
      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Баланс
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managerData.balance || 0} ₽</div>
            <p className="text-xs text-muted-foreground mt-1">
              За месяц: +{managerData.month_commission || 0} ₽
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Объектов
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {managerData.objects_count || 0} / {managerData.object_limit}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Уровень: {getLevelEmoji(managerData.manager_level)} {getLevelName(managerData.manager_level)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Комиссия
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managerData.commission_percent}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              От подписок и продвижений
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Предупреждения
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {managerData.warnings_count} / 3
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {managerData.warnings_count === 0 ? 'Всё отлично!' : 'Будьте осторожны'}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Список объектов */}
      <Card>
        <CardHeader>
          <CardTitle>Мои объекты ({managerData.listings?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {!managerData.listings || managerData.listings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Building" size={48} className="mx-auto mb-4 opacity-50" />
              <p>У вас пока нет объектов в сопровождении</p>
              <p className="text-sm mt-2">Возьмите объект из списка свободных</p>
            </div>
          ) : (
            <div className="space-y-3">
              {managerData.listings.map((listing: any) => (
                <div 
                  key={listing.id}
                  className={`border rounded-lg p-4 ${
                    listing.urgency === 'critical' ? 'border-red-500 bg-red-50' :
                    listing.urgency === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    'border-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{listing.name}</h3>
                        <Badge variant={listing.status === 'frozen' ? 'secondary' : 'default'}>
                          {listing.status === 'frozen' ? '🧊 Заморожен' : '✅ Активен'}
                        </Badge>
                        {listing.urgency === 'critical' && (
                          <Badge variant="destructive">🔴 Критично!</Badge>
                        )}
                        {listing.urgency === 'warning' && (
                          <Badge variant="outline" className="border-yellow-600 text-yellow-700">
                            🟡 Скоро истечёт
                          </Badge>
                        )}
                        {listing.no_payments && (
                          <Badge variant="outline" className="border-blue-600 text-blue-700">
                            🆕 Нет пополнений
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{listing.district}</p>
                      {listing.subscription_end && (
                        <p className="text-sm mt-1">
                          Подписка до: {new Date(listing.subscription_end).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {listing.status === 'active' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleFreezeListing(listing.id)}
                        >
                          <Icon name="Snowflake" size={16} className="mr-1" />
                          Заморозить
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Icon name="Edit" size={16} className="mr-1" />
                        Редактировать
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Задачи от ОМ */}
      {managerData.tasks && managerData.tasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Задачи от ОМ ({managerData.tasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {managerData.tasks.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    {task.deadline && (
                      <p className="text-xs text-muted-foreground mt-1">
                        До: {new Date(task.deadline).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button size="sm">
                    <Icon name="Check" size={16} className="mr-1" />
                    Выполнено
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Информация о иерархии */}
      {(managerData.om_name || managerData.um_name) && (
        <Card>
          <CardHeader>
            <CardTitle>Моя команда</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {managerData.om_name && (
              <div className="flex items-center gap-2">
                <Icon name="User" size={18} />
                <span className="text-sm">Оперативный менеджер: <strong>{managerData.om_name}</strong></span>
              </div>
            )}
            {managerData.um_name && (
              <div className="flex items-center gap-2">
                <Icon name="Crown" size={18} />
                <span className="text-sm">Управляющий менеджер: <strong>{managerData.um_name}</strong></span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function getLevelEmoji(level: string) {
  switch(level) {
    case 'bronze': return '🥉';
    case 'silver': return '🥈';
    case 'gold': return '🥇';
    case 'platinum': return '💎';
    default: return '🥉';
  }
}

function getLevelName(level: string) {
  switch(level) {
    case 'bronze': return 'Бронзовый';
    case 'silver': return 'Серебряный';
    case 'gold': return 'Золотой';
    case 'platinum': return 'Платиновый';
    default: return 'Бронзовый';
  }
}