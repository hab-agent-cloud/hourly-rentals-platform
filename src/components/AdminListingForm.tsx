import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

import { useRoomManagement } from './listing-form/useRoomManagement';
import { usePhotoUpload } from './listing-form/usePhotoUpload';
import AdminListingBasicInfo from './admin-listing-form/AdminListingBasicInfo';
import AdminListingRoomsList from './admin-listing-form/AdminListingRoomsList';
import AdminListingNewRoom from './admin-listing-form/AdminListingNewRoom';

interface AdminListingFormProps {
  listing: any;
  token: string;
  onClose: () => void;
}

export default function AdminListingForm({ listing, token, onClose }: AdminListingFormProps) {
  console.log('✅ AdminListingForm component loaded - RESTORED VERSION');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [owners, setOwners] = useState<any[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerateDescription = async () => {
    if (!listing?.id) return;
    setGenerating(true);
    try {
      const result = await api.generateDescription(listing.id);
      if (result.description) {
        setFormData((prev: typeof formData) => ({ ...prev, description: result.description }));
        toast({ title: 'Описание сгенерировано', description: 'Проверьте и отредактируйте при необходимости' });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Попробуйте позже';
      toast({ title: 'Ошибка генерации', description: message, variant: 'destructive' });
    } finally {
      setGenerating(false);
    }
  };

  const [formData, setFormData] = useState(() => {
    console.log('=== INITIALIZING FORM DATA ===');
    console.log('Listing prop:', listing);
    console.log('Listing rooms:', listing?.rooms);
    if (listing?.rooms && listing.rooms.length > 0) {
      console.log('First room data:', listing.rooms[0]);
    }
    return {
      title: listing?.title || '',
      type: listing?.type || 'hotel',
      city: listing?.city || '',
      district: listing?.district || '',
      description: listing?.description || '',
      price: listing?.price || 0,
      auction: listing?.auction || 999,
      image_url: listing?.image_url || '',
      logo_url: listing?.logo_url || '',
      metro: listing?.metro || '',
      metro_walk: listing?.metro_walk || 0,
      metro_stations: listing?.metro_stations || [],
      has_parking: listing?.has_parking || false,
      parking_type: listing?.parking_type || 'none',
      parking_price_per_hour: listing?.parking_price_per_hour || 0,
      features: listing?.features || [],
      lat: listing?.lat || 0,
      lng: listing?.lng || 0,
      min_hours: listing?.min_hours || 1,
      rooms: listing?.rooms || [],
      phone: listing?.phone || '',
      telegram: listing?.telegram || '',
      price_warning_holidays: listing?.price_warning_holidays || false,
      price_warning_daytime: listing?.price_warning_daytime || false,
      owner_id: listing?.owner_id || null,
    };
  });

  const roomManagement = useRoomManagement(formData, setFormData);
  const {
    newRoom,
    setNewRoom,
    editingRoomIndex,
    addRoom,
    handleDragEnd,
    startEditRoom,
    saveEditedRoom,
    cancelEditRoom,
    removeRoom,
    duplicateRoom,
    applyTemplate,
    toggleNewRoomFeature,
    handlePhotoDragStart,
    handlePhotoDragOver,
    handlePhotoDragEnd,
    draggingPhotoIndex,
  } = roomManagement;

  const photoUpload = usePhotoUpload(token, formData, setFormData, newRoom, setNewRoom);
  const {
    fileInputRef,
    logoInputRef,
    uploadingPhoto,
    uploadingLogo,
    uploadingRoomPhotos,
    isDragging,
    handlePhotoUpload,
    handleLogoUpload,
    handleNewRoomPhotosUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeNewRoomPhoto,
    replaceRoomPhoto,
  } = photoUpload;

  useEffect(() => {
    if (listing) {
      console.log('=== UPDATING FORM DATA FROM LISTING PROP ===');
      console.log('Listing:', listing);
      console.log('Rooms:', listing.rooms);
      
      setFormData({
        title: listing.title || '',
        type: listing.type || 'hotel',
        city: listing.city || '',
        district: listing.district || '',
        description: listing.description || '',
        price: listing.price || 0,
        auction: listing.auction || 999,
        image_url: listing.image_url || '',
        logo_url: listing.logo_url || '',
        metro: listing.metro || '',
        metro_walk: listing.metro_walk || 0,
        metro_stations: listing.metro_stations || [],
        has_parking: listing.has_parking || false,
        parking_type: listing.parking_type || 'none',
        parking_price_per_hour: listing.parking_price_per_hour || 0,
        features: listing.features || [],
        lat: listing.lat || 0,
        lng: listing.lng || 0,
        min_hours: listing.min_hours || 1,
        rooms: listing.rooms || [],
        phone: listing.phone || '',
        telegram: listing.telegram || '',
        price_warning_holidays: listing.price_warning_holidays || false,
        price_warning_daytime: listing.price_warning_daytime || false,
        owner_id: listing.owner_id || null,
      });
    }
  }, [listing]);

  useEffect(() => {
    const loadOwners = async () => {
      setLoadingOwners(true);
      try {
        const response = await api.getAllOwners(token);
        setOwners(response || []);
      } catch (error) {
        console.error('Failed to load owners:', error);
      } finally {
        setLoadingOwners(false);
      }
    };
    loadOwners();
  }, [token]);

  const geocodeAddress = async (city: string, address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const fullAddress = `${city}, ${address}`;
      const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=99b1f0e4-c9e6-4e09-b735-29881250fb58&geocode=${encodeURIComponent(fullAddress)}&format=json`
      );
      const data = await response.json();
      const geoObject = data.response.GeoObjectCollection.featureMember[0];
      if (geoObject) {
        const coords = geoObject.GeoObject.Point.pos.split(' ');
        return { lat: parseFloat(coords[1]), lng: parseFloat(coords[0]) };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const debugInfo = {
      editingRoomIndex,
      newRoomType: newRoom.type,
      newRoomPrice: newRoom.price,
      currentRoomsCount: formData.rooms.length,
      willAutoAdd: !!(newRoom.type && newRoom.price > 0)
    };
    
    console.log('🚀 HANDLE SUBMIT CALLED - START');
    console.log('🔍 editingRoomIndex:', editingRoomIndex);
    console.log('🔍 newRoom state:', JSON.stringify(newRoom));
    console.log('🔍 formData.rooms.length:', formData.rooms.length);
    console.table(debugInfo);
    
    setIsLoading(true);

    try {
      let finalData = { ...formData };
      
      console.log('🔍 Checking newRoom:', {
        type: newRoom.type,
        price: newRoom.price,
        hasType: !!newRoom.type,
        hasPrice: newRoom.price > 0,
        willAutoAdd: !!(newRoom.type && newRoom.price > 0)
      });
      
      if (newRoom.type && newRoom.price > 0) {
        const roomToAdd = {
          type: newRoom.type,
          price: newRoom.price,
          description: newRoom.description,
          images: [...(Array.isArray(newRoom.images) ? newRoom.images : [])],
          square_meters: newRoom.square_meters,
          features: [...(Array.isArray(newRoom.features) ? newRoom.features : [])],
          min_hours: newRoom.min_hours,
          payment_methods: newRoom.payment_methods,
          cancellation_policy: newRoom.cancellation_policy
        };
        
        finalData = {
          ...finalData,
          rooms: [...finalData.rooms, roomToAdd]
        };
        
        console.log('⚠️ Auto-added unsaved room before submit:', roomToAdd.type);
        
        toast({
          title: 'Внимание',
          description: `Категория "${roomToAdd.type}" автоматически добавлена при сохранении`,
        });
      }

      console.log('=== SAVING LISTING ===');
      console.log('formData.rooms:', formData.rooms);
      console.log('formData.rooms length:', formData.rooms?.length);
      
      if (formData.rooms && formData.rooms.length > 0) {
        console.log('Rooms to save:');
        formData.rooms.forEach((room, idx) => {
          console.log(`  ${idx + 1}. ${room.type} - ${room.price} ₽`);
        });
      } else {
        console.warn('⚠️ NO ROOMS TO SAVE!');
      }

      if (formData.city && formData.district) {
        const coords = await geocodeAddress(formData.city, formData.district);
        if (coords) {
          finalData = { ...finalData, lat: coords.lat, lng: coords.lng };
          toast({
            title: 'Координаты определены',
            description: `Объект размещён на карте`,
          });
        }
      }

      const cleanRooms = finalData.rooms.map((room: any) => ({
        type: room.type,
        price: room.price,
        description: room.description || '',
        images: Array.isArray(room.images) ? room.images : [],
        square_meters: room.square_meters || 0,
        features: Array.isArray(room.features) ? room.features : [],
        min_hours: room.min_hours || 1,
        payment_methods: room.payment_methods || 'Наличные, банковская карта при заселении',
        cancellation_policy: room.cancellation_policy || 'Бесплатная отмена за 1 час до заселения'
      }));

      finalData = { ...finalData, rooms: cleanRooms };

      console.log('Sending to server:', finalData);
      console.log('Rooms count:', finalData.rooms?.length);

      let createdOrUpdatedId = listing?.id;
      
      if (listing) {
        const updated = await api.updateListing(token, listing.id, finalData);
        console.log('✅ Server returned updated listing:', updated);
        
        toast({
          title: 'Успешно',
          description: `Объект обновлён. Категорий номеров: ${finalData.rooms.length}`,
        });
        
        const freshData = await api.getListings(token, false);
        console.log('🔄 Reloaded fresh data from server');
      } else {
        const created = await api.createListing(token, finalData);
        createdOrUpdatedId = created.id;
        
        toast({
          title: 'Успешно',
          description: 'Объект создан',
        });
      }
      
      if (createdOrUpdatedId) {
        try {
          await api.submitForModeration(token, createdOrUpdatedId);
          toast({
            title: 'Отправлено на модерацию',
            description: 'Объект отправлен на проверку модератору',
          });
        } catch (error) {
          console.error('Failed to submit for moderation:', error);
        }
      }
      
      setNewRoom({ 
        type: '', 
        price: 0, 
        description: '', 
        images: [], 
        square_meters: 0,
        features: [],
        min_hours: 1,
        payment_methods: 'Наличные, банковская карта при заселении',
        cancellation_policy: 'Бесплатная отмена за 1 час до заселения'
      });
      roomManagement.setEditingRoomIndex(null);
      
      onClose();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.message || 'Не удалось сохранить объект',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 overflow-y-auto z-50">
      <main className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10 rounded-t-lg">
          <h1 className="text-2xl font-bold">
            {listing ? 'Редактирование объекта' : 'Новый объект'}
          </h1>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <AdminListingBasicInfo
            formData={formData}
            setFormData={setFormData}
            fileInputRef={fileInputRef}
            logoInputRef={logoInputRef}
            uploadingPhoto={uploadingPhoto}
            uploadingLogo={uploadingLogo}
            handlePhotoUpload={handlePhotoUpload}
            handleLogoUpload={handleLogoUpload}
            owners={owners}
            loadingOwners={loadingOwners}
            listingId={listing?.id}
            onGenerateDescription={handleGenerateDescription}
            generating={generating}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="BedDouble" size={24} className="text-purple-600" />
                Категории номеров
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.rooms && formData.rooms.length > 0 ? (
                <AdminListingRoomsList
                  rooms={formData.rooms}
                  editingRoomIndex={editingRoomIndex}
                  newRoom={newRoom}
                  setNewRoom={setNewRoom}
                  startEditRoom={startEditRoom}
                  saveEditedRoom={saveEditedRoom}
                  cancelEditRoom={cancelEditRoom}
                  removeRoom={removeRoom}
                  duplicateRoom={duplicateRoom}
                  handleDragEnd={handleDragEnd}
                  toggleNewRoomFeature={toggleNewRoomFeature}
                  handlePhotoDragStart={handlePhotoDragStart}
                  handlePhotoDragOver={handlePhotoDragOver}
                  handlePhotoDragEnd={handlePhotoDragEnd}
                  draggingPhotoIndex={draggingPhotoIndex}
                  removeNewRoomPhoto={removeNewRoomPhoto}
                  replaceRoomPhoto={replaceRoomPhoto}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Icon name="BedDouble" size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Категории номеров не добавлены</p>
                  <p className="text-sm">Добавьте первую категорию ниже</p>
                </div>
              )}

              {editingRoomIndex === null && (
                <AdminListingNewRoom
                  newRoom={newRoom}
                  setNewRoom={setNewRoom}
                  addRoom={addRoom}
                  applyTemplate={applyTemplate}
                  toggleNewRoomFeature={toggleNewRoomFeature}
                  handleNewRoomPhotosUpload={handleNewRoomPhotosUpload}
                  removeNewRoomPhoto={removeNewRoomPhoto}
                  replaceRoomPhoto={replaceRoomPhoto}
                  handlePhotoDragStart={handlePhotoDragStart}
                  handlePhotoDragOver={handlePhotoDragOver}
                  handlePhotoDragEnd={handlePhotoDragEnd}
                  handleDragOver={handleDragOver}
                  handleDragLeave={handleDragLeave}
                  handleDrop={handleDrop}
                  isDragging={isDragging}
                  uploadingRoomPhotos={uploadingRoomPhotos}
                  draggingPhotoIndex={draggingPhotoIndex}
                />
              )}
            </CardContent>
          </Card>

          <div className="flex gap-3 sticky bottom-0 bg-white pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Icon name="Save" size={18} className="mr-2" />
                  Сохранить объект
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}