-- Таблица для начисления и выплаты бонусов сотрудникам
CREATE TABLE IF NOT EXISTS t_p39732784_hourly_rentals_platf.employee_bonuses (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES t_p39732784_hourly_rentals_platf.admins(id),
    entity_type VARCHAR(50) NOT NULL,
    entity_id INTEGER NOT NULL,
    entity_name TEXT NOT NULL,
    bonus_amount DECIMAL(10, 2) NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    paid_at TIMESTAMP,
    paid_by_admin_id INTEGER REFERENCES t_p39732784_hourly_rentals_platf.admins(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_employee_bonuses_admin_id ON t_p39732784_hourly_rentals_platf.employee_bonuses(admin_id);
CREATE INDEX IF NOT EXISTS idx_employee_bonuses_is_paid ON t_p39732784_hourly_rentals_platf.employee_bonuses(is_paid);
CREATE INDEX IF NOT EXISTS idx_employee_bonuses_created_at ON t_p39732784_hourly_rentals_platf.employee_bonuses(created_at DESC);