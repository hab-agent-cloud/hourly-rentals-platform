-- Добавление поля phone для входа по телефону
ALTER TABLE t_p39732784_hourly_rentals_platf.admins 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);