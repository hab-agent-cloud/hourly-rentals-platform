import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';
import { useToast } from '@/hooks/use-toast';

export const roomTemplates = [
  {
    name: 'Стандарт',
    type: 'Стандарт',
    description: 'Комфортный номер с базовым набором удобств',
    square_meters: 18,
    features: ['WiFi', 'Двуспальная кровать', 'Смарт ТВ', 'Кондиционер', 'Душевая кабина', 'Фен', 'Холодильник', 'Чайник'],
  },
  {
    name: 'Комфорт',
    type: 'Комфорт',
    description: 'Улучшенный номер с расширенным набором удобств',
    square_meters: 25,
    features: ['WiFi', 'Двуспальная кровать', 'Смарт ТВ', 'Кондиционер', 'Душевая кабина', 'Фен', 'Халаты', 'Тапочки', 'Холодильник', 'Микроволновка', 'Чайник', 'Посуда', 'Сейф'],
  },
  {
    name: 'Люкс',
    type: 'Люкс',
    description: 'Роскошный номер премиум класса',
    square_meters: 35,
    features: ['WiFi', 'Двуспальная кровать', 'Смарт ТВ', 'Кондиционер', 'Джакузи', 'Фен', 'Халаты', 'Тапочки', 'Холодильник', 'Микроволновка', 'Чайник', 'Посуда', 'Сейф', 'Зеркала', 'Музыкальная система'],
  },
  {
    name: 'Студия',
    type: 'Студия',
    description: 'Просторный номер с кухонной зоной',
    square_meters: 30,
    features: ['WiFi', 'Двуспальная кровать', 'Смарт ТВ', 'Кондиционер', 'Душевая кабина', 'Фен', 'Холодильник', 'Микроволновка', 'Чайник', 'Посуда', 'Обеденный стол', 'Диван', 'Кухня'],
  },
  {
    name: 'Романтик',
    type: 'Романтик',
    description: 'Номер с романтической атмосферой для пар',
    square_meters: 28,
    features: ['WiFi', 'Двуспальная кровать', 'Смарт ТВ', 'Кондиционер', 'Джакузи', 'Фен', 'Халаты', 'Тапочки', 'Холодильник', 'Чайник', 'Зеркала', 'Музыкальная система', 'Ароматерапия', 'Косметика'],
  },
  {
    name: 'VIP',
    type: 'VIP',
    description: 'Эксклюзивный номер с максимальным комфортом',
    square_meters: 45,
    features: ['WiFi', 'Двуспальная кровать', 'Смарт ТВ', 'Кондиционер', 'Джакузи', 'Фен', 'Халаты', 'Тапочки', 'Холодильник', 'Микроволновка', 'Чайник', 'Посуда', 'Сейф', 'Зеркала', 'Музыкальная система', 'PlayStation', 'Настольные игры', 'Диван', 'Обеденный стол', 'Бар', 'Косметика', 'Полотенца', 'Постельное бельё'],
  },
];

export const availableFeatures = [
  'WiFi',
  'Двуспальная кровать',
  '2 односпальные кровати',
  'Смарт ТВ',
  'Телевизор',
  'Кондиционер',
  'Джакузи',
  'Душевая кабина',
  'Ванная',
  'Сауна',
  'Фен',
  'Халаты',
  'Тапочки',
  'Холодильник',
  'Микроволновка',
  'Чайник',
  'Посуда',
  'Сейф',
  'Зеркала',
  'Музыкальная система',
  'Настольные игры',
  'PlayStation',
  'Бар',
  'Косметика',
  'Полотенца',
  'Постельное бельё',
  'Кухня',
  'Обеденный стол',
  'Диван',
  'Ароматерапия',
];

interface Room {
  type: string;
  price: number;
  description: string;
  images: string[];
  square_meters: number;
  features: string[];
  min_hours: number;
  payment_methods: string;
  cancellation_policy: string;
}

