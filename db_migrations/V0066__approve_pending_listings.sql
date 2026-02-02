-- Одобрить все объекты со статусом pending (их добавили владельцы с активными подписками)
UPDATE t_p39732784_hourly_rentals_platf.listings 
SET moderation_status = 'approved' 
WHERE moderation_status = 'pending' 
  AND status = 'active' 
  AND is_archived = false;