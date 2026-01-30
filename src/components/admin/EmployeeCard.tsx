import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Employee {
  id: number;
  email: string;
  name: string;
  login: string;
  role: 'superadmin' | 'employee';
  permissions: {
    owners: boolean;
    listings: boolean;
    settings: boolean;
  };
  is_active: boolean;
  created_at: string;
  last_login?: string;
  action_count?: number;
  earnings?: {
    total: number;
    paid: number;
    pending: number;
  };
}

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (id: number) => void;
  onViewDetails: (id: number) => void;
}

export default function EmployeeCard({ employee, onEdit, onDelete, onViewDetails }: EmployeeCardProps) {
  const getRoleBadgeVariant = (role: string) => {
    return role === 'superadmin' ? 'default' : 'secondary';
  };

  return (
    <Card key={employee.id} className={!employee.is_active ? 'opacity-60' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl mb-2">{employee.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Icon name="Mail" size={14} />
              <span className="truncate">{employee.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="User" size={14} />
              <span>@{employee.login}</span>
            </div>
          </div>
          <Badge variant={getRoleBadgeVariant(employee.role)}>
            {employee.role === 'superadmin' ? 'Суперадмин' : 'Копирайтер'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="text-sm font-semibold mb-2">Права доступа:</div>
            <div className="flex flex-wrap gap-2">
              {employee.permissions.owners && (
                <Badge variant="outline" className="text-xs">
                  <Icon name="Users" size={12} className="mr-1" />
                  Владельцы
                </Badge>
              )}
              {employee.permissions.listings && (
                <Badge variant="outline" className="text-xs">
                  <Icon name="Building" size={12} className="mr-1" />
                  Объекты
                </Badge>
              )}
              {employee.permissions.settings && (
                <Badge variant="outline" className="text-xs">
                  <Icon name="Settings" size={12} className="mr-1" />
                  Настройки
                </Badge>
              )}
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Icon name="Calendar" size={14} />
            Создан: {new Date(employee.created_at).toLocaleDateString('ru-RU')}
          </div>
          
          {employee.last_login && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Icon name="LogIn" size={14} />
              Вход: {new Date(employee.last_login).toLocaleDateString('ru-RU')}
            </div>
          )}
          
          {employee.role === 'employee' && employee.earnings && (
            <div className="space-y-2 pt-3 border-t">
              <div className="text-sm font-semibold">Заработок:</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-muted-foreground">Всего</div>
                  <div className="font-bold text-green-700">{employee.earnings.total.toLocaleString('ru-RU')} ₽</div>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-muted-foreground">Выплачено</div>
                  <div className="font-bold text-blue-700">{employee.earnings.paid.toLocaleString('ru-RU')} ₽</div>
                </div>
                <div className="bg-orange-50 p-2 rounded">
                  <div className="text-muted-foreground">К выплате</div>
                  <div className="font-bold text-orange-700">{employee.earnings.pending.toLocaleString('ru-RU')} ₽</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onViewDetails(employee.id)}
            >
              <Icon name="Eye" size={14} className="mr-1" />
              Детали
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(employee)}
            >
              <Icon name="Edit" size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(employee.id)}
            >
              <Icon name="Trash2" size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}