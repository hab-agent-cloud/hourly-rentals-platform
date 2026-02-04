-- Создаём таблицу для сообщений между владельцами и менеджерами
CREATE TABLE IF NOT EXISTS owner_manager_messages (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    manager_id INTEGER NOT NULL,
    listing_id INTEGER,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('owner', 'manager')),
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_owner_id ON owner_manager_messages(owner_id);
CREATE INDEX IF NOT EXISTS idx_messages_manager_id ON owner_manager_messages(manager_id);
CREATE INDEX IF NOT EXISTS idx_messages_listing_id ON owner_manager_messages(listing_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON owner_manager_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON owner_manager_messages(created_at DESC);

COMMENT ON TABLE owner_manager_messages IS 'Сообщения между владельцами и их личными менеджерами';
COMMENT ON COLUMN owner_manager_messages.sender_type IS 'Тип отправителя: owner (владелец) или manager (менеджер)';
COMMENT ON COLUMN owner_manager_messages.is_read IS 'Прочитано ли сообщение получателем';
