import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const REVIEWS_URL = 'https://functions.poehali.dev/da2543a1-a4e2-4e72-96dc-57517a2f27f0';

interface Review {
  id: number;
  client_name: string;
  rating: number;
  comment: string;
  photo_url?: string;
  source_site?: string;
  source_url?: string;
  created_at: string;
}

interface ListingReviewsProps {
  listingId: number;
}

export default function ListingReviews({ listingId }: ListingReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${REVIEWS_URL}?listing_id=${listingId}`);
        const data = await response.json();
        if (data.reviews && data.reviews.length > 0) {
          setReviews(data.reviews);
        }
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    if (listingId) fetchReviews();
  }, [listingId]);

  if (loading || reviews.length === 0) return null;

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="mt-8 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Icon name="MessageSquare" size={20} className="text-purple-600" />
          Отзывы гостей ({reviews.length})
        </h3>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((s) => (
            <Icon key={s} name="Star" size={16}
              className={s <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            />
          ))}
          <span className="text-sm font-semibold ml-1">{avgRating.toFixed(1)}</span>
        </div>
      </div>

      <div className="space-y-3">
        {displayedReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {review.client_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-semibold text-sm">{review.client_name}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Icon key={s} name="Star" size={12}
                        className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  {review.source_site && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">{review.source_site}</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                {review.photo_url && (
                  <img src={review.photo_url} alt="Фото" className="mt-2 w-28 h-28 object-cover rounded-lg" />
                )}
                <p className="text-[11px] text-muted-foreground mt-2">
                  {new Date(review.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviews.length > 3 && !showAll && (
        <Button variant="outline" className="w-full mt-3" onClick={() => setShowAll(true)}>
          Показать все отзывы ({reviews.length})
        </Button>
      )}
    </div>
  );
}
