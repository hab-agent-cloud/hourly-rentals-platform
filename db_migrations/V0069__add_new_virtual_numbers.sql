-- Добавление новых подменных номеров
INSERT INTO t_p39732784_hourly_rentals_platf.virtual_numbers (phone, is_busy, assigned_listing_id, assigned_at, assigned_until)
VALUES 
  ('+79346621457', false, NULL, NULL, NULL),
  ('+79346650631', false, NULL, NULL, NULL),
  ('+79846696782', false, NULL, NULL, NULL),
  ('+79346613384', false, NULL, NULL, NULL);

-- Удаление тестового номера из пула (оставляем только реальные)
UPDATE t_p39732784_hourly_rentals_platf.virtual_numbers 
SET is_busy = false, 
    assigned_listing_id = NULL, 
    assigned_at = NULL, 
    assigned_until = NULL
WHERE phone = '+79991234567';