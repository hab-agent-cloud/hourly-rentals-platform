import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const API_URL = 'https://functions.poehali.dev/118f6961-69ab-4912-bbec-0481012af402';

interface CallRecord {
  id: number;
  virtual_number: string;
  client_phone: string;
  listing_id: number;
  listing_title: string;
  shown_at: string;
  called_at: string | null;
  expires_at: string;
}

interface OwnerCallTrackingStatsProps {
  ownerId: number;
  listingId?: number;
}

export default function OwnerCallTrackingStats({ ownerId, listingId }: OwnerCallTrackingStatsProps) {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total_shown: 0,
    total_called: 0,
    conversion_rate: 0,
    active_sessions: 0,
  });

  const loadCallStats = async () => {
    setIsLoading(true);
    try {
      let url = `${API_URL}?action=stats`;
      
      if (listingId) {
        url += `&listing_id=${listingId}`;
      } else {
        url += `&owner_id=${ownerId}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      setCalls(data.calls || []);
      setStats({
        total_shown: data.total_shown || 0,
        total_called: data.total_called || 0,
        conversion_rate: data.conversion_rate || 0,
        active_sessions: data.active_sessions || 0,
      });
    } catch (error) {
      console.error('Failed to load call stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCallStats();
    const interval = setInterval(loadCallStats, 60000);
    return () => clearInterval(interval);
  }, [ownerId, listingId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportToCSV = () => {
    const headers = ['Дата показа', 'Объект', 'Виртуальный номер', 'Дата звонка', 'Статус'];
    const rows = calls.map(call => [
      formatDate(call.shown_at),
      call.listing_title || `ID ${call.listing_id}`,
      call.virtual_number,
      call.called_at ? formatDate(call.called_at) : '—',
      call.called_at ? 'Звонок' : (new Date(call.expires_at) > new Date() ? 'Активен' : 'Истек')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `call_stats_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" size={48} className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold">Статистика звонков</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Данные за последние 30 дней
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Icon name="Download" size={16} className="mr-2" />
            Скачать CSV
          </Button>
          <Button onClick={loadCallStats} variant="outline" size="sm">
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Обновить
          </Button>
        </div>
      </div>

      {/* Карточки статистики */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Показано номеров</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-200 rounded-lg">
                <Icon name="Eye" size={20} className="text-purple-700" />
              </div>
              <div className="text-3xl font-bold text-purple-700">{stats.total_shown}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Совершено звонков</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-200 rounded-lg">
                <Icon name="Phone" size={20} className="text-green-700" />
              </div>
              <div className="text-3xl font-bold text-green-700">{stats.total_called}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Конверсия</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-200 rounded-lg">
                <Icon name="TrendingUp" size={20} className="text-orange-700" />
              </div>
              <div className="text-3xl font-bold text-orange-700">
                {stats.conversion_rate.toFixed(1)}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Активные сессии</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-200 rounded-lg">
                <Icon name="Activity" size={20} className="text-blue-700" />
              </div>
              <div className="text-3xl font-bold text-blue-700">{stats.active_sessions}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Таблица звонков */}
      <Card>
        <CardHeader>
          <CardTitle>История звонков</CardTitle>
        </CardHeader>
        <CardContent>
          {calls.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="PhoneOff" size={48} className="mx-auto mb-3 opacity-50" />
              <p>Пока нет данных о звонках</p>
              <p className="text-sm mt-2">Когда клиенты будут звонить по вашим объектам, здесь появится статистика</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Объект</TableHead>
                    <TableHead>Виртуальный номер</TableHead>
                    <TableHead>Показан</TableHead>
                    <TableHead>Звонок</TableHead>
                    <TableHead>Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls.map((call) => (
                    <TableRow key={call.id}>
                      <TableCell className="font-medium">
                        {call.listing_title || `ID ${call.listing_id}`}
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {call.virtual_number}
                        </code>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(call.shown_at)}
                      </TableCell>
                      <TableCell>
                        {call.called_at ? (
                          <span className="text-sm text-green-600 font-medium">
                            {formatDate(call.called_at)}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {call.called_at ? (
                          <Badge className="bg-green-100 text-green-700 border-green-200">
                            <Icon name="PhoneCall" size={12} className="mr-1" />
                            Звонок
                          </Badge>
                        ) : new Date(call.expires_at) > new Date() ? (
                          <Badge variant="secondary">
                            <Icon name="Clock" size={12} className="mr-1" />
                            Активен
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Icon name="XCircle" size={12} className="mr-1" />
                            Истек
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
