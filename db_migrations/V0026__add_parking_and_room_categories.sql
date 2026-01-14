-- Добавляем поля для паркинга в listings
ALTER TABLE t_p39732784_hourly_rentals_platf.listings 
ADD COLUMN IF NOT EXISTS parking_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS parking_price_per_hour INTEGER;

-- Создаём таблицу для категорий номеров
CREATE TABLE IF NOT EXISTS t_p39732784_hourly_rentals_platf.room_categories (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES t_p39732784_hourly_rentals_platf.listings(id),
    name VARCHAR(255) NOT NULL,
    price_per_hour INTEGER NOT NULL,
    square_meters INTEGER,
    features TEXT[],
    image_urls TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для быстрого поиска категорий по объекту
CREATE INDEX IF NOT EXISTS idx_room_categories_listing_id ON t_p39732784_hourly_rentals_platf.room_categories(listing_id);

-- Комментарии для документации
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.listings.parking_type IS 'Тип паркинга: free, paid, street, none';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.listings.parking_price_per_hour IS 'Стоимость паркинга в час (если paid)';
COMMENT ON TABLE t_p39732784_hourly_rentals_platf.room_categories IS 'Категории номеров для каждого объекта (отеля/апартаментов)';