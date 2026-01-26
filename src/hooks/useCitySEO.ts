import { useEffect } from 'react';
import { City } from '@/data/citiesData';

export function useCitySEO(city: City | null, citySlug: string | undefined) {
  useEffect(() => {
    if (city && citySlug) {
      document.title = `Почасовая аренда отелей в ${city.name} от 2 часов | 120 МИНУТ`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', city.description);
      }
      
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', city.keywords);
      }

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `Почасовая аренда отелей в ${city.name} от 2 часов | 120 МИНУТ`);
      }

      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', city.description);
      }

      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) {
        ogUrl.setAttribute('content', `https://120minut.ru/city/${citySlug}`);
      }

      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute('href', `https://120minut.ru/city/${citySlug}`);
      }

      const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
      existingSchemas.forEach(schema => {
        if (schema.textContent?.includes('BreadcrumbList') || schema.textContent?.includes('FAQPage')) {
          schema.remove();
        }
      });

      const breadcrumbSchema = document.createElement('script');
      breadcrumbSchema.type = 'application/ld+json';
      breadcrumbSchema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Главная',
            'item': 'https://120minut.ru/'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': city.name,
            'item': `https://120minut.ru/city/${citySlug}`
          }
        ]
      });
      document.head.appendChild(breadcrumbSchema);

      const faqSchema = document.createElement('script');
      faqSchema.type = 'application/ld+json';
      faqSchema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': `Какой минимальный срок аренды номера в ${city.name}?`,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': `Минимальный срок аренды номера в ${city.name} обычно составляет 2 часа, но может варьироваться в зависимости от конкретного отеля.`
            }
          },
          {
            '@type': 'Question',
            'name': `Нужно ли бронировать номер заранее в ${city.name}?`,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': `Рекомендуем связаться с владельцем заранее для уточнения наличия свободных номеров, особенно в выходные и праздничные дни.`
            }
          },
          {
            '@type': 'Question',
            'name': `Как происходит оплата почасовой аренды в ${city.name}?`,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': `Оплата производится напрямую владельцу удобным для вас способом — наличные, банковская карта или банковский перевод. Никаких комиссий со стороны платформы.`
            }
          },
          {
            '@type': 'Question',
            'name': `Сколько стоит аренда номера на 2 часа в ${city.name}?`,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': `${city.features[1]} в зависимости от уровня комфорта и расположения отеля.`
            }
          }
        ]
      });
      document.head.appendChild(faqSchema);

      const localBusinessSchema = document.createElement('script');
      localBusinessSchema.type = 'application/ld+json';
      localBusinessSchema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        'name': `120 МИНУТ — Почасовая аренда в ${city.name}`,
        'description': city.description,
        'url': `https://120minut.ru/city/${citySlug}`,
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': city.name,
          'addressRegion': city.region,
          'addressCountry': 'RU'
        },
        'priceRange': city.features[1],
        'openingHours': 'Mo-Su 00:00-23:59',
        'geo': {
          '@type': 'GeoCoordinates',
          'addressLocality': city.name
        }
      });
      document.head.appendChild(localBusinessSchema);
    }
  }, [city, citySlug]);
}
