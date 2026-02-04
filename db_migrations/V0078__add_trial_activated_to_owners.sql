-- Добавляем поле для отслеживания активации пробной подписки
ALTER TABLE t_p39732784_hourly_rentals_platf.owners 
ADD COLUMN trial_activated BOOLEAN DEFAULT false;

COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.owners.trial_activated IS 'Флаг активации пробной подписки на 14 дней (одноразовая акция)';