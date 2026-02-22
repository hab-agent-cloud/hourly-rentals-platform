import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface FormDataType {
  name: string;
  description: string;
  address: string;
  district: string;
  metro_station: string;
  contact_phone: string;
  contact_telegram: string;
  type: string;
  price_per_day: string;
  square_meters: string;
  parking_type: string;
  parking_price_per_hour: string;
  short_title: string;
}

interface ListingBasicInfoSectionProps {
  formData: FormDataType;
  onFormChange: (field: string, value: string) => void;
  listingId?: number;
}

export default function ListingBasicInfoSection({ formData, onFormChange, listingId }: ListingBasicInfoSectionProps) {
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const handleGenerateDescription = async () => {
    if (!listingId) return;
    setGenerating(true);
    try {
      const result = await api.generateDescription(listingId);
      if (result.description) {
        onFormChange('description', result.description);
        toast({ title: 'Описание сгенерировано', description: 'Проверьте и отредактируйте при необходимости' });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Попробуйте позже';
      toast({ title: 'Ошибка генерации', description: message, variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
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
              onChange={(e) => onFormChange('name', e.target.value)}
              placeholder="Квартира в центре"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label htmlFor="description">Описание</Label>
              {listingId && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateDescription}
                  disabled={generating}
                  className="text-xs h-7"
                >
                  {generating ? (
                    <><Icon name="Loader2" size={14} className="mr-1 animate-spin" />Генерация...</>
                  ) : (
                    <><Icon name="Sparkles" size={14} className="mr-1" />Сгенерировать</>
                  )}
                </Button>
              )}
            </div>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onFormChange('description', e.target.value)}
              placeholder="Уютная квартира с отличным ремонтом..."
              rows={6}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Описание видят посетители на странице объекта. Можно написать вручную или сгенерировать на основе данных.
            </p>
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
              onChange={(e) => onFormChange('address', e.target.value)}
              placeholder="ул. Пушкина, д. 10"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="district">Район</Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) => onFormChange('district', e.target.value)}
                placeholder="Центральный"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Только название района, не адрес. Например: Северный, Хамовники
              </p>
            </div>
            
            <div>
              <Label htmlFor="metro_station">Станция метро</Label>
              <Input
                id="metro_station"
                value={formData.metro_station}
                onChange={(e) => onFormChange('metro_station', e.target.value)}
                placeholder="Площадь Революции"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Контакты</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_phone">Телефон</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => onFormChange('contact_phone', e.target.value)}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
            
            <div>
              <Label htmlFor="contact_telegram">Telegram</Label>
              <Input
                id="contact_telegram"
                value={formData.contact_telegram}
                onChange={(e) => onFormChange('contact_telegram', e.target.value)}
                placeholder="@username"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Параметры</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Тип объекта</Label>
              <Input
                id="type"
                value={formData.type}
                onChange={(e) => onFormChange('type', e.target.value)}
                placeholder="Квартира, Апартаменты, Дом"
              />
            </div>
            
            <div>
              <Label htmlFor="short_title">Краткое название</Label>
              <Input
                id="short_title"
                value={formData.short_title}
                onChange={(e) => onFormChange('short_title', e.target.value)}
                placeholder="Уютная студия"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price_per_day">Минимальное количество часов</Label>
              <Input
                id="price_per_day"
                type="number"
                min="1"
                value={formData.price_per_day}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                    onFormChange('price_per_day', value);
                  }
                }}
                placeholder="2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                От скольки часов минимум принимает объект
              </p>
            </div>
            
            <div>
              <Label htmlFor="square_meters">Площадь (м²)</Label>
              <Input
                id="square_meters"
                type="number"
                min="0"
                value={formData.square_meters}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                    onFormChange('square_meters', value);
                  }
                }}
                placeholder="45"
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="parking_type">Тип парковки</Label>
              <Select value={formData.parking_type} onValueChange={(value) => onFormChange('parking_type', value)}>
                <SelectTrigger id="parking_type">
                  <SelectValue placeholder="Выберите тип парковки" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Бесплатная</SelectItem>
                  <SelectItem value="paid">Платная</SelectItem>
                  <SelectItem value="spontaneous">Стихийная</SelectItem>
                  <SelectItem value="none">Пропустить</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="parking_price_per_hour">Цена парковки (₽/час)</Label>
              <Input
                id="parking_price_per_hour"
                type="number"
                min="0"
                value={formData.parking_price_per_hour}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
                    onFormChange('parking_price_per_hour', value);
                  }
                }}
                placeholder="100"
                disabled={formData.parking_type !== 'paid'}
              />
              <p className="text-xs text-muted-foreground mt-1">Поле активно только для платной парковки</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}