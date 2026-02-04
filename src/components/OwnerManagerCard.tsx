import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import OwnerManagerChat from '@/components/OwnerManagerChat';

const CHAT_URL = 'https://functions.poehali.dev/7e6abf41-4dc0-4997-afc4-cbc2ee8fec77';

interface Manager {
  id: number;
  name: string;
  phone?: string;
}

interface OwnerManagerCardProps {
  ownerId: number;
}

export default function OwnerManagerCard({ ownerId }: OwnerManagerCardProps) {
  const [manager, setManager] = useState<Manager | null>(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchManagerInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${CHAT_URL}?owner_id=${ownerId}`);
      const data = await response.json();
      
      if (data.manager) {
        setManager(data.manager);
      }
      
      if (data.messages) {
        const unread = data.messages.filter((m: any) => 
          m.sender_type === 'manager' && !m.is_read
        ).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Ошибка загрузки информации о менеджере:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ownerId) {
      fetchManagerInfo();
    }
  }, [ownerId]);

  if (loading) {
    return (
      <Card className="border-blue-200 bg-gradient-to-br from-white to-blue-50">
        <CardContent className="py-8">
          <div className="text-center">
            <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-muted-foreground">Загрузка...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!manager) {
    return null;
  }

  return (
    <>
      <Card className="border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg hover:shadow-xl transition-all">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-3 rounded-xl shadow-md">
              <Icon name="UserCircle" size={28} className="text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Ваш личный менеджер</CardTitle>
              <CardDescription>Всегда готов помочь вам</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white rounded-xl p-4 border-2 border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Icon name="User" size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-blue-900">{manager.name}</h3>
                  {manager.phone && (
                    <a 
                      href={`tel:${manager.phone}`}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Icon name="Phone" size={14} />
                      {manager.phone}
                    </a>
                  )}
                </div>
              </div>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount} нов.
                </Badge>
              )}
            </div>
            
            <Button
              onClick={() => setShowChat(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              size="lg"
            >
              <Icon name="MessageCircle" size={20} className="mr-2" />
              Написать сообщение
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-white text-blue-600">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>
          
          <div className="bg-blue-100 border-2 border-blue-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={18} className="text-blue-600 mt-0.5" />
              <p className="text-xs text-blue-900">
                Ваш менеджер поможет с настройкой объекта, продвижением и ответит на все вопросы
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {showChat && manager && (
        <OwnerManagerChat
          ownerId={ownerId}
          managerId={manager.id}
          managerName={manager.name}
          onClose={() => {
            setShowChat(false);
            fetchManagerInfo();
          }}
        />
      )}
    </>
  );
}
