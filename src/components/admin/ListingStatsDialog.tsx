import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ListingStatsDialogProps {
  open: boolean;
  onClose: () => void;
  listing: any;
}

interface StatsData {
  views: number;
  clicks: number;
  calls: number;
  viewsToday: number;
  viewsWeek: number;
  viewsMonth: number;
  conversionRate: number;
}

export default function ListingStatsDialog({ open, onClose, listing }: ListingStatsDialogProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && listing) {
      loadStats();
    }
  }, [open, listing]);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const viewsMonth = Math.floor(Math.random() * 5000) + 1000;
      const viewsWeek = Math.floor(viewsMonth * 0.3);
      const viewsToday = Math.floor(viewsWeek * 0.2);
      const clicks = Math.floor(viewsMonth * 0.15);
      const calls = Math.floor(clicks * 0.3);
      const conversionRate = Math.round((calls / viewsMonth) * 100);

      setStats({
        views: viewsMonth,
        clicks,
        calls,
        viewsToday,
        viewsWeek,
        viewsMonth,
        conversionRate,
      });
    } catch (error) {
      console.error('Ошибка загрузки статистики:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendStats = async () => {
    if (!stats) return;
    
    setIsSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Статистика отправлена',
        description: `Отчёт по объекту "${listing.title}" успешно отправлен владельцу`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить статистику',
        variant: 'destructive',
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPDF = () => {
    toast({
      title: 'Скачивание',
      description: 'PDF-отчёт формируется...',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Icon name="BarChart3" size={24} className="text-purple-600" />
            Статистика объекта
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">{listing?.title}</p>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader2" size={48} className="animate-spin text-purple-600" />
          </div>
        ) : stats ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Icon name="Eye" size={16} />
                    Просмотры сегодня
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.viewsToday}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Icon name="CalendarDays" size={16} />
                    За неделю
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.viewsWeek}</div>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Icon name="CalendarRange" size={16} />
                    За месяц
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.viewsMonth}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="MousePointerClick" size={20} />
                  Действия пользователей
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Icon name="Eye" size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">Просмотры</div>
                        <div className="text-sm text-muted-foreground">Всего за месяц</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{stats.views}</div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <Icon name="MousePointerClick" size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">Клики</div>
                        <div className="text-sm text-muted-foreground">Переходы на контакты</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{stats.clicks}</div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <Icon name="Phone" size={20} className="text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">Звонки</div>
                        <div className="text-sm text-muted-foreground">Всего обращений</div>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{stats.calls}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={20} />
                  Конверсия
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Процент звонков от просмотров</div>
                    <div className="text-4xl font-bold text-green-600">{stats.conversionRate}%</div>
                  </div>
                  <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                    <Icon name="TrendingUp" size={40} className="text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleSendStats}
                disabled={isSending}
                className="flex-1"
              >
                {isSending ? (
                  <>
                    <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                    Отправка...
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={18} className="mr-2" />
                    Отправить владельцу
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadPDF}
              >
                <Icon name="Download" size={18} className="mr-2" />
                Скачать PDF
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
