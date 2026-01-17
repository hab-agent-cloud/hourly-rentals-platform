import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

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
}

interface AdminEmployeesTabProps {
  token: string;
}

export default function AdminEmployeesTab({ token }: AdminEmployeesTabProps) {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeActions, setEmployeeActions] = useState<EmployeeAction[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    login: '',
    password: '',
    loginType: 'phone' as 'phone' | 'email',
    role: 'employee' as 'employee' | 'superadmin',
    permissions: {
      owners: false,
      listings: true,
      settings: false,
    },
    is_active: true,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await api.getEmployees(token);
      console.log('Employees data:', data);
      setEmployees(data);
    } catch (error: any) {
      console.error('Failed to fetch employees:', error);
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось загрузить сотрудников',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeDetails = async (employeeId: number) => {
    try {
      const data = await api.getEmployeeDetails(token, employeeId);
      setSelectedEmployee(data.employee);
      setEmployeeActions(data.actions);
      setShowDetailsDialog(true);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось загрузить данные',
        variant: 'destructive',
      });
    }
  };

  const handleCreate = () => {
    setEditingEmployee(null);
    setFormData({
      email: '',
      name: '',
      login: '',
      password: '',
      loginType: 'phone',
      role: 'employee',
      permissions: {
        owners: false,
        listings: true,
        settings: false,
      },
      is_active: true,
    });
    setShowDialog(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    const loginType = employee.login.includes('@') ? 'email' : 'phone';
    setFormData({
      email: employee.email,
      name: employee.name,
      login: employee.login,
      password: '',
      loginType: loginType,
      role: employee.role,
      permissions: employee.permissions,
      is_active: employee.is_active,
    });
    setShowDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editingEmployee) {
        await api.updateEmployee(token, editingEmployee.id, formData);
      } else {
        await api.createEmployee(token, formData);
      }
      
      toast({
        title: 'Успешно',
        description: editingEmployee ? 'Сотрудник обновлен' : 'Сотрудник создан',
      });
      
      setShowDialog(false);
      fetchEmployees();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось сохранить',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этого сотрудника?')) return;

    try {
      await api.deleteEmployee(token, id);
      toast({
        title: 'Успешно',
        description: 'Сотрудник удален',
      });
      fetchEmployees();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось удалить',
        variant: 'destructive',
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    return role === 'superadmin' ? 'default' : 'secondary';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold">Сотрудники</h2>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            {employees.length}
          </Badge>
        </div>
        <Button
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={handleCreate}
        >
          <Icon name="UserPlus" size={18} className="mr-2" />
          Добавить сотрудника
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Icon name="Loader2" size={48} className="animate-spin text-purple-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
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
                    {employee.role === 'superadmin' ? 'Суперадмин' : 'Сотрудник'}
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
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Статус:</span>
                    <Badge variant={employee.is_active ? 'default' : 'secondary'}>
                      {employee.is_active ? 'Активен' : 'Неактивен'}
                    </Badge>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(employee)}
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => fetchEmployeeDetails(employee.id)}
                    >
                      <Icon name="History" size={16} className="mr-1" />
                      История ({employee.action_count || 0})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(employee.id)}
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && employees.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-2xl font-bold mb-2">Сотрудников пока нет</h3>
          <p className="text-muted-foreground mb-6">
            Добавьте первого сотрудника для начала работы
          </p>
          <Button
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={handleCreate}
          >
            <Icon name="UserPlus" size={18} className="mr-2" />
            Добавить сотрудника
          </Button>
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? 'Редактировать сотрудника' : 'Новый сотрудник'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Иван Иванов"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Тип логина</Label>
              <Select
                value={formData.loginType}
                onValueChange={(value: 'phone' | 'email') =>
                  setFormData({ ...formData, loginType: value, login: '' })
                }
                disabled={!!editingEmployee}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Номер телефона</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
              {editingEmployee && (
                <p className="text-xs text-muted-foreground">
                  Тип логина нельзя изменить после создания. Только суперадмин может изменить логин.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="login">
                  {formData.loginType === 'phone' ? 'Номер телефона' : 'Email для входа'}
                </Label>
                <Input
                  id="login"
                  type={formData.loginType === 'email' ? 'email' : 'tel'}
                  value={formData.login}
                  onChange={(e) =>
                    setFormData({ ...formData, login: e.target.value })
                  }
                  placeholder={formData.loginType === 'phone' ? '89991234567' : 'login@example.com'}
                />
                <p className="text-xs text-muted-foreground">
                  Сотрудник будет использовать это для входа в систему
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Пароль {editingEmployee && '(оставьте пустым для сохранения текущего)'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Роль</Label>
              <Select
                value={formData.role}
                onValueChange={(value: 'employee' | 'superadmin') =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Сотрудник</SelectItem>
                  <SelectItem value="superadmin">Суперадмин</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Права доступа</Label>
              <div className="space-y-3 bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Users" size={16} />
                    <span className="text-sm">Управление владельцами</span>
                  </div>
                  <Switch
                    checked={formData.permissions.owners}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, owners: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Building" size={16} />
                    <span className="text-sm">Управление объектами</span>
                  </div>
                  <Switch
                    checked={formData.permissions.listings}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, listings: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="Settings" size={16} />
                    <span className="text-sm">Настройки системы</span>
                  </div>
                  <Switch
                    checked={formData.permissions.settings}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        permissions: { ...formData.permissions, settings: checked },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon name="UserCheck" size={16} />
                <span className="text-sm">Активный аккаунт</span>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Отмена
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={handleSave}
            >
              {editingEmployee ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              История действий: {selectedEmployee?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{selectedEmployee.email}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Логин</div>
                  <div className="font-medium">@{selectedEmployee.login}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Роль</div>
                  <Badge variant={selectedEmployee.role === 'superadmin' ? 'default' : 'secondary'}>
                    {selectedEmployee.role === 'superadmin' ? 'Суперадмин' : 'Сотрудник'}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Всего действий</div>
                  <div className="font-medium">{employeeActions.length}</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Последние действия</h3>
                {employeeActions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="FileX" size={48} className="mx-auto mb-2 opacity-20" />
                    <p>Нет записей о действиях</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {employeeActions.map((action) => (
                      <Card key={action.id} className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="mt-1">
                            {action.action_type === 'create' && (
                              <div className="p-2 bg-green-100 rounded-full">
                                <Icon name="Plus" size={20} className="text-green-600" />
                              </div>
                            )}
                            {action.action_type === 'update' && (
                              <div className="p-2 bg-blue-100 rounded-full">
                                <Icon name="Edit" size={20} className="text-blue-600" />
                              </div>
                            )}
                            {action.action_type === 'delete' && (
                              <div className="p-2 bg-red-100 rounded-full">
                                <Icon name="Trash2" size={20} className="text-red-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-xs">
                                {action.entity_type === 'listing' && 'Объект'}
                                {action.entity_type === 'owner' && 'Владелец'}
                                {action.entity_type === 'employee' && 'Сотрудник'}
                              </Badge>
                              <span className="text-sm font-semibold">{action.entity_name}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {action.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Icon name="Clock" size={12} />
                              {new Date(action.created_at).toLocaleString('ru-RU', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}