-- Финальное исправление пароля и имени для Марины Севастеевой
UPDATE t_p39732784_hourly_rentals_platf.admins 
SET 
  password_hash = 'f0e4c2f76c58916ec258f246851bea091d14d4247a2fc3e18694461b1816e13b',
  name = 'Севастеева Марина'
WHERE id = 8;