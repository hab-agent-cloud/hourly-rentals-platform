import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface ListingPhotoSectionProps {
  imageUrl: string;
  logoUrl: string;
  uploadingPhoto: boolean;
  uploadingLogo: boolean;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
  onRemoveLogo: () => void;
}

export default function ListingPhotoSection({
  imageUrl,
  logoUrl,
  uploadingPhoto,
  uploadingLogo,
  onPhotoUpload,
  onLogoUpload,
  onRemovePhoto,
  onRemoveLogo
}: ListingPhotoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Image" size={20} />
          Фотографии
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label>Главное фото</Label>
            {imageUrl ? (
              <div className="relative mt-2 group">
                <img src={imageUrl} alt="Главное фото" className="w-full h-48 object-cover rounded-lg border-2 border-primary" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon name="Upload" size={16} className="mr-1" />
                    Изменить
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={onRemovePhoto}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full h-48 mt-2 border-dashed"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? (
                  <Icon name="Loader2" size={32} className="animate-spin" />
                ) : (
                  <div className="text-center">
                    <Icon name="Upload" size={32} className="mx-auto mb-2" />
                    <p className="text-sm">Загрузить главное фото</p>
                  </div>
                )}
              </Button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onPhotoUpload}
            />
          </div>

          <div>
            <Label>Логотип</Label>
            {logoUrl ? (
              <div className="relative mt-2 group">
                <img src={logoUrl} alt="Логотип" className="w-full h-48 object-contain rounded-lg border-2 border-primary bg-gray-50" />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => logoInputRef.current?.click()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon name="Upload" size={16} className="mr-1" />
                    Изменить
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={onRemoveLogo}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full h-48 mt-2 border-dashed"
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingLogo}
              >
                {uploadingLogo ? (
                  <Icon name="Loader2" size={32} className="animate-spin" />
                ) : (
                  <div className="text-center">
                    <Icon name="Upload" size={32} className="mx-auto mb-2" />
                    <p className="text-sm">Загрузить логотип</p>
                  </div>
                )}
              </Button>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onLogoUpload}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}