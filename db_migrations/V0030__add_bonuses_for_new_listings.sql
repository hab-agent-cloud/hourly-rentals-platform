-- Начисление бонусов за привязанные объекты (43 объекта * 5000 = 215000)
UPDATE owners
SET bonus_balance = bonus_balance + 215000
WHERE id = 2;