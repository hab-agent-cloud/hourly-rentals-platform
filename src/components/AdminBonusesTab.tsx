import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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

interface BonusStat {
  id: number;
  name: string;
  email: string;
  total_bonuses: number;
  unpaid_amount: number;
  paid_amount: number;
  total_amount: number;
}

interface Bonus {
  id: number;
  admin_id: number;
  admin_name: string;
  entity_type: string;
  entity_id: number;
  entity_name: string;
  bonus_amount: number;
  is_paid: boolean;
  paid_at: string | null;
  paid_by_name: string | null;
  created_at: string;
  notes: string;
}

interface AdminBonusesTabProps {
  token: string;
}

export default function AdminBonusesTab({ token }: AdminBonusesTabProps) {
  const { toast } = useToast();
  const [stats, setStats] = useState<BonusStat[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<BonusStat | null>(null);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showPaid, setShowPaid] = useState(false);
  const [selectedBonusIds, setSelectedBonusIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await api.getBonusStats(token);
      setStats(data);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось загрузить статистику',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEmployeeBonuses = async (employee: BonusStat, showPaidBonuses: boolean) => {
    try {
      setSelectedEmployee(employee);
      setShowPaid(showPaidBonuses);
      const data = await api.getEmployeeBonuses(token, employee.id, showPaidBonuses);
      setBonuses(data);
      setSelectedBonusIds([]);
      setShowDetailsDialog(true);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось загрузить бонусы',
        variant: 'destructive',
      });
    }
  };

  const handleMarkPaid = async () => {
    if (selectedBonusIds.length === 0) return;

    try {
      setIsProcessing(true);
      await api.markBonusesPaid(token, selectedBonusIds);
      
      toast({
        title: 'Успешно',
        description: `Оплачено ${selectedBonusIds.length} бонусов`,
      });

      if (selectedEmployee) {
        await fetchEmployeeBonuses(selectedEmployee, showPaid);
      }
      await fetchStats();
      setSelectedBonusIds([]);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось отметить как оплаченные',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkUnpaid = async () => {
    if (selectedBonusIds.length === 0) return;

    try {
      setIsProcessing(true);
      await api.markBonusesUnpaid(token, selectedBonusIds);
      
      toast({
        title: 'Успешно',
        description: `Отменена оплата ${selectedBonusIds.length} бонусов`,
      });

      if (selectedEmployee) {
        await fetchEmployeeBonuses(selectedEmployee, showPaid);
      }
      await fetchStats();
      setSelectedBonusIds([]);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось отменить оплату',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleBonusSelection = (bonusId: number) => {
    setSelectedBonusIds((prev) =>
      prev.includes(bonusId)
        ? prev.filter((id) => id !== bonusId)
        : [...prev, bonusId]
    );
  };

  const toggleAllBonuses = () => {
    if (selectedBonusIds.length === bonuses.length) {
      setSelectedBonusIds([]);
    } else {
      setSelectedBonusIds(bonuses.map((b) => b.id));
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold">Выплаты бонусов</h2>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            {stats.length} сотрудников
          </Badge>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Icon name="Loader2" size={48} className="animate-spin text-purple-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((employee) => (
            <Card key={employee.id}>
              <CardHeader>
                <CardTitle className="text-xl">{employee.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{employee.email}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Всего бонусов:</span>
                    <Badge variant="outline">{employee.total_bonuses}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-red-600">К выплате:</span>
                    <span className="text-lg font-bold text-red-600">
                      {employee.unpaid_amount} ₽
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Выплачено:</span>
                    <span className="text-sm font-medium text-green-600">
                      {employee.paid_amount} ₽
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                      onClick={() => fetchEmployeeBonuses(employee, false)}
                    >
                      <Icon name="DollarSign" size={14} className="mr-1" />
                      К выплате
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fetchEmployeeBonuses(employee, true)}
                    >
                      <Icon name="History" size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {stats.length === 0 && !isLoading && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-2xl font-bold mb-2">Бонусов пока нет</h3>
          <p className="text-muted-foreground">
            Бонусы начисляются автоматически при добавлении объектов
          </p>
        </div>
      )}

      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedEmployee?.name} — {showPaid ? 'История выплат' : 'К выплате'}
            </DialogTitle>
          </DialogHeader>

          {bonuses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">
                {showPaid ? 'Выплат пока нет' : 'Нет бонусов к выплате'}
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {!showPaid && (
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedBonusIds.length === bonuses.length && bonuses.length > 0}
                          onCheckedChange={toggleAllBonuses}
                        />
                      </TableHead>
                    )}
                    <TableHead>Дата</TableHead>
                    <TableHead>Объект</TableHead>
                    <TableHead>Примечание</TableHead>
                    <TableHead className="text-right">Сумма</TableHead>
                    {showPaid && <TableHead>Оплачено</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bonuses.map((bonus) => (
                    <TableRow key={bonus.id}>
                      {!showPaid && (
                        <TableCell>
                          <Checkbox
                            checked={selectedBonusIds.includes(bonus.id)}
                            onCheckedChange={() => toggleBonusSelection(bonus.id)}
                          />
                        </TableCell>
                      )}
                      <TableCell className="text-sm">
                        {formatDate(bonus.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{bonus.entity_name}</div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {bonus.notes}
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {bonus.bonus_amount} ₽
                      </TableCell>
                      {showPaid && (
                        <TableCell className="text-sm">
                          <div>{formatDate(bonus.paid_at)}</div>
                          {bonus.paid_by_name && (
                            <div className="text-xs text-muted-foreground">
                              {bonus.paid_by_name}
                            </div>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <DialogFooter className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  {!showPaid && selectedBonusIds.length > 0 && (
                    <div className="text-sm font-medium">
                      Выбрано: {selectedBonusIds.length} ({' '}
                      {bonuses
                        .filter((b) => selectedBonusIds.includes(b.id))
                        .reduce((sum, b) => sum + b.bonus_amount, 0)}{' '}
                      ₽ )
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {!showPaid ? (
                    <Button
                      onClick={handleMarkPaid}
                      disabled={selectedBonusIds.length === 0 || isProcessing}
                      className="bg-gradient-to-r from-green-600 to-green-700"
                    >
                      <Icon name="Check" size={16} className="mr-2" />
                      Отметить оплаченными
                    </Button>
                  ) : (
                    <Button
                      onClick={handleMarkUnpaid}
                      disabled={selectedBonusIds.length === 0 || isProcessing}
                      variant="outline"
                    >
                      <Icon name="X" size={16} className="mr-2" />
                      Отменить оплату
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
