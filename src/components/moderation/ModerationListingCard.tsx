import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

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

interface ModerationListingCardProps {
  listing: Listing;
  canModerate: boolean;
  token: string;
  onModerate: (listing: Listing) => void;
  onSubscriptionClick: (listing: Listing) => void;
  onReload: () => void;
}

export default function ModerationListingCard({
  listing,
  canModerate,
  token,
  onModerate,
  onSubscriptionClick,
  onReload,
}: ModerationListingCardProps) {
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Одобрено</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Отклонено</Badge>;
      default:
        return <Badge variant="outline">На модерации</Badge>;
    }
  };

  const handleQuickApprove = async () => {
    try {
      await api.moderateListing(token, listing.id, 'approved', '');
      
      if (listing.created_by_owner) {
        try {
          const emailResponse = await fetch('https://functions.poehali.dev/be8d7c03-13d9-42fe-a041-a17c5e5ff5b2', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listing_id: listing.id }),
          });
          const emailResult = await emailResponse.json();
          if (emailResult.error) {
            console.error('Email error:', emailResult.error);
          }
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
        }
      }
      
      toast({
        title: 'Успешно',
        description: listing.created_by_owner 
          ? 'Объект одобрен, владелец получит email с данными для входа'
          : 'Объект одобрен и опубликован',
      });
      onReload();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Не удалось одобрить объект';
      toast({
        title: 'Ошибка',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-6">
      <div className="flex gap-6">
        <img
          src={listing.image_url}
          alt={listing.title}
          className="w-48 h-36 object-cover rounded-lg"
        />
        
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold">{listing.title}</h3>
                {listing.created_by_owner && (
                  <Badge className="bg-blue-500">
                    <Icon name="UserPlus" size={12} className="mr-1" />
                    Заявка владельца
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                {listing.city}, {listing.district}
              </p>
            </div>
            {getStatusBadge(listing.moderation_status)}
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Icon name="Tag" size={16} />
              <span>{listing.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Ruble" size={16} />
              <span className="font-semibold">{listing.price.toLocaleString()} ₽/час</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} />
              <Badge variant={listing.subscription_expires_at ? 'default' : 'destructive'}>
                {listing.subscription_expires_at ? 'Подписка активна' : 'Нет подписки'}
              </Badge>
            </div>
            {listing.created_by_employee_name && (
              <div className="flex items-center gap-2">
                <Icon name="User" size={16} />
                <span>Добавил: {listing.created_by_employee_name}</span>
              </div>
            )}
            {listing.owner_name && !listing.created_by_employee_name && (
              <div className="flex items-center gap-2">
                <Icon name="UserCog" size={16} />
                <span>Изменил: {listing.owner_name}</span>
              </div>
            )}
            {listing.submitted_at && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Clock" size={16} />
                <span>
                  {new Date(listing.submitted_at).toLocaleString('ru-RU', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            )}
          </div>

          {listing.moderation_comment && (
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">Комментарий: </span>
                {listing.moderation_comment}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/listing/${listing.id}`, '_blank')}
            >
              <Icon name="ExternalLink" size={16} className="mr-2" />
              Посмотреть
            </Button>
            {canModerate && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSubscriptionClick(listing)}
              >
                <Icon name="Calendar" size={16} className="mr-2" />
                Подписка
              </Button>
            )}
            {canModerate && (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleQuickApprove}
                  disabled={listing.moderation_status === 'approved'}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Icon name="CheckCircle" size={16} className="mr-2" />
                  {listing.created_by_owner ? 'Одобрить и отправить email' : 'Одобрить'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onModerate(listing)}
                >
                  <Icon name="XCircle" size={16} className="mr-2" />
                  Отклонить с комментарием
                </Button>
              </>
            )}
            {!canModerate && (
              <Badge variant="outline" className="text-sm">
                Только суперадмин/ОМ может модерировать
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}