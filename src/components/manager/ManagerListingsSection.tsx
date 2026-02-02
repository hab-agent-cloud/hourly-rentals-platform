import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface ManagerListingsSectionProps {
  managerData: any;
  onFreezeListing: (listingId: number) => void;
  onUnfreezeListing: (listingId: number) => void;
}

export default function ManagerListingsSection({ 
  managerData, 
  onFreezeListing, 
  onUnfreezeListing 
}: ManagerListingsSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = managerData?.listings?.filter((listing: any) => {
    const query = searchQuery.toLowerCase();
    return listing.name?.toLowerCase().includes(query) || 
           listing.district?.toLowerCase().includes(query);
  }) || [];

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Мои объекты ({managerData.listings?.length || 0})</CardTitle>
            <div className="relative w-64">
              <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по адресу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredListings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Building" size={48} className="mx-auto mb-4 opacity-50" />
              <p>{searchQuery ? 'Объекты не найдены' : 'У вас пока нет объектов в сопровождении'}</p>
              <p className="text-sm mt-2">{searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Возьмите объект из списка свободных'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredListings.map((listing: any) => (
                <div 
                  key={listing.id}
                  className={`border rounded-lg p-4 ${
                    listing.urgency === 'critical' ? 'border-red-500 bg-red-50' :
                    listing.urgency === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                    'border-border'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {listing.photo && (
                      <img 
                        src={listing.photo} 
                        alt={listing.name}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <a 
                          href={`/?listing=${listing.id}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-semibold hover:text-primary underline-offset-2 hover:underline"
                        >
                          {listing.name}
                        </a>
                        <Badge variant={listing.status === 'frozen' ? 'secondary' : 'default'}>
                          {listing.status === 'frozen' ? '🧊 Заморожен' : '✅ Активен'}
                        </Badge>
                        {listing.urgency === 'critical' && (
                          <Badge variant="destructive">🔴 Критично!</Badge>
                        )}
                        {listing.urgency === 'warning' && (
                          <Badge variant="outline" className="border-yellow-600 text-yellow-700">
                            🟡 Скоро истечёт
                          </Badge>
                        )}
                        {listing.no_payments && (
                          <Badge variant="outline" className="border-blue-600 text-blue-700">
                            🆕 Нет пополнений
                          </Badge>
                        )}
                      </div>
                      {listing.district && (
                        <p className="text-sm text-muted-foreground mt-1">
                          📍 {listing.district}
                        </p>
                      )}
                      {listing.subscription_end && (
                        <p className="text-sm mt-1">
                          Подписка до: {new Date(listing.subscription_end).toLocaleDateString()}
                        </p>
                      )}
                      <div className="flex gap-2 mt-3">
                        {listing.status === 'active' ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onFreezeListing(listing.id)}
                          >
                            <Icon name="Snowflake" size={16} className="mr-1" />
                            Заморозить
                          </Button>
                        ) : listing.status === 'frozen' ? (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onUnfreezeListing(listing.id)}
                          >
                            <Icon name="Flame" size={16} className="mr-1" />
                            Разморозить
                          </Button>
                        ) : null}
                        {listing.owner_phone && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.location.href = `tel:${listing.owner_phone}`}
                          >
                            <Icon name="Phone" size={16} className="mr-1" />
                            Позвонить владельцу
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Icon name="Edit" size={16} className="mr-1" />
                          Редактировать
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {managerData.tasks && managerData.tasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Задачи от ОМ ({managerData.tasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {managerData.tasks.map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                    {task.deadline && (
                      <p className="text-xs text-muted-foreground mt-1">
                        До: {new Date(task.deadline).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Button size="sm">
                    <Icon name="Check" size={16} className="mr-1" />
                    Выполнено
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
