import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface InactiveListing {
  id: number;
  title: string;
  address: string;
  inactive_at: string;
  inactive_reason: string;
  created_at: string;
}

export default function InactiveListings() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listings, setListings] = useState<InactiveListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInactiveListings();
  }, []);

  const loadInactiveListings = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/4d42288a-e311-4754-98a2-944dfc667bd2?inactive=true');
      const data = await response.json();
      if (response.ok && data.listings) {
        setListings(data.listings);
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Ошибка', description: 'Не удалось загрузить список', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (inactiveAt: string) => {
    const targetDate = new Date(inactiveAt);
    const today = new Date();
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4" />
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="ghost" onClick={() => navigate('/manager')} className="mb-3 -ml-2">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад
            </Button>
            <h1 className="text-3xl font-bold">Базы неактивных</h1>
            <p className="text-muted-foreground mt-1">
              Объекты, перенесённые в неактивные из-за отказа владельца
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Всего: {listings.length}
          </Badge>
        </div>

        {listings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Icon name="Archive" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-xl text-muted-foreground">Нет неактивных объектов</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {listings.map((listing) => {
              const daysRemaining = getDaysRemaining(listing.inactive_at);
              return (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{listing.title}</CardTitle>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Icon name="MapPin" size={14} />
                            {listing.address}
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Info" size={14} />
                            {listing.inactive_reason}
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Clock" size={14} />
                            Обратная связь: {new Date(listing.inactive_at).toLocaleDateString()}
                            <Badge variant={daysRemaining <= 3 ? 'destructive' : 'secondary'} className="ml-2">
                              {daysRemaining === 0 ? 'Сегодня' : `Через ${daysRemaining} ${daysRemaining === 1 ? 'день' : daysRemaining < 5 ? 'дня' : 'дней'}`}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/manager/listing/${listing.id}`)}
                      >
                        <Icon name="Edit" size={16} className="mr-2" />
                        Открыть
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
