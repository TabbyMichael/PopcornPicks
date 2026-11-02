-- ============================================================================
-- postgis configuration.sql
-- Configure PostGIS for optimal performance.
-- ============================================================================

-- Enable PostGIS raster and topology (optional, uncomment if needed)
-- CREATE EXTENSION IF NOT EXISTS postgis_raster;
-- CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- Recommended GiST index for spatial queries:
--   CREATE INDEX idx_cinema_location_gist
--     ON geospatial.cinema
--     USING gist (location);

-- Common functions:
--   ST_DWithin(geom, geom, distance)  - radius search
--   ST_Distance(geom, geom)           - distance calculation
--   ST_Contains(geom, geom)           - polygon containment
--   ST_Intersects(geom, geom)         - intersection test
--   ST_MakeEnvelope(...)              - bounding box
--   ST_NearestNeighbor(...)          - nearest neighbour