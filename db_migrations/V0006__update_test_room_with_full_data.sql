-- Обновляем существующую комнату с полными данными для тестирования
UPDATE rooms 
SET 
  images = ARRAY[
    'https://cdn.poehali.dev/projects/1a35ca30-983f-4a91-b0b4-3c6fa1c9a65b/bucket/listings/bbca314b-8e15-4ff8-8f6d-38d75e699e5a.jpeg',
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'
  ],
  square_meters = 25,
  features = ARRAY['WiFi', 'Двуспальная кровать', 'Смарт ТВ', 'Кондиционер', 'Душевая кабина', 'Фен', 'Холодильник', 'Чайник'],
  min_hours = 2,
  payment_methods = 'Наличные, банковская карта при заселении',
  cancellation_policy = 'Бесплатная отмена за 1 час до заселения',
  description = 'Комфортный номер с современным дизайном и всеми необходимыми удобствами для приятного отдыха'
WHERE listing_id = 1;