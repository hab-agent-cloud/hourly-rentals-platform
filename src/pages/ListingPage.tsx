import { useState, useEffect } from 'react';
import { themes, type ThemeKey } from '@/components/ThemeSwitcher';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import ListingHeader from '@/components/ListingHeader';
import ListingInfoCard from '@/components/ListingInfoCard';
import RoomCategoryCard from '@/components/RoomCategoryCard';
import ImageGalleryModal from '@/components/ImageGalleryModal';

export default function ListingPage() {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageGalleryOpen, setImageGalleryOpen] = useState(false);
  const [galleryRoomIndex, setGalleryRoomIndex] = useState(0);
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    const saved = localStorage.getItem('guestTheme');
    return (saved as ThemeKey) || 'default';
  });

  useEffect(() => {
    const handleThemeChange = (e: CustomEvent) => {
      setCurrentTheme(e.detail as ThemeKey);
    };
    
    window.addEventListener('themeChange', handleThemeChange as EventListener);
    return () => window.removeEventListener('themeChange', handleThemeChange as EventListener);
  }, []);

  useEffect(() => {
    const loadListing = async () => {
      try {
        const id = parseInt(listingId || '0');
        if (!id) {
          setIsLoading(false);
          return;
        }
        
        const foundListing = await api.getPublicListing(id);
        
        if (foundListing && !foundListing.error) {
          if (foundListing.rooms && foundListing.rooms.length > 0) {
            const needsImages = foundListing.rooms.some((r: Record<string, unknown>) => !r.images);
            if (needsImages) {
              const roomsWithImages = await Promise.all(
                foundListing.rooms.map(async (_: Record<string, unknown>, index: number) => {
                  try {
                    return await api.getRoomDetails(foundListing.id, index);
                  } catch {
                    return foundListing.rooms[index];
                  }
                })
              );
              foundListing.rooms = roomsWithImages;
            }
          }
          setListing(foundListing);
        }
      } catch (error) {
        console.error('Failed to load listing:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadListing();
  }, [listingId]);

  const openGallery = (roomIndex: number) => {
    setGalleryRoomIndex(roomIndex);
    setImageGalleryOpen(true);
  };

  const getFirstImage = (imageUrl: any) => {
    if (!imageUrl) return null;
    
    if (typeof imageUrl === 'string') {
      try {
        const parsed = JSON.parse(imageUrl);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed[0];
        }
      } catch {
        return imageUrl;
      }
    }
    
    if (Array.isArray(imageUrl) && imageUrl.length > 0) {
      return imageUrl[0];
    }
    
    return null;
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${themes[currentTheme].gradient} transition-all duration-500 flex items-center justify-center`}>
        <Icon name="Loader2" size={48} className="animate-spin text-purple-600" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${themes[currentTheme].gradient} transition-all duration-500 flex items-center justify-center`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Отель не найден</h2>
          <Button onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={18} className="mr-2" />
            На главную
          </Button>
        </div>
      </div>
    );
  }

  const firstImage = getFirstImage(listing.image_url);
  
  const minPrice = listing.rooms && listing.rooms.length > 0 
    ? Math.min(...listing.rooms.map((r: any) => r.price2h || 999999))
    : null;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": listing.title,
    "description": listing.description || `Почасовая аренда номеров в ${listing.city}. ${listing.title} предлагает комфортные номера от 2 часов.`,
    "image": firstImage || listing.image_url,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": listing.city,
      "addressRegion": listing.district,
      "addressCountry": "RU"
    },
    "priceRange": minPrice ? `от ${minPrice}₽` : "$$",
    "telephone": listing.contact_phone,
    "aggregateRating": listing.rooms?.length > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": Math.max(5, listing.rooms.length * 3)
    } : undefined,
    "amenityFeature": listing.rooms?.[0]?.features?.map((f: string) => ({
      "@type": "LocationFeatureSpecification",
      "name": f
    })) || []
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themes[currentTheme].gradient} transition-all duration-500`}>
      <Helmet>
        <title>{listing.title} — Почасовая аренда в {listing.city} от {minPrice ? `${minPrice}₽` : '500₽'} | 120 МИНУТ</title>
        <meta name="description" content={`${listing.title} в ${listing.city}${listing.district ? `, ${listing.district}` : ''}. Почасовая аренда номеров от 2 часов. ${listing.description ? listing.description.slice(0, 120) : 'Бронирование напрямую у владельца.'}`} />
        <meta property="og:title" content={`${listing.title} — Почасовая аренда в ${listing.city}`} />
        <meta property="og:description" content={`Аренда номеров от 2 часов в ${listing.city}. ${minPrice ? `От ${minPrice}₽` : 'Выгодные цены'}`} />
        <meta property="og:image" content={firstImage || listing.image_url} />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      <ListingHeader
        title={listing.title}
        city={listing.city}
        district={listing.district}
        logoUrl={listing.logo_url}
        onBack={() => navigate('/')}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <ListingInfoCard listing={listing} />

        {/* Описание объекта */}
        {listing.description && (
          <div className="mb-6 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Icon name="FileText" size={20} className="text-purple-600" />
              Об объекте
            </h2>
            <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
              {listing.description}
            </p>
          </div>
        )}

        {/* Список категорий номеров */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Icon name="Bed" size={24} className="text-purple-600" />
            Категории номеров
          </h2>

          {listing.rooms && listing.rooms.length > 0 ? (
            listing.rooms.map((room: any, roomIndex: number) => (
              <RoomCategoryCard
                key={roomIndex}
                room={room}
                roomIndex={roomIndex}
                listingImageUrl={firstImage || listing.image_url}
                listingPriceWarningHolidays={listing.price_warning_holidays}
                listingPriceWarningDaytime={listing.price_warning_daytime}
                onOpenGallery={openGallery}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="Bed" size={48} className="mx-auto mb-4 opacity-20" />
              <p>Информация о категориях номеров отсутствует</p>
            </div>
          )}
        </div>
      </main>

      <ImageGalleryModal
        open={imageGalleryOpen}
        onOpenChange={setImageGalleryOpen}
        room={listing.rooms?.[galleryRoomIndex]}
        listingImageUrl={firstImage || listing.image_url}
      />
    </div>
  );
}