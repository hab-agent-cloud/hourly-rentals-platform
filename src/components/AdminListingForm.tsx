import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface AdminListingFormProps {
  listing: any;
  token: string;
  onClose: (shouldReload?: boolean) => void;
}

export default function AdminListingForm({ listing, token, onClose }: AdminListingFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Инициализация formData
  const [formData, setFormData] = useState(() => {
    let images: string[] = [];
    if (listing?.image_url) {
      try {
        const parsed = JSON.parse(listing.image_url);
        images = Array.isArray(parsed) ? parsed : [listing.image_url];
      } catch {
        images = [listing.image_url];
      }
    }

    return {
      title: listing?.title || '',
      description: listing?.description || '',
      hour_price: listing?.hour_price || '',
      city: listing?.city || '',
      district: listing?.district || '',
      address: listing?.address || '',
      square_meters: listing?.square_meters || '',
      images: images,
      logo_url: listing?.logo_url || '',
      metro_station: listing?.metro_station || '',
      parking_type: listing?.parking_type || 'Нет',
      parking_price: listing?.parking_price || '',
      lat: listing?.lat || '',
      lon: listing?.lon || '',
      features: listing?.features ? (Array.isArray(listing.features) ? listing.features : JSON.parse(listing.features)) : [],
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        image_url: formData.images.length > 0 ? JSON.stringify(formData.images) : '',
      };

      let response;
      if (listing && listing.id) {
        response = await api.updateListing(token, listing.id, submitData);
        toast({
          title: "Объект обновлен",
          description: "Изменения успешно сохранены",
        });
      } else {
        response = await api.createListing(token, submitData);
        toast({
          title: "Объект создан",
          description: "Новый объект успешно добавлен",
        });
      }

      console.log('Response:', response);
      onClose(true);
    } catch (error: any) {
      console.error('Error saving listing:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось сохранить объект",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const base64 = await fileToBase64(file);
      const response = await api.uploadPhoto(token, base64, file.name);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, response.url]
      }));

      toast({
        title: "Фото загружено",
        description: "Изображение успешно добавлено",
      });
    } catch (error: any) {
      console.error('Photo upload error:', error);
      toast({
        title: "Ошибка загрузки",
        description: error.message || "Не удалось загрузить фото",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const base64 = await fileToBase64(file);
      const response = await api.uploadPhoto(token, base64, file.name);
      
      setFormData(prev => ({
        ...prev,
        logo_url: response.url
      }));

      toast({
        title: "Логотип загружен",
        description: "Логотип успешно обновлен",
      });
    } catch (error: any) {
      console.error('Logo upload error:', error);
      toast({
        title: "Ошибка загрузки",
        description: error.message || "Не удалось загрузить логотип",
        variant: "destructive",
      });
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const addFeature = () => {
    const input = prompt('Введите название особенности:');
    if (input && input.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, input.trim()]
      }));
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
      <Card className="w-full max-w-3xl max-h-[95vh] overflow-y-auto my-2">
        <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-background z-10 border-b">
          <CardTitle className="text-lg">
            {listing ? 'Редактирование объекта' : 'Создание объекта'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => onClose()}>
            <Icon name="X" size={20} />
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Название */}
            <div>
              <Label htmlFor="title">Название *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            {/* Описание */}
            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
              />
            </div>

            {/* Цена за час */}
            <div>
              <Label htmlFor="hour_price">Цена за час (₽) *</Label>
              <Input
                id="hour_price"
                type="number"
                value={formData.hour_price}
                onChange={(e) => setFormData({...formData, hour_price: e.target.value})}
                required
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {[500, 1000, 1500, 2000, 3000].map(price => (
                  <Button
                    key={price}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({...formData, hour_price: price.toString()})}
                  >
                    {price}₽
                  </Button>
                ))}
              </div>
            </div>

            {/* Площадь */}
            <div>
              <Label htmlFor="square_meters">Площадь (м²)</Label>
              <Input
                id="square_meters"
                type="number"
                value={formData.square_meters}
                onChange={(e) => setFormData({...formData, square_meters: e.target.value})}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {[20, 30, 50, 100, 200].map(area => (
                  <Button
                    key={area}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({...formData, square_meters: area.toString()})}
                  >
                    {area}м²
                  </Button>
                ))}
              </div>
            </div>

            {/* Город */}
            <div>
              <Label htmlFor="city">Город *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                required
              />
            </div>

            {/* Район */}
            <div>
              <Label htmlFor="district">Район</Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) => setFormData({...formData, district: e.target.value})}
              />
            </div>

            {/* Адрес */}
            <div>
              <Label htmlFor="address">Адрес *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
            </div>

            {/* Метро */}
            <div>
              <Label htmlFor="metro_station">Станция метро</Label>
              <Input
                id="metro_station"
                value={formData.metro_station}
                onChange={(e) => setFormData({...formData, metro_station: e.target.value})}
              />
            </div>

            {/* Координаты */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lat">Широта</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={(e) => setFormData({...formData, lat: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="lon">Долгота</Label>
                <Input
                  id="lon"
                  type="number"
                  step="any"
                  value={formData.lon}
                  onChange={(e) => setFormData({...formData, lon: e.target.value})}
                />
              </div>
            </div>

            {/* Парковка */}
            <div>
              <Label htmlFor="parking_type">Тип парковки</Label>
              <select
                id="parking_type"
                value={formData.parking_type}
                onChange={(e) => setFormData({...formData, parking_type: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option>Нет</option>
                <option>Бесплатная</option>
                <option>Платная</option>
              </select>
            </div>

            {formData.parking_type === 'Платная' && (
              <div>
                <Label htmlFor="parking_price">Цена парковки (₽/час)</Label>
                <Input
                  id="parking_price"
                  type="number"
                  value={formData.parking_price}
                  onChange={(e) => setFormData({...formData, parking_price: e.target.value})}
                />
              </div>
            )}

            {/* Особенности */}
            <div>
              <Label>Особенности</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full">
                    <span className="text-sm">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={() => removeFeature(index)}
                    >
                      <Icon name="X" size={14} />
                    </Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить особенность
              </Button>
            </div>

            {/* Фото */}
            <div>
              <Label>Фотографии</Label>
              <div className="grid grid-cols-3 gap-2 mt-2 mb-2">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img src={url} alt={`Фото ${index + 1}`} className="w-full h-32 object-cover rounded" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(index)}
                    >
                      <Icon name="Trash" size={14} />
                    </Button>
                  </div>
                ))}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
              >
                <Icon name={uploadingPhoto ? "Loader2" : "Upload"} size={16} className={`mr-2 ${uploadingPhoto ? 'animate-spin' : ''}`} />
                {uploadingPhoto ? 'Загрузка...' : 'Загрузить фото'}
              </Button>
            </div>

            {/* Логотип */}
            <div>
              <Label>Логотип</Label>
              {formData.logo_url && (
                <div className="mt-2 mb-2">
                  <img src={formData.logo_url} alt="Логотип" className="w-32 h-32 object-contain rounded border" />
                </div>
              )}
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingLogo}
              >
                <Icon name={uploadingLogo ? "Loader2" : "Upload"} size={16} className={`mr-2 ${uploadingLogo ? 'animate-spin' : ''}`} />
                {uploadingLogo ? 'Загрузка...' : 'Загрузить логотип'}
              </Button>
            </div>

            {/* Кнопки */}
            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isLoading}>
                <Icon name={isLoading ? "Loader2" : "Save"} size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <Button type="button" variant="outline" onClick={() => onClose()}>
                Отмена
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}