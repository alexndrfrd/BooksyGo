-- BooksyGo Database Initialization Script
-- This script runs automatically when PostgreSQL container is first created

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- Create schemas for better organization
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS bookings;
CREATE SCHEMA IF NOT EXISTS packages;
CREATE SCHEMA IF NOT EXISTS gamification;
CREATE SCHEMA IF NOT EXISTS analytics;

-- Set default search path
ALTER DATABASE booksygo SET search_path TO public, auth, bookings, packages, gamification, analytics;

-- Create custom types
CREATE TYPE booking_status AS ENUM ('pending', 'payment_processing', 'confirmed', 'completed', 'cancelled', 'refunded');
CREATE TYPE travel_style AS ENUM ('budget', 'comfort', 'luxury');
CREATE TYPE package_type AS ENUM ('adventure', 'luxury', 'budget', 'cultural', 'romantic', 'family', 'solo');
CREATE TYPE user_role AS ENUM ('user', 'premium', 'partner', 'admin');

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON SCHEMA public TO booksygo;
GRANT ALL PRIVILEGES ON SCHEMA auth TO booksygo;
GRANT ALL PRIVILEGES ON SCHEMA bookings TO booksygo;
GRANT ALL PRIVILEGES ON SCHEMA packages TO booksygo;
GRANT ALL PRIVILEGES ON SCHEMA gamification TO booksygo;
GRANT ALL PRIVILEGES ON SCHEMA analytics TO booksygo;

-- Create initial tables for auth schema
CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    date_of_birth DATE,
    profile_picture TEXT,
    role user_role DEFAULT 'user',
    verified_email BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster email lookups
CREATE INDEX idx_users_email ON auth.users(email);
CREATE INDEX idx_users_role ON auth.users(role);

-- Output success message
DO $$
BEGIN
    RAISE NOTICE 'BooksyGo database initialized successfully!';
END $$;

