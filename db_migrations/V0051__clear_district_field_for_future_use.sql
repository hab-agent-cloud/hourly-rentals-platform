-- Очищаем поле district для дальнейшего использования под районы
-- Сейчас оставляем пустым - районы будут заполняться для объектов без метро
UPDATE t_p39732784_hourly_rentals_platf.listings 
SET district = '';

-- Для объектов в Екатеринбурге - извлекаем район из address
UPDATE t_p39732784_hourly_rentals_platf.listings 
SET district = 'Ленинский'
WHERE city = 'Екатеринбург' AND address LIKE 'Ленинский,%';

UPDATE t_p39732784_hourly_rentals_platf.listings 
SET district = 'Центральный'
WHERE city = 'Екатеринбург' AND address LIKE 'Центральный,%';

COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.listings.district IS 'Район города - показывается, если нет станций метро';