export function useRoomManagement(formData: any, setFormData: (data: any) => void) {
  const { toast } = useToast();
  const [newRoom, setNewRoom] = useState<Room>({ 
    type: '', 
    price: 0, 
    description: '', 
    images: [], 
    square_meters: 0,
    features: [],
    min_hours: 1,
    payment_methods: 'Наличные, банковская карта при заселении',
    cancellation_policy: 'Бесплатная отмена за 1 час до заселения'
  });
  const [editingRoomIndex, setEditingRoomIndex] = useState<number | null>(null);
  const [draggingPhotoIndex, setDraggingPhotoIndex] = useState<number | null>(null);

  const addRoom = () => {
    if (newRoom.type && newRoom.price > 0) {
      const roomToAdd = {
        type: newRoom.type,
        price: newRoom.price,
        description: newRoom.description,
        images: [...(Array.isArray(newRoom.images) ? newRoom.images : [])],
        square_meters: newRoom.square_meters,
        features: [...(Array.isArray(newRoom.features) ? newRoom.features : [])],
        min_hours: newRoom.min_hours,
        payment_methods: newRoom.payment_methods,
        cancellation_policy: newRoom.cancellation_policy
      };
      
      const updatedRooms = [...(formData.rooms || []), roomToAdd];
      setFormData({ ...formData, rooms: updatedRooms });
      
      setNewRoom({ 
        type: '', 
        price: 0, 
        description: '', 
        images: [], 
        square_meters: 0,
        features: [],
        min_hours: 1,
        payment_methods: 'Наличные, банковская карта при заселении',
        cancellation_policy: 'Бесплатная отмена за 1 час до заселения'
      });
      
      toast({
        title: 'Успешно',
        description: `Категория "${roomToAdd.type}" добавлена (всего: ${updatedRooms.length})`,
      });
    } else {
      toast({
        title: 'Ошибка',
        description: 'Заполните название категории и цену',
        variant: 'destructive',
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString().replace('room-', ''));
      const newIndex = parseInt(over.id.toString().replace('room-', ''));

      setFormData({
        ...formData,
        rooms: arrayMove(formData.rooms, oldIndex, newIndex),
      });

      toast({
        title: 'Порядок изменён',
        description: 'Перетащите номера в нужном порядке',
      });
    }
  };

  const startEditRoom = (index: number) => {
    const room = formData.rooms[index];
    setNewRoom({
      type: room.type || '',
      price: room.price || 0,
      description: room.description || '',
      images: Array.isArray(room.images) ? room.images : [],
      square_meters: room.square_meters || 0,
      features: Array.isArray(room.features) ? room.features : [],
      min_hours: room.min_hours || 1,
      payment_methods: room.payment_methods || 'Наличные, банковская карта при заселении',
      cancellation_policy: room.cancellation_policy || 'Бесплатная отмена за 1 час до заселения'
    });
    setEditingRoomIndex(index);
  };

  const saveEditedRoom = () => {
    if (editingRoomIndex !== null && newRoom.type && newRoom.price > 0) {
      const updatedRooms = [...formData.rooms];
      updatedRooms[editingRoomIndex] = {
        type: newRoom.type,
        price: newRoom.price,
        description: newRoom.description,
        images: [...(Array.isArray(newRoom.images) ? newRoom.images : [])],
        square_meters: newRoom.square_meters,
        features: [...(Array.isArray(newRoom.features) ? newRoom.features : [])],
        min_hours: newRoom.min_hours,
        payment_methods: newRoom.payment_methods,
        cancellation_policy: newRoom.cancellation_policy
      };
      setFormData({
        ...formData,
        rooms: updatedRooms,
      });
      setEditingRoomIndex(null);
      setNewRoom({ 
        type: '', 
        price: 0, 
        description: '', 
        images: [], 
        square_meters: 0,
        features: [],
        min_hours: 1,
        payment_methods: 'Наличные, банковская карта при заселении',
        cancellation_policy: 'Бесплатная отмена за 1 час до заселения'
      });
      toast({
        title: 'Успешно',
        description: 'Категория обновлена',
      });
    }
  };

  const cancelEditRoom = () => {
    setEditingRoomIndex(null);
    setNewRoom({ 
      type: '', 
      price: 0, 
      description: '', 
      images: [], 
      square_meters: 0,
      features: [],
      min_hours: 1,
      payment_methods: 'Наличные, банковская карта при заселении',
      cancellation_policy: 'Бесплатная отмена за 1 час до заселения'
    });
    toast({
      title: 'Отменено',
      description: 'Редактирование отменено',
    });
  };

  const removeRoom = (index: number) => {
    const roomName = formData.rooms[index]?.type || 'Категория';
    const updatedRooms = formData.rooms.filter((_: any, i: number) => i !== index);
    setFormData({ ...formData, rooms: updatedRooms });
    toast({
      title: 'Удалено',
      description: `${roomName} удалена (осталось: ${updatedRooms.length})`,
    });
  };

  const duplicateRoom = (index: number) => {
    const roomToDuplicate = formData.rooms[index];
    const duplicatedRoom = {
      ...roomToDuplicate,
      type: `${roomToDuplicate.type} (копия)`,
    };
    const updatedRooms = [...formData.rooms, duplicatedRoom];
    setFormData({ ...formData, rooms: updatedRooms });
    toast({
      title: 'Дублировано',
      description: `Создана копия категории "${roomToDuplicate.type}" (всего: ${updatedRooms.length})`,
    });
  };

  const applyTemplate = (templateName: string) => {
    const template = roomTemplates.find(t => t.name === templateName);
    if (template) {
      setNewRoom({
        ...newRoom,
        type: template.type,
        description: template.description,
        square_meters: template.square_meters,
        features: [...template.features],
      });
      toast({
        title: 'Шаблон применён',
        description: `Загружены настройки для "${template.name}"`,
      });
    }
  };

  const toggleNewRoomFeature = (feature: string) => {
    const features = Array.isArray(newRoom.features) ? newRoom.features : [];
    if (features.includes(feature)) {
      setNewRoom({ ...newRoom, features: features.filter(f => f !== feature) });
    } else {
      setNewRoom({ ...newRoom, features: [...features, feature] });
    }
  };

  const handlePhotoDragStart = (index: number) => {
    setDraggingPhotoIndex(index);
  };

  const handlePhotoDragOver = (e: React.DragEvent, overIndex: number) => {
    e.preventDefault();
    if (draggingPhotoIndex === null || draggingPhotoIndex === overIndex) return;

    const images = [...newRoom.images];
    const [draggedImage] = images.splice(draggingPhotoIndex, 1);
    images.splice(overIndex, 0, draggedImage);
    setNewRoom({ ...newRoom, images });
    setDraggingPhotoIndex(overIndex);
  };

  const handlePhotoDragEnd = () => {
    setDraggingPhotoIndex(null);
  };

  return {
    newRoom,
    setNewRoom,
    editingRoomIndex,
    setEditingRoomIndex,
    draggingPhotoIndex,
    addRoom,
    handleDragEnd,
    startEditRoom,
    saveEditedRoom,
    cancelEditRoom,
    removeRoom,
    duplicateRoom,
    applyTemplate,
    toggleNewRoomFeature,
    handlePhotoDragStart,
    handlePhotoDragOver,
    handlePhotoDragEnd,
  };
}
