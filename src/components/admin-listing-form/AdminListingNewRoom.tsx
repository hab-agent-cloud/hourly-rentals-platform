import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { roomTemplates, availableFeatures } from '../listing-form/useRoomManagement';
import { featureIcons } from '../listing-form/RoomItem';

interface NewRoom {
  type: string;
  price: number;
  square_meters: number;
  description: string;
  min_hours?: number;
  payment_methods?: string;
  cancellation_policy?: string;
  images?: string[];
  features?: string[];
}

interface AdminListingNewRoomProps {
  newRoom: NewRoom;
  setNewRoom: (room: NewRoom) => void;
  addRoom: () => void;
  applyTemplate: (templateName: string) => void;
  toggleNewRoomFeature: (feature: string) => void;
  handleNewRoomPhotosUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeNewRoomPhoto: (idx: number) => void;
  replaceRoomPhoto: (idx: number, file: File) => void;
  handlePhotoDragStart: (idx: number) => void;
  handlePhotoDragOver: (e: React.DragEvent, idx: number) => void;
  handlePhotoDragEnd: () => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  isDragging: boolean;
  uploadingRoomPhotos: boolean;
  draggingPhotoIndex: number | null;
}

export default function AdminListingNewRoom({
  newRoom,
  setNewRoom,
  addRoom,
  applyTemplate,
  toggleNewRoomFeature,
  handleNewRoomPhotosUpload,
  removeNewRoomPhoto,
  replaceRoomPhoto,
  handlePhotoDragStart,
  handlePhotoDragOver,
  handlePhotoDragEnd,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  isDragging,
  uploadingRoomPhotos,
  draggingPhotoIndex,
}: AdminListingNewRoomProps) {
  const quickFeatures = ['Wi-Fi', 'Душ', 'Кондиционер', 'Телевизор'];
  
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">
          Добавить категорию номера
        </h3>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Sparkles" size={18} className="text-purple-600" />
          <label className="text-sm font-semibold">Выберите готовый шаблон</label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {roomTemplates.map((template) => (
            <Button
              key={template.name}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => applyTemplate(template.name)}
              className="h-auto py-3 flex flex-col items-start gap-1 hover:bg-purple-100 hover:border-purple-400 transition-all relative group"
              title={`${template.features?.length || 0} удобств`}
            >
              <span className="font-semibold text-sm">{template.name}</span>
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-muted-foreground">{template.square_meters} м²</span>
                <Badge variant="secondary" className="text-xs h-4 px-1">
                  {template.features?.length || 0}
                </Badge>
              </div>
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Шаблон загрузит настройки, площадь и удобства. Цена и фото не изменятся.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Input
          placeholder="Тип номера (например: Стандарт)"
          value={newRoom.type}
          onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Цена за час"
          value={newRoom.price || ''}
          onChange={(e) => setNewRoom({ ...newRoom, price: parseInt(e.target.value) })}
        />
      </div>

      <Input
        type="number"
        placeholder="Площадь, м²"
        value={newRoom.square_meters || ''}
        onChange={(e) => setNewRoom({ ...newRoom, square_meters: parseInt(e.target.value) })}
      />

      <Input
        placeholder="Описание (опционально)"
        value={newRoom.description}
        onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
      />

      <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Settings" size={18} className="text-purple-600" />
          <label className="text-sm font-semibold">Дополнительные параметры бронирования</label>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Icon name="Clock" size={14} className="text-purple-600" />
              Минимальное бронирование (часов)
              {newRoom.min_hours && newRoom.min_hours > 0 && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {newRoom.min_hours}ч
                </Badge>
              )}
            </label>
            <Input
              type="number"
              placeholder="1"
              value={newRoom.min_hours || ''}
              onChange={(e) => setNewRoom({ ...newRoom, min_hours: parseInt(e.target.value) || 1 })}
              className={newRoom.min_hours ? 'border-purple-300 bg-white' : ''}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Icon name="CreditCard" size={14} className="text-purple-600" />
              Методы оплаты
              {newRoom.payment_methods && (
                <Badge variant="secondary" className="ml-auto">
                  <Icon name="Check" size={10} className="mr-1 text-green-600" />
                </Badge>
              )}
            </label>
            <Input
              placeholder="Наличные, банковская карта при заселении"
              value={newRoom.payment_methods}
              onChange={(e) => setNewRoom({ ...newRoom, payment_methods: e.target.value })}
              className={newRoom.payment_methods ? 'border-purple-300 bg-white' : ''}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block flex items-center gap-2">
              <Icon name="CalendarX" size={14} className="text-purple-600" />
              Условия отмены
              {newRoom.cancellation_policy && (
                <Badge variant="secondary" className="ml-auto">
                  <Icon name="Check" size={10} className="mr-1 text-green-600" />
                </Badge>
              )}
            </label>
            <Input
              placeholder="Бесплатная отмена за 1 час до заселения"
              value={newRoom.cancellation_policy}
              onChange={(e) => setNewRoom({ ...newRoom, cancellation_policy: e.target.value })}
              className={newRoom.cancellation_policy ? 'border-purple-300 bg-white' : ''}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">Фото номера (до 10 шт)</label>
          {newRoom.images && newRoom.images.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-purple-50 px-2 py-1 rounded">
              <Icon name="Info" size={12} />
              <span>Наведите на фото для действий</span>
            </div>
          )}
        </div>
        
        {newRoom.images && newRoom.images.length > 0 && (
          <div className="mb-3 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icon name="Images" size={18} className="text-purple-600" />
                <span className="text-sm font-semibold text-purple-900">
                  Галерея номера ({newRoom.images.length}/10)
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icon name="GripVertical" size={14} />
                <span>Перетащите для сортировки</span>
              </div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {newRoom.images.map((url: string, idx: number) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={() => handlePhotoDragStart(idx)}
                  onDragOver={(e) => handlePhotoDragOver(e, idx)}
                  onDragEnd={handlePhotoDragEnd}
                  className={`relative group cursor-move transition-all ${
                    draggingPhotoIndex === idx ? 'opacity-50 scale-95' : 'opacity-100 scale-100 hover:scale-105'
                  }`}
                >
                  <div className="relative aspect-square rounded-lg border-2 border-purple-300 hover:border-purple-500 transition-all overflow-hidden shadow-sm hover:shadow-md">
                    <img 
                      src={url} 
                      alt={`Room ${idx + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                        <Icon 
                          name="Move" 
                          size={28} 
                          className="text-white drop-shadow-lg"
                        />
                        <span className="text-white text-[10px] font-medium drop-shadow">
                          Перетащите
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                      {idx + 1}
                    </div>
                    {idx === 0 && (
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md">
                        Главное
                      </div>
                    )}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <input
                        type="file"
                        accept="image/*"
                        id={`replace-photo-${idx}`}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) replaceRoomPhoto(idx, file);
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById(`replace-photo-${idx}`)?.click()}
                        className="bg-blue-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-blue-600 hover:scale-110 transition-all shadow-lg group/btn relative"
                        title="Заменить фото"
                      >
                        <Icon name="RefreshCw" size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeNewRoomPhoto(idx)}
                        className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all shadow-lg"
                        title="Удалить фото"
                      >
                        <Icon name="Trash2" size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!newRoom.images || newRoom.images.length < 10) && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl transition-all ${
              isDragging 
                ? 'border-purple-500 bg-gradient-to-br from-purple-100 to-pink-100 scale-[1.01] shadow-lg' 
                : 'border-purple-300 hover:border-purple-400 bg-gradient-to-br from-gray-50 to-purple-50/30 hover:shadow-md'
            } ${uploadingRoomPhotos ? 'opacity-50 pointer-events-none' : ''} p-6`}
          >
            <div className="flex flex-col items-center justify-center gap-3">
              <div className={`p-3 rounded-full transition-all ${
                isDragging 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-br from-purple-100 to-pink-100'
              }`}>
                <Icon 
                  name={uploadingRoomPhotos ? "Loader2" : "Upload"} 
                  size={24} 
                  className={`${isDragging ? 'text-white' : 'text-purple-600'} ${uploadingRoomPhotos ? 'animate-spin' : ''}`}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  {uploadingRoomPhotos ? 'Загрузка...' : isDragging ? 'Отпустите для загрузки' : 'Перетащите фото сюда'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  или{' '}
                  <label className="text-purple-600 hover:text-purple-700 cursor-pointer font-medium underline">
                    выберите файлы
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleNewRoomPhotosUpload}
                      className="hidden"
                      disabled={uploadingRoomPhotos}
                    />
                  </label>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG до 5 МБ • до 10 фото
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold">Удобства номера</label>
          <Badge variant="secondary" className="text-xs">
            Выбрано: {newRoom.features?.length || 0}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {quickFeatures.map((quickFeature) => {
            const iconName = featureIcons[quickFeature] || 'Check';
            const isSelected = newRoom.features?.includes(quickFeature);
            return (
              <Button
                key={quickFeature}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => toggleNewRoomFeature(quickFeature)}
                className={isSelected ? 'bg-purple-600 hover:bg-purple-700' : 'hover:bg-purple-50'}
              >
                <Icon name={iconName} size={14} className="mr-1" />
                {quickFeature}
              </Button>
            );
          })}
        </div>
        
        <div className="flex flex-wrap gap-2 p-3 border rounded-lg bg-gray-50">
          {availableFeatures.map((feature) => {
            const iconName = featureIcons[feature] || 'Check';
            const isChecked = newRoom.features && newRoom.features.includes(feature);
            return (
              <div
                key={feature}
                onClick={() => toggleNewRoomFeature(feature)}
                className={`group relative inline-flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-all hover:scale-110 ${
                  isChecked 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-white hover:bg-purple-100 text-purple-600'
                }`}
                title={feature}
              >
                <Icon name={iconName} size={20} />
                {isChecked && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <Icon name="Check" size={12} className="text-white" />
                  </div>
                )}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {feature}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button 
        type="button" 
        onClick={addRoom} 
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        <Icon name="Plus" size={18} className="mr-2" />
        Добавить категорию
      </Button>
    </div>
  );
}
