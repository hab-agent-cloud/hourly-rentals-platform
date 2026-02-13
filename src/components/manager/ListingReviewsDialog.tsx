import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import CopyReviewDialog from './CopyReviewDialog';

const REVIEWS_URL = 'https://functions.poehali.dev/da2543a1-a4e2-4e72-96dc-57517a2f27f0';

const SOURCE_LABELS: Record<string, string> = {
  yandex: 'Яндекс Карты',
  '2gis': '2ГИС',
  google: 'Google Maps',
  avito: 'Авито',
  booking: 'Booking',
  sutochno: 'Суточно.ру',
  other: 'Другой сайт',
};

interface Review {
  id: number;
  listing_id: number;
  client_name: string;
  rating: number;
  comment: string;
  manager_response?: string;
  responded_at?: string;
  responder_name?: string;
  created_at: string;
  source_url?: string;
  source_site?: string;
  added_by_manager_id?: number;
}

interface ListingReviewsDialogProps {
  open: boolean;
  onClose: () => void;
  listingId: number;
  listingName: string;
  adminId: number;
}

export default function ListingReviewsDialog({
  open,
  onClose,
  listingId,
  listingName,
  adminId,
}: ListingReviewsDialogProps) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    if (open) {
      loadReviews();
    }
  }, [open, listingId]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${REVIEWS_URL}?listing_id=${listingId}`);
      const data = await response.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить отзывы',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('Удалить этот отзыв?')) return;

    try {
      const response = await fetch(REVIEWS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          review_id: reviewId,
          admin_id: adminId,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast({ title: 'Отзыв удалён' });
        loadReviews();
      } else {
        throw new Error(data.error);
      }
    } catch {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить отзыв',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '—';

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="MessageSquare" size={20} className="text-purple-600" />
              Отзывы
            </DialogTitle>
          </DialogHeader>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center justify-between">
            <div>
              <span className="text-sm text-muted-foreground">Объект:</span>{' '}
              <span className="font-medium text-sm">{listingName}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 text-lg">★</span>
                <span className="font-bold">{avgRating}</span>
              </div>
              <Badge variant="secondary">{reviews.length} шт.</Badge>
            </div>
          </div>

          <Button
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => setShowAddDialog(true)}
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Скопировать отзыв с другого сайта
          </Button>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">💬</div>
              <p>Отзывов пока нет</p>
              <p className="text-sm mt-1">Скопируйте первый отзыв с другого сайта</p>
            </div>
          ) : (
            <ScrollArea className="max-h-[50vh] pr-2">
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-3 bg-white hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{review.client_name}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-sm ${star <= review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          {review.source_site && (
                            <Badge variant="outline" className="text-xs">
                              {SOURCE_LABELS[review.source_site] || review.source_site}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(review.created_at)}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>

                    <p className="text-sm text-gray-700 bg-gray-50 rounded p-2">
                      {review.comment}
                    </p>

                    {review.source_url && (
                      <a
                        href={review.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-purple-600 hover:underline mt-1 inline-flex items-center gap-1"
                      >
                        <Icon name="ExternalLink" size={12} />
                        Оригинал отзыва
                      </a>
                    )}

                    {review.manager_response && (
                      <div className="bg-purple-50 rounded p-2 mt-2 border-l-2 border-purple-400">
                        <div className="text-xs font-medium text-purple-700 mb-0.5">
                          Ответ {review.responder_name && `(${review.responder_name})`}
                        </div>
                        <p className="text-sm">{review.manager_response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <CopyReviewDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        listingId={listingId}
        listingName={listingName}
        adminId={adminId}
        onSuccess={loadReviews}
      />
    </>
  );
}
