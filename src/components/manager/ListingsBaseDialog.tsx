import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ListingsBaseDialogProps {
  show: boolean;
  onClose: () => void;
  listings: any[];
  onFreezeListing: (listingId: number) => void;
  onUnfreezeListing: (listingId: number) => void;
}

export default function ListingsBaseDialog({
  show,
  onClose,
  listings,
  onFreezeListing,
  onUnfreezeListing,
}: ListingsBaseDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredListings = listings.filter((listing: any) => {
    const query = searchQuery.toLowerCase();
    return listing.name?.toLowerCase().includes(query) || 
           listing.district?.toLowerCase().includes(query);
  });

  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Icon name="Database" size={28} className="text-purple-600" />
            База объектов ({listings.length})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию или району..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-[60vh] pr-4">
            {filteredListings.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="Building" size={48} className="mx-auto mb-4 opacity-50" />
                <p>{searchQuery ? 'Объекты не найдены' : 'У вас пока нет объектов в сопровождении'}</p>
                <p className="text-sm mt-2">{searchQuery ? 'Попробуйте изменить поисковый запрос' : 'Возьмите объект из списка свободных'}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredListings.map((listing: any) => (
                  <div 
                    key={listing.id}
                    className={`border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
                      listing.urgency === 'critical' ? 'border-red-500 bg-red-50' :
                      listing.urgency === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                      'border-border bg-white'
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
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
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
                          <p className="text-sm text-muted-foreground mb-1">
                            📍 {listing.district}
                          </p>
                        )}
                        {listing.subscription_end && (
                          <p className="text-sm text-muted-foreground mb-3">
                            Подписка до: {new Date(listing.subscription_end).toLocaleDateString()}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
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
                              Позвонить
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(`/listing/${listing.id}/edit`, '_blank')}
                          >
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
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
