-- Установить позиции отелей по городам (начиная с 1 для каждого города)
WITH ranked_listings AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY city ORDER BY id ASC) as new_position
  FROM listings
  WHERE is_archived = FALSE
)
UPDATE listings l
SET auction = rl.new_position
FROM ranked_listings rl
WHERE l.id = rl.id;