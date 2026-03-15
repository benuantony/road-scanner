-- Tamil Nadu Bus Routes Database Schema

-- Stops table (Bus stops)
CREATE TABLE stops (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_tamil VARCHAR(255),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    district VARCHAR(100),
    stop_type VARCHAR(20) NOT NULL DEFAULT 'bus', -- 'bus'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for search
CREATE INDEX idx_stops_name ON stops USING gin(to_tsvector('english', name));
CREATE INDEX idx_stops_name_lower ON stops(LOWER(name));

-- Routes table (Bus routes)
CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    route_number VARCHAR(50) NOT NULL,
    route_name VARCHAR(255),
    transport_type VARCHAR(20) NOT NULL, -- 'bus'
    operator VARCHAR(100), -- 'TNSTC', 'SETC', etc.
    frequency_mins INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Route-Stop mapping (ordered stops for each route)
CREATE TABLE route_stops (
    id SERIAL PRIMARY KEY,
    route_id INT NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    stop_id INT NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
    stop_sequence INT NOT NULL,
    distance_from_start DECIMAL(10, 2), -- in kilometers
    arrival_offset_mins INT, -- time from route start
    UNIQUE(route_id, stop_id),
    UNIQUE(route_id, stop_sequence)
);

CREATE INDEX idx_route_stops_route ON route_stops(route_id);
CREATE INDEX idx_route_stops_stop ON route_stops(stop_id);

-- Vehicles table (Buses)
CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_number VARCHAR(50) NOT NULL,
    route_id INT REFERENCES routes(id) ON DELETE SET NULL,
    transport_type VARCHAR(20) NOT NULL DEFAULT 'bus',
    current_stop_id INT REFERENCES stops(id),
    next_stop_id INT REFERENCES stops(id),
    current_latitude DECIMAL(10, 8),
    current_longitude DECIMAL(11, 8),
    progress_percent DECIMAL(5, 2) DEFAULT 0, -- Progress between current and next stop
    status VARCHAR(20) DEFAULT 'running', -- 'running', 'stopped', 'delayed', 'completed'
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vehicles_route ON vehicles(route_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);

-- =====================================================
-- OWNERSHIP & PERMISSIONS
-- Grant ownership to roadscanner user for all tables and sequences
-- This is required because init scripts run as postgres superuser
-- =====================================================

ALTER TABLE stops OWNER TO roadscanner;
ALTER TABLE routes OWNER TO roadscanner;
ALTER TABLE route_stops OWNER TO roadscanner;
ALTER TABLE vehicles OWNER TO roadscanner;

ALTER SEQUENCE stops_id_seq OWNER TO roadscanner;
ALTER SEQUENCE routes_id_seq OWNER TO roadscanner;
ALTER SEQUENCE route_stops_id_seq OWNER TO roadscanner;
ALTER SEQUENCE vehicles_id_seq OWNER TO roadscanner;

-- Grant all privileges to roadscanner user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO roadscanner;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO roadscanner;
