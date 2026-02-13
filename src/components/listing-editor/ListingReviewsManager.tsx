import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

const REVIEWS_URL = 'https://functions.poehali.dev/da2543a1-a4e2-4e72-96dc-57517a2f27f0';

interface Review {
  id: number;
  client_name: string;
  rating: number;
  comment: string;
  photo_url?: string;
  source_url?: string;
  source_site?: string;
  created_at: string;
}

interface ListingReviewsManagerProps {
  listingId: number;
}

export default function ListingReviewsManager({ listingId }: ListingReviewsManagerProps) {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [form, setForm] = useState({
    client_name: '',
    rating: 5,
    comment: '',
    photo_url: '',
    source_url: '',
    source_site: ''
  });

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${REVIEWS_URL}?listing_id=${listingId}`);
      const data = await response.json();
      if (data.reviews) setReviews(data.reviews);
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [listingId]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem('adminToken') || localStorage.getItem('ownerToken');
    if (!token) return;

    setUploadingPhoto(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > 800) { height = (height * 800) / width; width = 800; }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob(async (blob) => {
            if (!blob) return;
            const r2 = new FileReader();
            r2.onload = async () => {
              const base64 = r2.result?.toString().split(',')[1];
              if (base64) {
                const result = await api.uploadPhoto(token, base64, 'image/jpeg');
                if (result.url) {
                  setForm(prev => ({ ...prev, photo_url: result.url }));
                  toast({ title: 'Фото загружено' });
                }
              }
              setUploadingPhoto(false);
            };
            r2.readAsDataURL(blob);
          }, 'image/jpeg', 0.7);
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить фото', variant: 'destructive' });
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.client_name || !form.comment) {
      toast({ title: 'Ошибка', description: 'Заполните имя и текст отзыва', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(REVIEWS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          listing_id: listingId,
          client_name: form.client_name,
          rating: form.rating,
          comment: form.comment,
          photo_url: form.photo_url || null,
          source_url: form.source_url || null,
          source_site: form.source_site || null
        })
      });

      const data = await response.json();
      if (data.success) {
        toast({ title: 'Отзыв добавлен' });
        setForm({ client_name: '', rating: 5, comment: '', photo_url: '', source_url: '', source_site: '' });
        setShowForm(false);
        fetchReviews();
      } else {
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось сохранить отзыв', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleArchive = async (reviewId: number) => {
    try {
      const response = await fetch(REVIEWS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'archive',
          review_id: reviewId,
          admin_id: 1
        })
      });
      const data = await response.json();
      if (data.success) {
        toast({ title: 'Отзыв удалён' });
        fetchReviews();
      }
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon name="Star" size={24} className="text-yellow-500" />
            Отзывы ({reviews.length})
          </CardTitle>
          <Button
            onClick={() => setShowForm(!showForm)}
            variant={showForm ? 'outline' : 'default'}
            className={showForm ? '' : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'}
          >
            {showForm ? (
              <><Icon name="X" size={16} className="mr-2" />Закрыть</>
            ) : (
              <><Icon name="Plus" size={16} className="mr-2" />Добавить отзыв</>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {showForm && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-5 rounded-lg border-2 border-dashed border-yellow-200 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Icon name="PenTool" size={18} />
              Добавить отзыв с другого сайта
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Имя гостя *</Label>
                <Input
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  placeholder="Иван П."
                />
              </div>
              <div>
                <Label>Оценка</Label>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className="focus:outline-none"
                    >
                      <Icon
                        name="Star"
                        size={28}
                        className={`transition-colors ${star <= form.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label>Текст отзыва *</Label>
              <Textarea
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                placeholder="Отличное место! Очень понравился номер..."
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Источник (сайт)</Label>
                <Input
                  value={form.source_site}
                  onChange={(e) => setForm({ ...form, source_site: e.target.value })}
                  placeholder="Яндекс, Авито, Google..."
                />
              </div>
              <div>
                <Label>Ссылка на оригинал</Label>
                <Input
                  value={form.source_url}
                  onChange={(e) => setForm({ ...form, source_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <Label>Фото отзыва (скриншот)</Label>
              <div className="mt-1 flex items-center gap-3">
                {form.photo_url ? (
                  <div className="relative">
                    <img src={form.photo_url} alt="Фото отзыва" className="w-24 h-24 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, photo_url: '' })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      x
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-purple-400 hover:text-purple-400 transition-colors">
                      {uploadingPhoto ? (
                        <Icon name="Loader2" size={24} className="animate-spin" />
                      ) : (
                        <>
                          <Icon name="Camera" size={24} />
                          <span className="text-xs mt-1">Фото</span>
                        </>
                      )}
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                )}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={saving || !form.client_name || !form.comment}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              {saving ? (
                <><Icon name="Loader2" size={16} className="mr-2 animate-spin" />Сохранение...</>
              ) : (
                <><Icon name="Plus" size={16} className="mr-2" />Добавить отзыв</>
              )}
            </Button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">
            <Icon name="Loader2" size={24} className="animate-spin mx-auto" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Icon name="MessageSquare" size={40} className="mx-auto mb-2 opacity-30" />
            <p>Нет отзывов</p>
            <p className="text-sm mt-1">Добавьте отзывы с других площадок</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{review.client_name}</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Icon key={s} name="Star" size={14}
                            className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      {review.source_site && (
                        <Badge variant="outline" className="text-xs">{review.source_site}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                    {review.photo_url && (
                      <img src={review.photo_url} alt="Фото" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(review.created_at).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleArchive(review.id)}>
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
