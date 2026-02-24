import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface ListingRoomsStepProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ROOM_FEATURES = [
  'Wi-Fi',
  'Кондиционер',
  'Телевизор',
  'Мини-бар',
  'Сейф',
  'Фен',
  'Халаты',
  'Тапочки',
  'Утюг',
  'Балкон',
  'Джакузи',
  'Кухня',
  'PlayStation',
  'Душевая кабина',
  'Ванна',
  'Двуспальная кровать',
  'Односпальная кровать'
];

const BUREAU_LIMITS = [
  { rooms: 5, price: 0, label: 'Базовый' },
  { rooms: 10, price: 10000, label: 'Расширенный' },
  { rooms: 20, price: 15000, label: 'Профессиональный' },
];

export default function ListingRoomsStep({ data, onUpdate, onNext, onBack }: ListingRoomsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingRoom, setEditingRoom] = useState<number | null>(null);
  
  const isBureau = data.type === 'Квартирное бюро';
  const rooms = (data.rooms as unknown[]) || [];
  const roomsCount = rooms.length;
  const bureauLimit = (data.bureau_room_limit as number) || 5;
  const isAtLimit = isBureau && roomsCount >= bureauLimit;
  const [currentRoom, setCurrentRoom] = useState<any>({
    type: '',
    price: '',
    description: '',
    images: [],
    square_meters: '',
    features: [],
    min_hours: 1,
    payment_methods: 'Наличные, банковская карта при заселении',
    cancellation_policy: 'Бесплатная отмена за 1 час до заселения'
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.rooms || data.rooms.length === 0) {
      newErrors.rooms = 'Добавьте хотя бы один номер';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRoom = () => {
    const newErrors: Record<string, string> = {};

    if (!currentRoom.type?.trim()) {
      newErrors.type = 'Укажите тип номера';
    }

    if (!currentRoom.price || parseFloat(currentRoom.price) <= 0) {
      newErrors.price = 'Укажите корректную цену';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  const addRoom = () => {
    if (validateRoom()) {
      const rooms = data.rooms || [];
      if (editingRoom !== null) {
        rooms[editingRoom] = { ...currentRoom };
        setEditingRoom(null);
      } else {
        rooms.push({ ...currentRoom });
      }
      onUpdate({ rooms });
      setCurrentRoom({
        type: '',
        price: '',
        description: '',
        images: [],
        square_meters: '',
        features: [],
        min_hours: 1,
        payment_methods: 'Наличные, банковская карта при заселении',
        cancellation_policy: 'Бесплатная отмена за 1 час до заселения'
      });
      setErrors({});
    }
  };

  const editRoom = (index: number) => {
    setCurrentRoom({ ...data.rooms[index] });
    setEditingRoom(index);
  };

  const deleteRoom = (index: number) => {
    const rooms = data.rooms || [];
    onUpdate({ rooms: rooms.filter((_: any, i: number) => i !== index) });
  };

  const cancelEdit = () => {
    setEditingRoom(null);
    setCurrentRoom({
      type: '',
      price: '',
      description: '',
      images: [],
      square_meters: '',
      features: [],
      min_hours: 1,
      payment_methods: 'Наличные, банковская карта при заселении',
      cancellation_policy: 'Бесплатная отмена за 1 час до заселения'
    });
    setErrors({});
  };

  const toggleFeature = (feature: string) => {
    const features = currentRoom.features || [];
    const newFeatures = features.includes(feature)
      ? features.filter((f: string) => f !== feature)
      : [...features, feature];
    setCurrentRoom({ ...currentRoom, features: newFeatures });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const imageUrls: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          imageUrls.push(reader.result as string);
          if (imageUrls.length === files.length) {
            setCurrentRoom({ 
              ...currentRoom, 
              images: [...(currentRoom.images || []), ...imageUrls] 
            });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const images = currentRoom.images || [];
    setCurrentRoom({
      ...currentRoom,
      images: images.filter((_: string, i: number) => i !== index)
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Hotel" size={24} className="text-purple-600" />
          Номера и цены
        </CardTitle>
        <CardDescription>
          Добавьте информацию о доступных номерах
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Room Form */}
        <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
          <h3 className="font-semibold flex items-center gap-2">
            {editingRoom !== null ? 'Редактирование номера' : 'Новый номер'}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="room_type">Тип номера *</Label>
              <Input
                id="room_type"
                placeholder="Стандарт, Люкс, Делюкс..."
                value={currentRoom.type}
                onChange={(e) => setCurrentRoom({ ...currentRoom, type: e.target.value })}
                className={errors.type ? 'border-red-500' : ''}
              />
              {errors.type && (
                <p className="text-sm text-red-500 mt-1">{errors.type}</p>
              )}
            </div>

            <div>
              <Label htmlFor="room_price">Цена за час (₽) *</Label>
              <Input
                id="room_price"
                type="number"
                placeholder="1000"
                value={currentRoom.price}
                onChange={(e) => setCurrentRoom({ ...currentRoom, price: e.target.value })}
                className={errors.price ? 'border-red-500' : ''}
              />
              {errors.price && (
                <p className="text-sm text-red-500 mt-1">{errors.price}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="room_description">Описание (необязательно)</Label>
            <Textarea
              id="room_description"
              placeholder="Описание номера..."
              rows={3}
              value={currentRoom.description}
              onChange={(e) => setCurrentRoom({ ...currentRoom, description: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="square_meters">Площадь (м²) (необязательно)</Label>
            <Input
              id="square_meters"
              type="number"
              placeholder="25"
              value={currentRoom.square_meters}
              onChange={(e) => setCurrentRoom({ ...currentRoom, square_meters: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="min_hours">Минимум часов для бронирования</Label>
            <Input
              id="min_hours"
              type="number"
              min="1"
              value={currentRoom.min_hours}
              onChange={(e) => setCurrentRoom({ ...currentRoom, min_hours: parseInt(e.target.value) || 1 })}
            />
          </div>

          <div>
            <Label>Удобства номера (необязательно)</Label>
            <div className="grid grid-cols-2 gap-3 mt-2 max-h-48 overflow-y-auto">
              {ROOM_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={`room-feature-${feature}`}
                    checked={(currentRoom.features || []).includes(feature)}
                    onCheckedChange={() => toggleFeature(feature)}
                  />
                  <Label
                    htmlFor={`room-feature-${feature}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="room_images">Фотографии номера (необязательно)</Label>
            <Input
              id="room_images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
            {currentRoom.images && currentRoom.images.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {currentRoom.images.map((img: string, idx: number) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt={`Preview ${idx}`} className="w-20 h-20 object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="payment_methods">Способы оплаты</Label>
            <Input
              id="payment_methods"
              value={currentRoom.payment_methods}
              onChange={(e) => setCurrentRoom({ ...currentRoom, payment_methods: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="cancellation_policy">Политика отмены</Label>
            <Input
              id="cancellation_policy"
              value={currentRoom.cancellation_policy}
              onChange={(e) => setCurrentRoom({ ...currentRoom, cancellation_policy: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={addRoom} className="flex-1" disabled={isAtLimit && editingRoom === null}>
              <Icon name={editingRoom !== null ? "Check" : "Plus"} size={18} className="mr-2" />
              {editingRoom !== null ? 'Сохранить изменения' : 'Добавить номер'}
            </Button>
            {editingRoom !== null && (
              <Button variant="outline" onClick={cancelEdit}>
                Отмена
              </Button>
            )}
          </div>

          {/* Блок разблокировки лимита для квартирного бюро */}
          {isBureau && isAtLimit && editingRoom === null && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Lock" size={18} className="text-amber-600" />
                <p className="font-semibold text-amber-800">Достигнут лимит {bureauLimit} квартир</p>
              </div>
              <p className="text-sm text-amber-700 mb-3">
                Разблокируйте возможность добавлять больше квартир — разовая оплата, платить повторно не нужно.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {BUREAU_LIMITS.filter(l => l.rooms > bureauLimit).map(tier => (
                  <div key={tier.rooms} className="bg-white border border-amber-300 rounded-lg p-3 text-center">
                    <p className="text-sm text-gray-500 mb-1">{tier.label}</p>
                    <p className="font-bold text-gray-900">до {tier.rooms} квартир</p>
                    <p className="text-purple-600 font-semibold mt-1">{tier.price.toLocaleString('ru')} ₽</p>
                    <p className="text-xs text-gray-400 mt-1">разовая оплата</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-amber-600 mt-3 text-center">
                Оплата производится в личном кабинете после регистрации объекта
              </p>
            </div>
          )}

          {/* Прогресс бар лимита для бюро */}
          {isBureau && !isAtLimit && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <Icon name="Building2" size={14} />
              <span>Квартир: {roomsCount} / {bureauLimit}</span>
              {bureauLimit < 20 && (
                <span className="text-purple-600 ml-auto">
                  Можно расширить до {bureauLimit === 5 ? 10 : 20} квартир
                </span>
              )}
            </div>
          )}
        </div>

        {/* Rooms List */}
        {data.rooms && data.rooms.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Добавленные номера ({data.rooms.length})</h3>
            {data.rooms.map((room: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{room.type}</h4>
                    <Badge>{room.price} ₽/час</Badge>
                  </div>
                  {room.description && (
                    <p className="text-sm text-muted-foreground mb-2">{room.description}</p>
                  )}
                  {room.square_meters && (
                    <p className="text-sm text-muted-foreground">Площадь: {room.square_meters} м²</p>
                  )}
                  {room.features && room.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {room.features.map((feature: string) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editRoom(index)}
                  >
                    <Icon name="Pencil" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteRoom(index)}
                  >
                    <Icon name="Trash2" size={16} className="text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {errors.rooms && (
          <p className="text-sm text-red-500">{errors.rooms}</p>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            Назад
          </Button>
          <Button onClick={handleNext} className="bg-gradient-to-r from-purple-600 to-pink-600">
            Продолжить
            <Icon name="ArrowRight" size={18} className="ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}