import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { RoomItem } from '../listing-form/RoomItem';

interface AdminListingRoomsListProps {
  rooms: any[];
  editingRoomIndex: number | null;
  newRoom: any;
  setNewRoom: (room: any) => void;
  startEditRoom: (index: number) => void;
  saveEditedRoom: () => void;
  cancelEditRoom: () => void;
  removeRoom: (index: number) => void;
  duplicateRoom: (index: number) => void;
  handleDragEnd: (event: any) => void;
  toggleNewRoomFeature: (feature: string) => void;
  handlePhotoDragStart: (index: number) => void;
  handlePhotoDragOver: (e: React.DragEvent, index: number) => void;
  handlePhotoDragEnd: () => void;
  draggingPhotoIndex: number | null;
  removeNewRoomPhoto: (index: number) => void;
  replaceRoomPhoto: (index: number, file: File) => void;
}

export default function AdminListingRoomsList({
  rooms,
  editingRoomIndex,
  newRoom,
  setNewRoom,
  startEditRoom,
  saveEditedRoom,
  cancelEditRoom,
  removeRoom,
  duplicateRoom,
  handleDragEnd,
  toggleNewRoomFeature,
  handlePhotoDragStart,
  handlePhotoDragOver,
  handlePhotoDragEnd,
  draggingPhotoIndex,
  removeNewRoomPhoto,
  replaceRoomPhoto,
}: AdminListingRoomsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!rooms || rooms.length === 0) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={rooms.map((_: any, index: number) => `room-${index}`)}
        strategy={verticalListSortingStrategy}
      >
        {rooms.map((room: any, index: number) => (
          <div key={`room-${index}`}>
            <RoomItem
              id={`room-${index}`}
              index={index}
              room={room}
              isEditing={editingRoomIndex === index}
              editedRoom={editingRoomIndex === index ? newRoom : room}
              onStartEdit={() => startEditRoom(index)}
              onSaveEdit={saveEditedRoom}
              onCancelEdit={cancelEditRoom}
              onRemove={() => removeRoom(index)}
              onDuplicate={() => duplicateRoom(index)}
              onEditChange={(field: string, value: any) => {
                if (editingRoomIndex === index) {
                  setNewRoom({ ...newRoom, [field]: value });
                }
              }}
              onToggleFeature={toggleNewRoomFeature}
              onPhotoDragStart={handlePhotoDragStart}
              onPhotoDragOver={handlePhotoDragOver}
              onPhotoDragEnd={handlePhotoDragEnd}
              draggingPhotoIndex={draggingPhotoIndex}
              onRemovePhoto={removeNewRoomPhoto}
              onReplacePhoto={replaceRoomPhoto}
            />
          </div>
        ))}
      </SortableContext>
    </DndContext>
  );
}
