import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Room {
  id: number;
  type: string;
  price: number;
  expert_photo_rating?: number;
  expert_photo_feedback?: string;
  expert_fullness_rating?: number;
  expert_fullness_feedback?: string;
}

interface Listing {
  id: number;
  title: string;
  city: string;
  image_url: string;
  type: string;
  expert_photo_rating?: number;
  expert_photo_feedback?: string;
  expert_fullness_rating?: number;
  expert_fullness_feedback?: string;
  rooms?: Room[];
}

interface OwnerExpertTabProps {
  listings: Listing[];
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

const getScoreBgColor = (score: number) => {
  if (score <= 2) return 'bg-red-50 border-red-200';
  if (score === 3) return 'bg-orange-50 border-orange-200';
  if (score === 4) return 'bg-blue-50 border-blue-200';
  return 'bg-green-50 border-green-200';
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
  subtitle, 
  rating, 
  feedback 
}: { 
  icon: string; 
  iconColor: string; 
  iconBg: string; 
  title: string; 
  subtitle?: string;
  rating: number; 
  feedback: string;
}) => (
  <div className="bg-white border rounded-lg p-6 hover:border-purple-300 transition-colors">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
          <Icon name={icon as any} size={24} className={iconColor} />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <Badge variant={getScoreBadgeVariant(rating)} className="text-sm px-3 py-1">
        {rating} из 5
      </Badge>
    </div>
    
    <div className="mb-4 flex items-center gap-2">
      {renderStars(rating)}
      <span className={`font-bold text-lg ml-2 ${getScoreColor(rating)}`}>
        {rating} звезд{rating === 1 ? 'а' : rating <= 4 ? 'ы' : ''}
      </span>
    </div>
    
    <div className={`p-4 rounded-lg border ${getScoreBgColor(rating)}`}>
      <div className="flex items-start gap-3">
        <Icon 
          name={rating >= 4 ? "ThumbsUp" : "AlertCircle"} 
          size={20} 
          className={getScoreColor(rating)}
        />
        <div>
          <h4 className={`font-semibold mb-1 ${getScoreColor(rating)}`}>
            Обратная связь эксперта:
          </h4>
          <p className="text-sm whitespace-pre-line">{feedback}</p>
        </div>
      </div>
    </div>
  </div>
);

export default function OwnerExpertTab({ listings }: OwnerExpertTabProps) {
  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Icon name="Award" size={32} className="text-purple-600" />
            <div>
              <CardTitle className="text-2xl">Экспертная оценка ваших объектов</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Улучшите свои объекты с помощью рекомендаций от экспертов
              </p>
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
        <div className="grid grid-cols-1 gap-6">
          {listings.map((listing) => {
            const hasPhotoRating = listing.expert_photo_rating && listing.expert_photo_rating > 0;
            const hasFullnessRating = listing.expert_fullness_rating && listing.expert_fullness_rating > 0;
            const hasAnyRating = hasPhotoRating || hasFullnessRating;
            const hasRoomRatings = listing.rooms?.some(room => 
              (room.expert_photo_rating && room.expert_photo_rating > 0) || 
              (room.expert_fullness_rating && room.expert_fullness_rating > 0)
            );
            
            return (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-1">{listing.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon name="MapPin" size={14} />
                        <span>{listing.city}</span>
                        <Badge variant="outline">{listing.type}</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  {!hasAnyRating && !hasRoomRatings ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Icon name="Clock" size={48} className="mx-auto mb-3 opacity-20" />
                      <p>Эксперт ещё не оценил этот объект</p>
                      <p className="text-sm mt-1">Оценка появится после проверки</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Оценки основного объекта */}
                      {hasAnyRating && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Icon name="Building" size={20} className="text-purple-600" />
                            Основной объект
                          </h3>
                          
                          {hasPhotoRating && (
                            <RatingCard
                              icon="Camera"
                              iconColor="text-purple-600"
                              iconBg="bg-purple-100"
                              title="Фотографии объекта"
                              subtitle="Оценка от эксперта"
                              rating={listing.expert_photo_rating!}
                              feedback={listing.expert_photo_feedback!}
                            />
                          )}

                          {hasFullnessRating && (
                            <RatingCard
                              icon="ListChecks"
                              iconColor="text-blue-600"
                              iconBg="bg-blue-100"
                              title="Наполняемость объекта"
                              subtitle="Оценка от эксперта"
                              rating={listing.expert_fullness_rating!}
                              feedback={listing.expert_fullness_feedback!}
                            />
                          )}
                        </div>
                      )}

                      {/* Оценки номеров */}
                      {hasRoomRatings && (
                        <div className="space-y-4 pt-4 border-t">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Icon name="Bed" size={20} className="text-green-600" />
                            Категории номеров
                          </h3>
                          
                          {listing.rooms?.map((room, idx) => {
                            const hasRoomPhotoRating = room.expert_photo_rating && room.expert_photo_rating > 0;
                            const hasRoomFullnessRating = room.expert_fullness_rating && room.expert_fullness_rating > 0;
                            
                            if (!hasRoomPhotoRating && !hasRoomFullnessRating) return null;
                            
                            return (
                              <Card key={idx} className="border-2">
                                <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 pb-3">
                                  <CardTitle className="text-base flex items-center justify-between">
                                    <span>{room.type}</span>
                                    <span className="text-sm font-normal text-muted-foreground">{room.price} ₽/час</span>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                  {hasRoomPhotoRating && (
                                    <RatingCard
                                      icon="Camera"
                                      iconColor="text-purple-600"
                                      iconBg="bg-purple-100"
                                      title="Фотографии номера"
                                      rating={room.expert_photo_rating!}
                                      feedback={room.expert_photo_feedback!}
                                    />
                                  )}

                                  {hasRoomFullnessRating && (
                                    <RatingCard
                                      icon="ListChecks"
                                      iconColor="text-blue-600"
                                      iconBg="bg-blue-100"
                                      title="Наполняемость номера"
                                      rating={room.expert_fullness_rating!}
                                      feedback={room.expert_fullness_feedback!}
                                    />
                                  )}
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
