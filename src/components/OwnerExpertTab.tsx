import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import ImageLightbox from '@/components/ImageLightbox';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Room {
  id: number;
  type: string;
  price: number;
  images?: string[];
  description?: string;
  expert_photo_rating?: number;
  expert_description_rating?: number;
}

interface Listing {
  id: number;
  title: string;
  city: string;
  district?: string;
  image_url: string;
  type: string;
  expert_photo_rating?: number;
  expert_description_rating?: number;
  rooms?: Room[];
}

interface OwnerExpertTabProps {
  listings: Listing[];
  token: string;
  ownerId: number;
  onUpdate: () => void;
}

const renderStars = (score: number) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          name="Star"
          size={20}
          className={star <= score ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
};

const getScoreColor = (score: number) => {
  if (score <= 2) return 'text-red-600';
  if (score === 3) return 'text-orange-600';
  if (score === 4) return 'text-blue-600';
  return 'text-green-600';
};

const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
  if (score <= 2) return 'destructive';
  if (score === 3) return 'secondary';
  return 'default';
};

const RatingCard = ({ 
  icon, 
  iconColor, 
  iconBg, 
  title, 
  rating, 
  image,
  text,
  images,
  onImageClick
}: { 
  icon: string; 
  iconColor: string; 
  iconBg: string; 
  title: string; 
  rating: number; 
  image?: string;
  text?: string;
  images?: string[];
  onImageClick?: (imgs: string[], idx: number) => void;
}) => (
  <div className="bg-white border rounded-lg p-5 hover:border-purple-300 transition-colors">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}>
          <Icon name={icon as any} size={20} className={iconColor} />
        </div>
        <h3 className="font-semibold text-base">{title}</h3>
      </div>
      <Badge variant={getScoreBadgeVariant(rating)} className="text-sm px-2.5 py-0.5">
        {rating}/5
      </Badge>
    </div>

    {(image || images || text) && (
      <div className="mb-3 p-3 bg-gray-50 rounded-lg border">
        {image && (
          <img 
            src={image} 
            alt={title} 
            className="w-full h-40 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => onImageClick?.([image], 0)}
          />
        )}
        {images && images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {images.slice(0, 6).map((img, idx) => (
              <img 
                key={idx} 
                src={img} 
                alt={`${title} ${idx + 1}`} 
                className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onImageClick?.(images, idx)}
              />
            ))}
          </div>
        )}
        {text && (
          <div className="text-sm text-gray-700 line-clamp-3">
            {text}
          </div>
        )}
      </div>
    )}
    
    <div className="flex items-center gap-2">
      {renderStars(rating)}
      <span className={`font-bold text-base ml-1 ${getScoreColor(rating)}`}>
        {rating}★
      </span>
    </div>
  </div>
);

export default function OwnerExpertTab({ listings }: OwnerExpertTabProps) {
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const handleImageClick = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Icon name="Lightbulb" size={24} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl mb-3">Рекомендации для успешной аренды</CardTitle>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <Icon name="Camera" size={18} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <p><strong>Фотографии решают всё:</strong> Гости выбирают объекты в первую очередь по качеству фото. Используйте яркие, чёткие снимки с хорошим освещением.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon name="FileText" size={18} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <p><strong>Полное описание:</strong> Укажите все удобства, особенности расположения и правила. Чем больше информации — тем больше доверия.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon name="Gift" size={18} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <p><strong>Лояльность к гостям:</strong> Предлагайте акции и скидки при повторном бронировании. Постоянные клиенты — основа стабильного дохода.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon name="Zap" size={18} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <p><strong>Быстрый отклик:</strong> Отвечайте на запросы гостей в течение 15-30 минут. Скорость ответа напрямую влияет на конверсию.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon name="Star" size={18} className="text-purple-600 mt-0.5 flex-shrink-0" />
                    <p><strong>Репутация:</strong> Просите довольных гостей оставлять отзывы. Хорошие отзывы повышают доверие новых клиентов.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {listings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Icon name="Building" size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground">У вас пока нет объектов для оценки</p>
            </CardContent>
          </Card>
        ) : (
          listings.map((listing) => {
            const hasRatings = listing.expert_photo_rating || listing.expert_description_rating;

            return (
              <Card key={listing.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={listing.image_url} 
                        alt={listing.title} 
                        className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleImageClick([listing.image_url], 0)}
                      />
                      <div>
                        <CardTitle className="text-lg">{listing.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{listing.city}{listing.district ? `, ${listing.district}` : ''}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  {!hasRatings ? (
                    <Alert className="border-purple-200 bg-purple-50/50">
                      <Icon name="Clock" size={20} className="text-purple-600" />
                      <AlertDescription className="ml-2">
                        Эксперт ещё не оценил этот объект. Оценка появится в ближайшее время.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <div className="mb-6">
                        <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                          <Icon name="Home" size={20} className="text-purple-600" />
                          Оценка объекта
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {listing.expert_photo_rating && (
                            <RatingCard
                              icon="Camera"
                              iconColor="text-purple-600"
                              iconBg="bg-purple-100"
                              title="Фотографии"
                              rating={listing.expert_photo_rating}
                              image={listing.image_url}
                              onImageClick={handleImageClick}
                            />
                          )}
                          {listing.expert_description_rating && (
                            <RatingCard
                              icon="FileText"
                              iconColor="text-blue-600"
                              iconBg="bg-blue-100"
                              title="Описание"
                              rating={listing.expert_description_rating}
                              text={`${listing.title} — ${listing.type} в ${listing.city}`}
                              onImageClick={handleImageClick}
                            />
                          )}
                        </div>
                      </div>

                      {listing.rooms && listing.rooms.length > 0 && (
                        <div>
                          <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                            <Icon name="Bed" size={20} className="text-purple-600" />
                            Оценка категорий номеров
                          </h3>
                          {listing.rooms.map((room, idx) => {
                            const hasRoomRatings = room.expert_photo_rating || room.expert_description_rating;
                            
                            if (!hasRoomRatings) return null;

                            return (
                              <div key={room.id || idx} className="mb-6 last:mb-0">
                                <div className="bg-gray-50 px-4 py-2 rounded-t-lg border border-b-0">
                                  <h4 className="font-medium text-sm">{room.type} — {room.price} ₽</h4>
                                </div>
                                <div className="border rounded-b-lg p-4 grid md:grid-cols-2 gap-4">
                                  {room.expert_photo_rating && (
                                    <RatingCard
                                      icon="Camera"
                                      iconColor="text-purple-600"
                                      iconBg="bg-purple-100"
                                      title="Фотографии номера"
                                      rating={room.expert_photo_rating}
                                      images={room.images}
                                      onImageClick={handleImageClick}
                                    />
                                  )}
                                  {room.expert_description_rating && (
                                    <RatingCard
                                      icon="FileText"
                                      iconColor="text-blue-600"
                                      iconBg="bg-blue-100"
                                      title="Описание номера"
                                      rating={room.expert_description_rating}
                                      text={room.description}
                                      onImageClick={handleImageClick}
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <ImageLightbox
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        isOpen={lightboxOpen}
      />
    </>
  );
}
