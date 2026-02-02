-- Обновление процентов комиссий для всех ролей
-- Менеджер: 20%, ОМ: 7%, УМ: 3%

-- Обновляем комиссии для менеджеров
UPDATE t_p39732784_hourly_rentals_platf.admins
SET commission_percent = 20
WHERE role = 'manager';

-- Обновляем комиссии для оперативных менеджеров
UPDATE t_p39732784_hourly_rentals_platf.admins
SET commission_percent = 7
WHERE role = 'operational_manager';

-- Обновляем комиссии для управляющих менеджеров
UPDATE t_p39732784_hourly_rentals_platf.admins
SET commission_percent = 3
WHERE role = 'chief_manager';

COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.admins.commission_percent IS 'Процент комиссии: Менеджер 20%, ОМ 7%, УМ 3%';
