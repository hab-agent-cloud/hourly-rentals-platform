import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface Room {
  id?: number;
  type: string;
  price: number;
  expert_photo_rating?: number;
  expert_photo_feedback?: string;
  expert_fullness_rating?: number;
  expert_fullness_feedback?: string;
}

interface ExpertRatingDialogFullProps {
  listing: {
    id: number;
    title: string;
    expert_photo_rating?: number;
    expert_photo_feedback?: string;
    expert_fullness_rating?: number;
    expert_fullness_feedback?: string;
    rooms?: Room[];
  } | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}

interface RatingState {
  rating: number;
  feedback: string;
}

const StarRating = ({ 
  rating, 
  onRatingChange 
}: { 
  rating: number; 
  onRatingChange: (rating: number) => void;
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
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
  );
};

export default function ExpertRatingDialogFull({
  listing,
  open,
  onClose,
  onSuccess,
  token,
}: ExpertRatingDialogFullProps) {
  const [photoRating, setPhotoRating] = useState<RatingState>({ rating: 0, feedback: '' });
  const [fullnessRating, setFullnessRating] = useState<RatingState>({ rating: 0, feedback: '' });
  const [roomRatings, setRoomRatings] = useState<Map<number, { photo: RatingState; fullness: RatingState }>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (listing) {
      setPhotoRating({
        rating: listing.expert_photo_rating || 0,
        feedback: listing.expert_photo_feedback || '',
      });
      setFullnessRating({
        rating: listing.expert_fullness_rating || 0,
        feedback: listing.expert_fullness_feedback || '',
      });

      const newRoomRatings = new Map();
      listing.rooms?.forEach((room, index) => {
        newRoomRatings.set(index, {
          photo: {
            rating: room.expert_photo_rating || 0,
            feedback: room.expert_photo_feedback || '',
          },
          fullness: {
            rating: room.expert_fullness_rating || 0,
            feedback: room.expert_fullness_feedback || '',
          },
        });
      });
      setRoomRatings(newRoomRatings);
    }
  }, [listing]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await api.updateListingExpertRatings(token, listing!.id, {
        expert_photo_rating: photoRating.rating || null,
        expert_photo_feedback: photoRating.feedback.trim() || null,
        expert_fullness_rating: fullnessRating.rating || null,
        expert_fullness_feedback: fullnessRating.feedback.trim() || null,
        rooms: listing!.rooms?.map((room, index) => {
          const ratings = roomRatings.get(index);
          return {
            id: room.id,
            expert_photo_rating: ratings?.photo.rating || null,
            expert_photo_feedback: ratings?.photo.feedback.trim() || null,
            expert_fullness_rating: ratings?.fullness.rating || null,
            expert_fullness_feedback: ratings?.fullness.feedback.trim() || null,
          };
        }) || [],
      });

      toast({
        title: 'Успешно',
        description: 'Экспертные оценки сохранены',
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось сохранить оценки',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!listing) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="Award" size={24} className="text-purple-600" />
            Экспертная оценка: {listing.title}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="listing" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="listing">
              <Icon name="Building" size={16} className="mr-2" />
              Основной объект
            </TabsTrigger>
            <TabsTrigger value="rooms">
              <Icon name="Bed" size={16} className="mr-2" />
              Категории номеров ({listing.rooms?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listing" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="Camera" size={20} className="text-purple-600" />
                  Оценка фотографий объекта
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-3 block">Оценка (1-5 звёзд)</label>
                  <StarRating
                    rating={photoRating.rating}
                    onRatingChange={(rating) => setPhotoRating({ ...photoRating, rating })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Обратная связь</label>
                  <Textarea
                    value={photoRating.feedback}
                    onChange={(e) => setPhotoRating({ ...photoRating, feedback: e.target.value })}
                    placeholder="Ваши рекомендации по улучшению фотографий..."
                    className="min-h-[100px]"
                    maxLength={1000}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="ListChecks" size={20} className="text-blue-600" />
                  Оценка наполняемости объекта
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-3 block">Оценка (1-5 звёзд)</label>
                  <StarRating
                    rating={fullnessRating.rating}
                    onRatingChange={(rating) => setFullnessRating({ ...fullnessRating, rating })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Обратная связь</label>
                  <Textarea
                    value={fullnessRating.feedback}
                    onChange={(e) => setFullnessRating({ ...fullnessRating, feedback: e.target.value })}
                    placeholder="Ваши рекомендации по улучшению информации об объекте..."
                    className="min-h-[100px]"
                    maxLength={1000}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4 mt-4">
            {listing.rooms && listing.rooms.length > 0 ? (
              listing.rooms.map((room, index) => {
                const ratings = roomRatings.get(index) || { photo: { rating: 0, feedback: '' }, fullness: { rating: 0, feedback: '' } };
                
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{room.type} - {room.price} ₽/час</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Icon name="Camera" size={18} className="text-purple-600" />
                          Фотографии номера
                        </h4>
                        <div>
                          <label className="text-sm font-medium mb-3 block">Оценка</label>
                          <StarRating
                            rating={ratings.photo.rating}
                            onRatingChange={(rating) => {
                              const newRatings = new Map(roomRatings);
                              newRatings.set(index, {
                                ...ratings,
                                photo: { ...ratings.photo, rating },
                              });
                              setRoomRatings(newRatings);
                            }}
                          />
                        </div>
                        <div>
                          <Textarea
                            value={ratings.photo.feedback}
                            onChange={(e) => {
                              const newRatings = new Map(roomRatings);
                              newRatings.set(index, {
                                ...ratings,
                                photo: { ...ratings.photo, feedback: e.target.value },
                              });
                              setRoomRatings(newRatings);
                            }}
                            placeholder="Обратная связь по фотографиям номера..."
                            className="min-h-[80px]"
                            maxLength={1000}
                          />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Icon name="ListChecks" size={18} className="text-blue-600" />
                          Наполняемость номера
                        </h4>
                        <div>
                          <label className="text-sm font-medium mb-3 block">Оценка</label>
                          <StarRating
                            rating={ratings.fullness.rating}
                            onRatingChange={(rating) => {
                              const newRatings = new Map(roomRatings);
                              newRatings.set(index, {
                                ...ratings,
                                fullness: { ...ratings.fullness, rating },
                              });
                              setRoomRatings(newRatings);
                            }}
                          />
                        </div>
                        <div>
                          <Textarea
                            value={ratings.fullness.feedback}
                            onChange={(e) => {
                              const newRatings = new Map(roomRatings);
                              newRatings.set(index, {
                                ...ratings,
                                fullness: { ...ratings.fullness, feedback: e.target.value },
                              });
                              setRoomRatings(newRatings);
                            }}
                            placeholder="Обратная связь по наполняемости номера..."
                            className="min-h-[80px]"
                            maxLength={1000}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="text-center py-8 text-muted-foreground">
                  <Icon name="Bed" size={48} className="mx-auto mb-2 opacity-20" />
                  У этого объекта нет категорий номеров
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
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
                Сохранить все оценки
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
