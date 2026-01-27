import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import OwnerCallTrackingStats from '@/components/OwnerCallTrackingStats';

interface Listing {
  id: number;
  title: string;
  city: string;
  auction: number;
  type: string;
  image_url: string;
  district: string;
  subscription_expires_at: string | null;
  is_archived: boolean;
}

interface Stats {
  stats: Array<{
    date: string;
    views: number;
    clicks: number;
    phone_clicks: number;
    telegram_clicks: number;
  }>;
  summary: {
    total_views: number;
    total_clicks: number;
    phone_clicks: number;
    telegram_clicks: number;
    ctr: number;
    period_days: number;
  };
}

interface OwnerStatisticsTabProps {
  listings: Listing[];
  selectedListing: Listing | null;
  stats: Stats | null;
  onSelectListing: (listing: Listing) => void;
  loadStats: (listingId: number) => void;
}

export default function OwnerStatisticsTab({
  listings,
  selectedListing,
  stats,
  onSelectListing,
  loadStats,
}: OwnerStatisticsTabProps) {
  // Получаем owner_id из первого объекта (у всех объектов владельца один owner_id)
  const ownerId = listings[0]?.id ? listings[0].id : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <label className="text-sm font-medium mb-3 block">Выберите объект для просмотра статистики:</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {listings.map((listing) => (
              <Button
                key={listing.id}
                variant={selectedListing?.id === listing.id ? 'default' : 'outline'}
                onClick={() => {
                  onSelectListing(listing);
                  loadStats(listing.id);
                }}
                className="justify-start h-auto py-3"
              >
                <div className="text-left">
                  <div className="font-semibold">{listing.title}</div>
                  <div className="text-xs opacity-70">{listing.city}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedListing && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Статистика просмотров - {selectedListing.title}</CardTitle>
              <CardDescription>Последние 7 дней</CardDescription>
            </CardHeader>
            <CardContent>
              {stats ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Icon name="Eye" size={24} className="mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold text-purple-600">{stats.summary.total_views}</div>
                      <div className="text-sm text-muted-foreground">Просмотров</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Icon name="MousePointerClick" size={24} className="mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold text-green-600">{stats.summary.total_clicks}</div>
                      <div className="text-sm text-muted-foreground">Кликов</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <Icon name="Phone" size={24} className="mx-auto mb-2 text-orange-600" />
                      <div className="text-2xl font-bold text-orange-600">{stats.summary.phone_clicks}</div>
                      <div className="text-sm text-muted-foreground">Звонков</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Icon name="MessageCircle" size={24} className="mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold text-blue-600">{stats.summary.telegram_clicks}</div>
                      <div className="text-sm text-muted-foreground">Telegram</div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                    <div className="text-sm text-purple-700 mb-1">Конверсия (CTR)</div>
                    <div className="text-3xl font-bold text-purple-900">{stats.summary.ctr}%</div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Загрузка статистики...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Статистика звонков */}
          <OwnerCallTrackingStats 
            ownerId={ownerId} 
            listingId={selectedListing.id}
          />
        </>
      )}
    </div>
  );
}