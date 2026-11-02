-- Example queue for watchlists domain
-- Replace with actual pgmq queue definitions

-- Create queue using pgmq
SELECT pgmq.create('watchlists_example_queue');

-- Add comment
COMMENT ON QUEUE watchlists_example_queue IS 'Message queue for watchlists domain operations';

-- Example queue partition (for high-volume queues)
-- SELECT pgmq.create_partitioned('watchlists_example_queue');
