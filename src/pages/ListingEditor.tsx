import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useListingEditor } from '@/hooks/useListingEditor';
import ListingEditorHeader from '@/components/listing-editor/ListingEditorHeader';
import ListingEditorContent from '@/components/listing-editor/ListingEditorContent';

export default function ListingEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const {
    loading,
    saving,
    activatingTrial,
    showTrialDaysSelector,
    setShowTrialDaysSelector,
    trialDays,
    setTrialDays,
    sendingGoldGift,
    listing,
    uploadingPhoto,
    uploadingLogo,
    uploadingRoomPhoto,
    setSelectedRoomForPhoto,
    formData,
    setFormData,
    handlePhotoUpload,
    handleLogoUpload,
    handleRoomPhotoUpload,
    handleDeleteRoomPhoto,
    handleSave,
    handleFormChange,
    handleActivateTrial,
    handleSendGoldGift
  } = useListingEditor(id);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4" />
          <p>Загрузка объекта...</p>
        </div>
      </div>
    );
  }
  
  if (!listing) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-destructive" />
          <p className="text-xl font-semibold mb-2">Объект не найден</p>
          <Button onClick={() => navigate('/manager')}>
            <Icon name="ArrowLeft" size={16} className="mr-2" />
            Вернуться назад
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 max-w-4xl">
        <ListingEditorHeader
          listing={listing}
          saving={saving}
          sendingGoldGift={sendingGoldGift}
          activatingTrial={activatingTrial}
          showTrialDaysSelector={showTrialDaysSelector}
          trialDays={trialDays}
          id={id}
          onSave={handleSave}
          onSendGoldGift={handleSendGoldGift}
          onActivateTrial={handleActivateTrial}
          onShowTrialDaysSelector={setShowTrialDaysSelector}
          onTrialDaysChange={setTrialDays}
        />
        
        <ListingEditorContent
          listing={listing}
          formData={formData}
          uploadingPhoto={uploadingPhoto}
          uploadingLogo={uploadingLogo}
          uploadingRoomPhoto={uploadingRoomPhoto}
          saving={saving}
          id={id}
          onPhotoUpload={handlePhotoUpload}
          onLogoUpload={handleLogoUpload}
          onRemovePhoto={() => setFormData({ ...formData, image_url: '' })}
          onRemoveLogo={() => setFormData({ ...formData, logo_url: '' })}
          onFormChange={handleFormChange}
          onRoomsChange={(rooms) => setFormData({ ...formData, rooms })}
          onRoomPhotoUpload={handleRoomPhotoUpload}
          onSelectRoom={(roomIdx) => setSelectedRoomForPhoto(roomIdx)}
          onDeleteRoomPhoto={handleDeleteRoomPhoto}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
