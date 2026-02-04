import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface OwnersMessagesDialogProps {
  adminId: number;
}

const CHAT_URL = 'https://functions.poehali.dev/7e6abf41-4dc0-4997-afc4-cbc2ee8fec77';
const OWNER_LISTINGS_URL = 'https://functions.poehali.dev/f431775b-031f-4417-b3eb-9e0475119162';

interface Owner {
  id: number;
  full_name: string;
  unread_count: number;
}

interface Message {
  id: number;
  sender_type: 'owner' | 'manager';
  message: string;
  created_at: string;
  is_read: boolean;
}

export default function OwnersMessagesDialog({ adminId }: OwnersMessagesDialogProps) {
  const [open, setOpen] = useState(false);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchOwners();
    }
  }, [open]);

  useEffect(() => {
    if (selectedOwner) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedOwner]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchOwners = async () => {
    setLoading(true);
    try {
      // Получаем список объектов менеджера
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${OWNER_LISTINGS_URL}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const listings = await response.json();
      
      // Группируем по владельцам
      const ownersMap = new Map<number, Owner>();
      
      for (const listing of listings) {
        if (listing.owner_id && listing.owner_name) {
          if (!ownersMap.has(listing.owner_id)) {
            ownersMap.set(listing.owner_id, {
              id: listing.owner_id,
              full_name: listing.owner_name,
              unread_count: 0
            });
          }
        }
      }
      
      // Получаем количество непрочитанных сообщений для каждого владельца
      for (const owner of ownersMap.values()) {
        try {
          const chatResponse = await fetch(`${CHAT_URL}?owner_id=${owner.id}`);
          const chatData = await chatResponse.json();
          
          if (chatData.messages) {
            const unread = chatData.messages.filter((m: any) => 
              m.sender_type === 'owner' && !m.is_read
            ).length;
            owner.unread_count = unread;
          }
        } catch (error) {
          console.error(`Ошибка загрузки чата для владельца ${owner.id}:`, error);
        }
      }
      
      setOwners(Array.from(ownersMap.values()));
    } catch (error) {
      console.error('Ошибка загрузки владельцев:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedOwner) return;
    
    try {
      const response = await fetch(`${CHAT_URL}?owner_id=${selectedOwner.id}`);
      const data = await response.json();
      
      if (data.messages) {
        setMessages(data.messages);
        
        // Отмечаем сообщения как прочитанные
        const unread = data.messages.filter((m: any) => 
          m.sender_type === 'owner' && !m.is_read
        ).length;
        
        if (unread > 0) {
          await fetch(CHAT_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              owner_id: selectedOwner.id,
              manager_id: adminId,
              mark_as_read_by: 'manager'
            })
          });
          
          // Обновляем счетчик непрочитанных
          setOwners(owners.map(o => 
            o.id === selectedOwner.id ? { ...o, unread_count: 0 } : o
          ));
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedOwner) return;

    setSending(true);
    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_id: selectedOwner.id,
          manager_id: adminId,
          sender_type: 'manager',
          message: newMessage.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
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

  const totalUnread = owners.reduce((sum, o) => sum + o.unread_count, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Icon name="Users" size={16} className="sm:mr-2" />
          <span className="hidden sm:inline">Сообщения владельцам</span>
          {totalUnread > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {totalUnread}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] w-[95vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Users" size={24} />
            Переписка с владельцами объектов
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4 h-[600px]">
          {/* Список владельцев */}
          <div className="w-1/3 border-r pr-4">
            <ScrollArea className="h-full">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Icon name="Loader2" size={32} className="animate-spin" />
                </div>
              ) : owners.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Нет владельцев в сопровождении</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {owners.map((owner) => (
                    <button
                      key={owner.id}
                      onClick={() => setSelectedOwner(owner)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedOwner?.id === owner.id
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon name="User" size={16} />
                          <span className="font-medium">{owner.full_name}</span>
                        </div>
                        {owner.unread_count > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {owner.unread_count}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Чат */}
          <div className="flex-1 flex flex-col">
            {selectedOwner ? (
              <>
                <div className="mb-4 pb-3 border-b">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Icon name="MessageCircle" size={20} />
                    {selectedOwner.full_name}
                  </h3>
                </div>

                <ScrollArea className="flex-1 mb-4 border rounded-lg p-4">
                  {messages.length === 0 ? (
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
                            msg.sender_type === 'manager'
                              ? 'bg-blue-100 ml-12'
                              : 'bg-gray-100 mr-12'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-xs font-medium">
                              {msg.sender_type === 'manager' ? 'Вы' : selectedOwner.full_name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(msg.created_at).toLocaleString('ru-RU')}
                            </span>
                          </div>
                          <p className="text-sm">{msg.message}</p>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Введите сообщение..."
                    onKeyPress={(e) => e.key === 'Enter' && !sending && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} disabled={sending || !newMessage.trim()}>
                    {sending ? (
                      <Icon name="Loader2" size={16} className="animate-spin" />
                    ) : (
                      <Icon name="Send" size={16} />
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Icon name="MessageCircle" size={64} className="mx-auto mb-4 opacity-50" />
                  <p>Выберите владельца для переписки</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
