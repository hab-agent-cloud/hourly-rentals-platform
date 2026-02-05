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
import OwnersMessagesDialog from '@/components/manager/OwnersMessagesDialog';
import ManagerTasksList from '@/components/manager/ManagerTasksList';
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

export default function ManagerDashboard() {
  const [managerData, setManagerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('managerDarkMode') === 'true');
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

  useEffect(() => {
    localStorage.setItem('managerDarkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
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
    ...(isOM || isUM ? [{ id: 'team', icon: 'Users', label: 'Команда' }] : [])
  ];
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' 
        : 'bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50'
    }`}>
      <div className={`sticky top-0 z-50 backdrop-blur-md border-b shadow-sm ${
        darkMode 
          ? 'bg-gray-800/80 border-purple-700' 
          : 'bg-white/80 border-purple-200'
      }`}>
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <Icon name="User" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {managerData.name}
                </h1>
                <div className="flex items-center gap-2">
                  <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {isOM ? 'Опытный менеджер' : isUM ? 'Ведущий менеджер' : 'Менеджер'}
                  </span>
                  {managerData.subscription_active && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs rounded-full">
                      <Icon name="Zap" size={12} />
                      Premium
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className={darkMode ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'}
              >
                <Icon name={darkMode ? 'Sun' : 'Moon'} size={18} />
              </Button>
              <MessagesDialog managerId={adminId!} />
              <OwnersMessagesDialog managerId={adminId!} />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  navigate('/admin/login');
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Icon name="LogOut" size={18} />
                <span className="hidden sm:inline ml-2">Выход</span>
              </Button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 whitespace-nowrap transition-all duration-200
                  ${activeTab === tab.id 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105' 
                    : darkMode 
                      ? 'text-gray-300 hover:bg-purple-900 hover:text-purple-300' 
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                  }
                `}
              >
                <Icon name={tab.icon as any} size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              <ManagerStatsCards managerData={managerData} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="bg-white/90 backdrop-blur border-purple-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-900">
                      <Icon name="TrendingUp" size={20} />
                      Быстрые действия
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-3">
                    <Button 
                      onClick={() => setActiveTab('listings')}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                    >
                      <Icon name="Building2" size={18} className="mr-2" />
                      Объекты
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('finance')}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                    >
                      <Icon name="Wallet" size={18} className="mr-2" />
                      Финансы
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('tasks')}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                    >
                      <Icon name="CheckSquare" size={18} className="mr-2" />
                      Задачи
                    </Button>
                    <Button 
                      onClick={() => navigate('/sales-scripts')}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Icon name="MessageSquare" size={18} className="mr-2" />
                      Скрипты
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 backdrop-blur border-purple-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-purple-900">
                      <Icon name="Award" size={20} />
                      Достижения
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-2">
                          <Icon name="Trophy" size={24} className="text-yellow-600" />
                          <span className="font-medium text-gray-900">Объектов подключено</span>
                        </div>
                        <span className="text-2xl font-bold text-yellow-600">{managerData.total_listings || 0}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div className="flex items-center gap-2">
                          <Icon name="DollarSign" size={24} className="text-green-600" />
                          <span className="font-medium text-gray-900">Общий доход</span>
                        </div>
                        <span className="text-2xl font-bold text-green-600">{managerData.total_earned?.toFixed(0) || 0} ₽</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <ManagerListingsSection
              listings={managerData.listings || []}
              onFreeze={handleFreezeListing}
              onUnfreeze={handleUnfreezeListing}
            />
          )}

          {activeTab === 'finance' && (
            <ManagerCashSection
              balance={managerData.balance}
              pendingWithdrawals={managerData.pending_withdrawals}
              totalEarned={managerData.total_earned}
              onWithdraw={handleWithdraw}
              paymentHistory={paymentHistory}
            />
          )}

          {activeTab === 'tasks' && (
            <ManagerTasksList managerId={adminId!} />
          )}

          {activeTab === 'team' && (isOM || isUM) && (
            <div className="space-y-4">
              <ManageLimitsDialog />
              <TeamAnalytics />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}