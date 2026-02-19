import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import EmployeeCard from '@/components/admin/EmployeeCard';
import EmployeeFormDialog from '@/components/admin/EmployeeFormDialog';
import EmployeeDetailsDialog from '@/components/admin/EmployeeDetailsDialog';

interface Employee {
  id: number;
  email: string;
  name: string;
  login: string;
  role: 'superadmin' | 'employee' | 'manager' | 'operational_manager' | 'chief_manager' | 'operator';
  permissions: {
    owners: boolean;
    listings: boolean;
    settings: boolean;
  };
  is_active: boolean;
  created_at: string;
  last_login?: string;
  action_count?: number;
  copywriter_earnings?: number;
  earnings?: {
    total: number;
    paid: number;
    pending: number;
  };
}

interface EmployeeAction {
  id: number;
  action_type: string;
  entity_type: string;
  entity_id: number;
  entity_name: string;
  description: string;
  created_at: string;
  metadata: Record<string, unknown>;
  earning?: number;
  earning_paid?: boolean;
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
  const [empSearch, setEmpSearch] = useState('');
  const [empRoleFilter, setEmpRoleFilter] = useState('all');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    login: '',
    password: '',
    loginType: 'phone' as 'phone' | 'email',
    role: 'employee' as 'employee' | 'superadmin' | 'manager' | 'operational_manager' | 'chief_manager' | 'operator',
    permissions: {
      owners: false,
      listings: true,
      settings: false,
    },
    is_active: true,
    copywriter_earnings: 0,
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const data = await api.getEmployees(token);
      console.log('Employees data:', data);
      
      const employeesWithEarnings = data.map((emp: Employee) => ({
        ...emp,
        earnings: emp.earnings ? {
          total: emp.earnings.total || 0,
          paid: emp.earnings.paid || 0,
          pending: emp.earnings.pending || 0,
        } : undefined
      }));
      
      setEmployees(employeesWithEarnings);
    } catch (error: unknown) {
      console.error('Failed to fetch employees:', error);
      const errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить сотрудников';
      toast({
        title: 'Ошибка',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeDetails = async (employeeId: number) => {
    try {
      const data = await api.getEmployeeDetails(token, employeeId);
      
      const employeeWithEarnings = {
        ...data.employee,
        earnings: data.employee.earnings ? {
          total: data.employee.earnings.total || 0,
          paid: data.employee.earnings.paid || 0,
          pending: data.employee.earnings.pending || 0,
        } : undefined
      };
      
      const actionsWithEarnings = (data.actions || []).map((action: EmployeeAction) => ({
        ...action,
        earning: action.earning || 0,
        earning_paid: action.earning_paid || false,
      }));
      
      setSelectedEmployee(employeeWithEarnings);
      setEmployeeActions(actionsWithEarnings);
      setShowDetailsDialog(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить данные';
      toast({
        title: 'Ошибка',
        description: errorMessage,
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
      copywriter_earnings: 0,
    });
    setShowDialog(true);
  };

  const handleEdit = (employee: Employee & { copywriter_earnings?: number }) => {
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
      copywriter_earnings: employee.copywriter_earnings || 0,
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось сохранить';
      toast({
        title: 'Ошибка',
        description: errorMessage,
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось удалить';
      toast({
        title: 'Ошибка',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const roleLabels: Record<string, string> = {
    superadmin: 'Суперадмин',
    manager: 'Менеджер',
    chief_manager: 'Главный менеджер',
    operational_manager: 'Операционный менеджер',
    employee: 'Сотрудник',
    operator: 'Оператор',
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      const roleMatch = empRoleFilter === 'all' || e.role === empRoleFilter;
      if (!empSearch) return roleMatch;
      const q = empSearch.toLowerCase();
      return roleMatch && (
        e.name?.toLowerCase().includes(q) ||
        e.email?.toLowerCase().includes(q) ||
        e.login?.toLowerCase().includes(q)
      );
    });
  }, [employees, empSearch, empRoleFilter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold">Сотрудники</h2>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            {filteredEmployees.length} из {employees.length}
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

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени, email, логину..."
            value={empSearch}
            onChange={(e) => setEmpSearch(e.target.value)}
            className="pl-10"
          />
          {empSearch && (
            <button onClick={() => setEmpSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <Icon name="X" size={18} />
            </button>
          )}
        </div>
        <Select value={empRoleFilter} onValueChange={setEmpRoleFilter}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Все роли" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все роли</SelectItem>
            {Object.entries(roleLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Icon name="Loader2" size={48} className="animate-spin text-purple-600" />
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-2">
          <Icon name="SearchX" size={40} />
          <p>Ничего не найдено</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={fetchEmployeeDetails}
            />
          ))}
        </div>
      )}

      <EmployeeFormDialog
        show={showDialog}
        editingEmployee={editingEmployee}
        formData={formData}
        onFormDataChange={handleFormDataChange}
        onSave={handleSave}
        onClose={() => setShowDialog(false)}
      />

      <EmployeeDetailsDialog
        show={showDetailsDialog}
        employee={selectedEmployee}
        actions={employeeActions}
        onClose={() => setShowDetailsDialog(false)}
      />
    </div>
  );
}