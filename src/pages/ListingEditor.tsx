import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const FUNC_URL = 'https://functions.poehali.dev/4d42288a-e311-4754-98a2-944dfc667bd2';

export default function ListingEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listing, setListing] = useState<any>(null);
  
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
    short_title: ''
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
          short_title: data.listing.short_title || ''
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
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Название объекта</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Квартира в центре"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Уютная квартира с отличным ремонтом..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Адрес и расположение</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Адрес</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="ул. Ленина, д. 10"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="district">Район</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="Центральный"
                  />
                </div>
                
                <div>
                  <Label htmlFor="metro_station">Метро</Label>
                  <Input
                    id="metro_station"
                    value={formData.metro_station}
                    onChange={(e) => setFormData({ ...formData, metro_station: e.target.value })}
                    placeholder="Площадь Ленина"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Контактная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_phone">Телефон</Label>
                  <Input
                    id="contact_phone"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact_telegram">Telegram</Label>
                  <Input
                    id="contact_telegram"
                    value={formData.contact_telegram}
                    onChange={(e) => setFormData({ ...formData, contact_telegram: e.target.value })}
                    placeholder="@username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Цены и характеристики</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price_per_day">Цена за сутки (₽)</Label>
                  <Input
                    id="price_per_day"
                    type="number"
                    value={formData.price_per_day}
                    onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })}
                    placeholder="2500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="square_meters">Площадь (м²)</Label>
                  <Input
                    id="square_meters"
                    type="number"
                    value={formData.square_meters}
                    onChange={(e) => setFormData({ ...formData, square_meters: e.target.value })}
                    placeholder="45"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Тип объекта</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="hotel / apartment"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parking_type">Тип парковки</Label>
                  <Input
                    id="parking_type"
                    value={formData.parking_type}
                    onChange={(e) => setFormData({ ...formData, parking_type: e.target.value })}
                    placeholder="free / paid / none"
                  />
                </div>
                
                <div>
                  <Label htmlFor="parking_price_per_hour">Цена парковки/час (₽)</Label>
                  <Input
                    id="parking_price_per_hour"
                    type="number"
                    value={formData.parking_price_per_hour}
                    onChange={(e) => setFormData({ ...formData, parking_price_per_hour: e.target.value })}
                    placeholder="100"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="short_title">Короткое название</Label>
                <Input
                  id="short_title"
                  value={formData.short_title}
                  onChange={(e) => setFormData({ ...formData, short_title: e.target.value })}
                  placeholder="hotel Москва"
                />
              </div>
            </CardContent>
          </Card>
          
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