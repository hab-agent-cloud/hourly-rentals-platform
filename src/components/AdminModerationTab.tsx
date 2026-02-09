import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import ModerationListingCard from '@/components/moderation/ModerationListingCard';
import ModerationDialog from '@/components/moderation/ModerationDialog';
import SubscriptionDialog from '@/components/moderation/SubscriptionDialog';

interface Listing {
  id: number;
  title: string;
  type: string;
  city: string;
  district: string;
  price: number;
  image_url: string;
  moderation_status: string;
  moderation_comment?: string;
  submitted_at?: string;
  created_by_employee_id?: number;
  created_by_employee_name?: string;
  created_by_owner?: boolean;
  owner_name?: string;
  subscription_expires_at?: string;
}

interface ModerationTabProps {
  token: string;
  adminInfo?: {
    role: string;
  };
  moderationFilter?: 'pending' | 'awaiting_recheck' | 'rejected' | 'owner_pending';
}

export default function AdminModerationTab({ token, adminInfo, moderationFilter = 'pending' }: ModerationTabProps) {
  const isSuperAdmin = adminInfo?.role === 'superadmin';
  const isOM = adminInfo?.role === 'operational_manager';
  const canModerate = isSuperAdmin || isOM;
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [moderationStatus, setModerationStatus] = useState<'approved' | 'rejected' | 'pending'>('pending');
  const [moderationComment, setModerationComment] = useState('');
  const [subscriptionDays, setSubscriptionDays] = useState<number>(30);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [subscriptionListing, setSubscriptionListing] = useState<Listing | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPendingListings();
  }, [moderationFilter]);

  const loadPendingListings = async () => {
    setIsLoading(true);
    try {
      console.log('[AdminModerationTab] Loading listings with filter:', moderationFilter);
      const data = await api.getPendingModerationListings(token, moderationFilter);
      console.log('[AdminModerationTab] Received listings:', data.length);
      setListings(data);
    } catch (error) {
      console.error('[AdminModerationTab] Error loading listings:', error);
      const errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить объекты';
      toast({
        title: 'Ошибка',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleModerate = (listing: Listing) => {
    setSelectedListing(listing);
    setModerationStatus(listing.moderation_status as 'approved' | 'rejected' | 'pending' || 'pending');
    setModerationComment(listing.moderation_comment || '');
  };

  const handleModerationSubmit = async () => {
    if (!selectedListing) return;

    if (moderationStatus === 'rejected' && !moderationComment.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Укажите причину отклонения в комментарии',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.moderateListing(
        token,
        selectedListing.id,
        moderationStatus,
        moderationComment
      );

      toast({
        title: 'Успешно',
        description: moderationStatus === 'approved' 
          ? 'Объект одобрен и опубликован' 
          : moderationStatus === 'rejected'
          ? 'Объект отклонен, владелец сможет исправить и отправить повторно'
          : 'Статус модерации обновлен',
      });

      setSelectedListing(null);
      setModerationComment('');
      loadPendingListings();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось обновить модерацию';
      toast({
        title: 'Ошибка',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleSubscriptionClick = (listing: Listing) => {
    setSubscriptionListing(listing);
    setShowSubscriptionDialog(true);
  };

  const handleSubscriptionSubmit = async () => {
    if (!subscriptionListing) return;
    try {
      await api.adminSetSubscription(token, subscriptionListing.id, subscriptionDays);
      toast({
        title: 'Успешно',
        description: `Подписка установлена на ${subscriptionDays} дней`,
      });
      setShowSubscriptionDialog(false);
      loadPendingListings();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось установить подписку';
      toast({
        title: 'Ошибка',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icon name="Loader2" className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {moderationFilter === 'rejected' ? 'Отклонённые объекты' : 
             moderationFilter === 'awaiting_recheck' ? 'Повторная проверка' : 
             moderationFilter === 'owner_pending' ? 'Модерация заявок владельцев' : 
             'Модерация объектов'}
          </h2>
          <p className="text-muted-foreground">
            {moderationFilter === 'rejected' 
              ? 'Объекты, которые были отклонены при модерации' 
              : moderationFilter === 'owner_pending'
              ? 'Заявки на добавление объектов, поступившие от владельцев через публичную форму'
              : 'Проверяйте объекты, добавленные сотрудниками, или изменённые владельцами'}
          </p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {listings.length} {moderationFilter === 'rejected' ? 'отклонено' : 'на проверке'}
        </Badge>
      </div>

      {moderationFilter === 'owner_pending' && (
        <Card className="p-6 bg-blue-50 border-blue-200 mb-4">
          <div className="flex gap-4">
            <Icon name="Info" size={24} className="text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Заявки от владельцев</h3>
              <p className="text-sm text-blue-800 mb-3">
                Все объекты в этом разделе созданы владельцами через публичную форму добавления. 
                После одобрения владелец получит на почту логин и пароль для входа в экстранет.
              </p>
              <div className="space-y-1 text-sm text-blue-800">
                <p>• Проверьте контактные данные владельца</p>
                <p>• Убедитесь в наличии активной подписки перед одобрением</p>
                <p>• При отклонении укажите причину в комментарии</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {listings.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Icon name="CheckCircle" size={64} className="mx-auto mb-4 text-muted-foreground opacity-20" />
            <h3 className="text-xl font-semibold mb-2">
              {moderationFilter === 'rejected' ? 'Нет отклонённых объектов' : 'Нет объектов на модерации'}
            </h3>
            <p className="text-muted-foreground">
              {moderationFilter === 'rejected' ? 'Все объекты одобрены' : 'Все объекты проверены'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {listings.map((listing) => (
            <ModerationListingCard
              key={listing.id}
              listing={listing}
              canModerate={canModerate}
              token={token}
              onModerate={handleModerate}
              onSubscriptionClick={handleSubscriptionClick}
              onReload={loadPendingListings}
            />
          ))}
        </div>
      )}

      <ModerationDialog
        listing={selectedListing}
        moderationStatus={moderationStatus}
        moderationComment={moderationComment}
        onClose={() => setSelectedListing(null)}
        onStatusChange={setModerationStatus}
        onCommentChange={setModerationComment}
        onSubmit={handleModerationSubmit}
      />

      <SubscriptionDialog
        listing={subscriptionListing}
        subscriptionDays={subscriptionDays}
        open={showSubscriptionDialog}
        onClose={() => setShowSubscriptionDialog(false)}
        onDaysChange={setSubscriptionDays}
        onSubmit={handleSubscriptionSubmit}
      />
    </div>
  );
}
