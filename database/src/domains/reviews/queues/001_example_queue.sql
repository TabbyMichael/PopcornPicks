-- Example queue for reviews domain
-- Replace with actual pgmq queue definitions

-- Create queue using pgmq
SELECT pgmq.create('reviews_example_queue');

-- Add comment
COMMENT ON QUEUE reviews_example_queue IS 'Message queue for reviews domain operations';

-- Example queue partition (for high-volume queues)
-- SELECT pgmq.create_partitioned('reviews_example_queue');
