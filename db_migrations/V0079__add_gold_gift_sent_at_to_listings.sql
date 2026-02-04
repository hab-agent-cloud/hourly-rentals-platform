-- Добавляем поле для отметки отправки подарка "Пакет Золото"
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS gold_gift_sent_at TIMESTAMP DEFAULT NULL;

COMMENT ON COLUMN listings.gold_gift_sent_at IS 'Дата и время отправки подарка "Пакет Золото на 14 дней" владельцу';
