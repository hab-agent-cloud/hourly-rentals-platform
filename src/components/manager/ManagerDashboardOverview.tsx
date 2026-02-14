import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import ManagerStatsCards from '@/components/manager/ManagerStatsCards';
import ManagerLevelCard from '@/components/manager/ManagerLevelCard';
import AchievementsPanel from '@/components/manager/AchievementsPanel';
import InactiveListingsSection from '@/components/manager/InactiveListingsSection';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface ManagerData {
  role: string;
  level?: string;
  objects_count?: number;
  object_limit?: number;
  balance?: number;
  month_commission?: number;
  total_owner_payments?: number;
  subscription_active?: boolean;
  total_objects?: number;
  week_tasks_completed?: number;
  om_rank?: number | string;
  manager_rank?: number | string;
  total_listings?: number;
  total_earned?: number;
  inactive_listings?: any[];
}

interface ManagerDashboardOverviewProps {
  managerData: ManagerData;
  darkMode: boolean;
  adminId?: number | null;
  onWithdraw: (
    amount: string,
    method: 'sbp' | 'card' | 'salary',
    data: { phone: string; cardNumber: string; recipientName: string; bankName: string }
  ) => void;
  onBalanceUpdate: () => void;
  onTabChange: (tabId: string) => void;
  onNavigate: (path: string) => void;
}

export default function ManagerDashboardOverview({
  managerData,
  darkMode,
  adminId,
  onWithdraw,
  onBalanceUpdate,
  onTabChange,
  onNavigate,
}: ManagerDashboardOverviewProps) {
  const isOM = managerData.role === 'om';
  const isUM = managerData.role === 'um';

  return (
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
        adminId={adminId}
        onBalanceUpdate={onBalanceUpdate}
      />
      
      <ManagerStatsCards managerData={managerData} onWithdraw={onWithdraw} />
      
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
                  onClick={() => onTabChange('listings')}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 w-full shadow-lg hover:shadow-xl transition-all"
                >
                  <Icon name="Building2" size={18} className="mr-2" />
                  Объекты
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => onTabChange('finance')}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 w-full shadow-lg hover:shadow-xl transition-all"
                >
                  <Icon name="Wallet" size={18} className="mr-2" />
                  Финансы
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => onTabChange('tasks')}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 w-full shadow-lg hover:shadow-xl transition-all"
                >
                  <Icon name="CheckSquare" size={18} className="mr-2" />
                  Задачи
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => onNavigate('/sales-scripts')}
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
      
      {managerData.inactive_listings && managerData.inactive_listings.length > 0 && (
        <InactiveListingsSection inactiveListings={managerData.inactive_listings} />
      )}
    </div>
  );
}