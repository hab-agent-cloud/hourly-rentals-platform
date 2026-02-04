import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import ListingPhotoSection from '@/components/listing-editor/ListingPhotoSection';
import ListingBasicInfoSection from '@/components/listing-editor/ListingBasicInfoSection';
import ListingRoomsPhotosSection from '@/components/listing-editor/ListingRoomsPhotosSection';
import ListingCategoriesSection from '@/components/listing-editor/ListingCategoriesSection';
import ListingGiftsSection from '@/components/listing-editor/ListingGiftsSection';

const FUNC_URL = 'https://functions.poehali.dev/4d42288a-e311-4754-98a2-944dfc667bd2';
const TRIAL_FUNC_URL = 'https://functions.poehali.dev/cc1242a8-bbc8-46d9-9bf4-03af08578a3b';

export default function ListingEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activatingTrial, setActivatingTrial] = useState(false);
  const [listing, setListing] = useState<any>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingRoomPhoto, setUploadingRoomPhoto] = useState<number | null>(null);
  const [selectedRoomForPhoto, setSelectedRoomForPhoto] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    district: '',
    metro_station: '',
    contact_phone: '',
    contact_telegram: '',
    type: '',
    price_per_day: '',
    square_meters: '',
    parking_type: '',
    parking_price_per_hour: '',
    short_title: '',
    image_url: '',
    logo_url: '',
    rooms: [] as any[]
  });
  
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    fetchListing();
  }, [id]);
  
  const fetchListing = async () => {
    try {
      const response = await fetch(`${FUNC_URL}?id=${id}`);
      const data = await response.json();
      
      if (data.listing) {
        setListing(data.listing);
        setFormData({
          name: data.listing.name || '',
          description: data.listing.description || '',
          address: data.listing.address || '',
          district: data.listing.district || '',
          metro_station: data.listing.metro_station || '',
          contact_phone: data.listing.contact_phone || '',
          contact_telegram: data.listing.contact_telegram || '',
          type: data.listing.type || '',
          price_per_day: data.listing.price_per_day || '',
          square_meters: data.listing.square_meters || '',
          parking_type: data.listing.parking_type || '',
          parking_price_per_hour: data.listing.parking_price_per_hour || '',
          short_title: data.listing.short_title || '',
          image_url: data.listing.image_url || '',
          logo_url: data.listing.logo_url || '',
          rooms: data.listing.rooms || []
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки объекта:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные объекта',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxWidth = 1200;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject('Ошибка сжатия');
                return;
              }
              const reader2 = new FileReader();
              reader2.onload = () => {
                const base64 = reader2.result?.toString().split(',')[1];
                if (base64) resolve(base64);
                else reject('Ошибка чтения');
              };
              reader2.readAsDataURL(blob);
            },
            'image/jpeg',
            0.7
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setUploadingPhoto(true);
    try {
      const base64 = await compressImage(file);
      const result = await api.uploadPhoto(token, base64, 'image/jpeg');
      
      if (result.url) {
        setFormData({ ...formData, image_url: result.url });
        toast({ title: 'Успешно', description: 'Фото загружено' });
      }
    } catch (error: any) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить фото', variant: 'destructive' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setUploadingLogo(true);
    try {
      const base64 = await compressImage(file);
      const result = await api.uploadPhoto(token, base64, 'image/jpeg');
      
      if (result.url) {
        setFormData({ ...formData, logo_url: result.url });
        toast({ title: 'Успешно', description: 'Логотип загружен' });
      }
    } catch (error: any) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить логотип', variant: 'destructive' });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRoomPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || selectedRoomForPhoto === null) return;

    const token = localStorage.getItem('adminToken');
    if (!token) return;

    setUploadingRoomPhoto(selectedRoomForPhoto);
    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const base64 = await compressImage(file);
        const result = await api.uploadPhoto(token, base64, 'image/jpeg');
        
        if (result.url) {
          uploadedUrls.push(result.url);
        }
      }

      if (uploadedUrls.length > 0) {
        const updatedRooms = [...formData.rooms];
        const currentImages = Array.isArray(updatedRooms[selectedRoomForPhoto].images) 
          ? updatedRooms[selectedRoomForPhoto].images 
          : [];
        updatedRooms[selectedRoomForPhoto].images = [...currentImages, ...uploadedUrls];
        setFormData({ ...formData, rooms: updatedRooms });
        toast({ title: 'Успешно', description: `Загружено ${uploadedUrls.length} фото` });
      }
    } catch (error: any) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить фото', variant: 'destructive' });
    } finally {
      setUploadingRoomPhoto(null);
      setSelectedRoomForPhoto(null);
    }
  };

  const handleDeleteRoomPhoto = (roomIndex: number, photoIndex: number) => {
    const updatedRooms = [...formData.rooms];
    updatedRooms[roomIndex].images = updatedRooms[roomIndex].images.filter((_: any, idx: number) => idx !== photoIndex);
    setFormData({ ...formData, rooms: updatedRooms });
    toast({ title: 'Удалено', description: 'Фото удалено' });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(FUNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: id,
          ...formData
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: 'Сохранено',
          description: 'Изменения успешно сохранены'
        });
        fetchListing();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось сохранить изменения',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при сохранении',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleActivateTrial = async () => {
    setActivatingTrial(true);
    try {
      const response = await fetch(TRIAL_FUNC_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing_id: id })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: '🎉 Пробная подписка активирована!',
          description: 'Ваш объект активен на 14 дней бесплатно'
        });
        await fetchListing();
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось активировать пробную подписку',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при активации',
        variant: 'destructive'
      });
    } finally {
      setActivatingTrial(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4" />
          <p>Загрузка объекта...</p>
        </div>
      </div>
    );
  }
  
  if (!listing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-destructive" />
          <p className="text-xl font-semibold mb-2">Объект не найден</p>
          <Button onClick={() => navigate('/manager')}>
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Вернуться назад
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Button variant="ghost" onClick={() => navigate('/manager')} className="mb-2">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад к списку
            </Button>
            <h1 className="text-3xl font-bold">{listing.name}</h1>
            <div className="flex gap-2 mt-2">
              <Badge variant={listing.status === 'active' ? 'default' : 'secondary'}>
                {listing.status === 'active' ? '✅ Активен' : '🧊 Заморожен'}
              </Badge>
              {listing.subscription_end && (
                <Badge variant="outline">
                  Подписка до: {new Date(listing.subscription_end).toLocaleDateString()}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-col sm:flex-row">
            {!listing.trial_activated_at && (
              <Button 
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                size="lg"
                onClick={handleActivateTrial}
                disabled={activatingTrial}
              >
                {activatingTrial ? (
                  <>
                    <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                    Активация...
                  </>
                ) : (
                  <>
                    <Icon name="Sparkles" size={18} className="mr-2" />
                    14 дней бесплатно • Активировать
                  </>
                )}
              </Button>
            )}
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.open(`/owner?extend_sub=${id}`, '_blank')}
            >
              <Icon name="CreditCard" size={18} className="mr-2" />
              Оформить подписку
            </Button>
            <Button onClick={handleSave} disabled={saving} size="lg">
              {saving ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Icon name="Save" size={18} className="mr-2" />
                  Сохранить изменения
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="space-y-6">
          <ListingPhotoSection
            imageUrl={formData.image_url}
            logoUrl={formData.logo_url}
            uploadingPhoto={uploadingPhoto}
            uploadingLogo={uploadingLogo}
            onPhotoUpload={handlePhotoUpload}
            onLogoUpload={handleLogoUpload}
            onRemovePhoto={() => setFormData({ ...formData, image_url: '' })}
            onRemoveLogo={() => setFormData({ ...formData, logo_url: '' })}
          />

          <ListingBasicInfoSection
            formData={formData}
            onFormChange={handleFormChange}
          />

          <ListingGiftsSection listingId={parseInt(id || '0')} />

          {formData.type && (formData.type.toLowerCase().includes('отель') || formData.type.toLowerCase().includes('гостиница')) && (
            <ListingCategoriesSection
              rooms={formData.rooms}
              onRoomsChange={(rooms) => setFormData({ ...formData, rooms })}
            />
          )}

          <ListingRoomsPhotosSection
            rooms={formData.rooms}
            uploadingRoomPhoto={uploadingRoomPhoto}
            onRoomPhotoUpload={handleRoomPhotoUpload}
            onSelectRoom={(roomIdx) => setSelectedRoomForPhoto(roomIdx)}
            onDeleteRoomPhoto={handleDeleteRoomPhoto}
          />
          
          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" onClick={() => navigate('/manager')}>
              <Icon name="X" size={16} className="mr-2" />
              Отменить
            </Button>
            <Button onClick={handleSave} disabled={saving} size="lg">
              {saving ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Icon name="Save" size={18} className="mr-2" />
                  Сохранить изменения
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}