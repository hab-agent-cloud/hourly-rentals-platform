import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface PhotoGalleryProps {
  images: string[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onRemove: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  uploadingPhoto: boolean;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}

export default function PhotoGallery({
  images,
  onUpload,
  onRemove,
  onReorder,
  uploadingPhoto,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
}: PhotoGalleryProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1">
        <Icon name="Image" size={16} className="inline mr-1" />
        Фотографии объекта
      </label>
      
      <div
        className={`border-2 border-dashed rounded-lg p-4 transition-colors ${
          isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={onUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingPhoto}
          className="w-full"
        >
          {uploadingPhoto ? (
            <>
              <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
              Загрузка...
            </>
          ) : (
            <>
              <Icon name="Upload" size={16} className="mr-2" />
              Загрузить фото (или перетащите сюда)
            </>
          )}
        </Button>
      </div>

      {images && images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative group">
              <img
                src={img}
                alt={`Фото ${idx + 1}`}
                className="w-full h-32 object-cover rounded border-2 border-purple-200"
              />
              <div className="absolute top-1 left-1 bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
                {idx + 1}
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onRemove(idx)}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 p-0"
              >
                <Icon name="Trash2" size={14} />
              </Button>
              <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {idx > 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => onReorder(idx, idx - 1)}
                    className="h-7 w-7 p-0"
                    title="Переместить влево"
                  >
                    <Icon name="ChevronLeft" size={14} />
                  </Button>
                )}
                {idx < images.length - 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => onReorder(idx, idx + 1)}
                    className="h-7 w-7 p-0"
                    title="Переместить вправо"
                  >
                    <Icon name="ChevronRight" size={14} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
