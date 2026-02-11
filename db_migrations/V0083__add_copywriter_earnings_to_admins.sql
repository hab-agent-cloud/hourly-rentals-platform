-- Добавляем поле для хранения выплат от копирайтера
ALTER TABLE t_p39732784_hourly_rentals_platf.admins 
ADD COLUMN IF NOT EXISTS copywriter_earnings NUMERIC(10,2) DEFAULT 0;

COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.admins.copywriter_earnings IS 'Выплаты от копирайтера для операторов/менеджеров';