-- ============================================================================
-- Platform Geospatial Functions
-- Reusable PostGIS helpers for cinemas, cities, countries, radius queries, distance calculations.
-- ============================================================================

-- ============================================================================
-- Spatial Index Management
-- ============================================================================

-- Function to create GIST index for geometry columns
CREATE OR REPLACE FUNCTION platform.create_gist_index(
    p_table_name TEXT,
    p_column_name TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_index_name TEXT;
BEGIN
    v_index_name := 'idx_' || p_table_name || '_' || p_column_name || '_gist';
    
    EXECUTE format(
        'CREATE INDEX %I ON %I USING GIST (%I)',
        v_index_name, p_table_name, p_column_name
    );
    
    RAISE NOTICE 'Created GIST index % on %.%', v_index_name, p_table_name, p_column_name;
EXCEPTION
    WHEN duplicate_table THEN
        RAISE NOTICE 'Index % already exists', v_index_name;
END;
$$;

-- Function to create GIST index for geography columns
CREATE OR REPLACE FUNCTION platform.create_geography_index(
    p_table_name TEXT,
    p_column_name TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_index_name TEXT;
BEGIN
    v_index_name := 'idx_' || p_table_name || '_' || p_column_name || '_geography';
    
    EXECUTE format(
        'CREATE INDEX %I ON %I USING GIST (%I)',
        v_index_name, p_table_name, p_column_name
    );
    
    RAISE NOTICE 'Created geography GIST index % on %.%', v_index_name, p_table_name, p_column_name;
EXCEPTION
    WHEN duplicate_table THEN
        RAISE NOTICE 'Index % already exists', v_index_name;
END;
$$;

-- ============================================================================
-- Distance Calculation Functions
-- ============================================================================

-- Function to calculate distance between two points in meters
CREATE OR REPLACE FUNCTION platform.distance_meters(
    p_point1 GEOGRAPHY(POINT, 4326),
    p_point2 GEOGRAPHY(POINT, 4326)
)
RETURNS FLOAT
LANGUAGE sql
IMMUTABLE
AS $$
SELECT ST_Distance(p_point1, p_point2);
$$;

-- Function to calculate distance between two points in kilometers
CREATE OR REPLACE FUNCTION platform.distance_kilometers(
    p_point1 GEOGRAPHY(POINT, 4326),
    p_point2 GEOGRAPHY(POINT, 4326)
)
RETURNS FLOAT
LANGUAGE sql
IMMUTABLE
AS $$
SELECT ST_Distance(p_point1, p_point2) / 1000.0;
$$;

-- Function to calculate distance in miles
CREATE OR REPLACE FUNCTION platform.distance_miles(
    p_point1 GEOGRAPHY(POINT, 4326),
    p_point2 GEOGRAPHY(POINT, 4326)
)
RETURNS FLOAT
LANGUAGE sql
IMMUTABLE
AS $$
SELECT ST_Distance(p_point1, p_point2) / 1609.344;
$$;

-- ============================================================================
-- Radius Search Functions
-- ============================================================================

-- Function to find points within radius in meters
CREATE OR REPLACE FUNCTION platform.points_within_radius(
    p_table_name TEXT,
    p_column_name TEXT,
    p_center_point GEOGRAPHY(POINT, 4326),
    p_radius_meters FLOAT,
    p_limit INT DEFAULT 100
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    location GEOGRAPHY(POINT, 4326),
    distance_meters FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY EXECUTE format(
        'SELECT id, name, %I, ST_Distance(%I, $1) as distance_meters
         FROM %I
         WHERE ST_DWithin(%I, $1, $2)
         ORDER BY %I <-> $1
         LIMIT $3',
        p_column_name, p_column_name, p_table_name, p_column_name, p_column_name, p_limit
    ) USING p_center_point, p_radius_meters;
END;
$$;

-- Function to find points within radius in kilometers
CREATE OR REPLACE FUNCTION platform.points_within_radius_km(
    p_table_name TEXT,
    p_column_name TEXT,
    p_center_point GEOGRAPHY(POINT, 4326),
    p_radius_km FLOAT,
    p_limit INT DEFAULT 100
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    location GEOGRAPHY(POINT, 4326),
    distance_km FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY EXECUTE format(
        'SELECT id, name, %I, ST_Distance(%I, $1) / 1000.0 as distance_km
         FROM %I
         WHERE ST_DWithin(%I, $1, $2 * 1000.0)
         ORDER BY %I <-> $1
         LIMIT $3',
        p_column_name, p_column_name, p_table_name, p_column_name, p_column_name, p_limit
    ) USING p_center_point, p_radius_km;
END;
$$;

-- ============================================================================
-- Bounding Box Functions
-- ============================================================================

-- Function to create bounding box around a point
CREATE OR REPLACE FUNCTION platform.create_bounding_box(
    p_center_point GEOGRAPHY(POINT, 4326),
    p_radius_meters FLOAT
)
RETURNS GEOMETRY(POLYGON, 4326)
LANGUAGE sql
IMMUTABLE
AS $$
SELECT ST_Envelope(
    ST_Buffer(p_center_point::GEOMETRY, p_radius_meters)
);
$$;

-- Function to find points within bounding box
CREATE OR REPLACE FUNCTION platform.points_within_bbox(
    p_table_name TEXT,
    p_column_name TEXT,
    p_min_lat FLOAT,
    p_min_lon FLOAT,
    p_max_lat FLOAT,
    p_max_lon FLOAT,
    p_limit INT DEFAULT 100
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    location GEOGRAPHY(POINT, 4326)
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_bbox GEOMETRY;
BEGIN
    v_bbox := ST_MakeEnvelope(p_min_lon, p_min_lat, p_max_lon, p_max_lat, 4326);
    
    RETURN QUERY EXECUTE format(
        'SELECT id, name, %I
         FROM %I
         WHERE ST_Intersects(%I::GEOMETRY, $1)
         LIMIT $2',
        p_column_name, p_table_name, p_column_name, p_limit
    ) USING v_bbox;
END;
$$;

-- ============================================================================
-- Nearest Neighbor Functions
-- ============================================================================

-- Function to find nearest neighbors
CREATE OR REPLACE FUNCTION platform.nearest_neighbors(
    p_table_name TEXT,
    p_column_name TEXT,
    p_point GEOGRAPHY(POINT, 4326),
    p_limit INT DEFAULT 10
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    location GEOGRAPHY(POINT, 4326),
    distance_meters FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY EXECUTE format(
        'SELECT id, name, %I, ST_Distance(%I, $1) as distance_meters
         FROM %I
         ORDER BY %I <-> $1
         LIMIT $2',
        p_column_name, p_column_name, p_table_name, p_column_name, p_limit
    ) USING p_point;
END;
$$;

-- Function to find k nearest neighbors
CREATE OR REPLACE FUNCTION platform.k_nearest_neighbors(
    p_table_name TEXT,
    p_column_name TEXT,
    p_point GEOGRAPHY(POINT, 4326),
    p_k INT
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    location GEOGRAPHY(POINT, 4326),
    distance_meters FLOAT,
    rank INT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY EXECUTE format(
        'SELECT id, name, %I, ST_Distance(%I, $1) as distance_meters,
         ROW_NUMBER() OVER (ORDER BY %I <-> $1) as rank
         FROM %I
         ORDER BY %I <-> $1
         LIMIT $2',
        p_column_name, p_column_name, p_column_name, p_table_name, p_column_name, p_k
    ) USING p_point;
END;
$$;

-- ============================================================================
-- Geometry Creation Functions
-- ============================================================================

-- Function to create point from lat/lon
CREATE OR REPLACE FUNCTION platform.create_point(
    p_latitude FLOAT,
    p_longitude FLOAT
)
RETURNS GEOGRAPHY(POINT, 4326)
LANGUAGE sql
IMMUTABLE
AS $$
SELECT ST_SetSRID(ST_MakePoint(p_longitude, p_latitude), 4326)::GEOGRAPHY;
$$;

-- Function to create point from address (placeholder for geocoding)
CREATE OR REPLACE FUNCTION platform.geocode_address(p_address TEXT)
RETURNS GEOGRAPHY(POINT, 4326)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- TODO: Integrate with geocoding service (Google Maps, Mapbox, etc.)
    -- For now, return NULL as placeholder
    RETURN NULL::GEOGRAPHY;
END;
$$;

-- ============================================================================
-- Polygon Search Functions
-- ============================================================================

-- Function to find points within polygon
CREATE OR REPLACE FUNCTION platform.points_within_polygon(
    p_table_name TEXT,
    p_column_name TEXT,
    p_polygon GEOMETRY(POLYGON, 4326),
    p_limit INT DEFAULT 100
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    location GEOGRAPHY(POINT, 4326)
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY EXECUTE format(
        'SELECT id, name, %I
         FROM %I
         WHERE ST_Contains($1, %I::GEOMETRY)
         LIMIT $2',
        p_column_name, p_table_name, p_column_name, p_limit
    ) USING p_polygon;
END;
$$;

-- Function to check if point is within polygon
CREATE OR REPLACE FUNCTION platform.point_in_polygon(
    p_point GEOGRAPHY(POINT, 4326),
    p_polygon GEOMETRY(POLYGON, 4326)
)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
AS $$
SELECT ST_Contains(p_polygon, p_point::GEOMETRY);
$$;

-- ============================================================================
-- Area Calculation Functions
-- ============================================================================

-- Function to calculate area of polygon in square meters
CREATE OR REPLACE FUNCTION platform.area_square_meters(p_polygon GEOMETRY(POLYGON, 4326))
RETURNS FLOAT
LANGUAGE sql
IMMUTABLE
AS $$
SELECT ST_Area(p_polygon::GEOGRAPHY);
$$;

-- Function to calculate area of polygon in square kilometers
CREATE OR REPLACE FUNCTION platform.area_square_kilometers(p_polygon GEOMETRY(POLYGON, 4326))
RETURNS FLOAT
LANGUAGE sql
IMMUTABLE
AS $$
SELECT ST_Area(p_polygon::GEOGRAPHY) / 1000000.0;
$$;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON FUNCTION platform.create_gist_index(p_table_name TEXT, p_column_name TEXT) IS 'Create GIST index for geometry columns';
COMMENT ON FUNCTION platform.create_geography_index(p_table_name TEXT, p_column_name TEXT) IS 'Create GIST index for geography columns';
COMMENT ON FUNCTION platform.distance_meters(p_point1 GEOGRAPHY(POINT, 4326), p_point2 GEOGRAPHY(POINT, 4326)) IS 'Calculate distance between two points in meters';
COMMENT ON FUNCTION platform.distance_kilometers(p_point1 GEOGRAPHY(POINT, 4326), p_point2 GEOGRAPHY(POINT, 4326)) IS 'Calculate distance between two points in kilometers';
COMMENT ON FUNCTION platform.distance_miles(p_point1 GEOGRAPHY(POINT, 4326), p_point2 GEOGRAPHY(POINT, 4326)) IS 'Calculate distance between two points in miles';
COMMENT ON FUNCTION platform.points_within_radius(p_table_name TEXT, p_column_name TEXT, p_center_point GEOGRAPHY(POINT, 4326), p_radius_meters FLOAT, p_limit INT) IS 'Find points within radius in meters';
COMMENT ON FUNCTION platform.points_within_radius_km(p_table_name TEXT, p_column_name TEXT, p_center_point GEOGRAPHY(POINT, 4326), p_radius_km FLOAT, p_limit INT) IS 'Find points within radius in kilometers';
COMMENT ON FUNCTION platform.create_bounding_box(p_center_point GEOGRAPHY(POINT, 4326), p_radius_meters FLOAT) IS 'Create bounding box around a point';
COMMENT ON FUNCTION platform.points_within_bbox(p_table_name TEXT, p_column_name TEXT, p_min_lat FLOAT, p_min_lon FLOAT, p_max_lat FLOAT, p_max_lon FLOAT, p_limit INT) IS 'Find points within bounding box';
COMMENT ON FUNCTION platform.nearest_neighbors(p_table_name TEXT, p_column_name TEXT, p_point GEOGRAPHY(POINT, 4326), p_limit INT) IS 'Find nearest neighbors';
COMMENT ON FUNCTION platform.k_nearest_neighbors(p_table_name TEXT, p_column_name TEXT, p_point GEOGRAPHY(POINT, 4326), p_k INT) IS 'Find k nearest neighbors with ranking';
COMMENT ON FUNCTION platform.create_point(p_latitude FLOAT, p_longitude FLOAT) IS 'Create point from lat/lon';
COMMENT ON FUNCTION platform.geocode_address(p_address TEXT) IS 'Create point from address (placeholder for geocoding)';
COMMENT ON FUNCTION platform.points_within_polygon(p_table_name TEXT, p_column_name TEXT, p_polygon GEOMETRY(POLYGON, 4326), p_limit INT) IS 'Find points within polygon';
COMMENT ON FUNCTION platform.point_in_polygon(p_point GEOGRAPHY(POINT, 4326), p_polygon GEOMETRY(POLYGON, 4326)) IS 'Check if point is within polygon';
COMMENT ON FUNCTION platform.area_square_meters(p_polygon GEOMETRY(POLYGON, 4326)) IS 'Calculate area of polygon in square meters';
COMMENT ON FUNCTION platform.area_square_kilometers(p_polygon GEOMETRY(POLYGON, 4326)) IS 'Calculate area of polygon in square kilometers';
