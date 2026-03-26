UPDATE t_p39732784_hourly_rentals_platf.listings
SET subscription_expires_at = NOW() + INTERVAL '90 days';

UPDATE t_p39732784_hourly_rentals_platf.listings
SET moderation_status = 'approved'
WHERE moderation_status = 'pending';