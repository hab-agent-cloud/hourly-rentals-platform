import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

interface BonusEmployeeCardProps {
  employee: BonusStat;
  onPayClick: (employee: BonusStat) => void;
  onViewUnpaid: (employee: BonusStat) => void;
  onViewHistory: (employee: BonusStat) => void;
}

export default function BonusEmployeeCard({
  employee,
  onPayClick,
  onViewUnpaid,
  onViewHistory,
}: BonusEmployeeCardProps) {
  return (
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
              {Number(employee.unpaid_amount).toLocaleString('ru-RU')} ₽
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Выплачено:</span>
            <span className="text-sm font-medium text-green-600">
              {Number(employee.paid_amount).toLocaleString('ru-RU')} ₽
            </span>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant="default"
              size="sm"
              className="flex-1 bg-gradient-to-r from-green-600 to-green-700"
              onClick={() => onPayClick(employee)}
              disabled={!employee.unpaid_amount || Number(employee.unpaid_amount) === 0}
            >
              <Icon name="Wallet" size={14} className="mr-1" />
              Выплатить
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewUnpaid(employee)}
            >
              <Icon name="List" size={14} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewHistory(employee)}
            >
              <Icon name="History" size={14} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
