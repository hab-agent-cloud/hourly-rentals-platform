-- Добавление поля description для описания объекта (до 1000 слов)
ALTER TABLE t_p39732784_hourly_rentals_platf.listings 
ADD COLUMN description TEXT;