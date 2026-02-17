import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

interface BonusHistoryDialogProps {
  show: boolean;
  payoutHistory: PayoutRecord[];
  onClose: () => void;
  formatDate: (dateString: string | null) => string;
}

export default function BonusHistoryDialog({
  show,
  payoutHistory,
  onClose,
  formatDate,
}: BonusHistoryDialogProps) {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>История выплат</DialogTitle>
        </DialogHeader>
        {payoutHistory.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Выплат пока не было</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Сотрудник</TableHead>
                <TableHead className="text-right">Сумма</TableHead>
                <TableHead>Бонусов</TableHead>
                <TableHead>Кто выплатил</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutHistory.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="text-sm">{formatDate(record.created_at)}</TableCell>
                  <TableCell className="font-medium">{record.employee_name}</TableCell>
                  <TableCell className="text-right font-bold text-green-700">
                    {Number(record.amount).toLocaleString('ru-RU')} ₽
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{record.bonuses_closed}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {record.paid_by_name || '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
