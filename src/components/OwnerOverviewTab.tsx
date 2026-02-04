import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import HotelSubscriptionCard from '@/components/HotelSubscriptionCard';
import OwnerGiftsSection from '@/components/OwnerGiftsSection';
import OwnerManagerCard from '@/components/OwnerManagerCard';

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
  moderation_status?: string;
  moderation_comment?: string;
}

interface SubscriptionInfo {
  days_left: number | null;
  price_per_month: number;
  prices: {
    '30_days': number;
    '90_days': number;
  };
}

interface Transaction {
  id: number;
  amount: number;
  type: string;
  description: string;
  balance_after: number;
  created_at: string;
  related_bid_id: number | null;
}

interface OwnerOverviewTabProps {
  listings: Listing[];
  subscriptionInfo: Map<number, SubscriptionInfo>;
  transactions?: Transaction[];
  isLoading: boolean;
  onExtendSubscription: (listingId: number, days: number) => Promise<void>;
  onEditListing?: (listing: any) => void;
  onUnarchiveListing?: (listingId: number) => void;
  ownerId?: number;
  onRefreshListings?: () => void;
}

export default function OwnerOverviewTab({
  listings,
  subscriptionInfo,
  transactions,
  isLoading,
  onExtendSubscription,
  onEditListing,
  onUnarchiveListing,
  ownerId,
  onRefreshListings,
}: OwnerOverviewTabProps) {
  const activeListings = listings.filter(l => !l.is_archived);
  const archivedListings = listings.filter(l => l.is_archived);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Owner Manager Card */}
      {ownerId && (
        <OwnerManagerCard ownerId={ownerId} />
      )}
      
      {/* Owner Gifts Section */}
      {ownerId && (
        <OwnerGiftsSection 
          ownerId={ownerId} 
          onGiftActivated={onRefreshListings}
        />
      )}
      {/* Active Listings */}
      {activeListings.length > 0 && (
        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 text-gray-900">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-lg">
              <Icon name="Building" size={18} className="text-white" />
            </div>
            Активные объекты
            <span className="text-sm font-normal bg-gradient-to-r from-purple-100 to-pink-100 px-2.5 py-0.5 rounded-full text-purple-700">({activeListings.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {activeListings.map((listing) => (
              <HotelSubscriptionCard
                key={listing.id}
                listing={listing}
                subscriptionInfo={subscriptionInfo.get(listing.id) || null}
                onExtend={onExtendSubscription}
                onEdit={onEditListing}
                onUnarchive={onUnarchiveListing}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>
      )}

      {/* Archived Listings */}
      {archivedListings.length > 0 && (
        <div>
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2 text-gray-500">
            <div className="bg-gray-300 p-2 rounded-lg">
              <Icon name="Archive" size={18} className="text-gray-600" />
            </div>
            Архив
            <span className="text-sm font-normal bg-gray-100 px-2.5 py-0.5 rounded-full text-gray-600">({archivedListings.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 opacity-60">
            {archivedListings.map((listing) => (
              <HotelSubscriptionCard
                key={listing.id}
                listing={listing}
                subscriptionInfo={subscriptionInfo.get(listing.id) || null}
                onExtend={onExtendSubscription}
                onEdit={onEditListing}
                onUnarchive={onUnarchiveListing}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>
      )}

      {activeListings.length === 0 && archivedListings.length === 0 && (
        <Card className="text-center py-12">
          <CardHeader>
            <CardTitle>У вас пока нет объектов</CardTitle>
            <CardDescription>Свяжитесь с администратором для добавления объекта</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}