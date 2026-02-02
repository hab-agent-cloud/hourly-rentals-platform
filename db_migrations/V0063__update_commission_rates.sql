-- Обновление процентов комиссий для всех ролей
-- Менеджер: 15%, ОМ: 5%, УМ: 2%

-- Обновляем комиссии для менеджеров
UPDATE t_p39732784_hourly_rentals_platf.admins
SET commission_percent = 15
WHERE role = 'manager' AND commission_percent != 15;

-- Обновляем комиссии для оперативных менеджеров
UPDATE t_p39732784_hourly_rentals_platf.admins
SET commission_percent = 5
WHERE role = 'operational_manager' AND commission_percent != 5;

-- Обновляем комиссии для управляющих менеджеров
UPDATE t_p39732784_hourly_rentals_platf.admins
SET commission_percent = 2
WHERE role = 'chief_manager' AND commission_percent != 2;

COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.admins.commission_percent IS 'Процент комиссии: Менеджер 15%, ОМ 5%, УМ 2%';