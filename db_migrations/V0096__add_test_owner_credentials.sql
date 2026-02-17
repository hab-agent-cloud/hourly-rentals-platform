-- Создаем тестового владельца с известными учетными данными
-- Логин: testowner
-- Пароль: password123
-- password_hash = SHA256('password123')

INSERT INTO owners 
(full_name, phone, email, telegram_name, username, password_hash, created_at, is_verified, balance, bonus_balance, trial_activated)
VALUES 
('Тестовый Владелец ОМА', '+79991111111', 'testowner@oma.test', '@testowner', 'testowner', 
 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 
 NOW(), true, 0, 100, false)
ON CONFLICT (email) DO UPDATE 
SET username = 'testowner', 
    password_hash = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
    full_name = 'Тестовый Владелец ОМА';
