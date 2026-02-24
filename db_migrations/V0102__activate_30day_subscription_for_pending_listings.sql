UPDATE t_p39732784_hourly_rentals_platf.listings
SET 
  subscription_expires_at = NOW() + INTERVAL '30 days',
  subscription_auto_renew = false,
  updated_at = NOW()
WHERE 
  moderation_status = 'pending'
  AND (subscription_expires_at IS NULL OR subscription_expires_at < NOW())
  AND is_archived = false;