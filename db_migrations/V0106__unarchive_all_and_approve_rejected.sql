UPDATE t_p39732784_hourly_rentals_platf.listings
SET is_archived = false
WHERE is_archived = true;

UPDATE t_p39732784_hourly_rentals_platf.listings
SET moderation_status = 'approved'
WHERE moderation_status = 'rejected';