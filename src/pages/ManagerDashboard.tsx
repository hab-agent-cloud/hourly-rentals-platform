import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import ManagerStatsCards from '@/components/manager/ManagerStatsCards';
import ManagerListingsSection from '@/components/manager/ManagerListingsSection';
import ManagerCashSection from '@/components/manager/ManagerCashSection';
import ManageLimitsDialog from '@/components/om/ManageLimitsDialog';
import TeamAnalytics from '@/components/om/TeamAnalytics';
import MessagesDialog from '@/components/manager/MessagesDialog';
import ManagerTasksList from '@/components/manager/ManagerTasksList';

const FUNC_URLS = {
  managerData: 'https://functions.poehali.dev/ccbc7231-4004-46e0-9caa-8afc6d0fa9db',
  managerOperations: 'https://functions.poehali.dev/6c4f7ec8-42fb-47e5-9187-fcc55e47eceb',
  managerSubscription: 'https://functions.poehali.dev/e4343b5f-706a-45d1-b658-8fe3cb25e2e7',
  withdrawalRequest: 'https://functions.poehali.dev/39662dfc-8b4b-447a-a9ff-8ea20ae47e09',
  paymentHistory: 'https://functions.poehali.dev/e3d0194a-0a92-4570-ad62-6c0a6308045b'
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
  const [paymentHistory, setPaymentHistory] = useState<any>(null);
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
      fetchPaymentHistory();
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
  
  const fetchPaymentHistory = async () => {
    try {
      const response = await fetch(`${FUNC_URLS.paymentHistory}?manager_id=${adminId}`);
      const data = await response.json();
      setPaymentHistory(data);
    } catch (error) {
      console.error('[PAYMENT HISTORY] Ошибка:', error);
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
  
  const handleWithdraw = async (
    withdrawAmount: string,
    withdrawMethod: 'sbp' | 'card' | 'salary',
    withdrawData: { phone: string; cardNumber: string; recipientName: string; bankName: string }
  ) => {
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
    
    try {
      const response = await fetch(FUNC_URLS.withdrawalRequest, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manager_id: adminId,
          amount,
          withdrawal_method: withdrawMethod,
          phone: withdrawData.phone,
          card_number: withdrawData.cardNumber,
          recipient_name: withdrawData.recipientName,
          bank_name: withdrawData.bankName
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        const methodNames = {
          sbp: 'СБП',
          card: 'банковскую карту',
          salary: 'зарплатную карту'
        };
        
        toast({
          title: 'Заявка создана',
          description: `Заявка на вывод ${amount} ₽ через ${methodNames[withdrawMethod]} отправлена на рассмотрение`,
        });
        
        fetchManagerData();
        fetchPaymentHistory();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось создать заявку',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при отправке заявки',
        variant: 'destructive'
      });
    }
  };
  
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
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-background">
      <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 bg-white rounded-xl shadow-sm border">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Личный кабинет менеджера</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">{managerData.name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => navigate('/sales-scripts')}>
            <Icon name="FileText" size={16} className="sm:mr-2" />
            <span className="hidden sm:inline">Скрипты</span>
          </Button>
          <MessagesDialog 
            adminId={adminId!} 
            role={managerData.role === 'operational_manager' ? 'om' : managerData.role === 'unit_manager' ? 'um' : 'manager'} 
          />
          {managerData.role === 'operational_manager' && (
            <ManageLimitsDialog omId={adminId!} onSuccess={fetchManagerData} />
          )}
          <Button size="sm" onClick={() => navigate('/career')}>
            <Icon name="TrendingUp" size={16} className="sm:mr-2" />
            <span className="hidden sm:inline">Карьера</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
          }}>
            <Icon name="LogOut" size={16} className="sm:mr-2" />
            <span className="hidden sm:inline">Выйти</span>
          </Button>
        </div>
      </div>
      
      <ManagerStatsCards 
        managerData={managerData}
        onWithdraw={handleWithdraw}
      />

      {managerData.tasks && managerData.tasks.length > 0 && (
        <ManagerTasksList 
          tasks={managerData.tasks}
          managerId={adminId!}
          onTaskCompleted={fetchManagerData}
        />
      )}
      
      <ManagerListingsSection 
        managerData={managerData}
        adminId={adminId!}
        onFreezeListing={handleFreezeListing}
        onUnfreezeListing={handleUnfreezeListing}
        onRefresh={fetchManagerData}
      />
      
      <ManagerCashSection 
        paymentHistory={paymentHistory}
      />
      
      {managerData.role === 'operational_manager' && managerData.managers && (
        <TeamAnalytics 
          managers={managerData.managers}
          monthCommission={managerData.month_commission || 0}
        />
      )}
      
      {(managerData.om_name || managerData.um_name) && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Users" size={20} />
              Моя команда
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {managerData.om_name && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="User" size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Оперативный менеджер</div>
                  <div className="font-semibold">{managerData.om_name}</div>
                </div>
              </div>
            )}
            {managerData.um_name && (
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center flex-shrink-0">
                  <Icon name="Crown" size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Управляющий менеджер</div>
                  <div className="font-semibold">{managerData.um_name}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}