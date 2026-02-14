-- Возвращаем created_by_owner = FALSE для "сиротских" объектов
-- Эти объекты не были созданы через публичную форму, поэтому должны модерироваться как объекты от сотрудников

UPDATE t_p39732784_hourly_rentals_platf.listings
SET created_by_owner = FALSE
WHERE moderation_status = 'pending' 
  AND owner_id IS NULL
  AND (created_by_employee_id IS NULL OR created_by_employee_id = 0);
