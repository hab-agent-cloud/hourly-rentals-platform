-- Установка правильной комиссии 20% для всех менеджеров
UPDATE t_p39732784_hourly_rentals_platf.admins 
SET commission_percent = 20
WHERE role = 'manager';