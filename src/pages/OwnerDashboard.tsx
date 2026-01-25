import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import OwnerDashboardHeader from '@/components/OwnerDashboardHeader';
import OwnerOverviewTab from '@/components/OwnerOverviewTab';
import OwnerAuctionTab from '@/components/OwnerAuctionTab';
import OwnerExpertTab from '@/components/OwnerExpertTab';
import OwnerStatisticsTab from '@/components/owner/OwnerStatisticsTab';
import OwnerEditListingDialogNew from '@/components/OwnerEditListingDialogNew';
import { useOwnerDashboard } from '@/hooks/useOwnerDashboard';

export default function OwnerDashboard() {
  const {
    owner,
    listings,
    selectedListing,
    auctionInfo,
    stats,
    transactions,
    showCashbackAnimation,
    cashbackAmount,
    selectedPosition,
    subscriptionInfo,
    isLoading,
    isTopupLoading,
    timeUntilReset,
    activeTab,
    editingListing,
    token,
    setActiveTab,
    setEditingListing,
    handleListingSelect,
    handleBookPosition,
    handleTopup,
    handleExtendSubscription,
    handleEditListing,
    handleEditSuccess,
    handleUnarchiveListing,
    handleLogout,
    loadStats,
  } = useOwnerDashboard();

  if (!owner) {
    return <div className="min-h-screen flex items-center justify-center">
      <Icon name="Loader2" size={48} className="animate-spin text-purple-600" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <OwnerDashboardHeader
        owner={owner}
        onLogout={handleLogout}
        onTopup={handleTopup}
        isTopupLoading={isTopupLoading}
        showCashbackAnimation={showCashbackAnimation}
        cashbackAmount={cashbackAmount}
        transactions={transactions}
      />

      <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {listings.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>У вас пока нет объектов</CardTitle>
              <CardDescription>Свяжитесь с администратором для добавления объекта</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'overview' | 'promotion' | 'statistics' | 'expert')} className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full mx-auto grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-0 h-auto p-1 sm:p-1">
              <TabsTrigger value="overview" className="flex-col sm:flex-row gap-1 sm:gap-2 h-auto py-2 sm:py-2 text-xs sm:text-sm">
                <Icon name="Building" size={14} className="sm:mr-2" />
                <span className="hidden sm:inline">Мои объекты</span>
                <span className="sm:hidden">Объекты</span>
              </TabsTrigger>
              <TabsTrigger value="promotion" className="flex-col sm:flex-row gap-1 sm:gap-2 h-auto py-2 sm:py-2 text-xs sm:text-sm">
                <Icon name="TrendingUp" size={14} className="sm:mr-2" />
                <span className="hidden sm:inline">Продвижение</span>
                <span className="sm:hidden">ТОП</span>
              </TabsTrigger>
              <TabsTrigger value="statistics" className="flex-col sm:flex-row gap-1 sm:gap-2 h-auto py-2 sm:py-2 text-xs sm:text-sm">
                <Icon name="BarChart3" size={14} className="sm:mr-2" />
                <span>Статистика</span>
              </TabsTrigger>
              <TabsTrigger value="expert" className="flex-col sm:flex-row gap-1 sm:gap-2 h-auto py-2 sm:py-2 text-xs sm:text-sm">
                <Icon name="Award" size={14} className="sm:mr-2" />
                <span>Эксперт</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OwnerOverviewTab
                listings={listings}
                subscriptionInfo={subscriptionInfo}
                isLoading={isLoading}
                onExtendSubscription={handleExtendSubscription}
                onEditListing={handleEditListing}
                onUnarchiveListing={handleUnarchiveListing}
              />
            </TabsContent>

            <TabsContent value="promotion">
              <OwnerAuctionTab
                listings={listings}
                selectedListing={selectedListing}
                auctionInfo={auctionInfo}
                timeUntilReset={timeUntilReset}
                isLoading={isLoading}
                selectedPosition={selectedPosition}
                onSelectListing={handleListingSelect}
                onBookPosition={handleBookPosition}
              />
            </TabsContent>

            <TabsContent value="statistics">
              <OwnerStatisticsTab
                listings={listings}
                selectedListing={selectedListing}
                stats={stats}
                onSelectListing={handleListingSelect}
                loadStats={loadStats}
              />
            </TabsContent>

            <TabsContent value="expert">
              <OwnerExpertTab 
                listings={listings} 
                token={token!}
                ownerId={owner.id}
                onUpdate={loadStats}
              />
            </TabsContent>
          </Tabs>
        )}
      </main>

      <OwnerEditListingDialogNew
        listing={editingListing}
        open={!!editingListing}
        onClose={() => setEditingListing(null)}
        onSuccess={handleEditSuccess}
        token={token!}
      />
    </div>
  );
}