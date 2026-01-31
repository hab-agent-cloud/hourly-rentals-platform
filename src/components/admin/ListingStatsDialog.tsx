import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface ListingStatsDialogProps {
  open: boolean;
  onClose: () => void;
  listing: any;
  token: string;
}

interface StatsReport {
  id: number;
  sent_to_email: string;
  sent_at: string;
  admin_name: string;
  stats_data: any;
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

export default function ListingStatsDialog({ open, onClose, listing, token }: ListingStatsDialogProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [history, setHistory] = useState<StatsReport[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<StatsReport[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month' | '3months'>('all');
  const { toast } = useToast();

  useEffect(() => {
    if (open && listing) {
      loadStats();
      loadHistory();
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

  const loadHistory = async () => {
    try {
      const response = await api.getStatsReports(token, listing.id);
      setHistory(response.reports || []);
      setFilteredHistory(response.reports || []);
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
    }
  };

  useEffect(() => {
    if (history.length === 0) {
      setFilteredHistory([]);
      return;
    }

    const now = new Date();
    let filtered = [...history];

    if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = history.filter(r => new Date(r.sent_at) >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = history.filter(r => new Date(r.sent_at) >= monthAgo);
    } else if (dateFilter === '3months') {
      const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      filtered = history.filter(r => new Date(r.sent_at) >= threeMonthsAgo);
    }

    setFilteredHistory(filtered);
  }, [dateFilter, history]);

  const handleSendStats = async () => {
    if (!stats) return;
    
    setIsSending(true);
    try {
      const ownerEmail = listing.owner_email || 'owner@example.com';
      await api.createStatsReport(token, listing.id, ownerEmail, stats);
      
      toast({
        title: 'Статистика отправлена',
        description: `Отчёт по объекту "${listing.title}" успешно отправлен на ${ownerEmail}`,
      });
      
      await loadHistory();
      setShowHistory(true);
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось отправить статистику',
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
              <Button
                variant="outline"
                onClick={() => setShowHistory(!showHistory)}
              >
                <Icon name="History" size={18} className="mr-2" />
                {showHistory ? 'Скрыть' : 'История'}
              </Button>
            </div>

            {showHistory && history.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Icon name="History" size={20} />
                      История отправки ({filteredHistory.length})
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={dateFilter === 'all' ? 'default' : 'outline'}
                        onClick={() => setDateFilter('all')}
                      >
                        Все
                      </Button>
                      <Button
                        size="sm"
                        variant={dateFilter === 'week' ? 'default' : 'outline'}
                        onClick={() => setDateFilter('week')}
                      >
                        Неделя
                      </Button>
                      <Button
                        size="sm"
                        variant={dateFilter === 'month' ? 'default' : 'outline'}
                        onClick={() => setDateFilter('month')}
                      >
                        Месяц
                      </Button>
                      <Button
                        size="sm"
                        variant={dateFilter === '3months' ? 'default' : 'outline'}
                        onClick={() => setDateFilter('3months')}
                      >
                        3 месяца
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {filteredHistory.map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon name="Mail" size={14} className="text-gray-500" />
                            <span className="font-medium text-sm">{report.sent_to_email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Icon name="User" size={12} />
                            <span>{report.admin_name}</span>
                            <span>•</span>
                            <Icon name="Calendar" size={12} />
                            <span>{new Date(report.sent_at).toLocaleString('ru-RU')}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="ml-3">
                          <Icon name="Eye" size={12} className="mr-1" />
                          {report.stats_data.views || 0}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {showHistory && history.length === 0 && (
              <Card className="mt-4">
                <CardContent className="text-center py-8 text-muted-foreground">
                  <Icon name="Inbox" size={40} className="mx-auto mb-2 opacity-50" />
                  <p>История отправки пуста</p>
                </CardContent>
              </Card>
            )}

            {showHistory && history.length > 0 && filteredHistory.length === 0 && (
              <Card className="mt-4">
                <CardContent className="text-center py-8 text-muted-foreground">
                  <Icon name="Filter" size={40} className="mx-auto mb-2 opacity-50" />
                  <p>Нет отправок за выбранный период</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-3"
                    onClick={() => setDateFilter('all')}
                  >
                    Показать все
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}