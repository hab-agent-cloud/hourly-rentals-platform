import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import ImageLightbox from '@/components/ImageLightbox';

interface Room {
  id?: number;
  type: string;
  price: number;
  images?: string[];
  description?: string;
  expert_photo_rating?: number;
  expert_description_rating?: number;
}

interface ExpertRatingDialogFullProps {
  listing: {
    id: number;
    title: string;
    image_url?: string;
    district?: string;
    description?: string;
    features?: string[];
    expert_photo_rating?: number;
    expert_description_rating?: number;
    rooms?: Room[];
  } | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}

interface RatingState {
  photo: number;
  description: number;
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
  const [siteRating, setSiteRating] = useState<RatingState>({
    photo: 0,
    description: 0,
  });
  const [roomRatings, setRoomRatings] = useState<Map<number, RatingState>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (listing) {
      setSiteRating({
        photo: listing.expert_photo_rating || 0,
        description: listing.expert_description_rating || 0,
      });

      const newRoomRatings = new Map();
      listing.rooms?.forEach((room, index) => {
        newRoomRatings.set(index, {
          photo: room.expert_photo_rating || 0,
          description: room.expert_description_rating || 0,
        });
      });
      setRoomRatings(newRoomRatings);
    }
  }, [listing]);

  const handleSubmit = async () => {
    if (siteRating.photo === 0 || siteRating.description === 0) {
      toast({
        title: 'Ошибка',
        description: 'Поставьте оценки для фотографий и описания объекта',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await api.updateListingExpertRatings(token, listing!.id, {
        expert_photo_rating: siteRating.photo,
        expert_description_rating: siteRating.description,
        rooms: listing!.rooms?.map((room, index) => {
          const ratings = roomRatings.get(index);
          return {
            id: room.id,
            expert_photo_rating: ratings?.photo || null,
            expert_description_rating: ratings?.description || null,
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
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Award" size={24} className="text-purple-600" />
              Экспертная оценка: {listing.title}
            </DialogTitle>
          </DialogHeader>

        <Tabs defaultValue="site" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="site">
              <Icon name="Globe" size={16} className="mr-2" />
              Объект на сайте
            </TabsTrigger>
            <TabsTrigger value="rooms">
              <Icon name="Bed" size={16} className="mr-2" />
              Категории номеров ({listing.rooms?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="site" className="space-y-4 mt-4">
            {listing.image_url && (
              <div className="mb-4">
                <img 
                  src={listing.image_url} 
                  alt={listing.title} 
                  className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity" 
                  onClick={() => {
                    setLightboxImages([listing.image_url || '']);
                    setLightboxIndex(0);
                    setLightboxOpen(true);
                  }}
                />
              </div>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="Camera" size={20} className="text-purple-600" />
                  Оценка фотографий
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StarRating
                  rating={siteRating.photo}
                  onRatingChange={(rating) => setSiteRating({...siteRating, photo: rating})}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="FileText" size={20} className="text-blue-600" />
                  Оценка описания
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {listing.description && (
                  <div className="p-3 bg-gray-50 rounded text-sm mb-3">
                    <p className="text-muted-foreground line-clamp-4">{listing.description}</p>
                  </div>
                )}
                <StarRating
                  rating={siteRating.description}
                  onRatingChange={(rating) => setSiteRating({...siteRating, description: rating})}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-4 mt-4">
            {!listing.rooms || listing.rooms.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8 text-muted-foreground">
                  <Icon name="Bed" size={48} className="mx-auto mb-2 opacity-20" />
                  <p>Нет категорий номеров для оценки</p>
                </CardContent>
              </Card>
            ) : (
              listing.rooms.map((room, index) => {
                const ratings = roomRatings.get(index) || { photo: 0, description: 0 };
                
                return (
                  <Card key={room.id || index} className="overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-3 border-b">
                      <h3 className="font-semibold text-base flex items-center justify-between">
                        <span>{room.type}</span>
                        <span className="text-purple-600">{room.price} ₽</span>
                      </h3>
                    </div>

                    <CardContent className="pt-4 space-y-4">
                      {room.images && room.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 mb-3">
                          {room.images.slice(0, 4).map((img, idx) => (
                            <img 
                              key={idx} 
                              src={img} 
                              alt={`${room.type} ${idx + 1}`} 
                              className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => {
                                setLightboxImages(room.images || []);
                                setLightboxIndex(idx);
                                setLightboxOpen(true);
                              }}
                            />
                          ))}
                        </div>
                      )}

                      <div>
                        <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                          <Icon name="Camera" size={16} className="text-purple-600" />
                          Оценка фотографий номера
                        </label>
                        <StarRating
                          rating={ratings.photo}
                          onRatingChange={(rating) => {
                            const newMap = new Map(roomRatings);
                            newMap.set(index, { ...ratings, photo: rating });
                            setRoomRatings(newMap);
                          }}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                          <Icon name="FileText" size={16} className="text-blue-600" />
                          Оценка описания номера
                        </label>
                        {room.description && (
                          <div className="p-3 bg-gray-50 rounded text-sm mb-3">
                            <p className="text-muted-foreground line-clamp-3">{room.description}</p>
                          </div>
                        )}
                        <StarRating
                          rating={ratings.description}
                          onRatingChange={(rating) => {
                            const newMap = new Map(roomRatings);
                            newMap.set(index, { ...ratings, description: rating });
                            setRoomRatings(newMap);
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
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
                Сохранить оценки
              </>
            )}
          </Button>
        </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImageLightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        isOpen={lightboxOpen}
      />
    </>
  );
}
