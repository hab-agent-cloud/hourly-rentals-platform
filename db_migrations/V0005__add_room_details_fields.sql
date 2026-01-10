-- Добавляем новые поля для категорий номеров
ALTER TABLE rooms 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS square_meters INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS min_hours INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS payment_methods TEXT DEFAULT 'Наличные, банковская карта при заселении',
ADD COLUMN IF NOT EXISTS cancellation_policy TEXT DEFAULT 'Бесплатная отмена за 1 час до заселения';

-- Переносим image_url в массив images для существующих записей
UPDATE rooms 
SET images = ARRAY[image_url]
WHERE image_url IS NOT NULL AND image_url != '' AND (images IS NULL OR array_length(images, 1) IS NULL);