CREATE TABLE IF NOT EXISTS t_p39732784_hourly_rentals_platf.reviews (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20),
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    manager_response TEXT,
    responded_by INTEGER,
    responded_at TIMESTAMP,
    is_archived BOOLEAN DEFAULT false,
    archived_by INTEGER,
    archived_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reviews_listing_id ON t_p39732784_hourly_rentals_platf.reviews(listing_id);
CREATE INDEX idx_reviews_created_at ON t_p39732784_hourly_rentals_platf.reviews(created_at DESC);
CREATE INDEX idx_reviews_is_archived ON t_p39732784_hourly_rentals_platf.reviews(is_archived);