import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ImageUploader from '@/components/ImageUploader';

export interface RoomCategory {
  id?: number;
  name: string;
  price_per_hour: number;
  square_meters: number;
  min_hours?: number;
  description?: string;
  features: string[];
  image_urls: string[];
}

interface RoomCategoriesManagerProps {
  categories: RoomCategory[];
  onChange: (categories: RoomCategory[]) => void;
}

const AVAILABLE_FEATURES = [
  { value: 'Wi-Fi', label: 'Wi-Fi', hint: 'Бесплатный интернет' },
  { value: 'Кондиционер', label: 'Кондиционер', hint: 'Климат-контроль' },
  { value: 'Телевизор', label: 'ТВ', hint: 'Телевизор' },
  { value: 'Мини-бар', label: 'Мини-бар', hint: 'Холодильник с напитками' },
  { value: 'Сейф', label: 'Сейф', hint: 'Для ценных вещей' },
  { value: 'Фен', label: 'Фен', hint: 'В ванной комнате' },
  { value: 'Халаты', label: 'Халаты', hint: 'И тапочки' },
  { value: 'Душ', label: 'Душ', hint: 'Душевая кабина' },
  { value: 'Ванна', label: 'Ванна', hint: 'Ванна с горячей водой' },
  { value: 'Балкон', label: 'Балкон', hint: 'Собственный балкон' },
  { value: 'Вид на город', label: 'Вид', hint: 'Панорамный вид' },
  { value: 'Кухня', label: 'Кухня', hint: 'Кухонная зона' },
  { value: 'Чайник', label: 'Чайник', hint: 'Чай/кофе' },
  { value: 'Гладильная доска', label: 'Утюг', hint: 'Гладильная доска' },
  { value: 'Рабочий стол', label: 'Стол', hint: 'Для работы' },
];

export default function RoomCategoriesManager({ categories, onChange }: RoomCategoriesManagerProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

  const addCategory = () => {
    onChange([
      ...categories,
      {
        name: '',
        price_per_hour: 0,
        square_meters: 0,
        min_hours: 1,
        description: '',
        features: [],
        image_urls: [],
      },
    ]);
    setExpandedIndex(categories.length);
  };

  const removeCategory = (index: number) => {
    onChange(categories.filter((_, i) => i !== index));
    if (expandedIndex === index) {
      setExpandedIndex(null);
    }
  };

  const updateCategory = (index: number, field: keyof RoomCategory, value: any) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const toggleFeature = (categoryIndex: number, feature: string) => {
    const category = categories[categoryIndex];
    if (category.features.includes(feature)) {
      updateCategory(
        categoryIndex,
        'features',
        category.features.filter((f) => f !== feature)
      );
    } else {
      updateCategory(categoryIndex, 'features', [...category.features, feature]);
    }
  };

  const addImage = (categoryIndex: number, url: string) => {
    const category = categories[categoryIndex];
    updateCategory(categoryIndex, 'image_urls', [...category.image_urls, url]);
  };

  const removeImage = (categoryIndex: number, imageIndex: number) => {
    const category = categories[categoryIndex];
    updateCategory(
      categoryIndex,
      'image_urls',
      category.image_urls.filter((_, i) => i !== imageIndex)
    );
  };

  const handleDragStart = (e: React.DragEvent, imageIndex: number) => {
    setDraggedImageIndex(imageIndex);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, categoryIndex: number, targetIndex: number) => {
    e.preventDefault();
    if (draggedImageIndex === null || draggedImageIndex === targetIndex) return;

    const category = categories[categoryIndex];
    const images = [...category.image_urls];
    const [draggedImage] = images.splice(draggedImageIndex, 1);
    images.splice(targetIndex, 0, draggedImage);

    updateCategory(categoryIndex, 'image_urls', images);
    setDraggedImageIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedImageIndex(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Категории номеров</Label>
        <Button type="button" variant="outline" size="sm" onClick={addCategory}>
          <Icon name="Plus" size={16} className="mr-1" />
          Добавить категорию
        </Button>
      </div>

      {categories.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Добавьте категории номеров с ценами, площадью и удобствами
        </p>
      )}

      {categories.map((category, index) => (
        <Card key={index}>
          <CardHeader className="py-3">
            <div className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {category.image_urls.length > 0 && (
                  <img
                    src={category.image_urls[0]}
                    alt={category.name}
                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base truncate">
                    {category.name || `Категория ${index + 1}`}
                  </CardTitle>
                  {expandedIndex !== index && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {category.price_per_hour > 0 && `${category.price_per_hour} ₽/час`}
                      {category.square_meters > 0 && ` • ${category.square_meters} м²`}
                      {category.features.length > 0 && ` • ${category.features.length} удобств`}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                >
                  <Icon
                    name={expandedIndex === index ? 'ChevronUp' : 'ChevronDown'}
                    size={16}
                  />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCategory(index)}
                >
                  <Icon name="Trash2" size={16} className="text-red-600" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {expandedIndex === index && (
            <CardContent className="space-y-3">
              <div>
                <Label>Название категории</Label>
                <Input
                  value={category.name}
                  onChange={(e) => updateCategory(index, 'name', e.target.value)}
                  placeholder="Например: Стандартный номер"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Цена за час (₽)</Label>
                  <Input
                    type="number"
                    value={category.price_per_hour}
                    onChange={(e) =>
                      updateCategory(index, 'price_per_hour', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label>Площадь (м²)</Label>
                  <Input
                    type="number"
                    value={category.square_meters}
                    onChange={(e) =>
                      updateCategory(index, 'square_meters', parseInt(e.target.value) || 0)
                    }
                  />
                </div>
                <div>
                  <Label>От скольки часов</Label>
                  <Input
                    type="number"
                    min="1"
                    value={category.min_hours || 1}
                    onChange={(e) =>
                      updateCategory(index, 'min_hours', parseInt(e.target.value) || 1)
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Описание категории</Label>
                <Input
                  value={category.description || ''}
                  onChange={(e) => updateCategory(index, 'description', e.target.value)}
                  placeholder="Краткое описание номера и его особенностей"
                />
              </div>

              <div>
                <Label>Удобства в номере</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Нажмите на ярлык, чтобы добавить или убрать удобство
                </p>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_FEATURES.map((feature) => {
                    const isSelected = category.features.includes(feature.value);
                    return (
                      <button
                        key={feature.value}
                        type="button"
                        onClick={() => toggleFeature(index, feature.value)}
                        className={`px-3 py-1.5 rounded-md text-sm transition-colors border group relative ${
                          isSelected
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-secondary hover:bg-secondary/80 border-border'
                        }`}
                        title={feature.hint}
                      >
                        {feature.label}
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border shadow-sm">
                          {feature.hint}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label>Фотографии номера</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Вы можете выбрать несколько фотографий одновременно. Перетащите их, чтобы изменить порядок.
                </p>
                <ImageUploader multiple onUpload={(url) => addImage(index, url)} />
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {category.image_urls.map((url, imgIndex) => (
                    <div
                      key={imgIndex}
                      draggable
                      onDragStart={(e) => handleDragStart(e, imgIndex)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index, imgIndex)}
                      onDragEnd={handleDragEnd}
                      className={`relative group cursor-move ${
                        draggedImageIndex === imgIndex ? 'opacity-50' : ''
                      }`}
                    >
                      <img
                        src={url}
                        alt=""
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-md flex items-center justify-center">
                        <Icon
                          name="GripVertical"
                          size={20}
                          className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index, imgIndex)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}