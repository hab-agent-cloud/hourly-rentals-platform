-- Добавляем колонку token для хранения токенов авторизации владельцев
ALTER TABLE t_p39732784_hourly_rentals_platf.owners 
ADD COLUMN IF NOT EXISTS token VARCHAR(255);