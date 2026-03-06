UPDATE t_p39732784_hourly_rentals_platf.listings
SET subscription_expires_at = NOW() + INTERVAL '60 days'
WHERE 
  (moderation_status = 'pending' AND is_archived = false)
  OR (is_archived = true AND moderation_status = 'approved' AND subscription_expires_at < NOW());