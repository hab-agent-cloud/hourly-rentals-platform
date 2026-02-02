import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ManagerCashSectionProps {
  paymentHistory: any;
}

export default function ManagerCashSection({ paymentHistory }: ManagerCashSectionProps) {
  if (!paymentHistory) return null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Касса</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentHistory.active_requests && paymentHistory.active_requests.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="Clock" size={18} />
                Активные заявки
              </h3>
              <div className="space-y-2">
                {paymentHistory.active_requests.map((req: any) => (
                  <div key={req.id} className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-950">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{req.amount} ₽</p>
                        <p className="text-sm text-muted-foreground">
                          {req.withdrawal_method === 'sbp' ? '💳 СБП' : 
                           req.withdrawal_method === 'card' ? '💳 Банковская карта' : 
                           '💼 Зарплатная карта'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Создана: {new Date(req.created_at).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={req.status === 'pending' ? 'secondary' : 'outline'}>
                        {req.status === 'pending' ? '⏳ В обработке' : '🔄 Обрабатывается'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {paymentHistory.history && paymentHistory.history.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Icon name="History" size={18} />
                История выплат
              </h3>
              <div className="space-y-2">
                {paymentHistory.history.map((payment: any) => (
                  <div key={payment.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{payment.paid_amount} ₽</p>
                          {payment.paid_amount < payment.requested_amount && (
                            <span className="text-xs text-muted-foreground">
                              (запрошено: {payment.requested_amount} ₽)
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {payment.withdrawal_method === 'sbp' ? '💳 СБП' : 
                           payment.withdrawal_method === 'card' ? '💳 Банковская карта' : 
                           '💼 Зарплатная карта'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(payment.processed_at).toLocaleString()}
                        </p>
                        {payment.processed_by_name && (
                          <p className="text-xs text-muted-foreground">
                            Выплатил: {payment.processed_by_name}
                          </p>
                        )}
                      </div>
                      <Badge variant="default" className="bg-green-600">
                        ✅ Оплачено
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {(!paymentHistory.active_requests || paymentHistory.active_requests.length === 0) && 
           (!paymentHistory.history || paymentHistory.history.length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Wallet" size={48} className="mx-auto mb-4 opacity-50" />
              <p>История выплат пуста</p>
              <p className="text-sm mt-2">Создайте заявку на вывод средств</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {(paymentHistory.om_name || paymentHistory.um_name) && (
        <Card>
          <CardHeader>
            <CardTitle>Моя команда</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {paymentHistory.om_name && (
              <div className="flex items-center gap-2">
                <Icon name="User" size={18} />
                <span className="text-sm">Оперативный менеджер: <strong>{paymentHistory.om_name}</strong></span>
              </div>
            )}
            {paymentHistory.um_name && (
              <div className="flex items-center gap-2">
                <Icon name="Crown" size={18} />
                <span className="text-sm">Управляющий менеджер: <strong>{paymentHistory.um_name}</strong></span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
