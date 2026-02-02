-- Таблица заявок на вывод средств
CREATE TABLE IF NOT EXISTS withdrawal_requests (
    id SERIAL PRIMARY KEY,
    manager_id INTEGER NOT NULL REFERENCES admins(id),
    amount NUMERIC(10, 2) NOT NULL,
    withdrawal_method VARCHAR(20) NOT NULL CHECK (withdrawal_method IN ('sbp', 'card', 'salary')),
    
    -- Данные для СБП
    phone VARCHAR(20),
    
    -- Данные для карты
    card_number VARCHAR(20),
    recipient_name VARCHAR(255),
    bank_name VARCHAR(255),
    
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
    
    -- Для бухгалтера
    processed_by INTEGER REFERENCES admins(id),
    processed_at TIMESTAMP,
    paid_amount NUMERIC(10, 2),
    payment_note TEXT,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Индексы
CREATE INDEX idx_withdrawal_requests_manager_id ON withdrawal_requests(manager_id);
CREATE INDEX idx_withdrawal_requests_status ON withdrawal_requests(status);
CREATE INDEX idx_withdrawal_requests_created_at ON withdrawal_requests(created_at DESC);

-- История выплат (для удобного отображения)
CREATE TABLE IF NOT EXISTS payment_history (
    id SERIAL PRIMARY KEY,
    withdrawal_request_id INTEGER REFERENCES withdrawal_requests(id),
    manager_id INTEGER NOT NULL REFERENCES admins(id),
    requested_amount NUMERIC(10, 2) NOT NULL,
    paid_amount NUMERIC(10, 2) NOT NULL,
    withdrawal_method VARCHAR(20) NOT NULL,
    processed_by INTEGER REFERENCES admins(id),
    processed_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для истории
CREATE INDEX idx_payment_history_manager_id ON payment_history(manager_id);
CREATE INDEX idx_payment_history_processed_at ON payment_history(processed_at DESC);

COMMENT ON TABLE withdrawal_requests IS 'Заявки на вывод средств от менеджеров';
COMMENT ON TABLE payment_history IS 'История выплат менеджерам';
