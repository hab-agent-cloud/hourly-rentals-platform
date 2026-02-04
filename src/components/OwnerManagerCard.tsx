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
        <CardContent className="py-4">
          <div className="text-center">
            <Icon name="Loader2" size={24} className="animate-spin mx-auto mb-1 text-blue-600" />
            <p className="text-xs text-muted-foreground">Загрузка...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasManager = !!manager;

  return (
    <>
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-2 rounded-lg">
              <Icon name="UserCircle" size={20} className="text-white" />
            </div>
            <div>
              <CardTitle className="text-base">Ваш менеджер</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="bg-white rounded-lg p-3 border border-blue-200">
            {hasManager ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-1.5 rounded-full">
                      <Icon name="User" size={16} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-blue-900">{manager.name}</h3>
                      {manager.phone && (
                        <a 
                          href={`tel:${manager.phone}`}
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Icon name="Phone" size={12} />
                          {manager.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                
                <Button
                  onClick={() => setShowChat(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium"
                  size="sm"
                >
                  <Icon name="MessageCircle" size={16} className="mr-1" />
                  Написать
                  {unreadCount > 0 && (
                    <Badge className="ml-1 bg-white text-blue-600 text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-blue-100 p-1.5 rounded-full">
                    <Icon name="UserPlus" size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-blue-900">Менеджер не назначен</h3>
                  </div>
                </div>
                
                <Button
                  onClick={() => window.location.href = 'tel:88001234567'}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium"
                  size="sm"
                >
                  <Icon name="Phone" size={16} className="mr-1" />
                  8-800-123-45-67
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {showChat && hasManager && (
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