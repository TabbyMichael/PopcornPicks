-- Example queue for recommendations domain
-- Replace with actual pgmq queue definitions

-- Create queue using pgmq
SELECT pgmq.create('recommendations_example_queue');

-- Add comment
COMMENT ON QUEUE recommendations_example_queue IS 'Message queue for recommendations domain operations';

-- Example queue partition (for high-volume queues)
-- SELECT pgmq.create_partitioned('recommendations_example_queue');
