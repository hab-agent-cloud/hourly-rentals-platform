import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import OwnerDashboardHeader from '@/components/OwnerDashboardHeader';
import OwnerOverviewTab from '@/components/OwnerOverviewTab';
import OwnerPromotionTab from '@/components/OwnerPromotionTab';
import OwnerExpertTab from '@/components/OwnerExpertTab';

import OwnerEditListingDialogNew from '@/components/OwnerEditListingDialogNew';
import { useOwnerDashboard } from '@/hooks/useOwnerDashboard';
import { useNavigate } from 'react-router-dom';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const {
    owner,
    listings,
    selectedListing,
    promotionInfo,
    transactions,
    showCashbackAnimation,
    cashbackAmount,
    subscriptionInfo,
    isLoading,
    isTopupLoading,
    activeTab,
    editingListing,
    token,
    setActiveTab,
    setEditingListing,
    handleListingSelect,
    handlePurchasePackage,
    handleTopup,
    handleExtendSubscription,
    handleEditListing,
    handleEditSuccess,
    handleUnarchiveListing,
    handleLogout,
  } = useOwnerDashboard();

  if (!owner) {
    return <div className="min-h-screen flex items-center justify-center">
      <Icon name="Loader2" size={48} className="animate-spin text-purple-600" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pb-6">
      <OwnerDashboardHeader
        owner={owner}
        onLogout={handleLogout}
        onTopup={handleTopup}
        isTopupLoading={isTopupLoading}
        showCashbackAnimation={showCashbackAnimation}
        cashbackAmount={cashbackAmount}
        transactions={transactions}
      />

      <main className="container mx-auto px-3 sm:px-4 py-3 sm:py-6 max-w-7xl">

        {listings.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>У вас пока нет объектов</CardTitle>
              <CardDescription>Свяжитесь с администратором для добавления объекта</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'overview' | 'promotion' | 'expert')} className="space-y-3 sm:space-y-4">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-white/60 backdrop-blur-sm border border-purple-200 shadow-sm">
              <TabsTrigger 
                value="overview" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2.5 sm:py-3 text-xs sm:text-sm font-medium data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Icon name="Building" size={18} />
                <span className="hidden sm:inline">Мои объекты</span>
                <span className="sm:hidden text-[10px]">Объекты</span>
              </TabsTrigger>
              <TabsTrigger 
                value="promotion" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2.5 sm:py-3 text-xs sm:text-sm font-medium data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Icon name="TrendingUp" size={18} />
                <span className="hidden sm:inline">Продвижение</span>
                <span className="sm:hidden text-[10px]">ТОП</span>
              </TabsTrigger>
              <TabsTrigger 
                value="expert" 
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2.5 sm:py-3 text-xs sm:text-sm font-medium data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              >
                <Icon name="Award" size={18} />
                <span className="text-[10px] sm:text-sm">Эксперт</span>
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
                ownerId={owner?.id}
                onRefreshListings={() => window.location.reload()}
              />
            </TabsContent>

            <TabsContent value="promotion">
              <OwnerPromotionTab
                listings={listings}
                selectedListing={selectedListing}
                promotionInfo={promotionInfo}
                owner={owner}
                isLoading={isLoading}
                onSelectListing={handleListingSelect}
                onPurchasePackage={handlePurchasePackage}
              />
            </TabsContent>

            <TabsContent value="expert">
              <OwnerExpertTab 
                listings={listings} 
                token={token!}
                ownerId={owner.id}
                onUpdate={() => {}}
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