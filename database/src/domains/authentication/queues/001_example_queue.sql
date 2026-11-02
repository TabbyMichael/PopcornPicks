-- Example queue for authentication domain
-- Replace with actual pgmq queue definitions

-- Create queue using pgmq
SELECT pgmq.create('authentication_example_queue');

-- Add comment
COMMENT ON QUEUE authentication_example_queue IS 'Message queue for authentication domain operations';

-- Example queue partition (for high-volume queues)
-- SELECT pgmq.create_partitioned('authentication_example_queue');
