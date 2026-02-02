import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'sbp' | 'card' | 'salary'>('sbp');
  const [withdrawData, setWithdrawData] = useState({
    phone: '',
    cardNumber: '',
    recipientName: '',
    bankName: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
      console.log('[MANAGER] Загрузка данных для admin_id:', adminId);
      const response = await fetch(`${FUNC_URLS.managerData}?admin_id=${adminId}`);
      console.log('[MANAGER] Ответ получен, status:', response.status);
      const data = await response.json();
      console.log('[MANAGER] Данные получены:', data);
      setManagerData(data);
    } catch (error) {
      console.error('[MANAGER] Ошибка загрузки данных:', error);
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
        toast({
          title: 'Успешно',
          description: 'Объект заморожен'
        });
        fetchManagerData();
      } else {
        const error = await response.json();
        toast({
          title: 'Ошибка',
          description: error.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleUnfreezeListing = async (listingId: number) => {
    try {
      const response = await fetch(FUNC_URLS.managerOperations, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unfreeze',
          manager_id: adminId,
          listing_id: listingId,
          reason: 'Разморозка через интерфейс'
        })
      });
      
      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Объект разморожен и опубликован'
        });
        fetchManagerData();
      } else {
        const error = await response.json();
        toast({
          title: 'Ошибка',
          description: error.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Ошибка',
        description: 'Введите корректную сумму',
        variant: 'destructive'
      });
      return;
    }
    
    if (amount > managerData.balance) {
      toast({
        title: 'Ошибка',
        description: 'Недостаточно средств на балансе',
        variant: 'destructive'
      });
      return;
    }
    
    if (withdrawMethod === 'sbp') {
      if (!withdrawData.phone || !withdrawData.cardNumber || !withdrawData.recipientName) {
        toast({
          title: 'Ошибка',
          description: 'Заполните все поля для СБП',
          variant: 'destructive'
        });
        return;
      }
    } else if (withdrawMethod === 'card') {
      if (!withdrawData.cardNumber || !withdrawData.recipientName || !withdrawData.bankName) {
        toast({
          title: 'Ошибка',
          description: 'Заполните все поля для банковской карты',
          variant: 'destructive'
        });
        return;
      }
    } else if (withdrawMethod === 'salary') {
      if (!withdrawData.cardNumber) {
        toast({
          title: 'Ошибка',
          description: 'Укажите номер зарплатной карты',
          variant: 'destructive'
        });
        return;
      }
    }
    
    const methodNames = {
      sbp: 'СБП',
      card: 'банковскую карту',
      salary: 'зарплатную карту'
    };
    
    toast({
      title: 'Заявка создана',
      description: `Заявка на вывод ${amount} ₽ через ${methodNames[withdrawMethod]} отправлена на рассмотрение`,
    });
    
    setWithdrawAmount('');
    setWithdrawData({ phone: '', cardNumber: '', recipientName: '', bankName: '' });
    setWithdrawDialogOpen(false);
  };
  
  const filteredListings = managerData?.listings?.filter((listing: any) => {
    const query = searchQuery.toLowerCase();
    return listing.name?.toLowerCase().includes(query) || 
           listing.district?.toLowerCase().includes(query);
  }) || [];
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4" />
        <p>Загрузка данных менеджера...</p>
      </div>
    </div>;
  }
  
  if (!managerData) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-destructive" />
        <p className="text-lg font-semibold">Ошибка загрузки данных</p>
        <p className="text-sm text-muted-foreground mt-2">Проверьте консоль для деталей</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Перезагрузить
        </Button>
      </div>
    </div>;
  }
  
  console.log('[MANAGER] Отображаем данные:', {
    role: managerData.role,
    listings: managerData.listings?.length,
    tasks: managerData.tasks?.length,
    om_name: managerData.om_name,
    um_name: managerData.um_name
  });
  
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
            <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full mt-3" variant="outline">
                  <Icon name="ArrowDownToLine" size={14} className="mr-1" />
                  Вывести
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Вывод средств</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Доступно: {managerData.balance} ₽</Label>
                    <Input
                      type="number"
                      placeholder="Введите сумму"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      min="0"
                      max={managerData.balance}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Способ вывода</Label>
                    <RadioGroup value={withdrawMethod} onValueChange={(v) => setWithdrawMethod(v as any)}>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="sbp" id="sbp" />
                        <Label htmlFor="sbp" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Icon name="Smartphone" size={18} />
                            <span className="font-medium">СБП</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Быстрый перевод по номеру телефона</p>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Icon name="CreditCard" size={18} />
                            <span className="font-medium">Банковская карта</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Перевод на карту любого банка</p>
                        </Label>
                      </div>
                      
                      <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                        <RadioGroupItem value="salary" id="salary" />
                        <Label htmlFor="salary" className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Icon name="Briefcase" size={18} />
                            <span className="font-medium">Зарплатная карта</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Корпоративная карта компании</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {withdrawMethod === 'sbp' && (
                    <div className="space-y-3 p-3 border rounded-lg bg-accent/50">
                      <div>
                        <Label className="text-sm mb-1 block">Номер телефона</Label>
                        <Input
                          type="tel"
                          placeholder="+7 900 123-45-67"
                          value={withdrawData.phone}
                          onChange={(e) => setWithdrawData({ ...withdrawData, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-sm mb-1 block">Номер карты</Label>
                        <Input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={withdrawData.cardNumber}
                          onChange={(e) => setWithdrawData({ ...withdrawData, cardNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-sm mb-1 block">Имя получателя</Label>
                        <Input
                          type="text"
                          placeholder="Иван Иванов"
                          value={withdrawData.recipientName}
                          onChange={(e) => setWithdrawData({ ...withdrawData, recipientName: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                  
                  {withdrawMethod === 'card' && (
                    <div className="space-y-3 p-3 border rounded-lg bg-accent/50">
                      <div>
                        <Label className="text-sm mb-1 block">Номер банковской карты</Label>
                        <Input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={withdrawData.cardNumber}
                          onChange={(e) => setWithdrawData({ ...withdrawData, cardNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-sm mb-1 block">Имя и фамилия</Label>
                        <Input
                          type="text"
                          placeholder="Иван Иванов"
                          value={withdrawData.recipientName}
                          onChange={(e) => setWithdrawData({ ...withdrawData, recipientName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label className="text-sm mb-1 block">Наименование банка</Label>
                        <Input
                          type="text"
                          placeholder="Сбербанк"
                          value={withdrawData.bankName}
                          onChange={(e) => setWithdrawData({ ...withdrawData, bankName: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                  
                  {withdrawMethod === 'salary' && (
                    <div className="space-y-3 p-3 border rounded-lg bg-accent/50">
                      <div>
                        <Label className="text-sm mb-1 block">Номер зарплатной карты</Label>
                        <Input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={withdrawData.cardNumber}
                          onChange={(e) => setWithdrawData({ ...withdrawData, cardNumber: e.target.value })}
                        />
                        <p className="text-xs text-muted-foreground mt-1">Корпоративная карта будет сохранена в вашем профиле</p>
                      </div>
                    </div>
                  )}
                  
                  <Button onClick={handleWithdraw} className="w-full">
                    <Icon name="Check" size={16} className="mr-2" />
                    Вывести {withdrawAmount ? `${withdrawAmount} ₽` : 'сумму'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
          <div className="flex items-center justify-between">
            <CardTitle>Мои объекты ({managerData.listings?.length || 0})</CardTitle>
            <div className="relative w-64">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по адресу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredListings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Building" size={48} className="mx-auto mb-4 opacity-50" />
              <p>{searchQuery ? 'Объекты не найдены' : 'У вас пока нет объектов в сопровождении'}</p>
              <p className="text-sm mt-2">{searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Возьмите объект из списка свободных'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredListings.map((listing: any) => (
                <div 
                  key={listing.id}
                  className={`border rounded-lg p-4 ${
                    listing.urgency === 'critical' ? 'border-red-500 bg-red-50' :
                    listing.urgency === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    'border-border'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {listing.photo && (
                      <img 
                        src={listing.photo} 
                        alt={listing.name}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <a 
                          href={`/?listing=${listing.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-semibold hover:text-primary underline-offset-2 hover:underline"
                        >
                          {listing.name}
                        </a>
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
                      {listing.district && (
                        <p className="text-sm text-muted-foreground mt-1">
                          📍 {listing.district}
                        </p>
                      )}
                      {listing.subscription_end && (
                        <p className="text-sm mt-1">
                          Подписка до: {new Date(listing.subscription_end).toLocaleDateString()}
                        </p>
                      )}
                      <div className="flex gap-2 mt-3">
                        {listing.status === 'active' ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleFreezeListing(listing.id)}
                          >
                            <Icon name="Snowflake" size={16} className="mr-1" />
                            Заморозить
                          </Button>
                        ) : listing.status === 'frozen' ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUnfreezeListing(listing.id)}
                          >
                            <Icon name="Flame" size={16} className="mr-1" />
                            Разморозить
                          </Button>
                        ) : null}
                        <Button size="sm" variant="outline">
                          <Icon name="Edit" size={16} className="mr-1" />
                          Редактировать
                        </Button>
                      </div>
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