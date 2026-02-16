CREATE TABLE IF NOT EXISTS t_p39732784_hourly_rentals_platf.employee_payout_history (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER NOT NULL REFERENCES t_p39732784_hourly_rentals_platf.admins(id),
    amount NUMERIC(10, 2) NOT NULL,
    paid_by_admin_id INTEGER REFERENCES t_p39732784_hourly_rentals_platf.admins(id),
    bonuses_closed INTEGER NOT NULL DEFAULT 0,
    note TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_employee_payout_history_admin_id 
ON t_p39732784_hourly_rentals_platf.employee_payout_history(admin_id);

CREATE INDEX IF NOT EXISTS idx_employee_payout_history_created_at 
ON t_p39732784_hourly_rentals_platf.employee_payout_history(created_at DESC);