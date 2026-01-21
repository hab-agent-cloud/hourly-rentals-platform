import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableRoomItemProps {
  room: any;
  index: number;
  onEdit: (index: number) => void;
  onRemove: (index: number) => void;
  onDuplicate: (index: number) => void;
  isEditing: boolean;
}

export default function SortableRoomItem({ room, index, onEdit, onRemove, onDuplicate, isEditing }: SortableRoomItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `room-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 border rounded-lg transition-all ${
        isEditing 
          ? 'bg-purple-100 border-purple-400 border-2 shadow-md' 
          : 'bg-purple-50 border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-purple-600 transition-colors"
          >
            <Icon name="GripVertical" size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <div className="font-semibold text-lg">{room.type}</div>
              {isEditing && (
                <Badge variant="default" className="bg-purple-600">
                  <Icon name="Edit" size={12} className="mr-1" />
                  Редактируется
                </Badge>
              )}
            </div>
            <div className="text-purple-600 font-bold text-xl">{room.price} ₽/час</div>
            {room.square_meters > 0 && (
              <Badge variant="secondary" className="mt-1">
                {room.square_meters} м²
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(index)}
            title="Редактировать"
          >
            <Icon name="Edit" size={16} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate(index)}
            title="Дублировать"
          >
            <Icon name="Copy" size={16} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
            title="Удалить"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
      
      {room.images && Array.isArray(room.images) && room.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mb-3 ml-8">
          {room.images.map((img: string, imgIdx: number) => (
            <div key={imgIdx} className="relative flex-shrink-0">
              <img 
                src={img} 
                alt={`${room.type} ${imgIdx + 1}`} 
                className="w-24 h-24 object-cover rounded border-2 border-purple-200" 
              />
              <div className="absolute top-1 left-1 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {imgIdx + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {room.features && Array.isArray(room.features) && room.features.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 ml-8">
          {room.features.map((feature: string, fIdx: number) => {
            const featureIcons: Record<string, string> = {
              'WiFi': 'Wifi',
              'Двуспальная кровать': 'BedDouble',
              '2 односпальные кровати': 'BedSingle',
              'Смарт ТВ': 'Tv',
              'Кондиционер': 'Wind',
              'Джакузи': 'Bath',
              'Душевая кабина': 'ShowerHead',
              'Фен': 'Wind',
              'Халаты': 'Shirt',
              'Тапочки': 'Footprints',
              'Холодильник': 'Refrigerator',
              'Микроволновка': 'Microwave',
              'Чайник': 'Coffee',
              'Посуда': 'UtensilsCrossed',
              'Сейф': 'Lock',
              'Зеркала': 'Sparkles',
              'Музыкальная система': 'Music',
              'Настольные игры': 'Dices',
              'PlayStation': 'Gamepad2',
              'Бар': 'Wine',
              'Косметика': 'Sparkles',
              'Полотенца': 'Sheet',
              'Постельное бельё': 'Bed',
              'Кухня': 'ChefHat',
              'Обеденный стол': 'Utensils',
              'Диван': 'Sofa',
              'Ароматерапия': 'Flower',
            };
            const iconName = featureIcons[feature] || 'Check';
            return (
              <div
                key={fIdx}
                className="group relative inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 transition-all cursor-help"
                title={feature}
              >
                <Icon name={iconName} size={14} className="text-purple-600" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {feature}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {room.description && (
        <p className="text-sm text-muted-foreground ml-8">{room.description}</p>
      )}
    </div>
  );
}
