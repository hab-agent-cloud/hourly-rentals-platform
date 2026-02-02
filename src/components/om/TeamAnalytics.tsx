import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface TeamAnalyticsProps {
  managers: any[];
  monthCommission: number;
}

export default function TeamAnalytics({ managers, monthCommission }: TeamAnalyticsProps) {
  const totalObjects = managers.reduce((sum, m) => sum + (m.objects_count || 0), 0);
  const totalBalance = managers.reduce((sum, m) => sum + parseFloat(m.balance || 0), 0);
  const avgObjectsPerManager = managers.length > 0 ? Math.round(totalObjects / managers.length) : 0;
  
  // Группировка по уровням
  const levelCounts = managers.reduce((acc, m) => {
    const level = m.manager_level || 'bronze';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'bronze': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'silver': return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'gold': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'platinum': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getLevelName = (level: string) => {
    switch(level) {
      case 'bronze': return '🥉 Бронзовый';
      case 'silver': return '🥈 Серебряный';
      case 'gold': return '🥇 Золотой';
      case 'platinum': return '💎 Платиновый';
      default: return '🥉 Бронзовый';
    }
  };

  // Топ-3 менеджера по объектам
  const topManagers = [...managers]
    .sort((a, b) => (b.objects_count || 0) - (a.objects_count || 0))
    .slice(0, 3);

  // Менеджеры с предупреждениями
  const managersWithWarnings = managers.filter(m => (m.warnings_count || 0) > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Всего менеджеров
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              В вашей команде
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Объектов в работе
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalObjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              В среднем: {avgObjectsPerManager} на менеджера
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Комиссия за месяц
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{monthCommission.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground mt-1">
              7% от оборота команды
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Баланс команды
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBalance.toLocaleString()} ₽</div>
            <p className="text-xs text-muted-foreground mt-1">
              Доступно для вывода
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Распределение по уровням */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Распределение по уровням</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(levelCounts).map(([level, count]) => (
                <div key={level} className="flex items-center justify-between">
                  <span className="text-sm">{getLevelName(level)}</span>
                  <Badge className={getLevelColor(level)}>
                    {count} {count === 1 ? 'менеджер' : 'менеджеров'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Топ менеджеров */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Топ-3 по объектам</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topManagers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Нет данных
                </p>
              ) : (
                topManagers.map((manager, index) => (
                  <div key={manager.id} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{manager.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {manager.objects_count} объектов • {parseFloat(manager.balance || 0).toLocaleString()} ₽
                      </p>
                    </div>
                    <Badge variant="outline">
                      {manager.commission_percent}%
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Предупреждения */}
        {managersWithWarnings.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Icon name="AlertTriangle" size={18} className="text-orange-600" />
                Менеджеры с предупреждениями ({managersWithWarnings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {managersWithWarnings.map((manager) => (
                  <div key={manager.id} className="flex items-center justify-between p-3 border rounded-lg bg-orange-50">
                    <div>
                      <p className="font-medium text-sm">{manager.name}</p>
                      <p className="text-xs text-muted-foreground">{manager.objects_count} объектов</p>
                    </div>
                    <Badge variant="destructive">
                      {manager.warnings_count} / 3
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
