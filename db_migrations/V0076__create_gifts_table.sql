-- Создаём таблицу для подарков от менеджеров владельцам
CREATE TABLE IF NOT EXISTS gifts (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL,
    owner_id INTEGER NOT NULL,
    created_by_manager_id INTEGER,
    gift_type VARCHAR(50) NOT NULL DEFAULT 'subscription',
    gift_value INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    activated_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP,
    description TEXT
);

CREATE INDEX IF NOT EXISTS idx_gifts_owner_id ON gifts(owner_id);
CREATE INDEX IF NOT EXISTS idx_gifts_listing_id ON gifts(listing_id);
CREATE INDEX IF NOT EXISTS idx_gifts_status ON gifts(status);

COMMENT ON TABLE gifts IS 'Подарки от менеджеров владельцам объектов';
COMMENT ON COLUMN gifts.gift_type IS 'Тип подарка: subscription (подписка), другие типы в будущем';
COMMENT ON COLUMN gifts.gift_value IS 'Значение подарка: для subscription - количество дней';
COMMENT ON COLUMN gifts.status IS 'Статус: pending (ожидает), activated (активирован), expired (истёк)';
