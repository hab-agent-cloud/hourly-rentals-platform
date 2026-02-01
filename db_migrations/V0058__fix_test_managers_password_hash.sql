-- Обновляем пароль для существующих тестовых менеджеров
-- Пароль "test123" -> SHA256: ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae

UPDATE admins 
SET password_hash = 'ecd71870d1963316a97e3ac3408c9835ad8cf0f3c1bc703527c30265534f75ae'
WHERE email IN ('manager@120min.ru', 'om@120min.ru', 'um@120min.ru');