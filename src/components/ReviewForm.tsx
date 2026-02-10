import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ReviewFormProps {
  listingId: number;
  onSuccess?: () => void;
}

export default function ReviewForm({ listingId, onSuccess }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName.trim() || !comment.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
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
          action: 'create',
          listing_id: listingId,
          client_name: clientName,
          client_phone: clientPhone,
          rating: rating,
          comment: comment
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Отзыв отправлен',
          description: 'Спасибо за ваш отзыв!',
        });
        setIsOpen(false);
        setClientName('');
        setClientPhone('');
        setComment('');
        setRating(5);
        if (onSuccess) onSuccess();
      } else {
        throw new Error(data.error || 'Failed to submit review');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить отзыв',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-xs px-2 py-1 h-7">
          <Icon name="MessageSquare" size={12} className="mr-1" />
          Отзыв
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Оставить отзыв</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Оценка</Label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-all ${
                    star <= rating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="name">Ваше имя *</Label>
            <Input
              id="name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Иван Иванов"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Телефон (необязательно)</Label>
            <Input
              id="phone"
              value={clientPhone}
              onChange={(e) => setClientPhone(e.target.value)}
              placeholder="+7 (900) 123-45-67"
            />
          </div>

          <div>
            <Label htmlFor="comment">Ваш отзыв *</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Расскажите о вашем опыте..."
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}