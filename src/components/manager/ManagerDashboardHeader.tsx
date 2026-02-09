import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import MessagesDialog from '@/components/manager/MessagesDialog';
import OwnersMessagesDialog from '@/components/manager/OwnersMessagesDialog';
import { motion } from 'framer-motion';

interface ManagerData {
  name: string;
  role: string;
  subscription_active?: boolean;
}

interface ManagerDashboardHeaderProps {
  managerData: ManagerData;
  adminId: number;
  darkMode: boolean;
  activeTab: string;
  tabs: Array<{ id: string; icon: string; label: string }>;
  refreshing: boolean;
  onDarkModeToggle: () => void;
  onLogout: () => void;
  onTabChange: (tabId: string) => void;
}

export default function ManagerDashboardHeader({
  managerData,
  adminId,
  darkMode,
  activeTab,
  tabs,
  refreshing,
  onDarkModeToggle,
  onLogout,
  onTabChange,
}: ManagerDashboardHeaderProps) {
  const isOM = managerData.role === 'om';
  const isUM = managerData.role === 'um';

  return (
    <>
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
                onClick={onDarkModeToggle}
                className={darkMode ? 'text-yellow-400 hover:text-yellow-300 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-700 hover:bg-gray-100'}
              >
                <Icon name={darkMode ? 'Sun' : 'Moon'} size={18} />
              </Button>
              <MessagesDialog managerId={adminId} />
              <OwnersMessagesDialog managerId={adminId} />
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
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
                onClick={() => onTabChange(tab.id)}
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
                <Icon name={tab.icon} size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}