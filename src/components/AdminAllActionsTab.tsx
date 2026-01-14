import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface AllAction {
  id: number;
  admin_id: number;
  admin_name: string;
  admin_email: string;
  action_type: string;
  entity_type: string;
  entity_id: number;
  entity_name: string;
  description: string;
  created_at: string;
  metadata: any;
  bonus_amount?: number;
}

interface AdminAllActionsTabProps {
  token: string;
}

export default function AdminAllActionsTab({ token }: AdminAllActionsTabProps) {
  const { toast } = useToast();
  const [actions, setActions] = useState<AllAction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterEmployee, setFilterEmployee] = useState<string>('all');
  const [filterActionType, setFilterActionType] = useState<string>('all');
  const [employees, setEmployees] = useState<Array<{ id: number; name: string; email: string }>>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Получаем всех сотрудников
      const employeesData = await api.getEmployees(token);
      setEmployees(employeesData);

      // Получаем действия всех сотрудников
      const allActions: AllAction[] = [];
      for (const employee of employeesData) {
        try {
          const data = await api.getEmployeeDetails(token, employee.id);
          allActions.push(...data.actions.map((action: any) => ({
            ...action,
            admin_name: employee.name,
            admin_email: employee.email,
          })));
        } catch (error) {
          console.error(`Failed to fetch actions for employee ${employee.id}:`, error);
        }
      }

      // Сортируем по дате (новые сначала)
      allActions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setActions(allActions);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось загрузить данные',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredActions = actions.filter((action) => {
    const matchesSearch =
      action.entity_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.admin_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesEmployee = filterEmployee === 'all' || action.admin_id.toString() === filterEmployee;
    const matchesActionType = filterActionType === 'all' || action.action_type === filterActionType;

    return matchesSearch && matchesEmployee && matchesActionType;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionTypeBadge = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return <Badge className="bg-green-600">Создание</Badge>;
      case 'update':
        return <Badge className="bg-blue-600">Изменение</Badge>;
      case 'delete':
        return <Badge className="bg-red-600">Удаление</Badge>;
      default:
        return <Badge variant="outline">{actionType}</Badge>;
    }
  };

  const getEntityTypeIcon = (entityType: string) => {
    switch (entityType) {
      case 'listing':
        return 'Building';
      case 'owner':
        return 'Users';
      default:
        return 'FileText';
    }
  };

  const getBonusAmount = (action: AllAction): number | null => {
    if (action.action_type !== 'create' || action.entity_type !== 'listing') {
      return null;
    }
    
    const metadata = action.metadata || {};
    const type = metadata.type;
    
    if (type === 'hotel') return 200;
    if (type === 'apartment') return 100;
    
    return null;
  };

  const totalBonuses = filteredActions.reduce((sum, action) => {
    const bonus = getBonusAmount(action);
    return sum + (bonus || 0);
  }, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold">Вся работа сотрудников</h2>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            {filteredActions.length} действий
          </Badge>
          <Badge className="bg-gradient-to-r from-green-600 to-green-700 text-lg px-4 py-1">
            {totalBonuses} ₽ бонусов
          </Badge>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Поиск</label>
            <Input
              placeholder="Объект, сотрудник..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Сотрудник</label>
            <Select value={filterEmployee} onValueChange={setFilterEmployee}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все сотрудники</SelectItem>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id.toString()}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Тип действия</label>
            <Select value={filterActionType} onValueChange={setFilterActionType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все действия</SelectItem>
                <SelectItem value="create">Создание</SelectItem>
                <SelectItem value="update">Изменение</SelectItem>
                <SelectItem value="delete">Удаление</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Icon name="Loader2" size={48} className="animate-spin text-purple-600" />
        </div>
      ) : filteredActions.length === 0 ? (
        <Card className="p-20 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-2xl font-bold mb-2">Действий не найдено</h3>
          <p className="text-muted-foreground">
            {searchQuery || filterEmployee !== 'all' || filterActionType !== 'all'
              ? 'Попробуйте изменить фильтры'
              : 'Действия сотрудников появятся здесь'}
          </p>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата и время</TableHead>
                <TableHead>Сотрудник</TableHead>
                <TableHead>Действие</TableHead>
                <TableHead>Объект</TableHead>
                <TableHead>Описание</TableHead>
                <TableHead className="text-right">Бонус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActions.map((action) => {
                const bonusAmount = getBonusAmount(action);
                return (
                  <TableRow key={action.id}>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(action.created_at)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{action.admin_name}</div>
                        <div className="text-xs text-muted-foreground">{action.admin_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getActionTypeBadge(action.action_type)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Icon name={getEntityTypeIcon(action.entity_type)} size={16} className="text-muted-foreground" />
                        <span className="font-medium">{action.entity_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-md">
                      {action.description}
                    </TableCell>
                    <TableCell className="text-right">
                      {bonusAmount ? (
                        <Badge className="bg-green-600">+{bonusAmount} ₽</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
