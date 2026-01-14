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
  features: string[];
  image_urls: string[];
}

interface RoomCategoriesManagerProps {
  categories: RoomCategory[];
  onChange: (categories: RoomCategory[]) => void;
}

export default function RoomCategoriesManager({ categories, onChange }: RoomCategoriesManagerProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [newFeature, setNewFeature] = useState<{ [key: number]: string }>({});

  const addCategory = () => {
    onChange([
      ...categories,
      {
        name: '',
        price_per_hour: 0,
        square_meters: 0,
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

  const addFeature = (categoryIndex: number) => {
    const feature = newFeature[categoryIndex]?.trim();
    if (!feature) return;

    const category = categories[categoryIndex];
    if (!category.features.includes(feature)) {
      updateCategory(categoryIndex, 'features', [...category.features, feature]);
      setNewFeature({ ...newFeature, [categoryIndex]: '' });
    }
  };

  const removeFeature = (categoryIndex: number, feature: string) => {
    const category = categories[categoryIndex];
    updateCategory(
      categoryIndex,
      'features',
      category.features.filter((f) => f !== feature)
    );
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {category.name || `Категория ${index + 1}`}
              </CardTitle>
              <div className="flex gap-2">
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

              <div className="grid grid-cols-2 gap-3">
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
              </div>

              <div>
                <Label>Удобства</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newFeature[index] || ''}
                    onChange={(e) => setNewFeature({ ...newFeature, [index]: e.target.value })}
                    placeholder="Wi-Fi, Кондиционер..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature(index);
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => addFeature(index)}>
                    <Icon name="Plus" size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.features.map((feature) => (
                    <div
                      key={feature}
                      className="bg-secondary px-2 py-1 rounded-md flex items-center gap-1 text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index, feature)}
                        className="hover:text-destructive"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Фотографии номера</Label>
                <ImageUploader multiple onUpload={(url) => addImage(index, url)} />
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {category.image_urls.map((url, imgIndex) => (
                    <div key={imgIndex} className="relative group">
                      <img
                        src={url}
                        alt=""
                        className="w-full h-24 object-cover rounded-md"
                      />
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
