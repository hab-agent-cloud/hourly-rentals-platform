-- Добавляем оценку фотографий для объекта (которую выставляет эксперт вручную)
ALTER TABLE t_p39732784_hourly_rentals_platf.listings
ADD COLUMN expert_photo_rating INTEGER CHECK (expert_photo_rating >= 1 AND expert_photo_rating <= 5),
ADD COLUMN expert_photo_feedback TEXT;

COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.listings.expert_photo_rating IS 'Оценка фотографий от эксперта (1-5 звезд)';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.listings.expert_photo_feedback IS 'Обратная связь эксперта по фотографиям';

-- Добавляем экспертные оценки для категорий номеров
ALTER TABLE t_p39732784_hourly_rentals_platf.rooms
ADD COLUMN expert_photo_rating INTEGER CHECK (expert_photo_rating >= 1 AND expert_photo_rating <= 5),
ADD COLUMN expert_photo_feedback TEXT,
ADD COLUMN expert_fullness_rating INTEGER CHECK (expert_fullness_rating >= 1 AND expert_fullness_rating <= 5),
ADD COLUMN expert_fullness_feedback TEXT,
ADD COLUMN expert_rated_by INTEGER REFERENCES t_p39732784_hourly_rentals_platf.admins(id),
ADD COLUMN expert_rated_at TIMESTAMP;

COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.rooms.expert_photo_rating IS 'Оценка фотографий номера от эксперта (1-5 звезд)';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.rooms.expert_photo_feedback IS 'Обратная связь эксперта по фотографиям номера';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.rooms.expert_fullness_rating IS 'Оценка наполняемости номера от эксперта (1-5 звезд)';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.rooms.expert_fullness_feedback IS 'Обратная связь эксперта по наполняемости номера';