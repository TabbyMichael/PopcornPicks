-- Example queue for users domain
-- Replace with actual pgmq queue definitions

-- Create queue using pgmq
SELECT pgmq.create('users_example_queue');

-- Add comment
COMMENT ON QUEUE users_example_queue IS 'Message queue for users domain operations';

-- Example queue partition (for high-volume queues)
-- SELECT pgmq.create_partitioned('users_example_queue');
