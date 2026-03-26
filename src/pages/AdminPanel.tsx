import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminListings } from '@/hooks/useAdminListings';
import AdminListingForm from '@/components/AdminListingForm';
import AdminOwnersTab from '@/components/AdminOwnersTab';
import AdminEmployeesTab from '@/components/AdminEmployeesTab';
import AdminBonusesTab from '@/components/AdminBonusesTab';
import AdminAllActionsTab from '@/components/AdminAllActionsTab';
import AdminModerationTab from '@/components/AdminModerationTab';
import AdminCallTrackingTab from '@/components/AdminCallTrackingTab';
import MyEarningsTab from '@/components/MyEarningsTab';
import AdminAnalyticsTab from '@/components/AdminAnalyticsTab';
import AdminPanelHeader from '@/components/admin/AdminPanelHeader';
import AdminListingsFilters from '@/components/admin/AdminListingsFilters';
import AdminListingsContent from '@/components/admin/AdminListingsContent';
import SubscriptionDialog from '@/components/admin/SubscriptionDialog';
import ModerationDialog from '@/components/admin/ModerationDialog';
import OwnerModerationDialog from '@/components/admin/OwnerModerationDialog';
import ExpertRatingDialogFull from '@/components/ExpertRatingDialogFull';
import CopywriterInstructionDialog from '@/components/CopywriterInstructionDialog';
import AdminTasksTab from '@/components/admin/AdminTasksTab';


