-- Example queue for ratings domain
-- Replace with actual pgmq queue definitions

-- Create queue using pgmq
SELECT pgmq.create('ratings_example_queue');

-- Add comment
COMMENT ON QUEUE ratings_example_queue IS 'Message queue for ratings domain operations';

-- Example queue partition (for high-volume queues)
-- SELECT pgmq.create_partitioned('ratings_example_queue');
