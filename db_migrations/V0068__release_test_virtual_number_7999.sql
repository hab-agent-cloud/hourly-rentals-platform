-- Освобождение тестового номера 7999 от привязки к объектам
UPDATE t_p39732784_hourly_rentals_platf.virtual_numbers 
SET is_busy = false, 
    assigned_listing_id = NULL, 
    assigned_at = NULL, 
    assigned_until = NULL
WHERE phone = '+79991234567';