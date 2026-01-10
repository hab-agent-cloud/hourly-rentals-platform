import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';

export default function RoomDetails() {
  const { listingId, roomIndex } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadListing = async () => {
      try {
        const listings = await api.getPublicListings();
        const foundListing = listings.find((l: any) => l.id === parseInt(listingId || '0'));
        const foundRoom = foundListing?.rooms?.[parseInt(roomIndex || '0')];
        
        setListing(foundListing);
        setRoom(foundRoom);
      } catch (error) {
        console.error('Failed to load listing:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadListing();
  }, [listingId, roomIndex]);

  const featureIcons: Record<string, string> = {
    'WiFi': 'Wifi',
    'Двуспальная кровать': 'Bed',
    '2 односпальные кровати': 'BedDouble',
    'Смарт ТВ': 'Tv',
    'Кондиционер': 'Wind',
    'Джакузи': 'Bath',
    'Душевая кабина': 'ShowerHead',
    'Фен': 'Wind',
    'Халаты': 'Shirt',
    'Тапочки': 'Footprints',
    'Холодильник': 'Refrigerator',
    'Микроволновка': 'Microwave',
    'Чайник': 'Coffee',
    'Посуда': 'UtensilsCrossed',
    'Сейф': 'Lock',
    'Зеркала': 'Sparkles',
    'Музыкальная система': 'Music',
    'Настольные игры': 'Dices',
    'PlayStation': 'Gamepad2',
    'Бар': 'Wine',
    'Косметика': 'Sparkles',
    'Полотенца': 'Sheet',
    'Постельное бельё': 'Bed',
    'Кухня': 'ChefHat',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-purple-600" />
      </div>
    );
  }

  if (!room || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Номер не найден</h2>
          <Button onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            На главную
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-purple-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(`/listing/${listingId}`)}>
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{listing.title}</h1>
              <p className="text-sm text-muted-foreground">{listing.city}, {listing.district}</p>
            </div>
            {listing.logo && (
              <div className="w-16 h-16 border rounded-lg bg-white p-1 flex items-center justify-center">
                <img src={listing.logo} alt={`${listing.title} logo`} className="max-w-full max-h-full object-contain" />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              <div className="mb-4">
                {room.images && room.images.length > 0 ? (
                  <img
                    src={room.images[selectedImageIndex]}
                    alt={room.type}
                    className="w-full h-96 object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <Icon name="Image" size={64} className="text-purple-300" />
                  </div>
                )}
              </div>

              {room.images && room.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {room.images.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx ? 'border-purple-600' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`${room.type} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-bold mb-2">{room.type}</h2>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl font-bold text-purple-600">{room.price} ₽/час</div>
                  {room.square_meters > 0 && (
                    <Badge variant="secondary" className="text-lg px-4 py-1">
                      <Icon name="Square" size={16} className="mr-1" />
                      {room.square_meters} м²
                    </Badge>
                  )}
                </div>
              </div>

              {room.description && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Описание</h3>
                  <p className="text-muted-foreground">{room.description}</p>
                </div>
              )}

              {room.features && room.features.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-3">Удобства</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {room.features.map((feature: string, idx: number) => {
                      const iconName = featureIcons[feature] || 'Check';
                      return (
                        <div
                          key={idx}
                          className="group relative flex flex-col items-center justify-center p-3 border rounded-lg hover:bg-purple-50 transition-colors cursor-pointer"
                          title={feature}
                        >
                          <Icon name={iconName} size={24} className="text-purple-600 mb-1" />
                          <span className="text-xs text-center opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-8 bg-gray-900 text-white px-2 py-1 rounded whitespace-nowrap z-10">
                            {feature}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {listing.phone && (
                  <Button 
                    asChild
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg py-6"
                  >
                    <a href={`tel:${listing.phone}`}>
                      <Icon name="Phone" size={20} className="mr-2" />
                      Позвонить
                    </a>
                  </Button>
                )}
                {listing.telegram && (
                  <Button 
                    asChild
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg py-6"
                  >
                    <a href={listing.telegram.startsWith('http') ? listing.telegram : `https://t.me/${listing.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                      <Icon name="Send" size={20} className="mr-2" />
                      Написать в Telegram
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}