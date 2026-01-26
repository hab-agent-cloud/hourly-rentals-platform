-- Нормализация телефонных номеров: все номера начинаются с 7
UPDATE listings 
SET phone = CASE
    -- Удаляем пробелы в начале и конце
    WHEN phone LIKE ' %' OR phone LIKE '% ' THEN TRIM(phone)
    ELSE phone
END;

UPDATE listings 
SET phone = CASE
    -- Если начинается с 8, заменяем на 7
    WHEN phone LIKE '8%' THEN '7' || SUBSTRING(phone FROM 2)
    -- Если начинается с +7, убираем +
    WHEN phone LIKE '+7%' THEN SUBSTRING(phone FROM 2)
    -- Иначе оставляем как есть
    ELSE phone
END
WHERE phone IS NOT NULL AND phone != '';