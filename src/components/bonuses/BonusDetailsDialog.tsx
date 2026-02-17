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

interface BonusDetailsDialogProps {
  show: boolean;
  selectedEmployee: BonusStat | null;
  showPaid: boolean;
  bonuses: Bonus[];
  selectedBonusIds: number[];
  isProcessing: boolean;
  onClose: () => void;
  onToggleBonusSelection: (bonusId: number) => void;
  onToggleAllBonuses: () => void;
  onMarkPaid: () => void;
  onMarkUnpaid: () => void;
  formatDate: (dateString: string | null) => string;
}

export default function BonusDetailsDialog({
  show,
  selectedEmployee,
  showPaid,
  bonuses,
  selectedBonusIds,
  isProcessing,
  onClose,
  onToggleBonusSelection,
  onToggleAllBonuses,
  onMarkPaid,
  onMarkUnpaid,
  formatDate,
}: BonusDetailsDialogProps) {
  return (
    <Dialog open={show} onOpenChange={onClose}>
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
                        onCheckedChange={onToggleAllBonuses}
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
                          onCheckedChange={() => onToggleBonusSelection(bonus.id)}
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
                      {Number(bonus.bonus_amount).toLocaleString('ru-RU')} ₽
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
                      .reduce((sum, b) => sum + Number(b.bonus_amount), 0)
                      .toLocaleString('ru-RU')}{' '}
                    ₽ )
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {!showPaid ? (
                  <Button
                    onClick={onMarkPaid}
                    disabled={selectedBonusIds.length === 0 || isProcessing}
                    className="bg-gradient-to-r from-green-600 to-green-700"
                  >
                    <Icon name="Check" size={16} className="mr-2" />
                    Отметить оплаченными
                  </Button>
                ) : (
                  <Button
                    onClick={onMarkUnpaid}
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
  );
}
