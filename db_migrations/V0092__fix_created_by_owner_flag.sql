-- Исправляем флаг created_by_owner для объектов, созданных через публичную форму
-- Это объекты со статусом pending, у которых есть owner_id, но нет created_by_employee_id

UPDATE t_p39732784_hourly_rentals_platf.listings
SET created_by_owner = TRUE
WHERE moderation_status = 'pending' 
  AND owner_id IS NOT NULL
  AND (created_by_employee_id IS NULL OR created_by_employee_id = 0)
  AND (created_by_owner IS NULL OR created_by_owner = FALSE);
