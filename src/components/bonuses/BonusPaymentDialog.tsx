import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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

interface BonusPaymentDialogProps {
  show: boolean;
  payTarget: BonusStat | null;
  payAmount: string;
  isProcessing: boolean;
  onClose: () => void;
  onPayAmountChange: (value: string) => void;
  onPayConfirm: () => void;
}

export default function BonusPaymentDialog({
  show,
  payTarget,
  payAmount,
  isProcessing,
  onClose,
  onPayAmountChange,
  onPayConfirm,
}: BonusPaymentDialogProps) {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Выплата — {payTarget?.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Задолженность:</span>
            <span className="font-bold text-red-600 text-lg">
              {Number(payTarget?.unpaid_amount || 0).toLocaleString('ru-RU')} ₽
            </span>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Сумма к выплате (₽)</label>
            <Input
              type="number"
              placeholder="Введите сумму"
              value={payAmount}
              onChange={(e) => onPayAmountChange(e.target.value)}
              min={1}
              max={payTarget?.unpaid_amount || 0}
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            {[0.25, 0.5, 1].map((fraction) => {
              const val = Math.floor(Number(payTarget?.unpaid_amount || 0) * fraction);
              if (val <= 0) return null;
              return (
                <Button
                  key={fraction}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => onPayAmountChange(String(val))}
                >
                  {fraction === 1 ? 'Всё' : `${fraction * 100}%`}
                </Button>
              );
            })}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button
            onClick={onPayConfirm}
            disabled={isProcessing || !payAmount || parseFloat(payAmount) <= 0}
            className="bg-gradient-to-r from-green-600 to-green-700"
          >
            {isProcessing ? (
              <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
            ) : (
              <Icon name="Check" size={16} className="mr-2" />
            )}
            Выплатить {payAmount ? `${parseFloat(payAmount).toLocaleString('ru-RU')} ₽` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
