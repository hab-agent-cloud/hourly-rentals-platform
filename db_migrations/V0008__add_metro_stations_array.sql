-- Изменяем структуру для поддержки нескольких станций метро
-- Создаем новую таблицу для хранения станций метро с временем пешком
CREATE TABLE IF NOT EXISTS metro_stations (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES listings(id),
    station_name VARCHAR(255) NOT NULL,
    walk_minutes INTEGER NOT NULL DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем индекс для быстрого поиска по listing_id
CREATE INDEX idx_metro_stations_listing_id ON metro_stations(listing_id);

-- Мигрируем существующие данные из старых полей metro и metro_walk
INSERT INTO metro_stations (listing_id, station_name, walk_minutes)
SELECT id, metro, COALESCE(metro_walk, 5)
FROM listings
WHERE metro IS NOT NULL AND metro != '';

-- Комментарий для будущих разработчиков
COMMENT ON TABLE metro_stations IS 'Таблица станций метро для каждого объекта (поддержка нескольких станций)';
COMMENT ON COLUMN metro_stations.walk_minutes IS 'Время пешком до станции в минутах';