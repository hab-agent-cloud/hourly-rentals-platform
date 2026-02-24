-- Добавляем тип 'bureau' (квартирное бюро) как допустимое значение
-- CHECK constraint на listings.type не найден, просто будем использовать 'bureau'

-- Таблица разблокировок лимита номеров для владельцев
CREATE TABLE IF NOT EXISTS t_p39732784_hourly_rentals_platf.owner_room_unlocks (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES t_p39732784_hourly_rentals_platf.owners(id),
    unlock_level INTEGER NOT NULL, -- 10 или 20 (максимальное количество номеров)
    price_paid INTEGER NOT NULL,   -- 10000 или 15000 рублей
    payment_method VARCHAR(50) DEFAULT 'balance', -- 'balance' | 'manual'
    created_by VARCHAR(50) DEFAULT 'owner', -- 'owner' | 'superadmin' | 'manager'
    created_by_user_id INTEGER REFERENCES t_p39732784_hourly_rentals_platf.admins(id),
    created_at TIMESTAMP DEFAULT NOW(),
    notes TEXT
);

-- Индекс для быстрого поиска по owner_id
CREATE INDEX IF NOT EXISTS idx_owner_room_unlocks_owner_id 
    ON t_p39732784_hourly_rentals_platf.owner_room_unlocks(owner_id);

-- Добавляем комментарии
COMMENT ON TABLE t_p39732784_hourly_rentals_platf.owner_room_unlocks IS 
    'Разовые разблокировки лимита номеров: до 10 за 10000₽, до 20 за 15000₽';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.owner_room_unlocks.unlock_level IS 
    'Новый максимум номеров: 10 или 20';
