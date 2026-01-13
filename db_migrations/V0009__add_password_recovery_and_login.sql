-- Добавление таблицы для токенов восстановления пароля
CREATE TABLE IF NOT EXISTS password_recovery_tokens (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES owners(id),
    token VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_recovery_tokens_owner ON password_recovery_tokens(owner_id);
CREATE INDEX IF NOT EXISTS idx_recovery_tokens_token ON password_recovery_tokens(token);
CREATE INDEX IF NOT EXISTS idx_recovery_tokens_expires ON password_recovery_tokens(expires_at);

-- Добавление колонки login для владельцев (опционально, для входа по логину)
ALTER TABLE owners ADD COLUMN IF NOT EXISTS login VARCHAR(100) UNIQUE;

-- Индексы для поиска по email и phone
CREATE INDEX IF NOT EXISTS idx_owners_email ON owners(email);
CREATE INDEX IF NOT EXISTS idx_owners_phone ON owners(phone);