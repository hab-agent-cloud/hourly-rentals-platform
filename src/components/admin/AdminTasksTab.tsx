import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { format, isPast } from 'date-fns';
import { ru } from 'date-fns/locale';

const TASK_CREATE_URL = 'https://functions.poehali.dev/b943879b-9ab2-4b74-9cd4-13dfd77a52e6';

interface Manager {
  id: number;
  name: string;
  role: string;
}

interface Task {
  id: number;
  manager_id: number;
  om_id: number;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
  created_at: string;
  completed_at: string | null;
  is_overdue: boolean;
  manager_name: string;
  om_name: string;
}

interface AdminTasksTabProps {
  adminId: number;
}

export default function AdminTasksTab({ adminId }: AdminTasksTabProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadlineDays, setDeadlineDays] = useState(7);
  const [selectedManagers, setSelectedManagers] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${TASK_CREATE_URL}?admin_id=${adminId}`);
      const data = await response.json();
      setTasks(data.tasks || []);
      setManagers(data.managers || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [adminId]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedManagers([]);
    } else {
      setSelectedManagers(managers.map(m => m.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleManager = (id: number) => {
    setSelectedManagers(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast({ title: 'Укажите название задачи', variant: 'destructive' });
      return;
    }
    if (selectedManagers.length === 0) {
      toast({ title: 'Выберите хотя бы одного менеджера', variant: 'destructive' });
      return;
    }

    setCreating(true);
    try {
      const response = await fetch(TASK_CREATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          admin_id: adminId,
          manager_ids: selectedManagers,
          title: title.trim(),
          description: description.trim(),
          deadline_days: deadlineDays,
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast({ title: `Создано ${data.created_count} задач` });
        setTitle('');
        setDescription('');
        setDeadlineDays(7);
        setSelectedManagers([]);
        setSelectAll(false);
        setShowForm(false);
        loadData();
      } else {
        toast({ title: data.error || 'Ошибка', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Ошибка создания задачи', variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (taskId: number) => {
    try {
      const response = await fetch(TASK_CREATE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', admin_id: adminId, task_id: taskId }),
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Задача удалена' });
        loadData();
      }
    } catch {
      toast({ title: 'Ошибка удаления', variant: 'destructive' });
    }
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" size={32} className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Icon name="ListTodo" size={24} className="text-purple-600" />
          Задачи менеджерам
        </h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          <Icon name={showForm ? 'X' : 'Plus'} size={18} className="mr-2" />
          {showForm ? 'Скрыть' : 'Новая задача'}
        </Button>
      </div>

      {showForm && (
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Icon name="PenLine" size={20} className="text-purple-600" />
              Создать задачу
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Название задачи</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Добавить владельцев и привязать к ним объекты"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Описание</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Подробное описание задачи..."
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Срок выполнения (дней)</label>
              <Input
                type="number"
                min={1}
                max={90}
                value={deadlineDays}
                onChange={(e) => setDeadlineDays(parseInt(e.target.value) || 7)}
                className="w-32"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Менеджеры ({selectedManagers.length} из {managers.length})</label>
                <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                  {selectAll ? 'Снять все' : 'Выбрать всех'}
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {managers.map(m => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedManagers.includes(m.id) ? 'bg-purple-100 border border-purple-300' : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedManagers.includes(m.id)}
                      onChange={() => toggleManager(m.id)}
                      className="rounded"
                    />
                    <span className="text-sm truncate">{m.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button
              onClick={handleCreate}
              disabled={creating}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {creating ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Создание...
                </>
              ) : (
                <>
                  <Icon name="Send" size={18} className="mr-2" />
                  Поставить задачу ({selectedManagers.length} менеджерам)
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Clock" size={20} className="text-orange-500" />
            Активные задачи ({activeTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">Нет активных задач</p>
          ) : (
            <div className="space-y-3">
              {activeTasks.map(task => {
                const isOverdue = task.deadline && isPast(new Date(task.deadline));
                return (
                  <div
                    key={task.id}
                    className={`p-4 border rounded-lg flex items-start justify-between gap-3 ${
                      isOverdue ? 'border-red-300 bg-red-50' : 'border-border'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`font-semibold ${isOverdue ? 'text-red-700' : ''}`}>
                          {task.title}
                        </h4>
                        {isOverdue && (
                          <Badge variant="destructive" className="text-xs">Просрочено</Badge>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Icon name="User" size={12} />
                          {task.manager_name}
                        </span>
                        <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-600 font-semibold' : ''}`}>
                          <Icon name="Calendar" size={12} />
                          {task.deadline
                            ? format(new Date(task.deadline), 'dd MMM yyyy', { locale: ru })
                            : 'Без срока'}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(task.id)}
                      className="text-red-500 hover:text-red-700 shrink-0"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {completedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="CheckCircle" size={20} className="text-green-500" />
              Выполненные ({completedTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {completedTasks.slice(0, 20).map(task => (
                <div key={task.id} className="p-3 border rounded-lg opacity-60 flex items-center justify-between">
                  <div>
                    <span className="font-medium line-through">{task.title}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {task.manager_name}
                      {task.completed_at && ` - ${format(new Date(task.completed_at), 'dd.MM.yyyy', { locale: ru })}`}
                    </span>
                    {task.is_overdue && (
                      <Badge variant="destructive" className="ml-2 text-xs">С опозданием</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
