import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface RoomFormDialogProps {
  room: any;
  onSave: (room: any) => void;
  onCancel: () => void;
}

const AVAILABLE_FEATURES = [
  'WiFi', 'Двуспальная кровать', '2 односпальные кровати', 'Смарт ТВ', 
  'Кондиционер', 'Джакузи', 'Душевая кабина', 'Фен', 'Халаты', 'Тапочки',
  'Холодильник', 'Микроволновка', 'Чайник', 'Посуда', 'Сейф', 'Зеркала',
  'Музыкальная система', 'Настольные игры', 'PlayStation', 'Бар',
  'Косметика', 'Полотенца', 'Постельное бельё', 'Кухня', 'Обеденный стол',
  'Диван', 'Ароматерапия'
];

export default function RoomFormDialog({ room, onSave, onCancel }: RoomFormDialogProps) {
  const { toast } = useToast();
  const roomPhotoInputRef = useRef<HTMLInputElement>(null);
  const [uploadingRoomPhoto, setUploadingRoomPhoto] = useState(false);
  const [editedRoom, setEditedRoom] = useState(room);

  const handleRoomPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingRoomPhoto(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async (event) => {
            try {
              const base64 = event.target?.result as string;
              
              const response = await fetch('https://functions.poehali.dev/32a4bee5-4d04-4b73-a903-52cec9a5cef6', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  image: base64,
                  filename: file.name,
                }),
              });

              if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Ошибка загрузки фото: ${response.statusText}`);
              }

              const data = await response.json();
              resolve(data.url);
            } catch (error: any) {
              reject(error);
            }
          };
          reader.onerror = () => reject(new Error('Ошибка чтения файла'));
          reader.readAsDataURL(file);
        });
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      setEditedRoom((prev: any) => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls]
      }));

      toast({
        title: "Фото загружено",
        description: `Добавлено ${uploadedUrls.length} фото`,
      });
    } catch (error: any) {
      console.error('Ошибка загрузки фото:', error);
      toast({
        title: "Ошибка загрузки",
        description: error.message || "Не удалось загрузить фото",
        variant: "destructive",
      });
    } finally {
      setUploadingRoomPhoto(false);
      if (roomPhotoInputRef.current) {
        roomPhotoInputRef.current.value = '';
      }
    }
  };

  const removeRoomImage = (imageIndex: number) => {
    setEditedRoom((prev: any) => ({
      ...prev,
      images: prev.images.filter((_: string, i: number) => i !== imageIndex)
    }));
  };

  const reorderRoomImages = (fromIndex: number, toIndex: number) => {
    setEditedRoom((prev: any) => {
      const newImages = [...prev.images];
      const [movedItem] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedItem);
      return { ...prev, images: newImages };
    });
  };

  const toggleFeature = (feature: string) => {
    setEditedRoom((prev: any) => {
      const features = prev.features || [];
      const isSelected = features.includes(feature);
      return {
        ...prev,
        features: isSelected 
          ? features.filter((f: string) => f !== feature)
          : [...features, feature]
      };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Редактирование комнаты</h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Тип комнаты *</label>
              <Input
                value={editedRoom.type || ''}
                onChange={(e) => setEditedRoom({ ...editedRoom, type: e.target.value })}
                placeholder="Например: Люкс, Стандарт"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Цена за час (₽) *</label>
              <Input
                type="number"
                value={editedRoom.price || 0}
                onChange={(e) => setEditedRoom({ ...editedRoom, price: Number(e.target.value) })}
                placeholder="1000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Площадь (м²)</label>
              <Input
                type="number"
                value={editedRoom.square_meters || 0}
                onChange={(e) => setEditedRoom({ ...editedRoom, square_meters: Number(e.target.value) })}
                placeholder="25"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Описание</label>
              <textarea
                value={editedRoom.description || ''}
                onChange={(e) => setEditedRoom({ ...editedRoom, description: e.target.value })}
                placeholder="Краткое описание комнаты"
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Icon name="Image" size={16} className="inline mr-1" />
                Фотографии комнаты
              </label>
              <input
                ref={roomPhotoInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleRoomPhotoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => roomPhotoInputRef.current?.click()}
                disabled={uploadingRoomPhoto}
                className="w-full"
              >
                {uploadingRoomPhoto ? (
                  <>
                    <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Icon name="Upload" size={16} className="mr-2" />
                    Загрузить фото комнаты
                  </>
                )}
              </Button>

              {editedRoom.images && editedRoom.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {editedRoom.images.map((img: string, imgIdx: number) => (
                    <div key={imgIdx} className="relative group">
                      <img
                        src={img}
                        alt={`Фото ${imgIdx + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <div className="absolute top-1 left-1 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {imgIdx + 1}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeRoomImage(imgIdx)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      >
                        <Icon name="Trash2" size={12} />
                      </Button>
                      <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {imgIdx > 0 && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => reorderRoomImages(imgIdx, imgIdx - 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Icon name="ChevronLeft" size={12} />
                          </Button>
                        )}
                        {imgIdx < editedRoom.images.length - 1 && (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => reorderRoomImages(imgIdx, imgIdx + 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Icon name="ChevronRight" size={12} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Icon name="Sparkles" size={16} className="inline mr-1" />
                Удобства (выберите из списка)
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_FEATURES.map((feature) => {
                  const isSelected = editedRoom.features?.includes(feature);
                  return (
                    <Badge
                      key={feature}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'bg-purple-600 hover:bg-purple-700' : 'hover:bg-purple-100'
                      }`}
                      onClick={() => toggleFeature(feature)}
                    >
                      {isSelected && <Icon name="Check" size={12} className="mr-1" />}
                      {feature}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="button"
              onClick={() => onSave(editedRoom)}
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              Сохранить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}