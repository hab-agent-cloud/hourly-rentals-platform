import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import AdminListingCard from '@/components/admin/AdminListingCard';
import { useState, useMemo } from 'react';

interface AdminListingsContentProps {
  isLoading: boolean;
  groupedByCity: { [city: string]: any[] };
  cityTotals: { [city: string]: number };
  adminInfo: any;
  formatSubscriptionStatus: (listing: any) => { text: string; variant: 'destructive' | 'default' | 'secondary'; daysLeft: number | null };
  onEdit: (listing: any) => void;
  onArchive: (id: number) => void;
  onDelete?: (id: number) => void;
  onChangePosition: (listingId: number, newPosition: number) => void;
  onSetSubscription: (listing: any) => void;
  onModerate: (listing: any) => void;
  onExpertRate?: (listing: any) => void;
  onViewStats?: (listing: any) => void;
}

export default function AdminListingsContent({
  isLoading,
  groupedByCity,
  cityTotals,
  adminInfo,
  formatSubscriptionStatus,
  onEdit,
  onArchive,
  onDelete,
  onChangePosition,
  onSetSubscription,
  onModerate,
  onExpertRate,
  onViewStats,
}: AdminListingsContentProps) {
  const [expandedCities, setExpandedCities] = useState<Set<string>>(new Set());
  const ITEMS_PER_CITY = 20;

  const toggleCity = (city: string) => {
    setExpandedCities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(city)) {
        newSet.delete(city);
      } else {
        newSet.add(city);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Icon name="Loader2" size={48} className="animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedByCity).sort(([cityA], [cityB]) => cityA.localeCompare(cityB)).map(([city, cityListings]) => {
        const isExpanded = expandedCities.has(city);
        const visibleListings = isExpanded ? cityListings : cityListings.slice(0, ITEMS_PER_CITY);
        const hasMore = cityListings.length > ITEMS_PER_CITY;

        return (
          <div key={city}>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={20} className="text-purple-600" />
                <h3 className="text-2xl font-bold">{city}</h3>
              </div>
              <Badge variant="secondary" className="text-base px-3 py-1">
                {cityTotals[city] || 0}
              </Badge>
            </div>
            <div className="relative">
              <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100">
                <div className="flex gap-6" style={{ minWidth: 'min-content' }}>
                  {visibleListings.map((listing) => (
                    <div key={listing.id} className="flex-none w-[350px]">
                      <AdminListingCard
                        listing={listing}
                        cityListings={cityListings}
                        adminInfo={adminInfo}
                        formatSubscriptionStatus={formatSubscriptionStatus}
                        onEdit={onEdit}
                        onArchive={onArchive}
                        onDelete={adminInfo?.role === 'superadmin' ? onDelete : undefined}
                        onChangePosition={onChangePosition}
                        onSetSubscription={onSetSubscription}
                        onModerate={onModerate}
                        onExpertRate={onExpertRate}
                        onViewStats={onViewStats}
                      />
                    </div>
                  ))}
                </div>
              </div>
              {hasMore && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => toggleCity(city)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                  >
                    {isExpanded ? (
                      <>
                        <Icon name="ChevronUp" size={16} />
                        Свернуть
                      </>
                    ) : (
                      <>
                        <Icon name="ChevronDown" size={16} />
                        Показать все ({cityListings.length - ITEMS_PER_CITY} ещё)
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}