-- ===================================================
-- Hotel List Management - Database Schema
-- Database: hotel_db
-- ===================================================

CREATE TABLE IF NOT EXISTS hotels (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_path VARCHAR(500) NOT NULL,
    latitude NUMERIC(10,6) NOT NULL,
    longitude NUMERIC(10,6) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for searching and filtering
CREATE INDEX IF NOT EXISTS idx_hotels_title ON hotels(title);
CREATE INDEX IF NOT EXISTS idx_hotels_price ON hotels(price);
