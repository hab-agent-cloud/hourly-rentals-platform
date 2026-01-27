-- Создаем таблицу для пакетов продвижения
CREATE TABLE IF NOT EXISTS t_p39732784_hourly_rentals_platf.promotion_packages (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES t_p39732784_hourly_rentals_platf.listings(id),
    owner_id INTEGER NOT NULL REFERENCES t_p39732784_hourly_rentals_platf.owners(id),
    city VARCHAR(100) NOT NULL,
    package_type VARCHAR(20) NOT NULL CHECK (package_type IN ('bronze', 'silver', 'gold')),
    price_paid INTEGER NOT NULL,
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_promotion_packages_listing_id ON t_p39732784_hourly_rentals_platf.promotion_packages(listing_id);
CREATE INDEX IF NOT EXISTS idx_promotion_packages_owner_id ON t_p39732784_hourly_rentals_platf.promotion_packages(owner_id);
CREATE INDEX IF NOT EXISTS idx_promotion_packages_city ON t_p39732784_hourly_rentals_platf.promotion_packages(city);
CREATE INDEX IF NOT EXISTS idx_promotion_packages_active ON t_p39732784_hourly_rentals_platf.promotion_packages(is_active, end_date);

COMMENT ON TABLE t_p39732784_hourly_rentals_platf.promotion_packages IS 'Пакеты продвижения: Бронза (20-50), Серебро (10-40), Золото (1-30)';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.promotion_packages.package_type IS 'bronze: 3000₽ (20-50 места), silver: 5000₽ (10-40 места), gold: 7000₽ (1-30 места)';
