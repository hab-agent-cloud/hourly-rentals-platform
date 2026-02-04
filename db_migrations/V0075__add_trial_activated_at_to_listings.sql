-- Добавляем поле trial_activated_at для отслеживания активации пробной подписки
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS trial_activated_at TIMESTAMP;

COMMENT ON COLUMN listings.trial_activated_at IS 'Дата и время активации пробной подписки на 14 дней';
