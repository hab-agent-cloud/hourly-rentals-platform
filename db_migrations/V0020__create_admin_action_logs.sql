-- Создание таблицы для логирования действий сотрудников
CREATE TABLE IF NOT EXISTS t_p39732784_hourly_rentals_platf.admin_action_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER,
    entity_name TEXT,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_admin_action_logs_admin_id ON t_p39732784_hourly_rentals_platf.admin_action_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_action_logs_created_at ON t_p39732784_hourly_rentals_platf.admin_action_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_action_logs_action_type ON t_p39732784_hourly_rentals_platf.admin_action_logs(action_type);