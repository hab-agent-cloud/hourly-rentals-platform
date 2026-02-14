import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ManagerDashboardHeader from '@/components/manager/ManagerDashboardHeader';
import ManagerDashboardOverview from '@/components/manager/ManagerDashboardOverview';
import ManagerDashboardContent from '@/components/manager/ManagerDashboardContent';
import { motion } from 'framer-motion';
import { useManagerAuth } from '@/hooks/useManagerAuth';
import { useManagerData } from '@/hooks/useManagerData';
import { useManagerOperations } from '@/hooks/useManagerOperations';

export default function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('managerDarkMode') === 'true');
  const navigate = useNavigate();
  
  const { adminId, handleLogout } = useManagerAuth();
  
  const {
    managerData,
    loading,
    paymentHistory,
    refreshing,
    fetchManagerData,
    fetchPaymentHistory,
    handleRefresh,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useManagerData(adminId);
  
  const {
    handleFreezeListing,
    handleUnfreezeListing,
    handleDeactivateListing,
    handleActivateListing,
    handleWithdraw
  } = useManagerOperations(adminId, managerData, fetchManagerData, fetchPaymentHistory);

  useEffect(() => {
    localStorage.setItem('managerDarkMode', darkMode.toString());
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
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
    { id: 'owners', icon: 'UserCog', label: 'Владельцы' },
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
        onLogout={handleLogout}
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
              adminId={adminId}
              onWithdraw={handleWithdraw}
              onBalanceUpdate={fetchManagerData}
              onTabChange={setActiveTab}
              onNavigate={navigate}
              onActivateListing={handleActivateListing}
            />
          </motion.div>
        ) : (
          <ManagerDashboardContent
            activeTab={activeTab}
            managerData={managerData}
            adminId={adminId!}
            darkMode={darkMode}
            paymentHistory={paymentHistory}
            onFreezeListing={handleFreezeListing}
            onUnfreezeListing={handleUnfreezeListing}
            onDeactivateListing={handleDeactivateListing}
            onActivateListing={handleActivateListing}
            onDataUpdate={fetchManagerData}
          />
        )}
      </div>
    </div>
  );
}
