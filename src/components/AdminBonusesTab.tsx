import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import BonusEmployeeCard from './bonuses/BonusEmployeeCard';
import BonusPaymentDialog from './bonuses/BonusPaymentDialog';
import BonusHistoryDialog from './bonuses/BonusHistoryDialog';
import BonusDetailsDialog from './bonuses/BonusDetailsDialog';

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

interface PayoutRecord {
  id: number;
  admin_id: number;
  amount: number;
  bonuses_closed: number;
  note: string | null;
  created_at: string;
  employee_name: string;
  paid_by_name: string;
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
  const [payAmount, setPayAmount] = useState('');
  const [showPayDialog, setShowPayDialog] = useState(false);
  const [payTarget, setPayTarget] = useState<BonusStat | null>(null);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [payoutHistory, setPayoutHistory] = useState<PayoutRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await api.getBonusStats(token);
      setStats(data);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Не удалось загрузить статистику';
      toast({ title: 'Ошибка', description: msg, variant: 'destructive' });
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
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Не удалось загрузить бонусы';
      toast({ title: 'Ошибка', description: msg, variant: 'destructive' });
    }
  };

  const fetchPayoutHistory = async () => {
    try {
      setHistoryLoading(true);
      const data = await api.getPayoutHistory(token);
      setPayoutHistory(data);
      setShowHistoryDialog(true);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Не удалось загрузить историю';
      toast({ title: 'Ошибка', description: msg, variant: 'destructive' });
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleMarkPaid = async () => {
    if (selectedBonusIds.length === 0) return;
    try {
      setIsProcessing(true);
      await api.markBonusesPaid(token, selectedBonusIds);
      toast({ title: 'Успешно', description: `Оплачено ${selectedBonusIds.length} бонусов` });
      if (selectedEmployee) await fetchEmployeeBonuses(selectedEmployee, showPaid);
      await fetchStats();
      setSelectedBonusIds([]);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Не удалось отметить как оплаченные';
      toast({ title: 'Ошибка', description: msg, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkUnpaid = async () => {
    if (selectedBonusIds.length === 0) return;
    try {
      setIsProcessing(true);
      await api.markBonusesUnpaid(token, selectedBonusIds);
      toast({ title: 'Успешно', description: `Отменена оплата ${selectedBonusIds.length} бонусов` });
      if (selectedEmployee) await fetchEmployeeBonuses(selectedEmployee, showPaid);
      await fetchStats();
      setSelectedBonusIds([]);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Не удалось отменить оплату';
      toast({ title: 'Ошибка', description: msg, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const openPayDialog = (employee: BonusStat) => {
    setPayTarget(employee);
    setPayAmount('');
    setShowPayDialog(true);
  };

  const handlePayAmount = async () => {
    if (!payTarget) return;
    const amount = parseFloat(payAmount);
    if (!amount || amount <= 0) {
      toast({ title: 'Ошибка', description: 'Введите корректную сумму', variant: 'destructive' });
      return;
    }
    if (amount > payTarget.unpaid_amount) {
      toast({ title: 'Ошибка', description: `Сумма не может превышать ${payTarget.unpaid_amount} ₽`, variant: 'destructive' });
      return;
    }
    try {
      setIsProcessing(true);
      await api.payBonusAmount(token, payTarget.id, amount);
      toast({ title: 'Успешно', description: `Выплачено ${amount.toLocaleString('ru-RU')} ₽ для ${payTarget.name}` });
      setShowPayDialog(false);
      await fetchStats();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Не удалось выполнить выплату';
      toast({ title: 'Ошибка', description: msg, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleBonusSelection = (bonusId: number) => {
    setSelectedBonusIds((prev) =>
      prev.includes(bonusId) ? prev.filter((id) => id !== bonusId) : [...prev, bonusId]
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
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
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
        <Button variant="outline" onClick={fetchPayoutHistory} disabled={historyLoading}>
          {historyLoading ? (
            <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
          ) : (
            <Icon name="History" size={16} className="mr-2" />
          )}
          История выплат
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Icon name="Loader2" size={48} className="animate-spin text-purple-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((employee) => (
            <BonusEmployeeCard
              key={employee.id}
              employee={employee}
              onPayClick={openPayDialog}
              onViewUnpaid={(emp) => fetchEmployeeBonuses(emp, false)}
              onViewHistory={(emp) => fetchEmployeeBonuses(emp, true)}
            />
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

      <BonusPaymentDialog
        show={showPayDialog}
        payTarget={payTarget}
        payAmount={payAmount}
        isProcessing={isProcessing}
        onClose={() => setShowPayDialog(false)}
        onPayAmountChange={setPayAmount}
        onPayConfirm={handlePayAmount}
      />

      <BonusHistoryDialog
        show={showHistoryDialog}
        payoutHistory={payoutHistory}
        onClose={() => setShowHistoryDialog(false)}
        formatDate={formatDate}
      />

      <BonusDetailsDialog
        show={showDetailsDialog}
        selectedEmployee={selectedEmployee}
        showPaid={showPaid}
        bonuses={bonuses}
        selectedBonusIds={selectedBonusIds}
        isProcessing={isProcessing}
        onClose={() => setShowDetailsDialog(false)}
        onToggleBonusSelection={toggleBonusSelection}
        onToggleAllBonuses={toggleAllBonuses}
        onMarkPaid={handleMarkPaid}
        onMarkUnpaid={handleMarkUnpaid}
        formatDate={formatDate}
      />
    </div>
  );
}
