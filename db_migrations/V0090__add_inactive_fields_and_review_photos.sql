
ALTER TABLE t_p39732784_hourly_rentals_platf.listings
ADD COLUMN IF NOT EXISTS inactive_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS inactive_reason TEXT,
ADD COLUMN IF NOT EXISTS has_reviews BOOLEAN DEFAULT false;

ALTER TABLE t_p39732784_hourly_rentals_platf.reviews
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS source_url TEXT,
ADD COLUMN IF NOT EXISTS source_site TEXT,
ADD COLUMN IF NOT EXISTS added_by_manager_id INTEGER REFERENCES t_p39732784_hourly_rentals_platf.admins(id);
