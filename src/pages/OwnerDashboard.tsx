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
        <div className="mb-6">
          <Button
            onClick={() => navigate('/')}
            size="lg"
            className="w-full sm:w-auto text-lg font-semibold h-14 px-8"
          >
            <Icon name="ArrowLeft" size={24} className="mr-2" />
            Все объекты
          </Button>
        </div>

        {listings.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <CardTitle>У вас пока нет объектов</CardTitle>
              <CardDescription>Свяжитесь с администратором для добавления объекта</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'overview' | 'promotion' | 'expert')} className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full mx-auto grid-cols-3 gap-1 sm:gap-0 h-auto p-1 sm:p-1">
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