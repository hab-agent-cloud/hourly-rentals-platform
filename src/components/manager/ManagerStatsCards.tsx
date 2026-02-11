import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Icon from '@/components/ui/icon';
import { motion } from 'framer-motion';

interface ManagerData {
  balance?: number;
  month_commission?: number;
  copywriter_earnings?: string | number;
  total_owner_payments?: number;
  manager_level?: string;
}

interface ManagerStatsCardsProps {
  managerData: ManagerData;
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

  const getLevelGradient = (level: string) => {
    switch(level) {
      case 'bronze': return 'from-amber-700 via-orange-600 to-amber-700';
      case 'silver': return 'from-gray-400 via-gray-300 to-gray-400';
      case 'gold': return 'from-yellow-400 via-amber-300 to-yellow-400';
      case 'platinum': return 'from-cyan-400 via-blue-400 to-purple-400';
      default: return 'from-amber-700 via-orange-600 to-amber-700';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <motion.div 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Icon name="Wallet" size={20} className="text-white" />
              </motion.div>
              💰 Баланс
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {managerData.balance || 0} ₽
            </motion.div>
            <div className="space-y-1 mt-2">
              <p className="text-xs font-semibold text-green-600 flex items-center gap-1">
                <Icon name="TrendingUp" size={12} />
                За месяц: +{managerData.month_commission || 0} ₽
              </p>
              {managerData.copywriter_earnings !== undefined && managerData.copywriter_earnings !== null && (
                <p className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                  <Icon name="FileText" size={12} />
                  Копирайтер: {parseFloat(String(managerData.copywriter_earnings)).toFixed(0)} ₽
                </p>
              )}
            </div>
          <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="w-full mt-3" variant="outline">
                <Icon name="ArrowDownToLine" size={14} className="mr-1" />
                Вывести
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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
                  <RadioGroup value={withdrawMethod} onValueChange={(v) => setWithdrawMethod(v as 'sbp' | 'card' | 'salary')}>
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
                    </div>
                  </div>
                )}
                
                <Button onClick={handleWithdrawClick} className="w-full">
                  <Icon name="Send" size={16} className="mr-2" />
                  Отправить заявку
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
      </motion.div>
      
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Icon name="Building" size={16} className="text-blue-600" />
            </div>
            Объекты
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">{managerData.objects_count || 0} / {managerData.object_limit || 200}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Доступно: {(managerData.object_limit || 200) - (managerData.objects_count || 0)}
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Icon name="Award" size={16} className="text-amber-600" />
            </div>
            Уровень
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">{getLevelEmoji(managerData.level)}</span>
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{getLevelName(managerData.level)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Ставка: {managerData.commission_percent}%
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <Icon name="Percent" size={16} className="text-purple-600" />
            </div>
            Комиссия
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold text-purple-600">{managerData.commission_percent || 0}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            От пополнений объектов
          </p>
        </CardContent>
      </Card>
    </div>
  );
}