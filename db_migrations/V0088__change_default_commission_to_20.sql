-- Изменяем дефолтное значение комиссии с 7% на 20% для менеджеров
ALTER TABLE t_p39732784_hourly_rentals_platf.admins 
ALTER COLUMN commission_percent SET DEFAULT 20;