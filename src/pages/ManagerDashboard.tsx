import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import ManagerDashboardHeader from '@/components/manager/ManagerDashboardHeader';
import ManagerDashboardOverview from '@/components/manager/ManagerDashboardOverview';
import ManagerDashboardContent from '@/components/manager/ManagerDashboardContent';
import { motion } from 'framer-motion';

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

interface ManagerData {
  name: string;
  role: string;
  level?: string;
  objects_count?: number;
  object_limit?: number;
  balance: number;
  month_commission?: number;
  total_owner_payments?: number;
  subscription_active?: boolean;
  total_objects?: number;
  week_tasks_completed?: number;
  om_rank?: number | string;
  manager_rank?: number | string;
  total_listings?: number;
  total_earned?: number;
  pending_withdrawals?: number;
}

interface PaymentHistory {
  payments?: Array<Record<string, unknown>>;
}

export default function ManagerDashboard() {
  const [managerData, setManagerData] = useState<ManagerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('managerDarkMode') === 'true');
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
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
  }, [navigate]);
  
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

  useEffect(() => {
    if (adminId) {
      fetchManagerData();
      fetchPaymentHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminId]);

  useEffect(() => {
    localStorage.setItem('managerDarkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    await Promise.all([fetchManagerData(), fetchPaymentHistory()]);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchEndY.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = () => {
    if (window.scrollY === 0) {
      const pullDistance = touchEndY.current - touchStartY.current;
      if (pullDistance > 100) {
        handleRefresh();
      }
    }
    touchStartY.current = 0;
    touchEndY.current = 0;
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-lg font-medium text-purple-900">Загрузка данных менеджера...</p>
        </motion.div>
      </div>
    );
  }
  
  if (!managerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200 bg-white/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <Icon name="AlertCircle" size={24} />
              Ошибка загрузки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">Не удалось загрузить данные менеджера</p>
            <Button onClick={() => navigate('/admin/login')} className="w-full">
              Вернуться к входу
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const isOM = managerData.role === 'om';
  const isUM = managerData.role === 'um';

  const tabs = [
    { id: 'overview', icon: 'LayoutDashboard', label: 'Обзор' },
    { id: 'listings', icon: 'Building2', label: 'Объекты' },
    { id: 'finance', icon: 'Wallet', label: 'Финансы' },
    { id: 'tasks', icon: 'CheckSquare', label: 'Задачи' },
    { id: 'reviews', icon: 'MessageSquare', label: 'Отзывы' },
    ...(isOM || isUM ? [{ id: 'team', icon: 'Users', label: 'Команда' }] : [])
  ];
  
  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
          : 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50'
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <ManagerDashboardHeader
        managerData={managerData}
        adminId={adminId!}
        darkMode={darkMode}
        activeTab={activeTab}
        tabs={tabs}
        refreshing={refreshing}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
        onLogout={() => {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }}
        onTabChange={setActiveTab}
      />

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {activeTab === 'overview' ? (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ManagerDashboardOverview
              managerData={managerData}
              darkMode={darkMode}
              onWithdraw={handleWithdraw}
              onBalanceUpdate={fetchManagerData}
              onTabChange={setActiveTab}
              onNavigate={navigate}
            />
          </motion.div>
        ) : (
          <ManagerDashboardContent
            activeTab={activeTab}
            managerData={managerData}
            adminId={adminId!}
            paymentHistory={paymentHistory}
            onFreezeListing={handleFreezeListing}
            onUnfreezeListing={handleUnfreezeListing}
            onRefresh={fetchManagerData}
            onWithdraw={handleWithdraw}
          />
        )}
      </div>
    </div>
  );
}