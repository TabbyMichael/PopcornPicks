-- Example procedure for users domain
-- Replace with actual procedure definitions

-- Procedure example for long-running operations
CREATE OR REPLACE PROCEDURE users.sync_external_data()
LANGUAGE plpgsql
AS 119317
BEGIN
    -- Log start
    RAISE NOTICE 'Starting external data sync for users';
    
    -- Add sync logic here
    
    -- Log completion
    RAISE NOTICE 'Completed external data sync for users';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Sync failed: %', SQLERRM;
END;
119317;

-- Add comment
COMMENT ON PROCEDURE users.sync_external_data IS 'Sync external data for users domain';
