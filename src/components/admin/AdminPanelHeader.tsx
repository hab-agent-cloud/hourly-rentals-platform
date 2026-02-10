import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import DocumentsLibraryDialog from './DocumentsLibraryDialog';

interface AdminPanelHeaderProps {
  adminInfo: any;
  hasPermission: (permission: string) => boolean;
  activeTab: 'listings' | 'moderation' | 'moderation2' | 'recheck' | 'rejected' | 'owners' | 'employees' | 'bonuses' | 'all-actions' | 'call-tracking' | 'my-earnings' | 'analytics';
  onTabChange: (tab: 'listings' | 'moderation' | 'moderation2' | 'recheck' | 'rejected' | 'owners' | 'employees' | 'bonuses' | 'all-actions' | 'call-tracking' | 'my-earnings' | 'analytics') => void;
  onLogout: () => void;
  token: string;
}

export default function AdminPanelHeader({ adminInfo, hasPermission, activeTab, onTabChange, onLogout, token }: AdminPanelHeaderProps) {
  const navigate = useNavigate();
  const [showLibrary, setShowLibrary] = useState(false);
  
  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-purple-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="https://cdn.poehali.dev/projects/1a35ca30-983f-4a91-b0b4-3c6fa1c9a65b/files/eb1f7656-79bf-458f-a9d8-00f75775f384.jpg" 
                alt="120 минут" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Админ-панель
                </h1>
                <p className="text-xs text-muted-foreground">
                  {adminInfo?.name} • {adminInfo?.role === 'superadmin' ? 'Суперадминистратор' : 'Копирайтер'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {adminInfo?.role === 'superadmin' && (
                <>
                  <Button variant="outline" onClick={() => window.open('https://functions.poehali.dev/b4fc8b5a-e47e-44ad-a4e5-bdd159e2acf5', '_blank')}>
                    <Icon name="FileText" size={18} className="mr-2" />
                    Бизнес-план PDF
                  </Button>
                  <Button variant="outline" onClick={() => setShowLibrary(true)}>
                    <Icon name="Library" size={18} className="mr-2" />
                    Библиотека
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/accounting')}>
                    <Icon name="Banknote" size={18} className="mr-2" />
                    Бухгалтерия
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={() => navigate('/career')}>
                <Icon name="TrendingUp" size={18} className="mr-2" />
                Карьера
              </Button>
              <Button variant="outline" onClick={onLogout}>
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-8">
        <div className="flex items-center gap-3 mb-6 border-b">
          {hasPermission('listings') && (
            <>
              <Button
                variant={activeTab === 'listings' ? 'default' : 'ghost'}
                onClick={() => onTabChange('listings')}
                className="rounded-b-none"
              >
                <Icon name="Hotel" size={18} className="mr-2" />
                Объекты
              </Button>
              <Button
                variant={activeTab === 'moderation' ? 'default' : 'ghost'}
                onClick={() => onTabChange('moderation')}
                className="rounded-b-none"
              >
                <Icon name="Shield" size={18} className="mr-2" />
                Модерация (Админы)
              </Button>
              <Button
                variant={activeTab === 'moderation2' ? 'default' : 'ghost'}
                onClick={() => onTabChange('moderation2')}
                className="rounded-b-none"
              >
                <Icon name="UserPlus" size={18} className="mr-2" />
                Модерация (Владельцы)
              </Button>
              <Button
                variant={activeTab === 'recheck' ? 'default' : 'ghost'}
                onClick={() => onTabChange('recheck')}
                className="rounded-b-none"
              >
                <Icon name="RefreshCw" size={18} className="mr-2" />
                Повторная проверка
              </Button>
              <Button
                variant={activeTab === 'rejected' ? 'default' : 'ghost'}
                onClick={() => {
                  console.log('[HEADER] Clicked rejected tab');
                  onTabChange('rejected');
                }}
                className="rounded-b-none"
              >
                <Icon name="XCircle" size={18} className="mr-2" />
                Отклонённые
              </Button>
            </>
          )}
          {hasPermission('owners') && (
            <Button
              variant={activeTab === 'owners' ? 'default' : 'ghost'}
              onClick={() => onTabChange('owners')}
              className="rounded-b-none"
            >
              <Icon name="Users" size={18} className="mr-2" />
              Владельцы
            </Button>
          )}
          {adminInfo?.role === 'superadmin' && (
            <>
              <Button
                variant={activeTab === 'employees' ? 'default' : 'ghost'}
                onClick={() => onTabChange('employees')}
                className="rounded-b-none"
              >
                <Icon name="UserCog" size={18} className="mr-2" />
                Сотрудники
              </Button>
              <Button
                variant={activeTab === 'bonuses' ? 'default' : 'ghost'}
                onClick={() => onTabChange('bonuses')}
                className="rounded-b-none"
              >
                <Icon name="DollarSign" size={18} className="mr-2" />
                Выплаты
              </Button>
              <Button
                variant={activeTab === 'all-actions' ? 'default' : 'ghost'}
                onClick={() => onTabChange('all-actions')}
                className="rounded-b-none"
              >
                <Icon name="ListChecks" size={18} className="mr-2" />
                Общая работа
              </Button>
              <Button
                variant={activeTab === 'call-tracking' ? 'default' : 'ghost'}
                onClick={() => onTabChange('call-tracking')}
                className="rounded-b-none"
              >
                <Icon name="Phone" size={18} className="mr-2" />
                Звонки
              </Button>
              <Button
                variant={activeTab === 'analytics' ? 'default' : 'ghost'}
                onClick={() => onTabChange('analytics')}
                className="rounded-b-none"
              >
                <Icon name="BarChart3" size={18} className="mr-2" />
                Аналитика
              </Button>
            </>
          )}
          {adminInfo?.role === 'employee' && (
            <Button
              variant={activeTab === 'my-earnings' ? 'default' : 'ghost'}
              onClick={() => onTabChange('my-earnings')}
              className="rounded-b-none"
            >
              <Icon name="Wallet" size={18} className="mr-2" />
              Мой заработок
            </Button>
          )}
        </div>
      </div>

      <DocumentsLibraryDialog 
        show={showLibrary} 
        onClose={() => setShowLibrary(false)} 
        token={token}
      />
    </>
  );
}