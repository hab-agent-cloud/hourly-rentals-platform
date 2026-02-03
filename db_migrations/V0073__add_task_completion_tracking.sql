-- Добавление полей для отслеживания выполнения задач
ALTER TABLE t_p39732784_hourly_rentals_platf.manager_tasks 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS completed_by INTEGER REFERENCES t_p39732784_hourly_rentals_platf.admins(id),
ADD COLUMN IF NOT EXISTS is_overdue BOOLEAN DEFAULT FALSE;