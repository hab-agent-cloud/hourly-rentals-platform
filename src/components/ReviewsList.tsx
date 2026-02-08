import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

interface Review {
  id: number;
  client_name: string;
  rating: number;
  comment: string;
  manager_response?: string;
  responded_at?: string;
  created_at: string;
  responder_name?: string;
}

interface ReviewsListProps {
  listingId: number;
}

export default function ReviewsList({ listingId }: ReviewsListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/da2543a1-a4e2-4e72-96dc-57517a2f27f0?listing_id=${listingId}`
      );
      const data = await response.json();
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      loadReviews();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Icon name="Eye" size={14} className="mr-1" />
          Смотреть отзывы
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Отзывы об объекте</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">💬</div>
            <p>Отзывов пока нет</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold">{review.client_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(review.created_at)}
                      </div>
                    </div>
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
                  
                  <p className="text-sm mb-3">{review.comment}</p>
                  
                  {review.manager_response && (
                    <div className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-500">
                      <div className="text-xs font-semibold text-purple-700 mb-1">
                        Ответ менеджера {review.responder_name && `(${review.responder_name})`}
                      </div>
                      <p className="text-sm">{review.manager_response}</p>
                      {review.responded_at && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatDate(review.responded_at)}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
