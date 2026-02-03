-- Добавление полей telegram_name и manager_comment в таблицу owners
ALTER TABLE t_p39732784_hourly_rentals_platf.owners 
ADD COLUMN IF NOT EXISTS telegram_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS manager_comment TEXT;