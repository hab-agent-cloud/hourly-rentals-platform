import { useRef } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Room {
  type: string;
  price: string;
  images?: string[];
}

interface SortablePhotoProps {
  id: string;
  url: string;
  index: number;
  roomType: string;
  onDelete: () => void;
}

function SortablePhoto({ id, url, index, roomType, onDelete }: SortablePhotoProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <img
          src={url}
          alt={`${roomType} ${index + 1}`}
          className="w-full aspect-square object-cover rounded-lg border-2 border-purple-300 select-none"
          draggable={false}
        />
        <div className="absolute top-1 left-1 bg-black/40 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Icon name="GripVertical" size={14} className="text-white" />
        </div>
      </div>
      <Button
        type="button"
        size="sm"
        variant="destructive"
        className="absolute top-1 right-1 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onDelete}
      >
        <Icon name="Trash2" size={14} />
      </Button>
      <div className="absolute bottom-1 left-1 bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
        {index + 1}
      </div>
    </div>
  );
}

interface ListingRoomsPhotosSectionProps {
  rooms: Room[];
  uploadingRoomPhoto: number | null;
  onRoomPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectRoom: (roomIndex: number) => void;
  onDeleteRoomPhoto: (roomIndex: number, photoIndex: number) => void;
  onReorderRoomPhotos: (roomIndex: number, newImages: string[]) => void;
}

export default function ListingRoomsPhotosSection({
  rooms,
  uploadingRoomPhoto,
  onRoomPhotoUpload,
  onSelectRoom,
  onDeleteRoomPhoto,
  onReorderRoomPhotos,
}: ListingRoomsPhotosSectionProps) {
  const roomPhotoInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const handleDragEnd = (roomIdx: number, images: string[]) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = images.indexOf(active.id as string);
    const newIndex = images.indexOf(over.id as string);
    onReorderRoomPhotos(roomIdx, arrayMove(images, oldIndex, newIndex));
  };

  if (!rooms || rooms.length === 0) return null;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Bed" size={20} />
            Номера и их фотографии ({rooms.length})
          </CardTitle>
          <p className="text-xs text-muted-foreground">Перетащите фото для изменения порядка</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {rooms.map((room: Room, roomIdx: number) => {
            const images = room.images && Array.isArray(room.images) ? room.images : [];
            return (
              <div key={roomIdx} className="p-4 border rounded-lg bg-purple-50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div>
                    <div className="font-semibold text-lg">{room.type}</div>
                    <div className="text-purple-600 font-bold">{room.price} ₽/час</div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      onSelectRoom(roomIdx);
                      roomPhotoInputRef.current?.click();
                    }}
                    disabled={uploadingRoomPhoto === roomIdx}
                  >
                    {uploadingRoomPhoto === roomIdx ? (
                      <>
                        <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                        Загрузка...
                      </>
                    ) : (
                      <>
                        <Icon name="Upload" size={16} className="mr-2" />
                        Добавить фото
                      </>
                    )}
                  </Button>
                </div>

                {images.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd(roomIdx, images)}
                  >
                    <SortableContext items={images} strategy={rectSortingStrategy}>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {images.map((img: string, imgIdx: number) => (
                          <SortablePhoto
                            key={img}
                            id={img}
                            url={img}
                            index={imgIdx}
                            roomType={room.type}
                            onDelete={() => onDeleteRoomPhoto(roomIdx, imgIdx)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">Нет фотографий для этого номера</p>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <input
        ref={roomPhotoInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onRoomPhotoUpload}
      />
    </>
  );
}
