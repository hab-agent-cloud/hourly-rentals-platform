-- Привязка всех объектов в Екатеринбурге к владельцу Дмитрия (owner_id=2)
UPDATE listings 
SET owner_id = 2 
WHERE city ILIKE '%Екатеринбург%' AND owner_id IS NULL;