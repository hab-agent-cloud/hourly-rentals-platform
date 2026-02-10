/**
 * Яндекс.Метрика - утилиты для отслеживания событий
 */

declare global {
  interface Window {
    ym?: (
      counterId: number,
      method: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...args: any[]
    ) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataLayer?: any[];
  }
}

const COUNTER_ID = 106765381;

/**
 * Отслеживание целей Яндекс.Метрики
 */
export const metrika = {
  /**
   * Достижение цели
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reachGoal: (goal: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.ym) {
      window.ym(COUNTER_ID, 'reachGoal', goal, params);
      console.log('📊 Metrika Goal:', goal, params);
    }
  },

  /**
   * Клик на "Позвонить"
   */
  trackPhoneClick: (phone: string, listingId?: number, listingTitle?: string) => {
    metrika.reachGoal('phone_click', {
      phone,
      listing_id: listingId,
      listing_title: listingTitle,
    });
  },

  /**
   * Клик на "Забронировать" / "Связаться с владельцем"
   */
  trackBookingClick: (listingId: number, listingTitle: string, price?: number) => {
    metrika.reachGoal('booking_click', {
      listing_id: listingId,
      listing_title: listingTitle,
      price,
    });
  },

  /**
   * Просмотр карточки объекта
   */
  trackListingView: (listingId: number, listingTitle: string, city: string, price?: number) => {
    metrika.reachGoal('listing_view', {
      listing_id: listingId,
      listing_title: listingTitle,
      city,
      price,
    });
  },

  /**
   * Использование поиска
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trackSearch: (query: string, city?: string, filters?: Record<string, any>) => {
    metrika.reachGoal('search', {
      query,
      city,
      filters,
    });
  },

  /**
   * Применение фильтров
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trackFilterUse: (filterType: string, filterValue: any) => {
    metrika.reachGoal('filter_use', {
      filter_type: filterType,
      filter_value: filterValue,
    });
  },

  /**
   * Клик на город в популярных городах
   */
  trackCityClick: (cityName: string) => {
    metrika.reachGoal('city_click', {
      city: cityName,
    });
  },

  /**
   * Клик на WhatsApp
   */
  trackWhatsAppClick: (listingId?: number) => {
    metrika.reachGoal('whatsapp_click', {
      listing_id: listingId,
    });
  },

  /**
   * Клик на Telegram
   */
  trackTelegramClick: (listingId?: number) => {
    metrika.reachGoal('telegram_click', {
      listing_id: listingId,
    });
  },

  /**
   * Отправка формы
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trackFormSubmit: (formName: string, data?: Record<string, any>) => {
    metrika.reachGoal('form_submit', {
      form_name: formName,
      ...data,
    });
  },

  /**
   * Электронная коммерция - просмотр товара (объекта)
   */
  ecommerceDetail: (listing: {
    id: number;
    name: string;
    price: number;
    category: string;
    brand?: string;
  }) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        ecommerce: {
          detail: {
            products: [
              {
                id: listing.id.toString(),
                name: listing.name,
                price: listing.price,
                category: listing.category,
                brand: listing.brand || '120 МИНУТ',
              },
            ],
          },
        },
      });
      console.log('📊 Ecommerce Detail:', listing);
    }
  },

  /**
   * Электронная коммерция - добавление в корзину (начало бронирования)
   */
  ecommerceAdd: (listing: {
    id: number;
    name: string;
    price: number;
    category: string;
    quantity?: number;
  }) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        ecommerce: {
          add: {
            products: [
              {
                id: listing.id.toString(),
                name: listing.name,
                price: listing.price,
                category: listing.category,
                quantity: listing.quantity || 1,
              },
            ],
          },
        },
      });
      console.log('📊 Ecommerce Add:', listing);
    }
  },

  /**
   * Электронная коммерция - покупка (завершение бронирования)
   */
  ecommercePurchase: (order: {
    id: string;
    revenue: number;
    products: Array<{
      id: number;
      name: string;
      price: number;
      quantity: number;
      category: string;
    }>;
  }) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        ecommerce: {
          purchase: {
            actionField: {
              id: order.id,
              revenue: order.revenue,
            },
            products: order.products.map((p) => ({
              id: p.id.toString(),
              name: p.name,
              price: p.price,
              quantity: p.quantity,
              category: p.category,
            })),
          },
        },
      });
      console.log('📊 Ecommerce Purchase:', order);
    }
  },

  /**
   * Отслеживание внешних ссылок
   */
  trackOutboundLink: (url: string) => {
    metrika.reachGoal('outbound_link', {
      url,
    });
  },

  /**
   * Отслеживание установки PWA
   */
  trackPWAInstall: () => {
    metrika.reachGoal('pwa_install');
  },

  /**
   * Отслеживание времени на странице
   */
  trackTimeOnPage: (seconds: number, page: string) => {
    if (seconds >= 30) {
      metrika.reachGoal('time_on_page_30s', {
        page,
        seconds,
      });
    }
    if (seconds >= 60) {
      metrika.reachGoal('time_on_page_60s', {
        page,
        seconds,
      });
    }
  },

  /**
   * Отслеживание скролла (достижение 50%, 75%, 100%)
   */
  trackScroll: (percent: number, page: string) => {
    if (percent >= 50 && percent < 75) {
      metrika.reachGoal('scroll_50', { page });
    } else if (percent >= 75 && percent < 100) {
      metrika.reachGoal('scroll_75', { page });
    } else if (percent >= 100) {
      metrika.reachGoal('scroll_100', { page });
    }
  },
};

/**
 * Хук для React Router - отслеживание переходов между страницами SPA
 */
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(COUNTER_ID, 'hit', url, {
      title: title || document.title,
    });
    console.log('📊 Page View:', url, title);
  }
};

// Инициализация dataLayer для электронной коммерции
if (typeof window !== 'undefined' && !window.dataLayer) {
  window.dataLayer = [];
}