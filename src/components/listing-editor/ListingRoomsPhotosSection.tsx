import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Room {
  type: string;
  price: string;
  images?: string[];
}

interface ListingRoomsPhotosSectionProps {
  rooms: Room[];
  uploadingRoomPhoto: number | null;
  onRoomPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectRoom: (roomIndex: number) => void;
  onDeleteRoomPhoto: (roomIndex: number, photoIndex: number) => void;
}

export default function ListingRoomsPhotosSection({
  rooms,
  uploadingRoomPhoto,
  onRoomPhotoUpload,
  onSelectRoom,
  onDeleteRoomPhoto
}: ListingRoomsPhotosSectionProps) {
  const roomPhotoInputRef = useRef<HTMLInputElement>(null);

  if (!rooms || rooms.length === 0) {
    return null;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Bed" size={20} />
            Номера и их фотографии ({rooms.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rooms.map((room: Room, roomIdx: number) => (
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

              {room.images && Array.isArray(room.images) && room.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {room.images.map((img: string, imgIdx: number) => (
                    <div key={imgIdx} className="relative group">
                      <img 
                        src={img} 
                        alt={`${room.type} ${imgIdx + 1}`} 
                        className="w-full aspect-square object-cover rounded-lg border-2 border-purple-300" 
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => onDeleteRoomPhoto(roomIdx, imgIdx)}
                      >
                        <Icon name="Trash2" size={14} />
                      </Button>
                      <div className="absolute bottom-1 left-1 bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                        {imgIdx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(!room.images || room.images.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">Нет фотографий для этого номера</p>
              )}
            </div>
          ))}
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
