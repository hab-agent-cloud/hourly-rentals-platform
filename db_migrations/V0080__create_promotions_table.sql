-- Таблица для хранения акций владельцев
CREATE TABLE IF NOT EXISTS t_p39732784_hourly_rentals_platf.promotions (
  id SERIAL PRIMARY KEY,
  listing_id INTEGER NOT NULL,
  owner_id INTEGER NOT NULL,
  promotion_type VARCHAR(50) NOT NULL,
  discount_percent INTEGER,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  CONSTRAINT valid_discount CHECK (discount_percent IS NULL OR (discount_percent >= 10 AND discount_percent <= 100)),
  CONSTRAINT fk_listing FOREIGN KEY (listing_id) REFERENCES t_p39732784_hourly_rentals_platf.listings(id),
  CONSTRAINT fk_owner FOREIGN KEY (owner_id) REFERENCES t_p39732784_hourly_rentals_platf.owners(id)
);

CREATE INDEX IF NOT EXISTS idx_promotions_listing ON t_p39732784_hourly_rentals_platf.promotions(listing_id);
CREATE INDEX IF NOT EXISTS idx_promotions_active ON t_p39732784_hourly_rentals_platf.promotions(is_active, expires_at);

COMMENT ON TABLE t_p39732784_hourly_rentals_platf.promotions IS 'Акции владельцев для привлечения гостей';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.promotions.promotion_type IS 'hot_offer - горящее предложение, three_for_two - 3 часа в подарок (1+1+подарок)';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.promotions.discount_percent IS 'Процент скидки для hot_offer (минимум 10%)';
COMMENT ON COLUMN t_p39732784_hourly_rentals_platf.promotions.expires_at IS 'Срок действия акции (не может превышать срок подписки)';