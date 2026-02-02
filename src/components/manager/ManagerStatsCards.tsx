import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Icon from '@/components/ui/icon';

interface ManagerStatsCardsProps {
  managerData: any;
  onWithdraw: (
    amount: string,
    method: 'sbp' | 'card' | 'salary',
    data: { phone: string; cardNumber: string; recipientName: string; bankName: string }
  ) => void;
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

export default function ManagerStatsCards({ managerData, onWithdraw }: ManagerStatsCardsProps) {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'sbp' | 'card' | 'salary'>('sbp');
  const [withdrawData, setWithdrawData] = useState({
    phone: '',
    cardNumber: '',
    recipientName: '',
    bankName: ''
  });

  const handleWithdrawClick = () => {
    onWithdraw(withdrawAmount, withdrawMethod, withdrawData);
    setWithdrawAmount('');
    setWithdrawData({ phone: '', cardNumber: '', recipientName: '', bankName: '' });
    setWithdrawDialogOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Баланс
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{managerData.balance || 0} ₽</div>
          <p className="text-xs text-muted-foreground mt-1">
            За месяц: +{managerData.month_commission || 0} ₽
          </p>
          <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="w-full mt-3" variant="outline">
                <Icon name="ArrowDownToLine" size={14} className="mr-1" />
                Вывести
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Вывод средств</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Доступно: {managerData.balance} ₽</Label>
                  <Input
                    type="number"
                    placeholder="Введите сумму"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    min="0"
                    max={managerData.balance}
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-3 block">Способ вывода</Label>
                  <RadioGroup value={withdrawMethod} onValueChange={(v) => setWithdrawMethod(v as any)}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="sbp" id="sbp" />
                      <Label htmlFor="sbp" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Icon name="Smartphone" size={18} />
                          <span className="font-medium">СБП</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Быстрый перевод по номеру телефона</p>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Icon name="CreditCard" size={18} />
                          <span className="font-medium">Банковская карта</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Перевод на карту любого банка</p>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer">
                      <RadioGroupItem value="salary" id="salary" />
                      <Label htmlFor="salary" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Icon name="Briefcase" size={18} />
                          <span className="font-medium">Зарплатная карта</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Корпоративная карта компании</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {withdrawMethod === 'sbp' && (
                  <div className="space-y-3 p-3 border rounded-lg bg-accent/50">
                    <div>
                      <Label className="text-sm mb-1 block">Номер телефона</Label>
                      <Input
                        type="tel"
                        placeholder="+7 900 123-45-67"
                        value={withdrawData.phone}
                        onChange={(e) => setWithdrawData({ ...withdrawData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-1 block">Номер карты</Label>
                      <Input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={withdrawData.cardNumber}
                        onChange={(e) => setWithdrawData({ ...withdrawData, cardNumber: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-1 block">Имя получателя</Label>
                      <Input
                        type="text"
                        placeholder="Иван Иванов"
                        value={withdrawData.recipientName}
                        onChange={(e) => setWithdrawData({ ...withdrawData, recipientName: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                
                {withdrawMethod === 'card' && (
                  <div className="space-y-3 p-3 border rounded-lg bg-accent/50">
                    <div>
                      <Label className="text-sm mb-1 block">Номер банковской карты</Label>
                      <Input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={withdrawData.cardNumber}
                        onChange={(e) => setWithdrawData({ ...withdrawData, cardNumber: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-1 block">Имя и фамилия</Label>
                      <Input
                        type="text"
                        placeholder="Иван Иванов"
                        value={withdrawData.recipientName}
                        onChange={(e) => setWithdrawData({ ...withdrawData, recipientName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-1 block">Наименование банка</Label>
                      <Input
                        type="text"
                        placeholder="Сбербанк"
                        value={withdrawData.bankName}
                        onChange={(e) => setWithdrawData({ ...withdrawData, bankName: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                
                {withdrawMethod === 'salary' && (
                  <div className="space-y-3 p-3 border rounded-lg bg-accent/50">
                    <div>
                      <Label className="text-sm mb-1 block">Номер зарплатной карты</Label>
                      <Input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={withdrawData.cardNumber}
                        onChange={(e) => setWithdrawData({ ...withdrawData, cardNumber: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Корпоративная карта будет сохранена в вашем профиле</p>
                    </div>
                  </div>
                )}
                
                <Button onClick={handleWithdrawClick} className="w-full">
                  <Icon name="Check" size={16} className="mr-2" />
                  Вывести {withdrawAmount ? `${withdrawAmount} ₽` : 'сумму'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Объектов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {managerData.objects_count || 0} / {managerData.object_limit}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Уровень: {getLevelEmoji(managerData.manager_level)} {getLevelName(managerData.manager_level)}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Комиссия
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{managerData.commission_percent}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            От подписок и продвижений
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Предупреждения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {managerData.warnings_count} / 3
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {managerData.warnings_count === 0 ? 'Всё отлично!' : 'Будьте осторожны'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
