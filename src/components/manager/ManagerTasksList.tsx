import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { format, isPast } from 'date-fns';
import { ru } from 'date-fns/locale';
import confetti from 'canvas-confetti';

interface Task {
  id: number;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
  is_overdue?: boolean;
}

interface ManagerTasksListProps {
  tasks: Task[];
  managerId: number;
  onTaskCompleted: () => void;
}

const COMPLETE_TASK_URL = 'https://functions.poehali.dev/d306fd9e-8d52-42ef-9d0b-e98812d164ea';

export default function ManagerTasksList({ tasks, managerId, onTaskCompleted }: ManagerTasksListProps) {
  const [loading, setLoading] = useState<number | null>(null);
  const { toast } = useToast();

  const handleCompleteTask = async (taskId: number) => {
    setLoading(taskId);
    try {
      const response = await fetch(COMPLETE_TASK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          manager_id: managerId
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (!data.is_overdue) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FF6347', '#87CEEB', '#9370DB']
          });
        }
        
        toast({
          title: data.is_overdue ? 'Задача выполнена с опозданием' : '🎉 Задача выполнена!',
          description: data.is_overdue 
            ? 'ОМ получил уведомление о просрочке' 
            : 'Отличная работа! ОМ получил уведомление',
          variant: data.is_overdue ? 'destructive' : 'default'
        });
        onTaskCompleted();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось отметить задачу как выполненную',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Ошибка при завершении задачи:', error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при отправке данных',
        variant: 'destructive'
      });
    } finally {
      setLoading(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="ListTodo" size={20} />
            Задачи от ОМ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Нет активных задач
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="ListTodo" size={20} />
          Задачи от ОМ ({tasks.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.map((task) => {
          const isOverdue = task.deadline && isPast(new Date(task.deadline));
          
          return (
            <div
              key={task.id}
              className={`p-4 border rounded-lg space-y-2 ${
                isOverdue ? 'border-red-300 bg-red-50' : 'border-border'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h4 className={`font-semibold ${isOverdue ? 'text-red-700' : ''}`}>
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.description}
                    </p>
                  )}
                </div>
                {isOverdue && (
                  <Badge variant="destructive" className="shrink-0">
                    <Icon name="AlertCircle" size={14} className="mr-1" />
                    Просрочено
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Calendar" size={16} />
                  <span className={isOverdue ? 'text-red-600 font-semibold' : ''}>
                    Срок: {task.deadline 
                      ? format(new Date(task.deadline), 'dd MMMM yyyy, HH:mm', { locale: ru })
                      : 'Не указан'
                    }
                  </span>
                </div>

                <Button
                  size="sm"
                  variant={isOverdue ? 'destructive' : 'default'}
                  onClick={() => handleCompleteTask(task.id)}
                  disabled={loading === task.id}
                >
                  {loading === task.id ? (
                    <>
                      <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Icon name="CheckCircle" size={16} className="mr-2" />
                      Выполнено
                    </>
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}