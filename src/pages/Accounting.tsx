import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const FUNC_URL = 'https://functions.poehali.dev/359ed3ad-7f46-4e49-bd1c-c9661b096ac5';

export default function Accounting() {
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [paidAmount, setPaidAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const [pendingRes, historyRes] = await Promise.all([
        fetch(`${FUNC_URL}?action=pending`),
        fetch(`${FUNC_URL}?action=history`)
      ]);
      
      const pendingData = await pendingRes.json();
      const historyData = await historyRes.json();
      
      setPendingRequests(pendingData.requests || []);
      setPaymentHistory(historyData.history || []);
    } catch (error) {
      console.error('[ACCOUNTING] Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleProcessRequest = async (requestId: number, action: 'approve' | 'reject') => {
    if (action === 'approve' && !paidAmount) {
      toast({
        title: 'Ошибка',
        description: 'Укажите сумму выплаты',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const decoded = JSON.parse(atob(token!.split('.')[1]));
      const adminId = decoded.admin_id;
      
      const response = await fetch(FUNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: requestId,
          action,
          paid_amount: action === 'approve' ? parseFloat(paidAmount) : undefined,
          admin_id: adminId,
          payment_note: paymentNote
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: 'Успешно',
          description: data.message
        });
        
        setProcessingId(null);
        setPaidAmount('');
        setPaymentNote('');
        fetchData();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при обработке заявки',
        variant: 'destructive'
      });
    }
  };
  
  const getMethodName = (method: string) => {
    const names: Record<string, string> = {
      'sbp': 'СБП',
      'card': 'Банковская карта',
      'salary': 'Зарплатная карта'
    };
    return names[method] || method;
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <Icon name="Loader2" size={48} className="animate-spin" />
    </div>;
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Бухгалтерия</h1>
          <p className="text-muted-foreground mt-1">Управление выплатами менеджерам</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin')}>
          <Icon name="ArrowLeft" size={18} className="mr-2" />
          Назад
        </Button>
      </div>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="pending">
            Заявки ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            История
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Icon name="CheckCircle" size={48} className="text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">Нет заявок на обработку</p>
              </CardContent>
            </Card>
          ) : (
            pendingRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{request.manager_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{request.manager_email}</p>
                    </div>
                    <Badge variant={request.status === 'pending' ? 'secondary' : 'default'}>
                      {request.status === 'pending' ? 'Новая' : 'В обработке'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Сумма к выводу</Label>
                      <p className="text-2xl font-bold">{request.amount} ₽</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Баланс менеджера</Label>
                      <p className="text-lg font-semibold">{request.manager_balance} ₽</p>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground">Способ вывода</Label>
                    <p className="text-sm font-medium">{getMethodName(request.withdrawal_method)}</p>
                  </div>
                  
                  {request.withdrawal_method === 'sbp' && (
                    <div className="space-y-2 p-3 bg-accent rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Телефон:</span>
                        <span className="text-sm font-medium">{request.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Карта:</span>
                        <span className="text-sm font-medium">{request.card_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Получатель:</span>
                        <span className="text-sm font-medium">{request.recipient_name}</span>
                      </div>
                    </div>
                  )}
                  
                  {request.withdrawal_method === 'card' && (
                    <div className="space-y-2 p-3 bg-accent rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Карта:</span>
                        <span className="text-sm font-medium">{request.card_number}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Получатель:</span>
                        <span className="text-sm font-medium">{request.recipient_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Банк:</span>
                        <span className="text-sm font-medium">{request.bank_name}</span>
                      </div>
                    </div>
                  )}
                  
                  {request.withdrawal_method === 'salary' && (
                    <div className="space-y-2 p-3 bg-accent rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Зарплатная карта:</span>
                        <span className="text-sm font-medium">{request.card_number}</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    Создана: {new Date(request.created_at).toLocaleString()}
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={() => { setProcessingId(request.id); setPaidAmount(request.amount.toString()); }}>
                        <Icon name="Check" size={16} className="mr-2" />
                        Обработать заявку
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Обработка заявки №{request.id}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label>Запрошено к выводу</Label>
                          <Input value={`${request.amount} ₽`} disabled />
                        </div>
                        <div>
                          <Label>Сумма к выплате</Label>
                          <Input
                            type="number"
                            placeholder="Введите сумму"
                            value={paidAmount}
                            onChange={(e) => setPaidAmount(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Примечание (опционально)</Label>
                          <Textarea
                            placeholder="Комментарий к выплате"
                            value={paymentNote}
                            onChange={(e) => setPaymentNote(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleProcessRequest(request.id, 'approve')}
                            className="flex-1"
                          >
                            <Icon name="CheckCircle" size={16} className="mr-2" />
                            Оплатить
                          </Button>
                          <Button 
                            onClick={() => handleProcessRequest(request.id, 'reject')}
                            variant="destructive"
                            className="flex-1"
                          >
                            <Icon name="XCircle" size={16} className="mr-2" />
                            Отклонить
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4 mt-6">
          {paymentHistory.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Icon name="History" size={48} className="text-muted-foreground mb-4" />
                <p className="text-lg text-muted-foreground">История пуста</p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {paymentHistory.map((payment) => (
                    <div key={payment.id} className="p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold">{payment.manager_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(payment.processed_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">+{payment.paid_amount} ₽</p>
                          <p className="text-xs text-muted-foreground">
                            Запрошено: {payment.requested_amount} ₽
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{getMethodName(payment.withdrawal_method)}</span>
                        <span>•</span>
                        <span>Обработал: {payment.processed_by_name || 'Система'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}