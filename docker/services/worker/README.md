# Worker Service

## Purpose
The worker service processes background jobs from PostgreSQL message queues (pgmq). It handles long-running tasks asynchronously without blocking the main application.

## Responsibilities
- Process pgmq message queues
- TMDB data synchronization
- Recommendation generation
- Email sending
- Notification processing
- Data imports
- Analytics calculations
- Cleanup tasks

## Configuration
- **Networks**: backend
- **Dependencies**: postgres
- **Environment Variables**:
  - `NODE_ENV`: development|production
  - `DATABASE_URL`: PostgreSQL connection string
  - `TMDB_API_KEY`: TMDB API key

## Queue Processing
- Monitors multiple pgmq queues
- Processes messages in order
- Implements retry logic with exponential backoff
- Dead letter queue for failed messages
- Graceful shutdown handling

## Job Types
- `tmdb_sync`: Synchronize movie data from TMDB
- `recommendations`: Generate user recommendations
- `notifications`: Send notifications
- `emails`: Send emails
- `imports`: Process data imports
- `analytics`: Calculate analytics
- `cleanup`: Perform cleanup tasks

## Deployment
- Built with multi-stage Dockerfile
- Development: Hot-reload with volume mounts
- Production: Optimized Node.js build

## Scaling
- Horizontal scaling based on queue depth
- Multiple workers can process same queues
- Worker coordination via PostgreSQL

## Monitoring
- Queue depth monitoring
- Job success/failure rates
- Processing time metrics
- Worker health checks

## Error Handling
- Retry with exponential backoff
- Dead letter queue for failed jobs
- Error logging and alerting
- Manual retry capability
