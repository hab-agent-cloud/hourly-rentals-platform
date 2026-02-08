-- Таблица для отслеживания начисленных бонусов за достижения
CREATE TABLE IF NOT EXISTS t_p39732784_hourly_rentals_platf.achievement_bonuses (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL,
    achievement_id VARCHAR(100) NOT NULL,
    amount INTEGER NOT NULL DEFAULT 1000,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(admin_id, achievement_id)
);

CREATE INDEX IF NOT EXISTS idx_achievement_bonuses_admin ON t_p39732784_hourly_rentals_platf.achievement_bonuses(admin_id);

COMMENT ON TABLE t_p39732784_hourly_rentals_platf.achievement_bonuses IS 'Начисленные бонусы за достижения менеджеров';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.achievement_bonuses.achievement_id IS 'ID достижения (first_object, ten_objects и т.д.)';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.achievement_bonuses.amount IS 'Сумма бонуса в рублях';
