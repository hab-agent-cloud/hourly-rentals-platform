-- Помечаем "сиротские" объекты (без owner_id и без created_by_employee_id) как созданные владельцами
-- Это позволит им отображаться во вкладке "Заявки от посетителей"

UPDATE t_p39732784_hourly_rentals_platf.listings
SET created_by_owner = TRUE
WHERE moderation_status = 'pending' 
  AND owner_id IS NULL
  AND (created_by_employee_id IS NULL OR created_by_employee_id = 0)
  AND (created_by_owner IS NULL OR created_by_owner = FALSE);
