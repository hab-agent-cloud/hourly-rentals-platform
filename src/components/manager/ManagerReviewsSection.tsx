import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Review {
  id: number;
  listing_id: number;
  listing_title: string;
  city: string;
  client_name: string;
  client_phone?: string;
  rating: number;
  comment: string;
  manager_response?: string;
  responded_at?: string;
  created_at: string;
  responder_name?: string;
}

interface ManagerReviewsSectionProps {
  adminId: number;
  role: string;
}

export default function ManagerReviewsSection({ adminId, role }: ManagerReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const canRespond = ['superadmin', 'om', 'um'].includes(role);
  const canArchive = ['superadmin', 'om', 'um'].includes(role);

  useEffect(() => {
    loadReviews();
  }, [adminId]);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/da2543a1-a4e2-4e72-96dc-57517a2f27f0?admin_id=${adminId}`
      );
      const data = await response.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить отзывы',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = async () => {
    if (!selectedReview || !responseText.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Введите текст ответа',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('https://functions.poehali.dev/da2543a1-a4e2-4e72-96dc-57517a2f27f0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'respond',
          review_id: selectedReview.id,
          manager_response: responseText,
          admin_id: adminId
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно',
          description: 'Ответ добавлен'
        });
        setSelectedReview(null);
        setResponseText('');
        loadReviews();
      } else {
        throw new Error(data.error || 'Failed to respond');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить ответ',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async (reviewId: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) return;

    try {
      const response = await fetch('https://functions.poehali.dev/da2543a1-a4e2-4e72-96dc-57517a2f27f0', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'archive',
          review_id: reviewId,
          admin_id: adminId
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно',
          description: 'Отзыв удален'
        });
        loadReviews();
      } else {
        throw new Error(data.error || 'Failed to archive');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить отзыв',
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="MessageSquare" size={24} />
            Отзывы клиентов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="MessageSquare" size={24} />
            Отзывы клиентов
            <Badge variant="secondary" className="ml-auto">
              {reviews.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">💬</div>
              <p>Отзывов пока нет</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="border-l-4 border-purple-500">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{review.client_name}</span>
                          {review.client_phone && (
                            <span className="text-sm text-muted-foreground">
                              ({review.client_phone})
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {review.listing_title} • {review.city}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(review.created_at)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-lg ${
                                star <= review.rating ? 'text-yellow-500' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm mb-3 bg-gray-50 p-3 rounded-lg">
                      {review.comment}
                    </p>
                    
                    {review.manager_response ? (
                      <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500 mb-3">
                        <div className="text-xs font-semibold text-purple-700 mb-1">
                          Ваш ответ {review.responder_name && `(${review.responder_name})`}
                        </div>
                        <p className="text-sm">{review.manager_response}</p>
                        {review.responded_at && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDate(review.responded_at)}
                          </div>
                        )}
                      </div>
                    ) : canRespond ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedReview(review);
                          setResponseText('');
                        }}
                      >
                        <Icon name="Reply" size={14} className="mr-1" />
                        Ответить
                      </Button>
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        Ответа пока нет
                      </div>
                    )}

                    {canArchive && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="ml-2"
                        onClick={() => handleArchive(review.id)}
                      >
                        <Icon name="Trash2" size={14} className="mr-1" />
                        Удалить
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedReview} onOpenChange={(open) => !open && setSelectedReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ответить на отзыв</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-semibold mb-1">{selectedReview.client_name}</div>
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-lg ${
                        star <= selectedReview.rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm">{selectedReview.comment}</p>
              </div>

              <Textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Напишите ответ клиенту..."
                rows={4}
              />

              <div className="flex gap-2">
                <Button
                  onClick={handleRespond}
                  disabled={isSubmitting || !responseText.trim()}
                  className="flex-1"
                >
                  {isSubmitting ? 'Отправка...' : 'Отправить ответ'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedReview(null)}
                  disabled={isSubmitting}
                >
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
