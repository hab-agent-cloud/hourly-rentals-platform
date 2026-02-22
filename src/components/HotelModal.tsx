import { useState, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import PromotionBadge from '@/components/PromotionBadge';
import { metrika } from '@/lib/metrika';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllImages = (imageUrl: any): string[] => {
  if (!imageUrl) return [];
  if (typeof imageUrl === 'string') {
    try {
      const parsed = JSON.parse(imageUrl);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((u: unknown) => typeof u === 'string' && u.length > 0);
      }
    } catch {
      return [imageUrl];
    }
  }
  if (Array.isArray(imageUrl) && imageUrl.length > 0) {
    return imageUrl.filter((u: unknown) => typeof u === 'string' && u.length > 0);
  }
  return [];
};

type Hotel = {
  id: number;
  title: string;
  type: string;
  city: string;
  district: string;
  price: number;
  auction: number;
  image_url: string;
  logo_url?: string;
  metro: string;
  features: string[];
  lat: number;
  lng: number;
  minHours: number;
  rooms: { type: string; price: number }[];
  phone?: string;
  telegram?: string;
};

interface HotelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotel: Hotel | null;
}

export default function HotelModal({ open, onOpenChange, hotel }: HotelModalProps) {
  const navigate = useNavigate();
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [virtualPhone, setVirtualPhone] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [isVirtualNumber, setIsVirtualNumber] = useState(false);
  const [isLoadingPhone, setIsLoadingPhone] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);
  
  const images = getAllImages(hotel?.image_url);

  const handlePrevImg = useCallback(() => {
    setCurrentImgIdx(prev => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const handleNextImg = useCallback(() => {
    setCurrentImgIdx(prev => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || images.length <= 1) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNextImg();
      else handlePrevImg();
    }
    touchStartX.current = null;
  }, [images.length, handleNextImg, handlePrevImg]);

  if (!hotel) return null;

  const handlePhoneClick = async () => {
    setPhoneModalOpen(true);
    setIsLoadingPhone(true);
    
    // Отслеживание клика на "Позвонить"
    metrika.trackPhoneClick(hotel.phone || '', hotel.id, hotel.title);
    
    try {
      console.log('[HotelModal] Requesting virtual number for listing:', hotel.id);
      const response = await fetch('https://functions.poehali.dev/4a500ec2-2f33-49d9-87d0-3779d8d52ae5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          listing_id: hotel.id,
          client_phone: 'web_user_' + Date.now()
        })
      });
      
      console.log('[HotelModal] Response status:', response.status);
      const data = await response.json();
      console.log('[HotelModal] Response data:', data);
      
      if (response.ok && data.virtual_number) {
        console.log('[HotelModal] Got virtual number:', data.virtual_number);
        setVirtualPhone(data.virtual_number);
        setOwnerPhone(data.owner_phone || hotel.phone || '');
        setIsVirtualNumber(true);
      } else {
        console.log('[HotelModal] Using fallback phone:', hotel.phone);
        setVirtualPhone(hotel.phone || '');
        setOwnerPhone('');
        setIsVirtualNumber(false);
      }
    } catch (error) {
      console.error('[HotelModal] Failed to get virtual number:', error);
      setVirtualPhone(hotel.phone || '');
      setOwnerPhone('');
      setIsVirtualNumber(false);
    } finally {
      setIsLoadingPhone(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {hotel.title}
            </DialogTitle>
            {hotel.logo_url && (
              <div className="w-20 h-20 border rounded-lg bg-white p-2 flex items-center justify-center flex-shrink-0">
                <img src={hotel.logo_url} alt={`${hotel.title} logo`} className="max-w-full max-h-full object-contain" />
              </div>
            )}
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div
            className="relative group overflow-hidden rounded-xl"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {images.length > 0 ? (
              <>
                <img src={images[currentImgIdx]} alt={hotel.title} className="h-64 w-full object-cover" />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImg}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                    >
                      <Icon name="ChevronLeft" size={20} />
                    </button>
                    <button
                      onClick={handleNextImg}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                    >
                      <Icon name="ChevronRight" size={20} />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {images.slice(0, 8).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImgIdx(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentImgIdx ? 'bg-white w-4' : 'bg-white/60 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
                      {currentImgIdx + 1}/{images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="h-64 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center text-9xl">
                🏨
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Icon name="MapPin" size={20} className="text-purple-600" />
              Местоположение
            </h3>
            <div className="space-y-2 text-muted-foreground">
              <p className="flex items-center gap-2">
                <Icon name="Building2" size={16} />
                {hotel.city}, {hotel.district}
              </p>
              {hotel.metro !== '-' && (
                <p className="flex items-center gap-2">
                  <span className="text-blue-600">Ⓜ️</span>
                  {hotel.metro}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Bed" size={20} className="text-purple-600" />
              Категории номеров
            </h3>
            <div className="space-y-3">
              {hotel.rooms.map((room, idx) => (
                <div 
                  key={idx} 
                  className="border-2 border-purple-100 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold">{room.type}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-purple-600">{room.price} ₽</div>
                      <div className="text-sm text-muted-foreground">за час</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => {
                onOpenChange(false);
                navigate(`/listing/${hotel.id}`);
              }}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
            >
              <Icon name="Eye" size={20} className="mr-2" />
              Смотреть все категории номеров
            </Button>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-100">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Icon name="Info" size={20} className="text-purple-600" />
              Важная информация
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Icon name="CheckCircle2" size={16} className="text-green-500 mt-0.5" />
                <span>Минимальное время бронирования — {hotel.minHours} {hotel.minHours === 1 ? 'час' : 'часа'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="CheckCircle2" size={16} className="text-green-500 mt-0.5" />
                <span>Оплата наличными или картой при заселении</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="CheckCircle2" size={16} className="text-green-500 mt-0.5" />
                <span>Бесплатная отмена за 1 час до заселения</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="CheckCircle2" size={16} className="text-green-500 mt-0.5" />
                <span>Круглосуточная поддержка клиентов</span>
              </li>
            </ul>
          </div>

          <PromotionBadge listingId={hotel.id} />

          <div className="flex gap-3">
            {hotel.phone && (
              <Button 
                onClick={handlePhoneClick}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg py-6"
              >
                <Icon name="Phone" size={20} className="mr-2" />
                Позвонить
              </Button>
            )}
            {hotel.telegram && (
              <Button 
                asChild
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg py-6"
              >
                <a href={hotel.telegram.startsWith('http') ? hotel.telegram : `https://t.me/${hotel.telegram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                  <Icon name="Send" size={20} className="mr-2" />
                  Написать в Telegram
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>

      <Dialog open={phoneModalOpen} onOpenChange={setPhoneModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Номер телефона</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {isLoadingPhone ? (
              <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-3"></div>
                <p className="text-sm text-muted-foreground">Подключаем безопасный номер...</p>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6 text-center">
                  <Icon name="Phone" size={48} className="mx-auto mb-3 text-green-600" />
                  <a href={`tel:${virtualPhone}`} className="text-3xl font-bold text-green-600 hover:text-green-700 transition-colors">
                    {virtualPhone}
                  </a>
                  <p className="text-xs text-muted-foreground mt-2">
                    {isVirtualNumber ? 'Защищённый номер действует 5 минут' : 'Прямой номер объекта'}
                  </p>
                </div>
                <Button 
                  asChild
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg py-6"
                >
                  <a href={`tel:${virtualPhone}`}>
                    <Icon name="Phone" size={20} className="mr-2" />
                    Позвонить сейчас
                  </a>
                </Button>
                {isVirtualNumber && ownerPhone && ownerPhone !== virtualPhone && (
                  <div className="border border-gray-200 rounded-xl p-4 text-center bg-gray-50">
                    <p className="text-sm text-muted-foreground mb-2">
                      Не дозвонились? Воспользуйтесь прямым номером объекта:
                    </p>
                    <a
                      href={`tel:${ownerPhone}`}
                      className="text-lg font-semibold text-gray-700 hover:text-gray-900 transition-colors underline underline-offset-2"
                    >
                      {ownerPhone}
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}