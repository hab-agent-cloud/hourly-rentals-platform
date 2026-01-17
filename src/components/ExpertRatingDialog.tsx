import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface ExpertRatingDialogProps {
  listing: {
    id: number;
    title: string;
    expert_fullness_rating?: number;
    expert_fullness_feedback?: string;
  } | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}

export default function ExpertRatingDialog({
  listing,
  open,
  onClose,
  onSuccess,
  token,
}: ExpertRatingDialogProps) {
  const [rating, setRating] = useState(listing?.expert_fullness_rating || 0);
  const [feedback, setFeedback] = useState(listing?.expert_fullness_feedback || '');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: 'Ошибка',
        description: 'Выберите оценку от 1 до 5 звёзд',
        variant: 'destructive',
      });
      return;
    }

    if (!feedback.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Напишите обратную связь для владельца',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.updateExpertRating(token, listing!.id, {
        expert_fullness_rating: rating,
        expert_fullness_feedback: feedback.trim(),
      });

      toast({
        title: 'Успешно',
        description: 'Экспертная оценка сохранена',
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось сохранить оценку',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!listing) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Award" size={24} className="text-purple-600" />
            Экспертная оценка: {listing.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <label className="text-sm font-medium mb-3 block">
              Оценка наполняемости объекта
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Icon
                    name="Star"
                    size={40}
                    className={
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-4 text-lg font-semibold text-purple-600">
                  {rating} из 5
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Обратная связь для владельца
            </label>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Напишите развёрнутую обратную связь: что хорошо, что нужно улучшить, конкретные рекомендации..."
              className="min-h-[150px]"
              maxLength={1000}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {feedback.length} / 1000 символов
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0 || !feedback.trim()}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isSubmitting ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Icon name="Save" size={16} className="mr-2" />
                Сохранить оценку
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
