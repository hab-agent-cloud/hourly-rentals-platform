import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const CHAT_URL = 'https://functions.poehali.dev/7e6abf41-4dc0-4997-afc4-cbc2ee8fec77';

interface Message {
  id: number;
  sender_type: 'owner' | 'manager';
  message: string;
  created_at: string;
  is_read: boolean;
}

interface ListingManagerChatProps {
  listingId: number;
  ownerId: number;
  ownerName: string;
}

export default function ListingManagerChat({ listingId, ownerId, ownerName }: ListingManagerChatProps) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const managerId = 1; // Здесь нужно получать ID текущего менеджера из контекста

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${CHAT_URL}?owner_id=${ownerId}`);
      const data = await response.json();
      
      if (data.messages) {
        setMessages(data.messages);
        
        const unread = data.messages.filter((m: any) => 
          m.sender_type === 'owner' && !m.is_read
        ).length;
        setUnreadCount(unread);
        
        // Если чат открыт, отмечаем сообщения как прочитанные
        if (showChat && unread > 0) {
          await fetch(CHAT_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              owner_id: ownerId,
              manager_id: managerId,
              mark_as_read_by: 'manager'
            })
          });
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки сообщений:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [ownerId, showChat]);

  useEffect(() => {
    if (showChat) {
      scrollToBottom();
    }
  }, [messages, showChat]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          owner_id: ownerId,
          manager_id: managerId,
          listing_id: listingId,
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
          description: 'Не удалось отправить сообщение',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при отправке',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon name="MessageCircle" size={24} />
              Чат с владельцем
            </CardTitle>
            <CardDescription>Общайтесь с {ownerName}</CardDescription>
          </div>
          <Button 
            onClick={() => setShowChat(!showChat)}
            variant={showChat ? "outline" : "default"}
            className="relative"
          >
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-0.5 text-xs">
                {unreadCount}
              </Badge>
            )}
            {showChat ? (
              <>
                <Icon name="X" size={16} className="mr-2" />
                Закрыть
              </>
            ) : (
              <>
                <Icon name="MessageCircle" size={16} className="mr-2" />
                {unreadCount > 0 ? `Открыть (${unreadCount})` : 'Открыть чат'}
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {showChat && (
        <CardContent>
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
            <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Icon name="Loader2" size={32} className="animate-spin text-blue-600" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Icon name="MessageCircle" size={48} className="text-gray-300 mb-3" />
                  <p className="text-gray-500 font-medium">Пока нет сообщений</p>
                  <p className="text-sm text-gray-400 mt-1">Начните диалог с владельцем</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_type === 'manager' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        msg.sender_type === 'manager'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-br-sm'
                          : 'bg-white border-2 border-gray-300 text-gray-900 rounded-bl-sm'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender_type === 'manager' ? 'text-blue-100' : 'text-gray-400'
                        }`}
                      >
                        {new Date(msg.created_at).toLocaleTimeString('ru-RU', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-white border-t-2 border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Введите сообщение..."
                  className="flex-1"
                  disabled={sending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                >
                  {sending ? (
                    <Icon name="Loader2" size={18} className="animate-spin" />
                  ) : (
                    <Icon name="Send" size={18} />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
