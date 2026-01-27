-- Добавляем новые поля для упрощённой экспертной оценки
ALTER TABLE t_p39732784_hourly_rentals_platf.listings 
ADD COLUMN IF NOT EXISTS expert_description_rating INTEGER CHECK (expert_description_rating >= 1 AND expert_description_rating <= 5);

ALTER TABLE t_p39732784_hourly_rentals_platf.rooms 
ADD COLUMN IF NOT EXISTS expert_description_rating INTEGER CHECK (expert_description_rating >= 1 AND expert_description_rating <= 5);

-- Переносим данные из старых полей в новые (если есть)
UPDATE t_p39732784_hourly_rentals_platf.listings 
SET expert_description_rating = expert_fullness_rating 
WHERE expert_fullness_rating IS NOT NULL AND expert_description_rating IS NULL;

UPDATE t_p39732784_hourly_rentals_platf.rooms 
SET expert_description_rating = expert_fullness_rating 
WHERE expert_fullness_rating IS NOT NULL AND expert_description_rating IS NULL;
