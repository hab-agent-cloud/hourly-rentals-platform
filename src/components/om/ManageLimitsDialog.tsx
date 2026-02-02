import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const FUNC_URL = 'https://functions.poehali.dev/1315f1c7-8ce1-4d90-bcac-6229acaa2a27';

interface Manager {
  id: number;
  name: string;
  email: string;
  manager_level: string;
  object_limit: number;
  subscription_days_limit: number;
  commission_percent: number;
  current_objects: number;
}

interface ManageLimitsDialogProps {
  omId: number;
  onSuccess?: () => void;
}

function getLevelEmoji(level: string) {
  switch(level) {
    case 'bronze': return '🥉';
    case 'silver': return '🥈';
    case 'gold': return '🥇';
    case 'platinum': return '💎';
    default: return '🥉';
  }
}

function getLevelName(level: string) {
  switch(level) {
    case 'bronze': return 'Бронзовый';
    case 'silver': return 'Серебряный';
    case 'gold': return 'Золотой';
    case 'platinum': return 'Платиновый';
    default: return 'Бронзовый';
  }
}

export default function ManageLimitsDialog({ omId, onSuccess }: ManageLimitsDialogProps) {
  const [open, setOpen] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingManager, setEditingManager] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{ objectLimit: number; daysLimit: number }>({ objectLimit: 0, daysLimit: 0 });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchManagers();
    }
  }, [open]);

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${FUNC_URL}?om_id=${omId}`);
      const data = await response.json();
      
      if (response.ok) {
        setManagers(data.managers || []);
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось загрузить менеджеров',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Ошибка',
        description: 'Ошибка при загрузке данных',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (manager: Manager) => {
    setEditingManager(manager.id);
    setEditValues({
      objectLimit: manager.object_limit,
      daysLimit: manager.subscription_days_limit
    });
  };

  const handleSave = async (managerId: number) => {
    try {
      const response = await fetch(FUNC_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          om_id: omId,
          manager_id: managerId,
          object_limit: editValues.objectLimit,
          subscription_days_limit: editValues.daysLimit
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Лимиты обновлены'
        });
        setEditingManager(null);
        fetchManagers();
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось обновить лимиты',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Ошибка',
        description: 'Ошибка при сохранении',
        variant: 'destructive'
      });
    }
  };

  const handleCancel = () => {
    setEditingManager(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Icon name="Settings" size={18} className="mr-2" />
          Управление лимитами
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Управление лимитами менеджеров</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Icon name="Loader2" size={32} className="animate-spin" />
          </div>
        ) : managers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
            <p>У вас пока нет менеджеров в команде</p>
          </div>
        ) : (
          <div className="space-y-3">
            {managers.map((manager) => (
              <Card key={manager.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{manager.name}</p>
                          <Badge variant="outline">
                            {getLevelEmoji(manager.manager_level)} {getLevelName(manager.manager_level)}
                          </Badge>
                          <Badge variant="secondary">
                            {manager.commission_percent}%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{manager.email}</p>
                      </div>
                      {editingManager !== manager.id && (
                        <Button size="sm" variant="outline" onClick={() => handleEdit(manager)}>
                          <Icon name="Edit" size={16} className="mr-1" />
                          Изменить
                        </Button>
                      )}
                    </div>

                    {editingManager === manager.id ? (
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                        <div>
                          <Label className="text-sm">Лимит объектов</Label>
                          <Input
                            type="number"
                            value={editValues.objectLimit}
                            onChange={(e) => setEditValues({ ...editValues, objectLimit: parseInt(e.target.value) || 0 })}
                            min="0"
                            className="mt-1"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Текущее: {manager.current_objects}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm">Лимит дней подписки</Label>
                          <Input
                            type="number"
                            value={editValues.daysLimit}
                            onChange={(e) => setEditValues({ ...editValues, daysLimit: parseInt(e.target.value) || 0 })}
                            min="0"
                            className="mt-1"
                          />
                        </div>
                        <div className="col-span-2 flex gap-2">
                          <Button size="sm" onClick={() => handleSave(manager.id)}>
                            <Icon name="Check" size={16} className="mr-1" />
                            Сохранить
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancel}>
                            <Icon name="X" size={16} className="mr-1" />
                            Отмена
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Объекты</p>
                          <p className="text-sm font-medium">
                            {manager.current_objects} / {manager.object_limit}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Лимит дней подписки</p>
                          <p className="text-sm font-medium">{manager.subscription_days_limit} дней</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Загрузка</p>
                          <p className="text-sm font-medium">
                            {manager.object_limit > 0 ? Math.round((manager.current_objects / manager.object_limit) * 100) : 0}%
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
