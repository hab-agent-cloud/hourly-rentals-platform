-- Добавляем поля для паспортных данных и адресов в таблицу owners
ALTER TABLE t_p39732784_hourly_rentals_platf.owners 
ADD COLUMN IF NOT EXISTS passport_series VARCHAR(10),
ADD COLUMN IF NOT EXISTS passport_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS passport_issued_by TEXT,
ADD COLUMN IF NOT EXISTS passport_issued_date DATE,
ADD COLUMN IF NOT EXISTS registration_address TEXT,
ADD COLUMN IF NOT EXISTS actual_address TEXT,
ADD COLUMN IF NOT EXISTS inn VARCHAR(12),
ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;

-- Заполняем username для существующих владельцев (используем login если есть, иначе email)
UPDATE t_p39732784_hourly_rentals_platf.owners 
SET username = COALESCE(login, email)
WHERE username IS NULL;

COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.owners.username IS 'Уникальный логин для входа';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.owners.passport_series IS 'Серия паспорта';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.owners.passport_number IS 'Номер паспорта';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.owners.inn IS 'ИНН владельца';
