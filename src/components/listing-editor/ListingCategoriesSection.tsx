import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Room {
  type: string;
  price: string;
  images?: string[];
}

interface ListingCategoriesSectionProps {
  rooms: Room[];
  onRoomsChange: (rooms: Room[]) => void;
}

export default function ListingCategoriesSection({
  rooms,
  onRoomsChange
}: ListingCategoriesSectionProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newRoom, setNewRoom] = useState({ type: '', price: '' });

  const handleAddRoom = () => {
    if (newRoom.type && newRoom.price) {
      const updatedRooms = [...rooms, { ...newRoom, images: [] }];
      onRoomsChange(updatedRooms);
      setNewRoom({ type: '', price: '' });
      setShowAddDialog(false);
    }
  };

  const handleEditRoom = () => {
    if (editingIndex !== null && newRoom.type && newRoom.price) {
      const updatedRooms = [...rooms];
      updatedRooms[editingIndex] = { ...updatedRooms[editingIndex], ...newRoom };
      onRoomsChange(updatedRooms);
      setEditingIndex(null);
      setNewRoom({ type: '', price: '' });
    }
  };

  const handleDeleteRoom = (index: number) => {
    const updatedRooms = rooms.filter((_, idx) => idx !== index);
    onRoomsChange(updatedRooms);
  };

  const openEditDialog = (index: number) => {
    setEditingIndex(index);
    setNewRoom({ type: rooms[index].type, price: rooms[index].price });
  };

  const closeDialog = () => {
    setShowAddDialog(false);
    setEditingIndex(null);
    setNewRoom({ type: '', price: '' });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Icon name="Bed" size={20} />
              Категории номеров ({rooms.length})
            </span>
            <Button onClick={() => setShowAddDialog(true)} size="sm">
              <Icon name="Plus" size={16} className="mr-1" />
              Добавить категорию
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rooms.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Bed" size={48} className="mx-auto mb-3 opacity-30" />
              <p>Нет добавленных категорий</p>
              <p className="text-sm mt-1">Нажмите "Добавить категорию" чтобы создать</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rooms.map((room, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-4 border rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <div>
                    <div className="font-semibold text-lg">{room.type}</div>
                    <div className="text-blue-600 font-bold">{room.price} ₽/час</div>
                    {room.images && room.images.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        📷 {room.images.length} {room.images.length === 1 ? 'фото' : 'фотографий'}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(index)}
                    >
                      <Icon name="Edit" size={14} className="mr-1" />
                      Изменить
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteRoom(index)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showAddDialog || editingIndex !== null} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? 'Редактировать категорию' : 'Добавить категорию'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="room-type">Название категории</Label>
              <Input
                id="room-type"
                value={newRoom.type}
                onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                placeholder="Например: Стандарт, Люкс, Студия"
              />
            </div>
            <div>
              <Label htmlFor="room-price">Цена (₽/час)</Label>
              <Input
                id="room-price"
                type="number"
                value={newRoom.price}
                onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
                placeholder="1500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Отмена
            </Button>
            <Button 
              onClick={editingIndex !== null ? handleEditRoom : handleAddRoom}
              disabled={!newRoom.type || !newRoom.price}
            >
              {editingIndex !== null ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
