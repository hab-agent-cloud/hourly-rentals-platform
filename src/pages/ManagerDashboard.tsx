import { useState, useEffect, useRef } from 'react';
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
import ManagerLevelCard from '@/components/manager/ManagerLevelCard';
import AchievementsPanel from '@/components/manager/AchievementsPanel';
import ManagerReviewsSection from '@/components/manager/ManagerReviewsSection';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

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
      {refreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-4 py-2 rounded-full shadow-lg flex items-center gap-2 ${
              darkMode ? 'bg-purple-800 text-purple-200' : 'bg-white text-purple-600'
            }`}
          >
            <Icon name="RefreshCw" size={16} className="animate-spin" />
            Обновление...
          </motion.div>
        </div>
      )}

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
              <ManagerLevelCard 
                level={managerData.level || 'bronze'}
                objectsCount={managerData.objects_count || 0}
                objectLimit={managerData.object_limit || 200}
                balance={managerData.balance || 0}
              />
              
              <AchievementsPanel 
                objectsCount={managerData.objects_count || 0}
                balance={managerData.balance || 0}
                monthCommission={managerData.month_commission || 0}
                totalOwnerPayments={managerData.total_owner_payments || 0}
                onBalanceUpdate={fetchManagerData}
              />
              
              <ManagerStatsCards managerData={managerData} onWithdraw={handleWithdraw} />
              
              {!isUM && (
                <Card className={`shadow-lg border-2 overflow-hidden ${
                  darkMode 
                    ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-700' 
                    : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300'
                }`}>
                  <CardHeader className="relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
                    <CardTitle className={`flex items-center gap-2 relative z-10 ${darkMode ? 'text-purple-300' : 'text-purple-900'}`}>
                      <Icon name="BarChart3" size={20} />
                      {isOM ? 'Статистика команды' : 'Статистика активности'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <motion.div 
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        onClick={() => {
                          const count = isOM ? (managerData.total_objects || 0) : (managerData.objects_count || 0);
                          if (count >= 3) {
                            confetti({
                              particleCount: 60,
                              spread: 50,
                              origin: { y: 0.6 },
                              colors: ['#3B82F6', '#06B6D4']
                            });
                          }
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          darkMode 
                            ? 'bg-blue-900/30 border-blue-700 hover:border-blue-500' 
                            : 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300 hover:border-blue-500 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            darkMode ? 'bg-blue-800' : 'bg-blue-500'
                          } shadow-lg`}>
                            <Icon name="Building2" size={24} className="text-white" />
                          </div>
                          <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {isOM ? 'Команда' : 'В работе'}
                            </p>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                              {isOM ? (managerData.total_objects || 0) : (managerData.objects_count || 0)}
                            </p>
                          </div>
                        </div>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {isOM ? 'объектов у команды' : 'объектов под вашим управлением'}
                        </p>
                      </motion.div>

                      <motion.div 
                        whileHover={{ scale: 1.05, rotate: -1 }}
                        onClick={() => {
                          if ((managerData.week_tasks_completed || 0) >= 3) {
                            confetti({
                              particleCount: 80,
                              spread: 60,
                              origin: { y: 0.6 },
                              colors: ['#22C55E', '#10B981']
                            });
                          }
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          darkMode 
                            ? 'bg-green-900/30 border-green-700 hover:border-green-500' 
                            : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 hover:border-green-500 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            darkMode ? 'bg-green-800' : 'bg-green-500'
                          } shadow-lg`}>
                            <Icon name="CheckCircle2" size={24} className="text-white" />
                          </div>
                          <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>За неделю</p>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                              {managerData.week_tasks_completed || 0}
                            </p>
                          </div>
                        </div>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {isOM ? 'задач выполнила команда' : 'выполнено задач'}
                        </p>
                      </motion.div>

                      <motion.div 
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        onClick={() => {
                          const rank = isOM ? (managerData.om_rank || 999) : (managerData.manager_rank || 999);
                          if (rank <= 3) {
                            confetti({
                              particleCount: 150,
                              spread: 100,
                              origin: { y: 0.6 },
                              colors: ['#F59E0B', '#FBBF24', '#FCD34D']
                            });
                          }
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          darkMode 
                            ? 'bg-amber-900/30 border-amber-700 hover:border-amber-500' 
                            : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-300 hover:border-amber-500 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            darkMode ? 'bg-amber-800' : 'bg-amber-500'
                          } shadow-lg`}>
                            <Icon name="Medal" size={24} className="text-white" />
                          </div>
                          <div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Рейтинг</p>
                            <p className={`text-3xl font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                              #{isOM ? (managerData.om_rank || '—') : (managerData.manager_rank || '—')}
                            </p>
                          </div>
                        </div>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                          {isOM ? 'место среди ОМ' : 'место среди менеджеров'}
                        </p>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`shadow-lg h-full relative overflow-hidden ${
                    darkMode 
                      ? 'bg-gray-800/50 border-purple-700' 
                      : 'bg-white/90 backdrop-blur border-purple-200'
                  }`}>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-purple-300' : 'text-purple-900'}`}>
                        <Icon name="Sparkles" size={20} />
                        Быстрые действия
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-3 relative z-10">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          onClick={() => setActiveTab('listings')}
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 w-full shadow-lg hover:shadow-xl transition-all"
                        >
                          <Icon name="Building2" size={18} className="mr-2" />
                          Объекты
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          onClick={() => setActiveTab('finance')}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 w-full shadow-lg hover:shadow-xl transition-all"
                        >
                          <Icon name="Wallet" size={18} className="mr-2" />
                          Финансы
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          onClick={() => setActiveTab('tasks')}
                          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 w-full shadow-lg hover:shadow-xl transition-all"
                        >
                          <Icon name="CheckSquare" size={18} className="mr-2" />
                          Задачи
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          onClick={() => navigate('/sales-scripts')}
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 w-full shadow-lg hover:shadow-xl transition-all"
                        >
                          <Icon name="MessageSquare" size={18} className="mr-2" />
                          Скрипты
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`shadow-lg h-full relative overflow-hidden ${
                    darkMode 
                      ? 'bg-gray-800/50 border-purple-700' 
                      : 'bg-white/90 backdrop-blur border-purple-200'
                  }`}>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
                    <CardHeader className="relative z-10">
                      <CardTitle className={`flex items-center gap-2 ${darkMode ? 'text-purple-300' : 'text-purple-900'}`}>
                        <Icon name="Award" size={20} />
                        Достижения
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="space-y-3">
                        <motion.div 
                          whileHover={{ scale: 1.02, x: 5 }}
                          onClick={() => {
                            if ((managerData.total_listings || 0) >= 5) {
                              confetti({
                                particleCount: 50,
                                spread: 60,
                                origin: { y: 0.7 },
                                colors: ['#FFD700', '#FFA500']
                              });
                            }
                          }}
                          className={`flex items-center justify-between p-3 rounded-lg border shadow-sm transition-all cursor-pointer ${
                            darkMode 
                              ? 'bg-yellow-900/20 border-yellow-700/50 hover:border-yellow-600'
                              : 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 hover:border-yellow-400 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon name="Trophy" size={24} className="text-yellow-600" />
                            <span className={`font-medium ${darkMode ? 'text-yellow-200' : 'text-gray-900'}`}>Объектов подключено</span>
                          </div>
                          <span className="text-2xl font-bold text-yellow-600">{managerData.total_listings || 0}</span>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.02, x: 5 }}
                          onClick={() => {
                            if ((managerData.total_earned || 0) >= 1000) {
                              confetti({
                                particleCount: 100,
                                spread: 70,
                                origin: { y: 0.7 },
                                colors: ['#22C55E', '#10B981', '#059669']
                              });
                            }
                          }}
                          className={`flex items-center justify-between p-3 rounded-lg border shadow-sm transition-all cursor-pointer ${
                            darkMode
                              ? 'bg-green-900/20 border-green-700/50 hover:border-green-600'
                              : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-400 hover:shadow-md'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon name="DollarSign" size={24} className="text-green-600" />
                            <span className={`font-medium ${darkMode ? 'text-green-200' : 'text-gray-900'}`}>Общий доход</span>
                          </div>
                          <span className="text-2xl font-bold text-green-600">{managerData.total_earned?.toFixed(0) || 0} ₽</span>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          )}

          {activeTab === 'listings' && (
            <ManagerListingsSection
              managerData={managerData}
              adminId={adminId!}
              onFreezeListing={handleFreezeListing}
              onUnfreezeListing={handleUnfreezeListing}
              onRefresh={fetchManagerData}
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

          {activeTab === 'reviews' && (
            <ManagerReviewsSection 
              adminId={adminId!} 
              role={managerData.role || 'employee'}
            />
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