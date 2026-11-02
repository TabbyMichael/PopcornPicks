-- Example queue for administration domain
-- Replace with actual pgmq queue definitions

-- Create queue using pgmq
SELECT pgmq.create('administration_example_queue');

-- Add comment
COMMENT ON QUEUE administration_example_queue IS 'Message queue for administration domain operations';

-- Example queue partition (for high-volume queues)
-- SELECT pgmq.create_partitioned('administration_example_queue');
