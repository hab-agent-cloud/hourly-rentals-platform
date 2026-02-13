import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ScrollArea } from '@/components/ui/scroll-area';

interface InactiveListing {
  id: number;
  name: string;
  district?: string;
  status: string;
  photo?: string;
  owner_phone?: string;
  inactive_at?: string;
  inactive_reason?: string;
}

interface InactiveListingsSectionProps {
  inactiveListings: InactiveListing[];
}

function InactiveTimer({ inactiveAt }: { inactiveAt: string }) {
  const [elapsed, setElapsed] = useState('');

  useEffect(() => {
    const calc = () => {
      const start = new Date(inactiveAt).getTime();
      const now = Date.now();
      const diff = now - start;

      if (diff < 0) { setElapsed('только что'); return; }

      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);

      const parts: string[] = [];
      if (days > 0) parts.push(`${days}д`);
      if (hours > 0) parts.push(`${hours}ч`);
      if (minutes > 0 && days === 0) parts.push(`${minutes}м`);
      setElapsed(parts.join(' ') || 'менее минуты');
    };

    calc();
    const interval = setInterval(calc, 60000);
    return () => clearInterval(interval);
  }, [inactiveAt]);

  return (
    <div className="flex items-center gap-2 text-red-600">
      <Icon name="Clock" size={16} className="animate-pulse" />
      <span className="text-sm font-semibold">Неактивно {elapsed}</span>
    </div>
  );
}

export default function InactiveListingsSection({ inactiveListings }: InactiveListingsSectionProps) {
  const [search, setSearch] = useState('');

  const filtered = inactiveListings.filter((l) => {
    const q = search.toLowerCase();
    return l.name?.toLowerCase().includes(q) || l.district?.toLowerCase().includes(q);
  });

  return (
    <Card className="shadow-lg border-2 border-red-200 bg-gradient-to-br from-white via-red-50/30 to-orange-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Icon name="Ban" size={24} className="text-red-600" />
          <span className="text-xl font-bold text-red-700">
            Неактивные объекты ({inactiveListings.length})
          </span>
        </CardTitle>
        <div className="relative mt-3">
          <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию или району..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Icon name="CheckCircle" size={48} className="mx-auto mb-4 opacity-50 text-green-500" />
            <p className="text-lg font-medium">{search ? 'Ничего не найдено' : 'Нет неактивных объектов'}</p>
            <p className="text-sm mt-1">Все объекты в работе</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[65vh] pr-2">
            <div className="space-y-3">
              {filtered.map((listing) => (
                <div
                  key={listing.id}
                  className="border-2 border-red-200 rounded-lg p-4 bg-white/80 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {listing.photo && (
                      <img
                        src={listing.photo}
                        alt={listing.name}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0 grayscale opacity-60"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <a
                          href={`/?listing=${listing.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-gray-500 hover:text-gray-700 line-through"
                        >
                          {listing.name}
                        </a>
                        <Badge variant="destructive" className="text-xs">
                          Неактивен
                        </Badge>
                      </div>

                      {listing.district && (
                        <p className="text-sm text-muted-foreground mb-1">
                          {listing.district}
                        </p>
                      )}

                      {listing.inactive_reason && (
                        <p className="text-sm text-red-500 mb-2">
                          {listing.inactive_reason}
                        </p>
                      )}

                      {listing.inactive_at ? (
                        <InactiveTimer inactiveAt={listing.inactive_at} />
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <Icon name="Clock" size={16} />
                          <span className="text-sm font-semibold">Неактивно (дата неизвестна)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
