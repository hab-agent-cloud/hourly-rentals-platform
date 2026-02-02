import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import CopywriterInstructionDialog from './CopywriterInstructionDialog';

interface MyEarningsTabProps {
  token: string;
  adminInfo: any;
}

interface EmployeeAction {
  id: number;
  action_type: string;
  entity_type: string;
  entity_id: number;
  entity_name: string;
  description: string;
  created_at: string;
  metadata: any;
  earning?: number;
  earning_paid?: boolean;
}

export default function MyEarningsTab({ token, adminInfo }: MyEarningsTabProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [showInstruction, setShowInstruction] = useState(false);
  const [earnings, setEarnings] = useState({
    total: 0,
    paid: 0,
    pending: 0,
  });
  const [actions, setActions] = useState<EmployeeAction[]>([]);

  useEffect(() => {
    if (adminInfo?.admin_id) {
      fetchMyEarnings();
    } else {
      setIsLoading(false);
    }
  }, [adminInfo?.admin_id]);

  const fetchMyEarnings = async () => {
    if (!adminInfo?.admin_id) {
      return;
    }
    
    try {
      const data = await api.getEmployeeDetails(token, adminInfo.admin_id);
      
      setEarnings({
        total: data.employee.earnings?.total || 0,
        paid: data.employee.earnings?.paid || 0,
        pending: data.employee.earnings?.pending || 0,
      });

      const actionsWithEarnings = (data.actions || []).map((action: EmployeeAction) => ({
        ...action,
        earning: action.earning || 0,
        earning_paid: action.earning_paid || false,
      }));

      setActions(actionsWithEarnings);
    } catch (error: any) {
      console.error('Failed to fetch earnings:', error);
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось загрузить данные о заработке',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return 'Plus';
      case 'update':
        return 'Edit';
      case 'delete':
        return 'Trash2';
      case 'approve':
        return 'Check';
      case 'reject':
        return 'X';
      default:
        return 'Activity';
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return 'text-green-600';
      case 'update':
        return 'text-blue-600';
      case 'delete':
        return 'text-red-600';
      case 'approve':
        return 'text-green-600';
      case 'reject':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="Loader2" size={48} className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Мой заработок</h2>
          <p className="text-muted-foreground">
            Здесь вы можете отслеживать свой заработок за добавление и обработку объектов
          </p>
        </div>
        <Button onClick={() => setShowInstruction(true)} variant="outline">
          <Icon name="BookOpen" size={18} className="mr-2" />
          Инструкция для стажёров
        </Button>
      </div>

      <CopywriterInstructionDialog 
        show={showInstruction} 
        onClose={() => setShowInstruction(false)} 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon name="TrendingUp" size={16} />
              Всего заработано
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-700">
              {earnings.total.toLocaleString('ru-RU')} ₽
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon name="CheckCircle" size={16} />
              Выплачено
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-700">
              {earnings.paid.toLocaleString('ru-RU')} ₽
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon name="Clock" size={16} />
              К выплате
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700">
              {earnings.pending.toLocaleString('ru-RU')} ₽
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="History" size={20} />
            История заработка
          </CardTitle>
        </CardHeader>
        <CardContent>
          {actions.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground">Нет данных о заработке</p>
              <p className="text-sm text-muted-foreground mt-2">
                Начните добавлять объекты, чтобы зарабатывать
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {actions.map((action) => (
                <div
                  key={action.id}
                  className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`mt-1 ${getActionColor(action.action_type)}`}>
                    <Icon name={getActionIcon(action.action_type)} size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="font-medium">{action.description}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {action.entity_type}: {action.entity_name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(action.created_at).toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      {action.earning && action.earning > 0 && (
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-xl font-bold text-green-600">
                            +{action.earning.toLocaleString('ru-RU')} ₽
                          </div>
                          <Badge 
                            variant={action.earning_paid ? 'default' : 'secondary'}
                            className={action.earning_paid ? 'bg-blue-600' : 'bg-orange-500'}
                          >
                            <Icon 
                              name={action.earning_paid ? 'CheckCircle' : 'Clock'} 
                              size={12} 
                              className="mr-1" 
                            />
                            {action.earning_paid ? 'Выплачено' : 'К выплате'}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Info" size={20} className="text-purple-600" />
            Правила начисления заработка
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <Icon name="Plus" size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold">Добавление нового объекта</div>
              <div className="text-sm text-muted-foreground">
                За каждый новый объект, прошедший модерацию
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}