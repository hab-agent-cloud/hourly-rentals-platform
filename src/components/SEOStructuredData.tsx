import { Helmet } from 'react-helmet-async';

interface SEOStructuredDataProps {
  listings?: any[];
  cities?: string[];
}

const SEOStructuredData = ({ listings = [], cities = [] }: SEOStructuredDataProps) => {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": listings.slice(0, 10).map((listing, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Hotel",
        "name": listing.title,
        "description": listing.description || `Почасовая аренда номеров в ${listing.city}`,
        "image": listing.image_url,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": listing.city,
          "addressRegion": listing.district,
          "addressCountry": "RU"
        },
        "url": `https://120minut.ru/listing/${listing.id}`,
        "priceRange": "$$"
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