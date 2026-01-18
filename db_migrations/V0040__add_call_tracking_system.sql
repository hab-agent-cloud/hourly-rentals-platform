-- Таблица виртуальных номеров (пул из 15 номеров)
CREATE TABLE IF NOT EXISTS virtual_numbers (
    id SERIAL PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    is_busy BOOLEAN DEFAULT FALSE,
    assigned_listing_id INTEGER REFERENCES listings(id),
    assigned_at TIMESTAMP,
    assigned_until TIMESTAMP
);

-- Таблица отслеживания звонков
CREATE TABLE IF NOT EXISTS call_tracking (
    id SERIAL PRIMARY KEY,
    virtual_number TEXT NOT NULL,
    listing_id INTEGER REFERENCES listings(id),
    client_phone TEXT,
    shown_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    called_at TIMESTAMP
);

-- Добавляем поле short_title для IVR в существующую таблицу listings
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS short_title TEXT;

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_call_tracking_client ON call_tracking(client_phone, virtual_number);
CREATE INDEX IF NOT EXISTS idx_call_tracking_listing ON call_tracking(listing_id);
CREATE INDEX IF NOT EXISTS idx_virtual_numbers_busy ON virtual_numbers(is_busy);

-- Генерируем short_title для существующих объектов
UPDATE listings 
SET short_title = type || ' ' || city || ', ' || square_meters || 'м²'
WHERE short_title IS NULL AND square_meters IS NOT NULL;

UPDATE listings 
SET short_title = type || ' ' || city
WHERE short_title IS NULL;

-- Комментарии
COMMENT ON TABLE virtual_numbers IS 'Пул виртуальных номеров для подмены (15 шт)';
COMMENT ON TABLE call_tracking IS 'История показов номеров клиентам для маршрутизации звонков';
COMMENT ON COLUMN listings.short_title IS 'Короткое название для IVR (например: Двухкомнатная Москва, 50м²)';