export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'listings' | 'moderation' | 'moderation2' | 'recheck' | 'rejected' | 'owners' | 'employees' | 'bonuses' | 'all-actions' | 'call-tracking' | 'my-earnings' | 'analytics' | 'tasks'>('listings');
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [subscriptionDialog, setSubscriptionDialog] = useState<{ open: boolean; listing: any | null }>({ open: false, listing: null });
  const [subscriptionDays, setSubscriptionDays] = useState<number>(30);
  const [moderationDialog, setModerationDialog] = useState<{ open: boolean; listing: any | null }>({ open: false, listing: null });
  const [moderationStatus, setModerationStatus] = useState<string>('approved');
  const [moderationComment, setModerationComment] = useState<string>('');
  const [expertRatingDialog, setExpertRatingDialog] = useState<{ open: boolean; listing: any | null }>({ open: false, listing: null });
  const [showInstruction, setShowInstruction] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      (function(m,e,t,r,i,k,a){
        m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
        m[i].l=1*new Date();
        for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
        k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
      })(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym');

      ym(106549814, 'init', {
        ssr:true,
        webvisor:true,
        clickmap:true,
        ecommerce:"dataLayer",
        referrer: document.referrer,
        url: location.href,
        accurateTrackBounce:true,
        trackLinks:true
      });
    `;
    document.head.appendChild(script);

    const noscript = document.createElement('noscript');
    noscript.innerHTML = '<div><img src="https://mc.yandex.ru/watch/106549814" style="position:absolute; left:-9999px;" alt="" /></div>';
    document.body.appendChild(noscript);

    return () => {
      document.head.removeChild(script);
      document.body.removeChild(noscript);
    };
  }, []);

  const { adminInfo, token, hasPermission, handleLogout } = useAdminAuth();
  
  const {
    listings,
    isLoading,
    isLoadingMore,
    totalListings,
    hasMore,
    selectedCity,
    selectedType,
    showArchived,
    showOnlyUnrated,
    searchQuery,
    cities,
    filteredListings,
    groupedByCity,
    cityTotals,
    setSelectedCity,
    setSelectedType,
    setShowArchived,
    setShowOnlyUnrated,
    setSearchQuery,
    loadListings,
    loadMore,
    handleArchive,
    handleDelete,
    handleChangePosition,
    handleModerationUpdate,
    handleSubscriptionUpdate,
    formatSubscriptionStatus,
  } = useAdminListings(token);

  useEffect(() => {
    if (token && adminInfo) {
      loadListings();
      if (adminInfo.role === 'employee' && activeTab === 'listings') {
        setActiveTab('my-earnings');
      }
    }
  }, [token, adminInfo]);

  const handleEdit = async (listing: any) => {
    console.log('=== OPENING EDIT FORM ===');
    console.log('Listing to edit (partial data):', listing);
    
    try {
      // Загружаем ПОЛНЫЕ данные объекта с images
      console.log('Fetching full listing data for id:', listing.id);
      const fullListing = await api.getListing(token!, listing.id);
      console.log('Full listing data received:', fullListing);
      console.log('Full listing rooms:', fullListing.rooms);
      
      setSelectedListing(fullListing);
      setShowForm(true);
    } catch (error: any) {
      console.error('Failed to load listing data:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные объекта',
        variant: 'destructive',
      });
    }
  };

  const handleCreate = () => {
    setSelectedListing(null);
    requestAnimationFrame(() => {
      setShowForm(true);
    });
  };

  const handleFormClose = (shouldReload = false) => {
    setShowForm(false);
    setSelectedListing(null);
    if (shouldReload) loadListings();
  };

  const handleModerate = (listing: any) => {
    setModerationDialog({ open: true, listing });
    setModerationStatus(listing.moderation_status || 'approved');
    setModerationComment(listing.moderation_comment || '');
  };

  const handleModerationSubmit = async () => {
    if (!moderationDialog.listing) return;

    try {
      await api.moderateListing(
        token!,
        moderationDialog.listing.id,
        moderationStatus,
        moderationComment
      );

      toast({
        title: 'Успешно',
        description: 'Модерация обновлена',
      });

      setModerationDialog({ open: false, listing: null });
      setModerationComment('');
      
      handleModerationUpdate(moderationDialog.listing.id, moderationStatus, moderationComment);
      
      // Перезагружаем список объектов для обновления данных
      await loadListings();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось обновить модерацию',
        variant: 'destructive',
      });
    }
  };

  const handleSetSubscription = async () => {
    if (!subscriptionDialog.listing || subscriptionDays < 1) {
      toast({
        title: 'Ошибка',
        description: 'Укажите количество дней',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.adminSetSubscription(token!, subscriptionDialog.listing.id, subscriptionDays);
      toast({
        title: 'Успешно',
        description: `Подписка установлена на ${subscriptionDays} дней`,
      });
      
      handleSubscriptionUpdate(subscriptionDialog.listing.id, subscriptionDays);
      
      setSubscriptionDialog({ open: false, listing: null });
      setSubscriptionDays(30);
      
      // Перезагружаем список объектов для обновления данных
      await loadListings();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось установить подписку',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <AdminPanelHeader
        adminInfo={adminInfo}
        hasPermission={hasPermission}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        token={token!}
      />

      <main className="container mx-auto px-4 py-8">
        {(() => {
          console.log('[AdminPanel] Current activeTab:', activeTab);
          console.log('[AdminPanel] hasPermission(listings):', hasPermission('listings'));
        })()}
        {showForm ? (
          <AdminListingForm
            listing={selectedListing}
            token={token!}
            onClose={handleFormClose}
          />
        ) : activeTab === 'moderation' && hasPermission('listings') ? (
          <AdminModerationTab token={token!} adminInfo={adminInfo} moderationFilter="admin_pending" />
        ) : activeTab === 'moderation2' && hasPermission('listings') ? (
          <AdminModerationTab token={token!} adminInfo={adminInfo} moderationFilter="owner_pending" />
        ) : activeTab === 'recheck' && hasPermission('listings') ? (
          <AdminModerationTab token={token!} adminInfo={adminInfo} moderationFilter="awaiting_recheck" />
        ) : activeTab === 'rejected' && hasPermission('listings') ? (
          <AdminModerationTab token={token!} adminInfo={adminInfo} moderationFilter="rejected" />
        ) : activeTab === 'owners' && hasPermission('owners') ? (
          <AdminOwnersTab token={token!} />
        ) : activeTab === 'employees' && adminInfo?.role === 'superadmin' ? (
          <AdminEmployeesTab token={token!} />
        ) : activeTab === 'bonuses' && adminInfo?.role === 'superadmin' ? (
          <AdminBonusesTab token={token!} />
        ) : activeTab === 'all-actions' && adminInfo?.role === 'superadmin' ? (
          <AdminAllActionsTab token={token!} />
        ) : activeTab === 'call-tracking' && adminInfo?.role === 'superadmin' ? (
          <AdminCallTrackingTab />
        ) : activeTab === 'tasks' && adminInfo?.role === 'superadmin' ? (
          <AdminTasksTab adminId={adminInfo?.id || 1} />
        ) : activeTab === 'analytics' && adminInfo?.role === 'superadmin' ? (
          <AdminAnalyticsTab />
        ) : activeTab === 'my-earnings' && adminInfo?.role === 'employee' ? (
          <MyEarningsTab token={token!} adminInfo={adminInfo} />
        ) : hasPermission('listings') ? (
        <>
        <AdminListingsFilters
          filteredCount={filteredListings.length}
          totalCount={listings.length}
          selectedCity={selectedCity}
          selectedType={selectedType}
          showArchived={showArchived}
          showOnlyUnrated={showOnlyUnrated}
          searchQuery={searchQuery}
          cities={cities}
          onCityChange={setSelectedCity}
          onTypeChange={setSelectedType}
          onArchiveToggle={() => setShowArchived(!showArchived)}
          onUnratedToggle={() => setShowOnlyUnrated(!showOnlyUnrated)}
          onSearchChange={setSearchQuery}
          onCreate={handleCreate}
          onShowInstruction={() => setShowInstruction(true)}
          isSuperAdmin={adminInfo?.role === 'superadmin'}
        />

        <AdminListingsContent
          isLoading={isLoading}
          groupedByCity={groupedByCity}
          cityTotals={cityTotals}
          adminInfo={adminInfo}
          formatSubscriptionStatus={formatSubscriptionStatus}
          onEdit={handleEdit}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onChangePosition={handleChangePosition}
          onSetSubscription={(listing) => setSubscriptionDialog({ open: true, listing })}
          onModerate={handleModerate}
          onLoadMore={loadMore}
          hasMore={hasMore}
          isLoadingMore={isLoadingMore}
          totalListings={totalListings}
          loadedCount={listings.length}
        />

        <SubscriptionDialog
          open={subscriptionDialog.open}
          listing={subscriptionDialog.listing}
          subscriptionDays={subscriptionDays}
          formatSubscriptionStatus={formatSubscriptionStatus}
          onClose={() => setSubscriptionDialog({ open: false, listing: null })}
          onDaysChange={setSubscriptionDays}
          onSubmit={handleSetSubscription}
        />

        {moderationDialog.listing?.created_by_owner ? (
          <OwnerModerationDialog
            open={moderationDialog.open}
            listing={moderationDialog.listing}
            moderationStatus={moderationStatus}
            moderationComment={moderationComment}
            token={token!}
            onClose={() => setModerationDialog({ open: false, listing: null })}
            onStatusChange={setModerationStatus}
            onCommentChange={setModerationComment}
            onSubmit={handleModerationSubmit}
          />
        ) : (
          <ModerationDialog
            open={moderationDialog.open}
            listing={moderationDialog.listing}
            moderationStatus={moderationStatus}
            moderationComment={moderationComment}
            onClose={() => setModerationDialog({ open: false, listing: null })}
            onStatusChange={setModerationStatus}
            onCommentChange={setModerationComment}
            onSubmit={handleModerationSubmit}
          />
        )}

        <CopywriterInstructionDialog 
          show={showInstruction} 
          onClose={() => setShowInstruction(false)} 
        />

        <ExpertRatingDialogFull
          open={expertRatingDialog.open}
          listing={expertRatingDialog.listing}
          token={token!}
          onClose={() => setExpertRatingDialog({ open: false, listing: null })}
          onSuccess={() => {
            setExpertRatingDialog({ open: false, listing: null });
            loadListings();
          }}
        />



        {!isLoading && filteredListings.length === 0 && listings.length > 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">Объекты не найдены</h3>
            <p className="text-muted-foreground mb-6">Попробуйте изменить фильтры</p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCity('all');
                setSelectedType('all');
              }}
            >
              <Icon name="X" size={18} className="mr-2" />
              Сбросить фильтры
            </Button>
          </div>
        )}

        {!isLoading && listings.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-bold mb-2">Объектов пока нет</h3>
            <p className="text-muted-foreground mb-6">Добавьте первый объект для начала работы</p>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              onClick={handleCreate}
            >
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить объект
            </Button>
          </div>
        )}
        </>
        ) : null}
      </main>
    </div>
  );
}