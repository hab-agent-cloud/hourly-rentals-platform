-- Создаём тестового менеджера для проверки системы
INSERT INTO admins (email, password_hash, name, role, manager_level, object_limit, subscription_days_limit, commission_percent, balance)
VALUES 
  ('manager.test@120min.ru', '$2b$10$test.hash.placeholder', 'Тестовый Менеджер', 'manager', 'bronze', 50, 3, 7.0, 0),
  ('om.test@120min.ru', '$2b$10$test.hash.placeholder', 'Тестовый ОМ', 'operational_manager', 'bronze', 100, 7, 2.0, 0),
  ('um.test@120min.ru', '$2b$10$test.hash.placeholder', 'Тестовый УМ', 'chief_manager', 'bronze', 200, 10, 1.0, 0)
ON CONFLICT DO NOTHING;
