-- Обновление данных администратора
UPDATE admins 
SET email = 'hab-agent@mail.ru', 
    password_hash = '3Dyzaape29938172',
    name = 'Главный администратор'
WHERE email = 'admin@120min.ru';

-- Если администратора не существует, создаём нового
INSERT INTO admins (email, password_hash, name) 
VALUES ('hab-agent@mail.ru', '3Dyzaape29938172', 'Главный администратор')
ON CONFLICT (email) DO UPDATE 
SET password_hash = '3Dyzaape29938172';
