-- Example queue for favorites domain
-- Replace with actual pgmq queue definitions

-- Create queue using pgmq
SELECT pgmq.create('favorites_example_queue');

-- Add comment
COMMENT ON QUEUE favorites_example_queue IS 'Message queue for favorites domain operations';

-- Example queue partition (for high-volume queues)
-- SELECT pgmq.create_partitioned('favorites_example_queue');
