-- Добавление полей для предупреждений о ценах
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS price_warning_holidays BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS price_warning_daytime BOOLEAN DEFAULT FALSE;