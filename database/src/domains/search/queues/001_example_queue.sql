-- Example queue for search domain
-- Replace with actual pgmq queue definitions

-- Create queue using pgmq
SELECT pgmq.create('search_example_queue');

-- Add comment
COMMENT ON QUEUE search_example_queue IS 'Message queue for search domain operations';

-- Example queue partition (for high-volume queues)
-- SELECT pgmq.create_partitioned('search_example_queue');
