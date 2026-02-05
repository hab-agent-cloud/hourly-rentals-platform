import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ListingPhotoSection from '@/components/listing-editor/ListingPhotoSection';
import ListingBasicInfoSection from '@/components/listing-editor/ListingBasicInfoSection';
import ListingRoomsPhotosSection from '@/components/listing-editor/ListingRoomsPhotosSection';
import ListingCategoriesSection from '@/components/listing-editor/ListingCategoriesSection';
import ListingGiftsSection from '@/components/listing-editor/ListingGiftsSection';
import ListingManagerChat from '@/components/listing-editor/ListingManagerChat';

interface ListingEditorContentProps {
  listing: any;
  formData: any;
  uploadingPhoto: boolean;
  uploadingLogo: boolean;
  uploadingRoomPhoto: number | null;
  saving: boolean;
  id: string | undefined;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: () => void;
  onRemoveLogo: () => void;
  onFormChange: (field: string, value: string) => void;
  onRoomsChange: (rooms: any[]) => void;
  onRoomPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectRoom: (roomIdx: number) => void;
  onDeleteRoomPhoto: (roomIndex: number, photoIndex: number) => void;
  onSave: () => void;
}

export default function ListingEditorContent({
  listing,
  formData,
  uploadingPhoto,
  uploadingLogo,
  uploadingRoomPhoto,
  saving,
  id,
  onPhotoUpload,
  onLogoUpload,
  onRemovePhoto,
  onRemoveLogo,
  onFormChange,
  onRoomsChange,
  onRoomPhotoUpload,
  onSelectRoom,
  onDeleteRoomPhoto,
  onSave
}: ListingEditorContentProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <ListingPhotoSection
        imageUrl={formData.image_url}
        logoUrl={formData.logo_url}
        uploadingPhoto={uploadingPhoto}
        uploadingLogo={uploadingLogo}
        onPhotoUpload={onPhotoUpload}
        onLogoUpload={onLogoUpload}
        onRemovePhoto={onRemovePhoto}
        onRemoveLogo={onRemoveLogo}
      />

      <ListingBasicInfoSection
        formData={formData}
        onFormChange={onFormChange}
      />

      <ListingGiftsSection listingId={parseInt(id || '0')} />

      {listing?.owner_id ? (
        <ListingManagerChat
          listingId={listing.id}
          ownerId={listing.owner_id}
          ownerName={listing.owner_name || 'Владелец'}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <Icon name="UserX" size={24} />
              Владелец не назначен
            </CardTitle>
            <CardDescription>
              Этот объект пока не имеет владельца. Чат с владельцем будет доступен после назначения владельца.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <ListingCategoriesSection
        rooms={formData.rooms}
        onRoomsChange={onRoomsChange}
      />

      <ListingRoomsPhotosSection
        rooms={formData.rooms}
        uploadingRoomPhoto={uploadingRoomPhoto}
        onRoomPhotoUpload={onRoomPhotoUpload}
        onSelectRoom={onSelectRoom}
        onDeleteRoomPhoto={onDeleteRoomPhoto}
      />
      
      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" onClick={() => navigate('/manager')}>
          <Icon name="X" size={16} className="mr-2" />
          Отменить
        </Button>
        <Button onClick={onSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Icon name="Save" size={18} className="mr-2" />
              Сохранить изменения
            </>
          )}
        </Button>
      </div>
    </div>
  );
}