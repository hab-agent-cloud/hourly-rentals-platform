-- Обновление пароля администратора на SHA-256 хеш
UPDATE t_p39732784_hourly_rentals_platf.admins 
SET password_hash = encode(sha256('3Dyzaape29938172'::bytea), 'hex')
WHERE login = 'admin' OR email = 'hab-agent@mail.ru';

-- Также обновим остальные пароли, которые не захешированы
UPDATE t_p39732784_hourly_rentals_platf.admins 
SET password_hash = encode(sha256(password_hash::bytea), 'hex')
WHERE login IN ('89111452792', '89261781426', '89636667256') 
  AND LENGTH(password_hash) < 64;