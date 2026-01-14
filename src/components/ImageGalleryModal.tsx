import { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

interface ImageGalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room: any;
  listingImageUrl: string;
}

export default function ImageGalleryModal({ open, onOpenChange, room, listingImageUrl }: ImageGalleryModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const roomImages = room?.images && Array.isArray(room.images) && room.images.length > 0 
    ? room.images 
    : [listingImageUrl];

  const handlePrevImage = () => {
    setCurrentImageIndex(currentImageIndex === 0 ? roomImages.length - 1 : currentImageIndex - 1);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(currentImageIndex === roomImages.length - 1 ? 0 : currentImageIndex + 1);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden">
        <div className="relative bg-black">
          <img
            src={roomImages[currentImageIndex]}
            alt={room?.type || 'Room'}
            className="w-full h-[70vh] object-contain"
          />
          
          {roomImages.length > 1 && (
            <>
              <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium">
                {currentImageIndex + 1} / {roomImages.length}
              </div>
              
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
              >
                <Icon name="ChevronLeft" size={32} />
              </button>
              
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
              >
                <Icon name="ChevronRight" size={32} />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90%] overflow-x-auto p-2 bg-black/50 rounded-lg">
                {roomImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex 
                        ? 'border-white scale-110' 
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </>
          )}
          
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
          >
            <Icon name="X" size={24} />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
