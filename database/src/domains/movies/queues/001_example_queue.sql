-- Example queue for movies domain
-- Replace with actual pgmq queue definitions

-- Create queue using pgmq
SELECT pgmq.create('movies_example_queue');

-- Add comment
COMMENT ON QUEUE movies_example_queue IS 'Message queue for movies domain operations';

-- Example queue partition (for high-volume queues)
-- SELECT pgmq.create_partitioned('movies_example_queue');
