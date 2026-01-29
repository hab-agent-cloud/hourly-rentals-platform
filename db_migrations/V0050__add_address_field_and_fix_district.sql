-- Добавляем поле address для полного адреса
ALTER TABLE t_p39732784_hourly_rentals_platf.listings 
ADD COLUMN address VARCHAR(255);

-- Копируем текущие значения district в address
UPDATE t_p39732784_hourly_rentals_platf.listings 
SET address = district;

-- Теперь district будет использоваться для района (если нет метро)
-- Можно вручно заполнить районы позже или оставить адреса временно
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.listings.address IS 'Полный адрес объекта';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.listings.district IS 'Район города (для объектов без метро)';