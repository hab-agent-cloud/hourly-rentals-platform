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
      <div className="w-full sm:w-[320px]">
        <Card className="border-blue-200 bg-gradient-to-br from-white to-blue-50">
          <CardContent className="py-3">
            <div className="text-center">
              <Icon name="Loader2" size={20} className="animate-spin mx-auto mb-1 text-blue-600" />
              <p className="text-xs text-muted-foreground">Загрузка...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasManager = !!manager;
  const displayManager = manager || { id: 0, name: 'Поддержка' };

  return (
    <>
      <div className="w-full sm:w-[320px]">
        <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="bg-white rounded-xl p-3 border-2 border-blue-200 shadow-sm">
            {true ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-2 rounded-full shadow-md">
                      <Icon name="User" size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <Icon name="Headphones" size={14} className="text-blue-600" />
                        <span className="text-xs font-medium text-blue-600">{hasManager ? 'Ваш менеджер' : 'Поддержка'}</span>
                      </div>
                      <h3 className="font-bold text-sm text-blue-900">{displayManager.name}</h3>
                      {displayManager.phone && (
                        <a 
                          href={`tel:${displayManager.phone}`}
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                        >
                          <Icon name="Phone" size={12} />
                          {displayManager.phone}
                        </a>
                      )}
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white text-xs animate-pulse shadow-lg">
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                
                <Button
                  onClick={() => setShowChat(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold shadow-md hover:shadow-lg transition-all"
                  size="sm"
                >
                  <Icon name="MessageCircle" size={16} className="mr-1" />
                  Написать
                  {unreadCount > 0 && (
                    <Badge className="ml-2 bg-white text-blue-600 text-xs font-bold">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </>
            ) : (
              <></>
            )}
            </div>
          </CardContent>
        </Card>
      </div>

      {showChat && (
        <OwnerManagerChat
          ownerId={ownerId}
          managerId={displayManager.id}
          managerName={displayManager.name}
          onClose={() => {
            setShowChat(false);
            fetchManagerInfo();
          }}
        />
      )}
    </>
  );
}