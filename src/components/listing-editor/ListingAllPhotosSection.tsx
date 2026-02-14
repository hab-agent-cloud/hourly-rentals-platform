import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Room {
  type: string;
  price: string;
  images?: string[];
}

interface ListingAllPhotosSectionProps {
  imageUrl: string;
  rooms: Room[];
}

export default function ListingAllPhotosSection({
  imageUrl,
  rooms
}: ListingAllPhotosSectionProps) {
  const allPhotos: Array<{ url: string; label: string }> = [];

  if (imageUrl) {
    allPhotos.push({ url: imageUrl, label: 'Главное фото' });
  }

  if (rooms && Array.isArray(rooms)) {
    rooms.forEach((room, roomIdx) => {
      if (room.images && Array.isArray(room.images)) {
        room.images.forEach((img, imgIdx) => {
          allPhotos.push({
            url: img,
            label: `${room.type} - фото ${imgIdx + 1}`
          });
        });
      }
    });
  }

  if (allPhotos.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Images" size={20} />
          Все фотографии объекта ({allPhotos.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {allPhotos.map((photo, idx) => (
            <div key={idx} className="relative group">
              <img 
                src={photo.url} 
                alt={photo.label} 
                className="w-full aspect-square object-cover rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-colors" 
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent rounded-b-lg p-2">
                <p className="text-white text-xs font-medium truncate">{photo.label}</p>
              </div>
              <div className="absolute top-1 right-1 bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {idx + 1}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
