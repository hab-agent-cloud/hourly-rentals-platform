-- Миграция данных из rooms в room_categories
INSERT INTO t_p39732784_hourly_rentals_platf.room_categories 
  (listing_id, name, price_per_hour, square_meters, features, image_urls, created_at, updated_at)
SELECT 
  listing_id,
  type as name,
  price as price_per_hour,
  COALESCE(square_meters, 0) as square_meters,
  COALESCE(features, ARRAY[]::text[]) as features,
  COALESCE(images, ARRAY[]::text[]) as image_urls,
  CURRENT_TIMESTAMP as created_at,
  CURRENT_TIMESTAMP as updated_at
FROM t_p39732784_hourly_rentals_platf.rooms
WHERE NOT EXISTS (
  SELECT 1 FROM t_p39732784_hourly_rentals_platf.room_categories rc 
  WHERE rc.listing_id = rooms.listing_id AND rc.name = rooms.type
)
ORDER BY listing_id, id;