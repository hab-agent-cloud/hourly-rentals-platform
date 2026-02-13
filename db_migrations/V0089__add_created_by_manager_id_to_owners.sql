ALTER TABLE t_p39732784_hourly_rentals_platf.owners 
ADD COLUMN IF NOT EXISTS created_by_manager_id INTEGER REFERENCES t_p39732784_hourly_rentals_platf.admins(id);