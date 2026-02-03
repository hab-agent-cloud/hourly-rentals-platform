-- Создание таблицы для сообщений между сотрудниками
CREATE TABLE IF NOT EXISTS t_p39732784_hourly_rentals_platf.employee_messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES t_p39732784_hourly_rentals_platf.admins(id),
  recipient_id INTEGER REFERENCES t_p39732784_hourly_rentals_platf.admins(id),
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT FALSE,
  related_task_id INTEGER REFERENCES t_p39732784_hourly_rentals_platf.manager_tasks(id),
  message_type VARCHAR(50) DEFAULT 'regular',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_employee_messages_recipient ON t_p39732784_hourly_rentals_platf.employee_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_employee_messages_sender ON t_p39732784_hourly_rentals_platf.employee_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_employee_messages_task ON t_p39732784_hourly_rentals_platf.employee_messages(related_task_id);