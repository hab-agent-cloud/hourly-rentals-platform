import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const REVIEWS_URL = 'https://functions.poehali.dev/da2543a1-a4e2-4e72-96dc-57517a2f27f0';

const SOURCE_SITES = [
  { value: 'yandex', label: 'Яндекс Карты' },
  { value: '2gis', label: '2ГИС' },
  { value: 'google', label: 'Google Maps' },
  { value: 'avito', label: 'Авито' },
  { value: 'booking', label: 'Booking' },
  { value: 'sutochno', label: 'Суточно.ру' },
  { value: 'other', label: 'Другой сайт' },
];

interface CopyReviewDialogProps {
  open: boolean;
  onClose: () => void;
  listingId: number;
  listingName: string;
  adminId: number;
  onSuccess: () => void;
}

export default function CopyReviewDialog({
  open,
  onClose,
  listingId,
  listingName,
  adminId,
  onSuccess,
}: CopyReviewDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientName, setClientName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [sourceSite, setSourceSite] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [reviewDate, setReviewDate] = useState('');

  const resetForm = () => {
    setClientName('');
    setRating(5);
    setComment('');
    setSourceSite('');
    setSourceUrl('');
    setReviewDate('');
  };

  const handleSubmit = async () => {
    if (!clientName.trim() || !comment.trim()) {
      toast({
        title: 'Заполните обязательные поля',
        description: 'Укажите имя автора и текст отзыва',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(REVIEWS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          listing_id: listingId,
          client_name: clientName.trim(),
          rating,
          comment: comment.trim(),
          source_site: sourceSite || null,
          source_url: sourceUrl.trim() || null,
          added_by_manager_id: adminId,
          review_date: reviewDate || null,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Отзыв добавлен',
          description: `Отзыв от "${clientName}" успешно скопирован`,
        });
        resetForm();
        onSuccess();
        onClose();
      } else {
        throw new Error(data.error || 'Ошибка при добавлении');
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Не удалось добавить отзыв';
      toast({
        title: 'Ошибка',
        description: errMsg,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { resetForm(); onClose(); } }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Copy" size={20} className="text-purple-600" />
            Скопировать отзыв
          </DialogTitle>
        </DialogHeader>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm">
          <span className="text-muted-foreground">Объект:</span>{' '}
          <span className="font-medium">{listingName}</span>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Имя автора отзыва *</Label>
            <Input
              placeholder="Например: Анна К."
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </div>

          <div>
            <Label>Оценка *</Label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <span className={`text-2xl ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                    ★
                  </span>
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground self-center">
                {rating} из 5
              </span>
            </div>
          </div>

          <div>
            <Label>Текст отзыва *</Label>
            <Textarea
              placeholder="Скопируйте текст отзыва сюда..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <div>
            <Label>Откуда скопирован</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {SOURCE_SITES.map((site) => (
                <button
                  key={site.value}
                  type="button"
                  onClick={() => setSourceSite(sourceSite === site.value ? '' : site.value)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                    sourceSite === site.value
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {site.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Ссылка на оригинал (необязательно)</Label>
            <Input
              placeholder="https://..."
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
            />
          </div>

          <div>
            <Label>Дата отзыва (необязательно)</Label>
            <Input
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Если не указать, будет поставлена сегодняшняя дата
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => { resetForm(); onClose(); }}
            disabled={isSubmitting}
          >
            Отмена
          </Button>
          <Button
            className="flex-1 bg-purple-600 hover:bg-purple-700"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Сохраняю...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Icon name="Check" size={16} />
                Добавить отзыв
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}