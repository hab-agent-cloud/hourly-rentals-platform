-- Перевести все отклонённые объекты в архив
UPDATE t_p39732784_hourly_rentals_platf.listings 
SET is_archived = true 
WHERE moderation_status = 'rejected' AND is_archived = false;