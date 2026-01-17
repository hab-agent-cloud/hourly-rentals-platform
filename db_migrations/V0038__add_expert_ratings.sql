-- Добавляем поля для экспертных оценок
ALTER TABLE t_p39732784_hourly_rentals_platf.listings
ADD COLUMN expert_fullness_rating INTEGER CHECK (expert_fullness_rating >= 1 AND expert_fullness_rating <= 5),
ADD COLUMN expert_fullness_feedback TEXT,
ADD COLUMN expert_rated_by INTEGER REFERENCES t_p39732784_hourly_rentals_platf.admins(id),
ADD COLUMN expert_rated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.listings.expert_fullness_rating IS 'Оценка наполняемости объекта от эксперта (1-5 звезд)';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.listings.expert_fullness_feedback IS 'Обратная связь эксперта по наполняемости объекта';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.listings.expert_rated_by IS 'ID администратора который выставил оценку';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.listings.expert_rated_at IS 'Дата и время выставления экспертной оценки';