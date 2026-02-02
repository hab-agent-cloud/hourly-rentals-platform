import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface MessagesDialogProps {
  adminId: number;
  role: 'manager' | 'om' | 'um' | 'superadmin';
}

const FUNC_URL = 'https://functions.poehali.dev/TODO'; // TODO: создать функцию для сообщений

export default function MessagesDialog({ adminId, role }: MessagesDialogProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchMessages();
    }
  }, [open]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${FUNC_URL}?admin_id=${adminId}`);
      const data = await response.json();
      
      if (response.ok) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите текст сообщения',
        variant: 'destructive'
      });
      return;
    }

    setSending(true);
    try {
      const response = await fetch(FUNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin_id: adminId,
          message: newMessage
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Отправлено',
          description: 'Сообщение отправлено'
        });
        setNewMessage('');
        fetchMessages();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось отправить сообщение',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при отправке',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  const getRecipientLabel = () => {
    if (role === 'manager') return 'ОМ (офис-менеджер)';
    if (role === 'om') return 'УМ или суперадмин';
    return 'Вышестоящий руководитель';
  };

  const unreadCount = messages.filter(m => !m.is_read && m.is_incoming).length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Icon name="MessageCircle" size={16} className="sm:mr-2" />
          <span className="hidden sm:inline">Сообщения</span>
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Icon name="MessageCircle" size={20} className="sm:size-6" />
            <span className="truncate">Сообщения с {getRecipientLabel()}</span>
          </DialogTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Пишите вопросы, получайте задачи и уведомления
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* История сообщений */}
          <ScrollArea className="h-[300px] sm:h-[400px] border rounded-lg p-3 sm:p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Icon name="Loader2" size={32} className="animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="MessageCircle" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Нет сообщений</p>
                <p className="text-sm mt-2">Напишите первое сообщение</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg ${
                      msg.is_incoming 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-gray-50 border border-gray-200 ml-12'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Icon 
                          name={msg.is_incoming ? 'ArrowDown' : 'ArrowUp'} 
                          size={16}
                          className={msg.is_incoming ? 'text-blue-600' : 'text-gray-600'}
                        />
                        <span className="font-semibold text-sm">
                          {msg.is_incoming ? msg.sender_name : 'Вы'}
                        </span>
                        {!msg.is_read && msg.is_incoming && (
                          <Badge variant="destructive" className="text-xs">Новое</Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Форма отправки */}
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="Send" size={16} />
              <span>Отправить сообщение {getRecipientLabel()}</span>
            </div>
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Напишите ваше сообщение..."
              rows={3}
              disabled={sending}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {newMessage.length} / 1000 символов
              </span>
              <Button 
                onClick={handleSend}
                disabled={sending || !newMessage.trim()}
              >
                {sending ? (
                  <>
                    <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={18} className="mr-2" />
                    Отправить
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}