import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import ManagerStatsCards from '@/components/manager/ManagerStatsCards';
import ManagerListingsSection from '@/components/manager/ManagerListingsSection';
import ManagerCashSection from '@/components/manager/ManagerCashSection';

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
    <div className="container mx-auto p-6 space-y-6">
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
      
      <ManagerStatsCards 
        managerData={managerData}
        onWithdraw={handleWithdraw}
      />
      
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