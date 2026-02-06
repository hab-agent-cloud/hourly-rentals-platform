import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useEffect, useState } from 'react';

interface Promotion {
  id: number;
  promotion_type: 'hot_offer' | 'three_for_two';
  discount_percent?: number;
  expires_at: string;
}

interface PromotionBadgeProps {
  listingId: number;
}

export default function PromotionBadge({ listingId }: PromotionBadgeProps) {
  const [promotion, setPromotion] = useState<Promotion | null>(null);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await fetch(`https://functions.poehali.dev/41a11d3f-dfa0-463c-9f3f-7d6c69d3d293?listing_id=${listingId}`);
        const data = await response.json();
        
        if (data.promotions && data.promotions.length > 0) {
          const activePromo = data.promotions.find((p: Promotion) => 
            new Date(p.expires_at) > new Date()
          );
          setPromotion(activePromo || null);
        }
      } catch (error) {
        console.error('Error fetching promotion:', error);
      }
    };

    fetchPromotion();
  }, [listingId]);

  if (!promotion) return null;

  const getPromotionContent = () => {
    if (promotion.promotion_type === 'hot_offer') {
      return {
        icon: 'Flame',
        text: `🔥 Скидка ${promotion.discount_percent}%`,
        gradient: 'from-orange-500 to-red-500'
      };
    }
    return {
      icon: 'Gift',
      text: '🎁 3 часа в подарок',
      gradient: 'from-pink-500 to-purple-500'
    };
  };

  const content = getPromotionContent();

  return (
    <div className="w-full mb-3 p-3 bg-gradient-to-r from-orange-50 via-pink-50 to-red-50 rounded-lg border-2 border-orange-200 shadow-lg animate-pulse">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${content.gradient} flex items-center justify-center`}>
            <Icon name={content.icon} size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm sm:text-base bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              {content.text}
            </p>
            <p className="text-xs text-muted-foreground">
              До {new Date(promotion.expires_at).toLocaleDateString('ru-RU', { 
                day: 'numeric', 
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        <Badge className={`bg-gradient-to-r ${content.gradient} text-white border-0 shadow-md`}>
          АКЦИЯ
        </Badge>
      </div>
    </div>
  );
}
