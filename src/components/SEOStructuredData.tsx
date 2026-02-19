import { Helmet } from 'react-helmet-async';

interface SEOStructuredDataProps {
  listings?: Record<string, unknown>[];
  cities?: string[];
}

const SEOStructuredData = ({ listings = [], cities = [] }: SEOStructuredDataProps) => {
  const getFirstImage = (imageUrl: unknown): string | undefined => {
    if (!imageUrl) return undefined;
    if (typeof imageUrl === 'string') {
      try {
        const parsed = JSON.parse(imageUrl);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      } catch {
        return imageUrl;
      }
    }
    if (Array.isArray(imageUrl) && imageUrl.length > 0) return imageUrl[0] as string;
    return undefined;
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Почасовая аренда номеров — каталог объектов",
    "description": "Лучшие объекты для почасовой аренды по всей России",
    "itemListElement": listings.slice(0, 12).map((listing, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "LodgingBusiness",
        "name": listing.title,
        "description": `Почасовая аренда номеров в ${listing.city}. От ${listing.price || 250}₽/час. Минимум ${listing.minHours || 1} час.`,
        "image": getFirstImage(listing.image_url),
        "address": {
          "@type": "PostalAddress",
          "addressLocality": listing.city,
          "streetAddress": listing.address || listing.district,
          "addressCountry": "RU"
        },
        "url": `https://120minut.ru/listing/${listing.id}`,
        "priceRange": `от ${listing.price || 250}₽/час`,
        "telephone": listing.phone,
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
          "opens": "00:00",
          "closes": "23:59"
        },
        ...(listing.rating ? {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": listing.rating,
            "reviewCount": listing.reviews || 1,
            "bestRating": "5",
            "worstRating": "1"
          }
        } : {})
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": "https://120minut.ru/"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Что такое почасовая аренда отеля?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Почасовая аренда отеля — это возможность арендовать номер на несколько часов (от 1 часа) вместо традиционных суток. Это удобно для деловых встреч, отдыха между поездками или краткосрочного размещения."
        }
      },
      {
        "@type": "Question",
        "name": "Как забронировать номер на 120 МИНУТ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Выберите город и подходящий отель из каталога, свяжитесь с владельцем по указанному телефону или через Telegram/WhatsApp. Бронирование происходит напрямую без комиссии."
        }
      },
      {
        "@type": "Question",
        "name": "Сколько стоит аренда номера на 2 часа?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Стоимость зависит от города и уровня комфорта. В среднем от 250₽ до 2000₽ за 2 часа. Точную цену уточняйте у владельца объекта."
        }
      },
      {
        "@type": "Question",
        "name": "В каких городах доступна почасовая аренда?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Почасовая аренда доступна более чем в 50 городах России: ${cities.slice(0, 5).join(', ')} и других крупных городах.`
        }
      },
      {
        "@type": "Question",
        "name": "Нужна ли предоплата при бронировании?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Условия оплаты определяет владелец объекта. Обычно оплата производится при заселении наличными или картой. Некоторые объекты могут запрашивать предоплату."
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      {listings.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(itemListSchema)}
        </script>
      )}
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
};

export default SEOStructuredData;